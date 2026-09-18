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
    iconBg: 'bg-violet-500/20 text-violet-300',
    accent: 'from-violet-600/30 to-indigo-900/40',
    to: '/assessments',
    badge: '8.5/10 Overall',
  },
  {
    title: 'Personalized Learning Path',
    desc: 'Get AI-powered roadmaps, curated courses and resources to bridge your skill gaps and achieve your goals.',
    icon: BookOpen,
    iconBg: 'bg-teal-500/20 text-teal-300',
    accent: 'from-teal-600/20 to-slate-900/40',
    to: '/roadmaps',
    badge: 'Beginner → Intermediate',
  },
  {
    title: 'Internships & Job Opportunities',
    desc: 'Explore verified internships, projects and job openings from top companies. Apply and track your progress easily.',
    icon: Briefcase,
    iconBg: 'bg-blue-500/20 text-blue-300',
    accent: 'from-blue-600/20 to-indigo-900/40',
    to: '/internships',
    badge: 'Google · Microsoft · TCS',
  },
  {
    title: 'Hackathons & Competitions',
    desc: 'Participate in exciting hackathons, showcase your skills, win rewards and build your portfolio.',
    icon: Trophy,
    iconBg: 'bg-pink-500/20 text-pink-300',
    accent: 'from-pink-600/20 to-violet-900/40',
    to: '/leaderboard',
    badge: 'Win & Showcase',
  },
  {
    title: 'Industry & Academia Collaboration',
    desc: 'Connect with industry mentors, attend workshops, guest lectures and live projects.',
    icon: Users,
    iconBg: 'bg-amber-500/20 text-amber-300',
    accent: 'from-amber-600/20 to-slate-900/40',
    to: '/events',
    badge: 'Students · Industry · Academia',
  },
  {
    title: 'Digital Portfolio & Analytics',
    desc: 'Showcase your verified skills, certifications, projects and achievements with detailed analytics and progress tracking.',
    icon: FileText,
    iconBg: 'bg-indigo-500/20 text-indigo-300',
    accent: 'from-indigo-600/20 to-violet-900/40',
    to: '/profile',
    badge: 'Verified Portfolio',
  },
];

type Props = { onExploreAll?: () => void };

export function OfferStackSection({ onExploreAll }: Props) {
  return (
    <section id="features" className="bg-slate-950 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-400">
              — What We Offer
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Everything You Need to Grow
            </h2>
          </div>
          <button
            type="button"
            onClick={onExploreAll}
            className="text-sm font-semibold text-violet-300 hover:underline"
          >
            Explore All Features →
          </button>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="sticky mb-[55vh] last:mb-8"
              style={{
                top: `calc(5.5rem + ${i * 0.75}rem)`,
                zIndex: i + 1,
              }}
            >
              <Link
                to={f.to}
                className={`group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${f.accent} p-6 shadow-2xl shadow-black/40 backdrop-blur-sm sm:min-h-[260px] sm:flex-row sm:items-center sm:gap-8 sm:p-8`}
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)' }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.28),transparent_55%)]" />
                <div className="relative z-10 max-w-md">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${f.iconBg}`}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">{f.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition group-hover:border-violet-500 group-hover:bg-violet-600">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="relative z-10 mt-6 flex shrink-0 items-center justify-center sm:mt-0 sm:w-[40%]">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-4 text-center shadow-inner backdrop-blur">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Highlight</p>
                    <p className="mt-1 text-sm font-bold text-violet-200">{f.badge}</p>
                    <div className="mt-3 flex justify-center gap-1.5">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="h-1.5 w-8 rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
                          style={{ opacity: 1 - d * 0.25 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
          <div className="h-[20vh]" aria-hidden />
        </div>
      </div>
    </section>
  );
}

export default OfferStackSection;
