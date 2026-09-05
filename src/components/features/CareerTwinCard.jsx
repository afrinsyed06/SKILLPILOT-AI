import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Layers, Award, ArrowRight, AlertCircle, FileText, Mic, CheckCircle2 } from 'lucide-react';
import ProgressRing from '../ui/ProgressRing';
import GlassCard from '../ui/GlassCard';
import { calculateCareerTwin } from '../../utils/aiPipelines';

export default function CareerTwinCard({ profile }) {
  const twin = calculateCareerTwin(profile);

  return (
    <GlassCard
      className="relative overflow-hidden border border-cyan-500/20"
      style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(59, 130, 246, 0.05), rgba(15, 23, 42, 0.7))',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      {/* Background glow effects */}
      <div
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
      />

      <div className="relative z-10">
        {/* Header pill & title */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5"
              style={{ background: 'rgba(6, 182, 212, 0.12)' }}
            >
              <Sparkles size={11} className="text-cyan-400 animate-pulse" /> AI CAREER TWIN
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Dynamic Real-Time Career DNA
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-white/4 px-2.5 py-1 rounded-lg border border-white/5">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>Strictly Verified Data</span>
          </div>
        </div>

        {/* Main Twin Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Holographic Readiness Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-black/25 border border-white/5 text-center">
            <ProgressRing
              percent={twin.careerReadiness}
              size={120}
              strokeWidth={10}
              color="#06b6d4"
              label={`${twin.careerReadiness}%`}
              sublabel="READINESS"
            />
            <h4 className="text-base font-bold text-white mt-3">{twin.studentName}</h4>
            <p className="text-xs text-cyan-300 font-medium mt-0.5">Target: {twin.targetRole}</p>
            <div className="mt-3 flex items-center gap-1 text-[10px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Synced with authentic profile</span>
            </div>
          </div>

          {/* Center: Live Profile Evidence Breakdown */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Active Evidence Pillars
            </div>

            {/* Technical Skills */}
            <div className="p-2.5 rounded-xl bg-white/3 border border-white/6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center text-xs font-bold">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Technical Skills</div>
                  <div className="text-[11px] text-slate-400">
                    {twin.skillsCount > 0 ? (
                      <>
                        <span className="text-white font-semibold">{twin.skillsCount}</span> added •{' '}
                        <span className="text-cyan-300 font-semibold">{twin.verifiedSkillsCount}</span> verified
                      </>
                    ) : (
                      <span className="text-amber-400 italic">None added yet</span>
                    )}
                  </div>
                </div>
              </div>
              {twin.skillsCount === 0 && (
                <Link to="/account" state={{ edit: true }} className="text-[11px] font-semibold text-blue-400 hover:underline">
                  + Add
                </Link>
              )}
            </div>

            {/* Projects */}
            <div className="p-2.5 rounded-xl bg-white/3 border border-white/6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center text-xs font-bold">
                  🚀
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Portfolio Projects</div>
                  <div className="text-[11px] text-slate-400">
                    {twin.projectsCount > 0 ? (
                      <span className="text-white font-semibold">{twin.projectsCount} Projects Documented</span>
                    ) : (
                      <span className="text-amber-400 italic">No projects provided</span>
                    )}
                  </div>
                </div>
              </div>
              {twin.projectsCount === 0 && (
                <Link to="/account" state={{ edit: true }} className="text-[11px] font-semibold text-purple-400 hover:underline">
                  + Add
                </Link>
              )}
            </div>

            {/* Resume */}
            <div className="p-2.5 rounded-xl bg-white/3 border border-white/6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xs font-bold">
                  📄
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Resume Status</div>
                  <div className="text-[11px] text-slate-400">
                    {twin.resumeStatus.includes('✓') ? (
                      <span className="text-emerald-400 font-semibold">{twin.resumeStatus}</span>
                    ) : (
                      <span className="text-amber-400 italic">Upload pending</span>
                    )}
                  </div>
                </div>
              </div>
              {!twin.resumeStatus.includes('✓') && (
                <Link to="/resume" className="text-[11px] font-semibold text-emerald-400 hover:underline">
                  Upload
                </Link>
              )}
            </div>

            {/* Mock Interview */}
            <div className="p-2.5 rounded-xl bg-white/3 border border-white/6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-pink-500/15 text-pink-400 flex items-center justify-center text-xs font-bold">
                  🎙️
                </div>
                <div>
                  <div className="text-xs font-bold text-white">AI Interview Arena</div>
                  <div className="text-[11px] text-slate-400">
                    {twin.interviewCount > 0 ? (
                      <span className="text-white font-semibold">
                        {twin.interviewCount} Taken • {twin.latestInterviewScore}% Latest
                      </span>
                    ) : (
                      <span className="text-amber-400 italic">No interviews taken</span>
                    )}
                  </div>
                </div>
              </div>
              {twin.interviewCount === 0 && (
                <Link to="/interview" className="text-[11px] font-semibold text-pink-400 hover:underline">
                  Take Test
                </Link>
              )}
            </div>
          </div>

          {/* Right: Career DNA Multi-Dimensional Visualization */}
          <div className="lg:col-span-4 p-4 rounded-2xl bg-black/25 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                🧬 Career DNA Spectrum
              </span>
              <span className="text-[10px] text-cyan-400 font-bold">AUTHENTIC</span>
            </div>

            <div className="space-y-2.5">
              {twin.careerDNA.map((dna, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="text-slate-300 font-medium truncate max-w-[150px]">
                      {dna.trait}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {dna.status === 'NOT PROVIDED' ? (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300">
                          Not Provided
                        </span>
                      ) : (
                        <>
                          <span className="font-bold text-white">{dna.score}%</span>
                          <span
                            className={`text-[8px] font-bold px-1 rounded uppercase ${
                              dna.status === 'AI-VERIFIED'
                                ? 'bg-cyan-500/20 text-cyan-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {dna.status === 'AI-VERIFIED' ? 'Verified' : 'Provided'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    {dna.score > 0 ? (
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${dna.score}%`,
                          background:
                            dna.status === 'AI-VERIFIED'
                              ? 'linear-gradient(90deg, #06b6d4, #10b981)'
                              : 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                        }}
                      />
                    ) : (
                      <div className="h-full w-full bg-slate-800" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Zero synthetic assumptions</span>
              <Link to="/account" className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
                Manage Profile <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
