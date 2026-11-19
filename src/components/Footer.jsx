import React, { useState } from 'react';
import { useUI } from '../context/UIContext.jsx';
import { Shield, Award, Clock, MapPin, Send, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const { navigateTo, setIsFeedbackOpen } = useUI();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-luxury-950 border-t border-luxury-gold/20 pt-16 pb-12 text-slate-400 text-xs">
      {/* Trust Badges Strip */}
      <div className="max-w-7xl mx-auto px-6 mb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full border border-luxury-gold/40 flex items-center justify-center bg-luxury-900 text-luxury-gold shadow-gold-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-slate-100 font-semibold text-sm uppercase tracking-wider">100% Certified</h4>
            <p className="text-slate-400 text-xs mt-0.5">Authenticity verified by Swiss horologists.</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full border border-luxury-gold/40 flex items-center justify-center bg-luxury-900 text-luxury-gold shadow-gold-sm">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-slate-100 font-semibold text-sm uppercase tracking-wider">5-Year Warranty</h4>
            <p className="text-slate-400 text-xs mt-0.5">Comprehensive mechanical coverage.</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full border border-luxury-gold/40 flex items-center justify-center bg-luxury-900 text-luxury-gold shadow-gold-sm">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-slate-100 font-semibold text-sm uppercase tracking-wider">Armored Transit</h4>
            <p className="text-slate-400 text-xs mt-0.5">Insured global white-glove handoff.</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full border border-luxury-gold/40 flex items-center justify-center bg-luxury-900 text-luxury-gold shadow-gold-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-slate-100 font-semibold text-sm uppercase tracking-wider">Bespoke Concierge</h4>
            <p className="text-slate-400 text-xs mt-0.5">Private horological client advisor 24/7.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border border-luxury-gold flex items-center justify-center bg-luxury-900">
              <span className="font-serif font-black text-luxury-gold text-sm">W</span>
            </div>
            <span className="font-serif font-bold text-xl tracking-wider text-slate-100">
              WATCH<span className="text-luxury-gold">HUB</span>
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
            WatchHub is a premier Haute Horlogerie marketplace uniting world-renowned watchmakers and discerning collectors across the globe. Precision, prestige, and timeless legacy.
          </p>
          <div className="pt-2">
            <p className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">Flagship Boutiques</p>
            <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-luxury-gold">
              <span>Geneva</span> • <span>Zurich</span> • <span>London</span> • <span>New York</span> • <span>Dubai</span> • <span>Tokyo</span>
            </div>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-3">
          <h5 className="font-serif font-semibold text-slate-100 uppercase tracking-widest text-xs">Collections</h5>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => navigateTo('catalog')} className="hover:text-luxury-gold transition-colors">Rolex Superlatives</button></li>
            <li><button onClick={() => navigateTo('catalog')} className="hover:text-luxury-gold transition-colors">Patek Philippe Complications</button></li>
            <li><button onClick={() => navigateTo('catalog')} className="hover:text-luxury-gold transition-colors">Audemars Piguet Royal Oak</button></li>
            <li><button onClick={() => navigateTo('catalog')} className="hover:text-luxury-gold transition-colors">Omega Speedmaster Moonwatch</button></li>
            <li><button onClick={() => navigateTo('catalog')} className="hover:text-luxury-gold transition-colors">Richard Mille Tourbillons</button></li>
            <li><button onClick={() => navigateTo('catalog')} className="hover:text-luxury-gold transition-colors">Cartier Santos Skeleton</button></li>
          </ul>
        </div>

        {/* Client Services */}
        <div className="space-y-3">
          <h5 className="font-serif font-semibold text-slate-100 uppercase tracking-widest text-xs">Services</h5>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => navigateTo('faq')} className="hover:text-luxury-gold transition-colors">Private Concierge Desk</button></li>
            <li><button onClick={() => navigateTo('faq')} className="hover:text-luxury-gold transition-colors">Authenticity Certification</button></li>
            <li><button onClick={() => navigateTo('faq')} className="hover:text-luxury-gold transition-colors">Insured Armored Delivery</button></li>
            <li><button onClick={() => setIsFeedbackOpen(true)} className="hover:text-luxury-gold transition-colors">Client Experience Feedback</button></li>
            <li><button onClick={() => navigateTo('profile')} className="hover:text-luxury-gold transition-colors">Vault Order Tracking</button></li>
          </ul>
        </div>

        {/* Private Salon Newsletter */}
        <div className="space-y-3">
          <h5 className="font-serif font-semibold text-slate-100 uppercase tracking-widest text-xs">Private Gazette</h5>
          <p className="text-xs text-slate-400">Receive private allocation previews and invitations to horological auctions.</p>
          {subscribed ? (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>You have been registered for private salon allocations.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Your executive email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-luxury-900 border border-luxury-gold/30 rounded-lg py-2.5 px-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-luxury-gold"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 gold-button rounded-md flex items-center justify-center text-luxury-950"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
        <p>© 2026 WatchHub Luxury Haute Horlogerie Inc. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 flex items-center space-x-2 text-slate-400">
          <span>Aptech eProject Portfolio</span>
          <span>•</span>
          <span className="text-luxury-gold">Senior Developer Edition</span>
        </p>
      </div>
    </footer>
  );
}
