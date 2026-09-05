import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { LEVEL_DEFINITIONS } from '../../services/db';

export default function XPBar({ xp = 0, currentLevel = 1 }) {
  const currentDef = LEVEL_DEFINITIONS.find((l) => l.level === currentLevel) || LEVEL_DEFINITIONS[0];
  const nextDef = LEVEL_DEFINITIONS.find((l) => l.level === currentLevel + 1) || { minXP: currentDef.nextXP, title: 'Max Level' };

  const levelRange = Math.max(1, nextDef.minXP - currentDef.minXP);
  const xpInLevel = Math.max(0, xp - currentDef.minXP);
  const percent = Math.min(100, Math.round((xpInLevel / levelRange) * 100));

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-400" />
          <strong className="text-white font-mono">{xp.toLocaleString()}</strong> XP
        </span>
        <span className="text-slate-500 text-[11px]">
          {nextDef.minXP - xp > 0 ? `${(nextDef.minXP - xp).toLocaleString()} XP to Level ${currentLevel + 1}` : 'Max Tier Reached!'}
        </span>
      </div>

      <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full relative overflow-hidden"
          style={{ background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #06b6d4)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
}
