import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { api } from '../utils/api.js';
import { formatPrice } from '../utils/formatters.js';
import {
  ShieldCheck,
  CreditCard,
  Building,
  Coins,
  Lock,
  ArrowRight,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, total, subtotal, discount, appliedCoupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { navigateTo, showToast, setAuthReturnPage } = useUI();

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address || 'Rue du Rhône 41',
    city: 'Geneva',
    country: 'Switzerland',
    postalCode: '1204',
    instructions: 'Private vault courier signature required upon handoff.'
  });

  const [deliveryMethod, setDeliveryMethod] = useState('armored');
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'wire' | 'crypto' | 'cod'

  // Card details simulation
  const [cardData, setCardData] = useState({
    number: '4820 •••• •••• 9921',
    holder: user?.name ? user.name.toUpperCase() : 'VIP CLIENT',
    expiry: '08/29',
    cvv: '884'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync with logged-in user profile
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        street: user.address || prev.street
      }));
      setCardData(prev => ({
        ...prev,
        holder: user.name ? user.name.toUpperCase() : prev.holder
      }));
    }
  }, [user]);

  if (cartItems.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-5 bg-[#050505] text-white">
        <h2 className="font-serif text-2xl font-light text-white">No Timepieces in Portfolio</h2>
        <p className="text-xs text-neutral-400">Please select a watch from the collection before proceeding to checkout.</p>
        <button 
          onClick={() => navigateTo('catalog')} 
          className="px-6 py-3 bg-[#E5C158] hover:bg-[#d4af37] text-[#050505] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  // Security Gate: User MUST be authenticated to complete high-value order
  if (!isAuthenticated) {
    return (
      <div className="py-24 px-4 text-center max-w-lg mx-auto space-y-6 bg-[#050505] text-white animate-fadeIn">
        <div className="w-16 h-16 rounded-full border border-[#E5C158] flex items-center justify-center bg-[#141414] text-[#E5C158] mx-auto shadow-[0_0_25px_rgba(229,193,88,0.25)]">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#E5C158] font-bold">VIP Escrow Security Protocol</span>
          <h2 className="font-serif text-3xl font-light text-white">Client Authentication Required</h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            To safeguard high-value horological allocations and arrange armored transport dispatch, identity verification is mandatory prior to vault fulfillment.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setAuthReturnPage('checkout');
              navigateTo('auth');
            }}
            className="px-8 py-3.5 bg-[#E5C158] hover:bg-[#d4af37] text-[#050505] rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(229,193,88,0.3)] flex items-center justify-center space-x-2"
          >
            <span>Sign In / Register Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateTo('cart')}
            className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors border border-white/10"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderPayload = {
        userId: user?.id || 'guest-client',
        userName: formData.fullName,
        userEmail: formData.email,
        subtotal,
        discount,
        couponApplied: appliedCoupon?.code || null,
        tax: 0,
        shippingFee: 0,
        total,
        paymentMethod: paymentMethod === 'card' 
          ? 'Centurion Black Card' 
          : paymentMethod === 'wire' 
          ? 'Swiss Wire Transfer' 
          : paymentMethod === 'crypto' 
          ? 'Bitcoin Escrow' 
          : 'Armored Vault Handoff',
        carrier: deliveryMethod === 'armored' ? 'Swiss Armored Vault Courier' : 'Private VIP Jet Hand-Carry',
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.street,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode
        },
        items: cartItems.map(item => ({
          watchId: item.watch.id,
          name: item.watch.name,
          brand: item.watch.brand,
          price: item.watch.price,
          quantity: item.quantity,
          image: item.watch.image || (item.watch.images && item.watch.images[0]) || './assets/watches/raymond_weil_basquiat.webp'
        })),
        notes: formData.instructions
      };

      let orderResult = null;
      try {
        const res = await api.createOrder(orderPayload);
        if (res.success && res.data) {
          orderResult = res.data;
        }
      } catch (err) {
        // Fallback local order structure
        orderResult = {
          ...orderPayload,
          id: 'TM-ORD-' + Math.floor(100000 + Math.random() * 900000),
          trackingNumber: 'TM-ARM-' + Math.floor(10000000 + Math.random() * 90000000),
          status: 'Processing Vault Verification',
          createdAt: new Date().toISOString()
        };
      }

      if (!orderResult) {
        orderResult = {
          ...orderPayload,
          id: 'TM-ORD-' + Math.floor(100000 + Math.random() * 900000),
          trackingNumber: 'TM-ARM-' + Math.floor(10000000 + Math.random() * 90000000),
          status: 'Processing Vault Verification',
          createdAt: new Date().toISOString()
        };
      }

      // Confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E5C158', '#F3E5AB', '#ffffff']
        });
      } catch (err) {
        // ignore
      }

      clearCart();
      showToast('Acquisition confirmed! Armored logistics initiated.', 'gold');
      navigateTo('order-success', orderResult);
    } catch (err) {
      showToast('Could not complete order: ' + err.message, 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn bg-[#050505] text-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#E5C158] font-semibold">White Glove Protocol</span>
          <h1 className="font-serif text-2xl sm:text-4xl font-light text-white mt-1">
            Secure Acquisition Checkout
          </h1>
        </div>
        <button
          onClick={() => navigateTo('cart')}
          className="text-xs text-neutral-400 hover:text-[#E5C158] flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Cart</span>
        </button>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Armored Delivery Address */}
          <div className="bg-[#0E0E0E] p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
              <div className="w-7 h-7 rounded-full bg-[#E5C158]/15 text-[#E5C158] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-serif text-lg font-normal text-white">Client Accreditation & Delivery Vault</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-neutral-400 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-[#141414] border border-white/15 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-[#E5C158]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Confidential Email *</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#141414] border border-white/15 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-[#E5C158]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Telephone *</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#141414] border border-white/15 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-[#E5C158]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-400 mb-1">Delivery Address / Private Residence *</label>
                <input
                  type="text"
                  required
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full bg-[#141414] border border-white/15 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-[#E5C158]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">City *</label>
                <input
                  type="text"
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-[#141414] border border-white/15 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-[#E5C158]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Country *</label>
                <input
                  type="text"
                  required
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full bg-[#141414] border border-white/15 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-[#E5C158]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-400 mb-1">Security Instructions / Vault Handoff Protocol</label>
                <input
                  type="text"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  className="w-full bg-[#141414] border border-white/15 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-[#E5C158]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Armored Carrier Method */}
          <div className="bg-[#0E0E0E] p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
              <div className="w-7 h-7 rounded-full bg-[#E5C158]/15 text-[#E5C158] flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-serif text-lg font-normal text-white">Logistics Escort Service</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div
                onClick={() => setDeliveryMethod('armored')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  deliveryMethod === 'armored'
                    ? 'border-[#E5C158] bg-[#141414] text-white shadow-[0_0_15px_rgba(229,193,88,0.2)]'
                    : 'border-white/10 bg-[#0E0E0E] text-neutral-400 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#E5C158]" />
                  <span>Swiss Armored Vault Transport</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Biometrically locked armored vehicle with armed security escort. Full insurance.
                </p>
                <span className="inline-block mt-2 font-bold text-emerald-400 text-[10px] uppercase">
                  Complimentary ($0)
                </span>
              </div>

              <div
                onClick={() => setDeliveryMethod('jet')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  deliveryMethod === 'jet'
                    ? 'border-[#E5C158] bg-[#141414] text-white shadow-[0_0_15px_rgba(229,193,88,0.2)]'
                    : 'border-white/10 bg-[#0E0E0E] text-neutral-400 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold mb-1">
                  <Truck className="w-4 h-4 text-[#E5C158]" />
                  <span>Private VIP Hand-Carry</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  A certified master horologist flies directly to your private estate or salon.
                </p>
                <span className="inline-block mt-2 font-bold text-emerald-400 text-[10px] uppercase">
                  VIP Privilege ($0)
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Settle Escrow / Payment Method */}
          <div className="bg-[#0E0E0E] p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
              <div className="w-7 h-7 rounded-full bg-[#E5C158]/15 text-[#E5C158] flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-serif text-lg font-normal text-white">Payment & Escrow Settlement</h3>
            </div>

            {/* Payment Tabs */}
            <div className="grid grid-cols-4 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#E5C158] bg-[#141414] text-[#E5C158] font-bold shadow-[0_0_15px_rgba(229,193,88,0.2)]'
                    : 'border-white/10 bg-[#0E0E0E] text-neutral-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-[11px]">Centurion Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wire')}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  paymentMethod === 'wire'
                    ? 'border-[#E5C158] bg-[#141414] text-[#E5C158] font-bold shadow-[0_0_15px_rgba(229,193,88,0.2)]'
                    : 'border-white/10 bg-[#0E0E0E] text-neutral-400 hover:text-white'
                }`}
              >
                <Building className="w-5 h-5" />
                <span className="text-[11px]">Bank Wire</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('crypto')}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  paymentMethod === 'crypto'
                    ? 'border-[#E5C158] bg-[#141414] text-[#E5C158] font-bold shadow-[0_0_15px_rgba(229,193,88,0.2)]'
                    : 'border-white/10 bg-[#0E0E0E] text-neutral-400 hover:text-white'
                }`}
              >
                <Coins className="w-5 h-5" />
                <span className="text-[11px]">Crypto Escrow</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#E5C158] bg-[#141414] text-[#E5C158] font-bold shadow-[0_0_15px_rgba(229,193,88,0.2)]'
                    : 'border-white/10 bg-[#0E0E0E] text-neutral-400 hover:text-white'
                }`}
              >
                <Lock className="w-5 h-5" />
                <span className="text-[11px]">Vault Handoff</span>
              </button>
            </div>

            {/* Payment Details View */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="col-span-2">
                    <label className="block text-neutral-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full bg-[#141414] border border-white/15 rounded-lg px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Expiration (MM/YY)</label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      className="w-full bg-[#141414] border border-white/15 rounded-lg px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">CVV / Security Code</label>
                    <input
                      type="password"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      className="w-full bg-[#141414] border border-white/15 rounded-lg px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'wire' && (
              <div className="p-4 rounded-xl bg-[#141414] border border-[#E5C158]/30 text-xs space-y-2">
                <p className="text-[#E5C158] font-bold uppercase tracking-wider">UBS Geneva Escrow Account</p>
                <div className="space-y-1 font-mono text-[11px] text-neutral-300">
                  <p>Bank: UBS Switzerland AG, Geneva Headquarters</p>
                  <p>IBAN: CH93 0024 0240 8891 2001 A</p>
                  <p>BIC / SWIFT: UBSWCHZH80A</p>
                  <p>Reference: TM-ALLOCATION-2026</p>
                </div>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="p-4 rounded-xl bg-[#141414] border border-[#E5C158]/30 text-xs text-center space-y-2">
                <p className="text-[#E5C158] font-bold">Bitcoin & USDC Digital Custody</p>
                <p className="font-mono text-[10px] text-neutral-300 bg-black/60 p-2 rounded-lg break-all">
                  bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq
                </p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 rounded-xl bg-[#141414] border border-[#E5C158]/30 text-xs space-y-2">
                <p className="text-[#E5C158] font-bold">Physical Handoff Escrow</p>
                <p className="text-neutral-300">
                  Inspect the movement and physical hallmarks upon delivery. Settle directly with the bonded officer via certified cashier's check or physical escrow receipt.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Complete Button */}
        <div className="lg:col-span-5 bg-[#0E0E0E] p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
          <h3 className="font-serif text-xl font-light text-white pb-3 border-b border-white/10">
            Portfolio Allocation Details
          </h3>

          <div className="divide-y divide-white/10 max-h-60 overflow-y-auto">
            {cartItems.map(({ watch, quantity }) => {
              const watchImg = watch.image || (watch.images && watch.images[0]) || './assets/watches/raymond_weil_basquiat.webp';

              return (
                <div key={watch.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-[#141414] border border-white/10 p-1 flex items-center justify-center shrink-0">
                      <img src={watchImg} alt={watch.name} className="w-full h-full object-contain filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#E5C158]">{watch.brand}</span>
                      <h5 className="text-xs font-normal text-white line-clamp-1">{watch.name}</h5>
                      <span className="text-[11px] text-neutral-400">Qty: {quantity}</span>
                    </div>
                  </div>
                  <span className="font-serif font-light text-sm text-white">{formatPrice(watch.price * quantity)}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 text-xs border-t border-white/10 pt-4">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span className="text-white font-semibold">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>VIP Voucher Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-400">
              <span>Insured Armored Logistics</span>
              <span className="text-emerald-400 font-bold uppercase text-[10px]">Complimentary ($0)</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Import / Diplomatic VAT</span>
              <span className="text-white">$0</span>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-baseline text-sm font-bold text-white">
              <span>Final Total</span>
              <span className="font-serif text-2xl text-[#E5C158]">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#E5C158] hover:bg-[#d4af37] text-[#050505] font-semibold rounded-xl text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-colors shadow-[0_4px_20px_rgba(229,193,88,0.3)]"
          >
            {isSubmitting ? (
              <span>Transmitting Protocol...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Place Acquisition</span>
              </>
            )}
          </button>

          <div className="space-y-2 text-[10px] text-neutral-400 text-center">
            <p className="flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E5C158]" />
              <span>Full replacement insurance during transit up to $10,000,000.</span>
            </p>
            <p>Order status and tracking code will be generated immediately.</p>
          </div>
        </div>
      </form>
    </div>
  );
}
