import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = false, glow = false, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      className={`glass-card p-5 overflow-hidden min-w-0 w-full ${hover ? 'glass-card-hover cursor-pointer' : ''} ${glow ? 'glow-blue' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
