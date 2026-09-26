/**
 * Employer validation loop — localStorage (SIH26134).
 * Course ratings, skill must-have/nice-to-have, curriculum approve/reject, surveys.
 */

export type SkillPreference = {
  skill: string;
  importance: 'must-have' | 'nice-to-have';
};

export type CourseRating = {
  id: string;
  courseId: string;
  courseName: string;
  company: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type CurriculumDecision = {
  id: string;
  recommendationId: string;
  title: string;
  decision: 'approved' | 'rejected';
  note: string;
  company: string;
  createdAt: string;
};

export type EmployerSurvey = {
  id: string;
  company: string;
  roleHiringFor: string;
  hardestSkillToFind: string;
  preferredTrainingMode: string;
  wouldPartnerWithCollege: boolean;
  notes: string;
  createdAt: string;
};

const RATINGS_KEY = 'eduroute:employer-ratings-v1';
const SKILLS_KEY = 'eduroute:employer-skills-v1';
const DECISIONS_KEY = 'eduroute:employer-curriculum-decisions-v1';
const SURVEYS_KEY = 'eduroute:employer-surveys-v1';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function readCourseRatings(): CourseRating[] {
  if (typeof localStorage === 'undefined') return [];
  return safeParse(localStorage.getItem(RATINGS_KEY), []);
}

export function writeCourseRating(entry: Omit<CourseRating, 'id' | 'createdAt'>) {
  const list = readCourseRatings();
  const row: CourseRating = {
    ...entry,
    id: `rate-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  list.unshift(row);
  localStorage.setItem(RATINGS_KEY, JSON.stringify(list.slice(0, 100)));
  window.dispatchEvent(new Event('eduroute:employer-validation-updated'));
  return row;
}

export function readSkillPreferences(): SkillPreference[] {
  if (typeof localStorage === 'undefined') return [];
  return safeParse(localStorage.getItem(SKILLS_KEY), []);
}

export function writeSkillPreferences(prefs: SkillPreference[]) {
  localStorage.setItem(SKILLS_KEY, JSON.stringify(prefs));
  window.dispatchEvent(new Event('eduroute:employer-validation-updated'));
}

export function readCurriculumDecisions(): CurriculumDecision[] {
  if (typeof localStorage === 'undefined') return [];
  return safeParse(localStorage.getItem(DECISIONS_KEY), []);
}

export function writeCurriculumDecision(
  entry: Omit<CurriculumDecision, 'id' | 'createdAt'>,
) {
  const list = readCurriculumDecisions();
  const row: CurriculumDecision = {
    ...entry,
    id: `dec-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  list.unshift(row);
  localStorage.setItem(DECISIONS_KEY, JSON.stringify(list.slice(0, 100)));
  window.dispatchEvent(new Event('eduroute:employer-validation-updated'));
  return row;
}

export function readSurveys(): EmployerSurvey[] {
  if (typeof localStorage === 'undefined') return [];
  return safeParse(localStorage.getItem(SURVEYS_KEY), []);
}

export function writeSurvey(entry: Omit<EmployerSurvey, 'id' | 'createdAt'>) {
  const list = readSurveys();
  const row: EmployerSurvey = {
    ...entry,
    id: `surv-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  list.unshift(row);
  localStorage.setItem(SURVEYS_KEY, JSON.stringify(list.slice(0, 50)));
  window.dispatchEvent(new Event('eduroute:employer-validation-updated'));
  return row;
}

export function employerValidationSummary() {
  const ratings = readCourseRatings();
  const decisions = readCurriculumDecisions();
  const surveys = readSurveys();
  const prefs = readSkillPreferences();
  const avgRating =
    ratings.length === 0
      ? 0
      : Math.round((ratings.reduce((a, r) => a + r.rating, 0) / ratings.length) * 10) / 10;
  return {
    ratingCount: ratings.length,
    avgRating,
    approved: decisions.filter((d) => d.decision === 'approved').length,
    rejected: decisions.filter((d) => d.decision === 'rejected').length,
    surveyCount: surveys.length,
    mustHaveCount: prefs.filter((p) => p.importance === 'must-have').length,
    niceToHaveCount: prefs.filter((p) => p.importance === 'nice-to-have').length,
  };
}
