import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Trophy, Target, ArrowLeft, RotateCcw, Award, CheckCircle2,
  AlertTriangle, ShieldCheck, Flame, Play, Sparkles
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import QuestionCard from '../components/features/QuestionCard';
import EnergyBar from '../components/features/EnergyBar';
import LevelBadge from '../components/features/LevelBadge';
import {
  getQuestions,
  recordQuestionAttempt,
  getUserStats,
  QUESTION_CATEGORIES
} from '../services/db';
import { useAuth } from '../context/AuthContext';

export const ARENA_MODES = [
  { id: 'quick_quiz', name: 'Quick Quiz', count: 5, timeLimit: 120, icon: '⚡', desc: '5 Questions • 2 Minutes Rapid Fire' },
  { id: 'speed_round', name: 'Speed Round', count: 10, timeLimit: 60, icon: '⏱️', desc: '10 Questions • 60 Seconds Countdown' },
  { id: 'skill_builder', name: 'Skill Builder', count: 8, timeLimit: null, icon: '🔨', desc: 'Deep Topic Focus • Untimed Mastery' },
  { id: 'weakness_attack', name: 'Weakness Attack', count: 5, timeLimit: null, icon: '🎯', desc: 'Targeting Your Lowest Accuracy Topics' },
  { id: 'boss_challenge', name: 'Boss Challenge', count: 10, timeLimit: null, icon: '👑', desc: 'DSA Boss • Level 5+ Req • +1,000 XP & Badge' },
  { id: 'interview_mode', name: 'Interview Mode', count: 5, timeLimit: 90, icon: '🎤', desc: 'Technical & HR Placement Scenarios' },
  { id: 'daily_challenge', name: 'Daily Challenge', count: 5, timeLimit: null, icon: '📅', desc: 'Curated Daily Set • Bonus XP Milestone' },
  { id: 'placement_simulator', name: 'Placement Simulator', count: 15, timeLimit: 300, icon: '💼', desc: 'Full Company-Style Proctored Assessment' },
];

