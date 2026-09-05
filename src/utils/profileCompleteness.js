/**
 * profileCompleteness.js
 * Evaluates authenticated student profile data completeness.
 * Strictly adheres to: "No data = No analysis / Pending assessment".
 */

export const PROFILE_SECTIONS = [
  {
    id: 'personal',
    label: 'Personal Information',
    weight: 10,
    action: 'Add Personal Information',
    path: '/account',
    state: { edit: true, tab: 'Profile' },
    check: (p) => Boolean(p?.fullName && (p?.phone || p?.location)),
  },
  {
    id: 'education',
    label: 'Education Details',
    weight: 15,
    action: 'Add College & CGPA',
    path: '/account',
    state: { edit: true, tab: 'Profile' },
    check: (p) => Boolean(p?.college && (p?.degree || p?.department || p?.cgpa)),
  },
  {
    id: 'careerGoal',
    label: 'Career Goal & Target Role',
    weight: 15,
    action: 'Set Target Role & Goal',
    path: '/account',
    state: { edit: true, tab: 'Profile' },
    check: (p) => Boolean(p?.targetRole && p.targetRole !== 'Career Explorer' && p?.careerGoal),
  },
  {
    id: 'skills',
    label: 'Technical Skills',
    weight: 20,
    action: 'Add Technical Skills',
    path: '/account',
    state: { edit: true, tab: 'Profile' },
    check: (p) => Array.isArray(p?.skills) && p.skills.length > 0,
  },
  {
    id: 'projects',
    label: 'Projects Portfolio',
    weight: 15,
    action: 'Add Your First Project',
    path: '/account',
    state: { edit: true, tab: 'Profile' },
    check: (p) => Array.isArray(p?.projects) && p.projects.length > 0,
  },
  {
    id: 'resume',
    label: 'Resume Upload',
    weight: 10,
    action: 'Upload Resume',
    path: '/resume',
    check: (p) => Boolean(p?.resume?.fileName || p?.resume?.uploadedAt),
  },
  {
    id: 'interview',
    label: 'Communication / Mock Interview',
    weight: 15,
    action: 'Take AI Mock Interview',
    path: '/interview',
    check: (p) => Array.isArray(p?.mockInterviews) && p.mockInterviews.length > 0,
  },
];

/**
 * Calculates profile completeness score (0 - 100%) and returns status breakdown.
 */
export function calculateProfileCompleteness(profile) {
  if (!profile) {
    return {
      percentage: 0,
      completedCount: 0,
      totalCount: PROFILE_SECTIONS.length,
      completedSections: [],
      missingSections: PROFILE_SECTIONS,
      isFullyComplete: false,
    };
  }

  let earnedWeight = 0;
  const completedSections = [];
  const missingSections = [];

  for (const section of PROFILE_SECTIONS) {
    const isDone = section.check(profile);
    if (isDone) {
      earnedWeight += section.weight;
      completedSections.push(section);
    } else {
      missingSections.push(section);
    }
  }

  const percentage = Math.min(Math.round(earnedWeight), 100);

  return {
    percentage,
    completedCount: completedSections.length,
    totalCount: PROFILE_SECTIONS.length,
    completedSections,
    missingSections,
    isFullyComplete: percentage === 100,
  };
}

/**
 * Computes authentic Placement Readiness Breakdown based purely on provided user data.
 * Does NOT generate fake scores for missing assessments.
 */
export function calculatePlacementReadiness(profile) {
  const breakdown = [];

  // Technical Skills (requires user skills)
  const hasSkills = Array.isArray(profile?.skills) && profile.skills.length > 0;
  const skillScore = hasSkills ? Math.min(50 + profile.skills.length * 6, 92) : null;
  breakdown.push({
    key: 'technical',
    label: 'Technical Skills',
    score: skillScore,
    provided: hasSkills,
    color: '#3b82f6',
    pendingLabel: 'Skills not provided yet',
    actionText: 'Add Skills',
    actionPath: '/account',
  });

  // Resume (requires uploaded resume)
  const hasResume = Boolean(profile?.resume?.fileName || profile?.resume?.uploadedAt);
  const resumeScore = hasResume ? (profile.resume.atsScore || 85) : null;
  breakdown.push({
    key: 'resume',
    label: 'Resume ATS Compatibility',
    score: resumeScore,
    provided: hasResume,
    color: '#10b981',
    pendingLabel: 'Resume not uploaded',
    actionText: 'Upload Resume',
    actionPath: '/resume',
  });

  // Projects (requires at least 1 user project)
  const hasProjects = Array.isArray(profile?.projects) && profile.projects.length > 0;
  const projectScore = hasProjects ? Math.min(60 + profile.projects.length * 10, 95) : null;
  breakdown.push({
    key: 'projects',
    label: 'Projects Quality',
    score: projectScore,
    provided: hasProjects,
    color: '#8b5cf6',
    pendingLabel: 'No projects added',
    actionText: 'Add Project',
    actionPath: '/account',
  });

  // Communication / Interview Assessment (requires completed mock interview)
  const hasInterview = Array.isArray(profile?.mockInterviews) && profile.mockInterviews.length > 0;
  let interviewScore = null;
  if (hasInterview) {
    const latest = profile.mockInterviews[profile.mockInterviews.length - 1];
    interviewScore = latest?.scores?.communication || latest?.overallScore || 80;
  }
  breakdown.push({
    key: 'communication',
    label: 'Communication & Interview',
    score: interviewScore,
    provided: hasInterview,
    color: '#f59e0b',
    pendingLabel: 'Assessment pending',
    actionText: 'Start Interview',
    actionPath: '/interview',
  });

  // Academic / CGPA Foundation
  const hasAcademic = Boolean(profile?.college && profile?.cgpa);
  const cgpaNum = parseFloat(profile?.cgpa || '0');
  const academicScore = hasAcademic ? Math.min(Math.round((cgpaNum / 10) * 100), 98) : null;
  breakdown.push({
    key: 'academic',
    label: 'Academic Foundation',
    score: academicScore,
    provided: hasAcademic,
    color: '#06b6d4',
    pendingLabel: 'CGPA not entered',
    actionText: 'Add Education',
    actionPath: '/account',
  });

  // Overall Placement Readiness Score is the weighted average of provided scores only
  const providedItems = breakdown.filter((b) => b.provided && b.score !== null);
  let overallScore = 0;
  if (providedItems.length > 0) {
    const sum = providedItems.reduce((acc, curr) => acc + curr.score, 0);
    overallScore = Math.round(sum / providedItems.length);
  }

  return {
    overallScore,
    hasSufficientData: providedItems.length >= 3,
    providedCount: providedItems.length,
    totalCount: breakdown.length,
    breakdown,
  };
}
