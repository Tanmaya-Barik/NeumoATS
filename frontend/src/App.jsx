import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FileText,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Download,
  UserCheck,
  Briefcase,
  Sparkles,
  ArrowDown,
  Eye,
  Code2,
  Lock,
  Unlock,
  Layers,
  Zap,
  Check,
  XCircle,
  HelpCircle,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Flag,
  Share2,
  Key,
  X,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ============================================================================
// CUSTOM DARK NEUMORPHIC 3D CSS & DESIGN TOKENS (#212529)
// ============================================================================
const NEUMORPHIC_STYLES = `
  :root {
    --bg-primary: #212529;
    --bg-secondary: #262a2e;
  }

  body {
    background-color: #212529 !important;
    color: #e2e8f0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .neu-raised {
    background: #212529;
    box-shadow: 8px 8px 16px #16191c, -8px -8px 16px #2c3136;
    border: 1px solid rgba(255, 255, 255, 0.03);
  }

  .neu-raised-sm {
    background: #212529;
    box-shadow: 4px 4px 8px #16191c, -4px -4px 8px #2c3136;
    border: 1px solid rgba(255, 255, 255, 0.03);
  }

  .neu-inset {
    background: #212529;
    box-shadow: inset 6px 6px 12px #16191c, inset -6px -6px 12px #2c3136;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .neu-inset-sm {
    background: #212529;
    box-shadow: inset 3px 3px 6px #16191c, inset -3px -3px 6px #2c3136;
  }

  .neu-btn {
    background: #212529;
    box-shadow: 6px 6px 12px #16191c, -6px -6px 12px #2c3136;
    border: 1px solid rgba(255, 255, 255, 0.04);
    transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .neu-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 8px 8px 16px #14171a, -8px -8px 16px #2e3338;
    border-color: rgba(56, 189, 248, 0.25);
  }

  .neu-btn:active:not(:disabled), .neu-btn-active {
    transform: translateY(1px);
    box-shadow: inset 4px 4px 8px #16191c, inset -4px -4px 8px #2c3136 !important;
    border-color: rgba(56, 189, 248, 0.4);
  }

  .neu-glow-cyan {
    box-shadow: 8px 8px 16px #16191c, -8px -8px 16px #2c3136, 0 0 15px rgba(56, 189, 248, 0.15);
    border: 1px solid rgba(56, 189, 248, 0.35);
  }

  .neu-glow-crimson {
    box-shadow: 8px 8px 16px #16191c, -8px -8px 16px #2c3136, 0 0 20px rgba(239, 68, 68, 0.2);
    border: 1px solid rgba(239, 68, 68, 0.45);
  }

  .neu-glow-amber {
    box-shadow: 8px 8px 16px #16191c, -8px -8px 16px #2c3136, 0 0 18px rgba(245, 158, 11, 0.2);
    border: 1px solid rgba(245, 158, 11, 0.45);
  }

  /* ==========================================================================
     LUXURY SMOOTH REPORT ENTRY & GAUGE ANIMATIONS (APPLE / LINEAR GRADE)
     ========================================================================== */
  @keyframes reportReveal {
    0% {
      opacity: 0;
      transform: translateY(22px) scale(0.985);
      box-shadow: 0 0 0 rgba(0, 0, 0, 0);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      box-shadow: 10px 10px 24px #14171a, -10px -10px 24px #2c333a;
    }
  }

  .neu-report-morph {
    animation: reportReveal 1.1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
    position: relative;
    border-radius: 24px;
    overflow: hidden;
  }

  /* Elegant Ambient Top Rim Shimmer on Entry */
  .neu-report-morph::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.7), rgba(16, 185, 129, 0.7), transparent);
    pointer-events: none;
    opacity: 0;
    animation: rimGlow 2.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  }

  @keyframes rimGlow {
    0% { opacity: 0; transform: scaleX(0.2); }
    35% { opacity: 1; transform: scaleX(1); }
    100% { opacity: 0.25; transform: scaleX(1); }
  }

  /* Gentle Staggered Slide-Up for Report Sub-sections */
  @keyframes sectionFadeUp {
    0% {
      opacity: 0;
      transform: translateY(14px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .morph-child-1 {
    animation: sectionFadeUp 0.9s cubic-bezier(0.19, 1, 0.22, 1) 0.08s backwards;
  }
  .morph-child-2 {
    animation: sectionFadeUp 0.9s cubic-bezier(0.19, 1, 0.22, 1) 0.18s backwards;
  }
  .morph-child-3 {
    animation: sectionFadeUp 0.9s cubic-bezier(0.19, 1, 0.22, 1) 0.28s backwards;
  }
  .morph-child-4 {
    animation: sectionFadeUp 0.9s cubic-bezier(0.19, 1, 0.22, 1) 0.38s backwards;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #212529;
    box-shadow: inset 2px 2px 4px #16191c;
  }
  ::-webkit-scrollbar-thumb {
    background: #2c3136;
    border-radius: 9999px;
  }
`;

// ============================================================================
// BUILT-IN VIRTUAL PDF PRESETS (Strictly PDF format)
// ============================================================================
const DEMO_PRESETS = {
  STRONG_CANDIDATE: {
    label: 'Strong Match (84% Verified)',
    jd: {
      name: 'Senior_FullStack_MERN_JD.pdf',
      size: 142050,
      type: 'application/pdf',
      isVirtual: true,
      docType: 'JD',
      content: `JOB DESCRIPTION: Senior Full-Stack MERN Engineer\nCompany: FinScale AI Technologies\nRole Overview: We are seeking a Senior Full-Stack Developer proficient in React.js, Node.js, Express, MongoDB, TypeScript, Docker, AWS, and Redis.`
    },
    resume: {
      name: 'Aarav_Sharma_Resume_2026.pdf',
      size: 215400,
      type: 'application/pdf',
      isVirtual: true,
      docType: 'RESUME',
      content: `CANDIDATE RESUME: Aarav Sharma\nPhone: +91 98765 43210 | Email: aarav.sharma.dev@gmail.com | Nationality: Indian\nSocial Links: LinkedIn: linkedin.com/in/aaravsharma-dev | GitHub: github.com/aarav-fullstack | X (Twitter): x.com/aarav_codes | YouTube: youtube.com/@AaravTechTalks | Instagram: instagram.com/aarav.builds\nSKILLS: React.js, Node.js, Express.js, MongoDB, Tailwind CSS, TypeScript, Docker, GraphQL.\nWORK EXPERIENCE:\n1. Software Engineer at CloudNova: Built dashboards using React.js, TypeScript, and Node.js. Used Docker for containerization.`
    }
  },
  WEAK_CANDIDATE: {
    label: 'Low Match (46% Entry-Level)',
    jd: {
      name: 'Senior_FullStack_MERN_JD.pdf',
      size: 142050,
      type: 'application/pdf',
      isVirtual: true,
      docType: 'JD',
      content: `JOB DESCRIPTION: Senior Full-Stack MERN Engineer\nRequired Skills: React.js, Node.js, Express, MongoDB, TypeScript, Docker, AWS, Redis.`
    },
    resume: {
      name: 'Riya_Verma_Junior_CV.pdf',
      size: 184200,
      type: 'application/pdf',
      isVirtual: true,
      docType: 'RESUME',
      content: `CANDIDATE RESUME: Riya Verma\nPhone: +91 87654 32109 | Email: riya.verma24@outlook.com | Nationality: Indian\nLinks: LinkedIn: linkedin.com/in/riyaverma-web | Instagram: instagram.com/riya_designs_ui\nSKILLS: HTML5, CSS3, JavaScript, React.js, Node.js, MongoDB, Python (Mentioned only, no project evidence).\nPROJECTS: Personal Portfolio using HTML and React.js.`
    }
  },
  SWAPPED_MISTAKE: {
    label: 'Simulate Ulta/Swapped Upload Mistake',
    jd: {
      name: 'Vikram_Patel_CV_Final.pdf',
      size: 198000,
      type: 'application/pdf',
      isVirtual: true,
      docType: 'RESUME',
      content: `CANDIDATE RESUME: Vikram Patel\nSKILLS: React.js, Node.js, Express, MongoDB, Docker, AWS.`
    },
    resume: {
      name: 'Job_Description_Backend_Lead.pdf',
      size: 134000,
      type: 'application/pdf',
      isVirtual: true,
      docType: 'JD',
      content: `JOB DESCRIPTION: Full-Stack Engineering Lead. Requirements: React, Node.js, MongoDB.`
    }
  },
  CHEAT_STUFFING: {
    label: 'Simulate White-Text Keyword Cheat',
    jd: {
      name: 'Senior_FullStack_MERN_JD.pdf',
      size: 142050,
      type: 'application/pdf',
      isVirtual: true,
      docType: 'JD',
      content: `JOB DESCRIPTION: Senior Full-Stack MERN Engineer. Required Skills: React, Node.js, MongoDB, Docker.`
    },
    resume: {
      name: 'Kabir_Hack_WhiteText_Resume.pdf',
      size: 265000,
      type: 'application/pdf',
      isVirtual: true,
      docType: 'RESUME',
      content: `CANDIDATE RESUME: Kabir Malhotra\nPhone: +91 91234 56789 | Email: kabir.malhotra@yahoo.com | Nationality: Indian\nLinks: LinkedIn: linkedin.com/in/kabirmalhotra | X: x.com/kabir_dev | YouTube: youtube.com/@KabirVlogs\n[HIDDEN WHITE TEXT FONT-SIZE 1px]: React Node.js Express MongoDB Docker AWS Kubernetes Redis GraphQL.`
    }
  }
};

