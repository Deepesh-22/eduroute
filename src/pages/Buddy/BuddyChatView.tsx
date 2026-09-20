import type { FormEvent, MouseEvent, PointerEvent, MutableRefObject, RefObject } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Languages,
  MessageSquare,
  Mic,
  MicOff,
  MoreHorizontal,
  Plus,
  Send,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { BuddyMarkdown } from '../../components/BuddyMarkdown';
import { StarfieldBackground } from '../../components/StarfieldBackground';
import type { BuddyLanguage, BuddyMessage } from '../../types/buddy';
import type { BuddyConversation } from '../../utils/buddyConversations';
import { QUICK_PROMPTS, LANGUAGE_OPTIONS } from './buddyConstants';

export type BuddyChatViewProps = {
  firstName: string;
  messages: BuddyMessage[];
  input: string;
  setInput: (v: string) => void;
  inputLatest: MutableRefObject<string>;
  isTyping: boolean;
  language: BuddyLanguage;
  setLanguage: (l: BuddyLanguage) => void;
  error: string;
  isListening: boolean;
  voiceSupported: boolean;
  ttsSupported: boolean;
  autoSpeak: boolean;
  setAutoSpeak: (v: boolean | ((b: boolean) => boolean)) => void;
  speakingId: string | null;
  scrollRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  conversations: BuddyConversation[];
  activeChatId: string | null;
  effectiveWidth: number;
  onSubmit: (e: FormEvent) => void;
  handleSend: (preset?: string) => void | Promise<void>;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string, e?: MouseEvent) => void;
  toggleSidebar: () => void;
  toggleListening: () => void;
  toggleSpeakMessage: (id: string, text: string) => void;
  onDragStart: (e: PointerEvent) => void;
  onDragMove: (e: PointerEvent) => void;
  onDragEnd: (e: PointerEvent) => void;
};

