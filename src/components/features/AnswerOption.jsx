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

  let stateStyle = 'border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/50 text-slate-800 shadow-sm';
  let badgeStyle = 'bg-slate-100 text-slate-700 border border-slate-200 font-bold';

  if (isAnswered) {
    if (isCorrect) {
      stateStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium shadow-sm';
      badgeStyle = 'bg-emerald-600 text-white font-black';
    } else if (selected) {
      stateStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-medium animate-shake shadow-sm';
      badgeStyle = 'bg-rose-600 text-white font-black';
    } else {
      stateStyle = 'border-slate-200/60 bg-slate-50/50 text-slate-400 opacity-60';
      badgeStyle = 'bg-slate-100 text-slate-400 border border-slate-200/60';
    }
  } else if (selected) {
    stateStyle = 'border-blue-600 bg-blue-50 text-blue-950 font-medium shadow-sm';
    badgeStyle = 'bg-blue-600 text-white font-black';
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
