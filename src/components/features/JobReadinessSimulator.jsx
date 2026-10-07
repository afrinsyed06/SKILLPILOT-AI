import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, CheckCircle2, AlertCircle, ArrowRight, TrendingUp, AlertTriangle, ShieldCheck, Target } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { simulateJobReadiness } from '../../utils/aiPipelines';
import { useAuth } from '../../context/AuthContext';

const SIMULATOR_ROLES = [
  'Software Developer',
  'AI/ML Engineer',
  'Data Analyst',
  'Full Stack Developer',
  'DevOps Engineer',
];

export default function JobReadinessSimulator() {
  const { profile } = useAuth();
  const [selectedRole, setSelectedRole] = useState(profile?.targetRole || 'Software Developer');

  const simulation = simulateJobReadiness(profile, selectedRole);

  return (
    <GlassCard className="relative overflow-hidden border border-blue-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200">
              HIRING SIMULATION
            </span>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Target size={18} className="text-blue-600" /> Job Readiness Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulates end-to-end placement hiring rounds based strictly on your verified student profile.
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="simRole" className="text-xs text-slate-600 font-medium">Target Role:</label>
          <select
            id="simRole"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-blue-200 text-slate-800 outline-none focus:border-blue-500 shadow-sm"
          >
            {SIMULATOR_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Readiness Gauge + Bottleneck Alert */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6 items-center">
        <div className="md:col-span-4 p-5 rounded-2xl bg-blue-50/60 border border-blue-100 text-center flex flex-col items-center justify-center">
          <div className="text-4xl font-extrabold text-blue-900 mb-1">
            {simulation.finalReadiness}%
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            Overall Hiring Readiness
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Benchmark for {selectedRole}
          </div>
          <div className="mt-3 px-3 py-1 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-blue-200 shadow-sm">
            {simulation.finalReadiness >= 75 ? '🟢 Competitive Candidate' : '🟡 Developing Candidacy'}
          </div>
        </div>

        {/* Weakness Diagnostic Banner */}
        <div className="md:col-span-8 p-5 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
              <AlertTriangle size={15} /> Primary Placement Bottleneck Detected
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              Your biggest current weakness is: <span className="text-rose-600">{simulation.biggestWeakness.roundName}</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {simulation.biggestWeakness.advice}
            </p>
          </div>
          <div>
            <Link
              to={simulation.biggestWeakness.actionPath}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-md shadow-rose-600/30"
            >
              Resolve Bottleneck: {simulation.biggestWeakness.actionText} <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* 5-Round Simulation Breakdown */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Simulated 5-Round Hiring Sequence
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {simulation.rounds.map((round) => {
            const isPassed = round.score >= 70;
            return (
              <div
                key={round.roundNumber}
                className={`p-3.5 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-3 ${
                  isPassed
                    ? 'bg-slate-50/70 border-slate-200/80 hover:bg-white'
                    : 'bg-rose-50/50 border-rose-200 hover:bg-rose-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-base flex-shrink-0">
                    {round.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-semibold">Round {round.roundNumber}</span>
                      <span className="text-sm font-bold text-slate-900">{round.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{round.status}</div>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="flex-1 min-w-[150px] max-w-xs">
                  <div className="flex justify-between items-center text-[10px] mb-1">
                    <span className="text-slate-500">Score</span>
                    <span className="font-bold text-slate-800">{round.score}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${round.score}%`,
                        background: isPassed
                          ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                          : 'linear-gradient(90deg, #ef4444, #f59e0b)',
                      }}
                    />
                  </div>
                </div>

                {/* Action Link */}
                <Link
                  to={round.actionPath}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 ${
                    isPassed
                      ? 'border-slate-200 text-slate-700 hover:text-blue-700 hover:bg-white bg-white shadow-sm'
                      : 'border-rose-200 text-rose-700 bg-white hover:bg-rose-50 shadow-sm'
                  }`}
                >
                  {round.actionText} <ArrowRight size={12} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-emerald-600" />
          <span>Zero synthetic assumptions • Based only on provided data</span>
        </div>
        <span>Target benchmark: 70%+ per round</span>
      </div>
    </GlassCard>
  );
}
