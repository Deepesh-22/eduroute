import { useEffect, useRef } from 'react';

type Star = {
  x: number;
  y: number;
  z: number;
  r: number;
  tw: number;
  color: string;
};

const COLORS = [
  'rgba(255,255,255,',
  'rgba(199,210,254,',
  'rgba(196,181,253,',
  'rgba(165,180,252,',
  'rgba(233,213,255,',
];

/** Subtle interactive starfield — canvas, mouse parallax, prefers-reduced-motion */
export function StarfieldBackground({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const reducedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedRef.current = mq.matches;
    const onMq = () => {
      reducedRef.current = mq.matches;
    };
    mq.addEventListener?.('change', onMq);

    let stars: Star[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const makeStars = (count: number) => {
      stars = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        z: 0.25 + Math.random() * 0.75,
        r: 0.4 + Math.random() * 1.6,
        tw: Math.random() * Math.PI * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const resize = () => {
      const parent = canvas.parentElement;
      const rect = parent?.getBoundingClientRect() ?? {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const density = Math.min(180, Math.max(60, Math.floor((w * h) / 9000)));
      makeStars(density);
    };

    const onMove = (e: MouseEvent) => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / Math.max(1, rect.width),
        y: (e.clientY - rect.top) / Math.max(1, rect.height),
      };
    };

    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      mouseRef.current = {
        x: (t.clientX - rect.left) / Math.max(1, rect.width),
        y: (t.clientY - rect.top) / Math.max(1, rect.height),
      };
    };

    let t0 = performance.now();
    const draw = (now: number) => {
      const dt = Math.min(32, now - t0);
      t0 = now;
      const mx = mouseRef.current.x - 0.5;
      const my = mouseRef.current.y - 0.5;
      const reduced = reducedRef.current;

      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        if (!reduced) {
          s.y += (0.00008 + 0.00018 * s.z) * (dt / 16);
          if (s.y > 1.05) s.y = -0.05;
          s.tw += 0.015 * s.z * (dt / 16);
        }

        const parallax = reduced ? 0 : 18 * s.z;
        const px = s.x * w + mx * parallax;
        const py = s.y * h + my * parallax * 0.7;
        const alpha = reduced
          ? 0.35 + s.z * 0.35
          : 0.25 + s.z * 0.45 + Math.sin(s.tw) * 0.15;
        const radius = s.r * (0.6 + s.z * 0.9);

        ctx.beginPath();
        ctx.fillStyle = `${s.color}${Math.max(0.12, Math.min(0.85, alpha)).toFixed(3)})`;
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();

        if (s.z > 0.65 && !reduced) {
          ctx.beginPath();
          ctx.fillStyle = `${s.color}${(alpha * 0.25).toFixed(3)})`;
          ctx.arc(px, py, radius * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      mq.removeEventListener?.('change', onMq);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
    />
  );
}

export default StarfieldBackground;
