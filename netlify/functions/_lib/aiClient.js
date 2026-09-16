const ROADMAP_FALLBACK = 'For roadmaps, structure answers as Beginner / Intermediate / Pro milestones, one practical project, and one weekly challenge.';

const SEARCH_TRIGGER_PATTERNS = [
  /\b(internship|internships|hiring|job|jobs|vacancy|vacancies|placement|placements)\b/i,
  /\b(hackathon|hackathons|event|events|meetup|conference|webinar)\b/i,
  /\b(latest|recent|current|today|this week|this month|202[4-9]|2026|2025)\b/i,
  /\b(salary|stipend|package|ctc|compensation)\b/i,
  /\b(company|companies|startup|startups|faang|product company)\b/i,
  /\b(news|announcement|release|launched|update about)\b/i,
  /\b(how much|what is the fee|deadline|last date|registration)\b/i,
  /\b(recommend|suggest).*(course|tool|platform|resource|internship|event)/i,
  /\b(who is|who's|who was|who are|what is|what's|when is|when was|where is)\b/i,
  /\b(prime minister|president|cm of|chief minister|minister of|governor of)\b/i,
  /\b(capital of|population of|currency of|ceo of|founder of)\b/i,
];

// Prefer models most free/developer accounts can access first
const GROQ_MODEL_CANDIDATES = [
  'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile',
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
];

function env(name) {
  try {
    return (typeof process !== 'undefined' && process.env && process.env[name]) || '';
  } catch {
    return '';
  }
}

function needsWebSearch(userMessage) {
  if (!userMessage || userMessage.trim().length < 5) return false;
  const pureGuidance =
    /^(create|give|make|show|explain|teach|help me with|motivate)\b.*\b(roadmap|plan|skill gap|motivation|resume|portfolio|study plan)\b/i;
  if (pureGuidance.test(userMessage.trim()) && !SEARCH_TRIGGER_PATTERNS.some((p) => p.test(userMessage))) {
    return false;
  }
  return SEARCH_TRIGGER_PATTERNS.some((p) => p.test(userMessage));
}

function localFallbackReply({ messages, language, reason }) {
  const lastMessage = messages[messages.length - 1]?.content || 'learning guidance';
  const intro =
    language === 'hindi'
      ? 'मैं Buddy हूँ। अभी limited mode में हूँ, लेकिन आपकी पूरी help करूंगा।'
      : language === 'hinglish'
        ? 'Main Buddy hoon. Abhi limited mode hai, but main full guidance dunga.'
        : 'I am Buddy in limited mode, but I can still guide you effectively.';
  const hint = reason ? '\n\n(Debug: ' + reason + ')' : '';
  return (
    intro +
    '\n\nBased on: "' +
    lastMessage +
    '"\n\nBeginner → Intermediate → Pro Plan:\n1) Beginner: strengthen fundamentals + 1 mini project.\n2) Intermediate: framework mastery + API integration + portfolio update.\n3) Pro: system design, testing, interview prep, and internship applications.\n\nWeekly challenge: complete one project milestone and one mock interview.' +
    hint
  );
}

async function callGroqOnce({ apiKey, model, messages, temperature }) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: temperature == null ? 0.6 : temperature,
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    const err = new Error('Groq error ' + response.status + ': ' + errText.slice(0, 300));
    err.status = response.status;
    err.body = errText;
    throw err;
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Buddy could not generate a response.';
}

async function callGroq({ apiKey, model, messages, temperature }) {
  if (!apiKey || !String(apiKey).trim()) {
    throw new Error('GROQ_API_KEY is empty at runtime');
  }

  const preferred = (model || env('GROQ_MODEL') || 'llama-3.1-8b-instant').trim();
  const candidates = [];
  if (preferred) candidates.push(preferred);
  GROQ_MODEL_CANDIDATES.forEach(function (m) {
    if (candidates.indexOf(m) === -1) candidates.push(m);
  });

  let lastError = null;
  for (let i = 0; i < candidates.length; i++) {
    const m = candidates[i];
    try {
      return await callGroqOnce({ apiKey: apiKey, model: m, messages: messages, temperature: temperature });
    } catch (e) {
      lastError = e;
      const msg = String(e.message || e);
      const notFound = e.status === 404 || /model_not_found|does not exist|do not have access/i.test(msg);
      if (!notFound) throw e;
      console.warn('Groq model unavailable, trying next:', m, msg.slice(0, 120));
    }
  }
  throw lastError || new Error('All Groq models failed');
}

