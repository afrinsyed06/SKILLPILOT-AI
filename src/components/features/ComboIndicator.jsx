import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';

export default function ComboIndicator({ combo = 0, multiplier = 1.0, bonusXP = 0 }) {
  if (combo <= 1) return null;

  const isHot = combo >= 5;
  const isInferno = combo >= 10;

  return (
    <div className="relative flex items-center gap-2">
      <motion.div
        key={combo}
        initial={{ scale: 0.8, y: -5 }}
        animate={{ scale: [1, 1.15, 1], y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-lg ${
          isInferno
            ? 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 text-white shadow-orange-500/50 border border-amber-300'
            : isHot
            ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-black shadow-orange-500/30'
            : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-cyan-500/20'
        }`}
      >
        <Flame
          size={15}
          className={`${isHot ? 'animate-bounce text-amber-200' : 'text-white'}`}
        />
        <span>{combo} COMBO</span>
        <span className="opacity-85 font-mono">({multiplier}x)</span>
      </motion.div>

      <AnimatePresence>
        {bonusXP > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -18, scale: 1.1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="absolute -top-3 left-full ml-2 whitespace-nowrap px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[11px] font-black flex items-center gap-1 shadow-md shadow-amber-400/40"
          >
            <Zap size={11} className="fill-slate-950" />
            +{bonusXP} BONUS XP!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
