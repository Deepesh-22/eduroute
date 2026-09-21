/**
 * Lightweight decorative animations for page headers (not full-page backgrounds).
 * Works in light + dark mode via theme-aware fills.
 */

type Variant =
  | 'trophy'
  | 'roadmap'
  | 'career'
  | 'code'
  | 'growth'
  | 'quiz'
  | 'document'
  | 'user'
  | 'building'
  | 'book'
  | 'chart'
  | 'welcome'
  | 'soft';

const wrap = (children: JSX.Element, className: string) => (
  <div
    className={`pointer-events-none hidden shrink-0 select-none sm:flex items-center justify-center ${className}`}
    aria-hidden
  >
    {children}
  </div>
);

function TrophyDecor() {
  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28 drop-shadow-md">
      <defs>
        <linearGradient id="fd-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <g className="origin-center animate-[fd-bob_2.8s_ease-in-out_infinite]">
        <path d="M35 28 h50 v8 c0 18-12 32-25 36 v10 h16 v8 H44 v-8 h16 V72 C47 68 35 54 35 36z" fill="url(#fd-gold)" />
        <path d="M35 36 c-10 2-16 12-14 22 2 8 10 12 14 12" fill="none" stroke="#f59e0b" strokeWidth="4" />
        <path d="M85 36 c10 2 16 12 14 22-2 8-10 12-14 12" fill="none" stroke="#f59e0b" strokeWidth="4" />
        <rect x="48" y="96" width="24" height="6" rx="2" fill="#d97706" />
        <rect x="42" y="102" width="36" height="8" rx="3" fill="#b45309" />
      </g>
      <circle cx="28" cy="22" r="2.5" className="fill-amber-400 animate-pulse" />
      <circle cx="96" cy="30" r="2" className="fill-amber-300 animate-pulse" />
    </svg>
  );
}

