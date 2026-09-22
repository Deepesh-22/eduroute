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
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import { AuthModal } from '../components/AuthModal';
import { EduRouteLogo } from '../components/EduRouteLogo';
import { ThemeToggle } from '../components/ThemeToggle';

const NAV = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Roadmaps', href: '/roadmaps' },
  { label: 'Internships', href: '/internships' },
  { label: 'Contact', href: '#contact' },
];

export const LandingPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const instagramUrl = 'https://www.instagram.com/vanshkhandelwal28/';
  const whatsappUrl = 'https://wa.link/9mfubu';
  const supportEmail = 'vanshkhandelwal777@gmail.com';

  return (
    <div id="home" className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-2.5">
            <EduRouteLogo size={36} className="shadow-md shadow-violet-200/50 dark:shadow-violet-900/40" />
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
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 sm:inline-flex"
            >
              Log in
            </Link>
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-violet-200/50 transition hover:bg-violet-500 dark:shadow-violet-900/40"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300">
            <Sparkles className="h-3.5 w-3.5" /> AI career platform
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
            Build Skills.
            <span className="block text-violet-600 dark:text-violet-400">Get Hired.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            EDUROUTE helps you find the right roadmap, close skill gaps, practice for interviews, and land
            internships — with AI Buddy by your side.
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
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Explore roadmaps
            </Link>
          </div>
        </section>

        <section id="features" className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Map, title: 'Career roadmaps', body: 'Structured paths for software, data, and security.' },
            { icon: BookOpen, title: 'Practice & assessments', body: 'Close skill gaps with guided practice sheets.' },
            { icon: Briefcase, title: 'Internships', body: 'Match roles to your skills and apply with confidence.' },
            { icon: Code2, title: 'Build portfolio', body: 'Ship projects that recruiters actually care about.' },
            { icon: Trophy, title: 'Compete & grow', body: 'Leaderboards, rewards, and events to stay motivated.' },
            { icon: Users, title: 'AI Buddy', body: 'Personal guidance for learning, gaps, and next steps.' },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{f.body}</p>
            </div>
          ))}
        </section>

        <section id="how-it-works" className="mt-24 text-center">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">How it works</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            Pick a track, find your gaps, follow a path, and apply when you are ready.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { step: '1', title: 'Choose your track', body: 'Software, cybersecurity, or data analyst.' },
              { step: '2', title: 'Close skill gaps', body: 'Yes/No quiz maps what to learn next.' },
              { step: '3', title: 'Get hired', body: 'Internships ranked by skill match.' },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-sm font-black text-white">
                  {s.step}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-black sm:text-3xl">Ready to build your path?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-violet-100">
            Join learners using EDUROUTE roadmaps, practice sheets, and AI Buddy to grow faster.
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
        </section>
      </main>

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
              <p className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-100">
                Learn. Build. Compete. Get Hired.
              </p>
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
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Product</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link to="/roadmaps" className="hover:text-violet-600">
                    Roadmaps
                  </Link>
                </li>
                <li>
                  <Link to="/internships" className="hover:text-violet-600">
                    Internships
                  </Link>
                </li>
                <li>
                  <Link to="/buddy" className="hover:text-violet-600">
                    AI Buddy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a href="#features" className="hover:text-violet-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-violet-600">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-violet-600">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Support</h4>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{supportEmail}</p>
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
