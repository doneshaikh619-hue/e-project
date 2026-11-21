import React, { useState, useEffect } from 'react';
import WatchCard from '../components/WatchCard.jsx';
import { useUI } from '../context/UIContext.jsx';
import { api } from '../utils/api.js';
import { formatPrice } from '../utils/formatters.js';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Grid3X3,
  List,
  RotateCcw,
  Sparkles,
  Check,
  ShieldCheck,
  Eye,
  ShoppingBag,
  Heart
} from 'lucide-react';

const BRANDS = ['All', 'Rolex', 'Patek Philippe', 'Audemars Piguet', 'Omega', 'Cartier', 'Tag Heuer', 'Richard Mille', 'Vacheron Constantin', 'IWC Schaffhausen', 'Tissot'];
const CATEGORIES = ['All', 'Chronograph', 'Luxury', 'Skeleton', 'Diver', 'Classic', 'Tourbillon'];
const GENDERS = ['All', 'Men', 'Women', 'Unisex'];

export default function CatalogPage() {
  const { searchQuery, setSearchQuery, navigateToProduct, setQuickViewWatch, showToast } = useUI();
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('bestseller');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    fetchFilteredWatches();
  }, [searchQuery, selectedBrand, selectedCategory, selectedGender, maxPrice, inStockOnly, sortBy]);

  const fetchFilteredWatches = () => {
    setLoading(true);
    const params = {
      search: searchQuery,
      brand: selectedBrand,
      category: selectedCategory,
      gender: selectedGender,
      maxPrice: maxPrice,
      inStock: inStockOnly ? 'true' : 'false',
      sortBy: sortBy
    };

    api.getWatches(params).then(res => {
      if (res.success && res.data) {
        setWatches(res.data);
      }
      setLoading(false);
    });
  };

  const handleResetFilters = () => {
    setSelectedBrand('All');
    setSelectedCategory('All');
    setSelectedGender('All');
    setMaxPrice(1000000);
    setInStockOnly(false);
    setSortBy('bestseller');
    setSearchQuery('');
  };

  return (
    <div className="py-10 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-bold flex items-center justify-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Swiss Vault</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">
          The Master Catalog
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Filter through prestigious Swiss complications, tourbillons, and certified investment chronographs.
        </p>
      </div>

      {/* Control Bar: Search, View Mode, Sorting */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-luxury-gold/20">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-luxury-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search timepiece or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-luxury-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-luxury-gold"
          />
        </div>

        {/* Sorting & Layout Toggles */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="md:hidden px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center space-x-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-luxury-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-luxury-gold"
            >
              <option value="bestseller">Curated Bestsellers</option>
              <option value="price-low-high">Price: Ascending</option>
              <option value="price-high-low">Price: Descending</option>
              <option value="rating">Highest Client Rating</option>
              <option value="newest">Recent Vault Arrivals</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-luxury-gold text-luxury-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-luxury-gold text-luxury-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside
          className={`md:block glass-card p-6 rounded-2xl border border-luxury-gold/20 space-y-6 ${
            isFilterDrawerOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-serif font-bold text-sm text-slate-100 uppercase tracking-wider flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-luxury-gold" />
              <span>Filters & Facets</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-slate-400 hover:text-luxury-gold flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <label className="block text-[11px] uppercase tracking-wider text-luxury-gold font-bold">Maison / Brand</label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {BRANDS.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedBrand === brand
                      ? 'bg-luxury-gold/20 text-luxury-gold font-bold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span>{brand}</span>
                  {selectedBrand === brand && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-[11px] uppercase tracking-wider text-luxury-gold font-bold">Category</label>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-luxury-gold/20 text-luxury-gold font-bold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex justify-between items-center text-xs">
              <label className="text-[11px] uppercase tracking-wider text-luxury-gold font-bold">Max Allocation</label>
              <span className="font-serif font-bold text-slate-100">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="1000000"
              step="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-luxury-gold cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$1,000</span>
              <span>$1,000,000+</span>
            </div>
          </div>

          {/* Gender Filter */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="block text-[11px] uppercase tracking-wider text-luxury-gold font-bold">Gender</label>
            <div className="grid grid-cols-2 gap-1.5">
              {GENDERS.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`py-1.5 px-2 rounded-lg text-xs text-center border transition-all ${
                    selectedGender === g
                      ? 'bg-luxury-gold/20 border-luxury-gold text-luxury-gold font-bold'
                      : 'bg-white/5 border-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* In-Stock Toggle */}
          <div className="pt-2 border-t border-white/10">
            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-luxury-gold w-4 h-4"
              />
              <span className="text-xs text-slate-200">Vault In-Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Watches Display Grid / List */}
        <main className="md:col-span-3 space-y-6">
          {/* Active criteria chips strip */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Displaying <strong>{watches.length}</strong> authenticated timepieces</span>
            {(selectedBrand !== 'All' || selectedCategory !== 'All' || searchQuery) && (
              <button onClick={handleResetFilters} className="text-luxury-gold hover:underline">
                Clear all filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Consulting Geneva vault inventory...</p>
            </div>
          ) : watches.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full border border-luxury-gold/30 flex items-center justify-center bg-luxury-900 text-luxury-gold mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-100">No Timepieces Match Your Criteria</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try widening your price range or clearing brand filters to explore other luxury allocations.
              </p>
              <button
                onClick={handleResetFilters}
                className="gold-button px-6 py-2.5 rounded-xl text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {watches.map(watch => (
                <WatchCard key={watch.id} watch={watch} />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {watches.map(watch => (
                <div
                  key={watch.id}
                  onClick={() => navigateToProduct(watch.id)}
                  className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-luxury-gold/40 cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-6 w-full sm:w-auto">
                    <img
                      src={watch.image || (watch.images && watch.images[0]) || './assets/watches/raymond_weil_basquiat.webp'}
                      alt={watch.name}
                      loading="lazy"
                      decoding="async"
                      className="w-24 h-24 object-contain rounded-xl border border-white/10 bg-[#141414] p-1.5"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-luxury-gold tracking-widest">{watch.brand}</span>
                      <h4 className="font-serif text-base font-semibold text-slate-100">{watch.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-md line-clamp-2">{watch.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
                        <span>{watch.movement}</span>
                        <span>•</span>
                        <span>{watch.caseSize}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">{watch.waterResistance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                    <div>
                      <span className="font-serif text-xl font-bold text-luxury-gold block">{formatPrice(watch.price)}</span>
                      <span className="text-[10px] text-emerald-400 flex items-center space-x-1 justify-end">
                        <ShieldCheck className="w-3 h-3" />
                        <span>In Vault</span>
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigateToProduct(watch.id); }}
                      className="mt-3 gold-button px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      Inspect Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
