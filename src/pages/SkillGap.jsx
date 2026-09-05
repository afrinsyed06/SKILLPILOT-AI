import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertCircle, Plus, Sparkles, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import ProofOfSkillModal from '../components/features/ProofOfSkillModal';
import { useAuth } from '../context/AuthContext';
import { analyzeSkillGaps } from '../utils/aiPipelines';

const statusInfo = {
  ready: { label: '✅ Strong', class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', bar: '#10b981' },
  improve: { label: '🟡 Improve', class: 'bg-amber-500/15 text-amber-400 border-amber-500/25', bar: '#f59e0b' },
  gap: { label: '🔴 Gap', class: 'bg-red-500/15 text-red-400 border-red-500/25', bar: '#ef4444' },
};

export default function SkillGap() {
  const { profile } = useAuth();
  const targetRole = profile?.targetRole || 'AI/ML Engineer';
  const userSkills = Array.isArray(profile?.skills) ? profile.skills : [];
  const verifiedSkills = Array.isArray(profile?.verifiedSkills) ? profile.verifiedSkills : [];
  const [verifySkillName, setVerifySkillName] = useState(null);

  const analysis = analyzeSkillGaps(userSkills, targetRole);

  if (!analysis.hasData) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Skill Gap <span className="gradient-text">Analyzer</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            AI comparison of your actual skills vs. your target role requirements
          </p>
        </div>

        <GlassCard className="text-center py-12 px-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4 text-blue-400">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Technical Skills Not Provided Yet</h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
            The AI does not assume or estimate skills you have not provided. Add the programming languages,
            frameworks, and tools you actually know to unlock a personalized Skill Gap Analysis for{' '}
            <strong className="text-white">{targetRole}</strong>.
          </p>
          <Link
            to="/account"
            state={{ edit: true }}
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
          >
            <Plus size={16} /> Add Technical Skills to Profile
          </Link>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Skill Gap <span className="gradient-text">Analyzer</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Data-driven comparison based strictly on the {userSkills.length} skills in your profile
        </p>
      </div>

      {/* Target Role Banner */}
      <div
        className="p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.1))',
          border: '1px solid rgba(59,130,246,0.2)',
        }}
      >
        <div>
          <div className="text-xs text-blue-300 mb-1">Active Target Role</div>
          <div className="text-xl font-bold text-white flex items-center gap-2">
            🎯 {targetRole}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Analyzing {userSkills.length} provided skill{userSkills.length > 1 ? 's' : ''}: {userSkills.join(', ')}
          </p>
        </div>
        <div className="flex gap-5">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{analysis.readyCount}</div>
            <div className="text-xs text-slate-400">Strong</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">{analysis.improveCount}</div>
            <div className="text-xs text-slate-400">Improve</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{analysis.gapCount}</div>
            <div className="text-xs text-slate-400">Gap</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Skill Gap Table */}
        <div className="lg:col-span-3">
          <GlassCard className="p-0 overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Your Skills vs Benchmark Requirements</h3>
              <Link to="/account" state={{ edit: true }} className="text-xs text-blue-400 hover:underline">
                Edit Skills
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {analysis.skills.map((item, i) => {
                const info = statusInfo[item.status];
                const verifiedObj = verifiedSkills.find(
                  (vs) => vs.name.toLowerCase() === item.skill.toLowerCase()
                );
                const isVerified = verifiedObj?.status === 'AI-VERIFIED';
                const isAssessed = verifiedObj?.status === 'AI-ASSESSED';

                return (
                  <motion.div
                    key={item.skill}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4.5 hover:bg-white/2 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{item.skill}</span>
                        {isVerified ? (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            ✓ AI-VERIFIED ({verifiedObj.score}%)
                          </span>
                        ) : isAssessed ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            🟡 AI-ASSESSED ({verifiedObj.score}%)
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                            SELF-DECLARED
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className="text-xs text-slate-400">
                          {item.gap > 0 ? `Gap: ${item.gap}%` : 'Benchmark Met'}
                        </span>
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${info.class}`}>
                          {info.label}
                        </span>
                        <button
                          onClick={() => setVerifySkillName(item.skill)}
                          className="btn-primary text-xs px-3 py-1 rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Award size={12} /> {isVerified ? 'Re-Verify' : 'Prove Skill'}
                        </button>
                      </div>
                    </div>

                    <div className="relative h-2 bg-white/5 rounded-full overflow-hidden mt-2">
                      {/* Required benchmark indicator */}
                      <div
                        className="absolute top-0 h-full w-0.5 bg-white/30 z-10"
                        style={{ left: `${item.required}%` }}
                        title={`Required: ${item.required}%`}
                      />
                      {/* Current skill level bar */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.current}%` }}
                        transition={{ duration: 1.2, delay: i * 0.06 }}
                        className="h-full rounded-full"
                        style={{ background: isVerified ? '#10b981' : info.bar }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[11px] text-slate-400">
                        Evaluated Level: <strong className="text-white">{item.current}%</strong>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Target Requirement: <strong className="text-white">{item.required}%</strong>
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Radar + Priority Actions */}
        <div className="lg:col-span-2 space-y-5">
          {/* Radar Chart */}
          <GlassCard>
            <h3 className="text-base font-bold text-white mb-3">Skill Radar Comparison</h3>
            <ResponsiveContainer width="100%" height={230}>
              <RadarChart data={analysis.radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Radar
                  name="Required"
                  dataKey="required"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.1}
                  strokeDasharray="4 2"
                />
                <Radar name="Current" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                <Tooltip
                  contentStyle={{
                    background: '#0f1629',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#fff',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 justify-center mt-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1 bg-blue-500 rounded" /> Your Level
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1 bg-red-500 rounded border-dashed" /> Required Benchmark
              </div>
            </div>
          </GlassCard>

          {/* Priority Actions */}
          <GlassCard>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" /> Data-Driven Next Actions
            </h3>
            <div className="space-y-3">
              {analysis.priorityActions.map((item, i) => (
                <div key={i} className={`p-3 rounded-xl ${item.bg} border border-white/5`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold text-white">{item.skill}</span>
                    <span className={`text-[11px] font-bold ${item.color}`}>{item.urgency} Urgency</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.action}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Proof of Skill Assessment Modal */}
      {verifySkillName && (
        <ProofOfSkillModal
          skillName={verifySkillName}
          isOpen={Boolean(verifySkillName)}
          onClose={() => setVerifySkillName(null)}
        />
      )}
    </motion.div>
  );
}
