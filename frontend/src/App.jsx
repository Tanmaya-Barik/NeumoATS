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
  Trash2,
  Rocket
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ============================================================================
// NEUMO LIQUID GLASS ENGINE (Keyframes & Specular Dynamics)
// ============================================================================
const NEUMO_LIQUID_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

  :root {
    --oneui-bg: #07090e;
    --liquid-cyan: #00d2ff;
    --liquid-violet: #8a2be2;
    --liquid-emerald: #00f2a9;
    --liquid-amber: #ffb703;
    --liquid-rose: #ff3366;
  }

  body {
    background-color: #07090e !important;
    color: #edf2f7;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    overflow-x: hidden;
  }

  /* Liquid Glass Material */
  .oneui-liquid-card {
    background: radial-gradient(120% 120% at 50% 0%, rgba(255, 255, 255, 0.05) 0%, rgba(13, 17, 24, 0.72) 100%);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.09);
    box-shadow: 
      0 20px 40px -15px rgba(0, 0, 0, 0.6),
      inset 0 1px 1px 0 rgba(255, 255, 255, 0.15),
      inset 0 -1px 1px 0 rgba(0, 0, 0, 0.3);
    transform: translateZ(0);
    will-change: transform;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
                box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
                border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .oneui-liquid-card:hover {
    transform: translate3d(0, -2px, 0);
    border-color: rgba(0, 210, 255, 0.28);
    box-shadow: 
      0 26px 50px -15px rgba(0, 210, 255, 0.14),
      0 15px 30px -10px rgba(0, 0, 0, 0.7),
      inset 0 1px 2px 0 rgba(255, 255, 255, 0.25);
  }

  /* Inset Dock / Wells */
  .oneui-liquid-dock {
    background: linear-gradient(180deg, rgba(3, 6, 12, 0.7) 0%, rgba(8, 12, 20, 0.5) 100%);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 
      inset 0 2px 6px 0 rgba(0, 0, 0, 0.6),
      inset 0 -1px 1px 0 rgba(255, 255, 255, 0.04);
  }

  /* Tactile Fluid Button */
  .oneui-fluid-btn {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 8px 18px -4px rgba(0, 0, 0, 0.4),
      inset 0 1px 1px 0 rgba(255, 255, 255, 0.2);
    transform: translateZ(0);
    will-change: transform;
    transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .oneui-fluid-btn:hover:not(:disabled) {
    transform: translate3d(0, -1px, 0) scale(1.02);
    border-color: rgba(0, 210, 255, 0.35);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.04) 100%);
    box-shadow: 
      0 12px 24px -6px rgba(0, 0, 0, 0.5),
      inset 0 1px 2px 0 rgba(255, 255, 255, 0.35);
  }

  .oneui-fluid-btn:active:not(:disabled) {
    transform: translate3d(0, 1px, 0) scale(0.98);
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.6);
  }

  /* Primary Gradient Hero Action */
  .oneui-primary-pill {
    background: linear-gradient(135deg, #00d2ff 0%, #0066ff 50%, #7b2cbf 100%);
    box-shadow: 
      0 14px 30px -8px rgba(0, 162, 255, 0.45),
      inset 0 1px 2px 0 rgba(255, 255, 255, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.25);
    transform: translateZ(0);
    will-change: transform;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .oneui-primary-pill:hover:not(:disabled) {
    transform: translate3d(0, -2px, 0) scale(1.02);
    box-shadow: 
      0 20px 40px -6px rgba(0, 162, 255, 0.6),
      0 0 25px rgba(0, 210, 255, 0.35),
      inset 0 1px 3px 0 rgba(255, 255, 255, 0.6);
  }

  .oneui-primary-pill:active:not(:disabled) {
    transform: translate3d(0, 1px, 0) scale(0.98);
  }

  /* Fixed Hardware-Accelerated Ambient Canvas */
  .oneui-ambient-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
    transform: translateZ(0);
    will-change: transform;
    backface-visibility: hidden;
  }

  /* GPU Optimized Radial Mesh Orbs */
  .oneui-mesh-orb-1 {
    position: absolute;
    top: -10%;
    left: -8%;
    width: 650px;
    height: 650px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 210, 255, 0.14) 0%, rgba(0, 102, 255, 0.04) 40%, transparent 70%);
    pointer-events: none;
    transform: translate3d(0, 0, 0);
    will-change: transform;
    animation: oneuiFloat 18s ease-in-out infinite alternate;
  }

  .oneui-mesh-orb-2 {
    position: absolute;
    top: 35%;
    right: -10%;
    width: 700px;
    height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(138, 43, 226, 0.12) 0%, rgba(100, 10, 240, 0.03) 40%, transparent 70%);
    pointer-events: none;
    transform: translate3d(0, 0, 0);
    will-change: transform;
    animation: oneuiFloat2 22s ease-in-out infinite alternate;
  }

  .oneui-mesh-orb-3 {
    position: absolute;
    bottom: -10%;
    left: 20%;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 242, 169, 0.09) 0%, rgba(0, 180, 216, 0.02) 40%, transparent 70%);
    pointer-events: none;
    transform: translate3d(0, 0, 0);
    will-change: transform;
  }

  @keyframes oneuiFloat {
    0% { transform: translate3d(0px, 0px, 0) scale(1); }
    100% { transform: translate3d(50px, 35px, 0) scale(1.08); }
  }

  @keyframes oneuiFloat2 {
    0% { transform: translate3d(0px, 0px, 0) scale(1); }
    100% { transform: translate3d(-40px, -45px, 0) scale(1.06); }
  }

  /* Custom Smooth Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #07090e;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 9999px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 210, 255, 0.4);
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
      content: `CANDIDATE RESUME: Aarav Sharma\nPhone: +91 98765 43210 | Email: aarav.sharma.dev@gmail.com | Nationality: Indian\nSocial Links: LinkedIn: linkedin.com/in/aaravsharma-dev | GitHub: github.com/aarav-fullstack | X (Twitter): x.com/aarav_codes | YouTube: youtube.com/@AaravTechTalks | Instagram: instagram.com/aarav.builds\nSKILLS: React.js, Node.js, Express.js, MongoDB, Tailwind CSS, TypeScript, Docker, GraphQL.\nWORK EXPERIENCE:\n1. Software Engineer at CloudNova: Built dashboards using React.js, TypeScript, and Node.js. Used Docker for containerization.\nPROJECTS:\n- FinScale Portal: Deployed at finscale-demo.vercel.app with live real-time metrics.`
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
// HELPER FUNCTIONS & DETERMINISTIC FORMULAS
// ============================================================================
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

function calculateExactFormulaScore(verified = [], unverified = [], missing = [], isSuspicious = false, liveProjectLinks = []) {
  const vCount = (verified || []).length;
  const uCount = (unverified || []).length;
  const mCount = (missing || []).length;
  const totalSkills = vCount + uCount + mCount;

  if (totalSkills === 0) return 0;

  const baseScore = Math.round(((vCount * 1.0 + uCount * 0.45) / totalSkills) * 100);

  // Proof-of-Work Bonus (+5% per live deployment/project link, max +10%)
  const linkCount = (liveProjectLinks || []).length;
  const liveBonus = Math.min(10, linkCount * 5);

  let computedScore = baseScore + liveBonus;
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
      { platform: 'X', handleOrUrl: 'x.com/aarav_codes' },
      { platform: 'YouTube', handleOrUrl: 'youtube.com/@AaravTechTalks' },
      { platform: 'Instagram', handleOrUrl: 'instagram.com/aarav.builds' }
    ],
    liveProjectLinks: [
      { projectName: 'FinScale Portal', liveUrl: 'finscale-demo.vercel.app', description: 'Live production dashboard' }
    ],
    liveProjectBonus: 5,
    atsScore: 84,
    verifiedSkills: [
      'React.js', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript',
      'Docker', 'GraphQL', 'JavaScript (ES6+)', 'HTML5', 'CSS3',
      'JSX', 'Vite', 'Git', 'GitHub', 'REST APIs', 'Axios', 'npm', 'VS Code'
    ],
    unverifiedSkills: ['Tailwind CSS', 'AWS', 'Redis'],
    missingSkills: ['PostgreSQL', 'Kubernetes'],
    cheatDetection: {
      isSuspicious: false,
      reason: 'Authentic PDF layout. Project achievements and technologies verify cleanly without keyword stuffing.'
    },
    applicantFeedback: [
      'Highlight concrete throughput and scale metrics for your GraphQL and Docker microservices.',
      'Add AWS deployment architecture diagrams to showcase enterprise readiness.',
      'Maintain live project links on your resume—having verifiable URLs gave your ATS score a +5% Proof-of-Work boost.'
    ],
    recruiterSummary: 'Aarav Sharma is a top-tier candidate demonstrating robust full-stack MERN proficiency, verified production deployments, and verifiable GitHub and live URLs.',
    interviewQuestions: [
      'How did you structure caching between Redis and MongoDB in your CloudNova services?',
      'Can you explain how you optimized bundle sizes when migrating React to Vite and TypeScript?',
      'Walk through how you orchestrated Docker multi-stage builds for production.'
    ]
  },
  WEAK_CANDIDATE: {
    validationStatus: 'VALID',
    validationMessage: 'Successfully validated Job Description and Candidate Resume.',
    candidateName: 'Riya Verma',
    jobTitle: 'Senior Full-Stack MERN Engineer',
    phoneNumber: '+91 87654 32109',
    emailId: 'riya.verma24@outlook.com',
    nationality: 'Indian',
    socialProfiles: [
      { platform: 'LinkedIn', handleOrUrl: 'linkedin.com/in/riyaverma-web' },
      { platform: 'Instagram', handleOrUrl: 'instagram.com/riya_designs_ui' }
    ],
    liveProjectLinks: [],
    liveProjectBonus: 0,
    atsScore: 46,
    verifiedSkills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React.js'],
    unverifiedSkills: ['Node.js', 'MongoDB', 'Python'],
    missingSkills: ['Express.jfs', 'TypeScript', 'Docker', 'AWS', 'Redis', 'GraphQL'],
    cheatDetection: {
      isSuspicious: false,
      reason: 'Genuine junior-level portfolio document. No ATS manipulation detected.'
    },
    applicantFeedback: [
      'Deploy full-stack projects to platforms like Vercel or Render to earn the +5% to +10% live project ATS boost.',
      'Build end-to-end applications demonstrating Express.js middleware and database transactions.',
      'Bridge core skill gaps in TypeScript and Docker containerization.'
    ],
    recruiterSummary: 'Riya Verma is an entry-level candidate with basic frontend exposure but lacks backend architectural depth and containerization required for this senior MERN role.',
    interviewQuestions: [
      'How have you managed state in React beyond component-level useState?',
      'Can you explain RESTful endpoint design principles and error handling middleware?',
      'What experience do you have connecting Node.js to MongoDB?'
    ]
  },
  SWAPPED_MISTAKE: {
    validationStatus: 'SWAPPED',
    validationMessage: 'Document 1 appears to be a Candidate Resume (Vikram Patel) while Document 2 appears to be a Job Description. Please swap their positions.',
    candidateName: 'Unknown',
    jobTitle: 'Unknown',
    phoneNumber: 'Not Provided',
    emailId: 'Not Provided',
    nationality: 'Not Mentioned',
    socialProfiles: [],
    liveProjectLinks: [],
    liveProjectBonus: 0,
    atsScore: 0,
    verifiedSkills: [],
    unverifiedSkills: [],
    missingSkills: [],
    cheatDetection: { isSuspicious: false, reason: 'N/A' },
    applicantFeedback: [],
    recruiterSummary: 'Files are inverted. Inversion guard prevented corrupted ATS scoring.',
    interviewQuestions: []
  },
  CHEAT_STUFFING: {
    validationStatus: 'VALID',
    validationMessage: 'Successfully validated Job Description and Candidate Resume.',
    candidateName: 'Kabir Malhotra',
    jobTitle: 'Senior Full-Stack MERN Engineer',
    phoneNumber: '+91 91234 56789',
    emailId: 'kabir.malhotra@yahoo.com',
    nationality: 'Indian',
    socialProfiles: [
      { platform: 'LinkedIn', handleOrUrl: 'linkedin.com/in/kabirmalhotra' },
      { platform: 'X', handleOrUrl: 'x.com/kabir_dev' },
      { platform: 'YouTube', handleOrUrl: 'youtube.com/@KabirVlogs' }
    ],
    liveProjectLinks: [],
    liveProjectBonus: 0,
    atsScore: 28,
    verifiedSkills: ['React.js'],
    unverifiedSkills: ['Node.js', 'Express', 'MongoDB'],
    missingSkills: ['TypeScript', 'Docker', 'AWS', 'Redis'],
    cheatDetection: {
      isSuspicious: true,
      reason: 'Forensic PDF audit detected hidden 1px white-text keyword stuffing: "React Node.js Express MongoDB Docker AWS Kubernetes Redis GraphQL". -30 ATS penalty applied.'
    },
    applicantFeedback: [
      'CRITICAL: Remove hidden white-text keyword stuffing immediately. Modern ATS systems flag this as fraudulent manipulation.',
      'Replace keyword lists with actual project bullet points and quantifiable outcomes.'
    ],
    recruiterSummary: 'FLAGGED: Candidate resume contains deliberate invisible keyword stuffing designed to fool legacy keyword scrapers.',
    interviewQuestions: [
      'Can you explain the actual architecture of any production service you built with Kubernetes or Docker?'
    ]
  }
};

// ============================================================================
// CLIENT-SIDE GEMINI & BACKEND SERVICE CALL
// ============================================================================
async function callMultimodalATS(jdFileObj, resumeFileObj, customApiKey = '') {
  // 1. Try backend API first
  try {
    const backendUrl = (() => {
      try {
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_URL) {
          return import.meta.env.VITE_BACKEND_URL;
        }
      } catch (e) { }
      return '';
    })();

    const formData = new FormData();
    const headers = {};
    if (customApiKey) headers['x-gemini-key'] = customApiKey;

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

    const response = await fetch(`${backendUrl}/api/analyze`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (response.ok) {
      const parsed = await response.json();
      if (parsed.validationStatus === 'VALID') {
        const linkCount = (parsed.liveProjectLinks || []).length;
        parsed.liveProjectBonus = parsed.liveProjectBonus !== undefined ? parsed.liveProjectBonus : Math.min(10, linkCount * 5);
        parsed.atsScore = calculateExactFormulaScore(
          parsed.verifiedSkills,
          parsed.unverifiedSkills,
          parsed.missingSkills,
          parsed.cheatDetection?.isSuspicious,
          parsed.liveProjectLinks
        );
      }
      return parsed;
    } else {
      let errorMsg = 'Backend ATS service error';
      try {
        const errJson = await response.json();
        if (errJson?.error) errorMsg = errJson.error;
      } catch { }
      console.warn('Backend API /api/analyze error:', response.status, errorMsg);
      const hasClientKey = !!(customApiKey || localStorage.getItem('GEMINI_API_KEY'));
      if (!hasClientKey && !jdFileObj.isVirtual && !resumeFileObj.isVirtual) {
        throw new Error(errorMsg);
      }
    }
  } catch (err) {
    console.warn('Backend API /api/analyze fetch failed, checking fallback:', err);
    const hasClientKey = !!(customApiKey || localStorage.getItem('GEMINI_API_KEY'));
    if (!hasClientKey && !jdFileObj.isVirtual && !resumeFileObj.isVirtual && err?.message && !err.message.includes('fetch')) {
      throw err;
    }
  }

  // 2. Direct Gemini Call if API Key is available
  const apiKey = customApiKey || localStorage.getItem('GEMINI_API_KEY') || '';
  if (apiKey) {
    const directModels = ['gemini-3.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    for (const model of directModels) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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
  6. liveProjectLinks: Extract ALL functional live project URLs, deployed application demos (e.g. *.vercel.app, *.netlify.app, *.render.com, *.github.io, custom domains, live apps) and project-specific repository links attached to candidate projects. Provide projectName, liveUrl, and brief description.
- EXHAUSTIVE SKILL EXTRACTION & INTELLIGENT RECRUITER VERIFICATION:
  * COMPREHENSIVE RESUME COVERAGE: Extract EVERY SINGLE technical skill, programming language, framework, library, database, protocol, runtime, architecture, and tool mentioned anywhere in Document 2 (Candidate Resume) — across Technologies, Summary, Experience, and Projects.
  * INTELLIGENT RECRUITER VERIFICATION:
    1. verifiedSkills: Direct project evidence (React.js, Node.js, Express.js, MongoDB, TypeScript, REST APIs, Socket.io, JWT Authentication, Axios, Tailwind CSS, Responsive Web Design, Cloudinary, Vite) PLUS Inherent Prerequisite Verification: if a candidate has proven projects in React/Node/full-stack web development, foundational technologies listed on their resume (JavaScript (ES6+), HTML5, CSS3, JSX, Authentication & Authorization, Client-Server Architecture, Git, GitHub, Postman, npm, VS Code, Vercel/Render, REST API Testing) are verified integral parts of that stack. Place them in verifiedSkills!
    2. unverifiedSkills: Alternative, unused technologies explicitly listed in the resume (e.g. MySQL, SQL, PostgreSQL when projects used MongoDB; Bootstrap when projects used Tailwind). STRICT CONSTRAINT: Must be physically present in the resume!
    3. missingSkills (Skill Gaps): Every requirement demanded by Document 1 (JD) that does NOT appear in Document 2 (Resume) at all (e.g. C#, .NET). Never put missing JD requirements into unverifiedSkills!
- Proof-of-Work Score Boost: Each verified live project deployment link grants a +5% score bonus (capped at max +10% boost).
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
                liveProjectLinks: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      projectName: { type: 'STRING' },
                      liveUrl: { type: 'STRING' },
                      description: { type: 'STRING' }
                    },
                    required: ['projectName', 'liveUrl']
                  }
                },
                liveProjectBonus: { type: 'INTEGER' },
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
                'phoneNumber', 'emailId', 'nationality', 'socialProfiles', 'liveProjectLinks', 'liveProjectBonus',
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
            const linkCount = (parsed.liveProjectLinks || []).length;
            parsed.liveProjectBonus = parsed.liveProjectBonus !== undefined ? parsed.liveProjectBonus : Math.min(10, linkCount * 5);
            parsed.atsScore = calculateExactFormulaScore(
              parsed.verifiedSkills,
              parsed.unverifiedSkills,
              parsed.missingSkills,
              parsed.cheatDetection?.isSuspicious,
              parsed.liveProjectLinks
            );
          }
          return parsed;
        }
      } catch (directErr) {
        console.warn(`Direct Gemini API call with ${model} failed:`, directErr);
      }
    }
  }

  // 3. Fallback for built-in virtual test presets (ensures demo presets always work)
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
    data.atsScore = calculateExactFormulaScore(data.verifiedSkills, data.unverifiedSkills, data.missingSkills, false, data.liveProjectLinks);
    return data;
  }

  throw new Error('Analysis failed. Please ensure the backend server is running or provide a Gemini API key.');
}

// ============================================================================
// NEUMO LIQUID GLASS CIRCULAR GAUGE (Hardware-Accelerated Fluid Arc)
// ============================================================================
function OneUiLiquidGauge({ score, liveBonus = 0 }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score || 0));

  // Initialize at full circumference (0% arc) so CSS transition smoothly sweeps on mount/change
  const [strokeDashoffset, setStrokeDashoffset] = useState(circumference);

  useEffect(() => {
    setStrokeDashoffset(circumference);
    const timer = setTimeout(() => {
      setStrokeDashoffset(circumference - (clampedScore / 100) * circumference);
    }, 40);
    return () => clearTimeout(timer);
  }, [clampedScore, circumference]);

  useEffect(() => {
    if (clampedScore >= 75) {
      try {
        confetti({
          particleCount: 28,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#00f2a9', '#00d2ff', '#ffb703']
        });
      } catch (e) { }
    }
  }, [clampedScore]);

  let strokeColor = '#ff3366';
  let badgeLabel = 'High Skill Gap';
  let glowColor = 'rgba(255, 51, 102, 0.4)';

  if (clampedScore >= 75) {
    strokeColor = '#00f2a9';
    badgeLabel = 'Prime Match';
    glowColor = 'rgba(0, 242, 169, 0.45)';
  } else if (clampedScore >= 50) {
    strokeColor = '#ffb703';
    badgeLabel = 'Moderate Match';
    glowColor = 'rgba(255, 183, 3, 0.4)';
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 select-none">
      <div className="relative w-48 h-48 rounded-full oneui-liquid-card flex items-center justify-center p-3">
        {/* Soft Radial Ambient Glow */}
        <div
          className="absolute inset-4 rounded-full blur-xl opacity-30 transition-all duration-700 pointer-events-none"
          style={{ background: strokeColor }}
        />

        <div className="w-full h-full rounded-full oneui-liquid-dock flex items-center justify-center relative">
          <svg className="w-40 h-40 -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Liquid Progress Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={strokeColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'stroke-dashoffset',
                filter: `drop-shadow(0 0 8px ${glowColor})`
              }}
            />
          </svg>

          {/* Center Orb */}
          <div className="absolute w-28 h-28 rounded-full oneui-liquid-card flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
              {clampedScore}<span className="text-xl font-normal text-slate-400">%</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">
              ATS MATCH
            </span>
          </div>
        </div>
      </div>

      {/* Floating Status Badge */}
      <div
        className="mt-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border flex items-center gap-1.5 backdrop-blur-xl"
        style={{
          borderColor: `${strokeColor}40`,
          backgroundColor: `${strokeColor}15`,
          color: strokeColor,
          boxShadow: `0 4px 14px ${glowColor}`
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: strokeColor }} />
        <span>{badgeLabel}</span>
      </div>

      {/* Proof-of-Work Bonus Pill */}
      {liveBonus > 0 && (
        <div className="mt-2.5 px-3.5 py-1 rounded-full text-[11px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-400/30 flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,242,169,0.2)]">
          <Rocket className="w-3.5 h-3.5 text-emerald-400" />
          <span>Includes +{liveBonus}% Live Project Boost</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  const [role, setRole] = useState('recruiter');
  const [jdFile, setJdFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [jdLocked, setJdLocked] = useState(true);
  const [resumeLocked, setResumeLocked] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);

  const [sessionHistory, setSessionHistory] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeFeature, setActiveFeature] = useState(null);

  // API Key & Backend Health State
  const [serverHasKey, setServerHasKey] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  const jdInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const fingerprintCacheRef = useRef({});

  // Check backend health & load custom key from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('GEMINI_API_KEY');
    if (saved) setCustomKey(saved);

    const backendUrl = (() => {
      try {
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_URL) {
          return import.meta.env.VITE_BACKEND_URL;
        }
      } catch (e) { }
      return '';
    })();

    fetch(`${backendUrl}/api/health`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.hasApiKey) setServerHasKey(true);
      })
      .catch((err) => console.log('Backend health probe:', err.message));
  }, []);

  // File Handlers
  const handleFileSelection = (file, type) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setValidationError({
        status: 'INVALID_FORMAT',
        message: `PDF Security Filter: Invalid file format ("${file.name}"). Only verified PDF documents (.pdf) are permitted.`
      });
      return;
    }
    setValidationError(null);
    if (type === 'jd') setJdFile(file);
    if (type === 'resume') setResumeFile(file);
  };

  const handleClearUnlockedFiles = () => {
    if (!jdLocked && jdFile) setJdFile(null);
    if (!resumeLocked && resumeFile) setResumeFile(null);
    setValidationError(null);
  };

  const executeAnalysis = async (customJd = jdFile, customResume = resumeFile) => {
    if (!customJd || !customResume) {
      setValidationError({
        status: 'MISSING_FILES',
        message: 'Please provide both the Job Description PDF and the Candidate Resume PDF.'
      });
      return;
    }

    setIsAnalyzing(true);
    setValidationError(null);

    try {
      const pairKey = getPairFingerprint(customJd, customResume);
      let aiData = fingerprintCacheRef.current[pairKey];

      if (!aiData) {
        const activeKey = customKey || localStorage.getItem('GEMINI_API_KEY') || '';
        aiData = await callMultimodalATS(customJd, customResume, activeKey);
        fingerprintCacheRef.current[pairKey] = aiData;
      }

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
            ...aiData
          };
          setCurrentResult(updated[existingIdx]);
          return updated;
        }

        const newEntry = {
          id: Date.now(),
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
      let userMessage = err?.message && !err.message.includes('object Object')
        ? err.message
        : 'PDF analysis failed. Please verify files or Gemini API key and try again.';
      try {
        if (userMessage.includes('{') && userMessage.includes('RESOURCE_EXHAUSTED')) {
          userMessage = 'Gemini API quota exceeded for this model. You can enter a custom Gemini API Key via the key icon in the top header, or try again later.';
        }
      } catch { }
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
      'Social Profiles', 'Target Role', 'ATS Score (%)', 'Verified Skills', 'Unverified Skills', 'Missing Skills', 'Cheat Flag', 'Time'
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
    link.download = `NeumoATS_Leaderboard_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPlatformStyle = (platform = '') => {
    const p = platform.toLowerCase();
    if (p.includes('linkedin')) return 'text-sky-300 border-sky-400/30 bg-sky-400/10 hover:border-sky-400/60';
    if (p.includes('github')) return 'text-slate-200 border-slate-400/30 bg-white/10 hover:border-slate-300/60';
    if (p.includes('youtube') || p.includes('yt')) return 'text-rose-300 border-rose-400/30 bg-rose-500/10 hover:border-rose-400/60';
    if (p.includes('insta')) return 'text-pink-300 border-pink-400/30 bg-pink-500/10 hover:border-pink-400/60';
    if (p.includes('x') || p.includes('twitter')) return 'text-cyan-300 border-cyan-400/30 bg-cyan-400/10 hover:border-cyan-400/60';
    return 'text-emerald-300 border-emerald-400/30 bg-emerald-500/10 hover:border-emerald-400/60';
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden flex flex-col justify-between">
      <style>{NEUMO_LIQUID_STYLES}</style>

      {/* Ambient Hardware-Accelerated Mesh Canvas */}
      <div className="oneui-ambient-bg">
        <div className="oneui-mesh-orb-1" />
        <div className="oneui-mesh-orb-2" />
        <div className="oneui-mesh-orb-3" />
      </div>

      {/* CLEAN, MINIMAL EXECUTIVE NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#07090e]/80 backdrop-blur-2xl border-b border-white/[0.06] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 min-h-[5rem] py-3 flex flex-wrap items-center justify-between gap-4">

          {/* Brand Logo & Minimalist Title */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center">
                  Neumo<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-extrabold">ATS</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/25 text-emerald-300 hidden sm:inline-block">
                  Verified Engine
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal hidden sm:block">Deterministic Multimodal ATS & PDF Suite</span>
            </div>
          </div>

          {/* Segmented Persona Switcher */}
          <div className="p-1 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl flex items-center shrink-0">
            <button
              onClick={() => setRole('applicant')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${role === 'applicant'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Applicant Mode</span>
            </button>
            <button
              onClick={() => setRole('recruiter')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${role === 'recruiter'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Recruiter Mode</span>
            </button>
          </div>

          {/* API Key Settings Pill */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowKeyModal(true)}
              className="oneui-fluid-btn px-3.5 py-2 rounded-full text-xs font-semibold text-slate-200 hover:text-cyan-300 flex items-center gap-2"
              title="API Key Configuration"
            >
              <span className="relative flex h-2 w-2">
                {serverHasKey || customKey ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#00f2a9]"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 shadow-[0_0_6px_#ffb703]"></span>
                )}
              </span>
              <Key className={`w-3.5 h-3.5 ${serverHasKey || customKey ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="hidden sm:inline font-medium">
                {serverHasKey ? 'Server Key Active' : customKey ? 'Custom Key' : 'Set API Key'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-12 space-y-8 relative z-10">

        {/* PLATFORM FEATURES SHOWCASE */}
        <section className="oneui-liquid-card rounded-[28px] p-5 sm:p-6 space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Platform Features Showcase
                  </h3>
                  <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-cyan-300">
                    Architecture & Forensics
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any feature card below to inspect its mathematical formulas, forensic rules, and audit mechanisms
                </p>
              </div>
            </div>

            {/* Feature Selector Fluid Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              {FEATURES_SHOWCASE.map((feat) => {
                const IconComponent = feat.icon;
                const isActive = activeFeature === feat.id;
                return (
                  <button
                    key={feat.id}
                    onClick={() => setActiveFeature(isActive ? null : feat.id)}
                    className={`oneui-fluid-btn px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'border-cyan-400/50 text-cyan-300 bg-cyan-500/15 shadow-inner'
                        : `${feat.btnTextColor} hover:text-white`
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{feat.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expanded Feature Detail Drawer */}
          {activeFeature && (() => {
            const feat = FEATURES_SHOWCASE.find((f) => f.id === activeFeature);
            if (!feat) return null;
            const Icon = feat.icon;
            return (
              <div className="oneui-liquid-dock rounded-2xl p-5 sm:p-6 space-y-4 border border-white/[0.08] animate-fadeIn">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`p-3 rounded-2xl oneui-liquid-card ${feat.iconColor} shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h4 className="text-base font-bold text-white">{feat.title}</h4>
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
                    className="oneui-fluid-btn w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white shrink-0"
                    title="Close description"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mathematical Formula (for Deterministic ATS) */}
                {feat.formula && (
                  <div className="oneui-liquid-card rounded-xl p-3.5 bg-black/40 border border-white/5">
                    <div className="text-[10px] uppercase tracking-wider font-mono text-emerald-400 font-bold mb-1">
                      Deterministic Formula (Zero Hallucination)
                    </div>
                    <code className="text-xs text-cyan-300 font-mono block break-all">
                      {feat.formula}
                    </code>
                  </div>
                )}

                {/* Technical Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {feat.keyPoints.map((point, idx) => (
                    <div key={idx} className="oneui-liquid-card rounded-xl p-3.5 flex items-start gap-2.5 border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300 leading-snug">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </section>

        {/* DUAL LIQUID GLASS DROPZONES */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 01: Job Description Card */}
          <div className="oneui-liquid-card rounded-[32px] p-7 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
                  01
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Job Description (JD PDF)</h2>
                  <p className="text-xs text-slate-400">
                    {jdLocked ? 'Card is locked • Benchmark role specification preserved' : 'Upload benchmark role specification'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setJdLocked(!jdLocked)}
                className={`oneui-fluid-btn w-[92px] h-8 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all shrink-0 ${jdLocked ? 'border-cyan-400/40 text-cyan-300 bg-cyan-500/15' : 'text-slate-400'
                  }`}
                title={jdLocked ? 'Click to unlock this card' : 'Pin card to protect this file'}
              >
                {jdLocked ? <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> : <Unlock className="w-3.5 h-3.5 shrink-0" />}
                <span>{jdLocked ? 'Pinned' : 'Pin File'}</span>
              </button>
            </div>

            <div
              onClick={() => {
                if (jdLocked) {
                  setValidationError({
                    status: 'LOCKED_CARD',
                    message: 'Job Description card is locked. Click the "Pinned" button above to unlock before replacing this file.'
                  });
                  return;
                }
                jdInputRef.current?.click();
              }}
              className={`oneui-liquid-dock rounded-2xl p-7 min-h-[175px] flex flex-col items-center justify-center text-center transition-all duration-300 ${jdLocked
                ? 'cursor-not-allowed opacity-90 border-cyan-400/30'
                : 'cursor-pointer group hover:border-cyan-400/30'
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
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 mx-auto flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/15">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-white break-all px-2">{jdFile.name}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-block text-[10px] text-cyan-300 uppercase font-mono tracking-widest bg-cyan-400/15 border border-cyan-400/30 px-3 py-0.5 rounded-full">
                      PDF Verified
                    </span>
                    {jdLocked && (
                      <span className="inline-block text-[10px] text-amber-300 font-semibold bg-amber-400/10 border border-amber-400/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Pinned
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-400/40 transition-all">
                    {jdLocked ? <Lock className="w-5 h-5 text-amber-400" /> : <Upload className="w-5 h-5" />}
                  </div>
                  <p className="text-sm font-medium text-slate-300">
                    {jdLocked ? (
                      <span className="text-amber-400 font-semibold">Card is Pinned • Unpin to upload JD</span>
                    ) : (
                      <>Click to select <span className="text-cyan-400 font-semibold">JD (.PDF only)</span></>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-500">Supports drag and drop up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* 02: Candidate Resume Card */}
          <div className="oneui-liquid-card rounded-[32px] p-7 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                  02
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Candidate Resume (PDF)</h2>
                  <p className="text-xs text-slate-400">
                    {resumeLocked ? 'Card is locked • Candidate dossier preserved' : 'Upload applicant dossier to cross-examine'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setResumePinned(!resumeLocked)}
                className={`oneui-fluid-btn w-[92px] h-8 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all shrink-0 ${resumeLocked ? 'border-emerald-400/40 text-emerald-300 bg-emerald-500/15' : 'text-slate-400'
                  }`}
                title={resumeLocked ? 'Click to unlock this card' : 'Pin card to protect this file'}
              >
                {resumeLocked ? <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Unlock className="w-3.5 h-3.5 shrink-0" />}
                <span>{resumeLocked ? 'Pinned' : 'Pin File'}</span>
              </button>
            </div>

            <div
              onClick={() => {
                if (resumeLocked) {
                  setValidationError({
                    status: 'LOCKED_CARD',
                    message: 'Candidate Resume card is locked. Click the "Pinned" button above to unlock before replacing this file.'
                  });
                  return;
                }
                resumeInputRef.current?.click();
              }}
              className={`oneui-liquid-dock rounded-2xl p-7 min-h-[175px] flex flex-col items-center justify-center text-center transition-all duration-300 ${resumeLocked
                ? 'cursor-not-allowed opacity-90 border-emerald-400/30'
                : 'cursor-pointer group hover:border-emerald-400/30'
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
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 mx-auto flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/15">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-white break-all px-2">{resumeFile.name}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-block text-[10px] text-emerald-300 uppercase font-mono tracking-widest bg-emerald-400/15 border border-emerald-400/30 px-3 py-0.5 rounded-full">
                      PDF Verified
                    </span>
                    {resumeLocked && (
                      <span className="inline-block text-[10px] text-amber-300 font-semibold bg-amber-400/10 border border-amber-400/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Pinned
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-slate-400 group-hover:text-emerald-300 group-hover:border-emerald-400/40 transition-all">
                    {resumeLocked ? <Lock className="w-5 h-5 text-amber-400" /> : <Upload className="w-5 h-5" />}
                  </div>
                  <p className="text-sm font-medium text-slate-300">
                    {resumeLocked ? (
                      <span className="text-amber-400 font-semibold">Card is Pinned • Unpin to upload Resume</span>
                    ) : (
                      <>Click to select <span className="text-emerald-400 font-semibold">Resume (.PDF only)</span></>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-500">Supports drag and drop up to 10MB</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PRIMARY ACTION BUTTONS: HERO ANALYZE & CLEAR UNPINNED FILE */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            disabled={isAnalyzing}
            onClick={() => executeAnalysis()}
            className="oneui-primary-pill px-10 py-4 rounded-full font-bold text-sm text-white flex items-center gap-3 disabled:opacity-40"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-5 h-5 animate-spin text-white" />
            ) : (
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            )}
            <span className="tracking-wide">
              {isAnalyzing ? 'Auditing Neural PDF Buffers...' : 'Analyze PDF ATS Match & Skill Evidence'}
            </span>
          </button>

          {((!jdLocked && Boolean(jdFile)) || (!resumeLocked && Boolean(resumeFile))) && (
            <button
              disabled={isAnalyzing}
              onClick={handleClearUnlockedFiles}
              className="oneui-fluid-btn px-6 py-4 rounded-full font-bold text-xs text-rose-400 hover:text-rose-300 flex items-center gap-2 border-rose-500/25 hover:border-rose-500/45"
              title="Clear unpinned file(s) while keeping pinned file(s) safe"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Clear Unpinned File</span>
            </button>
          )}
        </div>

        {/* VALIDATION OR SWAP ALERT NOTIFICATION */}
        {validationError && (
          <section className={`rounded-[28px] p-6 border backdrop-blur-2xl ${validationError.status === 'SWAPPED'
            ? 'bg-amber-950/30 border-amber-500/30 shadow-lg shadow-amber-500/10'
            : 'bg-rose-950/30 border-rose-500/30 shadow-lg shadow-rose-500/10'
            }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${validationError.status === 'SWAPPED' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  <AlertTriangle className="w-6 h-6 shrink-0" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {validationError.status === 'SWAPPED' ? 'Files Inverted! Swapped PDF Upload Detected' : 'PDF Validation Alert'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5">{validationError.message}</p>
                </div>
              </div>
              {validationError.status === 'SWAPPED' && (
                <button
                  onClick={handleSmartSwapAndAnalyze}
                  className="oneui-fluid-btn px-5 py-3 rounded-full text-xs font-bold text-amber-300 border-amber-500/30 flex items-center gap-2 hover:bg-amber-500/20"
                >
                  <RefreshCw className="w-4 h-4" /> Swap & Re-analyze Now
                </button>
              )}
            </div>
          </section>
        )}

        {/* ANALYSIS RESULTS DOSSIER */}
        {currentResult && (
          <section className="oneui-liquid-card rounded-[32px] p-6 sm:p-9 space-y-8 animate-fadeIn">

            {/* CENTERED CANDIDATE HERO HEADER */}
            <div className="flex flex-col items-center justify-center text-center pb-8 border-b border-white/[0.08]">
              <div className="flex flex-wrap items-center justify-center gap-3 mb-2.5">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {currentResult.candidateName}
                </h2>
                <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center gap-1.5 backdrop-blur-md">
                  <Flag className="w-3 h-3" />
                  {currentResult.nationality || 'Not Mentioned'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-cyan-400 font-medium">
                Target Role: <span className="text-white font-semibold">{currentResult.jobTitle}</span> <span className="text-slate-500 mx-1.5">•</span> <span className="text-slate-400">PDF: {currentResult.resumeFileName}</span>
              </p>
            </div>

            {/* HERO SCORE & CONTACT DOSSIER GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

              {/* Radial Liquid Gauge */}
              <div className="lg:col-span-4 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-8 lg:pb-0">
                <OneUiLiquidGauge score={currentResult.atsScore} liveBonus={currentResult.liveProjectBonus} />
              </div>

              {/* Candidate Contact Dossier Slabs */}
              <div className="lg:col-span-8 flex flex-col justify-center space-y-5">
                <div className="oneui-liquid-dock rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Extracted Identity & Verified Handles</span>
                  </div>

                  {/* Contact Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="oneui-liquid-card rounded-2xl p-3 flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-400/20 shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Phone</span>
                        <span className="text-xs font-semibold text-white truncate block">
                          {currentResult.phoneNumber || 'Not Provided'}
                        </span>
                      </div>
                    </div>

                    <div className="oneui-liquid-card rounded-2xl p-3 flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Email</span>
                        <span className="text-xs font-semibold text-white truncate block" title={currentResult.emailId}>
                          {currentResult.emailId || 'Not Provided'}
                        </span>
                      </div>
                    </div>

                    <div className="oneui-liquid-card rounded-2xl p-3 flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-400/20 shrink-0">
                        <Flag className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Nationality</span>
                        <span className="text-xs font-semibold text-white truncate block">
                          {currentResult.nationality || 'Not Mentioned'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Social Profiles Chips */}
                  <div className="pt-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2 font-medium">
                      Social & Portfolio Profiles ({(currentResult.socialProfiles || []).length} Detected in Resume)
                    </span>
                    {(currentResult.socialProfiles || []).length === 0 ? (
                      <span className="text-xs text-slate-500 italic">No social links detected in this PDF.</span>
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
                              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all hover:scale-105 ${getPlatformStyle(soc.platform)}`}
                            >
                              <Globe className="w-3.5 h-3.5 shrink-0" />
                              <span className="font-bold">{soc.platform}:</span>
                              <span className="font-normal truncate max-w-[170px]">{soc.handleOrUrl}</span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Live Deployed Projects & Repos (+5% Proof-of-Work Boost) */}
                  {(currentResult.liveProjectLinks || []).length > 0 && (
                    <div className="pt-3 border-t border-white/[0.06] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                          <Rocket className="w-3.5 h-3.5 text-emerald-400" />
                          Live Deployed Projects & Repos ({currentResult.liveProjectLinks.length} Verified • +{currentResult.liveProjectBonus || Math.min(10, currentResult.liveProjectLinks.length * 5)}% Score Boost)
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-400/25 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          Proof-of-Work Applied
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentResult.liveProjectLinks.map((proj, pIdx) => {
                          const rawLink = proj.liveUrl || '';
                          const href = rawLink.startsWith('http') ? rawLink : `https://${rawLink}`;
                          return (
                            <a
                              key={pIdx}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border text-emerald-300 border-emerald-400/30 bg-emerald-500/10 hover:border-emerald-400/60 transition-all group"
                              title={proj.description || proj.projectName}
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                              <span className="font-bold text-white">{proj.projectName}:</span>
                              <span className="text-emerald-300 font-mono text-[11px] truncate max-w-[210px]">{proj.liveUrl}</span>
                              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-full font-mono">+5% Boost</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* CHEAT SHIELD SECURITY AUDIT */}
                {currentResult.cheatDetection?.isSuspicious ? (
                  <div className="rounded-2xl p-4 bg-rose-950/40 border border-rose-500/40 flex items-start gap-3 shadow-lg shadow-rose-500/10">
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-rose-300">ATS Manipulation Detected</h4>
                      <p className="text-xs text-slate-300 mt-0.5">{currentResult.cheatDetection.reason}</p>
                    </div>
                  </div>
                ) : (
                  <div className="oneui-liquid-dock rounded-2xl p-3.5 flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-300 font-medium">
                      Neumo Integrity: Clean buffer. No white-text stuffing or invisible prompt injections found.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* THREE-COLUMN LIQUID EVIDENCE MATRIX */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3 border-t border-white/[0.08]">

              {/* Verified Skills */}
              <div className="oneui-liquid-dock rounded-[28px] p-5 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Verified Skills (Project Proof)
                  </h4>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                    {(currentResult.verifiedSkills || []).length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(currentResult.verifiedSkills || []).length === 0 ? (
                    <span className="text-xs text-slate-500 italic">None verified in projects</span>
                  ) : (
                    currentResult.verifiedSkills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-400/25 text-emerald-300 flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400" /> {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Unverified Skills */}
              <div className="oneui-liquid-dock rounded-[28px] p-5 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" /> Unverified (Just Listed)
                  </h4>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30">
                    {(currentResult.unverifiedSkills || []).length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(currentResult.unverifiedSkills || []).length === 0 ? (
                    <span className="text-xs text-slate-500 italic">No unverified skills</span>
                  ) : (
                    currentResult.unverifiedSkills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center gap-1.5">
                        <HelpCircle className="w-3 h-3 text-amber-400" /> {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="oneui-liquid-dock rounded-[28px] p-5 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> Missing Gap (Skill Gap)
                  </h4>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-400/30">
                    {(currentResult.missingSkills || []).length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(currentResult.missingSkills || []).length === 0 ? (
                    <span className="text-xs text-slate-500 italic">Zero skill gap!</span>
                  ) : (
                    currentResult.missingSkills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 border border-rose-400/25 text-rose-300 flex items-center gap-1.5">
                        <XCircle className="w-3 h-3 text-rose-400" /> {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* PERSONA SPECIFIC INTELLIGENCE PANEL */}
            {role === 'applicant' ? (
              <div className="oneui-liquid-dock rounded-[28px] p-6 space-y-3.5">
                <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Actionable Resume Improvement Roadmap
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  {(currentResult.applicantFeedback || []).map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="oneui-liquid-dock rounded-[28px] p-6 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Executive Hiring Summary
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {currentResult.recruiterSummary}
                  </p>
                </div>
                <div className="oneui-liquid-dock rounded-[28px] p-6 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Targeted Technical Interview Questions
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {(currentResult.interviewQuestions || []).map((q, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-mono font-semibold">Q{i + 1}:</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>
        )}

        {/* RECRUITER LIVE SESSION LEADERBOARD (Neumo Liquid Matrix) */}
        {role === 'recruiter' && (
          <section className="oneui-liquid-card rounded-[32px] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">Recruiter Live Session Leaderboard</h3>
                  <span className="text-[11px] font-semibold px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/25 text-emerald-300">
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
                    className="oneui-fluid-btn px-4 py-2 rounded-full text-xs font-semibold text-slate-300 flex items-center gap-2"
                  >
                    <ArrowDown className={`w-3.5 h-3.5 transition-transform ${sortOrder === 'asc' ? 'rotate-180 text-cyan-400' : 'text-emerald-400'}`} />
                    <span>Sort: {sortOrder === 'desc' ? 'Descending (High → Low)' : 'Ascending (Low → High)'}</span>
                  </button>

                  <button
                    onClick={handleDownloadCSV}
                    className="oneui-fluid-btn px-4 py-2 rounded-full text-xs font-bold text-emerald-300 border-emerald-500/30 flex items-center gap-2 hover:bg-emerald-500/20"
                  >
                    <Download className="w-3.5 h-3.5" /> Download CSV
                  </button>
                </div>
              )}
            </div>

            {sortedSessionHistory.length === 0 ? (
              <div className="oneui-liquid-dock rounded-2xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-slate-500">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-200">No PDF Candidates Scanned Yet in This Session</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Upload a JD PDF and a Resume PDF above and click <span className="text-cyan-400 font-semibold">"Analyze PDF ATS Match"</span> to populate this descending leaderboard.
                </p>
              </div>
            ) : (
              <div className="oneui-liquid-dock rounded-2xl overflow-x-auto p-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-[11px] uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4 font-semibold">Rank</th>
                      <th className="py-3.5 px-4 font-semibold">Candidate & Contact</th>
                      <th className="py-3.5 px-4 font-semibold">Nationality & Socials</th>
                      <th className="py-3.5 px-4 font-semibold">ATS Score ({sortOrder === 'desc' ? 'Desc ↓' : 'Asc ↑'})</th>
                      <th className="py-3.5 px-4 font-semibold">Skill Match (V / U / M)</th>
                      <th className="py-3.5 px-4 font-semibold">Cheat Shield</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-xs sm:text-sm">
                    {sortedSessionHistory.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-cyan-400 font-mono">#{idx + 1}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{item.candidateName}</div>
                          <div className="text-[11px] text-slate-400">{item.emailId || 'No Email'} • {item.phoneNumber || 'No Phone'}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-xs text-amber-300 font-medium">{item.nationality || 'Not Mentioned'}</div>
                          <div className="text-[11px] text-cyan-300 truncate max-w-[180px]">
                            {(item.socialProfiles || []).length > 0
                              ? item.socialProfiles.map((s) => s.platform).join(', ')
                              : 'No Social IDs'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-extrabold text-sm px-3 py-1 rounded-full border ${item.atsScore >= 75
                              ? 'text-emerald-300 border-emerald-400/30 bg-emerald-500/10'
                              : item.atsScore >= 50
                                ? 'text-amber-300 border-amber-400/30 bg-amber-500/10'
                                : 'text-rose-300 border-rose-400/30 bg-rose-500/10'
                              }`}>
                              {item.atsScore}%
                            </span>
                            {item.liveProjectBonus > 0 && (
                              <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/15 border border-emerald-400/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5" title={`Proof-of-Work: +${item.liveProjectBonus}% boost from live project links`}>
                                <Rocket className="w-2.5 h-2.5 text-emerald-400" /> +{item.liveProjectBonus}%
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs">
                          <span className="text-emerald-400 font-semibold">{(item.verifiedSkills || []).length}V</span> /{' '}
                          <span className="text-amber-400 font-semibold">{(item.unverifiedSkills || []).length}U</span> /{' '}
                          <span className="text-rose-400 font-semibold">{(item.missingSkills || []).length}M</span>
                        </td>
                        <td className="py-3.5 px-4">
                          {item.cheatDetection?.isSuspicious ? (
                            <span className="text-rose-400 font-bold flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5" /> Flagged
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> Clean
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setCurrentResult(item)}
                            className="oneui-fluid-btn px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5 text-cyan-400" /> View
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

      {/* API KEY CONFIGURATION MODAL (Neumo Liquid Glass) */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="oneui-liquid-card rounded-[32px] max-w-md w-full p-6 sm:p-7 border border-white/10 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                Gemini API Key Settings
              </h3>
              <button
                onClick={() => setShowKeyModal(false)}
                className="oneui-fluid-btn w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {serverHasKey
                ? 'Backend .env API Key is active. You do not need to provide a custom key unless you wish to override it.'
                : 'Enter your Google Gemini API key to enable direct multimodal PDF parsing.'}
            </p>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">Custom Gemini API Key</label>
              <input
                type="password"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full oneui-liquid-dock rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400/50"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => {
                  localStorage.removeItem('GEMINI_API_KEY');
                  setCustomKey('');
                  setShowKeyModal(false);
                }}
                className="oneui-fluid-btn px-4 py-2 rounded-full text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  if (customKey) localStorage.setItem('GEMINI_API_KEY', customKey);
                  setShowKeyModal(false);
                }}
                className="oneui-primary-pill px-5 py-2 rounded-full text-xs font-bold text-white"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER SECTION: COPYRIGHT RESERVATION */}
      <footer className="mt-auto w-full border-t border-white/[0.08] bg-[#07090e]/90 backdrop-blur-2xl py-6 px-4 sm:px-8 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white tracking-wide text-sm">
                Neumo<span className="text-cyan-400">ATS</span>
              </span>
              <span className="text-[10px] text-slate-400">Deterministic Multimodal ATS Engine</span>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <p className="font-semibold text-slate-200">
              &copy; {new Date().getFullYear()} Neumo Pvt Corporation. All rights reserved.
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Proprietary Inherent Stack Verification & Forensic Multimodal Audit Architecture
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
