import { useEffect, useState } from 'react';

export default function SkillBar({ name, level, color = 'blue', showLabel = true, height = 'h-2', delay = 0 }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(level), 400 + delay);
    return () => clearTimeout(timer);
  }, [level, delay]);

  const gradients = {
    blue: 'from-blue-500 to-cyan-400',
    violet: 'from-violet-500 to-purple-400',
    green: 'from-emerald-500 to-teal-400',
    amber: 'from-amber-500 to-orange-400',
    pink: 'from-pink-500 to-rose-400',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-slate-300">{name}</span>
          <span className="text-sm font-bold text-white">{level}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-white/5 rounded-full overflow-hidden`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradients[color] || gradients.blue} relative overflow-hidden`}
          style={{
            width: `${width}%`,
            transition: `width 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
