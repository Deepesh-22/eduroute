import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Bot, BriefcaseBusiness, CalendarRange, Check, Brain, Clipboard, Copy, Languages, MoreHorizontal, Plus, RotateCcw, Send, Sparkles, ThumbsUp, Trash2, Trophy, UserRound } from 'lucide-react';
import { fetchBuddyProgress, saveSkillGap, sendBuddyMessage } from '../../services/buddyApi';
import type { BuddyLanguage, BuddyMessage, BuddyProgress } from '../../types/buddy';
import { getAuthUser } from '../../utils/rbacAuth';
import { BuddyMarkdown } from '../../components/BuddyMarkdown';

const SKILL_CHECK_QUESTIONS = [
  { key: 'html', text: 'Can you build a semantic responsive webpage using HTML/CSS?' },
  { key: 'js', text: 'Are you comfortable with JavaScript fundamentals?' },
  { key: 'react', text: 'Can you create React apps with state and API calls?' },
  { key: 'dsa', text: 'Do you solve DSA problems at least 3 times per week?' },
];

const QUICK_PROMPTS = [
  { label: 'Build my roadmap', prompt: 'Create a Web Developer roadmap for beginner to pro', icon: ArrowUpRight },
  { label: 'Find my skill gaps', prompt: 'What skill gaps should I work on next based on my current progress?', icon: Brain },
  { label: 'Plan my week', prompt: 'Create a focused study plan for this week', icon: CalendarRange },
  { label: 'Improve my portfolio', prompt: 'How should I improve my resume and portfolio?', icon: BriefcaseBusiness },
];

const timestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const initialMessage: BuddyMessage = { id: 1, role: 'ai', text: "Hi, I'm Buddy. Tell me what you are trying to learn or achieve, and I will turn it into a practical next step.", timestamp: timestamp() };

