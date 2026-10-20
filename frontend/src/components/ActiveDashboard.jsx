import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Award,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Briefcase,
  User,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function ActiveDashboard({ result, personaMode }) {
  if (!result || result.validationStatus !== 'VALID') {
    return null;
  }

  const [copiedQuestions, setCopiedQuestions] = useState(false);

  const {
    atsScore,
    candidateName,
    jobTitle,
    resumeFileName,
    jdFileName,
    verifiedSkills = [],
    unverifiedSkills = [],
    missingSkills = [],
    cheatDetection = { isSuspicious: false, reason: '' },
    applicantFeedback = [],
    recruiterSummary = '',
    interviewQuestions = [],
    scannedAt,
  } = result;

  // Determine dynamic score colors
  let scoreColor = '#10b981'; // Neon Emerald
  let scoreLabel = 'Exceptional Match';
  let badgeStyle = 'text-accent-emerald border-accent-emerald/30 bg-accent-emerald/10';

  if (atsScore < 50) {
    scoreColor = '#ef4444'; // Crimson Coral
    scoreLabel = 'High Skill Gap';
    badgeStyle = 'text-accent-crimson border-accent-crimson/30 bg-accent-crimson/10';
  } else if (atsScore < 80) {
    scoreColor = '#f59e0b'; // Warm Amber
    scoreLabel = 'Moderate Fit';
    badgeStyle = 'text-accent-amber border-accent-amber/30 bg-accent-amber/10';
  }

  // SVG Gauge calculations
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (atsScore / 100) * circumference;

  const handleCopyQuestions = () => {
    if (!interviewQuestions.length) return;
    const text = interviewQuestions
      .map((q, i) => `${i + 1}. ${q}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedQuestions(true);
    setTimeout(() => setCopiedQuestions(false), 2000);
  };

  return (
    <section className="w-full my-8 space-y-8 neu-report-morph">
      {/* 3D Dashboard Master Card */}
      <div className="p-6 md:p-8 rounded-3xl neumo-raised border border-surface-lighter/40">
        
        {/* Top Header & 3D Gauge Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-surface-lighter/40">
          
          {/* Candidate & Target Role Info */}
          <div className="space-y-3 w-full lg:w-2/3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full border ${badgeStyle}`}>
                {scoreLabel}
              </span>
              <span className="text-xs text-mutedText flex items-center gap-1.5 neumo-inset-sm px-3 py-1 rounded-full">
                <Clock size={12} />
                {scannedAt ? new Date(scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live Scan'}
              </span>
              <span className="text-xs text-accent-cyan flex items-center gap-1 neumo-inset-sm px-3 py-1 rounded-full">
                Active Assessment
              </span>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-primaryText tracking-tight font-['Outfit']">
                {candidateName || 'Candidate Profile'}
              </h2>
              <p className="text-base font-semibold text-accent-cyan mt-0.5 flex items-center gap-2">
                <Briefcase size={16} />
                <span>{jobTitle || 'Target Position'}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-mutedText">
              <div className="p-2.5 rounded-xl neumo-inset-sm flex items-center gap-2 truncate">
                <span className="text-primaryText font-medium">Resume:</span>
                <span className="truncate text-slate-300">{resumeFileName}</span>
              </div>
              <div className="p-2.5 rounded-xl neumo-inset-sm flex items-center gap-2 truncate">
                <span className="text-primaryText font-medium">JD:</span>
                <span className="truncate text-slate-300">{jdFileName}</span>
              </div>
            </div>
          </div>

          {/* 3D Circular Neumorphic Gauge */}
          <div className="relative flex flex-col items-center justify-center shrink-0">
            {/* Outer carved ring with inset shadow */}
            <div className="w-48 h-48 rounded-full neumo-inset flex items-center justify-center p-3 relative shadow-[inset_10px_10px_20px_#171a1d,inset_-10px_-10px_20px_#2b3035]">
              
              {/* Animated SVG Ring */}
              <svg className="w-full h-full -rotate-90 transform">
                {/* Background Track */}
                <circle
                  cx="84"
                  cy="84"
                  r={radius}
                  stroke="#1c2024"
                  strokeWidth="12"
                  fill="transparent"
                  className="translate-x-3 translate-y-3"
                />
                {/* Dynamic Value Ring */}
                <circle
                  cx="84"
                  cy="84"
                  r={radius}
                  stroke={scoreColor}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out translate-x-3 translate-y-3"
                  style={{
                    filter: `drop-shadow(0 0 8px ${scoreColor}80)`
                  }}
                />
              </svg>

              {/* Inner raised tactile plate */}
              <div className="absolute w-28 h-28 rounded-full neumo-raised flex flex-col items-center justify-center border border-surface-lighter/30">
                <span
                  className="text-3xl font-extrabold font-['Outfit'] tracking-tight"
                  style={{ color: scoreColor }}
                >
                  {atsScore}%
                </span>
                <span className="text-[10px] uppercase font-bold text-mutedText tracking-wider mt-0.5">
                  ATS Score
                </span>
              </div>
            </div>
            <p className="text-xs text-mutedText mt-3 font-medium text-center">
              Skill Alignment Index
            </p>
          </div>
        </div>

        {/* Feature 5: Cheat / Manipulation Alert Card (Recruiter Shield) */}
        {cheatDetection.isSuspicious && (
          <div className="mt-8 p-6 rounded-3xl neumo-alert-crimson animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl neumo-inset flex items-center justify-center text-accent-crimson shrink-0 border border-accent-crimson/40">
                <ShieldAlert size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-red-200">
                    🚨 Manipulation / Keyword Stuffing Detected!
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-accent-crimson/30 text-accent-crimson border border-accent-crimson/50">
                    Recruiter Shield Alert
                  </span>
                </div>
                <p className="text-xs text-red-100/90 mt-1.5 leading-relaxed font-medium">
                  {cheatDetection.reason}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Feature 4: 3-Column Skill Evidence Matrix */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-primaryText tracking-tight font-['Outfit'] flex items-center gap-2">
              <TrendingUp size={18} className="text-accent-cyan" />
              <span>Skill Evidence Breakdown</span>
            </h3>
            <span className="text-xs text-mutedText">
              Evidence Verified vs Mentioned vs Missing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: ✅ Verified Skills (Green) */}
            <div className="p-5 rounded-2xl neumo-inset flex flex-col justify-between border border-surface-darker">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-surface-lighter/30 mb-3">
                  <div className="flex items-center gap-2 text-accent-emerald">
                    <CheckCircle size={17} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Verified Skills
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30">
                    {verifiedSkills.length}
                  </span>
                </div>
                <p className="text-[11px] text-mutedText mb-3">
                  Backed by concrete proof in Projects or Work Experience.
                </p>

                <div className="flex flex-wrap gap-2">
                  {verifiedSkills.length > 0 ? (
                    verifiedSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-medium skill-badge-verified flex items-center gap-1.5"
                      >
                        <Check size={11} className="text-accent-emerald" />
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-mutedText italic">
                      No verified skill evidence detected.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Column 2: ⚠️ Unverified Skills (Amber) */}
            <div className="p-5 rounded-2xl neumo-inset flex flex-col justify-between border border-surface-darker">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-surface-lighter/30 mb-3">
                  <div className="flex items-center gap-2 text-accent-amber">
                    <AlertTriangle size={17} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Unverified Skills
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-accent-amber/20 text-accent-amber border border-accent-amber/30">
                    {unverifiedSkills.length}
                  </span>
                </div>
                <p className="text-[11px] text-mutedText mb-3">
                  Mentioned in Skills list only, lacking supporting project evidence.
                </p>

                <div className="flex flex-wrap gap-2">
                  {unverifiedSkills.length > 0 ? (
                    unverifiedSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-medium skill-badge-unverified flex items-center gap-1.5"
                      >
                        <span>⚠️</span>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-mutedText italic">
                      All listed skills have backing evidence.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Column 3: ❌ Missing Skills (Crimson) */}
            <div className="p-5 rounded-2xl neumo-inset flex flex-col justify-between border border-surface-darker">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-surface-lighter/30 mb-3">
                  <div className="flex items-center gap-2 text-accent-crimson">
                    <XCircle size={17} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Missing Skills (Gap)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-accent-crimson/20 text-accent-crimson border border-accent-crimson/30">
                    {missingSkills.length}
                  </span>
                </div>
                <p className="text-[11px] text-mutedText mb-3">
                  Required by the Job Description but absent from candidate's resume.
                </p>

                <div className="flex flex-wrap gap-2">
                  {missingSkills.length > 0 ? (
                    missingSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-medium skill-badge-missing flex items-center gap-1.5"
                      >
                        <span>✕</span>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-accent-emerald font-medium flex items-center gap-1">
                      <CheckCircle size={12} /> Complete skill coverage!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 1 & 6: Role-Specific Intelligence Panel */}
        <div className="mt-8 pt-8 border-t border-surface-lighter/40">
          {personaMode === 'applicant' ? (
            /* APPLICANT MODE VIEW */
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl neumo-raised-sm text-accent-cyan">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primaryText">
                      Applicant Intelligence: Actionable Resume Optimization
                    </h3>
                    <p className="text-xs text-mutedText">
                      High-impact recommendations to bridge skill gaps and raise ATS ranking
                    </p>
                  </div>
                </div>
                <span className="text-xs text-accent-cyan font-bold px-3 py-1 rounded-full neumo-inset-sm">
                  Applicant Mode Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {applicantFeedback && applicantFeedback.length > 0 ? (
                  applicantFeedback.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl neumo-inset-sm border border-surface-darker flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-lg neumo-raised flex items-center justify-center text-accent-cyan font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-normal">
                        {tip}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-2xl neumo-inset text-xs text-mutedText italic col-span-2">
                    No specific feedback required; your resume shows exceptional alignment.
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* RECRUITER MODE VIEW */
            <div className="space-y-6 animate-fadeIn">
              {/* Recruiter Summary & Red Flags */}
              <div className="p-5 rounded-2xl neumo-raised-card border border-surface-lighter/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-accent-emerald">
                    <Award size={18} />
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Executive Hiring Recommendation
                    </h3>
                  </div>
                  <span className="text-xs text-accent-emerald font-bold px-3 py-1 rounded-full neumo-inset-sm">
                    Recruiter Mode Active
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {recruiterSummary || 'Candidate meets baseline criteria for review.'}
                </p>

                {/* Clean security badge if no cheats detected */}
                {!cheatDetection.isSuspicious && (
                  <div className="mt-3 pt-3 border-t border-surface-lighter/30 flex items-center gap-2 text-xs text-accent-emerald">
                    <ShieldCheck size={16} />
                    <span>Recruiter Shield: Clean submission. No white-text, keyword stuffing, or verbatim JD plagiarism detected.</span>
                  </div>
                )}
              </div>

              {/* Targeted Technical Interview Questions */}
              <div className="p-5 rounded-2xl neumo-inset border border-surface-darker">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-accent-cyan">
                    <HelpCircle size={18} />
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Targeted Technical Interview Questions
                    </h3>
                  </div>
                  <button
                    onClick={handleCopyQuestions}
                    className="px-3 py-1.5 rounded-xl neumo-btn text-xs font-semibold text-primaryText hover:text-accent-cyan flex items-center gap-1.5 transition"
                  >
                    {copiedQuestions ? (
                      <>
                        <Check size={13} className="text-accent-emerald" />
                        <span className="text-accent-emerald">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy Questions</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-mutedText mb-3">
                  AI-generated technical inquiries specifically targeting the candidate's unverified or missing skills:
                </p>

                <div className="space-y-2.5">
                  {interviewQuestions && interviewQuestions.length > 0 ? (
                    interviewQuestions.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl neumo-raised-sm border border-surface-lighter/30 flex items-start gap-3"
                      >
                        <span className="w-5 h-5 rounded-full neumo-inset flex items-center justify-center text-accent-cyan font-bold text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed">{q}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-mutedText italic">
                      No custom questions needed.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
