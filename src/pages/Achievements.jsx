import { motion } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';

const levels = [
  { level: 1, title: 'Career Starter', xp: 0 },
  { level: 2, title: 'Skill Explorer', xp: 200 },
  { level: 3, title: 'Code Apprentice', xp: 500 },
  { level: 4, title: 'Resume Builder', xp: 900 },
  { level: 5, title: 'Problem Solver', xp: 1400 },
  { level: 6, title: 'Interview Prep', xp: 1900 },
  { level: 7, title: 'Technical Pro', xp: 2200 },
  { level: 8, title: 'Interview Challenger', xp: 2450 },
  { level: 9, title: 'Placement Ready', xp: 3000 },
  { level: 10, title: 'Career Champion', xp: 4000 },
];

export default function Achievements() {
  const { profile } = useAuth();
  const xp = profile?.xp ?? 0;
  const xpToNext = profile?.xpToNext ?? 3000;
  const level = profile?.level ?? 1;
  const streak = profile?.streak ?? 0;

  const isDemo = Boolean(profile?.isDemoAccount);
  const hasProfile = Boolean(profile?.fullName || profile?.email);
  const hasVerified = Boolean(profile?.verifiedSkills && profile.verifiedSkills.length > 0);
  const hasResume = Boolean(profile?.resumeData || isDemo);
  const hasInterview = Boolean(profile?.adaptiveInterviews && profile.adaptiveInterviews.length > 0) || isDemo;
  const hasProjects = Boolean(profile?.projects && profile.projects.length >= 2);
  const hasCoding = Boolean(profile?.codingProfile?.leetcode || isDemo);
  const isPlacementReady = (profile?.readinessScore || 0) >= 80 || (isDemo && (profile?.readinessScore || 82) >= 80);

  const dynamicBadges = [
    { id: 'first_steps', title: 'Career Starter', desc: 'Created verified profile', icon: '👣', earned: hasProfile, xp: 50 },
    { id: 'skill_verifier', title: 'Skill Verifier', desc: 'Verified technical skill with AI assessment', icon: '🛡️', earned: hasVerified || isDemo, xp: 250 },
    { id: 'resume_ready', title: 'Resume Ready', desc: 'Parsed and analyzed resume in Resume Intelligence', icon: '📄', earned: hasResume, xp: 150 },
    { id: 'code_warrior', title: 'Coding Starter', desc: 'Connected coding profile & solved DSA', icon: '⚔️', earned: hasCoding, xp: 200 },
    { id: 'interview_explorer', title: 'Interview Explorer', desc: 'Practiced in Adaptive Interview Arena', icon: '🎯', earned: hasInterview, xp: 300 },
    { id: 'career_builder', title: 'Career Builder', desc: 'Added 2+ practical portfolio projects', icon: '🏗️', earned: hasProjects, xp: 400 },
    { id: 'streak_warrior', title: 'Streak Master', desc: 'Maintained 7-day preparation streak', icon: '🔥', earned: streak >= 7 || isDemo, xp: 100 },
    { id: 'placement_champion', title: 'Placement Ready', desc: 'Reached 80%+ overall readiness score', icon: '🏆', earned: isPlacementReady, xp: 1000 },
  ];

  const earnedXP = dynamicBadges.filter((a) => a.earned).reduce((s, a) => s + a.xp, 0);
  const xpPercent = Math.min(100, Math.round((xp / (xpToNext || 1)) * 100));
  const earnedCount = dynamicBadges.filter((a) => a.earned).length;

  // Streak calendar (last 30 days)
  const today = new Date();
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    const isStreak = i >= 30 - streak;
    return { day: d.getDate(), active: isStreak };
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Achievements <span className="gradient-text">&amp; XP</span></h1>
        <p className="text-sm text-slate-400 mt-1">Track your growth, earn badges, and level up your career journey</p>
      </div>

      {/* XP Level Card */}
      <div
        className="relative overflow-hidden p-6 rounded-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.1))', border: '1px solid rgba(139,92,246,0.25)' }}
      >
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-8xl opacity-10">⚡</div>
        <div className="flex flex-wrap items-center gap-6 relative z-10">
          {/* Level badge */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex flex-col items-center justify-center flex-shrink-0"
            style={{ boxShadow: '0 0 30px rgba(139,92,246,0.5)' }}>
            <div className="text-xs text-white/70 font-semibold">LVL</div>
            <div className="text-3xl font-black text-white">{level}</div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white">Interview Challenger</h2>
            <p className="text-sm text-slate-400 mb-3">Level {level} • {xp} / {xpToNext} XP to Level {level + 1}</p>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1.5 }}
                className="h-full rounded-full relative overflow-hidden"
                style={{ background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #06b6d4)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </motion.div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-slate-500">
              <span>{xp} XP</span>
              <span>{xpToNext - xp} XP to next level</span>
            </div>
          </div>
          <div className="flex gap-6 flex-shrink-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">🔥 {streak}</div>
              <div className="text-xs text-slate-400">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{earnedCount}</div>
              <div className="text-xs text-slate-400">Badges Earned</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Badges Grid */}
        <div className="lg:col-span-2">
          <GlassCard>
            <h3 className="text-base font-bold text-white mb-4">Badge Collection ({earnedCount}/{dynamicBadges.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {dynamicBadges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 rounded-2xl text-center transition-all duration-300 ${
                    badge.earned
                      ? 'bg-gradient-to-br from-violet-500/15 to-blue-500/8 border border-violet-500/20'
                      : 'opacity-40'
                  }`}
                  style={!badge.earned ? { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' } : {}}
                >
                  <div className={`text-3xl mb-2 ${badge.earned ? '' : 'grayscale'}`}>{badge.icon}</div>
                  <div className={`text-xs font-bold mb-1 ${badge.earned ? 'text-white' : 'text-slate-500'}`}>{badge.title}</div>
                  <div className="text-[11px] text-slate-500 mb-2 leading-tight">{badge.desc}</div>
                  <div className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    badge.earned ? 'bg-amber-500/15 text-amber-400' : 'bg-white/5 text-slate-600'
                  }`}>
                    {badge.earned ? `+${badge.xp} XP` : `${badge.xp} XP`}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Streak + Level Path */}
        <div className="space-y-5">
          {/* Streak Calendar */}
          <GlassCard>
            <h3 className="text-base font-bold text-white mb-3">30-Day Activity</h3>
            <div className="grid grid-cols-7 gap-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-center text-[10px] text-slate-600 mb-1">{d}</div>
              ))}
              {calendarDays.map((day, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-md flex items-center justify-center text-[10px] font-medium"
                  style={{
                    background: day.active ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${day.active ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.04)'}`,
                    color: day.active ? '#93c5fd' : '#374151',
                    boxShadow: day.active ? '0 0 8px rgba(59,130,246,0.3)' : 'none',
                  }}
                >
                  {day.day}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">🔥 {streak}-day streak! Keep it going!</p>
          </GlassCard>

          {/* Level Path */}
          <GlassCard>
            <h3 className="text-base font-bold text-white mb-3">Level Path</h3>
            <div className="space-y-2">
              {levels.map((lvl) => (
                <div key={lvl.level} className={`flex items-center gap-3 p-2 rounded-lg ${lvl.level === level ? 'bg-violet-500/15 border border-violet-500/20' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    lvl.level < level ? 'bg-emerald-500 text-white' :
                    lvl.level === level ? 'bg-gradient-to-br from-violet-500 to-blue-500 text-white' :
                    'bg-white/10 text-slate-500'
                  }`}>
                    {lvl.level < level ? '✓' : lvl.level}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium ${lvl.level <= level ? 'text-white' : 'text-slate-500'}`}>{lvl.title}</div>
                    <div className="text-[10px] text-slate-600">{lvl.xp} XP</div>
                  </div>
                  {lvl.level === level && <span className="text-[10px] text-violet-400 font-bold">YOU</span>}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
