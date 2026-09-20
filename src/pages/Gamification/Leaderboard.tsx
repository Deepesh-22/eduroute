import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Trophy, Crown, TrendingUp, Search, User } from 'lucide-react';
import { getCurrentUser } from '../../utils/userProfile';

const TOP_THREE = [
  { rank: 2, name: 'Deepesh chauhan', points: 8420, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hero1', college: 'IIT Bombay' },
  { rank: 1, name: 'Vansh Khandelwal', points: 9250, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hero', college: 'BITS Pilani', isUser: true },
  { rank: 3, name: 'Sarthak Sharma', points: 7980, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=super', college: 'NIT Trichy' },
];

const LEADERBOARD_LIST = [
  { rank: 4, name: 'Ajay Sharma', points: 7650, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yash', college: 'DTU' },
  { rank: 5, name: 'Arjun Gupta', points: 7420, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun', college: 'IIT Jodhpur' },
  { rank: 6, name: 'Priya Das', points: 7100, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', college: 'VIT Vellore' },
  { rank: 7, name: 'Kabir Singh', points: 6850, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir', college: 'SRM University' },
  { rank: 8, name: 'Zoya Khan', points: 6420, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoya', college: 'MSU Baroda' },
];

/** Vanta CLOUDS-style foggy layers (soft mist, not hard bubbles) */
function CloudsBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let t = 0;

    // Soft fog puffs: wide, low, low-opacity radial blobs that drift slowly
    type Puff = {
      x: number;
      y: number;
      rx: number; // horizontal radius (wide)
      ry: number; // vertical radius (flat)
      vx: number;
      phase: number;
      amp: number;
      baseOpacity: number;
    };

    let puffs: Puff[] = [];

    const isDark = () => document.documentElement.classList.contains('dark');

    const seed = () => {
      puffs = [];
      // Dense soft layers — more like continuous fog banks than discrete clouds
      const layers = 6;
      for (let layer = 0; layer < layers; layer++) {
        const bandY = (h * (0.15 + layer * 0.14)) % (h * 0.95);
        const count = 4 + Math.floor(layer * 0.6);
        for (let i = 0; i < count; i++) {
          const scale = 0.9 + layer * 0.25 + Math.random() * 0.5;
          puffs.push({
            x: (w * (i + 0.3 + Math.random() * 0.4)) / count,
            y: bandY + (Math.random() - 0.5) * h * 0.08,
            rx: (120 + Math.random() * 160) * scale,
            ry: (40 + Math.random() * 50) * scale * 0.55,
            vx: 0.12 + Math.random() * 0.22 + layer * 0.02,
            phase: Math.random() * Math.PI * 2,
            amp: 6 + Math.random() * 12,
            baseOpacity: (isDark() ? 0.06 : 0.14) + Math.random() * 0.08,
          });
        }
      }
      // Extra large horizon fog bank
      for (let i = 0; i < 3; i++) {
        puffs.push({
          x: w * (0.2 + i * 0.3),
          y: h * (0.72 + Math.random() * 0.12),
          rx: w * (0.35 + Math.random() * 0.2),
          ry: h * 0.12,
          vx: 0.06 + Math.random() * 0.08,
          phase: Math.random() * Math.PI * 2,
          amp: 4,
          baseOpacity: isDark() ? 0.08 : 0.18,
        });
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = Math.max(parent.clientHeight, window.innerHeight * 0.9);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const drawPuff = (p: Puff, color: string) => {
      const y = p.y + Math.sin(t * 0.0004 + p.phase) * p.amp;
      const g = ctx.createRadialGradient(p.x, y, 0, p.x, y, p.rx);
      g.addColorStop(0, color.replace('ALPHA', String(p.baseOpacity)));
      g.addColorStop(0.45, color.replace('ALPHA', String(p.baseOpacity * 0.45)));
      g.addColorStop(1, color.replace('ALPHA', '0'));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(p.x, y, p.rx, p.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = () => {
      t += 16;
      const dark = isDark();

      // Sky — deep blue top → misty lower (matches Vanta CLOUDS feel)
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      if (dark) {
        sky.addColorStop(0, '#060a16');
        sky.addColorStop(0.4, '#0c1528');
        sky.addColorStop(0.75, '#121f38');
        sky.addColorStop(1, '#1a2744');
      } else {
        sky.addColorStop(0, '#0d5f9e');
        sky.addColorStop(0.3, '#2b8bc4');
        sky.addColorStop(0.6, '#8ec8e8');
        sky.addColorStop(1, '#e4f1f9');
      }
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Soft fog color stops (ALPHA placeholder replaced per puff)
      const fogColor = dark
        ? 'rgba(160, 180, 210, ALPHA)'
        : 'rgba(255, 255, 255, ALPHA)';

      // Optional blur for extra softness (supported in modern browsers)
      try {
        ctx.filter = 'blur(18px)';
      } catch {
        /* ignore */
      }

      for (const p of puffs) {
        p.x += p.vx;
        if (p.x - p.rx > w) p.x = -p.rx;
        drawPuff(p, fogColor);
      }

      try {
        ctx.filter = 'none';
      } catch {
        /* ignore */
      }

      // Thin high haze strip for depth
      const haze = ctx.createLinearGradient(0, h * 0.35, 0, h * 0.55);
      if (dark) {
        haze.addColorStop(0, 'rgba(100, 130, 180, 0)');
        haze.addColorStop(0.5, 'rgba(120, 150, 200, 0.06)');
        haze.addColorStop(1, 'rgba(100, 130, 180, 0)');
      } else {
        haze.addColorStop(0, 'rgba(255, 255, 255, 0)');
        haze.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        haze.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = haze;
      ctx.fillRect(0, h * 0.35, w, h * 0.2);

      raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const mo = new MutationObserver(() => {
      /* colors / opacity refreshed on next seed via resize or next frames */
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}

export const Leaderboard = () => {
  const currentUser = getCurrentUser();
  const leaderboardList = LEADERBOARD_LIST.map((entry) =>
    (entry as { isUser?: boolean }).isUser
      ? { ...entry, name: currentUser.name, avatar: currentUser.avatar }
      : entry
  );

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] flex-1 overflow-hidden">
      {/* Full-page Vanta-style clouds */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <CloudsBackdrop />
      </div>
      {/* Soft veil so content stays readable */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-white/25 via-transparent to-white/40 dark:from-[#070b1a]/50 dark:via-transparent dark:to-[#070b1a]/70"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl p-4 md:p-8">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50/90 px-4 py-1.5 text-sm font-bold text-amber-600 shadow-sm backdrop-blur-sm dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300">
            <Trophy className="h-4 w-4" /> Global Ranking
          </div>
          <h1 className="mb-4 text-4xl font-black text-slate-900 drop-shadow-sm dark:text-white md:text-5xl">
            Hall of Fame
          </h1>
          <p className="mx-auto max-w-xl text-slate-600 dark:text-slate-300">
            Compete with learners across the globe. Higher ranks unlock exclusive internship opportunities and rewards.
          </p>
        </header>

        <div className="mb-16 flex flex-col items-end justify-center gap-6 px-4 md:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group order-2 flex w-full flex-col items-center md:order-1 md:w-48"
          >
            <div className="relative mb-4">
              <img
                src={TOP_THREE[0].avatar}
                className="h-20 w-20 rounded-3xl border-4 border-slate-200 bg-slate-100 shadow-lg dark:border-slate-700 dark:bg-slate-800"
                alt=""
              />
              <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-300 text-sm font-black text-white dark:border-slate-900 dark:bg-slate-600">
                2
              </div>
            </div>
            <div className="text-center font-bold text-slate-900 dark:text-white">{TOP_THREE[0].name}</div>
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {TOP_THREE[0].college}
            </div>
            <div className="flex h-32 w-full items-center justify-center rounded-t-3xl border-x border-t border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
              <div className="text-center">
                <div className="text-2xl font-black text-slate-700 dark:text-slate-200">
                  {TOP_THREE[0].points.toLocaleString()}
                </div>
                <div className="text-[10px] font-bold uppercase text-slate-400">pts</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group order-1 flex w-full flex-col items-center md:order-2 md:w-56"
          >
            <Crown className="mb-2 h-8 w-8 text-amber-400" />
            <div className="relative mb-4">
              <img
                src={TOP_THREE[1].avatar}
                className="h-24 w-24 rounded-3xl border-4 border-amber-300 bg-slate-100 shadow-xl dark:border-amber-500/50 dark:bg-slate-800"
                alt=""
              />
              <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-amber-400 font-black text-white dark:border-slate-900">
                1
              </div>
            </div>
            <div className="text-center text-xl font-black text-slate-900 dark:text-white">{TOP_THREE[1].name}</div>
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {TOP_THREE[1].college}
            </div>
            <div className="flex h-40 w-full items-center justify-center rounded-t-3xl border-x border-t border-amber-200/80 bg-gradient-to-b from-amber-100/90 to-amber-50/90 shadow-md backdrop-blur-md dark:border-amber-700/40 dark:from-amber-900/50 dark:to-slate-800/80">
              <div className="text-center">
                <div className="text-3xl font-black text-amber-700 dark:text-amber-300">
                  {TOP_THREE[1].points.toLocaleString()}
                </div>
                <div className="text-[10px] font-bold uppercase text-amber-600/70 dark:text-amber-400/70">pts</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group order-3 flex w-full flex-col items-center md:w-48"
          >
            <div className="relative mb-4">
              <img
                src={TOP_THREE[2].avatar}
                className="h-20 w-20 rounded-3xl border-4 border-orange-200 bg-slate-100 shadow-lg dark:border-orange-700/50 dark:bg-slate-800"
                alt=""
              />
              <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-orange-400 text-sm font-black text-white dark:border-slate-900">
                3
              </div>
            </div>
            <div className="text-center font-bold text-slate-900 dark:text-white">{TOP_THREE[2].name}</div>
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {TOP_THREE[2].college}
            </div>
            <div className="flex h-28 w-full items-center justify-center rounded-t-3xl border-x border-t border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
              <div className="text-center">
                <div className="text-2xl font-black text-slate-700 dark:text-slate-200">
                  {TOP_THREE[2].points.toLocaleString()}
                </div>
                <div className="text-[10px] font-bold uppercase text-slate-400">pts</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="overflow-hidden rounded-[40px] border border-slate-100/80 bg-white/85 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-black/40">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-50 p-6 dark:border-slate-800 md:flex-row md:items-center">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> Movers & Shakers
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Find a friend..."
                className="w-full rounded-xl border-none bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 dark:bg-slate-800 dark:text-white md:w-64"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {leaderboardList.map((user) => (
              <div
                key={user.rank}
                className="flex items-center justify-between p-6 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-6">
                  <span className="w-6 text-center font-black text-slate-400">{user.rank}</span>
                  <img
                    src={user.avatar}
                    className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800"
                    alt={user.name}
                  />
                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">{user.name}</div>
                    <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <User className="h-3 w-3" /> {user.college}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {user.points.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    Points
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
