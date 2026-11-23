import React, { useState, useRef, useEffect } from 'react';
import { watchesData } from '../data/watchesData.js';
import { useUI } from '../context/UIContext.jsx';
import { formatPrice } from '../utils/formatters.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HistoricalModels() {
  const { navigateToProduct } = useUI();
  const scrollContainerRef = useRef(null);
  const [activePage, setActivePage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Curate 12 pinnacle historical & complication watches from private vault archive
  const historicalWatchIds = [
    'wh-5316-50p',
    'wh-5260-rainbow',
    'wh-5304-repeater',
    'wh-5531g-world',
    'wh-5204-300r',
    'wh-vacheron-overseas',
    'wh-royal-oak-double',
    'wh-5326g',
    'wh-calatrava-pilot',
    'wh-rolex-daytona',
    'wh-polaris',
    'wh-santos-skeleton'
  ];

  const historicalWatches = historicalWatchIds
    .map(id => watchesData.find(w => w.id === id))
    .filter(Boolean);

  const totalPages = 3;

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) return;
    const progress = container.scrollLeft / maxScroll;
    const page = Math.round(progress * (totalPages - 1));
    setActivePage(Math.min(Math.max(0, page), totalPages - 1));
  };

  const scrollToPage = (pageIdx) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) return;
    const target = (pageIdx / (totalPages - 1)) * maxScroll;
    container.scrollTo({ left: target, behavior: 'smooth' });
    setActivePage(pageIdx);
  };

  const scrollNext = () => {
    if (activePage < totalPages - 1) {
      scrollToPage(activePage + 1);
    } else {
      scrollToPage(0);
    }
  };

  const scrollPrev = () => {
    if (activePage > 0) {
      scrollToPage(activePage - 1);
    } else {
      scrollToPage(totalPages - 1);
    }
  };

  // Subtle auto-advance every 7 seconds when not actively hovering/interacting
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll > 10) {
          if (container.scrollLeft >= maxScroll - 20) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
            setActivePage(0);
          } else {
            container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
          }
        }
      }
    }, 7000);

    return () => clearInterval(timer);
  }, [isHovered, totalPages]);

  return (
    <section
      id="historical-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full py-24 sm:py-32 bg-[#050505] text-white px-4 sm:px-12 border-t border-white/[0.08] overflow-hidden select-none"
    >
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

        {/* Carousel Container */}
        <div className="relative">
          {/* Floating Side Nav Controls for Large Screens */}
          <button
            onClick={scrollPrev}
            aria-label="Previous Models"
            className="hidden xl:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#0E0E0E]/90 border border-white/15 hover:border-white/50 text-white/80 hover:text-white items-center justify-center transition-all duration-300 backdrop-blur-md shadow-2xl hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Sliding Track */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 sm:gap-8 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {historicalWatches.map(watch => (
              <div
                key={watch.id}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 snap-start"
              >
                <div
                  onClick={() => navigateToProduct(watch.id)}
                  className="group p-6 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] hover:border-white/30 transition-all duration-300 flex flex-col justify-between cursor-pointer h-full"
                >
                  <div className="relative py-8 flex items-center justify-center">
                    <img
                      src={watch.image || (watch.images && watch.images[0]) || './assets/watches/patek_5316_platinum.webp'}
                      alt={watch.name}
                      loading="lazy"
                      decoding="async"
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
              </div>
            ))}
          </div>

          <button
            onClick={scrollNext}
            aria-label="Next Models"
            className="hidden xl:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#0E0E0E]/90 border border-white/15 hover:border-white/50 text-white/80 hover:text-white items-center justify-center transition-all duration-300 backdrop-blur-md shadow-2xl hover:scale-105"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Horizontal Progress Bar Indicator & Chevrons */}
        <div className="max-w-md mx-auto flex items-center justify-center space-x-4 pt-2">
          <button
            onClick={scrollPrev}
            aria-label="Previous archival models"
            className="w-8 h-8 rounded-full border border-white/15 hover:border-white/50 bg-[#0E0E0E] text-white/70 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-105"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Clickable Progress Bars */}
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToPage(i)}
                aria-label={`View Archive Collection Page ${i + 1}`}
                className={`h-[2px] transition-all duration-500 rounded-full cursor-pointer ${
                  activePage === i
                    ? 'w-12 bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                    : 'w-6 bg-white/20 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={scrollNext}
            aria-label="Next archival models"
            className="w-8 h-8 rounded-full border border-white/15 hover:border-white/50 bg-[#0E0E0E] text-white/70 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-105"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
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
