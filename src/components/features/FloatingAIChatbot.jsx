import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Sparkles,
  X,
  Maximize2,
  Send,
  RotateCcw,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserStats, getAdaptiveOpportunity } from '../../services/db';
import { generateChatbotResponse } from '../../services/generativeAIService';

export default function FloatingAIChatbot({ onOpenFeedback }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const studentName = profile?.fullName || user?.name || 'Student';
  const firstName = studentName.split(' ')[0];
  const targetRole = profile?.targetRole || 'Career Explorer';
  const stats = getUserStats(user?.id || '1001');
  const adaptiveOpp = getAdaptiveOpportunity(user?.id || '1001');

  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: `Hi ${firstName}! 👋 I'm your **Generative AI Copilot**.\n\nAsk me anything about **DSA**, **${targetRole} roadmaps**, mock interview questions, or debugging code! 🚀`,
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typing, isOpen]);

  // If user is already on the full /mentor page, hide the floating widget
  if (location.pathname === '/mentor') return null;

  const handleSend = async (customPrompt) => {
    const promptText = (customPrompt || input).trim();
    if (!promptText || typing) return;

    setInput('');
    const newHistory = [...messages, { role: 'user', text: promptText }];
    setMessages(newHistory);
    setTyping(true);

    try {
      const result = await generateChatbotResponse({
        prompt: promptText,
        conversationHistory: newHistory,
        studentProfile: profile,
        studentStats: stats,
        adaptiveOpportunity: adaptiveOpp,
        personaId: 'career_coach',
      });

      setMessages((prev) => [...prev, { role: 'ai', text: result.text, source: result.source }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `I encountered an issue processing that. Please try asking about DSA algorithms, ${targetRole} roadmap, or interview questions!`,
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Bubble */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full text-white font-black text-xs shadow-2xl cursor-pointer border border-white/30 backdrop-blur-md"
          style={{
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #4f46e5 100%)',
            boxShadow: '0 12px 32px rgba(37, 99, 235, 0.45)',
          }}
          aria-label="Toggle Generative AI Chatbot"
        >
          <div className="relative">
            <Bot size={18} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
          </div>
          <span className="hidden sm:inline">Ask Generative AI</span>
          <Sparkles size={14} className="text-amber-300" />
        </motion.button>
      </div>

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            className="fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-[410px] h-[550px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden"
            style={{
              boxShadow: '0 25px 60px -15px rgba(37, 99, 235, 0.3)',
            }}
          >
            {/* Header */}
            <div
              className="p-4 text-white flex items-center justify-between"
              style={{
                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg">
                  🤖
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-tight flex items-center gap-1.5">
                    <span>Generative AI Copilot</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase bg-emerald-400 text-slate-900">
                      LIVE
                    </span>
                  </h3>
                  <p className="text-[10px] text-blue-100 font-medium">
                    Calibrated for {targetRole}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/mentor');
                  }}
                  title="Open Fullscreen Mentor"
                  className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <Maximize2 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 bg-blue-50/70 border-b border-blue-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                `Roadmap for ${targetRole}`,
                'Ask me a technical question',
                "Kadane's algorithm code",
                'Resume ATS keywords',
              ].map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap cursor-pointer shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-3.5 space-y-3 overflow-y-auto bg-slate-50/50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white shadow-xs rounded-br-xs'
                        : 'bg-white text-slate-800 border border-blue-100 shadow-xs rounded-bl-xs'
                    }`}
                  >
                    <div
                      className="whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{
                        __html: msg.text
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n\n/g, '<br/><br/>')
                          .replace(/\n/g, '<br/>'),
                      }}
                    />
                    {msg.source && (
                      <div className="text-[9px] text-blue-500 font-bold mt-1 text-right">
                        ✨ {msg.source}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white border border-blue-100 rounded-2xl px-3.5 py-2 text-xs flex items-center gap-1.5 text-slate-400">
                    <Sparkles size={13} className="text-blue-500 animate-spin" />
                    <span className="text-[11px] font-semibold">Generative AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Generative AI anything..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="btn-primary p-2 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                aria-label="Send"
              >
                <Send size={15} />
              </button>
            </form>

            {/* Footer with feedback trigger */}
            <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Powered by Generative AI</span>
              {onOpenFeedback && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenFeedback();
                  }}
                  className="text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <MessageSquare size={10} />
                  <span>Give Feedback</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
