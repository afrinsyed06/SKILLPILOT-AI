import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, CheckCircle2, AlertCircle, ArrowRight, BookOpen, Code2, Award, ChevronRight, X } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { getCareerJourneyPath, getSkillGapActionPlan } from '../../utils/aiPipelines';
import { useAuth } from '../../context/AuthContext';
import ProofOfSkillModal from './ProofOfSkillModal';

export default function CareerJourneyPath() {
  const { profile } = useAuth();
  const targetRole = profile?.targetRole || 'AI/ML Engineer';

  const steps = getCareerJourneyPath(targetRole, profile);
  const [selectedSkill, setSelectedSkill] = useState(steps[0]?.name || 'Python & OOP');
  const [assessmentSkill, setAssessmentSkill] = useState(null);

  const activePlan = getSkillGapActionPlan(selectedSkill.split(' ')[0], targetRole, 65);

  return (
    <GlassCard className="relative overflow-hidden border border-white/10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20">
              CAREER ROADMAP
            </span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass size={18} className="text-violet-400" /> Career Path Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Interactive milestone trajectory targeting <strong className="text-white">{targetRole}</strong>. Click any milestone to inspect action plan.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/8">
          Role: <span className="text-cyan-300">{targetRole}</span>
        </div>
      </div>

      {/* Horizontal / Flow Stepper */}
      <div className="mb-6 overflow-x-auto pb-3 scrollbar-thin">
        <div className="flex items-center gap-2 min-w-[680px]">
          {steps.map((step, idx) => {
            const isSelected = selectedSkill === step.name;
            const isVerified = step.status === 'verified';
            const isProvided = step.status === 'provided';

            return (
              <div key={idx} className="flex items-center flex-1">
                <button
                  onClick={() => setSelectedSkill(step.name)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-violet-400 bg-violet-500/15 shadow-lg shadow-violet-500/20'
                      : isVerified
                      ? 'border-emerald-500/30 bg-emerald-500/8 hover:bg-emerald-500/15'
                      : isProvided
                      ? 'border-amber-500/30 bg-amber-500/8 hover:bg-amber-500/15'
                      : 'border-white/8 bg-white/3 hover:bg-white/6'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-lg">{step.icon}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        isVerified
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isProvided
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {step.statusLabel}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white truncate max-w-[120px]">
                    {step.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                    <span>Target</span>
                    <span className="font-semibold text-white">{step.req}%</span>
                  </div>
                </button>

                {idx < steps.length - 1 && (
                  <ChevronRight size={16} className="text-slate-600 mx-1 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Milestone Deep-Dive Inspection Card */}
      <div
        className="p-5 rounded-2xl border"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(15,23,42,0.8))',
          borderColor: 'rgba(139,92,246,0.25)',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-xs font-semibold text-violet-300 uppercase tracking-wider mb-0.5">
              Milestone Focus Detail
            </div>
            <h4 className="text-base font-bold text-white">{selectedSkill}</h4>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAssessmentSkill(selectedSkill.split(' ')[0])}
              className="btn-primary text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-violet-500/20"
            >
              <Award size={14} /> Take AI Proof Test
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Why It Matters */}
          <div className="p-3.5 rounded-xl bg-white/4 border border-white/8">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span>🎯</span> Why It Matters
            </div>
            <p className="text-slate-300 leading-relaxed">
              {activePlan.whyItMatters}
            </p>
          </div>

          {/* What to Learn */}
          <div className="p-3.5 rounded-xl bg-white/4 border border-white/8">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <BookOpen size={13} className="text-cyan-400" /> What to Learn
            </div>
            <ul className="space-y-1.5 text-slate-300">
              {activePlan.whatToLearn.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What to Practice */}
          <div className="p-3.5 rounded-xl bg-white/4 border border-white/8">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Code2 size={13} className="text-amber-400" /> What to Practice
            </div>
            <p className="text-slate-300 leading-relaxed mb-2">
              {activePlan.whatToPractice}
            </p>
            <div className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2 py-1 rounded inline-block">
              Target: {activePlan.practiceTarget}
            </div>
          </div>
        </div>
      </div>

      {/* Proof of Skill Modal Integration */}
      {assessmentSkill && (
        <ProofOfSkillModal
          skillName={assessmentSkill}
          isOpen={Boolean(assessmentSkill)}
          onClose={() => setAssessmentSkill(null)}
        />
      )}
    </GlassCard>
  );
}
