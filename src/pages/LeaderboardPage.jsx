import { motion } from 'framer-motion';
import Leaderboard from '../components/features/Leaderboard';

export default function LeaderboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl mx-auto pb-16"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <span>🏆</span> CAMPUS &amp; GLOBAL LEADERBOARD
        </h1>
        <p className="text-sm text-slate-400">
          Compete, climb the ranks, and validate your placement preparation across universities.
        </p>
      </div>

      <Leaderboard />
    </motion.div>
  );
}
