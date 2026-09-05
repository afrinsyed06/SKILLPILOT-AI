/**
 * mockData.js — Static mock/demo data for the app.
 * NOTE: student profile data is now sourced from AuthContext (useAuth hook).
 * Import `useAuth()` in components instead of `student` from here.
 */



// ─── AI Features Config ───────────────────────────────────────────────────────
export const aiFeatures = [
  { id: 1, name: "Career Analysis", desc: "Analyzes your profile & suggests career paths", icon: "🎯", enabled: true, category: "Core" },
  { id: 2, name: "Skill Gap Detection", desc: "Compares your skills vs role requirements", icon: "🧠", enabled: true, category: "Core" },
  { id: 3, name: "Resume Parser", desc: "Extracts and analyzes resume content", icon: "📄", enabled: true, category: "Core" },
  { id: 4, name: "AI Mock Interview", desc: "Conducts realistic AI-powered interviews", icon: "🎤", enabled: true, category: "Interview" },
  { id: 5, name: "Interview Evaluator", desc: "Scores and provides feedback on answers", icon: "📊", enabled: true, category: "Interview" },
  { id: 6, name: "Job Matcher", desc: "Matches jobs to your profile & skills", icon: "💼", enabled: true, category: "Jobs" },
  { id: 7, name: "Roadmap Generator", desc: "Creates personalized 90-day study plans", icon: "🗺️", enabled: true, category: "Learning" },
  { id: 8, name: "AI Career Mentor", desc: "24/7 conversational career advisor", icon: "🤖", enabled: true, category: "Mentor" },
  { id: 9, name: "Coding Analyzer", desc: "Analyzes DSA patterns and weak topics", icon: "💻", enabled: true, category: "Coding" },
  { id: 10, name: "Adaptive Roadmap", desc: "Auto-adjusts plan based on progress", icon: "🔄", enabled: false, category: "Learning" },
  { id: 11, name: "Company Predictor", desc: "Predicts which companies may shortlist you", icon: "🏢", enabled: false, category: "Jobs" },
  { id: 12, name: "Salary Estimator", desc: "Estimates expected CTC based on profile", icon: "💰", enabled: false, category: "Jobs" },
];



// ─── Career Readiness Breakdown ─────────────────────────────────────────────
export const readinessBreakdown = [
  { label: "Technical Skills", score: 86, color: "#3b82f6" },
  { label: "DSA", score: 74, color: "#06b6d4" },
  { label: "Resume", score: 91, color: "#10b981" },
  { label: "Projects", score: 79, color: "#8b5cf6" },
  { label: "Communication", score: 76, color: "#f59e0b" },
  { label: "Interview Readiness", score: 81, color: "#ec4899" },
];

// ─── Skills ──────────────────────────────────────────────────────────────────
export const skills = [
  { name: "Python", level: 85, category: "Programming" },
  { name: "SQL", level: 65, category: "Database" },
  { name: "Machine Learning", level: 70, category: "AI/ML" },
  { name: "Deep Learning", level: 35, category: "AI/ML" },
  { name: "React.js", level: 78, category: "Frontend" },
  { name: "Data Structures", level: 72, category: "CS Fundamentals" },
  { name: "System Design", level: 50, category: "Architecture" },
  { name: "MLOps", level: 20, category: "AI/ML" },
  { name: "Git", level: 80, category: "DevOps" },
  { name: "Docker", level: 40, category: "DevOps" },
];

// ─── Skill Gap Data ──────────────────────────────────────────────────────────
export const skillGapData = [
  { skill: "Python", current: 85, required: 80, status: "ready" },
  { skill: "SQL", current: 65, required: 75, status: "improve" },
  { skill: "Machine Learning", current: 70, required: 85, status: "improve" },
  { skill: "Deep Learning", current: 35, required: 75, status: "gap" },
  { skill: "MLOps", current: 20, required: 65, status: "gap" },
  { skill: "Statistics", current: 60, required: 70, status: "improve" },
  { skill: "Data Visualization", current: 55, required: 65, status: "improve" },
  { skill: "Git/GitHub", current: 80, required: 75, status: "ready" },
  { skill: "System Design", current: 50, required: 60, status: "improve" },
];