// ============================================================================
// MERN BACKEND CODE SNIPPETS MODAL
// ============================================================================
const BACKEND_SERVER_CODE = `// backend/server.js
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const bufferToGenerativePart = (buffer, mimeType) => ({
  inlineData: { data: buffer.toString('base64'), mimeType }
});

function computeDeterministicAtsScore(verified = [], unverified = [], missing = [], isSuspicious = false) {
  const vCount = verified.length;
  const uCount = unverified.length;
  const mCount = missing.length;
  const total = vCount + uCount + mCount;
  if (total === 0) return 0;

  let rawScore = Math.round(((vCount * 1.0 + uCount * 0.45) / total) * 100);
  if (isSuspicious) {
    rawScore = Math.max(5, rawScore - 30);
  }
  return Math.max(0, Math.min(100, rawScore));
}

app.post('/api/analyze', upload.fields([
  { name: 'jd', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files?.jd || !req.files?.resume) {
      return res.status(400).json({ error: 'Both JD and Resume PDF files are required.' });
    }

    const jdPart = bufferToGenerativePart(req.files.jd[0].buffer, 'application/pdf');
    const resumePart = bufferToGenerativePart(req.files.resume[0].buffer, 'application/pdf');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: ['Analyze PDF documents and extract all candidate contact details, nationality, and social links.', jdPart, resumePart],
      config: {
        temperature: 0,
        topP: 1,
        topK: 1,
        seed: 42,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            validationStatus: { type: Type.STRING },
            validationMessage: { type: Type.STRING },
            candidateName: { type: Type.STRING },
            jobTitle: { type: Type.STRING },
            phoneNumber: { type: Type.STRING },
            emailId: { type: Type.STRING },
            nationality: { type: Type.STRING },
            socialProfiles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platform: { type: Type.STRING, description: 'e.g. LinkedIn, GitHub, Instagram, X, YouTube, Portfolio, etc.' },
                  handleOrUrl: { type: Type.STRING }
                },
                required: ['platform', 'handleOrUrl']
              }
            },
            atsScore: { type: Type.INTEGER },
            verifiedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            unverifiedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            cheatDetection: {
              type: Type.OBJECT,
              properties: { isSuspicious: { type: Type.BOOLEAN }, reason: { type: Type.STRING } },
              required: ['isSuspicious', 'reason']
            },
            applicantFeedback: { type: Type.ARRAY, items: { type: Type.STRING } },
            recruiterSummary: { type: Type.STRING },
            interviewQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: [
            'validationStatus', 'validationMessage', 'candidateName', 'jobTitle',
            'phoneNumber', 'emailId', 'nationality', 'socialProfiles',
            'atsScore', 'verifiedSkills', 'unverifiedSkills', 'missingSkills',
            'cheatDetection', 'applicantFeedback', 'recruiterSummary', 'interviewQuestions'
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text);
    if (parsed.validationStatus === 'VALID') {
      parsed.atsScore = computeDeterministicAtsScore(
        parsed.verifiedSkills,
        parsed.unverifiedSkills,
        parsed.missingSkills,
        parsed.cheatDetection?.isSuspicious
      );
    }
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'PDF analysis failed.' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));`;

// ============================================================================
// HELPER FUNCTIONS & DETERMINISTIC ENGINE
// ============================================================================
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

function calculateExactFormulaScore(verified = [], unverified = [], missing = [], isSuspicious = false) {
  const vCount = (verified || []).length;
  const uCount = (unverified || []).length;
  const mCount = (missing || []).length;
  const totalSkills = vCount + uCount + mCount;

  if (totalSkills === 0) return 0;

  let computedScore = Math.round(((vCount * 1.0 + uCount * 0.45) / totalSkills) * 100);
  if (isSuspicious) {
    computedScore = Math.max(5, computedScore - 30);
  }
  return Math.max(0, Math.min(100, computedScore));
}

function getPairFingerprint(jdFileObj, resumeFileObj) {
  const jdKey = `${jdFileObj.name}_${jdFileObj.size}_${jdFileObj.lastModified || 'v'}`;
  const resKey = `${resumeFileObj.name}_${resumeFileObj.size}_${resumeFileObj.lastModified || 'v'}`;
  return `${jdKey}:::${resKey}`;
}

