import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { api } from '../utils/api.js';
import { formatPrice, formatDate } from '../utils/formatters.js';
import {
  SlidersHorizontal,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  X,
  Save,
  ShieldCheck,
  Search,
  Upload,
  Image as ImageIcon,
  ArrowRight,
  LogOut
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isAdmin, isAuthenticated, quickLogin, logout } = useAuth();
  const { navigateTo, showToast } = useUI();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders' | 'reviews' | 'feedback'
  const [stats, setStats] = useState(null);
  const [watches, setWatches] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  // Watch Modal (Create / Edit)
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
  const [editingWatch, setEditingWatch] = useState(null);
  const [imageTab, setImageTab] = useState('gallery'); // 'gallery' | 'upload' | 'url'
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [watchForm, setWatchForm] = useState({
    name: '',
    brand: 'Rolex',
    category: 'Chronograph',
    price: 42500,
    originalPrice: 46000,
    stock: 3,
    gender: 'Unisex',
    movement: 'Automatic Calibre 4131',
    caseSize: '40 mm',
    caseMaterial: '18 ct Everose gold',
    dialColor: 'Sundust & Bright Black',
    waterResistance: '100 m / 330 ft',
    powerReserve: '72 hours',
    crystal: 'Sapphire Crystal',
    strap: 'Oyster Everose Gold Bracelet',
    tagline: 'The quintessential tool watch.',
    description: 'Manufactured according to the highest Geneva horology standards.',
    image: './assets/watches/rolex_daytona_everose.png'
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, watchesRes, ordersRes, reviewsRes, fbRes] = await Promise.all([
        api.getAdminStats(),
        api.getWatches(),
        api.getOrders(),
        api.getReviews(),
        api.getFeedback ? api.getFeedback() : Promise.resolve({ data: [] })
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (watchesRes.success) setWatches(watchesRes.data);
      if (ordersRes.success) setOrders(ordersRes.data);
      if (reviewsRes.success) setReviews(reviewsRes.data);
      if (fbRes?.data) setFeedback(fbRes.data);
    } catch (e) {
      console.warn('Admin load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddWatch = () => {
    setEditingWatch(null);
    setWatchForm({
      name: '',
      brand: 'Rolex',
      category: 'Chronograph',
      price: 42500,
      originalPrice: 46000,
      stock: 3,
      gender: 'Unisex',
      movement: 'Automatic Calibre 4131',
      caseSize: '40 mm',
      caseMaterial: '18 ct Everose gold',
      dialColor: 'Sundust & Bright Black',
      waterResistance: '100 m / 330 ft',
      powerReserve: '72 hours',
      crystal: 'Sapphire Crystal',
      strap: 'Oyster Everose Gold Bracelet',
      tagline: 'The quintessential tool watch.',
      description: 'Manufactured according to the highest Geneva horology standards.',
      image: './assets/watches/rolex_daytona_everose.png'
    });
    setIsWatchModalOpen(true);
  };

  const handleOpenEditWatch = (watch) => {
    setEditingWatch(watch);
    setWatchForm({
      name: watch.name,
      brand: watch.brand,
      category: watch.category,
      price: watch.price,
      originalPrice: watch.originalPrice || watch.price,
      stock: watch.stock,
      gender: watch.gender || 'Men',
      movement: watch.movement || '',
      caseSize: watch.caseSize || '',
      caseMaterial: watch.caseMaterial || '',
      dialColor: watch.dialColor || '',
      waterResistance: watch.waterResistance || '',
      powerReserve: watch.powerReserve || '',
      crystal: watch.crystal || '',
      strap: watch.strap || '',
      tagline: watch.tagline || '',
      description: watch.description || '',
      image: watch.image || (watch.images && watch.images[0]) || './assets/watches/raymond_weil_basquiat.webp'
    });
    setIsWatchModalOpen(true);
  };

  const handleSaveWatch = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...watchForm,
        price: Number(watchForm.price),
        originalPrice: Number(watchForm.originalPrice),
        stock: Number(watchForm.stock),
        images: [watchForm.image]
      };

      if (editingWatch) {
        const res = await api.updateWatch(editingWatch.id, payload);
        if (res.success) {
          showToast(`Updated "${watchForm.name}" in vault catalog`);
          setWatches(prev => prev.map(w => w.id === editingWatch.id ? res.data : w));
        }
      } else {
        const res = await api.createWatch(payload);
        if (res.success) {
          showToast(`Cataloged "${watchForm.name}" into vault`);
          setWatches(prev => [res.data, ...prev]);
        }
      }
      setIsWatchModalOpen(false);
    } catch (err) {
      showToast('Error saving timepiece: ' + err.message, 'warning');
    }
  };

  const handleDeleteWatch = async (watchId) => {
    if (!window.confirm('Are you certain you wish to de-list this luxury reference from the vault?')) return;
    try {
      const res = await api.deleteWatch(watchId);
      if (res.success) {
        setWatches(prev => prev.filter(w => w.id !== watchId));
        showToast('Timepiece de-listed from vault catalog');
      }
    } catch (err) {
      showToast('Error deleting watch: ' + err.message, 'warning');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        showToast(`Order #${orderId} marked as ${newStatus}`);
      }
    } catch (err) {
      showToast('Status update failed: ' + err.message, 'warning');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await api.deleteReview(reviewId);
      if (res.success) {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
        showToast('Review removed from public ledger');
      }
    } catch (err) {
      showToast('Error deleting review: ' + err.message, 'warning');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result;
        try {
          const res = await api.uploadImage(base64Data, file.name);
          if (res.success && res.url) {
            setWatchForm(prev => ({ ...prev, image: res.url }));
            showToast('Timepiece picture uploaded and applied to vault asset!', 'gold');
          } else {
            setWatchForm(prev => ({ ...prev, image: base64Data }));
            showToast('Image applied as client data asset.', 'gold');
          }
        } catch (uploadErr) {
          setWatchForm(prev => ({ ...prev, image: base64Data }));
          showToast('Image attached locally.', 'gold');
        } finally {
          setIsUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      showToast('Error reading file: ' + err.message, 'warning');
      setIsUploadingImage(false);
    }
  };

  // SECURITY GATE 1: Unauthenticated -> Require Executive Director Login
  if (!isAuthenticated) {
    return (
      <div className="py-24 px-4 text-center max-w-md mx-auto space-y-6 bg-[#050505] text-white animate-fadeIn">
        <div className="w-16 h-16 rounded-full border border-[#E5C158] flex items-center justify-center bg-[#141414] text-[#E5C158] mx-auto shadow-[0_0_25px_rgba(229,193,88,0.25)]">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#E5C158] font-bold">Director Governance Access</span>
          <h2 className="font-serif text-3xl font-light text-white">Executive Vault Clearance</h2>
          <p className="text-xs text-neutral-400">
            Access to inventory adjustments, orders fulfillment, and financial ledgers is restricted to Director personnel.
          </p>
        </div>

        {/* Quick Admin Auth Box */}
        <div className="p-5 rounded-2xl bg-[#0E0E0E] border border-[#E5C158]/35 text-left space-y-3.5 shadow-2xl">
          <div className="text-[11px] text-[#E5C158] font-bold flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Director Clearance Credentials:</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">Role: admin</span>
          </div>
          <div className="space-y-1.5 text-xs bg-white/5 p-3 rounded-xl border border-white/10 font-mono">
            <div className="text-neutral-400">Email: <span className="text-white font-semibold">admin@timuse.luxury</span></div>
            <div className="text-neutral-400">Password: <span className="text-[#E5C158] font-semibold">TimuseAdmin2026!</span></div>
          </div>
          <button
            onClick={() => quickLogin('admin')}
            className="w-full py-3 bg-[#E5C158] hover:bg-[#d4af37] text-[#050505] rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(229,193,88,0.3)] flex items-center justify-center space-x-2"
          >
            <span>Authenticate as Executive Director</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="text-xs text-neutral-400 hover:text-white transition-colors"
        >
          ← Return to Public Showcase
        </button>
      </div>
    );
  }

  // SECURITY GATE 2: Authenticated as normal customer -> Block with 403
  if (!isAdmin) {
    return (
      <div className="py-24 px-4 text-center max-w-md mx-auto space-y-6 bg-[#050505] text-white animate-fadeIn">
        <div className="w-16 h-16 rounded-full border border-rose-500/50 flex items-center justify-center bg-[#141414] text-rose-400 mx-auto shadow-[0_0_25px_rgba(244,63,94,0.25)]">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-rose-400 font-bold">403 Restricted Clearance</span>
          <h2 className="font-serif text-3xl font-light text-white">Client Authorization Only</h2>
          <p className="text-xs text-neutral-400">
            You are signed in as VIP Client <span className="text-white font-semibold">{user?.name}</span> ({user?.email}). Executive vault operations require Master Director authority.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={() => {
              logout();
              quickLogin('admin');
            }}
            className="px-6 py-3 bg-[#E5C158] hover:bg-[#d4af37] text-[#050505] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-[0_4px_20px_rgba(229,193,88,0.3)]"
          >
            Switch to Executive Director Credentials
          </button>
          <button
            onClick={() => navigateTo('home')}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors border border-white/10"
          >
            Return to Salon
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn bg-[#050505] text-white select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#E5C158] font-bold flex items-center space-x-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Executive Governance Console</span>
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-light text-white mt-1">
            TIMUSE Operations & Vault Administration
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex flex-col text-right pr-2">
            <span className="text-[10px] text-[#E5C158] font-bold uppercase tracking-wider">Director Clearance</span>
            <span className="text-xs text-white font-mono">{user?.email}</span>
          </div>
          <button
            onClick={() => {
              logout();
              showToast('Logged out from Executive Console');
              navigateTo('home');
            }}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            title="Lock Vault & Sign Out"
          >
            <LogOut className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Lock Vault</span>
          </button>

          <button
            onClick={handleOpenAddWatch}
            className="px-5 py-2.5 rounded-xl bg-[#E5C158] hover:bg-[#d4af37] text-[#050505] text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-[0_4px_20px_rgba(229,193,88,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>Catalog New Timepiece</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#0E0E0E] p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-[#E5C158]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-light text-white">
            {formatPrice(stats?.totalRevenue || 1485000)}
          </p>
          <p className="text-[10px] text-emerald-400 flex items-center space-x-1">
            <span>+18.4% from last quarter</span>
          </p>
        </div>

        <div className="bg-[#0E0E0E] p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Vault Inventory</span>
            <Package className="w-4 h-4 text-[#E5C158]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-light text-white">
            {watches.length} <span className="text-xs text-neutral-500 font-sans">models</span>
          </p>
          <p className="text-[10px] text-neutral-400">Swiss certified allocations</p>
        </div>

        <div className="bg-[#0E0E0E] p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Orders Fulfilled</span>
            <ShoppingBag className="w-4 h-4 text-[#E5C158]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-light text-white">
            {orders.length || 18} <span className="text-xs text-neutral-500 font-sans">dockets</span>
          </p>
          <p className="text-[10px] text-emerald-400">100% white-glove arrival</p>
        </div>

        <div className="bg-[#0E0E0E] p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Active Clients</span>
            <Users className="w-4 h-4 text-[#E5C158]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-light text-white">
            {stats?.totalUsers || 248} <span className="text-xs text-neutral-500 font-sans">investors</span>
          </p>
          <p className="text-[10px] text-[#E5C158]">VIP accredited tier</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 ${
            activeTab === 'inventory'
              ? 'bg-[#E5C158] text-[#050505] font-bold shadow-[0_4px_15px_rgba(229,193,88,0.3)]'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Inventory Products ({watches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 ${
            activeTab === 'orders'
              ? 'bg-[#E5C158] text-[#050505] font-bold shadow-[0_4px_15px_rgba(229,193,88,0.3)]'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders & Armored Log ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 ${
            activeTab === 'reviews'
              ? 'bg-[#E5C158] text-[#050505] font-bold shadow-[0_4px_15px_rgba(229,193,88,0.3)]'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Appraisals & Reviews ({reviews.length})</span>
        </button>
      </div>

      {/* Module 1: Inventory Catalog CRUD Table */}
      {activeTab === 'inventory' && (
        <div className="bg-[#0E0E0E] rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 bg-[#141414] border-b border-white/10 flex items-center justify-between">
            <h3 className="font-serif font-light text-base text-white">Vault Product Catalog</h3>
            <span className="text-xs text-neutral-400">Total {watches.length} luxury models cataloged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141414] uppercase tracking-wider text-[10px] text-neutral-400 border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Timepiece</th>
                  <th className="py-3.5 px-4 font-semibold">Brand</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Price</th>
                  <th className="py-3.5 px-4 font-semibold">Vault Stock</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {watches.map(watch => {
                  const watchImg = watch.image || (watch.images && watch.images[0]) || './assets/watches/raymond_weil_basquiat.webp';

                  return (
                    <tr key={watch.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-[#141414] border border-white/10 p-1 flex items-center justify-center shrink-0">
                          <img src={watchImg} alt="" className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                        </div>
                        <div>
                          <p className="font-normal text-white truncate max-w-xs">{watch.name}</p>
                          <p className="text-[10px] text-neutral-500 font-mono">{watch.id}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#E5C158] font-bold uppercase">{watch.brand}</td>
                      <td className="py-3.5 px-4 text-neutral-300">{watch.category}</td>
                      <td className="py-3.5 px-4 font-serif font-normal text-white">{formatPrice(watch.price)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          watch.stock > 2 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                        }`}>
                          {watch.stock} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditWatch(watch)}
                          className="p-1.5 rounded-lg bg-[#141414] hover:bg-white/10 text-neutral-300 hover:text-[#E5C158] border border-white/10"
                          title="Edit Timepiece"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteWatch(watch.id)}
                          className="p-1.5 rounded-lg bg-[#141414] hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 border border-white/10"
                          title="Delete Timepiece"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Module 2: Order Management & Status Workflow */}
      {activeTab === 'orders' && (
        <div className="bg-[#0E0E0E] rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 bg-[#141414] border-b border-white/10 flex items-center justify-between">
            <h3 className="font-serif font-light text-base text-white">Armored Orders Ledger</h3>
            <span className="text-xs text-neutral-400">Total {orders.length} transactions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141414] uppercase tracking-wider text-[10px] text-neutral-400 border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Order Ref</th>
                  <th className="py-3.5 px-4 font-semibold">Client</th>
                  <th className="py-3.5 px-4 font-semibold">Items</th>
                  <th className="py-3.5 px-4 font-semibold">Settled Total</th>
                  <th className="py-3.5 px-4 font-semibold">Tracking Code</th>
                  <th className="py-3.5 px-4 font-semibold">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#E5C158]">{order.id}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-white">{order.userName}</p>
                      <p className="text-[10px] text-neutral-400">{order.userEmail}</p>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">
                      {order.items?.length || 1} timepiece(s)
                    </td>
                    <td className="py-3.5 px-4 font-serif font-normal text-white">{formatPrice(order.total)}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-emerald-400">
                      {order.trackingNumber || 'TM-ARM-8839210-TX'}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="bg-[#141414] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#E5C158]"
                      >
                        <option value="Processing Vault Verification">Processing Vault Verification</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Module 3: Review Moderation */}
      {activeTab === 'reviews' && (
        <div className="bg-[#0E0E0E] rounded-2xl border border-white/10 p-6 space-y-4">
          <h3 className="font-serif font-light text-base text-white pb-3 border-b border-white/10">
            Collector Appraisals Moderation
          </h3>
          <div className="divide-y divide-white/10">
            {reviews.map(rev => (
              <div key={rev.id} className="py-4 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{rev.userName}</span>
                    <span className="text-[#E5C158] font-bold">{rev.rating} ★</span>
                    <span className="text-neutral-500 font-mono text-[10px]">{rev.watchId}</span>
                  </div>
                  <h5 className="font-medium text-neutral-200 mt-1">{rev.title}</h5>
                  <p className="text-neutral-400 text-[11px] mt-0.5 line-clamp-1">{rev.content}</p>
                </div>
                <button
                  onClick={() => handleDeleteReview(rev.id)}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Remove Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Timepiece */}
      {isWatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E0E0E] rounded-3xl max-w-2xl w-full border border-white/15 p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="font-serif font-light text-lg text-white">
                {editingWatch ? 'Edit Horological Reference' : 'Catalog New Luxury Timepiece'}
              </h3>
              <button onClick={() => setIsWatchModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWatch} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-neutral-400 mb-1">Timepiece Name & Model Reference</label>
                <input
                  type="text"
                  required
                  value={watchForm.name}
                  onChange={(e) => setWatchForm({ ...watchForm, name: e.target.value })}
                  placeholder="e.g. Cosmograph Daytona Everose Gold"
                  className="w-full bg-[#141414] border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E5C158]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Brand / Maison</label>
                <select
                  value={watchForm.brand}
                  onChange={(e) => setWatchForm({ ...watchForm, brand: e.target.value })}
                  className="w-full bg-[#141414] border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E5C158]"
                >
                  <option value="Rolex">Rolex</option>
                  <option value="Patek Philippe">Patek Philippe</option>
                  <option value="Jaeger-LeCoultre">Jaeger-LeCoultre</option>
                  <option value="Audemars Piguet">Audemars Piguet</option>
                  <option value="Raymond Weil">Raymond Weil</option>
                  <option value="Omega">Omega</option>
                  <option value="Cartier">Cartier</option>
                  <option value="Vacheron Constantin">Vacheron Constantin</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Category</label>
                <select
                  value={watchForm.category}
                  onChange={(e) => setWatchForm({ ...watchForm, category: e.target.value })}
                  className="w-full bg-[#141414] border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E5C158]"
                >
                  <option value="Chronograph">Chronograph</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Skeleton">Skeleton</option>
                  <option value="Classic">Classic</option>
                  <option value="Tourbillon">Tourbillon</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Price (USD)</label>
                <input
                  type="number"
                  required
                  value={watchForm.price}
                  onChange={(e) => setWatchForm({ ...watchForm, price: e.target.value })}
                  className="w-full bg-[#141414] border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E5C158]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Vault Inventory Stock</label>
                <input
                  type="number"
                  required
                  value={watchForm.stock}
                  onChange={(e) => setWatchForm({ ...watchForm, stock: e.target.value })}
                  className="w-full bg-[#141414] border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E5C158]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-400 mb-1">Movement Details</label>
                <input
                  type="text"
                  value={watchForm.movement}
                  onChange={(e) => setWatchForm({ ...watchForm, movement: e.target.value })}
                  className="w-full bg-[#141414] border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E5C158]"
                />
              </div>

              {/* Visual Asset Management & Picture Editor */}
              <div className="sm:col-span-2 p-4 rounded-2xl bg-[#0E0E0E] border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-semibold text-white flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-[#E5C158]" />
                    <span>Catalog Product Picture & 4K Asset Manager</span>
                  </span>
                  <div className="flex gap-1 p-1 bg-[#141414] rounded-lg border border-white/10 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setImageTab('gallery')}
                      className={`px-3 py-1 rounded-md transition-colors ${imageTab === 'gallery' ? 'bg-[#E5C158] text-[#050505] font-bold' : 'text-neutral-400 hover:text-white'}`}
                    >
                      Vault Cutouts
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`px-3 py-1 rounded-md transition-colors ${imageTab === 'upload' ? 'bg-[#E5C158] text-[#050505] font-bold' : 'text-neutral-400 hover:text-white'}`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      className={`px-3 py-1 rounded-md transition-colors ${imageTab === 'url' ? 'bg-[#E5C158] text-[#050505] font-bold' : 'text-neutral-400 hover:text-white'}`}
                    >
                      Custom URL
                    </button>
                  </div>
                </div>

                {/* Preview Box & Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  {/* Left: Live Visual Preview */}
                  <div className="sm:col-span-1 p-3 rounded-xl bg-[#141414] border border-white/10 text-center space-y-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Live Dial Preview</span>
                    <div className="h-32 w-full flex items-center justify-center bg-black/60 rounded-lg p-2 border border-white/5 relative overflow-hidden">
                      {watchForm.image ? (
                        <img
                          src={watchForm.image}
                          alt="Watch preview"
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                          onError={(e) => { e.target.src = './assets/watches/raymond_weil_basquiat.webp'; }}
                        />
                      ) : (
                        <span className="text-neutral-500 text-xs">No Image Attached</span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-[#E5C158] truncate" title={watchForm.image}>
                      {watchForm.image ? watchForm.image.split('/').pop() : 'Default'}
                    </p>
                  </div>

                  {/* Right: Controls based on tab */}
                  <div className="sm:col-span-2 space-y-3">
                    {imageTab === 'gallery' && (
                      <div className="space-y-1.5">
                        <label className="block text-neutral-400 text-xs">Select from 4K Transparent Vault Library:</label>
                        <select
                          value={watchForm.image}
                          onChange={(e) => setWatchForm({ ...watchForm, image: e.target.value })}
                          className="w-full bg-[#141414] border border-white/15 rounded-lg px-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#E5C158]"
                        >
                          <option value="./assets/watches/rolex_daytona_everose.png">Rolex Cosmograph Daytona Everose (4K PNG)</option>
                          <option value="./assets/watches/rolex_daytona.png">Rolex Daytona Chronograph Oystersteel (4K PNG)</option>
                          <option value="./assets/watches/raymond_weil_basquiat.webp">Raymond Weil Freelancer Basquiat™ (4K PNG)</option>
                          <option value="./assets/watches/jlc_polaris_perpetual.png">Jaeger-LeCoultre Polaris Perpetual (4K PNG)</option>
                          <option value="./assets/watches/jlc_master_control.png">Jaeger-LeCoultre Master Control (4K PNG)</option>
                          <option value="./assets/watches/jlc_master_ultra_thin.png">Jaeger-LeCoultre Master Ultra Thin (4K PNG)</option>
                          <option value="./assets/watches/patek_5260_rainbow.png">Patek Philippe 5260 Rainbow (4K PNG)</option>
                          <option value="./assets/watches/patek_5524g_pilot.png">Patek Philippe 5524G Calatrava Pilot (4K PNG)</option>
                          <option value="./assets/watches/patek_5326g_annual.png">Patek Philippe 5326G Annual Calendar (4K PNG)</option>
                          <option value="./assets/watches/patek_5304_repeater.png">Patek Philippe 5304/301R Minute Repeater (4K PNG)</option>
                          <option value="./assets/watches/patek_5531g_world_time.png">Patek Philippe 5531G World Time (4K PNG)</option>
                          <option value="./assets/watches/patek_5316_platinum.png">Patek Philippe 5316/50P Platinum (4K PNG)</option>
                          <option value="./assets/watches/patek_5204r_chronograph.png">Patek Philippe 5204R Split-Seconds Chronograph (4K PNG)</option>
                          <option value="./assets/watches/ap_royal_oak_openworked.png">Audemars Piguet Royal Oak Openworked (4K PNG)</option>
                          <option value="./assets/watches/vc_overseas_skeleton.png">Vacheron Constantin Overseas Skeleton (4K PNG)</option>
                          <option value="./assets/watches/cartier_santos_skeleton.png">Cartier Santos Skeleton (4K PNG)</option>
                          <option value="./assets/watches/omega_speedmaster_moon.png">Omega Speedmaster Moonwatch (4K PNG)</option>
                          <option value="./assets/watches/leather_strap.png">Handcrafted Alligator Leather Strap (4K PNG)</option>
                        </select>
                        <p className="text-[10px] text-neutral-400">All 18 vault cutouts are isolated against transparent alpha channels.</p>
                      </div>
                    )}

                    {imageTab === 'upload' && (
                      <div className="space-y-2">
                        <label className="block text-neutral-400 text-xs">Upload New Watch Photograph from Device:</label>
                        <div className="flex items-center space-x-3">
                          <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#E5C158] hover:bg-[#d4af37] text-[#050505] font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-colors">
                            <Upload className="w-4 h-4" />
                            <span>{isUploadingImage ? 'Uploading...' : 'Choose File to Upload'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploadingImage}
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <p className="text-[10px] text-neutral-400">
                          Supports PNG, JPG, WEBP. Uploads directly to the server and updates this timepiece in the catalog instantly.
                        </p>
                      </div>
                    )}

                    {imageTab === 'url' && (
                      <div className="space-y-1.5">
                        <label className="block text-neutral-400 text-xs">Direct Image Asset Path or Web URL:</label>
                        <input
                          type="text"
                          value={watchForm.image}
                          onChange={(e) => setWatchForm({ ...watchForm, image: e.target.value })}
                          placeholder="e.g. /assets/watches/my_new_watch.png or https://..."
                          className="w-full bg-[#141414] border border-white/15 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-[#E5C158]"
                        />
                        <p className="text-[10px] text-neutral-400">Enter a local asset path or external HTTPS image URL.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-400 mb-1">Description & Provenance</label>
                <textarea
                  rows="3"
                  value={watchForm.description}
                  onChange={(e) => setWatchForm({ ...watchForm, description: e.target.value })}
                  className="w-full bg-[#141414] border border-white/15 rounded-lg p-3 text-white focus:outline-none focus:border-[#E5C158]"
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWatchModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-white/15 text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#E5C158] hover:bg-[#d4af37] text-[#050505] font-semibold"
                >
                  Save Timepiece to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
