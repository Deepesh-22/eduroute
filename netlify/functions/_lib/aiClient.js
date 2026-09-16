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
  /\b(who is|who's|who was|who are|what is|what's|when is|when was|where is)\b/i,
  /\b(prime minister|president|cm of|chief minister|minister of|governor of)\b/i,
  /\b(capital of|population of|currency of|ceo of|founder of)\b/i,
];

function needsWebSearch(userMessage = '') {
  if (!userMessage || userMessage.trim().length < 5) return false;
  const pureGuidance =
    /^(create|give|make|show|explain|teach|help me with|motivate)\b.*\b(roadmap|plan|skill gap|motivation|resume|portfolio|study plan)\b/i;
  if (pureGuidance.test(userMessage.trim()) && !SEARCH_TRIGGER_PATTERNS.some((p) => p.test(userMessage))) {
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
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: model || 'gpt-4o-mini', messages, temperature }),
  });
  if (!response.ok) throw new Error(`OpenAI error: ${await response.text()}`);
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
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature } }),
    }
  );
  if (!response.ok) throw new Error(`Gemini error: ${await response.text()}`);
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Buddy could not generate a response.';
}

async function searchWithTavily(query, apiKey) {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey, query, search_depth: 'basic', include_answer: true, max_results: 5 }),
  });
  if (!response.ok) throw new Error(`Tavily error: ${await response.text()}`);
  const data = await response.json();
  const results = (data.results || []).map((r) => ({ title: r.title, url: r.url, snippet: r.content || r.snippet || '' }));
  return { answer: data.answer || '', results, provider: 'tavily' };
}

async function searchWithSerper(query, apiKey) {
  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': apiKey },
    body: JSON.stringify({ q: query, num: 5 }),
  });
  if (!response.ok) throw new Error(`Serper error: ${await response.text()}`);
  const data = await response.json();
  const results = (data.organic || []).map((r) => ({ title: r.title, url: r.link, snippet: r.snippet || '' }));
  return { answer: data.answerBox?.answer || data.answerBox?.snippet || '', results, provider: 'serper' };
}

async function searchWithBrave(query, apiKey) {
  const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`, {
    headers: { Accept: 'application/json', 'X-Subscription-Token': apiKey },
  });
  if (!response.ok) throw new Error(`Brave error: ${await response.text()}`);
  const data = await response.json();
  const results = (data.web?.results || []).map((r) => ({ title: r.title, url: r.url, snippet: r.description || '' }));
  return { answer: '', results, provider: 'brave' };
}

async function searchWithWikipedia(query) {
  const searchUrl =
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}` +
    `&format=json&srlimit=5&origin=*`;
  const searchRes = await fetch(searchUrl, {
    headers: { 'User-Agent': 'EduRoute-Buddy/1.0 (education; contact@eduroute.app)' },
  });
  if (!searchRes.ok) throw new Error(`Wikipedia search error: ${searchRes.status}`);
  const searchData = await searchRes.json();
  const hits = searchData?.query?.search || [];
  if (!hits.length) return { answer: '', results: [], provider: 'wikipedia' };

  const topTitle = hits[0].title;
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topTitle)}`;
  const sumRes = await fetch(summaryUrl, {
    headers: { 'User-Agent': 'EduRoute-Buddy/1.0 (education; contact@eduroute.app)' },
  });

  let answer = '';
  let pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(topTitle.replace(/ /g, '_'))}`;
  if (sumRes.ok) {
    const sum = await sumRes.json();
    answer = sum.extract || '';
    pageUrl = sum?.content_urls?.desktop?.page || pageUrl;
  }

  const results = hits.slice(0, 5).map((h, i) => ({
    title: h.title,
    url: i === 0 ? pageUrl : `https://en.wikipedia.org/wiki/${encodeURIComponent(h.title.replace(/ /g, '_'))}`,
    snippet: (h.snippet || '').replace(/<[^>]+>/g, ''),
  }));
  if (answer && results[0]) results[0].snippet = answer.slice(0, 280);
  return { answer, results, provider: 'wikipedia' };
}