// ─── Career Paths ────────────────────────────────────────────────────────────
export const careerPaths = [
  {
    id: 1,
    title: "AI/ML Engineer",
    match: 88,
    icon: "🧠",
    color: "from-blue-500 to-cyan-500",
    salary: "₹12-25 LPA",
    demand: "Very High",
    skills: ["Python", "ML", "Deep Learning", "TensorFlow", "SQL"],
    reason: "Your Python proficiency (85%) and ML foundation (70%) align strongly with this role. Only Deep Learning needs improvement.",
    companies: ["Google", "Microsoft", "Amazon", "Flipkart", "PhonePe"],
  },
  {
    id: 2,
    title: "Software Developer",
    match: 84,
    icon: "💻",
    color: "from-violet-500 to-purple-500",
    salary: "₹8-20 LPA",
    demand: "High",
    skills: ["DSA", "Java/Python", "System Design", "Git", "SQL"],
    reason: "Strong DSA and Python skills make you competitive. Add system design and REST API knowledge for a higher match.",
    companies: ["TCS", "Infosys", "Wipro", "Swiggy", "Zomato"],
  },
  {
    id: 3,
    title: "Data Analyst",
    match: 79,
    icon: "📊",
    color: "from-emerald-500 to-teal-500",
    salary: "₹6-15 LPA",
    demand: "High",
    skills: ["SQL", "Python", "Excel", "Tableau", "Statistics"],
    reason: "Your SQL and Python combination is ideal. Improve statistics and data visualization to unlock top-tier analyst roles.",
    companies: ["Deloitte", "EY", "KPMG", "Razorpay", "Meesho"],
  },
  {
    id: 4,
    title: "Data Scientist",
    match: 72,
    icon: "🔬",
    color: "from-pink-500 to-rose-500",
    salary: "₹10-22 LPA",
    demand: "High",
    skills: ["Python", "Statistics", "ML", "Deep Learning", "SQL"],
    reason: "Good ML foundation but statistics and deep learning gaps need to be bridged. Target in 60–90 days.",
    companies: ["Fractal Analytics", "Mu Sigma", "Tiger Analytics", "Ola"],
  },
  {
    id: 5,
    title: "DevOps Engineer",
    match: 58,
    icon: "⚙️",
    color: "from-orange-500 to-amber-500",
    salary: "₹8-18 LPA",
    demand: "Very High",
    skills: ["Docker", "Kubernetes", "CI/CD", "Linux", "Cloud"],
    reason: "Foundational skills in Git and Docker exist. Significant learning in cloud infrastructure is required.",
    companies: ["ThoughtWorks", "Accenture", "IBM", "Capgemini"],
  },
  {
    id: 6,
    title: "Cloud Engineer",
    match: 52,
    icon: "☁️",
    color: "from-sky-500 to-blue-500",
    salary: "₹9-20 LPA",
    demand: "Very High",
    skills: ["AWS/GCP/Azure", "Networking", "Docker", "Python", "Security"],
    reason: "Requires significant upskilling in cloud platforms. A 6-month focused preparation is recommended.",
    companies: ["AWS", "Google Cloud", "Microsoft Azure", "HCL"],
  },
];

