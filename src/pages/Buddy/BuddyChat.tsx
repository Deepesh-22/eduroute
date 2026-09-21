import { FormEvent, useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent } from 'react';
import { fetchBuddyProgress, sendBuddyMessage } from '../../services/buddyApi';
import type { BuddyLanguage, BuddyMessage, BuddyProgress } from '../../types/buddy';
import { getAuthUser } from '../../utils/rbacAuth';
import {
  type BuddyConversation,
  deleteConversation,
  getActiveConversation,
  listConversations,
  saveActiveMessages,
  startNewConversation,
  switchConversation,
} from '../../utils/buddyConversations';
import { buildBuddyOnboardingContext } from '../../utils/onboardingStore';
import { BuddyChatView } from './BuddyChatView';

const timestamp = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function welcomeMessage(_name: string): BuddyMessage {
  return {
    id: 1,
    role: 'ai',
    text: [
      `Hi, I'm Buddy! 👋`,
      ``,
      `Tell me what you are trying to learn or achieve,`,
      `and I will turn it into a practical next step.`,
    ].join('\n'),
    timestamp: timestamp(),
  };
}

const SIDEBAR_MIN = 0;
const SIDEBAR_MAX = 360;
const SIDEBAR_DEFAULT = 300;
const SIDEBAR_COLLAPSED = 0;

type SpeechRecognitionResultLike = { readonly isFinal: boolean; readonly 0: { transcript: string } };
type SpeechRecognitionEventLike = { readonly results: ArrayLike<SpeechRecognitionResultLike> };
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((ev: Event) => void) | null;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: { error: string }) => void) | null;
  onend: ((ev: Event) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === 'undefined') return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

function isSpeechRecognitionSupported() {
  return Boolean(getSpeechRecognitionCtor());
}

function isSpeechSynthesisSupported() {
  return typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined';
}

function buddyLangToSpeechLang(lang: BuddyLanguage): string {
  if (lang === 'hindi') return 'hi-IN';
  if (lang === 'hinglish') return 'en-IN';
  return 'en-IN';
}

function speakText(text: string, lang: BuddyLanguage) {
  if (!isSpeechSynthesisSupported()) return;
  try {
    window.speechSynthesis.cancel();
    const clean = String(text || '')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/[*_#`>]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1200);
    if (!clean) return;
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = buddyLangToSpeechLang(lang);
    u.rate = 1.02;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}

function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
  }
}

