import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, GraduationCap, Target, Bell, Lock, Shield,
  Camera, CheckCircle, Globe, GitBranch, Save, LogOut, Edit3, X, Plus, Sparkles,
  Award, Trash2, Code2, ArrowRight, RotateCcw
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import ProjectIntelligenceModal from '../components/features/ProjectIntelligenceModal';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { calculateProfileCompleteness } from '../utils/profileCompleteness';

const tabs = ['Profile', 'Projects & Certs', 'Preferences', 'Notifications', 'Security', 'Privacy'];

const TARGET_ROLES = [
  'AI/ML Engineer', 'Software Developer', 'Data Analyst', 'Data Scientist',
  'Full Stack Developer', 'DevOps Engineer', 'Cloud Engineer', 'QA Engineer',
  'Product Manager', 'Business Analyst', 'Cybersecurity Engineer', 'Career Explorer',
];

// Top-level stable ProfileField component (prevents input remounting on every keystroke)
function ProfileField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  helper,
  disabled = false,
  readOnly = false,
  autoComplete,
  className = '',
  isEditing = false,
}) {
  const inputId = id || name;
  return (
    <div className="min-w-0 w-full">
      <div className="flex justify-between items-center mb-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs text-slate-400 block font-medium">
            {label}
          </label>
        )}
        {helper && <span className="text-[10px] text-slate-500">{helper}</span>}
      </div>
      <input
        id={inputId}
        name={name || id}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        className={`w-full min-w-0 px-4 py-2.5 rounded-xl text-sm transition-all box-border outline-none ${
          disabled || readOnly
            ? 'border border-white/5 bg-[#070e1a] text-slate-400 cursor-not-allowed'
            : isEditing
            ? 'border-2 border-blue-500/60 bg-[#0d1c33] text-white placeholder-slate-500 focus:border-blue-400 focus:bg-[#0f2444] shadow-[0_0_0_3px_rgba(59,130,246,0.15)]'
            : 'border border-white/10 bg-[#0a1526] text-slate-200 placeholder-slate-600 hover:border-white/20 focus:border-blue-500/50'
        } ${className}`}
      />
    </div>
  );
}