// ─── Roadmap Phases ───────────────────────────────────────────────────────────
export const roadmapPhases = [
  {
    phase: 1,
    title: "Foundation",
    duration: "Days 1–20",
    icon: "🚀",
    color: "from-blue-500 to-cyan-400",
    progress: 100,
    status: "completed",
    tasks: [
      { name: "Python Advanced Concepts", done: true },
      { name: "SQL Joins & Subqueries", done: true },
      { name: "Data Structures — Arrays, Strings", done: true },
      { name: "Git & GitHub Workflow", done: true },
      { name: "Statistics Fundamentals", done: true },
    ],
  },
  {
    phase: 2,
    title: "Skill Building",
    duration: "Days 21–45",
    icon: "🧠",
    color: "from-violet-500 to-purple-400",
    progress: 72,
    status: "active",
    tasks: [
      { name: "Machine Learning Algorithms", done: true },
      { name: "Neural Networks Basics", done: true },
      { name: "Deep Learning with PyTorch", done: false },
      { name: "SQL Advanced — Window Functions", done: false },
      { name: "Linked Lists & Trees (DSA)", done: false },
    ],
  },
  {
    phase: 3,
    title: "Portfolio",
    duration: "Days 46–65",
    icon: "💼",
    color: "from-emerald-500 to-teal-400",
    progress: 0,
    status: "upcoming",
    tasks: [
      { name: "Build Computer Vision Project", done: false },
      { name: "Create ML Portfolio on GitHub", done: false },
      { name: "Resume Enhancement", done: false },
      { name: "LinkedIn Profile Optimization", done: false },
      { name: "Kaggle Competition Entry", done: false },
    ],
  },
  {
    phase: 4,
    title: "Interview Prep",
    duration: "Days 66–80",
    icon: "🎤",
    color: "from-amber-500 to-orange-400",
    progress: 0,
    status: "upcoming",
    tasks: [
      { name: "10 Technical Mock Interviews", done: false },
      { name: "5 HR Mock Interviews", done: false },
      { name: "Coding Challenges (LeetCode 50)", done: false },
      { name: "System Design Basics", done: false },
      { name: "Behavioral Questions Practice", done: false },
    ],
  },
  {
    phase: 5,
    title: "Placement Ready",
    duration: "Days 81–90",
    icon: "🏆",
    color: "from-rose-500 to-pink-400",
    progress: 0,
    status: "upcoming",
    tasks: [
      { name: "Company-Specific Preparation", done: false },
      { name: "3 Final Mock Interviews", done: false },
      { name: "Job Applications (10+)", done: false },
      { name: "Offer Negotiation Workshop", done: false },
      { name: "Placement Day — Ready!", done: false },
    ],
  },
];

// ─── Coding Stats ────────────────────────────────────────────────────────────
export const codingStats = {
  totalSolved: 234,
  streak: 12,
  rank: "1,247",
  accuracy: 78,
  topics: [
    { name: "Arrays", solved: 45, total: 50, percent: 90 },
    { name: "Strings", solved: 38, total: 45, percent: 84 },
    { name: "Linked Lists", solved: 22, total: 35, percent: 63 },
    { name: "Trees", solved: 18, total: 40, percent: 45 },
    { name: "Graphs", solved: 12, total: 45, percent: 27 },
    { name: "Dynamic Programming", solved: 10, total: 50, percent: 20 },
    { name: "Binary Search", solved: 28, total: 30, percent: 93 },
    { name: "Sorting", solved: 25, total: 28, percent: 89 },
    { name: "Recursion", solved: 20, total: 30, percent: 67 },
    { name: "Heaps & PQ", solved: 8, total: 25, percent: 32 },
  ],
  difficulty: [
    { name: "Easy", count: 145, color: "#10b981" },
    { name: "Medium", count: 72, color: "#f59e0b" },
    { name: "Hard", count: 17, color: "#ef4444" },
  ],
  weeklyActivity: [12, 8, 15, 3, 9, 14, 7],
  monthlyProgress: [
    { month: "Mar", problems: 28 },
    { month: "Apr", problems: 45 },
    { month: "May", problems: 52 },
    { month: "Jun", problems: 38 },
    { month: "Jul", problems: 61 },
    { month: "Aug", problems: 43 },
  ],
};

// ─── Heatmap Data ────────────────────────────────────────────────────────────
export const heatmapData = Array.from({ length: 52 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => {
    const r = Math.random();
    if (r > 0.6) return Math.floor(Math.random() * 8) + 1;
    return 0;
  })
);

