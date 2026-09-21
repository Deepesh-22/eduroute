import { useEffect, useRef } from 'react';

/** Lightweight certificate scroll illustration (hero / empty state) */
export function CertLottieHero({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} aria-hidden>
      <svg viewBox="0 0 200 160" className="w-full h-full max-w-[200px] drop-shadow-lg">
        <defs>
          <linearGradient id="certGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="certPaper" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
        <g className="origin-center animate-[float_3s_ease-in-out_infinite]">
          <rect x="30" y="28" width="140" height="100" rx="8" fill="url(#certPaper)" stroke="url(#certGold)" strokeWidth="3" />
          <rect x="42" y="40" width="116" height="8" rx="2" fill="#c7d2fe" opacity="0.9" />
          <rect x="55" y="56" width="90" height="5" rx="2" fill="#a5b4fc" opacity="0.7" />
          <rect x="50" y="68" width="100" height="4" rx="2" fill="#cbd5e1" />
          <rect x="60" y="78" width="80" height="4" rx="2" fill="#cbd5e1" />
          <circle cx="100" cy="105" r="12" fill="url(#certGold)" opacity="0.9" />
          <path d="M100 98 l2 6 h6 l-5 4 2 6 -5-4 -5 4 2-6 -5-4 h6 z" fill="#fff" opacity="0.95" />
        </g>
        <circle cx="40" cy="24" r="2" fill="#c084fc" className="animate-pulse" />
        <circle cx="165" cy="36" r="1.5" fill="#818cf8" className="animate-pulse" />
        <circle cx="28" cy="120" r="1.5" fill="#a78bfa" className="animate-pulse" />
      </svg>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

/** Success badge animation (after start / download cert) */
export function CertBadgeSuccess({ className = '', show }: { className?: string; show: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show || !ref.current) return;
    ref.current.classList.remove('scale-0');
    ref.current.classList.add('scale-100');
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={ref}
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4 transition-opacity ${className}`}
      role="dialog"
      aria-label="Certificate success"
    >
      <div className="relative rounded-[28px] border border-violet-200 dark:border-violet-500/40 bg-white dark:bg-slate-900 p-8 shadow-2xl max-w-sm w-full text-center scale-100 transition-transform duration-300">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/40 animate-[badgePop_0.6s_ease-out]">
          <svg viewBox="0 0 64 64" className="h-14 w-14 text-white">
            <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.3" />
            <path
              d="M20 33 l8 8 16-18"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-[drawCheck_0.5s_ease_0.2s_forwards]"
              strokeDasharray="40"
              strokeDashoffset="40"
            />
          </svg>
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">You are on your way!</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Course opened. Complete it on the provider site to earn your official certificate.
        </p>
        <style>{`
          @keyframes badgePop {
            0% { transform: scale(0.5); opacity: 0; }
            60% { transform: scale(1.08); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes drawCheck {
            to { stroke-dashoffset: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default CertLottieHero;
