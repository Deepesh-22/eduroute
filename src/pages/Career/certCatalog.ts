import { readOnboarding } from '../../utils/onboardingStore';

export type CertCourse = {
  id: string;
  title: string;
  provider: string;
  category: string;
  level: string;
  duration: string;
  description: string;
  url: string;
  free: boolean;
  tags: string[];
};

export const CERT_COURSES: CertCourse[] = [
  {
    id: 'google-it',
    title: 'Google IT Support Professional Certificate',
    provider: 'Google',
    category: 'IT Support',
    level: 'Beginner',
    duration: '~6 months',
    description: 'Foundational IT skills — troubleshooting, customer service, networking, and security.',
    url: 'https://www.coursera.org/professional-certificates/google-it-support',
    free: true,
    tags: ['it-support', 'networking', 'troubleshooting', 'hardware', 'helpdesk', 'security', 'cyber', 'cybersecurity'],
  },
  {
    id: 'google-data',
    title: 'Google Data Analytics Professional Certificate',
    provider: 'Google',
    category: 'Data',
    level: 'Beginner',
    duration: '~6 months',
    description: 'Data cleaning, analysis, and visualization with spreadsheets, SQL, R, and Tableau.',
    url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
    free: true,
    tags: ['data', 'analytics', 'sql', 'excel', 'tableau', 'spreadsheet', 'visualization', 'data-analyst', 'data-analysis'],
  },
  {
    id: 'google-cloud',
    title: 'Google Cloud Skills Boost — Free labs & badges',
    provider: 'Google Cloud',
    category: 'Cloud',
    level: 'All levels',
    duration: 'Self-paced',
    description: 'Hands-on cloud labs and skill badges. Start free with public courses and free trial credits.',
    url: 'https://www.cloudskillsboost.google/',
    free: true,
    tags: ['cloud', 'gcp', 'google-cloud', 'devops', 'kubernetes', 'containers'],
  },
  {
    id: 'ms-learn',
    title: 'Microsoft Learn — Free training & certifications prep',
    provider: 'Microsoft',
    category: 'Cloud',
    level: 'All levels',
    duration: 'Self-paced',
    description: 'Free modules for Azure, Power Platform, security, and developer tools. Exam prep paths included.',
    url: 'https://learn.microsoft.com/training/',
    free: true,
    tags: ['microsoft', 'azure', 'cloud', 'power-platform', 'security', 'developer'],
  },
  {
    id: 'ms-azure-fundamentals',
    title: 'Azure Fundamentals learning path',
    provider: 'Microsoft',
    category: 'Cloud',
    level: 'Beginner',
    duration: '~10 hours',
    description: 'Core Azure concepts, services, and pricing — free on Microsoft Learn (AZ-900 prep).',
    url: 'https://learn.microsoft.com/training/paths/azure-fundamentals/',
    free: true,
    tags: ['azure', 'cloud', 'az-900', 'microsoft', 'fundamentals'],
  },
  {
    id: 'aws-skillbuilder',
    title: 'AWS Skill Builder — Free digital courses',
    provider: 'Amazon Web Services',
    category: 'Cloud',
    level: 'All levels',
    duration: 'Self-paced',
    description: 'Free AWS cloud courses and learning plans for cloud practitioner and developer tracks.',
    url: 'https://skillbuilder.aws/',
    free: true,
    tags: ['aws', 'amazon', 'cloud', 'devops', 'lambda'],
  },
  {
    id: 'aws-cloud-essentials',
    title: 'AWS Cloud Practitioner Essentials',
    provider: 'Amazon Web Services',
    category: 'Cloud',
    level: 'Beginner',
    duration: '~6 hours',
    description: 'Free foundational AWS course covering core services, security, pricing, and architecture.',
    url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials',
    free: true,
    tags: ['aws', 'cloud-practitioner', 'cloud', 'architecture'],
  },
  {
    id: 'meta-frontend',
    title: 'Meta Front-End Developer Professional Certificate',
    provider: 'Meta',
    category: 'Development',
    level: 'Beginner',
    duration: '~7 months',
    description: 'HTML, CSS, JavaScript, React, and UI/UX basics from Meta (Coursera; audit free available).',
    url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    free: true,
    tags: ['frontend', 'front-end', 'react', 'javascript', 'html', 'css', 'ui', 'ux', 'web', 'software', 'developer'],
  },
  {
    id: 'ibm-skillsbuild',
    title: 'IBM SkillsBuild — Free courses & digital badges',
    provider: 'IBM',
    category: 'Career',
    level: 'All levels',
    duration: 'Self-paced',
    description: 'Free AI, cybersecurity, data, and professional skills courses with digital credentials.',
    url: 'https://skillsbuild.org/',
    free: true,
    tags: ['ai', 'cybersecurity', 'cyber', 'security', 'ethical-hacking', 'infosec', 'career', 'ibm'],
  },
  {
    id: 'ibm-data',
    title: 'IBM Data Science Professional Certificate',
    provider: 'IBM',
    category: 'Data',
    level: 'Beginner',
    duration: '~4 months',
    description: 'Python, SQL, data analysis, and machine learning foundations (Coursera; audit options).',
    url: 'https://www.coursera.org/professional-certificates/ibm-data-science',
    free: true,
    tags: ['data-science', 'python', 'sql', 'machine-learning', 'ml', 'pandas', 'data-analyst'],
  },
  {
    id: 'freecodecamp',
    title: 'freeCodeCamp — Full certifications',
    provider: 'freeCodeCamp',
    category: 'Development',
    level: 'Beginner',
    duration: 'Self-paced',
    description: 'Free responsive web design, JS algorithms, front-end libraries, data visualization, and more.',
    url: 'https://www.freecodecamp.org/learn/',
    free: true,
    tags: ['javascript', 'html', 'css', 'react', 'algorithms', 'frontend', 'backend', 'web', 'programming', 'coding'],
  },
  {
    id: 'hubspot',
    title: 'HubSpot Academy — Free inbound & marketing certs',
    provider: 'HubSpot',
    category: 'Business',
    level: 'All levels',
    duration: 'Self-paced',
    description: 'Free certifications in inbound marketing, content, email, and sales.',
    url: 'https://academy.hubspot.com/certification-overview',
    free: true,
    tags: ['marketing', 'sales', 'inbound', 'content', 'business', 'email'],
  },
];

