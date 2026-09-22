import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  ClipboardCheck,
  Instagram,
  Mail,
  Map,
  MessageCircle,
  Route,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { AuthModal } from '../components/AuthModal';
import { EduRouteLogo } from '../components/EduRouteLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { OfferStackSection } from '../components/OfferStackSection';

const HERO_VIDEO_CDN =
  'https://videos.pexels.com/video-files/2278095/2278095-hd_1920_1080_30fps.mp4';
const HERO_VIDEO_LOCAL = '/videos/hero-coding.mp4';

const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Roadmaps', href: '/roadmaps' },
  { label: 'Internships', href: '/internships' },
  { label: 'Journey', href: '#journey' },
];

const STATS = [
  { target: 45, suffix: 'K+', label: 'Active Learners', icon: Users, tone: 'bg-violet-500/20 text-violet-300' },
  { target: 80, suffix: '+', label: 'Roadmaps', icon: Map, tone: 'bg-emerald-500/20 text-emerald-300' },
  { target: 500, suffix: '+', label: 'Job & Internship Opportunities', icon: Briefcase, tone: 'bg-sky-500/20 text-sky-300' },
  { target: 120, suffix: '+', label: 'Upcoming Hackathons', icon: Trophy, tone: 'bg-amber-500/20 text-amber-300' },
];

const HOW_STEPS = [
  {
    step: '1',
    title: 'Sign up',
    body: 'Create a free account and pick the track you care about.',
    icon: Users,
  },
  {
    step: '2',
    title: 'Skill quiz',
    body: 'Answer a short yes/no quiz so we map your skill gaps.',
    icon: ClipboardCheck,
  },
  {
    step: '3',
    title: 'Get your path',
    body: 'Follow a personal roadmap, practice, and apply with confidence.',
    icon: Route,
  },
];

const QUICK_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Roadmaps', href: '/roadmaps' },
  { label: 'Internships', href: '/internships' },
  { label: 'Journey', href: '#journey' },
  { label: 'AI Buddy', href: '/buddy' },
];

const SUPPORT_LINKS = [
  { label: 'Contact', href: '#contact' },
  { label: 'Help', href: '#contact' },
];

/** CodeSandbox-style letter stagger (uses .hero-letter in index.css). */
function StaggerText({
  text,
  className = '',
  letterClassName = '',
  baseDelay = 0,
  step = 0.055,
}: {
  text: string;
  className?: string;
  letterClassName?: string;
  baseDelay?: number;
  step?: number;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) =>
        char === ' ' ? (
          <span key={i} className="hero-letter-space" aria-hidden>
            {' '}
          </span>
        ) : (
          <span
            key={i}
            className={`hero-letter ${letterClassName}`}
            style={{ animationDelay: `${baseDelay + i * step}s` }}
            aria-hidden
          >
            {char}
          </span>
        ),
      )}
    </span>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);
  return reduced;
}

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, reduced]);

  return value;
}

function StatItem({
  target,
  suffix,
  label,
  icon: Icon,
  tone,
  active,
}: {
  target: number;
  suffix: string;
  label: string;
  icon: typeof Users;
  tone: string;
  active: boolean;
}) {
  const value = useCountUp(target, active);
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2 sm:justify-center">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tone}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-lg font-black tabular-nums text-white sm:text-xl">
          {value}
          {suffix}
        </p>
        <p className="truncate text-[11px] font-medium text-slate-400">{label}</p>
      </div>
    </div>
  );
}