export const BuddyChat = () => {
  const currentUserId = getAuthUser()?.id || 'demo-student-101';
  const [messages, setMessages] = useState<BuddyMessage[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<BuddyLanguage>('english');
  const [progress, setProgress] = useState<BuddyProgress | null>(null);
  const [skillAnswers, setSkillAnswers] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [lastFailedMessage, setLastFailedMessage] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchBuddyProgress(currentUserId);
      setProgress(data.progress);
      setLanguage(data.progress.preferredLanguage || 'english');
      if (data.history?.length) {
        setMessages([initialMessage, ...data.history.map((entry, index) => ({ id: index + 2, role: entry.role === 'assistant' ? 'ai' : 'user', text: entry.text, timestamp: timestamp() } as BuddyMessage))]);
      }
    };
    void load();
  }, [currentUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const missingSkills = useMemo(() => SKILL_CHECK_QUESTIONS.filter((question) => skillAnswers[question.key] === false).map((question) => question.key.toUpperCase()), [skillAnswers]);
  const answeredSkills = Object.keys(skillAnswers).length;
  const skillProgress = Math.round((answeredSkills / SKILL_CHECK_QUESTIONS.length) * 100);

  const handleSend = async (preset?: string) => {
    const text = (preset ?? input).trim();
    if (!text || isTyping) return;
    setMessages((current) => [...current, { id: Date.now(), role: 'user', text, timestamp: timestamp() }]);
    setInput('');
    setError('');
    setLastFailedMessage('');
    setIsTyping(true);
    try {
      const response = await sendBuddyMessage({ userId: currentUserId, message: text, language, context: { level: progress?.level, points: progress?.points, missingSkills: missingSkills.length ? missingSkills : progress?.missingSkills, weeklyChallenge: progress?.weeklyChallenges?.[0] } });
      setMessages((current) => [...current, { id: Date.now() + 1, role: 'ai', text: response.reply, timestamp: timestamp() }]);
      setProgress((current) => ({ points: response.gamification?.points || current?.points || 0, level: response.gamification?.level || current?.level || 1, achievements: current?.achievements || ['Welcome to Buddy'], weeklyChallenges: current?.weeklyChallenges || ['Complete one skill challenge this week'], missingSkills: current?.missingSkills || [], preferredLanguage: language }));
    } catch (sendError: unknown) {
      setLastFailedMessage(text);
      setError(sendError instanceof Error ? sendError.message : 'Buddy is temporarily unavailable.');
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const runSkillGapAnalyzer = async () => {
    if (answeredSkills !== SKILL_CHECK_QUESTIONS.length) return;
    try {
      const saved = await saveSkillGap({ userId: currentUserId, missingSkills });
      setProgress(saved.progress);
      setMessages((current) => [...current, { id: Date.now(), role: 'ai', text: `Skill check complete. Your focus areas are ${missingSkills.length ? missingSkills.join(', ') : 'clear right now'}. I can build a plan around them.`, timestamp: timestamp() }]);
    } catch (analysisError: unknown) {
      setError(analysisError instanceof Error ? analysisError.message : 'Could not save your skill check.');
    }
  };

  const submitMessage = (event: FormEvent) => { event.preventDefault(); void handleSend(); };

  const clearChat = () => {
    setMessages([{ ...initialMessage, id: Date.now(), timestamp: timestamp() }]);
    setInput('');
    setError('');
    setLastFailedMessage('');
    setIsTyping(false);
  };

  const startNewChat = () => {
    clearChat();
  };

  const deleteChat = () => {
    if (messages.length <= 1) return;
    const ok = window.confirm('Delete this chat? All messages in this conversation will be cleared.');
    if (ok) clearChat();
  };

  const copyMessage = async (message: BuddyMessage) => {
    await navigator.clipboard?.writeText(message.text);
    setCopiedMessageId(message.id);
    window.setTimeout(() => setCopiedMessageId(null), 1500);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] flex-1 flex-col overflow-hidden bg-[#f5f7fb]">
      <header className="shrink-0 border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200"><Sparkles className="h-6 w-6" /><span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" /></div>
          <div><div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-black tracking-tight text-slate-950">Buddy AI Mentor</h1><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">AI online</span></div><p className="text-xs font-semibold text-slate-500">Your context-aware study and career copilot</p></div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3"><label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">Language<select value={language} onChange={(event) => setLanguage(event.target.value as BuddyLanguage)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-700"><option value="english">English</option><option value="hindi">Hindi</option><option value="hinglish">Hinglish</option></select></label><button type="button" onClick={deleteChat} disabled={messages.length <= 1} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 className="h-4 w-4" /> Delete chat</button><button type="button" onClick={startNewChat} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-700"><Plus className="h-4 w-4" /> New chat</button></div>
        </div>
      </header>

      <div className="mx-auto grid min-h-0 w-full max-w-[1440px] flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_350px]">
        <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 md:px-8"><div className="mx-auto max-w-4xl space-y-6">
            {messages.length === 1 && <div className="rounded-3xl border border-indigo-100 bg-linear-to-br from-indigo-50 via-white to-white p-5 shadow-sm md:p-7"><div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white"><Sparkles className="h-5 w-5" /></div><div><p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">Personal mentor mode</p><h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">What are you working toward?</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Ask about a roadmap, a project, interviews, internships, or the next skill to unlock. Buddy uses your progress to make the answer practical.</p></div></div></div>}
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group flex items-end gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'ai' && (
                  <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white sm:flex">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[min(720px,88%)] rounded-3xl px-5 py-4 shadow-sm ${
                    message.role === 'user'
                      ? 'rounded-br-md bg-indigo-600 text-white'
                      : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-5 text-[10px] font-black uppercase tracking-widest opacity-60">
                    <div className="flex items-center gap-2">
                      <span>{message.role === 'user' ? 'You' : 'Buddy AI'}</span>
                      <span>•</span>
                      <span>{message.timestamp}</span>
                    </div>
                    {message.role === 'ai' && (
                      <button
                        type="button"
                        onClick={() => void copyMessage(message)}
                        aria-label="Copy Buddy response"
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  {message.role === 'ai' ? (
                    <BuddyMarkdown text={message.text} />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-7">{message.text}</p>
                  )}
                  {message.role === 'ai' && (
                    <div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-3 text-[11px] font-bold text-slate-400">
                      <button
                        type="button"
                        onClick={() => void copyMessage(message)}
                        className="inline-flex items-center gap-1 hover:text-indigo-600"
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Clipboard className="h-3.5 w-3.5" />
                        )}
                        {copiedMessageId === message.id ? 'Copied' : 'Copy'}
                      </button>
                      <button type="button" aria-label="Like response" className="hover:text-indigo-600">
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" aria-label="More response actions" className="hover:text-indigo-600">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 sm:flex">
                    <UserRound className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ))}
            {isTyping && <div className="flex items-center gap-3 text-sm font-semibold text-slate-500"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white"><Bot className="h-4 w-4" /></div><span className="rounded-2xl bg-white px-4 py-3 shadow-sm">Buddy is thinking<span className="ml-1 animate-pulse">...</span></span></div>}
            {error && <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span>{lastFailedMessage && <button type="button" onClick={() => void handleSend(lastFailedMessage)} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-red-100 px-3 py-2 font-bold text-red-800"><RotateCcw className="h-3.5 w-3.5" /> Retry</button>}</div>}
          </div></div>
          <form onSubmit={submitMessage} className="sticky bottom-0 z-20 shrink-0 border-t border-slate-200 bg-white/95 p-4 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-6"><div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-inner focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10"><div className="flex items-end gap-3"><textarea ref={inputRef} rows={1} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void handleSend(); } }} placeholder="Ask Buddy anything about your learning journey..." className="max-h-32 min-h-12 flex-1 resize-none border-0 bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400" /><button type="submit" disabled={!input.trim() || isTyping} aria-label="Send message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-4 w-4" /></button></div><p className="mt-2 px-3 text-[11px] text-slate-400">Enter to send · Shift + Enter for a new line</p></div></form>
        </main>

        <aside className="min-h-0 overflow-y-auto border-t border-slate-200 bg-white/80 p-4 md:p-6 lg:border-l lg:border-t-0">
          <div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Your cockpit</p><h2 className="mt-1 text-lg font-black tracking-tight text-slate-950">Progress & prompts</h2></div><span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Synced</span></div><div className="grid grid-cols-2 gap-3"><InfoCard icon={Trophy} title="Level" value={`Lv. ${progress?.level || 1}`} /><InfoCard icon={Sparkles} title="Points" value={`${progress?.points || 0} XP`} /></div>
          <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-sm font-black text-slate-900"><Brain className="h-4 w-4 text-indigo-600" /> Skill check</h2><span className="text-xs font-bold text-indigo-600">{answeredSkills}/{SKILL_CHECK_QUESTIONS.length}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${skillProgress}%` }} /></div><div className="mt-3 space-y-2">{SKILL_CHECK_QUESTIONS.map((question) => <div key={question.key} className="rounded-xl border border-slate-100 px-3 py-3"><p className="text-xs font-semibold leading-5 text-slate-700">{question.text}</p><div className="mt-2 flex gap-2"><button type="button" onClick={() => setSkillAnswers((current) => ({ ...current, [question.key]: true }))} className={`flex-1 px-2 py-1.5 text-xs ${skillAnswers[question.key] === true ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{skillAnswers[question.key] === true && <Check className="mr-1 inline h-3 w-3" />}Yes</button><button type="button" onClick={() => setSkillAnswers((current) => ({ ...current, [question.key]: false }))} className={`flex-1 px-2 py-1.5 text-xs ${skillAnswers[question.key] === false ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>No</button></div></div>)}</div><button type="button" onClick={() => void runSkillGapAnalyzer()} disabled={answeredSkills !== SKILL_CHECK_QUESTIONS.length} className="mt-3 w-full bg-slate-950 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Analyze my gap</button></section>
          <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="flex items-center gap-2 text-sm font-black text-slate-900"><Languages className="h-4 w-4 text-indigo-600" /> Start with a prompt</h2><div className="mt-3 grid gap-2">{QUICK_PROMPTS.map(({ label, prompt, icon: PromptIcon }) => <button type="button" key={prompt} onClick={() => void handleSend(prompt)} className="group flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-left text-xs font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"><span className="flex items-center gap-2"><PromptIcon className="h-4 w-4 text-indigo-500" />{label}</span><ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" /></button>)}</div></section>
          <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-white"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300"><CalendarRange className="h-4 w-4" /> This week</div><p className="mt-2 text-sm font-bold">{progress?.weeklyChallenges?.[0] || 'Start your first challenge'}</p></div>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500"><BriefcaseBusiness className="h-4 w-4" /> Focus: {progress?.missingSkills?.[0] || 'Build your next skill'}</div>
        </aside>
      </div>
    </div>
  );
};

const InfoCard = ({ icon: Icon, title, value }: { icon: typeof Trophy; title: string; value: string }) => <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400"><Icon className="h-4 w-4 text-indigo-600" /> {title}</div><div className="mt-2 text-sm font-black text-slate-900">{value}</div></div>;
