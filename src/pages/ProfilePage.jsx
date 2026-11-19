import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { api } from '../utils/api.js';
import { formatPrice, formatDate } from '../utils/formatters.js';
import {
  User,
  Package,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Edit2,
  Save,
  LogOut,
  X,
  Truck
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { navigateTo, showToast } = useUI();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'addresses'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  useEffect(() => {
    if (user?.id) {
      api.getOrders(user.id).then(res => {
        if (res.success && res.data) {
          setOrders(res.data);
        }
        setLoadingOrders(false);
      });
    } else {
      // Demo orders for guest
      api.getOrders().then(res => {
        if (res.success && res.data) {
          setOrders(res.data);
        }
        setLoadingOrders(false);
      });
    }
  }, [user]);

  if (!isAuthenticated && !user) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full border border-luxury-gold/30 flex items-center justify-center bg-luxury-900 text-luxury-gold mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-xl font-bold text-slate-100">Client Access Required</h2>
        <p className="text-xs text-slate-400">Please sign in to access your private vault profile and order tracking.</p>
        <button onClick={() => navigateTo('auth')} className="gold-button px-6 py-2.5 rounded-xl text-xs font-bold">
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile(editForm);
    setIsEditingProfile(false);
    showToast('Vault client profile updated.');
  };

  return (
    <div className="py-10 px-4 sm:px-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Profile Summary Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-luxury-gold/25 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center space-x-5">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"}
            alt={user?.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-luxury-gold shadow-gold-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">{user?.name}</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-luxury-gold text-luxury-950">
                {user?.role || 'VIP Client'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            <p className="text-xs text-luxury-gold mt-1 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Geneva Tier I Private Horology Account</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="gold-button-outline px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={() => { logout(); navigateTo('home'); }}
            className="p-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center space-x-3 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 ${
            activeTab === 'orders' ? 'bg-luxury-gold text-luxury-950 shadow-gold-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Acquisitions & Orders ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 ${
            activeTab === 'profile' ? 'bg-luxury-gold text-luxury-950 shadow-gold-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Client Credentials</span>
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 ${
            activeTab === 'addresses' ? 'bg-luxury-gold text-luxury-950 shadow-gold-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Shipping Addresses</span>
        </button>
      </div>

      {/* Tab 1: Orders & Order Tracking */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {loadingOrders ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading vault history...</div>
          ) : orders.length === 0 ? (
            <div className="glass-card p-12 rounded-2xl text-center space-y-3">
              <Package className="w-8 h-8 text-luxury-gold mx-auto" />
              <h3 className="font-serif text-lg font-bold text-slate-100">No Acquisition History</h3>
              <p className="text-xs text-slate-400">Your registered acquisitions will appear here.</p>
              <button onClick={() => navigateTo('catalog')} className="gold-button px-6 py-2 rounded-xl text-xs font-bold">
                Explore Catalog
              </button>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10 text-xs">
                  <div>
                    <span className="font-mono font-bold text-luxury-gold text-sm">{order.id}</span>
                    <span className="text-slate-400 ml-3">Placed on {formatDate(order.date)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30'
                    }`}>
                      {order.status}
                    </span>
                    <button
                      onClick={() => setTrackingModalOrder(order)}
                      className="gold-button-outline px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Live Tracking</span>
                    </button>
                  </div>
                </div>

                {/* Items in order */}
                <div className="divide-y divide-white/5">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-4">
                        <img src={item.image || '/assets/watches/raymond_weil_basquiat.png'} alt="" className="w-12 h-12 object-contain rounded-xl border border-white/10 bg-[#141414] p-1" />
                        <div>
                          <span className="text-[10px] font-bold text-luxury-gold uppercase">{item.brand}</span>
                          <h4 className="font-semibold text-slate-200">{item.name}</h4>
                          <span className="text-slate-400">Quantity: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-slate-100">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
                  <div className="flex items-center space-x-2 font-mono text-[11px]">
                    <span className="text-slate-500">Tracking:</span>
                    <span className="text-emerald-400 font-semibold">{order.trackingNumber}</span>
                    <span className="text-slate-600">•</span>
                    <span>{order.carrier}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 mr-2">Total Settled:</span>
                    <span className="font-serif text-base font-bold text-luxury-gold">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Profile Form */}
      {activeTab === 'profile' && (
        <div className="glass-card p-8 rounded-3xl border border-white/10 max-w-xl">
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-slate-100 pb-2 border-b border-white/10">
              Personal Information
            </h3>

            <div>
              <label className="block text-slate-400 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full bg-luxury-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-luxury-gold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Primary Email (Account ID)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Direct Telephone / Mobile</label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full bg-luxury-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-luxury-gold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Primary Estate / Address</label>
              <textarea
                rows="3"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="w-full bg-luxury-900 border border-white/10 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-luxury-gold"
              />
            </div>

            <button type="submit" className="gold-button px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Shipping Addresses */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-luxury-gold/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-luxury-gold">Primary Armored Destination</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">Default</span>
            </div>
            <h4 className="font-semibold text-sm text-slate-100">{user?.name}</h4>
            <p className="text-xs text-slate-400">{user?.address || '42 Rue du Rhône, 1204 Geneva, Switzerland'}</p>
            <p className="text-xs text-slate-400">Phone: {user?.phone || '+41 22 819 12 00'}</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center space-y-2 py-10 cursor-pointer hover:border-luxury-gold/50 transition-colors">
            <MapPin className="w-6 h-6 text-luxury-gold" />
            <h4 className="font-serif font-semibold text-xs text-slate-200">Register Secondary Estate Address</h4>
            <p className="text-[11px] text-slate-400">Add an additional verified destination in London, New York or Dubai.</p>
          </div>
        </div>
      )}

      {/* Live Order Tracking Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-lg w-full border border-luxury-gold/40 p-6 sm:p-8 space-y-6 relative animate-fadeIn">
            <button
              onClick={() => setTrackingModalOrder(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-luxury-gold">Live Courier Radar</span>
              <h3 className="font-serif text-xl font-bold text-slate-100 mt-1">
                Dispatch Dossier: {trackingModalOrder.id}
              </h3>
              <p className="text-xs text-emerald-400 font-mono mt-0.5">
                Tracking Ref: {trackingModalOrder.trackingNumber}
              </p>
            </div>

            {/* Tracking Progress Steps */}
            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-luxury-950 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-100">Geneva Vault Verification Passed</h5>
                  <p className="text-slate-400 text-[11px]">Amplitude: 295° • Beat error: 0.1ms • Water resistance 100% verified</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-luxury-gold text-luxury-950 flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-100">{trackingModalOrder.carrier}</h5>
                  <p className="text-slate-400 text-[11px]">Biometric flight container en route to client coordinates.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 opacity-60">
                <div className="w-6 h-6 rounded-full bg-neutral-800 text-slate-400 flex items-center justify-center shrink-0 border border-white/10">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-300">White-Glove Physical Handover</h5>
                  <p className="text-slate-400 text-[11px]">Scheduled arrival within 24-48 business hours.</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-400">
              <p className="font-semibold text-slate-200">Delivery Address:</p>
              <p>{trackingModalOrder.shippingAddress?.fullName}, {trackingModalOrder.shippingAddress?.address}, {trackingModalOrder.shippingAddress?.city}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