async function searchWithDuckDuckGo(query) {
  const response = await fetch(
    `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
    { headers: { 'User-Agent': 'EduRoute-Buddy/1.0', Accept: 'application/json' } }
  );
  if (!response.ok) throw new Error(`DuckDuckGo error: ${response.status}`);
  const raw = await response.text();
  if (!raw || !raw.trim()) return { answer: '', results: [], provider: 'duckduckgo' };
  let data;
  try { data = JSON.parse(raw); } catch { return { answer: '', results: [], provider: 'duckduckgo' }; }
  const results = [];
  if (data.AbstractText) {
    results.push({ title: data.Heading || 'Summary', url: data.AbstractURL || '', snippet: data.AbstractText });
  }
  (data.RelatedTopics || []).slice(0, 4).forEach((t) => {
    if (t.Text) results.push({ title: t.Text.split(' - ')[0] || 'Related', url: t.FirstURL || '', snippet: t.Text });
  });
  return { answer: data.AbstractText || '', results, provider: 'duckduckgo' };
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
    const wiki = await searchWithWikipedia(query);
    if (wiki.results?.length || wiki.answer) return wiki;
    return await searchWithDuckDuckGo(query);
  } catch (err) {
    console.error('Web search failed, trying free fallbacks', err.message);
    try {
      const wiki = await searchWithWikipedia(query);
      if (wiki.results?.length || wiki.answer) return wiki;
    } catch (e) { console.error('Wikipedia failed', e.message); }
    try {
      return await searchWithDuckDuckGo(query);
    } catch (fallbackErr) {
      console.error('All search providers failed', fallbackErr.message);
      return { answer: '', results: [], provider: 'none' };
    }
  }
}

function refineSearchQuery(message) {
  const lower = message.toLowerCase().trim();
  if (/prime\s*minister.*india|pm of india|india.*prime\s*minister/i.test(lower)) {
    return 'Narendra Modi Prime Minister of India';
  }
  if (/president of india|india.*president/i.test(lower) && !/prime/i.test(lower)) {
    return 'President of India';
  }
  const stop = new Set(['tell','me','about','the','a','an','for','my','please','can','you','suggest','recommend','what','is','are','how','to','in','on','of','and','or','with','this','that','some','any','give','show','latest','current','who','was','were',"who's","what's"]);
  const tokens = message.replace(/[?!.,]/g, ' ').split(/\s+/).filter((t) => t.length > 1 && !stop.has(t.toLowerCase()));
  return (tokens.slice(0, 8).join(' ') || message).trim();
}

async function performWebSearchWithFallback(originalQuery) {
  const refined = refineSearchQuery(originalQuery);
  const candidates = [refined];
  if (originalQuery !== refined) candidates.push(originalQuery);
  const firstEntity = refined.split(/\s+/).find((t) => t.length > 3 && !/^(202[0-9]|india|students?)$/i.test(t));
  if (firstEntity && !candidates.includes(firstEntity)) candidates.push(firstEntity);
  let best = { answer: '', results: [], provider: 'none' };
  for (const q of candidates) {
    try {
      const data = await performWebSearch(q);
      if ((data.results && data.results.length) || data.answer) return data;
      best = data;
    } catch (_) {}
  }
  return best;
}

function formatSearchContext(searchData) {
  if (!searchData || (!searchData.answer && (!searchData.results || searchData.results.length === 0))) return '';
  let ctx = `\n\n[LIVE WEB SEARCH RESULTS – provider: ${searchData.provider}]\n`;
  if (searchData.answer) ctx += `Summary: ${searchData.answer}\n\n`;
  searchData.results.slice(0, 5).forEach((r, i) => {
    ctx += `${i + 1}. ${r.title}\n   ${r.snippet}\n   Source: ${r.url}\n`;
  });
  ctx += `\nUse the above live information to answer accurately. Cite sources when relevant.\n`;
  return ctx;
}

function buildAnswerFromSearch(searchData, language) {
  const summary = (searchData.answer || searchData.results?.[0]?.snippet || '').trim();
  if (!summary) {
    return language === 'hindi'
      ? 'मुझे इस सवाल के लिए अभी live जानकारी नहीं मिली। कृपया थोड़ा और specific पूछें।'
      : language === 'hinglish'
        ? 'Is sawal ke liye abhi live info nahi mili. Thoda specific poochho please.'
        : 'I could not find reliable live information for that yet. Please try a more specific question.';
  }
  const sources = (searchData.results || []).filter((r) => r.url).slice(0, 3).map((r, i) => `${i + 1}. ${r.title} — ${r.url}`).join('\n');
  const header = language === 'hindi' ? 'लाइव जानकारी के आधार पर:' : language === 'hinglish' ? 'Live info ke basis pe:' : 'Based on live information:';
  return `${header}\n\n${summary}${sources ? `\n\nSources:\n${sources}` : ''}`;
}

async function generateBuddyReply({ messages, language = 'english' }) {
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
  const temperature = 0.5;
  const languageDirective = {
    english: 'Reply in English only.',
    hindi: 'Reply in Hindi only (Devanagari script).',
    hinglish: 'Reply in friendly Hinglish using simple Roman script words.',
  }[language] || 'Reply in English only.';

  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  let usedWebSearch = false;
  let sources = [];
  let searchContext = '';
  let searchData = null;

  if (needsWebSearch(lastUserMessage)) {
    try {
      searchData = await performWebSearchWithFallback(lastUserMessage);
      searchContext = formatSearchContext(searchData);
      usedWebSearch = Boolean(searchData.results?.length || searchData.answer);
      sources = (searchData.results || []).filter((r) => r.url).slice(0, 5).map((r) => ({ title: r.title, url: r.url }));
    } catch (e) {
      console.error('Search step failed', e);
    }
  }

  const systemMessage = {
    role: 'system',
    content: `You are Buddy, EDUROUTE's friendly student mentor AI. Help with learning roadmaps, skill-gap analysis, internships, resume tips, motivation, events, and factual current-affairs when live search results are provided. ${ROADMAP_FALLBACK} ${languageDirective} When live search results are present, answer the user's question directly using them first. Keep responses safe and education focused.${searchContext}`,
  };

  try {
    let reply;
    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      reply = await callGemini({ apiKey: process.env.GEMINI_API_KEY, model: process.env.GEMINI_MODEL, messages: [systemMessage, ...messages], temperature });
    } else if (process.env.OPENAI_API_KEY) {
      reply = await callOpenAI({ apiKey: process.env.OPENAI_API_KEY, model: process.env.OPENAI_MODEL, messages: [systemMessage, ...messages], temperature });
    } else if (searchData && usedWebSearch) {
      reply = buildAnswerFromSearch(searchData, language);
    } else {
      reply = localFallbackReply({ messages, language });
    }
    return { reply, usedWebSearch, sources };
  } catch (error) {
    console.error('AI provider failed', error);
    if (searchData && usedWebSearch) {
      return { reply: buildAnswerFromSearch(searchData, language), usedWebSearch, sources };
    }
    return { reply: localFallbackReply({ messages, language }), usedWebSearch, sources };
  }
}

module.exports = { generateBuddyReply, needsWebSearch, performWebSearch };
