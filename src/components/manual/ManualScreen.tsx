import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ManualPageId } from '../../types';
import {
  BookOpen,
  HelpCircle,
  Info,
  MousePointer,
  Crosshair,
  ScrollText,
  Sliders,
  CheckCircle,
  ExternalLink,
  Coffee,
  Globe,
  Github,
  Play,
  ArrowLeft,
  Menu,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ManualItem {
  id: ManualPageId;
  title: string;
  subtitle?: string;
  icon: React.ElementType;
}

interface ManualSection {
  title: string;
  items: ManualItem[];
}

export const ManualScreen: React.FC = () => {
  const { manualPage, setManualPage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections: ManualSection[] = [
    {
      title: 'About PenMouse S',
      items: [
        { id: 'how_to_use', title: 'How to use?', subtitle: 'Quick setup & requirements', icon: BookOpen },
        { id: 'about', title: 'About PenMouse S', subtitle: 'Credits, author & legal', icon: Info },
        { id: 'troubleshooting', title: 'Troubleshooting', subtitle: 'Common fixes & checklist', icon: HelpCircle },
      ],
    },
    {
      title: 'Operating Modes',
      items: [
        { id: 'mouse', title: 'Mouse Mode', subtitle: 'Air gesture cursor control', icon: MousePointer },
        { id: 'point', title: 'Point Mode', subtitle: 'Touch target remote pointer', icon: Crosshair },
        { id: 'scroll', title: 'Scroll Mode', subtitle: 'Wrist tilt swipe gesture', icon: ScrollText },
      ],
    },
    {
      title: 'Preparation Steps',
      items: [
        { id: 'step1', title: 'Step 1: Disable Gestures', subtitle: 'Prevent system conflicts', icon: Sliders },
        { id: 'step2', title: 'Step 2: Pin in Recents', subtitle: 'Keep app alive in background', icon: CheckCircle },
        { id: 'step3', title: 'Step 3: Accessibility', subtitle: 'Enable overlay & input', icon: CheckCircle },
      ],
    },
  ];

  const handleSelectPage = (pageId: ManualPageId) => {
    setManualPage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen pb-28 pt-4 px-4 max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Mobile Drawer Trigger Bar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-sm">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-200"
        >
          <Menu className="w-4 h-4 text-blue-400" />
          <span>Manual Navigation Menu</span>
        </button>
        <span className="text-[11px] text-blue-400 font-medium">
          {sections.flatMap((s) => s.items).find((i) => i.id === manualPage)?.title}
        </span>
      </div>

      {/* Navigation Sidebar */}
      <div
        className={`md:w-72 flex-shrink-0 flex flex-col gap-4 ${
          mobileMenuOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800/80 rounded-3xl p-4 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm text-white">Manual Index</span>
          </div>

          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                {section.title}
              </span>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isSelected = manualPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPage(item.id)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1 truncate">
                      <span className="block truncate">{item.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}

          {/* Bird Hunt Promo Card */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-1 mb-2 block">
              Also by Jojczak
            </span>
            <a
              href="https://play.google.com/store/apps/details?id=pl.jojczak.birdhunt"
              target="_blank"
              rel="noreferrer"
              className="block group overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-950 hover:border-blue-500 transition shadow-sm"
            >
              <img
                src="/birdhunt_banner.png"
                alt="Bird Hunt Banner"
                className="w-full h-20 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-blue-400 transition">
                    Bird Hunt
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Play
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Motion game designed for S Pen</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Manual Content Area */}
      <div className="flex-1 bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800/80 rounded-3xl p-6 shadow-sm overflow-hidden text-slate-200 space-y-6">
        {/* HOW TO USE */}
        {manualPage === 'how_to_use' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Quick Guide</span>
              <h1 className="text-2xl font-extrabold text-white mt-1">How to Use PenMouse S</h1>
            </div>

            <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
              <p>
                Make sure your device supports the <strong className="text-white">S Pen with Bluetooth</strong> and <strong className="text-white">Air Actions</strong>.
              </p>

              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  Currently Supported Devices
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc pl-5">
                  <li>Galaxy Note 10 and Note 20 series</li>
                  <li>Galaxy S20, S21, S22, S23, and S24 Ultra</li>
                  <li>Galaxy Tab S6, S7, S8, S9, and S10 (excluding FE versions)</li>
                </ul>
              </div>

              <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-300">
                <li>Complete all <strong>preparation steps 1-3</strong> from the home screen.</li>
                <li>Remove the <strong>S Pen</strong> from your phone/tablet and wait until it establishes a Bluetooth connection.</li>
                <li>Once connected, you will see the S Pen connected icon:</li>
              </ol>

              <div className="inline-flex items-center gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <img
                  src="/manual_assets/spen_connected_icon_dark.png"
                  alt="Connected S Pen"
                  className="w-6 h-6 object-contain"
                />
                <span className="text-xs font-semibold text-emerald-400">S Pen Connected & Gyroscope Active</span>
              </div>

              <p className="text-xs text-slate-400">
                After completing these steps, switch to one of the operating modes: Mouse, Point, or Scroll!
              </p>
            </div>
          </div>
        )}

        {/* ABOUT */}
        {manualPage === 'about' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Project Information</span>
              <h1 className="text-2xl font-extrabold text-white mt-1">About PenMouse S</h1>
            </div>

            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                PenMouse S is an open-source tool developed by <strong>Jojczak</strong> to bring air cursor mouse functionality to Samsung Galaxy S Pen styluses with air actions.
              </p>

              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2 text-xs">
                <span className="font-bold text-slate-200 uppercase tracking-wider block">Contributors</span>
                <p>• <strong>Karirad</strong> — S Pen custom cursor icon</p>
                <p>• Community members from Reddit r/GalaxyS23Ultra for ideas and feedback!</p>
              </div>

              {/* Translation & Support buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href="https://buymeacoffee.com/jojczak"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
                >
                  <Coffee className="w-4 h-4" />
                  <span>Buy me a coffee ☕</span>
                </a>

                <a
                  href="https://github.com/jojczak/PenMouseS"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition"
                >
                  <Github className="w-4 h-4" />
                  <span>View on GitHub</span>
                </a>
              </div>

              <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-800 leading-normal">
                <em>"Samsung", "Galaxy", and "S Pen" are registered trademarks of Samsung Electronics Co., Ltd. This application is an independent open-source project and is not affiliated with, endorsed by, or sponsored by Samsung Electronics Co., Ltd.</em>
              </div>
            </div>
          </div>
        )}

        {/* TROUBLESHOOTING */}
        {manualPage === 'troubleshooting' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Troubleshooting</span>
              <h1 className="text-2xl font-extrabold text-white mt-1">Connection Checklist</h1>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p className="text-sm">
                If the cursor or S Pen buttons are not responding after enabling a mode, please work through this checklist:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                  <h3 className="font-bold text-slate-100 text-xs mb-1">1. Supported Hardware</h3>
                  <p className="text-slate-400">
                    Verify your device has an S Pen with Bluetooth and Air Actions. Note that Galaxy S25 Ultra, Tab FE models, and non-Samsung styluses do not have the necessary hardware.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                  <h3 className="font-bold text-slate-100 text-xs mb-1">2. Complete Preparation Steps</h3>
                  <p className="text-slate-400">
                    Ensure Step 1 (Disable system gestures), Step 2 (Pin in recents), and Step 3 (Accessibility service) have all been completed.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                  <h3 className="font-bold text-slate-100 text-xs mb-1">3. Reset Accessibility Permission</h3>
                  <p className="text-slate-400">
                    Android can sometimes revoke background accessibility permissions after long inactivity or deep sleep. Toggle the service OFF then ON in phone Settings → Accessibility.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                  <h3 className="font-bold text-slate-100 text-xs mb-1">4. Re-insert & Re-connect S Pen</h3>
                  <p className="text-slate-400">
                    Slot the S Pen into the phone for 5 seconds to charge the capacitor/battery, then remove it and wait for the notification icon to confirm BLE pairing.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-rose-950/30 border border-rose-800/40 rounded-2xl text-[11px] text-rose-300 leading-normal">
                <strong>Final Note:</strong> PenMouse S relies on Samsung's legacy S Pen Remote SDK. The SDK has known quirks across Android OS versions, and some behaviors cannot be circumvented without root access.
              </div>
            </div>
          </div>
        )}

        {/* MOUSE MODE */}
        {manualPage === 'mouse' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Mode Overview</span>
              <h1 className="text-2xl font-extrabold text-white mt-1">Mouse Mode</h1>
            </div>

            {/* Embedded Demonstration Video */}
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video max-w-lg shadow-lg">
              <video
                src="/manual_assets/mouse.mp4"
                controls
                loop
                className="w-full h-full object-contain"
                poster="/screenshots/1.png"
              />
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p className="text-sm">
                Mouse Mode lets you use your S Pen as an air mouse to control a cursor on your phone's screen.
              </p>

              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2">
                <span className="font-bold text-slate-100 text-xs block">How to Use:</span>
                <p>• <strong>Move Cursor:</strong> Move the S Pen in the air.</p>
                <p>• <strong>Left Click:</strong> Press the S Pen physical button.</p>
                <p className="text-blue-300">
                  💡 <strong>Pro-Tip:</strong> Instead of moving your whole arm, try tilting just your wrist. The cursor will move faster and much more precisely.
                </p>
              </div>

              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2">
                <span className="font-bold text-slate-100 text-xs block">System Limitations & Workarounds:</span>
                <p>• <strong>Virtual Cursor:</strong> The app emulates touch input using Android's Accessibility API.</p>
                <p>• <strong>Deferred Gestures:</strong> All actions execute <em>after</em> you complete the physical gesture and release the button.</p>
                <p>• <strong>Battery Life:</strong> Gyroscope continuous use lasts ~30 minutes on stylus battery.</p>
              </div>
            </div>
          </div>
        )}

        {/* POINT MODE */}
        {manualPage === 'point' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Mode Overview</span>
              <h1 className="text-2xl font-extrabold text-white mt-1">Point Mode</h1>
            </div>

            {/* Embedded Demonstration Video */}
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video max-w-lg shadow-lg">
              <video
                src="/manual_assets/point.mp4"
                controls
                loop
                className="w-full h-full object-contain"
                poster="/screenshots/2.png"
              />
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p className="text-sm">
                Point Mode is a simplified version of Mouse Mode, ideal for presentations or situations where you only need to click without moving the cursor continuously.
              </p>

              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2">
                <span className="font-bold text-slate-100 text-xs block">How it Works:</span>
                <p>• Position the cursor by <strong>touching and dragging it with your finger</strong> to the desired spot.</p>
                <p>• Once positioned, <strong>press the S Pen button</strong> to simulate a touch/click at that exact target.</p>
                <p className="text-emerald-300">
                  ⚡ <strong>Battery Friendly:</strong> Since Point Mode does not use the S Pen's gyroscope, it is <strong>much more battery-efficient</strong> than Mouse Mode!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SCROLL MODE */}
        {manualPage === 'scroll' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Mode Overview</span>
              <h1 className="text-2xl font-extrabold text-white mt-1">Scroll Mode</h1>
            </div>

            {/* Embedded Demonstration Video */}
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video max-w-lg shadow-lg">
              <video
                src="/manual_assets/scroll.mp4"
                controls
                loop
                className="w-full h-full object-contain"
                poster="/screenshots/3.png"
              />
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p className="text-sm">
                Scroll Mode allows you to scroll vertical content on your phone using S Pen gestures and button clicks, without touching the screen.
              </p>

              {/* S Pen Keymapper Guide */}
              <div className="p-4 bg-blue-950/40 rounded-2xl border border-blue-800/50 space-y-2">
                <span className="font-bold text-blue-300 text-xs block flex items-center gap-1.5">
                  ⌨️ S Pen Button Keymapper:
                </span>
                <p>
                  You can fully customize how the S Pen physical button controls scrolling:
                </p>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-300">
                  <li><strong>Single Click:</strong> Scroll Down, Scroll Up, Page Down, Page Up, or Jump to Top/Bottom.</li>
                  <li><strong>Double Click:</strong> Scroll Up, Scroll Down, Page Up, or Jump to Top.</li>
                  <li><strong>Long Press (Hold):</strong> Tilt-to-Scroll (Hold & Tilt) or continuous scrolling.</li>
                </ul>
                <p className="text-[11px] text-blue-300 mt-1">
                  Adjust step distance (px), double-click speed (ms), and smooth animations in <strong>Settings → Scroll</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2">
                <span className="font-bold text-slate-100 text-xs block">How to Use (Air Tilt Gesture):</span>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Open an app with vertically scrolling content (browser, social feed, gallery).</li>
                  <li><strong>Press and hold the S Pen button</strong>.</li>
                  <li>While holding the button, <strong>tilt your wrist up or down</strong>.</li>
                  <li>The app simulates a vertical scroll gesture on the screen.</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {manualPage === 'step1' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Preparation Step 1</span>
              <h1 className="text-2xl font-extrabold text-white mt-1">Disable System Gestures</h1>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video max-w-lg shadow-lg">
              <video
                src="/manual_assets/step1.mp4"
                controls
                loop
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                By default, the S Pen has built-in system functions (like opening the camera or navigating back). When using PenMouse S, the pen doesn't know it's acting as a mouse, so default system air gestures can interfere.
              </p>
              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2">
                <span className="font-bold text-slate-100 text-xs block">Recommended Settings:</span>
                <p>Go to: <strong>Settings → Advanced Features → S Pen</strong></p>
                <p>• Disable pointer command icon display</p>
                <p>• Disable long press on stylus button</p>
                <p>• Disable navigation gestures (Back, Home, Recent apps)</p>
                <p className="text-amber-300">⚠️ <em>Do NOT turn off the main Air Actions switch!</em></p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {manualPage === 'step2' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Preparation Step 2</span>
              <h1 className="text-2xl font-extrabold text-white mt-1">Pin App in Recents</h1>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video max-w-lg shadow-lg">
              <video
                src="/manual_assets/step2.mp4"
                controls
                loop
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                Pin the app in the recents screen to prevent the Android operating system from closing it in the background. S Pen Air Actions require the host application to remain alive in memory.
              </p>
              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-1">
                <p>1. Open the Android <strong>Recent Apps</strong> screen.</p>
                <p>2. Tap the <strong>PenMouse S app icon</strong> at the top of its preview card.</p>
                <p>3. Select <strong>Lock this app / Keep open</strong>.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {manualPage === 'step3' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Preparation Step 3</span>
              <h1 className="text-2xl font-extrabold text-white mt-1">Accessibility Service</h1>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video max-w-lg shadow-lg">
              <video
                src="/manual_assets/step3.mp4"
                controls
                loop
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                PenMouse S requires Android's Accessibility Service permission to display the cursor overlay on top of all applications and simulate finger touches on the screen.
              </p>
              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-1">
                <p>1. Go to your device <strong>Settings → Accessibility</strong>.</p>
                <p>2. Tap <strong>Installed apps</strong> (or Installed services).</p>
                <p>3. Tap <strong>PenMouse S</strong> and toggle the switch to <strong>On</strong>.</p>
              </div>
              <p className="text-[11px] text-emerald-400">
                🛡️ PenMouse S does not collect, log, or transmit any user data.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
