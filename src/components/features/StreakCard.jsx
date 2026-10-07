import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function StreakCard({ streak = 0, historyDays = [] }) {
  const defaultDays = [
    { day: 'Mon', active: true },
    { day: 'Tue', active: true },
    { day: 'Wed', active: true },
    { day: 'Thu', active: true },
    { day: 'Fri', active: true },
    { day: 'Sat', active: true },
    { day: 'Sun', active: true },
  ];

  const days = historyDays.length > 0 ? historyDays : defaultDays;

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 border border-amber-200/80 relative overflow-hidden shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600">
            <Flame size={18} className="fill-amber-500/40" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1">
              {streak} DAY STREAK <span className="text-amber-500">🔥</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {streak > 0 ? "You're building unstoppable momentum!" : "Answer questions today to start your streak!"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 pt-1">
        {days.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-slate-500 font-medium">{item.day}</span>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                item.active
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm border border-amber-400'
                  : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}
            >
              {item.active ? '✓' : '○'}
            </motion.div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-[11px] text-amber-800 font-medium flex items-center justify-between border-t border-amber-100 pt-2">
        <span>Target: 7-Day Reward</span>
        <span className="font-bold text-amber-700">+500 XP Milestone</span>
      </div>
    </div>
  );
}
