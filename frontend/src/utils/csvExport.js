/**
 * Utility to export session candidates to CSV
 */
export function exportSessionToCSV(sessionList) {
  if (!sessionList || sessionList.length === 0) return;

  const headers = [
    'Ascending Rank',
    'Candidate Name',
    'Target Job Title',
    'ATS Score',
    'Resume File Name',
    'JD File Name',
    'Verified Skills Count',
    'Verified Skills',
    'Unverified Skills Count',
    'Unverified Skills',
    'Missing Skills Count',
    'Missing Skills',
    'Cheat Detected',
    'Cheat Reason',
    'Recruiter Summary',
    'Scanned At'
  ];

  const escapeCSV = (str) => {
    if (str === null || str === undefined) return '""';
    const stringified = String(str).replace(/"/g, '""');
    return `"${stringified}"`;
  };

  const rows = sessionList.map((item, index) => {
    return [
      index + 1,
      escapeCSV(item.candidateName),
      escapeCSV(item.jobTitle),
      item.atsScore,
      escapeCSV(item.resumeFileName),
      escapeCSV(item.jdFileName),
      item.verifiedSkills?.length || 0,
      escapeCSV((item.verifiedSkills || []).join('; ')),
      item.unverifiedSkills?.length || 0,
      escapeCSV((item.unverifiedSkills || []).join('; ')),
      item.missingSkills?.length || 0,
      escapeCSV((item.missingSkills || []).join('; ')),
      item.cheatDetection?.isSuspicious ? 'YES' : 'NO',
      escapeCSV(item.cheatDetection?.reason || ''),
      escapeCSV(item.recruiterSummary || ''),
      escapeCSV(new Date(item.scannedAt).toLocaleString())
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `NeumoATS_Session_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
