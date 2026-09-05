import { motion } from 'framer-motion';
import { LEVEL_DEFINITIONS } from '../../services/db';

export default function LevelBadge({ level = 1, showTitle = true, size = 'md' }) {
  const def = LEVEL_DEFINITIONS.find((l) => l.level === level) || LEVEL_DEFINITIONS[0];

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div
        whileHover={{ scale: 1.08 }}
        className={`${sizeClasses[size] || sizeClasses.md} rounded-xl bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 flex items-center justify-center font-black text-white shadow-md shadow-blue-500/20 border border-white/20`}
      >
        <span>{level}</span>
      </motion.div>
      {showTitle && (
        <div className="leading-tight">
          <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Level {level}</div>
          <div className="text-xs font-semibold text-white flex items-center gap-1">
            <span>{def.icon}</span> {def.title}
          </div>
        </div>
      )}
    </div>
  );
}