export const CATEGORIES = ['All', 'Cloud', 'Data', 'Development', 'IT Support', 'Business', 'Career'] as const;

const STOP = new Set([
  'i', 'me', 'my', 'a', 'an', 'the', 'and', 'or', 'to', 'for', 'of', 'in', 'on', 'at', 'is', 'am', 'are',
  'want', 'wanna', 'need', 'looking', 'find', 'course', 'courses', 'cert', 'certificate', 'certificates',
  'related', 'please', 'some', 'any', 'with', 'about', 'based', 'into', 'from', 'this', 'that',
  'learn', 'learning', 'study', 'interested', 'interest', 'interests', 'skill', 'skills', 'gap', 'gaps',
]);

const SHORT_OK = new Set(['ui', 'ux', 'ml', 'ai', 'js', 'ts', 'sql', 'aws', 'gcp', 'it']);

const INTENT_MAP: { test: RegExp; expand: string[] }[] = [
  { test: /\bcyber\b|\bcyber\s*sec|\binfosec\b|\bhacking\b|\bpenetration\b|\bpentest\b/i, expand: ['cybersecurity', 'cyber', 'security', 'ethical-hacking', 'infosec'] },
  { test: /\bfront\s*-?end\b|\bfrontend\b|\breact\b|\bjavascript\b|\bui\/?ux\b/i, expand: ['frontend', 'react', 'javascript', 'html', 'css', 'web'] },
  { test: /\bback\s*-?end\b|\bbackend\b|\bnode\b|\bapi\b/i, expand: ['backend', 'programming', 'software', 'developer'] },
  { test: /\bdata\s*(scien|analy)|\banalytics\b|\bsql\b|\bpython\b/i, expand: ['data', 'analytics', 'data-science', 'sql', 'python', 'data-analyst'] },
  { test: /\bcloud\b|\baws\b|\bazure\b|\bgcp\b|\bdevops\b/i, expand: ['cloud', 'aws', 'azure', 'gcp', 'devops'] },
  { test: /\bmarket(ing)?\b|\bsales\b|\binbound\b/i, expand: ['marketing', 'sales', 'inbound', 'business'] },
  { test: /\bai\b|\bmachine\s*learning\b|\bml\b/i, expand: ['ai', 'machine-learning', 'ml', 'python'] },
  { test: /\bsoftware\b|\bdeveloper\b|\bcoding\b|\bprogramming\b/i, expand: ['software', 'developer', 'programming', 'coding', 'web'] },
];

