const ROADMAP_FALLBACK = `For roadmaps, structure answers as:\n1) Beginner (3-4 milestones)\n2) Intermediate (3-4 milestones)\n3) Pro (3-4 milestones)\nInclude skills, one practical project, and one weekly challenge.`;

const SEARCH_TRIGGER_PATTERNS = [
  /\b(internship|internships|hiring|job|jobs|vacancy|vacancies|placement|placements)\b/i,
  /\b(hackathon|hackathons|event|events|meetup|conference|webinar)\b/i,
  /\b(latest|recent|current|today|this week|this month|202[4-9]|2026|2025)\b/i,
  /\b(salary|stipend|package|ctc|compensation)\b/i,
  /\b(company|companies|startup|startups|faang|product company)\b/i,
  /\b(news|announcement|release|launched|update about)\b/i,
  /\b(how much|what is the fee|deadline|last date|registration)\b/i,
  /\b(recommend|suggest).*(course|tool|platform|resource|internship|event)/i,
];

function needsWebSearch(userMessage = '') {
  if (!userMessage || userMessage.length < 8) return false;
  const pureGuidance = /^(create|give|make|show|explain|teach|help me with).*(roadmap|plan|skill gap|motivation|resume|portfolio)/i;
  if (pureGuidance.test(userMessage) && !SEARCH_TRIGGER_PATTERNS.some((p) => p.test(userMessage))) {
    return false;
  }
  return SEARCH_TRIGGER_PATTERNS.some((p) => p.test(userMessage));
}

function localFallbackReply({ messages, language }) {
  const lastMessage = messages[messages.length - 1]?.content || 'learning guidance';
  const intro =
    language === 'hindi'
      ? 'मैं Buddy हूँ। अभी limited mode में हूँ, लेकिन आपकी पूरी help करूंगा।'
      : language === 'hinglish'
        ? 'Main Buddy hoon. Abhi limited mode hai, but main full guidance dunga.'
        : 'I am Buddy in limited mode, but I can still guide you effectively.';

  return `${intro}\n\nBased on: "${lastMessage}"\n\nBeginner → Intermediate → Pro Plan:\n1) Beginner: strengthen fundamentals + 1 mini project.\n2) Intermediate: framework mastery + API integration + portfolio update.\n3) Pro: system design, testing, interview prep, and internship applications.\n\nWeekly challenge: complete one project milestone and one mock interview.`;
}

async function callOpenAI({ apiKey, model, messages, temperature }) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages,
      temperature,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Buddy could not generate a response.';
}

async function callGemini({ apiKey, model, messages, temperature }) {
  const prompt = messages.map((message) => `${message.role.toUpperCase()}: ${message.content}`).join('\n');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini error: ${errorText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Buddy could not generate a response.';
}

async function searchWithTavily(query, apiKey) {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: 'basic',
      include_answer: true,
      max_results: 5,
    }),
  });
  if (!response.ok) throw new Error(`Tavily error: ${await response.text()}`);
  const data = await response.json();
  const results = (data.results || []).map((r) => ({
    title: r.title,
    url: r.url,
    snippet: r.content || r.snippet || '',
  }));
  return { answer: data.answer || '', results, provider: 'tavily' };
}

async function searchWithSerper(query, apiKey) {
  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify({ q: query, num: 5 }),
  });
  if (!response.ok) throw new Error(`Serper error: ${await response.text()}`);
  const data = await response.json();
  const results = (data.organic || []).map((r) => ({
    title: r.title,
    url: r.link,
    snippet: r.snippet || '',
  }));
  return {
    answer: data.answerBox?.answer || data.answerBox?.snippet || '',
    results,
    provider: 'serper',
  };
}

async function searchWithBrave(query, apiKey) {
  const response = await fetch(
    `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`,
    {
      headers: {
        Accept: 'application/json',
        'X-Subscription-Token': apiKey,
      },
    }
  );
  if (!response.ok) throw new Error(`Brave error: ${await response.text()}`);
  const data = await response.json();
  const results = (data.web?.results || []).map((r) => ({
    title: r.title,
    url: r.url,
    snippet: r.description || '',
  }));
  return { answer: '', results, provider: 'brave' };
}

