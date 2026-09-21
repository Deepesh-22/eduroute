import { useEffect, useRef } from 'react';

/**
 * Cosmic purple–blue particle swirl (inspired by Pexels #29186449).
 * Full-page background; readable with light/dark overlays on the parent.
 */
export function CosmicParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Particle = {
      x: number;
      y: number;
      r: number;
      speed: number;
      angle: number;
      orbit: number;
      hue: number;
    };

    let particles: Particle[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || window.innerWidth;
      const h = parent?.clientHeight || window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(120, Math.floor((w * h) / 12000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 2.4,
        speed: 0.15 + Math.random() * 0.45,
        angle: Math.random() * Math.PI * 2,
        orbit: 20 + Math.random() * 80,
        hue: 220 + Math.random() * 60, // blue → purple
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // Deep space base
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#070b1a');
      g.addColorStop(0.5, '#0f172a');
      g.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Soft nebula blobs
      for (let i = 0; i < 3; i++) {
        const cx = w * (0.25 + 0.25 * i) + Math.sin(t * 0.3 + i) * 40;
        const cy = h * (0.35 + 0.15 * Math.sin(t * 0.2 + i));
        const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.35);
        rg.addColorStop(0, `hsla(${250 + i * 20}, 70%, 45%, 0.12)`);
        rg.addColorStop(1, 'transparent');
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, w, h);
      }

      // Swirling particles
      for (const p of particles) {
        p.angle += p.speed * 0.02;
        const ox = Math.cos(p.angle + t * 0.4) * p.orbit * 0.02;
        const oy = Math.sin(p.angle + t * 0.35) * p.orbit * 0.02;
        p.x += ox * 0.5 + Math.sin(t + p.hue) * 0.15;
        p.y += oy * 0.5 - 0.12;
        if (p.y < -10) p.y = h + 10;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const pulse = 0.5 + 0.5 * Math.sin(t * 2 + p.hue);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 85%, ${55 + pulse * 15}%, ${0.35 + pulse * 0.45})`;
        ctx.arc(p.x, p.y, p.r * (0.8 + pulse * 0.4), 0, Math.PI * 2);
        ctx.fill();

        // glow
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, 0.08)`;
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      t += 0.016;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}

export default CosmicParticleBackground;
