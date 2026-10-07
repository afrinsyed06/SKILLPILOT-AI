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
    <GlassCard className="relative overflow-hidden border border-blue-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200">
              AUDIT MATRIX
            </span>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity size={18} className="text-emerald-600" /> Placement Readiness Heatmap
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data Trust Architecture: Scores reflect only actual student-submitted evidence.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <ShieldCheck size={14} className="text-emerald-600" />
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
            score >= 80 ? 'border-emerald-200 bg-emerald-50/60' :
            score >= 65 ? 'border-blue-200 bg-blue-50/60' :
            score > 0 ? 'border-amber-200 bg-amber-50/60' :
            'border-slate-200 bg-slate-50/40';

          return (
            <div
              key={pillar.id}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between shadow-sm ${colorLevel}`}
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
                <div className="text-xs font-bold text-slate-900 leading-tight mb-1 truncate" title={pillar.name}>
                  {pillar.name}
                </div>
              </div>

              <div className="mt-3">
                {isProvided ? (
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900">{pillar.score}%</div>
                    <div className="h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
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
                    <div className="text-[11px] text-amber-700 font-medium">Pending Data</div>
                    <Link
                      to="/account"
                      state={{ edit: true }}
                      className="text-[10px] text-blue-600 hover:underline font-semibold mt-0.5 inline-block"
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
        className="p-4 rounded-2xl flex items-start gap-3 border shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
          borderColor: 'rgba(59, 130, 246, 0.25)',
        }}
      >
        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-200">
          <Sparkles size={16} />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-0.5">
            AI Placement Strategic Diagnosis
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {opportunityInsight}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
