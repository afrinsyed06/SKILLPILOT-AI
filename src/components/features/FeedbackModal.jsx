import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Send,
  Heart,
  Bot,
  Gamepad2,
  FileText,
  Mic,
  Bug,
  Lightbulb,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { saveUserFeedback } from '../../services/db';

const CATEGORIES = [
  { id: 'ai_chatbot', label: '🤖 Generative AI Chatbot', icon: Bot },
  { id: 'arena', label: '🎮 Question Arena', icon: Gamepad2 },
  { id: 'interview', label: '🎤 Mock Interview', icon: Mic },
  { id: 'resume', label: '📄 Resume AI', icon: FileText },
  { id: 'feature', label: '💡 Feature Request', icon: Lightbulb },
  { id: 'bug', label: '🐛 Bug Report', icon: Bug },
  { id: 'general', label: '💬 General Experience', icon: MessageSquare },
];

const RATING_LABELS = {
  1: { emoji: '😠', label: 'Needs Improvement' },
  2: { emoji: '🙁', label: 'Fair' },
  3: { emoji: '😊', label: 'Good' },
  4: { emoji: '😃', label: 'Very Good' },
  5: { emoji: '🚀', label: 'Outstanding!' },
};

export default function FeedbackModal({ isOpen, onClose, initialCategory = 'general' }) {
  const { user, profile } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [comments, setComments] = useState('');
  const [contactable, setContactable] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const currentDisplayRating = hoverRating || rating;
  const ratingInfo = RATING_LABELS[currentDisplayRating] || RATING_LABELS[5];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comments.trim()) return;

    setLoading(true);
    setTimeout(() => {
      saveUserFeedback({
        userId: user?.id || '1001',
        userName: profile?.fullName || user?.name || 'Afrin S',
        userEmail: user?.email || 'afrin@example.com',
        rating,
        category: selectedCategory,
        comments,
        pageUrl: window.location.pathname,
      });

      setLoading(false);
      setSubmitted(true);

      setTimeout(() => {
        // Reset after auto close
        setSubmitted(false);
        setComments('');
        onClose();
      }, 2500);
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden"
          style={{
            boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.25)',
          }}
        >
          {/* Header Banner */}
          <div
            className="p-6 relative text-white"
            style={{
              background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner">
                  💬
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">Your Feedback Matters</h3>
                  <p className="text-xs text-blue-100 font-medium">
                    Help us improve SkillPilot AI for your placement success
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {submitted ? (
            /* Submitted Success State */
            <div className="p-10 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                type="spring"
                className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 size={36} />
              </motion.div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900">Thank You for Your Feedback! 🎉</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your feedback helps us train better AI models and craft a world-class placement mentor for you!
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200">
                <Sparkles size={13} />
                <span>+25 Community XP Awarded!</span>
              </div>
            </div>
          ) : (
            /* Interactive Feedback Form */
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Rating Section */}
              <div className="text-center space-y-2 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/80">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  How would you rate your experience?
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform active:scale-90 cursor-pointer"
                    >
                      <Star
                        size={28}
                        className={`transition-colors ${
                          star <= currentDisplayRating
                            ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-xs font-bold text-blue-700 flex items-center justify-center gap-1.5">
                  <span className="text-sm">{ratingInfo.emoji}</span>
                  <span>{ratingInfo.label}</span>
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  What is this feedback related to?
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        selectedCategory === cat.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Textarea */}
              <div className="space-y-2">
                <label htmlFor="feedback-comment" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                  <span>Your Comments & Suggestions</span>
                  <span className="text-[10px] text-slate-400 font-normal">Required</span>
                </label>
                <textarea
                  id="feedback-comment"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Tell us what you loved, what questions were confusing, or how the Generative AI chatbot can assist you better..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden text-sm text-slate-900 placeholder:text-slate-400 resize-none transition-all"
                />
              </div>

              {/* Contact checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="contactable"
                  checked={contactable}
                  onChange={(e) => setContactable(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="contactable" className="text-xs text-slate-600 cursor-pointer select-none">
                  Okay to follow up with me at <span className="font-bold text-slate-800">{user?.email || 'my registered email'}</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !comments.trim()}
                  className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black cursor-pointer shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>SUBMIT FEEDBACK</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
