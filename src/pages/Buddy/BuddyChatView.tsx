import { useEffect, useRef, useState, type FormEvent, type MouseEvent, type PointerEvent, type MutableRefObject, type RefObject } from 'react';
import {
  BookOpen,
  ChevronDown,
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

function LanguagePicker({
  language,
  setLanguage,
}: {
  language: BuddyLanguage;
  setLanguage: (l: BuddyLanguage) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGE_OPTIONS.find((o) => o.value === language) ?? LANGUAGE_OPTIONS[0];

  useEffect(() => {
    const onDoc = (e: Event) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDoc);
    return () => document.removeEventListener('pointerdown', onDoc);
  }, []);

  return (
    <div ref={ref} className="relative z-[200]">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/40 bg-gradient-to-r from-violet-500/15 to-indigo-500/15 px-3 py-1.5 text-xs font-bold text-violet-800 shadow-sm backdrop-blur-md transition hover:border-violet-400/60 hover:from-violet-500/25 hover:to-indigo-500/25 dark:border-violet-400/30 dark:from-violet-500/25 dark:to-indigo-500/25 dark:text-violet-100"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Buddy reply language"
      >
        <Languages className="h-3.5 w-3.5 text-violet-500 dark:text-violet-300" />
        <span>{current.label}</span>
        <span className="rounded-md bg-violet-600/15 px-1.5 py-0.5 text-[10px] font-black tracking-wide text-violet-700 dark:bg-violet-400/20 dark:text-violet-200">
          {current.short}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 opacity-70 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-[210] mt-2 min-w-[11rem] overflow-hidden rounded-2xl border border-violet-200/60 bg-white/95 py-1 shadow-xl shadow-violet-900/10 backdrop-blur-xl dark:border-violet-500/30 dark:bg-[#0c1230]/95 dark:shadow-black/40"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {LANGUAGE_OPTIONS.map((opt) => {
            const active = opt.value === language;
            return (
              <li key={opt.value} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLanguage(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                    active
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                      : 'text-slate-700 hover:bg-violet-50 dark:text-slate-200 dark:hover:bg-violet-500/15'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Languages className="h-3.5 w-3.5 opacity-70" />
                    {opt.label}
                  </span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-black ${
                      active ? 'bg-white/20 text-white' : 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200'
                    }`}
                  >
                    {opt.short}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SafeAiText({ text }: { text: string }) {
  const safe = String(text ?? '').trim() || '…';
  try {
    return (
      <div className="buddy-ai-md text-slate-800 dark:text-slate-100 [&_.buddy-md]:text-inherit [&_p]:!text-inherit [&_li]:!text-inherit [&_strong]:!text-inherit [&_em]:!text-inherit [&_code]:!text-violet-700 dark:[&_code]:!text-violet-200 [&_th]:!text-inherit [&_td]:!text-inherit">
        <BuddyMarkdown text={safe} />
      </div>
    );
  } catch {
    return <span className="whitespace-pre-wrap text-slate-800 dark:text-slate-100">{safe}</span>;
  }
}

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

  const isEmptyChat = messages.length <= 1 && messages.every((m) => m.role === 'ai');

  return (
    <div className="relative flex h-[calc(100vh-5.5rem)] min-h-[520px] w-full gap-0 overflow-x-hidden overflow-y-hidden rounded-2xl border border-violet-200/50 bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/50 text-slate-900 shadow-xl shadow-indigo-100/40 dark:border-indigo-500/25 dark:from-[#070b1a] dark:via-[#0c1230] dark:to-[#12082a] dark:text-slate-100 dark:shadow-indigo-950/40">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-50 dark:opacity-100">
          <StarfieldBackground />
        </div>
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-violet-400/15 blur-[100px] dark:bg-violet-600/20" />
        <div className="absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-indigo-400/10 blur-[110px] dark:bg-indigo-500/15" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 to-transparent dark:from-[#070b1a] dark:via-[#070b1a]/80" />
      </div>

      <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-visible">
        <header className="relative z-30 flex shrink-0 items-center justify-between gap-3 overflow-visible border-b border-violet-200/40 bg-white/60 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30 ring-2 ring-violet-400/30">
              <span className="text-lg" aria-hidden>
                🤖
              </span>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400 dark:border-[#0a0f24]" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white">Buddy AI</h1>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#34d399]" /> Online
                </span>
              </div>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">Your personal study & career companion</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LanguagePicker language={language} setLanguage={setLanguage} />
            <button type="button" onClick={onNewChat} className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-200/60 bg-white/70 text-slate-600 transition hover:bg-violet-50 hover:text-violet-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-violet-500/20 dark:hover:text-white" title="New chat" aria-label="New chat">
              <Plus className="h-4 w-4" />
            </button>
            <button type="button" onClick={toggleSidebar} className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-200/60 bg-white/70 text-slate-600 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden" title="Toggle panel" aria-label="Toggle side panel">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div ref={scrollRef} className="relative min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden px-4 py-5 sm:px-6">
          {isEmptyChat ? (
            <div className="flex min-h-[min(100%,420px)] flex-col items-center justify-center px-2 py-6 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 scale-150 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-500/20" />
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-fuchsia-600 shadow-[0_0_40px_rgba(139,92,246,0.35)] ring-4 ring-violet-400/20 sm:h-32 sm:w-32">
                  <span className="text-5xl sm:text-6xl" aria-hidden>
                    🤖
                  </span>
                </div>
              </div>
              <div className="relative mb-8 max-w-md rounded-2xl border border-violet-300/40 bg-gradient-to-br from-violet-500/15 to-indigo-500/15 px-5 py-4 text-left shadow-lg backdrop-blur-md dark:border-violet-400/30 dark:from-violet-600/40 dark:to-indigo-700/40">
                <p className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">Hi, I'm Buddy! 👋</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-violet-100/90 sm:text-sm">
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
                      className="inline-flex items-center gap-2 rounded-full border border-violet-300/40 bg-white/70 px-3.5 py-2 text-xs font-semibold text-violet-800 shadow-sm backdrop-blur-md transition hover:border-violet-400 hover:bg-violet-50 dark:border-violet-400/30 dark:bg-white/5 dark:text-violet-100 dark:hover:bg-violet-500/20 dark:hover:text-white sm:text-sm"
                    >
                      <Icon className="h-3.5 w-3.5 text-violet-500 dark:text-violet-300" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            messages.map((m) => {
              const text = String(m?.text ?? '');
              return (
                <div key={String(m.id)} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'ai' && (
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm text-white shadow-md shadow-violet-500/30">🤖</div>
                  )}
                  <div className={`max-w-[min(100%,36rem)] ${m.role === 'user' ? 'order-1' : ''}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                        m.role === 'user'
                          ? 'rounded-br-md bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-violet-500/20'
                          : 'rounded-bl-md border border-violet-200/50 bg-white/80 text-slate-800 shadow-slate-200/40 backdrop-blur-md dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:shadow-black/20'
                      }`}
                    >
                      {m.role === 'ai' ? <SafeAiText text={text} /> : <span className="whitespace-pre-wrap">{text}</span>}
                    </div>
                    <div className={`mt-1 flex items-center gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{m.timestamp}</span>
                      {m.role === 'ai' && ttsSupported && text && (
                        <button
                          type="button"
                          onClick={() => toggleSpeakMessage(String(m.id), text)}
                          className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold transition ${
                            speakingId === String(m.id)
                              ? 'bg-violet-500/20 text-violet-700 dark:bg-violet-500/30 dark:text-violet-200'
                              : 'text-slate-400 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-white/10 dark:hover:text-violet-300'
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
              );
            })
          )}

          {isTyping && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm text-white">🤖</div>
              <div className="rounded-2xl border border-violet-200/50 bg-white/80 px-4 py-3 text-sm text-slate-600 backdrop-blur-md dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-violet-500" /> Buddy is thinking…
                </span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="relative z-10 shrink-0 px-4 pb-2 sm:px-6">
            <div className="rounded-xl border border-rose-300/50 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">{error}</div>
          </div>
        )}

        <div className="relative z-10 shrink-0 border-t border-violet-200/40 bg-white/70 px-3 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:px-5">
          {isListening && (
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 dark:text-rose-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
              </span>
              Listening… auto-stops after 4s silence (or 10s if quiet)
            </div>
          )}
          <form onSubmit={onSubmit} className="flex items-center gap-2 rounded-full border border-violet-200/60 bg-white/90 px-2 py-1.5 shadow-inner focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/20 dark:border-white/15 dark:bg-white/5 dark:focus-within:border-violet-400/40">
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
              className="min-w-0 flex-1 border-0 bg-transparent py-2.5 pl-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-60 dark:text-slate-100 dark:placeholder:text-slate-500"
              aria-label="Message Buddy"
            />
            {ttsSupported && (
              <button type="button" onClick={() => setAutoSpeak((v) => !v)} className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${autoSpeak ? 'bg-violet-500/20 text-violet-700 dark:bg-violet-500/30 dark:text-violet-200' : 'text-slate-400 hover:bg-violet-50 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200'}`} title={autoSpeak ? 'Auto-speak on' : 'Auto-speak off'} aria-label="Toggle auto-speak">
                {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
            )}
            {voiceSupported ? (
              <button type="button" onClick={toggleListening} disabled={isTyping} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${isListening ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'text-slate-500 hover:bg-violet-50 hover:text-violet-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-violet-300'}`} title={isListening ? 'Stop listening' : 'Voice input'} aria-label={isListening ? 'Stop listening' : 'Start voice input'}>
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            ) : null}
            <button type="submit" disabled={isTyping || !input.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30 transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div role="separator" aria-orientation="vertical" onPointerDown={onDragStart} onPointerMove={onDragMove} onPointerUp={onDragEnd} onPointerCancel={onDragEnd} className="relative z-20 hidden w-1.5 shrink-0 cursor-col-resize bg-transparent hover:bg-violet-500/30 lg:block" title="Drag to resize" />

      <aside style={{ width: effectiveWidth }} className={`relative z-10 hidden shrink-0 flex-col overflow-hidden border-l border-violet-200/40 bg-white/50 backdrop-blur-xl transition-[width] duration-200 ease-out dark:border-white/10 dark:bg-[#0a0f24]/80 lg:flex ${effectiveWidth === 0 ? 'border-l-0' : ''}`}>
        <div className="flex items-center justify-between border-b border-violet-200/40 px-3 py-3 dark:border-white/10">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Quick & Recent</span>
          <button type="button" onClick={toggleSidebar} className="rounded-lg p-1 text-slate-400 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-white/10 dark:hover:text-violet-300" title="Collapse panel" aria-label="Collapse side panel">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-3">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-300">Quick prompts</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => void handleSend(item.prompt)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/50 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-violet-800 transition hover:border-violet-400 hover:bg-violet-50 dark:border-white/10 dark:bg-white/5 dark:text-violet-100 dark:hover:bg-violet-500/20"
                  >
                    <Icon className="h-3 w-3" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-300">Recent chats</p>
            <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto">
              {conversations.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onSelectChat(c.id)}
                    className={`group flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs transition ${
                      activeChatId === c.id
                        ? 'bg-violet-500/15 font-semibold text-violet-800 dark:bg-violet-500/25 dark:text-violet-100'
                        : 'text-slate-600 hover:bg-violet-50 dark:text-slate-300 dark:hover:bg-white/5'
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" />
                    <span className="min-w-0 flex-1 truncate">{c.title || 'New chat'}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(c.id, e);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          onDeleteChat(c.id);
                        }
                      }}
                      className="rounded p-0.5 opacity-0 transition group-hover:opacity-100 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/20 dark:hover:text-rose-300"
                      title="Delete chat"
                      aria-label="Delete chat"
                    >
                      <Trash2 className="h-3 w-3" />
                    </span>
                  </button>
                </li>
              ))}
              {conversations.length === 0 && (
                <li className="px-2 py-3 text-center text-[11px] text-slate-400">No chats yet</li>
              )}
            </ul>
          </div>
        </div>
      </aside>

      {effectiveWidth === 0 && (
        <button type="button" onClick={toggleSidebar} className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-l-xl border border-r-0 border-violet-200/50 bg-white/90 px-1.5 py-3 text-slate-500 shadow-md backdrop-blur hover:text-violet-600 dark:border-white/10 dark:bg-[#0a0f24]/90 dark:text-slate-400 dark:hover:text-violet-300 lg:flex" title="Show Quick Prompts & Recent Chats" aria-label="Expand side panel">
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
