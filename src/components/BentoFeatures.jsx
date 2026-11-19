import React from 'react';
import { ShieldCheck, Compass, Sparkles, Gem, Truck, Lock, Clock, Award } from 'lucide-react';

export default function BentoFeatures() {
  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-bold flex items-center justify-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Haute Horlogerie Standards</span>
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-100 mt-2">
          The Pillars of Swiss Perfection
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
          Every timepiece acquired through WatchHub undergoes the world's most rigorous mechanical, aesthetic, and historical verification protocols.
        </p>
      </div>

      {/* Asymmetric 21st.dev Style Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Large Feature 1: Movement Precision */}
        <div className="md:col-span-2 lg:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between group">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold mb-6 shadow-gold-sm">
              <Compass className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Chronometric Superlative</span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-100 mt-1">
              Manufacture Calibres & COSC Certification
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed max-w-md">
              From tourbillon balance cages to silicon hairsprings oscillating at 28,800 vibrations per hour, we curate calibres meeting METAS and Contrôle Officiel Suisse des Chronomètres benchmarks.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-luxury-gold">
              <Clock className="w-4 h-4" />
              <span>-2 / +2 sec/day tolerance</span>
            </div>
            <span className="text-slate-500">Geneva Seal Standard</span>
          </div>

          {/* Background subtle gear overlay */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 border border-luxury-gold/10 rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        </div>

        {/* Feature 2: Armored Vault Transport */}
        <div className="glass-card rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold mb-6 shadow-gold-sm">
              <Truck className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Armored Courier</span>
            <h3 className="font-serif text-lg font-bold text-slate-100 mt-1">
              100% Insured Handoff
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Transported in bonded security vaults with biometric lockboxes directly to your private estate or Swiss salon.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Biometric Custody Chain</span>
          </div>
        </div>

        {/* Feature 3: Authenticity & Archival Provenance */}
        <div className="glass-card rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold mb-6 shadow-gold-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">48-Point Audit</span>
            <h3 className="font-serif text-lg font-bold text-slate-100 mt-1">
              Manufacturer Ledger Match
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Laser hallmark verification and micro-spectroscopy guarantee zero aftermarket components or unauthorized modifications.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-luxury-gold font-semibold flex items-center space-x-1">
            <Award className="w-3.5 h-3.5" />
            <span>Official Factory Guarantee</span>
          </div>
        </div>

        {/* Feature 4: 5-Year Protection */}
        <div className="glass-card rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold mb-6 shadow-gold-sm">
              <Gem className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Master Care</span>
            <h3 className="font-serif text-lg font-bold text-slate-100 mt-1">
              5-Year Protection Plan
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Complete movement demagnetization, lubrication, and gasket restoration performed by Swiss master artisans.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400">
            Complimentary biannual service
          </div>
        </div>

        {/* Feature 5: Private VIP Salon */}
        <div className="md:col-span-2 lg:col-span-3 glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 group">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Private Connoisseur Service</span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">
              Private Allocation & Bespoke Sourcing
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Seeking an off-catalog Patek Philippe Grand Complication or discontinued Rolex Daytona meteorite dial? Our private acquisitions team taps into international private collections worldwide.
            </p>
          </div>
          <div className="shrink-0">
            <button className="gold-button px-6 py-3 rounded-xl text-xs font-bold text-luxury-950 uppercase tracking-wider">
              Reserve Salon Appointment
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
