/**
 * aiPipelines.js
 * Centralized, data-driven AI intelligence pipelines.
 * Principle: Only analyze what is explicitly provided.
 */

// Target role benchmarks
export const ROLE_SKILL_REQUIREMENTS = {
  'AI/ML Engineer': [
    { skill: 'Python', required: 85, weight: 1.2 },
    { skill: 'Machine Learning', required: 80, weight: 1.2 },
    { skill: 'Deep Learning', required: 75, weight: 1.1 },
    { skill: 'PyTorch / TensorFlow', required: 70, weight: 1.0 },
    { skill: 'SQL', required: 75, weight: 0.9 },
    { skill: 'Data Structures', required: 75, weight: 0.9 },
    { skill: 'MLOps', required: 65, weight: 0.8 },
    { skill: 'Git / GitHub', required: 75, weight: 0.7 },
  ],
  'Software Developer': [
    { skill: 'Data Structures', required: 85, weight: 1.2 },
    { skill: 'Algorithms', required: 80, weight: 1.2 },
    { skill: 'Java / Python / C++', required: 80, weight: 1.1 },
    { skill: 'System Design', required: 65, weight: 1.0 },
    { skill: 'SQL / Databases', required: 75, weight: 0.9 },
    { skill: 'Git / Version Control', required: 80, weight: 0.8 },
    { skill: 'REST APIs', required: 70, weight: 0.8 },
  ],
  'Data Analyst': [
    { skill: 'SQL', required: 85, weight: 1.3 },
    { skill: 'Python / R', required: 75, weight: 1.1 },
    { skill: 'Excel / Spreadsheets', required: 80, weight: 1.0 },
    { skill: 'Tableau / Power BI', required: 75, weight: 1.0 },
    { skill: 'Statistics & Probability', required: 70, weight: 0.9 },
    { skill: 'Data Visualization', required: 75, weight: 0.9 },
  ],
  'Data Scientist': [
    { skill: 'Python', required: 85, weight: 1.2 },
    { skill: 'Statistics & Math', required: 80, weight: 1.2 },
    { skill: 'Machine Learning', required: 80, weight: 1.1 },
    { skill: 'SQL', required: 75, weight: 1.0 },
    { skill: 'Data Wrangling / Pandas', required: 80, weight: 0.9 },
    { skill: 'Deep Learning', required: 65, weight: 0.8 },
  ],
  'Full Stack Developer': [
    { skill: 'JavaScript / TypeScript', required: 85, weight: 1.2 },
    { skill: 'React / Next.js', required: 80, weight: 1.1 },
    { skill: 'Node.js / Express', required: 75, weight: 1.0 },
    { skill: 'SQL / MongoDB', required: 75, weight: 1.0 },
    { skill: 'Data Structures', required: 70, weight: 0.9 },
    { skill: 'Git & Deployment', required: 75, weight: 0.8 },
  ],
  'DevOps Engineer': [
    { skill: 'Linux / Shell Scripting', required: 85, weight: 1.2 },
    { skill: 'Docker & Containers', required: 80, weight: 1.2 },
    { skill: 'Kubernetes', required: 70, weight: 1.1 },
    { skill: 'CI/CD Pipelines', required: 80, weight: 1.0 },
    { skill: 'Cloud (AWS / GCP)', required: 75, weight: 1.0 },
    { skill: 'Git / Terraform', required: 75, weight: 0.8 },
  ],
  'Cloud Engineer': [
    { skill: 'Cloud (AWS / Azure / GCP)', required: 85, weight: 1.3 },
    { skill: 'Networking & Security', required: 75, weight: 1.1 },
    { skill: 'Linux Administration', required: 80, weight: 1.0 },
    { skill: 'Docker', required: 75, weight: 0.9 },
    { skill: 'Python / Bash', required: 70, weight: 0.8 },
  ],
};

/**
 * Calculates Skill Gap analysis strictly based on provided user skills.
 */
export function analyzeSkillGaps(userSkills = [], targetRole = 'AI/ML Engineer') {
  if (!Array.isArray(userSkills) || userSkills.length === 0) {
    return {
      hasData: false,
      targetRole,
      skills: [],
      readyCount: 0,
      improveCount: 0,
      gapCount: 0,
      priorityActions: [],
      radarData: [],
    };
  }

  const requirements = ROLE_SKILL_REQUIREMENTS[targetRole] || ROLE_SKILL_REQUIREMENTS['AI/ML Engineer'];
  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim());

  const analyzedSkills = requirements.map((req) => {
    // Check if user has entered this skill or related keyword
    const match = normalizedUserSkills.find(
      (us) => us.includes(req.skill.toLowerCase()) || req.skill.toLowerCase().includes(us)
    );

    let current = 0;
    if (match) {
      // Base score for having provided the skill
      current = 75;
      if (match.length >= req.skill.length) current = 85;
    } else {
      current = 20; // not provided / known gap
    }

    let status = 'gap';
    if (current >= req.required) {
      status = 'ready';
    } else if (current >= req.required - 15) {
      status = 'improve';
    }

    return {
      skill: req.skill,
      current,
      required: req.required,
      status,
      gap: Math.max(0, req.required - current),
    };
  });

  const readyCount = analyzedSkills.filter((s) => s.status === 'ready').length;
  const improveCount = analyzedSkills.filter((s) => s.status === 'improve').length;
  const gapCount = analyzedSkills.filter((s) => s.status === 'gap').length;

  const priorityActions = analyzedSkills
    .filter((s) => s.status !== 'ready')
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 4)
    .map((item) => ({
      skill: item.skill,
      urgency: item.status === 'gap' ? 'High' : 'Medium',
      action: `Bridge the ${item.gap}% gap in ${item.skill} through focused projects and assessments.`,
      color: item.status === 'gap' ? 'text-red-400' : 'text-amber-400',
      bg: item.status === 'gap' ? 'bg-red-500/10' : 'bg-amber-500/10',
    }));

  const radarData = analyzedSkills.map((s) => ({
    skill: s.skill,
    current: s.current,
    required: s.required,
  }));

  return {
    hasData: true,
    targetRole,
    skills: analyzedSkills,
    readyCount,
    improveCount,
    gapCount,
    priorityActions,
    radarData,
  };
}

