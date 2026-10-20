/**
 * Utility to load sample PDF files directly into File objects for instant zero-click testing
 */
export async function loadSampleFile(sampleUrl, fileName) {
  const response = await fetch(sampleUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch sample PDF from ${sampleUrl}`);
  }
  const blob = await response.blob();
  return new File([blob], fileName, { type: 'application/pdf' });
}

export const SAMPLE_PRESETS = [
  {
    id: 'lead-match',
    label: '✨ High Match (Alex Morgan - 85%+)',
    description: 'Senior React Developer matching Frontend Lead JD with high verified skill evidence.',
    jdUrl: '/samples/Frontend_Lead_JD.pdf',
    jdName: 'Frontend_Lead_JD.pdf',
    resumeUrl: '/samples/Alex_Morgan_React_Resume.pdf',
    resumeName: 'Alex_Morgan_React_Resume.pdf',
  },
  {
    id: 'junior-gap',
    label: '📉 Low Match (Jordan Lee - Skill Gap)',
    description: 'Junior candidate with limited matching stack, demonstrating skill gap analysis.',
    jdUrl: '/samples/Frontend_Lead_JD.pdf',
    jdName: 'Frontend_Lead_JD.pdf',
    resumeUrl: '/samples/Jordan_Lee_Junior_Resume.pdf',
    resumeName: 'Jordan_Lee_Junior_Resume.pdf',
  },
  {
    id: 'swapped-mistake',
    label: '🔄 Swapped Files (Auto-Swap Test)',
    description: 'Accidentally places Resume in JD slot and JD in Resume slot to trigger auto-swap.',
    jdUrl: '/samples/Alex_Morgan_React_Resume.pdf',
    jdName: 'Alex_Morgan_React_Resume.pdf',
    resumeUrl: '/samples/Frontend_Lead_JD.pdf',
    resumeName: 'Frontend_Lead_JD.pdf',
  },
  {
    id: 'manipulated-cheat',
    label: '🚨 Cheat / Manipulation Alert',
    description: 'Candidate using keyword stuffing and verbatim JD copying to trigger Recruiter Shield.',
    jdUrl: '/samples/Frontend_Lead_JD.pdf',
    jdName: 'Frontend_Lead_JD.pdf',
    resumeUrl: '/samples/Manipulated_Candidate_Resume.pdf',
    resumeName: 'Manipulated_Candidate_Resume.pdf',
  },
];
