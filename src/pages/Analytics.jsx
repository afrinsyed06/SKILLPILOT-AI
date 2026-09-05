import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend,
} from 'recharts';
import GlassCard from '../components/ui/GlassCard';
import { analyticsData, readinessBreakdown } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="p-3 rounded-xl text-xs" style={{ background: '#0f1629', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="text-slate-400 mb-1 font-medium">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}{p.name === 'score' ? '%' : ''}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const currentScore = analyticsData.readinessOverTime.at(-1).score;
  const prevScore = analyticsData.readinessOverTime.at(-2).score;
  const delta = currentScore - prevScore;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Performance <span className="gradient-text">Analytics</span></h1>
        <p className="text-sm text-slate-400 mt-1">Track your growth, identify trends, and measure placement readiness over time</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Score', value: `${currentScore}%`, delta: `+${delta}% this month`, color: 'text-emerald-400', icon: '📈' },
          { label: 'Peak Score', value: '82%', delta: 'This month', color: 'text-blue-400', icon: '🏆' },
          { label: 'Avg Interview', value: '76%', delta: '+11% improvement', color: 'text-violet-400', icon: '🎤' },
          { label: 'Skills Improved', value: '6', delta: 'In last 30 days', color: 'text-amber-400', icon: '⚡' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-card p-4 rounded-2xl">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className={`text-xs font-semibold ${s.color} mb-0.5`}>{s.label}</div>
            <div className="text-xs text-slate-500">{s.delta}</div>
          </motion.div>
        ))}
      </div>

      {/* Readiness Over Time */}
      <GlassCard>
        <h3 className="text-base font-bold text-white mb-5">Placement Readiness — Over Time</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={analyticsData.readinessOverTime}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[40, 90]} />
            <Tooltip content={<CustomTooltip />} />
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <Line type="monotone" dataKey="score" name="Readiness" stroke="url(#lineGrad)" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }} activeDot={{ r: 7, fill: '#06b6d4' }} />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Growth */}
        <GlassCard>
          <h3 className="text-base font-bold text-white mb-5">Skill Growth — Multi-Skill</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={analyticsData.skillGrowth}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[30, 95]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="Python" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="ML" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="SQL" stroke="#06b6d4" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="DSA" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Interview Scores */}
        <GlassCard>
          <h3 className="text-base font-bold text-white mb-5">Interview Score Progression</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analyticsData.interviewScores} barSize={14} barGap={4}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="round" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[50, 95]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Technical" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="HR" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Coding" fill="#06b6d4" radius={[3, 3, 0, 0]} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Radar */}
      <GlassCard>
        <h3 className="text-base font-bold text-white mb-5">Current Skill Profile — Radar</h3>
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={analyticsData.radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Detailed Breakdown */}
      <GlassCard>
        <h3 className="text-base font-bold text-white mb-4">Detailed Score Breakdown</h3>
        <div className="space-y-4">
          {readinessBreakdown.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-36 text-sm text-slate-400 flex-shrink-0">{item.label}</div>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ duration: 1.2, delay: i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                />
              </div>
              <div className="w-12 text-right">
                <span className="text-sm font-bold text-white">{item.score}%</span>
              </div>
              <div className="w-16 text-right">
                <span className="text-xs text-emerald-400">+{Math.floor(Math.random() * 8) + 2}%</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