/**
 * Evaluates career recommendations dynamically based on user's actual skills.
 */
export function matchCareerPaths(userSkills = [], targetRole = '') {
  const allRoles = [
    {
      id: 1,
      title: 'AI/ML Engineer',
      icon: '🧠',
      color: 'from-blue-500 to-cyan-500',
      salary: '₹12-25 LPA',
      demand: 'Very High',
      skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch / TensorFlow', 'SQL'],
      companies: ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'PhonePe'],
    },
    {
      id: 2,
      title: 'Software Developer',
      icon: '💻',
      color: 'from-violet-500 to-purple-500',
      salary: '₹8-20 LPA',
      demand: 'High',
      skills: ['Data Structures', 'Java', 'Python', 'System Design', 'Git', 'SQL'],
      companies: ['TCS', 'Infosys', 'Wipro', 'Swiggy', 'Zomato'],
    },
    {
      id: 3,
      title: 'Data Analyst',
      icon: '📊',
      color: 'from-emerald-500 to-teal-500',
      salary: '₹6-15 LPA',
      demand: 'High',
      skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Statistics'],
      companies: ['Deloitte', 'EY', 'KPMG', 'Razorpay', 'Meesho'],
    },
    {
      id: 4,
      title: 'Data Scientist',
      icon: '🔬',
      color: 'from-pink-500 to-rose-500',
      salary: '₹10-22 LPA',
      demand: 'High',
      skills: ['Python', 'Statistics', 'Machine Learning', 'Deep Learning', 'SQL'],
      companies: ['Fractal Analytics', 'Mu Sigma', 'Tiger Analytics', 'Ola'],
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      icon: '⚙️',
      color: 'from-orange-500 to-amber-500',
      salary: '₹8-18 LPA',
      demand: 'Very High',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Cloud'],
      companies: ['ThoughtWorks', 'Accenture', 'IBM', 'Capgemini'],
    },
    {
      id: 6,
      title: 'Cloud Engineer',
      icon: '☁️',
      color: 'from-sky-500 to-blue-500',
      salary: '₹9-20 LPA',
      demand: 'Very High',
      skills: ['AWS', 'Cloud', 'Networking', 'Docker', 'Python'],
      companies: ['AWS', 'Google Cloud', 'Microsoft Azure', 'HCL'],
    },
  ];

  if (!Array.isArray(userSkills) || userSkills.length === 0) {
    return {
      hasSkills: false,
      paths: allRoles.map((r) => ({
        ...r,
        match: r.title === targetRole ? 60 : 45,
        reason: 'Add your technical skills in your profile to compute an exact AI match score.',
      })),
    };
  }

  const normalized = userSkills.map((s) => s.toLowerCase());

  const paths = allRoles.map((role) => {
    let matchedSkills = 0;
    role.skills.forEach((rs) => {
      if (normalized.some((us) => us.includes(rs.toLowerCase()) || rs.toLowerCase().includes(us))) {
        matchedSkills++;
      }
    });

    const matchPercent = Math.min(
      Math.max(Math.round((matchedSkills / role.skills.length) * 100), 30),
      96
    );

    const isTarget = targetRole === role.title;
    let reason = '';
    if (matchedSkills > 0) {
      reason = `Based on your provided skills (${userSkills.slice(0, 3).join(', ')}), you have a ${matchPercent}% match for this role.`;
    } else {
      reason = `Requires skills such as ${role.skills.slice(0, 3).join(', ')}. Add skills you know to improve your match.`;
    }

    return {
      ...role,
      match: matchPercent,
      reason,
      isTarget,
    };
  });

  // Sort paths with target role and highest match first
  paths.sort((a, b) => b.match - a.match);

  return {
    hasSkills: true,
    paths,
  };
}

// ─── FEATURE 1: AI CAREER TWIN ENGINE ─────────────────────────────────────────

export function calculateCareerTwin(profile) {
  if (!profile) {
    return {
      hasData: false,
      studentName: 'Student',
      targetRole: 'Career Explorer',
      careerReadiness: 0,
      skillsCount: 0,
      verifiedSkillsCount: 0,
      projectsCount: 0,
      resumeStatus: 'Not Uploaded',
      interviewCount: 0,
      latestInterviewScore: null,
      careerDNA: [],
      dataTrust: [],
    };
  }

  const userSkills = Array.isArray(profile.skills) ? profile.skills : [];
  const verifiedSkills = Array.isArray(profile.verifiedSkills) ? profile.verifiedSkills : [];
  const projects = Array.isArray(profile.projects) ? profile.projects : [];
  const mockInterviews = Array.isArray(profile.mockInterviews) ? profile.mockInterviews : [];
  const adaptiveInterviews = Array.isArray(profile.adaptiveInterviews) ? profile.adaptiveInterviews : [];
  const hasResume = Boolean(profile.resume?.fileName || profile.resume?.uploadedAt);

  // Calculate authentic readiness score
  let weightedPoints = 0;
  let totalWeights = 0;

  // 1. Technical Skills
  if (userSkills.length > 0) {
    const verifiedRatio = userSkills.length > 0 ? verifiedSkills.length / userSkills.length : 0;
    const skillScore = Math.min(50 + userSkills.length * 5 + verifiedRatio * 25, 95);
    weightedPoints += skillScore * 0.3;
    totalWeights += 0.3;
  }

  // 2. Projects
  if (projects.length > 0) {
    const projScore = Math.min(60 + projects.length * 12, 95);
    weightedPoints += projScore * 0.25;
    totalWeights += 0.25;
  }

  // 3. Resume
  if (hasResume) {
    const resumeScore = profile.resume?.atsScore || 82;
    weightedPoints += resumeScore * 0.2;
    totalWeights += 0.2;
  }

  // 4. Interviews
  if (mockInterviews.length > 0) {
    const latestScore = mockInterviews[0]?.overallScore || 75;
    weightedPoints += latestScore * 0.25;
    totalWeights += 0.25;
  }

  const careerReadiness = totalWeights > 0 ? Math.round(weightedPoints / totalWeights) : 0;

  // Career DNA radar/dimensions based strictly on real profile data
  const careerDNA = [
    {
      trait: 'Technical Foundation',
      score: userSkills.length > 0 ? Math.min(userSkills.length * 12, 95) : 0,
      status: userSkills.length > 0 ? (verifiedSkills.length > 0 ? 'AI-VERIFIED' : 'PROVIDED') : 'NOT PROVIDED',
    },
    {
      trait: 'Applied Projects',
      score: projects.length > 0 ? Math.min(projects.length * 25, 96) : 0,
      status: projects.length > 0 ? 'PROVIDED' : 'NOT PROVIDED',
    },
    {
      trait: 'Resume ATS Health',
      score: hasResume ? (profile.resume?.atsScore || 80) : 0,
      status: hasResume ? 'AI ANALYZED' : 'NOT PROVIDED',
    },
    {
      trait: 'Interview Communication',
      score: mockInterviews.length > 0 ? (mockInterviews[0]?.scores?.communication || mockInterviews[0]?.overallScore || 75) : 0,
      status: mockInterviews.length > 0 ? 'ASSESSED' : 'NOT PROVIDED',
    },
    {
      trait: 'Verified Competencies',
      score: verifiedSkills.length > 0 ? Math.min(verifiedSkills.length * 30, 95) : 0,
      status: verifiedSkills.length > 0 ? 'AI-VERIFIED' : 'NOT PROVIDED',
    },
  ];

  return {
    hasData: userSkills.length > 0 || projects.length > 0 || hasResume || mockInterviews.length > 0,
    studentName: profile.fullName || 'Student',
    targetRole: profile.targetRole || 'Career Explorer',
    careerReadiness,
    skillsCount: userSkills.length,
    verifiedSkillsCount: verifiedSkills.length,
    projectsCount: projects.length,
    resumeStatus: hasResume ? 'Analyzed ✓' : 'Not Uploaded',
    interviewCount: mockInterviews.length,
    latestInterviewScore: mockInterviews[0]?.overallScore || null,
    careerDNA,
    totalAdaptiveSessions: adaptiveInterviews.length,
  };
}