async function callOpenAI({ apiKey, model, messages, temperature }) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
    body: JSON.stringify({ model: model || 'gpt-4o-mini', messages: messages, temperature: temperature }),
  });
  if (!response.ok) throw new Error('OpenAI error: ' + (await response.text()));
  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Buddy could not generate a response.';
}

async function callGemini({ apiKey, model, messages, temperature }) {
  const prompt = messages.map(function (m) {
    return m.role.toUpperCase() + ': ' + m.content;
  }).join('\n');
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/' +
      (model || 'gemini-1.5-flash') +
      ':generateContent?key=' +
      apiKey,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: temperature } }),
    }
  );
  if (!response.ok) throw new Error('Gemini error: ' + (await response.text()));
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Buddy could not generate a response.';
}

async function searchWithWikipedia(query) {
  const searchUrl =
    'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' +
    encodeURIComponent(query) +
    '&format=json&srlimit=5&origin=*';
  const searchRes = await fetch(searchUrl, {
    headers: { 'User-Agent': 'EduRoute-Buddy/1.0 (education)' },
  });
  if (!searchRes.ok) throw new Error('Wikipedia search error: ' + searchRes.status);
  const searchData = await searchRes.json();
  const hits = searchData?.query?.search || [];
  if (!hits.length) return { answer: '', results: [], provider: 'wikipedia' };

  const topTitle = hits[0].title;
  const sumRes = await fetch(
    'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(topTitle),
    { headers: { 'User-Agent': 'EduRoute-Buddy/1.0 (education)' } }
  );

  let answer = '';
  let pageUrl = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(topTitle.replace(/ /g, '_'));
  if (sumRes.ok) {
    const sum = await sumRes.json();
    answer = sum.extract || '';
    pageUrl = (sum.content_urls && sum.content_urls.desktop && sum.content_urls.desktop.page) || pageUrl;
  }

  const results = hits.slice(0, 5).map(function (h, i) {
    return {
      title: h.title,
      url:
        i === 0
          ? pageUrl
          : 'https://en.wikipedia.org/wiki/' + encodeURIComponent(h.title.replace(/ /g, '_')),
      snippet: String(h.snippet || '').replace(/<[^>]+>/g, ''),
    };
  });
  if (answer && results[0]) results[0].snippet = answer.slice(0, 280);
  return { answer: answer, results: results, provider: 'wikipedia' };
}

function refineSearchQuery(message) {
  const lower = message.toLowerCase().trim();
  if (/prime\s*minister.*india|pm of india|india.*prime\s*minister/i.test(lower)) {
    return 'Narendra Modi Prime Minister of India';
  }
  const stop = {
    tell: 1, me: 1, about: 1, the: 1, a: 1, an: 1, for: 1, my: 1, please: 1, can: 1, you: 1,
    what: 1, is: 1, are: 1, how: 1, to: 1, in: 1, on: 1, of: 1, and: 1, who: 1, was: 1,
  };
  const tokens = message
    .replace(/[?!.,]/g, ' ')
    .split(/\s+/)
    .filter(function (t) {
      return t.length > 1 && !stop[t.toLowerCase()];
    });
  return (tokens.slice(0, 8).join(' ') || message).trim();
}

async function performWebSearchWithFallback(originalQuery) {
  const refined = refineSearchQuery(originalQuery);
  try {
    const data = await searchWithWikipedia(refined);
    if ((data.results && data.results.length) || data.answer) return data;
  } catch (e) {
    console.error('Wikipedia search failed', e.message);
  }
  return { answer: '', results: [], provider: 'none' };
}

function formatSearchContext(searchData) {
  if (!searchData || (!searchData.answer && (!searchData.results || !searchData.results.length))) return '';
  let ctx = '\n\n[LIVE WEB SEARCH RESULTS – provider: ' + searchData.provider + ']\n';
  if (searchData.answer) ctx += 'Summary: ' + searchData.answer + '\n\n';
  searchData.results.slice(0, 5).forEach(function (r, i) {
    ctx += i + 1 + '. ' + r.title + '\n   ' + r.snippet + '\n   Source: ' + r.url + '\n';
  });
  ctx += '\nUse the above live information to answer accurately.\n';
  return ctx;
}

function buildAnswerFromSearch(searchData, language) {
  const summary = (searchData.answer || (searchData.results && searchData.results[0] && searchData.results[0].snippet) || '').trim();
  if (!summary) {
    return 'I could not find reliable live information for that yet.';
  }
  const sources = (searchData.results || [])
    .filter(function (r) {
      return r.url;
    })
    .slice(0, 3)
    .map(function (r, i) {
      return i + 1 + '. ' + r.title + ' — ' + r.url;
    })
    .join('\n');
  return 'Based on live information:\n\n' + summary + (sources ? '\n\nSources:\n' + sources : '');
}

