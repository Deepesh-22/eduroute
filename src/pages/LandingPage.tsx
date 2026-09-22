import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Code2,
  Instagram,
  Mail,
  Map,
  MessageCircle,
  Trophy,
  Users,
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

const JOURNEY = [
  { title: 'Learn', desc: 'Explore curated roadmaps', icon: BookOpen, color: 'bg-violet-600' },
  { title: 'Build', desc: 'Work on real projects and practice', icon: Code2, color: 'bg-emerald-500' },
  { title: 'Compete', desc: 'Join hackathons and challenges', icon: Trophy, color: 'bg-pink-500' },
  { title: 'Get Hired', desc: 'Land internships and full-time roles', icon: Briefcase, color: 'bg-blue-500' },
];

const QUICK_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Roadmaps', href: '/roadmaps' },
  { label: 'Jobs & Internships', href: '/internships' },
  { label: 'Hackathons', href: '/events' },
  { label: 'Resources', href: '/browse' },
  { label: 'Community', href: '/community' },
];

const SUPPORT_LINKS = [
  { label: 'Help Center', href: '#contact' },
  { label: 'FAQs', href: '#contact' },
  { label: 'Contact Us', href: '#contact' },
  { label: 'Privacy Policy', href: '#contact' },
  { label: 'Terms of Service', href: '#contact' },
];

export const LandingPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [heroVideoSrc, setHeroVideoSrc] = useState(HERO_VIDEO_CDN);

  const instagramUrl = 'https://www.instagram.com/vanshkhandelwal28/';
  const whatsappUrl = 'https://wa.link/9mfubu';
  const supportEmail = 'vanshkhandelwal777@gmail.com';

  return (
    <div id="home" className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-2.5">
            <EduRouteLogo size={36} className="shadow-md" />
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
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700"
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
              {NAV.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover opacity-40 dark:opacity-30"
            autoPlay
            muted
            loop
            playsInline
            src={heroVideoSrc}
            onError={() => setHeroVideoSrc(HERO_VIDEO_LOCAL)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white dark:from-slate-950/90 dark:via-slate-950/80 dark:to-slate-950" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              Learn · Build · Compete · Get Hired
            </p>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
              Your complete path from{' '}
              <span className="text-violet-600 dark:text-violet-400">learning</span> to{' '}
              <span className="text-violet-600 dark:text-violet-400">career</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              EDUROUTE combines roadmaps, practice, internships, hackathons, and AI guidance so you can build
              real skills and get hired faster.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200/50 transition hover:bg-violet-500 dark:shadow-violet-900/40"
              >
                Start free <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/roadmaps"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-bold text-slate-800 backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
              >
                Explore roadmaps
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-center shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80"
              >
                <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${s.color}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <p className="text-xl font-black text-slate-900 dark:text-white">{s.value}</p>
                <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Your journey on EDUROUTE</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            One platform for every step — from first skill to first job.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {JOURNEY.map((j) => (
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
      </section>

      <OfferStackSection />

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-black sm:text-3xl">Ready to build your path?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-violet-100">
            Join thousands of learners using EDUROUTE roadmaps, practice sheets, and AI Buddy to grow faster.
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
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div>
              <div className="flex items-center gap-2.5">
                <EduRouteLogo size={36} className="shadow-md" />
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  EDU<span className="text-violet-600 dark:text-violet-400">ROUTE</span>
                </span>
              </div>
              <p className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-100">Learn. Build. Compete. Get Hired.</p>
              <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">
                Your one stop platform to build skills, explore opportunities and grow your career in tech.
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
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Newsletter</h4>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Get updates on roadmaps, jobs, and events.</p>
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

          <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
            © {new Date().getFullYear()} EDUROUTE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