// Built-in offline deterministic fallback presets
const OFFLINE_FALLBACK_PRESETS = {
  STRONG_CANDIDATE: {
    validationStatus: 'VALID',
    validationMessage: 'Successfully validated Job Description and Candidate Resume.',
    candidateName: 'Aarav Sharma',
    jobTitle: 'Senior Full-Stack MERN Engineer',
    phoneNumber: '+91 98765 43210',
    emailId: 'aarav.sharma.dev@gmail.com',
    nationality: 'Indian',
    socialProfiles: [
      { platform: 'LinkedIn', handleOrUrl: 'linkedin.com/in/aaravsharma-dev' },
      { platform: 'GitHub', handleOrUrl: 'github.com/aarav-fullstack' },
      { platform: 'X (Twitter)', handleOrUrl: 'x.com/aarav_codes' },
      { platform: 'YouTube', handleOrUrl: 'youtube.com/@AaravTechTalks' },
      { platform: 'Instagram', handleOrUrl: 'instagram.com/aarav.builds' }
    ],
    verifiedSkills: ['React.js', 'Node.js', 'TypeScript', 'Docker', 'Express.js', 'MongoDB'],
    unverifiedSkills: ['Tailwind CSS', 'GraphQL'],
    missingSkills: ['AWS', 'Redis'],
    cheatDetection: {
      isSuspicious: false,
      reason: 'Forensic PDF Audit: Clean text structure, authentic project proof, zero hidden white text.'
    },
    applicantFeedback: [
      'Document quantifiable AWS architecture and deployment details in project bullet points.',
      'Showcase Redis caching and high-concurrency optimizations to eliminate the remaining skill gap.',
      'Highlight microservices and CI/CD pipelines in work experience.'
    ],
    recruiterSummary: 'Aarav Sharma is an accomplished Senior Full-Stack developer with proven mastery of React, TypeScript, Node.js, and Docker in production. Highly recommended for technical interviews.',
    interviewQuestions: [
      'How did you containerize and deploy your CloudNova dashboard using Docker?',
      'Explain your approach to state management and performance tuning in large-scale React and TypeScript dashboards.',
      'How would you integrate Redis caching with Node.js and MongoDB to handle high read loads?'
    ]
  },
  WEAK_CANDIDATE: {
    validationStatus: 'VALID',
    validationMessage: 'Profile analyzed. Identified significant skill gaps for this Senior position.',
    candidateName: 'Riya Verma',
    jobTitle: 'Senior Full-Stack MERN Engineer',
    phoneNumber: '+91 87654 32109',
    emailId: 'riya.verma24@outlook.com',
    nationality: 'Indian',
    socialProfiles: [
      { platform: 'LinkedIn', handleOrUrl: 'linkedin.com/in/riyaverma-web' },
      { platform: 'Instagram', handleOrUrl: 'instagram.com/riya_designs_ui' }
    ],
    verifiedSkills: ['React.js'],
    unverifiedSkills: ['Node.js', 'MongoDB', 'HTML5', 'CSS3', 'JavaScript', 'Python'],
    missingSkills: ['TypeScript', 'Docker', 'AWS', 'Redis', 'Express.js'],
    cheatDetection: {
      isSuspicious: false,
      reason: 'Clean formatting, genuine candidate CV with no manipulation detected.'
    },
    applicantFeedback: [
      'Build and deploy full-stack backend projects using Node.js and Express to substantiate backend skills.',
      'Adopt TypeScript across personal projects to meet modern enterprise frontend standards.',
      'Learn Docker containerization fundamentals and add cloud deployment proof.'
    ],
    recruiterSummary: 'Riya Verma demonstrates junior frontend capabilities with basic React experience, but has significant gaps in backend architecture, TypeScript, Docker, and cloud deployments for a Senior role.',
    interviewQuestions: [
      'Can you explain how component state and side effects are managed in your React portfolio?',
      'What are the core differences between JavaScript and TypeScript?',
      'How do you handle asynchronous operations in Node.js?'
    ]
  },
  SWAPPED_MISTAKE: {
    validationStatus: 'SWAPPED',
    validationMessage: 'Document 1 is a Candidate Resume (Vikram Patel) and Document 2 is a Job Description (Backend Lead). Please click "Fix & Swap Automatically" below.',
    candidateName: 'Vikram Patel',
    jobTitle: 'Full-Stack Engineering Lead',
    phoneNumber: 'Not Provided',
    emailId: 'Not Provided',
    nationality: 'Not Mentioned',
    socialProfiles: [],
    verifiedSkills: [],
    unverifiedSkills: [],
    missingSkills: [],
    cheatDetection: { isSuspicious: false, reason: 'Documents are inverted/swapped.' },
    applicantFeedback: [],
    recruiterSummary: '',
    interviewQuestions: []
  },
  CHEAT_STUFFING: {
    validationStatus: 'VALID',
    validationMessage: 'Audit complete: ATS Manipulation detected.',
    candidateName: 'Kabir Malhotra',
    jobTitle: 'Senior Full-Stack MERN Engineer',
    phoneNumber: '+91 91234 56789',
    emailId: 'kabir.malhotra@yahoo.com',
    nationality: 'Indian',
    socialProfiles: [
      { platform: 'LinkedIn', handleOrUrl: 'linkedin.com/in/kabirmalhotra' },
      { platform: 'X (Twitter)', handleOrUrl: 'x.com/kabir_dev' },
      { platform: 'YouTube', handleOrUrl: 'youtube.com/@KabirVlogs' }
    ],
    verifiedSkills: ['React', 'Node.js'],
    unverifiedSkills: ['Express', 'MongoDB'],
    missingSkills: ['AWS', 'Kubernetes', 'Redis', 'GraphQL'],
    cheatDetection: {
      isSuspicious: true,
      reason: 'Forensic Audit ALERT: Detected microscopic 1px white-text keyword stuffing at bottom of resume containing: React Node.js Express MongoDB Docker AWS Kubernetes Redis GraphQL.'
    },
    applicantFeedback: [
      'Remove hidden text manipulations; modern ATS engines penalize or reject invisible keyword blocks.',
      'Provide genuine project descriptions for technologies instead of stuffing keywords.'
    ],
    recruiterSummary: 'FLAGGED: Candidate resume contains hidden white-text manipulation targeting keyword search algorithms. Extreme caution advised.',
    interviewQuestions: [
      'Can you explain the actual architectural details of your Docker and Kubernetes experience?',
      'How have you used Redis in production caching?'
    ]
  }
};

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function callGeminiMultimodalATS(jdFileObj, resumeFileObj, customApiKey = '') {
  // 1. Try Backend /api/analyze route
  try {
    const formData = new FormData();
    if (jdFileObj.isVirtual) {
      formData.append('jdText', jdFileObj.content);
      formData.append('jdName', jdFileObj.name);
    } else {
      formData.append('jd', jdFileObj);
    }

    if (resumeFileObj.isVirtual) {
      formData.append('resumeText', resumeFileObj.content);
      formData.append('resumeName', resumeFileObj.name);
    } else {
      formData.append('resume', resumeFileObj);
    }

    const headers = {};
    if (customApiKey) {
      headers['x-gemini-key'] = customApiKey;
    }

    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (response.ok) {
      const parsed = await response.json();
      if (parsed.validationStatus === 'VALID') {
        parsed.atsScore = calculateExactFormulaScore(
          parsed.verifiedSkills,
          parsed.unverifiedSkills,
          parsed.missingSkills,
          parsed.cheatDetection?.isSuspicious
        );
      }
      return parsed;
    } else {
      let errorMsg = 'Backend ATS service error';
      try {
        const errJson = await response.json();
        if (errJson?.error) errorMsg = errJson.error;
      } catch {}
      console.warn('Backend API /api/analyze returned error:', response.status, errorMsg);
      const hasClientKey = !!(customApiKey || localStorage.getItem('GEMINI_API_KEY'));
      if (!hasClientKey && !jdFileObj.isVirtual && !resumeFileObj.isVirtual) {
        throw new Error(errorMsg);
      }
    }
  } catch (err) {
    console.warn('Backend API /api/analyze failed, evaluating fallback:', err);
    const hasClientKey = !!(customApiKey || localStorage.getItem('GEMINI_API_KEY'));
    if (!hasClientKey && !jdFileObj.isVirtual && !resumeFileObj.isVirtual && err?.message && !err.message.includes('fetch')) {
      throw err;
    }
  }

  // 2. Direct Gemini Call if client API Key is present
  const apiKey = customApiKey || localStorage.getItem('GEMINI_API_KEY') || '';
  if (apiKey) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const systemInstruction = `You are a Deterministic Principal Technical Recruiter and Forensic PDF Auditor.
Inspect PDF Document 1 (JD box) and PDF Document 2 (Resume box).
- Ensure both are valid PDFs (.pdf format).
- Classify validationStatus: "VALID", "SWAPPED", "BOTH_RESUMES", "BOTH_JDS", or "INVALID".
- Extract complete candidate identity & contact details from the resume:
  1. candidateName: Full name of the applicant.
  2. phoneNumber: Phone/Mobile number if mentioned, otherwise "Not Provided".
  3. emailId: Email address if mentioned, otherwise "Not Provided".
  4. nationality: Nationality/Citizenship if explicitly stated or inferred from address/country code if clear, otherwise "Not Mentioned".
  5. socialProfiles: Extract EVERY single social media ID, handle, or URL mentioned anywhere in the resume (e.g., LinkedIn, GitHub, Instagram, X / Twitter, YouTube, Portfolio Website, LeetCode, Medium, Behance, Kaggle, etc.).
- Cross-examine required skills against candidate projects to classify into verifiedSkills (backed by project evidence), unverifiedSkills (listed in skills section but no project mention), and missingSkills (absent from resume).
- Check resume for white-text stuffing or keyword manipulation (cheatDetection).
- Provide applicantFeedback or recruiterSummary & interviewQuestions.`;

      const parts = [{ text: `Analyze PDF JD: "${jdFileObj.name}" and PDF Resume: "${resumeFileObj.name}".` }];

      if (jdFileObj.isVirtual) {
        parts.push({ text: `--- PDF JD CONTENT ---\n${jdFileObj.content}` });
      } else {
        parts.push({ inlineData: { mimeType: 'application/pdf', data: await fileToBase64(jdFileObj) } });
      }

      if (resumeFileObj.isVirtual) {
        parts.push({ text: `--- PDF RESUME CONTENT ---\n${resumeFileObj.content}` });
      } else {
        parts.push({ inlineData: { mimeType: 'application/pdf', data: await fileToBase64(resumeFileObj) } });
      }

      const payload = {
        contents: [{ role: 'user', parts }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          temperature: 0,
          topP: 1,
          topK: 1,
          seed: 42,
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              validationStatus: { type: 'STRING', enum: ['VALID', 'SWAPPED', 'BOTH_RESUMES', 'BOTH_JDS', 'INVALID'] },
              validationMessage: { type: 'STRING' },
              candidateName: { type: 'STRING' },
              jobTitle: { type: 'STRING' },
              phoneNumber: { type: 'STRING' },
              emailId: { type: 'STRING' },
              nationality: { type: 'STRING' },
              socialProfiles: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    platform: { type: 'STRING' },
                    handleOrUrl: { type: 'STRING' }
                  },
                  required: ['platform', 'handleOrUrl']
                }
              },
              atsScore: { type: 'INTEGER' },
              verifiedSkills: { type: 'ARRAY', items: { type: 'STRING' } },
              unverifiedSkills: { type: 'ARRAY', items: { type: 'STRING' } },
              missingSkills: { type: 'ARRAY', items: { type: 'STRING' } },
              cheatDetection: {
                type: 'OBJECT',
                properties: { isSuspicious: { type: 'BOOLEAN' }, reason: { type: 'STRING' } },
                required: ['isSuspicious', 'reason']
              },
              applicantFeedback: { type: 'ARRAY', items: { type: 'STRING' } },
              recruiterSummary: { type: 'STRING' },
              interviewQuestions: { type: 'ARRAY', items: { type: 'STRING' } }
            },
            required: [
              'validationStatus', 'validationMessage', 'candidateName', 'jobTitle',
              'phoneNumber', 'emailId', 'nationality', 'socialProfiles',
              'atsScore', 'verifiedSkills', 'unverifiedSkills', 'missingSkills',
              'cheatDetection', 'applicantFeedback', 'recruiterSummary', 'interviewQuestions'
            ]
          }
        }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      const rawJson = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawJson) {
        const parsed = JSON.parse(rawJson);
        if (parsed.validationStatus === 'VALID') {
          parsed.atsScore = calculateExactFormulaScore(
            parsed.verifiedSkills,
            parsed.unverifiedSkills,
            parsed.missingSkills,
            parsed.cheatDetection?.isSuspicious
          );
        }
        return parsed;
      }
    } catch (directErr) {
      console.warn('Direct Gemini API call failed:', directErr);
    }
  }

  // 3. Fallback for built-in virtual test presets (ensures instant demo never breaks)
  if (jdFileObj.name === 'Vikram_Patel_CV_Final.pdf' || resumeFileObj.name === 'Job_Description_Backend_Lead.pdf') {
    return { ...OFFLINE_FALLBACK_PRESETS.SWAPPED_MISTAKE };
  }
  if (resumeFileObj.name === 'Kabir_Hack_WhiteText_Resume.pdf') {
    const data = { ...OFFLINE_FALLBACK_PRESETS.CHEAT_STUFFING };
    data.atsScore = calculateExactFormulaScore(data.verifiedSkills, data.unverifiedSkills, data.missingSkills, true);
    return data;
  }
  if (resumeFileObj.name === 'Riya_Verma_Junior_CV.pdf') {
    const data = { ...OFFLINE_FALLBACK_PRESETS.WEAK_CANDIDATE };
    data.atsScore = calculateExactFormulaScore(data.verifiedSkills, data.unverifiedSkills, data.missingSkills, false);
    return data;
  }
  if (resumeFileObj.name === 'Aarav_Sharma_Resume_2026.pdf') {
    const data = { ...OFFLINE_FALLBACK_PRESETS.STRONG_CANDIDATE };
    data.atsScore = calculateExactFormulaScore(data.verifiedSkills, data.unverifiedSkills, data.missingSkills, false);
    return data;
  }

  throw new Error('Analysis failed. Please ensure the backend server is running or provide a Gemini API key.');
}

