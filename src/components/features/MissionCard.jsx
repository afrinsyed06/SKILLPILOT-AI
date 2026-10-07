import { motion } from 'framer-motion';
import { Target, CheckCircle2, Circle, Zap } from 'lucide-react';

export default function MissionCard({ missions = [] }) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Target size={17} className="text-blue-600" />
          TODAY&apos;S MISSIONS
        </h3>
        <span className="text-[11px] text-blue-700 font-semibold px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
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
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-slate-50/70 border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {m.done ? (
                    <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                  ) : (
                    <Circle size={18} className="text-slate-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className={`text-xs font-semibold truncate ${m.done ? 'text-emerald-800 line-through opacity-80' : 'text-slate-800'}`}>
                      {m.task}
                    </div>
                    {!m.done && (
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Progress: {m.current || 0}/{m.required || 1}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 flex items-center gap-1.5">
                  <span className={`text-xs font-black px-2 py-1 rounded-lg flex items-center gap-1 ${
                    m.done ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    <Zap size={11} className="fill-current text-amber-600" />
                    +{m.xp} XP
                  </span>
                </div>
              </div>

              {!m.done && (
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
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
