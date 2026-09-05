import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronRight, TrendingUp, DollarSign, Building2, CheckCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import ProgressRing from '../components/ui/ProgressRing';
import { useAuth } from '../context/AuthContext';
import { matchCareerPaths } from '../utils/aiPipelines';

export default function CareerDiscovery() {
  const { profile, updateProfile } = useAuth();
  const targetRole = profile?.targetRole || 'AI/ML Engineer';
  const userSkills = Array.isArray(profile?.skills) ? profile.skills : [];

  const { hasSkills, paths } = matchCareerPaths(userSkills, targetRole);
  const [selected, setSelected] = useState(paths[0] || null);
  const [updatedTarget, setUpdatedTarget] = useState(false);

  const handleSetTarget = (roleTitle) => {
    updateProfile({ targetRole: roleTitle });
    setUpdatedTarget(true);
    setTimeout(() => setUpdatedTarget(false), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Career <span className="gradient-text">Discovery</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Data-driven career compatibility calculated strictly from your {userSkills.length} provided skills
          </p>
        </div>
        {userSkills.length === 0 && (
          <Link
            to="/account"
            state={{ edit: true }}
            className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Skills for Exact Matching
          </Link>
        )}
      </div>

      {updatedTarget && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center gap-2"
        >
          <CheckCircle size={15} /> Target career role updated to "{selected?.title}"! All AI modules are re-calibrated.
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Career Cards List */}
        <div className="space-y-3">
          {paths.map((path, i) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelected(path)}
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                selected?.id === path.id
                  ? 'border border-blue-500/40 bg-blue-500/10'
                  : 'glass-card-hover'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center text-lg flex-shrink-0`}
                >
                  {path.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                    {path.title}
                    {path.title === targetRole && (
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded font-normal">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">{path.salary}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className={`text-base font-bold ${
                      path.match >= 80 ? 'text-emerald-400' : path.match >= 65 ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  >
                    {path.match}%
                  </div>
                  <div className="text-[11px] text-slate-500">Match</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Panel */}
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Header */}
            <div
              className="relative overflow-hidden p-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.08))',
                border: '1px solid rgba(59,130,246,0.2)',
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selected.color} flex items-center justify-center text-3xl shadow-lg`}
                  >
                    {selected.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {selected.title}
                      {selected.title === targetRole && (
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          ✓ Your Selected Target Role
                        </span>
                      )}
                    </h2>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <DollarSign size={13} /> {selected.salary}
                      </span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <TrendingUp size={13} /> {selected.demand} Demand
                      </span>
                    </div>
                  </div>
                </div>

                <ProgressRing
                  percent={selected.match}
                  size={75}
                  strokeWidth={6}
                  color={selected.match >= 80 ? '#10b981' : selected.match >= 65 ? '#f59e0b' : '#6366f1'}
                  label={`${selected.match}%`}
                  sublabel="Match"
                />
              </div>

              {/* AI Explanation */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <div className="flex items-start gap-2">
                  <span className="text-base">🤖</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{selected.reason}</p>
                </div>
              </div>
            </div>

            {/* Required Skills */}
            <GlassCard>
              <h3 className="text-base font-bold text-white mb-3">Key Role Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selected.skills.map((skill) => {
                  const userHas = userSkills.some((us) => us.toLowerCase().includes(skill.toLowerCase()));
                  return (
                    <span
                      key={skill}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
                        userHas
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                          : 'bg-white/5 text-slate-300 border-white/10'
                      }`}
                    >
                      {userHas ? '✓ ' : ''}{skill}
                    </span>
                  );
                })}
              </div>
            </GlassCard>

            {/* Top Companies */}
            <GlassCard>
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Building2 size={16} className="text-slate-400" /> Active Hiring Companies
              </h3>
              <div className="flex flex-wrap gap-2">
                {selected.companies.map((company) => (
                  <div
                    key={company}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-white/4 border border-white/8"
                  >
                    {company}
                  </div>
                ))}
              </div>
            </GlassCard>

            {selected.title !== targetRole && (
              <button
                onClick={() => handleSetTarget(selected.title)}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer"
              >
                Set as Active Target Role &amp; Re-calibrate AI <ChevronRight size={16} />
              </button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
