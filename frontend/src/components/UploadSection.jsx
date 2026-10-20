import React, { useRef, useState } from 'react';
import { Pin, FileText, UploadCloud, X, CheckCircle2, Lock, Unlock, Play, RefreshCw, AlertCircle } from 'lucide-react';

export default function UploadSection({
  jdFile,
  setJdFile,
  jdPinned,
  setJdPinned,
  resumeFile,
  setResumeFile,
  resumePinned,
  setResumePinned,
  onRunScan,
  isScanning,
  errorMsg,
}) {
  const jdInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [jdDragOver, setJdDragOver] = useState(false);
  const [resumeDragOver, setResumeDragOver] = useState(false);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const handleJdDrop = (e) => {
    e.preventDefault();
    setJdDragOver(false);
    if (jdPinned) return;
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type === 'application/pdf') {
      setJdFile(files[0]);
    }
  };

  const handleResumeDrop = (e) => {
    e.preventDefault();
    setResumeDragOver(false);
    if (resumePinned) return;
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type === 'application/pdf') {
      setResumeFile(files[0]);
    }
  };

  return (
    <section className="w-full my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Placeholder: Job Description (JD) PDF upload box */}
        <div
          onDragOver={(e) => { e.preventDefault(); if (!jdPinned) setJdDragOver(true); }}
          onDragLeave={() => setJdDragOver(false)}
          onDrop={handleJdDrop}
          className={`relative p-5 rounded-3xl neumo-inset border transition-all duration-300 flex flex-col justify-between min-h-[220px] ${
            jdDragOver
              ? 'border-accent-cyan shadow-[inset_8px_8px_16px_#171a1d,inset_-8px_-8px_16px_#2b3035,0_0_15px_rgba(56,189,248,0.3)]'
              : jdPinned
              ? 'border-accent-cyan/40 bg-[#1e2226]'
              : 'border-surface-darker/60'
          }`}
        >
          {/* Top Bar inside Box: Label & Pin Toggle */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl neumo-raised-sm text-accent-cyan">
                <FileText size={16} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-primaryText tracking-wide flex items-center gap-1.5">
                  Job Description (JD)
                  <span className="text-[10px] text-mutedText font-normal">(Target Role PDF)</span>
                </h2>
              </div>
            </div>

            {/* 📌 Pin / Lock Feature */}
            <button
              onClick={() => setJdPinned(!jdPinned)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                jdPinned
                  ? 'neumo-pinned text-accent-cyan'
                  : 'neumo-btn text-mutedText hover:text-primaryText'
              }`}
              title={jdPinned ? 'JD is Pinned (Will stay locked across scans)' : 'Click to Pin JD for multiple resume scans'}
            >
              {jdPinned ? <Lock size={12} className="text-accent-cyan" /> : <Pin size={12} />}
              <span>{jdPinned ? '📌 JD Pinned' : 'Pin File'}</span>
            </button>
          </div>

          {/* Center Area: Upload or File Info */}
          <input
            type="file"
            ref={jdInputRef}
            accept=".pdf,application/pdf"
            onChange={(e) => {
              if (e.target.files?.[0]) setJdFile(e.target.files[0]);
            }}
            className="hidden"
          />

          {jdFile ? (
            <div className="p-4 rounded-2xl neumo-raised-card flex items-center justify-between border border-surface-lighter/50">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl neumo-inset flex items-center justify-center text-accent-cyan shrink-0">
                  <FileText size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-primaryText truncate max-w-[200px] sm:max-w-[260px]">
                    {jdFile.name}
                  </p>
                  <p className="text-xs text-mutedText flex items-center gap-2 mt-0.5">
                    <span>{formatFileSize(jdFile.size)}</span>
                    <span className="text-accent-emerald flex items-center gap-1">
                      <CheckCircle2 size={11} /> Ready
                    </span>
                  </p>
                </div>
              </div>

              {!jdPinned && (
                <button
                  onClick={() => setJdFile(null)}
                  disabled={isScanning}
                  className="p-2 rounded-xl neumo-btn text-mutedText hover:text-accent-crimson transition shrink-0 ml-2"
                  title="Remove Job Description"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          ) : (
            <div
              onClick={() => jdInputRef.current?.click()}
              className="py-6 px-4 rounded-2xl border-2 border-dashed border-surface-lighter/50 hover:border-accent-cyan/50 cursor-pointer flex flex-col items-center justify-center text-center transition group"
            >
              <div className="w-12 h-12 rounded-2xl neumo-raised flex items-center justify-center text-mutedText group-hover:text-accent-cyan transition mb-2">
                <UploadCloud size={24} />
              </div>
              <p className="text-sm font-medium text-primaryText">
                Drop Job Description PDF here
              </p>
              <p className="text-xs text-mutedText mt-1">
                or <span className="text-accent-cyan underline">browse files</span> from your computer
              </p>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-3 text-[11px] text-mutedText/80 flex items-center justify-between">
            <span>Slot: Target Job Requisition</span>
            {jdPinned && <span className="text-accent-cyan font-medium">Locked for Batch Testing</span>}
          </div>
        </div>

        {/* Right Placeholder: Candidate Resume/CV PDF upload box */}
        <div
          onDragOver={(e) => { e.preventDefault(); if (!resumePinned) setResumeDragOver(true); }}
          onDragLeave={() => setResumeDragOver(false)}
          onDrop={handleResumeDrop}
          className={`relative p-5 rounded-3xl neumo-inset border transition-all duration-300 flex flex-col justify-between min-h-[220px] ${
            resumeDragOver
              ? 'border-accent-cyan shadow-[inset_8px_8px_16px_#171a1d,inset_-8px_-8px_16px_#2b3035,0_0_15px_rgba(56,189,248,0.3)]'
              : resumePinned
              ? 'border-accent-emerald/40 bg-[#1e2226]'
              : 'border-surface-darker/60'
          }`}
        >
          {/* Top Bar inside Box: Label & Pin Toggle */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl neumo-raised-sm text-accent-emerald">
                <FileText size={16} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-primaryText tracking-wide flex items-center gap-1.5">
                  Candidate Resume / CV
                  <span className="text-[10px] text-mutedText font-normal">(Applicant PDF)</span>
                </h2>
              </div>
            </div>

            {/* 📌 Pin / Lock Feature */}
            <button
              onClick={() => setResumePinned(!resumePinned)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                resumePinned
                  ? 'neumo-pinned text-accent-emerald'
                  : 'neumo-btn text-mutedText hover:text-primaryText'
              }`}
              title={resumePinned ? 'Resume is Pinned (Will stay locked while testing multiple JDs)' : 'Click to Pin Resume'}
            >
              {resumePinned ? <Lock size={12} className="text-accent-emerald" /> : <Pin size={12} />}
              <span>{resumePinned ? '📌 Resume Pinned' : 'Pin File'}</span>
            </button>
          </div>

          {/* Center Area: Upload or File Info */}
          <input
            type="file"
            ref={resumeInputRef}
            accept=".pdf,application/pdf"
            onChange={(e) => {
              if (e.target.files?.[0]) setResumeFile(e.target.files[0]);
            }}
            className="hidden"
          />

          {resumeFile ? (
            <div className="p-4 rounded-2xl neumo-raised-card flex items-center justify-between border border-surface-lighter/50">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl neumo-inset flex items-center justify-center text-accent-emerald shrink-0">
                  <FileText size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-primaryText truncate max-w-[200px] sm:max-w-[260px]">
                    {resumeFile.name}
                  </p>
                  <p className="text-xs text-mutedText flex items-center gap-2 mt-0.5">
                    <span>{formatFileSize(resumeFile.size)}</span>
                    <span className="text-accent-emerald flex items-center gap-1">
                      <CheckCircle2 size={11} /> Ready
                    </span>
                  </p>
                </div>
              </div>

              {!resumePinned && (
                <button
                  onClick={() => setResumeFile(null)}
                  disabled={isScanning}
                  className="p-2 rounded-xl neumo-btn text-mutedText hover:text-accent-crimson transition shrink-0 ml-2"
                  title="Remove Candidate Resume"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          ) : (
            <div
              onClick={() => resumeInputRef.current?.click()}
              className="py-6 px-4 rounded-2xl border-2 border-dashed border-surface-lighter/50 hover:border-accent-emerald/50 cursor-pointer flex flex-col items-center justify-center text-center transition group"
            >
              <div className="w-12 h-12 rounded-2xl neumo-raised flex items-center justify-center text-mutedText group-hover:text-accent-emerald transition mb-2">
                <UploadCloud size={24} />
              </div>
              <p className="text-sm font-medium text-primaryText">
                Drop Candidate Resume PDF here
              </p>
              <p className="text-xs text-mutedText mt-1">
                or <span className="text-accent-emerald underline">browse files</span> from your computer
              </p>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-3 text-[11px] text-mutedText/80 flex items-center justify-between">
            <span>Slot: Candidate Curriculum Vitae</span>
            {resumePinned && <span className="text-accent-emerald font-medium">Locked for Multi-JD Testing</span>}
          </div>
        </div>
      </div>

      {/* Error Message if any */}
      {errorMsg && (
        <div className="mt-4 p-4 rounded-2xl neumo-alert-crimson flex items-center gap-3 text-sm text-red-200">
          <AlertCircle size={18} className="text-accent-crimson shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Action Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={onRunScan}
          disabled={!jdFile || !resumeFile || isScanning}
          className={`px-8 py-4 rounded-2xl font-bold text-base flex items-center gap-3 transition-all duration-300 ${
            !jdFile || !resumeFile || isScanning
              ? 'opacity-50 cursor-not-allowed neumo-inset text-mutedText'
              : 'neumo-btn-primary hover:scale-[1.02] cursor-pointer'
          }`}
        >
          {isScanning ? (
            <>
              <RefreshCw size={20} className="animate-spin text-accent-cyan" />
              <span>Scanning Multimodal Vectors & Auditing Proof...</span>
            </>
          ) : (
            <>
              <Play size={20} className="fill-current" />
              <span>Run ATS Intelligence Scan</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