// ─── Analytics ───────────────────────────────────────────────────────────────
export const analyticsData = {
  readinessOverTime: [
    { month: "Feb", score: 48 },
    { month: "Mar", score: 55 },
    { month: "Apr", score: 61 },
    { month: "May", score: 67 },
    { month: "Jun", score: 72 },
    { month: "Jul", score: 78 },
    { month: "Aug", score: 82 },
  ],
  skillGrowth: [
    { month: "Apr", Python: 70, ML: 40, SQL: 50, DSA: 55 },
    { month: "May", Python: 75, ML: 50, SQL: 55, DSA: 60 },
    { month: "Jun", Python: 78, ML: 58, SQL: 60, DSA: 65 },
    { month: "Jul", Python: 82, ML: 65, SQL: 62, DSA: 70 },
    { month: "Aug", Python: 85, ML: 70, SQL: 65, DSA: 74 },
  ],
  interviewScores: [
    { round: "Round 1", Technical: 65, HR: 72, Coding: 58 },
    { round: "Round 2", Technical: 70, HR: 75, Coding: 68 },
    { round: "Round 3", Technical: 78, HR: 80, Coding: 74 },
    { round: "Round 4", Technical: 82, HR: 84, Coding: 79 },
    { round: "Round 5", Technical: 85, HR: 88, Coding: 83 },
  ],
  radarData: [
    { skill: "Technical", value: 86 },
    { skill: "DSA", value: 74 },
    { skill: "Resume", value: 91 },
    { skill: "Projects", value: 79 },
    { skill: "Communication", value: 76 },
    { skill: "Interview", value: 81 },
  ],
};

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export const jobs = [
  {
    id: 1,
    title: "ML Engineer",
    company: "Google",
    location: "Bangalore, India",
    type: "Full-time",
    match: 92,
    salary: "₹20-28 LPA",
    skills: ["Python", "TensorFlow", "MLOps", "SQL"],
    missingSkills: ["MLOps"],
    logo: "G",
    logoColor: "from-blue-500 to-green-500",
    posted: "2 days ago",
    deadline: "Sep 30, 2024",
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "Razorpay",
    location: "Bangalore, India",
    type: "Full-time",
    match: 88,
    salary: "₹10-15 LPA",
    skills: ["SQL", "Python", "Tableau", "Excel"],
    missingSkills: ["Tableau"],
    logo: "R",
    logoColor: "from-blue-600 to-violet-600",
    posted: "1 day ago",
    deadline: "Oct 5, 2024",
  },
  {
    id: 3,
    title: "Junior Python Developer",
    company: "Flipkart",
    location: "Bangalore, India",
    type: "Full-time",
    match: 85,
    salary: "₹12-18 LPA",
    skills: ["Python", "Django", "SQL", "REST APIs"],
    missingSkills: ["Django", "REST APIs"],
    logo: "F",
    logoColor: "from-yellow-500 to-orange-500",
    posted: "3 days ago",
    deadline: "Oct 10, 2024",
  },
  {
    id: 4,
    title: "ML Intern",
    company: "Microsoft",
    location: "Hyderabad, India",
    type: "Internship",
    match: 79,
    salary: "₹60-80k/month",
    skills: ["Python", "ML", "Deep Learning", "Azure"],
    missingSkills: ["Deep Learning", "Azure"],
    logo: "M",
    logoColor: "from-blue-500 to-cyan-500",
    posted: "5 days ago",
    deadline: "Sep 25, 2024",
  },
  {
    id: 5,
    title: "Data Science Analyst",
    company: "Deloitte",
    location: "Mumbai, India",
    type: "Full-time",
    match: 74,
    salary: "₹8-14 LPA",
    skills: ["Python", "R", "Statistics", "SQL", "ML"],
    missingSkills: ["R", "Statistics (Advanced)"],
    logo: "D",
    logoColor: "from-green-600 to-emerald-600",
    posted: "1 week ago",
    deadline: "Oct 15, 2024",
  },
  {
    id: 6,
    title: "AI Research Intern",
    company: "Amazon",
    location: "Bangalore, India",
    type: "Internship",
    match: 68,
    salary: "₹70-90k/month",
    skills: ["Python", "Deep Learning", "NLP", "Research Skills"],
    missingSkills: ["NLP", "Research Papers", "Deep Learning"],
    logo: "A",
    logoColor: "from-orange-500 to-amber-500",
    posted: "4 days ago",
    deadline: "Oct 1, 2024",
  },
];

