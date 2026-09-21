import { useEffect, useRef } from 'react';

/**
 * Animated gradient-dots wave background (matches the particle-wave style).
 * Works in light + dark mode via CSS mix-blend / opacity on the parent.
 */
export function GradientDotsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || window.innerWidth;
      const h = parent?.clientHeight || window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const cols = 72;
    const rows = 28;

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      // Deep navy base (matches source clip)
      ctx.fillStyle = '#0a1628';
      ctx.fillRect(0, 0, w, h);

      const gapX = w / (cols - 1);
      const gapY = h / (rows - 1);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gapX;
          const y = j * gapY;
          // Traveling wave with soft secondary ripple
          const wave =
            Math.sin(i * 0.18 + t * 1.4) * 0.55 +
            Math.sin(j * 0.22 - t * 0.9) * 0.35 +
            Math.sin((i + j) * 0.08 + t * 0.6) * 0.25;
          const elev = (wave + 1.2) / 2.2;
          const r = 1.1 + elev * 2.4;
          // Hue shifts along the wave: cyan → green → magenta → gold
          const hue = (200 + elev * 140 + i * 1.2 + t * 18) % 360;
          const light = 45 + elev * 25;
          const alpha = 0.25 + elev * 0.65;
          ctx.beginPath();
          ctx.fillStyle = `hsla(${hue}, 90%, ${light}%, ${alpha})`;
          ctx.arc(x, y + wave * gapY * 0.55, r, 0, Math.PI * 2);
          ctx.fill();
        }
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

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}

export default GradientDotsBackground;
