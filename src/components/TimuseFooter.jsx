import React from 'react';
import { useUI } from '../context/UIContext.jsx';
import { ArrowRight } from 'lucide-react';

export default function TimuseFooter({ onOpenAppointmentModal }) {
  const { navigateTo, setIsFeedbackOpen } = useUI();

  return (
    <footer className="relative w-full bg-[#050505] text-white pt-24 pb-12 px-4 sm:px-12 border-t border-white/[0.08] overflow-hidden select-none">
      <div className="max-w-[1520px] mx-auto space-y-20 relative z-10">
        {/* Top Area: Logo & Action + 3 Nav Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Brand Identity */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl tracking-[0.2em] uppercase font-light text-white">
              TIMUSE
            </h2>
            <p className="text-white/60 text-xs sm:text-sm font-light max-w-sm leading-relaxed">
              Preserving the splendor of treasured Swiss heirlooms and connecting connoisseurs with monumental horological masterworks.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  if (onOpenAppointmentModal) onOpenAppointmentModal('General Inquiries');
                  else navigateTo('faq');
                }}
                className="px-6 py-3 rounded-xl border border-white/25 hover:border-timuse-gold hover:bg-white/5 text-xs uppercase tracking-editorial font-medium flex items-center space-x-2 transition-all group"
              >
                <span>BOOK APPOINTMENT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-timuse-gold" />
              </button>
            </div>
          </div>

          {/* Right 3 Navigation Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs text-white/70 font-light">
            {/* Column 1 */}
            <div className="space-y-3">
              <p className="font-serif text-sm text-white uppercase tracking-wider mb-2 font-normal">Maison</p>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigateTo('catalog')} className="hover:text-white transition-colors">Watches</button></li>
                <li>
                  <button
                    onClick={() => {
                      const el = document.getElementById('stores-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Store Location
                  </button>
                </li>
                <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Our Legacy</button></li>
                <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Events & Auctions</button></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <p className="font-serif text-sm text-white uppercase tracking-wider mb-2 font-normal">Expertise</p>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => {
                      const el = document.getElementById('historical-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Historical Models
                  </button>
                </li>
                <li><button onClick={() => navigateTo('catalog')} className="hover:text-white transition-colors">Pre-Owned Vault</button></li>
                <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Brand Story</button></li>
                <li>
                  <button
                    onClick={() => {
                      const el = document.getElementById('servicing-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Servicing & Repair
                  </button>
                </li>
                <li><button onClick={() => navigateTo('faq')} className="hover:text-white transition-colors">Contact Us</button></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <p className="font-serif text-sm text-white uppercase tracking-wider mb-2 font-normal">Governance</p>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigateTo('faq')} className="hover:text-white transition-colors">Legal Terms</button></li>
                <li><button onClick={() => navigateTo('faq')} className="hover:text-white transition-colors">Careers</button></li>
                <li><button onClick={() => navigateTo('faq')} className="hover:text-white transition-colors">Media Center</button></li>
                <li><button onClick={() => setIsFeedbackOpen(true)} className="hover:text-white transition-colors">Client Feedback</button></li>
                <li><button onClick={() => navigateTo('profile')} className="hover:text-white transition-colors">Sitemap</button></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Geometric Full-Width Pattern Strip */}
        <div className="py-4 border-t border-b border-white/[0.08] flex items-center justify-between overflow-hidden opacity-30 text-[9px] tracking-widest font-mono text-white/50">
          {[...Array(24)].map((_, i) => (
            <span key={i} className="mx-2">✦ ❖ ✦</span>
          ))}
        </div>

        {/* Bottom Area: Copyright & Socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© 2026 TIMUSE Haute Horlogerie. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-xs text-white/70">
            <span className="hover:text-white cursor-pointer transition-colors">FB</span>
            <span className="hover:text-white cursor-pointer transition-colors">IN</span>
            <span className="hover:text-white cursor-pointer transition-colors">YT</span>
            <span className="hover:text-white cursor-pointer transition-colors">X</span>
            <span className="hover:text-white cursor-pointer transition-colors">IG</span>
          </div>
        </div>
      </div>

      {/* Massive Cut-off Watermark Background Text (100vw, Charcoal #111111) */}
      <div className="w-full overflow-hidden flex justify-center -mb-8 sm:-mb-14 pointer-events-none select-none opacity-20">
        <span className="font-serif text-[18vw] leading-none uppercase tracking-[0.2em] text-[#222222] font-black">
          TIMUSE
        </span>
      </div>
    </footer>
  );
}
