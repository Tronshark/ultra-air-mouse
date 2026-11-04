import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HomeScreen } from './components/home/HomeScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { ManualScreen } from './components/manual/ManualScreen';
import { BottomNavBar } from './components/navigation/BottomNavBar';
import { AirMouseOverlay } from './components/simulator/AirMouseOverlay';
import { FirstRunDialog } from './components/dialogs/FirstRunDialog';
import { UnsupportedDeviceDialog } from './components/dialogs/UnsupportedDeviceDialog';
import { AccessibilityDialog } from './components/dialogs/AccessibilityDialog';
import { AnalyticsDialog } from './components/dialogs/AnalyticsDialog';
import { ResetSettingsDialog } from './components/dialogs/ResetSettingsDialog';
import { InstallOnPhoneDialog } from './components/dialogs/InstallOnPhoneDialog';

const AppContent: React.FC = () => {
  const { currentScreen, settings } = useApp();

  return (
    <div className={`min-h-screen text-slate-100 transition-colors duration-200 ${
      settings.theme === 'dark' ? 'bg-slate-950' : 'bg-slate-900'
    }`}>
      {/* Background ambient gradient */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950/0 to-transparent" />

      {/* Main Screen Views */}
      <main className="relative z-10">
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'settings' && <SettingsScreen />}
        {currentScreen === 'manual' && <ManualScreen />}
      </main>

      {/* Bottom Floating Navigation Bar */}
      <BottomNavBar />

      {/* Virtual Air Mouse Overlay & S Pen Simulator Controller */}
      <AirMouseOverlay />

      {/* Dialog Modals */}
      <FirstRunDialog />
      <UnsupportedDeviceDialog />
      <AccessibilityDialog />
      <AnalyticsDialog />
      <ResetSettingsDialog />
      <InstallOnPhoneDialog />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
