import { motion } from 'framer-motion';
import { Target, CheckCircle2, Circle, Zap } from 'lucide-react';

export default function MissionCard({ missions = [] }) {
  return (
    <div className="p-5 rounded-2xl bg-[#0a1628] border border-blue-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Target size={17} className="text-cyan-400" />
          TODAY&apos;S MISSIONS
        </h3>
        <span className="text-[11px] text-cyan-400 font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          Daily Rewards
        </span>
      </div>

      <div className="space-y-2.5">
        {missions.map((m) => {
          const progressPct = Math.min(100, Math.round(((m.current || 0) / (m.required || 1)) * 100));

          return (
            <motion.div
              key={m.id}
              whileHover={{ scale: 1.01 }}
              className={`p-3 rounded-xl border transition-all ${
                m.done
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-white/3 border-white/8 hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {m.done ? (
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Circle size={18} className="text-slate-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className={`text-xs font-semibold truncate ${m.done ? 'text-emerald-200 line-through opacity-80' : 'text-slate-200'}`}>
                      {m.task}
                    </div>
                    {!m.done && (
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Progress: {m.current || 0}/{m.required || 1}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 flex items-center gap-1.5">
                  <span className={`text-xs font-black px-2 py-1 rounded-lg flex items-center gap-1 ${
                    m.done ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                  }`}>
                    <Zap size={11} className="fill-current" />
                    +{m.xp} XP
                  </span>
                </div>
              </div>

              {!m.done && (
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
