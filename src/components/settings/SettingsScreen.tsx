import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CursorType } from '../../types';
import {
  MousePointer,
  Crosshair,
  ScrollText,
  Sliders,
  RotateCcw,
  Upload,
  AlertTriangle,
  Bell,
  Shield,
  BarChart3,
  Check,
  Smartphone,
  Download,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    settingsTab,
    setSettingsTab,
    settings,
    updateSetting,
    setShowResetDialog,
    setShowAccessibilityDialog,
    setShowInstallDialog,
    setCustomCursor,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs: Array<{ id: typeof settingsTab; label: string; icon: React.ElementType }> = [
    { id: 'mouse', label: 'Mouse', icon: MousePointer },
    { id: 'point', label: 'Point', icon: Crosshair },
    { id: 'scroll', label: 'Scroll', icon: ScrollText },
    { id: 'general', label: 'General', icon: Sliders },
  ];

  const cursorTypes: Array<{ id: CursorType; label: string; src: string }> = [
    { id: 'Light', label: 'Light', src: '/light.png' },
    { id: 'Dark', label: 'Dark', src: '/dark.png' },
    { id: 'Retro', label: 'Retro', src: '/retro.png' },
    { id: 'SPen', label: 'S Pen', src: '/spen.png' },
    { id: 'Custom', label: 'Custom', src: settings.customCursorUrl || '/light.png' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Oops! The selected file isn't a supported image format.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomCursor(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen pb-28 pt-4 px-4 max-w-xl mx-auto flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Settings</h1>
          <p className="text-xs text-slate-400">Configure air mouse, cursors & sensitivity</p>
        </div>
        <button
          onClick={() => setShowResetDialog(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs font-medium transition active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = settingsTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSettingsTab(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Hidden file input for custom cursor */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* MOUSE TAB */}
      {settingsTab === 'mouse' && (
        <div className="space-y-4">
          {/* Cursor Preview & Selector */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Cursor Icon
            </span>

            {/* Live Preview Box */}
            <div className="h-32 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden mb-3">
              <div
                className="transition-all duration-150 filter drop-shadow-md"
                style={{
                  opacity: settings.mouseCursorAlpha,
                }}
              >
                <img
                  src={
                    settings.mouseCursorType === 'Custom' && settings.customCursorUrl
                      ? settings.customCursorUrl
                      : cursorTypes.find((c) => c.id === settings.mouseCursorType)?.src || '/light.png'
                  }
                  alt="Cursor Preview"
                  style={{
                    width: `${settings.mouseCursorSize}px`,
                    height: `${settings.mouseCursorSize}px`,
                    objectFit: 'contain',
                  }}
                />
              </div>
              <span className="absolute bottom-2 right-3 text-[10px] text-slate-500 font-mono">
                {settings.mouseCursorSize}dp • {Math.round(settings.mouseCursorAlpha * 100)}%
              </span>
            </div>

            {/* Icon Options */}
            <div className="grid grid-cols-5 gap-2">
              {cursorTypes.map((item) => {
                const isSelected = settings.mouseCursorType === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'Custom' && !settings.customCursorUrl) {
                        fileInputRef.current?.click();
                      } else {
                        updateSetting('mouseCursorType', item.id);
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/15 text-blue-400 font-bold'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center mb-1">
                      <img src={item.src} alt={item.label} className="max-w-full max-h-full object-contain" />
                    </div>
                    <span className="text-[11px] truncate w-full text-center">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom file change button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-medium flex items-center justify-center gap-1.5 transition"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>{settings.customCursorUrl ? 'Change Custom Cursor Image' : 'Upload Custom Cursor Image'}</span>
            </button>
          </div>

          {/* Sensitivity Slider */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-200">Sensitivity:</span>
              <span className="font-mono text-blue-400 font-bold">{settings.mouseSensitivity}</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={settings.mouseSensitivity}
              onChange={(e) => updateSetting('mouseSensitivity', Number(e.target.value))}
              className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Precise (1)</span>
              <span>Default (50)</span>
              <span>Fast (100)</span>
            </div>
          </div>

          {/* Size Slider */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-200">Cursor size:</span>
              <span className="font-mono text-blue-400 font-bold">{settings.mouseCursorSize} dp</span>
            </div>
            <input
              type="range"
              min="20"
              max="250"
              value={settings.mouseCursorSize}
              onChange={(e) => updateSetting('mouseCursorSize', Number(e.target.value))}
              className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>20 dp</span>
              <span>Default (60 dp)</span>
              <span>250 dp</span>
            </div>
          </div>

          {/* Opacity Slider */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-200">Cursor opacity:</span>
              <span className="font-mono text-blue-400 font-bold">
                {Math.round(settings.mouseCursorAlpha * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.0"
              step="0.05"
              value={settings.mouseCursorAlpha}
              onChange={(e) => updateSetting('mouseCursorAlpha', Number(e.target.value))}
              className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Inactivity Hide Delay */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-200">Auto-hide Inactivity:</span>
              <span className="font-mono text-blue-400 font-bold">
                {settings.mouseCursorHideDelay >= 305
                  ? 'Keep cursor visible'
                  : `Hide after ${settings.mouseCursorHideDelay}s`}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="305"
              step="5"
              value={settings.mouseCursorHideDelay}
              onChange={(e) => updateSetting('mouseCursorHideDelay', Number(e.target.value))}
              className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">
              Automatically hides the cursor after inactivity so it doesn't obstruct media or reading.
            </span>
          </div>

          {/* Gyroscope Sleep */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-3">
                <p className="text-xs font-semibold text-slate-200">
                  Stylus Gyroscope Sleep Mode
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Disable stylus gyroscope 1 minute after hiding cursor
                </p>
              </div>
              <button
                onClick={() => updateSetting('mouseSleepEnabled', !settings.mouseSleepEnabled)}
                className={`w-12 h-6.5 rounded-full p-0.5 transition-colors relative flex-shrink-0 ${
                  settings.mouseSleepEnabled ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    settings.mouseSleepEnabled ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-2">
              <p>
                Press the S Pen button and wait a moment to reactivate the gyroscope after inactivity. If cursor hiding above is disabled, the gyroscope will turn off after 5 minutes.
              </p>
              {!settings.mouseSleepEnabled && (
                <p className="text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  Warning: Continuous use of the S Pen's gyroscope may quickly drain the stylus battery.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* POINT TAB */}
      {settingsTab === 'point' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Point Cursor Icon
            </span>

            <div className="h-32 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden mb-3">
              <div
                className="transition-all duration-150 filter drop-shadow-md"
                style={{
                  opacity: settings.pointCursorAlpha,
                }}
              >
                <img
                  src={
                    settings.pointCursorType === 'Custom' && settings.customCursorUrl
                      ? settings.customCursorUrl
                      : cursorTypes.find((c) => c.id === settings.pointCursorType)?.src || '/light.png'
                  }
                  alt="Point Cursor Preview"
                  style={{
                    width: `${settings.pointCursorSize}px`,
                    height: `${settings.pointCursorSize}px`,
                    objectFit: 'contain',
                  }}
                />
              </div>
              <span className="absolute bottom-2 right-3 text-[10px] text-slate-500 font-mono">
                {settings.pointCursorSize}dp • {Math.round(settings.pointCursorAlpha * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {cursorTypes.map((item) => {
                const isSelected = settings.pointCursorType === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => updateSetting('pointCursorType', item.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/15 text-blue-400 font-bold'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center mb-1">
                      <img src={item.src} alt={item.label} className="max-w-full max-h-full object-contain" />
                    </div>
                    <span className="text-[11px] truncate w-full text-center">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Point Size */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-200">Point cursor size:</span>
              <span className="font-mono text-blue-400 font-bold">{settings.pointCursorSize} dp</span>
            </div>
            <input
              type="range"
              min="20"
              max="250"
              value={settings.pointCursorSize}
              onChange={(e) => updateSetting('pointCursorSize', Number(e.target.value))}
              className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Point Opacity */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-200">Point cursor opacity:</span>
              <span className="font-mono text-blue-400 font-bold">
                {Math.round(settings.pointCursorAlpha * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.0"
              step="0.05"
              value={settings.pointCursorAlpha}
              onChange={(e) => updateSetting('pointCursorAlpha', Number(e.target.value))}
              className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* SCROLL TAB */}
      {settingsTab === 'scroll' && (
        <div className="space-y-4">
          {/* Keymapper Header & Presets */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  ⌨️
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">S Pen Button Keymapper</h3>
                  <p className="text-[11px] text-slate-400">Customize single click and double click actions</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                Active
              </span>
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Quick Presets:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  {
                    name: 'Standard',
                    desc: '1x: Down • 2x: Up',
                    single: 'scroll_down' as const,
                    double: 'scroll_up' as const,
                  },
                  {
                    name: 'Inverted',
                    desc: '1x: Up • 2x: Down',
                    single: 'scroll_up' as const,
                    double: 'scroll_down' as const,
                  },
                  {
                    name: 'Reader',
                    desc: '1x: PageDn • 2x: PageUp',
                    single: 'page_down' as const,
                    double: 'page_up' as const,
                  },
                  {
                    name: 'Quick Top',
                    desc: '1x: Down • 2x: To Top',
                    single: 'scroll_down' as const,
                    double: 'scroll_top' as const,
                  },
                ].map((preset) => {
                  const isCurrent =
                    settings.scrollSingleClickAction === preset.single &&
                    settings.scrollDoubleClickAction === preset.double;
                  return (
                    <button
                      key={preset.name}
                      onClick={() => {
                        updateSetting('scrollSingleClickAction', preset.single);
                        updateSetting('scrollDoubleClickAction', preset.double);
                      }}
                      className={`p-2 rounded-xl text-left border transition ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-500/15 text-blue-300'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-semibold text-xs block text-slate-200">{preset.name}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{preset.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Single Click Selector */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">Single Click Action:</span>
                <span className="text-[11px] font-mono text-blue-400">
                  {settings.scrollSingleClickAction.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <select
                value={settings.scrollSingleClickAction}
                onChange={(e) => updateSetting('scrollSingleClickAction', e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="scroll_down">▼ Scroll Down</option>
                <option value="scroll_up">▲ Scroll Up</option>
                <option value="page_down">⇟ Page Down (3/4 Screen)</option>
                <option value="page_up">⇞ Page Up (3/4 Screen)</option>
                <option value="scroll_bottom">⤓ Scroll to Very Bottom</option>
                <option value="scroll_top">⤒ Scroll to Top of Page</option>
                <option value="none">Disabled</option>
              </select>
            </div>

            {/* Double Click Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">Double Click Action:</span>
                <span className="text-[11px] font-mono text-blue-400">
                  {settings.scrollDoubleClickAction.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <select
                value={settings.scrollDoubleClickAction}
                onChange={(e) => updateSetting('scrollDoubleClickAction', e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="scroll_up">▲ Scroll Up</option>
                <option value="scroll_down">▼ Scroll Down</option>
                <option value="page_up">⇞ Page Up (3/4 Screen)</option>
                <option value="page_down">⇟ Page Down (3/4 Screen)</option>
                <option value="scroll_top">⤒ Scroll to Top of Page</option>
                <option value="scroll_bottom">⤓ Scroll to Very Bottom</option>
                <option value="none">Disabled</option>
              </select>
            </div>

            {/* Long Press (Hold) Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">Long Press (Hold) Action:</span>
                <span className="text-[11px] font-mono text-blue-400">
                  {settings.scrollLongPressAction.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <select
                value={settings.scrollLongPressAction}
                onChange={(e) => updateSetting('scrollLongPressAction', e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="tilt_scroll">Tilt-to-Scroll (Hold & Tilt Gyroscope)</option>
                <option value="scroll_down">Continuous Scroll Down</option>
                <option value="scroll_up">Continuous Scroll Up</option>
                <option value="none">Disabled</option>
              </select>
            </div>
          </div>

          {/* Scroll Distance & Double-Click Timing */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm space-y-4">
            {/* Distance slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-200">Scroll Distance per Click:</span>
                <span className="font-mono text-blue-400 font-bold">{settings.scrollStepDistance} px</span>
              </div>
              <input
                type="range"
                min="50"
                max="800"
                step="25"
                value={settings.scrollStepDistance}
                onChange={(e) => updateSetting('scrollStepDistance', Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Small (50px)</span>
                <span>Default (300px)</span>
                <span>Large (800px)</span>
              </div>
            </div>

            {/* Double click speed window */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-200">Double-Click Detection Delay:</span>
                <span className="font-mono text-blue-400 font-bold">{settings.scrollDoubleClickSpeed} ms</span>
              </div>
              <input
                type="range"
                min="200"
                max="600"
                step="25"
                value={settings.scrollDoubleClickSpeed}
                onChange={(e) => updateSetting('scrollDoubleClickSpeed', Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">
                Time window in milliseconds between the first and second click to trigger a double-click action.
              </span>
            </div>

            {/* Smooth Scroll toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-200">Smooth Scroll Animation</span>
                <span className="text-[10px] block text-slate-400">Animates the page movement smoothly</span>
              </div>
              <button
                onClick={() => updateSetting('scrollSmooth', !settings.scrollSmooth)}
                className={`w-12 h-6.5 rounded-full p-0.5 transition-colors relative flex-shrink-0 ${
                  settings.scrollSmooth ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    settings.scrollSmooth ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Power Saving & Gyro Tilt */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-3">
                <p className="text-xs font-semibold text-slate-200">
                  Power saving mode (Experimental!)
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Activate gyroscope only after S Pen button is pressed
                </p>
              </div>
              <button
                onClick={() => updateSetting('scrollExperimentalMode', !settings.scrollExperimentalMode)}
                className={`w-12 h-6.5 rounded-full p-0.5 transition-colors relative flex-shrink-0 ${
                  settings.scrollExperimentalMode ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    settings.scrollExperimentalMode ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-[11px] text-slate-400 leading-normal">
              S Pen will activate the gyroscope only after the button is pressed, which significantly saves the S Pen's battery but may interrupt the connection. Disable if scrolling suddenly stops working.
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-200">Wrist Tilt Sensitivity:</span>
                <span className="font-mono text-blue-400 font-bold">{settings.scrollSensitivity}</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={settings.scrollSensitivity}
                onChange={(e) => updateSetting('scrollSensitivity', Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* GENERAL TAB */}
      {settingsTab === 'general' && (
        <div className="space-y-4">
          {/* Install to Phone (PWA & APK) */}
          <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-800/40 rounded-3xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Test on Your Phone</p>
                <p className="text-[11px] text-slate-400">Install PWA on Home Screen or download APK</p>
              </div>
            </div>
            <button
              onClick={() => setShowInstallDialog(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs text-white font-semibold shadow-md shadow-blue-600/30 transition active:scale-95"
            >
              Install App
            </button>
          </div>

          {/* Accessibility Service */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-200">Accessibility Service</p>
              <p className="text-[11px] text-slate-400">Required for cursor overlay & touch events</p>
            </div>
            <button
              onClick={() => setShowAccessibilityDialog(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-blue-400 font-medium border border-slate-700 transition"
            >
              Configure
            </button>
          </div>

          {/* Analytics Consent */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex-1 pr-3">
              <p className="text-xs font-semibold text-slate-200">Anonymous Diagnostics</p>
              <p className="text-[11px] text-slate-400">Help improve compatibility across Samsung devices</p>
            </div>
            <button
              onClick={() => updateSetting('analyticsEnabled', !settings.analyticsEnabled)}
              className={`w-12 h-6.5 rounded-full p-0.5 transition-colors relative flex-shrink-0 ${
                settings.analyticsEnabled ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  settings.analyticsEnabled ? 'translate-x-5.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Notification System */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <p className="text-xs font-semibold text-slate-200">Status Bar Notifications</p>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal mb-3">
              When active, PenMouse S displays a persistent status notification to keep the foreground service alive and prevent Samsung One UI from killing the connection.
            </p>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="font-semibold block text-[11px] text-slate-200">PenMouse S Status</span>
                <span className="text-[10px] text-slate-500">Controlling mouse overlay</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/60 text-emerald-400">
                Foreground Active
              </span>
            </div>
          </div>

          {/* Reset Settings to Defaults */}
          <button
            onClick={() => setShowResetDialog(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 shadow transition active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Settings to Defaults</span>
          </button>
        </div>
      )}
    </div>
  );
};
