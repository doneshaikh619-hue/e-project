import React from 'react';
import { useUI } from '../context/UIContext.jsx';
import { formatPrice } from '../utils/formatters.js';
import { ArrowRight, ShieldCheck, Sparkles, Compass, Star, RotateCw } from 'lucide-react';

export default function HeroSection({ heroWatch }) {
  const { navigateTo, navigateToProduct } = useUI();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-12 pb-20 px-4 sm:px-8">
      {/* Background Ambient Lighting & Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-luxury-gold/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-950/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Content Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[11px]">The Pinnacle of Haute Horlogerie</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 leading-[1.15] tracking-tight">
            Timeless Legacy. <br />
            <span className="gold-gradient-text">Engineered For Eternity.</span>
          </h1>

          {/* Subtext */}
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
            Enter the private salon of certified investment-grade Swiss timepieces. Each mechanical marvel is audited for precision, provenance, and museum-grade condition.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              onClick={() => navigateTo('catalog')}
              className="w-full sm:w-auto gold-button px-8 py-3.5 rounded-xl text-xs font-bold text-luxury-950 flex items-center justify-center space-x-2 shadow-gold-glow"
            >
              <span>Explore The Vault</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (heroWatch?.id) navigateToProduct(heroWatch.id);
                else navigateTo('catalog');
              }}
              className="w-full sm:w-auto gold-button-outline px-6 py-3.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2"
            >
              <RotateCw className="w-4 h-4 text-luxury-gold" />
              <span>Launch 360° Studio</span>
            </button>
          </div>

          {/* Luxury Micro-Metrics Strip */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-6 text-left max-w-lg mx-auto lg:mx-0">
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold text-slate-100">$180M+</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Curated Vault</span>
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold text-luxury-gold">100%</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Swiss Certified</span>
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold text-emerald-400">0.8s</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Vault Speed</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Watch Floating Stage */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          <div className="relative group cursor-pointer" onClick={() => heroWatch && navigateToProduct(heroWatch.id)}>
            {/* Pulsing Aura */}
            <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-luxury-gold/20 to-transparent blur-3xl animate-pulse-slow absolute inset-0 -z-10" />

            {/* Watch cutout render */}
            <div className="relative z-10 animate-float">
              <img
                src={heroWatch?.images[0] || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85"}
                alt="Rolex Cosmograph Daytona"
                className="w-72 h-72 sm:w-88 sm:h-88 object-cover rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.95)] border-4 border-luxury-gold/40 ring-4 ring-white/5 transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating Glass Badge 1: Model Specs */}
              <div className="absolute -bottom-4 -left-4 sm:-left-8 glass-card p-3 rounded-2xl border border-luxury-gold/30 shadow-2xl flex items-center space-x-3 backdrop-blur-xl animate-fadeIn">
                <div className="w-9 h-9 rounded-xl bg-luxury-gold/15 border border-luxury-gold/40 flex items-center justify-center text-luxury-gold">
                  <Compass className="w-5 h-5 animate-spin [animation-duration:12s]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-luxury-gold tracking-widest">{heroWatch?.brand || 'Rolex'}</p>
                  <p className="text-xs font-semibold text-slate-100 truncate max-w-[150px]">{heroWatch?.name || 'Cosmograph Daytona'}</p>
                  <p className="text-xs font-serif font-bold text-slate-200 mt-0.5">{formatPrice(heroWatch?.price || 34500)}</p>
                </div>
              </div>

              {/* Floating Glass Badge 2: Hallmark Verification */}
              <div className="absolute -top-4 -right-4 glass-card px-3 py-2 rounded-xl border border-emerald-500/30 shadow-2xl flex items-center space-x-2 backdrop-blur-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-semibold text-slate-200 uppercase tracking-wider">Geneva Hallmark</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
