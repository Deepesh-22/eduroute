/**
 * Client-side onboarding profile for AI Buddy context.
 * Stored in localStorage (no backend change required).
 */

export type InterestTrack = 'software' | 'cybersecurity' | 'data_analyst';

export type GapAnswer = {
  questionId: string;
  question: string;
  answer: 'yes' | 'no';
  skill: string;
};

export type OnboardingProfile = {
  interests: InterestTrack[];
  gapAnswers: GapAnswer[];
  missingSkills: string[];
  completedAt: string | null;
  skipped: boolean;
};

const STORAGE_KEY = 'eduroute:onboarding-v1';

const EMPTY: OnboardingProfile = {
  interests: [],
  gapAnswers: [],
  missingSkills: [],
  completedAt: null,
  skipped: false,
};

export const INTEREST_OPTIONS: {
  id: InterestTrack;
  title: string;
  description: string;
  accent: string;
  icon: 'software' | 'cyber' | 'data';
}[] = [
  {
    id: 'software',
    title: 'Software Developer / Software Engineer',
    description: 'Build applications, solve problems and create solutions for real-world challenges.',
    accent: 'from-indigo-50 to-blue-50 border-indigo-100',
    icon: 'software',
  },
  {
    id: 'cybersecurity',
    title: 'Cyber Security',
    description: 'Protect systems, prevent threats and keep data safe in the digital world.',
    accent: 'from-violet-50 to-indigo-50 border-violet-100',
    icon: 'cyber',
  },
  {
    id: 'data_analyst',
    title: 'Data Analyst',
    description: 'Find insights in data, help businesses make better decisions and drive growth.',
    accent: 'from-emerald-50 to-teal-50 border-emerald-100',
    icon: 'data',
  },
];

export const GAP_QUESTIONS: Record<
  InterestTrack,
  { id: string; question: string; skill: string }[]
> = {
  software: [
    { id: 'sw1', question: 'Have you built a web or mobile app before?', skill: 'Project building' },
    { id: 'sw2', question: 'Are you comfortable with at least one programming language (JS, Python, or Java)?', skill: 'Programming fundamentals' },
    { id: 'sw3', question: 'Do you know basic data structures (arrays, linked lists, hash maps)?', skill: 'Data structures' },
    { id: 'sw4', question: 'Have you used Git and GitHub for version control?', skill: 'Git & GitHub' },
    { id: 'sw5', question: 'Can you explain how REST APIs work at a basic level?', skill: 'APIs' },
    { id: 'sw6', question: 'Have you completed any coding internship, freelance, or open-source work?', skill: 'Practical experience' },
  ],
  cybersecurity: [
    { id: 'cy1', question: 'Do you understand networking basics (IP, DNS, HTTP/HTTPS)?', skill: 'Networking basics' },
    { id: 'cy2', question: 'Have you used the Linux command line for day-to-day tasks?', skill: 'Linux' },
    { id: 'cy3', question: 'Do you know what encryption and hashing mean?', skill: 'Cryptography basics' },
    { id: 'cy4', question: 'Have you practiced any CTF challenges or security labs?', skill: 'Hands-on security practice' },
    { id: 'cy5', question: 'Are you familiar with common vulnerabilities (XSS, SQL injection, CSRF)?', skill: 'Web vulnerabilities' },
    { id: 'cy6', question: 'Have you studied OS security or configured a firewall?', skill: 'OS & network security' },
  ],
  data_analyst: [
    { id: 'da1', question: 'Are you comfortable analyzing data in Excel or Google Sheets?', skill: 'Spreadsheets' },
    { id: 'da2', question: 'Have you used SQL to query a database?', skill: 'SQL' },
    { id: 'da3', question: 'Do you know Python or R for data analysis?', skill: 'Python/R for analysis' },
    { id: 'da4', question: 'Have you created charts, reports, or dashboards?', skill: 'Visualization' },
    { id: 'da5', question: 'Do you understand basic statistics (mean, median, correlation)?', skill: 'Statistics' },
    { id: 'da6', question: 'Have you cleaned or prepared a messy real-world dataset?', skill: 'Data cleaning' },
  ],
};

export function interestLabel(id: InterestTrack): string {
  return INTEREST_OPTIONS.find((o) => o.id === id)?.title || id;
}

export function readOnboarding(): OnboardingProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...JSON.parse(raw) } as OnboardingProfile;
  } catch {
    return { ...EMPTY };
  }
}

export function writeOnboarding(profile: OnboardingProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function saveInterests(interests: InterestTrack[]) {
  const current = readOnboarding();
  writeOnboarding({ ...current, interests, skipped: false });
}

export function saveGapResults(gapAnswers: GapAnswer[], missingSkills: string[]) {
  const current = readOnboarding();
  writeOnboarding({
    ...current,
    gapAnswers,
    missingSkills,
    completedAt: new Date().toISOString(),
    skipped: false,
  });
}

export function markOnboardingSkipped() {
  const current = readOnboarding();
  writeOnboarding({
    ...current,
    completedAt: new Date().toISOString(),
    skipped: true,
  });
}

export function isOnboardingDone(): boolean {
  return Boolean(readOnboarding().completedAt);
}

/** Text injected into Buddy AI context for personalized guidance. */
export function buildBuddyOnboardingContext(): {
  interests: string[];
  missingSkills: string[];
  summary: string;
} {
  const profile = readOnboarding();
  const interests = profile.interests.map(interestLabel);
  const missingSkills = profile.missingSkills || [];

  if (!profile.completedAt) {
    return { interests: [], missingSkills: [], summary: '' };
  }

  if (profile.skipped && interests.length === 0) {
    return {
      interests: [],
      missingSkills: [],
      summary: 'Student skipped interest and skill-gap onboarding.',
    };
  }

  const yesSkills = profile.gapAnswers.filter((a) => a.answer === 'yes').map((a) => a.skill);
  const summary = [
    interests.length ? `Career interests: ${interests.join(', ')}.` : '',
    yesSkills.length ? `Strengths: ${yesSkills.join(', ')}.` : '',
    missingSkills.length
      ? `Skill gaps to close: ${missingSkills.join(', ')}.`
      : 'No major skill gaps marked from the quiz.',
  ]
    .filter(Boolean)
    .join(' ');

  return { interests, missingSkills, summary };
}
