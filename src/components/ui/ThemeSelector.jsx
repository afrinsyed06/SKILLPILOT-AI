import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeSelector({ variant = 'dropdown', className = '' }) {
  const { theme, setTheme, themes, currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (variant !== 'dropdown') return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [variant]);

  // If used inline (e.g., inside Account Preferences)
  if (variant === 'inline') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Palette size={16} style={{ color: currentTheme.primaryColor }} />
            <span className="text-sm font-semibold text-white">Visual Themes</span>
          </div>
          <span className="text-xs text-slate-400">
            Active: <strong style={{ color: currentTheme.primaryColor }}>{currentTheme.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {themes.map((t) => {
            const isSelected = t.id === theme;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`relative text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between group ${
                  isSelected
                    ? 'border-white/40 ring-2 shadow-lg'
                    : 'border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06]'
                }`}
                style={{
                  background: isSelected ? 'var(--bg-card-hover, rgba(255,255,255,0.08))' : undefined,
                  boxShadow: isSelected ? `0 0 20px ${t.primaryColor}30` : undefined,
                  ringColor: isSelected ? t.primaryColor : undefined,
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{t.icon}</span>
                      <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {t.name}
                      </span>
                    </div>
                    {isSelected ? (
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                        style={{ background: t.accentGradient }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/10 text-slate-400">
                        {t.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {t.description}
                  </p>
                </div>

                {/* Color Swatches */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <div className="flex items-center -space-x-1">
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: t.primaryColor }}
                      title="Primary accent"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: t.secondaryColor }}
                      title="Secondary accent"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: t.bgPreview }}
                      title="Canvas background"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {t.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Dropdown variant for Topbar
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        id="theme-switcher-btn"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 active:scale-95"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
        }}
        title={`Change Theme (Current: ${currentTheme.name})`}
      >
        <span
          className="w-2.5 h-2.5 rounded-full animate-pulse flex-shrink-0"
          style={{ background: currentTheme.accentGradient }}
        />
        <Palette size={15} style={{ color: currentTheme.primaryColor }} />
        <span className="text-xs font-medium hidden md:inline-block max-w-[90px] truncate">
          {currentTheme.name}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl border border-white/15 p-3 z-50 shadow-2xl backdrop-blur-2xl"
            style={{
              background: 'var(--bg-secondary, rgba(13, 10, 31, 0.96))',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.85), 0 0 25px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles size={15} style={{ color: currentTheme.primaryColor }} />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Theme Palette
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {themes.length} styles
              </span>
            </div>

            {/* List */}
            <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
              {themes.map((t) => {
                const isSelected = t.id === theme;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setTheme(t.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl transition-all duration-150 text-left ${
                      isSelected
                        ? 'bg-white/10 border border-white/20 shadow-sm'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base flex-shrink-0">{t.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white truncate">
                            {t.name}
                          </span>
                          <span className="text-[10px] px-1 py-0.2 rounded bg-white/10 text-slate-400 font-medium">
                            {t.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {t.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {/* Swatches */}
                      <div className="flex items-center -space-x-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: t.primaryColor }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: t.secondaryColor }}
                        />
                      </div>
                      {isSelected && (
                        <Check size={14} className="text-cyan-400" strokeWidth={2.5} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
