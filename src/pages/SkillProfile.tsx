import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Code2,
  Database,
  Map,
  Shield,
  Sparkles,
  Target,
  AlertTriangle,
} from 'lucide-react';
import {
  INTEREST_OPTIONS,
  InterestTrack,
  interestLabel,
  readOnboarding,
  type GapAnswer,
} from '../utils/onboardingStore';

const TRACK_ICONS: Record<InterestTrack, typeof Code2> = {
  software: Code2,
  cybersecurity: Shield,
  data_analyst: Database,
};

const TRACK_ACCENT: Record<
  InterestTrack,
  { soft: string; text: string; ring: string }
> = {
  software: {
    soft: 'bg-indigo-100 dark:bg-indigo-500/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    ring: 'ring-indigo-500/40',
  },
  cybersecurity: {
    soft: 'bg-violet-100 dark:bg-violet-500/20',
    text: 'text-violet-600 dark:text-violet-400',
    ring: 'ring-violet-500/40',
  },
  data_analyst: {
    soft: 'bg-emerald-100 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-500/40',
  },
};

type SkillRow = {
  skill: string;
  status: 'strength' | 'gap' | 'unknown';
  question?: string;
};

function buildSkillRows(gapAnswers: GapAnswer[], missingSkills: string[]): SkillRow[] {
  const bySkill = new Map<string, SkillRow>();

  gapAnswers.forEach((a) => {
    bySkill.set(a.skill, {
      skill: a.skill,
      status: a.answer === 'yes' ? 'strength' : 'gap',
      question: a.question,
    });
  });

  missingSkills.forEach((skill) => {
    if (!bySkill.has(skill)) {
      bySkill.set(skill, { skill, status: 'gap' });
    }
  });

  return Array.from(bySkill.values()).sort((a, b) => {
    const order = { gap: 0, strength: 1, unknown: 2 };
    return order[a.status] - order[b.status] || a.skill.localeCompare(b.skill);
  });
}

function scoreFromRows(rows: SkillRow[]): number {
  if (rows.length === 0) return 0;
  const strengths = rows.filter((r) => r.status === 'strength').length;
  return Math.round((strengths / rows.length) * 100);
}

