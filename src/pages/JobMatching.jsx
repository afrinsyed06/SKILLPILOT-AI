import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Clock, ExternalLink, BookmarkPlus, Briefcase, Plus, Sparkles, Target, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import JobReadinessSimulator from '../components/features/JobReadinessSimulator';
import { jobs } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function JobMatching() {
  const { profile } = useAuth();
  const targetRole = profile?.targetRole || 'Software Developer';
  const userSkills = Array.isArray(profile?.skills) ? profile.skills : [];

  const [activeTab, setActiveTab] = useState('matches'); // 'matches' | 'simulator'
  const [filter, setFilter] = useState('All');

  // Compute dynamic match for each job based on user's authentic skills
  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase());
  const evaluatedJobs = jobs.map((job) => {
    let matched = 0;
    const matching = [];
    const missing = [];

    job.skills.forEach((reqSkill) => {
      const has = normalizedUserSkills.some((us) =>
        us.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(us)
      );
      if (has) {
        matched++;
        matching.push(reqSkill);
      } else {
        missing.push(reqSkill);
      }
    });

    const matchScore =
      userSkills.length === 0
        ? 45
        : Math.min(Math.max(Math.round((matched / job.skills.length) * 100), 30), 96);

    return {
      ...job,
      match: matchScore,
      matchingSkills: matching,
      missingSkills: missing,
      whyMatches:
        matching.length > 0
          ? `Your profile provides ${matching.join(', ')}, satisfying ${matching.length} of ${job.skills.length} core hiring criteria for this role.`
          : `This role targets candidates with ${job.skills.slice(0, 3).join(', ')}. Add skills you know to improve alignment.`,
      howToImprove:
        missing.length > 0
          ? `Acquire and verify competency in ${missing.slice(0, 2).join(' and ')} to elevate your match score above 85%.`
          : 'Profile fully satisfies the core listed technology stack for this posting.',
    };
  });

  const filters = ['All', 'Full-time', 'Internship'];
  const filtered = filter === 'All' ? evaluatedJobs : evaluatedJobs.filter((j) => j.type === filter);
  const [selected, setSelected] = useState(filtered[0] || evaluatedJobs[0]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
              HIRING INTELLIGENCE
            </span>
            <span className="text-xs text-slate-400">Target Role: <strong className="text-white">{targetRole}</strong></span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Job Matching &amp; <span className="gradient-text">Readiness Simulator</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Transparent job compatibility scoring and end-to-end simulated placement rounds.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'matches'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Personalized Job Matches
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target size={13} /> Hiring Readiness Simulator
          </button>
        </div>
      </div>

      {activeTab === 'simulator' ? (
        <JobReadinessSimulator />
      ) : (
        <>
          {/* Subheader controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filter === f ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'btn-ghost'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-white/4 px-3 py-1.5 rounded-xl border border-white/8">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Evaluated against {userSkills.length} provided skills</span>
            </div>
          </div>

          {userSkills.length === 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between gap-4">
              <span>
                💡 You have not declared any technical skills yet. Add your skills to unlock authentic match scores and gap analysis.
              </span>
              <Link to="/account" state={{ edit: true }} className="btn-primary text-xs px-3 py-1.5 whitespace-nowrap">
                <Plus size={12} className="inline mr-1" /> Add Skills
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Job List */}
            <div className="lg:col-span-2 space-y-3">
              {filtered.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(job)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                    selected?.id === job.id
                      ? 'border-blue-500/40 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                      : 'glass-card-hover border-white/6'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${job.logoColor} flex items-center justify-center text-lg font-bold text-white flex-shrink-0`}
                    >
                      {job.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-white truncate">{job.title}</h4>
                        <span
                          className={`text-xs font-black flex-shrink-0 ${
                            job.match >= 80 ? 'text-emerald-400' : job.match >= 60 ? 'text-amber-400' : 'text-slate-400'
                          }`}
                        >
                          {job.match}% Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{job.company}</p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                        <span>•</span>
                        <span className="text-cyan-300 font-medium">{job.salary}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Selected Job Details */}
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-3 space-y-4"
              >
                {/* Header Card */}
                <div
                  className="p-6 rounded-3xl border relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.7))',
                    borderColor: 'rgba(59,130,246,0.25)',
                  }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selected.logoColor} flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-lg`}
                    >
                      {selected.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-white">{selected.title}</h2>
                      <p className="text-slate-300 font-medium text-sm">{selected.company}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} /> {selected.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase size={11} /> {selected.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> Posted {selected.posted}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div
                        className={`text-3xl font-extrabold ${
                          selected.match >= 80 ? 'text-emerald-400' : selected.match >= 65 ? 'text-amber-400' : 'text-slate-400'
                        }`}
                      >
                        {selected.match}%
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Profile Match</div>
                    </div>
                  </div>

                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${selected.match}%`,
                        background:
                          selected.match >= 80
                            ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                            : 'linear-gradient(90deg, #f59e0b, #fb923c)',
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{selected.salary}</span>
                    <span className="text-slate-400">Application Deadline: {selected.deadline}</span>
                  </div>
                </div>

                {/* Feature 9 & 16: Explainable Matching Details */}
                <GlassCard>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-cyan-400" /> Why This Matches Your Profile
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {selected.whyMatches}
                  </p>

                  <div className="mb-4">
                    <div className="text-xs font-semibold text-slate-400 mb-2">Required Core Competencies</div>
                    <div className="flex flex-wrap gap-2">
                      {selected.skills.map((skill) => {
                        const has = normalizedUserSkills.some((us) =>
                          us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us)
                        );
                        return (
                          <span
                            key={skill}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1 ${
                              has
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                            }`}
                          >
                            {has ? '✓' : '⚠'} {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {selected.missingSkills?.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-500/8 border border-amber-500/20 text-xs">
                      <div className="font-bold text-amber-300 mb-1">Action to Improve Match:</div>
                      <p className="text-slate-300 leading-relaxed">
                        {selected.howToImprove}
                      </p>
                    </div>
                  )}
                </GlassCard>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold cursor-pointer shadow-lg shadow-blue-500/25">
                    Apply Directly <ExternalLink size={15} />
                  </button>
                  <button className="btn-ghost px-4 py-3 flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    <BookmarkPlus size={16} /> Save Role
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
