import React, { useState, useRef } from 'react';
import { brandsData } from '../data/watchesData.js';
import { useUI } from '../context/UIContext.jsx';
import { ArrowUpRight } from 'lucide-react';

export default function OurBrandsPortal() {
  const { navigateTo } = useUI();
  const [hoveredBrandName, setHoveredBrandName] = useState(null);
  const videoRefs = useRef({});

  const handleMouseEnter = (brand) => {
    setHoveredBrandName(brand.name);
    const vid = videoRefs.current[brand.name];
    if (vid) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    }
  };

  const handleMouseLeave = (brand) => {
    setHoveredBrandName(null);
    const vid = videoRefs.current[brand.name];
    if (vid) {
      vid.pause();
    }
  };

  return (
    <section id="brands-section" className="relative w-full py-24 sm:py-32 bg-[#050505] text-white px-4 sm:px-12 border-t border-white/[0.08] overflow-hidden select-none">
      {/* Centered Section Title */}
      <div className="text-center mb-16 sm:mb-24">
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-[0.15em] uppercase font-light">
          <span className="text-white/40 font-extralight mr-3">OUR</span>
          <span className="italic font-normal text-white">BRANDS</span>
        </h2>
      </div>

      {/* Stacked Horizontal Brand Rows */}
      <div className="max-w-[1440px] mx-auto border-t border-b border-white/[0.12] divide-y divide-white/[0.12]">
        {brandsData.map((brand) => {
          const isHovered = hoveredBrandName === brand.name;

          return (
            <div
              key={brand.name}
              onMouseEnter={() => handleMouseEnter(brand)}
              onMouseLeave={() => handleMouseLeave(brand)}
              onClick={() => navigateTo('catalog')}
              className="relative py-8 sm:py-12 px-4 sm:px-8 cursor-pointer transition-all duration-500 overflow-hidden group flex items-center justify-between"
            >
              {/* Row Cinematic Background Video / Light-Streak Ribbon on Hover */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                  isHovered ? 'opacity-100 z-0' : 'opacity-0 -z-10'
                }`}
              >
                <video
                  ref={(el) => (videoRefs.current[brand.name] = el)}
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover filter brightness-115 contrast-125"
                >
                  <source src="./assets/videos/brand_light_streak.mp4" type="video/mp4" />
                  <img
                    src={brand.ribbon || "./assets/timuse/patek_brand_ribbon.jpg"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </video>
                {/* Horizontal Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]/90" />
              </div>

              {/* Brand Typography Title (Left) */}
              <div className="relative z-10 flex items-center space-x-6">
                <h3
                  className={`font-serif text-2xl sm:text-4xl md:text-5xl uppercase tracking-[0.1em] transition-all duration-300 ${
                    isHovered
                      ? 'text-white translate-x-3 font-normal'
                      : 'text-white/80 group-hover:text-white font-light'
                  }`}
                >
                  {brand.name}
                </h3>
              </div>

              {/* Right Side: Pop-out 3D Flagship Watch Cutout & Arrow */}
              <div className="relative z-10 flex items-center space-x-6">
                {/* 3D Floating Watch Cutout (Reveals on Hover) */}
                <div
                  className={`hidden sm:block transition-all duration-500 transform ${
                    isHovered
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                  }`}
                >
                  <img
                    src={brand.heroWatch}
                    alt={brand.name}
                    className="w-24 h-24 sm:w-36 sm:h-36 object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)] -my-6 transition-transform group-hover:scale-105"
                  />
                </div>

                <div
                  className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition-all ${
                    isHovered
                      ? 'border-[#E5C158] text-[#E5C158] rotate-45 bg-[#E5C158]/10 shadow-[0_0_15px_rgba(229,193,88,0.3)]'
                      : 'border-white/20 text-white/50 group-hover:border-white/40 group-hover:text-white'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