async function searchWithDuckDuckGo(query) {
  const response = await fetch(
    `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
    { headers: { 'User-Agent': 'EduRoute-Buddy/1.0', Accept: 'application/json' } }
  );
  if (!response.ok) throw new Error(`DuckDuckGo error: ${response.status}`);

  const raw = await response.text();
  if (!raw || !raw.trim()) {
    return { answer: '', results: [], provider: 'duckduckgo' };
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return { answer: '', results: [], provider: 'duckduckgo' };
  }

  const results = [];
  if (data.AbstractText) {
    results.push({
      title: data.Heading || 'Summary',
      url: data.AbstractURL || '',
      snippet: data.AbstractText,
    });
  }
  (data.RelatedTopics || []).slice(0, 4).forEach((t) => {
    if (t.Text) {
      results.push({
        title: t.Text.split(' - ')[0] || 'Related',
        url: t.FirstURL || '',
        snippet: t.Text,
      });
    }
  });

  return {
    answer: data.AbstractText || '',
    results,
    provider: 'duckduckgo',
  };
}

async function performWebSearch(query) {
  const provider = (process.env.SEARCH_PROVIDER || 'auto').toLowerCase();

  try {
    if ((provider === 'tavily' || provider === 'auto') && process.env.TAVILY_API_KEY) {
      return await searchWithTavily(query, process.env.TAVILY_API_KEY);
    }
    if ((provider === 'serper' || provider === 'auto') && process.env.SERPER_API_KEY) {
      return await searchWithSerper(query, process.env.SERPER_API_KEY);
    }
    if ((provider === 'brave' || provider === 'auto') && process.env.BRAVE_API_KEY) {
      return await searchWithBrave(query, process.env.BRAVE_API_KEY);
    }
    return await searchWithDuckDuckGo(query);
  } catch (err) {
    console.error('Web search failed, trying DuckDuckGo fallback', err.message);
    try {
      return await searchWithDuckDuckGo(query);
    } catch (fallbackErr) {
      console.error('All search providers failed', fallbackErr.message);
      return { answer: '', results: [], provider: 'none' };
    }
  }
}

function refineSearchQuery(message) {
  const stop = new Set(['tell', 'me', 'about', 'the', 'a', 'an', 'for', 'my', 'please', 'can', 'you', 'suggest', 'recommend', 'what', 'is', 'are', 'how', 'to', 'in', 'on', 'of', 'and', 'or', 'with', 'this', 'that', 'some', 'any', 'give', 'show', 'latest', 'current']);
  const tokens = message
    .replace(/[?!.,]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !stop.has(t.toLowerCase()));
  return (tokens.slice(0, 6).join(' ') || message).trim();
}

async function performWebSearchWithFallback(originalQuery) {
  const refined = refineSearchQuery(originalQuery);
  const candidates = [refined];
  const firstEntity = refined.split(/\s+/).find((t) => t.length > 3 && !/^(202[0-9]|india|students?)$/i.test(t));
  if (firstEntity && firstEntity !== refined) candidates.push(firstEntity);
  if (originalQuery !== refined) candidates.push(originalQuery);

  let best = { answer: '', results: [], provider: 'none' };
  for (const q of candidates) {
    try {
      const data = await performWebSearch(q);
      if ((data.results && data.results.length) || data.answer) {
        return data;
      }
      best = data;
    } catch (_) {}
  }
  return best;
}

function formatSearchContext(searchData) {
  if (!searchData || (!searchData.answer && (!searchData.results || searchData.results.length === 0))) {
    return '';
  }

  let ctx = `\n\n[LIVE WEB SEARCH RESULTS – provider: ${searchData.provider}]\n`;
  if (searchData.answer) {
    ctx += `Summary: ${searchData.answer}\n\n`;
  }
  searchData.results.slice(0, 5).forEach((r, i) => {
    ctx += `${i + 1}. ${r.title}\n   ${r.snippet}\n   Source: ${r.url}\n`;
  });
  ctx += `\nUse the above live information to answer accurately. Cite sources when relevant. If the search results are not useful, fall back to your general knowledge and clearly say so.\n`;
  return ctx;
}

function searchDataSummary(ctx) {
  return ctx.replace(/\[LIVE WEB SEARCH RESULTS[^\]]*\]/, '').trim().slice(0, 1200);
}

async function generateBuddyReply({ messages, language = 'english' }) {
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
  const temperature = 0.6;
  const languageDirective = {
    english: 'Reply in English only.',
    hindi: 'Reply in Hindi only (Devanagari script).',
    hinglish: 'Reply in friendly Hinglish using simple Roman script words.',
  }[language] || 'Reply in English only.';

  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  let usedWebSearch = false;
  let sources = [];
  let searchContext = '';

  if (needsWebSearch(lastUserMessage)) {
    try {
      const searchData = await performWebSearchWithFallback(lastUserMessage);
      searchContext = formatSearchContext(searchData);
      usedWebSearch = Boolean(searchData.results?.length || searchData.answer);
      sources = (searchData.results || [])
        .filter((r) => r.url)
        .slice(0, 5)
        .map((r) => ({ title: r.title, url: r.url }));
    } catch (e) {
      console.error('Search step failed', e);
    }
  }

  const systemMessage = {
    role: 'system',
    content: `You are Buddy, EDUROUTE's friendly student mentor AI. Help with: learning roadmaps, skill-gap analysis, internship guidance, resume and portfolio suggestions, weekly motivation, and event recommendations. ${ROADMAP_FALLBACK} ${languageDirective} Keep responses safe, non-harmful, and education focused. Refuse harmful/unrelated requests politely.${searchContext}`,
  };

  try {
    let reply;
    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      reply = await callGemini({
        apiKey: process.env.GEMINI_API_KEY,
        model: process.env.GEMINI_MODEL,
        messages: [systemMessage, ...messages],
        temperature,
      });
    } else if (process.env.OPENAI_API_KEY) {
      reply = await callOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL,
        messages: [systemMessage, ...messages],
        temperature,
      });
    } else {
      if (searchContext) {
        reply = `I found some live information for you:\n\n${searchDataSummary(searchContext)}\n\n(For richer AI answers, configure OPENAI_API_KEY or GEMINI_API_KEY.)`;
      } else {
        reply = localFallbackReply({ messages, language });
      }
    }

    return { reply, usedWebSearch, sources };
  } catch (error) {
    console.error('AI provider failed, using fallback response', error);
    return {
      reply: localFallbackReply({ messages, language }),
      usedWebSearch,
      sources,
    };
  }
}

module.exports = {
  generateBuddyReply,
  needsWebSearch,
  performWebSearch,
};
