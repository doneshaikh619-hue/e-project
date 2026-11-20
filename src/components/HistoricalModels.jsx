import React, { useState } from 'react';
import { watchesData } from '../data/watchesData.js';
import { useUI } from '../context/UIContext.jsx';
import { formatPrice } from '../utils/formatters.js';
import { ChevronLeft, ChevronRight, Eye, ShoppingBag } from 'lucide-react';

export default function HistoricalModels() {
  const { navigateToProduct, setQuickViewWatch } = useUI();
  const [scrollIndex, setScrollIndex] = useState(0);

  const historicalWatches = watchesData.filter(w => w.historical || w.price > 100000).slice(0, 4);

  return (
    <section id="historical-section" className="relative w-full py-24 sm:py-32 bg-[#050505] text-white px-4 sm:px-12 border-t border-white/[0.08] overflow-hidden select-none">
      {/* Background Watermark: Giant Ultra-low-opacity Watch Dial */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
        <div className="w-[800px] h-[800px] rounded-full border-[12px] border-white flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full border-[4px] border-white/50" />
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto space-y-16 relative z-10">
        {/* Centered Heading */}
        <div className="text-center space-y-2">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#8A8A8A] font-light">
            GENEVA PRIVATE ARCHIVE
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-[0.15em] font-light text-white">
            HISTORICAL MODELS
          </h2>
        </div>

        {/* 4 Iconic Watches Carousel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {historicalWatches.map(watch => (
            <div
              key={watch.id}
              onClick={() => navigateToProduct(watch.id)}
              className="group p-6 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] hover:border-white/30 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div className="relative py-8 flex items-center justify-center">
                <img
                  src={watch.image || (watch.images && watch.images[0]) || './assets/watches/raymond_weil_basquiat.png'}
                  alt={watch.name}
                  className="w-44 h-44 sm:w-52 sm:h-52 object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]"
                />
              </div>

              <div className="space-y-1 text-center pt-4 border-t border-white/[0.06]">
                <h4 className="font-serif text-sm font-medium tracking-wider text-white group-hover:text-timuse-gold transition-colors truncate">
                  {watch.name}
                </h4>
                <p className="text-[10px] font-sans uppercase tracking-widest text-[#8A8A8A] truncate">
                  {watch.reference}
                </p>
                <p className="font-serif text-sm text-white/90 pt-1">
                  {formatPrice(watch.price)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Horizontal Progress Bar Indicator */}
        <div className="max-w-xs mx-auto flex items-center justify-center space-x-2 pt-4">
          <div className="h-[2px] w-12 bg-white rounded-full" />
          <div className="h-[2px] w-6 bg-white/20 rounded-full" />
          <div className="h-[2px] w-6 bg-white/20 rounded-full" />
        </div>

        {/* "WHERE TIME MEETS ELEGANCE" Editorial Statement */}
        <div className="pt-16 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <h3 className="font-serif text-3xl sm:text-5xl uppercase tracking-[0.1em] font-light text-white leading-tight">
              WHERE TIME MEETS <br />
              <span className="italic font-normal">ELEGANCE</span>
            </h3>
          </div>
          <div className="md:col-span-5">
            <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
              Our platform isn't just about one luxury watch; it's a destination where users can explore multiple prestigious brands in one sophisticated setting.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
