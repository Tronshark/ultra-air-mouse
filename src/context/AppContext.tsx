import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AppSettings, CursorType, ModeStatus, ManualPageId, ScrollKeyAction } from '../types';

interface TapRipple {
  id: number;
  x: number;
  y: number;
}

interface AppContextType {
  // Navigation
  currentScreen: 'home' | 'settings' | 'manual';
  setCurrentScreen: (screen: 'home' | 'settings' | 'manual') => void;
  settingsTab: 'mouse' | 'point' | 'scroll' | 'general';
  setSettingsTab: (tab: 'mouse' | 'point' | 'scroll' | 'general') => void;
  manualPage: ManualPageId;
  setManualPage: (page: ManualPageId) => void;
  navigateToManualPage: (page: ManualPageId) => void;

  // Mode
  mode: ModeStatus;
  setMode: (mode: ModeStatus) => void;

  // Settings
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  resetSettings: () => void;
  setCustomCursor: (dataUrl: string) => void;

  // Dialogs
  showFirstRunDialog: boolean;
  setShowFirstRunDialog: (show: boolean) => void;
  showUnsupportedDialog: boolean;
  setShowUnsupportedDialog: (show: boolean) => void;
  showAccessibilityDialog: boolean;
  setShowAccessibilityDialog: (show: boolean) => void;
  showAnalyticsDialog: boolean;
  setShowAnalyticsDialog: (show: boolean) => void;
  showResetDialog: boolean;
  setShowResetDialog: (show: boolean) => void;
  showInstallDialog: boolean;
  setShowInstallDialog: (show: boolean) => void;

  // Virtual Cursor & S Pen Simulation
  cursorPos: { x: number; y: number };
  setCursorPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  isCursorVisible: boolean;
  setIsCursorVisible: (visible: boolean) => void;
  isSleeping: boolean;
  setIsSleeping: (sleeping: boolean) => void;
  isPenButtonHeld: boolean;
  handlePenButtonDown: () => void;
  handlePenButtonUp: () => void;
  triggerClickAtCursor: () => void;
  ripples: TapRipple[];
  clearRipple: (id: number) => void;
  deferredGestureNote: string | null;

  executeScrollAction: (action: ScrollKeyAction, sourceLabel?: string) => void;
  // Simulator Panel Visibility
  showSimulatorDock: boolean;
  setShowSimulatorDock: (show: boolean) => void;
  toggleTheme: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  mouseSensitivity: 50,
  mouseCursorSize: 60,
  mouseCursorType: 'Light',
  mouseCursorAlpha: 1.0,
  mouseCursorHideDelay: 10,
  mouseSleepEnabled: true,

  pointCursorType: 'Light',
  pointCursorSize: 60,
  pointCursorAlpha: 1.0,

  scrollExperimentalMode: false,
  scrollSensitivity: 50,
  scrollSingleClickAction: 'scroll_down',
  scrollDoubleClickAction: 'scroll_up',
  scrollLongPressAction: 'tilt_scroll',
  scrollStepDistance: 300,
  scrollDoubleClickSpeed: 300,
  scrollSmooth: true,

  accessibilityEnabled: true,
  analyticsEnabled: false,
  customCursorUrl: null,

  sPenConnected: true,
  sPenBattery: 92,
  gyroActive: true,
  theme: 'dark',
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Screens & Navigation
  const [currentScreen, setCurrentScreen] = useState<'home' | 'settings' | 'manual'>('home');
  const [settingsTab, setSettingsTab] = useState<'mouse' | 'point' | 'scroll' | 'general'>('mouse');
  const [manualPage, setManualPage] = useState<ManualPageId>('how_to_use');

  // Mode
  const [mode, setMode] = useState<ModeStatus>('Off');

  // Load stored settings or default
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('penmouse_settings');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  // Dialogs
  const [showFirstRunDialog, setShowFirstRunDialog] = useState<boolean>(() => {
    return !localStorage.getItem('penmouse_welcomed');
  });
  const [showUnsupportedDialog, setShowUnsupportedDialog] = useState(false);
  const [showAccessibilityDialog, setShowAccessibilityDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showInstallDialog, setShowInstallDialog] = useState(false);

