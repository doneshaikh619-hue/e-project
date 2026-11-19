import React from 'react';
import { useUI } from '../context/UIContext.jsx';
import { Wifi, Battery, Signal, Monitor, Smartphone } from 'lucide-react';

export default function MobileFrameWrapper({ children }) {
  const { isMobileViewMode, setIsMobileViewMode } = useUI();

  if (!isMobileViewMode) {
    return <>{children}</>;
  }

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-[#07080a] py-8 px-4 flex flex-col items-center justify-center relative">
      {/* Top Banner explaining Mobile Simulator */}
      <div className="mb-4 text-center max-w-md">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 text-luxury-gold text-xs font-semibold mb-1">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Aptech Mobile App Simulator Mode Active</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Viewing "WatchHub" as an iOS/Android luxury mobile application.
        </p>
        <button
          onClick={() => setIsMobileViewMode(false)}
          className="mt-2 text-xs text-luxury-gold underline hover:text-white flex items-center justify-center space-x-1 mx-auto"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Exit to Fullscreen Desktop Portal</span>
        </button>
      </div>

      {/* Titanium iPhone 16 Pro Mockup Frame */}
      <div className="w-[390px] h-[844px] bg-luxury-950 rounded-[55px] p-3 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_20px_rgba(212,175,55,0.25)] border-[6px] border-[#2a2c35] relative flex flex-col overflow-hidden ring-1 ring-white/10">
        {/* Dynamic Island Pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* Mobile Status Bar */}
        <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-300 z-40 select-none">
          <span>{currentTime}</span>
          <div className="flex items-center space-x-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* App Content Viewport with Native Mobile Scroll */}
        <div className="flex-grow overflow-y-auto rounded-[42px] relative no-scrollbar">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="py-1.5 flex justify-center z-50">
          <div className="w-32 h-1 bg-slate-400 rounded-full" />
        </div>
      </div>
    </div>
  );
}