function RoadmapDecor() {
  return (
    <svg viewBox="0 0 140 100" className="h-24 w-36 drop-shadow-sm">
      <defs>
        <linearGradient id="fd-road" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <path d="M12 70 C40 70 40 30 70 30 S100 70 128 70" fill="none" stroke="url(#fd-road)" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 6" className="animate-[fd-dash_1.2s_linear_infinite]" />
      {[[20, 70], [70, 30], [120, 70]].map(([cx, cy], i) => (
        <g key={i} style={{ animation: `fd-pop 2s ease-in-out ${i * 0.25}s infinite` }}>
          <circle cx={cx} cy={cy} r="10" className="fill-indigo-100 dark:fill-indigo-900/80" stroke="#6366f1" strokeWidth="2.5" />
          <text x={cx} y={cy + 4} textAnchor="middle" className="fill-indigo-700 dark:fill-indigo-200 text-[10px] font-bold">{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}

function CareerDecor() {
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24 drop-shadow-sm">
      <g className="origin-center animate-[fd-bob_3s_ease-in-out_infinite]">
        <rect x="22" y="38" width="56" height="42" rx="6" className="fill-violet-500 dark:fill-violet-400" />
        <rect x="38" y="28" width="24" height="12" rx="3" className="fill-indigo-600 dark:fill-indigo-300" />
        <rect x="44" y="52" width="12" height="8" rx="2" className="fill-white/90" />
      </g>
      <circle cx="78" cy="24" r="3" className="fill-emerald-400 animate-pulse" />
    </svg>
  );
}

function CodeDecor() {
  return (
    <svg viewBox="0 0 120 90" className="h-24 w-32 drop-shadow-sm">
      <rect x="8" y="10" width="104" height="70" rx="10" className="fill-slate-800 dark:fill-slate-700" />
      <rect x="8" y="10" width="104" height="16" rx="10" className="fill-slate-700 dark:fill-slate-600" />
      <circle cx="20" cy="18" r="3" className="fill-rose-400" />
      <circle cx="30" cy="18" r="3" className="fill-amber-400" />
      <circle cx="40" cy="18" r="3" className="fill-emerald-400" />
      <text x="20" y="48" className="fill-emerald-400 text-[11px] font-mono font-bold">{'</>'}</text>
      <rect x="48" y="40" width="48" height="6" rx="2" className="fill-indigo-400/80 animate-pulse" />
      <rect x="48" y="52" width="36" height="6" rx="2" className="fill-violet-400/70" />
      <rect x="48" y="64" width="42" height="6" rx="2" className="fill-cyan-400/60" />
    </svg>
  );
}

function GrowthDecor() {
  return (
    <svg viewBox="0 0 100 110" className="h-28 w-24 drop-shadow-sm">
      <g className="origin-bottom animate-[fd-bob_2.5s_ease-in-out_infinite]">
        <rect x="42" y="70" width="16" height="28" className="fill-indigo-500 dark:fill-indigo-400" />
        <rect x="34" y="52" width="32" height="14" rx="2" className="fill-violet-500 dark:fill-violet-400" />
        <rect x="26" y="34" width="48" height="14" rx="2" className="fill-fuchsia-500 dark:fill-fuchsia-400" />
        <rect x="18" y="16" width="64" height="14" rx="2" className="fill-pink-500 dark:fill-pink-400" />
      </g>
    </svg>
  );
}

function QuizDecor() {
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24 drop-shadow-sm">
      <g className="origin-center animate-[fd-bob_2.6s_ease-in-out_infinite]">
        <rect x="18" y="22" width="64" height="56" rx="8" className="fill-indigo-500 dark:fill-indigo-400" />
        <circle cx="50" cy="42" r="12" className="fill-white/90" />
        <text x="50" y="47" textAnchor="middle" className="fill-indigo-600 text-[14px] font-black">?</text>
        <rect x="32" y="60" width="36" height="6" rx="2" className="fill-white/70" />
      </g>
      <circle cx="82" cy="28" r="3" className="fill-emerald-400 animate-pulse" />
    </svg>
  );
}

function DocumentDecor() {
  return (
    <svg viewBox="0 0 90 110" className="h-28 w-24 drop-shadow-sm">
      <g className="origin-center animate-[fd-bob_3s_ease-in-out_infinite]">
        <path d="M20 12 h40 l14 14 v60 a6 6 0 0 1 -6 6 H20 a6 6 0 0 1 -6 -6 V18 a6 6 0 0 1 6 -6z" className="fill-slate-100 dark:fill-slate-700 stroke-indigo-500" strokeWidth="2.5" />
        <path d="M60 12 v14 h14" fill="none" className="stroke-indigo-500" strokeWidth="2.5" />
        <rect x="26" y="40" width="38" height="5" rx="1.5" className="fill-indigo-400/80" />
        <rect x="26" y="52" width="30" height="5" rx="1.5" className="fill-violet-400/70" />
        <rect x="26" y="64" width="34" height="5" rx="1.5" className="fill-slate-300 dark:fill-slate-500" />
      </g>
    </svg>
  );
}

function UserDecor() {
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24 drop-shadow-sm">
      <g className="origin-center animate-[fd-bob_2.8s_ease-in-out_infinite]">
        <circle cx="50" cy="36" r="16" className="fill-violet-500 dark:fill-violet-400" />
        <path d="M22 82 c0 -18 12 -28 28 -28 s28 10 28 28" className="fill-indigo-500 dark:fill-indigo-400" />
      </g>
      <circle cx="78" cy="24" r="3" className="fill-emerald-400 animate-pulse" />
    </svg>
  );
}

function BuildingDecor() {
  return (
    <svg viewBox="0 0 100 110" className="h-28 w-24 drop-shadow-sm">
      <g className="origin-bottom animate-[fd-bob_3s_ease-in-out_infinite]">
        <rect x="28" y="28" width="44" height="64" rx="4" className="fill-indigo-500 dark:fill-indigo-400" />
        <rect x="36" y="38" width="10" height="10" rx="1" className="fill-white/80" />
        <rect x="54" y="38" width="10" height="10" rx="1" className="fill-white/80" />
        <rect x="36" y="54" width="10" height="10" rx="1" className="fill-white/70" />
        <rect x="54" y="54" width="10" height="10" rx="1" className="fill-white/70" />
        <rect x="44" y="72" width="12" height="20" className="fill-violet-700 dark:fill-violet-300" />
      </g>
    </svg>
  );
}

function BookDecor() {
  return (
    <svg viewBox="0 0 110 90" className="h-24 w-28 drop-shadow-sm">
      <g className="origin-center animate-[fd-bob_2.7s_ease-in-out_infinite]">
        <path d="M12 20 c20 -8 30 -8 44 0 v48 c-14 -8 -24 -8 -44 0z" className="fill-indigo-500 dark:fill-indigo-400" />
        <path d="M98 20 c-20 -8 -30 -8 -44 0 v48 c14 -8 24 -8 44 0z" className="fill-violet-500 dark:fill-violet-400" />
        <line x1="55" y1="20" x2="55" y2="68" className="stroke-white/50" strokeWidth="2" />
      </g>
    </svg>
  );
}

function ChartDecor() {
  return (
    <svg viewBox="0 0 120 100" className="h-24 w-28 drop-shadow-sm">
      <g className="origin-bottom">
        <rect x="18" y="55" width="16" height="30" rx="3" className="fill-indigo-400 animate-[fd-bob_2s_ease-in-out_infinite]" />
        <rect x="42" y="35" width="16" height="50" rx="3" className="fill-violet-500 animate-[fd-bob_2.4s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
        <rect x="66" y="22" width="16" height="63" rx="3" className="fill-fuchsia-500 animate-[fd-bob_2.8s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
        <rect x="90" y="42" width="16" height="43" rx="3" className="fill-pink-500 animate-[fd-bob_2.2s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }} />
      </g>
    </svg>
  );
}

function WelcomeDecor() {
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24 drop-shadow-sm">
      <g className="origin-center animate-[fd-bob_2.5s_ease-in-out_infinite]">
        <circle cx="50" cy="50" r="28" className="fill-indigo-100 dark:fill-indigo-900/60 stroke-indigo-500" strokeWidth="3" />
        <path d="M38 50 l8 8 16 -18" fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle cx="78" cy="26" r="3" className="fill-emerald-400 animate-pulse" />
    </svg>
  );
}

function SoftDecor() {
  return (
    <svg viewBox="0 0 100 80" className="h-20 w-24 drop-shadow-sm opacity-80">
      <g className="animate-[fd-bob_4s_ease-in-out_infinite]">
        <circle cx="30" cy="40" r="18" className="fill-indigo-400/30 dark:fill-indigo-400/20" />
        <circle cx="55" cy="35" r="22" className="fill-violet-400/25 dark:fill-violet-400/15" />
        <circle cx="75" cy="45" r="14" className="fill-fuchsia-400/20 dark:fill-fuchsia-400/15" />
      </g>
    </svg>
  );
}

export function FeatureDecor({ variant, className = '' }: { variant: Variant; className?: string }) {
  const map: Record<Variant, JSX.Element> = {
    trophy: <TrophyDecor />,
    roadmap: <RoadmapDecor />,
    career: <CareerDecor />,
    code: <CodeDecor />,
    growth: <GrowthDecor />,
    quiz: <QuizDecor />,
    document: <DocumentDecor />,
    user: <UserDecor />,
    building: <BuildingDecor />,
    book: <BookDecor />,
    chart: <ChartDecor />,
    welcome: <WelcomeDecor />,
    soft: <SoftDecor />,
  };
  return (
    <>
      {wrap(map[variant], className)}
      <style>{`
        @keyframes fd-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes fd-dash { to { stroke-dashoffset: -28; } }
        @keyframes fd-pop { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
      `}</style>
    </>
  );
}

export default FeatureDecor;
