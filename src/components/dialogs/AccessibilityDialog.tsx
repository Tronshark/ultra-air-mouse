import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, X, Check, ExternalLink } from 'lucide-react';

export const AccessibilityDialog: React.FC = () => {
  const { showAccessibilityDialog, setShowAccessibilityDialog, settings, updateSetting } = useApp();

  if (!showAccessibilityDialog) return null;

  const handleEnable = () => {
    updateSetting('accessibilityEnabled', true);
    setShowAccessibilityDialog(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative">
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={() => setShowAccessibilityDialog(false)}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Accessibility Service</h2>
            <p className="text-xs text-indigo-400 font-medium">Required for cursor overlay & touch simulation</p>
          </div>
        </div>

        <div className="text-sm text-slate-300 space-y-3 leading-relaxed mb-6">
          <p>
            PenMouse S requires Android's Accessibility Service permission to function correctly. This permission allows the app to:
          </p>

          <ul className="text-xs text-slate-300 space-y-2 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
              <span><strong className="text-white">Display cursor overlay:</strong> Render the customizable pointer over other apps, status bars, and the lock screen.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
              <span><strong className="text-white">Simulate touch input:</strong> Translate S Pen button clicks and motion into real finger taps and scrolls.</span>
            </li>
          </ul>

          <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 leading-normal">
            🛡️ <strong>Privacy Promise:</strong> PenMouse S does <em>not</em> read, collect, store, or share any screen content, keystrokes, or personal data.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleEnable}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-2xl shadow-lg shadow-blue-600/30 transition active:scale-98"
          >
            <Check className="w-4 h-4" />
            Enable Permission
          </button>
          <button
            onClick={() => setShowAccessibilityDialog(false)}
            className="sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition active:scale-98"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
