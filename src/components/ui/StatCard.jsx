import { motion } from 'framer-motion';

export default function StatCard({ icon, label, value, sub, color = 'blue', delay = 0 }) {
  const colors = {
    blue: 'from-blue-500/20 to-cyan-500/10 border-blue-500/20',
    violet: 'from-violet-500/20 to-purple-500/10 border-violet-500/20',
    green: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/20',
    amber: 'from-amber-500/20 to-orange-500/10 border-amber-500/20',
    pink: 'from-pink-500/20 to-rose-500/10 border-pink-500/20',
    cyan: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/20',
  };

  const iconColors = {
    blue: 'text-blue-400',
    violet: 'text-violet-400',
    green: 'text-emerald-400',
    amber: 'text-amber-400',
    pink: 'text-pink-400',
    cyan: 'text-cyan-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className={`glass-card bg-gradient-to-br ${colors[color] || colors.blue} border p-5 rounded-2xl`}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-2xl ${iconColors[color] || iconColors.blue}`}>{icon}</span>
        <span className="text-sm text-slate-400 font-medium">{label}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </motion.div>
  );
}
