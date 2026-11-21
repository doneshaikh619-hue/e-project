import React from 'react';
import { useUI } from '../context/UIContext.jsx';
import { formatPrice, formatDate } from '../utils/formatters.js';
import { CheckCircle2, ShieldCheck, Printer, ArrowRight, Truck, Clock, Sparkles } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { lastOrder, navigateTo } = useUI();

  // If directly opened without order, use sample fallback
  const order = lastOrder || {
    id: "TM-ORD-94821",
    userName: "Julian Vance",
    userEmail: "julian.vance@luxuryhorology.com",
    date: new Date().toISOString(),
    status: "Processing Vault Verification",
    trackingNumber: "TM-ARM-8839210-TX",
    carrier: "Swiss Armored Vault Courier",
    shippingAddress: {
      fullName: "Julian Vance",
      address: "3018 Bee Cave Rd, Suite 400",
      city: "Austin",
      country: "United States",
      postalCode: "78746"
    },
    items: [
      {
        watchId: "wh-basquiat",
        name: "FREELANCER BASQUIAT SPECIAL EDITION",
        brand: "Raymond Weil",
        price: 4950,
        quantity: 1,
        image: "./assets/watches/raymond_weil_basquiat.webp"
      }
    ],
    subtotal: 4950,
    discount: 495,
    total: 4455,
    paymentMethod: "Centurion Black Card"
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-16 px-4 sm:px-8 max-w-4xl mx-auto space-y-8 animate-fadeIn bg-[#050505] text-white select-none">
      {/* Top Banner */}
      <div className="bg-[#0E0E0E] rounded-3xl p-8 sm:p-12 text-center border border-white/10 relative overflow-hidden space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs uppercase tracking-[0.25em] text-[#E5C158] font-semibold flex items-center justify-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Protocol Confirmed</span>
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-light text-white">
          Acquisition Registered Successfully
        </h1>

        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
          Your investment-grade timepiece has been locked in our vault fulfillment chamber. Certified master horologists are conducting final chronometric timing tests.
        </p>

        {/* Order & Tracking IDs */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
          <div className="px-4 py-2 rounded-xl bg-[#141414] border border-white/10">
            <span className="text-neutral-500 block text-[10px] uppercase font-sans">Official Dossier Ref</span>
            <span className="text-[#E5C158] font-bold">{order.id}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#141414] border border-white/10">
            <span className="text-neutral-500 block text-[10px] uppercase font-sans">Armored Tracking Number</span>
            <span className="text-emerald-400 font-bold">{order.trackingNumber}</span>
          </div>
        </div>
      </div>

      {/* Live Order Tracking Timeline */}
      <div className="bg-[#0E0E0E] rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
        <h3 className="font-serif font-normal text-base text-white flex items-center space-x-2">
          <Clock className="w-4 h-4 text-[#E5C158]" />
          <span>Live Armored Courier Dispatch Timeline</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          <div className="p-4 rounded-xl bg-[#141414] border border-[#E5C158] text-xs space-y-1">
            <span className="text-[10px] font-bold text-[#E5C158] uppercase tracking-wider">Step 1 • Completed</span>
            <h4 className="font-semibold text-white">Order Registered</h4>
            <p className="text-[11px] text-neutral-400">Escrow funds secured and confirmed.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#141414] border border-[#E5C158]/50 text-xs space-y-1">
            <span className="text-[10px] font-bold text-[#E5C158] uppercase tracking-wider">Step 2 • Active</span>
            <h4 className="font-semibold text-white">Vault Chrono Test</h4>
            <p className="text-[11px] text-neutral-400">5-position master regulation test in progress.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#0E0E0E] border border-white/10 text-xs space-y-1 opacity-60">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Step 3 • Pending</span>
            <h4 className="font-semibold text-white">Armored Transit</h4>
            <p className="text-[11px] text-neutral-400">Dispatched via {order.carrier || 'Swiss Courier'}.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#0E0E0E] border border-white/10 text-xs space-y-1 opacity-60">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Step 4 • Final</span>
            <h4 className="font-semibold text-white">White-Glove Handoff</h4>
            <p className="text-[11px] text-neutral-400">Biometric signature and unboxing at residence.</p>
          </div>
        </div>
      </div>

      {/* Itemized Docket */}
      <div className="bg-[#0E0E0E] rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h3 className="font-serif font-normal text-base text-white">Acquisition Manifest</h3>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg border border-white/20 text-xs text-neutral-300 hover:text-white hover:border-[#E5C158] flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#E5C158]" />
            <span>Print Official Dossier</span>
          </button>
        </div>

        <div className="divide-y divide-white/10">
          {order.items?.map((item, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-lg bg-[#141414] border border-white/10 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={item.image || './assets/watches/raymond_weil_basquiat.webp'}
                    alt={item.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5C158]">{item.brand}</span>
                  <h4 className="font-serif text-sm font-normal text-white">{item.name}</h4>
                  <p className="text-xs text-neutral-400">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-serif text-sm font-normal text-white">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-xs border-t border-white/10 pt-4">
          <div className="flex justify-between text-neutral-400">
            <span>Subtotal</span>
            <span className="text-white font-medium">{formatPrice(order.subtotal || order.total)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>VIP Privilege Discount</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-neutral-400">
            <span>Carrier Protocol</span>
            <span className="text-white">{order.carrier}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Payment Method</span>
            <span className="text-white">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between items-baseline pt-3 border-t border-white/10 text-base font-bold">
            <span className="text-white">Amount Settled</span>
            <span className="font-serif text-2xl text-[#E5C158]">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141414] border border-white/10 text-xs space-y-1">
          <p className="text-[#E5C158] font-bold uppercase tracking-wider text-[10px]">Destination Vault</p>
          <p className="text-white font-medium">{order.shippingAddress?.fullName}</p>
          <p className="text-neutral-400">{order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.country} {order.shippingAddress?.postalCode}</p>
        </div>

        <div className="flex justify-center pt-2">
          <button
            onClick={() => navigateTo('home')}
            className="px-8 py-3 bg-[#E5C158] hover:bg-[#d4af37] text-[#050505] font-semibold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center space-x-2 shadow-[0_4px_20px_rgba(229,193,88,0.3)]"
          >
            <span>Return to TIMUSE Showcase</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
