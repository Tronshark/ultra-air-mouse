import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, BookOpen, X } from 'lucide-react';

export const FirstRunDialog: React.FC = () => {
  const { showFirstRunDialog, setShowFirstRunDialog, navigateToManualPage } = useApp();

  if (!showFirstRunDialog) return null;

  const handleGoToManual = () => {
    localStorage.setItem('penmouse_welcomed', 'true');
    setShowFirstRunDialog(false);
    navigateToManualPage('how_to_use');
  };

  const handleDismiss = () => {
    localStorage.setItem('penmouse_welcomed', 'true');
    setShowFirstRunDialog(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Welcome to PenMouse S</h2>
            <p className="text-xs text-blue-400 font-medium">Samsung Galaxy S Pen Air Mouse</p>
          </div>
        </div>

        <div className="text-sm text-slate-300 space-y-3 leading-relaxed mb-6 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
          <p>
            Hi! It looks like you're running the app for the first time. Please keep in mind that this is an{' '}
            <strong className="text-white font-semibold">experimental app</strong> that pushes the S Pen's functionality to the limits allowed by the system.
          </p>
          <p>
            Because of system limits, not everything will work and not always reliably. Before you start using the app, please read the included manual to set up your phone properly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleGoToManual}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-2xl shadow-lg shadow-blue-600/30 transition active:scale-98"
          >
            <BookOpen className="w-4 h-4" />
            Go to the manual
          </button>
          <button
            onClick={handleDismiss}
            className="sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition active:scale-98"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
