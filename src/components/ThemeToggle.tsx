import { useCallback, useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

type ThemeToggleProps = {
  className?: string;
  /** When true, toggle is position:fixed and can be dragged; position is persisted */
  movable?: boolean;
};

const POSITION_KEY = 'eduroute-theme-toggle-pos';

type Pos = { x: number; y: number };

function loadPos(): Pos | null {
  try {
    const raw = localStorage.getItem(POSITION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Pos;
    if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

function savePos(pos: Pos) {
  try {
    localStorage.setItem(POSITION_KEY, JSON.stringify(pos));
  } catch {
    /* ignore */
  }
}

function clampPos(x: number, y: number, width: number, height: number): Pos {
  const margin = 8;
  const maxX = Math.max(margin, window.innerWidth - width - margin);
  const maxY = Math.max(margin, window.innerHeight - height - margin);
  return {
    x: Math.min(maxX, Math.max(margin, x)),
    y: Math.min(maxY, Math.max(margin, y)),
  };
}

export const ThemeToggle = ({ className = '', movable = false }: ThemeToggleProps) => {
  const { isDark, toggleTheme } = useTheme();
  const rootRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<Pos | null>(null);
  const dragRef = useRef<{
    active: boolean;
    moved: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  useEffect(() => {
    if (!movable) return;
    const saved = loadPos();
    if (saved) {
      setPos(saved);
      return;
    }
    const w = 80;
    setPos({ x: Math.max(8, window.innerWidth - w - 20), y: 20 });
  }, [movable]);

  useEffect(() => {
    if (!movable) return;
    const onResize = () => {
      setPos((prev) => {
        if (!prev) return prev;
        const el = rootRef.current;
        const w = el?.offsetWidth || 80;
        const h = el?.offsetHeight || 44;
        const next = clampPos(prev.x, prev.y, w, h);
        savePos(next);
        return next;
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [movable]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!movable) return;
      const el = rootRef.current;
      if (!el) return;
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      const rect = el.getBoundingClientRect();
      const current = pos || { x: rect.left, y: rect.top };
      dragRef.current = {
        active: true,
        moved: false,
        startX: e.clientX,
        startY: e.clientY,
        originX: current.x,
        originY: current.y,
      };
      el.setPointerCapture(e.pointerId);
    },
    [movable, pos]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!movable || !drag?.active) return;

      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        drag.moved = true;
      }

      const el = rootRef.current;
      const w = el?.offsetWidth || 80;
      const h = el?.offsetHeight || 44;
      const next = clampPos(drag.originX + dx, drag.originY + dy, w, h);
      setPos(next);
    },
    [movable]
  );

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!movable || !drag) return;

      drag.active = false;
      if (drag.moved && pos) {
        savePos(pos);
      }
      try {
        rootRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    },
    [movable, pos]
  );

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (dragRef.current?.moved) {
        e.preventDefault();
        e.stopPropagation();
        dragRef.current.moved = false;
        return;
      }
      toggleTheme();
    },
    [toggleTheme]
  );

  const style: React.CSSProperties | undefined = movable && pos
    ? {
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        right: 'auto',
        zIndex: 90,
        touchAction: 'none',
        cursor: 'grab',
      }
    : movable
      ? { position: 'fixed', right: 20, top: 20, zIndex: 90, touchAction: 'none', cursor: 'grab' }
      : undefined;

  return (
    <button
      ref={rootRef}
      type="button"
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode${movable ? ' (drag to move)' : ''}`}
      title={movable ? `Switch theme · Drag to move` : `Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`theme-toggle group relative inline-flex h-11 w-20 items-center rounded-full border border-white/20 p-1 ${className}`}
      style={style}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`absolute left-1 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-indigo-600 shadow-lg transition-transform duration-300 ${
          isDark ? 'translate-x-9' : 'translate-x-0'
        }`}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </span>
      <span className="flex w-full items-center justify-between px-1 text-[10px] font-black uppercase tracking-widest text-white/80">
        <Sun className="h-3.5 w-3.5" />
        <Moon className="h-3.5 w-3.5" />
      </span>
    </button>
  );
};
