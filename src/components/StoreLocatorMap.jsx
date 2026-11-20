import React, { useState } from 'react';
import { storesData } from '../data/watchesData.js';
import { useUI } from '../context/UIContext.jsx';
import { MapPin, Phone, Mail, Clock, ArrowRight, ExternalLink } from 'lucide-react';

export default function StoreLocatorMap({ onOpenAppointmentModal }) {
  const { showToast } = useUI();
  const [activeStoreId, setActiveStoreId] = useState(storesData[0].id);

  const activeStore = storesData.find(s => s.id === activeStoreId) || storesData[0];

  return (
    <section id="stores-section" className="relative w-full py-24 sm:py-32 bg-[#050505] text-white px-4 sm:px-12 border-t border-white/[0.08]">
      <div className="max-w-[1520px] mx-auto">
        {/* Section Heading */}
        <div className="mb-12">
          <p className="text-xs font-sans uppercase tracking-[0.2em] text-[#8A8A8A] font-light">
            FIND & VISIT
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-[0.1em] font-light text-white mt-1">
            <span className="italic font-normal">STORES NEAR YOU</span>
          </h2>
        </div>

        {/* 2-Column Split: Directory (40%) + Dark Map (60%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Boutique Directory (40%) */}
          <div className="lg:col-span-5 space-y-4 max-h-[640px] overflow-y-auto pr-2">
            {storesData.map((store) => {
              const isActive = store.id === activeStoreId;

              return (
                <div
                  key={store.id}
                  onClick={() => setActiveStoreId(store.id)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isActive
                      ? 'bg-[#0E0E0E] border-white/30 opacity-100 shadow-xl'
                      : 'bg-[#080808] border-white/5 opacity-40 hover:opacity-80'
                  }`}
                >
                  {/* Boutique Photo */}
                  <div className={`mb-4 rounded-xl overflow-hidden aspect-[16/9] w-full transition-all duration-300 border ${
                    isActive
                      ? 'border-timuse-gold/50 shadow-xl ring-1 ring-timuse-gold/40 max-h-48'
                      : 'border-white/10 opacity-75 hover:opacity-100 max-h-36'
                  }`}>
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      {store.status}
                    </span>
                    <span className="text-[11px] text-[#8A8A8A] font-mono">{store.city}</span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-light text-white mt-2">
                    {store.name}
                  </h3>

                  <p className="text-xs text-white/70 font-light mt-1">
                    {store.address}
                  </p>

                  {isActive && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-white/80 animate-fadeIn">
                      <p className="flex items-center space-x-2 text-[11px]">
                        <Mail className="w-3.5 h-3.5 text-timuse-gold" />
                        <span className="font-mono text-white/70">{store.email}</span>
                      </p>
                      <p className="flex items-center space-x-2 text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-timuse-gold" />
                        <span className="font-mono text-white/70">{store.phone}</span>
                      </p>

                      <div className="pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenAppointmentModal) onOpenAppointmentModal(store.name);
                            else showToast(`Salon appointment scheduled at ${store.name}`);
                          }}
                          className="w-full py-2.5 rounded-xl border border-white/20 hover:border-timuse-gold hover:bg-white/5 text-xs font-semibold tracking-editorial uppercase transition-all"
                        >
                          BOOK APPOINTMENT
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Custom Dark Vector Map of Austin (60%) */}
          <div className="lg:col-span-7 relative h-[480px] sm:h-[640px] rounded-3xl overflow-hidden glass-obsidian border border-white/15 shadow-2xl flex items-center justify-center group">
            {/* Dark Map Vector Texture */}
            <div className="absolute inset-0 bg-[#080808]">
              <img
                src="./assets/timuse/stores_vector_map.jpg"
                alt="Austin Dark Vector Map"
                className="w-full h-full object-cover filter contrast-125 opacity-75 group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/30 to-[#050505] pointer-events-none" />
            </div>

            {/* City Label Overlay */}
            <div className="absolute bottom-8 right-8 z-20 pointer-events-none">
              <span className="font-serif text-3xl sm:text-5xl font-light tracking-[0.2em] text-white/20 select-none">
                AUSTIN
              </span>
            </div>

            {/* Interactive Square Pins Labeled TM */}
            {storesData.map((store) => {
              const isSelected = store.id === activeStoreId;

              return (
                <div
                  key={store.id}
                  onClick={() => setActiveStoreId(store.id)}
                  style={{
                    left: `${store.coordinates.x}%`,
                    top: `${store.coordinates.y}%`,
                  }}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-300 hover:scale-110"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-serif text-xs font-bold tracking-wider shadow-2xl transition-all ${
                      isSelected
                        ? 'bg-white text-[#050505] ring-4 ring-timuse-gold/50 scale-110'
                        : 'bg-[#181818]/90 text-white/80 border border-white/20 hover:border-white'
                    }`}
                  >
                    TM
                  </div>
                  {isSelected && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-black/95 border border-timuse-gold/40 text-[9px] uppercase font-mono tracking-wider text-timuse-gold whitespace-nowrap shadow-lg">
                      {store.id === 'austin-flagship' ? 'FLAGSHIP SALON' : store.id === 'austin-technology' ? 'ARMORED VAULT' : 'CONCIERGE LOUNGE'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