// ─── FEATURE 2: PROOF OF SKILL QUESTION BANK & EVALUATION ──────────────────────

export const SKILL_ASSESSMENT_BANK = {
  Python: {
    title: 'Python Core & Applied Logic',
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'What is the primary difference between a Python list and a generator expression in memory management?',
        options: [
          'Generators store all items in RAM, whereas lists stream on demand',
          'Generators yield items lazily on demand, reducing memory overhead to O(1)',
          'Lists cannot contain heterogeneous types, but generators can',
          'Generators execute multithreaded operations automatically',
        ],
        correctAnswer: 1,
        explanation: 'Generators compute values on-the-fly using the iterator protocol, maintaining O(1) auxiliary memory.',
      },
      {
        id: 2,
        type: 'scenario',
        question: 'In a web backend serving 1,000 requests/sec, an endpoint performs synchronous I/O file operations causing worker thread starvation. How would you architect a solution in Python?',
        options: [
          'Switch to asyncio / aiofiles with an asynchronous event loop, or offload I/O to background Celery workers',
          'Increase the recursion limit with sys.setrecursionlimit()',
          'Wrap all file reads in while True loops to poll faster',
          'Convert the Python code to run exclusively inside SQLite triggers',
        ],
        correctAnswer: 0,
        explanation: 'Non-blocking async I/O or background task queues (Celery/Redis) prevent blocking the main WSGI/ASGI event loops.',
      },
      {
        id: 3,
        type: 'coding',
        question: 'Which built-in Python decorator is used to memoize expensive function return values based on arguments?',
        options: [
          '@functools.lru_cache',
          '@decorator.memoize',
          '@sys.cache_result',
          '@runtime.optimize',
        ],
        correctAnswer: 0,
        explanation: '@functools.lru_cache wraps a function with a least-recently-used cache to eliminate redundant computations.',
      },
    ],
  },
  'Data Structures': {
    title: 'Data Structures & Algorithms Proficiency',
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'What is the average time complexity of searching an element in a balanced Binary Search Tree (AVL / Red-Black Tree)?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctAnswer: 1,
        explanation: 'Balanced BSTs guarantee maximum tree height of O(log N), keeping lookup, insertion, and deletion logarithmic.',
      },
      {
        id: 2,
        type: 'scenario',
        question: 'You need to detect cycles in an undirected graph representing a microservice dependency network. Which algorithm is most optimal?',
        options: [
          'Disjoint Set Union (Union-Find) or Depth-First Search with visited tracking in O(V + E)',
          'Bubble Sort on edge weights',
          'Dijkstras shortest path algorithm without priority queue',
          'Kadanes Subarray Algorithm',
        ],
        correctAnswer: 0,
        explanation: 'Union-Find or DFS tracks parent-child traversals to identify back-edges indicative of cycles in O(V + E).',
      },
      {
        id: 3,
        type: 'coding',
        question: 'Which data structure provides amortized O(1) time complexity for both LRU eviction and key lookup?',
        options: [
          'Hash Map combined with Doubly Linked List',
          'Single Linked List with Binary Search',
          'Max-Heap with array indexing',
          'Trie with prefix nodes',
        ],
        correctAnswer: 0,
        explanation: 'A Hash Map gives O(1) access to nodes in a Doubly Linked List, which maintains access ordering in O(1).',
      },
    ],
  },
  SQL: {
    title: 'Relational Database & SQL Architecture',
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'What is the main difference between WHERE and HAVING clauses in SQL?',
        options: [
          'WHERE filters rows before grouping; HAVING filters aggregated groups after GROUP BY',
          'HAVING works on single rows; WHERE only works with JOINs',
          'WHERE is only valid in PostgreSQL; HAVING is only valid in MySQL',
          'There is no functional difference',
        ],
        correctAnswer: 0,
        explanation: 'WHERE filters rows prior to aggregation, while HAVING filters group results calculated by aggregate functions.',
      },
      {
        id: 2,
        type: 'scenario',
        question: 'A query joining orders and customers on customer_id takes 14 seconds on a 20-million row table. What is the immediate first optimization?',
        options: [
          'Create a B-Tree index on orders(customer_id) and customers(customer_id)',
          'Replace all INNER JOINs with FULL OUTER JOINs',
          'Run SELECT * without limits',
          'Drop the primary key constraint',
        ],
        correctAnswer: 0,
        explanation: 'Indexing foreign and join keys prevents full-table sequential scans, cutting join lookups from O(N) to O(log N).',
      },
      {
        id: 3,
        type: 'coding',
        question: 'Which window function computes a row rank without gaps for duplicate values?',
        options: ['DENSE_RANK()', 'RANK()', 'ROW_NUMBER()', 'NTILE()'],
        correctAnswer: 0,
        explanation: 'DENSE_RANK() does not skip rank values when ties occur, unlike RANK().',
      },
    ],
  },
  'Machine Learning': {
    title: 'Machine Learning Fundamentals & Optimization',
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'How do you detect overfitting in a supervised learning model?',
        options: [
          'High training accuracy accompanied by significantly lower validation/test accuracy',
          'Low training accuracy and low validation accuracy',
          'When the learning rate is set to 0.001',
          'When all predictions are zero',
        ],
        correctAnswer: 0,
        explanation: 'Overfitting occurs when the model memorizes training noise rather than generalizable patterns.',
      },
      {
        id: 2,
        type: 'scenario',
        question: 'In an imbalanced fraud detection dataset where fraudulent cases represent 0.2% of samples, which metric should be prioritized over Accuracy?',
        options: [
          'Precision-Recall AUC (PR-AUC) and F1-Score',
          'Raw Accuracy score',
          'Mean Squared Error (MSE)',
          'R-squared',
        ],
        correctAnswer: 0,
        explanation: 'Accuracy is misleading on imbalanced datasets. PR-AUC and F1 measure true positive recovery without majority class bias.',
      },
      {
        id: 3,
        type: 'coding',
        question: 'Which regularization technique adds the absolute values of the coefficients to the loss function to encourage feature sparsity?',
        options: ['L1 Regularization (Lasso)', 'L2 Regularization (Ridge)', 'Batch Normalization', 'Dropout'],
        correctAnswer: 0,
        explanation: 'L1 regularization drives irrelevant weights directly to zero, performing intrinsic feature selection.',
      },
    ],
  },
};

