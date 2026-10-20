import React, { useState } from 'react';
import { Key, ShieldCheck, X, Check, AlertCircle } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, currentKey, onSaveKey, serverHasKey }) {
  const [inputKey, setInputKey] = useState(currentKey || '');
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(inputKey.trim());
    setStatusMsg('API Key updated successfully for current session!');
    setTimeout(() => {
      setStatusMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md neumo-raised p-6 rounded-2xl border border-surface-lighter relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl neumo-btn text-mutedText hover:text-primaryText"
          title="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl neumo-inset text-accent-cyan">
            <Key size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primaryText">Gemini API Key</h3>
            <p className="text-xs text-mutedText">RAM & Session Configuration</p>
          </div>
        </div>

        {serverHasKey ? (
          <div className="mb-4 p-3 rounded-xl neumo-inset flex items-center gap-2.5 text-xs text-accent-emerald border border-accent-emerald/20">
            <ShieldCheck size={16} className="shrink-0" />
            <span>Backend environment has a valid <strong>GEMINI_API_KEY</strong> configured. You do not need to provide one unless you wish to override it.</span>
          </div>
        ) : (
          <div className="mb-4 p-3 rounded-xl neumo-inset flex items-center gap-2.5 text-xs text-accent-amber border border-accent-amber/20">
            <AlertCircle size={16} className="shrink-0" />
            <span>No backend GEMINI_API_KEY detected. Enter your Gemini API key below to enable AI parsing.</span>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-semibold text-mutedText mb-2 uppercase tracking-wider">
            Custom API Key (Optional)
          </label>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-4 py-3 rounded-xl neumo-inset text-primaryText placeholder-mutedText/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan text-sm font-mono"
          />
        </div>

        {statusMsg && (
          <div className="mb-4 text-xs text-center text-accent-emerald font-medium animate-pulse">
            {statusMsg}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl neumo-btn text-sm font-medium text-mutedText hover:text-primaryText"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl neumo-btn-primary flex items-center gap-2 text-sm font-semibold"
          >
            <Check size={16} /> Save Key
          </button>
        </div>
      </div>
    </div>
  );
}
