import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Shield, Globe, School, BookOpen, Users, Lock } from 'lucide-react';
import { getLeaderboardData } from '../../services/db';

export default function Leaderboard() {
  const [tab, setTab] = useState('global');
  const [isPrivate, setIsPrivate] = useState(false);

  const leaders = getLeaderboardData({ type: tab });

  return (
    <div className="p-6 rounded-3xl bg-[#081222] border border-white/10 space-y-6">
      {/* ── Header & Privacy Toggle ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Trophy size={20} className="text-amber-400" />
            CAMPUS &amp; GLOBAL LEADERBOARD
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Rankings updated live from validated question attempts and streak milestones.
          </p>
        </div>

        {/* Privacy Control */}
        <button
          type="button"
          onClick={() => setIsPrivate(!isPrivate)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white cursor-pointer transition-colors"
          title="Toggle Leaderboard Visibility"
        >
          <Lock size={13} className={isPrivate ? 'text-amber-400' : 'text-slate-400'} />
          <span>{isPrivate ? 'Anonymous Mode: Active' : 'Show Full Profile'}</span>
        </button>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'global', label: 'Global', icon: Globe },
          { id: 'college', label: 'College', icon: School },
          { id: 'department', label: 'Department', icon: BookOpen },
          { id: 'friends', label: 'Friends', icon: Users },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Leaderboard Table ── */}
      <div className="space-y-2">
        {leaders.map((student) => {
          const isTop3 = student.rank <= 3;
          const rankColor =
            student.rank === 1
              ? 'text-amber-400 bg-amber-400/10 border-amber-400/30'
              : student.rank === 2
              ? 'text-slate-300 bg-slate-300/10 border-slate-300/30'
              : student.rank === 3
              ? 'text-amber-600 bg-amber-600/10 border-amber-600/30'
              : 'text-slate-500 bg-white/5 border-white/5';

          return (
            <motion.div
              key={student.rank}
              whileHover={{ scale: 1.01 }}
              className={`p-3.5 rounded-2xl flex items-center justify-between gap-4 border transition-all ${
                student.isCurrentUser
                  ? 'bg-blue-500/15 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                  : 'bg-white/3 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs border ${rankColor}`}>
                  {student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : student.rank === 3 ? '🥉' : student.rank}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white truncate">
                      {student.isCurrentUser && isPrivate ? 'Anonymous Student (You)' : student.name}
                    </span>
                    {student.isCurrentUser && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-cyan-400 text-slate-950">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {student.college} • {student.dept}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 flex-shrink-0 text-right">
                <div>
                  <div className="text-xs text-slate-400">Accuracy</div>
                  <div className="text-sm font-bold text-emerald-400">{student.accuracy}%</div>
                </div>

                <div>
                  <div className="text-xs text-slate-400">Total XP</div>
                  <div className="text-sm font-black text-amber-300 font-mono">
                    {student.xp.toLocaleString()}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
