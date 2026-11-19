import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialWatches, initialReviews, initialOrders, initialUsers, initialFAQs } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data_store.json');

class Database {
  constructor() {
    this.data = {
      watches: [],
      reviews: [],
      orders: [],
      users: [],
      faqs: [],
      wishlist: {},
      feedback: [],
      messages: []
    };
    this.init();
  }

  init() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure defaults if missing keys
        if (!this.data.watches || this.data.watches.length === 0) {
          this.data.watches = initialWatches;
        }
        if (!this.data.reviews || this.data.reviews.length === 0) {
          this.data.reviews = initialReviews;
        }
        if (!this.data.orders || this.data.orders.length === 0) {
          this.data.orders = initialOrders;
        }
        if (!this.data.users || this.data.users.length === 0) {
          this.data.users = initialUsers;
        }
        if (!this.data.faqs || this.data.faqs.length === 0) {
          this.data.faqs = initialFAQs;
        }
        if (!this.data.feedback) this.data.feedback = [];
        if (!this.data.messages) this.data.messages = [];
        if (!this.data.wishlist) this.data.wishlist = {};
      } catch (err) {
        console.error('Error reading db file, re-seeding:', err);
        this.seedDefaults();
      }
    } else {
      this.seedDefaults();
    }
  }

  seedDefaults() {
    this.data = {
      watches: initialWatches,
      reviews: initialReviews,
      orders: initialOrders,
      users: initialUsers,
      faqs: initialFAQs,
      wishlist: {
        "usr-002": ["wh-001", "wh-003", "wh-006"]
      },
      feedback: [
        {
          id: "fb-1",
          userId: "usr-002",
          userName: "Arthur Pendelton",
          rating: 5,
          category: "UI Experience",
          comment: "The 360 degree watch viewer and typography are breathtaking! Felt like visiting an authentic boutique in Geneva.",
          createdAt: "2026-11-10T10:00:00Z"
        }
      ],
      messages: [
        {
          id: "msg-1",
          name: "Lord Arthur",
          email: "arthur@luxuryclient.com",
          subject: "Custom Engraving Inquiry",
          message: "Greetings, would it be possible to engrave my family crest on the exhibition caseback of the Daytona?",
          createdAt: "2026-11-11T12:00:00Z",
          status: "Replied"
        }
      ]
    };
    this.save();
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to database:', err);
    }
  }

  // Watches
  getWatches() {
    return this.data.watches;
  }

  getWatchById(id) {
    return this.data.watches.find(w => w.id === id);
  }

  addWatch(watch) {
    const newWatch = {
      ...watch,
      id: `wh-${Date.now().toString(36)}`,
      rating: watch.rating || 5.0,
      reviewCount: watch.reviewCount || 0
    };
    this.data.watches.unshift(newWatch);
    this.save();
    return newWatch;
  }

  updateWatch(id, updates) {
    const index = this.data.watches.findIndex(w => w.id === id);
    if (index !== -1) {
      this.data.watches[index] = { ...this.data.watches[index], ...updates };
      this.save();
      return this.data.watches[index];
    }
    return null;
  }

  deleteWatch(id) {
    const index = this.data.watches.findIndex(w => w.id === id);
    if (index !== -1) {
      const deleted = this.data.watches.splice(index, 1);
      this.save();
      return deleted[0];
    }
    return null;
  }

  // Reviews
  getReviews(watchId) {
    if (watchId) {
      return this.data.reviews.filter(r => r.watchId === watchId);
    }
    return this.data.reviews;
  }

  addReview(review) {
    const newReview = {
      ...review,
      id: `rev-${Date.now().toString(36)}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0
    };
    this.data.reviews.unshift(newReview);

    // Update watch rating
    const watchReviews = this.data.reviews.filter(r => r.watchId === review.watchId);
    const avg = watchReviews.reduce((sum, r) => sum + Number(r.rating), 0) / watchReviews.length;
    this.updateWatch(review.watchId, {
      rating: parseFloat(avg.toFixed(2)),
      reviewCount: watchReviews.length
    });

    this.save();
    return newReview;
  }

  voteReview(reviewId, delta = 1) {
    const rev = this.data.reviews.find(r => r.id === reviewId);
    if (rev) {
      rev.helpfulCount = Math.max(0, (rev.helpfulCount || 0) + delta);
      this.save();
      return rev;
    }
    return null;
  }

  deleteReview(reviewId) {
    const index = this.data.reviews.findIndex(r => r.id === reviewId);
    if (index !== -1) {
      const removed = this.data.reviews.splice(index, 1)[0];
      this.save();
      return removed;
    }
    return null;
  }

  // Orders
  getOrders(userId) {
    if (userId) {
      return this.data.orders.filter(o => o.userId === userId);
    }
    return this.data.orders;
  }

  createOrder(orderData) {
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
    
    // Decrement stock for purchased items
    if (newOrder.items && Array.isArray(newOrder.items)) {
      newOrder.items.forEach(item => {
        const watch = this.getWatchById(item.watchId);
        if (watch && watch.stock > 0) {
          this.updateWatch(watch.id, { stock: Math.max(0, watch.stock - (item.quantity || 1)) });
        }
      });
    }

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    const order = this.data.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      this.save();
      return order;
    }
    return null;
  }

  // Users
  getUsers() {
    return this.data.users.map(({ password, ...u }) => u);
  }

  findUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    const u = this.data.users.find(u => u.id === id);
    if (u) {
      const { password, ...safeUser } = u;
      return safeUser;
    }
    return null;
  }

  createUser(userData) {
    const newUser = {
      ...userData,
      id: `usr-${Date.now().toString(36)}`,
      role: userData.role || 'customer',
      createdAt: new Date().toISOString().split('T')[0],
      avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`
    };
    this.data.users.push(newUser);
    this.save();
    const { password, ...safeUser } = newUser;
    return safeUser;
  }

  updateUser(id, updates) {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.data.users[index] = { ...this.data.users[index], ...updates };
      this.save();
      const { password, ...safeUser } = this.data.users[index];
      return safeUser;
    }
    return null;
  }

  // Wishlist
  getUserWishlist(userId) {
    const ids = this.data.wishlist[userId] || [];
    return this.data.watches.filter(w => ids.includes(w.id));
  }

  toggleWishlist(userId, watchId) {
    if (!this.data.wishlist[userId]) {
      this.data.wishlist[userId] = [];
    }
    const idx = this.data.wishlist[userId].indexOf(watchId);
    let inWishlist = false;
    if (idx !== -1) {
      this.data.wishlist[userId].splice(idx, 1);
      inWishlist = false;
    } else {
      this.data.wishlist[userId].push(watchId);
      inWishlist = true;
    }
    this.save();
    return { inWishlist, wishlist: this.getUserWishlist(userId) };
  }

  // Feedback & Support
  addFeedback(item) {
    const fb = {
      ...item,
      id: `fb-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString()
    };
    this.data.feedback.unshift(fb);
    this.save();
    return fb;
  }

  getFeedback() {
    return this.data.feedback;
  }

  addMessage(msg) {
    const m = {
      ...msg,
      id: `msg-${Date.now().toString(36)}`,
      status: "Received",
      createdAt: new Date().toISOString()
    };
    this.data.messages.unshift(m);
    this.save();
    return m;
  }

  getMessages() {
    return this.data.messages;
  }

  getFAQs() {
    return this.data.faqs;
  }
}

export const db = new Database();
