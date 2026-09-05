import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell,
} from 'recharts';
import { Code2, Plus } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { codingStats, heatmapData } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

function HeatCell({ val }) {
  const opacity = val === 0 ? 0.06 : Math.min(0.2 + val * 0.1, 1);
  const bg = val === 0 ? 'rgba(255,255,255,0.06)' : `rgba(59,130,246,${opacity})`;
  return (
    <div
      className="heatmap-cell"
      style={{
        background: bg,
        border: val > 0 ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(255,255,255,0.04)',
      }}
      title={`${val} problems`}
    />
  );
}

export default function CodingIntelligence() {
  const { profile } = useAuth();
  const leetcodeUser = profile?.codingProfile?.leetcode || profile?.github || '';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Coding <span className="gradient-text">Intelligence</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            DSA pattern insights, topic breakdowns, and problem-solving velocity
          </p>
        </div>
        {!leetcodeUser && (
          <Link
            to="/account"
            state={{ edit: true }}
            className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
          >
            <Plus size={14} /> Connect LeetCode Profile
          </Link>
        )}
      </div>

      {/* Connected Profile Status */}
      {leetcodeUser ? (
        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Code2 size={16} className="text-blue-400" />
            Connected Profile: <strong className="text-white">{leetcodeUser}</strong>
          </span>
          <Link to="/account" state={{ edit: true }} className="text-blue-400 hover:underline">
            Update Handle
          </Link>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between">
          <span>
            💡 Add your LeetCode / GitHub username in your profile to link your live problem statistics.
          </span>
          <Link to="/account" state={{ edit: true }} className="underline font-semibold">
            Add Handle
          </Link>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Solved',
            value: codingStats.totalSolved,
            icon: '💻',
            color: 'from-blue-500/15 to-cyan-500/5',
            border: 'border-blue-500/20',
            text: 'text-blue-400',
          },
          {
            label: 'Current Streak',
            value: `${profile?.streak || codingStats.streak} days`,
            icon: '🔥',
            color: 'from-amber-500/15 to-orange-500/5',
            border: 'border-amber-500/20',
            text: 'text-amber-400',
          },
          {
            label: 'Global Rank',
            value: `#${codingStats.rank}`,
            icon: '🏆',
            color: 'from-violet-500/15 to-purple-500/5',
            border: 'border-violet-500/20',
            text: 'text-violet-400',
          },
          {
            label: 'Accuracy',
            value: `${codingStats.accuracy}%`,
            icon: '🎯',
            color: 'from-emerald-500/15 to-teal-500/5',
            border: 'border-emerald-500/20',
            text: 'text-emerald-400',
          },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`glass-card bg-gradient-to-br ${s.color} border ${s.border} p-4 rounded-2xl`}
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className={`text-xs font-semibold ${s.text}`}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Difficulty Split + Monthly Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Difficulty Pie */}
        <GlassCard>
          <h3 className="text-base font-bold text-white mb-4">Difficulty Distribution</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={codingStats.difficulty}
                  dataKey="count"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {codingStats.difficulty.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#0f1629',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {codingStats.difficulty.map((d) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <div>
                    <div className="text-sm font-semibold text-white">{d.count}</div>
                    <div className="text-xs text-slate-400">{d.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Monthly Progress */}
        <GlassCard>
          <h3 className="text-base font-bold text-white mb-4">Monthly Practice Velocity</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={codingStats.monthlyProgress} barSize={20}>
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: '#0f1629',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  color: '#fff',
                }}
              />
              <Bar dataKey="problems" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.4} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Activity Heatmap */}
      <GlassCard>
        <h3 className="text-base font-bold text-white mb-4">Coding Activity Grid — Past Year</h3>
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {heatmapData.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day, di) => (
                  <HeatCell key={di} val={day} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Topic Analysis */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Topic-wise Performance</h3>
          <div className="text-xs text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
            🤖 AI Priority: Graphs &amp; Dynamic Programming
          </div>
        </div>
        <div className="space-y-3">
          {codingStats.topics.map((topic, i) => (
            <div key={topic.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300 font-medium text-xs">{topic.name}</span>
                <span className="text-slate-400 text-xs">
                  {topic.solved}/{topic.total} • <span className="font-bold text-white">{topic.percent}%</span>
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.percent}%` }}
                  transition={{ duration: 1.2, delay: i * 0.05 }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      topic.percent >= 80
                        ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                        : topic.percent >= 50
                        ? 'linear-gradient(90deg, #3b82f6, #06b6d4)'
                        : 'linear-gradient(90deg, #ef4444, #f97316)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