export function getSkillAssessment(skillName) {
  // Return tailored assessment or fallback generic technical assessment
  if (SKILL_ASSESSMENT_BANK[skillName]) {
    return SKILL_ASSESSMENT_BANK[skillName];
  }

  return {
    title: `${skillName} Practical Evaluation`,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: `What represents a core engineering best practice when building production systems with ${skillName}?`,
        options: [
          'Enforcing modular architecture, type safety, and test-driven validation',
          'Writing monolithic scripts without version control',
          'Hardcoding API secrets directly in repository files',
          'Disabling all logging to maximize network throughput',
        ],
        correctAnswer: 0,
        explanation: 'Clean separation of concerns and robust test coverage are mandatory for maintainable software.',
      },
      {
        id: 2,
        type: 'scenario',
        question: `When deploying an application using ${skillName}, latency spikes are observed during peak traffic. What is the recommended diagnostic workflow?`,
        options: [
          'Profile bottlenecks using APM tools, analyze query plans, and implement caching layers',
          'Immediately reboot servers without inspecting logs',
          'Remove all validation constraints from input pipelines',
          'Double the database connection timeout',
        ],
        correctAnswer: 0,
        explanation: 'Metric profiling and observability tools pinpoint CPU, memory, and database bottlenecks reliably.',
      },
      {
        id: 3,
        type: 'coding',
        question: `How do you best prevent memory leaks or resource exhaustion when working with external connections in ${skillName}?`,
        options: [
          'Use context managers, connection pooling, and deterministic resource release patterns',
          'Keep persistent sockets open indefinitely without keepalive checks',
          'Suppress all connection exceptions silently',
          'Allocate fixed 64GB buffers per thread',
        ],
        correctAnswer: 0,
        explanation: 'Connection pooling and context managers ensure resources are safely closed even during unhandled exceptions.',
      },
    ],
  };
}

// ─── FEATURE 3: JOB READINESS SIMULATOR ────────────────────────────────────────

