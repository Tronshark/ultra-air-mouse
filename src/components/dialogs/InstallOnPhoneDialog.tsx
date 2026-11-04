import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { QRCodeSVG } from 'qrcode.react';
import {
  Smartphone,
  Download,
  Copy,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Share2,
} from 'lucide-react';

export const InstallOnPhoneDialog: React.FC = () => {
  const { showInstallDialog, setShowInstallDialog } = useApp();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk'>('pwa');

  if (!showInstallDialog) return null;

  // URL for testing on mobile device
  const appUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-3agfnh4dxes7dt7zgbfl25-489207790963.asia-east1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setShowInstallDialog(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 text-slate-100 shadow-2xl relative">
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={() => setShowInstallDialog(false)}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dialog Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Test on Your Phone</h2>
            <p className="text-xs text-blue-400 font-medium">Install to Home Screen or Download APK</p>
          </div>
        </div>

        {/* Tabs: PWA vs Native APK */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-4">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition ${
              activeTab === 'pwa'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📲 Install Web App (PWA)
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition ${
              activeTab === 'apk'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📦 Download Android APK
          </button>
        </div>

        {/* PWA TAB */}
        {activeTab === 'pwa' && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            {/* Direct install trigger if browser supports it */}
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-98"
              >
                <Download className="w-5 h-5" />
                <span>Tap to Install on Home Screen</span>
              </button>
            )}

            {isInstalled && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-2xl text-emerald-300 flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>This application is already installed in Standalone mode!</span>
              </div>
            )}

            {/* QR Code & Scan instructions */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-white p-2.5 rounded-2xl flex-shrink-0 shadow-md">
                <QRCodeSVG
                  value={appUrl}
                  size={120}
                  level="M"
                  includeMargin={false}
                />
              </div>

              <div className="space-y-2 flex-1 text-center sm:text-left">
                <span className="font-bold text-slate-200 block text-xs">
                  Scan with Samsung Camera
                </span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Open your phone's camera app or QR scanner and point it at this QR code to launch the app directly on your phone.
                </p>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 text-[11px] font-semibold transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>URL Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy App URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Browser Step Instructions */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                How to Add to Home Screen:
              </span>

              {/* Samsung Internet */}
              <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-1">
                <span className="font-semibold text-slate-200 block text-[11px]">
                  Samsung Internet Browser (Recommended)
                </span>
                <p className="text-[11px] text-slate-400">
                  1. Tap the <strong>Menu (☰)</strong> icon in the bottom right corner.<br />
                  2. Tap <strong>+ Add page to</strong> → choose <strong>Home screen</strong> (or tap the <strong>Install</strong> badge in the address bar).
                </p>
              </div>

              {/* Google Chrome */}
              <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-1">
                <span className="font-semibold text-slate-200 block text-[11px]">
                  Google Chrome on Android
                </span>
                <p className="text-[11px] text-slate-400">
                  1. Tap the <strong>⋮ (three dots)</strong> menu in the top right.<br />
                  2. Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* NATIVE APK TAB */}
        {activeTab === 'apk' && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="p-3.5 bg-blue-950/40 rounded-2xl border border-blue-800/50 space-y-1.5">
              <span className="font-bold text-blue-300 block text-xs">
                Native Android Accessibility Service
              </span>
              <p className="text-[11px] text-slate-300">
                To control the mouse over <em>all</em> apps on your Samsung phone (including Instagram, YouTube, lock screen), you can download the official native Android build by Jojczak.
              </p>
            </div>

            <div className="space-y-2">
              {/* GitHub Releases APK */}
              <a
                href="https://github.com/jojczak/PenMouseS/releases"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-blue-400">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs block group-hover:text-blue-400 transition">
                      Download APK (GitHub Releases)
                    </span>
                    <span className="text-[10px] text-slate-400">Direct .apk download for Galaxy devices</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </a>

              {/* Google Play Store */}
              <a
                href="https://play.google.com/store/apps/details?id=pl.jojczak.penmouses"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-emerald-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs block group-hover:text-emerald-400 transition">
                      Google Play Store
                    </span>
                    <span className="text-[10px] text-slate-400">Install via Google Play for supported phones</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </a>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 block">Installing the .apk:</span>
              <p>
                When downloading the APK directly, tap <strong>Open</strong> and allow <em>Install unknown apps</em> for your browser if prompted. Then open PenMouse S, follow Steps 1-3, and enable Air Mouse!
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-slate-800">
          <button
            onClick={() => setShowInstallDialog(false)}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
