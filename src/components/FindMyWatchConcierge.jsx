import React, { useState, useEffect, useRef } from 'react';
import { watchesData } from '../data/watchesData.js';
import { useUI } from '../context/UIContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { formatPrice } from '../utils/formatters.js';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShoppingBag,
  Heart,
  SlidersHorizontal,
  Check,
  RotateCcw,
  Eye,
  X
} from 'lucide-react';
import gsap from 'gsap';

export default function FindMyWatchConcierge() {
  const { navigateToProduct, setQuickViewWatch, showToast } = useUI();
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Mode: 'matrix' (floating search overview) or 'split' (active discovery view)
  const [viewMode, setViewMode] = useState('split');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Classic and Minimalist');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(true);
  const [activeFilterDropdown, setActiveFilterDropdown] = useState(false);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('All');

  // Typewriter effect state
  const [placeholderText, setPlaceholderText] = useState('');
  const fullPlaceholder = 'e.g. I want a skeletonized mechanical watch';

  const gridRef = useRef(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setPlaceholderText(fullPlaceholder.slice(0, index));
      index++;
      if (index > fullPlaceholder.length + 5) {
        index = 0;
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Filter watches dynamically
  const filteredWatches = watchesData.filter(watch => {
    // If style selected via AI concierge
    if (selectedStyle && selectedStyle !== 'All') {
      if (watch.style.toLowerCase() !== selectedStyle.toLowerCase()) {
        return false;
      }
    }
    // Brand filter
    if (selectedBrandFilter !== 'All') {
      if (watch.brand.toLowerCase() !== selectedBrandFilter.toLowerCase()) {
        return false;
      }
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        watch.name.toLowerCase().includes(q) ||
        watch.brand.toLowerCase().includes(q) ||
        watch.reference.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
    // Stagger animation on grid re-render
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 15, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.5, ease: 'power2.out' }
      );
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setViewMode('split');
  };

  const handleAddToCart = (e, watch) => {
    e.stopPropagation();
    addToCart(watch, 1);
    showToast(`${watch.name} added to acquisition portfolio.`);
    setIsCartOpen(true);
  };

  const handleToggleWishlist = async (e, watch) => {
    e.stopPropagation();
    const added = await toggleWishlist(watch);
    showToast(added ? 'Saved to private wishlist' : 'Removed from wishlist');
  };

  return (
    <section id="find-my-watch-section" className="relative w-full min-h-screen bg-[#050505] text-white py-16 px-4 sm:px-8 border-t border-white/[0.08]">
      {/* MODE 1: MATRIX HERO OVERVIEW */}
      {viewMode === 'matrix' ? (
        <div className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
          {/* Continuous Floating Watches Matrix in Background */}
          <div className="absolute inset-0 grid grid-cols-3 sm:grid-cols-5 gap-6 opacity-40 pointer-events-none select-none">
            {/* Column 1 */}
            <div className="flex flex-col space-y-12">
              <img src="./assets/watches/jlc_polaris_perpetual.png" alt="" className="w-36 h-36 object-contain" />
              <img src="./assets/watches/leather_strap.png" alt="" className="w-32 h-32 object-contain" />
              <img src="./assets/watches/patek_5260_rainbow.png" alt="" className="w-36 h-36 object-contain" />
            </div>
            {/* Column 2 */}
            <div className="flex flex-col space-y-12 translate-y-8">
              <img src="./assets/watches/jlc_master_control.png" alt="" className="w-36 h-36 object-contain" />
              <img src="./assets/watches/leather_strap.png" alt="" className="w-32 h-32 object-contain" />
              <img src="./assets/watches/patek_5326g_annual.png" alt="" className="w-36 h-36 object-contain" />
            </div>
            {/* Column 3 */}
            <div className="flex flex-col space-y-12">
              <img src="./assets/watches/jlc_master_ultra_thin.png" alt="" className="w-36 h-36 object-contain" />
              <img src="./assets/watches/raymond_weil_basquiat.png" alt="" className="w-36 h-36 object-contain" />
              <img src="./assets/watches/patek_5531g_world_time.png" alt="" className="w-36 h-36 object-contain" />
            </div>
            {/* Column 4 */}
            <div className="hidden sm:flex flex-col space-y-12 translate-y-8">
              <img src="./assets/watches/patek_5304_repeater.png" alt="" className="w-36 h-36 object-contain" />
              <img src="./assets/watches/ap_royal_oak_openworked.png" alt="" className="w-32 h-32 object-contain" />
              <img src="./assets/watches/rolex_daytona_everose.png" alt="" className="w-36 h-36 object-contain" />
            </div>
            {/* Column 5 */}
            <div className="hidden sm:flex flex-col space-y-12">
              <img src="./assets/watches/patek_5524g_pilot.png" alt="" className="w-36 h-36 object-contain" />
              <img src="./assets/watches/vc_overseas_skeleton.png" alt="" className="w-32 h-32 object-contain" />
              <img src="./assets/watches/jlc_polaris_perpetual.png" alt="" className="w-36 h-36 object-contain" />
            </div>
          </div>

          {/* Center Focal Search Overlay */}
          <div className="relative z-20 text-center max-w-xl mx-auto space-y-6 px-4">
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl uppercase tracking-[0.1em] text-white font-light">
              FIND MY WATCH
            </h2>

            {/* Pulsing White Dot */}
            <div className="w-2 h-2 rounded-full bg-white mx-auto animate-ping" />

            {/* Typewriter Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              onClick={() => setViewMode('split')}
              className="relative max-w-lg mx-auto cursor-pointer"
            >
              <input
                type="text"
                readOnly
                value={searchQuery || placeholderText}
                className="w-full bg-[#0E0E0E]/80 backdrop-blur-md border border-white/25 rounded-full py-4 pl-6 pr-14 text-xs sm:text-sm text-white focus:outline-none focus:border-timuse-gold cursor-pointer"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-timuse-gold hover:text-black transition-colors flex items-center justify-center text-white"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={() => setViewMode('split')}
              className="text-[11px] uppercase tracking-editorial text-timuse-gold underline hover:text-white transition-colors"
            >
              Launch Interactive AI Concierge & Discovery Grid →
            </button>
          </div>
        </div>
      ) : (
        /* MODE 2: SPLIT DISCOVERY VIEW WITH AI CONCIERGE DRAWER */
        <div className="space-y-6 max-w-[1720px] mx-auto">
          {/* Top Control Bar: Active Prompt, Count & Filter Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
            <div>
              <p className="font-sans text-xs sm:text-sm text-[#8A8A8A] font-light">
                {searchQuery || "I want a skeletonized mechanical watch"}
              </p>
              <h2 className="font-serif text-xl sm:text-2xl text-white font-light mt-0.5">
                {filteredWatches.length} units available
              </h2>
            </div>

            {/* Filter Dropdown Toggle */}
            <div className="flex items-center space-x-3 relative">
              <button
                onClick={() => setActiveFilterDropdown(!activeFilterDropdown)}
                className="px-4 py-2 rounded-xl glass-obsidian text-xs font-light tracking-editorial text-white/90 hover:border-timuse-gold flex items-center space-x-2 transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-timuse-gold" />
                <span>Filter: {selectedBrandFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/60" />
              </button>

              {activeFilterDropdown && (
                <div className="absolute right-0 top-12 w-48 rounded-xl glass-obsidian p-2 shadow-2xl z-40 border border-white/20 text-xs animate-fadeIn">
                  {['All', 'PATEK PHILIPPE', 'JAEGER-LECOULTRE', 'AUDEMARS PIGUET', 'RAYMOND WEIL', 'ROLEX'].map(b => (
                    <button
                      key={b}
                      onClick={() => { setSelectedBrandFilter(b); setActiveFilterDropdown(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                        selectedBrandFilter === b ? 'text-timuse-gold font-semibold bg-white/5' : 'text-white/80 hover:bg-white/5'
                      }`}
                    >
                      <span>{b}</span>
                      {selectedBrandFilter === b && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setViewMode('matrix')}
                className="text-[11px] text-[#8A8A8A] hover:text-white underline"
              >
                Reset Matrix
              </button>
            </div>
          </div>

          {/* Main Workspace Layout */}
          <div className="flex flex-col lg:flex-row gap-8 items-start relative">
            {/* Left Main Product Grid (Expands to 4 columns when drawer collapsed) */}
            <div className="flex-grow w-full transition-all duration-500">
              <div
                ref={gridRef}
                className={`grid gap-6 sm:gap-8 ${
                  isAiDrawerOpen
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}
              >
                {filteredWatches.map(watch => (
                  <div
                    key={watch.id}
                    onClick={() => navigateToProduct(watch.id)}
                    className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] hover:border-white/30 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    {/* Top Action Icons */}
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[10px] font-sans uppercase tracking-widest text-[#8A8A8A]">
                        {watch.brand}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); setQuickViewWatch(watch); }}
                          className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                          title="Quick Inspect"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleToggleWishlist(e, watch)}
                          className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-rose-500 transition-colors"
                          title="Wishlist"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isInWishlist(watch.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Isolated Watch Image with Floor Shadow & Hover Lift */}
                    <div className="relative py-8 flex items-center justify-center">
                      <img
                        src={watch.image || (watch.images && watch.images[0]) || './assets/watches/raymond_weil_basquiat.png'}
                        alt={watch.name}
                        className="w-48 h-48 sm:w-56 sm:h-56 object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]"
                      />
                    </div>

                    {/* Watch Title & Reference Subtitle */}
                    <div className="space-y-1 pt-4 border-t border-white/[0.06]">
                      <h3 className="font-serif text-sm sm:text-base font-light tracking-wide text-white group-hover:text-timuse-gold transition-colors line-clamp-1">
                        {watch.name}
                      </h3>
                      <p className="text-[11px] font-sans text-[#8A8A8A] tracking-wider uppercase truncate">
                        {watch.reference}
                      </p>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="font-serif text-base text-white/95 font-medium">
                          {formatPrice(watch.price)}
                        </span>
                        <button
                          onClick={(e) => handleAddToCart(e, watch)}
                          className="px-3 py-1 rounded-full border border-white/15 hover:border-timuse-gold hover:bg-timuse-gold hover:text-[#050505] text-[10px] font-bold tracking-wider uppercase transition-colors"
                        >
                          Acquire
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredWatches.length === 0 && (
                <div className="text-center py-20 space-y-3">
                  <p className="font-serif text-lg text-white">No timepieces match this filter specification.</p>
                  <p className="text-xs text-[#8A8A8A]">Choose another aesthetic style or reset brand criteria.</p>
                  <button
                    onClick={() => { setSelectedStyle('All'); setSelectedBrandFilter('All'); }}
                    className="px-5 py-2 rounded-xl gold-chip text-xs uppercase font-bold"
                  >
                    View All Master Allocations
                  </button>
                </div>
              )}
            </div>

            {/* Right Floating Drawer: AI Concierge Assistant (380px) */}
            <aside
              className={`shrink-0 w-full lg:w-[380px] rounded-3xl glass-obsidian border border-white/15 p-6 transition-all duration-500 sticky top-24 ${
                !isAiDrawerOpen ? 'lg:w-[70px] lg:p-4' : ''
              }`}
            >
              {/* Header Toggle */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className={`flex items-center space-x-2 ${!isAiDrawerOpen ? 'hidden' : ''}`}>
                  <span className="w-2 h-2 rounded-full bg-timuse-gold animate-ping" />
                  <h3 className="font-serif text-sm uppercase tracking-widest text-white font-light">
                    FIND MY WATCH
                  </h3>
                </div>
                <button
                  onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
                  className="p-1 rounded-lg text-white/60 hover:text-white"
                  title={isAiDrawerOpen ? "Collapse AI Assistant" : "Expand AI Assistant"}
                >
                  {isAiDrawerOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              </div>

              {isAiDrawerOpen && (
                <div className="space-y-4 pt-4 text-xs">
                  {/* User Message Bubble (Champagne Gold Pill, Right Aligned) */}
                  <div className="flex justify-end">
                    <div className="bg-[#E5C158] text-[#050505] font-semibold text-xs px-4 py-2.5 rounded-2xl rounded-tr-none shadow-md max-w-[85%]">
                      I want a skeletonized mechanical watch
                    </div>
                  </div>

                  {/* AI Response Bubble (Dark Card with Star Icon) */}
                  <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
                    <div className="flex items-center space-x-1.5 text-timuse-gold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">TIMUSE Concierge</span>
                    </div>
                    <p className="text-white/80 leading-relaxed text-[11px] font-light">
                      Great! I found several exquisite skeletonized and openworked calibres matching your interest. Could you share what visual look resonates with you most?
                    </p>
                  </div>

                  {/* Interactive Quick-Filter Question Card */}
                  <div className="p-4 rounded-2xl bg-[#0E0E0E] border border-white/10 space-y-3">
                    <p className="text-white/90 text-[11px] font-medium">
                      What kind of look are you drawn to in a watch?
                    </p>

                    {/* 4 Interactive Buttons */}
                    <div className="space-y-2">
                      {[
                        'Classic and Minimalist',
                        'Bold and sporty',
                        'Elegant and sophisticated',
                        'Unique and trendy'
                      ].map(style => (
                        <button
                          key={style}
                          onClick={() => handleStyleSelect(style)}
                          className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs transition-all flex items-center justify-between font-medium ${
                            selectedStyle === style
                              ? 'bg-[#E5C158] text-[#050505] font-bold shadow-md'
                              : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/5'
                          }`}
                        >
                          <span>{style}</span>
                          {selectedStyle === style && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Input Inside Drawer */}
                  <div className="relative pt-2">
                    <input
                      type="text"
                      placeholder="e.g. I want a skeletonized mechanical watch"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#0E0E0E] border border-white/15 rounded-xl py-2.5 pl-3 pr-10 text-[11px] text-white focus:outline-none focus:border-timuse-gold"
                    />
                    <Search className="w-4 h-4 text-white/50 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      )}
    </section>
  );
}
