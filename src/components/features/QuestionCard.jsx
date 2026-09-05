import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, CheckCircle } from 'lucide-react';
import AnswerOption from './AnswerOption';
import AIExplanation from './AIExplanation';
import ComboIndicator from './ComboIndicator';

export default function QuestionCard({
  question = {},
  questionIndex = 0,
  totalQuestions = 10,
  combo = 0,
  multiplier = 1.0,
  bonusXP = 0,
  onAnswerSubmit,
  onNextQuestion,
  timeLimit = null,
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // Reset local state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setEvaluation(null);
    setTimeLeft(timeLimit);
  }, [question.id, timeLimit]);

  // Optional countdown timer
  useEffect(() => {
    if (!timeLimit || evaluation) return;
    if (timeLeft <= 0) {
      // Auto-submit on timeout
      handleSubmit(selectedAnswer || '__TIMEOUT__');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLimit, timeLeft, evaluation, selectedAnswer]);

  const handleSubmit = (ansOverride) => {
    const finalAnswer = ansOverride !== undefined ? ansOverride : selectedAnswer;
    if (!finalAnswer && finalAnswer !== '__TIMEOUT__') return;

    const result = onAnswerSubmit(finalAnswer);
    setEvaluation(result);
  };

  const isAnswered = Boolean(evaluation);

  return (
    <div className="space-y-6">
      {/* ── Arena Header Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#091526] border border-white/8">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 font-mono font-bold text-xs">
            QUESTION #{questionIndex + 1} OF {totalQuestions}
          </span>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            {question.topic}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ComboIndicator combo={combo} multiplier={multiplier} bonusXP={bonusXP} />

          {timeLimit && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold ${
              timeLeft <= 10 ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500/30' : 'bg-white/5 text-slate-300'
            }`}>
              <Clock size={13} />
              <span>{timeLeft}s</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
            <Zap size={13} className="fill-amber-400" />
            +{question.xp_reward || 50} XP
          </div>
        </div>
      </div>

      {/* ── Question Body Card ── */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-[#0c182b] to-[#070e1a] border border-white/10 shadow-2xl space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
              question.difficulty === 'Easy'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : question.difficulty === 'Hard' || question.difficulty === 'Boss'
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
            }`}>
              {question.difficulty}
            </span>
            <span className="text-xs text-slate-400">• {question.type?.toUpperCase()}</span>
          </div>

          <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Optional Code Snippet */}
        {question.code_snippet && (
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#040810] shadow-inner font-mono text-xs">
            <div className="px-4 py-2 bg-white/5 border-b border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Code Snippet</span>
              <span className="text-[10px] text-slate-500">Read &amp; analyze carefully</span>
            </div>
            <pre className="p-4 text-cyan-300 overflow-x-auto leading-relaxed">
              <code>{question.code_snippet}</code>
            </pre>
          </div>
        )}

        {/* Answer Options */}
        <div className="space-y-3 pt-2">
          {question.options?.map((optionText, idx) => (
            <AnswerOption
              key={optionText}
              index={idx}
              text={optionText}
              selected={selectedAnswer === optionText}
              isAnswered={isAnswered}
              isCorrect={String(optionText).trim().toLowerCase() === String(question.correct_answer).trim().toLowerCase()}
              disabled={isAnswered}
              onClick={() => setSelectedAnswer(optionText)}
            />
          ))}
        </div>

        {/* Submit Action */}
        {!isAnswered && (
          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="button"
              disabled={!selectedAnswer}
              onClick={() => handleSubmit()}
              className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                selectedAnswer
                  ? 'btn-primary cursor-pointer shadow-lg shadow-blue-500/25 active:scale-95'
                  : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
              }`}
            >
              <CheckCircle size={16} />
              <span>SUBMIT ANSWER</span>
            </button>
          </div>
        )}
      </div>

      {/* ── AI Explanation Section (Reveals after answer) ── */}
      {isAnswered && (
        <AIExplanation
          isCorrect={evaluation.isCorrect}
          earnedXP={evaluation.earnedXP}
          skillXP={evaluation.skillXP}
          bonusXP={evaluation.bonusXP}
          nextCombo={evaluation.nextCombo}
          question={question}
          onNext={onNextQuestion}
        />
      )}
    </div>
  );
}
