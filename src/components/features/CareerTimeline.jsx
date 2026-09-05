import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function CareerTimeline() {
  const { profile } = useAuth();

  const hasSkills = Array.isArray(profile?.skills) && profile.skills.length > 0;
  const hasVerified = Array.isArray(profile?.verifiedSkills) && profile.verifiedSkills.length > 0;
  const hasProjects = Array.isArray(profile?.projects) && profile.projects.length > 0;
  const hasResume = Boolean(profile?.resume?.fileName || profile?.resume?.uploadedAt);
  const hasInterview = Array.isArray(profile?.mockInterviews) && profile.mockInterviews.length > 0;
  const hasTargetRole = Boolean(profile?.targetRole && profile.targetRole !== 'Career Explorer');

  const milestones = [
    {
      title: 'Profile Created & Authenticated',
      desc: 'Bound single email identity to authenticated student profile record.',
      date: profile?.joinDate || 'Day 1',
      completed: true,
      icon: '🎓',
    },
    {
      title: 'Target Role & Career Track Chosen',
      desc: hasTargetRole ? `Locked in target role: ${profile.targetRole}` : 'Define your target engineering track.',
      date: hasTargetRole ? 'Active' : 'Pending',
      completed: hasTargetRole,
      actionPath: '/account',
      actionText: 'Choose Target Role',
      icon: '🎯',
    },
    {
      title: 'Technical Skills Declared',
      desc: hasSkills ? `${profile.skills.length} technical competencies documented.` : 'Add programming languages and frameworks.',
      date: hasSkills ? 'Completed' : 'Pending',
      completed: hasSkills,
      actionPath: '/account',
      actionText: 'Add Skills',
      icon: '⚡',
    },
    {
      title: 'Resume Upload & ATS Parsing',
      desc: hasResume ? `ATS score: ${profile?.resume?.atsScore || 85}% recorded.` : 'Upload resume for keyword & ATS analysis.',
      date: hasResume ? 'Analyzed' : 'Pending',
      completed: hasResume,
      actionPath: '/resume',
      actionText: 'Upload Resume',
      icon: '📄',
    },
    {
      title: 'First AI Skill Verified',
      desc: hasVerified ? `Demonstrated verified proficiency in ${profile.verifiedSkills[0].name}.` : 'Take an AI Skill Test to earn AI-VERIFIED badge.',
      date: hasVerified ? 'Verified' : 'Pending',
      completed: hasVerified,
      actionPath: '/skill-gap',
      actionText: 'Verify Skill',
      icon: '🧠',
    },
    {
      title: 'AI Mock Interview Evaluated',
      desc: hasInterview ? `Scored ${profile.mockInterviews[0].overallScore}% on communication & technical reasoning.` : 'Take a simulated 10-minute technical interview.',
      date: hasInterview ? 'Completed' : 'Pending',
      completed: hasInterview,
      actionPath: '/interview',
      actionText: 'Start Interview',
      icon: '🎙️',
    },
    {
      title: 'Full Job Readiness Simulator Completed',
      desc: 'Simulate end-to-end 5-round hiring filters and resolve top bottleneck.',
      date: 'Final Stage',
      completed: hasResume && hasSkills && hasInterview && hasVerified,
      actionPath: '/jobs',
      actionText: 'Simulate Hiring',
      icon: '🚀',
    },
  ];

  const completedCount = milestones.filter((m) => m.completed).length;

  return (
    <GlassCard className="relative overflow-hidden border border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
              PROGRESSION JOURNEY
            </span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar size={18} className="text-cyan-400" /> Career Progression Timeline
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Chronological log of verified career milestones and placement milestones.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-300 bg-white/4 px-3 py-1.5 rounded-xl border border-white/8">
          Milestones: <span className="text-cyan-300 font-bold">{completedCount}</span> / {milestones.length}
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
        {milestones.map((m, idx) => (
          <div key={idx} className="relative flex items-start gap-4 group">
            {/* Timeline Dot */}
            <div
              className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                m.completed
                  ? 'bg-cyan-500 border-cyan-300 text-black shadow-md shadow-cyan-500/40'
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}
            >
              {m.completed ? '✓' : idx + 1}
            </div>

            <div className="flex-1 p-3.5 rounded-2xl bg-white/3 border border-white/6 group-hover:bg-white/5 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{m.icon}</span>
                  <h4 className={`text-xs md:text-sm font-bold ${m.completed ? 'text-white' : 'text-slate-400'}`}>
                    {m.title}
                  </h4>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  m.completed ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-slate-500'
                }`}>
                  {m.date}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {m.desc}
              </p>

              {!m.completed && m.actionPath && (
                <div className="mt-2.5">
                  <Link
                    to={m.actionPath}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    {m.actionText} <ArrowRight size={11} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