async function generateBuddyReply({ messages, language }) {
  language = language || 'english';
  const provider = (env('AI_PROVIDER') || 'groq').toLowerCase();
  const groqKey = env('GROQ_API_KEY');
  const openaiKey = env('OPENAI_API_KEY');
  const geminiKey = env('GEMINI_API_KEY');
  const temperature = 0.6;

  const languageDirective =
    language === 'hindi'
      ? 'Reply in Hindi only (Devanagari script).'
      : language === 'hinglish'
        ? 'Reply in friendly Hinglish using simple Roman script words.'
        : 'Reply in English only.';

  const lastUserMessage =
    ([].concat(messages).reverse().find(function (m) {
      return m.role === 'user';
    }) || {}).content || '';

  let usedWebSearch = false;
  let sources = [];
  let searchContext = '';
  let searchData = null;

  if (needsWebSearch(lastUserMessage)) {
    try {
      searchData = await performWebSearchWithFallback(lastUserMessage);
      searchContext = formatSearchContext(searchData);
      usedWebSearch = Boolean((searchData.results && searchData.results.length) || searchData.answer);
      sources = (searchData.results || [])
        .filter(function (r) {
          return r.url;
        })
        .slice(0, 5)
        .map(function (r) {
          return { title: r.title, url: r.url };
        });
    } catch (e) {
      console.error('Search step failed', e);
    }
  }

  const systemMessage = {
    role: 'system',
    content:
      "You are Buddy, EDUROUTE's friendly student mentor AI. Help with learning roadmaps, skill-gap analysis, internships, resume tips, motivation, events, factual questions, and general wellness guidance (e.g. study-friendly meal ideas). For diet/health topics, give practical general information only and remind users to consult a doctor or dietitian for personal medical advice. Prefer clear structured answers. " +
      ROADMAP_FALLBACK +
      ' ' +
      languageDirective +
      ' When live search results are present, answer using them first. Keep responses safe and education focused.' +
      searchContext,
  };

  try {
    let reply;
    if ((provider === 'groq' || provider === 'groq-ai') && groqKey) {
      reply = await callGroq({
        apiKey: groqKey,
        model: env('GROQ_MODEL'),
        messages: [systemMessage].concat(messages),
        temperature: temperature,
      });
    } else if (provider === 'gemini' && geminiKey) {
      reply = await callGemini({
        apiKey: geminiKey,
        model: env('GEMINI_MODEL'),
        messages: [systemMessage].concat(messages),
        temperature: temperature,
      });
    } else if (provider === 'openai' && openaiKey) {
      reply = await callOpenAI({
        apiKey: openaiKey,
        model: env('OPENAI_MODEL'),
        messages: [systemMessage].concat(messages),
        temperature: temperature,
      });
    } else if (groqKey) {
      reply = await callGroq({
        apiKey: groqKey,
        model: env('GROQ_MODEL'),
        messages: [systemMessage].concat(messages),
        temperature: temperature,
      });
    } else if (openaiKey) {
      reply = await callOpenAI({
        apiKey: openaiKey,
        model: env('OPENAI_MODEL'),
        messages: [systemMessage].concat(messages),
        temperature: temperature,
      });
    } else if (geminiKey) {
      reply = await callGemini({
        apiKey: geminiKey,
        model: env('GEMINI_MODEL'),
        messages: [systemMessage].concat(messages),
        temperature: temperature,
      });
    } else if (searchData && usedWebSearch) {
      reply = buildAnswerFromSearch(searchData, language);
    } else {
      reply = localFallbackReply({
        messages: messages,
        language: language,
        reason: 'No AI key found (provider=' + provider + ', groqKey=' + (groqKey ? 'set' : 'missing') + ')',
      });
    }
    return { reply: reply, usedWebSearch: usedWebSearch, sources: sources };
  } catch (error) {
    console.error('AI provider failed', error);
    if (searchData && usedWebSearch) {
      return { reply: buildAnswerFromSearch(searchData, language), usedWebSearch: usedWebSearch, sources: sources };
    }
    return {
      reply: localFallbackReply({
        messages: messages,
        language: language,
        reason: error.message || 'AI provider failed',
      }),
      usedWebSearch: usedWebSearch,
      sources: sources,
    };
  }
}

module.exports = {
  generateBuddyReply: generateBuddyReply,
  needsWebSearch: needsWebSearch,
  performWebSearch: searchWithWikipedia,
};
