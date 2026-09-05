import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

import { getUserStats } from '../../services/db';

const navItems = [
  { path: '/', label: 'AI Dashboard', icon: '🏠' },
  { path: '/arena', label: '🎮 Question Arena', icon: '⚡' },
  { path: '/profile', label: 'My Career Profile', icon: '👤' },
  { path: '/resume', label: 'Resume AI', icon: '📄' },
  { path: '/skill-gap', label: 'Skill Gap Analyzer', icon: '🧠' },
  { path: '/career', label: 'Career Discovery', icon: '🎯' },
  { path: '/roadmap', label: 'AI Roadmap', icon: '🗺️' },
  { path: '/coding', label: 'Coding Intelligence', icon: '💻' },
  { path: '/interview', label: 'Interview Arena', icon: '🎤' },
  { path: '/analytics', label: 'Performance Analytics', icon: '📊' },
  { path: '/jobs', label: 'Smart Job Matching', icon: '💼' },
  { path: '/achievements', label: 'Achievements & XP', icon: '🏆' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '🥇' },
  { path: '/mentor', label: 'AI Career Mentor', icon: '🤖' },
  { path: '/account', label: 'My Account', icon: '⚙️' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const { profile, user } = useAuth();
  const dbStats = getUserStats(user?.id || '1001');

  const xp = profile?.xp ? Math.max(profile.xp, dbStats.totalXP) : (dbStats.totalXP || 2450);
  const level = dbStats.currentLevel?.level || profile?.level || 7;
  const xpToNext = dbStats.currentLevel?.nextXP || 3000;
  const streak = dbStats.streak || profile?.streak || 8;
  const placementScore = profile?.placementScore ?? 84;
  const targetRole = profile?.targetRole || 'AI/ML Engineer';

  const xpPercent = Math.min(100, Math.round((xp / xpToNext) * 100));

  const initials = (profile?.fullName || user?.name || 'U')
    .trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('');

  const displayName = profile?.fullName || user?.name || 'Student';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-64 z-30 flex flex-col lg:translate-x-0 lg:static lg:z-auto"
        style={{
          background: 'linear-gradient(180deg, #0a1628 0%, #060e1c 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
            >
              🎓
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-tight">SKILLPILOT</div>
              <div className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">AI Placement</div>
            </div>
          </div>
        </div>

        {/* Student XP Card */}
        <div className="mx-3 mt-4 p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.08))', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="flex items-center gap-3 mb-3">
            {profile?.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{displayName}</div>
              <div className="text-xs text-slate-400">Level {level} • {targetRole}</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-400">{xp} / {xpToNext} XP</span>
            <span className="text-xs text-blue-400 font-semibold">🔥 {streak}d</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${xpPercent}%`, background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span className="text-sm truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom placement score */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Placement Ready</div>
              <div className="text-xl font-bold gradient-text">{placementScore}%</div>
            </div>
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                <circle
                  cx="22" cy="22" r="18" fill="none"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  strokeDashoffset={`${2 * Math.PI * 18 * (1 - placementScore / 100)}`}
                  style={{ filter: 'drop-shadow(0 0 4px #3b82f6)' }}
                />
              </svg>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
