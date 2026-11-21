import React, { useState, useRef, useEffect } from 'react';
import { useUI } from '../context/UIContext.jsx';
import { ChevronDown, ArrowRight, ShieldCheck, Clock, CheckCircle2, RotateCw } from 'lucide-react';

export default function ServicingSection({ onOpenAppointmentModal }) {
  const { showToast } = useUI();
  const [selectedModel, setSelectedModel] = useState('');
  const [visualMode, setVisualMode] = useState('movement'); // 'movement' | 'wrist'
  const videoRef = useRef(null);

  // Lazy load video only when section scrolls into viewport to avoid initial network stall
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            if (!videoRef.current.src || !videoRef.current.src.includes('servicing_movement.mp4')) {
              videoRef.current.src = './assets/videos/servicing_movement.mp4';
              videoRef.current.load();
            }
            videoRef.current.play().catch(() => {});
          } else if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    const sectionEl = document.getElementById('servicing-section');
    if (sectionEl) observer.observe(sectionEl);
    return () => observer.disconnect();
  }, []);

  const modelsList = [
    'Patek Philippe Grand Complications',
    'Jaeger-LeCoultre Polaris Perpetual',
    'Audemars Piguet Royal Oak Openworked',
    'Raymond Weil Freelancer Chronograph',
    'Rolex Cosmograph Daytona',
    'Vacheron Constantin Overseas'
  ];

  return (
    <section id="servicing-section" className="relative w-full py-24 sm:py-32 bg-[#050505] text-white px-4 sm:px-12 border-t border-white/[0.08] overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Servicing Editorial Content (50%) */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8">
          <div>
            <h2 className="font-serif text-4xl sm:text-6xl uppercase tracking-[0.1em] text-white font-light">
              <span className="italic font-normal">SERVICING</span>
            </h2>
            <p className="text-white/70 text-xs sm:text-sm font-sans font-light leading-relaxed max-w-lg mt-4">
              Experience the epitome of luxury service as we preserve the splendor of your treasured heirlooms, ensuring they continue to captivate for generations to come.
            </p>
          </div>

          {/* Model Selection Dropdown */}
          <div className="space-y-2 max-w-md">
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-[#0E0E0E] border border-white/15 rounded-xl py-3.5 px-4 text-xs text-white appearance-none focus:outline-none focus:border-timuse-gold cursor-pointer"
              >
                <option value="">Choose your model</option>
                {modelsList.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-white/50 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#8A8A8A] font-light pl-1">
              Specify your model for personalized servicing benefits.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-2 flex items-center space-x-4">
            <button
              onClick={() => {
                if (onOpenAppointmentModal) onOpenAppointmentModal(selectedModel);
                else showToast('Appointment desk reserved. A master watchmaker will contact you.');
              }}
              className="px-6 py-3.5 rounded-xl border border-white/25 hover:border-timuse-gold hover:bg-white/5 text-xs uppercase tracking-editorial font-medium flex items-center space-x-2 transition-all group"
            >
              <span>BOOK APPOINTMENT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-timuse-gold" />
            </button>
          </div>

          {/* Visual Mode Switcher Pills */}
          <div className="pt-4 flex items-center space-x-3 text-xs">
            <span className="text-[#8A8A8A] text-[11px] uppercase tracking-wider">Inspect:</span>
            <button
              onClick={() => setVisualMode('movement')}
              className={`px-3 py-1 rounded-full border transition-all text-[11px] ${
                visualMode === 'movement'
                  ? 'bg-timuse-gold text-[#050505] font-bold border-timuse-gold'
                  : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
              }`}
            >
              Rotating Calibre Movement
            </button>
            <button
              onClick={() => setVisualMode('wrist')}
              className={`px-3 py-1 rounded-full border transition-all text-[11px] ${
                visualMode === 'wrist'
                  ? 'bg-timuse-gold text-[#050505] font-bold border-timuse-gold'
                  : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
              }`}
            >
              Editorial Tailored Wrist
            </button>
          </div>
        </div>

        {/* Right Column: Visual Stage (Rotating Movement Video / Editorial Wrist Photo) */}
        <div className="lg:col-span-6 relative aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden glass-obsidian border border-white/10 shadow-2xl flex items-center justify-center">
          {visualMode === 'movement' ? (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <video
                ref={videoRef}
                loop
                muted
                playsInline
                preload="none"
                poster="./assets/timuse/editorial_servicing_wrist.jpg"
                className="w-full h-full object-cover rounded-2xl filter contrast-110"
              >
                <img
                  src="./assets/timuse/editorial_servicing_wrist.jpg"
                  alt="Swiss mechanical movement"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </video>
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/80 font-mono text-[11px]">CALIBRE MANUFACTURE ROTOR</span>
                <span className="text-timuse-gold font-bold text-[10px] uppercase">28,800 vph</span>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img
                src="./assets/timuse/editorial_servicing_wrist.jpg"
                alt="Model wrist wearing gold watch with tailored blazer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