export const BuddyChat = () => {
  const authUser = getAuthUser();
  const currentUserId = authUser?.id || 'demo-student-101';
  const firstName = authUser?.name?.split(' ')[0] || 'there';

  const [conversations, setConversations] = useState<BuddyConversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<BuddyMessage[]>(() => [welcomeMessage(firstName)]);
  const [input, setInput] = useState('');
  const inputLatest = useRef('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<BuddyLanguage>('english');
  const [progress, setProgress] = useState<BuddyProgress | null>(null);
  const [error, setError] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported] = useState(() => isSpeechRecognitionSupported());
  const [ttsSupported] = useState(() => isSpeechSynthesisSupported());
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const autoSendAfterVoice = useRef(false);
  const hadSpeechRef = useRef(false);
  const noSpeechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const networkRetryRef = useRef(0);
  const listeningSessionRef = useRef(0);
  const committedTranscriptRef = useRef('');
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(SIDEBAR_DEFAULT);

  useEffect(() => {
    const active = getActiveConversation(currentUserId);
    setActiveChatId(active.id);
    setMessages(active.messages.length ? active.messages : [welcomeMessage(firstName)]);
    setConversations(listConversations(currentUserId));
    void (async () => {
      try {
        const data = await fetchBuddyProgress(currentUserId);
        setProgress(data.progress);
        setLanguage(data.progress.preferredLanguage || 'english');
      } catch {
        /* offline ok */
      }
    })();
  }, [currentUserId, firstName]);

  useEffect(() => {
    if (!activeChatId) return;
    saveActiveMessages(currentUserId, messages);
    setConversations(listConversations(currentUserId));
  }, [messages, activeChatId, currentUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const refresh = () => {
      const active = getActiveConversation(currentUserId);
      setActiveChatId(active.id);
      setMessages(active.messages.length ? active.messages : [welcomeMessage(firstName)]);
      setConversations(listConversations(currentUserId));
    };
    window.addEventListener('eduroute:buddy-messages-updated', refresh);
    return () => window.removeEventListener('eduroute:buddy-messages-updated', refresh);
  }, [currentUserId, firstName]);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        /* ignore */
      }
      if (noSpeechTimerRef.current) clearTimeout(noSpeechTimerRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      stopSpeaking();
    };
  }, []);

  const onDragStart = (e: ReactPointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onDragMove = useCallback((e: ReactPointerEvent) => {
    if (!dragging.current) return;
    const delta = startX.current - e.clientX;
    const next = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, startWidth.current + delta));
    setSidebarWidth(next);
    setSidebarOpen(next > 40);
  }, []);

  const onDragEnd = (e: ReactPointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
    if (sidebarWidth < 80) {
      setSidebarWidth(SIDEBAR_COLLAPSED);
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (sidebarOpen && sidebarWidth > 40) {
      setSidebarOpen(false);
      setSidebarWidth(SIDEBAR_COLLAPSED);
    } else {
      setSidebarOpen(true);
      setSidebarWidth(SIDEBAR_DEFAULT);
    }
  };

  const clearVoiceTimers = useCallback(() => {
    if (noSpeechTimerRef.current) {
      clearTimeout(noSpeechTimerRef.current);
      noSpeechTimerRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const finishListening = useCallback(
    (opts?: { send?: boolean; reason?: string }) => {
      clearVoiceTimers();
      const shouldSend = opts?.send ?? autoSendAfterVoice.current;
      autoSendAfterVoice.current = false;
      try {
        recognitionRef.current?.stop();
      } catch {
        /* ignore */
      }
      setIsListening(false);
      if (shouldSend) {
        setTimeout(() => {
          const value = (inputLatest.current || inputRef.current?.value || '').trim();
          if (value) {
            const form = inputRef.current?.closest('form');
            if (form) form.requestSubmit();
          } else if (opts?.reason === 'no-speech') {
            setError('No speech detected. Tap the mic and try again.');
          }
        }, 120);
      } else if (opts?.reason === 'no-speech') {
        setError('No speech detected. Tap the mic and try again.');
      }
    },
    [clearVoiceTimers],
  );

  const stopListening = useCallback(() => {
    autoSendAfterVoice.current = false;
    clearVoiceTimers();
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    setIsListening(false);
  }, [clearVoiceTimers]);

  const startListening = useCallback(() => {
    if (isTyping) return;
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setError('Voice input is not supported in this browser. Use Chrome or Edge.');
      return;
    }
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setError('You are offline. Connect to the internet to use voice chat.');
      return;
    }
    stopSpeaking();
    clearVoiceTimers();
    try {
      recognitionRef.current?.abort();
    } catch {
      /* ignore */
    }
    hadSpeechRef.current = false;
    autoSendAfterVoice.current = true;
    networkRetryRef.current = 0;
    committedTranscriptRef.current = '';
    const sessionId = (listeningSessionRef.current += 1);

    const beginRecognition = (attempt: number) => {
      if (listeningSessionRef.current !== sessionId) return;
      if (!autoSendAfterVoice.current) return;
      const recognition = new Ctor();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = buddyLangToSpeechLang(language);
      recognitionRef.current = recognition;

      const armSilenceTimer = () => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          finishListening({ send: true, reason: 'silence' });
        }, 4000);
      };

      recognition.onstart = () => {
        if (listeningSessionRef.current !== sessionId) return;
        setIsListening(true);
        setError('');
        if (!noSpeechTimerRef.current && !hadSpeechRef.current) {
          noSpeechTimerRef.current = setTimeout(() => {
            if (!hadSpeechRef.current) {
              finishListening({ send: false, reason: 'no-speech' });
            }
          }, 10000);
        }
      };

      recognition.onresult = (event) => {
        if (listeningSessionRef.current !== sessionId) return;
        let interim = '';
        let newFinals = '';
        for (let i = 0; i < event.results.length; i += 1) {
          const result = event.results[i];
          const piece = (result[0]?.transcript || '').trim();
          if (!piece) continue;
          if (result.isFinal) newFinals += (newFinals ? ' ' : '') + piece;
          else interim += (interim ? ' ' : '') + piece;
        }
        if (newFinals) {
          const prev = committedTranscriptRef.current.trim();
          if (!prev || !prev.endsWith(newFinals)) {
            committedTranscriptRef.current = prev ? `${prev} ${newFinals}` : newFinals;
          }
        }
        const display = `${committedTranscriptRef.current} ${interim}`.replace(/\s+/g, ' ').trim();
        if (display) {
          hadSpeechRef.current = true;
          networkRetryRef.current = 0;
          if (noSpeechTimerRef.current) {
            clearTimeout(noSpeechTimerRef.current);
            noSpeechTimerRef.current = null;
          }
          inputLatest.current = display;
          setInput(display);
          armSilenceTimer();
        }
      };

      recognition.onerror = (event) => {
        if (listeningSessionRef.current !== sessionId) return;
        const code = event.error || '';
        if (code === 'aborted' || code === 'no-speech') return;
        if (code === 'not-allowed' || code === 'service-not-allowed') {
          clearVoiceTimers();
          setIsListening(false);
          autoSendAfterVoice.current = false;
          setError('Microphone permission denied. Allow mic in the address bar, then try again.');
          return;
        }
        if (code === 'network') {
          if (attempt < 2 && autoSendAfterVoice.current) {
            setError('Voice service reconnecting…');
            setTimeout(() => {
              if (listeningSessionRef.current === sessionId && autoSendAfterVoice.current) {
                try {
                  beginRecognition(attempt + 1);
                } catch {
                  setIsListening(false);
                  autoSendAfterVoice.current = false;
                  setError('Voice service unreachable. Check internet and try Chrome.');
                }
              }
            }, 600);
            return;
          }
          clearVoiceTimers();
          setIsListening(false);
          autoSendAfterVoice.current = false;
          setError('Voice service unreachable (network). Type your message instead.');
          return;
        }
        clearVoiceTimers();
        setIsListening(false);
        autoSendAfterVoice.current = false;
        setError(`Voice error: ${code}. Try typing instead.`);
      };

      recognition.onend = () => {
        if (listeningSessionRef.current !== sessionId) return;
        if (!autoSendAfterVoice.current) {
          setIsListening(false);
          clearVoiceTimers();
          return;
        }
        if (hadSpeechRef.current) {
          if (silenceTimerRef.current) {
            try {
              recognition.start();
              return;
            } catch {
              /* fall through */
            }
          }
          setIsListening(false);
          const shouldSend = autoSendAfterVoice.current;
          autoSendAfterVoice.current = false;
          clearVoiceTimers();
          if (shouldSend) {
            setTimeout(() => {
              const value = (inputLatest.current || '').trim();
              if (value) {
                const form = inputRef.current?.closest('form');
                if (form) form.requestSubmit();
              }
            }, 120);
          }
          return;
        }
        if (noSpeechTimerRef.current) {
          try {
            recognition.start();
            return;
          } catch {
            /* fall through */
          }
        }
        setIsListening(false);
        autoSendAfterVoice.current = false;
        clearVoiceTimers();
      };

      try {
        recognition.start();
      } catch {
        if (attempt < 2) {
          setTimeout(() => beginRecognition(attempt + 1), 400);
          return;
        }
        setError('Could not start microphone. Check permissions.');
        setIsListening(false);
        autoSendAfterVoice.current = false;
      }
    };

    beginRecognition(0);
  }, [isTyping, language, clearVoiceTimers, finishListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      autoSendAfterVoice.current = false;
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const toggleSpeakMessage = useCallback(
    (id: string, text: string) => {
      if (!ttsSupported) {
        setError('Text-to-speech is not supported in this browser.');
        return;
      }
      if (speakingId === id) {
        stopSpeaking();
        setSpeakingId(null);
        return;
      }
      stopSpeaking();
      setSpeakingId(id);
      speakText(text, language);
      const ms = Math.min(60000, Math.max(2500, text.length * 45));
      window.setTimeout(() => {
        setSpeakingId((cur) => (cur === id ? null : cur));
      }, ms);
    },
    [language, speakingId, ttsSupported],
  );

  const handleSend = async (preset?: string) => {
    const text = (preset ?? (inputLatest.current || input)).trim();
    if (!text || isTyping) return;
    stopSpeaking();
    setSpeakingId(null);
    setError('');
    setInput('');
    inputLatest.current = '';
    const userMsg: BuddyMessage = { id: Date.now(), role: 'user', text, timestamp: timestamp() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    try {
      const onboard = buildBuddyOnboardingContext();
      const response = await sendBuddyMessage({
        userId: currentUserId,
        message: text,
        language,
        onboardingContext: onboard || undefined,
      });
      const replyText = String(response?.reply ?? '').trim() || 'I could not generate a reply. Please try again.';
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'ai', text: replyText, timestamp: timestamp() },
      ]);
      if (autoSpeak && replyText) {
        const speakId = String(Date.now() + 1);
        setSpeakingId(speakId);
        speakText(replyText, language);
        window.setTimeout(
          () => setSpeakingId((cur) => (cur === speakId ? null : cur)),
          Math.min(60000, Math.max(2500, replyText.length * 45)),
        );
      }
      setProgress((current) => ({
        points: response.gamification?.points || current?.points || 0,
        level: response.gamification?.level || current?.level || 1,
        achievements: current?.achievements || ['Welcome to Buddy'],
        weeklyChallenges: current?.weeklyChallenges || ['Complete one skill challenge this week'],
        missingSkills: current?.missingSkills || [],
        preferredLanguage: language,
      }));
    } catch (sendError: unknown) {
      setError(sendError instanceof Error ? sendError.message : 'Buddy is temporarily unavailable.');
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void handleSend();
  };

  const onNewChat = () => {
    const conv = startNewConversation(currentUserId);
    setActiveChatId(conv.id);
    setMessages([welcomeMessage(firstName)]);
    setConversations(listConversations(currentUserId));
  };

  const onSelectChat = (id: string) => {
    const conv = switchConversation(currentUserId, id);
    if (!conv) return;
    setActiveChatId(conv.id);
    setMessages(conv.messages.length ? conv.messages : [welcomeMessage(firstName)]);
    setConversations(listConversations(currentUserId));
  };

  const onDeleteChat = (id: string, e?: ReactMouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (!window.confirm('Delete this chat? This cannot be undone.')) return;
    const next = deleteConversation(currentUserId, id);
    setConversations(listConversations(currentUserId));
    setActiveChatId(next.id);
    setMessages(next.messages.length ? next.messages : [welcomeMessage(firstName)]);
  };

  const effectiveWidth = sidebarOpen ? Math.max(sidebarWidth, 200) : 0;

  return (
    <BuddyChatView
      firstName={firstName}
      messages={messages}
      input={input}
      setInput={setInput}
      inputLatest={inputLatest}
      isTyping={isTyping}
      language={language}
      setLanguage={setLanguage}
      error={error}
      isListening={isListening}
      voiceSupported={voiceSupported}
      ttsSupported={ttsSupported}
      autoSpeak={autoSpeak}
      setAutoSpeak={setAutoSpeak}
      speakingId={speakingId}
      scrollRef={scrollRef}
      inputRef={inputRef}
      conversations={conversations}
      activeChatId={activeChatId}
      effectiveWidth={effectiveWidth}
      onSubmit={onSubmit}
      handleSend={handleSend}
      onNewChat={onNewChat}
      onSelectChat={onSelectChat}
      onDeleteChat={onDeleteChat}
      toggleSidebar={toggleSidebar}
      toggleListening={toggleListening}
      toggleSpeakMessage={toggleSpeakMessage}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
    />
  );
};

export default BuddyChat;
