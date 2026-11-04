import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, ExternalLink, X, Smartphone, CheckCircle2, Ban } from 'lucide-react';

export const UnsupportedDeviceDialog: React.FC = () => {
  const { showUnsupportedDialog, setShowUnsupportedDialog } = useApp();

  if (!showUnsupportedDialog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={() => setShowUnsupportedDialog(false)}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Device Compatibility</h2>
            <p className="text-xs text-amber-400 font-medium">Samsung S Pen with Bluetooth & Gyroscope required</p>
          </div>
        </div>

        <div className="text-sm text-slate-300 space-y-3 leading-relaxed mb-6">
          <p>
            This app requires a Samsung Galaxy device equipped with an S Pen that supports{' '}
            <strong className="text-white">Bluetooth Low Energy (BLE) and a built-in Gyroscope</strong> (Air Actions).
          </p>

          <div className="bg-slate-800/70 rounded-2xl p-4 border border-slate-700/60 space-y-3">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Officially Supported Devices
              </div>
              <ul className="text-xs text-slate-300 space-y-1 pl-6 list-disc">
                <li>Samsung Galaxy Note 10 / Note 10+ / Note 20 / Note 20 Ultra</li>
                <li>Samsung Galaxy S20 Ultra, S21 Ultra, S22 Ultra, S23 Ultra, S24 Ultra</li>
                <li>Samsung Galaxy Tab S6, Tab S7, Tab S8, Tab S9, Tab S10 (excludes FE models)</li>
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-700/60">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider mb-1.5">
                <Ban className="w-4 h-4" />
                Unsupported Hardware Notice
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                <strong className="text-white">Galaxy S25 Ultra</strong> and newer models are <strong className="text-rose-300">not supported</strong> because Samsung removed Bluetooth connectivity and the gyroscope from the S Pen in this generation. Non-Samsung styluses (Apple Pencil, surface pens, etc.) are also incompatible with the Samsung S Pen Remote SDK.
              </p>
            </div>
          </div>

          <a
            href="https://www.samsung.com/us/support/answer/ANS10003221/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 underline"
          >
            <span>Learn more on Samsung's official Air Actions support page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <button
          onClick={() => setShowUnsupportedDialog(false)}
          className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/30 transition active:scale-98"
        >
          I understand
        </button>
      </div>
    </div>
  );
};