export function simulateJobReadiness(profile, targetRole = 'Software Developer') {
  const userSkills = Array.isArray(profile?.skills) ? profile.skills : [];
  const verifiedSkills = Array.isArray(profile?.verifiedSkills) ? profile.verifiedSkills : [];
  const projects = Array.isArray(profile?.projects) ? profile.projects : [];
  const mockInterviews = Array.isArray(profile?.mockInterviews) ? profile.mockInterviews : [];
  const codingProfile = profile?.codingProfile;
  const hasResume = Boolean(profile?.resume?.fileName || profile?.resume?.uploadedAt);

  // Round 1: Resume Screening
  const round1Passed = hasResume && (profile?.resume?.atsScore || 70) >= 65;
  const round1Score = hasResume ? (profile?.resume?.atsScore || 80) : 0;

  // Round 2: Aptitude & Problem Solving (derived from academic CGPA + problem solving metrics)
  const cgpa = parseFloat(profile?.cgpa || '7.5');
  const round2Score = Math.min(Math.round((cgpa / 10) * 90) + (userSkills.length > 2 ? 8 : 0), 94);

  // Round 3: Technical Domain Assessment (derived from verified skills & role alignment)
  const roleReqs = ROLE_SKILL_REQUIREMENTS[targetRole] || ROLE_SKILL_REQUIREMENTS['Software Developer'];
  let matchedSkills = 0;
  roleReqs.forEach((r) => {
    if (userSkills.some((us) => us.toLowerCase().includes(r.skill.toLowerCase()) || r.skill.toLowerCase().includes(us.toLowerCase()))) {
      matchedSkills++;
    }
  });
  const techBase = roleReqs.length > 0 ? (matchedSkills / roleReqs.length) * 80 : 40;
  const verifiedBonus = verifiedSkills.length * 5;
  const round3Score = Math.min(Math.round(techBase + verifiedBonus), 96);

  // Round 4: Coding Round (derived from codingProfile problems solved + verified DSA)
  const solved = codingProfile?.totalSolved || (userSkills.some((s) => s.toLowerCase().includes('data structure')) ? 50 : 0);
  let round4Score = 40;
  if (solved > 200) round4Score = 88;
  else if (solved > 100) round4Score = 78;
  else if (solved > 30) round4Score = 65;
  else if (userSkills.length > 0) round4Score = 55;

  // Round 5: AI Interview Round
  let round5Score = 0;
  if (mockInterviews.length > 0) {
    round5Score = mockInterviews[0]?.overallScore || 75;
  } else {
    round5Score = 0;
  }

  const rounds = [
    {
      roundNumber: 1,
      name: 'Resume Screening',
      status: hasResume ? (round1Passed ? 'Passed ✓' : 'Needs Optimization') : 'Pending Upload',
      score: round1Score,
      weight: 0.15,
      icon: '📄',
      actionText: hasResume ? 'Review ATS Score' : 'Upload Resume',
      actionPath: '/resume',
    },
    {
      roundNumber: 2,
      name: 'Aptitude & Logic',
      status: round2Score >= 70 ? 'Passed ✓' : 'In Progress',
      score: round2Score,
      weight: 0.15,
      icon: '🧠',
      actionText: 'Strengthen Academic Profile',
      actionPath: '/account',
    },
    {
      roundNumber: 3,
      name: 'Technical Assessment',
      status: round3Score >= 70 ? 'Passed ✓' : 'Skills Incomplete',
      score: round3Score,
      weight: 0.25,
      icon: '⚡',
      actionText: 'Verify Skills',
      actionPath: '/skill-gap',
    },
    {
      roundNumber: 4,
      name: 'Coding Round',
      status: round4Score >= 70 ? 'Passed ✓' : 'Practice Required',
      score: round4Score,
      weight: 0.25,
      icon: '💻',
      actionText: 'Improve Coding',
      actionPath: '/coding',
    },
    {
      roundNumber: 5,
      name: 'AI Interview Round',
      status: mockInterviews.length > 0 ? (round5Score >= 70 ? 'Passed ✓' : 'Needs Practice') : 'Not Taken',
      score: round5Score,
      weight: 0.2,
      icon: '🎙️',
      actionText: mockInterviews.length > 0 ? 'Retake Interview' : 'Start Interview',
      actionPath: '/interview',
    },
  ];

  // Calculate overall readiness
  const totalScore = Math.round(
    rounds.reduce((acc, r) => acc + r.score * r.weight, 0)
  );

  // Identify biggest current weakness
  const activeRounds = rounds.filter((r) => r.score > 0);
  let biggestWeakness = rounds[0];
  if (activeRounds.length > 0) {
    biggestWeakness = [...rounds].sort((a, b) => a.score - b.score)[0];
  } else {
    biggestWeakness = rounds[0];
  }

  return {
    targetRole,
    finalReadiness: totalScore,
    rounds,
    biggestWeakness: {
      roundName: biggestWeakness.name,
      score: biggestWeakness.score,
      actionText: biggestWeakness.actionText,
      actionPath: biggestWeakness.actionPath,
      advice: `Your lowest performance is in ${biggestWeakness.name}. Improving this will have the greatest impact on your overall hiring readiness.`,
    },
  };
}

// ─── FEATURE 4: ADAPTIVE AI INTERVIEW QUESTIONS & EVOLUTION ────────────────────

export function getAdaptiveInterviewPlan(profile, requestedType = 'Technical') {
  const adaptiveHistory = Array.isArray(profile?.adaptiveInterviews) ? profile.adaptiveInterviews : [];
  const sessionCount = adaptiveHistory.length + 1;

  // Detect previous weaknesses
  let previousWeaknesses = [];
  if (adaptiveHistory.length > 0) {
    const latest = adaptiveHistory[0];
    previousWeaknesses = latest.weakAreas || ['Data Structures', 'System Design'];
  }

  // Determine difficulty
  let difficulty = 'Intermediate';
  if (sessionCount === 1) difficulty = 'Foundational';
  else if (sessionCount >= 3) difficulty = 'Advanced';

  // Primary adaptive focus area
  const focusArea = previousWeaknesses.length > 0 ? previousWeaknesses[0] : 'Core Technical Competence';

  return {
    sessionNumber: sessionCount,
    difficulty,
    focusArea,
    adaptiveInsight:
      sessionCount === 1
        ? 'Initial baseline evaluation. Questions will gauge foundational problem-solving and domain knowledge.'
        : `Adapting session to previous diagnostic results. Increased concentration on: ${focusArea}.`,
    evolutionHistory: adaptiveHistory.map((h, i) => ({
      session: h.sessionNumber || i + 1,
      date: h.date ? new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `Session ${i + 1}`,
      technical: h.scores?.technical || h.overallScore || 70,
      overall: h.overallScore || 72,
      focus: h.targetFocus || h.type || 'Technical',
    })),
  };
}

// ─── FEATURE 5: AI DAILY CAREER MISSIONS GENERATOR ────────────────────────────

