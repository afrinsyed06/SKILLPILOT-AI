import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Trophy,
  Target,
  ArrowLeft,
  RotateCcw,
  Award,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Flame,
  Play,
  Sparkles,
  Calendar as CalendarIcon,
  Clock,
  Check,
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import QuestionCard from '../components/features/QuestionCard';
import EnergyBar from '../components/features/EnergyBar';
import LevelBadge from '../components/features/LevelBadge';
import StreakCard from '../components/features/StreakCard';
import {
  getQuestions,
  recordQuestionAttempt,
  getUserStats,
  QUESTION_CATEGORIES,
  getDailyChallenge,
  isDailyChallengeCompleted,
  completeDailyChallenge,
} from '../services/db';
import { useAuth } from '../context/AuthContext';

export const ARENA_MODES = [
  { id: 'daily_challenge', name: 'Daily Challenge', count: 5, timeLimit: null, icon: '📅', desc: 'Curated Daily Set • Unique Every Day • +150 XP & Streak' },
  { id: 'quick_quiz', name: 'Quick Quiz', count: 5, timeLimit: 120, icon: '⚡', desc: '5 Questions • 2 Minutes Rapid Fire' },
  { id: 'speed_round', name: 'Speed Round', count: 10, timeLimit: 60, icon: '⏱️', desc: '10 Questions • 60 Seconds Countdown' },
  { id: 'skill_builder', name: 'Skill Builder', count: 8, timeLimit: null, icon: '🔨', desc: 'Deep Topic Focus • Untimed Mastery' },
  { id: 'weakness_attack', name: 'Weakness Attack', count: 5, timeLimit: null, icon: '🎯', desc: 'Targeting Your Lowest Accuracy Topics' },
  { id: 'boss_challenge', name: 'Boss Challenge', count: 10, timeLimit: null, icon: '👑', desc: 'DSA Boss • Level 5+ Req • +1,000 XP & Badge' },
  { id: 'interview_mode', name: 'Interview Mode', count: 5, timeLimit: 90, icon: '🎤', desc: 'Technical & HR Placement Scenarios' },
  { id: 'placement_simulator', name: 'Placement Simulator', count: 15, timeLimit: 300, icon: '💼', desc: 'Full Company-Style Proctored Assessment' },
];

