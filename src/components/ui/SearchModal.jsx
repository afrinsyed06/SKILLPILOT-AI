import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Command } from 'lucide-react';

const searchItems = [
  { label: 'AI Dashboard', desc: 'Career command center & daily missions', path: '/', icon: '🏠', tags: ['dashboard', 'home', 'missions', 'streak'] },
  { label: 'My Career Profile', desc: 'Skills, projects, academics & certifications', path: '/profile', icon: '👤', tags: ['profile', 'skills', 'projects', 'education'] },
  { label: 'Resume AI', desc: 'ATS score, keyword optimizer & role match', path: '/resume', icon: '📄', tags: ['resume', 'ats', 'keywords', 'cv'] },
  { label: 'Skill Gap Analyzer', desc: 'Current vs required skills for your target role', path: '/skill-gap', icon: '🧠', tags: ['skills', 'gap', 'analysis', 'radar'] },
  { label: 'Career Discovery', desc: 'AI-matched career paths & role recommendations', path: '/career', icon: '🎯', tags: ['career', 'paths', 'roles', 'match'] },
  { label: 'AI Roadmap', desc: '90-day personalized placement mission plan', path: '/roadmap', icon: '🗺️', tags: ['roadmap', 'plan', '90 days', 'phases'] },
  { label: 'Coding Intelligence', desc: 'DSA performance, heatmap & topic analysis', path: '/coding', icon: '💻', tags: ['coding', 'dsa', 'leetcode', 'problems', 'heatmap'] },
  { label: 'Interview Arena', desc: 'AI mock interviews with feedback & scoring', path: '/interview', icon: '🎤', tags: ['interview', 'mock', 'practice', 'hr', 'technical'] },
  { label: 'Performance Analytics', desc: 'Charts & trends tracking your progress', path: '/analytics', icon: '📊', tags: ['analytics', 'charts', 'progress', 'trends'] },
  { label: 'Smart Job Matching', desc: 'AI-curated job opportunities by compatibility', path: '/jobs', icon: '💼', tags: ['jobs', 'hiring', 'companies', 'apply', 'opportunities'] },
  { label: 'Achievements & XP', desc: 'Badges, levels, streaks & gamification', path: '/achievements', icon: '🏆', tags: ['achievements', 'xp', 'badges', 'streak', 'level'] },
  { label: 'AI Career Mentor', desc: 'Chat with your personal AI career advisor', path: '/mentor', icon: '🤖', tags: ['mentor', 'chat', 'ai', 'advice', 'guidance'] },
  { label: 'My Account', desc: 'Edit profile, settings & preferences', path: '/account', icon: '⚙️', tags: ['account', 'settings', 'edit', 'preferences'] },
];

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const filtered = query.trim()
    ? searchItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.desc.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : searchItems;

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setHighlighted(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setHighlighted(0);
  }, [query]);

  const handleSelect = (path) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && filtered[highlighted]) {
      handleSelect(filtered[highlighted].path);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          style={{ background: 'rgba(2,8,23,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl overflow-hidden"
            style={{ background: '#0d1829', border: '1px solid rgba(59,130,246,0.25)', boxShadow: '0 0 60px rgba(59,130,246,0.15), 0 25px 50px rgba(0,0,0,0.5)' }}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
              <Search size={18} className="text-blue-400 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search pages, features, modules..."
                className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-base"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-slate-500 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              )}
              <kbd className="hidden sm:flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-slate-500"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  <Search size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No results for "<span className="text-slate-400">{query}</span>"</p>
                </div>
              ) : (
                <>
                  {!query && (
                    <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">All Modules</div>
                  )}
                  {filtered.map((item, i) => (
                    <div
                      key={item.path}
                      onClick={() => handleSelect(item.path)}
                      onMouseEnter={() => setHighlighted(i)}
                      className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-all duration-150 ${
                        highlighted === i ? 'bg-blue-500/12' : 'hover:bg-white/3'
                      }`}
                      style={{ borderLeft: highlighted === i ? '2px solid #3b82f6' : '2px solid transparent' }}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all ${
                        highlighted === i ? 'bg-blue-500/20' : 'bg-white/5'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold ${highlighted === i ? 'text-white' : 'text-slate-300'}`}>
                          {item.label}
                        </div>
                        <div className="text-xs text-slate-500 truncate">{item.desc}</div>
                      </div>
                      {highlighted === i && (
                        <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}>
                          <ArrowRight size={16} className="text-blue-400" />
                        </motion.div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/5 flex items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/5 text-slate-500">↑↓</kbd> Navigate</span>
              <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/5 text-slate-500">↵</kbd> Open</span>
              <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/5 text-slate-500">Esc</kbd> Close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