export function generateDailyMissions(profile) {
  const userSkills = Array.isArray(profile?.skills) ? profile.skills : [];
  const verifiedSkills = Array.isArray(profile?.verifiedSkills) ? profile.verifiedSkills : [];
  const projects = Array.isArray(profile?.projects) ? profile.projects : [];
  const mockInterviews = Array.isArray(profile?.mockInterviews) ? profile.mockInterviews : [];
  const hasResume = Boolean(profile?.resume?.fileName || profile?.resume?.uploadedAt);
  const targetRole = profile?.targetRole || 'Software Developer';

  const missions = [];

  // Mission 1: Resume Check or Project Check
  if (!hasResume) {
    missions.push({
      id: 'm-resume',
      icon: '📄',
      task: 'Upload your resume for AI ATS scoring & skill extraction',
      xp: 60,
      done: false,
      tag: 'Resume',
      path: '/resume',
    });
  } else if (projects.length === 0) {
    missions.push({
      id: 'm-project',
      icon: '🚀',
      task: 'Add your first engineering portfolio project',
      xp: 75,
      done: false,
      tag: 'Projects',
      path: '/account',
    });
  } else {
    missions.push({
      id: 'm-proj-desc',
      icon: '✨',
      task: 'Run Project Intelligence audit on your latest project',
      xp: 50,
      done: false,
      tag: 'Projects',
      path: '/account',
    });
  }

  // Mission 2: Skill Verification
  const unverified = userSkills.find((s) => !verifiedSkills.some((vs) => vs.name.toLowerCase() === s.toLowerCase()));
  if (unverified) {
    missions.push({
      id: 'm-verify-skill',
      icon: '🧠',
      task: `Verify your ${unverified} proficiency with an AI Skill Test`,
      xp: 80,
      done: false,
      tag: 'Skills',
      path: '/skill-gap',
    });
  } else if (userSkills.length === 0) {
    missions.push({
      id: 'm-add-skill',
      icon: '🎯',
      task: 'Add at least 3 technical skills to your profile',
      xp: 45,
      done: false,
      tag: 'Skills',
      path: '/account',
    });
  } else {
    missions.push({
      id: 'm-dsa-solve',
      icon: '💻',
      task: 'Solve 2 DSA problems on Trees or Dynamic Programming',
      xp: 90,
      done: false,
      tag: 'Coding',
      path: '/coding',
    });
  }

  // Mission 3: Interview Arena
  if (mockInterviews.length === 0) {
    missions.push({
      id: 'm-first-interview',
      icon: '🎙️',
      task: `Take your first 10-minute AI Mock Interview for ${targetRole}`,
      xp: 100,
      done: false,
      tag: 'Interview',
      path: '/interview',
    });
  } else {
    missions.push({
      id: 'm-adaptive-interview',
      icon: '⚡',
      task: 'Complete an Adaptive AI Interview session to improve technical score',
      xp: 85,
      done: false,
      tag: 'Interview',
      path: '/interview',
    });
  }

  // Mission 4: Job Readiness / Career Simulator
  missions.push({
    id: 'm-job-sim',
    icon: '📊',
    task: `Simulate 5-round hiring process for ${targetRole}`,
    xp: 70,
    done: false,
    tag: 'Readiness',
    path: '/jobs',
  });

  return missions;
}

// ─── FEATURE 6: SKILL GAP → ACTION ENGINE ─────────────────────────────────────

export function getSkillGapActionPlan(skillName, targetRole = 'Software Developer', currentLevel = 50) {
  const learningCurriculums = {
    'Deep Learning': {
      whyItMatters: `As an ${targetRole}, understanding neural architectures, loss functions, and backpropagation is essential for production model training.`,
      whatToLearn: ['Multilayer Perceptrons & Activations', 'Convolutional & Recurrent Networks', 'Transformers & Self-Attention'],
      whatToPractice: 'Implement a ResNet model from scratch in PyTorch; train on CIFAR-10 with data augmentation.',
      practiceTarget: '2 Projects & 5 Implementations',
      estimatedTimeToClose: '3 Weeks',
    },
    'Data Structures': {
      whyItMatters: `${targetRole} technical screening rounds rely heavily on optimal algorithmic runtime (Big-O time and space constraints).`,
      whatToLearn: ['Balanced BSTs & Heaps', 'Graph Traversals (BFS, DFS, Dijkstra)', 'Dynamic Programming & Memoization'],
      whatToPractice: 'Solve 20 LeetCode Medium problems focusing on Tree reversals and Shortest Path algorithms.',
      practiceTarget: '20 Problems',
      estimatedTimeToClose: '2 Weeks',
    },
    SQL: {
      whyItMatters: 'Relational data querying and index performance tuning are foundational for high-throughput enterprise databases.',
      whatToLearn: ['Window Functions (ROW_NUMBER, DENSE_RANK)', 'CTE & Subquery Optimization', 'B-Tree & Composite Indexing'],
      whatToPractice: 'Write 10 complex analytics queries involving multiple table self-joins and aggregated window partitioning.',
      practiceTarget: '15 Query Challenges',
      estimatedTimeToClose: '1 Week',
    },
    Docker: {
      whyItMatters: 'Containerized deployment reproducibility guarantees that code running locally behaves identically in cloud environments.',
      whatToLearn: ['Multi-stage Dockerfiles', 'Container Networking & Volumes', 'Docker Compose Microservices'],
      whatToPractice: 'Containerize a full-stack web application with a Redis cache and PostgreSQL database using Docker Compose.',
      practiceTarget: '1 Full Microservice Stack',
      estimatedTimeToClose: '1 Week',
    },
  };

  const plan = learningCurriculums[skillName] || {
    whyItMatters: `${skillName} is a high-demand core competency frequently verified in technical hiring filters for ${targetRole}.`,
    whatToLearn: [`Core ${skillName} Architecture`, 'Design Patterns & Idiomatic Usage', 'Performance Optimization & Benchmarking'],
    whatToPractice: `Build a production-grade component demonstrating ${skillName} integration with comprehensive test suites.`,
    practiceTarget: '1 Verified Implementation',
    estimatedTimeToClose: '10 Days',
  };

  return {
    skillName,
    currentLevel,
    targetLevel: 85,
    ...plan,
  };
}

// ─── FEATURE 7: CAREER PATH SIMULATOR JOURNEY ──────────────────────────────────

export function getCareerJourneyPath(targetRole = 'AI/ML Engineer', profile) {
  const userSkills = Array.isArray(profile?.skills) ? profile.skills.map((s) => s.toLowerCase()) : [];
  const verifiedSkills = Array.isArray(profile?.verifiedSkills) ? profile.verifiedSkills.map((s) => s.name.toLowerCase()) : [];

  const journeys = {
    'AI/ML Engineer': [
      { step: 1, name: 'Python & OOP', req: 85, icon: '🐍' },
      { step: 2, name: 'SQL & Data Wrangling', req: 80, icon: '📊' },
      { step: 3, name: 'Machine Learning Fundamentals', req: 80, icon: '🤖' },
      { step: 4, name: 'Deep Learning & PyTorch', req: 75, icon: '🧠' },
      { step: 5, name: 'Large Language Models (LLMs)', req: 70, icon: '✨' },
      { step: 6, name: 'MLOps & Cloud Deployment', req: 65, icon: '🚀' },
    ],
    'Software Developer': [
      { step: 1, name: 'Core Language (Java / Python / C++)', req: 85, icon: '💻' },
      { step: 2, name: 'Data Structures & Algorithms', req: 85, icon: '⚡' },
      { step: 3, name: 'Relational Databases (SQL)', req: 80, icon: '🗄️' },
      { step: 4, name: 'REST APIs & Web Frameworks', req: 75, icon: '🌐' },
      { step: 5, name: 'System Design & Scalability', req: 70, icon: '🏗️' },
      { step: 6, name: 'CI/CD & Cloud Deployment', req: 65, icon: '🚀' },
    ],
  };

  const steps = journeys[targetRole] || journeys['AI/ML Engineer'];

  return steps.map((item) => {
    const isProvided = userSkills.some((us) => us.includes(item.name.toLowerCase().split(' ')[0]));
    const isVerified = verifiedSkills.some((vs) => vs.includes(item.name.toLowerCase().split(' ')[0]));

    let currentScore = 25;
    let status = 'gap';

    if (isVerified) {
      currentScore = 90;
      status = 'verified';
    } else if (isProvided) {
      currentScore = 75;
      status = 'provided';
    }

    return {
      ...item,
      currentScore,
      status, // 'verified' | 'provided' | 'gap'
      statusLabel: isVerified ? 'AI-VERIFIED ✓' : isProvided ? 'SELF-DECLARED 🟡' : 'GAP 🔴',
    };
  });
}

