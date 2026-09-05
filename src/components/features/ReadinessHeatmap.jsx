import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { getReadinessHeatmap } from '../../utils/aiPipelines';
import { useAuth } from '../../context/AuthContext';

export default function ReadinessHeatmap() {
  const { profile } = useAuth();
  const { pillars, opportunityInsight } = getReadinessHeatmap(profile);

  const getTrustBadgeClass = (status) => {
    switch (status) {
      case 'AI-VERIFIED':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25';
      case 'ASSESSED':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25';
      case 'AI ANALYZED':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/25';
      case 'PROVIDED':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/25';
      case 'NOT PROVIDED':
      default:
        return 'bg-amber-500/15 text-amber-400 border-amber-500/25';
    }
  };

  return (
    <GlassCard className="relative overflow-hidden border border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              AUDIT MATRIX
            </span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-emerald-400" /> Placement Readiness Heatmap
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Data Trust Architecture: Scores reflect only actual student-submitted evidence.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/4 px-3 py-1.5 rounded-xl border border-white/8">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Zero Synthetic Bias</span>
        </div>
      </div>

      {/* 7-Pillar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 mb-6">
        {pillars.map((pillar) => {
          const isProvided = pillar.score !== null;
          const score = pillar.score || 0;

          // Color scale
          const colorLevel =
            score >= 80 ? 'border-emerald-500/40 bg-emerald-500/10' :
            score >= 65 ? 'border-blue-500/40 bg-blue-500/10' :
            score > 0 ? 'border-amber-500/40 bg-amber-500/10' :
            'border-white/5 bg-white/2';

          return (
            <div
              key={pillar.id}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${colorLevel}`}
            >
              <div>
                <div className="flex items-center justify-between text-base mb-2">
                  <span>{pillar.icon}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getTrustBadgeClass(
                      pillar.trustStatus
                    )}`}
                  >
                    {pillar.trustStatus}
                  </span>
                </div>
                <div className="text-xs font-bold text-white leading-tight mb-1 truncate" title={pillar.name}>
                  {pillar.name}
                </div>
              </div>

              <div className="mt-3">
                {isProvided ? (
                  <div>
                    <div className="text-2xl font-extrabold text-white">{pillar.score}%</div>
                    <div className="h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pillar.score}%`,
                          backgroundColor: pillar.color,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <div className="text-[11px] text-amber-400/90 font-medium">Pending Data</div>
                    <Link
                      to="/account"
                      state={{ edit: true }}
                      className="text-[10px] text-cyan-400 hover:underline font-semibold mt-0.5 inline-block"
                    >
                      + Add Now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Diagnostic Opportunity Insight Banner */}
      <div
        className="p-4 rounded-2xl flex items-start gap-3 border"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.05))',
          borderColor: 'rgba(59, 130, 246, 0.25)',
        }}
      >
        <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles size={16} />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-0.5">
            AI Placement Strategic Diagnosis
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {opportunityInsight}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
