import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, Zap, LogOut, User, Settings, ChevronDown, X, Check, Trash2, ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const pageNames = {
  '/': 'AI Dashboard',
  '/profile': 'My Career Profile',
  '/resume': 'Resume AI',
  '/skill-gap': 'Skill Gap Analyzer',
  '/career': 'Career Discovery',
  '/roadmap': 'AI Roadmap',
  '/coding': 'Coding Intelligence',
  '/interview': 'Interview Arena',
  '/analytics': 'Performance Analytics',
  '/jobs': 'Smart Job Matching',
  '/achievements': 'Achievements & XP',
  '/mentor': 'AI Career Mentor',
  '/account': 'My Account',
};

export default function Topbar({ onMenuClick, onSearchClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const currentPage = pageNames[location.pathname] || 'Dashboard';

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = (profile?.fullName || user?.name || 'U')
    .trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('');

  const streak = profile?.streak ?? 0;
  const isAIMentor = location.pathname === '/mentor';

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  const {
    notifications,
    unreadCount,
    markNotifRead,
    markAllRead,
    removeNotification,
    clearAllNotifications,
    resetNotifications,
  } = useNotifications();

  const handleNotificationClick = (notif) => {
    markNotifRead(notif.id);
    setNotifOpen(false);
    if (notif.path) {
      navigate(notif.path);
    }
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20"
      style={{
        background: 'rgba(6,14,28,0.90)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Left: menu + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          id="sidebar-toggle"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-white truncate">{currentPage}</h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">SKILLPILOT AI — Placement Intelligence</p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">

        {/* Search — desktop */}
        <button
          id="search-btn"
          onClick={onSearchClick}
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-slate-200 transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Search size={14} />
          <span className="text-xs">Search...</span>
          <div className="flex items-center gap-0.5">
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-500">⌘</kbd>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-500">K</kbd>
          </div>
        </button>

        {/* Search — mobile */}
        <button
          onClick={onSearchClick}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Search size={18} />
        </button>

        {/* 🔥 Streak badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl select-none"
          style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}
        >
          <span className="text-base leading-none">🔥</span>
          <span className="text-sm font-bold text-amber-400">{streak}</span>
          <span className="text-xs text-amber-400/70 hidden sm:block">day streak</span>
        </div>

        {/* ⚡ AI Active — clickable, navigates to AI Mentor */}
        <button
          id="ai-active-btn"
          onClick={() => navigate('/mentor')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 relative overflow-hidden"
          style={{
            background: isAIMentor
              ? 'rgba(59,130,246,0.25)'
              : 'rgba(59,130,246,0.12)',
            border: `1px solid ${isAIMentor ? 'rgba(59,130,246,0.5)' : 'rgba(59,130,246,0.25)'}`,
          }}
          title="Open AI Career Mentor"
        >
          {/* Pulse dot */}
          <span className="relative flex-shrink-0">
            <span
              className="absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping"
              style={{ background: '#3b82f6' }}
            />
            <Zap size={13} className="relative text-blue-400" />
          </span>
          <span className="text-xs font-semibold text-blue-400">AI Active</span>
        </button>

        {/* 🔔 Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            id="notifications-btn"
            onClick={() => { setNotifOpen((v) => !v); setMenuOpen(false); }}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Notifications"
          >
            <Bell size={18} />
            {/* Pulsing notification badge ONLY if unreadCount > 0 */}
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center pointer-events-none">
                <span className="absolute w-3.5 h-3.5 rounded-full bg-cyan-400/50 animate-ping" />
                <span
                  className="relative min-w-[16px] h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center px-1 shadow-md shadow-cyan-500/40"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
                >
                  {unreadCount}
                </span>
              </span>
            )}
          </button>

          {/* Notification Panel */}
          {notifOpen && (
            <div
              className="absolute -right-12 sm:right-0 top-full mt-2.5 w-[330px] sm:w-[380px] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-white/10 z-[999] overflow-hidden shadow-2xl backdrop-blur-2xl"
              style={{ background: 'rgba(10, 22, 40, 0.97)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.08)' }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b border-white/10"
                style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.14), rgba(6,182,212,0.07))' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Bell size={14} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Notifications</span>
                      {unreadCount > 0 ? (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white bg-blue-500 shadow-sm">
                          {unreadCount} new
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-normal">All caught up</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      title="Mark all as read"
                      className="p-1.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <Check size={13} />
                      <span className="text-[11px] hidden sm:inline">Mark read</span>
                    </button>
                  )}
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Notification list */}
              {notifications.length === 0 ? (
                <div className="py-8 px-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-2 text-xl">
                    🎉
                  </div>
                  <p className="text-sm font-semibold text-white">No notifications</p>
                  <p className="text-xs text-slate-400 mt-1">You're all caught up with your placement alerts!</p>
                  <button
                    onClick={resetNotifications}
                    className="mt-3 text-xs text-cyan-400 hover:underline cursor-pointer"
                  >
                    Restore sample alerts
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`group flex items-start gap-3 px-4 py-3 cursor-pointer transition-all hover:bg-white/8 ${
                        n.unread ? 'bg-blue-500/8' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/6 flex items-center justify-center text-base flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        {n.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className={`text-xs font-bold truncate ${n.unread ? 'text-white' : 'text-slate-300'}`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-500 flex-shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed line-clamp-2">{n.desc}</p>
                        {n.tag && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/6 text-slate-300">
                              {n.tag}
                            </span>
                            <span className="text-[10px] text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                              Open <ArrowRight size={10} />
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-shrink-0 pt-0.5">
                        {n.unread && <div className="w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-cyan-400/20" />}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(n.id);
                          }}
                          title="Dismiss notification"
                          className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-white/8 bg-black/25 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setNotifOpen(false);
                    navigate('/account', { state: { tab: 'Notifications' } });
                  }}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Settings size={12} /> All in Account
                </button>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 👤 Avatar + Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            id="user-avatar-btn"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/8 transition-all duration-200"
            style={{ border: menuOpen ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent' }}
          >
            {/* Avatar */}
            {profile?.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/40"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
              >
                {initials}
              </div>
            )}
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-200 hidden sm:block ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown — use fixed positioning relative to viewport so it never gets clipped */}
          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 overflow-hidden z-[999]"
              style={{
                background: '#0a1628',
                boxShadow: '0 24px 48px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)',
              }}
            >
              {/* User header */}
              <div
                className="px-4 py-3 border-b border-white/8"
                style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(6,182,212,0.05))' }}
              >
                <div className="flex items-center gap-3">
                  {profile?.profilePhoto ? (
                    <img src={profile.profilePhoto} alt="Avatar" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
                    >
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate">
                      {profile?.fullName || user?.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <button
                  id="menu-my-profile"
                  onClick={() => { navigate('/account'); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/6 hover:text-white transition-all duration-150 text-left"
                >
                  <User size={15} className="text-slate-500 flex-shrink-0" />
                  My Profile
                </button>
                <button
                  id="menu-settings"
                  onClick={() => { navigate('/account'); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/6 hover:text-white transition-all duration-150 text-left"
                >
                  <Settings size={15} className="text-slate-500 flex-shrink-0" />
                  Settings
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-white/8">
                <button
                  id="menu-logout"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-150 text-left"
                >
                  <LogOut size={15} className="flex-shrink-0" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
