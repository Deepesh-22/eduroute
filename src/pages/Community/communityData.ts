/** Seed community content — original educational posts (Quora/forum style). */

export type CommunityCategory =
  | 'all'
  | 'discussions'
  | 'help'
  | 'internships'
  | 'hackathons'
  | 'resources'
  | 'general';

export type CommunityPost = {
  id: string;
  author: string;
  role?: string;
  college?: string;
  avatarColor: string;
  title: string;
  body: string;
  tags: string[];
  upvotes: number;
  comments: number;
  timeAgo: string;
  category: CommunityCategory;
  imageLabel?: string;
  imageEmoji?: string;
  isMentor?: boolean;
};

export type TopCommunity = {
  id: string;
  name: string;
  members: string;
  color: string;
  icon: string;
};

export type Contributor = {
  id: string;
  name: string;
  role: string;
  points: string;
  rank: number;
  color: string;
};

export type FeaturedDiscussion = {
  author: string;
  meta: string;
  title: string;
  body: string;
  upvotes: number;
  comments: number;
  tag: string;
  color: string;
};

/** Live EduRoute Discord invite */
export const DISCORD_INVITE_URL = 'https://discord.gg/nfUr66FZT';

export const CATEGORY_TABS: { id: CommunityCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'discussions', label: 'Discussions' },
  { id: 'help', label: 'Help & Advice' },
  { id: 'internships', label: 'Internships' },
  { id: 'hackathons', label: 'Hackathons' },
  { id: 'resources', label: 'Resources' },
  { id: 'general', label: 'General' },
];

export const TOP_COMMUNITIES: TopCommunity[] = [
  { id: 'dsa', name: 'DSA & CP', members: '12.4k members', color: 'from-emerald-500 to-teal-600', icon: '◇' },
  { id: 'web', name: 'Web Development', members: '8.7k members', color: 'from-green-500 to-emerald-600', icon: '▣' },
  { id: 'go', name: 'Go Lang', members: '4.3k members', color: 'from-cyan-500 to-blue-600', icon: 'GO' },
  { id: 'sd', name: 'System Design', members: '6.1k members', color: 'from-indigo-500 to-violet-600', icon: '▣' },
  { id: 'placement', name: 'Placement Talks', members: '9.8k members', color: 'from-purple-500 to-fuchsia-600', icon: '◆' },
];

export const TRENDING_TOPICS = [
  'internship',
  'dsa',
  'go',
  'system-design',
  'resume',
  'faang',
  'college-life',
  'career',
];

export const FEATURED: FeaturedDiscussion = {
  author: 'Priya Mehta',
  meta: '3rd Year · MIT Kota',
  title: 'How to choose between SDE and Data Science as a career?',
  body: "I'm confused between SDE and Data Science. I like coding but also find data interesting. What are the future opportunities and which one is better for long term?",
  upvotes: 245,
  comments: 132,
  tag: '#career',
  color: 'bg-rose-500',
};

export const TOP_CONTRIBUTORS: Contributor[] = [
  { id: '1', name: 'Aarav Sharma', role: 'Mentor · 5.2k points', points: '5.2k', rank: 1, color: 'bg-amber-500' },
  { id: '2', name: 'Sneha Patel', role: '3.8k points', points: '3.8k', rank: 2, color: 'bg-slate-400' },
  { id: '3', name: 'Rohit Yadav', role: '3.1k points', points: '3.1k', rank: 3, color: 'bg-amber-700' },
  { id: '4', name: 'Ananya Singh', role: '2.7k points', points: '2.7k', rank: 4, color: 'bg-indigo-500' },
  { id: '5', name: 'Karan Singh', role: '2.4k points', points: '2.4k', rank: 5, color: 'bg-violet-500' },
];

