import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    icon: '🎯',
    title: 'Skill Gap Detected',
    desc: 'Deep Learning is your biggest gap. Start today!',
    time: '2h ago',
    unread: true,
    path: '/skill-gap',
    tag: 'Skills',
  },
  {
    id: 2,
    icon: '🔥',
    title: 'Streak Milestone!',
    desc: 'Keep going — maintain your daily streak for XP.',
    time: '1d ago',
    unread: true,
    path: '/achievements',
    tag: 'XP & Streak',
  },
  {
    id: 3,
    icon: '💼',
    title: 'New Job Match',
    desc: '3 new AI/ML Engineer roles match your profile.',
    time: '2d ago',
    unread: false,
    path: '/jobs',
    tag: 'Jobs',
  },
  {
    id: 4,
    icon: '🏆',
    title: 'Badge Unlocked',
    desc: 'You earned the "Profile Builder" badge!',
    time: '3d ago',
    unread: false,
    path: '/achievements',
    tag: 'Badges',
  },
];

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const storageKey = `skillpilot_notifications_${user?.id || 'guest'}`;

  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Keep localStorage synced
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications, storageKey]);

  // Sync if user switches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        setNotifications(INITIAL_NOTIFICATIONS);
      }
    } catch {
      setNotifications(INITIAL_NOTIFICATIONS);
    }
  }, [storageKey]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markNotifRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetNotifications = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: Date.now(),
      icon: '🔔',
      time: 'Just now',
      unread: true,
      path: '/dashboard',
      ...notif,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markNotifRead,
        markAllRead,
        removeNotification,
        clearAllNotifications,
        resetNotifications,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return ctx;
}
