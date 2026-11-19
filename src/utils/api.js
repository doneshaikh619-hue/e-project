import { initialWatches, initialReviews, initialOrders, initialUsers, initialFAQs } from '../../server/seedData.js';

const API_BASE = '/api';

// Helper to safely fetch with fallback
async function request(endpoint, options = {}, fallbackFn = null) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call to ${endpoint} failed or offline, using fallback:`, err.message);
    if (fallbackFn) {
      return fallbackFn();
    }
    throw err;
  }
}

// Local Storage Fallback Cache
const getLocalData = (key, defaultVal) => {
  try {
    const saved = localStorage.getItem(`wh_${key}`);
    return saved ? JSON.parse(saved) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setLocalData = (key, val) => {
  try {
    localStorage.setItem(`wh_${key}`, JSON.stringify(val));
  } catch (e) {}
};

// INITIALIZE LOCAL STORE IF EMPTY
if (!getLocalData('watches', null)) setLocalData('watches', initialWatches);
if (!getLocalData('reviews', null)) setLocalData('reviews', initialReviews);
if (!getLocalData('orders', null)) setLocalData('orders', initialOrders);
if (!getLocalData('users', null)) setLocalData('users', initialUsers);

export const api = {
  // WATCHES
  getWatches: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/watches?${query}`, { method: 'GET' }, () => {
      let watches = getLocalData('watches', initialWatches);
      const { search, category, brand, minPrice, maxPrice, sortBy, gender, inStock } = params;

      if (search) {
        const q = search.toLowerCase();
        watches = watches.filter(w =>
          w.name.toLowerCase().includes(q) ||
          w.brand.toLowerCase().includes(q) ||
          w.tagline?.toLowerCase().includes(q)
        );
      }
      if (category && category !== 'All') {
        watches = watches.filter(w => w.category.toLowerCase() === category.toLowerCase());
      }
      if (brand && brand !== 'All') {
        watches = watches.filter(w => w.brand.toLowerCase() === brand.toLowerCase());
      }
      if (gender && gender !== 'All') {
        watches = watches.filter(w => w.gender.toLowerCase() === gender.toLowerCase());
      }
      if (inStock === 'true') {
        watches = watches.filter(w => w.stock > 0);
      }
      if (minPrice) watches = watches.filter(w => w.price >= Number(minPrice));
      if (maxPrice) watches = watches.filter(w => w.price <= Number(maxPrice));

      if (sortBy === 'price-low-high') watches.sort((a, b) => a.price - b.price);
      else if (sortBy === 'price-high-low') watches.sort((a, b) => b.price - a.price);
      else if (sortBy === 'rating') watches.sort((a, b) => b.rating - a.rating);
      else if (sortBy === 'newest') watches.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      else if (sortBy === 'bestseller') watches.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));

      return { success: true, count: watches.length, data: watches };
    });
  },

  getWatchById: async (id) => {
    return request(`/watches/${id}`, { method: 'GET' }, () => {
      const watches = getLocalData('watches', initialWatches);
      const watch = watches.find(w => w.id === id);
      if (!watch) return { success: false, message: 'Timepiece not found' };
      const reviews = getLocalData('reviews', initialReviews).filter(r => r.watchId === id);
      return { success: true, data: { ...watch, reviews } };
    });
  },

  createWatch: async (watchData) => {
    return request('/watches', {
      method: 'POST',
      body: JSON.stringify(watchData)
    }, () => {
      const watches = getLocalData('watches', initialWatches);
      const newWatch = {
        ...watchData,
        id: `wh-${Date.now().toString(36)}`,
        rating: 5.0,
        reviewCount: 0
      };
      watches.unshift(newWatch);
      setLocalData('watches', watches);
      return { success: true, data: newWatch };
    });
  },

  updateWatch: async (id, updates) => {
    return request(`/watches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }, () => {
      const watches = getLocalData('watches', initialWatches);
      const index = watches.findIndex(w => w.id === id);
      if (index !== -1) {
        watches[index] = { ...watches[index], ...updates };
        setLocalData('watches', watches);
        return { success: true, data: watches[index] };
      }
      return { success: false, message: 'Watch not found' };
    });
  },

  deleteWatch: async (id) => {
    return request(`/watches/${id}`, { method: 'DELETE' }, () => {
      const watches = getLocalData('watches', initialWatches);
      const index = watches.findIndex(w => w.id === id);
      if (index !== -1) {
        const deleted = watches.splice(index, 1)[0];
        setLocalData('watches', watches);
        return { success: true, data: deleted };
      }
      return { success: false, message: 'Watch not found' };
    });
  },

  uploadImage: async (imageBase64, filename) => {
    return request('/upload-image', {
      method: 'POST',
      body: JSON.stringify({ imageBase64, filename })
    }, () => {
      return { success: true, url: imageBase64 };
    });
  },

  // REVIEWS
  getReviews: async (watchId) => {
    return request(`/reviews${watchId ? `?watchId=${watchId}` : ''}`, { method: 'GET' }, () => {
      const reviews = getLocalData('reviews', initialReviews);
      return { success: true, data: watchId ? reviews.filter(r => r.watchId === watchId) : reviews };
    });
  },

  addReview: async (reviewData) => {
    return request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    }, () => {
      const reviews = getLocalData('reviews', initialReviews);
      const newReview = {
        ...reviewData,
        id: `rev-${Date.now().toString(36)}`,
        date: new Date().toISOString().split('T')[0],
        helpfulCount: 0,
        verifiedBuyer: true
      };
      reviews.unshift(newReview);
      setLocalData('reviews', reviews);
      return { success: true, data: newReview };
    });
  },

  voteReview: async (id, delta = 1) => {
    return request(`/reviews/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ delta })
    }, () => {
      const reviews = getLocalData('reviews', initialReviews);
      const r = reviews.find(item => item.id === id);
      if (r) {
        r.helpfulCount = Math.max(0, (r.helpfulCount || 0) + delta);
        setLocalData('reviews', reviews);
        return { success: true, data: r };
      }
      return { success: false };
    });
  },

  deleteReview: async (id) => {
    return request(`/reviews/${id}`, { method: 'DELETE' }, () => {
      const reviews = getLocalData('reviews', initialReviews);
      const index = reviews.findIndex(r => r.id === id);
      if (index !== -1) {
        const deleted = reviews.splice(index, 1)[0];
        setLocalData('reviews', reviews);
        return { success: true, data: deleted };
      }
      return { success: false };
    });
  },

  // AUTHENTICATION
  login: async (email, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }, () => {
      const users = getLocalData('users', initialUsers);
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user || user.password !== password) {
        throw new Error('Invalid credentials. Please verify your email and password.');
      }
      const { password: pwd, ...safeUser } = user;
      return {
        success: true,
        data: {
          user: safeUser,
          token: `token-${safeUser.id}-${Date.now()}`
        }
      };
    });
  },

  register: async (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }, () => {
      const users = getLocalData('users', initialUsers);
      const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (existing) {
        throw new Error('An account with this email already exists');
      }
      const newUser = {
        ...userData,
        id: `usr-${Date.now().toString(36)}`,
        role: userData.role || 'customer',
        createdAt: new Date().toISOString().split('T')[0],
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`
      };
      users.push(newUser);
      setLocalData('users', users);
      const { password, ...safeUser } = newUser;
      return {
        success: true,
        data: {
          user: safeUser,
          token: `token-${safeUser.id}-${Date.now()}`
        }
      };
    });
  },

  forgotPassword: async (email) => {
    return request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }, () => {
      return {
        success: true,
        message: `Password reset instructions dispatched to ${email}. Verification token: 849201`,
        verificationCode: '849201'
      };
    });
  },

  resetPassword: async (email, newPassword) => {
    return request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword })
    }, () => {
      const users = getLocalData('users', initialUsers);
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        user.password = newPassword;
        setLocalData('users', users);
      }
      return { success: true, message: 'Password updated successfully' };
    });
  },

  updateProfile: async (profileData) => {
    return request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    }, () => {
      const users = getLocalData('users', initialUsers);
      const idx = users.findIndex(u => u.id === profileData.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...profileData };
        setLocalData('users', users);
        const { password, ...safeUser } = users[idx];
        return { success: true, data: safeUser };
      }
      return { success: false, message: 'User not found' };
    });
  },

  // ORDERS
  getOrders: async (userId) => {
    return request(`/orders${userId ? `?userId=${userId}` : ''}`, { method: 'GET' }, () => {
      const orders = getLocalData('orders', initialOrders);
      return { success: true, data: userId ? orders.filter(o => o.userId === userId) : orders };
    });
  },

  createOrder: async (orderData) => {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }, () => {
      const orders = getLocalData('orders', initialOrders);
      const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      const tracking = `WH-VIP-${Math.floor(1000000 + Math.random() * 9000000)}-CH`;
      const newOrder = {
        ...orderData,
        id: orderId,
        date: new Date().toISOString(),
        status: "Processing Vault Verification",
        trackingNumber: tracking,
        carrier: "Swiss Armored Vault Courier"
      };

      // Decrement stock in local cache
      const watches = getLocalData('watches', initialWatches);
      if (newOrder.items) {
        newOrder.items.forEach(item => {
          const w = watches.find(watch => watch.id === item.watchId);
          if (w && w.stock > 0) {
            w.stock = Math.max(0, w.stock - (item.quantity || 1));
          }
        });
        setLocalData('watches', watches);
      }

      orders.unshift(newOrder);
      setLocalData('orders', orders);
      return { success: true, data: newOrder };
    });
  },

  updateOrderStatus: async (orderId, status) => {
    return request(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }, () => {
      const orders = getLocalData('orders', initialOrders);
      const o = orders.find(ord => ord.id === orderId);
      if (o) {
        o.status = status;
        setLocalData('orders', orders);
        return { success: true, data: o };
      }
      return { success: false };
    });
  },

  // WISHLIST
  getWishlist: async (userId) => {
    return request(`/wishlist/${userId}`, { method: 'GET' }, () => {
      const ids = getLocalData(`wishlist_${userId}`, ["wh-001", "wh-003"]);
      const watches = getLocalData('watches', initialWatches);
      return { success: true, data: watches.filter(w => ids.includes(w.id)) };
    });
  },

  toggleWishlist: async (userId, watchId) => {
    return request('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ userId, watchId })
    }, () => {
      let ids = getLocalData(`wishlist_${userId}`, ["wh-001", "wh-003"]);
      let inWishlist = false;
      if (ids.includes(watchId)) {
        ids = ids.filter(id => id !== watchId);
        inWishlist = false;
      } else {
        ids.push(watchId);
        inWishlist = true;
      }
      setLocalData(`wishlist_${userId}`, ids);
      const watches = getLocalData('watches', initialWatches);
      return { success: true, data: { inWishlist, wishlist: watches.filter(w => ids.includes(w.id)) } };
    });
  },

  // SUPPORT & FAQS
  getFAQs: async () => {
    return request('/faqs', { method: 'GET' }, () => ({ success: true, data: initialFAQs }));
  },

  submitMessage: async (msgData) => {
    return request('/messages', {
      method: 'POST',
      body: JSON.stringify(msgData)
    }, () => ({
      success: true,
      message: 'Your concierge inquiry has been registered in our Geneva desk.'
    }));
  },

  submitFeedback: async (feedbackData) => {
    return request('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData)
    }, () => ({
      success: true,
      message: 'Appraisal received. Thank you for your feedback.'
    }));
  },

  // ADMIN
  getAdminStats: async () => {
    return request('/admin/stats', { method: 'GET' }, () => {
      const watches = getLocalData('watches', initialWatches);
      const orders = getLocalData('orders', initialOrders);
      const users = getLocalData('users', initialUsers);
      const reviews = getLocalData('reviews', initialReviews);
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const lowStockWatches = watches.filter(w => w.stock <= 3);

      return {
        success: true,
        data: {
          totalRevenue,
          totalOrders: orders.length,
          totalWatches: watches.length,
          totalUsers: users.length,
          totalReviews: reviews.length,
          lowStockCount: lowStockWatches.length,
          lowStockWatches,
          recentOrders: orders.slice(0, 5)
        }
      };
    });
  }
};
