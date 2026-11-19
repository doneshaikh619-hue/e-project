import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useCart } from './CartContext.jsx';
import { api } from '../utils/api.js';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('wh_wishlist_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wh_wishlist_items', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync with backend if user logged in
  useEffect(() => {
    if (user?.id) {
      api.getWishlist(user.id).then(res => {
        if (res.success && res.data) {
          setWishlist(res.data);
        }
      }).catch(() => {});
    }
  }, [user]);

  const toggleWishlist = async (watch) => {
    const exists = wishlist.some(item => item.id === watch.id);
    let updated;
    if (exists) {
      updated = wishlist.filter(item => item.id !== watch.id);
    } else {
      updated = [watch, ...wishlist];
    }
    setWishlist(updated);

    if (user?.id) {
      api.toggleWishlist(user.id, watch.id).catch(() => {});
    }
    return !exists;
  };

  const isInWishlist = (watchId) => {
    return wishlist.some(item => item.id === watchId);
  };

  const moveToCart = (watch) => {
    addToCart(watch, 1);
    setWishlist(prev => prev.filter(item => item.id !== watch.id));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        moveToCart
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
