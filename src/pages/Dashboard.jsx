import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, TrendingUp, Target, CheckCircle, Circle,
  Sparkles, Bot, Zap, Activity, Award, ShieldCheck, Play, Flame
} from 'lucide-react';
import ProgressRing from '../components/ui/ProgressRing';
import GlassCard from '../components/ui/GlassCard';
import CareerTwinCard from '../components/features/CareerTwinCard';
import JobReadinessSimulator from '../components/features/JobReadinessSimulator';
import ReadinessHeatmap from '../components/features/ReadinessHeatmap';
import CareerJourneyPath from '../components/features/CareerJourneyPath';
import CareerTimeline from '../components/features/CareerTimeline';
import ProofOfSkillModal from '../components/features/ProofOfSkillModal';
import LevelBadge from '../components/features/LevelBadge';
import EnergyBar from '../components/features/EnergyBar';
import XPBar from '../components/features/XPBar';
import StreakCard from '../components/features/StreakCard';
import MissionCard from '../components/features/MissionCard';
import SkillTree from '../components/features/SkillTree';
import Leaderboard from '../components/features/Leaderboard';

import { useAuth } from '../context/AuthContext';
import { calculateProfileCompleteness, calculatePlacementReadiness } from '../utils/profileCompleteness';
import {
  getUserStats,
  getCategoryMastery,
  getAdaptiveOpportunity,
  getDailyMissions,
} from '../services/db';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { profile, user, awardXP } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id || '1001';

  // Gamification & Relational DB states
  const dbStats = getUserStats(userId);
  const categoriesMastery = getCategoryMastery(userId);
  const adaptiveOpp = getAdaptiveOpportunity(userId);
  const dbMissions = getDailyMissions(userId);

  const completeness = calculateProfileCompleteness(profile);
  const readiness = calculatePlacementReadiness(profile);

  const studentName = profile?.fullName || user?.name || 'Student';
  const targetRole = profile?.targetRole || 'AI/ML Engineer';

  const [activeProofSkill, setActiveProofSkill] = useState(null);

  const xp = profile?.xp ? Math.max(profile.xp, dbStats.totalXP) : (dbStats.totalXP || 2450);
  const level = dbStats.currentLevel?.level || profile?.level || 7;
  const streak = dbStats.streak || profile?.streak || 8;
  const accuracy = dbStats.accuracy || 82;
  const energy = dbStats.energy || 10;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-16"
    >
      {/* ── 1. MAIN USER EXPERIENCE: Welcome Back & Gamification Bar ── */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl p-6 md:p-8 border shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.12), rgba(15, 23, 42, 0.95))',
          borderColor: 'rgba(6, 182, 212, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-500/20 border border-cyan-500/30 flex items-center gap-1.5">
                <Sparkles size={12} /> AI CAREER COPILOT ACTIVE
              </span>
              <span className="text-xs text-slate-400 font-semibold">•</span>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                <Flame size={14} className="fill-current" /> {streak} Day Streak
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              WELCOME BACK, <span className="gradient-text">{studentName.toUpperCase()}</span> 👋
            </h1>

            <p className="text-slate-300 text-xs md:text-sm max-w-xl leading-relaxed">
              Targeting <strong className="text-white">{targetRole}</strong>. Turn every answered question into verified skill progress and career readiness.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/arena?start=true"
              className="btn-primary flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <Play size={18} className="fill-current" />
              <span>START TODAY&apos;S CHALLENGE</span>
            </Link>
            <Link
              to="/mentor"
              className="btn-ghost text-xs px-4 py-3 rounded-2xl font-bold flex items-center gap-1.5 border border-white/10 hover:border-white/20"
            >
              <Bot size={15} /> Ask Mentor
            </Link>
          </div>
        </div>

        {/* ── Sub-Gamification Metrics Ribbon ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/25 border border-white/5">
            <LevelBadge level={level} size="md" />
          </div>

          <div className="p-3 rounded-2xl bg-black/25 border border-white/5 flex flex-col justify-center">
            <XPBar xp={xp} currentLevel={level} />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-black/25 border border-white/5">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Overall Accuracy</div>
              <div className="text-lg font-black text-emerald-400 font-mono">{accuracy}%</div>
            </div>
            <div className="text-xs text-emerald-300 bg-emerald-500/15 px-2 py-1 rounded-lg">🎯 High</div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-black/25 border border-white/5">
            <EnergyBar current={energy} max={10} />
          </div>
        </div>
      </motion.div>

      {/* ── 2. ADAPTIVE QUESTION ENGINE: "AI DETECTED AN OPPORTUNITY 🚀" ── */}
      {adaptiveOpp && (
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-3xl border relative overflow-hidden bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border-amber-500/35 shadow-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-4 max-w-2xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-2xl border border-amber-500/30 flex-shrink-0">
                🚀
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                    AI DETECTED AN OPPORTUNITY
                  </span>
                  <span className="text-xs text-amber-300 font-bold">
                    Reward: +{adaptiveOpp.rewardXP} XP
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-white">
                  Your current {adaptiveOpp.weakTopic} accuracy ({adaptiveOpp.weakAccuracy}%) is lower than your {adaptiveOpp.strongTopic} accuracy ({adaptiveOpp.strongAccuracy}%).
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Recommended Mission: <strong className="text-amber-200">{adaptiveOpp.missionTitle}</strong>. Answering targeted questions in this topic will rapidly close your placement bottleneck.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/arena?category=${adaptiveOpp.weakCategory}&mode=weakness_attack&start=true`)}
              className="btn-primary text-xs px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer hover:scale-105 transition-all"
            >
              <span>START {adaptiveOpp.weakTopic.toUpperCase()} MISSION</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ── 3. CORE SECTION: "WHAT DO YOU WANT TO MASTER TODAY?" (10 Category Cards) ── */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
              <span>🎯</span> WHAT DO YOU WANT TO MASTER TODAY?
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a category to enter the Question Arena, earn XP, and level up your topic accuracy.
            </p>
          </div>
          <Link
            to="/arena"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>View Arena Modes</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {categoriesMastery.map((cat, i) => (
            <motion.div
              key={cat.id}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => navigate(`/arena?category=${cat.id}&start=true`)}
              className="p-4 rounded-2xl bg-[#0a1628] border border-white/8 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    cat.difficulty === 'Easy'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : cat.difficulty === 'Hard' || cat.difficulty === 'Boss'
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                  }`}>
                    {cat.difficulty}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Questions:</span>
                  <strong className="text-slate-200">{cat.questionsCompleted} solved</strong>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Accuracy:</span>
                  <strong className={cat.accuracy >= 70 ? 'text-emerald-400 font-bold' : cat.accuracy > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                    {cat.accuracy > 0 ? `${cat.accuracy}%` : 'Unattempted'}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Mastery:</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    cat.masteryLevel === 'Mastered'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : cat.masteryLevel === 'Proficient'
                      ? 'bg-blue-500/20 text-blue-300'
                      : cat.masteryLevel === 'Learning'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-white/5 text-slate-500'
                  }`}>
                    {cat.masteryLevel}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── 4. MISSIONS & STREAK SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-7">
          <MissionCard missions={dbMissions} />
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-5">
          <StreakCard streak={streak} />
        </motion.div>
      </div>

      {/* ── 5. VISUAL CAREER SKILL TREE ── */}
      <motion.div variants={itemVariants}>
        <SkillTree userId={userId} />
      </motion.div>

      {/* ── 6. AI CAREER TWIN & JOB READINESS SIMULATOR (Preserved) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-6">
          <CareerTwinCard profile={profile} />
        </motion.div>
        <motion.div variants={itemVariants} className="lg:col-span-6">
          <JobReadinessSimulator />
        </motion.div>
      </div>

      {/* ── 7. CAREER PATH SIMULATOR & READINESS HEATMAP (Preserved) ── */}
      <motion.div variants={itemVariants}>
        <CareerJourneyPath />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ReadinessHeatmap />
      </motion.div>

      {/* ── 8. CAMPUS LEADERBOARD PREVIEW ── */}
      <motion.div variants={itemVariants}>
        <Leaderboard />
      </motion.div>

      {/* ── 9. CAREER PROGRESSION TIMELINE ── */}
      <motion.div variants={itemVariants}>
        <CareerTimeline />
      </motion.div>

      {/* Proof of Skill Modal */}
      {activeProofSkill && (
        <ProofOfSkillModal
          skillName={activeProofSkill}
          isOpen={Boolean(activeProofSkill)}
          onClose={() => setActiveProofSkill(null)}
        />
      )}
    </motion.div>
  );
}