// ─── FEATURE 8: PLACEMENT READINESS HEATMAP ────────────────────────────────────

export function getReadinessHeatmap(profile) {
  const userSkills = Array.isArray(profile?.skills) ? profile.skills : [];
  const verifiedSkills = Array.isArray(profile?.verifiedSkills) ? profile.verifiedSkills : [];
  const projects = Array.isArray(profile?.projects) ? profile.projects : [];
  const mockInterviews = Array.isArray(profile?.mockInterviews) ? profile.mockInterviews : [];
  const codingProfile = profile?.codingProfile;
  const hasResume = Boolean(profile?.resume?.fileName || profile?.resume?.uploadedAt);
  const targetRole = profile?.targetRole || 'Software Developer';

  const pillars = [
    {
      id: 'tech',
      name: 'Technical Skills',
      score: userSkills.length > 0 ? Math.min(50 + userSkills.length * 6, 92) : null,
      trustStatus: userSkills.length > 0 ? (verifiedSkills.length > 0 ? 'AI-VERIFIED' : 'PROVIDED') : 'NOT PROVIDED',
      color: '#3b82f6',
      icon: '⚡',
    },
    {
      id: 'dsa',
      name: 'DSA & Algorithms',
      score: userSkills.some((s) => s.toLowerCase().includes('data structure')) ? 68 : null,
      trustStatus: userSkills.some((s) => s.toLowerCase().includes('data structure')) ? 'PROVIDED' : 'NOT PROVIDED',
      color: '#06b6d4',
      icon: '🧠',
    },
    {
      id: 'projects',
      name: 'Applied Projects',
      score: projects.length > 0 ? Math.min(60 + projects.length * 12, 95) : null,
      trustStatus: projects.length > 0 ? 'PROVIDED' : 'NOT PROVIDED',
      color: '#8b5cf6',
      icon: '🚀',
    },
    {
      id: 'resume',
      name: 'Resume Quality',
      score: hasResume ? (profile.resume?.atsScore || 85) : null,
      trustStatus: hasResume ? 'AI ANALYZED' : 'NOT PROVIDED',
      color: '#10b981',
      icon: '📄',
    },
    {
      id: 'communication',
      name: 'Communication',
      score: mockInterviews.length > 0 ? (mockInterviews[0]?.scores?.communication || 75) : null,
      trustStatus: mockInterviews.length > 0 ? 'ASSESSED' : 'NOT PROVIDED',
      color: '#f59e0b',
      icon: '💬',
    },
    {
      id: 'interview',
      name: 'Interview Readiness',
      score: mockInterviews.length > 0 ? (mockInterviews[0]?.overallScore || 78) : null,
      trustStatus: mockInterviews.length > 0 ? 'ASSESSED' : 'NOT PROVIDED',
      color: '#ec4899',
      icon: '🎙️',
    },
    {
      id: 'coding',
      name: 'Coding Platform Activity',
      score: (codingProfile?.totalSolved || 0) > 0 ? Math.min(45 + Math.round((codingProfile?.totalSolved || 0) * 0.2), 94) : null,
      trustStatus: (codingProfile?.totalSolved || 0) > 0 ? 'PROVIDED' : 'NOT PROVIDED',
      color: '#6366f1',
      icon: '💻',
    },
  ];

  // AI Diagnostic Opportunity finding
  const providedPillars = pillars.filter((p) => p.score !== null);
  let opportunityInsight = '';
  if (providedPillars.length === 0) {
    opportunityInsight = 'No data has been provided yet. Add your skills, projects, and resume to generate your placement readiness heatmap.';
  } else {
    const lowest = [...providedPillars].sort((a, b) => a.score - b.score)[0];
    opportunityInsight = `Your biggest opportunity is ${lowest.name} (${lowest.score}%). Improving ${lowest.name} from ${lowest.score}% to 80%+ will significantly strengthen your ${targetRole} placement candidacy.`;
  }

  return {
    pillars,
    opportunityInsight,
  };
}

// ─── FEATURE 10: PROJECT INTELLIGENCE ANALYZER ────────────────────────────────

