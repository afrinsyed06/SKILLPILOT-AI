import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getInitials(name = '') {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'U'
  );
}

/** Very simple deterministic obfuscation — NOT cryptographic, just avoids plain-text passwords */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32-bit integer
  }
  return 'sp_' + Math.abs(hash).toString(36) + '_' + str.length;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const USERS_KEY = 'skillpilot_users_v2';
const ACTIVE_KEY = 'skillpilot_active_v2';
const PROFILE_PREFIX = 'skillpilot_profile_v2_';

// ─── Default Profile Shape ───────────────────────────────────────────────────

export function makeDefaultProfile(userId, name, email) {
  return {
    userId,
    fullName: name,
    email,
    phone: '',
    location: '',
    college: '',
    degree: '',
    department: '',
    graduationYear: '',
    cgpa: '',
    targetRole: 'Career Explorer',
    careerGoal: '',
    preferredIndustry: '',
    preferredJobType: 'Full-time',
    skills: [],
    verifiedSkills: [], // [{ name, score, status: 'AI-VERIFIED' | 'AI-ASSESSED' | 'SELF-DECLARED', verifiedAt, testDetails }]
    softSkills: [],
    interests: [],
    projects: [], // [{ id, name, tech, desc, role, link, github, status, aiAnalysis }]
    certifications: [],
    codingProfile: {
      leetcode: '',
      github: '',
      hackerrank: '',
      totalSolved: 0,
    },
    resume: null, // { fileName, fileSize, uploadedAt, atsScore, roleMatch, keywords, suggestions }
    mockInterviews: [], // [{ id, type, date, overallScore, scores, feedback }]
    adaptiveInterviews: [], // [{ id, sessionNumber, type, scores, weakAreas, targetFocus, difficulty, feedback, date }]
    dailyMissions: null, // dynamic personalized missions
    milestones: [],
    isDemoAccount: false,
    linkedin: '',
    github: '',
    portfolio: '',
    bio: '',
    careerSummary: '',
    profilePhoto: '',
    // Gamification defaults for new users
    level: 1,
    xp: 0,
    xpToNext: 1000,
    streak: 0,
    placementScore: 0,
    joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    avatarColor: 'from-blue-500 to-cyan-500',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ─── Storage Accessors ────────────────────────────────────────────────────────

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getStoredProfile(userId) {
  try {
    const raw = localStorage.getItem(PROFILE_PREFIX + userId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveStoredProfile(profile) {
  const updated = { ...profile, updatedAt: new Date().toISOString() };
  localStorage.setItem(PROFILE_PREFIX + profile.userId, JSON.stringify(updated));
  return updated;
}

function getActiveUserId() {
  return localStorage.getItem(ACTIVE_KEY) || null;
}

function setActiveUserId(id) {
  localStorage.setItem(ACTIVE_KEY, String(id));
}

function clearActiveUserId() {
  localStorage.removeItem(ACTIVE_KEY);
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // { id, email, name, passwordHash, createdAt }
  const [profile, setProfile] = useState(null); // full student profile object
  const [isLoading, setIsLoading] = useState(true);

  // ── Bootstrap: check existing session on mount ────────────────────────────
  useEffect(() => {
    const activeId = getActiveUserId();
    let users = getStoredUsers();

    if (activeId) {
      const found = users.find((u) => String(u.id) === String(activeId));
      if (found) {
        let storedProfile = getStoredProfile(found.id);
        if (!storedProfile) {
          storedProfile = makeDefaultProfile(found.id, found.name, found.email);
          saveStoredProfile(storedProfile);
        }
        setUser(found);
        setProfile(storedProfile);
        setIsLoading(false);
        return;
      }
    }

    // Default fallback demo account for Afrin S if no active session
    let defaultUser = users.find((u) => u.email === 'afrinsyedmoh2006@gmail.com');
    if (!defaultUser) {
      defaultUser = {
        id: '1001',
        name: 'Afrin S',
        email: 'afrinsyedmoh2006@gmail.com',
        passwordHash: simpleHash('password123'),
        createdAt: new Date().toISOString(),
      };
      users = [...users, defaultUser];
      saveStoredUsers(users);
    }

    let defaultProfile = getStoredProfile(defaultUser.id);
    if (!defaultProfile) {
      defaultProfile = {
        ...makeDefaultProfile(defaultUser.id, 'Afrin S', 'afrinsyedmoh2006@gmail.com'),
        phone: '+91 98765 43210',
        location: 'Bengaluru, India',
        college: 'National Institute of Technology',
        degree: 'B.Tech',
        department: 'Computer Science & Engineering',
        graduationYear: '2025',
        cgpa: '8.8',
        targetRole: 'AI/ML Engineer',
        careerGoal: 'Join a top AI tech company as a Machine Learning Engineer',
        preferredIndustry: 'Artificial Intelligence & Software',
        preferredJobType: 'Full-time',
        skills: ['Python', 'React', 'Machine Learning', 'Data Structures', 'PyTorch', 'SQL'],
        softSkills: ['Problem Solving', 'Team Collaboration', 'Communication', 'Critical Thinking'],
        interests: ['AI / Machine Learning', 'Open Source', 'Competitive Programming'],
        projects: [
          {
            id: 1,
            name: 'Sentiment Analysis API',
            tech: ['Python', 'Flask', 'BERT', 'Docker'],
            desc: 'NLP-based sentiment classifier with REST API',
            role: 'Lead ML Developer',
            link: 'https://demo-sentiment.io',
            github: 'https://github.com/afrin-s/sentiment-api',
            stars: 24,
            status: 'Completed',
          },
          {
            id: 2,
            name: 'Student Placement Predictor',
            tech: ['Python', 'Scikit-learn', 'Pandas', 'Streamlit'],
            desc: 'ML model predicting student placement chances with 89% accuracy',
            role: 'Developer',
            link: 'https://placement-ai.io',
            github: 'https://github.com/afrin-s/placement-predictor',
            stars: 18,
            status: 'Completed',
          },
        ],
        certifications: [
          { id: 1, name: 'Machine Learning Specialization', issuer: 'Coursera (Andrew Ng)', year: '2023', link: 'https://coursera.org' },
          { id: 2, name: 'Python for Data Science', issuer: 'IBM', year: '2023', link: 'https://ibm.com' },
        ],
        codingProfile: {
          leetcode: 'afrin_code',
          github: 'afrin-s',
          hackerrank: 'afrin_s',
          totalSolved: 234,
        },
        resume: {
          fileName: 'Afrin_Syed_Resume_2025.pdf',
          fileSize: '156 KB',
          uploadedAt: new Date().toISOString(),
          atsScore: 87,
          roleMatch: 87,
        },
        mockInterviews: [
          {
            id: 1,
            type: 'Technical',
            date: new Date().toISOString(),
            overallScore: 82,
            scores: { technical: 85, communication: 80, problemSolving: 82 },
            feedback: 'Strong grasp of Python and ML concepts. Articulate thought process clearly.',
          },
        ],
        linkedin: 'linkedin.com/in/afrin-s',
        github: 'github.com/afrin-s',
        portfolio: 'afrins.dev',
        bio: 'Passionate Computer Science student specializing in AI/ML and full-stack development.',
        careerSummary: 'Aspiring AI/ML Engineer with strong foundation in Python, algorithms, and web frameworks.',
        placementScore: 84,
        level: 3,
        streak: 5,
        xp: 1450,
      };
      saveStoredProfile(defaultProfile);
    }

    setActiveUserId(defaultUser.id);
    setUser(defaultUser);
    setProfile(defaultProfile);
    setIsLoading(false);
  }, []);

  // ── Register ──────────────────────────────────────────────────────────────
  const register = useCallback(({ name, email, password }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    // Validation
    if (!trimmedName) return { success: false, error: 'Please enter your full name.' };
    if (!trimmedEmail) return { success: false, error: 'Please enter your email address.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail))
      return { success: false, error: 'Please enter a valid email address.' };
    if (!password || password.length < 8)
      return { success: false, error: 'Password must be at least 8 characters.' };

    const users = getStoredUsers();
    const existing = users.find((u) => u.email === trimmedEmail);
    if (existing) return { success: false, error: 'An account with this email already exists.' };

    const newUser = {
      id: Date.now(),
      name: trimmedName,
      email: trimmedEmail,
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString(),
    };

    const newProfile = makeDefaultProfile(newUser.id, trimmedName, trimmedEmail);

    saveStoredUsers([...users, newUser]);
    saveStoredProfile(newProfile);
    setActiveUserId(newUser.id);

    setUser(newUser);
    setProfile(newProfile);

    return { success: true };
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(({ email, password }) => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) return { success: false, error: 'Please enter your email address.' };
    if (!password) return { success: false, error: 'Please enter your password.' };

    const users = getStoredUsers();
    const found = users.find((u) => u.email === trimmedEmail);

    if (!found || found.passwordHash !== simpleHash(password)) {
      return { success: false, error: 'Email or password is incorrect.' };
    }

    let storedProfile = getStoredProfile(found.id);
    if (!storedProfile) {
      storedProfile = makeDefaultProfile(found.id, found.name, found.email);
      saveStoredProfile(storedProfile);
    }

    setActiveUserId(found.id);
    setUser(found);
    setProfile(storedProfile);

    return { success: true };
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearActiveUserId();
    setUser(null);
    setProfile(null);
  }, []);

  // ── Update Profile ────────────────────────────────────────────────────────
  const updateProfile = useCallback((updates) => {
    setProfile((prev) => {
      if (!prev) return prev;
      const merged = { ...prev, ...updates, userId: prev.userId };
      const saved = saveStoredProfile(merged);
      return saved;
    });

    // Also update user name if fullName changed
    if (updates.fullName) {
      setUser((prev) => {
        if (!prev) return prev;
        const updatedUser = { ...prev, name: updates.fullName };
        const users = getStoredUsers();
        const nextUsers = users.map((u) => (u.id === prev.id ? updatedUser : u));
        saveStoredUsers(nextUsers);
        return updatedUser;
      });
    }

    return { success: true };
  }, []);

  // ── Project Management Helpers ────────────────────────────────────────────
  const addProject = useCallback((projectData) => {
    if (!profile) return { success: false };
    const newProj = {
      id: Date.now(),
      name: projectData.name || 'Untitled Project',
      tech: Array.isArray(projectData.tech) ? projectData.tech : [],
      desc: projectData.desc || '',
      role: projectData.role || 'Developer',
      link: projectData.link || '',
      github: projectData.github || '',
      status: projectData.status || 'Completed',
    };
    const currentProjects = Array.isArray(profile.projects) ? profile.projects : [];
    return updateProfile({ projects: [newProj, ...currentProjects] });
  }, [profile, updateProfile]);

  const deleteProject = useCallback((projectId) => {
    if (!profile || !Array.isArray(profile.projects)) return { success: false };
    const filtered = profile.projects.filter((p) => p.id !== projectId);
    return updateProfile({ projects: filtered });
  }, [profile, updateProfile]);

  // ── Certification Management Helpers ──────────────────────────────────────
  const addCertification = useCallback((certData) => {
    if (!profile) return { success: false };
    const newCert = {
      id: Date.now(),
      name: certData.name || 'Certification',
      issuer: certData.issuer || 'Online',
      year: certData.year || String(new Date().getFullYear()),
      link: certData.link || '',
    };
    const currentCerts = Array.isArray(profile.certifications) ? profile.certifications : [];
    return updateProfile({ certifications: [newCert, ...currentCerts] });
  }, [profile, updateProfile]);

  const deleteCertification = useCallback((certId) => {
    if (!profile || !Array.isArray(profile.certifications)) return { success: false };
    const filtered = profile.certifications.filter((c) => c.id !== certId);
    return updateProfile({ certifications: filtered });
  }, [profile, updateProfile]);

  // ── Resume Helpers ────────────────────────────────────────────────────────
  const saveResume = useCallback((resumeData) => {
    return updateProfile({ resume: resumeData });
  }, [updateProfile]);

  const removeResume = useCallback(() => {
    return updateProfile({ resume: null });
  }, [updateProfile]);

  // ── Mock Interview Helpers ────────────────────────────────────────────────
  const saveInterviewResult = useCallback((interviewData) => {
    if (!profile) return { success: false };
    const currentInterviews = Array.isArray(profile.mockInterviews) ? profile.mockInterviews : [];
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...interviewData,
    };
    return updateProfile({
      mockInterviews: [newEntry, ...currentInterviews],
    });
  }, [profile, updateProfile]);

  // ── Proof of Skill Verification Helper ────────────────────────────────────
  const verifySkill = useCallback((skillName, score, details = {}) => {
    if (!profile) return { success: false };
    const status = score >= 75 ? 'AI-VERIFIED' : 'AI-ASSESSED';
    const currentVerified = Array.isArray(profile.verifiedSkills) ? profile.verifiedSkills : [];
    const filtered = currentVerified.filter((s) => s.name.toLowerCase() !== skillName.toLowerCase());
    const newEntry = {
      name: skillName,
      score,
      status,
      verifiedAt: new Date().toISOString(),
      details,
    };

    // Ensure the skill is in the main skills array as well
    const currentSkills = Array.isArray(profile.skills) ? profile.skills : [];
    const hasSkill = currentSkills.some((s) => s.toLowerCase() === skillName.toLowerCase());
    const updatedSkills = hasSkill ? currentSkills : [...currentSkills, skillName];

    const currentXp = profile.xp || 0;
    const earnedXp = score >= 75 ? 150 : 75;

    return updateProfile({
      verifiedSkills: [newEntry, ...filtered],
      skills: updatedSkills,
      xp: currentXp + earnedXp,
      streak: Math.max((profile.streak || 0), 1),
    });
  }, [profile, updateProfile]);

  // ── Adaptive Interview Helper ─────────────────────────────────────────────
  const saveAdaptiveInterview = useCallback((sessionData) => {
    if (!profile) return { success: false };
    const currentHistory = Array.isArray(profile.adaptiveInterviews) ? profile.adaptiveInterviews : [];
    const sessionNumber = currentHistory.length + 1;
    const newSession = {
      id: Date.now(),
      sessionNumber,
      date: new Date().toISOString(),
      ...sessionData,
    };

    // Also mirror to regular mockInterviews for backwards compatibility
    const currentMock = Array.isArray(profile.mockInterviews) ? profile.mockInterviews : [];
    const currentXp = profile.xp || 0;

    return updateProfile({
      adaptiveInterviews: [newSession, ...currentHistory],
      mockInterviews: [{
        id: newSession.id,
        type: newSession.type || 'Adaptive Technical',
        date: newSession.date,
        overallScore: newSession.overallScore || 75,
        scores: newSession.scores || {},
        feedback: newSession.feedback || '',
      }, ...currentMock],
      xp: currentXp + 200,
    });
  }, [profile, updateProfile]);

  // ── Project Intelligence Helper ───────────────────────────────────────────
  const saveProjectAnalysis = useCallback((projectId, analysis) => {
    if (!profile || !Array.isArray(profile.projects)) return { success: false };
    const updatedProjects = profile.projects.map((p) =>
      p.id === projectId ? { ...p, aiAnalysis: analysis } : p
    );
    return updateProfile({ projects: updatedProjects });
  }, [profile, updateProfile]);

  // ── Daily Missions Helper ─────────────────────────────────────────────────
  const updateDailyMissions = useCallback((missions) => {
    return updateProfile({ dailyMissions: missions });
  }, [updateProfile]);

  // ── Award XP Helper ───────────────────────────────────────────────────────
  const awardXP = useCallback((amount, reason = '') => {
    if (!profile) return { success: false };
    const newXp = (profile.xp || 0) + amount;
    const newLevel = Math.floor(newXp / 1000) + 1;
    return updateProfile({
      xp: newXp,
      level: Math.max(newLevel, profile.level || 1),
    });
  }, [profile, updateProfile]);

  const value = {
    user,
    profile,
    isLoading,
    register,
    login,
    logout,
    updateProfile,
    addProject,
    deleteProject,
    addCertification,
    deleteCertification,
    saveResume,
    removeResume,
    saveInterviewResult,
    verifySkill,
    saveAdaptiveInterview,
    saveProjectAnalysis,
    updateDailyMissions,
    awardXP,
    getInitials,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
