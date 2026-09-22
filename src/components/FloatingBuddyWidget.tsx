/**
 * Floating Buddy AI — logo FAB + “How can I help you?” text that floats above
 * (visible before and after open). Frontend only; no backend/API changes.
 */
import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Briefcase,
  Compass,
  FileText,
  GraduationCap,
  MessageSquare,
  Send,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import { sendBuddyMessage } from '../services/buddyApi';
import { getAuthUser } from '../utils/rbacAuth';
import { BuddyMarkdown } from './BuddyMarkdown';
import type { BuddyMessage } from '../types/buddy';
import {
  getActiveConversation,
  saveActiveMessages,
} from '../utils/buddyConversations';
import { buildBuddyOnboardingContext } from '../utils/onboardingStore';

type ChatMsg = { id: number; role: 'user' | 'ai'; text: string };
type PanelView = 'home' | 'chat';

function toChatMsg(m: BuddyMessage): ChatMsg {
  return { id: m.id, role: m.role, text: m.text };
}

function toBuddyMsg(m: ChatMsg): BuddyMessage {
  return {
    id: m.id,
    role: m.role,
    text: m.text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

function loadSharedMessages(userId: string): ChatMsg[] {
  try {
    const active = getActiveConversation(userId);
    if (active.messages?.length) return active.messages.map(toChatMsg);
  } catch {
    /* ignore */
  }
  return [];
}

function persistSharedMessages(userId: string, msgs: ChatMsg[]) {
  try {
    saveActiveMessages(userId, msgs.map(toBuddyMsg));
    window.dispatchEvent(new CustomEvent('eduroute:buddy-messages-updated'));
  } catch {
    /* ignore */
  }
}

const POS_KEY = 'eduroute:floating-buddy-pos';

const QUICK = [
  {
    label: 'Find a Career Path',
    sub: 'Explore your options',
    path: '/roadmaps',
    icon: Compass,
    tone: 'bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-300',
  },
  {
    label: 'Check Skill Gaps',
    sub: 'Know what to improve',
    path: '/skill-profile',
    icon: GraduationCap,
    tone: 'bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-300',
  },
  {
    label: 'Suggest Courses',
    sub: 'Personalized learning',
    path: '/browse',
    icon: BookOpen,
    tone: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300',
  },
  {
    label: 'Find Internships',
    sub: 'Get real opportunities',
    path: '/internships',
    icon: Briefcase,
    tone: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  },
  {
    label: 'Hackathons & Events',
    sub: 'Compete and grow',
    path: '/events',
    icon: Trophy,
    tone: 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300',
  },
  {
    label: 'Build My CV',
    sub: 'Stand out to recruiters',
    path: '/cv-builder',
    icon: FileText,
    tone: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300',
  },
] as const;

function loadPos(): { x: number; y: number } | null {
  try {
    const raw = localStorage.getItem(POS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as { x: number; y: number };
    if (typeof p.x === 'number' && typeof p.y === 'number') return p;
  } catch {
    /* ignore */
  }
  return null;
}

function savePos(x: number, y: number) {
  try {
    localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
  } catch {
    /* ignore */
  }
}

/** Custom Buddy AI logo — friendly guide mark (not emoji). */
function BuddyLogo({ size = 40, className = '' }: { size?: number; className?: string }) {
  const uid = `buddy-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${uid}-face`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id={`${uid}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="34" r="22" fill={`url(#${uid}-face)`} />
      <ellipse cx="32" cy="26" rx="18" ry="12" fill={`url(#${uid}-shine)`} />
      <rect x="30" y="6" width="4" height="10" rx="2" fill="#A78BFA" />
      <circle cx="32" cy="6" r="4" fill="#FBBF24" />
      <circle cx="32" cy="6" r="2" fill="#FEF3C7" />
      <circle cx="24" cy="32" r="5" fill="#FFFFFF" />
      <circle cx="40" cy="32" r="5" fill="#FFFFFF" />
      <circle cx="25" cy="33" r="2.5" fill="#1E1B4B" />
      <circle cx="41" cy="33" r="2.5" fill="#1E1B4B" />
      <circle cx="26" cy="32" r="1" fill="#FFFFFF" />
      <circle cx="42" cy="32" r="1" fill="#FFFFFF" />
      <path d="M24 40 Q32 48 40 40" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="18" cy="38" r="3" fill="#F9A8D4" opacity="0.55" />
      <circle cx="46" cy="38" r="3" fill="#F9A8D4" opacity="0.55" />
    </svg>
  );
}

export function FloatingBuddyWidget() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getAuthUser();
  const userId = user?.id || 'demo-student-101';
  const hideOnBuddy = location.pathname.startsWith('/buddy');

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<PanelView>('home');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>(() => loadSharedMessages(userId));
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState('');
  const [hintVisible, setHintVisible] = useState(true);

  const [pos, setPos] = useState(() => loadPos() || { x: 24, y: 24 });
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setMessages(loadSharedMessages(userId));
      setView('home');
      setHintVisible(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, userId]);

  useEffect(() => {
    const onUpdate = () => {
      if (open) setMessages(loadSharedMessages(userId));
    };
    window.addEventListener('eduroute:buddy-messages-updated', onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => {
      window.removeEventListener('eduroute:buddy-messages-updated', onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, [open, userId]);

  useEffect(() => {
    if (scrollRef.current && view === 'chat') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open, view]);

  useEffect(() => {
    if (hideOnBuddy) return;
    setHintVisible(true);
    const t = window.setInterval(() => setHintVisible(true), 10000);
    return () => window.clearInterval(t);
  }, [hideOnBuddy]);

  const clampPos = useCallback((x: number, y: number) => {
    const pad = 8;
    const maxX = Math.max(pad, window.innerWidth - 64 - pad);
    const maxY = Math.max(pad, window.innerHeight - 64 - pad);
    return { x: Math.min(maxX, Math.max(pad, x)), y: Math.min(maxY, Math.max(pad, y)) };
  }, []);

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    dragging.current = true;
    moved.current = false;
    const el = fabRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging.current) return;
    moved.current = true;
    const left = e.clientX - dragOffset.current.x;
    const top = e.clientY - dragOffset.current.y;
    setPos(clampPos(window.innerWidth - left - 56, window.innerHeight - top - 56));
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      fabRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    savePos(pos.x, pos.y);
    if (!moved.current) setOpen((v) => !v);
  };

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    setView('chat');
    setInput('');
    setError('');
    const userMsg: ChatMsg = { id: Date.now(), role: 'user', text: q };
    setMessages((m) => {
      const next = [...m, userMsg];
      persistSharedMessages(userId, next);
      return next;
    });
    setTyping(true);
    try {
      const onboard = buildBuddyOnboardingContext();
      const messageWithContext = onboard.summary
        ? `[Student profile] ${onboard.summary}\n\n${q}`
        : q;
      const res = await sendBuddyMessage({
        userId,
        message: messageWithContext,
        language: 'english',
        context: { missingSkills: onboard.missingSkills },
      });
      const aiMsg: ChatMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: res.reply || 'I could not generate a reply right now.',
      };
      setMessages((m) => {
        const next = [...m, aiMsg];
        persistSharedMessages(userId, next);
        return next;
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Buddy is temporarily unavailable.');
    } finally {
      setTyping(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const onQuick = (item: (typeof QUICK)[number]) => {
    setOpen(false);
    navigate(item.path);
  };

  const fabStyle: CSSProperties = { right: pos.x, bottom: pos.y };
  const panelStyle: CSSProperties = {
    right:
      typeof window !== 'undefined'
        ? Math.min(pos.x, Math.max(8, window.innerWidth - 420))
        : pos.x,
    bottom: pos.y + 72,
  };

  if (hideOnBuddy) return null;

  return (
    <>
      {open && (
        <div
          style={panelStyle}
          className="fixed z-[90] flex w-[min(420px,calc(100vw-16px))] max-h-[min(680px,calc(100vh-96px))] flex-col overflow-hidden rounded-[28px] border border-slate-200/70 bg-[#f4f7ff] shadow-[0_25px_60px_rgba(79,70,229,0.18)] dark:border-slate-700/80 dark:bg-slate-950 dark:shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
          role="dialog"
          aria-label="How can I help you?"
        >
          <div className="pointer-events-none absolute -left-10 top-8 h-32 w-32 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />
          <div className="pointer-events-none absolute -right-8 top-0 h-40 w-40 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-600/15" />

          <div className="relative z-10 flex shrink-0 items-start gap-3 px-4 pb-2 pt-4">
            <div className="relative shrink-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 via-indigo-500/10 to-sky-400/20 shadow-lg shadow-violet-400/30 ring-4 ring-white/80 dark:ring-slate-900/80">
                <BuddyLogo size={52} />
              </div>
              <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                ✓
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-violet-600 dark:text-violet-300">
                Your AI Buddy
              </p>
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-3.5 py-1.5 text-[13px] font-bold text-white shadow-md shadow-violet-400/35">
                How can I help you?
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <p className="mt-1.5 text-[11px] italic text-slate-500 dark:text-slate-400">
                Your goals, my guidance — always ♥
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {view === 'chat' && (
                <button
                  type="button"
                  onClick={() => setView('home')}
                  className="rounded-lg px-2 py-1 text-[10px] font-semibold text-violet-600 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/40"
                >
                  Shortcuts
                </button>
              )}
              {view === 'home' && messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setView('chat')}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <MessageSquare className="h-3 w-3" />
                  Chat
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-white/80 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pb-2">
            {view === 'home' && (
              <div className="rounded-2xl border border-white/70 bg-white/70 p-3 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/70">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {QUICK.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => onQuick(item)}
                      className="group flex items-center gap-2.5 rounded-2xl border border-slate-100/90 bg-white px-3 py-2.5 text-left shadow-sm transition hover:border-violet-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/90 dark:hover:border-violet-500/40"
                    >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.tone}`}>
                        <item.icon className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-bold text-slate-800 dark:text-slate-100">{item.label}</span>
                        <span className="block truncate text-[10px] text-slate-500 dark:text-slate-400">{item.sub}</span>
                      </span>
                      <span className="text-slate-300 group-hover:text-violet-500 dark:text-slate-600">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {view === 'chat' && (
              <>
                {messages.length === 0 && !typing && (
                  <p className="mb-2 text-center text-xs text-slate-500 dark:text-slate-400">Ask anything below to start chatting.</p>
                )}
                {messages.map((m) => (
                  <div key={m.id} className={`mb-2.5 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                        m.role === 'user'
                          ? 'rounded-br-md bg-violet-600 text-white'
                          : 'rounded-bl-md border border-slate-100 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {m.role === 'ai' ? <BuddyMarkdown text={m.text} /> : m.text}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse text-violet-500" />
                    Buddy is thinking…
                  </div>
                )}
                {error && (
                  <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-300">{error}</p>
                )}
              </>
            )}
          </div>

          <form onSubmit={onSubmit} className="relative z-10 shrink-0 border-t border-slate-200/60 bg-white/50 px-3 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-violet-500/50">
              <Sparkles className="ml-1.5 h-4 w-4 shrink-0 text-violet-400" />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything… e.g. suggest a career in tech for me"
                className="min-w-0 flex-1 border-0 bg-transparent py-1.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-700"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-400 dark:text-slate-500">
              Join 50,000+ students building careers with EduRoute
            </p>
          </form>
        </div>
      )}

      {/* Floating label — visible before and after click (above logo only) */}
      {hintVisible && (
        <div
          style={{ right: pos.x - 40, bottom: pos.y + 62 }}
          className="buddy-help-float fixed z-[92] pointer-events-none select-none"
          aria-hidden
        >
          <span className="buddy-help-text-float inline-block whitespace-nowrap rounded-full border border-violet-200/80 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-violet-700 shadow-lg shadow-violet-200/40 backdrop-blur dark:border-violet-500/40 dark:bg-slate-900/95 dark:text-violet-200 dark:shadow-violet-900/40">
            How can I help you?
          </span>
        </div>
      )}

      {/* Logo-only FAB — no “Buddy” text */}
      <button
        ref={fabRef}
        type="button"
        style={fabStyle}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="buddy-fab-pulse fixed z-[91] flex h-14 w-14 touch-none select-none items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-0 text-white shadow-lg shadow-violet-300/50 transition hover:shadow-xl active:cursor-grabbing dark:shadow-violet-900/50 sm:h-12 sm:w-12"
        aria-label="How can I help you? AI assistant"
        title="Drag to move · Click to open"
      >
        <span className="buddy-logo-bob flex h-full w-full items-center justify-center">
          <BuddyLogo size={40} />
        </span>
      </button>

      <style>{`
        @keyframes buddy-help-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes buddy-help-text-flow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes buddy-fab-glow {
          0%, 100% { box-shadow: 0 10px 25px rgba(139, 92, 246, 0.35); }
          50% { box-shadow: 0 12px 32px rgba(99, 102, 241, 0.55); }
        }
        @keyframes buddy-logo-soft {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-3px) scale(1.03); }
        }
        .buddy-help-float { animation: buddy-help-bob 2.4s ease-in-out infinite; }
        .buddy-help-text-float {
          display: inline-block;
          animation: buddy-help-text-flow 2s ease-in-out infinite;
        }
        .buddy-fab-pulse { animation: buddy-fab-glow 2.8s ease-in-out infinite; }
        .buddy-logo-bob { animation: buddy-logo-soft 2.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .buddy-help-float,
          .buddy-help-text-float,
          .buddy-fab-pulse,
          .buddy-logo-bob { animation: none; }
        }
      `}</style>
    </>
  );
}

export default FloatingBuddyWidget;
