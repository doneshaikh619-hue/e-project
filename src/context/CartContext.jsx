import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const COUPONS = {
  WATCHVIP10: { type: 'percent', value: 10, label: '10% VIP Privilege' },
  LUXURY500: { type: 'fixed', value: 500, label: '$500 Salon Credit' },
  ROYAL20: { type: 'percent', value: 20, label: '20% Connoisseur Grant' }
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('wh_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('wh_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (watch, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.watch.id === watch.id);
      if (existing) {
        return prev.map(item =>
          item.watch.id === watch.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, watch.stock || 99) }
            : item
        );
      }
      return [...prev, { watch, quantity: Math.min(quantity, watch.stock || 99) }];
    });
  };

  const removeFromCart = (watchId) => {
    setCartItems(prev => prev.filter(item => item.watch.id !== watchId));
  };

  const updateQuantity = (watchId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(watchId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => {
        if (item.watch.id === watchId) {
          const maxStock = item.watch.stock || 99;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const applyCoupon = (code) => {
    setCouponError('');
    const clean = code.trim().toUpperCase();
    if (COUPONS[clean]) {
      setAppliedCoupon({ code: clean, ...COUPONS[clean] });
      return true;
    } else {
      setCouponError('Invalid or expired luxury credential voucher code');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.watch.price * item.quantity), 0);
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discount = (subtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === 'fixed') {
      discount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  const shippingFee = 0; // Complimentary Insured Armored Delivery
  const tax = 0; // Duty free diplomatic export
  const total = Math.max(0, subtotal - discount + shippingFee + tax);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalQuantity,
        subtotal,
        discount,
        tax,
        shippingFee,
        total,
        appliedCoupon,
        couponCode,
        couponError,
        isCartOpen,
        setIsCartOpen,
        setCouponCode,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