// ─── Achievements ─────────────────────────────────────────────────────────────
export const achievements = [
  { id: 1, title: "First Steps", desc: "Created your career profile", icon: "👣", earned: true, xp: 50 },
  { id: 2, title: "Resume Star", desc: "Achieved 90%+ ATS score", icon: "⭐", earned: true, xp: 150 },
  { id: 3, title: "Code Warrior", desc: "Solved 100+ coding problems", icon: "⚔️", earned: true, xp: 200 },
  { id: 4, title: "7-Day Streak", desc: "7 consecutive days of preparation", icon: "🔥", earned: true, xp: 100 },
  { id: 5, title: "Interview Ace", desc: "Scored 80%+ in mock interview", icon: "🎯", earned: true, xp: 300 },
  { id: 6, title: "Skill Builder", desc: "Improved 5 skills by 10%+", icon: "📈", earned: true, xp: 250 },
  { id: 7, title: "Project Master", desc: "Completed 3 portfolio projects", icon: "🏗️", earned: false, xp: 400 },
  { id: 8, title: "30-Day Warrior", desc: "30-day preparation streak", icon: "🛡️", earned: false, xp: 500 },
  { id: 9, title: "Graph Conqueror", desc: "Solved 20 Graph problems", icon: "🗺️", earned: false, xp: 200 },
  { id: 10, title: "DP Master", desc: "Solved 25 DP problems", icon: "🧩", earned: false, xp: 350 },
  { id: 11, title: "Placement Ready", desc: "Reached 90%+ readiness score", icon: "🏆", earned: false, xp: 1000 },
  { id: 12, title: "Job Getter", desc: "Received your first job offer", icon: "🎉", earned: false, xp: 2000 },
];

// ─── Interview Questions ──────────────────────────────────────────────────────
export const interviewQuestions = {
  Technical: [
    "Explain the difference between supervised and unsupervised learning.",
    "What is overfitting and how do you prevent it?",
    "Describe the bias-variance tradeoff.",
    "How does gradient descent work?",
    "What is a confusion matrix and when would you use it?",
    "Explain the difference between bagging and boosting.",
    "How would you handle missing values in a dataset?",
  ],
  HR: [
    "Tell me about yourself and your journey in CS.",
    "What are your greatest strengths as an engineer?",
    "Where do you see yourself in 5 years?",
    "Describe a challenging project and how you overcame difficulties.",
    "Why do you want to work in AI/ML?",
    "How do you handle tight deadlines and pressure?",
  ],
  Coding: [
    "Write a function to find the maximum subarray sum (Kadane's Algorithm).",
    "Implement BFS and DFS for a graph.",
    "Find the kth largest element in an array.",
    "Detect a cycle in a linked list.",
    "Write a function to check if a binary tree is balanced.",
  ],
  Project: [
    "Walk me through your most impressive project.",
    "What technologies did you use and why?",
    "What were the biggest challenges you faced?",
    "How did you validate your ML model's performance?",
    "What would you improve if you had more time?",
  ],
};

// ─── AI Mentor Chat Suggestions ───────────────────────────────────────────────
export const chatSuggestions = [
  "What should I learn next?",
  "Am I ready for placements?",
  "Give me a 30-day DSA plan",
  "Why is my interview score low?",
  "Which career suits me best?",
  "What project should I build?",
  "How to improve my resume?",
  "Which companies should I target?",
];

// ─── AI Mentor Responses ──────────────────────────────────────────────────────
export const aiResponses = {
  "What should I learn next?": "Based on your current profile, I recommend focusing on **Deep Learning** next. Your Python (85%) and ML foundation (70%) are solid. Deep Learning is your biggest gap (35% vs 75% required for AI/ML Engineer). Start with neural networks basics using PyTorch, then build a computer vision project within the next 14 days. This will increase your placement score by an estimated **8-10%**. 🚀",
  "Am I ready for placements?": "You're at **82% placement readiness** — that's strong progress! You can confidently apply to mid-tier companies right now. To reach 90%+, focus on two key areas: **Deep Learning** (your biggest gap) and **DSA Graph problems** (only 27% solved). With 14-21 more days of focused preparation, you'll be ready for top-tier placements at Google, Microsoft, and Amazon. 💪",
  "Give me a 30-day DSA plan": "Here's your personalized 30-day DSA plan:\n\n📅 **Week 1 (Days 1-7)**: Graphs — BFS, DFS, Shortest Path (5 problems/day)\n📅 **Week 2 (Days 8-14)**: Dynamic Programming — 1D DP, 2D DP, Memoization\n📅 **Week 3 (Days 15-21)**: Trees — Binary Trees, BST, Heap, Priority Queue\n📅 **Week 4 (Days 22-30)**: Mixed Practice + Timed Mock Contests\n\nTarget: Solve 150 problems total. Your weak areas are Graphs (27%) and DP (20%). Fix these, and your DSA score jumps from 74% to 87%. 🎯",
  "Why is my interview score low?": "Your interview analysis shows 3 main gaps:\n\n🔴 **Problem-solving explanation** — You solve correctly but don't articulate your thought process aloud. Practice explaining while coding.\n\n🟡 **Behavioral answers** — Your responses lack the STAR format (Situation, Task, Action, Result). This affects HR rounds significantly.\n\n🟡 **Algorithm complexity** — You mention solutions but often skip Big-O analysis. Always state time and space complexity.\n\n✅ **Action**: Do 3 mock interviews this week, focusing specifically on verbal explanation. This alone can improve your score by 12-15%. 🎤",
  "default": "Great question! Based on your profile as an aspiring **AI/ML Engineer** with 82% placement readiness, I'd recommend focusing on your current phase 2 tasks — specifically Deep Learning and Advanced SQL. Your strongest assets are Python and your Git workflow. Keep your 12-day streak going — consistency is your superpower! 🔥 Is there anything specific you'd like to dive deeper into?",
};

