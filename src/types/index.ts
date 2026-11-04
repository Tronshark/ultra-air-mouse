export type CursorType = 'Light' | 'Dark' | 'Retro' | 'SPen' | 'Custom';

export type ModeStatus = 'Off' | 'Mouse' | 'Point' | 'Scroll';

export type ManualCategory = 'main' | 'modes' | 'preparation';

export type ManualPageId =
  | 'how_to_use'
  | 'about'
  | 'troubleshooting'
  | 'mouse'
  | 'point'
  | 'scroll'
  | 'step1'
  | 'step2'
  | 'step3';

export type ScrollKeyAction =
  | 'scroll_down'
  | 'scroll_up'
  | 'page_down'
  | 'page_up'
  | 'scroll_top'
  | 'scroll_bottom'
  | 'tilt_scroll'
  | 'none';

export interface AppSettings {
  mouseSensitivity: number; // 1 to 100
  mouseCursorSize: number; // 20 to 250 (dp)
  mouseCursorType: CursorType;
  mouseCursorAlpha: number; // 0.05 to 1.0
  mouseCursorHideDelay: number; // 5 to 305 (305 = indefinite)
  mouseSleepEnabled: boolean;

  pointCursorType: CursorType;
  pointCursorSize: number;
  pointCursorAlpha: number;

  scrollExperimentalMode: boolean;
  scrollSensitivity: number;
  // Keymapper settings
  scrollSingleClickAction: ScrollKeyAction;
  scrollDoubleClickAction: ScrollKeyAction;
  scrollLongPressAction: ScrollKeyAction;
  scrollStepDistance: number; // 50 to 800 px
  scrollDoubleClickSpeed: number; // 200 to 600 ms
  scrollSmooth: boolean;

  accessibilityEnabled: boolean;
  analyticsEnabled: boolean;
  customCursorUrl: string | null;

  sPenConnected: boolean;
  sPenBattery: number;
  gyroActive: boolean;
  theme: 'dark' | 'light';
}

export interface CursorState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  visible: boolean;
  isClicking: boolean;
  isSleeping: boolean;
  lastMovedTime: number;
}