function normalizeToken(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9+-]/g, '');
}

function extractKeywords(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  const expanded: string[] = [];
  for (const { test, expand } of INTENT_MAP) {
    if (test.test(lower)) expanded.push(...expand);
  }
  const raw = lower
    .replace(/[^a-z0-9+#.\s/-]/g, ' ')
    .split(/[\s/,;]+/)
    .map(normalizeToken)
    .filter(Boolean);
  const tokens: string[] = [];
  for (const t of raw) {
    if (STOP.has(t)) continue;
    if (t.length < 2) continue;
    if (t.length === 2 && !SHORT_OK.has(t)) continue;
    if (t.length < 3 && !SHORT_OK.has(t)) continue;
    tokens.push(t);
  }
  return [...new Set([...expanded, ...tokens])];
}

function wholeWordOrPhrase(hay: string, needle: string): boolean {
  if (!needle) return false;
  if (needle.includes('-') || needle.includes(' ')) {
    return hay.includes(needle.replace(/-/g, ' ')) || hay.includes(needle);
  }
  const re = new RegExp(`(^|[^a-z0-9])${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i');
  return re.test(hay);
}

function scoreCourse(course: CertCourse, keywords: string[]): { score: number; matched: string[] } {
  if (!keywords.length) return { score: 0, matched: [] };
  const hay = `${course.title} ${course.description} ${course.category} ${course.provider} ${course.tags.join(' ')}`.toLowerCase();
  let score = 0;
  const matched: string[] = [];
  for (const k of keywords) {
    const tagHit = course.tags.some(
      (tag) => tag === k || tag.replace(/-/g, '') === k.replace(/-/g, '') || (tag.includes(k) && k.length >= 4),
    );
    if (tagHit) {
      score += 6;
      matched.push(k);
      continue;
    }
    if (wholeWordOrPhrase(hay, k) && k.length >= 3) {
      score += 3;
      matched.push(k);
    }
  }
  return { score, matched: [...new Set(matched)] };
}

export function buildDefaultPrompt(): string {
  try {
    const profile = readOnboarding();
    const parts: string[] = [];
    if (profile.interests?.length) parts.push(`Target tracks: ${profile.interests.join(', ')}`);
    if (profile.missingSkills?.length) parts.push(`Skill gaps: ${profile.missingSkills.join(', ')}`);
    const noSkills = (profile.gapAnswers || []).filter((a) => a.answer === 'no').map((a) => a.skill).filter(Boolean);
    if (noSkills.length) parts.push(`Need practice: ${noSkills.join(', ')}`);
    if (parts.length) return parts.join('. ') + '.';
  } catch {
    /* ignore */
  }
  return '';
}

export type Suggestion = { course: CertCourse; score: number; reason: string };

export function suggestFromCatalog(prompt: string): Suggestion[] {
  const keywords = extractKeywords(prompt);
  if (!keywords.length) return [];
  const ranked = CERT_COURSES.map((course) => {
    const { score, matched } = scoreCourse(course, keywords);
    const reason =
      matched.length > 0
        ? `Matches your interest: ${matched.slice(0, 4).join(', ')}`
        : `Related to ${course.category.toLowerCase()}`;
    return { course, score, reason };
  })
    .filter((s) => s.score >= 6)
    .sort((a, b) => b.score - a.score);
  return ranked.slice(0, 2);
}
