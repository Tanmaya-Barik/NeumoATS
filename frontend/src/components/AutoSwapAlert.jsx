import React from 'react';
import { ArrowLeftRight, AlertTriangle, AlertOctagon, RefreshCw, XCircle } from 'lucide-react';

export default function AutoSwapAlert({
  validationResult,
  onAutoSwapAndRescan,
  onDismiss,
  isRescanning,
}) {
  if (!validationResult || validationResult.validationStatus === 'VALID') {
    return null;
  }

  const { validationStatus, validationMessage } = validationResult;

  if (validationStatus === 'SWAPPED') {
    return (
      <div className="w-full my-6 p-6 rounded-3xl neumo-alert-amber border-2 border-accent-amber/50 animate-fadeIn">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl neumo-inset flex items-center justify-center text-accent-amber shrink-0 border border-accent-amber/30">
              <AlertTriangle size={26} className="animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-amber-200">
                  Hold on! Files Appear Swapped
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-accent-amber/20 text-accent-amber border border-accent-amber/40">
                  Auto-Swap Detector
                </span>
              </div>
              <p className="text-xs text-amber-100/90 mt-1 max-w-2xl leading-relaxed">
                {validationMessage ||
                  'You placed a Candidate Resume in the Job Description box and a Job Description in the Candidate Resume box. Swapped data has NOT been added to your session comparison table.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={onDismiss}
              className="px-3.5 py-2.5 rounded-xl neumo-btn text-xs font-medium text-mutedText hover:text-primaryText"
            >
              Dismiss
            </button>
            <button
              onClick={onAutoSwapAndRescan}
              disabled={isRescanning}
              className="px-5 py-3 rounded-2xl neumo-btn-primary flex items-center gap-2.5 text-xs font-bold shadow-glow-cyan text-accent-cyan border border-accent-cyan/40 hover:scale-[1.02] cursor-pointer"
            >
              {isRescanning ? (
                <>
                  <RefreshCw size={16} className="animate-spin text-accent-cyan" />
                  <span>Swapping & Rescanning...</span>
                </>
              ) : (
                <>
                  <ArrowLeftRight size={16} className="text-accent-cyan" />
                  <span>🔄 Fix & Swap Automatically</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle BOTH_RESUMES, BOTH_JDS, or INVALID
  let icon = <AlertOctagon size={24} className="text-accent-crimson" />;
  let title = 'Document Validation Error';
  let badgeText = 'Validation Check';

  if (validationStatus === 'BOTH_RESUMES') {
    title = 'Both Files Are Resumes';
    badgeText = 'Duplicate Type';
  } else if (validationStatus === 'BOTH_JDS') {
    title = 'Both Files Are Job Descriptions';
    badgeText = 'Duplicate Type';
  } else if (validationStatus === 'INVALID') {
    title = 'Unrecognized Document Content';
    badgeText = 'Invalid Upload';
  }

  return (
    <div className="w-full my-6 p-6 rounded-3xl neumo-alert-crimson border-2 border-accent-crimson/50 animate-fadeIn">
      <div className="flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl neumo-inset flex items-center justify-center text-accent-crimson shrink-0 border border-accent-crimson/30">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-red-200">{title}</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-accent-crimson/20 text-accent-crimson border border-accent-crimson/40">
                {badgeText}
              </span>
            </div>
            <p className="text-xs text-red-100/90 mt-1 max-w-2xl leading-relaxed">
              {validationMessage ||
                'Please check your uploaded files. One box must contain a Job Description (target role) and the other must contain a Candidate Resume/CV.'}
            </p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="px-4 py-2.5 rounded-xl neumo-btn text-xs font-semibold text-mutedText hover:text-primaryText"
        >
          Acknowledge & Replace File
        </button>
      </div>
    </div>
  );
}
