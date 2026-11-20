import React, { useRef, useState, useEffect } from 'react';
import { useUI } from '../context/UIContext.jsx';
import { ArrowDown, ZoomIn, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroBasquiat({ onOpenBooking }) {
  const containerRef = useRef(null);
  const videoWrapperRef = useRef(null);
  const textRef = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smooth initial reveal
      gsap.fromTo(
        videoWrapperRef.current,
        { scale: 1.05, opacity: 0 },
        { scale: 1.0, opacity: 1, duration: 1.6, ease: 'power3.out' }
      );

      gsap.fromTo(
        textRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, delay: 0.4, ease: 'power3.out' }
      );

      // ScrollTrigger: Seamless Macro dial zoom as the user scrolls
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
        onUpdate: (self) => {
          const progress = self.progress;
          if (videoWrapperRef.current) {
            // Smoothly zoom in up to 1.8x without letterbox
            gsap.to(videoWrapperRef.current, {
              scale: 1 + progress * 0.8,
              duration: 0.1,
              overwrite: 'auto'
            });
          }
          if (textRef.current) {
            gsap.to(textRef.current, {
              opacity: 1 - progress * 1.8,
              y: -progress * 80,
              duration: 0.1,
              overwrite: 'auto'
            });
          }
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleManualZoomToggle = () => {
    setIsZoomed(!isZoomed);
    if (!isZoomed) {
      gsap.to(videoWrapperRef.current, { scale: 1.6, duration: 0.8, ease: 'power2.out' });
    } else {
      gsap.to(videoWrapperRef.current, { scale: 1.0, duration: 0.8, ease: 'power2.out' });
    }
  };

  const scrollToDiscovery = () => {
    const el = document.getElementById('find-my-watch-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] flex items-center justify-center overflow-hidden select-none"
    >
      {/* Full-Bleed 100% Screen Filling 3D Chronograph Video */}
      <div
        ref={videoWrapperRef}
        onClick={handleManualZoomToggle}
        className="absolute inset-0 w-full h-full cursor-pointer transition-transform origin-center"
        title="Click to toggle Macro Dial Zoom"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center filter brightness-105 contrast-110"
          poster="./assets/timuse/hero_basquiat_watch.jpg"
        >
          <source src="./assets/videos/hero_chronograph.mp4" type="video/mp4" />
          <img
            src="./assets/timuse/hero_basquiat_watch.jpg"
            alt="Raymond Weil Basquiat Chronograph"
            className="w-full h-full object-cover object-center"
          />
        </video>
      </div>

      {/* Cinematic Edge Gradients for Smooth Seamless Blending */}
      {/* Top Header shadow blend */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050505]/95 via-[#050505]/40 to-transparent pointer-events-none z-10" />

      {/* Bottom section blend to pitch black obsidian */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent pointer-events-none z-10" />

      {/* Subtle radial vignette focus */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/15 to-black/60 pointer-events-none z-10" />

      {/* Floating Interactive Macro Dial Zoom Pill */}
      <div className="absolute top-24 right-6 sm:right-12 z-20">
        <button
          onClick={handleManualZoomToggle}
          className="bg-black/65 hover:bg-black/85 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-[11px] uppercase tracking-wider text-white flex items-center space-x-2 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
        >
          <ZoomIn className="w-3.5 h-3.5 text-[#E5C158]" />
          <span>{isZoomed ? 'Reset View' : 'Macro Dial Zoom (1.6x)'}</span>
        </button>
      </div>

      {/* Typography Overlay: Bottom-Left Aligned */}
      <div
        ref={textRef}
        className="absolute bottom-12 left-6 sm:bottom-16 sm:left-14 z-20 space-y-2 pointer-events-none max-w-2xl"
      >
        <div className="flex items-center space-x-2">
          <span className="w-6 h-[1px] bg-[#E5C158]" />
          <p className="text-[11px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#8A8A8A] font-medium">
            FREELANCER BASQUIAT SPECIAL EDITION
          </p>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl text-white font-light tracking-[0.04em] leading-[1.05]">
          RAYMOND WEIL <br />
          <span className="italic font-normal text-white/95">X BASQUIAT™</span>
        </h1>

        <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-md pt-1 hidden sm:block">
          Grade 2 Titanium chronograph engineered with the raw neo-expressionist strokes of Jean-Michel Basquiat.
        </p>
      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={scrollToDiscovery}
        className="absolute bottom-10 right-6 sm:right-14 z-20 flex items-center space-x-3 text-[11px] sm:text-xs uppercase tracking-widest text-[#8A8A8A] hover:text-white transition-colors group bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10"
      >
        <span>Explore Collection</span>
        <ArrowDown className="w-3.5 h-3.5 text-[#E5C158] group-hover:translate-y-1 transition-transform animate-bounce" />
      </button>
    </section>
  );
}
