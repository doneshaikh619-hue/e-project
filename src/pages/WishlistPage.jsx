import React from 'react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { formatPrice } from '../utils/formatters.js';
import { Heart, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Eye } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, moveToCart } = useWishlist();
  const { setIsCartOpen } = useCart();
  const { navigateTo, navigateToProduct, setQuickViewWatch, showToast } = useUI();

  const handleMoveToCart = (watch) => {
    moveToCart(watch);
    showToast(`${watch.name} moved to acquisition portfolio.`);
    setIsCartOpen(true);
  };

  const handleRemove = async (watch) => {
    await toggleWishlist(watch);
    showToast('Removed from wishlist');
  };

  return (
    <div className="py-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs uppercase tracking-widest text-luxury-gold font-bold">Curated Desires</span>
          <h1 className="font-serif text-3xl font-bold text-slate-100 mt-1">
            Private Wishlist ({wishlist.length})
          </h1>
        </div>
        <button
          onClick={() => navigateTo('catalog')}
          className="text-xs text-luxury-gold hover:text-luxury-gold-light flex items-center space-x-1"
        >
          <span>Explore More Timepieces</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {wishlist.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full border border-luxury-gold/30 flex items-center justify-center bg-luxury-900 text-luxury-gold mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-xl font-bold text-slate-100">Your Wishlist is Empty</h2>
          <p className="text-xs text-slate-400">
            Save timepieces you wish to reserve or acquire later by clicking the heart icon on any piece.
          </p>
          <button
            onClick={() => navigateTo('catalog')}
            className="gold-button px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Explore Collections
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(watch => (
            <div
              key={watch.id}
              className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4 relative group"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={watch.image || (watch.images && watch.images[0]) || './assets/watches/raymond_weil_basquiat.png'}
                  alt={watch.name}
                  onClick={() => navigateToProduct(watch.id)}
                  className="w-24 h-24 object-contain rounded-xl border border-white/10 bg-[#141414] p-1.5 cursor-pointer group-hover:scale-105 transition-transform"
                />
                <div className="flex-grow min-w-0">
                  <span className="text-[10px] uppercase font-bold text-luxury-gold tracking-widest">{watch.brand}</span>
                  <h3
                    onClick={() => navigateToProduct(watch.id)}
                    className="font-serif text-sm font-semibold text-slate-100 truncate cursor-pointer hover:text-luxury-gold transition-colors"
                  >
                    {watch.name}
                  </h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{watch.movement}</p>
                  <p className="font-serif text-base font-bold text-luxury-gold mt-1">
                    {formatPrice(watch.price)}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleMoveToCart(watch)}
                  className="flex-grow gold-button py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Portfolio</span>
                </button>

                <button
                  onClick={() => setQuickViewWatch(watch)}
                  className="p-2 rounded-xl glass-panel text-slate-400 hover:text-white"
                  title="Quick View"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleRemove(watch)}
                  className="p-2 rounded-xl glass-panel text-slate-500 hover:text-rose-400"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
