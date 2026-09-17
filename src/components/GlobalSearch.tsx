import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Map,
  ClipboardCheck,
  MessageSquare,
  Trophy,
  Gift,
  Briefcase,
  TrendingUp,
  LayoutDashboard,
  BookOpen,
  Code2,
  User,
  ArrowRight,
} from 'lucide-react';

type SearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  path: string;
  category: string;
  keywords: string;
  icon: typeof Search;
};

const CATALOG: SearchItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    subtitle: 'Your learning home',
    path: '/dashboard',
    category: 'Pages',
    keywords: 'home overview stats',
    icon: LayoutDashboard,
  },
  {
    id: 'roadmaps',
    title: 'Roadmaps',
    subtitle: 'Career learning paths',
    path: '/roadmaps',
    category: 'Pages',
    keywords: 'path frontend backend data science',
    icon: Map,
  },
  {
    id: 'roadmap-frontend',
    title: 'Frontend Developer Roadmap',
    subtitle: 'HTML CSS React',
    path: '/roadmaps/frontend',
    category: 'Roadmaps',
    keywords: 'react javascript web ui',
    icon: Map,
  },
  {
    id: 'assessments',
    title: 'Assessments',
    subtitle: 'Quizzes and skill checks',
    path: '/assessments',
    category: 'Pages',
    keywords: 'quiz test exam practice',
    icon: ClipboardCheck,
  },
  {
    id: 'buddy',
    title: 'AI Buddy',
    subtitle: 'Chat with your mentor',
    path: '/buddy',
    category: 'Pages',
    keywords: 'chat ai help mentor assistant',
    icon: MessageSquare,
  },
  {
    id: 'leaderboard',
    title: 'Leaderboard',
    subtitle: 'Ranks and competition',
    path: '/leaderboard',
    category: 'Pages',
    keywords: 'rank points xp friends',
    icon: Trophy,
  },
  {
    id: 'rewards',
    title: 'Rewards',
    subtitle: 'Redeem points',
    path: '/rewards',
    category: 'Pages',
    keywords: 'points gift redeem',
    icon: Gift,
  },
  {
    id: 'internships',
    title: 'Internships',
    subtitle: 'Open roles and companies',
    path: '/internships',
    category: 'Pages',
    keywords: 'jobs career hire company',
    icon: Briefcase,
  },
  {
    id: 'events',
    title: 'Growth · Events',
    subtitle: 'Summits and workshops',
    path: '/events',
    category: 'Pages',
    keywords: 'event workshop summit growth',
    icon: TrendingUp,
  },
  {
    id: 'soft-skills',
    title: 'Soft Skills',
    subtitle: 'Communication and habits',
    path: '/soft-skills',
    category: 'Pages',
    keywords: 'communication soft skills',
    icon: TrendingUp,
  },
  {
    id: 'dsa',
    title: 'DSA Sheet',
    subtitle: 'Practice problems',
    path: '/dsa-sheet',
    category: 'Pages',
    keywords: 'dsa algorithms arrays leetcode coding',
    icon: Code2,
  },
  {
    id: 'courses',
    title: 'My Courses',
    subtitle: 'Continue learning',
    path: '/courses',
    category: 'Courses',
    keywords: 'course learn study',
    icon: BookOpen,
  },
  {
    id: 'browse',
    title: 'Browse Courses',
    subtitle: 'Catalog',
    path: '/browse',
    category: 'Courses',
    keywords: 'catalog explore courses',
    icon: BookOpen,
  },
  {
    id: 'profile',
    title: 'Profile',
    subtitle: 'Account and progress',
    path: '/profile',
    category: 'Pages',
    keywords: 'account settings identity',
    icon: User,
  },
  {
    id: 'course-web',
    title: 'Web Development Foundations',
    subtitle: 'Beginner · Development',
    path: '/browse',
    category: 'Courses',
    keywords: 'html css javascript web beginner',
    icon: BookOpen,
  },
  {
    id: 'course-react',
    title: 'React Fundamentals',
    subtitle: 'Assessment & practice',
    path: '/assessments',
    category: 'Courses',
    keywords: 'react hooks components',
    icon: BookOpen,
  },
  {
    id: 'topic-dsa-roadmap',
    title: 'DSA Roadmap help',
    subtitle: 'Ask AI Buddy',
    path: '/buddy',
    category: 'Topics',
    keywords: 'dsa roadmap algorithms interview',
    icon: MessageSquare,
  },
  {
    id: 'topic-internship',
    title: 'Internship tips',
    subtitle: 'AI + listings',
    path: '/internships',
    category: 'Topics',
    keywords: 'internship resume apply fresher',
    icon: Briefcase,
  },
];

function scoreItem(item: SearchItem, q: string): number {
  const hay = `${item.title} ${item.subtitle || ''} ${item.keywords} ${item.category}`.toLowerCase();
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return 0;
  let score = 0;
  for (const t of terms) {
    if (item.title.toLowerCase().startsWith(t)) score += 12;
    else if (item.title.toLowerCase().includes(t)) score += 8;
    else if (hay.includes(t)) score += 4;
    else return 0;
  }
  return score;
}

type GlobalSearchProps = {
  className?: string;
  /** compact = header; full = wider */
  variant?: 'header' | 'full';
};

export function GlobalSearch({ className = '', variant = 'header' }: GlobalSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) {
      return CATALOG.slice(0, 8);
    }
    return CATALOG.map((item) => ({ item, score: scoreItem(item, q) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((x) => x.item);
  }, [query]);

  const go = useCallback(
    (item: SearchItem) => {
      setOpen(false);
      setQuery('');
      navigate(item.path);
    },
    [navigate],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      go(results[activeIndex]);
    }
  };

  return (
    <div ref={rootRef} className={`relative ${variant === 'full' ? 'w-full' : 'flex-1 max-w-xl mx-auto'} ${className}`}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)] z-10" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search courses, topics, roadmaps, pages…"
        className="er-input w-full pl-10 pr-16"
        aria-label="Global search"
        aria-expanded={open}
        aria-controls="eduroute-global-search-results"
        autoComplete="off"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-primary)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
        ⌘K
      </kbd>

      {open && (
        <div
          id="eduroute-global-search-results"
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-[min(420px,70vh)] overflow-y-auto rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card,var(--bg-card,#fff))] shadow-xl dark:bg-slate-900"
        >
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-[var(--text-secondary)]">
              No matches for “{query}”
            </div>
          ) : (
            <ul className="py-2">
              {!query.trim() && (
                <li className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Quick links
                </li>
              )}
              {results.map((item, index) => {
                const Icon = item.icon;
                const active = index === activeIndex;
                return (
                  <li key={item.id} role="option" aria-selected={active}>
                    <button
                      type="button"
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        active
                          ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-100'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-[var(--text-primary)]'
                      }`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => go(item)}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          active
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{item.title}</span>
                        <span className="block truncate text-xs text-[var(--text-secondary)]">
                          {item.category}
                          {item.subtitle ? ` · ${item.subtitle}` : ''}
                        </span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="border-t border-[var(--border-default)] px-4 py-2 text-[10px] text-[var(--text-muted)]">
            ↑↓ navigate · Enter open · Esc close · ⌘K focus
          </div>
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;
