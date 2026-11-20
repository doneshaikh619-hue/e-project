import React, { useState } from 'react';
import { useUI } from '../context/UIContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { formatPrice } from '../utils/formatters.js';
import { X, Star, ShieldCheck, Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export default function QuickViewModal() {
  const { quickViewWatch, setQuickViewWatch, navigateToProduct, showToast } = useUI();
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewWatch) return null;

  const isFavorited = isInWishlist(quickViewWatch.id);
  const images = quickViewWatch.images?.length 
    ? quickViewWatch.images 
    : [quickViewWatch.image || './assets/watches/raymond_weil_basquiat.png'];

  const handleAddToCart = () => {
    addToCart(quickViewWatch, quantity);
    showToast(`${quickViewWatch.name} (${quantity}) added to portfolio.`);
    setQuickViewWatch(null);
    setIsCartOpen(true);
  };

  const handleToggleWishlist = async () => {
    const added = await toggleWishlist(quickViewWatch);
    showToast(added ? 'Saved to wishlist' : 'Removed from wishlist');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn select-none">
      <div className="bg-[#0E0E0E] rounded-3xl max-w-4xl w-full border border-white/15 overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewWatch(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Showcase */}
        <div className="md:w-1/2 p-6 sm:p-8 bg-[#141414] flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-white/10">
          <div className="relative w-full flex items-center justify-center py-6">
            <img
              src={images[activeImageIdx] || images[0]}
              alt={quickViewWatch.name}
              className="w-56 h-56 sm:w-72 sm:h-72 object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
            />
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex items-center space-x-3 mt-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 p-1 bg-[#0E0E0E] transition-all ${
                    activeImageIdx === idx ? 'border-[#E5C158]' : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Specs & Add to Portfolio */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E5C158]">
                {quickViewWatch.brand}
              </span>
              <h2 className="font-serif text-2xl font-light text-white mt-1">
                {quickViewWatch.name}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">{quickViewWatch.tagline || quickViewWatch.reference}</p>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center text-[#E5C158]">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 font-bold text-white">{quickViewWatch.rating || 4.9}</span>
              </div>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-400 text-xs">{quickViewWatch.reviewCount || 24} Client Reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="font-serif text-3xl font-light text-[#E5C158]">
                {formatPrice(quickViewWatch.price)}
              </span>
              {quickViewWatch.originalPrice && quickViewWatch.originalPrice > quickViewWatch.price && (
                <span className="text-xs text-neutral-500 line-through">
                  {formatPrice(quickViewWatch.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              {quickViewWatch.description}
            </p>

            {/* Key Specs Pills */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-white/10">
              <div className="p-2 rounded-lg bg-[#141414] border border-white/10">
                <span className="text-neutral-500 block text-[9px] uppercase">Calibre</span>
                <span className="text-white font-medium truncate block">{quickViewWatch.movement?.split('(')[0] || 'Swiss Manufacture'}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#141414] border border-white/10">
                <span className="text-neutral-500 block text-[9px] uppercase">Case Diameter</span>
                <span className="text-white font-medium">{quickViewWatch.caseSize || '40 mm'}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#141414] border border-white/10">
                <span className="text-neutral-500 block text-[9px] uppercase">Material</span>
                <span className="text-white font-medium truncate block">{quickViewWatch.caseMaterial || 'Rose Gold / Steel'}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#141414] border border-white/10">
                <span className="text-neutral-500 block text-[9px] uppercase">Waterproof</span>
                <span className="text-white font-medium">{quickViewWatch.waterResistance || '50 m'}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex items-center space-x-3">
              {/* Quantity Picker */}
              <div className="flex items-center rounded-xl bg-[#141414] border border-white/15 px-3 py-2 text-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-neutral-400 hover:text-white px-2 font-bold"
                >
                  -
                </button>
                <span className="px-2 font-mono font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-neutral-400 hover:text-white px-2 font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Portfolio */}
              <button
                onClick={handleAddToCart}
                className="flex-grow py-3 bg-[#E5C158] hover:bg-[#d4af37] text-[#050505] font-semibold text-xs tracking-wider uppercase rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(229,193,88,0.3)]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Portfolio</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={handleToggleWishlist}
                className={`p-3 rounded-xl border transition-colors ${
                  isFavorited
                    ? 'border-rose-500/50 bg-rose-500/10 text-rose-500'
                    : 'border-white/15 bg-[#141414] text-neutral-400 hover:text-rose-400'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => {
                const id = quickViewWatch.id;
                setQuickViewWatch(null);
                navigateToProduct(id);
              }}
              className="w-full text-center text-xs text-neutral-400 hover:text-[#E5C158] flex items-center justify-center space-x-1.5 transition-colors pt-1"
            >
              <span>View Full Horological Dossier & Atelier Specs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
