import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function EnergyBar({ current = 10, max = 10, onRecharge }) {
  const percent = Math.min(100, Math.round((current / max) * 100));

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs shadow-sm">
      <Zap size={14} className="text-blue-600 fill-blue-600/30" />
      <span className="text-slate-600 font-medium">Energy:</span>
      <span className="font-bold text-blue-700 font-mono">
        {current}/{max}
      </span>
      <div className="w-14 h-2 rounded-full bg-blue-100 overflow-hidden ml-1 border border-blue-200/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
        />
      </div>
    </div>
  );
}
