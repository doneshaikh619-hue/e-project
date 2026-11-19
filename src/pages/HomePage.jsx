import React from 'react';
import HeroBasquiat from '../components/HeroBasquiat.jsx';
import FindMyWatchConcierge from '../components/FindMyWatchConcierge.jsx';
import OurBrandsPortal from '../components/OurBrandsPortal.jsx';
import ServicingSection from '../components/ServicingSection.jsx';
import HistoricalModels from '../components/HistoricalModels.jsx';
import StoreLocatorMap from '../components/StoreLocatorMap.jsx';
import { useUI } from '../context/UIContext.jsx';

export default function HomePage() {
  const { openAppointment } = useUI();

  return (
    <div className="bg-[#050505] text-white selection:bg-[#E5C158]/30 selection:text-white">
      {/* SECTION 1: 3D Macro Hero & Scroll-Zoom Transition */}
      <HeroBasquiat onOpenBooking={() => openAppointment('Basquiat Freelancer Chronograph')} />

      {/* SECTION 2 & 3: Floating Infinite Watch Matrix, "FIND MY WATCH" Search & Dynamic AI Concierge */}
      <FindMyWatchConcierge />

      {/* SECTION 4: "OUR BRANDS" Interactive Horizontal Portal with Light-Streak Hover Video */}
      <OurBrandsPortal />

      {/* SECTION 5: "SERVICING" High Horology 50/50 Split with Rotating Calibre Video & Editorial Wrist Photo */}
      <ServicingSection onOpenAppointmentModal={(model) => openAppointment(model || 'Horology Overhaul')} />

      {/* SECTION 6: "HISTORICAL MODELS" Masterwork Showcase & Progress Carousel */}
      <HistoricalModels onOpenBooking={(model) => openAppointment(model)} />

      {/* SECTION 7: "STORES NEAR YOU" Interactive Austin Vector Map & Directory */}
      <StoreLocatorMap onOpenAppointmentModal={(store) => openAppointment('Salon Visit', store?.name)} />
    </div>
  );
}
