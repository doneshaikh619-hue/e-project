import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'WatchHub Luxury E-Commerce API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// IMAGE UPLOAD API FOR ADMIN CRUD
app.post('/api/upload-image', (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'No image data provided' });
    }

    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    let ext = 'png';
    if (matches && matches.length === 3) {
      buffer = Buffer.from(matches[2], 'base64');
      const mime = matches[1];
      if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';
      else if (mime.includes('webp')) ext = 'webp';
    } else {
      buffer = Buffer.from(imageBase64, 'base64');
    }

    const cleanName = (filename || 'watch_custom').replace(/[^a-zA-Z0-9_-]/g, '_');
    const newFilename = `${cleanName}_${Date.now()}.${ext}`;
    const targetDir = path.join(__dirname, '../public/assets/watches');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const targetPath = path.join(targetDir, newFilename);
    fs.writeFileSync(targetPath, buffer);

    const relativeUrl = `./assets/watches/${newFilename}`;
    res.json({
      success: true,
      message: 'Image uploaded successfully to vault assets',
      url: relativeUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// WATCHES API
app.get('/api/watches', (req, res) => {
  try {
    let watches = db.getWatches();
    const { search, category, brand, minPrice, maxPrice, sortBy, gender, inStock } = req.query;

    if (search) {
      const q = search.toLowerCase();
      watches = watches.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.brand.toLowerCase().includes(q) ||
        w.tagline?.toLowerCase().includes(q) ||
        w.description?.toLowerCase().includes(q)
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

    if (minPrice) {
      watches = watches.filter(w => w.price >= Number(minPrice));
    }

    if (maxPrice) {
      watches = watches.filter(w => w.price <= Number(maxPrice));
    }

    if (sortBy) {
      if (sortBy === 'price-low-high') {
        watches.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high-low') {
        watches.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        watches.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'newest') {
        watches.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      } else if (sortBy === 'bestseller') {
        watches.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
      }
    }

    res.json({
      success: true,
      count: watches.length,
      data: watches
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/watches/:id', (req, res) => {
  try {
    const watch = db.getWatchById(req.params.id);
    if (!watch) {
      return res.status(404).json({ success: false, message: 'Timepiece not found' });
    }
    const reviews = db.getReviews(watch.id);
    res.json({
      success: true,
      data: { ...watch, reviews }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/watches', (req, res) => {
  try {
    const { name, brand, category, price, stock } = req.body;
    if (!name || !brand || !price) {
      return res.status(400).json({ success: false, message: 'Name, brand, and price are required' });
    }
    const newWatch = db.addWatch(req.body);
    res.status(201).json({ success: true, data: newWatch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/watches/:id', (req, res) => {
  try {
    const updated = db.updateWatch(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Timepiece not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/watches/:id', (req, res) => {
  try {
    const deleted = db.deleteWatch(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Timepiece not found' });
    }
    res.json({ success: true, message: 'Timepiece deleted', data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// REVIEWS API
app.get('/api/reviews', (req, res) => {
  try {
    const reviews = db.getReviews(req.query.watchId);
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/reviews', (req, res) => {
  try {
    const { watchId, rating, content, userName } = req.body;
    if (!watchId || !rating || !content || !userName) {
      return res.status(400).json({ success: false, message: 'watchId, rating, userName and content are required' });
    }
    const review = db.addReview(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/reviews/:id/vote', (req, res) => {
  try {
    const updated = db.voteReview(req.params.id, req.body.delta || 1);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/reviews/:id', (req, res) => {
  try {
    const deleted = db.deleteReview(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, message: 'Review removed', data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// AUTHENTICATION API
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }
    const newUser = db.createUser(req.body);
    const token = `token-${newUser.id}-${Date.now()}`;
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user: newUser, token }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const user = db.findUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your email and password.' });
    }
    const { password: pwd, ...safeUser } = user;
    const token = `token-${safeUser.id}-${Date.now()}`;
    res.json({
      success: true,
      message: 'Signed in successfully',
      data: { user: safeUser, token }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'No registered client found with this email' });
    }
    res.json({
      success: true,
      message: `Password reset protocol dispatched to ${email}. Verification token: 849201`,
      verificationCode: '849201'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    db.updateUser(user.id, { password: newPassword });
    res.json({ success: true, message: 'Password updated successfully. You may now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/auth/profile', (req, res) => {
  try {
    const { id, ...updates } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    const updated = db.updateUser(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/users', (req, res) => {
  try {
    const users = db.getUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ORDERS API
app.get('/api/orders', (req, res) => {
  try {
    const { userId } = req.query;
    const orders = db.getOrders(userId);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const { items, total, shippingAddress } = req.body;
    if (!items || !items.length || !total || !shippingAddress) {
      return res.status(400).json({ success: false, message: 'Items, total and shipping address are required' });
    }
    const order = db.createOrder(req.body);
    res.status(201).json({
      success: true,
      message: 'Luxury timepiece order registered in vault for fulfillment',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// WISHLIST API
app.get('/api/wishlist/:userId', (req, res) => {
  try {
    const wishlist = db.getUserWishlist(req.params.userId);
    res.json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/wishlist/toggle', (req, res) => {
  try {
    const { userId, watchId } = req.body;
    if (!userId || !watchId) {
      return res.status(400).json({ success: false, message: 'userId and watchId are required' });
    }
    const result = db.toggleWishlist(userId, watchId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// SUPPORT, FAQS & FEEDBACK
app.get('/api/faqs', (req, res) => {
  res.json({ success: true, data: db.getFAQs() });
});

app.post('/api/messages', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }
    const msg = db.addMessage(req.body);
    res.status(201).json({ success: true, message: 'Your concierge inquiry has been registered', data: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/messages', (req, res) => {
  res.json({ success: true, data: db.getMessages() });
});

app.post('/api/feedback', (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }
    const fb = db.addFeedback(req.body);
    res.status(201).json({ success: true, message: 'Feedback submitted. Thank you for your appraisal.', data: fb });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/feedback', (req, res) => {
  res.json({ success: true, data: db.getFeedback() });
});

// ADMIN ANALYTICS
app.get('/api/admin/stats', (req, res) => {
  try {
    const watches = db.getWatches();
    const orders = db.getOrders();
    const users = db.getUsers();
    const reviews = db.getReviews();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lowStockWatches = watches.filter(w => w.stock <= 3);

    res.json({
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
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`WatchHub Luxury E-Commerce Server listening on port ${PORT}`);
});