export function BuddyChatView(p: BuddyChatViewProps) {
  const {
    firstName,
    messages,
    input,
    setInput,
    inputLatest,
    isTyping,
    language,
    setLanguage,
    error,
    isListening,
    voiceSupported,
    ttsSupported,
    autoSpeak,
    setAutoSpeak,
    speakingId,
    scrollRef,
    inputRef,
    conversations,
    activeChatId,
    effectiveWidth,
    onSubmit,
    handleSend,
    onNewChat,
    onSelectChat,
    onDeleteChat,
    toggleSidebar,
    toggleListening,
    toggleSpeakMessage,
    onDragStart,
    onDragMove,
    onDragEnd,
  } = p;

  const isEmptyChat = messages.length <= 1 && messages[0]?.role === 'ai';

  return (
    <div className="relative flex h-[calc(100vh-5.5rem)] min-h-[520px] w-full gap-0 overflow-hidden rounded-2xl border border-indigo-500/20 bg-[#070b1a] text-slate-100 shadow-2xl shadow-indigo-950/40">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f24] via-[#0c1230] to-[#12082a]" />
        <StarfieldBackground />
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-indigo-500/15 blur-[110px]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#070b1a] via-[#070b1a]/80 to-transparent" />
        <svg className="absolute bottom-8 left-0 h-28 w-full opacity-40" viewBox="0 0 1200 120" fill="none" preserveAspectRatio="none" aria-hidden>
          <path d="M0 60 C 150 20, 300 100, 450 60 S 750 10, 900 60 S 1100 100, 1200 55" stroke="url(#buddyWave)" strokeWidth="1.5" />
          <path d="M0 80 C 180 40, 320 110, 480 75 S 780 30, 940 70 S 1120 105, 1200 75" stroke="url(#buddyWave2)" strokeWidth="1.2" opacity="0.7" />
          <defs>
            <linearGradient id="buddyWave" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="buddyWave2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
              <stop offset="50%" stopColor="#c084fc" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/40 ring-2 ring-violet-400/30">
              <span className="text-lg" aria-hidden>
                🤖
              </span>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0a0f24] bg-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-bold text-white">Buddy AI</h1>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" /> Online
                </span>
              </div>
              <p className="truncate text-xs text-slate-400">Your personal study &amp; career companion</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 backdrop-blur-sm">
              <Languages className="h-3.5 w-3.5 shrink-0 text-violet-300" aria-hidden />
              <select
                id="buddy-language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as BuddyLanguage)}
                className="max-w-[6.5rem] cursor-pointer appearance-none border-0 bg-transparent py-0.5 pr-4 text-xs font-semibold text-slate-200 outline-none"
                aria-label="Buddy reply language"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" onClick={onNewChat} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-violet-500/20 hover:text-white" title="New chat" aria-label="New chat">
              <Plus className="h-4 w-4" />
            </button>
            <button type="button" onClick={toggleSidebar} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 lg:hidden" title="Toggle panel" aria-label="Toggle side panel">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div ref={scrollRef} className="relative min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
          {isEmptyChat ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center px-2 py-6 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 scale-150 rounded-full bg-violet-500/20 blur-3xl" />
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-fuchsia-600 shadow-[0_0_40px_rgba(139,92,246,0.45)] ring-4 ring-violet-400/20 sm:h-32 sm:w-32">
                  <span className="text-5xl sm:text-6xl" aria-hidden>
                    🤖
                  </span>
                </div>
              </div>
              <div className="relative mb-8 max-w-md rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-600/40 to-indigo-700/40 px-5 py-4 text-left shadow-lg backdrop-blur-md">
                <p className="text-sm font-semibold text-white sm:text-base">Hi, I&apos;m Buddy! 👋</p>
                <p className="mt-1 text-xs leading-relaxed text-violet-100/90 sm:text-sm">
                  Tell me what you are trying to learn or achieve, and I will turn it into a practical next step.
                </p>
              </div>
              <div className="flex max-w-xl flex-wrap items-center justify-center gap-2.5">
                {QUICK_PROMPTS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => void handleSend(item.prompt)}
                      className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-white/5 px-3.5 py-2 text-xs font-semibold text-violet-100 backdrop-blur-md transition hover:border-violet-300/50 hover:bg-violet-500/20 hover:text-white sm:text-sm"
                    >
                      <Icon className="h-3.5 w-3.5 text-violet-300" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'ai' && (
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm text-white shadow-md shadow-violet-500/30">🤖</div>
                )}
                <div className={`max-w-[min(100%,36rem)] ${m.role === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                      m.role === 'user'
                        ? 'rounded-br-md bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-violet-900/30'
                        : 'rounded-bl-md border border-white/10 bg-white/10 text-slate-100 backdrop-blur-md'
                    }`}
                  >
                    {m.role === 'ai' ? <BuddyMarkdown content={m.text} /> : <span className="whitespace-pre-wrap">{m.text}</span>}
                  </div>
                  <div className={`mt-1 flex items-center gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-slate-500">{m.timestamp}</span>
                    {m.role === 'ai' && ttsSupported && (
                      <button
                        type="button"
                        onClick={() => toggleSpeakMessage(String(m.id), m.text)}
                        className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold transition ${
                          speakingId === String(m.id) ? 'bg-violet-500/30 text-violet-200' : 'text-slate-500 hover:bg-white/10 hover:text-violet-300'
                        }`}
                        title="Speak"
                      >
                        {speakingId === String(m.id) ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                        Speak
                      </button>
                    )}
                  </div>
                </div>
                {m.role === 'user' && (
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white shadow-md">
                    {(firstName[0] || 'U').toUpperCase()}
                  </div>
                )}
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm text-white">🤖</div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-300 backdrop-blur-md">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-violet-400" /> Buddy is thinking…
                </span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="relative z-10 px-4 pb-2 sm:px-6">
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300">{error}</div>
          </div>
        )}

        <div className="relative z-10 shrink-0 border-t border-white/10 bg-white/5 px-3 py-3 backdrop-blur-xl sm:px-5">
          {isListening && (
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-rose-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
              </span>
              Listening… auto-stops after 4s silence (or 10s if quiet)
            </div>
          )}
          <form onSubmit={onSubmit} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2 py-1.5 shadow-inner focus-within:border-violet-400/40 focus-within:ring-2 focus-within:ring-violet-500/20">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                inputLatest.current = e.target.value;
                setInput(e.target.value);
              }}
              placeholder="Ask Buddy anything — or tap the mic"
              disabled={isTyping}
              className="min-w-0 flex-1 border-0 bg-transparent py-2.5 pl-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 disabled:opacity-60"
              aria-label="Message Buddy"
            />
            {ttsSupported && (
              <button type="button" onClick={() => setAutoSpeak((v) => !v)} className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${autoSpeak ? 'bg-violet-500/30 text-violet-200' : 'text-slate-400 hover:bg-white/10 hover:text-slate-200'}`} title={autoSpeak ? 'Auto-speak on' : 'Auto-speak off'} aria-label="Toggle auto-speak">
                {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
            )}
            {voiceSupported ? (
              <button type="button" onClick={toggleListening} disabled={isTyping} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${isListening ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40' : 'text-slate-400 hover:bg-white/10 hover:text-violet-300'}`} title={isListening ? 'Stop listening' : 'Start voice input'} aria-label={isListening ? 'Stop listening' : 'Start voice input'}>
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-600" title="Voice not supported">
                <Mic className="h-4 w-4 opacity-40" />
              </span>
            )}
            <button type="submit" disabled={isTyping || !input.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30 transition hover:from-violet-400 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div role="separator" aria-orientation="vertical" onPointerDown={onDragStart} onPointerMove={onDragMove} onPointerUp={onDragEnd} onPointerCancel={onDragEnd} className="relative z-20 hidden w-1.5 shrink-0 cursor-col-resize bg-transparent hover:bg-violet-500/30 lg:block" title="Drag to resize" />

      <aside style={{ width: effectiveWidth }} className={`relative z-10 hidden shrink-0 flex-col overflow-hidden border-l border-white/10 bg-[#0a0f24]/80 backdrop-blur-xl transition-[width] duration-200 ease-out lg:flex ${effectiveWidth === 0 ? 'border-l-0' : ''}`}>
        {effectiveWidth > 0 && (
          <div className="flex h-full min-h-0 flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Panel</span>
              <button type="button" onClick={toggleSidebar} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-slate-200" title="Collapse panel" aria-label="Collapse side panel">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <section className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-lg backdrop-blur-md">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="flex items-center gap-1.5 text-sm font-bold text-white">
                  <Sparkles className="h-4 w-4 text-violet-400" /> Quick Prompts
                </h2>
                <span className="text-[10px] font-semibold text-violet-300/80">Try these</span>
              </div>
              <ul className="space-y-1">
                {QUICK_PROMPTS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <button type="button" onClick={() => void handleSend(item.prompt)} className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-xs font-semibold text-slate-300 transition hover:bg-violet-500/20 hover:text-violet-100">
                        <Icon className="h-3.5 w-3.5 shrink-0 text-violet-400" />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
            <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-white/10 bg-white/5 p-3 shadow-lg backdrop-blur-md">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="flex items-center gap-1.5 text-sm font-bold text-white">
                  <MessageSquare className="h-4 w-4 text-violet-400" /> Recent
                </h2>
                <button type="button" onClick={onNewChat} className="text-[11px] font-semibold text-violet-300 hover:underline">
                  New
                </button>
              </div>
              <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto">
                {conversations.map((c) => {
                  const title = c.title || c.messages.find((m) => m.role === 'user')?.text?.slice(0, 42) || 'New conversation';
                  const active = c.id === activeChatId;
                  return (
                    <li key={c.id} className="group flex items-stretch gap-0.5">
                      <button type="button" onClick={() => onSelectChat(c.id)} className={`flex min-w-0 flex-1 items-start gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition ${active ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-900/40' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
                        <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70" />
                        <span className="line-clamp-2 text-xs font-semibold leading-snug">{title}</span>
                      </button>
                      <button type="button" onClick={(e) => onDeleteChat(c.id, e)} className="mt-1 shrink-0 self-start rounded-lg p-1.5 text-slate-500 opacity-0 transition group-hover:opacity-100 hover:bg-rose-500/20 hover:text-rose-300" title="Delete chat" aria-label="Delete chat">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  );
                })}
                {conversations.length === 0 && (
                  <li>
                    <button type="button" onClick={onNewChat} className="flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2.5 text-xs font-bold text-white shadow-md">
                      <MessageSquare className="h-3.5 w-3.5" /> New chat
                    </button>
                  </li>
                )}
              </ul>
            </section>
          </div>
        )}
      </aside>

      {effectiveWidth === 0 && (
        <button type="button" onClick={toggleSidebar} className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-l-xl border border-r-0 border-white/10 bg-[#0a0f24]/90 px-1.5 py-3 text-slate-400 shadow-md backdrop-blur hover:text-violet-300 lg:flex" title="Show Quick Prompts & Recent Chats" aria-label="Expand side panel">
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
