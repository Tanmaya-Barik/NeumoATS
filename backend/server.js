import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { PDFDocument, PDFName, PDFDict } from 'pdf-lib';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-gemini-key'],
  credentials: true
}));
app.use(express.json());

// In-Memory Multer storage: Files never touch disk! Zero-DB, 100% RAM.
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max per PDF
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are supported!'));
    }
  },
});

// Extract clickable URI hyperlinks from PDF Annotations (/Annots -> /A -> /URI)
async function extractEmbeddedPdfLinks(pdfBuffer) {
  const links = [];
  if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) return links;
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const annots = page.node.Annots();
      if (!annots) continue;
      for (let j = 0; j < annots.size(); j++) {
        const annot = pdfDoc.context.lookup(annots.get(j));
        if (annot instanceof PDFDict) {
          const a = pdfDoc.context.lookup(annot.get(PDFName.of('A')));
          if (a instanceof PDFDict) {
            const uri = a.get(PDFName.of('URI'));
            if (uri) {
              const val = uri.value || (uri.asString ? uri.asString() : uri.toString());
              if (val && typeof val === 'string' && val.startsWith('http')) {
                links.push(val.trim());
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('PDF link extraction error:', err.message);
  }
  return [...new Set(links)];
}

// Reconcile Gemini-extracted projects with actual clickable URLs embedded in the PDF
function reconcileProjectLinks(geminiProjects = [], embeddedUrls = []) {
  if (!embeddedUrls || embeddedUrls.length === 0) return geminiProjects || [];

  const candidateProjectUrls = embeddedUrls.filter(url => {
    const u = url.toLowerCase();
    if (u.includes('linkedin.com')) return false;
    if (u.includes('twitter.com') || u.includes('x.com')) return false;
    if (u.includes('instagram.com')) return false;
    // Pure root GitHub user profile without project path
    const githubProfileMatch = u.match(/^https?:\/\/(www\.)?github\.com\/[^\/]+\/?$/);
    if (githubProfileMatch) return false;
    return true;
  });

  if (candidateProjectUrls.length === 0) return geminiProjects || [];

  const usedUrls = new Set();

  const reconciled = (geminiProjects || []).map((proj, idx) => {
    const rawName = (proj.projectName || '').toLowerCase();
    const cleanName = rawName.replace(/[^a-z0-9]/g, '');
    const nameTokens = rawName.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(t => t.length >= 3);

    let bestUrl = null;
    let bestScore = 0;

    for (const url of candidateProjectUrls) {
      if (usedUrls.has(url)) continue;
      const urlClean = url.toLowerCase().replace(/[^a-z0-9]/g, '');
      let score = 0;

      // Direct slug match (e.g. 'neumoats' in 'neumoatsfrontendthreevercelapp')
      if (urlClean.includes(cleanName) || cleanName.includes(urlClean.split('vercel')[0]) || cleanName.includes(urlClean.split('github')[0])) {
        score += 10;
      }

      for (const token of nameTokens) {
        if (urlClean.includes(token)) {
          score += 2;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestUrl = url;
      }
    }

    // Fallback: if there are remaining candidate URLs and counts match 1:1 by order
    if (!bestUrl && candidateProjectUrls[idx] && !usedUrls.has(candidateProjectUrls[idx])) {
      bestUrl = candidateProjectUrls[idx];
    }

    if (bestUrl) {
      usedUrls.add(bestUrl);
      return {
        ...proj,
        liveUrl: bestUrl
      };
    }
    return proj;
  });

  return reconciled;
}

// Deterministic ATS Scoring Formula with Live Project Proof-of-Work Bonus
function computeDeterministicAtsScore(verified = [], unverified = [], missing = [], isSuspicious = false, liveProjectLinks = []) {
  const vCount = (verified || []).length;
  const uCount = (unverified || []).length;
  const mCount = (missing || []).length;
  const total = vCount + uCount + mCount;
  if (total === 0) return 0;

  let baseScore = Math.round(((vCount * 1.0 + uCount * 0.45) / total) * 100);

  // Live Project Proof-of-Work Bonus (+5% per live deployment/project link, max +10%)
  const linkCount = (liveProjectLinks || []).length;
  const liveBonus = Math.min(10, linkCount * 5);

  let rawScore = baseScore + liveBonus;
  if (isSuspicious) {
    rawScore = Math.max(5, rawScore - 30);
  }
  return Math.max(0, Math.min(100, rawScore));
}

// JSON Schema definition for Gemini Structured Outputs
const atsAnalysisSchema = {
  type: 'OBJECT',
  properties: {
    validationStatus: {
      type: 'STRING',
      enum: ['VALID', 'SWAPPED', 'BOTH_RESUMES', 'BOTH_JDS', 'INVALID'],
      description: 'Document classification: VALID (Doc 1 is JD, Doc 2 is Resume), SWAPPED (Doc 1 is Resume, Doc 2 is JD), BOTH_RESUMES, BOTH_JDS, or INVALID.'
    },
    validationMessage: {
      type: 'STRING',
      description: 'Clear user-friendly explanation of validation result, especially if swapped or invalid.'
    },
    candidateName: {
      type: 'STRING',
      description: 'Full name of candidate extracted from resume. If invalid, use "Unknown Candidate".'
    },
    jobTitle: {
      type: 'STRING',
      description: 'Target job title extracted from the Job Description. If invalid, use "Unknown Role".'
    },
    phoneNumber: {
      type: 'STRING',
      description: 'Phone or mobile number if present in resume, otherwise "Not Provided".'
    },
    emailId: {
      type: 'STRING',
      description: 'Email address if present in resume, otherwise "Not Provided".'
    },
    nationality: {
      type: 'STRING',
      description: 'Nationality/citizenship if mentioned or clearly discernible, otherwise "Not Mentioned".'
    },
    socialProfiles: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          platform: { type: 'STRING', description: 'e.g. LinkedIn, GitHub, Instagram, X (Twitter), YouTube, Portfolio, LeetCode, Behance' },
          handleOrUrl: { type: 'STRING', description: 'Handle or URL link' }
        },
        required: ['platform', 'handleOrUrl']
      },
      description: 'All social media accounts, portfolio URLs, or profile handles extracted from the resume.'
    },
    liveProjectLinks: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          projectName: { type: 'STRING', description: 'Name of the project' },
          liveUrl: { type: 'STRING', description: 'Live deployment or repository URL (e.g. Vercel, Netlify, Render, GitHub repo, custom domain, app link)' },
          description: { type: 'STRING', description: 'One-sentence summary of the project and technologies used' }
        },
        required: ['projectName', 'liveUrl']
      },
      description: 'All functional live deployed website/app URLs, demos, or public project repositories extracted from the candidate projects or experience.'
    },
    liveProjectBonus: {
      type: 'INTEGER',
      description: 'Proof-of-work bonus added to ATS score: +5% per detected live project URL (max +10%). 0 if none found.'
    },
    atsScore: {
      type: 'INTEGER',
      description: 'ATS match score from 0 to 100.'
    },
    verifiedSkills: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'All technical skills substantiated with project proof, work experience, or inherent stack prerequisites (e.g. React.js, Node.js, Express.js, MongoDB, TypeScript, JavaScript (ES6+), HTML5, CSS3, JSX, Vite, REST APIs, Socket.io, JWT Authentication, Authentication & Authorization, Client-Server Architecture, Axios, Tailwind CSS, Responsive Web Design, Git, GitHub, Postman, npm, VS Code, Vercel/Render, REST API Testing).'
    },
    unverifiedSkills: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Alternative, secondary, or unused technologies that the candidate listed in their resume but were not utilized in their projects (e.g. MySQL, SQL, PostgreSQL when projects used MongoDB; Bootstrap when projects used Tailwind). STRICT RULE: A skill MUST be physically written in the candidate resume to be here! NEVER put JD requirements here if they are missing from the resume.'
    },
    missingSkills: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'SKILL GAPS: All core skills, frameworks, or technologies required or emphasized by Document 1 (Job Description) that are completely absent from Document 2 (Candidate Resume). For example, if JD requires C# and .NET, and the resume never mentions them, they MUST be listed here.'
    },
    cheatDetection: {
      type: 'OBJECT',
      properties: {
        isSuspicious: {
          type: 'BOOLEAN',
          description: 'True if ATS manipulation tactics (keyword stuffing, hidden white text, verbatim JD copying) are detected.'
        },
        reason: {
          type: 'STRING',
          description: 'Detailed analysis of manipulation tactics found, or confirmation of genuine text structure.'
        }
      },
      required: ['isSuspicious', 'reason']
    },
    applicantFeedback: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: '3 to 4 actionable, highly specific tips for the applicant to bridge skill gaps and boost ATS ranking.'
    },
    recruiterSummary: {
      type: 'STRING',
      description: 'Concise executive hiring recommendation and fit analysis for the recruiter.'
    },
    interviewQuestions: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: '3 targeted technical interview questions probing unverified or missing skills.'
    }
  },
  required: [
    'validationStatus',
    'validationMessage',
    'candidateName',
    'jobTitle',
    'phoneNumber',
    'emailId',
    'nationality',
    'socialProfiles',
    'liveProjectLinks',
    'liveProjectBonus',
    'atsScore',
    'verifiedSkills',
    'unverifiedSkills',
    'missingSkills',
    'cheatDetection',
    'applicantFeedback',
    'recruiterSummary',
    'interviewQuestions'
  ]
};

