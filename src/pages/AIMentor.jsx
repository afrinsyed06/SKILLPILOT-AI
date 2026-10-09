import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Bot,
  Copy,
  Check,
  RotateCcw,
  Settings,
  Key,
  ShieldCheck,
  Flame,
  MessageSquare,
  Download,
  ChevronDown,
  Terminal,
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { calculateProfileCompleteness } from '../utils/profileCompleteness';
import { getUserStats, getAdaptiveOpportunity } from '../services/db';
import {
  generateChatbotResponse,
  getStoredGeminiKey,
  saveStoredGeminiKey,
  getSelectedModel,
  saveSelectedModel,
  GENERATIVE_AI_MODELS,
  MENTOR_PERSONAS,
} from '../services/generativeAIService';
import FeedbackModal from '../components/features/FeedbackModal';

export default function AIMentor() {
  const { profile, user } = useAuth();
  const completeness = calculateProfileCompleteness(profile);

  const studentName = profile?.fullName || user?.name || 'Student';
  const firstName = studentName.split(' ')[0];
  const targetRole = profile?.targetRole || 'Career Explorer';
  const userSkills = Array.isArray(profile?.skills) ? profile.skills : [];
  const userProjects = Array.isArray(profile?.projects) ? profile.projects : [];
  const streak = profile?.streak ?? 0;
  const stats = getUserStats(user?.id || '1001');
  const adaptiveOpp = getAdaptiveOpportunity(user?.id || '1001');

  // AI Configuration state
  const [selectedModel, setSelectedModel] = useState(() => getSelectedModel());
  const [selectedPersona, setSelectedPersona] = useState('career_coach');
  const [apiKey, setApiKey] = useState(() => getStoredGeminiKey());
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(() => getStoredGeminiKey());
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const initials = (studentName || 'U')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  const initialMessages = [
    {
      role: 'ai',
      text: `Hello ${firstName}! 👋 I am your **Generative AI Placement Copilot & Career Mentor**.\n\nI have synthesized your profile targeting **${targetRole}** with **${userSkills.length} verified skills** and your **${stats.streak}-day learning streak**.\n\nWhat can I generate for you today? Ask me for a **custom DSA roadmap**, **mock interview questions**, **code debugging**, or **ATS resume advice**! 🚀`,
      source: 'Generative AI Engine',
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

  const handleSendMessage = async (customPrompt) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || typing) return;

    setInput('');
    const updatedMessages = [...messages, { role: 'user', text: textToSend }];
    setMessages(updatedMessages);
    setTyping(true);

    try {
      const responseObj = await generateChatbotResponse({
        prompt: textToSend,
        conversationHistory: updatedMessages,
        studentProfile: profile,
        studentStats: stats,
        adaptiveOpportunity: adaptiveOpp,
        personaId: selectedPersona,
        modelId: selectedModel,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: responseObj.text,
          source: responseObj.source,
          model: responseObj.model,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `I ran into a temporary generation hiccup. Please ask again or try asking for a **DSA roadmap**, **system design breakdown**, or **mock interview practice**!`,
          source: 'Generative AI Failover',
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSaveSettings = () => {
    saveStoredGeminiKey(tempApiKey);
    setApiKey(tempApiKey);
    saveSelectedModel(selectedModel);
    setShowSettingsModal(false);
  };

  const handleClearChat = () => {
    setMessages(initialMessages);
  };

  const handleExportChat = () => {
    const exportData = messages
      .map((m) => `[${m.role.toUpperCase()}]\n${m.text}\n`)
      .join('\n---\n\n');
    const blob = new Blob([exportData], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillPilot-Generative-AI-Chat-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Quick Prompt Chips
  const GENERATIVE_PROMPTS = [
    `Generate 4-Week DSA Roadmap for ${targetRole}`,
    'Simulate a Live Technical Mock Interview',
    "Explain Kadane's Algorithm with Python Code",
    'Review & Optimize My Resume for ATS',
    'How to Answer: Tell Me About a Conflict (STAR)',
    'Explain Database Indexing (B+ Tree vs Hash)',
  ];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-blue-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
              <Sparkles size={12} className="text-blue-600" />
              GENERATIVE AI COPILOT
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200">
              {apiKey ? '⚡ Gemini API Active' : '🧠 Built-in Generative Engine'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Generative AI Career <span className="text-blue-600">Mentor</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Next-Gen Conversational Intelligence calibrated dynamically to your authentic student profile & performance
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Persona selector */}
          <select
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 focus:outline-hidden focus:border-blue-500 cursor-pointer"
          >
            {MENTOR_PERSONAS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Model selector */}
          <select
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              saveSelectedModel(e.target.value);
            }}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 focus:outline-hidden focus:border-blue-500 cursor-pointer"
          >
            {GENERATIVE_AI_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.badge})
              </option>
            ))}
          </select>

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-white text-slate-700 hover:text-blue-600 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Configure Gemini API Key"
          >
            <Settings size={15} />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Feedback Trigger */}
          <button
            type="button"
            onClick={() => setFeedbackOpen(true)}
            className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-2xs"
            title="Give Chatbot Feedback"
          >
            <MessageSquare size={15} />
            <span className="hidden sm:inline">Feedback</span>
          </button>
        </div>
      </div>

      {/* ── Main Chat Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Chat Window */}
        <div className="lg:col-span-8 flex flex-col h-[74vh] bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden">
          {/* Quick Prompts Carousel */}
          <div className="p-3 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-blue-50/70 border-b border-blue-100 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[11px] font-black text-blue-700 uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1">
              <Sparkles size={12} /> SUGGESTED:
            </span>
            {GENERATIVE_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-700 border border-blue-200 hover:border-blue-500 hover:text-blue-700 hover:shadow-xs transition-all whitespace-nowrap cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto bg-slate-50/30">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-base shadow-md shadow-blue-500/20 shrink-0 mt-0.5">
                      🤖
                    </div>
                  )}

                  <div className="max-w-[85%] space-y-1">
                    <div
                      className={`p-4 rounded-3xl text-xs md:text-sm leading-relaxed shadow-xs ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-xs font-medium'
                          : 'bg-white text-slate-800 border border-blue-100/90 rounded-bl-xs'
                      }`}
                    >
                      <div
                        className="prose prose-sm max-w-none break-words"
                        dangerouslySetInnerHTML={{
                          __html: msg.text
                            .replace(/### (.*?)\n/g, '<h3 class="text-sm font-bold text-slate-900 mt-2 mb-1">$1</h3>')
                            .replace(/#### (.*?)\n/g, '<h4 class="text-xs font-bold text-blue-700 mt-2 mb-1">$1</h4>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/`([^`]+)`/g, '<code class="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[11px] font-mono border border-blue-100">$1</code>')
                            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-slate-900 text-emerald-300 p-3 rounded-xl text-xs font-mono my-2 overflow-x-auto border border-slate-700"><code>$2</code></pre>')
                            .replace(/\n\n/g, '<br/><br/>')
                            .replace(/\n/g, '<br/>'),
                        }}
                      />
                    </div>

                    {/* Metadata / Action Bar */}
                    {msg.role === 'ai' && (
                      <div className="flex items-center justify-between text-[10px] text-slate-400 px-2">
                        <span className="font-semibold text-blue-600 flex items-center gap-1">
                          <Sparkles size={10} /> {msg.source || 'Generative AI'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.text, i)}
                          className="flex items-center gap-1 hover:text-slate-700 cursor-pointer font-bold transition-colors"
                        >
                          {copiedIndex === i ? (
                            <>
                              <Check size={11} className="text-emerald-500" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>Copy Response</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0 mt-0.5">
                      {initials}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-base shadow-md shadow-blue-500/20 shrink-0">
                  🤖
                </div>
                <div className="bg-white border border-blue-100 rounded-2xl px-4 py-3 flex items-center gap-2 text-xs text-slate-500 shadow-xs">
                  <Sparkles size={14} className="text-blue-600 animate-spin" />
                  <span className="font-bold">Generative AI is generating response...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="p-3.5 bg-white border-t border-slate-100 shrink-0 space-y-2">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask Generative AI about code, algorithms, DSA roadmap, system design..."
                rows={2}
                className="flex-1 resize-none rounded-2xl px-4 py-3 text-xs md:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={typing || !input.trim()}
                className="btn-primary p-3.5 rounded-2xl flex-shrink-0 flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 transition-all"
                title="Send Message (Enter)"
              >
                <Send size={18} />
              </button>
            </div>

            {/* Utility footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck size={12} className="text-emerald-500" />
                Personalized for {targetRole} • Press <kbd className="px-1 py-0.2 bg-slate-100 border rounded text-[10px] font-mono">Enter</kbd> to send
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="hover:text-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw size={11} /> Clear
                </button>
                <button
                  type="button"
                  onClick={handleExportChat}
                  className="hover:text-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Download size={11} /> Export Markdown
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Profile Context & Generative AI Insights */}
        <div className="lg:col-span-4 space-y-4">
          {/* Authenticated Student Snapshot */}
          <div className="p-5 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center justify-between">
              <span>Student Profile Sync</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Target Role</span>
                <span className="font-bold text-slate-900">{targetRole}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Skills Profile</span>
                <span className="font-bold text-blue-700">{userSkills.length} Verified</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Accuracy & Questions</span>
                <span className="font-bold text-emerald-700">{stats.accuracy}% ({stats.totalQuestions})</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Active Streak</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <Flame size={13} className="fill-amber-500 text-amber-500" /> {stats.streak} Days
                </span>
              </div>
            </div>
          </div>

          {/* AI Focus Frontier */}
          {adaptiveOpp && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-amber-200/80 shadow-sm space-y-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200/80 text-amber-900 border border-amber-300">
                ACTIVE AI DIAGNOSTIC
              </span>
              <h4 className="text-sm font-black text-slate-900">
                Focus Gap: {adaptiveOpp.weakTopic}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generative AI recommends practicing 5 problems in {adaptiveOpp.weakTopic} to push accuracy above 75%.
              </p>
              <button
                type="button"
                onClick={() => handleSendMessage(`Help me master ${adaptiveOpp.weakTopic} step by step`)}
                className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
              >
                Generate Remediation Plan 🎯
              </button>
            </div>
          )}

          {/* Model Status Card */}
          <div className="p-5 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Generative AI Engine Info
            </h4>
            <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs space-y-1">
              <div className="font-bold text-blue-900 flex items-center justify-between">
                <span>Model: {GENERATIVE_AI_MODELS.find((m) => m.id === selectedModel)?.name}</span>
                <span className="text-[10px] text-blue-600 font-bold">Active</span>
              </div>
              <div className="text-[11px] text-slate-500 leading-tight">
                {apiKey ? 'Connected to Google Gemini API' : 'Using Zero-Config Built-in Generative Neural Engine'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="w-full py-2.5 rounded-xl border border-blue-200 hover:bg-blue-50/50 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Key size={13} />
              <span>{apiKey ? 'Manage Gemini API Key' : 'Connect Custom Gemini API Key'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Settings & Gemini API Key Modal ── */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-blue-100 space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                  ⚙️
                </div>
                <h3 className="text-base font-black text-slate-900">Generative AI Settings</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label htmlFor="gemini-key" className="font-bold text-slate-700 block">
                  Google Gemini API Key (Optional)
                </label>
                <input
                  id="gemini-key"
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:border-blue-500 focus:outline-hidden"
                />
                <p className="text-[11px] text-slate-500">
                  Leave blank to use the free **Built-in Generative AI Reasoning Engine**. To use Google Gemini directly, get a key from{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 font-bold underline"
                  >
                    Google AI Studio
                  </a>.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Default Generative Model</label>
                <div className="space-y-2">
                  {GENERATIVE_AI_MODELS.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedModel === m.id
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                          : 'border-slate-200 text-slate-700 hover:border-blue-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs">{m.name}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{m.desc}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 font-semibold">
                        {m.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="btn-primary px-5 py-2 rounded-xl text-xs font-black cursor-pointer shadow-md shadow-blue-500/20"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Feedback Modal ── */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        initialCategory="ai_chatbot"
      />
    </div>
  );
}
