import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { formatPrice } from '../utils/formatters.js';
import { X, Trash2, ShieldCheck, ArrowRight, Tag, Sparkles } from 'lucide-react';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();
  const { isAuthenticated } = useAuth();
  const { navigateTo, setAuthReturnPage, showToast } = useUI();
  const [localCoupon, setLocalCoupon] = useState('');

  if (!isCartOpen) return null;

  const handleApply = (e) => {
    e.preventDefault();
    if (localCoupon) {
      applyCoupon(localCoupon);
      setLocalCoupon('');
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!isAuthenticated) {
      setAuthReturnPage('checkout');
      showToast('VIP Client Authentication Required: Please sign in or register to secure your vault allocation.', 'gold');
      navigateTo('auth');
    } else {
      navigateTo('checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Dark backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0E0E0E] border-l border-white/15 flex flex-col justify-between shadow-2xl relative animate-fadeIn">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#141414]">
            <div>
              <h2 className="font-serif text-lg font-light text-white flex items-center space-x-2">
                <span>Acquisition Portfolio</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#E5C158] text-[#050505] font-sans font-bold">
                  {cartItems.length}
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">Complimentary Armored Courier Reserved</p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="p-6 flex-grow overflow-y-auto divide-y divide-white/10">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-neutral-400 space-y-4">
                <div className="w-16 h-16 rounded-full border border-[#E5C158]/30 flex items-center justify-center bg-[#141414] text-[#E5C158]">
                  <Tag className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-light text-white">Your Portfolio is Empty</h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                    Explore our curated collection of Swiss certified haute horlogerie timepieces.
                  </p>
                </div>
                <button
                  onClick={() => { setIsCartOpen(false); navigateTo('catalog'); }}
                  className="px-5 py-2.5 rounded-xl border border-[#E5C158] text-[#E5C158] hover:bg-[#E5C158] hover:text-[#050505] text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Explore Master Catalog
                </button>
              </div>
            ) : (
              cartItems.map(({ watch, quantity }) => {
                const watchImg = watch.image || (watch.images && watch.images[0]) || './assets/watches/raymond_weil_basquiat.png';

                return (
                  <div key={watch.id} className="py-4 flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl bg-[#141414] border border-white/10 p-1.5 flex items-center justify-center shrink-0">
                      <img
                        src={watchImg}
                        alt={watch.name}
                        className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <span className="text-[10px] font-bold text-[#E5C158] uppercase tracking-wider">{watch.brand}</span>
                      <h4 className="font-serif text-sm font-normal text-white truncate">{watch.name}</h4>
                      <p className="font-mono text-xs text-neutral-300 mt-0.5">{formatPrice(watch.price)}</p>

                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center rounded-lg bg-[#141414] border border-white/10 px-2 py-0.5 text-xs">
                          <button
                            onClick={() => updateQuantity(watch.id, quantity - 1)}
                            className="text-neutral-400 hover:text-white px-1 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono font-bold text-white text-[11px]">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(watch.id, quantity + 1)}
                            className="text-neutral-400 hover:text-white px-1 font-bold"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(watch.id)}
                          className="text-neutral-500 hover:text-rose-400 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout summary */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#141414] space-y-4">
              {/* Voucher quick apply */}
              <form onSubmit={handleApply} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Code (WATCHVIP10)..."
                  value={localCoupon}
                  onChange={(e) => setLocalCoupon(e.target.value)}
                  className="flex-grow bg-[#0E0E0E] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E5C158]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg border border-[#E5C158] text-[#E5C158] hover:bg-[#E5C158] hover:text-[#050505] text-xs font-semibold"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex justify-between items-center text-xs text-emerald-400">
                  <span>{appliedCoupon.code} applied:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="space-y-1.5 text-xs border-t border-white/10 pt-3">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Armored Transport</span>
                  <span className="text-emerald-400 uppercase text-[10px]">Free</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-white/10 font-bold">
                  <span className="text-white">Total</span>
                  <span className="font-serif text-xl text-[#E5C158]">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-[#E5C158] hover:bg-[#d4af37] text-[#050505] font-semibold text-xs tracking-wider uppercase rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(229,193,88,0.3)]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => { setIsCartOpen(false); navigateTo('cart'); }}
                  className="w-full py-2 bg-transparent hover:bg-white/5 text-white/80 rounded-lg text-xs transition-colors"
                >
                  View Full Cart Ledger
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
