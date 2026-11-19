import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { UIProvider, useUI } from './context/UIContext.jsx';

import Navbar from './components/Navbar.jsx';
import TimuseFooter from './components/TimuseFooter.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import QuickViewModal from './components/QuickViewModal.jsx';
import AppointmentModal from './components/AppointmentModal.jsx';
import FeedbackModal from './components/FeedbackModal.jsx';
import MobileFrameWrapper from './components/MobileFrameWrapper.jsx';

import HomePage from './pages/HomePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import FAQSupportPage from './pages/FAQSupportPage.jsx';

import { Sparkles } from 'lucide-react';

function AppContent() {
  const { 
    currentPage, 
    toast, 
    isAppointmentOpen, 
    appointmentModel, 
    appointmentStore, 
    closeAppointment,
    openAppointment 
  } = useUI();

  // Initialize buttery-smooth Lenis scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'catalog':
        return <CatalogPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-success':
        return <OrderConfirmationPage />;
      case 'profile':
        return <ProfilePage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'admin':
        return <AdminDashboardPage />;
      case 'auth':
        return <AuthPage />;
      case 'faq':
        return <FAQSupportPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <MobileFrameWrapper>
      <div className="flex flex-col min-h-screen bg-[#050505] text-slate-100 selection:bg-[#E5C158]/30 selection:text-white">
        {/* Global Toast Notification */}
        {toast && (
          <div className="fixed top-20 right-4 sm:right-8 z-50 animate-bounce">
            <div className="bg-[#121212]/90 backdrop-blur-md px-4 py-3 rounded-xl border border-[#E5C158]/60 shadow-[0_0_25px_rgba(229,193,88,0.3)] flex items-center space-x-3 text-xs">
              <Sparkles className="w-4 h-4 text-[#E5C158] shrink-0" />
              <span className="font-semibold text-slate-100">{toast.message}</span>
            </div>
          </div>
        )}

        {/* Global Navigation */}
        <Navbar />

        {/* Dynamic Page Content */}
        <main className="flex-grow">
          {renderCurrentPage()}
        </main>

        {/* Global Luxury TIMUSE Footer */}
        <TimuseFooter onOpenAppointmentModal={(model) => openAppointment(model)} />

        {/* Global Overlays & Modals */}
        <CartDrawer />
        <QuickViewModal />
        <AppointmentModal
          isOpen={isAppointmentOpen}
          onClose={closeAppointment}
          initialModel={appointmentModel}
          initialStore={appointmentStore}
        />
        <FeedbackModal />
      </div>
    </MobileFrameWrapper>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <UIProvider>
            <AppContent />
          </UIProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
