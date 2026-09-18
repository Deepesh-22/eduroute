import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Code2,
  FileText,
  Instagram,
  Mail,
  Map,
  MessageCircle,
  Phone,
  Trophy,
  Users,
} from 'lucide-react';
import { AuthModal } from '../components/AuthModal';

const HERO_VIDEO_CDN =
  'https://videos.pexels.com/video-files/2278095/2278095-hd_1920_1080_30fps.mp4';
const HERO_VIDEO_LOCAL = '/videos/hero-coding.mp4';

const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Roadmaps', href: '#features' },
  { label: 'Jobs & Internships', href: '#features' },
  { label: 'Hackathons', href: '#features' },
  { label: 'Resources', href: '#features' },
  { label: 'Community', href: '#features' },
];

const STATS = [
  { value: '45K+', label: 'Active Learners', icon: Users, color: 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300' },
  { value: '80+', label: 'Roadmaps', icon: Map, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300' },
  { value: '500+', label: 'Job & Internship Opportunities', icon: Briefcase, color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300' },
  { value: '120+', label: 'Upcoming Hackathons', icon: Trophy, color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300' },
];

const FEATURES = [
  {
    title: 'Roadmaps',
    desc: 'Step-by-step learning paths for every role.',
    icon: Map,
    iconBg: 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300',
    to: '/roadmaps',
  },
  {
    title: 'Jobs & Internships',
    desc: 'Discover opportunities from top product companies.',
    icon: Briefcase,
    iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
    to: '/internships',
  },
  {
    title: 'Hackathons',
    desc: 'Participate, build and showcase your skills.',
    icon: Trophy,
    iconBg: 'bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-300',
    to: '/leaderboard',
  },
  {
    title: 'Practice & DSA',
    desc: 'Sharpen your coding skills with real problems.',
    icon: Code2,
    iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
    to: '/dsa-sheet',
  },
  {
    title: 'Community',
    desc: 'Learn, share and grow together.',
    icon: Users,
    iconBg: 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300',
    to: '/leaderboard',
  },
  {
    title: 'Resources',
    desc: 'Curated articles, tools and study material.',
    icon: FileText,
    iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300',
    to: '/roadmaps',
  },
];

const JOURNEY = [
  { title: 'Learn', desc: 'Explore curated roadmaps', icon: BookOpen, color: 'bg-violet-600' },
  { title: 'Build', desc: 'Work on real projects and practice', icon: Code2, color: 'bg-emerald-500' },
  { title: 'Compete', desc: 'Join hackathons and challenges', icon: Trophy, color: 'bg-pink-500' },
  { title: 'Get Hired', desc: 'Land internships and full-time roles', icon: Briefcase, color: 'bg-blue-500' },
];

export const LandingPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const instagramUrl = 'https://www.instagram.com/vanshkhandelwal28/';
  const whatsappUrl = 'https://wa.link/9mfubu';
  const contactEmail = 'vanshkhandelwal777@gmail.com';
  const contactPhone = '+91 7898140600';

  return (
    <div id="home" className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-md shadow-violet-200/50 dark:shadow-violet-900/40">
              E
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              EDU<span className="text-violet-600 dark:text-violet-400">ROUTE</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 sm:inline"
            >
              Contact
            </a>
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700"
            >
              Get Started
            </button>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 lg:hidden dark:text-slate-300"
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="block h-0.5 w-5 bg-current" />
              <span className="mt-1.5 block h-0.5 w-5 bg-current" />
              <span className="mt-1.5 block h-0.5 w-5 bg-current" />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden dark:border-slate-800 dark:bg-slate-950">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              Contact Us
            </a>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            className="h-full w-full scale-105 object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={HERO_VIDEO_CDN} type="video/mp4" />
            <source src={HERO_VIDEO_LOCAL} type="video/mp4" />
          </video>
          {/* Light: soft left fade for text; right stays clear so video is visible */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-r
              from-white from-0%
              via-white/75 via-35%
              to-white/15 to-100%
              dark:from-slate-950 dark:from-0%
              dark:via-slate-950/80 dark:via-40%
              dark:to-slate-950/25 dark:to-100%
            "
          />
          <div
            className="
              absolute inset-x-0 bottom-0 h-40
              bg-gradient-to-t from-white/90 to-transparent
              dark:from-slate-950/90 dark:to-transparent
            "
          />
          <div
            className="
              absolute inset-x-0 top-0 h-24
              bg-gradient-to-b from-white/50 to-transparent
              dark:from-slate-950/40 dark:to-transparent
            "
          />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-3.5 py-1.5 text-xs font-bold text-violet-700 shadow-sm backdrop-blur dark:border-violet-500/30 dark:bg-slate-900/70 dark:text-violet-300">
              <span className="text-sm">⚡</span>
              Your Growth Partner in Tech
            </div>

            <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-slate-900 drop-shadow-sm sm:text-5xl lg:text-6xl dark:text-white">
              Build Skills.
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Get Hired.
              </span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-slate-700 dark:text-slate-200">
              EDUROUTE helps you find the right roadmap, get internships and job
              opportunities, participate in hackathons and build the skills you need
              to grow in tech — all in one place.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/roadmaps"
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-violet-200/60 transition hover:bg-violet-700 dark:shadow-violet-900/40"
              >
                <ArrowRight className="h-4 w-4" />
                Explore Roadmaps
              </Link>
              <Link
                to="/internships"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-5 py-3 text-sm font-bold text-slate-800 backdrop-blur transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-violet-500"
              >
                Find Opportunities
              </Link>
            </div>
          </div>

          <div className="hidden min-h-[280px] lg:block" aria-hidden />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-lg shadow-slate-200/40 backdrop-blur-md sm:grid-cols-4 dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-black/30">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-3 px-2 py-2">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-slate-900 dark:text-white">{s.value}</div>
                  <div className="text-[11px] font-medium leading-tight text-slate-500 dark:text-slate-400">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-slate-50/80 py-16 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                — What We Offer
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Everything You Need to Grow
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="text-sm font-semibold text-violet-600 hover:underline dark:text-violet-400"
            >
              Explore All Features →
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Link
                key={f.title}
                to={f.to}
                className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/40"
              >
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${f.iconBg}`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">{f.desc}</p>
                <span className="mt-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-violet-100 group-hover:text-violet-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-violet-950 dark:group-hover:text-violet-300">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                  Your Journey
                </p>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  From Learning to Landing
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Follow a clear path, build real skills, and turn your effort into opportunities.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {JOURNEY.map((step, i) => (
                  <div key={step.title} className="relative text-center">
                    {i < JOURNEY.length - 1 && (
                      <div className="absolute left-[60%] top-5 hidden h-px w-[80%] border-t border-dashed border-slate-300 sm:block dark:border-slate-600" />
                    )}
                    <div
                      className={`relative z-10 mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full text-white shadow-md ${step.color}`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{step.title}</div>
                    <div className="mt-1 text-[11px] leading-4 text-slate-500 dark:text-slate-400">{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 px-6 py-12 text-center text-white shadow-xl shadow-violet-200/40 sm:px-12 dark:shadow-violet-900/30">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Ready to build skills that get you hired?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-violet-100">
            Join thousands of learners using EDUROUTE roadmaps, practice sheets, and AI Buddy to grow faster.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
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

      <section id="contact" className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                Contact Us
              </p>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">We'd love to hear from you</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Questions about roadmaps, partnerships, or feedback? Reach out anytime — we usually reply within a day.
              </p>

              <ul className="mt-6 space-y-3">
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <Mail className="h-4 w-4 text-violet-500" />
                    {contactEmail}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${contactPhone.replace(/\s/g, '')}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <Phone className="h-4 w-4 text-violet-500" />
                    {contactPhone}
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-500" />
                    WhatsApp chat
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                Follow Us
              </p>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Stay in the loop</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Tips, roadmap updates, hackathons, and career stories — follow EDUROUTE on social.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-pink-200 hover:text-pink-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-violet-200 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </div>

              <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-white/60 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-sm font-bold text-slate-900 dark:text-white">Partnerships & campus</p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Running a club or college placement cell? Write to us for campus roadmaps, workshops, and hiring support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-black text-white">
                E
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white">
                EDU<span className="text-violet-600">ROUTE</span>
              </span>
            </div>
            <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">
              Build skills. Get hired. Your growth partner in tech.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-violet-600">Features</a>
            <a href="#contact" className="hover:text-violet-600">Contact</a>
            <Link to="/roadmaps" className="hover:text-violet-600">Roadmaps</Link>
            <Link to="/internships" className="hover:text-violet-600">Internships</Link>
            <button type="button" onClick={() => setIsAuthOpen(true)} className="hover:text-violet-600">
              Sign in
            </button>
          </div>

          <p className="text-xs text-slate-400">© {new Date().getFullYear()} EDUROUTE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
