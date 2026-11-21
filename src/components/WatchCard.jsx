import React from 'react';
import { useUI } from '../context/UIContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { formatPrice } from '../utils/formatters.js';
import { Heart, ShoppingBag, Eye, Star, ShieldCheck } from 'lucide-react';

export default function WatchCard({ watch }) {
  const { navigateToProduct, setQuickViewWatch, showToast } = useUI();
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorited = isInWishlist(watch.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (watch.stock <= 0) {
      showToast('This timepiece is currently reserved in our vault allocation.', 'warning');
      return;
    }
    addToCart(watch, 1);
    showToast(`${watch.name} added to your acquisition portfolio.`);
    setIsCartOpen(true);
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    const added = await toggleWishlist(watch);
    showToast(added ? 'Saved to private wishlist' : 'Removed from wishlist');
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    setQuickViewWatch(watch);
  };

  const discountPercent = watch.originalPrice && watch.originalPrice > watch.price
    ? Math.round(((watch.originalPrice - watch.price) / watch.originalPrice) * 100)
    : null;

  const watchImg = watch.image || (watch.images && watch.images[0]) || './assets/watches/raymond_weil_basquiat.webp';

  return (
    <div
      onClick={() => navigateToProduct(watch.id)}
      className="bg-[#0E0E0E] rounded-2xl overflow-hidden group cursor-pointer flex flex-col justify-between relative border border-white/10 hover:border-[#E5C158]/50 transition-all duration-300"
    >
      {/* Top Floating Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex flex-col gap-1">
          {watch.isNew && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#E5C158] text-[#050505] text-[9px] font-bold uppercase tracking-widest shadow-md">
              New Arrival
            </span>
          )}
          {discountPercent && (
            <span className="px-2.5 py-0.5 rounded-full bg-rose-600/90 text-white text-[9px] font-bold uppercase tracking-wider">
              Save {discountPercent}%
            </span>
          )}
          {watch.stock <= 2 && watch.stock > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-semibold tracking-wider">
              Only {watch.stock} Left
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1.5 pointer-events-auto">
          <button
            onClick={handleQuickView}
            className="w-8 h-8 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-[#E5C158] transition-all"
            title="Quick Preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleToggleWishlist}
            className={`w-8 h-8 rounded-full bg-black/60 border border-white/15 flex items-center justify-center transition-all ${
              isFavorited ? 'text-rose-500 border-rose-500/50 bg-rose-500/10' : 'text-white/70 hover:text-rose-400'
            }`}
            title="Save to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Watch Imagery */}
      <div className="relative pt-10 pb-6 px-6 bg-gradient-to-b from-[#141414] to-transparent flex items-center justify-center overflow-hidden">
        <img
          src={watchImg}
          alt={watch.name}
          loading="lazy"
          decoding="async"
          className="w-44 h-44 sm:w-52 sm:h-52 object-contain transition-transform duration-700 ease-out group-hover:scale-105 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]"
        />
      </div>

      {/* Information Container */}
      <div className="p-5 flex flex-col justify-between flex-grow space-y-3">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-neutral-400">
            <span className="font-semibold text-[#E5C158]">{watch.brand}</span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-neutral-400 text-[10px]">{watch.category}</span>
          </div>

          {/* Model Name */}
          <h3 className="font-serif font-light text-white text-base group-hover:text-[#E5C158] transition-colors line-clamp-1 mt-1">
            {watch.name}
          </h3>

          {/* Movement spec */}
          <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
            {watch.movement}
          </p>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center text-[#E5C158]">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="ml-1 font-bold text-white">{watch.rating || 4.9}</span>
          </div>
          <span className="text-neutral-600">•</span>
          <span className="text-neutral-400 text-[11px]">({watch.reviewCount || 24} client reviews)</span>
        </div>

        {/* Price & Buy Button */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-base sm:text-lg font-serif font-normal text-white">
                {formatPrice(watch.price)}
              </span>
              {watch.originalPrice && watch.originalPrice > watch.price && (
                <span className="text-xs text-neutral-500 line-through">
                  {formatPrice(watch.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Certified In Vault</span>
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2.5 rounded-xl bg-[#E5C158] hover:bg-[#d4af37] text-[#050505] flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform"
            title="Add to Acquisition Portfolio"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
