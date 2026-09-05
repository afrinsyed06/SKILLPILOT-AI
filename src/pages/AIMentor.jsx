import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { chatSuggestions } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { calculateProfileCompleteness } from '../utils/profileCompleteness';
import { getUserStats, getAdaptiveOpportunity } from '../services/db';

const formatAIText = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
};

export default function AIMentor() {
  const { profile, user } = useAuth();
  const completeness = calculateProfileCompleteness(profile);

  const studentName = profile?.fullName || user?.name || 'Student';
  const firstName = studentName.split(' ')[0];
  const targetRole = profile?.targetRole || 'Career Explorer';
  const userSkills = Array.isArray(profile?.skills) ? profile.skills : [];
  const userProjects = Array.isArray(profile?.projects) ? profile.projects : [];
  const hasResume = Boolean(profile?.resume?.fileName || profile?.resume?.uploadedAt);
  const streak = profile?.streak ?? 0;
  const stats = getUserStats(user?.id || '1001');

  const initials = (studentName || 'U')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  const initialMessages = [
    {
      role: 'ai',
      text: `Hello ${firstName}! 👋 I'm your **AI Career Mentor**.\n\nI have evaluated your authenticated profile targeting **${targetRole}**. I will answer your questions based **strictly on your provided details** (${userSkills.length} skills, ${userProjects.length} projects recorded).\n\nHow can I help you accelerate your placement journey today? 🚀`,
    },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const generateMentorResponse = (msg) => {
    const lower = msg.toLowerCase();

    if (lower.includes('learn next') || lower.includes('what should i learn')) {
      if (userSkills.length === 0) {
        return `You have not entered your technical skills in your profile yet! Head to **Edit Profile** to add the technologies you know, so I can detect your exact skill gaps for **${targetRole}**.`;
      }
      return `Based on your profile targeting **${targetRole}** and your current skills (${userSkills.slice(0, 4).join(', ')}), I recommend deepening your knowledge in **System Design** and **Advanced Algorithms**. Building a dedicated capstone project will elevate your placement readiness by an estimated **8-10%**. 🚀`;
    }

    if (lower.includes('ready for placement') || lower.includes('am i ready')) {
      if (completeness.percentage < 50) {
        return `Your profile is currently at **${completeness.percentage}% completeness**. To provide an accurate readiness evaluation, please complete your profile sections (Skills, Projects, Resume, and Mock Interview).`;
      }
      return `You are making great progress towards **${targetRole}**! Your profile is **${completeness.percentage}% complete**. Practice timed coding problems and complete a Mock Interview to finalize your technical evaluation. 💪`;
    }

    if (lower.includes('wrong') || lower.includes('difficulty') || lower.includes('dsa question')) {
      const opp = getAdaptiveOpportunity(user?.id || '1001');
      if (opp) {
        return `Your recent **${opp.weakTopic}** performance shows difficulty with low accuracy (**${opp.weakAccuracy}%** vs ${opp.strongTopic} at ${opp.strongAccuracy}%).\n\n**Recommended Strategy:**\n1. Review ${opp.weakTopic} core invariants\n2. Complete 5 Easy questions in the Question Arena\n3. Complete 3 Medium scenario questions\n4. Defeat the ${opp.weakTopic} mini assessment\n\n**Estimated Reward:** +${opp.rewardXP} XP 🎯`;
      }
      return `Your overall technical accuracy is at **${stats.accuracy}%** across ${stats.totalQuestions} questions solved. To improve, focus on high-frequency interview topics in the **Question Arena**! 🚀`;
    }

    if (lower.includes('dsa') || lower.includes('plan')) {
      return `Here is your customized DSA roadmap for **${targetRole}**:\n\n📅 **Week 1**: Arrays & HashMaps (Two Pointers, Sliding Window)\n📅 **Week 2**: Trees & Binary Search\n📅 **Week 3**: Graphs (BFS, DFS, Dijkstra)\n📅 **Week 4**: Dynamic Programming (1D & 2D)\n\nTarget solving 3 problems daily in the Question Arena! 🎯`;
    }

    if (lower.includes('resume') || lower.includes('improve resume')) {
      if (!hasResume) {
        return `You haven't uploaded a resume yet! Upload your resume in the **Resume AI** tab to unlock ATS analysis and custom keyword suggestions.`;
      }
      return `Your uploaded resume has an ATS compatibility score of **${profile.resume?.atsScore || 85}%**. Focus on adding quantified impact metrics to your project bullet points. 📄`;
    }

    if (lower.includes('career') || lower.includes('role') || lower.includes('suits')) {
      return `Your current selected target is **${targetRole}**. Based on your skills (${userSkills.length > 0 ? userSkills.join(', ') : 'pending'}), this role offers strong growth and market demand. You can explore alternative matches in the **Career Discovery** tab! 🎯`;
    }

    return `Great question! As your AI Career Mentor for **${targetRole}**, I'm analyzing your authentic profile progress (${stats.totalQuestions} questions attempted, ${stats.accuracy}% accuracy, ${stats.streak}-day streak). Keep up your consistency! 🔥 Is there a specific topic or interview question you'd like to practice?`;
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setTyping(true);

    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 600));

    const response = generateMentorResponse(msg);
    setMessages((prev) => [...prev, { role: 'ai', text: response }]);
    setTyping(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            AI Career <span className="gradient-text">Mentor</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            24/7 Career Advisor answering strictly based on your authentic student profile
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold text-emerald-400">AI Synced with Profile</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Chat window */}
        <div className="lg:col-span-3 flex flex-col" style={{ height: '70vh' }}>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
                >
                  {msg.role === 'ai' && (
                    <div
                      className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-1"
                      style={{ boxShadow: '0 0 15px rgba(59,130,246,0.4)' }}
                    >
                      <span className="text-base">🤖</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 text-sm leading-relaxed ${
                      msg.role === 'user' ? 'chat-user text-white' : 'chat-ai text-slate-200'
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatAIText(msg.text) }}
                  />
                  {msg.role === 'user' && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0 mt-1 text-xs font-bold text-white">
                      {initials}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-base">🤖</span>
                </div>
                <div className="chat-ai p-4 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-blue-400"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Box */}
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask me about your career, skills, roadmap, interview prep..."
                rows={2}
                className="w-full resize-none rounded-2xl px-5 py-3.5 pr-14 text-sm text-white placeholder-slate-500 outline-none bg-[#0a1526] border border-white/10 focus:border-blue-400"
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={typing || !input.trim()}
              className="btn-primary p-4 rounded-2xl flex-shrink-0 flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <GlassCard>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-violet-400" /> Try Asking
            </h3>
            <div className="space-y-2">
              {chatSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="w-full text-left p-2.5 rounded-xl text-xs text-slate-300 hover:text-white transition-all bg-white/3 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/10 cursor-pointer"
                >
                  "{s}"
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-bold text-white mb-3">Live Profile Context</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Target Role</span>
                <span className="text-white font-semibold">{targetRole}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Skills Added</span>
                <span className="text-emerald-400 font-semibold">{userSkills.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Projects</span>
                <span className="text-cyan-400 font-semibold">{userProjects.length}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Streak</span>
                <span className="text-amber-400 font-semibold">🔥 {streak} Days</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
