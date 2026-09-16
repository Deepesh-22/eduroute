const ROADMAP_FALLBACK = `For roadmaps, give a short ordered plan with milestones, one practical project, useful resources, and a measurable weekly challenge.`;

function localFallbackReply({ messages, language, studentContext = {} }) {
  const lastMessage = messages[messages.length - 1]?.content || 'learning guidance';
  const missingSkills = studentContext.missingSkills?.length
    ? studentContext.missingSkills.join(', ')
    : 'no gaps recorded yet';
  const intro = language === 'hindi'
    ? 'मैं Buddy हूँ। अभी limited mode में हूँ, लेकिन आपकी पूरी help करूंगा।'
    : language === 'hinglish'
      ? 'Main Buddy hoon. Abhi limited mode hai, but main full guidance dunga.'
      : 'I am Buddy in limited mode, but I can still guide you effectively.';

  return `${intro}

Based on: "${lastMessage}"

Your current focus: ${missingSkills}.

Beginner → Intermediate → Pro Plan:
1) Beginner: strengthen fundamentals + 1 mini project.
2) Intermediate: framework mastery + API integration + portfolio update.
3) Pro: system design, testing, interview prep, and internship applications.

Weekly challenge: complete one project milestone and one mock interview.`;
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

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini error: ${errorText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Buddy could not generate a response.';
}

async function generateBuddyReply({ messages, language = 'english', studentContext = {} }) {
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
  const temperature = 0.6;
  const languageDirective = {
    english: 'Reply in English only.',
    hindi: 'Reply in Hindi only (Devanagari script).',
    hinglish: 'Reply in friendly Hinglish using simple Roman script words.',
  }[language] || 'Reply in English only.';

  const systemMessage = {
    role: 'system',
    content: `You are Buddy, EDUROUTE's friendly student mentor AI. Your job is to turn a student's question into a clear next action. Help with learning roadmaps, skill-gap analysis, internship guidance, resume and portfolio suggestions, weekly motivation, and event recommendations.

  Student context:
  - Level: ${studentContext.level || 1}
  - XP: ${studentContext.points || 0}
  - Missing or selected focus skills: ${(studentContext.missingSkills || []).join(', ') || 'none recorded'}
  - Weekly challenge: ${(studentContext.weeklyChallenges || [])[0] || studentContext.weeklyChallenge || 'none set'}

  Behavior rules:
  - Answer the user's actual question first; do not repeat a generic roadmap unless requested.
  - Personalize recommendations to the student context and state assumptions when details are missing.
  - Prefer concrete steps, realistic time estimates, examples, and one small action they can complete today.
  - For career recommendations, never invent live openings or events. Explain how to verify current details.
  - Keep most replies under 350 words. Use headings and bullets when they improve scanning.
  - ${ROADMAP_FALLBACK}
  - ${languageDirective}
  - Keep responses safe, non-harmful, and education focused. Refuse harmful or unrelated requests politely.`,
  };

  try {
    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      return await callGemini({
        apiKey: process.env.GEMINI_API_KEY,
        model: process.env.GEMINI_MODEL,
        messages: [systemMessage, ...messages],
        temperature,
      });
    }

    if (process.env.OPENAI_API_KEY) {
      return await callOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL,
        messages: [systemMessage, ...messages],
        temperature,
      });
    }

    return localFallbackReply({ messages, language, studentContext });
  } catch (error) {
    console.error('AI provider failed, using fallback response', error);
    return localFallbackReply({ messages, language, studentContext });
  }
}

module.exports = { generateBuddyReply };
