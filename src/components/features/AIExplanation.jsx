import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, ArrowRight, Zap, Lightbulb, Compass, Award } from 'lucide-react';

export default function AIExplanation({
  isCorrect = true,
  earnedXP = 50,
  skillXP = 10,
  bonusXP = 0,
  nextCombo = 1,
  question = {},
  onNext,
}) {
  const whyNotOthers = question.why_not_others || {};
  const hasDistractors = Object.keys(whyNotOthers).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`p-6 rounded-2xl border space-y-5 ${
        isCorrect
          ? 'bg-[#061c20]/90 border-emerald-500/35 shadow-[0_10px_30px_rgba(16,185,129,0.1)]'
          : 'bg-[#1c0d15]/90 border-red-500/35 shadow-[0_10px_30px_rgba(239,68,68,0.1)]'
      }`}
    >
      {/* ── Status Header & XP Breakdown ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          {isCorrect ? (
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle size={22} />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertCircle size={22} />
            </div>
          )}
          <div>
            <h3 className={`text-lg font-black tracking-wide ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
              {isCorrect ? 'CORRECT! 🎯' : 'INCORRECT 💡'}
            </h3>
            <p className="text-xs text-slate-400">
              {isCorrect
                ? 'Great execution! Concept reinforcement logged to your career profile.'
                : 'Concept missed. Review the explanation below to master this topic.'}
            </p>
          </div>
        </div>

        {/* Earned Rewards Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {isCorrect && (
            <>
              <span className="px-3 py-1 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-black flex items-center gap-1">
                <Zap size={13} className="fill-amber-300" />
                +{earnedXP} XP
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold">
                +{skillXP} Skill XP
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                +1 Correct
              </span>
              {nextCombo > 1 && (
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
                  🔥 {nextCombo}x Combo
                </span>
              )}
            </>
          )}
          {!isCorrect && (
            <span className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-400 text-xs font-semibold">
              Combo Reset
            </span>
          )}
        </div>
      </div>

      {/* ── Section: WHY? ── */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <Lightbulb size={14} />
          WHY?
        </div>
        <p className="text-sm text-slate-200 leading-relaxed font-normal bg-black/20 p-3.5 rounded-xl border border-white/5">
          {question.why}
        </p>
      </div>

      {/* ── Section: WHY NOT THE OTHERS? ── */}
      {hasDistractors && (
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span>❌</span> WHY NOT THE OTHERS?
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(whyNotOthers).map(([distractor, rationale]) => (
              <div
                key={distractor}
                className="p-3 rounded-xl bg-white/3 border border-white/6 text-xs space-y-1"
              >
                <span className="font-bold text-slate-300 block">{distractor}:</span>
                <span className="text-slate-400 leading-relaxed">{rationale}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Concept & Recommended Next ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400 border-t border-white/10">
        <div className="flex items-center gap-3">
          {question.concept && (
            <span className="flex items-center gap-1 text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              <Award size={13} /> Concept: {question.concept}
            </span>
          )}
          {question.skill && (
            <span className="text-slate-400">
              Skill Tested: <strong className="text-slate-200">{question.skill}</strong>
            </span>
          )}
        </div>

        {question.recommended_next && (
          <div className="text-slate-400 flex items-center gap-1 text-[11px]">
            <Compass size={12} className="text-purple-400" />
            Next: <span className="text-purple-300 font-semibold">{question.recommended_next}</span>
          </div>
        )}
      </div>

      {/* ── NEXT QUESTION ACTION BUTTON ── */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="btn-primary flex items-center gap-2 px-6 py-3 font-bold text-sm cursor-pointer shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
        >
          <span>NEXT QUESTION</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}
