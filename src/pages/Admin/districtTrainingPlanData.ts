/** SIH26134 — District training plan generator */

import { COURSES, type CourseFlag } from './curriculumGapData';

export type DistrictKey =
  | 'Pune'
  | 'Mumbai'
  | 'Nagpur'
  | 'Nashik'
  | 'Thane'
  | 'Kolhapur'
  | 'Aurangabad'
  | 'Solapur';

export const DISTRICTS: DistrictKey[] = [
  'Pune',
  'Mumbai',
  'Nagpur',
  'Nashik',
  'Thane',
  'Kolhapur',
  'Aurangabad',
  'Solapur',
];

export type PlanActionType = 'expand' | 'reduce' | 'add_module' | 'new_course';

export type PlanAction = {
  id: string;
  action: PlanActionType;
  courseOrRole: string;
  why: string;
  seatDelta: string;
  priority: 'high' | 'medium' | 'low';
  courseId?: string;
};

const DEMAND: Record<
  string,
  { openings: number; skills: { skill: string; demand: number; openings: number; trend: string }[] }
> = {
  Pune: {
    openings: 420,
    skills: [
      { skill: 'React', demand: 88, openings: 90, trend: 'rising' },
      { skill: 'TypeScript', demand: 75, openings: 70, trend: 'rising' },
      { skill: 'Node.js', demand: 82, openings: 65, trend: 'stable' },
    ],
  },
  Mumbai: {
    openings: 510,
    skills: [
      { skill: 'Python', demand: 90, openings: 100, trend: 'rising' },
      { skill: 'SQL', demand: 85, openings: 80, trend: 'stable' },
      { skill: 'Power BI', demand: 70, openings: 45, trend: 'rising' },
    ],
  },
  Nagpur: {
    openings: 180,
    skills: [
      { skill: 'AWS', demand: 80, openings: 40, trend: 'rising' },
      { skill: 'Docker', demand: 70, openings: 30, trend: 'rising' },
    ],
  },
  Nashik: {
    openings: 120,
    skills: [{ skill: 'Networking', demand: 70, openings: 25, trend: 'stable' }],
  },
  Thane: {
    openings: 95,
    skills: [{ skill: 'MS Office', demand: 40, openings: 15, trend: 'declining' }],
  },
  Kolhapur: {
    openings: 70,
    skills: [{ skill: 'Core banking', demand: 70, openings: 20, trend: 'rising' }],
  },
  Aurangabad: { openings: 60, skills: [{ skill: 'PLC', demand: 55, openings: 12, trend: 'stable' }] },
  Solapur: { openings: 45, skills: [{ skill: 'QA testing', demand: 50, openings: 10, trend: 'stable' }] },
};

export function coursesForDistrict(district: DistrictKey) {
  return COURSES.filter((c) => c.district === district);
}

export function topSkillsForDistrict(district: DistrictKey) {
  return DEMAND[district]?.skills ?? [];
}

export function generateDistrictPlan(district: DistrictKey): PlanAction[] {
  const courses = coursesForDistrict(district);
  const actions: PlanAction[] = [];
  let i = 0;

  for (const c of courses) {
    if (c.flag === 'critical_gap' || c.placementRate >= 55) {
      actions.push({
        id: `a-${++i}`,
        action: 'expand',
        courseOrRole: c.name,
        why: `High demand / ${c.flag === 'critical_gap' ? 'critical skill gaps' : 'solid placement'} in ${district}`,
        seatDelta: `+${Math.max(15, Math.round(c.seats * 0.2))}`,
        priority: 'high',
        courseId: c.id,
      });
    }
    if (c.flag === 'oversupplied' || c.flag === 'obsolete') {
      actions.push({
        id: `a-${++i}`,
        action: 'reduce',
        courseOrRole: c.name,
        why: `${c.flag} programme — ${c.placementRate}% placement`,
        seatDelta: `-${Math.max(20, Math.round(c.seats * 0.25))}`,
        priority: 'high',
        courseId: c.id,
      });
    }
    for (const r of c.recommendations.filter((x) => x.type === 'add').slice(0, 1)) {
      actions.push({
        id: `a-${++i}`,
        action: 'add_module',
        courseOrRole: `${c.name}: ${r.title}`,
        why: r.detail,
        seatDelta: '—',
        priority: r.priority,
        courseId: c.id,
      });
    }
  }

  if (!courses.some((c) => c.sector === 'Software') && district === 'Pune') {
    actions.push({
      id: `a-${++i}`,
      action: 'new_course',
      courseOrRole: 'AI / ML Associate (pilot)',
      why: 'Rising role with no local programme match',
      seatDelta: '+40 (new)',
      priority: 'medium',
    });
  }

  if (actions.length === 0) {
    actions.push({
      id: 'a-fallback',
      action: 'expand',
      courseOrRole: 'Digital literacy bridge',
      why: `Limited mapped courses in ${district} — seed capacity for employability`,
      seatDelta: '+30',
      priority: 'medium',
    });
  }

  return actions;
}

export function summarizePlan(district: DistrictKey, actions: PlanAction[]) {
  const courses = coursesForDistrict(district);
  return {
    totalOpenings: DEMAND[district]?.openings ?? 0,
    courseCount: courses.length,
    expandCount: actions.filter((a) => a.action === 'expand').length,
    reduceCount: actions.filter((a) => a.action === 'reduce').length,
    newCourseCount: actions.filter((a) => a.action === 'new_course').length,
    trainerShortfall: actions.filter((a) => a.action === 'expand' || a.action === 'new_course').length * 2,
    uniqueRoles: topSkillsForDistrict(district).length,
    readinessNote:
      actions.filter((a) => a.action === 'reduce').length > 0
        ? 'Some programmes should shrink; reallocate seats to gap areas.'
        : 'Capacity broadly aligned — focus on skill modules.',
  };
}

export function actionLabel(a: PlanActionType): string {
  return { expand: 'Expand', reduce: 'Reduce', add_module: 'Add module', new_course: 'New course' }[a];
}

export function actionTone(a: PlanActionType): string {
  return {
    expand: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    reduce: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
    add_module: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
    new_course: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  }[a];
}

export function flagToneLocal(flag: CourseFlag): string {
  return flag;
}
