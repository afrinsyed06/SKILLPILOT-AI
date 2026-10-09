import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Sparkles,
  Star,
  Bot,
  ShieldCheck,
  Zap,
  ArrowRight,
  Heart,
} from 'lucide-react';

export default function AppFooter({ onOpenFeedback }) {
  const [hoverStar, setHoverStar] = useState(0);

  return (
    <footer className="mt-12 border-t border-blue-100/80 bg-white/70 backdrop-blur-md">
      {/* ── 1. Interactive Feedback Bar Below App ── */}
      <div
        className="max-w-7xl mx-auto px-4 md:px-6 py-6"
      >
        <div
          className="p-5 md:p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 shadow-xs"
          style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.07) 0%, rgba(59, 130, 246, 0.04) 50%, #ffffff 100%)',
            border: '1px solid rgba(37, 99, 235, 0.20)',
          }}
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md shadow-blue-500/20 shrink-0">
              💬
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h4 className="text-sm md:text-base font-black text-slate-900">
                  Help Us Improve Your AI Placement Experience
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200">
                  +25 XP Reward
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                Found a question to improve, want new Generative AI features, or have feedback on our chatbot? We read every suggestion!
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {/* Quick 1-Click Star Rating in Footer */}
            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-2xl border border-blue-100 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">Rate:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverStar(star)}
                  onMouseLeave={() => setHoverStar(0)}
                  onClick={() => onOpenFeedback(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-125 active:scale-95"
                  title={`Rate ${star} Stars`}
                >
                  <Star
                    size={18}
                    className={
                      star <= (hoverStar || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }
                  />
                </button>
              ))}
            </div>

            {/* Direct Feedback Button */}
            <button
              type="button"
              onClick={() => onOpenFeedback()}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs cursor-pointer shadow-md shadow-blue-500/20 active:scale-95 transition-all whitespace-nowrap"
            >
              <MessageSquare size={14} />
              <span>GIVE FEEDBACK</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Standard Footer Links & Status ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 border-t border-slate-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900 tracking-tight text-sm">
              SKILL<span className="text-blue-600">PILOT</span> AI
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Generative AI Operational
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 font-semibold text-[11px]">
            <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <Link to="/arena" className="hover:text-blue-600 transition-colors">Question Arena</Link>
            <Link to="/mentor" className="hover:text-blue-600 transition-colors">Generative AI Mentor</Link>
            <Link to="/interview" className="hover:text-blue-600 transition-colors">Mock Interview</Link>
            <Link to="/leaderboard" className="hover:text-blue-600 transition-colors">Leaderboard</Link>
            <button
              type="button"
              onClick={() => onOpenFeedback()}
              className="text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Submit Feedback
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Powered by Generative AI • All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
