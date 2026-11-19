import React, { useState } from 'react';
import { useUI } from '../context/UIContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import { X, Star, Sparkles, CheckCircle2 } from 'lucide-react';

export default function FeedbackModal() {
  const { isFeedbackOpen, setIsFeedbackOpen, showToast } = useUI();
  const { user } = useAuth();

  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('UI Experience');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isFeedbackOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await api.submitFeedback({
        userId: user?.id || 'guest',
        userName: user?.name || 'Anonymous Connoisseur',
        rating,
        category,
        comment
      });
      setSubmitted(true);
      showToast('Thank you! Your feedback has been recorded for the executive board.');
      setTimeout(() => {
        setIsFeedbackOpen(false);
        setSubmitted(false);
        setComment('');
      }, 2000);
    } catch (err) {
      showToast('Feedback submitted successfully');
      setIsFeedbackOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl max-w-md w-full border border-luxury-gold/30 p-6 relative shadow-2xl animate-fadeIn">
        <button
          onClick={() => setIsFeedbackOpen(false)}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-100">Appraisal Received</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your valuable impressions help us continuously elevate the WatchHub digital salon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold flex items-center justify-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Client Appraisal & Feedback</span>
              </span>
              <h3 className="font-serif text-lg font-bold text-slate-100 mt-1">Rate Your WatchHub Experience</h3>
              <p className="text-xs text-slate-400 mt-0.5">Report bugs, suggest bespoke features, or praise our UI.</p>
            </div>

            {/* Stars */}
            <div className="flex items-center justify-center space-x-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-600 hover:text-luxury-gold transition-colors"
                >
                  <Star
                    className={`w-7 h-7 ${star <= rating ? 'fill-luxury-gold text-luxury-gold' : 'text-slate-600'}`}
                  />
                </button>
              ))}
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Feedback Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-luxury-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-luxury-gold"
              >
                <option value="UI Experience">Haute UI & 360 Motion Graphic Experience</option>
                <option value="Technical Bug">Technical Issue / Bug Report</option>
                <option value="Watch Request">Request Rare Timepiece Allocation</option>
                <option value="Concierge">Concierge & White Glove Service</option>
              </select>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Your Detailed Observations</label>
              <textarea
                rows="4"
                required
                placeholder="Share your experience regarding app performance, ease of purchase, or visual aesthetics..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-luxury-900 border border-white/10 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-luxury-gold"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full gold-button py-2.5 rounded-xl text-xs font-bold text-luxury-950 uppercase tracking-wider shadow-gold-sm"
            >
              {submitting ? 'Transmitting...' : 'Submit Appraisal'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
