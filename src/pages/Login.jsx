import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Sparkles, ArrowRight, Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const defaultLogin = { email: '', password: '' };
const defaultRegister = { name: '', email: '', password: '', confirmPassword: '', college: '', targetRole: '' };

function InputField({ label, id, type = 'text', value, onChange, placeholder, icon: Icon, error, showToggle, onToggle, showValue }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-slate-400">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
            <Icon size={15} />
          </div>
        )}
        <input
          id={id}
          type={showToggle ? (showValue ? 'text' : 'password') : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'off'}
          className={`w-full rounded-xl border px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 ${Icon ? 'pl-10' : ''} ${showToggle ? 'pr-10' : ''} ${
            error
              ? 'border-red-500/50 bg-red-500/5 focus:border-red-500/70'
              : 'border-white/10 bg-white/5 focus:border-blue-500/50 focus:bg-blue-500/5'
          }`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showValue ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

export default function Login() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState(defaultLogin);
  const [regForm, setRegForm] = useState(defaultRegister);
  const [loginErrors, setLoginErrors] = useState({});
  const [regErrors, setRegErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const setMode_ = (m) => {
    setMode(m);
    setGlobalError('');
    setLoginErrors({});
    setRegErrors({});
    setShowPassword(false);
    setShowConfirm(false);
  };

  // ── Login Submit ───────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setLoginErrors({});
    const errs = {};
    if (!loginForm.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email.trim()))
      errs.email = 'Please enter a valid email address.';
    if (!loginForm.password) errs.password = 'Password is required.';
    if (Object.keys(errs).length > 0) { setLoginErrors(errs); return; }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400)); // slight delay for UX
    const result = login({ email: loginForm.email, password: loginForm.password });
    setIsSubmitting(false);

    if (!result.success) {
      setGlobalError(result.error);
    }
  };

  // ── Register Submit ────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setRegErrors({});
    const errs = {};
    if (!regForm.name.trim()) errs.name = 'Full name is required.';
    if (!regForm.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email.trim()))
      errs.email = 'Please enter a valid email address.';
    if (!regForm.password) errs.password = 'Password is required.';
    else if (regForm.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (!regForm.confirmPassword) errs.confirmPassword = 'Please confirm your password.';
    else if (regForm.password !== regForm.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    if (Object.keys(errs).length > 0) { setRegErrors(errs); return; }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = register({
      name: regForm.name,
      email: regForm.email,
      password: regForm.password,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setGlobalError(result.error);
    }
    // On success, AuthContext sets user/profile → App.jsx renders dashboard automatically
  };

  const features = [
    { icon: '🎯', text: 'AI-Powered Career Analysis' },
    { icon: '📄', text: 'Smart Resume Analyzer' },
    { icon: '🧠', text: 'Skill Gap Detection' },
    { icon: '🎤', text: 'Mock Interview Arena' },
    { icon: '🗺️', text: 'Personalized Learning Roadmap' },
    { icon: '💼', text: 'Smart Job Matching' },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: '#020817' }}
    >
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      {/* Ambient glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)' }} />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10"
        style={{
          background: 'rgba(10,18,38,0.95)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
          backdropFilter: 'blur(30px)',
        }}
      >
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          {/* ── Left Panel ─────────────────────────────────────────────── */}
          <div
            className="p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-white/8 flex flex-col"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.06))' }}
          >
            {/* Brand */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
              >
                🎓
              </div>
              <div>
                <div className="text-sm font-black text-white tracking-wide">SKILLPILOT</div>
                <div className="text-[10px] text-blue-400 font-semibold tracking-[0.2em] uppercase">AI Career Copilot</div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-[0.15em] w-fit mb-6">
              <Sparkles size={12} /> AI-Powered Platform
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
              Your Personal<br />
              <span className="gradient-text">AI Career Copilot</span>
            </h1>

            <p className="text-sm text-slate-400 leading-6 mb-8 max-w-sm">
              One account. One profile. Your entire placement journey — from skill gaps to job offers — powered by AI.
            </p>

            {/* Feature list */}
            <div className="space-y-3">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}
                  >
                    {f.icon}
                  </div>
                  <span className="text-sm text-slate-300">{f.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-white/5">
              <p className="text-xs text-slate-600">
                🔒 Your data is private and securely stored. One account per person. No profile switching.
              </p>
            </div>
          </div>

          {/* ── Right Panel ─────────────────────────────────────────────── */}
          <div className="p-8 md:p-10 flex flex-col">
            {/* Mode Toggle */}
            <div className="flex rounded-xl border border-white/10 bg-white/4 p-1 mb-7">
              {[
                { id: 'login', label: 'Sign In', icon: LogIn },
                { id: 'register', label: 'Create Account', icon: UserPlus },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setMode_(id)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    mode === id
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/25'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            {/* Global error */}
            <AnimatePresence>
              {globalError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 flex items-center gap-2 text-sm text-red-300"
                >
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {globalError}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {/* ── Login Form ─────────────────────────────────────────── */}
              {mode === 'login' && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  onSubmit={handleLogin}
                  className="space-y-4 flex-1"
                  noValidate
                >
                  <div className="mb-2">
                    <h2 className="text-xl font-bold text-white">Welcome back</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Sign in to continue your career journey</p>
                  </div>

                  <InputField
                    id="login-email"
                    label="Email address"
                    type="email"
                    value={loginForm.email}
                    onChange={(v) => { setLoginForm((f) => ({ ...f, email: v })); setLoginErrors((e) => ({ ...e, email: '' })); }}
                    placeholder="you@example.com"
                    icon={Mail}
                    error={loginErrors.email}
                  />
                  <InputField
                    id="login-password"
                    label="Password"
                    type="password"
                    value={loginForm.password}
                    onChange={(v) => { setLoginForm((f) => ({ ...f, password: v })); setLoginErrors((e) => ({ ...e, password: '' })); }}
                    placeholder="Enter your password"
                    icon={Lock}
                    error={loginErrors.password}
                    showToggle
                    showValue={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                  />

                  <div className="flex justify-end">
                    <button type="button" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-95 active:scale-[0.98] disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
                  >
                    {isSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                    ) : (
                      <><LogIn size={16} /> Sign In to Dashboard <ArrowRight size={15} /></>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-500 pt-2">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setMode_('register')} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                      Create one free
                    </button>
                  </p>
                </motion.form>
              )}

              {/* ── Register Form ─────────────────────────────────────── */}
              {mode === 'register' && (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  onSubmit={handleRegister}
                  className="space-y-3.5 flex-1"
                  noValidate
                >
                  <div className="mb-1">
                    <h2 className="text-xl font-bold text-white">Create your account</h2>
                    <p className="text-xs text-slate-500 mt-0.5">One account · One profile · Lifetime access</p>
                  </div>

                  <InputField
                    id="reg-name"
                    label="Full Name *"
                    value={regForm.name}
                    onChange={(v) => { setRegForm((f) => ({ ...f, name: v })); setRegErrors((e) => ({ ...e, name: '' })); }}
                    placeholder="e.g. Afrin Syed"
                    icon={User}
                    error={regErrors.name}
                  />
                  <InputField
                    id="reg-email"
                    label="Email Address *"
                    type="email"
                    value={regForm.email}
                    onChange={(v) => { setRegForm((f) => ({ ...f, email: v })); setRegErrors((e) => ({ ...e, email: '' })); }}
                    placeholder="you@example.com"
                    icon={Mail}
                    error={regErrors.email}
                  />
                  <InputField
                    id="reg-password"
                    label="Password * (min 8 characters)"
                    type="password"
                    value={regForm.password}
                    onChange={(v) => { setRegForm((f) => ({ ...f, password: v })); setRegErrors((e) => ({ ...e, password: '' })); }}
                    placeholder="Create a strong password"
                    icon={Lock}
                    error={regErrors.password}
                    showToggle
                    showValue={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                  />
                  <InputField
                    id="reg-confirm"
                    label="Confirm Password *"
                    type="password"
                    value={regForm.confirmPassword}
                    onChange={(v) => { setRegForm((f) => ({ ...f, confirmPassword: v })); setRegErrors((e) => ({ ...e, confirmPassword: '' })); }}
                    placeholder="Repeat your password"
                    icon={Lock}
                    error={regErrors.confirmPassword}
                    showToggle
                    showValue={showConfirm}
                    onToggle={() => setShowConfirm((v) => !v)}
                  />

                  {/* Password match indicator */}
                  {regForm.password && regForm.confirmPassword && (
                    <div className={`flex items-center gap-1.5 text-xs ${regForm.password === regForm.confirmPassword ? 'text-emerald-400' : 'text-red-400'}`}>
                      {regForm.password === regForm.confirmPassword
                        ? <><CheckCircle2 size={12} /> Passwords match</>
                        : <><AlertCircle size={12} /> Passwords don't match</>
                      }
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-95 active:scale-[0.98] disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', boxShadow: '0 0 20px rgba(139,92,246,0.3)' }}
                  >
                    {isSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                    ) : (
                      <><UserPlus size={16} /> Create My Account <ArrowRight size={15} /></>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-500">
                    Already have an account?{' '}
                    <button type="button" onClick={() => setMode_('login')} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                      Sign in
                    </button>
                  </p>

                  <p className="text-[10px] text-slate-600 text-center leading-relaxed">
                    By creating an account you agree to our Terms of Service and Privacy Policy.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