// ============================================================================
// 3D NEUMORPHIC CIRCULAR GAUGE (LUXURY SMOOTH METRIC COUNTER)
// ============================================================================
function NeumorphicCircularGauge({ score }) {
  const radius = 66;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score || 0));

  const [animatedScore, setAnimatedScore] = useState(0);
  const prevScoreRef = useRef(0);
  const [hasSettled, setHasSettled] = useState(false);

  useEffect(() => {
    setHasSettled(false);

    const startVal = prevScoreRef.current;
    const targetVal = clampedScore;
    const diff = targetVal - startVal;

    let startTime = null;
    let animationFrameId;
    // 2.0s duration with steady, readable deceleration
    const duration = 2000;

    // Classic ease-out cubic: smooth momentum that decelerates gently
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easedProgress = easeOutCubic(progress);
      const currentVal = startVal + diff * easedProgress;

      setAnimatedScore(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setAnimatedScore(targetVal);
        prevScoreRef.current = targetVal;
        setHasSettled(true);
        if (targetVal >= 75) {
          try {
            confetti({
              particleCount: 28,
              spread: 60,
              origin: { y: 0.65 },
              colors: ['#10b981', '#38bdf8', '#fbbf24']
            });
          } catch (e) {
            // ignore if confetti fails
          }
        }
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [clampedScore]);

  const currentDisplay = Math.round(animatedScore);
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  let strokeColor = '#ef4444';
  let strokeGradientStart = '#f87171';
  let badgeLabel = 'High Skill Gap';
  let glowColor = 'rgba(239, 68, 68, 0.35)';
  let auraBg = 'rgba(239, 68, 68, 0.14)';

  if (clampedScore >= 75) {
    strokeColor = '#10b981';
    strokeGradientStart = '#34d399';
    badgeLabel = 'Strong Match';
    glowColor = 'rgba(16, 185, 129, 0.35)';
    auraBg = 'rgba(16, 185, 129, 0.14)';
  } else if (clampedScore >= 50) {
    strokeColor = '#f59e0b';
    strokeGradientStart = '#fbbf24';
    badgeLabel = 'Moderate Match';
    glowColor = 'rgba(245, 158, 11, 0.35)';
    auraBg = 'rgba(245, 158, 11, 0.14)';
  }

  return (
    <div className="flex flex-col items-center justify-center relative select-none py-2">
      {/* Centered Ambient Breathing Glow - Pure Circle, No Distortion */}
      <div
        className="absolute w-52 h-52 rounded-full pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${auraBg} 0%, rgba(33, 37, 41, 0) 70%)`,
          filter: 'blur(20px)',
          opacity: hasSettled ? 0.75 : 0.95,
        }}
      />

      {/* Main Outer Raised Neumorphic Disc - Pure Circular Geometry */}
      <div
        className="relative w-48 h-48 rounded-full neu-raised flex items-center justify-center p-3.5 transition-shadow duration-700"
        style={{
          boxShadow: hasSettled
            ? `8px 8px 18px #14171a, -8px -8px 18px #2e3338, 0 0 22px ${glowColor}`
            : '8px 8px 16px #16191c, -8px -8px 16px #2c3136',
        }}
      >
        {/* Recessed Inset Track */}
        <div className="w-full h-full rounded-full neu-inset flex items-center justify-center relative overflow-hidden">
          <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 170 170">
            <defs>
              <linearGradient id="scoreArcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={strokeGradientStart} />
                <stop offset="100%" stopColor={strokeColor} />
              </linearGradient>
              <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={strokeColor} floodOpacity="0.7" />
              </filter>
            </defs>

            {/* Background Track Circle */}
            <circle cx="85" cy="85" r={radius} stroke="#181b1e" strokeWidth="12" fill="transparent" />

            {/* Inset Texture Ring */}
            <circle cx="85" cy="85" r={radius} stroke="rgba(255, 255, 255, 0.04)" strokeWidth="12" fill="transparent" strokeDasharray="3 5" />

            {/* Animated Smooth Progress Arc */}
            <circle
              cx="85"
              cy="85"
              r={radius}
              stroke="url(#scoreArcGradient)"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              filter="url(#arcGlow)"
            />
          </svg>

          {/* Center 3D Tactile Plate with Smooth Elevation */}
          <div className="absolute w-24 h-24 rounded-full neu-raised flex flex-col items-center justify-center text-center border border-white/5 shadow-[5px_5px_12px_#14171a,-5px_-5px_12px_#2c3238]">
            <div className="flex items-baseline justify-center">
              <span
                className="text-3xl font-black tracking-tight"
                style={{
                  color: strokeColor,
                  textShadow: `0 0 10px ${strokeColor}50`
                }}
              >
                {currentDisplay}
              </span>
              <span className="text-base font-bold ml-0.5" style={{ color: strokeColor }}>%</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: strokeColor }} />
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">ATS Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Status Badge with Smooth Fade */}
      <div
        className="mt-3.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide neu-raised-sm flex items-center gap-2 transition-all duration-500"
        style={{
          color: strokeColor,
          borderColor: `${strokeColor}30`,
          boxShadow: `0 0 14px ${strokeColor}20`
        }}
      >
        <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: strokeColor }} />
        <span>{badgeLabel}</span>
      </div>
    </div>
  );
}