  // Virtual Cursor State
  const [cursorPos, setCursorPos] = useState({ x: 300, y: 300 });
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isPenButtonHeld, setIsPenButtonHeld] = useState(false);
  const [ripples, setRipples] = useState<TapRipple[]>([]);
  const [deferredGestureNote, setDeferredGestureNote] = useState<string | null>(null);
  const [showSimulatorDock, setShowSimulatorDock] = useState(true);

  const lastActivityRef = useRef<number>(Date.now());
  const buttonHeldStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const gesturePointsRef = useRef<Array<{ x: number; y: number }>>([]);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressDownTimeRef = useRef<number>(0);
  const lastClickTimeRef = useRef<number>(0);

  // Save settings on changes
  useEffect(() => {
    try {
      localStorage.setItem('penmouse_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
    // Update theme class on HTML element
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Center cursor on initial activation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCursorPos({
        x: Math.round(window.innerWidth / 2),
        y: Math.round(window.innerHeight / 2),
      });
    }
  }, []);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem('penmouse_settings');
    } catch {
      // ignore
    }
  }, []);

  const setCustomCursor = useCallback((dataUrl: string) => {
    setSettings((prev) => ({
      ...prev,
      customCursorUrl: dataUrl,
      mouseCursorType: 'Custom',
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  const navigateToManualPage = useCallback((page: ManualPageId) => {
    setManualPage(page);
    setCurrentScreen('manual');
  }, []);

  // Scroll action executor for keymapper
  const executeScrollAction = useCallback((action: ScrollKeyAction, sourceLabel?: string) => {
    if (action === 'none') return;
    lastActivityRef.current = Date.now();
    setIsCursorVisible(true);
    setIsSleeping(false);

    const behavior: ScrollBehavior = settings.scrollSmooth ? 'smooth' : 'auto';
    const step = settings.scrollStepDistance || 300;

    switch (action) {
      case 'scroll_down':
        window.scrollBy({ top: step, behavior });
        setDeferredGestureNote(`${sourceLabel || 'Keymapper'}: Scroll Down (${step}px)`);
        break;
      case 'scroll_up':
        window.scrollBy({ top: -step, behavior });
        setDeferredGestureNote(`${sourceLabel || 'Keymapper'}: Scroll Up (${step}px)`);
        break;
      case 'page_down':
        window.scrollBy({ top: window.innerHeight * 0.75, behavior });
        setDeferredGestureNote(`${sourceLabel || 'Keymapper'}: Page Down`);
        break;
      case 'page_up':
        window.scrollBy({ top: -window.innerHeight * 0.75, behavior });
        setDeferredGestureNote(`${sourceLabel || 'Keymapper'}: Page Up`);
        break;
      case 'scroll_top':
        window.scrollTo({ top: 0, behavior });
        setDeferredGestureNote(`${sourceLabel || 'Keymapper'}: Scroll to Top`);
        break;
      case 'scroll_bottom':
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior });
        setDeferredGestureNote(`${sourceLabel || 'Keymapper'}: Scroll to Bottom`);
        break;
      case 'tilt_scroll':
        setDeferredGestureNote(`${sourceLabel || 'Keymapper'}: Tilt-to-Scroll Mode`);
        break;
    }

    // Audio chirp feedback
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(action.includes('up') ? 600 : 450, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(action.includes('up') ? 900 : 350, audioCtx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    } catch {}

    setTimeout(() => setDeferredGestureNote(null), 2500);
  }, [settings.scrollSmooth, settings.scrollStepDistance]);

  // Ripple effect trigger
  const triggerClickAtCursor = useCallback(() => {
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x: cursorPos.x, y: cursorPos.y }]);
    lastActivityRef.current = Date.now();
    setIsCursorVisible(true);
    setIsSleeping(false);

    // Audio click sound simulation via Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {
      // Audio not permitted or supported
    }
  }, [cursorPos]);

  const clearRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Handle S Pen Button Down & Up
  const handlePenButtonDown = useCallback(() => {
    setIsPenButtonHeld(true);
    pressDownTimeRef.current = Date.now();
    buttonHeldStartPosRef.current = { ...cursorPos };
    gesturePointsRef.current = [{ ...cursorPos }];
    lastActivityRef.current = Date.now();
    setIsCursorVisible(true);
    setIsSleeping(false);
  }, [cursorPos]);

  const handlePenButtonUp = useCallback(() => {
    setIsPenButtonHeld(false);
    const pressDuration = Date.now() - pressDownTimeRef.current;

    // Special handling for Scroll mode keymapper
    if (mode === 'Scroll') {
      if (pressDuration > 450) {
        // Long press detected
        executeScrollAction(settings.scrollLongPressAction, 'Long Press (Hold)');
        return;
      }

      const now = Date.now();
      const timeSinceLast = now - lastClickTimeRef.current;
      const threshold = settings.scrollDoubleClickSpeed || 300;

      if (clickTimerRef.current && timeSinceLast < threshold) {
        // Double click confirmed!
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
        lastClickTimeRef.current = 0;
        executeScrollAction(settings.scrollDoubleClickAction, 'Double Click');
      } else {
        // Potential single click, wait for double-click window
        lastClickTimeRef.current = now;
        clickTimerRef.current = setTimeout(() => {
          executeScrollAction(settings.scrollSingleClickAction, 'Single Click');
          clickTimerRef.current = null;
        }, threshold);
      }
      return;
    }

    const start = buttonHeldStartPosRef.current;
    const end = cursorPos;
    const points = gesturePointsRef.current;

    // Check gesture type for Mouse / Point modes
    if (start) {
      const dist = Math.hypot(end.x - start.x, end.y - start.y);
      if (dist < 15) {
        // Simple tap / click
        triggerClickAtCursor();
        setDeferredGestureNote('Tap action simulated at cursor position!');
      } else {
        // Deferred drag or swipe gesture
        triggerClickAtCursor();
        setDeferredGestureNote(`Deferred gesture executed (${points.length} samples, travel: ${Math.round(dist)}px)`);
      }
      setTimeout(() => setDeferredGestureNote(null), 3000);
    }
    buttonHeldStartPosRef.current = null;
    gesturePointsRef.current = [];
  }, [
    mode,
    cursorPos,
    triggerClickAtCursor,
    executeScrollAction,
    settings.scrollDoubleClickAction,
    settings.scrollDoubleClickSpeed,
    settings.scrollLongPressAction,
    settings.scrollSingleClickAction,
  ]);

  // Inactivity cursor hide & sleep timer
  useEffect(() => {
    if (mode === 'Off') return;

    const interval = setInterval(() => {
      const now = Date.now();
      const hideDelaySec = settings.mouseCursorHideDelay;
      const elapsedSec = (now - lastActivityRef.current) / 1000;

      // 305 = Indefinite / keep visible
      if (hideDelaySec < 305) {
        if (elapsedSec > hideDelaySec && isCursorVisible) {
          setIsCursorVisible(false);
        }
      }

      // Gyro sleep timer (1 min after hide, or 5 min if hide is indefinite)
      if (settings.mouseSleepEnabled) {
        const sleepThresholdSec = hideDelaySec < 305 ? hideDelaySec + 60 : 300;
        if (elapsedSec > sleepThresholdSec && !isSleeping) {
          setIsSleeping(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, settings.mouseCursorHideDelay, settings.mouseSleepEnabled, isCursorVisible, isSleeping]);

  // Track cursor position updates while button is held
  useEffect(() => {
    if (isPenButtonHeld) {
      gesturePointsRef.current.push({ ...cursorPos });
    }
  }, [cursorPos, isPenButtonHeld]);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        settingsTab,
        setSettingsTab,
        manualPage,
        setManualPage,
        navigateToManualPage,
        mode,
        setMode,
        settings,
        updateSetting,
        resetSettings,
        setCustomCursor,
        showFirstRunDialog,
        setShowFirstRunDialog,
        showUnsupportedDialog,
        setShowUnsupportedDialog,
        showAccessibilityDialog,
        setShowAccessibilityDialog,
        showAnalyticsDialog,
        setShowAnalyticsDialog,
        showResetDialog,
        setShowResetDialog,
        showInstallDialog,
        setShowInstallDialog,
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
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
