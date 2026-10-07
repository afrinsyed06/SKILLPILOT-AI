import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Globe, School, BookOpen, Users, Lock } from 'lucide-react';
import { getLeaderboardData } from '../../services/db';

export default function Leaderboard() {
  const [tab, setTab] = useState('global');
  const [isPrivate, setIsPrivate] = useState(false);

  const leaders = getLeaderboardData({ type: tab });

  return (
    <div className="p-6 rounded-3xl space-y-6" style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.15)', boxShadow: '0 2px 16px rgba(37,99,235,0.07)' }}>
      {/* Header & Privacy Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black flex items-center gap-2" style={{ color: '#0f172a' }}>
            <Trophy size={20} className="text-amber-500" />
            CAMPUS &amp; GLOBAL LEADERBOARD
          </h3>
          <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
            Rankings updated live from validated question attempts and streak milestones.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPrivate(!isPrivate)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs cursor-pointer transition-colors"
          style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.18)', color: '#334155' }}
          title="Toggle Leaderboard Visibility"
        >
          <Lock size={13} style={{ color: isPrivate ? '#f59e0b' : '#94a3b8' }} />
          <span>{isPrivate ? 'Anonymous Mode: Active' : 'Show Full Profile'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid rgba(37,99,235,0.12)' }}>
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
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                  : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <div className="space-y-2">
        {leaders.map((student) => {
          const rankColor =
            student.rank === 1
              ? 'text-amber-500 bg-amber-50 border-amber-200'
              : student.rank === 2
              ? 'text-slate-500 bg-slate-50 border-slate-200'
              : student.rank === 3
              ? 'text-amber-600 bg-orange-50 border-orange-200'
              : 'text-slate-400 bg-white border-slate-100';

          return (
            <motion.div
              key={student.rank}
              whileHover={{ scale: 1.01 }}
              className="p-3.5 rounded-2xl flex items-center justify-between gap-4 border transition-all"
              style={
                student.isCurrentUser
                  ? { background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.3)' }
                  : { background: '#f8fafc', border: '1px solid rgba(37,99,235,0.09)' }
              }
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs border ${rankColor}`}>
                  {student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : student.rank === 3 ? '🥉' : student.rank}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold truncate" style={{ color: '#0f172a' }}>
                      {student.isCurrentUser && isPrivate ? 'Anonymous Student (You)' : student.name}
                    </span>
                    {student.isCurrentUser && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-600 text-white">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] truncate" style={{ color: '#64748b' }}>
                    {student.college} • {student.dept}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 flex-shrink-0 text-right">
                <div>
                  <div className="text-xs" style={{ color: '#64748b' }}>Accuracy</div>
                  <div className="text-sm font-bold text-emerald-600">{student.accuracy}%</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: '#64748b' }}>Total XP</div>
                  <div className="text-sm font-black font-mono text-amber-600">
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
