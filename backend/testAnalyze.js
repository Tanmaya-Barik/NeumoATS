import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testBackendGemini() {
  const jdPath = path.join(__dirname, '../client/public/samples/Frontend_Lead_JD.pdf');
  const resumePath = path.join(__dirname, '../client/public/samples/Alex_Morgan_React_Resume.pdf');

  const jdBuffer = fs.readFileSync(jdPath);
  const resumeBuffer = fs.readFileSync(resumePath);

  console.log(`Loaded JD (${jdBuffer.length} bytes) and Resume (${resumeBuffer.length} bytes)`);

  const ai = new GoogleGenAI();

  const atsAnalysisSchema = {
    type: 'OBJECT',
    properties: {
      validationStatus: { type: 'STRING', enum: ['VALID', 'SWAPPED', 'BOTH_RESUMES', 'BOTH_JDS', 'INVALID'] },
      validationMessage: { type: 'STRING' },
      candidateName: { type: 'STRING' },
      jobTitle: { type: 'STRING' },
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
    required: ['validationStatus', 'validationMessage', 'candidateName', 'jobTitle', 'atsScore', 'verifiedSkills', 'unverifiedSkills', 'missingSkills', 'cheatDetection', 'applicantFeedback', 'recruiterSummary', 'interviewQuestions']
  };

  const prompt = `Analyze these two documents: Document 1 is uploaded as the Job Description, Document 2 is uploaded as the Candidate Resume. Classify validationStatus (VALID, SWAPPED, BOTH_RESUMES, BOTH_JDS, INVALID), extract candidate name, job title, ATS score, verified skills (with proof in projects/experience), unverified skills (only mentioned in skills section), missing skills, cheat detection, applicant feedback, recruiter summary, and interview questions.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: '### DOCUMENT 1 (Job Description):' },
          { inlineData: { data: jdBuffer.toString('base64'), mimeType: 'application/pdf' } },
          { text: '### DOCUMENT 2 (Candidate Resume):' },
          { inlineData: { data: resumeBuffer.toString('base64'), mimeType: 'application/pdf' } },
          { text: prompt },
        ]
      }
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: atsAnalysisSchema,
    }
  });

  console.log('Gemini PDF Result:\n', response.text);
}

testBackendGemini().catch(console.error);