export const SkillProfile = () => {
  const profile = useMemo(() => readOnboarding(), []);
  const rows = useMemo(
    () => buildSkillRows(profile.gapAnswers || [], profile.missingSkills || []),
    [profile.gapAnswers, profile.missingSkills],
  );
  const score = scoreFromRows(rows);
  const gaps = rows.filter((r) => r.status === 'gap');
  const strengths = rows.filter((r) => r.status === 'strength');
  const tracks = profile.interests || [];
  const hasData = Boolean(profile.completedAt) && (tracks.length > 0 || rows.length > 0);

  const nextSteps = useMemo(() => {
    const steps: { title: string; blurb: string; to: string; icon: typeof Map }[] = [];
    const primary = tracks[0] || 'software';

    if (primary === 'software' || gaps.some((g) => /data structures|programming/i.test(g.skill))) {
      steps.push({
        title: 'Practice DSA',
        blurb: 'Close fundamentals with the beginner sheet.',
        to: '/dsa-sheet',
        icon: Code2,
      });
    }
    steps.push({
      title: 'Follow a roadmap',
      blurb:
        primary === 'cybersecurity'
          ? 'Security path: networking, Linux, and labs.'
          : primary === 'data_analyst'
            ? 'Data path: SQL, Python, and visualization.'
            : 'Software path: projects, APIs, and Git.',
      to: '/roadmaps',
      icon: Map,
    });
    steps.push({
      title: 'Explore internships',
      blurb: 'Apply skills with real-world experience.',
      to: '/internships',
      icon: Briefcase,
    });
    if (gaps.length > 0) {
      steps.push({
        title: 'Ask Buddy AI',
        blurb: `Focus on: ${gaps
          .slice(0, 2)
          .map((g) => g.skill)
          .join(', ')}.`,
        to: '/buddy',
        icon: Sparkles,
      });
    }
    return steps.slice(0, 4);
  }, [tracks, gaps]);

  return (
    <div className="er-page space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--accent)]">Student Skill Profile</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-3xl">
            Your skills & gaps
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--text-secondary)]">
            Built from your onboarding interests and skill-check answers. No account sync required.
          </p>
        </div>
        {hasData && (
          <div className="er-card flex items-center gap-4 px-5 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
              <Target className="h-6 w-6 text-[var(--accent)]" />
            </div>
            <div>
              <div className="text-xs font-medium text-[var(--text-secondary)]">Skill readiness</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{score}%</div>
              <div className="text-xs text-[var(--text-muted)]">
                {strengths.length} strength{strengths.length === 1 ? '' : 's'} · {gaps.length} gap
                {gaps.length === 1 ? '' : 's'}
              </div>
            </div>
          </div>
        )}
      </header>

      {!hasData ? (
        <section className="er-card p-8 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-[var(--accent)]" />
          <h2 className="mt-4 text-lg font-bold text-[var(--text-primary)]">No skill profile yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-secondary)]">
            Complete the short interest + skill-gap onboarding to see strengths, gaps, and recommended
            next steps here.
          </p>
          <Link to="/onboarding" className="er-btn er-btn-primary mt-6 inline-flex items-center gap-2">
            Start skill check <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      ) : (
        <>
          {/* Target tracks */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-[var(--text-primary)]">Target tracks</h2>
            {tracks.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">
                No tracks selected.{' '}
                <Link to="/onboarding" className="font-semibold text-[var(--accent)]">
                  Pick interests
                </Link>
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tracks.map((id) => {
                  const opt = INTEREST_OPTIONS.find((o) => o.id === id);
                  const Icon = TRACK_ICONS[id];
                  const accent = TRACK_ACCENT[id];
                  return (
                    <div
                      key={id}
                      className={`er-card flex items-start gap-3 p-4 ring-1 ${accent.ring}`}
                    >
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent.soft}`}>
                        <Icon className={`h-5 w-5 ${accent.text}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[var(--text-primary)]">
                          {opt?.title || interestLabel(id)}
                        </div>
                        <p className="mt-0.5 text-xs text-[var(--text-secondary)] line-clamp-2">
                          {opt?.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Skill list */}
          <section>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Skills</h2>
              <span className="text-xs font-medium text-[var(--text-muted)]">
                From your yes/no skill check
              </span>
            </div>
            {rows.length === 0 ? (
              <div className="er-card p-6 text-sm text-[var(--text-secondary)]">
                You skipped the skill questions. Re-run onboarding to mark strengths and gaps.
                <div className="mt-3">
                  <Link to="/onboarding" className="font-semibold text-[var(--accent)]">
                    Retake skill check →
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="space-y-2">
                {rows.map((row) => (
                  <li
                    key={row.skill}
                    className={`er-card flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between ${
                      row.status === 'gap'
                        ? 'border-rose-200/80 bg-rose-50/50 dark:border-rose-500/30 dark:bg-rose-500/10'
                        : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {row.status === 'strength' ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                        )}
                        <span className="font-semibold text-[var(--text-primary)]">{row.skill}</span>
                      </div>
                      {row.question && (
                        <p className="mt-1 pl-6 text-xs text-[var(--text-secondary)]">{row.question}</p>
                      )}
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-bold ${
                        row.status === 'strength'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                      }`}
                    >
                      {row.status === 'strength' ? 'Strength' : 'Gap'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Gaps callout */}
          {gaps.length > 0 && (
            <section className="er-card border-rose-200/60 p-5 dark:border-rose-500/25">
              <h2 className="flex items-center gap-2 text-base font-bold text-[var(--text-primary)]">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                Skill gaps to close
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {gaps.map((g) => (
                  <span
                    key={g.skill}
                    className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800 dark:bg-rose-500/20 dark:text-rose-200"
                  >
                    {g.skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Recommended next steps */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-[var(--text-primary)]">Recommended next steps</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {nextSteps.map((step) => (
                <Link
                  key={step.to + step.title}
                  to={step.to}
                  className="er-card er-card-hover group flex items-start gap-3 p-4 transition-all"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                      {step.title}
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{step.blurb}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent)]" />
                </Link>
              ))}
            </div>
          </section>

          <p className="text-center text-xs text-[var(--text-muted)]">
            Want to update answers?{' '}
            <Link to="/onboarding" className="font-semibold text-[var(--accent)]">
              Re-run onboarding
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default SkillProfile;
