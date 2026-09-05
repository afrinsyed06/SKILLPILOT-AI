import { motion } from 'framer-motion';
import { GitBranch, Mail, MapPin, GraduationCap, Award, Briefcase, Edit3, Plus, Phone, Globe, Code2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import SkillBar from '../components/ui/SkillBar';
import { useAuth } from '../context/AuthContext';
import { calculatePlacementReadiness, calculateProfileCompleteness } from '../utils/profileCompleteness';

export default function Profile() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  const displayName = profile?.fullName || user?.name || 'Student';
  const targetRole = profile?.targetRole || 'Career Explorer';
  const college = profile?.college || 'College not specified';
  const email = profile?.email || user?.email || '';
  const phone = profile?.phone || '';
  const location_ = profile?.location || '';
  const branch = profile?.department || profile?.degree || 'Not specified';
  const year = profile?.graduationYear ? `Class of ${profile.graduationYear}` : 'Current Student';
  const cgpa = profile?.cgpa || '—';
  const joinDate = profile?.joinDate || '—';

  const completeness = calculateProfileCompleteness(profile);
  const readiness = calculatePlacementReadiness(profile);

  const userSkills = Array.isArray(profile?.skills) ? profile.skills : [];
  const userProjects = Array.isArray(profile?.projects) ? profile.projects : [];
  const userCerts = Array.isArray(profile?.certifications) ? profile.certifications : [];
  const userSoftSkills = Array.isArray(profile?.softSkills) ? profile.softSkills : [];
  const userInterests = Array.isArray(profile?.interests) ? profile.interests : [];

  const initials = displayName.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      {/* Profile Header */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))',
          border: '1px solid rgba(59,130,246,0.2)',
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 70% 50%, #8b5cf6 0%, transparent 50%)',
          }}
        />
        <div className="relative flex flex-wrap gap-6 items-center">
          {/* Avatar */}
          <div className="relative">
            {profile?.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover"
                style={{ boxShadow: '0 0 30px rgba(59,130,246,0.4)' }}
              />
            ) : (
              <div
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg"
                style={{ boxShadow: '0 0 30px rgba(59,130,246,0.4)' }}
              >
                {initials}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
              ✓
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white mb-1">{displayName}</h1>
            <p className="text-blue-300 font-medium mb-2">{targetRole} Aspirant</p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <GraduationCap size={14} /> {college}
              </div>
              {location_ && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} /> {location_}
                </div>
              )}
              {email && (
                <div className="flex items-center gap-1.5">
                  <Mail size={14} /> {email}
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-1.5">
                  <Phone size={14} /> {phone}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <div className="text-3xl font-bold gradient-text">
                {readiness.hasSufficientData ? `${readiness.overallScore}%` : `${completeness.percentage}%`}
              </div>
              <div className="text-xs text-slate-400">
                {readiness.hasSufficientData ? 'Placement Ready' : 'Profile Complete'}
              </div>
            </div>
            <button
              onClick={() => navigate('/account', { state: { edit: true } })}
              className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 size={14} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Academic Info */}
          <GlassCard>
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap size={16} className="text-blue-400" /> Academic Information
            </h3>
            <div className="space-y-3">
              {[
                { label: 'College', value: college },
                { label: 'Degree & Branch', value: branch },
                { label: 'Graduation Year', value: year },
                { label: 'CGPA', value: cgpa !== '—' ? `${cgpa} / 10.0` : 'Not provided' },
                { label: 'Member Since', value: joinDate },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-start gap-2">
                  <span className="text-xs text-slate-500">{item.label}</span>
                  <span className="text-xs text-slate-200 font-medium text-right max-w-[65%]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Certifications */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award size={16} className="text-amber-400" /> Certifications
              </h3>
              <Link
                to="/account"
                state={{ tab: 'Projects & Certs' }}
                className="text-xs text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> Add
              </Link>
            </div>
            {userCerts.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No certifications added yet.</p>
            ) : (
              <div className="space-y-3">
                {userCerts.map((cert) => (
                  <div
                    key={cert.id || cert.name}
                    className="p-3 rounded-xl bg-white/3 border border-white/6"
                  >
                    <div className="text-sm font-medium text-white">{cert.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {cert.issuer} • {cert.year}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Career Goals */}
          <GlassCard>
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Briefcase size={16} className="text-violet-400" /> Career Goals &amp; Bio
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="text-xs text-blue-400 font-semibold mb-1">Target Role</div>
                <div className="text-sm text-white font-medium">{targetRole}</div>
              </div>
              {profile?.careerGoal && (
                <div className="p-3 rounded-xl bg-white/3 border border-white/6">
                  <div className="text-xs text-slate-400 font-semibold mb-1">Goal Statement</div>
                  <div className="text-xs text-slate-300 leading-relaxed">{profile.careerGoal}</div>
                </div>
              )}
              {profile?.bio && (
                <div className="p-3 rounded-xl bg-white/3 border border-white/6">
                  <div className="text-xs text-slate-400 font-semibold mb-1">Bio</div>
                  <div className="text-xs text-slate-300 leading-relaxed">{profile.bio}</div>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Coding & Social Links */}
          {(profile?.github || profile?.linkedin || profile?.portfolio || profile?.codingProfile?.leetcode) && (
            <GlassCard>
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Globe size={16} className="text-cyan-400" /> Links &amp; Profiles
              </h3>
              <div className="space-y-2 text-xs">
                {profile?.codingProfile?.leetcode && (
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">LeetCode</span>
                    <span className="text-white font-mono">{profile.codingProfile.leetcode}</span>
                  </div>
                )}
                {profile?.github && (
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">GitHub</span>
                    <span className="text-blue-400 truncate max-w-[180px]">{profile.github}</span>
                  </div>
                )}
                {profile?.linkedin && (
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">LinkedIn</span>
                    <span className="text-blue-400 truncate max-w-[180px]">{profile.linkedin}</span>
                  </div>
                )}
                {profile?.portfolio && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Portfolio</span>
                    <span className="text-emerald-400 truncate max-w-[180px]">{profile.portfolio}</span>
                  </div>
                )}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Technical Skills */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 size={16} className="text-blue-400" /> Technical Skills
              </h3>
              <Link
                to="/account"
                state={{ edit: true }}
                className="text-xs text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> Add Skills
              </Link>
            </div>

            {userSkills.length === 0 ? (
              <div className="text-center py-6 px-4 rounded-xl bg-white/2 border border-dashed border-white/10">
                <p className="text-xs text-slate-400 mb-3">No technical skills added yet to your profile.</p>
                <Link to="/account" state={{ edit: true }} className="btn-primary text-xs px-3 py-1.5">
                  Add Technical Skills
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userSkills.map((skill, i) => (
                  <SkillBar key={skill} name={skill} level={80} delay={i * 60} />
                ))}
              </div>
            )}
          </GlassCard>

          {/* Projects Portfolio */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GitBranch size={16} className="text-emerald-400" /> Projects Portfolio
              </h3>
              <Link
                to="/account"
                state={{ tab: 'Projects & Certs' }}
                className="text-xs text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> Add Project
              </Link>
            </div>

            {userProjects.length === 0 ? (
              <div className="text-center py-6 px-4 rounded-xl bg-white/2 border border-dashed border-white/10">
                <p className="text-xs text-slate-400 mb-3">No projects added yet.</p>
                <Link to="/account" state={{ tab: 'Projects & Certs' }} className="btn-primary text-xs px-3 py-1.5">
                  Add Your First Project
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userProjects.map((project, i) => (
                  <motion.div
                    key={project.id || i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="p-4 rounded-xl bg-white/3 border border-white/6 hover:border-white/12 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{project.name}</h4>
                        {project.role && <p className="text-[11px] text-slate-400">Role: {project.role}</p>}
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400">
                        {project.status || 'Completed'}
                      </span>
                    </div>
                    {project.desc && (
                      <p className="text-xs text-slate-300 mb-2.5 leading-relaxed">{project.desc}</p>
                    )}
                    {Array.isArray(project.tech) && project.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md text-[11px] bg-blue-500/10 text-blue-300 border border-blue-500/20"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Soft Skills & Interests */}
          <GlassCard>
            <h3 className="text-base font-bold text-white mb-3">Soft Skills &amp; Interests</h3>
            {userSoftSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {userSoftSkills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 mb-3">No soft skills specified yet.</p>
            )}

            {userInterests.length > 0 && (
              <div>
                <div className="text-xs text-slate-500 mb-2">Areas of Interest</div>
                <div className="flex flex-wrap gap-2">
                  {userInterests.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
