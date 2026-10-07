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
      className="relative overflow-hidden border border-blue-100 bg-white shadow-sm"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
        boxShadow: '0 4px 20px rgba(37, 99, 235, 0.06)',
      }}
    >
      {/* Background glow effects */}
      <div
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
      />

      <div className="relative z-10">
        {/* Header pill & title */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-blue-700 border border-blue-200 flex items-center gap-1.5 bg-blue-50"
            >
              <Sparkles size={11} className="text-blue-600 animate-pulse" /> AI CAREER TWIN
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Dynamic Real-Time Career DNA
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>Strictly Verified Data</span>
          </div>
        </div>

        {/* Main Twin Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Holographic Readiness Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-blue-100 text-center shadow-sm">
            <ProgressRing
              percent={twin.careerReadiness}
              size={120}
              strokeWidth={10}
              color="#2563eb"
              label={`${twin.careerReadiness}%`}
              sublabel="READINESS"
            />
            <h4 className="text-base font-bold text-slate-900 mt-3">{twin.studentName}</h4>
            <p className="text-xs text-blue-600 font-semibold mt-0.5">Target: {twin.targetRole}</p>
            <div className="mt-3 flex items-center gap-1 text-[10px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
              <span>Synced with authentic profile</span>
            </div>
          </div>

          {/* Center: Live Profile Evidence Breakdown */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Active Evidence Pillars
            </div>

            {/* Technical Skills */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Technical Skills</div>
                  <div className="text-[11px] text-slate-500">
                    {twin.skillsCount > 0 ? (
                      <>
                        <span className="text-slate-800 font-semibold">{twin.skillsCount}</span> added •{' '}
                        <span className="text-blue-600 font-semibold">{twin.verifiedSkillsCount}</span> verified
                      </>
                    ) : (
                      <span className="text-amber-600 italic">None added yet</span>
                    )}
                  </div>
                </div>
              </div>
              {twin.skillsCount === 0 && (
                <Link to="/account" state={{ edit: true }} className="text-[11px] font-semibold text-blue-600 hover:underline">
                  + Add
                </Link>
              )}
            </div>

            {/* Projects */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                  🚀
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Portfolio Projects</div>
                  <div className="text-[11px] text-slate-500">
                    {twin.projectsCount > 0 ? (
                      <span className="text-slate-800 font-semibold">{twin.projectsCount} Projects Documented</span>
                    ) : (
                      <span className="text-amber-600 italic">No projects provided</span>
                    )}
                  </div>
                </div>
              </div>
              {twin.projectsCount === 0 && (
                <Link to="/account" state={{ edit: true }} className="text-[11px] font-semibold text-purple-600 hover:underline">
                  + Add
                </Link>
              )}
            </div>

            {/* Resume */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                  📄
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Resume Status</div>
                  <div className="text-[11px] text-slate-500">
                    {twin.resumeStatus.includes('✓') ? (
                      <span className="text-emerald-600 font-semibold">{twin.resumeStatus}</span>
                    ) : (
                      <span className="text-amber-600 italic">Upload pending</span>
                    )}
                  </div>
                </div>
              </div>
              {!twin.resumeStatus.includes('✓') && (
                <Link to="/resume" className="text-[11px] font-semibold text-emerald-600 hover:underline">
                  Upload
                </Link>
              )}
            </div>

            {/* Mock Interview */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">
                  🎙️
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">AI Interview Arena</div>
                  <div className="text-[11px] text-slate-500">
                    {twin.interviewCount > 0 ? (
                      <span className="text-slate-800 font-semibold">
                        {twin.interviewCount} Taken • {twin.latestInterviewScore}% Latest
                      </span>
                    ) : (
                      <span className="text-amber-600 italic">No interviews taken</span>
                    )}
                  </div>
                </div>
              </div>
              {twin.interviewCount === 0 && (
                <Link to="/interview" className="text-[11px] font-semibold text-pink-600 hover:underline">
                  Take Test
                </Link>
              )}
            </div>
          </div>

          {/* Right: Career DNA Multi-Dimensional Visualization */}
          <div className="lg:col-span-4 p-4 rounded-2xl bg-white border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                🧬 Career DNA Spectrum
              </span>
              <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">AUTHENTIC</span>
            </div>

            <div className="space-y-2.5">
              {twin.careerDNA.map((dna, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="text-slate-700 font-medium truncate max-w-[150px]">
                      {dna.trait}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {dna.status === 'NOT PROVIDED' ? (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-amber-100 text-amber-700">
                          Not Provided
                        </span>
                      ) : (
                        <>
                          <span className="font-bold text-slate-900">{dna.score}%</span>
                          <span
                            className={`text-[8px] font-bold px-1 rounded uppercase ${
                              dna.status === 'AI-VERIFIED'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {dna.status === 'AI-VERIFIED' ? 'Verified' : 'Provided'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    {dna.score > 0 ? (
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${dna.score}%`,
                          background:
                            dna.status === 'AI-VERIFIED'
                              ? 'linear-gradient(90deg, #2563eb, #06b6d4)'
                              : 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                        }}
                      />
                    ) : (
                      <div className="h-full w-full bg-slate-200" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Zero synthetic assumptions</span>
              <Link to="/account" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                Manage Profile <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
