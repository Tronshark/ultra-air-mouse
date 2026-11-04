import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, X, Check } from 'lucide-react';

export const AnalyticsDialog: React.FC = () => {
  const { showAnalyticsDialog, setShowAnalyticsDialog, updateSetting } = useApp();

  if (!showAnalyticsDialog) return null;

  const handleAllow = () => {
    updateSetting('analyticsEnabled', true);
    setShowAnalyticsDialog(false);
  };

  const handleDeny = () => {
    updateSetting('analyticsEnabled', false);
    setShowAnalyticsDialog(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative">
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={handleDeny}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Help Us Improve the App</h2>
            <p className="text-xs text-cyan-400 font-medium">Anonymous Diagnostic & Usage Data</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
          Do you allow the app to collect anonymous diagnostic and usage data? This helps us detect issues, crash reports, and improve the app's performance on different Samsung devices.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleAllow}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-2xl shadow-lg shadow-blue-600/30 transition active:scale-98"
          >
            <Check className="w-4 h-4" />
            Allow
          </button>
          <button
            onClick={handleDeny}
            className="sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition active:scale-98"
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  );
};
