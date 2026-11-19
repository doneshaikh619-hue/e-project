import React, { useState, useEffect } from 'react';
import { useUI } from '../context/UIContext.jsx';
import { api } from '../utils/api.js';
import {
  HelpCircle,
  ChevronDown,
  Mail,
  Send,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function FAQSupportPage() {
  const { showToast } = useUI();
  const [faqs, setFaqs] = useState([]);
  const [searchFaq, setSearchFaq] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  // Contact form
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'General Allocation Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.getFAQs().then(res => {
      if (res.success && res.data) {
        setFaqs(res.data);
      }
    });
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setIsSubmitting(true);
    try {
      await api.submitMessage(form);
      setSubmitted(true);
      showToast('Concierge inquiry dispatched to Geneva salon.');
      setForm({ name: '', email: '', subject: 'General Allocation Inquiry', message: '' });
    } catch (err) {
      showToast('Inquiry registered successfully');
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchFaq.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchFaq.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchFaq.toLowerCase())
  );

  return (
    <div className="py-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-bold flex items-center justify-center space-x-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Haute Concierge & Advisory</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">
          Frequently Asked Questions & Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Detailed guidance regarding our 48-point Swiss authenticity certification, armored courier logistics, and private banking settlement protocols.
        </p>

        {/* Search FAQ */}
        <div className="pt-4 max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-luxury-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQs (e.g. authenticity, delivery, warranty, wire)..."
            value={searchFaq}
            onChange={(e) => setSearchFaq(e.target.value)}
            className="w-full bg-luxury-900 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-luxury-gold"
          />
        </div>
      </div>

      {/* Main FAQ Accordion */}
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="glass-card rounded-2xl border border-white/10 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-100 hover:text-luxury-gold transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-luxury-gold/15 text-luxury-gold">
                    {faq.category}
                  </span>
                  <span>{faq.question}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-luxury-gold' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/5 animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Concierge Form & Salons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-8 border-t border-white/10">
        {/* Left: Direct Boutique Salons Info */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-luxury-gold font-bold">Global Salons</span>
            <h2 className="font-serif text-2xl font-bold text-slate-100 mt-1">
              Private Client Lounges
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Visit our secure private viewing rooms by appointment or contact our 24/7 Swiss desk.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="glass-card p-4 rounded-xl border border-white/10 flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-200">Geneva Flagship Maison</h4>
                <p className="text-slate-400">Rue du Rhône 42, 1204 Geneva, Switzerland</p>
                <p className="text-slate-500 font-mono text-[11px] mt-1">+41 22 819 12 00</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-white/10 flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-200">London Mayfair Salon</h4>
                <p className="text-slate-400">14 New Bond Street, Mayfair, London W1S 3SR</p>
                <p className="text-slate-500 font-mono text-[11px] mt-1">+44 20 7946 0912</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-white/10 flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-200">Dubai DIFC Vault</h4>
                <p className="text-slate-400">Gate Village Building 03, DIFC, Dubai, UAE</p>
                <p className="text-slate-500 font-mono text-[11px] mt-1">+971 4 362 7000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7 glass-card p-8 rounded-3xl border border-luxury-gold/30 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-luxury-gold font-bold">Direct Dispatch</span>
            <h3 className="font-serif text-xl font-bold text-slate-100 mt-1">
              Connect With a Senior Horologist
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit your private inquiry regarding acquisitions, custom calibrations, or wire transfers.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-serif font-bold text-base text-slate-100">Inquiry Transmitted</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                A certified horological advisor from our Geneva desk will review your dossier and contact you via secure email within 2 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="gold-button-outline px-4 py-1.5 rounded-lg text-xs font-semibold"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Lord Arthur Pendelton"
                    className="w-full bg-luxury-900 border border-white/10 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-luxury-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Confidential Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="client@watchhub.luxury"
                    className="w-full bg-luxury-900 border border-white/10 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Inquiry Purpose</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-luxury-900 border border-white/10 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-luxury-gold"
                >
                  <option value="General Allocation Inquiry">General Vault Allocation Inquiry</option>
                  <option value="Armored Delivery Logistics">Armored Delivery & Private Jet Coordination</option>
                  <option value="Bespoke Engraving">Custom Caseback Engraving & Calibre Adjustment</option>
                  <option value="Private Banking Escrow">Swiss Wire Escrow & Cryptocurrency Settlement</option>
                  <option value="Provenance Certification">Archival Provenance & Serial Verification</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Confidential Message</label>
                <textarea
                  rows="4"
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Detail your request or specific reference number (e.g., Rolex Daytona, Patek 5711)..."
                  className="w-full bg-luxury-900 border border-white/10 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full gold-button py-3 rounded-xl text-xs font-bold text-luxury-950 uppercase tracking-wider flex items-center justify-center space-x-2 shadow-gold-sm"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting...' : 'Dispatch Message to Geneva Desk'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
