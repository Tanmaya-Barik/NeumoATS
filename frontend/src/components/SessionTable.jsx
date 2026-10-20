import React from 'react';
import {
  Download,
  Eye,
  Trash2,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Clock,
  ArrowUpDown,
  FileSpreadsheet,
} from 'lucide-react';
import { exportSessionToCSV } from '../utils/csvExport';

export default function SessionTable({
  sessionScans,
  activeScanId,
  onSelectScan,
  onClearSession,
}) {
  if (!sessionScans || sessionScans.length === 0) {
    return (
      <section className="w-full my-8">
        <div className="p-8 rounded-3xl neumo-inset border border-surface-darker text-center">
          <div className="w-12 h-12 rounded-2xl neumo-raised flex items-center justify-center text-mutedText mx-auto mb-3">
            <FileSpreadsheet size={24} />
          </div>
          <h3 className="text-base font-bold text-primaryText">
            Live Session Comparison Table (RAM Only)
          </h3>
          <p className="text-xs text-mutedText mt-1 max-w-md mx-auto">
            Scan results will automatically accumulate here in strict ascending ATS Score order (lowest score first).
          </p>
        </div>
      </section>
    );
  }

  // Feature 7 Constraint: Strict Ascending Sort by atsScore (Lowest ATS Score at top #1 -> Highest at bottom)
  const sortedScans = [...sessionScans].sort((a, b) => a.atsScore - b.atsScore);

  const handleExport = () => {
    exportSessionToCSV(sortedScans);
  };

  return (
    <section className="w-full my-8 space-y-4 animate-fadeIn">
      {/* Table Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl neumo-raised border border-surface-lighter/40">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-primaryText font-['Outfit'] flex items-center gap-2">
              <TrendingUp size={18} className="text-accent-cyan" />
              <span>Live In-Memory Comparison Matrix</span>
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full neumo-inset text-accent-cyan">
              {sortedScans.length} {sortedScans.length === 1 ? 'Candidate' : 'Candidates'}
            </span>
          </div>
          <p className="text-xs text-mutedText mt-0.5 flex items-center gap-1.5">
            <span className="text-accent-cyan font-semibold">Strict Ascending Sort (Asc ↑):</span>
            <span>Lowest ATS Score at top (#1) → Highest ATS Score at bottom</span>
          </p>
        </div>

        {/* Action Buttons: Export CSV & Reset */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl neumo-btn text-xs font-bold text-accent-cyan flex items-center gap-2 border border-accent-cyan/30 hover:scale-[1.02] shadow-glow-cyan"
            title="Download full candidate comparison matrix to CSV"
          >
            <Download size={15} />
            <span>📥 Download Session CSV</span>
          </button>

          <button
            onClick={onClearSession}
            className="p-2.5 rounded-xl neumo-btn text-xs text-mutedText hover:text-accent-crimson transition"
            title="Clear all session results from RAM"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* 3D Neumorphic Table Container */}
      <div className="rounded-3xl neumo-raised overflow-hidden border border-surface-lighter/40 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-lighter/50 bg-[#1c2024]/70 text-[11px] font-extrabold uppercase tracking-wider text-mutedText">
                <th className="py-4 px-4 text-center w-12">#</th>
                <th className="py-4 px-4">Candidate Name</th>
                <th className="py-4 px-4">Target Role</th>
                <th className="py-4 px-4">Resume File</th>
                <th className="py-4 px-4">
                  <div className="flex items-center gap-1 text-accent-cyan">
                    <span>ATS Score (Asc ↑)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-4 px-4">Verified / Unverified / Missing</th>
                <th className="py-4 px-4">Cheat Status</th>
                <th className="py-4 px-4">Scanned Time</th>
                <th className="py-4 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-lighter/20 text-xs">
              {sortedScans.map((scan, index) => {
                const isActive = scan.id === activeScanId;

                // Color based on score
                let scoreBadge = 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/30';
                if (scan.atsScore < 50) {
                  scoreBadge = 'text-accent-crimson bg-accent-crimson/10 border-accent-crimson/30';
                } else if (scan.atsScore < 80) {
                  scoreBadge = 'text-accent-amber bg-accent-amber/10 border-accent-amber/30';
                }

                return (
                  <tr
                    key={scan.id || index}
                    className={`transition-all duration-200 ${
                      isActive
                        ? 'bg-[#1e2328] shadow-[inset_4px_4px_8px_#171a1d,inset_-4px_-4px_8px_#2b3035] border-l-4 border-l-accent-cyan'
                        : 'hover:bg-[#252a2f]'
                    }`}
                  >
                    {/* Index (#) */}
                    <td className="py-4 px-4 text-center font-bold text-mutedText">
                      #{index + 1}
                    </td>

                    {/* Candidate Name */}
                    <td className="py-4 px-4 font-semibold text-primaryText">
                      <div className="flex items-center gap-2">
                        <span>{scan.candidateName || 'Unknown'}</span>
                        {isActive && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-accent-cyan/20 text-accent-cyan font-bold">
                            Active
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Target Role */}
                    <td className="py-4 px-4 text-slate-300 font-medium max-w-[160px] truncate">
                      {scan.jobTitle || 'Role'}
                    </td>

                    {/* Resume File */}
                    <td className="py-4 px-4 text-mutedText max-w-[160px] truncate" title={scan.resumeFileName}>
                      {scan.resumeFileName}
                    </td>

                    {/* ATS Score (Ascending) */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-xs border ${scoreBadge}`}>
                          {scan.atsScore}%
                        </span>
                        {/* Mini bar */}
                        <div className="w-16 h-1.5 rounded-full neumo-inset hidden md:block overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${scan.atsScore}%`,
                              backgroundColor:
                                scan.atsScore >= 80
                                  ? '#10b981'
                                  : scan.atsScore >= 50
                                  ? '#f59e0b'
                                  : '#ef4444',
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Skills Count */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-semibold text-accent-emerald bg-accent-emerald/10 border border-accent-emerald/20"
                          title={`${scan.verifiedSkills?.length || 0} Verified`}
                        >
                          ✓ {scan.verifiedSkills?.length || 0}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-semibold text-accent-amber bg-accent-amber/10 border border-accent-amber/20"
                          title={`${scan.unverifiedSkills?.length || 0} Unverified`}
                        >
                          ⚠️ {scan.unverifiedSkills?.length || 0}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-semibold text-accent-crimson bg-accent-crimson/10 border border-accent-crimson/20"
                          title={`${scan.missingSkills?.length || 0} Missing`}
                        >
                          ✕ {scan.missingSkills?.length || 0}
                        </span>
                      </div>
                    </td>

                    {/* Cheat Status */}
                    <td className="py-4 px-4">
                      {scan.cheatDetection?.isSuspicious ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold text-accent-crimson bg-accent-crimson/20 border border-accent-crimson/40 flex items-center gap-1 w-fit animate-pulse">
                          <ShieldAlert size={12} />
                          <span>Flagged</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-accent-emerald bg-accent-emerald/10 border border-accent-emerald/20 flex items-center gap-1 w-fit">
                          <ShieldCheck size={12} />
                          <span>Clean</span>
                        </span>
                      )}
                    </td>

                    {/* Scanned Time */}
                    <td className="py-4 px-4 text-mutedText text-[11px]">
                      {scan.scannedAt
                        ? new Date(scan.scannedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })
                        : 'Just now'}
                    </td>

                    {/* Action: Interactive Recall [View Above] */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => onSelectScan(scan)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition mx-auto ${
                          isActive
                            ? 'neumo-inset text-accent-cyan border border-accent-cyan/30'
                            : 'neumo-btn text-mutedText hover:text-primaryText hover:border-accent-cyan/40'
                        }`}
                        title="Load this candidate into the Active Dashboard above"
                      >
                        <Eye size={13} />
                        <span>View Above</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
