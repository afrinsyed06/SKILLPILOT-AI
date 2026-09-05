import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ResumeAI from './pages/ResumeAI';
import SkillGap from './pages/SkillGap';
import CareerDiscovery from './pages/CareerDiscovery';
import Roadmap from './pages/Roadmap';
import CodingIntelligence from './pages/CodingIntelligence';
import InterviewArena from './pages/InterviewArena';
import Analytics from './pages/Analytics';
import JobMatching from './pages/JobMatching';
import Achievements from './pages/Achievements';
import AIMentor from './pages/AIMentor';
import Account from './pages/Account';
import Login from './pages/Login';
import QuestionArena from './pages/QuestionArena';
import LeaderboardPage from './pages/LeaderboardPage';

// ─── Loading Screen ────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#020817' }}
    >
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', boxShadow: '0 0 30px rgba(59,130,246,0.4)' }}
        >
          🎓
        </div>
        <div className="text-white font-bold text-xl mb-2">SKILLPILOT AI</div>
        <div className="flex items-center justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-blue-500"
              style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Protected Route ──────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// ─── Public Route (redirect to dashboard if already logged in) ────────────────
function PublicRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (user) return <Navigate to="/" replace />;
  return children;
}

// ─── App Routes ───────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="resume" element={<ResumeAI />} />
        <Route path="skill-gap" element={<SkillGap />} />
        <Route path="career" element={<CareerDiscovery />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="coding" element={<CodingIntelligence />} />
        <Route path="interview" element={<InterviewArena />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="jobs" element={<JobMatching />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="arena" element={<QuestionArena />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="mentor" element={<AIMentor />} />
        <Route path="account" element={<Account />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