// Express Router mounting for serverless & standard environments
const apiRouter = express.Router();

// Root API status check
apiRouter.get('/', (req, res, next) => {
  if (req.baseUrl === '' && fs.existsSync(path.join(staticDist, 'index.html'))) {
    return next();
  }
  res.json({
    name: 'NeumoATS API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      analyze: '/api/analyze'
    }
  });
});

// Health and Config Check
apiRouter.get('/health', (req, res) => {
  const hasKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    model: 'gemini-3.5-flash-lite',
    zeroLogin: true,
    zeroDb: true
  });
});

// Primary ATS Analysis Route (supports multipart PDF uploads and virtual PDF JSON payloads)
apiRouter.post(
  '/analyze',
  upload.fields([
    { name: 'jd', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const apiKey = req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          error: 'Gemini API key is required. Please set GEMINI_API_KEY in .env or provide it in the UI.',
        });
      }

      // Check files or body for virtual documents
      const jdFile = req.files?.jd?.[0];
      const resumeFile = req.files?.resume?.[0];
      const jdText = req.body?.jdText;
      const resumeText = req.body?.resumeText;
      const jdName = jdFile?.originalname || req.body?.jdName || 'Job_Description.pdf';
      const resumeName = resumeFile?.originalname || req.body?.resumeName || 'Candidate_Resume.pdf';

      if (!jdFile && !jdText) {
        return res.status(400).json({ error: 'Job Description PDF or content is required.' });
      }
      if (!resumeFile && !resumeText) {
        return res.status(400).json({ error: 'Candidate Resume PDF or content is required.' });
      }

      const prompt = `You are a Deterministic Principal Technical Recruiter and Forensic PDF Auditor.
Inspect PDF Document 1 (JD box) and PDF Document 2 (Resume box).
- Ensure both are valid PDFs (.pdf format) or PDF representations.
- Classify validationStatus: "VALID", "SWAPPED", "BOTH_RESUMES", "BOTH_JDS", or "INVALID".
- Extract complete candidate identity & contact details from the resume:
  1. candidateName: Full name of the applicant.
  2. phoneNumber: Phone/Mobile number if mentioned, otherwise "Not Provided".
  3. emailId: Email address if mentioned, otherwise "Not Provided".
  4. nationality: Nationality/Citizenship if explicitly stated or inferred from address/country code if clear, otherwise "Not Mentioned".
  5. socialProfiles: Extract EVERY single social media ID, handle, or URL mentioned anywhere in the resume (e.g., LinkedIn, GitHub, Instagram, X / Twitter, YouTube, Portfolio Website, LeetCode, Medium, Behance, Kaggle, etc.).
  6. liveProjectLinks: Extract ALL functional live project URLs, deployed application demos (e.g. *.vercel.app, *.netlify.app, *.render.com, *.github.io, custom domains, live apps) and project-specific repository links attached to candidate projects. For each, extract projectName, liveUrl, and brief description.
- EXHAUSTIVE SKILL EXTRACTION & INTELLIGENT RECRUITER VERIFICATION:
  * COMPREHENSIVE RESUME COVERAGE: Extract EVERY SINGLE technical skill, programming language, framework, library, database, protocol, runtime, architecture, and tool mentioned anywhere in Document 2 (Candidate Resume) — across Technologies, Summary, Experience, and Projects.
  * INTELLIGENT RECRUITER VERIFICATION (REAL-WORLD ENGINEERING STANDARDS):
    1. verifiedSkills (Substantiated & Inherent Tech Stack):
       - Direct Project Evidence: Skills explicitly mentioned in projects, work experience, or deployments (e.g. React.js, Node.js, Express.js, MongoDB, TypeScript, REST APIs, Socket.io, JWT Authentication, Axios, Tailwind CSS, Responsive Web Design, Cloudinary, Vite).
       - Inherent Prerequisite & Workflow Verification: As an expert technical recruiter, recognize that you CANNOT build and deploy React, Node, or full-stack web applications without foundational web technologies! Therefore, if a candidate has proven projects in React.js / Frontend / Full-Stack development, foundational technologies listed on their resume — specifically JavaScript (ES6+), HTML5, CSS3, JSX, Authentication & Authorization, Client-Server Architecture, Git, GitHub, Postman, npm, VS Code, Vercel/Render, and REST API Testing — are LEGITIMATELY VERIFIED as integral parts of building, testing, and deploying their applications. Place them in verifiedSkills!
    2. unverifiedSkills (Genuinely Alternative / Unused Claimed Skills):
       - Reserve this strictly for separate, unproven technologies listed in the skills bank that were NOT used in any project.
       - For example: if the candidate's projects used MongoDB, but they listed MySQL, SQL, PostgreSQL, or Bootstrap without building projects with them, those specific alternative databases or unused libraries belong in unverifiedSkills.
       - STRICT NEGATIVE CONSTRAINT: A skill can ONLY be in unverifiedSkills if it physically appears in the resume text!
    3. missingSkills (Skill Gaps):
       - Every requirement demanded by Document 1 (Job Description) that does NOT appear in Document 2 (Resume) at all (e.g. C#, .NET).
       - Placing a missing JD requirement into unverifiedSkills is STRICTLY FORBIDDEN!
- Proof-of-Work Score Boost:
  * Each verified live project deployment link grants a +5% score bonus (capped at max +10% boost).
  * In applicantFeedback and recruiterSummary, explicitly mention if live project links were detected, how many live links were found, and that having working live demo links increased the candidate's ATS score!
- Check resume for white-text stuffing or keyword manipulation (cheatDetection).
- Provide applicantFeedback, recruiterSummary, and 3 targeted interviewQuestions.`;

      const parts = [
        { text: `Analyze PDF JD: "${jdName}" and PDF Resume: "${resumeName}".\n${prompt}` }
      ];

      if (jdFile) {
        parts.push({ text: '### DOCUMENT 1 (Uploaded into Job Description Slot):' });
        parts.push({ inlineData: { data: jdFile.buffer.toString('base64'), mimeType: 'application/pdf' } });
      } else if (jdText) {
        parts.push({ text: `--- DOCUMENT 1 (PDF JD CONTENT: "${jdName}") ---\n${jdText}` });
      }

      if (resumeFile) {
        parts.push({ text: '### DOCUMENT 2 (Uploaded into Candidate Resume Slot):' });
        parts.push({ inlineData: { data: resumeFile.buffer.toString('base64'), mimeType: 'application/pdf' } });
      } else if (resumeText) {
        parts.push({ text: `--- DOCUMENT 2 (PDF RESUME CONTENT: "${resumeName}") ---\n${resumeText}` });
      }

      // Extract genuine clickable hyperlinks directly from resume PDF binary metadata
      let embeddedResumeLinks = [];
      if (resumeFile && resumeFile.buffer) {
        embeddedResumeLinks = await extractEmbeddedPdfLinks(resumeFile.buffer);
      }

      if (embeddedResumeLinks.length > 0) {
        parts.push({
          text: `### CRITICAL EMBEDDED HYPERLINKS EXTRACTED DIRECTLY FROM RESUME PDF ANNOTATIONS:
The candidate's resume PDF physically contains these verified clickable URLs:
${embeddedResumeLinks.map(url => `- ${url}`).join('\n')}

MANDATORY INSTRUCTIONS FOR "liveProjectLinks":
- DO NOT invent, fabricate, or guess GitHub repository links like "https://github.com/username/project"!
- Every project with a live web demo (e.g. *.vercel.app, *.github.io, *.netlify.app, *.render.com) MUST be assigned its EXACT, genuine URL from the embedded list above!
- For example, if the resume has "https://neumo-ats-frontend-three.vercel.app/" or "https://username.github.io/project/", use that exact URL so the links open the actual live web pages!`
        });
      }

      parts.push({
        text: `### CRITICAL MANDATORY INSTRUCTIONS FOR PRINCIPAL RECRUITER EVALUATION:
1. INHERENT & FOUNDATIONAL VERIFICATION:
   - When a candidate demonstrates full-stack React/Node projects with live deployments:
     * JavaScript (ES6+), HTML5, CSS3, JSX, Vite, Axios, Authentication & Authorization, Client-Server Architecture, Git, GitHub, Postman, npm, VS Code, Vercel, Render, and REST API Testing are core, intrinsic parts of that verified stack. Place them in verifiedSkills!
2. GENUINE UNVERIFIED SKILLS:
   - Only place unused alternative tools listed in the resume (such as MySQL, SQL, PostgreSQL, Bootstrap) that were not part of their MERN projects into unverifiedSkills.
3. STRICT SKILL GAPS:
   - Any JD requirement missing from the resume (such as C#, .NET) MUST be in missingSkills (Skill Gap). NEVER put missing JD requirements into unverifiedSkills!`
      });

      const ai = new GoogleGenAI({ apiKey });

      const candidateModels = [
        'gemini-3.5-flash-lite',
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-3.1-flash-lite',
        'gemini-flash-lite-latest',
        'gemini-3-flash-preview',
        'gemini-3.5-flash',
        'gemini-3.8-flash',
        'gemini-flash-latest'
      ];

      let response = null;
      let lastModelError = null;

      for (const model of candidateModels) {
        try {
          console.log(`[NeumoATS] Analyzing with model: ${model}...`);
          response = await ai.models.generateContent({
            model,
            contents: [{ role: 'user', parts }],
            config: {
              temperature: 0,
              topP: 1,
              topK: 1,
              seed: 42,
              responseMimeType: 'application/json',
              responseSchema: atsAnalysisSchema,
            },
          });
          if (response && response.text) {
            console.log(`[NeumoATS] Successfully analyzed documents with: ${model}`);
            break;
          }
        } catch (modelErr) {
          console.warn(`[NeumoATS] Model ${model} failed (${modelErr.message}). Trying fallback...`);
          lastModelError = modelErr;
        }
      }

      if (!response || !response.text) {
        let cleanMsg = lastModelError?.message || 'Unknown error';
        try {
          const parsed = JSON.parse(cleanMsg);
          if (parsed?.error?.message) {
            cleanMsg = parsed.error.message;
          }
        } catch {}
        throw new Error(`All Gemini models failed. Last error: ${cleanMsg}`);
      }

      const text = response.text;
      const parsedData = JSON.parse(text);

      // Reconcile live project links with genuine embedded PDF hyperlink metadata
      if (embeddedResumeLinks.length > 0) {
        parsedData.liveProjectLinks = reconcileProjectLinks(parsedData.liveProjectLinks, embeddedResumeLinks);
      }

      // Compute deterministic ATS score if VALID
      if (parsedData.validationStatus === 'VALID') {
        const linkCount = (parsedData.liveProjectLinks || []).length;
        parsedData.liveProjectBonus = Math.min(10, linkCount * 5);
        parsedData.atsScore = computeDeterministicAtsScore(
          parsedData.verifiedSkills,
          parsedData.unverifiedSkills,
          parsedData.missingSkills,
          parsedData.cheatDetection?.isSuspicious,
          parsedData.liveProjectLinks
        );
      } else {
        parsedData.liveProjectBonus = 0;
        parsedData.atsScore = 0;
      }

      // Attach file metadata for live session tracking
      const finalResult = {
        ...parsedData,
        scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        jdFileName: jdName,
        resumeFileName: resumeName,
        id: 'scan_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      };

      return res.json(finalResult);
    } catch (error) {
      console.error('Error processing ATS analysis:', error);
      return res.status(500).json({
        error: error.message || 'Failed to analyze documents with Gemini AI',
      });
    }
  }
);

// Mount router under BOTH /api and / to handle Vercel rewrites and direct calls seamlessly
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Serve static frontend in production if built
const frontendDist = path.join(__dirname, '../frontend/dist');
const clientDist = path.join(__dirname, '../client/dist');
const staticDist = fs.existsSync(frontendDist) ? frontendDist : clientDist;
if (fs.existsSync(staticDist)) {
  app.use(express.static(staticDist));
}

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/health' || req.path === '/analyze') return next();
  if (fs.existsSync(path.join(staticDist, 'index.html'))) {
    return res.sendFile(path.join(staticDist, 'index.html'));
  }
  return res.status(200).json({
    name: 'NeumoATS API',
    status: 'active',
    health: '/api/health',
    analyze: '/api/analyze'
  });
});

// Start persistent server only outside Vercel Serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`NeumoATS Server running on http://localhost:${PORT}`);
  });
}

export default app;
