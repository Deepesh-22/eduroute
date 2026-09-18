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

      {/* Hero + rest of page — keep existing body from original by reading full file */}
      <LandingBody isAuthOpen={isAuthOpen} setIsAuthOpen={setIsAuthOpen} />
    </div>
  );
};

function LandingBody({
  isAuthOpen,
  setIsAuthOpen,
}: {
  isAuthOpen: boolean;
  setIsAuthOpen: (v: boolean) => void;
}) {
  // This placeholder will be replaced - we need full original body
  return null;
}

export default LandingPage;
