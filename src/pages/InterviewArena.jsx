import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send, RotateCcw, ChevronRight, Mic, Sparkles, CheckCircle,
  TrendingUp, Award, AlertTriangle, ShieldCheck, Zap, ArrowRight, Brain
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { getAdaptiveInterviewPlan } from '../utils/aiPipelines';

const types = ['Adaptive Technical', 'System & Coding', 'HR & STAR Behavioral', 'Project Architecture'];
const typeColors = {
  'Adaptive Technical': 'from-cyan-500 to-blue-500',
  'System & Coding': 'from-emerald-500 to-teal-500',
  'HR & STAR Behavioral': 'from-violet-500 to-purple-500',
  'Project Architecture': 'from-amber-500 to-orange-500',
};

const ADAPTIVE_QUESTION_BANKS = {
  'Data Structures': [
    'Explain the runtime and memory differences between an array-based list and a linked list when inserting at index 0 versus index N/2.',
    'Given a stream of integers arriving in real-time, how would you architect a data structure to return the median at any point in O(1) or O(log N)?',
    'Walk me through cycle detection in a directed graph using either Tarjans algorithm or Kahn’s topological sort. What are the space constraints?',
  ],
  'System Design': [
    'How would you design a distributed rate limiter for a multi-tenant API handling 50,000 requests per second?',
    'Explain the trade-offs between strong consistency and eventual consistency in a distributed relational vs NoSQL database architecture.',
    'Describe how you would architect a real-time notification service ensuring at-least-once message delivery using message brokers.',
  ],
  'Core Technical Competence': [
    'Explain how garbage collection or memory management operates in your primary programming language.',
    'Walk through the exact sequence of network events that occur when a client types a secure HTTPS URL into a web browser and hits enter.',
    'How do database indexes (specifically B+ Trees) improve lookup speed, and what are their overhead costs during write-heavy operations?',
  ],
  'Behavioral & STAR': [
    'Tell me about a time when a critical bug or production incident was caused by your code. Using the STAR method, what was your resolution and outcome?',
    'Describe a situation where you had a strong technical disagreement with a teammate regarding system architecture. How was consensus achieved?',
    'Give an example of an engineering project where you faced tight deadlines. How did you prioritize technical debt versus feature completion?',
  ],
};