/** Original long-form style posts (FAANG prep, DSA, internships) for the feed */
export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    author: 'Riya Sharma',
    role: 'SDE @ Google',
    college: 'MIT Kota · 3h ago',
    avatarColor: 'bg-rose-500',
    title: 'How to prepare for FAANG interviews? (Complete Guide)',
    body:
      "Hey everyone! I've been through the interview process at Google and Amazon, and I'd love to share my preparation strategy, resources, and tips. Feel free to ask questions or share your own experience!\n\n" +
      '**Phase 1 – Foundations (4–6 weeks)**\n' +
      '• Master arrays, strings, hashing, two pointers, sliding window\n' +
      '• Solve ~150 easy/medium problems (patterns > volume)\n' +
      '• One language only (C++ / Java / Python) — depth beats switching\n\n' +
      '**Phase 2 – Core DSA (6–8 weeks)**\n' +
      '• Trees, graphs, DP, heaps, tries\n' +
      '• Timed contests weekly (Codeforces / LeetCode weekly)\n' +
      '• Revisit weak topics with spaced repetition\n\n' +
      '**Phase 3 – System design + behavioral (2–3 weeks)**\n' +
      '• High-level design: scaling, caches, queues, consistency\n' +
      '• STAR stories for leadership / conflict / failure\n\n' +
      'Resources that helped: LeetCode Blind 75 + NeetCode roadmap, Grokking the System Design Interview notes, and mock interviews with peers. Consistency > intensity. Happy to answer follow-ups!',
    tags: ['interview', 'faang', 'placement', 'preparation'],
    upvotes: 124,
    comments: 48,
    timeAgo: '3h ago',
    category: 'resources',
    imageLabel: 'FAANG Interview Prep',
    imageEmoji: '💻',
    isMentor: true,
  },
  {
    id: 'p2',
    author: 'Aman Verma',
    college: '2nd Year · MIT Kota · 12h ago',
    avatarColor: 'bg-emerald-500',
    title: 'Best resources for DSA in C++?',
    body:
      "I've completed basics and sorting. Need a good roadmap with resources (YouTube/books). Also, what's the best way to practice after Striver's A2Z?\n\n" +
      'Looking for:\n' +
      '1. Structured sheet after A2Z\n' +
      '2. Contests schedule for 2nd year students\n' +
      '3. When to start system design',
    tags: ['DSA', 'C++', 'roadmap', 'resources'],
    upvotes: 97,
    comments: 56,
    timeAgo: '12h ago',
    category: 'help',
  },
  {
    id: 'p3',
    author: 'Sneha Patel',
    college: '3rd Year · RTU Kota · 1d ago',
    avatarColor: 'bg-violet-500',
    title: 'Got interview call from Salesforce!',
    body:
      'Hey guys! I just received an interview call from Salesforce for the SDE Intern role. Any tips on what to expect and how to prepare? Would really appreciate your guidance.\n\n' +
      'OA had 2 coding questions (medium). Next rounds are technical + hiring manager. Sharing resume tips that worked for me: quantified impact, project links, and a short "Why Salesforce" note.',
    tags: ['internship', 'salesforce', 'interview'],
    upvotes: 156,
    comments: 38,
    timeAgo: '1d ago',
    category: 'internships',
  },
  {
    id: 'p4',
    author: 'Karan Singh',
    college: '2nd Year · MIT Kota · 1d ago',
    avatarColor: 'bg-amber-600',
    title: 'Need help with project idea',
    body:
      "I want to build a real world project but confused on which domain to choose. Any suggestions?\n\nI'm comfortable with React + Node. Interested in either a campus placement helper (skill gap + internship board) or a DSA tracker with spaced revision. Open to open-source too.",
    tags: ['projects', 'ideas', 'help'],
    upvotes: 64,
    comments: 29,
    timeAgo: '1d ago',
    category: 'help',
  },
  {
    id: 'p5',
    author: 'Ananya Singh',
    college: '4th Year · NIT · 2d ago',
    avatarColor: 'bg-blue-500',
    title: 'SIH 2025 — how we structured our problem statement pitch',
    body:
      'Our team mapped problem → users → MVP → demo script in one week. For academia–industry collaboration themes: show skill mapping, internship pipeline, and institution dashboard in the same flow. Judges care about working demo + clear impact metrics more than slide count.',
    tags: ['hackathons', 'sih', 'demo'],
    upvotes: 88,
    comments: 21,
    timeAgo: '2d ago',
    category: 'hackathons',
  },
  {
    id: 'p6',
    author: 'Rohit Yadav',
    role: 'Mentor',
    college: 'Ex-Amazon · 2d ago',
    avatarColor: 'bg-indigo-600',
    title: 'Resume checklist before applying to product companies',
    body:
      'One page. Impact bullets (metric + action). Projects with live links. No soft skills wall of text. Tailor top 3 bullets to JD keywords. Export PDF with selectable text. Mentors in this community can review — post under #resume.',
    tags: ['resume', 'placement', 'career'],
    upvotes: 201,
    comments: 67,
    timeAgo: '2d ago',
    category: 'discussions',
    isMentor: true,
  },
];