// ============================================================================
// PLATFORM FEATURES SHOWCASE DATA
// ============================================================================
const FEATURES_SHOWCASE = [
  {
    id: 'deterministic_scoring',
    title: 'Deterministic ATS Match Engine',
    shortLabel: 'Deterministic Scoring',
    icon: CheckCircle2,
    badge: '100% Mathematical Proof',
    badgeColor: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
    btnTextColor: 'text-emerald-400',
    iconColor: 'text-emerald-400',
    description: 'Eliminates generative AI hallucinations and score drift. Applies an exact, deterministic mathematical formula directly against verified, unverified, and missing skill sets. Repeating evaluations on the same PDF files will always yield identical, reliable results.',
    formula: 'ATS Score = Math.round(((VerifiedSkills × 1.0 + UnverifiedSkills × 0.45) / TotalSkills) × 100) - (30 if Suspicious)',
    keyPoints: [
      'Verified Skills (100% weight): Concrete project experience, quantifiable metrics, and verified production code.',
      'Unverified Skills (45% weight): Mentioned in resume summary but lacking contextual project proof.',
      '3D Circular Gauge: Real-time SVG stroke calculation with green (≥75%), amber (≥50%), and red (<50%) tiers.'
    ]
  },
  {
    id: 'skill_matrix',
    title: '3-Column Skill Evidence Matrix',
    shortLabel: 'Skill Evidence Matrix',
    icon: Layers,
    badge: 'Contextual Proof Check',
    badgeColor: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
    btnTextColor: 'text-amber-400',
    iconColor: 'text-amber-400',
    description: 'Moves far beyond naive keyword matching. The multimodal parser performs a deep cross-examination between the technical demands of the Job Description and the actual project achievements in the candidate CV, sorting every required skill into three transparent pillars.',
    keyPoints: [
      'Verified Skills: Tangible project bullet points, internships, or production responsibilities proving real capability.',
      'Unverified Skills: Keywords listed in a skills bank but never mentioned or proven in actual work history.',
      'Missing Skills (Skill Gap): Core stack technologies demanded by the JD that are completely missing from the CV.'
    ]
  },
  {
    id: 'auto_swap',
    title: 'Auto-Swap Mistake Detector',
    shortLabel: 'Auto-Swap Detector',
    icon: RefreshCw,
    badge: 'Document Inversion Guard',
    badgeColor: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
    btnTextColor: 'text-sky-400',
    iconColor: 'text-sky-400',
    description: 'Recognizes common human errors during high-volume recruitment. Automatically senses when an applicant or recruiter inadvertently uploads the Candidate Resume into the JD box and the Job Description into the Resume box.',
    keyPoints: [
      'Zero Corrupted Records: Halts processing immediately so invalid, inverted scans never enter session history.',
      '1-Click Swap & Fix: Provides a single button to auto-invert both documents into their correct slots and re-run.',
      'Semantic Intent Parsing: Reads actual document structure rather than just file names to determine document type.'
    ]
  },
  {
    id: 'cheat_shield',
    title: 'Forensic Cheat & White-Text Shield',
    shortLabel: 'Forensic Cheat Shield',
    icon: ShieldAlert,
    badge: 'Anti-Gaming Defense',
    badgeColor: 'text-rose-400 border-rose-400/30 bg-rose-400/10',
    btnTextColor: 'text-rose-400',
    iconColor: 'text-rose-400',
    description: 'Conducts a forensic PDF audit to detect modern applicant manipulation tactics intended to game standard ATS search engines, such as microscopic 1px font sizes, hidden white text on white backgrounds, and verbatim copying of the Job Description.',
    keyPoints: [
      'Microscopic & Hidden Font Auditing: Flags invisible keyword blocks inserted to artificially inflate match scores.',
      'Verbatim Copy-Paste Trap: Detects entire sentences or bullet points plagiarized directly from the Job Description.',
      'Strict Penalty Deduction: Flags the profile as SUSPICIOUS and penalizes the ATS score by 30 points.'
    ]
  },
  {
    id: 'contact_dossier',
    title: 'Candidate Dossier & Social Scanner',
    shortLabel: 'Contact & Social Dossier',
    icon: Share2,
    badge: 'Identity Extraction',
    badgeColor: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
    btnTextColor: 'text-purple-400',
    iconColor: 'text-purple-400',
    description: 'Instantly extracts candidate contact identity, country/nationality, and all public social/portfolio footprints across platforms like LinkedIn, GitHub, X (Twitter), YouTube, Instagram, Behance, and portfolio websites into a unified recruiter dossier.',
    keyPoints: [
      'Core Contact Dossier: Phone number, email address, and inferred nationality parsed into structured cards.',
      'Multi-Platform Profile Handles: Direct clickable external links with platform-specific branding badges.',
      'Zero Manual Sifting: Recruiters can inspect GitHub repos, LinkedIn history, and YouTube tech talks in one click.'
    ]
  }
];

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  const [role, setRole] = useState('recruiter');
  const [activeFeature, setActiveFeature] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [jdLocked, setJdLocked] = useState(false);
  const [resumeLocked, setResumeLocked] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);

  const [sessionHistory, setSessionHistory] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); // Descending default
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customKey, setCustomKey] = useState(() => localStorage.getItem('GEMINI_API_KEY') || '');
  const [serverHasKey, setServerHasKey] = useState(false);

  const jdInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const fingerprintCacheRef = useRef({});

  const checkBackendHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
      if (res.ok) {
        const data = await res.json();
        setServerHasKey(Boolean(data.hasApiKey));
        return Boolean(data.hasApiKey);
      } else {
        setServerHasKey(false);
      }
    } catch {
      setServerHasKey(false);
    }
    return false;
  }, []);

  useEffect(() => {
    checkBackendHealth();

    // Heartbeat every 15s to keep status fresh
    const interval = setInterval(checkBackendHealth, 15000);

    // Recheck immediately when window regains focus
    const handleFocus = () => checkBackendHealth();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkBackendHealth]);

  const handleClearUnlockedFiles = () => {
    if (!jdLocked && jdFile) {
      setJdFile(null);
      if (jdInputRef.current) jdInputRef.current.value = '';
    }
    if (!resumeLocked && resumeFile) {
      setResumeFile(null);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
    }
    setValidationError(null);
  };

  const handleFileSelection = (file, type) => {
    if (!file) return;
    if (type === 'jd' && jdLocked) {
      setValidationError({
        status: 'LOCKED_CARD',
        message: 'Job Description card is locked. Click the "Locked" button to unlock before replacing this file.'
      });
      return;
    }
    if (type === 'resume' && resumeLocked) {
      setValidationError({
        status: 'LOCKED_CARD',
        message: 'Candidate Resume card is locked. Click the "Locked" button to unlock before replacing this file.'
      });
      return;
    }
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setValidationError({
        status: 'INVALID_FORMAT',
        message: `Invalid file format ("${file.name}"). Only PDF documents (.pdf) are allowed for upload.`
      });
      return;
    }
    setValidationError(null);
    if (type === 'jd') setJdFile(file);
    if (type === 'resume') setResumeFile(file);
  };

  const executeAnalysis = async (customJd = jdFile, customResume = resumeFile) => {
    if (!customJd || !customResume) {
      setValidationError({
        status: 'MISSING_FILES',
        message: 'Please upload both Job Description PDF and Candidate Resume PDF.'
      });
      return;
    }

    setIsAnalyzing(true);
    setValidationError(null);

    try {
      checkBackendHealth().catch(() => {});
      const pairKey = getPairFingerprint(customJd, customResume);
      let aiData = fingerprintCacheRef.current[pairKey] || (await callGeminiMultimodalATS(customJd, customResume, customKey));
      fingerprintCacheRef.current[pairKey] = aiData;

      if (aiData.validationStatus !== 'VALID') {
        setValidationError({ status: aiData.validationStatus, message: aiData.validationMessage });
        setIsAnalyzing(false);
        return;
      }

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setSessionHistory((prev) => {
        const existingIdx = prev.findIndex((item) => item.pairKey === pairKey);
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            scannedAt: timestamp,
            scanCount: (updated[existingIdx].scanCount || 1) + 1,
            animKey: Date.now(),
            ...aiData
          };
          setCurrentResult(updated[existingIdx]);
          return updated;
        }

        const newEntry = {
          id: Date.now(),
          animKey: Date.now(),
          pairKey,
          jdFileName: customJd.name,
          resumeFileName: customResume.name,
          scannedAt: timestamp,
          scanCount: 1,
          ...aiData
        };
        setCurrentResult(newEntry);
        return [...prev, newEntry];
      });
    } catch (err) {
      const userMessage = err?.message && !err.message.includes('object Object')
        ? err.message
        : 'PDF analysis failed. Please verify files or Gemini API key and try again.';
      setValidationError({ status: 'API_ERROR', message: userMessage });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSmartSwapAndAnalyze = () => {
    if (!jdFile || !resumeFile) return;
    const tempJd = jdFile;
    const tempResume = resumeFile;
    setJdFile(tempResume);
    setResumeFile(tempJd);
    setValidationError(null);
    executeAnalysis(tempResume, tempJd);
  };

  const handleLoadPreset = (presetKey) => {
    const preset = DEMO_PRESETS[presetKey];
    if (!preset) return;
    setJdFile(preset.jd);
    setResumeFile(preset.resume);
    setValidationError(null);
    executeAnalysis(preset.jd, preset.resume);
  };

  const sortedSessionHistory = [...sessionHistory].sort((a, b) =>
    sortOrder === 'desc' ? b.atsScore - a.atsScore : a.atsScore - b.atsScore
  );

  const handleDownloadCSV = () => {
    if (sortedSessionHistory.length === 0) return;
    const headers = [
      'Rank', 'Candidate Name', 'Phone Number', 'Email ID', 'Nationality',
      'Social & Portfolio IDs', 'Target Role', 'ATS Score (%)', 'Verified', 'Unverified', 'Missing', 'Cheat Flag', 'Time'
    ];
    const rows = sortedSessionHistory.map((item, idx) => {
      const socials = (item.socialProfiles || []).map((s) => `${s.platform}: ${s.handleOrUrl}`).join(' | ') || 'None';
      return [
        idx + 1,
        `"${item.candidateName || 'Candidate'}"`,
        `"${item.phoneNumber || 'Not Provided'}"`,
        `"${item.emailId || 'Not Provided'}"`,
        `"${item.nationality || 'Not Mentioned'}"`,
        `"${socials}"`,
        `"${item.jobTitle || 'Role'}"`,
        item.atsScore,
        (item.verifiedSkills || []).length,
        (item.unverifiedSkills || []).length,
        (item.missingSkills || []).length,
        item.cheatDetection?.isSuspicious ? 'FLAGGED' : 'CLEAN',
        `"${item.scannedAt}"`
      ];
    });
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = 'Recruiter_PDF_Leaderboard_Descending.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to get platform badge color
  const getPlatformStyle = (platform = '') => {
    const p = platform.toLowerCase();
    if (p.includes('linkedin')) return 'text-sky-400 border-sky-400/20';
    if (p.includes('github')) return 'text-slate-200 border-slate-400/20';
    if (p.includes('youtube') || p.includes('yt')) return 'text-rose-400 border-rose-400/20';
    if (p.includes('insta')) return 'text-pink-400 border-pink-400/20';
    if (p.includes('x') || p.includes('twitter')) return 'text-cyan-300 border-cyan-400/20';
    return 'text-emerald-400 border-emerald-400/20';
  };

  return (
    <div className="min-h-screen bg-[#212529] text-[#e2e8f0] pb-20 selection:bg-sky-500/30 selection:text-sky-200">
      <style>{NEUMORPHIC_STYLES}</style>

      {/* TOP BAR */}
      <header className="sticky top-0 z-30 bg-[#212529]/95 backdrop-blur-md border-b border-white/5 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl neu-raised flex items-center justify-center text-sky-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-100">
                  NeumoATS <span className="text-sky-400">PDF Suite</span>
                </h1>
                <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full neu-inset text-emerald-400">
                  PDF Only • RAM Only
                </span>
              </div>
              <p className="text-xs text-slate-400">Deterministic Multimodal PDF Parser & ATS Analyzer</p>
            </div>
          </div>

          <div className="neu-inset p-1.5 rounded-2xl flex items-center gap-2">
            <button
              onClick={() => setRole('applicant')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                role === 'applicant' ? 'neu-raised text-sky-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Applicant Mode
            </button>
            <button
              onClick={() => setRole('recruiter')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                role === 'recruiter' ? 'neu-raised text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Recruiter Mode
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowKeyModal(true)}
              className="neu-btn px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-emerald-400 flex items-center gap-2"
              title="API Key Configuration"
            >
              <span className="relative flex h-2.5 w-2.5">
                {serverHasKey || customKey ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_10px_#34d399]"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 shadow-[0_0_8px_#fbbf24]"></span>
                )}
              </span>
              <Key className={`w-3.5 h-3.5 ${serverHasKey || customKey ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="hidden sm:inline font-medium">
                {serverHasKey ? 'Server Key Active' : customKey ? 'Custom Key' : 'API Key'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-8">
        {/* FEATURES SHOWCASE */}
        <section className="neu-raised rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl neu-inset text-sky-400">
                <Sparkles className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">
                    Features Showcase
                  </h3>
                  <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full neu-inset text-sky-400">
                    Explore Architecture
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any feature card below to inspect its algorithms, forensic rules, and architecture
                </p>
              </div>
            </div>

            {/* Feature Selector Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              {FEATURES_SHOWCASE.map((feat) => {
                const IconComponent = feat.icon;
                const isActive = activeFeature === feat.id;
                return (
                  <button
                    key={feat.id}
                    onClick={() => setActiveFeature(isActive ? null : feat.id)}
                    className={`neu-btn px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'neu-btn-active text-sky-400 border-sky-400/40 shadow-inner'
                        : `${feat.btnTextColor} hover:text-slate-100`
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{feat.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expanded Feature Description Card */}
          {activeFeature && (() => {
            const feat = FEATURES_SHOWCASE.find((f) => f.id === activeFeature);
            if (!feat) return null;
            const Icon = feat.icon;
            return (
              <div className="neu-inset rounded-2xl p-5 sm:p-6 space-y-4 border border-white/5 animate-fadeIn">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`p-3 rounded-2xl neu-raised ${feat.iconColor} shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h4 className="text-base font-bold text-slate-100">{feat.title}</h4>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${feat.badgeColor}`}>
                          {feat.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed max-w-4xl">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveFeature(null)}
                    className="neu-btn p-2 rounded-xl text-slate-400 hover:text-slate-200 shrink-0"
                    title="Close description"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mathematical Formula (for Deterministic ATS) */}
                {feat.formula && (
                  <div className="neu-raised-sm rounded-xl p-3 bg-black/20 border border-white/5">
                    <div className="text-[10px] uppercase tracking-wider font-mono text-emerald-400 font-bold mb-1">
                      Scoring Formula (Zero Hallucination)
                    </div>
                    <code className="text-xs text-sky-300 font-mono block break-all">
                      {feat.formula}
                    </code>
                  </div>
                )}

                {/* Technical Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {feat.keyPoints.map((point, idx) => (
                    <div key={idx} className="neu-raised-sm rounded-xl p-3 flex items-start gap-2.5 border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300 leading-snug">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </section>

        {/* UPLOAD PLACEHOLDERS (PDF ONLY) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 01 Job Description Card */}
          <div className="neu-raised rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center text-sky-400 font-bold text-sm">01</div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">Job Description (JD PDF)</h2>
                  <p className="text-xs text-slate-400">
                    {jdLocked ? 'Card is locked • Protected against changes' : 'Upload role requirements in PDF format'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setJdLocked(!jdLocked)}
                className={`neu-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  jdLocked
                    ? 'neu-btn-active text-sky-400 border-sky-400/40 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={jdLocked ? 'Click to unlock this card' : 'Lock card to protect this file'}
              >
                {jdLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{jdLocked ? 'Locked' : 'Lock'}</span>
              </button>
            </div>

            <div
              onClick={() => {
                if (jdLocked) {
                  setValidationError({
                    status: 'LOCKED_CARD',
                    message: 'Job Description card is locked. Click the "Locked" button above to unlock before replacing this file.'
                  });
                  return;
                }
                jdInputRef.current?.click();
              }}
              className={`neu-inset rounded-2xl p-6 min-h-[170px] flex flex-col items-center justify-center text-center transition-all ${
                jdLocked
                  ? 'cursor-not-allowed opacity-90 border border-sky-400/30'
                  : 'cursor-pointer group hover:border-sky-500/30'
              }`}
            >
              <input
                ref={jdInputRef}
                type="file"
                accept=".pdf,application/pdf"
                disabled={jdLocked}
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0], 'jd')}
              />
              {jdFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl neu-raised mx-auto flex items-center justify-center text-sky-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-100 break-all px-2">{jdFile.name}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[10px] text-sky-400 uppercase font-mono tracking-widest bg-sky-400/10 px-2 py-0.5 rounded">
                      PDF Verified
                    </span>
                    {jdLocked && (
                      <span className="text-[10px] text-amber-300 font-semibold bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Locked
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl neu-raised mx-auto flex items-center justify-center text-slate-400 group-hover:text-sky-400">
                    {jdLocked ? <Lock className="w-5 h-5 text-amber-400" /> : <Upload className="w-5 h-5" />}
                  </div>
                  <p className="text-sm font-medium text-slate-300">
                    {jdLocked ? (
                      <span className="text-amber-400 font-semibold">Card is Locked • Unlock to upload JD</span>
                    ) : (
                      <>Click to upload <span className="text-sky-400">JD (.PDF only)</span></>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 02 Candidate Resume Card */}
          <div className="neu-raised rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center text-emerald-400 font-bold text-sm">02</div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">Candidate Resume (PDF)</h2>
                  <p className="text-xs text-slate-400">
                    {resumeLocked ? 'Card is locked • Protected against changes' : 'Upload applicant resume in PDF format'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setResumeLocked(!resumeLocked)}
                className={`neu-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  resumeLocked
                    ? 'neu-btn-active text-emerald-400 border-emerald-400/40 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={resumeLocked ? 'Click to unlock this card' : 'Lock card to protect this file'}
              >
                {resumeLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{resumeLocked ? 'Locked' : 'Lock'}</span>
              </button>
            </div>

            <div
              onClick={() => {
                if (resumeLocked) {
                  setValidationError({
                    status: 'LOCKED_CARD',
                    message: 'Candidate Resume card is locked. Click the "Locked" button above to unlock before replacing this file.'
                  });
                  return;
                }
                resumeInputRef.current?.click();
              }}
              className={`neu-inset rounded-2xl p-6 min-h-[170px] flex flex-col items-center justify-center text-center transition-all ${
                resumeLocked
                  ? 'cursor-not-allowed opacity-90 border border-emerald-400/30'
                  : 'cursor-pointer group hover:border-emerald-500/30'
              }`}
            >
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,application/pdf"
                disabled={resumeLocked}
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0], 'resume')}
              />
              {resumeFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl neu-raised mx-auto flex items-center justify-center text-emerald-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-100 break-all px-2">{resumeFile.name}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-widest bg-emerald-400/10 px-2 py-0.5 rounded">
                      PDF Verified
                    </span>
                    {resumeLocked && (
                      <span className="text-[10px] text-amber-300 font-semibold bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Locked
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl neu-raised mx-auto flex items-center justify-center text-slate-400 group-hover:text-emerald-400">
                    {resumeLocked ? <Lock className="w-5 h-5 text-amber-400" /> : <Upload className="w-5 h-5" />}
                  </div>
                  <p className="text-sm font-medium text-slate-300">
                    {resumeLocked ? (
                      <span className="text-amber-400 font-semibold">Card is Locked • Unlock to upload Resume</span>
                    ) : (
                      <>Click to upload <span className="text-emerald-400">Resume (.PDF only)</span></>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PRIMARY ACTION BUTTONS: ANALYZE & CLEAR UNLOCKED FILE */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            disabled={isAnalyzing}
            onClick={() => executeAnalysis()}
            className="neu-btn neu-glow-cyan px-8 py-4 rounded-2xl font-bold text-base text-sky-400 flex items-center gap-3 disabled:opacity-50"
          >
            {isAnalyzing ? <RefreshCw className="w-5 h-5 animate-spin text-sky-400" /> : <Sparkles className="w-5 h-5" />}
            <span>{isAnalyzing ? 'Auditing PDF Buffers...' : 'Analyze PDF ATS Match & Skill Evidence'}</span>
          </button>

          {((!jdLocked && Boolean(jdFile)) || (!resumeLocked && Boolean(resumeFile))) && (
            <button
              disabled={isAnalyzing}
              onClick={handleClearUnlockedFiles}
              className="neu-btn px-6 py-4 rounded-2xl font-bold text-sm text-rose-400 hover:text-rose-300 flex items-center gap-2.5 transition-all border border-rose-500/25 hover:border-rose-500/40"
              title="Clear unlocked file(s) while keeping locked file(s) preserved"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Clear Unlocked File</span>
            </button>
          )}
        </div>

        {validationError && (
          <section className={`rounded-3xl p-6 ${validationError.status === 'SWAPPED' ? 'neu-glow-amber' : 'neu-glow-crimson'}`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    {validationError.status === 'SWAPPED' ? 'Hold on! PDF files are swapped.' : 'PDF Validation Alert'}
                  </h3>
                  <p className="text-sm text-slate-300">{validationError.message}</p>
                </div>
              </div>
              {validationError.status === 'SWAPPED' && (
                <button onClick={handleSmartSwapAndAnalyze} className="neu-btn px-5 py-3 rounded-2xl text-xs font-bold text-amber-400 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Fix & Swap Automatically
                </button>
              )}
            </div>
          </section>
        )}

        {currentResult && (
          <section
            key={currentResult.id || currentResult.pairKey || currentResult.candidateName}
            className="neu-raised rounded-3xl p-6 sm:p-8 space-y-6 neu-report-morph"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 flex justify-center border-b lg:border-b-0 lg:border-r border-white/5 pb-6 lg:pb-0 morph-child-1">
                <NeumorphicCircularGauge score={currentResult.atsScore} />
              </div>
              <div className="lg:col-span-8 space-y-4 morph-child-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-extrabold text-slate-100">{currentResult.candidateName}</h2>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold neu-inset text-amber-400 flex items-center gap-1.5">
                        <Flag className="w-3.5 h-3.5" />
                        Nationality: {currentResult.nationality || 'Not Mentioned'}
                      </span>
                    </div>
                    <p className="text-xs text-sky-400 mt-1.5 font-medium">
                      Target Role: {currentResult.jobTitle} • <span className="text-slate-400">PDF: {currentResult.resumeFileName}</span>
                    </p>
                  </div>
                </div>

                {/* CANDIDATE CONTACT & SOCIAL IDS DOSSIER */}
                <div className="neu-inset rounded-2xl p-4 space-y-3.5">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <Share2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Extracted Candidate Contact & Social IDs</span>
                  </div>

                  {/* Primary Contact Row: Phone, Email, Nationality */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="neu-raised-sm rounded-xl p-2.5 flex items-center gap-2.5">
                      <div className="p-2 rounded-lg neu-inset text-emerald-400 shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Phone Number</span>
                        <span className="text-xs font-semibold text-slate-200 truncate block">
                          {currentResult.phoneNumber || 'Not Provided'}
                        </span>
                      </div>
                    </div>

                    <div className="neu-raised-sm rounded-xl p-2.5 flex items-center gap-2.5">
                      <div className="p-2 rounded-lg neu-inset text-sky-400 shrink-0">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Email ID</span>
                        <span className="text-xs font-semibold text-slate-200 truncate block" title={currentResult.emailId}>
                          {currentResult.emailId || 'Not Provided'}
                        </span>
                      </div>
                    </div>

                    <div className="neu-raised-sm rounded-xl p-2.5 flex items-center gap-2.5">
                      <div className="p-2 rounded-lg neu-inset text-amber-400 shrink-0">
                        <Flag className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Nationality</span>
                        <span className="text-xs font-semibold text-slate-200 truncate block">
                          {currentResult.nationality || 'Not Mentioned'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* All Extracted Social / Portfolio Links (LinkedIn, Insta, X, YouTube, GitHub, etc.) */}
                  <div className="pt-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
                      Social Profiles & Portfolio Handles ({(currentResult.socialProfiles || []).length} Found in Resume)
                    </span>
                    {(currentResult.socialProfiles || []).length === 0 ? (
                      <span className="text-xs text-slate-500 italic">No social links or external IDs detected in this resume PDF.</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {currentResult.socialProfiles.map((soc, idx) => {
                          const rawLink = soc.handleOrUrl || '';
                          const href = rawLink.startsWith('http') ? rawLink : `https://${rawLink.replace(/^@/, '')}`;
                          return (
                            <a
                              key={idx}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border ${getPlatformStyle(soc.platform)}`}
                            >
                              <Globe className="w-3.5 h-3.5 shrink-0" />
                              <span className="font-bold">{soc.platform}:</span>
                              <span className="text-slate-300 font-normal truncate max-w-[190px]">{soc.handleOrUrl}</span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* CHEAT DETECTION BANNER */}
                {currentResult.cheatDetection?.isSuspicious ? (
                  <div className="neu-glow-crimson rounded-2xl p-4 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-rose-400">ATS Manipulation / Keyword Stuffing Detected</h4>
                      <p className="text-xs text-slate-300 mt-0.5">{currentResult.cheatDetection.reason}</p>
                    </div>
                  </div>
                ) : (
                  <div className="neu-inset rounded-2xl p-3 flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-300 font-medium">Forensic Audit: No hidden text or keyword stuffing found. Clean PDF.</span>
                  </div>
                )}
              </div>
            </div>

            {/* SKILL EVIDENCE MATRIX (3 COLUMNS) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5 morph-child-3">
              <div className="neu-inset rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Verified Skills (Project Proof)</h4>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded neu-raised text-emerald-400">
                    {(currentResult.verifiedSkills || []).length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(currentResult.verifiedSkills || []).length === 0 ? (
                    <span className="text-xs text-slate-500 italic">None verified in projects</span>
                  ) : (
                    currentResult.verifiedSkills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-xl text-xs font-medium neu-raised text-emerald-300 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" /> {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="neu-inset rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Unverified (Just Listed)</h4>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded neu-raised text-amber-400">
                    {(currentResult.unverifiedSkills || []).length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(currentResult.unverifiedSkills || []).length === 0 ? (
                    <span className="text-xs text-slate-500 italic">No unverified skills</span>
                  ) : (
                    currentResult.unverifiedSkills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-xl text-xs font-medium neu-raised text-amber-300 flex items-center gap-1">
                        <HelpCircle className="w-3 h-3 text-amber-400" /> {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="neu-inset rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">Missing Skills (Skill Gap)</h4>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded neu-raised text-rose-400">
                    {(currentResult.missingSkills || []).length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(currentResult.missingSkills || []).length === 0 ? (
                    <span className="text-xs text-slate-500 italic">Zero skill gap!</span>
                  ) : (
                    currentResult.missingSkills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-xl text-xs font-medium neu-raised text-rose-300 flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-400" /> {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* ROLE-SPECIFIC INTELLIGENCE PANEL */}
            <div className="morph-child-4">
              {role === 'applicant' ? (
                <div className="neu-inset rounded-2xl p-6 space-y-3">
                  <h4 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Actionable Resume Improvement Roadmap
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    {(currentResult.applicantFeedback || []).map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-sky-400 font-bold">•</span> <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="neu-inset rounded-2xl p-5 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Executive Hiring Summary</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{currentResult.recruiterSummary}</p>
                  </div>
                  <div className="neu-inset rounded-2xl p-5 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">Targeted Technical Interview Questions</h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {(currentResult.interviewQuestions || []).map((q, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-sky-400 font-mono">Q{i+1}:</span> <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ====================================================================
            RECRUITER LIVE SESSION LEADERBOARD (Strictly Recruiter Mode)
        ==================================================================== */}
        {role === 'recruiter' && (
          <section className="neu-raised rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-extrabold text-slate-100">Recruiter Live Session Leaderboard</h3>
                  <span className="text-[11px] font-bold px-3 py-0.5 rounded-full neu-inset text-emerald-400">
                    {sortedSessionHistory.length} Scanned
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Sorted in <span className="text-emerald-400 font-semibold">{sortOrder === 'desc' ? 'Descending Order (Highest Score #1 at top)' : 'Ascending Order (Lowest Score at top)'}</span> • RAM-only PDF session storage
                </p>
              </div>

              {sortedSessionHistory.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    className="neu-btn px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-1.5"
                  >
                    <ArrowDown className={`w-3.5 h-3.5 transition-transform ${sortOrder === 'asc' ? 'rotate-180 text-sky-400' : 'text-emerald-400'}`} />
                    <span>Sort: {sortOrder === 'desc' ? 'Descending (High → Low)' : 'Ascending (Low → High)'}</span>
                  </button>

                  <button onClick={handleDownloadCSV} className="neu-btn px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Download CSV
                  </button>
                </div>
              )}
            </div>

            {sortedSessionHistory.length === 0 ? (
              <div className="neu-inset rounded-2xl p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl neu-raised mx-auto flex items-center justify-center text-slate-400">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-200">No PDF Candidates Scanned Yet in This Session</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Upload a JD PDF and a Resume PDF above and click <span className="text-sky-400 font-semibold">"Analyze PDF ATS Match"</span> to populate this descending leaderboard.
                </p>
              </div>
            ) : (
              <div className="neu-inset rounded-2xl overflow-x-auto p-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">Rank</th>
                      <th className="py-3.5 px-4">Candidate & Contact</th>
                      <th className="py-3.5 px-4">Nationality & Socials</th>
                      <th className="py-3.5 px-4">ATS Score ({sortOrder === 'desc' ? 'Desc ↓' : 'Asc ↑'})</th>
                      <th className="py-3.5 px-4">Skill Match (V / U / M)</th>
                      <th className="py-3.5 px-4">Cheat Shield</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                    {sortedSessionHistory.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-white/[0.02]">
                        <td className="py-3.5 px-4 font-bold text-sky-400">#{idx + 1}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-100">{item.candidateName}</div>
                          <div className="text-[11px] text-slate-400">{item.emailId || 'No Email'} • {item.phoneNumber || 'No Phone'}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-xs text-amber-400 font-medium">{item.nationality || 'Not Mentioned'}</div>
                          <div className="text-[11px] text-sky-400 truncate max-w-[180px]">
                            {(item.socialProfiles || []).length > 0
                              ? item.socialProfiles.map((s) => s.platform).join(', ')
                              : 'No Social IDs'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`font-extrabold text-sm px-3 py-1 rounded-xl neu-raised-sm ${
                            item.atsScore >= 75 ? 'text-emerald-400' : item.atsScore >= 50 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {item.atsScore}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-emerald-400">{(item.verifiedSkills || []).length}V</span> /{' '}
                          <span className="text-amber-400">{(item.unverifiedSkills || []).length}U</span> /{' '}
                          <span className="text-rose-400">{(item.missingSkills || []).length}M</span>
                        </td>
                        <td className="py-3.5 px-4">
                          {item.cheatDetection?.isSuspicious ? (
                            <span className="text-rose-400 font-bold flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Flagged</span>
                          ) : (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Clean</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button onClick={() => setCurrentResult({ ...item, animKey: Date.now() })} className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-1.5 ml-auto">
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>


      {/* API KEY CONFIGURATION MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="neu-raised rounded-3xl max-w-md w-full p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Key className="w-4 h-4 text-sky-400" />
                Gemini API Key Settings
              </h3>
              <button onClick={() => setShowKeyModal(false)} className="neu-btn px-3 py-1.5 rounded-xl text-xs text-slate-400">✕</button>
            </div>
            
            <p className="text-xs text-slate-400">
              {serverHasKey 
                ? 'Backend .env API Key is active. You do not need to provide a custom key unless you wish to override it.' 
                : 'Enter your Google Gemini API key to enable direct multimodal PDF parsing.'}
            </p>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Custom Gemini API Key</label>
              <input
                type="password"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full neu-inset rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:ring-1 focus:ring-sky-400/50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  localStorage.removeItem('GEMINI_API_KEY');
                  setCustomKey('');
                  setShowKeyModal(false);
                }}
                className="neu-btn px-3.5 py-2 rounded-xl text-xs text-slate-400"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  if (customKey) localStorage.setItem('GEMINI_API_KEY', customKey);
                  setShowKeyModal(false);
                }}
                className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-sky-400"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
