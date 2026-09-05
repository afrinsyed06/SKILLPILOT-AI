import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function EnergyBar({ current = 10, max = 10, onRecharge }) {
  const percent = Math.min(100, Math.round((current / max) * 100));

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#091528] border border-cyan-500/20 text-xs">
      <Zap size={14} className="text-cyan-400 fill-cyan-400/30" />
      <span className="text-slate-400 font-medium">Energy:</span>
      <span className="font-bold text-cyan-300 font-mono">
        {current}/{max}
      </span>
      <div className="w-14 h-2 rounded-full bg-slate-800 overflow-hidden ml-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
        />
      </div>
    </div>
  );
}