export const LandingPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [heroVideoSrc, setHeroVideoSrc] = useState(HERO_VIDEO_CDN);
  const [statsActive, setStatsActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const instagramUrl = 'https://www.instagram.com/vanshkhandelwal28/';
  const whatsappUrl = 'https://wa.link/9mfubu';
  const supportEmail = 'vanshkhandelwal777@gmail.com';

  // Pause hero video when off-screen
  useEffect(() => {
    const el = videoRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          void el.play().catch(() => undefined);
        } else {
          el.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [heroVideoSrc]);

  // Stats count-up when scrolled into view
  useEffect(() => {
    const el = statsRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStatsActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div id="home" className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-white/5 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-2.5">
            <EduRouteLogo size={36} className="shadow-md" />
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              EDU<span className="text-violet-600 dark:text-violet-400">ROUTE</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) =>
              item.href.startsWith('/') ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="#contact"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 sm:inline"
            >
              Contact
            </a>
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-violet-500"
            >
              Get Started
            </button>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 lg:hidden dark:text-slate-300"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 px-4 py-3 lg:hidden dark:border-slate-800">
            <nav className="flex flex-col gap-1">
              {NAV.map((item) =>
                item.href.startsWith('/') ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {item.label}
                  </a>
                ),
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Hero — matches reference: left-aligned, Build Skills. / Get Hired. + stagger */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className="h-full w-full object-cover opacity-45"
            autoPlay
            muted
            loop
            playsInline
            src={heroVideoSrc}
            onError={() => setHeroVideoSrc(HERO_VIDEO_LOCAL)}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-14">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/15 px-3.5 py-1.5 text-xs font-semibold text-violet-200 backdrop-blur">
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              Your Growth Partner in Tech
            </div>

            <h1 className="text-[clamp(2.5rem,6vw,4.25rem)] font-black leading-[1.05] tracking-tight">
              <span className="block text-white">
                <StaggerText text="Build Skills." baseDelay={0} step={0.055} />
              </span>
              <span className="block text-violet-400">
                <StaggerText text="Get Hired." baseDelay={0.55} step={0.055} />
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
              EDUROUTE helps you find the right roadmap, get internships and job opportunities, participate in
              hackathons and build the skills you need to grow in tech — all in one place.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/roadmaps"
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-500"
              >
                <ArrowRight className="h-4 w-4" />
                Explore Roadmaps
              </Link>
              <Link
                to="/internships"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                Find Opportunities
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div
            ref={statsRef}
            className="mt-12 flex flex-wrap items-stretch gap-y-2 rounded-2xl border border-white/10 bg-slate-900/70 px-2 py-3 shadow-xl backdrop-blur-md sm:mt-16 sm:flex-nowrap sm:px-4"
          >
            {STATS.map((s) => (
              <StatItem key={s.label} {...s} active={statsActive} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">How it works</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            Sign up → Skill quiz → Get your path — in three clear steps.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {HOW_STEPS.map((s, i) => (
            <div
              key={s.step}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              {i < HOW_STEPS.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden h-px w-6 translate-x-full border-t border-dashed border-slate-300 sm:block dark:border-slate-600" />
              )}
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 text-sm font-black text-white">
                {s.step}
              </div>
              <div className="mb-2 flex items-center gap-2">
                <s.icon className="h-4 w-4 text-violet-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{s.title}</h3>
              </div>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section id="journey" className="border-y border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Your journey</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
              Learn, build, compete, and get hired — guided every step.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Learn', desc: 'Explore curated roadmaps', icon: BookOpen, color: 'bg-violet-600' },
              { title: 'Build', desc: 'Projects and practice sheets', icon: Map, color: 'bg-emerald-500' },
              { title: 'Compete', desc: 'Hackathons and challenges', icon: Trophy, color: 'bg-pink-500' },
              { title: 'Get Hired', desc: 'Internships and full-time roles', icon: Briefcase, color: 'bg-sky-500' },
            ].map((j) => (
              <div
                key={j.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white ${j.color}`}>
                  <j.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{j.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{j.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <OfferStackSection />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-black sm:text-3xl">Ready to build skills that get you hired?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-violet-100">
            Join learners using EDUROUTE roadmaps, practice, and AI Buddy to grow faster.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-violet-700 shadow-sm transition hover:bg-violet-50"
            >
              Create free account
            </button>
            <Link
              to="/roadmaps"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Browse roadmaps
            </Link>
          </div>
        </div>
      </section>

      <footer id="contact" className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5">
                <EduRouteLogo size={36} className="shadow-md" />
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  EDU<span className="text-violet-600 dark:text-violet-400">ROUTE</span>
                </span>
              </div>
              <p className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-100">Learn. Build. Compete. Get Hired.</p>
              <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">
                Your one-stop platform to build skills, explore opportunities, and grow your career in tech.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-pink-300 hover:text-pink-600 dark:border-slate-700 dark:text-slate-400"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-emerald-300 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-400"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a
                  href={`mailto:${supportEmail}`}
                  aria-label="Email"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-violet-300 hover:text-violet-600 dark:border-slate-700 dark:text-slate-400"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Quick links</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {QUICK_LINKS.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith('/') ? (
                      <Link to={l.href} className="hover:text-violet-600">
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.href} className="hover:text-violet-600">
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Support</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {SUPPORT_LINKS.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="hover:text-violet-600">
                      {l.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`mailto:${supportEmail}`} className="hover:text-violet-600">
                    {supportEmail}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Newsletter</h4>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Updates on roadmaps, jobs, and events.</p>
              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setNewsletterEmail('');
                }}
              >
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900"
                  required
                />
                <button
                  type="submit"
                  className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-violet-700"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
            © {new Date().getFullYear()} EDUROUTE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
