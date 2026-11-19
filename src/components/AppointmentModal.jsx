import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Watch, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AppointmentModal({ isOpen, onClose, initialModel = '', initialStore = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'Private Salon Viewing',
    store: initialStore || 'Austin Flagship - 3409 Bee Cave Rd',
    model: initialModel || 'Basquiat Freelancer Chronograph',
    date: '',
    timeSlot: '14:00 - 15:30',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = 'TM-APT-' + Math.floor(10000 + Math.random() * 90000);
    setConfirmationCode(code);
    setSubmitted(true);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#E5C158', '#F3E5AB', '#ffffff']
      });
    } catch (err) {
      // ignore
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-[#0E0E0E] border border-white/15 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Gold Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E5C158]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-full text-[#8A8A8A] hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="mb-6">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#E5C158] font-semibold flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                TIMUSE VIP CONCIERGE
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white tracking-wide">
                Book a Salon Appointment
              </h3>
              <p className="text-xs text-[#8A8A8A] mt-1 font-light">
                Private bespoke viewing or certified master horologist diagnostic consultation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8A8A8A] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Julian Vance"
                    className="w-full bg-[#141414] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E5C158] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8A8A8A] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (512) 555-0199"
                    className="w-full bg-[#141414] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E5C158] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8A8A8A] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="julian.vance@luxuryhorology.com"
                  className="w-full bg-[#141414] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E5C158] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8A8A8A] mb-1">
                    Service Required
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full bg-[#141414] border border-white/15 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E5C158] transition-colors"
                  >
                    <option value="Private Salon Viewing">Private Salon VIP Viewing</option>
                    <option value="Horological Servicing & Overhaul">Horological Servicing & Overhaul</option>
                    <option value="Bespoke Sourcing & Acquisition">Bespoke Sourcing & Acquisition</option>
                    <option value="Appraisal & Authentication">Appraisal & Authentication</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8A8A8A] mb-1">
                    Salon Location
                  </label>
                  <select
                    value={formData.store}
                    onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                    className="w-full bg-[#141414] border border-white/15 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E5C158] transition-colors"
                  >
                    <option value="Austin Flagship - 3409 Bee Cave Rd">Austin - 3409 Bee Cave Rd</option>
                    <option value="Austin North - 11005 Technology Blvd">Austin - 11005 Technology Blvd</option>
                    <option value="Austin South - 2301 E Riverside Dr">Austin - 2301 E Riverside Dr</option>
                    <option value="Geneva Private Suite - Rue du Rhône">Geneva - Rue du Rhône Suite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8A8A8A] mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#141414] border border-white/15 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E5C158] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8A8A8A] mb-1">
                    Time Window
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full bg-[#141414] border border-white/15 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E5C158] transition-colors"
                  >
                    <option value="10:00 - 11:30">Morning: 10:00 - 11:30</option>
                    <option value="12:00 - 13:30">Midday: 12:00 - 13:30</option>
                    <option value="14:00 - 15:30">Afternoon: 14:00 - 15:30</option>
                    <option value="16:30 - 18:00">Evening: 16:30 - 18:00</option>
                    <option value="18:30 - 20:00 VIP">Private VIP After-Hours: 18:30+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8A8A8A] mb-1">
                  Timepiece / Reference of Interest
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g. Patek Philippe 5260/1455R or Basquiat Freelancer"
                  className="w-full bg-[#141414] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E5C158] transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#E5C158] hover:bg-[#d4af37] text-[#050505] font-semibold text-xs tracking-widest uppercase rounded-lg transition-all shadow-[0_4px_20px_rgba(229,193,88,0.3)] flex items-center justify-center gap-2"
                >
                  <span>Confirm Appointment Reservation</span>
                  <span className="text-sm font-bold">&rarr;</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#8A8A8A] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E5C158]" />
                <span>Complimentary champagne service, private salon vault security, and certified horologist.</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#E5C158]/15 border border-[#E5C158]/40 flex items-center justify-center mx-auto mb-4 text-[#E5C158]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-[10px] tracking-[0.3em] uppercase text-[#E5C158] font-bold">
              RESERVATION CONFIRMED
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white mt-1 mb-2">
              We Await Your Visit
            </h3>

            <p className="text-xs text-[#8A8A8A] max-w-md mx-auto mb-6">
              A private horological advisor has been assigned to your booking. A confirmation docket and security pass have been dispatched to <span className="text-white font-medium">{formData.email}</span>.
            </p>

            <div className="bg-[#141414] border border-white/15 rounded-xl p-4 max-w-sm mx-auto text-left space-y-2 mb-6">
              <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                <span className="text-[#8A8A8A]">Pass Code:</span>
                <span className="font-mono font-bold text-[#E5C158]">{confirmationCode}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                <span className="text-[#8A8A8A]">Salon:</span>
                <span className="text-white truncate max-w-[200px]">{formData.store}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                <span className="text-[#8A8A8A]">Service:</span>
                <span className="text-white">{formData.serviceType}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8A8A8A]">Time Slot:</span>
                <span className="text-white">{formData.date || 'Tomorrow'} at {formData.timeSlot}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Done & Return to Showcase
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
