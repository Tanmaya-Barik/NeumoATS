import React from 'react';
import { UserCheck, Briefcase, Zap, Key, Sparkles, Database, Layers } from 'lucide-react';
import { SAMPLE_PRESETS } from '../utils/sampleLoader';

export default function Header({
  personaMode,
  setPersonaMode,
  onOpenKeyModal,
  serverHasKey,
  onLoadPreset,
  isScanning,
}) {
  return (
    <header className="w-full pt-6 pb-4">
      {/* Top Banner & Persona Switcher */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-surface-lighter/40">
        
        {/* Brand & Badges */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl neumo-raised flex items-center justify-center text-accent-cyan border border-accent-cyan/20">
            <Zap size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-primaryText font-['Outfit']">
                Neumo<span className="text-accent-cyan">ATS</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full neumo-inset text-accent-cyan border border-accent-cyan/20">
                3D Dark Edition
              </span>
            </div>
            <p className="text-xs text-mutedText flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-accent-emerald">
                <Database size={11} /> Zero-Database (RAM Only)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Layers size={11} /> Multimodal Gemini AI
              </span>
            </p>
          </div>
        </div>

        {/* Feature 1: Dual Persona Mode Switcher (Deeply carved neumorphic pill switch) */}
        <div className="flex items-center">
          <div className="p-1.5 rounded-2xl neumo-inset flex items-center gap-1 border border-surface-darker">
            <button
              onClick={() => setPersonaMode('applicant')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                personaMode === 'applicant'
                  ? 'neumo-raised text-accent-cyan border border-accent-cyan/30 shadow-glow-cyan'
                  : 'text-mutedText hover:text-primaryText'
              }`}
              title="Focuses on actionable resume tips & skill gaps"
            >
              <UserCheck size={15} />
              <span>Applicant Mode</span>
            </button>
            <button
              onClick={() => setPersonaMode('recruiter')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                personaMode === 'recruiter'
                  ? 'neumo-raised text-accent-emerald border border-accent-emerald/30 shadow-glow-emerald'
                  : 'text-mutedText hover:text-primaryText'
              }`}
              title="Focuses on candidate evaluation, cheat alerts & interview questions"
            >
              <Briefcase size={15} />
              <span>Recruiter Mode</span>
            </button>
          </div>
        </div>

        {/* Preset Selector & API Key Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Presets Dropdown */}
          <div className="relative group">
            <button
              disabled={isScanning}
              className="px-3.5 py-2 rounded-xl neumo-btn text-xs font-medium text-primaryText flex items-center gap-2 border border-surface-lighter hover:text-accent-cyan"
            >
              <Sparkles size={14} className="text-accent-cyan" />
              <span>Load 1-Click Demo</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-72 neumo-raised-card p-2 rounded-2xl border border-surface-lighter hidden group-hover:block z-40 shadow-2xl">
              <div className="text-[10px] uppercase font-bold tracking-wider text-mutedText px-3 py-1.5 border-b border-surface-lighter/50 mb-1">
                Preset Test Scenarios
              </div>
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onLoadPreset(preset)}
                  disabled={isScanning}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-surface-lighter/30 text-xs transition flex flex-col gap-0.5 group/item"
                >
                  <span className="font-semibold text-primaryText group-hover/item:text-accent-cyan">
                    {preset.label}
                  </span>
                  <span className="text-[11px] text-mutedText line-clamp-1">
                    {preset.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenKeyModal}
            className={`p-2.5 rounded-xl neumo-btn text-xs flex items-center gap-1.5 border ${
              serverHasKey
                ? 'text-accent-emerald border-accent-emerald/30'
                : 'text-accent-amber border-accent-amber/30 animate-pulse'
            }`}
            title="Configure Gemini API Key"
          >
            <Key size={15} />
            <span className="hidden sm:inline font-medium">API</span>
          </button>
        </div>
      </div>
    </header>
  );
}