// ─── Projects ─────────────────────────────────────────────────────────────────
export const projects = [
  {
    name: "Sentiment Analysis API",
    tech: ["Python", "Flask", "BERT", "Docker"],
    desc: "NLP-based sentiment classifier with REST API",
    github: "#",
    stars: 24,
    status: "Completed",
  },
  {
    name: "Student Performance Predictor",
    tech: ["Python", "Scikit-learn", "Pandas", "Streamlit"],
    desc: "ML model predicting academic performance with 89% accuracy",
    github: "#",
    stars: 18,
    status: "Completed",
  },
  {
    name: "Real-time Object Detector",
    tech: ["Python", "YOLOv8", "OpenCV"],
    desc: "Computer vision project for real-time object detection",
    github: "#",
    stars: 0,
    status: "In Progress",
  },
];

// ─── Certifications ───────────────────────────────────────────────────────────
export const certifications = [
  { name: "Google Data Analytics Certificate", issuer: "Google", year: "2024" },
  { name: "Machine Learning Specialization", issuer: "Coursera (Andrew Ng)", year: "2023" },
  { name: "Python for Data Science", issuer: "IBM", year: "2023" },
];

// ─── Daily Missions ───────────────────────────────────────────────────────────
export const dailyMissions = [
  { id: 1, task: "Solve 2 Graph DSA problems", xp: 50, done: false, icon: "💻" },
  { id: 2, task: "Learn SQL Window Functions (30 min)", xp: 40, done: true, icon: "🗄️" },
  { id: 3, task: "Complete 1 Technical Mock Interview", xp: 100, done: false, icon: "🎤" },
  { id: 4, task: "Read 1 ML research article", xp: 30, done: true, icon: "📖" },
];

// ─── Resume Analysis ──────────────────────────────────────────────────────────
export const resumeAnalysis = {
  atsScore: 87,
  roleMatch: { role: "Software Developer", match: 87 },
  keywords: {
    present: ["Python", "Machine Learning", "SQL", "Git", "NumPy", "Pandas", "Scikit-learn"],
    missing: ["REST API", "System Design", "Docker", "Data Structures (explicit)"],
  },
  sections: [
    { name: "Contact Info", score: 100, status: "ready" },
    { name: "Summary/Objective", score: 78, status: "improve" },
    { name: "Work Experience", score: 65, status: "improve" },
    { name: "Projects", score: 92, status: "ready" },
    { name: "Skills", score: 84, status: "ready" },
    { name: "Education", score: 96, status: "ready" },
    { name: "Certifications", score: 88, status: "ready" },
    { name: "Achievements", score: 55, status: "gap" },
  ],
  suggestions: [
    "Add quantified impact to your project descriptions (e.g., '89% accuracy', 'reduced inference time by 40%')",
    "Include REST API and Docker in your skills section",
    "Expand your professional summary with your target role",
    "Add competitive programming achievements (LeetCode rank, etc.)",
    "Mention your GitHub stars and open-source contributions",
  ],
};
