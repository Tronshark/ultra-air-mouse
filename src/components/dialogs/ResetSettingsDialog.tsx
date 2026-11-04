import React from 'react';
import { useApp } from '../../context/AppContext';
import { RotateCcw, X } from 'lucide-react';

export const ResetSettingsDialog: React.FC = () => {
  const { showResetDialog, setShowResetDialog, resetSettings } = useApp();

  if (!showResetDialog) return null;

  const handleConfirm = () => {
    resetSettings();
    setShowResetDialog(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative">
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={() => setShowResetDialog(false)}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Reset settings?</h2>
            <p className="text-xs text-rose-400 font-medium">Restore default preferences</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
          Are you sure you want to reset all settings to their default values? This will restore standard sensitivity, cursor size, cursor theme, and timing delays.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-medium py-3 px-4 rounded-2xl shadow-lg shadow-rose-600/30 transition active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={() => setShowResetDialog(false)}
            className="sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition active:scale-98"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
