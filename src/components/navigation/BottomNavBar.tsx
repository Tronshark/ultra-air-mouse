import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Sliders, BookOpen, Sun, Moon, BatteryCharging, Wifi, WifiOff, Smartphone } from 'lucide-react';

export const BottomNavBar: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    mode,
    settings,
    toggleTheme,
    updateSetting,
    setShowInstallDialog,
  } = useApp();

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'settings' as const, label: 'Settings', icon: Sliders },
    { id: 'manual' as const, label: 'Manual', icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-1 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-800/80 dark:border-slate-800/90 shadow-2xl rounded-3xl p-1.5 flex items-center justify-between">
          <div className="flex items-center flex-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`flex-1 relative flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 select-none ${
                    isActive
                      ? 'text-blue-400 bg-blue-500/15 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`} />
                  <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="h-7 w-[1px] bg-slate-800 mx-1.5" />

          {/* S Pen status badge & theme toggle */}
          <div className="flex items-center gap-1.5 pr-2 pl-1">
            <button
              onClick={() => updateSetting('sPenConnected', !settings.sPenConnected)}
              title={settings.sPenConnected ? `S Pen Connected (${settings.sPenBattery}%)` : 'S Pen Disconnected'}
              className={`flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-xl border transition ${
                settings.sPenConnected
                  ? 'bg-emerald-950/60 border-emerald-800/50 text-emerald-400'
                  : 'bg-rose-950/60 border-rose-800/50 text-rose-400'
              }`}
            >
              {settings.sPenConnected ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="font-mono">{settings.sPenBattery}%</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                  <span>S Pen</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowInstallDialog(true)}
              aria-label="Install / Test on Phone"
              title="Test / Install on Phone"
              className="p-2 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-slate-800/70 transition"
            >
              <Smartphone className="w-4 h-4 text-blue-400" />
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 transition"
            >
              {settings.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
