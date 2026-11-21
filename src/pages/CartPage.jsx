import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { formatPrice } from '../utils/formatters.js';
import { Trash2, ArrowRight, ArrowLeft, ShieldCheck, Tag, Sparkles, Lock } from 'lucide-react';

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponError
  } = useCart();
  const { isAuthenticated } = useAuth();
  const { navigateTo, setAuthReturnPage, showToast } = useUI();
  const [couponInput, setCouponInput] = useState('');

  const handleApply = (e) => {
    e.preventDefault();
    if (couponInput) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      setAuthReturnPage('checkout');
      showToast('VIP Authentication Required: Please sign in or register to secure your vault allocation.', 'gold');
      navigateTo('auth');
    } else {
      navigateTo('checkout');
    }
  };

  return (
    <div className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn bg-[#050505] text-white select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#E5C158] font-semibold">Acquisition Ledger</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-white mt-1">
            Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'Timepiece' : 'Timepieces'})
          </h1>
        </div>
        <button
          onClick={() => navigateTo('catalog')}
          className="text-xs text-[#E5C158] hover:text-[#f4dc8c] flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Exploring Catalog</span>
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-[#0E0E0E] border border-white/10 rounded-3xl p-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 rounded-full border border-[#E5C158]/30 flex items-center justify-center bg-[#141414] text-[#E5C158] mx-auto">
            <Tag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-light text-white">Your Portfolio is Empty</h2>
          <p className="text-xs text-neutral-400">
            Browse our Swiss certified timepieces and select an exceptional piece for your collection.
          </p>
          <button
            onClick={() => navigateTo('catalog')}
            className="px-8 py-3 bg-[#E5C158] hover:bg-[#d4af37] text-[#050505] font-semibold rounded-xl text-xs uppercase tracking-wider transition-colors"
          >
            Explore Collections
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items Table */}
          <div className="lg:col-span-8 bg-[#0E0E0E] rounded-2xl p-6 border border-white/10 divide-y divide-white/10">
            {cartItems.map(({ watch, quantity }) => {
              const watchImg = watch.image || (watch.images && watch.images[0]) || './assets/watches/raymond_weil_basquiat.webp';

              return (
                <div key={watch.id} className="py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center space-x-5 w-full sm:w-auto">
                    <div className="w-20 h-20 rounded-xl bg-[#141414] border border-white/10 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={watchImg}
                        alt={watch.name}
                        className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#E5C158] tracking-widest">{watch.brand}</span>
                      <h3 className="font-serif text-base font-normal text-white">{watch.name}</h3>
                      <p className="text-xs text-neutral-400 mt-0.5">{watch.movement?.split('(')[0]}</p>
                      <div className="flex items-center space-x-2 mt-2 text-xs">
                        <span className="text-emerald-400 text-[10px] font-semibold flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Geneva Vault Stock · Insured Transit</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto">
                    {/* Quantity picker */}
                    <div className="flex items-center rounded-lg bg-[#141414] border border-white/15 px-3 py-1 text-xs">
                      <button
                        onClick={() => updateQuantity(watch.id, quantity - 1)}
                        className="text-neutral-400 hover:text-white px-2 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono font-bold text-white">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(watch.id, quantity + 1)}
                        className="text-neutral-400 hover:text-white px-2 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-serif text-lg font-light text-white">{formatPrice(watch.price * quantity)}</p>
                      <button
                        onClick={() => removeFromCart(watch.id)}
                        className="text-[11px] text-neutral-400 hover:text-rose-400 flex items-center space-x-1 ml-auto mt-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Acquisition Summary */}
          <div className="lg:col-span-4 bg-[#0E0E0E] rounded-2xl p-6 border border-white/10 space-y-6">
            <h3 className="font-serif text-xl font-light text-white pb-3 border-b border-white/10">
              Acquisition Summary
            </h3>

            {/* Voucher Coupon */}
            <div>
              {appliedCoupon ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-400">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span><strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.label})</span>
                  </div>
                  <button onClick={removeCoupon} className="text-neutral-400 hover:text-white underline text-xs">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-1.5">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Voucher code..."
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-grow bg-[#141414] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E5C158]"
                    />
                    <button type="submit" className="px-4 py-2 rounded-lg border border-[#E5C158] text-[#E5C158] hover:bg-[#E5C158] hover:text-[#050505] text-xs font-semibold transition-colors">
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}
                  <p className="text-[10px] text-neutral-400">
                    Use code <span className="text-[#E5C158] font-mono font-bold">WATCHVIP10</span> for 10% privilege discount.
                  </p>
                </form>
              )}
            </div>

            {/* Calculation rows */}
            <div className="space-y-2 text-xs border-t border-white/10 pt-4">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="text-white font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>VIP Privilege Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-400">
                <span>Armored Vault Transport</span>
                <span className="text-emerald-400 font-semibold uppercase text-[10px]">Complimentary ($0)</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Diplomatic Duty / Import VAT</span>
                <span className="text-white">$0 (Duty Free Diplomatic Export)</span>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline text-sm font-bold text-white">
                <span>Total Amount Due</span>
                <span className="font-serif text-2xl text-[#E5C158]">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-[#E5C158] hover:bg-[#d4af37] text-[#050505] font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors shadow-[0_4px_20px_rgba(229,193,88,0.3)]"
            >
              <span>Proceed to White-Glove Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3 rounded-xl bg-white/5 text-[11px] text-neutral-400 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-[#E5C158] shrink-0" />
              <span>Armored delivery coordinated upon completion of Swiss compliance check.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
