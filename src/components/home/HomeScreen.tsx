import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ModeStatus } from '../../types';
import {
  HelpCircle,
  Settings,
  ChevronRight,
  Shield,
  MousePointer,
  Crosshair,
  ScrollText,
  Power,
  Sparkles,
  Info,
  CheckCircle,
  AlertCircle,
  Play,
  RotateCw,
  Smartphone,
  Download,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    mode,
    setMode,
    settings,
    updateSetting,
    setShowAccessibilityDialog,
    setShowUnsupportedDialog,
    setShowInstallDialog,
    navigateToManualPage,
    triggerClickAtCursor,
  } = useApp();

  const [sandboxClicks, setSandboxClicks] = useState(0);
  const [testToggle, setTestToggle] = useState(false);
  const [testSlider, setTestSlider] = useState(50);

  const modes: Array<{ id: ModeStatus; label: string; icon: React.ElementType }> = [
    { id: 'Off', label: 'Off', icon: Power },
    { id: 'Mouse', label: 'Mouse', icon: MousePointer },
    { id: 'Point', label: 'Point', icon: Crosshair },
    { id: 'Scroll', label: 'Scroll', icon: ScrollText },
  ];

  return (
    <div className="min-h-screen pb-28 pt-4 px-4 max-w-xl mx-auto flex flex-col gap-4">
      {/* App Header */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => navigateToManualPage('about')}
          className="flex items-center gap-3 text-left group"
        >
          <div className="relative">
            <img
              src="/logo.png"
              alt="PenMouse S Logo"
              className="w-13 h-13 rounded-2xl p-1 bg-slate-900 border border-slate-700/80 shadow-md transition-transform group-hover:scale-105"
            />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-100 group-hover:text-blue-400 transition">
                PenMouse S
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-900/60 border border-blue-600/50 text-blue-300">
                v1.2.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Samsung Galaxy S Pen Air Mouse</p>
          </div>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowInstallDialog(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-xs text-white font-semibold shadow-md shadow-blue-600/30 transition active:scale-95"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>

          <button
            onClick={() => setShowUnsupportedDialog(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700/70 transition"
          >
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>Device Check</span>
          </button>
        </div>
      </div>

      {/* S Pen Connectivity Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400">
            <img src="/manual_assets/spen_connected_icon_dark.png" alt="S Pen" className="w-5 h-5 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">S Pen Bluetooth</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-400 font-medium">Ready</span>
            </div>
            <span className="text-[11px] text-slate-400">Air Actions & Gyroscope Standby</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-slate-200">{settings.sPenBattery}%</span>
          <span className="text-[10px] block text-slate-500">Stylus Battery</span>
        </div>
      </div>

      {/* Step 1 */}
      <div className="bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm hover:border-slate-700/80 transition">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-400">Step 1</span>
              <span className="text-slate-600 text-xs">•</span>
              <button
                onClick={() => navigateToManualPage('step1')}
                className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
              >
                More info
              </button>
            </div>
            <p className="text-sm font-medium text-slate-200">
              Disable system S Pen gestures
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Prevents Samsung One UI from triggering default gestures (like camera shortcuts) while moving the air mouse.
            </p>
          </div>

          <button
            onClick={() => navigateToManualPage('step1')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition active:scale-95 flex-shrink-0"
          >
            <Settings className="w-3.5 h-3.5 text-blue-400" />
            <span>Guide</span>
          </button>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm hover:border-slate-700/80 transition">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-400">Step 2</span>
              <span className="text-slate-600 text-xs">•</span>
              <button
                onClick={() => navigateToManualPage('step2')}
                className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
              >
                More info
              </button>
            </div>
            <p className="text-sm font-medium text-slate-200">
              Pin the app in the recents screen
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Locks PenMouse S in memory so Android's battery optimizer doesn't terminate background air gesture tracking.
            </p>
          </div>

          <button
            onClick={() => navigateToManualPage('step2')}
            className="p-2 rounded-2xl hover:bg-slate-800 text-slate-400 hover:text-white transition flex-shrink-0"
            aria-label="View Step 2"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Step 3 */}
      <div className="bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm hover:border-slate-700/80 transition">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-400">Step 3</span>
              <span className="text-slate-600 text-xs">•</span>
              <button
                onClick={() => navigateToManualPage('step3')}
                className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
              >
                More info
              </button>
            </div>
            <p className="text-sm font-medium text-slate-200">
              Enable PenMouse S accessibility service
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              {settings.accessibilityEnabled ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" /> Service Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> Permission Required
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              if (!settings.accessibilityEnabled) {
                setShowAccessibilityDialog(true);
              } else {
                updateSetting('accessibilityEnabled', false);
              }
            }}
            className={`w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out relative flex-shrink-0 ${
              settings.accessibilityEnabled ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                settings.accessibilityEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Step 4 - Mode Selector (Material 3 Segmented Button Row) */}
      <div className="bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800/80 rounded-3xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Step 4</span>
            <span className="text-slate-600 text-xs">•</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">Choose Mode</span>
          </div>
          <span className="text-xs font-mono text-blue-400 font-semibold">Active: {mode}</span>
        </div>

        {/* Segmented Button Group */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-3">
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl transition-all select-none ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'scale-110' : ''}`} />
                <span className="text-xs">{m.label}</span>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-amber-300/90 bg-amber-950/40 border border-amber-900/50 p-2.5 rounded-xl leading-normal">
          ⚠️ Remember to REMOVE the S Pen from the phone and WAIT for a successful connection BEFORE turning on Air Mouse.
        </p>
      </div>

      {/* Interactive Live Testing Playground & Device Sandbox */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">Live Touch & Click Sandbox</h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {mode === 'Off' ? 'Enable a mode to test' : `${mode} mode active`}
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-3">
          Hover your air mouse cursor or tap with the virtual S Pen button below to test responsiveness.
        </p>

        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300">Tap / Click Counter:</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold font-mono text-blue-400">{sandboxClicks}</span>
              <button
                onClick={() => setSandboxClicks((c) => c + 1)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium shadow active:scale-95 transition"
              >
                Click Target
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-300">Test Interactive Toggle:</span>
            <button
              onClick={() => setTestToggle(!testToggle)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                testToggle ? 'bg-emerald-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  testToggle ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Test Sensitivity Slider:</span>
              <span className="font-mono text-blue-400">{testSlider}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={testSlider}
              onChange={(e) => setTestSlider(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Scroll Keymapper Demo Feed */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">S Pen Scroll Keymapper</span>
                <span className="text-[10px] text-slate-400">
                  1x: {settings.scrollSingleClickAction.replace('_', ' ')} • 2x: {settings.scrollDoubleClickAction.replace('_', ' ')}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                {settings.scrollStepDistance}px / click
              </span>
            </div>

            {/* Scrollable list to test page movement */}
            <div className="h-36 overflow-y-auto bg-slate-900 rounded-xl p-2.5 border border-slate-800 space-y-2 scroll-smooth">
              {[
                { title: 'Article #1: S Pen Air Actions Explained', tag: 'Hardware' },
                { title: 'Article #2: Customizing Single & Double Click Scroll', tag: 'Keymapper' },
                { title: 'Article #3: Gyroscope Calibration & Sleep Timeout', tag: 'Battery' },
                { title: 'Article #4: Android Accessibility Service Simulation', tag: 'System' },
                { title: 'Article #5: Comparing Note & Ultra S Pen Latency', tag: 'Benchmark' },
                { title: 'Article #6: Pro-tips for Wrist Tilt Gesture Scrolling', tag: 'Guide' },
              ].map((item, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-300 truncate">{item.title}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting Link Button */}
      <button
        onClick={() => navigateToManualPage('troubleshooting')}
        className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 shadow transition active:scale-98"
      >
        <HelpCircle className="w-4 h-4 text-amber-400" />
        <span>Troubleshooting & Connection Checklist</span>
      </button>
    </div>
  );
};
