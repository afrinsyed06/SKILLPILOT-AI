import { motion } from 'framer-motion';
import { useState } from 'react';
import { CheckCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { roadmapPhases } from '../data/mockData';

export default function Roadmap() {
  const { profile } = useAuth();
  const targetRole = profile?.targetRole || 'AI/ML Engineer';
  const [expanded, setExpanded] = useState(2);

  const totalTasks = roadmapPhases.reduce((a, p) => a + p.tasks.length, 0);
  const doneTasks = roadmapPhases.reduce((a, p) => a + p.tasks.filter((t) => t.done).length, 0);
  const overallProgress = Math.round((doneTasks / totalTasks) * 100);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          AI <span className="gradient-text">Roadmap</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Your personalized 90-day placement preparation path tailored for {targetRole}
        </p>
      </div>

      {/* Overall Progress */}
      <div
        className="p-5 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.08))',
          border: '1px solid rgba(59,130,246,0.2)',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">90-DAY PLACEMENT PREPARATION SPRINT</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Target Track: <span className="text-blue-300 font-semibold">{targetRole}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black gradient-text">{overallProgress}%</div>
            <div className="text-xs text-slate-400">Roadmap Progress</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1.5 }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6)' }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-slate-500">
            <span>Day 1: Foundations</span>
            <span>{doneTasks}/{totalTasks} tasks completed</span>
            <span>Day 90: Placement Ready</span>
          </div>
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500/50 via-violet-500/30 to-transparent hidden md:block" />

        <div className="space-y-4">
          {roadmapPhases.map((phase, i) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative"
            >
              <div
                className="absolute left-4 top-6 w-4 h-4 rounded-full z-10 hidden md:flex items-center justify-center"
                style={{
                  background:
                    phase.status === 'completed' ? '#10b981' : phase.status === 'active' ? '#3b82f6' : '#1e3a5f',
                  boxShadow: phase.status === 'active' ? '0 0 12px #3b82f6' : 'none',
                }}
              >
                {phase.status === 'completed' && <CheckCircle size={10} className="text-white" />}
              </div>

              <div className="md:ml-12">
                <div
                  onClick={() => setExpanded(expanded === phase.phase ? null : phase.phase)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 ${
                    phase.status === 'active' ? 'border border-blue-500/30' : 'glass-card-hover'
                  }`}
                  style={{
                    background:
                      phase.status === 'active'
                        ? 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(6,182,212,0.06))'
                        : phase.status === 'completed'
                        ? 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.04))'
                        : undefined,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gradient-to-br ${phase.color}`}
                    >
                      {phase.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Phase {phase.phase.toString().padStart(2, '0')}
                        </span>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                            phase.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : phase.status === 'active'
                              ? 'bg-blue-500/15 text-blue-400'
                              : 'bg-white/5 text-slate-500'
                          }`}
                        >
                          {phase.status === 'completed'
                            ? '✅ Completed'
                            : phase.status === 'active'
                            ? '🚀 Active'
                            : '⏳ Upcoming'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-0.5">{phase.title}</h3>
                      <p className="text-xs text-slate-400">{phase.duration}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div
                          className="text-lg font-bold"
                          style={{ color: phase.status === 'completed' ? '#10b981' : '#3b82f6' }}
                        >
                          {phase.progress}%
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {phase.tasks.filter((t) => t.done).length}/{phase.tasks.length}
                        </div>
                      </div>
                      {expanded === phase.phase ? (
                        <ChevronUp size={18} className="text-slate-400" />
                      ) : (
                        <ChevronDown size={18} className="text-slate-400" />
                      )}
                    </div>
                  </div>

                  <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${phase.progress}%` }}
                      transition={{ duration: 1.2 }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${
                          phase.color.includes('blue')
                            ? '#3b82f6'
                            : phase.color.includes('violet')
                            ? '#8b5cf6'
                            : phase.color.includes('emerald')
                            ? '#10b981'
                            : phase.color.includes('amber')
                            ? '#f59e0b'
                            : '#ef4444'
                        }, transparent)`,
                      }}
                    />
                  </div>
                </div>

                {expanded === phase.phase && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-4 rounded-xl space-y-2 bg-white/2 border border-white/5"
                  >
                    {phase.tasks.map((task, j) => (
                      <div key={j} className="flex items-center gap-3 p-2 rounded-lg">
                        {task.done ? (
                          <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Circle size={16} className="text-slate-600 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${task.done ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                          {task.name}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
