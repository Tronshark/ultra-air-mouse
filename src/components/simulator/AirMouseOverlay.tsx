import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CursorType } from '../../types';
import { MousePointer2, Move, ChevronUp, ChevronDown, Compass, RefreshCw, Zap, Shield, Hand } from 'lucide-react';

export const AirMouseOverlay: React.FC = () => {
  const {
    mode,
    setMode,
    settings,
    cursorPos,
    setCursorPos,
    isCursorVisible,
    setIsCursorVisible,
    isSleeping,
    setIsSleeping,
    isPenButtonHeld,
    handlePenButtonDown,
    handlePenButtonUp,
    triggerClickAtCursor,
    ripples,
    clearRipple,
    deferredGestureNote,
    executeScrollAction,
    showSimulatorDock,
    setShowSimulatorDock,
  } = useApp();

  const [deviceTilt, setDeviceTilt] = useState<{ gamma: number; beta: number } | null>(null);
  const [gyroSensorEnabled, setGyroSensorEnabled] = useState(false);
  const [isDraggingPoint, setIsDraggingPoint] = useState(false);
  const [scrollVelocity, setScrollVelocity] = useState(0);

  // Determine cursor image
  const activeCursorType: CursorType =
    mode === 'Point' ? settings.pointCursorType : settings.mouseCursorType;
  const cursorSize =
    mode === 'Point' ? settings.pointCursorSize : settings.mouseCursorSize;
  const cursorAlpha =
    mode === 'Point' ? settings.pointCursorAlpha : settings.mouseCursorAlpha;

  const getCursorSrc = (type: CursorType) => {
    if (type === 'Custom' && settings.customCursorUrl) {
      return settings.customCursorUrl;
    }
    switch (type) {
      case 'Dark':
        return '/dark.png';
      case 'Retro':
        return '/retro.png';
      case 'SPen':
        return '/spen.png';
      case 'Light':
      default:
        return '/light.png';
    }
  };

  // Device orientation / Gyroscope listener (real hardware sensor support if on Android / Mobile!)
  useEffect(() => {
    if (!gyroSensorEnabled || mode === 'Off' || isSleeping) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        setDeviceTilt({ gamma: e.gamma, beta: e.beta });

        // Update cursor position according to sensitivity
        const sensitivityFactor = settings.mouseSensitivity / 25;
        setCursorPos((prev) => {
          const newX = Math.max(10, Math.min(window.innerWidth - 10, prev.x + (e.gamma || 0) * 0.15 * sensitivityFactor));
          const newY = Math.max(10, Math.min(window.innerHeight - 10, prev.y + ((e.beta || 0) - 45) * 0.15 * sensitivityFactor));
          return { x: newX, y: newY };
        });
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [gyroSensorEnabled, mode, isSleeping, settings.mouseSensitivity, setCursorPos]);

  // Scroll mode simulation (flicking up/down based on tilt or scroll velocity)
  useEffect(() => {
    if (mode !== 'Scroll' || scrollVelocity === 0) return;
    const interval = setInterval(() => {
      window.scrollBy({ top: scrollVelocity * 10, behavior: 'smooth' });
    }, 50);
    return () => clearInterval(interval);
  }, [mode, scrollVelocity]);

  // Clean ripples after animation
  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      if (ripples.length > 0) {
        clearRipple(ripples[0].id);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [ripples, clearRipple]);

  // Center cursor handler
  const handleRecenter = () => {
    setCursorPos({
      x: Math.round(window.innerWidth / 2),
      y: Math.round(window.innerHeight / 2),
    });
    setIsSleeping(false);
    setIsCursorVisible(true);
  };

  if (mode === 'Off') {
    return null;
  }

  return (
    <>
      {/* Tap Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
        >
          <div className="w-16 h-16 rounded-full border-4 border-blue-400 bg-blue-500/30 animate-ping" />
          <div className="absolute inset-0 w-8 h-8 -top-[-16px] -left-[-16px] rounded-full bg-blue-400/50 blur-sm" />
        </div>
      ))}

      {/* Deferred Gesture Notification Toast */}
      {deferredGestureNote && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-blue-500/50 text-blue-300 text-xs font-medium py-2 px-4 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>{deferredGestureNote}</span>
        </div>
      )}

      {/* Sleep notification badge */}
      {isSleeping && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-amber-950/90 border border-amber-600/60 text-amber-200 text-xs py-2 px-4 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2">
          <span>💤 S Pen Gyroscope asleep to save battery. Press button to wake.</span>
          <button
            onClick={() => {
              setIsSleeping(false);
              setIsCursorVisible(true);
            }}
            className="underline font-bold text-amber-300 hover:text-white"
          >
            Wake Up
          </button>
        </div>
      )}

      {/* Virtual Cursor (Mouse Mode & Point Mode) */}
      {mode !== 'Scroll' && isCursorVisible && !isSleeping && (
        <div
          className={`fixed pointer-events-none z-50 transition-transform ${
            isPenButtonHeld ? 'scale-90' : 'scale-100'
          }`}
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            transform: 'translate(-10%, -10%)',
            opacity: cursorAlpha,
          }}
        >
          <img
            src={getCursorSrc(activeCursorType)}
            alt="Virtual S Pen Cursor"
            className="filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] select-none"
            style={{
              width: `${cursorSize}px`,
              height: `${cursorSize}px`,
              objectFit: 'contain',
            }}
            onError={(e) => {
              // Fallback to light.png if custom fails
              (e.target as HTMLImageElement).src = '/light.png';
            }}
          />

          {/* Point Mode Target Crosshair */}
          {mode === 'Point' && (
            <div className="absolute -inset-4 border-2 border-dashed border-blue-400/70 rounded-full animate-spin-slow pointer-events-none" />
          )}

          {/* Air gesture travel trail while holding button */}
          {isPenButtonHeld && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-blue-600/90 text-[10px] text-white px-2 py-0.5 rounded-full whitespace-nowrap shadow-md">
              Recording Air Gesture...
            </div>
          )}
        </div>
      )}

      {/* Scroll Mode Floating Indicator */}
      {mode === 'Scroll' && (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-slate-900/95 border border-slate-700/80 rounded-3xl p-2.5 flex flex-col items-center gap-2 backdrop-blur-xl shadow-2xl">
          <button
            onClick={() => executeScrollAction('scroll_up', 'Button Up')}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-blue-600 text-white transition active:scale-95 shadow"
            title="Scroll Up"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <div className="text-[9px] uppercase font-bold text-blue-400 tracking-wider text-center py-0.5">
            Keymap
          </div>

          <button
            onClick={() => executeScrollAction(settings.scrollSingleClickAction, '1x Tap')}
            className="px-2.5 py-1.5 rounded-xl bg-blue-900/60 hover:bg-blue-600 border border-blue-600/60 text-[10px] text-white font-bold text-center transition active:scale-95"
            title={`Single Click: ${settings.scrollSingleClickAction}`}
          >
            1x
          </button>
          <button
            onClick={() => executeScrollAction(settings.scrollDoubleClickAction, '2x Tap')}
            className="px-2.5 py-1.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-600 border border-indigo-600/60 text-[10px] text-white font-bold text-center transition active:scale-95"
            title={`Double Click: ${settings.scrollDoubleClickAction}`}
          >
            2x
          </button>

          <button
            onClick={() => executeScrollAction('scroll_down', 'Button Down')}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-blue-600 text-white transition active:scale-95 shadow"
            title="Scroll Down"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Floating Virtual S Pen Remote Dock */}
      {showSimulatorDock && (
        <aside
          aria-label="S Pen Remote Controls"
          className="fixed bottom-24 right-4 z-40 bg-slate-900/95 dark:bg-slate-950/95 border border-slate-800 text-slate-100 rounded-3xl p-3.5 shadow-2xl backdrop-blur-xl w-72 max-w-[calc(100vw-2rem)] select-none animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold tracking-tight text-white">S Pen Air Controller</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRecenter}
                title="Recenter cursor"
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowSimulatorDock(false)}
                className="text-[11px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800"
              >
                Hide
              </button>
            </div>
          </div>

          {/* S Pen Body & Button */}
          <div className="mb-3 p-3 bg-slate-800/70 rounded-2xl border border-slate-700/60 flex flex-col items-center">
            <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between w-full">
              <span>S Pen Hardware Remote</span>
              <span className="font-mono text-emerald-400 text-[10px]">{settings.sPenBattery}% BLE</span>
            </div>

            {/* Simulated S Pen Stylus Graphic with Clickable Action Button */}
            <div className="relative w-full h-12 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-full border border-slate-700/80 flex items-center justify-center shadow-inner px-4">
              {/* Tip */}
              <div className="absolute -left-1.5 w-3 h-3 bg-slate-400 rounded-full clip-path-polygon" />

              {/* S Pen Physical Button */}
              <button
                onMouseDown={handlePenButtonDown}
                onMouseUp={handlePenButtonUp}
                onTouchStart={handlePenButtonDown}
                onTouchEnd={handlePenButtonUp}
                className={`relative px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-md ${
                  isPenButtonHeld
                    ? 'bg-blue-500 text-white shadow-blue-500/50 scale-95 ring-2 ring-blue-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-600/80 active:scale-95'
                }`}
              >
                {isPenButtonHeld
                  ? mode === 'Scroll' ? 'Holding...' : 'Release to Action'
                  : 'S Pen Button'}
              </button>

              {/* Samsung Brand imprint */}
              <span className="absolute right-4 text-[9px] font-mono tracking-widest text-slate-500 uppercase">
                Air
              </span>
            </div>

            {/* Mode action helper text */}
            <span className="text-[10px] text-slate-400 mt-1.5 text-center leading-tight">
              {mode === 'Point'
                ? 'Press button to click target'
                : mode === 'Scroll'
                ? `1x: ${settings.scrollSingleClickAction.replace('_', ' ')} • 2x: ${settings.scrollDoubleClickAction.replace('_', ' ')}`
                : 'Click to tap • Hold & move to draw gesture'}
            </span>

            {/* Scroll Keymapper Quick Action triggers */}
            {mode === 'Scroll' && (
              <div className="grid grid-cols-2 gap-1.5 w-full mt-2 pt-2 border-t border-slate-700/60">
                <button
                  onClick={() => executeScrollAction(settings.scrollSingleClickAction, '1x Button Click')}
                  className="py-1 px-2 rounded-xl bg-blue-600/25 hover:bg-blue-600/40 border border-blue-500/40 text-blue-300 text-[10px] font-semibold text-center truncate transition active:scale-95"
                >
                  1x: {settings.scrollSingleClickAction.replace('_', ' ')}
                </button>
                <button
                  onClick={() => executeScrollAction(settings.scrollDoubleClickAction, '2x Button Click')}
                  className="py-1 px-2 rounded-xl bg-indigo-600/25 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 text-[10px] font-semibold text-center truncate transition active:scale-95"
                >
                  2x: {settings.scrollDoubleClickAction.replace('_', ' ')}
                </button>
              </div>
            )}
          </div>

          {/* Air Gesture Trackpad (Move S Pen in Air) */}
          <div
            className="relative h-24 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden cursor-crosshair group active:border-blue-500 transition-colors"
            onMouseMove={(e) => {
              if (e.buttons === 1 || mode === 'Mouse') {
                const rect = e.currentTarget.getBoundingClientRect();
                const deltaX = (e.clientX - (rect.left + rect.width / 2)) * 0.15;
                const deltaY = (e.clientY - (rect.top + rect.height / 2)) * 0.15;
                const sens = settings.mouseSensitivity / 30;

                setCursorPos((prev) => ({
                  x: Math.max(10, Math.min(window.innerWidth - 10, prev.x + deltaX * sens)),
                  y: Math.max(10, Math.min(window.innerHeight - 10, prev.y + deltaY * sens)),
                }));
                setIsSleeping(false);
                setIsCursorVisible(true);
              }
            }}
          >
            <Move className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition" />
            <span className="text-[11px] text-slate-400 mt-1">Air Motion Pad</span>
            <span className="text-[9px] text-slate-600">Drag here to tilt S Pen in air</span>
          </div>

          {/* Gyro Sensor hardware toggle */}
          <div className="mt-2.5 flex items-center justify-between text-xs px-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-slate-500" />
              Device Gyro Tilt
            </span>
            <button
              onClick={() => {
                if (
                  typeof DeviceOrientationEvent !== 'undefined' &&
                  typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'
                ) {
                  (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> })
                    .requestPermission()
                    .then((permissionState) => {
                      if (permissionState === 'granted') {
                        setGyroSensorEnabled(!gyroSensorEnabled);
                      }
                    })
                    .catch(console.error);
                } else {
                  setGyroSensorEnabled(!gyroSensorEnabled);
                }
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border transition ${
                gyroSensorEnabled
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {gyroSensorEnabled ? 'Sensors Active' : 'Enable Gyro'}
            </button>
          </div>
        </aside>
      )}

      {/* Floating open dock button if collapsed */}
      {!showSimulatorDock && (
        <button
          onClick={() => setShowSimulatorDock(true)}
          className="fixed bottom-24 right-4 z-40 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-2xl shadow-blue-600/40 border border-blue-400/40 flex items-center gap-2 text-xs font-semibold transition active:scale-95"
        >
          <MousePointer2 className="w-4 h-4" />
          <span>S Pen Remote</span>
        </button>
      )}
    </>
  );
};
