import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve static dist paths early
const frontendDist = path.join(__dirname, '../frontend/dist');
const clientDist = path.join(__dirname, '../client/dist');
const staticDist = fs.existsSync(frontendDist) ? frontendDist : clientDist;

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

// Deterministic ATS Scoring Formula
function computeDeterministicAtsScore(verified = [], unverified = [], missing = [], isSuspicious = false) {
  const vCount = (verified || []).length;
  const uCount = (unverified || []).length;
  const mCount = (missing || []).length;
  const total = vCount + uCount + mCount;
  if (total === 0) return 0;

  let rawScore = Math.round(((vCount * 1.0 + uCount * 0.45) / total) * 100);
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
    atsScore: {
      type: 'INTEGER',
      description: 'ATS match score from 0 to 100.'
    },
    verifiedSkills: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Skills explicitly required by the JD AND substantiated with tangible evidence in projects or work history in the resume.'
    },
    unverifiedSkills: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Skills listed in the resume skills section but lacking concrete proof or context in projects or experience.'
    },
    missingSkills: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Key required skills from the JD that do not appear anywhere in the resume.'
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
    model: 'gemini-3-flash-preview',
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
- Cross-examine required skills against candidate projects to classify into verifiedSkills (backed by project evidence), unverifiedSkills (listed in skills section but no project mention), and missingSkills (absent from resume).
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

      const ai = new GoogleGenAI({ apiKey });

      const candidateModels = [
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
        throw new Error(`All Gemini models failed. Last error: ${lastModelError?.message || 'Unknown error'}`);
      }

      const text = response.text;
      const parsedData = JSON.parse(text);

      // Compute deterministic ATS score if VALID
      if (parsedData.validationStatus === 'VALID') {
        parsedData.atsScore = computeDeterministicAtsScore(
          parsedData.verifiedSkills,
          parsedData.unverifiedSkills,
          parsedData.missingSkills,
          parsedData.cheatDetection?.isSuspicious
        );
      } else {
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
