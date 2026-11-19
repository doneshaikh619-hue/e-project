import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedWatchId, setSelectedWatchId] = useState(null);
  const [quickViewWatch, setQuickViewWatch] = useState(null);
  const [isMobileViewMode, setIsMobileViewMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [appointmentModel, setAppointmentModel] = useState('');
  const [appointmentStore, setAppointmentStore] = useState('');
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastOrder, setLastOrder] = useState(null);
  const [authReturnPage, setAuthReturnPage] = useState(null);

  const showToast = (message, type = 'gold') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const openAppointment = (model = '', store = '') => {
    setAppointmentModel(model);
    setAppointmentStore(store);
    setIsAppointmentOpen(true);
  };

  const closeAppointment = () => {
    setIsAppointmentOpen(false);
  };

  const navigateToProduct = (watchId) => {
    setSelectedWatchId(watchId);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (page, data = null) => {
    setCurrentPage(page);
    if (page === 'order-success' && data) {
      setLastOrder(data);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <UIContext.Provider
      value={{
        currentPage,
        selectedWatchId,
        quickViewWatch,
        isMobileViewMode,
        isChatOpen,
        isFeedbackOpen,
        isAppointmentOpen,
        appointmentModel,
        appointmentStore,
        toast,
        searchQuery,
        lastOrder,
        authReturnPage,
        setAuthReturnPage,
        setCurrentPage,
        setSelectedWatchId,
        setQuickViewWatch,
        setIsMobileViewMode,
        setIsChatOpen,
        setIsFeedbackOpen,
        setIsAppointmentOpen,
        openAppointment,
        closeAppointment,
        setSearchQuery,
        setLastOrder,
        showToast,
        navigateToProduct,
        navigateTo
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
