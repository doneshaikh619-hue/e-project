import React, { useState, useEffect } from 'react';
import Interactive3DWatch from '../components/Interactive3DWatch.jsx';
import WatchCard from '../components/WatchCard.jsx';
import { useUI } from '../context/UIContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import { formatPrice, formatDate } from '../utils/formatters.js';
import {
  ShieldCheck,
  Star,
  Heart,
  ShoppingBag,
  RotateCw,
  Truck,
  Award,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  ArrowLeft,
  Lock,
  Layers
} from 'lucide-react';

export default function ProductDetailPage() {
  const { selectedWatchId, navigateTo, showToast } = useUI();
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  const [watch, setWatch] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedWatches, setRelatedWatches] = useState([]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | '360'
  const [reviewFilter, setReviewFilter] = useState('all');

  // New review form modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newUserName, setNewUserName] = useState(user?.name || '');

  useEffect(() => {
    loadWatchData();
  }, [selectedWatchId]);

  const loadWatchData = async () => {
    const idToFetch = selectedWatchId || 'wh-001';
    const res = await api.getWatchById(idToFetch);
    if (res.success && res.data) {
      setWatch(res.data);
      setReviews(res.data.reviews || []);

      // Fetch related watches in same brand or category
      api.getWatches({ category: res.data.category }).then(catRes => {
        if (catRes.success && catRes.data) {
          setRelatedWatches(catRes.data.filter(w => w.id !== res.data.id).slice(0, 4));
        }
      });
    }
  };

  if (!watch) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-2 border-[#E5C158] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-neutral-400">Opening Vault Dossier...</p>
      </div>
    );
  }

  const images = watch.images?.length ? watch.images : [watch.image || './assets/watches/raymond_weil_basquiat.png'];
  const isFavorited = isInWishlist(watch.id);

  const handleAddToCart = () => {
    if (watch.stock <= 0) {
      showToast('This reference is fully allocated.', 'warning');
      return;
    }
    addToCart(watch, quantity);
    showToast(`${watch.name} (${quantity}) added to acquisition portfolio.`);
    setIsCartOpen(true);
  };

  const handleVoteReview = async (reviewId) => {
    const res = await api.voteReview(reviewId, 1);
    if (res.success && res.data) {
      setReviews(prev => prev.map(r => r.id === reviewId ? res.data : r));
      showToast('Review marked as helpful');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const res = await api.addReview({
      watchId: watch.id,
      rating: newRating,
      title: newTitle,
      content: newContent,
      userName: newUserName || 'Distinguished Collector',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      verifiedBuyer: true
    });

    if (res.success && res.data) {
      setReviews(prev => [res.data, ...prev]);
      setIsReviewModalOpen(false);
      setNewTitle('');
      setNewContent('');
      showToast('Your appraisal has been published to the horology ledger.');
    }
  };

  const filteredReviews = reviewFilter === 'all'
    ? reviews
    : reviews.filter(r => r.rating === Number(reviewFilter));

  return (
    <div className="py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-12 animate-fadeIn">
      {/* Breadcrumb / Back Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <button
          onClick={() => navigateTo('catalog')}
          className="flex items-center space-x-1.5 hover:text-luxury-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Master Catalog</span>
        </button>
        <div className="flex items-center space-x-2">
          <span className="text-luxury-gold uppercase font-semibold">{watch.brand}</span>
          <span>/</span>
          <span className="text-slate-300 font-medium truncate max-w-[200px]">{watch.name}</span>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Visual Showcase (Gallery vs 360 Studio) */}
        <div className="lg:col-span-7 space-y-6">
          {/* View Mode Tabs */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                activeTab === 'gallery'
                  ? 'bg-luxury-gold text-luxury-950 font-bold shadow-gold-sm'
                  : 'bg-white/5 text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dossier Gallery</span>
            </button>
            <button
              onClick={() => setActiveTab('360')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                activeTab === '360'
                  ? 'bg-luxury-gold text-luxury-950 font-bold shadow-gold-sm'
                  : 'bg-white/5 text-slate-300 hover:text-white'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>360° Studio Simulation</span>
            </button>
          </div>

          {activeTab === 'gallery' ? (
            <div className="glass-card rounded-3xl p-8 border border-luxury-gold/20 flex flex-col items-center justify-between relative overflow-hidden">
              {/* Primary Zoom Display */}
              <div className="relative py-8 flex items-center justify-center">
                <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-luxury-gold/10 blur-3xl absolute -z-10" />
                <img
                  src={images[activeImageIdx] || images[0]}
                  alt={watch.name}
                  className="w-64 h-64 sm:w-88 sm:h-88 object-contain shadow-[0_25px_60px_rgba(0,0,0,0.95)] hover:scale-105 transition-transform duration-500 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                />
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex items-center space-x-4 pt-6 border-t border-white/10 w-full justify-center">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 p-1 bg-[#141414] transition-all ${
                        activeImageIdx === idx ? 'border-[#E5C158]' : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Interactive3DWatch watch={watch} />
          )}

          {/* Guarantee Badges Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="glass-card p-4 rounded-xl flex items-center space-x-3 border border-white/5">
              <ShieldCheck className="w-5 h-5 text-luxury-gold shrink-0" />
              <div className="text-[11px]">
                <p className="font-bold text-slate-200">Geneva Certified</p>
                <p className="text-slate-400">100% genuine factory provenance</p>
              </div>
            </div>
            <div className="glass-card p-4 rounded-xl flex items-center space-x-3 border border-white/5">
              <Truck className="w-5 h-5 text-luxury-gold shrink-0" />
              <div className="text-[11px]">
                <p className="font-bold text-slate-200">Armored Delivery</p>
                <p className="text-slate-400">Fully insured personal handoff</p>
              </div>
            </div>
            <div className="glass-card p-4 rounded-xl flex items-center space-x-3 border border-white/5">
              <Award className="w-5 h-5 text-luxury-gold shrink-0" />
              <div className="text-[11px]">
                <p className="font-bold text-slate-200">5-Year Warranty</p>
                <p className="text-slate-400">Complete mechanical servicing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Specs & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-luxury-gold font-bold">
              <span>{watch.brand} — {watch.category}</span>
              <span className="text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Vault Serialized</span>
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
              {watch.name}
            </h1>

            <p className="text-xs text-slate-300 italic">
              "{watch.tagline}"
            </p>

            {/* Ratings Bar */}
            <div className="flex items-center space-x-3 pt-2 text-xs">
              <div className="flex items-center text-luxury-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="ml-2 font-bold text-slate-100">{watch.rating}</span>
              </div>
              <span className="text-slate-500">•</span>
              <a href="#reviews" className="text-slate-400 hover:text-luxury-gold underline">
                {reviews.length} Client Appraisals
              </a>
            </div>
          </div>

          {/* Pricing & Stock Card */}
          <div className="glass-card p-6 rounded-2xl border border-luxury-gold/30 space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase text-slate-400 block tracking-wider">Acquisition Value</span>
                <span className="font-serif text-3xl font-extrabold text-luxury-gold">
                  {formatPrice(watch.price)}
                </span>
                {watch.originalPrice && watch.originalPrice > watch.price && (
                  <span className="ml-3 text-sm text-slate-500 line-through">
                    {formatPrice(watch.originalPrice)}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  watch.stock > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {watch.stock > 0 ? `${watch.stock} in Geneva Vault` : 'Allocated'}
                </span>
              </div>
            </div>

            {/* Quantity & Buy Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-slate-400 hover:text-white px-2 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="mx-3 font-semibold text-slate-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(watch.stock || 10, quantity + 1))}
                    className="text-slate-400 hover:text-white px-2 font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-grow gold-button py-3 px-6 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-gold-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Acquire Timepiece</span>
                </button>

                <button
                  onClick={async () => {
                    const added = await toggleWishlist(watch);
                    showToast(added ? 'Saved to private wishlist' : 'Removed from wishlist');
                  }}
                  className={`p-3 rounded-xl border transition-all ${
                    isFavorited ? 'border-rose-500 text-rose-500 bg-rose-500/10' : 'border-white/20 text-slate-300 hover:text-white'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-luxury-gold" />
                  <span>Encrypted Bank Wire & Crypto Escrow</span>
                </span>
                <span>Tax-Free Diplomatic Export</span>
              </div>
            </div>
          </div>

          {/* Overview Description */}
          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
            <h3 className="font-serif font-bold text-sm text-slate-100 uppercase tracking-wider">
              Horological Heritage
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {watch.description}
            </p>
          </div>

          {/* Technical Specifications Table */}
          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="font-serif font-bold text-sm text-slate-100 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-luxury-gold" />
              <span>Technical Dossier Specifications</span>
            </h3>

            <div className="divide-y divide-white/5 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Calibre Movement</span>
                <span className="text-slate-200 font-semibold text-right max-w-xs">{watch.movement}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Case Dimension</span>
                <span className="text-slate-200 font-semibold">{watch.caseSize}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Case Material</span>
                <span className="text-slate-200 font-semibold text-right max-w-xs">{watch.caseMaterial}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Dial Aesthetics</span>
                <span className="text-slate-200 font-semibold text-right max-w-xs">{watch.dialColor}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Power Reserve</span>
                <span className="text-slate-200 font-semibold">{watch.powerReserve}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Crystal Glass</span>
                <span className="text-slate-200 font-semibold text-right max-w-xs">{watch.crystal}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Water Resistance</span>
                <span className="text-emerald-400 font-semibold">{watch.waterResistance}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Strap / Bracelet</span>
                <span className="text-slate-200 font-semibold text-right max-w-xs">{watch.strap}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section id="reviews" className="py-12 border-t border-white/10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-luxury-gold font-bold">Client Provenance</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
              Collector Appraisals & Reviews
            </h2>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="gold-button px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Submit Collector Appraisal</span>
          </button>
        </div>

        {/* Rating Breakdown & Filter */}
        <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <span className="font-serif text-4xl font-extrabold text-luxury-gold block">{watch.rating}</span>
              <div className="flex items-center text-luxury-gold justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Based on {reviews.length} reviews</span>
            </div>
            <div className="h-12 w-[1px] bg-white/10 hidden sm:block" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Verified Swiss Purchases</span>
              </p>
              <p className="text-slate-400 text-[11px]">All appraisals authenticated by our Geneva desk.</p>
            </div>
          </div>

          {/* Filter Reviews */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Filter by stars:</span>
            {['all', '5', '4', '3'].map(star => (
              <button
                key={star}
                onClick={() => setReviewFilter(star)}
                className={`px-3 py-1 rounded-lg text-xs transition-all ${
                  reviewFilter === star
                    ? 'bg-luxury-gold text-luxury-950 font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {star === 'all' ? 'All' : `${star} ★`}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No reviews match this star rating. Be the first to submit an appraisal!
            </div>
          ) : (
            filteredReviews.map(rev => (
              <div key={rev.id} className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={rev.userAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                      alt={rev.userName}
                      className="w-10 h-10 rounded-full object-cover border border-luxury-gold/30"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
                        <span>{rev.userName}</span>
                        {rev.verifiedBuyer && (
                          <span className="text-[10px] text-emerald-400 font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            Verified Buyer
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <div className="flex items-center text-luxury-gold">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-500">{formatDate(rev.date)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleVoteReview(rev.id)}
                    className="flex items-center space-x-1 text-slate-400 hover:text-luxury-gold text-xs transition-colors p-1"
                    title="Mark as Helpful"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({rev.helpfulCount || 0})</span>
                  </button>
                </div>

                <h5 className="font-semibold text-xs text-slate-200">{rev.title}</h5>
                <p className="text-xs text-slate-300 leading-relaxed">{rev.content}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Timepieces Carousel */}
      {relatedWatches.length > 0 && (
        <section className="py-12 border-t border-white/10 space-y-6">
          <div className="text-center sm:text-left">
            <span className="text-xs uppercase tracking-widest text-luxury-gold font-bold">Complementary Allocations</span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-100 mt-1">
              Timepieces of Similar Prestige
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedWatches.map(w => (
              <WatchCard key={w.id} watch={w} />
            ))}
          </div>
        </section>
      )}

      {/* Review Submission Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl max-w-lg w-full border border-luxury-gold/30 p-6 space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Haute Appraisal</span>
              <h3 className="font-serif text-lg font-bold text-slate-100 mt-1">Submit Your Review for {watch.name}</h3>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Your Full Name / Collector Pseudonym</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Lord Arthur Pendelton"
                  className="w-full bg-luxury-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 text-slate-600 hover:text-luxury-gold"
                    >
                      <Star className={`w-6 h-6 ${star <= newRating ? 'fill-luxury-gold text-luxury-gold' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Appraisal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Superlative chronograph with unmatched wrist presence"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-luxury-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Detailed Observations</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe the timekeeping accuracy, bezel finish, bracelet comfort, or armored delivery experience..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-luxury-900 border border-white/10 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 gold-button py-2.5 rounded-xl font-bold text-luxury-950 uppercase tracking-wider"
                >
                  Publish Appraisal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