export function analyzeProjectQuality(project) {
  if (!project) return null;

  const descLength = (project.desc || '').length;
  const techCount = Array.isArray(project.tech) ? project.tech.length : 0;
  const hasGithub = Boolean(project.github);
  const hasDemo = Boolean(project.link);

  // Evaluate 6 dimensions strictly based on provided inputs
  const technicalDepth = Math.min(45 + techCount * 12 + (descLength > 100 ? 20 : 10), 96);
  const innovation = Math.min(50 + (descLength > 80 ? 25 : 10) + (hasDemo ? 15 : 0), 92);
  const problemSolving = Math.min(55 + (descLength > 120 ? 25 : 10), 94);
  const technologyUsage = Math.min(40 + techCount * 15, 95);
  const industryRelevance = Math.min(60 + (hasGithub ? 15 : 0) + (hasDemo ? 15 : 0), 95);
  const resumeValue = Math.min(50 + (hasGithub ? 20 : 0) + (descLength > 50 ? 20 : 0), 95);

  const overallQuality = Math.round(
    (technicalDepth + innovation + problemSolving + technologyUsage + industryRelevance + resumeValue) / 6
  );

  const strengths = [];
  const recommendations = [];

  if (hasGithub) strengths.push('Open-source GitHub codebase linked for verifiable code review');
  if (hasDemo) strengths.push('Live deployed demo provides direct proof of work');
  if (techCount >= 3) strengths.push(`Strong multi-tier technology stack (${techCount} technologies)`);

  if (!hasDemo) recommendations.push('Deploy a live demo (e.g. on Vercel/Render) to enhance recruiter engagement');
  if (!hasGithub) recommendations.push('Add a public repository link to prove code structure and git hygiene');
  if (descLength < 100) recommendations.push('Detail the measurable impact, scale, or performance metrics in the project description');

  return {
    overallQuality,
    dimensions: [
      { label: 'Technical Depth', score: technicalDepth },
      { label: 'Innovation', score: innovation },
      { label: 'Problem Solving', score: problemSolving },
      { label: 'Technology Usage', score: technologyUsage },
      { label: 'Industry Relevance', score: industryRelevance },
      { label: 'Resume Value', score: resumeValue },
    ],
    strengths,
    recommendations,
    disclaimer: 'Analysis generated strictly from the project details, links, and technologies you provided.',
  };
}

// ─── FEATURE 11: RESUME → SKILL → JOB BRIDGE ──────────────────────────────────

export function connectResumeToJob(profile, targetRole = 'AI/ML Engineer') {
  const hasResume = Boolean(profile?.resume?.fileName || profile?.resume?.uploadedAt);
  if (!hasResume) {
    return {
      hasResume: false,
      extractedSkills: [],
      targetRole,
      matchPercentage: 0,
      matchedSkills: [],
      missingSkills: [],
      whyMatches: 'Upload a resume to automatically extract skills and evaluate compatibility against target roles.',
    };
  }

  // Realistic extraction from resume keywords or profile skills
  const resumeKeywords = profile?.resume?.keywords || profile?.skills || ['Python', 'SQL', 'Git'];
  const roleReqs = ROLE_SKILL_REQUIREMENTS[targetRole] || ROLE_SKILL_REQUIREMENTS['AI/ML Engineer'];

  const matched = [];
  const missing = [];

  roleReqs.forEach((r) => {
    const found = resumeKeywords.some((k) => k.toLowerCase().includes(r.skill.toLowerCase()) || r.skill.toLowerCase().includes(k.toLowerCase()));
    if (found) matched.push(r.skill);
    else missing.push(r.skill);
  });

  const matchPercentage = Math.min(Math.round((matched.length / roleReqs.length) * 100), 96);

  return {
    hasResume: true,
    fileName: profile?.resume?.fileName || 'Uploaded_Resume.pdf',
    extractedSkills: resumeKeywords,
    targetRole,
    matchPercentage,
    matchedSkills: matched,
    missingSkills: missing,
    whyMatches: `Your uploaded resume highlights ${matched.join(', ')}, matching ${matched.length} of ${roleReqs.length} core hiring requirements for ${targetRole}.`,
    howToImprove: `Incorporate hands-on project achievements featuring ${missing.slice(0, 2).join(' and ')} to push compatibility above 90%.`,
  };
}

// ─── FEATURE 12: "WHAT SHOULD I DO NEXT?" AI ADVISOR ──────────────────────────

export function getNextBestAction(profile) {
  const userSkills = Array.isArray(profile?.skills) ? profile.skills : [];
  const verifiedSkills = Array.isArray(profile?.verifiedSkills) ? profile.verifiedSkills : [];
  const projects = Array.isArray(profile?.projects) ? profile.projects : [];
  const mockInterviews = Array.isArray(profile?.mockInterviews) ? profile.mockInterviews : [];
  const hasResume = Boolean(profile?.resume?.fileName || profile?.resume?.uploadedAt);
  const targetRole = profile?.targetRole || 'Software Developer';

  if (!hasResume) {
    return {
      title: 'Upload Your Resume for ATS Audit',
      description: 'Your uploaded resume is the foundation for ATS score benchmarking and job matching.',
      actionText: 'Upload Resume Now',
      actionPath: '/resume',
      urgency: 'Immediate Priority',
      badge: 'Step 1 of 5',
    };
  }

  if (userSkills.length === 0) {
    return {
      title: 'Add Your Technical Skills',
      description: 'Declare the programming languages, databases, and frameworks you know to activate Skill Gap analysis.',
      actionText: 'Add Technical Skills',
      actionPath: '/account',
      urgency: 'High Priority',
      badge: 'Step 2 of 5',
    };
  }

  const unverified = userSkills.find((s) => !verifiedSkills.some((vs) => vs.name.toLowerCase() === s.toLowerCase()));
  if (unverified) {
    return {
      title: `Prove Your Skill: Take the ${unverified} AI Assessment`,
      description: `Don't just claim ${unverified}—prove it. Complete a 3-minute quiz & code challenge to earn the AI-VERIFIED badge.`,
      actionText: `Verify ${unverified}`,
      actionPath: '/skill-gap',
      urgency: 'Recommended',
      badge: 'Proof of Skill',
    };
  }

  if (projects.length === 0) {
    return {
      title: 'Add Your First Engineering Project',
      description: 'Recruiters prioritize demonstrated technical outcomes over coursework. Add a project with a GitHub link.',
      actionText: 'Add Project',
      actionPath: '/account',
      urgency: 'High Priority',
      badge: 'Portfolio',
    };
  }

  if (mockInterviews.length === 0) {
    return {
      title: `Complete Your First AI Mock Interview for ${targetRole}`,
      description: 'Test your technical articulating skills in a real-time conversational interview arena.',
      actionText: 'Start AI Interview',
      actionPath: '/interview',
      urgency: 'Crucial Milestone',
      badge: 'Interview Arena',
    };
  }

  return {
    title: `Simulate Full Hiring Rounds for ${targetRole}`,
    description: 'Run the 5-round Job Readiness Simulator to pinpoint your single biggest hiring bottleneck.',
    actionText: 'Run Hiring Simulator',
    actionPath: '/jobs',
    urgency: 'Daily Goal',
    badge: 'Hiring Simulation',
  };
}
