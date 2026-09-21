import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Trophy, Crown, TrendingUp, Search, User } from 'lucide-react';
import { getCurrentUser } from '../../utils/userProfile';
import { FeatureDecor } from '../../components/FeatureDecor';

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

/** Soft horizontal mist layers — preserved full-page background */
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
    type MistBand = { y: number; hBand: number; speed: number; phase: number; opacity: number; waveAmp: number; waveFreq: number; offset: number };
    type SoftOrb = { x: number; y: number; rx: number; ry: number; vx: number; phase: number; amp: number; opacity: number };
    let bands: MistBand[] = [];
    let orbs: SoftOrb[] = [];
    const isDark = () => document.documentElement.classList.contains('dark');
    const seed = () => {
      bands = [];
      orbs = [];
      const dark = isDark();
      for (let i = 0; i < 7; i++) {
        const yFrac = 0.12 + (i / 6) * 0.72;
        bands.push({ y: h * yFrac, hBand: h * (0.08 + Math.random() * 0.06), speed: 0.12 + Math.random() * 0.22 + i * 0.015, phase: Math.random() * Math.PI * 2, opacity: (dark ? 0.08 : 0.12) + Math.random() * 0.06, waveAmp: 18 + Math.random() * 28, waveFreq: 0.002 + Math.random() * 0.003, offset: Math.random() * 1000 });
      }
      for (let i = 0; i < 14; i++) {
        orbs.push({ x: Math.random() * w * 1.4 - w * 0.2, y: h * (0.15 + Math.random() * 0.65), rx: 140 + Math.random() * 220, ry: 35 + Math.random() * 55, vx: 0.18 + Math.random() * 0.35, phase: Math.random() * Math.PI * 2, amp: 8 + Math.random() * 16, opacity: (dark ? 0.1 : 0.16) + Math.random() * 0.08 });
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
    const drawBand = (b: MistBand, colorBase: string) => {
      const yBase = b.y + Math.sin(t * 0.00025 + b.phase) * 10;
      ctx.beginPath();
      ctx.moveTo(-40, yBase);
      const steps = 24;
      for (let i = 0; i <= steps; i++) {
        const x = (w * i) / steps;
        const wave = Math.sin(x * b.waveFreq + t * 0.0003 + b.offset) * b.waveAmp + Math.sin(x * b.waveFreq * 1.7 + t * 0.0002 + b.phase) * (b.waveAmp * 0.4);
        ctx.lineTo(x, yBase + wave);
      }
      for (let i = steps; i >= 0; i--) {
        const x = (w * i) / steps;
        const wave = Math.sin(x * b.waveFreq + t * 0.0003 + b.offset) * b.waveAmp + Math.sin(x * b.waveFreq * 1.7 + t * 0.0002 + b.phase) * (b.waveAmp * 0.4);
        ctx.lineTo(x, yBase + wave + b.hBand);
      }
      ctx.closePath();
      const g = ctx.createLinearGradient(0, yBase - 20, 0, yBase + b.hBand + 20);
      g.addColorStop(0, colorBase.replace('ALPHA', '0'));
      g.addColorStop(0.35, colorBase.replace('ALPHA', String(b.opacity)));
      g.addColorStop(0.65, colorBase.replace('ALPHA', String(b.opacity * 0.85)));
      g.addColorStop(1, colorBase.replace('ALPHA', '0'));
      ctx.fillStyle = g;
      ctx.fill();
    };
    const drawOrb = (o: SoftOrb, colorBase: string) => {
      const y = o.y + Math.sin(t * 0.00035 + o.phase) * o.amp;
      const g = ctx.createRadialGradient(o.x, y, 0, o.x, y, o.rx);
      g.addColorStop(0, colorBase.replace('ALPHA', String(o.opacity)));
      g.addColorStop(0.4, colorBase.replace('ALPHA', String(o.opacity * 0.4)));
      g.addColorStop(1, colorBase.replace('ALPHA', '0'));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(o.x, y, o.rx, o.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    };
    const tick = () => {
      t += 16;
      const dark = isDark();
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      if (dark) {
        sky.addColorStop(0, '#070b18');
        sky.addColorStop(0.4, '#0c1428');
        sky.addColorStop(0.75, '#111c35');
        sky.addColorStop(1, '#152440');
      } else {
        sky.addColorStop(0, '#1a6fa8');
        sky.addColorStop(0.35, '#4a9ec8');
        sky.addColorStop(0.7, '#a8d4ec');
        sky.addColorStop(1, '#e8f4fb');
      }
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);
      const mistColor = dark ? 'rgba(180, 200, 230, ALPHA)' : 'rgba(255, 255, 255, ALPHA)';
      try { ctx.filter = 'blur(28px)'; } catch { /* */ }
      for (const b of bands) { b.offset += b.speed * 0.4; drawBand(b, mistColor); }
      for (const o of orbs) { o.x += o.vx; if (o.x - o.rx > w + 50) o.x = -o.rx - 50; drawOrb(o, mistColor); }
      try { ctx.filter = 'none'; } catch { /* */ }
      raf = requestAnimationFrame(tick);
    };
    resize();
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    let lastDark = isDark();
    const mo = new MutationObserver(() => {
      const nowDark = isDark();
      if (nowDark !== lastDark) { lastDark = nowDark; seed(); }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => { cancelAnimationFrame(raf); ro.disconnect(); mo.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />;
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
      <div className="pointer-events-none absolute inset-0 z-0">
        <CloudsBackdrop />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-white/10 via-transparent to-white/20 dark:from-[#070b1a]/20 dark:via-transparent dark:to-[#070b1a]/35" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl p-4 md:p-8">
        <header className="mb-12 flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div className="flex-1">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50/90 px-4 py-1.5 text-sm font-bold text-amber-600 shadow-sm backdrop-blur-sm dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300">
              <Trophy className="h-4 w-4" /> Global Ranking
            </div>
            <h1 className="mb-4 text-4xl font-black text-slate-900 drop-shadow-sm dark:text-white md:text-5xl">Hall of Fame</h1>
            <p className="mx-auto max-w-xl text-slate-600 dark:text-slate-300 md:mx-0">
              Compete with learners across the globe. Higher ranks unlock exclusive internship opportunities and rewards.
            </p>
          </div>
          <FeatureDecor variant="trophy" className="opacity-90" />
        </header>
        <div className="mb-16 flex flex-col items-end justify-center gap-6 px-4 md:flex-row">
          {[TOP_THREE[0], TOP_THREE[1], TOP_THREE[2]].map((person, idx) => {
            const order = idx === 0 ? 'order-2 md:order-1' : idx === 1 ? 'order-1 md:order-2' : 'order-3';
            const isFirst = idx === 1;
            return (
              <motion.div key={person.rank} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className={`group flex w-full flex-col items-center md:w-48 ${isFirst ? 'md:w-56' : ''} ${order}`}>
                {isFirst && <Crown className="mb-2 h-8 w-8 text-amber-400" />}
                <div className="relative mb-4">
                  <img src={person.avatar} className={`rounded-3xl border-4 bg-slate-100 shadow-lg dark:bg-slate-800 ${isFirst ? 'h-24 w-24 border-amber-300 dark:border-amber-500/50' : 'h-20 w-20 border-slate-200 dark:border-slate-700'}`} alt="" />
                  <div className={`absolute -bottom-2 -right-2 flex items-center justify-center rounded-full border-2 border-white font-black text-white dark:border-slate-900 ${isFirst ? 'h-9 w-9 bg-amber-400' : idx === 0 ? 'h-8 w-8 bg-slate-300 dark:bg-slate-600 text-sm' : 'h-8 w-8 bg-orange-400 text-sm'}`}>{person.rank}</div>
                </div>
                <div className={`text-center font-bold text-slate-900 dark:text-white ${isFirst ? 'text-xl font-black' : ''}`}>{person.name}</div>
                <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{person.college}</div>
                <div className={`flex w-full items-center justify-center rounded-t-3xl border-x border-t shadow-sm backdrop-blur-md ${isFirst ? 'h-40 border-amber-200/80 bg-gradient-to-b from-amber-100/90 to-amber-50/90 dark:border-amber-700/40 dark:from-amber-900/50 dark:to-slate-800/80' : 'h-32 border-slate-200/80 bg-white/80 dark:border-slate-700 dark:bg-slate-800/80'}`}>
                  <div className="text-center">
                    <div className={`font-black ${isFirst ? 'text-3xl text-amber-700 dark:text-amber-300' : 'text-2xl text-slate-700 dark:text-slate-200'}`}>{person.points.toLocaleString()}</div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">pts</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="overflow-hidden rounded-[40px] border border-slate-100/80 bg-white/85 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/85">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-50 p-6 dark:border-slate-800 md:flex-row md:items-center">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white"><TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> Movers & Shakers</div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Find a friend..." className="w-full rounded-xl border-none bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 dark:bg-slate-800 dark:text-white md:w-64" />
            </div>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {leaderboardList.map((user) => (
              <div key={user.rank} className="flex items-center justify-between p-6 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/60">
                <div className="flex items-center gap-6">
                  <span className="w-6 text-center font-black text-slate-400">{user.rank}</span>
                  <img src={user.avatar} className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800" alt={user.name} />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
                    <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400"><User className="h-3 w-3" /> {user.college}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-slate-900 dark:text-white">{user.points.toLocaleString()}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Points</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