export default function QuestionArena() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile, awardXP } = useAuth();
  const userId = user?.id || '1001';

  // Retrieve today's curated daily challenge
  const dailyChallenge = useMemo(() => getDailyChallenge(), []);
  const [isDailyDone, setIsDailyDone] = useState(() => isDailyChallengeCompleted(userId, dailyChallenge.date));

  const categoryParam = searchParams.get('category');
  const modeParam = searchParams.get('mode');
  const initialCat = categoryParam || 'dsa';
  // If user came with a specific category without specifying mode, default to 'skill_builder'
  // If no category and no mode, default to 'daily_challenge'
  const initialMode = modeParam || (categoryParam ? 'skill_builder' : 'daily_challenge');
  const shouldAutoStart = Boolean(searchParams.get('start'));

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedMode, setSelectedMode] = useState(initialMode);
  const [isPlaying, setIsPlaying] = useState(shouldAutoStart);
  const [questions, setQuestions] = useState(() => {
    if (shouldAutoStart) {
      if (initialMode === 'daily_challenge' && (!categoryParam || categoryParam === 'all')) {
        return getDailyChallenge().questions;
      }
      const config = ARENA_MODES.find((m) => m.id === initialMode) || ARENA_MODES[3];
      return getQuestions({
        category: initialCat === 'mixed_quiz' || initialCat === 'all' ? null : initialCat,
        difficulty: initialMode === 'boss_challenge' ? 'Boss' : null,
        limit: config.count || 8,
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
  const [dailyRewardGranted, setDailyRewardGranted] = useState(false);

  const stats = getUserStats(userId);
  const currentModeConfig = ARENA_MODES.find((m) => m.id === selectedMode) || ARENA_MODES[0];

  const startQuiz = (catId = selectedCategory, modeId = selectedMode) => {
    let effectiveMode = modeId;
    let qs = [];

    // If a specific topic category was selected (e.g. Aptitude, Communication, Coding Challenge),
    // ensure questions are strictly drawn from that concept rather than generic daily mix!
    if (modeId === 'daily_challenge' && catId && catId !== 'all' && catId !== 'mixed_quiz') {
      effectiveMode = 'skill_builder';
    }

    setSelectedMode(effectiveMode);

    if (effectiveMode === 'daily_challenge') {
      const dailyData = getDailyChallenge();
      qs = dailyData.questions;
    } else {
      const config = ARENA_MODES.find((m) => m.id === effectiveMode) || ARENA_MODES[3];
      qs = getQuestions({
        category: catId === 'mixed_quiz' || catId === 'all' ? null : catId,
        difficulty: effectiveMode === 'boss_challenge' ? 'Boss' : null,
        limit: config.count || 8,
      });
    }

    setQuestions(qs.length > 0 ? qs : getQuestions({ category: catId !== 'all' ? catId : null, limit: 5 }));
    setCurrentIndex(0);
    setCombo(0);
    setMultiplier(1.0);
    setBonusXP(0);
    setSessionXP(0);
    setSessionCorrect(0);
    setIsFinished(false);
    setDailyRewardGranted(false);
    setIsPlaying(true);
  };

  // Ensure questions load if user navigates with start=true or URL parameters change
  useEffect(() => {
    const cat = searchParams.get('category');
    const mode = searchParams.get('mode');
    const start = Boolean(searchParams.get('start'));

    if (cat) setSelectedCategory(cat);
    if (mode) setSelectedMode(mode);

    if (start) {
      const effMode = mode || (cat ? 'skill_builder' : 'daily_challenge');
      const effCat = cat || 'dsa';
      startQuiz(effCat, effMode);
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
      if (selectedMode === 'daily_challenge') {
        const res = completeDailyChallenge(userId, dailyChallenge.date, sessionCorrect);
        setIsDailyDone(true);
        if (!res.alreadyCompleted && res.xpEarned > 0) {
          setDailyRewardGranted(true);
          setSessionXP((prev) => prev + res.xpEarned);
          if (awardXP) awardXP(res.xpEarned);
        }
      }
      setIsFinished(true);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* ── Top Gamification & Navigation Bar ── */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(37,99,235,0.15)',
          boxShadow: '0 1px 8px rgba(37,99,235,0.07)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (isPlaying ? setIsPlaying(false) : navigate('/'))}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
            title="Back to Dashboard"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-base font-black flex items-center gap-2" style={{ color: '#0f172a' }}>
              <span>🎮</span> QUESTION ARENA
            </h1>
            <p className="text-[11px] text-blue-600 font-bold tracking-wider uppercase">
              Answer • Build Daily Streaks • Level Up • Get Hired
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
        <div className="space-y-4">
          {/* Header indicator when in daily challenge mode */}
          {selectedMode === 'daily_challenge' && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 via-amber-50 to-blue-50 border border-blue-200 flex flex-wrap items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  📅
                </span>
                <div>
                  <span className="text-xs font-black text-slate-900">
                    DAILY CHALLENGE: {dailyChallenge.title}
                  </span>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    {dailyChallenge.formattedDate} • 5 Diverse Categories • +150 Bonus XP & +1 Streak Day
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-amber-300 text-xs font-black text-amber-700 shadow-xs">
                <Flame size={14} className="fill-amber-500 text-amber-500" />
                <span>Streak Protected</span>
              </div>
            </div>
          )}

          {/* Header indicator when in specific category concept mode */}
          {selectedMode !== 'daily_challenge' && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 flex flex-wrap items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {QUESTION_CATEGORIES.find((c) => c.id === selectedCategory)?.icon || '⚡'}
                </span>
                <div>
                  <span className="text-xs font-black text-slate-900">
                    CONCEPT: {QUESTION_CATEGORIES.find((c) => c.id === selectedCategory)?.name.toUpperCase() || selectedCategory.toUpperCase()} • {currentModeConfig.name}
                  </span>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    {QUESTION_CATEGORIES.find((c) => c.id === selectedCategory)?.description || 'Deep topic focused mastery set'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-blue-200 text-xs font-black text-blue-700 shadow-xs">
                <span>{questions.length} Questions in this Concept Set</span>
              </div>
            </div>
          )}

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
        </div>
      )}

      {/* ── Fallback Loader if questions are loading ── */}
      {isPlaying && !isFinished && questions.length === 0 && (
        <div
          className="p-12 text-center rounded-3xl space-y-4"
          style={{ background: '#f0f4ff', border: '1px solid rgba(37,99,235,0.18)' }}
        >
          <div className="text-3xl animate-bounce">⚡</div>
          <div className="font-bold text-lg" style={{ color: '#0f172a' }}>
            Initializing Question Arena...
          </div>
          <p className="text-xs text-slate-500">Loading tailored questions for your session...</p>
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
          className="p-8 md:p-10 rounded-3xl text-center space-y-6 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #ffffff, #f0f7ff)',
            border: '1px solid rgba(37,99,235,0.25)',
          }}
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 mx-auto flex items-center justify-center text-4xl shadow-lg shadow-orange-500/30">
            {selectedMode === 'daily_challenge' ? '🔥' : '🏆'}
          </div>

          <div>
            <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-blue-100 text-blue-700 border border-blue-200">
              {selectedMode === 'daily_challenge' ? 'DAILY CHALLENGE COMPLETED!' : 'QUIZ COMPLETED!'}
            </span>
            <h2 className="text-2xl md:text-3xl font-black mt-3 text-slate-900">
              {selectedMode === 'daily_challenge'
                ? 'Daily Streak Extended & Momentum Locked!'
                : 'Spectacular Performance!'}
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {selectedMode === 'daily_challenge'
                ? 'You conquered today’s 5 questions across Aptitude, Programming, DSA, SQL, and AI. Tomorrow will feature 5 brand new questions!'
                : 'Every correct answer and evaluated concept is logged into your personal skill tree and placement readiness score.'}
            </p>
          </div>

          {/* Special Daily Reward Banner */}
          {selectedMode === 'daily_challenge' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 max-w-md mx-auto flex items-center justify-center gap-3 text-amber-900">
              <Flame size={20} className="fill-amber-500 text-amber-500 shrink-0" />
              <div className="text-left">
                <div className="text-xs font-black">STREAK EXTENDED TO {stats.streak} DAYS 🔥</div>
                <div className="text-[11px] text-amber-700">+150 Bonus XP awarded for completing today’s challenge!</div>
              </div>
            </div>
          )}

          {/* Stat Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-amber-600 font-mono">+{sessionXP}</div>
              <div className="text-xs text-slate-500 mt-0.5">XP Earned</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-emerald-600 font-mono">
                {sessionCorrect}/{questions.length}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Correct Answers</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-blue-600 font-mono">
                {Math.round((sessionCorrect / Math.max(1, questions.length)) * 100)}%
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Accuracy</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-purple-600 font-mono">🔥 {combo}x</div>
              <div className="text-xs text-slate-500 mt-0.5">Max Combo</div>
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
              className="px-6 py-3 rounded-xl font-bold text-sm cursor-pointer transition-colors"
              style={{ background: '#f1f5f9', border: '1px solid rgba(37,99,235,0.2)', color: '#1e40af' }}
            >
              ARENA LOBBY
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Mode 3: Arena Lobby (Choose Mode & Category + Daily Challenge & Streak Calendar) ── */}
      {!isPlaying && (
        <div className="space-y-8">
          {/* ── Section A: Featured Daily Challenge + Streak Mini-Calendar Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: Today's Curated Daily Challenge Banner */}
            <div
              className="lg:col-span-7 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(245,158,11,0.06), #ffffff)',
                border: '1px solid rgba(37,99,235,0.22)',
              }}
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1.5 w-fit">
                    <Sparkles size={13} className="text-blue-600" />
                    TODAY'S CURATED DAILY CHALLENGE
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <CalendarIcon size={14} className="text-blue-600" />
                    {dailyChallenge.formattedDate}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {dailyChallenge.title}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Featured Domains: <span className="font-bold text-blue-700">{dailyChallenge.theme}</span>
                  </p>
                </div>

                {/* Challenge Highlights */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-white border border-blue-100 shadow-xs">
                    <div className="text-sm font-black text-slate-900">5 Questions</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Diverse Categories</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-amber-200 shadow-xs">
                    <div className="text-sm font-black text-amber-700">+150 Bonus XP</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Daily Reward</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-orange-200 shadow-xs">
                    <div className="text-sm font-black text-orange-600">+1 Day Streak 🔥</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Protected Multiplier</div>
                  </div>
                </div>
              </div>

              {/* Start Button & Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-4 border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  {isDailyDone ? (
                    <span className="flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
                      <Check size={14} /> Completed Today
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-black text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
                      <Flame size={14} className="fill-amber-500" /> Ready to Play
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500">Different questions every 24 hours</span>
                </div>

                <button
                  type="button"
                  onClick={() => startQuiz('all', 'daily_challenge')}
                  className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs cursor-pointer shadow-md shadow-blue-500/25 active:scale-95 transition-all"
                >
                  <Play size={14} className="fill-current" />
                  <span>{isDailyDone ? "REPLAY TODAY'S CHALLENGE" : "START DAILY CHALLENGE"}</span>
                </button>
              </div>
            </div>

            {/* Right Col: Little Interactive Streak Calendar */}
            <div className="lg:col-span-5">
              <StreakCard streak={stats.streak} userId={userId} />
            </div>
          </div>

          {/* ── Section 1: Choose Game Mode ── */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-slate-900">
              <Trophy size={16} className="text-amber-500" />
              1. ALL ARENA GAME MODES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {ARENA_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    setSelectedMode(mode.id);
                    if (mode.id === 'daily_challenge') {
                      setSelectedCategory('all');
                    }
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    selectedMode === mode.id
                      ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20'
                      : 'hover:border-blue-300'
                  }`}
                  style={
                    selectedMode === mode.id
                      ? { background: 'rgba(37,99,235,0.08)', borderColor: '#2563eb' }
                      : { background: '#ffffff', borderColor: 'rgba(37,99,235,0.15)' }
                  }
                >
                  {mode.id === 'daily_challenge' && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                      DAILY 🔥
                    </span>
                  )}
                  <div className="text-2xl mb-1.5">{mode.icon}</div>
                  <div className="font-bold text-sm text-slate-900">{mode.name}</div>
                  <div className="text-[11px] mt-1 text-slate-500 leading-tight">{mode.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Section 2: Choose Category ── */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-slate-900">
              <Target size={16} className="text-blue-600" />
              2. SELECT TOPIC CATEGORY (FOR REGULAR MODES)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {QUESTION_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (selectedMode === 'daily_challenge') {
                      setSelectedMode('skill_builder');
                    }
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20'
                      : 'hover:border-blue-300'
                  }`}
                  style={
                    selectedCategory === cat.id
                      ? { background: 'rgba(37,99,235,0.08)', borderColor: '#2563eb' }
                      : { background: '#ffffff', borderColor: 'rgba(37,99,235,0.15)' }
                  }
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="font-bold text-xs truncate text-slate-900">{cat.name}</div>
                  <div className="text-[10px] mt-0.5 text-slate-500">{cat.difficulty}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Start Challenge CTA ── */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => startQuiz(selectedCategory, selectedMode)}
              className="btn-primary flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-base cursor-pointer shadow-xl shadow-blue-500/25 active:scale-95 transition-all"
            >
              <Play size={20} className="fill-current" />
              <span>
                {selectedMode === 'daily_challenge'
                  ? "START TODAY'S DAILY CHALLENGE"
                  : `START ${QUESTION_CATEGORIES.find((c) => c.id === selectedCategory)?.name.toUpperCase() || 'TOPIC'} (${currentModeConfig.name.toUpperCase()})`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