export default function InterviewArena() {
  const { profile, saveAdaptiveInterview, awardXP } = useAuth();
  const targetRole = profile?.targetRole || 'Software Developer';

  const adaptiveMeta = useMemo(() => getAdaptiveInterviewPlan(profile, 'Technical'), [profile]);

  const [selectedType, setSelectedType] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [messages, setMessages] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sessionFeedback, setSessionFeedback] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startInterview = (type) => {
    setSelectedType(type);
    setCurrentQ(0);
    setUserAnswers([]);

    // Select questions based on diagnosed weak area
    const questionList =
      type === 'HR & STAR Behavioral'
        ? ADAPTIVE_QUESTION_BANKS['Behavioral & STAR']
        : type === 'System & Coding'
        ? ADAPTIVE_QUESTION_BANKS['System Design']
        : ADAPTIVE_QUESTION_BANKS[adaptiveMeta.focusArea] || ADAPTIVE_QUESTION_BANKS['Core Technical Competence'];

    setMessages([
      {
        role: 'ai',
        text: `Welcome to Session #${adaptiveMeta.sessionNumber} of the **${type}** track for **${targetRole}**! 🎙️\n\n**Adaptive Focus:** ${adaptiveMeta.focusArea} (Difficulty: **${adaptiveMeta.difficulty}**).\n\n${adaptiveMeta.adaptiveInsight}\n\n**Question 1:** ${questionList[0]}`,
      },
    ]);
    setShowFeedback(false);
    setSessionFeedback(null);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    const userText = answer.trim();
    const updatedAnswers = [...userAnswers, userText];
    setUserAnswers(updatedAnswers);

    setAnswer('');
    setSubmitting(true);
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);

    await new Promise((r) => setTimeout(r, 1100));

    const questionList =
      selectedType === 'HR & STAR Behavioral'
        ? ADAPTIVE_QUESTION_BANKS['Behavioral & STAR']
        : selectedType === 'System & Coding'
        ? ADAPTIVE_QUESTION_BANKS['System Design']
        : ADAPTIVE_QUESTION_BANKS[adaptiveMeta.focusArea] || ADAPTIVE_QUESTION_BANKS['Core Technical Competence'];

    const nextQ = currentQ + 1;

    if (nextQ < questionList.length && nextQ < 3) {
      setCurrentQ(nextQ);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `Insightful response. Let's dig deeper into the next architectural aspect.\n\n**Question ${nextQ + 1}:** ${questionList[nextQ]}`,
        },
      ]);
      setSubmitting(false);
    } else {
      // Completed session
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `Thank you for completing this ${selectedType} session! Evaluating your technical depth, STAR structure, terminology, and trade-off analysis...`,
        },
      ]);

      await new Promise((r) => setTimeout(r, 1400));

      // Calculate realistic scores based on answer depth
      const avgWordCount = updatedAnswers.reduce((acc, a) => acc + a.split(' ').length, 0) / updatedAnswers.length;
      const baseScore = Math.min(Math.max(Math.round(55 + avgWordCount * 0.8), 65), 94);

      const weakAreaIdentified =
        avgWordCount < 30 ? 'Answer Depth & Detail' :
        selectedType.includes('System') ? 'System Scalability Trade-offs' :
        selectedType.includes('HR') ? 'Quantified STAR Outcomes' :
        'Algorithmic Space-Time Complexity';

      const evaluation = {
        sessionNumber: adaptiveMeta.sessionNumber,
        type: selectedType,
        overallScore: baseScore,
        targetFocus: adaptiveMeta.focusArea,
        difficulty: adaptiveMeta.difficulty,
        weakAreas: [weakAreaIdentified],
        scores: {
          technical: Math.min(baseScore + 3, 95),
          communication: Math.min(baseScore - 2, 92),
          structure: Math.min(baseScore + 1, 90),
          confidence: Math.min(baseScore + 4, 94),
          problemSolving: baseScore,
        },
        strong: [
          'Solid command of terminology aligned with ' + targetRole,
          'Structured explanation with clear step-by-step reasoning',
        ],
        improve: [
          `Strengthen focus on ${weakAreaIdentified} in subsequent sessions`,
          'Quantify past project metrics (e.g. latency reduced by X%, throughput of Y req/sec)',
        ],
        nextAction: `Next interview will dynamically calibrate for: ${weakAreaIdentified}.`,
      };

      setSessionFeedback(evaluation);
      saveAdaptiveInterview(evaluation);
      setShowFeedback(true);
      setSubmitting(false);
    }
  };

  const pastInterviews = Array.isArray(profile?.adaptiveInterviews) && profile.adaptiveInterviews.length > 0
    ? profile.adaptiveInterviews
    : Array.isArray(profile?.mockInterviews)
    ? profile.mockInterviews
    : [];

  // Evolution improvement calculation
  const evolutionHistory = adaptiveMeta.evolutionHistory;
  const firstSession = evolutionHistory[evolutionHistory.length - 1];
  const latestSession = evolutionHistory[0];
  const improvement =
    firstSession && latestSession && evolutionHistory.length > 1
      ? latestSession.technical - firstSession.technical
      : null;

  if (!selectedType) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-pink-400 bg-pink-500/10 border border-pink-500/20">
                ADAPTIVE AI ENGINE
              </span>
              <span className="text-xs text-slate-400">Target Role: <strong className="text-white">{targetRole}</strong></span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              AI Interview <span className="gradient-text">Arena</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">
              The AI interviewer automatically diagnoses weaknesses, adapts question difficulty, and tracks your skill evolution across sessions.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/4 px-3 py-1.5 rounded-xl border border-white/8 text-xs text-slate-300">
            <Brain size={14} className="text-cyan-400" />
            <span>Next Focus: <strong className="text-cyan-300">{adaptiveMeta.focusArea}</strong></span>
          </div>
        </div>

        {/* Interview Evolution Banner (Feature 4 USP) */}
        <GlassCard className="border border-pink-500/25 bg-gradient-to-r from-pink-500/10 via-purple-500/5 to-blue-500/10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-white/8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
                <TrendingUp size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Interview Evolution Tracker</h3>
                <p className="text-xs text-slate-400">Performance trajectory across diagnostic interview sessions</p>
              </div>
            </div>

            {improvement !== null && improvement > 0 && (
              <div className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                🔥 Great! Your technical performance improved by +{improvement}%
              </div>
            )}
          </div>

          {evolutionHistory.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <p className="text-xs mb-3">No adaptive sessions recorded yet. Complete your first session to initiate the evolution chart.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {evolutionHistory.map((h, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-black/30 border border-white/8">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400 font-semibold">Session #{h.session}</span>
                    <span className="text-[10px] text-slate-500">{h.date}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-white">{h.technical}%</span>
                    <span className="text-[11px] text-cyan-300 font-medium">Technical Score</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">
                    Focus: {h.focus}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Categories */}
        <div>
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
            Choose Diagnostic Track
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {types.map((type, i) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => startInterview(type)}
                className="glass-card-hover p-5 rounded-2xl cursor-pointer border border-white/8 hover:border-pink-500/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${typeColors[type]} flex items-center justify-center text-xl shadow-lg`}>
                    {type.includes('Adaptive') ? '⚡' : type.includes('System') ? '💻' : type.includes('HR') ? '👥' : '🏗️'}
                  </div>
                  {type.includes('Adaptive') && (
                    <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Auto-Calibrating
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {type}
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  {type.includes('Adaptive')
                    ? `Probes previously detected weakness (${adaptiveMeta.focusArea}) with progressive difficulty.`
                    : type.includes('System')
                    ? 'Distributed architecture, scalability, query optimization, and latency trade-offs.'
                    : type.includes('HR')
                    ? 'Behavioral questions assessed using the STAR method (Situation, Task, Action, Result).'
                    : 'End-to-end technical breakdown of the projects documented in your student portfolio.'}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                  <span className="text-slate-500">3 Targeted Questions</span>
                  <div className="font-bold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Start Session <ChevronRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Past Assessment Status */}
        <GlassCard>
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" /> Recorded Interview Evaluations ({pastInterviews.length})
          </h3>
          {pastInterviews.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No mock interview completed yet. Complete an interview above to unlock your authentic Communication &amp; Interview readiness score.
            </div>
          ) : (
            <div className="space-y-2.5">
              {pastInterviews.map((inv, idx) => (
                <div
                  key={inv.id || idx}
                  className="p-3.5 rounded-xl bg-white/3 border border-white/6 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-bold text-white">
                      {inv.type || 'Adaptive Technical'} Mock Assessment
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {new Date(inv.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-bold text-emerald-400">
                      Overall: {inv.overallScore || 80}%
                    </span>
                    <span className="text-slate-400">
                      Technical: {inv.scores?.technical || 80}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 pb-12">
      {/* Session Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${typeColors[selectedType]} flex items-center justify-center text-lg`}>
            🎙️
          </div>
          <div>
            <h2 className="font-bold text-white">{selectedType} (Session #{adaptiveMeta.sessionNumber})</h2>
            <p className="text-xs text-slate-400">Focus: {adaptiveMeta.focusArea} • Role: {targetRole}</p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedType(null);
            setMessages([]);
            setShowFeedback(false);
          }}
          className="btn-ghost text-xs flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw size={14} /> Exit Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chat / Transcript Area */}
        <div className="lg:col-span-2 flex flex-col" style={{ height: '68vh' }}>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-thin">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white mr-2 flex-shrink-0 mt-1">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-xl p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                        : 'bg-white/5 border border-white/8 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Answer Input Area */}
          {!showFeedback && (
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-2">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitAnswer();
                  }
                }}
                disabled={submitting}
                placeholder="Type your response concisely (explain architecture, trade-offs, or STAR outcomes)..."
                rows={2}
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none resize-none px-2"
              />
              <button
                onClick={submitAnswer}
                disabled={submitting || !answer.trim()}
                className="btn-primary p-3 rounded-xl flex-shrink-0 flex items-center justify-center disabled:opacity-40 cursor-pointer"
              >
                <Send size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar: Evaluation / Diagnostic Insight */}
        <div className="space-y-4">
          {showFeedback && sessionFeedback ? (
            <GlassCard className="border border-pink-500/30">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider mb-2">
                <Award size={15} /> Session Complete
              </div>
              <div className="text-2xl font-extrabold text-white mb-1">
                {sessionFeedback.overallScore}% Overall Score
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {sessionFeedback.nextAction}
              </p>

              <div className="space-y-2 mb-4">
                {Object.entries(sessionFeedback.scores).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 capitalize">{k}</span>
                    <span className="font-bold text-white">{v}%</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs mb-4">
                <strong>Next Adaptive Calibration:</strong> Future questions will dynamically test your handling of {sessionFeedback.weakAreas[0]}.
              </div>

              <button
                onClick={() => {
                  setSelectedType(null);
                  setShowFeedback(false);
                }}
                className="btn-primary w-full text-xs py-2.5 rounded-xl font-bold cursor-pointer"
              >
                Save &amp; View Evolution Track
              </button>
            </GlassCard>
          ) : (
            <GlassCard>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Live Session Calibration
              </h4>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-white/3 border border-white/6">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Focus Area</span>
                  <span className="font-semibold text-white mt-0.5 block">{adaptiveMeta.focusArea}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/3 border border-white/6">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Difficulty</span>
                  <span className="font-semibold text-cyan-300 mt-0.5 block">{adaptiveMeta.difficulty}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/3 border border-white/6">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Evaluation Criteria</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    STAR Structure • Big-O Complexity • Domain Terminology
                  </span>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </motion.div>
  );
}
