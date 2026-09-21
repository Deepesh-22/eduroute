import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Code2,
  FileText,
  Trophy,
  Users,
} from 'lucide-react';

const FEATURES = [
  {
    title: 'Skill Assessment & Analysis',
    desc: 'Take industry-aligned tests, get your skill profile and discover your strengths and skill gaps.',
    icon: Code2,
    iconBg: 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300',
    accent: 'from-violet-100/80 to-indigo-50 dark:from-violet-600/30 dark:to-indigo-900/40',
    to: '/assessments',
    badge: '8.5/10 Overall',
  },
  {
    title: 'Personalized Learning Path',
    desc: 'Get AI-powered roadmaps, curated courses and resources to bridge your skill gaps and achieve your goals.',
    icon: BookOpen,
    iconBg: 'bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
    accent: 'from-teal-50 to-slate-50 dark:from-teal-600/20 dark:to-slate-900/40',
    to: '/roadmaps',
    badge: 'Beginner → Intermediate',
  },
  {
    title: 'Internships & Job Opportunities',
    desc: 'Explore verified internships, projects and job openings from top companies. Apply and track your progress easily.',
    icon: Briefcase,
    iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
    accent: 'from-blue-50 to-indigo-50 dark:from-blue-600/20 dark:to-indigo-900/40',
    to: '/internships',
    badge: 'Google · Microsoft · TCS',
  },
  {
    title: 'Hackathons & Competitions',
    desc: 'Participate in exciting hackathons, showcase your skills, win rewards and build your portfolio.',
    icon: Trophy,
    iconBg: 'bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-300',
    accent: 'from-pink-50 to-violet-50 dark:from-pink-600/20 dark:to-violet-900/40',
    to: '/leaderboard',
    badge: 'Win & Showcase',
  },
  {
    title: 'Industry & Academia Collaboration',
    desc: 'Connect with industry mentors, attend workshops, guest lectures and live projects.',
    icon: Users,
    iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    accent: 'from-amber-50 to-orange-50 dark:from-amber-600/20 dark:to-slate-900/40',
    to: '/events',
    badge: 'Students · Industry · Academia',
  },
  {
    title: 'Digital Portfolio & Analytics',
    desc: 'Showcase your verified skills, certifications, projects and achievements with detailed analytics and progress tracking.',
    icon: FileText,
    iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300',
    accent: 'from-indigo-50 to-violet-50 dark:from-indigo-600/20 dark:to-violet-900/40',
    to: '/profile',
    badge: 'Verified Portfolio',
  },
];

type Props = { onExploreAll?: () => void };

function FeatureCard({
  f,
  className = '',
}: {
  f: (typeof FEATURES)[number];
  className?: string;
}) {
  return (
    <Link
      to={f.to}
      className={`group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-3xl border border-[var(--border-default)] bg-gradient-to-br ${f.accent} bg-[var(--bg-card)] p-5 shadow-[var(--shadow-elevated)] transition-shadow hover:shadow-xl sm:min-h-[220px] sm:flex-row sm:items-center sm:gap-6 sm:p-7 md:min-h-[240px] md:p-8 dark:border-white/10 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.12),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.28),transparent_55%)]" />
      <div className="relative z-10 max-w-md">
        <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl sm:mb-4 sm:h-12 sm:w-12 ${f.iconBg}`}>
          <f.icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <h3 className="text-lg font-extrabold tracking-tight text-[var(--text-primary)] sm:text-xl md:text-2xl">
          {f.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">{f.desc}</p>
        <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3.5 py-1.5 text-sm font-semibold text-[var(--text-primary)] transition group-hover:border-violet-500 group-hover:bg-violet-600 group-hover:text-white sm:mt-5 sm:px-4 sm:py-2 dark:border-white/15 dark:bg-white/5">
          Learn more <ArrowRight className="h-4 w-4" />
        </span>
      </div>
      <div className="relative z-10 mt-5 flex shrink-0 items-center justify-center sm:mt-0 sm:w-[38%]">
        <div className="w-full max-w-[200px] rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-3.5 text-center shadow-inner dark:border-white/10 dark:bg-slate-950/70">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] sm:text-[11px]">
            Highlight
          </p>
          <p className="mt-1 text-sm font-bold text-violet-700 dark:text-violet-200">{f.badge}</p>
          <div className="mt-2.5 flex justify-center gap-1.5 sm:mt-3">
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className="h-1.5 w-7 rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 sm:w-8"
                style={{ opacity: 1 - d * 0.25 }}
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Sticky stack feature cards — same effect on mobile + desktop.
 * Mobile uses smaller sticky offsets / margins so cards stay on-screen
 * (large vh margins left empty "gap only" space on phones).
 */
export function OfferStackSection({ onExploreAll }: Props) {
  return (
    <section id="features" className="bg-[var(--bg-primary)] py-12 text-[var(--text-primary)] sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
              — What We Offer
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl">
              Everything You Need to Grow
            </h2>
          </div>
          <button
            type="button"
            onClick={onExploreAll}
            className="text-sm font-semibold text-violet-600 hover:underline dark:text-violet-300"
          >
            Explore All Features →
          </button>
        </div>

        {/* Sticky stack — mobile + desktop (responsive spacing) */}
        <div className="relative mx-auto max-w-4xl">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="sticky mb-10 last:mb-4 sm:mb-[18vh] sm:last:mb-6 md:mb-[22vh]"
              style={{
                top: `calc(4.25rem + ${i * 0.55}rem)`,
                zIndex: i + 1,
              }}
            >
              <FeatureCard f={f} />
            </div>
          ))}
          <div className="h-8 sm:h-[8vh]" aria-hidden />
        </div>
      </div>
    </section>
  );
}

export default OfferStackSection;
