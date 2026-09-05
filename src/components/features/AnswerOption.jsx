import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export default function AnswerOption({
  index = 0,
  text = '',
  selected = false,
  isAnswered = false,
  isCorrect = false,
  disabled = false,
  onClick,
}) {
  const letter = LETTERS[index] || String(index + 1);

  let stateStyle = 'border-white/10 bg-[#0c192c] hover:border-blue-500/40 hover:bg-[#0f213a] text-slate-200';
  let badgeStyle = 'bg-white/10 text-slate-300 border border-white/10';

  if (isAnswered) {
    if (isCorrect) {
      stateStyle = 'border-emerald-500/70 bg-emerald-500/15 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
      badgeStyle = 'bg-emerald-500 text-slate-950 font-black';
    } else if (selected) {
      stateStyle = 'border-red-500/70 bg-red-500/15 text-red-100 animate-shake';
      badgeStyle = 'bg-red-500 text-white font-black';
    } else {
      stateStyle = 'border-white/5 bg-[#081220]/50 text-slate-500 opacity-60';
      badgeStyle = 'bg-white/5 text-slate-600 border border-white/5';
    }
  } else if (selected) {
    stateStyle = 'border-cyan-400 bg-cyan-500/15 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]';
    badgeStyle = 'bg-cyan-400 text-slate-950 font-black';
  }

  return (
    <motion.button
      type="button"
      whileHover={!disabled ? { scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-4 rounded-xl border flex items-start gap-3.5 text-left transition-all cursor-pointer relative ${stateStyle}`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${badgeStyle}`}>
        {letter}
      </div>

      <div className="flex-1 min-w-0 pt-0.5 text-sm font-medium leading-relaxed">
        {text}
      </div>

      {isAnswered && (
        <div className="flex-shrink-0 pt-0.5">
          {isCorrect && <CheckCircle size={18} className="text-emerald-400" />}
          {!isCorrect && selected && <XCircle size={18} className="text-red-400" />}
        </div>
      )}
    </motion.button>
  );
}
