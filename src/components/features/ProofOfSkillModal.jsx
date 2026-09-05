import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Award, ArrowRight, RotateCcw, Sparkles, HelpCircle } from 'lucide-react';
import { getSkillAssessment } from '../../utils/aiPipelines';
import { useAuth } from '../../context/AuthContext';

export default function ProofOfSkillModal({ skillName, isOpen, onClose }) {
  const { verifySkill, awardXP } = useAuth();
  const assessment = getSkillAssessment(skillName);

  const [currentStep, setCurrentStep] = useState(0); // 0, 1, 2 for questions, 3 for result
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen || !skillName) return null;

  const questions = assessment.questions || [];
  const currentQ = questions[currentStep];

  const handleSelectOption = (idx) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentStep]: idx }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Evaluate results
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    const status = calculatedScore >= 75 ? 'AI-VERIFIED' : calculatedScore >= 50 ? 'AI-ASSESSED' : 'SELF-DECLARED';

    const evaluationResult = {
      score: calculatedScore,
      correctCount,
      totalCount: questions.length,
      status,
      earnedXP: calculatedScore >= 75 ? 150 : 75,
    };

    // Save to authentic profile state
    verifySkill(skillName, calculatedScore, evaluationResult);

    setResult(evaluationResult);
    setCurrentStep(questions.length); // go to result screen
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers({});
    setResult(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl"
          style={{ background: '#0a1628' }}
        >
          {/* Header gradient banner */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-white/10"
            style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.1))' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Proof of Skill Assessment</h3>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    {skillName}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Verifying competency through targeted diagnostic evaluation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {currentStep < questions.length ? (
              <div>
                {/* Progress Indicators */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>
                    Question <strong className="text-white">{currentStep + 1}</strong> of {questions.length}
                  </span>
                  <span className="text-cyan-400 font-semibold uppercase tracking-wider text-[10px]">
                    {currentQ.type.toUpperCase()} STAGE
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 mb-6">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i < currentStep
                          ? 'bg-cyan-400'
                          : i === currentStep
                          ? 'bg-blue-500'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>

                {/* Question Box */}
                <div className="mb-5">
                  <h4 className="text-sm md:text-base font-semibold text-white leading-relaxed">
                    {currentQ.question}
                  </h4>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentStep] === optIdx;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-3 ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/10'
                            : 'bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/15'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-cyan-400 border-cyan-400 text-black'
                              : 'border-slate-500 text-slate-400'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className={`text-xs md:text-sm leading-relaxed ${isSelected ? 'text-white font-medium' : 'text-slate-300'}`}>
                          {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-white/8">
                  <span className="text-[11px] text-slate-500">
                    Honest assessment • No external hints allowed
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={selectedAnswers[currentStep] === undefined || isSubmitting}
                    className="btn-primary text-xs px-5 py-2.5 rounded-xl font-semibold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                  >
                    {isSubmitting ? (
                      'Evaluating...'
                    ) : currentStep === questions.length - 1 ? (
                      <>
                        Complete &amp; Verify <ShieldCheck size={14} />
                      </>
                    ) : (
                      <>
                        Next Question <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Result Screen */
              <div className="text-center py-4">
                <div
                  className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
                    result?.status === 'AI-VERIFIED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {result?.status === 'AI-VERIFIED' ? <Award size={36} /> : <AlertTriangle size={36} />}
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2 border shadow-sm"
                  style={{
                    background: result?.status === 'AI-VERIFIED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    borderColor: result?.status === 'AI-VERIFIED' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)',
                    color: result?.status === 'AI-VERIFIED' ? '#34d399' : '#fbbf24',
                  }}
                >
                  <Sparkles size={12} /> {result?.status}
                </div>

                <h3 className="text-xl font-bold text-white mb-1">
                  {result?.score}% Score Recorded
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
                  {result?.status === 'AI-VERIFIED'
                    ? `Congratulations! You successfully demonstrated conceptual and applied mastery in ${skillName}. Your profile has been updated with the AI-VERIFIED badge.`
                    : `You answered ${result?.correctCount} of ${result?.totalCount} correctly. Your status is recorded as ${result?.status}. Practice suggested topics and re-test to achieve AI-VERIFIED.`}
                </p>

                {/* Score & XP badge */}
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-6">
                  <div className="p-3 rounded-xl bg-white/4 border border-white/8 text-center">
                    <div className="text-xl font-extrabold text-white">{result?.score}%</div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Test Score</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                    <div className="text-xl font-extrabold text-amber-400">+{result?.earnedXP} XP</div>
                    <div className="text-[10px] text-amber-300/80 uppercase font-semibold">Earned XP</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="btn-ghost text-xs px-4 py-2.5 rounded-xl font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw size={13} /> Retake Test
                  </button>
                  <button
                    onClick={onClose}
                    className="btn-primary text-xs px-6 py-2.5 rounded-xl font-semibold cursor-pointer"
                  >
                    Save &amp; View Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
