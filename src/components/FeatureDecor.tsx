/**
 * Lightweight decorative animations for page headers (not full-page backgrounds).
 * Works in light + dark mode via theme-aware fills.
 */

type Variant = 'trophy' | 'roadmap' | 'career' | 'code' | 'growth';

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
        <path
          d="M35 28 h50 v8 c0 18-12 32-25 36 v10 h16 v8 H44 v-8 h16 V72 C47 68 35 54 35 36z"
          fill="url(#fd-gold)"
        />
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
      <path
        d="M12 70 C40 70 40 30 70 30 S100 70 128 70"
        fill="none"
        stroke="url(#fd-road)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="8 6"
        className="animate-[fd-dash_1.2s_linear_infinite]"
      />
      {[
        [20, 70],
        [70, 30],
        [120, 70],
      ].map(([cx, cy], i) => (
        <g key={i} style={{ animation: `fd-pop 2s ease-in-out ${i * 0.25}s infinite` }}>
          <circle cx={cx} cy={cy} r="10" className="fill-indigo-100 dark:fill-indigo-900/80" stroke="#6366f1" strokeWidth="2.5" />
          <text x={cx} y={cy + 4} textAnchor="middle" className="fill-indigo-700 dark:fill-indigo-200 text-[10px] font-bold">
            {i + 1}
          </text>
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
      <text x="20" y="48" className="fill-emerald-400 text-[11px] font-mono font-bold">
        {'</>'}
      </text>
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
      <path
        d="M22 88 L50 12 L78 88"
        fill="none"
        stroke="#a855f7"
        strokeWidth="2"
        strokeDasharray="4 3"
        opacity="0.4"
      />
    </svg>
  );
}

export function FeatureDecor({
  variant,
  className = '',
}: {
  variant: Variant;
  className?: string;
}) {
  const body =
    variant === 'trophy' ? (
      <TrophyDecor />
    ) : variant === 'roadmap' ? (
      <RoadmapDecor />
    ) : variant === 'career' ? (
      <CareerDecor />
    ) : variant === 'code' ? (
      <CodeDecor />
    ) : (
      <GrowthDecor />
    );

  return (
    <>
      {wrap(body, className)}
      <style>{`
        @keyframes fd-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes fd-dash {
          to { stroke-dashoffset: -28; }
        }
        @keyframes fd-pop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
    </>
  );
}

export default FeatureDecor;
