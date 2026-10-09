import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Trophy,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStreakCalendarData, isDailyChallengeCompleted } from '../../services/db';

export default function StreakCard({ streak = 0, userId = '1001', historyDays = [] }) {
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week'
  
  // Current calendar month view state
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDayInfo, setSelectedDayInfo] = useState(null);

  // Retrieve calendar activity data from db
  const calendarData = useMemo(() => {
    return getStreakCalendarData(userId, viewYear, viewMonth);
  }, [userId, viewYear, viewMonth]);

  const activeDatesSet = useMemo(() => new Set(calendarData.activeDates || []), [calendarData]);
  const dailyCompletedSet = useMemo(() => new Set(calendarData.dailyCompletedDates || []), [calendarData]);

  // Check if today is completed
  const todayStr = useMemo(() => today.toISOString().split('T')[0], [today]);
  const isTodayDone = isDailyChallengeCompleted(userId, todayStr) || activeDatesSet.has(todayStr);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  // Month metadata
  const monthName = new Date(viewYear, viewMonth, 1).toLocaleString('en-US', { month: 'long' });
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  
  // Starting day of week: 0 = Sun, 1 = Mon ... 6 = Sat
  // Convert so Monday = 0, Sunday = 6
  const rawFirstDay = new Date(viewYear, viewMonth, 1).getDay();
  const startDayOffset = (rawFirstDay + 6) % 7;

  // Build grid days
  const calendarDays = useMemo(() => {
    const days = [];
    // Leading blanks
    for (let i = 0; i < startDayOffset; i++) {
      days.push({ dayNumber: null, isCurrentMonth: false });
    }
    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const padM = String(viewMonth + 1).padStart(2, '0');
      const padD = String(day).padStart(2, '0');
      const dateStr = `${viewYear}-${padM}-${padD}`;
      const isActive = activeDatesSet.has(dateStr);
      const isDailyDone = dailyCompletedSet.has(dateStr);
      const isTodayDate = dateStr === todayStr;
      const isFuture = new Date(viewYear, viewMonth, day) > today;

      days.push({
        dayNumber: day,
        dateStr,
        isCurrentMonth: true,
        isActive,
        isDailyDone,
        isTodayDate,
        isFuture,
      });
    }
    return days;
  }, [viewYear, viewMonth, daysInMonth, startDayOffset, activeDatesSet, dailyCompletedSet, todayStr, today]);

  // 7-day strip view (last 7 days)
  const weekDays = useMemo(() => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const isActive = activeDatesSet.has(dateStr);
      const isDailyDone = dailyCompletedSet.has(dateStr);
      const isTodayDate = dateStr === todayStr;

      list.push({
        dayName,
        dayNum,
        dateStr,
        isActive,
        isDailyDone,
        isTodayDate,
      });
    }
    return list;
  }, [today, todayStr, activeDatesSet, dailyCompletedSet]);

  const displayStreak = streak || calendarData.currentStreak || 8;
  const longestStreak = calendarData.longestStreak || 14;
  const activeThisMonth = calendarDays.filter((d) => d.isCurrentMonth && d.isActive).length;

  return (
    <div
      className="p-5 rounded-3xl relative overflow-hidden transition-all shadow-sm"
      style={{
        background: '#ffffff',
        border: '1px solid rgba(37,99,235,0.18)',
        boxShadow: '0 4px 20px -2px rgba(37,99,235,0.06)',
      }}
    >
      {/* Decorative background glow */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.25), rgba(37,99,235,0.1))' }}
      />

      {/* ── Top Header: Streak Count & View Toggle ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25">
            <Flame size={22} className="fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-slate-900 tracking-tight">
                {displayStreak} DAY STREAK
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                ACTIVE 🔥
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {isTodayDone
                ? "Today's practice recorded! Streak protected."
                : 'Solve daily challenges to keep your multiplier alive!'}
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewMode('month')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === 'month'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Month 📅
          </button>
          <button
            type="button"
            onClick={() => setViewMode('week')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === 'week'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Week ⚡
          </button>
        </div>
      </div>

      {/* ── Month Calendar Navigation Bar (If Month View) ── */}
      {viewMode === 'month' && (
        <div className="flex items-center justify-between px-1 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-800">
              {monthName} {viewYear}
            </span>
            {(viewYear !== today.getFullYear() || viewMonth !== today.getMonth()) && (
              <button
                type="button"
                onClick={handleJumpToToday}
                className="text-[10px] font-bold text-blue-600 hover:underline px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 cursor-pointer"
              >
                Today
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Mode A: Little Monthly Calendar Grid ── */}
      {viewMode === 'month' && (
        <div className="space-y-1">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider pb-1">
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
            <span>Su</span>
          </div>

          {/* Grid of Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((item, idx) => {
              if (!item.isCurrentMonth) {
                return (
                  <div
                    key={`blank_${idx}`}
                    className="h-8 rounded-lg opacity-20 bg-slate-50 border border-transparent"
                  />
                );
              }

              const { dayNumber, isActive, isDailyDone, isTodayDate, isFuture, dateStr } = item;

              return (
                <motion.button
                  key={dateStr}
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  onClick={() =>
                    setSelectedDayInfo({
                      dayNumber,
                      dateStr,
                      isActive,
                      isDailyDone,
                      isTodayDate,
                    })
                  }
                  className={`h-8 rounded-xl flex flex-col items-center justify-center relative font-bold text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 text-white shadow-xs border border-amber-300 font-black'
                      : isTodayDate
                      ? 'bg-blue-50 text-blue-700 border-2 border-blue-600 font-black shadow-xs'
                      : isFuture
                      ? 'bg-slate-50/60 text-slate-300 border border-slate-100'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                  }`}
                  title={`${dateStr}: ${isActive ? 'Active Streak Day' : 'No activity'}`}
                >
                  <span className="leading-none text-[11px]">{dayNumber}</span>
                  {/* Activity Indicator Dots / Flame / Star */}
                  {isActive && (
                    <span className="text-[8px] leading-none text-white drop-shadow-xs">🔥</span>
                  )}
                  {isTodayDate && !isActive && (
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Mode B: Week Strip View ── */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {weekDays.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase">{item.dayName}</span>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-8 h-8 rounded-xl flex flex-col items-center justify-center text-xs font-black transition-all ${
                  item.isActive
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm border border-amber-300'
                    : item.isTodayDate
                    ? 'bg-blue-50 text-blue-600 border-2 border-blue-500'
                    : 'bg-slate-50 text-slate-400 border border-slate-200'
                }`}
              >
                {item.isActive ? '🔥' : item.dayNum}
              </motion.div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Day Info Popup Banner */}
      <AnimatePresence>
        {selectedDayInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-blue-700 font-bold">
                {selectedDayInfo.dateStr}:
              </span>
              <span className="text-slate-700">
                {selectedDayInfo.isActive
                  ? 'Streak Active • Questions Answered 🔥'
                  : selectedDayInfo.isTodayDate
                  ? 'Today • Complete challenge to extend streak!'
                  : 'Rest Day'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDayInfo(null)}
              className="text-slate-400 hover:text-slate-700 text-xs px-1 font-bold cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom Metrics & Milestone Progress ── */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
          <span className="flex items-center gap-1.5">
            <Trophy size={13} className="text-amber-500" />
            <span>Target: 10-Day Streak Badge</span>
          </span>
          <span className="font-bold text-blue-600">{displayStreak}/10 Days (+300 XP)</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (displayStreak / 10) * 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-blue-600 rounded-full"
          />
        </div>

        {/* Stats Pill & CTA */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="flex items-center gap-1 text-slate-700 font-bold">
              <ShieldCheck size={13} className="text-emerald-500" />
              1 Freeze Active
            </span>
            <span>•</span>
            <span>Best: {longestStreak} Days</span>
            <span>•</span>
            <span>{activeThisMonth} Active This Month</span>
          </div>

          <Link
            to="/arena?mode=daily_challenge&start=true"
            className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer group"
          >
            <span>Daily Challenge</span>
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
