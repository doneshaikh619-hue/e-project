import React, { useState } from 'react';
import { useUI } from '../context/UIContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  Search, 
  Globe, 
  ShoppingBag, 
  Heart, 
  User, 
  X, 
  ChevronRight, 
  SlidersHorizontal,
  Calendar,
  Sparkles,
  ShieldCheck,
  Package
} from 'lucide-react';

export default function Navbar() {
  const { navigateTo, openAppointment } = useUI();
  const { totalQuantity, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050505] border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.9)] transition-all">
      <nav className="max-w-[1600px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Left: Minimalist 2-line Hamburger Menu Icon */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="group flex flex-col justify-center items-start w-8 h-8 space-y-1.5 focus:outline-none p-1 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <span className="w-5 h-[1.5px] bg-white group-hover:w-6 transition-all duration-300" />
            <span className="w-3.5 h-[1.5px] bg-white group-hover:w-6 transition-all duration-300" />
          </button>
        </div>

        {/* Center: TIMUSE Luxury Serif Wordmark Logo */}
        <div
          onClick={() => { navigateTo('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="cursor-pointer select-none text-center"
        >
          <span className="font-serif font-light text-xl sm:text-2xl tracking-[0.25em] uppercase text-white hover:text-[#E5C158] transition-colors">
            TIMUSE
          </span>
        </div>

        {/* Right Action Links & Icons */}
        <div className="flex items-center space-x-3 sm:space-x-5 text-xs text-white/80">
          {/* Quick Anchor Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-5 text-[11px] uppercase tracking-widest font-light">
            <button
              onClick={() => {
                const el = document.getElementById('stores-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else navigateTo('faq');
              }}
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-white/50" />
              <span>Location</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('find-my-watch-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else navigateTo('catalog');
              }}
              className="hover:text-white transition-colors"
            >
              Categories
            </button>
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => {
              const el = document.getElementById('find-my-watch-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else navigateTo('catalog');
            }}
            className="p-2 rounded-full hover:bg-white/10 hover:text-[#E5C158] transition-colors"
            title="Search Timepieces"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => navigateTo('wishlist')}
            className="relative p-2 rounded-full hover:bg-white/10 hover:text-[#E5C158] transition-colors"
            title="Saved Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#E5C158] text-[#050505] text-[9px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Bag */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-white/10 hover:text-[#E5C158] transition-colors"
            title="Acquisition Portfolio"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalQuantity > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#E5C158] text-[#050505] text-[9px] font-bold flex items-center justify-center animate-pulse">
                {totalQuantity}
              </span>
            )}
          </button>

          {/* Client Account Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="p-1.5 rounded-full border border-white/20 hover:border-[#E5C158] hover:text-[#E5C158] transition-colors flex items-center"
              title="Client Account"
            >
              <User className="w-4 h-4" />
            </button>

            {isAccountOpen && (
              <div
                className="absolute right-0 mt-3 w-60 rounded-xl bg-[#0E0E0E] p-3 shadow-2xl z-50 text-xs border border-white/15 animate-fadeIn"
                onMouseLeave={() => setIsAccountOpen(false)}
              >
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-2 py-1.5 border-b border-white/10">
                      <p className="font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-[#E5C158] uppercase tracking-wider font-mono">{user.role}</p>
                    </div>
                    <button
                      onClick={() => { navigateTo('profile'); setIsAccountOpen(false); }}
                      className="w-full text-left px-2 py-2 rounded-lg hover:bg-white/5 text-white/90 flex items-center space-x-2"
                    >
                      <Package className="w-3.5 h-3.5 text-[#E5C158]" />
                      <span>My Vault & Orders</span>
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => { navigateTo('admin'); setIsAccountOpen(false); }}
                        className="w-full text-left px-2 py-2 rounded-lg text-[#E5C158] hover:bg-white/5 flex items-center space-x-2"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span className="font-semibold">Executive Admin</span>
                      </button>
                    )}
                    <button
                      onClick={() => { openAppointment('General Inquiries'); setIsAccountOpen(false); }}
                      className="w-full text-left px-2 py-2 rounded-lg hover:bg-white/5 text-white/80 flex items-center space-x-2"
                    >
                      <Calendar className="w-3.5 h-3.5 text-white/60" />
                      <span>Book Salon Viewing</span>
                    </button>
                    <button
                      onClick={() => { logout(); setIsAccountOpen(false); }}
                      className="w-full text-left px-2 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 border-t border-white/10"
                    >
                      Exit Session
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 text-center p-2">
                    <p className="text-white font-serif text-sm">TIMUSE Haute Horlogerie</p>
                    <p className="text-[11px] text-white/60">Client Accreditation</p>
                    <button
                      onClick={() => { navigateTo('auth'); setIsAccountOpen(false); }}
                      className="w-full py-2.5 rounded-lg bg-[#E5C158] text-[#050505] font-bold text-xs uppercase tracking-wider hover:bg-[#d4af37] transition-colors"
                    >
                      Sign In / Register
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Full-Screen Mobile / Desktop Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
          />

          <div className="relative w-full max-w-sm bg-[#0E0E0E] border-r border-white/15 h-full z-10 flex flex-col justify-between p-6 sm:p-8 animate-fadeIn">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <span className="font-serif text-2xl tracking-[0.2em] uppercase text-white font-light">
                  TIMUSE
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-6 space-y-4">
                <button
                  onClick={() => { navigateTo('home'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left font-serif text-lg text-white hover:text-[#E5C158] transition-colors flex items-center justify-between py-1"
                >
                  <span>Maison Home</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>

                <button
                  onClick={() => { navigateTo('catalog'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left font-serif text-lg text-white hover:text-[#E5C158] transition-colors flex items-center justify-between py-1"
                >
                  <span>Curated Timepieces</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    const el = document.getElementById('find-my-watch-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left font-serif text-lg text-white hover:text-[#E5C158] transition-colors flex items-center justify-between py-1"
                >
                  <span>AI Watch Concierge</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    const el = document.getElementById('brands-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left font-serif text-lg text-white hover:text-[#E5C158] transition-colors flex items-center justify-between py-1"
                >
                  <span>Our Maisons</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    const el = document.getElementById('servicing-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left font-serif text-lg text-white hover:text-[#E5C158] transition-colors flex items-center justify-between py-1"
                >
                  <span>High Horology Servicing</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    const el = document.getElementById('stores-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left font-serif text-lg text-white hover:text-[#E5C158] transition-colors flex items-center justify-between py-1"
                >
                  <span>Austin Boutiques & Map</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>

                <button
                  onClick={() => { navigateTo('checkout'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left font-serif text-lg text-[#E5C158] hover:text-[#d4af37] transition-colors flex items-center justify-between py-1"
                >
                  <span>White-Glove Checkout</span>
                  <ChevronRight className="w-4 h-4 text-[#E5C158]" />
                </button>

                <button
                  onClick={() => { navigateTo('admin'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left font-serif text-lg text-neutral-300 hover:text-white transition-colors flex items-center justify-between py-1"
                >
                  <span>Executive Admin Suite</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>

                <button
                  onClick={() => { navigateTo('faq'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left font-serif text-lg text-neutral-300 hover:text-white transition-colors flex items-center justify-between py-1"
                >
                  <span>Boutique Escrow & FAQ</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAppointment('Salon VIP Viewing');
                }}
                className="w-full py-3 bg-[#E5C158] hover:bg-[#d4af37] text-[#050505] font-semibold text-xs tracking-wider uppercase rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Salon Appointment</span>
              </button>

              <div className="flex items-center justify-between text-xs text-neutral-500 pt-2">
                <span>Geneva · Austin · Paris</span>
                <span>Est. 1839</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