export default function QuestionArena() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile, awardXP } = useAuth();
  const userId = user?.id || '1001';

  const initialCat = searchParams.get('category') || 'dsa';
  const initialMode = searchParams.get('mode') || 'quick_quiz';
  const shouldAutoStart = Boolean(searchParams.get('start'));

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedMode, setSelectedMode] = useState(initialMode);
  const [isPlaying, setIsPlaying] = useState(shouldAutoStart);
  const [questions, setQuestions] = useState(() => {
    if (shouldAutoStart) {
      const config = ARENA_MODES.find((m) => m.id === initialMode) || ARENA_MODES[0];
      return getQuestions({
        category: initialCat === 'mixed_quiz' ? null : initialCat,
        difficulty: initialMode === 'boss_challenge' ? 'Boss' : null,
        limit: config.count,
      });
    }
    return [];
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  // Session state
  const [combo, setCombo] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [bonusXP, setBonusXP] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const stats = getUserStats(userId);
  const currentModeConfig = ARENA_MODES.find((m) => m.id === selectedMode) || ARENA_MODES[0];

  const startQuiz = (catId = selectedCategory, modeId = selectedMode) => {
    const config = ARENA_MODES.find((m) => m.id === modeId) || ARENA_MODES[0];
    const qs = getQuestions({
      category: catId === 'mixed_quiz' ? null : catId,
      difficulty: modeId === 'boss_challenge' ? 'Boss' : null,
      limit: config.count,
    });

    setQuestions(qs.length > 0 ? qs : getQuestions({ limit: 5 }));
    setCurrentIndex(0);
    setCombo(0);
    setMultiplier(1.0);
    setBonusXP(0);
    setSessionXP(0);
    setSessionCorrect(0);
    setIsFinished(false);
    setIsPlaying(true);
  };

  // Ensure questions load if user navigates with start=true
  useEffect(() => {
    if (searchParams.get('start') && questions.length === 0) {
      startQuiz(initialCat, initialMode);
    }
  }, [searchParams]);

  const handleAnswerSubmit = (selectedAnswer) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return null;

    const evalResult = recordQuestionAttempt({
      userId,
      questionId: currentQ.id,
      selectedAnswer,
      currentCombo: combo,
    });

    if (evalResult) {
      setCombo(evalResult.nextCombo);
      setMultiplier(evalResult.multiplier);
      setBonusXP(evalResult.bonusXP);
      if (evalResult.isCorrect) {
        setSessionCorrect((prev) => prev + 1);
        setSessionXP((prev) => prev + evalResult.earnedXP);
        if (awardXP) awardXP(evalResult.earnedXP);
      }
    }

    return evalResult;
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Quiz complete
      setIsFinished(true);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* ── Top Gamification & Navigation Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl" style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.15)', boxShadow: '0 1px 8px rgba(37,99,235,0.07)' }}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (isPlaying ? setIsPlaying(false) : navigate('/'))}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-base font-black flex items-center gap-2" style={{ color: '#0f172a' }}>
              <span>🎮</span> QUESTION ARENA
            </h1>
            <p className="text-[11px] text-cyan-400 font-semibold tracking-wider uppercase">
              Answer. Learn. Level Up. Get Hired.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LevelBadge level={stats.currentLevel.level} />
          <EnergyBar current={stats.energy} max={10} />
        </div>
      </div>

      {/* ── Mode 1: Game Arena Active Playing Screen ── */}
      {isPlaying && !isFinished && questions.length > 0 && (
        <QuestionCard
          question={questions[currentIndex]}
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          combo={combo}
          multiplier={multiplier}
          bonusXP={bonusXP}
          timeLimit={currentModeConfig.timeLimit}
          onAnswerSubmit={handleAnswerSubmit}
          onNextQuestion={handleNextQuestion}
        />
      )}

      {/* ── Fallback Loader if questions are loading ── */}
      {isPlaying && !isFinished && questions.length === 0 && (
        <div className="p-12 text-center rounded-3xl space-y-4" style={{ background: '#f0f4ff', border: '1px solid rgba(37,99,235,0.18)' }}>
          <div className="text-3xl animate-bounce">⚡</div>
          <div className="font-bold text-lg" style={{ color: '#0f172a' }}>Initializing Question Arena...</div>
          <p className="text-xs text-slate-400">Loading tailored questions for your session...</p>
          <button
            type="button"
            onClick={() => startQuiz(selectedCategory, selectedMode)}
            className="btn-primary px-6 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
          >
            Launch Now
          </button>
        </div>
      )}

      {/* ── Mode 2: Quiz Complete Celebration Screen ── */}
      {isPlaying && isFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 md:p-10 rounded-3xl text-center space-y-6 shadow-xl" style={{ background: 'linear-gradient(135deg, #f0f7ff, #e8f0fe)', border: '1px solid rgba(37,99,235,0.25)' }}
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 mx-auto flex items-center justify-center text-4xl shadow-lg shadow-orange-500/40">
            🏆
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              QUIZ COMPLETED!
            </span>
            <h2 className="text-2xl md:text-3xl font-black mt-3" style={{ color: '#0f172a' }}>
              Spectacular Performance!
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
              Every correct answer and evaluated concept is logged into your personal skill tree and placement readiness score.
            </p>
          </div>

          {/* Stat Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-white/4 border border-white/8">
              <div className="text-2xl font-black text-amber-300 font-mono">+{sessionXP}</div>
              <div className="text-xs text-slate-400 mt-0.5">XP Earned</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/4 border border-white/8">
              <div className="text-2xl font-black text-emerald-400 font-mono">{sessionCorrect}/{questions.length}</div>
              <div className="text-xs text-slate-400 mt-0.5">Correct Answers</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/4 border border-white/8">
              <div className="text-2xl font-black text-cyan-300 font-mono">
                {Math.round((sessionCorrect / Math.max(1, questions.length)) * 100)}%
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Accuracy</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/4 border border-white/8">
              <div className="text-2xl font-black text-purple-400 font-mono">🔥 {combo}x</div>
              <div className="text-xs text-slate-400 mt-0.5">Max Combo</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => startQuiz(selectedCategory, selectedMode)}
              className="btn-primary flex items-center gap-2 px-6 py-3 font-bold text-sm cursor-pointer shadow-lg shadow-blue-500/25"
            >
              <RotateCcw size={16} />
              <span>PLAY AGAIN</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(false)}
              className="px-6 py-3 rounded-xl font-bold text-sm cursor-pointer transition-colors" style={{ background: '#f1f5f9', border: '1px solid rgba(37,99,235,0.2)', color: '#1e40af' }}
            >
              CHOOSE ANOTHER MODE
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Mode 3: Arena Lobby (Choose Mode & Category) ── */}
      {!isPlaying && (
        <div className="space-y-8">
          {/* Hero Banner */}
          <div className="p-6 md:p-8 rounded-3xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.10), rgba(14,165,233,0.07))', border: '1px solid rgba(37,99,235,0.2)' }}>
            <div className="relative z-10 max-w-xl space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 flex items-center gap-1.5 w-fit">
                <Sparkles size={13} />
                TURN EVERY QUESTION INTO CAREER PROGRESS
              </span>
              <h2 className="text-2xl md:text-3xl font-black" style={{ color: '#0f172a' }}>
                Choose Your Arena Challenge
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Practice technical questions, aptitude puzzles, DSA challenges, and HR interviews. Earn XP, build combos, and elevate your placement readiness.
              </p>
            </div>
          </div>

          {/* ── Section 1: Choose Game Mode ── */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: '#0f172a' }}>
              <Trophy size={16} className="text-amber-400" />
              1. SELECT GAME MODE
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {ARENA_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedMode(mode.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedMode === mode.id
                      ? 'border-blue-500 shadow-md'
                      : 'hover:border-blue-300'
                  }`}
                  style={selectedMode === mode.id ? { background: 'rgba(37,99,235,0.10)', borderColor: 'rgba(37,99,235,0.5)' } : { background: '#f8fafc', borderColor: 'rgba(37,99,235,0.12)' }}
                >
                  <div className="text-2xl mb-1.5">{mode.icon}</div>
                  <div className="font-bold text-sm" style={{ color: '#0f172a' }}>{mode.name}</div>
                  <div className="text-[11px] mt-1" style={{ color: '#64748b' }}>{mode.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Section 2: Choose Category ── */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: '#0f172a' }}>
              <Target size={16} className="text-cyan-400" />
              2. SELECT TOPIC CATEGORY
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {QUESTION_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'border-blue-500 shadow-md'
                      : 'hover:border-blue-300'
                  }`}
                  style={selectedCategory === cat.id ? { background: 'rgba(14,165,233,0.10)', borderColor: 'rgba(37,99,235,0.5)' } : { background: '#f8fafc', borderColor: 'rgba(37,99,235,0.12)' }}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="font-bold text-xs truncate" style={{ color: '#0f172a' }}>{cat.name}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: '#64748b' }}>{cat.difficulty}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Start Challenge CTA ── */}
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={() => startQuiz(selectedCategory, selectedMode)}
              className="btn-primary flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-base cursor-pointer shadow-xl shadow-blue-500/30 active:scale-95 transition-all"
            >
              <Play size={20} className="fill-current" />
              <span>START {currentModeConfig.name.toUpperCase()} NOW</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