export default function Account() {
  const location = useLocation();
  const {
    profile,
    user,
    updateProfile,
    addProject,
    deleteProject,
    addCertification,
    deleteCertification,
    logout
  } = useAuth();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'Profile');

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state?.tab]);

  const [editing, setEditing] = useState(Boolean(location.state?.edit));
  const [saved, setSaved] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [softSkillInput, setSoftSkillInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  // Project form state
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    desc: '',
    tech: '',
    role: '',
    link: '',
    github: '',
    status: 'Completed',
  });

  // Project Intelligence Audit state
  const [auditProject, setAuditProject] = useState(null);

  // Cert form state
  const [showAddCert, setShowAddCert] = useState(false);
  const [newCert, setNewCert] = useState({
    name: '',
    issuer: '',
    year: String(new Date().getFullYear()),
    link: '',
  });

  const photoRef = useRef(null);

  // ── Notification state from unified context ────────────────────────────────
  const {
    notifications,
    unreadCount: unreadNotifCount,
    markNotifRead: markAsRead,
    markAllRead,
    removeNotification,
    clearAllNotifications,
    resetNotifications,
  } = useNotifications();

  // Local form state
  const [form, setForm] = useState({
    fullName: profile?.fullName || user?.name || '',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    college: profile?.college || '',
    degree: profile?.degree || '',
    department: profile?.department || '',
    graduationYear: profile?.graduationYear || '',
    cgpa: profile?.cgpa || '',
    targetRole: profile?.targetRole || 'Career Explorer',
    careerGoal: profile?.careerGoal || '',
    preferredIndustry: profile?.preferredIndustry || '',
    preferredJobType: profile?.preferredJobType || 'Full-time',
    skills: Array.isArray(profile?.skills) ? profile.skills : [],
    softSkills: Array.isArray(profile?.softSkills) ? profile.softSkills : [],
    codingProfile: {
      leetcode: profile?.codingProfile?.leetcode || '',
      github: profile?.codingProfile?.github || '',
      hackerrank: profile?.codingProfile?.hackerrank || '',
    },
    linkedin: profile?.linkedin || '',
    github: profile?.github || '',
    portfolio: profile?.portfolio || '',
    bio: profile?.bio || '',
    careerSummary: profile?.careerSummary || '',
    profilePhoto: profile?.profilePhoto || '',
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCodingChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      codingProfile: { ...(prev.codingProfile || {}), [key]: value },
    }));
  };

  // Sync form with profile when not in edit mode or when profile changes
  useEffect(() => {
    if (profile && !editing) {
      setForm({
        fullName: profile.fullName || user?.name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        college: profile.college || '',
        degree: profile.degree || '',
        department: profile.department || '',
        graduationYear: profile.graduationYear || '',
        cgpa: profile.cgpa || '',
        targetRole: profile.targetRole || 'Career Explorer',
        careerGoal: profile.careerGoal || '',
        preferredIndustry: profile.preferredIndustry || '',
        preferredJobType: profile.preferredJobType || 'Full-time',
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        softSkills: Array.isArray(profile.softSkills) ? profile.softSkills : [],
        codingProfile: {
          leetcode: profile.codingProfile?.leetcode || '',
          github: profile.codingProfile?.github || '',
          hackerrank: profile.codingProfile?.hackerrank || '',
        },
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        portfolio: profile.portfolio || '',
        bio: profile.bio || '',
        careerSummary: profile.careerSummary || '',
        profilePhoto: profile.profilePhoto || '',
      });
    }
  }, [profile?.userId, editing]);

  const completeness = calculateProfileCompleteness(profile);

  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    updateProfile(form);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3500);
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        fullName: profile.fullName || user?.name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        college: profile.college || '',
        degree: profile.degree || '',
        department: profile.department || '',
        graduationYear: profile.graduationYear || '',
        cgpa: profile.cgpa || '',
        targetRole: profile.targetRole || 'Career Explorer',
        careerGoal: profile.careerGoal || '',
        preferredIndustry: profile.preferredIndustry || '',
        preferredJobType: profile.preferredJobType || 'Full-time',
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        softSkills: Array.isArray(profile.softSkills) ? profile.softSkills : [],
        codingProfile: {
          leetcode: profile.codingProfile?.leetcode || '',
          github: profile.codingProfile?.github || '',
          hackerrank: profile.codingProfile?.hackerrank || '',
        },
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        portfolio: profile.portfolio || '',
        bio: profile.bio || '',
        careerSummary: profile.careerSummary || '',
        profilePhoto: profile.profilePhoto || '',
      });
    }
    setEditing(false);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      handleChange('profilePhoto', ev.target.result);
      if (!editing) setEditing(true);
    };
    reader.readAsDataURL(file);
  };

  const addSkill = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      handleChange('skills', [...form.skills, trimmed]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    handleChange('skills', form.skills.filter((s) => s !== skill));
  };

  const addSoftSkill = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const trimmed = softSkillInput.trim();
    if (trimmed && !form.softSkills.includes(trimmed)) {
      handleChange('softSkills', [...form.softSkills, trimmed]);
    }
    setSoftSkillInput('');
  };

  const removeSoftSkill = (skill) => {
    handleChange('softSkills', form.softSkills.filter((s) => s !== skill));
  };

  const handleCreateProject = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newProject.name.trim()) return;
    const techArray = newProject.tech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    addProject({
      name: newProject.name.trim(),
      desc: newProject.desc.trim(),
      tech: techArray,
      role: newProject.role.trim() || 'Developer',
      link: newProject.link.trim(),
      github: newProject.github.trim(),
      status: newProject.status,
    });
    setNewProject({ name: '', desc: '', tech: '', role: '', link: '', github: '', status: 'Completed' });
    setShowAddProject(false);
  };

  const handleCreateCert = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newCert.name.trim()) return;
    addCertification({
      name: newCert.name.trim(),
      issuer: newCert.issuer.trim() || 'Online Platform',
      year: newCert.year.trim() || String(new Date().getFullYear()),
      link: newCert.link.trim(),
    });
    setNewCert({ name: '', issuer: '', year: String(new Date().getFullYear()), link: '' });
    setShowAddCert(false);
  };

  const initials = (form.fullName || user?.name || 'U')
    .trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            My <span className="gradient-text">Account &amp; Profile</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your personal data, technical skills, projects, and career preferences
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm btn-primary cursor-pointer"
            >
              <Edit3 size={15} /> Edit Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                <X size={15} /> Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all cursor-pointer"
              >
                <Save size={15} /> Save Changes
              </button>
            </>
          )}
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-300 border border-red-500/30 bg-red-500/10 hover:bg-red-500/15 transition-all cursor-pointer"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {/* Save success banner */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-medium"
        >
          <CheckCircle size={16} /> Profile updated successfully! All AI modules are now synced with your latest data.
        </motion.div>
      )}

      {/* Profile Overview Card */}
      <div
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))',
          border: '1px solid rgba(59,130,246,0.2)',
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #3b82f6 0%, transparent 50%)' }}
        />
        <div className="relative flex flex-wrap items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {form.profilePhoto ? (
              <img
                src={form.profilePhoto}
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover"
                style={{ boxShadow: '0 0 30px rgba(59,130,246,0.4)' }}
              />
            ) : (
              <div
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl font-black text-white"
                style={{ boxShadow: '0 0 30px rgba(59,130,246,0.4)' }}
              >
                {initials}
              </div>
            )}
            {editing && (
              <>
                <button
                  type="button"
                  onClick={() => photoRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-400 transition-colors shadow-lg"
                  title="Upload profile photo"
                >
                  <Camera size={14} className="text-white" />
                </button>
                <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xl font-bold text-white">{form.fullName || 'Student'}</div>
            <div className="text-blue-300 text-sm mb-2">
              {form.targetRole} • {form.college || 'College not specified'}
            </div>
            <div className="flex flex-wrap gap-2">
              {form.degree && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20">
                  🎓 {form.degree}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                📊 {completeness.percentage}% Profile Complete
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/20">
                ⚡ Level {profile?.level ?? 1}
              </span>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-black gradient-text">
              {completeness.percentage >= 50 ? `${profile?.placementScore || 75}%` : 'Locked'}
            </div>
            <div className="text-xs text-slate-400">Placement Readiness</div>
            {form.cgpa && <div className="text-xs text-slate-500 mt-1">CGPA: {form.cgpa}</div>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl overflow-x-auto"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 relative ${
              activeTab === tab
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
            {tab === 'Notifications' && unreadNotifCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center px-1"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}
              >
                {unreadNotifCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Profile (Personal, Academic, Career, Skills) */}
      {activeTab === 'Profile' && (
        <form onSubmit={handleSave} className="space-y-5">
          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-blue-300 border border-dashed border-blue-500/40 bg-blue-500/10 hover:border-blue-400 hover:bg-blue-500/20 transition-all duration-200 cursor-pointer"
            >
              <Edit3 size={15} /> Click here to enter Edit Profile mode
            </button>
          ) : (
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-medium">
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-blue-400" /> Edit Mode Active — update your details and click &quot;Save Changes&quot;
              </span>
              <button
                type="button"
                onClick={handleCancel}
                className="text-slate-400 hover:text-white underline text-xs ml-2 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          <div
            className="grid gap-5 w-full"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))' }}
          >
            {/* Personal Information */}
            <GlassCard>
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <User size={16} className="text-blue-400" /> Personal Information
              </h3>
              <div className="space-y-4">
                <ProfileField
                  id="fullName"
                  name="fullName"
                  label="Full Name"
                  value={form.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Your full name"
                  isEditing={editing}
                  autoComplete="name"
                />
                <div>
                  <label htmlFor="accountEmail" className="text-xs text-slate-400 mb-1.5 block font-medium">
                    Email Address (Unique Account ID)
                  </label>
                  <input
                    id="accountEmail"
                    name="email"
                    value={form.email}
                    disabled
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/5 bg-[#070e1a] cursor-not-allowed outline-none"
                    title="Account email cannot be modified"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Email is linked to your account and cannot be changed here.</p>
                </div>
                <ProfileField
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone Number"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  helper="Personal contact field (not account identity)"
                  isEditing={editing}
                  autoComplete="tel"
                />
                <ProfileField
                  id="location"
                  name="location"
                  label="Location / City"
                  value={form.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g., Bengaluru, Karnataka, India"
                  isEditing={editing}
                  autoComplete="address-level2"
                />
                <div>
                  <label htmlFor="bio" className="text-xs text-slate-400 mb-1.5 block font-medium">Short Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    rows={3}
                    placeholder="Tell us about yourself and your aspirations..."
                    className={`w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none resize-none transition-all ${
                      editing
                        ? 'border-2 border-blue-500/60 bg-[#0d1c33] focus:border-blue-400 focus:bg-[#0f2444] shadow-[0_0_0_3px_rgba(59,130,246,0.15)]'
                        : 'border border-white/10 bg-[#0a1526] hover:border-white/20'
                    }`}
                  />
                </div>
              </div>
            </GlassCard>

            {/* Academic Information */}
            <GlassCard>
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <GraduationCap size={16} className="text-violet-400" /> Academic &amp; Education
              </h3>
              <div className="space-y-4">
                <ProfileField
                  id="college"
                  name="college"
                  label="College / University"
                  value={form.college}
                  onChange={(e) => handleChange('college', e.target.value)}
                  placeholder="e.g., National Institute of Technology"
                  isEditing={editing}
                />
                <ProfileField
                  id="degree"
                  name="degree"
                  label="Degree"
                  value={form.degree}
                  onChange={(e) => handleChange('degree', e.target.value)}
                  placeholder="e.g., B.Tech, B.E., BCA, MCA, M.Tech"
                  isEditing={editing}
                />
                <ProfileField
                  id="department"
                  name="department"
                  label="Department / Branch"
                  value={form.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  placeholder="e.g., Computer Science & Engineering"
                  isEditing={editing}
                />
                <ProfileField
                  id="graduationYear"
                  name="graduationYear"
                  label="Graduation Year"
                  value={form.graduationYear}
                  onChange={(e) => handleChange('graduationYear', e.target.value)}
                  placeholder="e.g., 2025"
                  isEditing={editing}
                />
                <ProfileField
                  id="cgpa"
                  name="cgpa"
                  label="CGPA / GPA (out of 10)"
                  value={form.cgpa}
                  onChange={(e) => handleChange('cgpa', e.target.value)}
                  placeholder="e.g., 8.8"
                  type="text"
                  isEditing={editing}
                />
              </div>
            </GlassCard>

            {/* Career Goals */}
            <GlassCard>
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Target size={16} className="text-cyan-400" /> Career Goals &amp; Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="targetRole" className="text-xs text-slate-400 mb-1.5 block font-medium">Target Career Role</label>
                  <select
                    id="targetRole"
                    name="targetRole"
                    value={form.targetRole}
                    onChange={(e) => handleChange('targetRole', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none cursor-pointer ${
                      editing
                        ? 'border-2 border-blue-500/60 bg-[#0d1c33] focus:border-blue-400'
                        : 'border border-white/10 bg-[#0a1526] hover:border-white/20'
                    }`}
                  >
                    {TARGET_ROLES.map((r) => (
                      <option key={r} value={r} style={{ background: '#0a1526', color: '#ffffff' }}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <ProfileField
                  id="careerGoal"
                  name="careerGoal"
                  label="Career Goal Statement"
                  value={form.careerGoal}
                  onChange={(e) => handleChange('careerGoal', e.target.value)}
                  placeholder="e.g., Join a premier tech firm as a Machine Learning Engineer"
                  isEditing={editing}
                />
                <ProfileField
                  id="preferredIndustry"
                  name="preferredIndustry"
                  label="Preferred Industry"
                  value={form.preferredIndustry}
                  onChange={(e) => handleChange('preferredIndustry', e.target.value)}
                  placeholder="e.g., Artificial Intelligence, FinTech, SaaS"
                  isEditing={editing}
                />
                <div>
                  <label htmlFor="preferredJobType" className="text-xs text-slate-400 mb-1.5 block font-medium">Preferred Job Type</label>
                  <select
                    id="preferredJobType"
                    name="preferredJobType"
                    value={form.preferredJobType}
                    onChange={(e) => handleChange('preferredJobType', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none cursor-pointer ${
                      editing
                        ? 'border-2 border-blue-500/60 bg-[#0d1c33] focus:border-blue-400'
                        : 'border border-white/10 bg-[#0a1526] hover:border-white/20'
                    }`}
                  >
                    {['Full-time', 'Internship', 'Part-time', 'Remote', 'Hybrid'].map((t) => (
                      <option key={t} value={t} style={{ background: '#0a1526', color: '#ffffff' }}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </GlassCard>

            {/* Technical Skills */}
            <GlassCard>
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-400">💡</span> Technical Skills (Explicitly Provided)
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 mb-2 block font-medium">
                    Added Skills ({form.skills.length})
                  </label>
                  <div className="flex flex-wrap gap-2 min-h-[44px] p-2 rounded-xl bg-[#070f1e] border border-white/5">
                    {form.skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-blue-400 hover:text-red-400 transition-colors p-0.5 cursor-pointer"
                          title="Remove skill"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {form.skills.length === 0 && (
                      <span className="text-xs text-slate-500 p-1">No technical skills added yet</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    id="skillInput"
                    name="skillInput"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add skill (e.g., Python, PyTorch, React, SQL)"
                    className="flex-1 px-3 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none border border-white/10 bg-[#0a1526] focus:border-blue-400 focus:bg-[#0d1c33]"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-500/30 font-semibold text-xs transition-colors gap-1 cursor-pointer"
                  >
                    <Plus size={15} /> Add
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* Soft Skills */}
            <GlassCard>
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-purple-400">🤝</span> Soft Skills &amp; Strengths
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 mb-2 block font-medium">
                    Added Soft Skills ({form.softSkills.length})
                  </label>
                  <div className="flex flex-wrap gap-2 min-h-[44px] p-2 rounded-xl bg-[#070f1e] border border-white/5">
                    {form.softSkills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSoftSkill(skill)}
                          className="text-violet-400 hover:text-red-400 transition-colors p-0.5 cursor-pointer"
                          title="Remove soft skill"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {form.softSkills.length === 0 && (
                      <span className="text-xs text-slate-500 p-1">No soft skills added yet</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    id="softSkillInput"
                    name="softSkillInput"
                    value={softSkillInput}
                    onChange={(e) => setSoftSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSoftSkill();
                      }
                    }}
                    placeholder="Add soft skill (e.g., Team Collaboration, Problem Solving)"
                    className="flex-1 px-3 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none border border-white/10 bg-[#0a1526] focus:border-violet-400 focus:bg-[#0d1c33]"
                  />
                  <button
                    type="button"
                    onClick={addSoftSkill}
                    className="px-4 py-2 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 hover:bg-violet-500/30 font-semibold text-xs transition-colors gap-1 cursor-pointer"
                  >
                    <Plus size={15} /> Add
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* Coding Profiles */}
            <GlassCard>
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Code2 size={16} className="text-cyan-400" /> Coding &amp; Social Profiles
              </h3>
              <div className="space-y-4">
                <ProfileField
                  id="codingLeetcode"
                  name="leetcode"
                  label="LeetCode Username"
                  value={form.codingProfile?.leetcode || ''}
                  onChange={(e) => handleCodingChange('leetcode', e.target.value)}
                  placeholder="e.g., afrin_code"
                  isEditing={editing}
                />
                <ProfileField
                  id="codingGithub"
                  name="github"
                  label="GitHub Profile Link or Username"
                  value={form.github}
                  onChange={(e) => handleChange('github', e.target.value)}
                  placeholder="e.g., github.com/afrin-s"
                  isEditing={editing}
                />
                <ProfileField
                  id="codingLinkedin"
                  name="linkedin"
                  label="LinkedIn Profile Link"
                  value={form.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  placeholder="e.g., linkedin.com/in/afrin-s"
                  isEditing={editing}
                />
                <ProfileField
                  id="codingPortfolio"
                  name="portfolio"
                  label="Portfolio / Personal Website"
                  value={form.portfolio}
                  onChange={(e) => handleChange('portfolio', e.target.value)}
                  placeholder="e.g., afrins.dev"
                  isEditing={editing}
                />
              </div>
            </GlassCard>
          </div>

          {/* Bottom Save Action */}
          <div className="flex justify-end gap-3 pt-3">
            {editing && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-300 border border-white/10 hover:bg-white/5 transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all active:scale-95 cursor-pointer"
            >
              <Save size={15} /> Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Projects & Certifications */}
      {activeTab === 'Projects & Certs' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Projects Section */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <GitBranch size={18} className="text-blue-400" /> Student Projects Portfolio
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add projects you have built. AI analyzes only project data you explicitly enter.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProject(!showAddProject)}
                className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} /> Add Project
              </button>
            </div>

            {/* Add Project Form */}
            {showAddProject && (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/25 space-y-3 mb-5">
                <h4 className="text-sm font-bold text-blue-300">New Project Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="newProjName" className="text-xs text-slate-400 block mb-1">Project Name *</label>
                    <input
                      id="newProjName"
                      name="name"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      placeholder="e.g., AI Crop Disease Detection"
                      className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a1526] border border-white/10 text-white outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="newProjTech" className="text-xs text-slate-400 block mb-1">Technologies Used (comma separated)</label>
                    <input
                      id="newProjTech"
                      name="tech"
                      value={newProject.tech}
                      onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                      placeholder="e.g., Python, PyTorch, FastAPI, Docker"
                      className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a1526] border border-white/10 text-white outline-none focus:border-blue-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="newProjDesc" className="text-xs text-slate-400 block mb-1">Description &amp; Impact</label>
                    <textarea
                      id="newProjDesc"
                      name="desc"
                      value={newProject.desc}
                      onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                      rows={2}
                      placeholder="Explain what the project does, key algorithms, and quantifiable results..."
                      className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a1526] border border-white/10 text-white outline-none focus:border-blue-400 resize-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="newProjRole" className="text-xs text-slate-400 block mb-1">Your Role</label>
                    <input
                      id="newProjRole"
                      name="role"
                      value={newProject.role}
                      onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                      placeholder="e.g., ML Lead / Full Stack Developer"
                      className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a1526] border border-white/10 text-white outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="newProjGithub" className="text-xs text-slate-400 block mb-1">GitHub Link</label>
                    <input
                      id="newProjGithub"
                      name="github"
                      value={newProject.github}
                      onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a1526] border border-white/10 text-white outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProject(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateProject}
                    className="px-4 py-1.5 text-xs font-semibold btn-primary cursor-pointer"
                  >
                    Save Project
                  </button>
                </div>
              </div>
            )}

            {/* Projects List */}
            {(!profile?.projects || profile.projects.length === 0) ? (
              <div className="text-center py-8 px-4 rounded-xl bg-white/2 border border-dashed border-white/10">
                <GitBranch size={36} className="mx-auto mb-2 text-slate-500 opacity-40" />
                <h4 className="text-sm font-semibold text-white mb-1">No projects added yet</h4>
                <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
                  Add projects to allow AI to analyze your practical implementation experience and code strength.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddProject(true)}
                  className="btn-primary text-xs px-4 py-2 cursor-pointer"
                >
                  <Plus size={14} className="inline mr-1" /> Add Your First Project
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {profile.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl flex items-start justify-between gap-4 bg-white/3 border border-white/6 hover:border-white/12 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-sm">{proj.name}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400">
                          {proj.status || 'Completed'}
                        </span>
                        {proj.role && (
                          <span className="text-xs text-slate-400">• {proj.role}</span>
                        )}
                      </div>
                      {proj.desc && <p className="text-xs text-slate-300 mb-2 leading-relaxed">{proj.desc}</p>}
                      {Array.isArray(proj.tech) && proj.tech.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {proj.tech.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded text-[11px] bg-blue-500/10 text-blue-300 border border-blue-500/20">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setAuditProject(proj)}
                        className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-purple-500/20"
                        title="Run AI Project Audit"
                      >
                        <Sparkles size={12} className="text-purple-400" /> Audit Quality
                      </button>
                      {proj.github && (
                        <a
                          href={proj.github}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                          title="View GitHub"
                        >
                          <Globe size={14} />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteProject(proj.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Certifications Section */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award size={18} className="text-amber-400" /> Certifications &amp; Credentials
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track authentic certifications earned from recognized organizations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCert(!showAddCert)}
                className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} /> Add Certification
              </button>
            </div>

            {/* Add Cert Form */}
            {showAddCert && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-3 mb-5">
                <h4 className="text-sm font-bold text-amber-300">New Certification</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="newCertName" className="text-xs text-slate-400 block mb-1">Certification Name *</label>
                    <input
                      id="newCertName"
                      name="name"
                      value={newCert.name}
                      onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                      placeholder="e.g., Deep Learning Specialization"
                      className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a1526] border border-white/10 text-white outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="newCertIssuer" className="text-xs text-slate-400 block mb-1">Issuing Organization</label>
                    <input
                      id="newCertIssuer"
                      name="issuer"
                      value={newCert.issuer}
                      onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                      placeholder="e.g., Coursera (DeepLearning.AI), AWS"
                      className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a1526] border border-white/10 text-white outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="newCertYear" className="text-xs text-slate-400 block mb-1">Year / Date</label>
                    <input
                      id="newCertYear"
                      name="year"
                      value={newCert.year}
                      onChange={(e) => setNewCert({ ...newCert, year: e.target.value })}
                      placeholder="2024"
                      className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a1526] border border-white/10 text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCert(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateCert}
                    className="px-4 py-1.5 text-xs font-semibold btn-primary cursor-pointer"
                  >
                    Save Certification
                  </button>
                </div>
              </div>
            )}

            {/* Certs List */}
            {(!profile?.certifications || profile.certifications.length === 0) ? (
              <div className="text-center py-8 px-4 rounded-xl bg-white/2 border border-dashed border-white/10">
                <Award size={36} className="mx-auto mb-2 text-slate-500 opacity-40" />
                <h4 className="text-sm font-semibold text-white mb-1">No certifications added yet</h4>
                <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
                  Add verified certifications to boost your placement readiness score.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddCert(true)}
                  className="btn-primary text-xs px-4 py-2 cursor-pointer"
                >
                  <Plus size={14} className="inline mr-1" /> Add Certification
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {profile.certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3 rounded-xl flex items-center justify-between gap-3 bg-white/3 border border-white/6"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white">{cert.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{cert.issuer} • {cert.year}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteCertification(cert.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer"
                      title="Delete certification"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}

      {/* Tab 3: Preferences */}
      {activeTab === 'Preferences' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-base font-bold text-white mb-4">App &amp; Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { label: 'Daily Mission Reminders', desc: 'Get reminded about your daily placement preparation tasks' },
                { label: 'AI Recommendations', desc: 'Receive personalized AI learning suggestions based on skills' },
                { label: 'Streak Alerts', desc: 'Alerts when your daily preparation streak is at risk' },
                { label: 'Job Match Alerts', desc: 'Notify when new jobs match your authentic profile' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-white">{item.label}</div>
                    <div className="text-xs text-slate-400">{item.desc}</div>
                  </div>
                  <div className="w-10 h-6 rounded-full bg-blue-500/30 p-1 cursor-pointer flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-400 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <h3 className="text-base font-bold text-white mb-4">Learning Pace</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="prepGoal" className="text-xs text-slate-400 block mb-1">Daily Placement Prep Goal</label>
                <select id="prepGoal" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#0a1526] border border-white/10 text-white outline-none">
                  <option>1 hour/day (Standard Pace)</option>
                  <option>2 hours/day (Accelerated Placement Prep)</option>
                  <option>30 minutes/day (Consistent Minimum)</option>
                </select>
              </div>
              <div>
                <label htmlFor="problemTarget" className="text-xs text-slate-400 block mb-1">Coding Problems Daily Target</label>
                <select id="problemTarget" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#0a1526] border border-white/10 text-white outline-none">
                  <option>2-3 problems / day</option>
                  <option>1 problem / day</option>
                  <option>5+ problems / day</option>
                </select>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'Notifications' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <GlassCard>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Bell size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Recent Placement Alerts
                    {unreadNotifCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-blue-500 shadow-sm">
                        {unreadNotifCount} new
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">Manage real-time alerts, skill insights, and system notifications.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadNotifCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium border border-blue-500/20 px-3 py-1.5 rounded-xl hover:bg-blue-500/10 cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle size={13} /> Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllNotifications}
                    className="text-xs text-slate-400 hover:text-rose-400 transition-colors font-medium border border-white/10 px-3 py-1.5 rounded-xl hover:bg-white/5 cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 size={13} /> Clear all
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetNotifications}
                  title="Reset sample alerts"
                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors font-medium border border-white/10 px-2.5 py-1.5 rounded-xl hover:bg-white/5 cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw size={13} />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3 text-2xl">
                  🎉
                </div>
                <h4 className="text-base font-semibold text-white mb-1">All caught up!</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  You don't have any active notifications right now. Any skill gaps, streak updates, or job matches will appear here.
                </p>
                <button
                  type="button"
                  onClick={resetNotifications}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all cursor-pointer"
                >
                  Restore sample alerts
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markAsRead(n.id);
                      if (n.path) navigate(n.path);
                    }}
                    className={`group flex items-start gap-3.5 p-3.5 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/6 ${
                      n.unread ? 'bg-blue-500/8 border border-blue-500/20 shadow-sm' : 'bg-white/2 border border-white/5'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/6 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-bold ${n.unread ? 'text-white' : 'text-slate-200'}`}>
                            {n.title}
                          </span>
                          {n.tag && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-cyan-300">
                              {n.tag}
                            </span>
                          )}
                          {n.unread && (
                            <span className="w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-cyan-400/20" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 flex-shrink-0 mt-0.5">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.desc}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-blue-400">
                        <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-medium">
                          Navigate to page <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(n.id);
                      }}
                      title="Dismiss alert"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0 cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}

      {/* Tab 5: Security */}
      {activeTab === 'Security' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Shield size={16} className="text-emerald-400" /> Authenticated Account Integrity
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Your account identity is bound to a single email address and student profile.
            </p>
            <div className="p-4 rounded-xl bg-blue-500/8 border border-blue-500/15 mb-4">
              <div className="text-xs font-semibold text-blue-400 mb-1">Authenticated Account Email</div>
              <p className="text-sm font-bold text-white">{user?.email}</p>
              <div className="text-[11px] text-slate-500 mt-1">User ID: {user?.id}</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              ✓ Single Account &amp; Single Profile rule enforced.
            </div>
          </GlassCard>
          <GlassCard>
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Lock size={16} className="text-amber-400" /> Change Password
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="text-xs text-slate-400 mb-1 block">New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#0a1526] border border-white/10 text-white outline-none focus:border-blue-400"
                />
              </div>
              {passwordUpdated && (
                <div className="p-2.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle size={14} /> Password updated successfully!
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  if (newPassword.trim()) {
                    setPasswordUpdated(true);
                    setNewPassword('');
                    setTimeout(() => setPasswordUpdated(false), 3000);
                  }
                }}
                className="btn-primary w-full py-2.5 text-sm cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Tab 6: Privacy */}
      {activeTab === 'Privacy' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard>
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Shield size={16} className="text-violet-400" /> Student Data Privacy &amp; AI Transparency
            </h3>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              SkillPilot AI operates under strict data integrity rules. The AI will never infer or invent
              student background details, skills, or resume qualifications without explicit user input or uploaded documentation.
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Profile data stored with user-scoped isolation.
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> No public disclosure of personal phone numbers.
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Transparent empty states for incomplete assessments.
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* ── Sticky Save Bar (shown during edit mode) ── */}
      {editing && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-6 py-4"
          style={{
            background: 'rgba(6,14,28,0.95)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(59,130,246,0.3)',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.5)',
          }}
        >
          <div className="flex items-center gap-2 text-sm text-blue-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Unsaved changes in profile
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-300 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 transition-all active:scale-95 cursor-pointer"
            >
              <Save size={15} /> Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Feature 10: Project Intelligence Modal */}
      <ProjectIntelligenceModal
        project={auditProject}
        isOpen={Boolean(auditProject)}
        onClose={() => setAuditProject(null)}
      />
    </motion.div>
  );
}
