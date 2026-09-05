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
    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-[#0d1b30] to-[#081222] border border-amber-500/25 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame size={18} className="fill-amber-400/40" />
          </div>
          <div>
            <div className="text-sm font-black text-white flex items-center gap-1">
              {streak} DAY STREAK <span className="text-amber-400">🔥</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {streak > 0 ? "You're building unstoppable momentum!" : "Answer questions today to start your streak!"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 pt-1">
        {days.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-slate-400 font-medium">{item.day}</span>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                item.active
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-orange-500/30 border border-amber-300/40'
                  : 'bg-white/5 text-slate-500 border border-white/5'
              }`}
            >
              {item.active ? '✓' : '○'}
            </motion.div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-[11px] text-amber-300/90 font-medium flex items-center justify-between border-t border-white/5 pt-2">
        <span>Target: 7-Day Reward</span>
        <span className="font-bold">+500 XP Milestone</span>
      </div>
    </div>
  );
}
