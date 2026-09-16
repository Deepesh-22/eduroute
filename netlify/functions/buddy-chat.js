import { generateBuddyReply } from './_lib/aiClient.js';

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

/**
 * Netlify Function (ESM) — named export `handler` required when package.json has "type": "module"
 * and functions use node_bundler = esbuild.
 */
export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method not allowed' });

  try {
    const payload = JSON.parse(event.body || '{}');
    const { userId, message, language = 'english' } = payload;

    if (!userId || !message) {
      return json(400, { ok: false, error: 'userId and message are required.' });
    }

    let profile = null;
    let points = 0;
    let level = 1;
    let recentMessages = [{ role: 'user', content: message }];

    try {
      const { connectDatabase, UserProgress } = await import('./_lib/database.js');
      await connectDatabase();
      profile = await UserProgress.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId, weeklyChallenges: ['Build 1 mini project this week'] } },
        { upsert: true, new: true }
      );
      profile.chatHistory = profile.chatHistory || [];
      profile.chatHistory.push({ role: 'user', text: message });
      recentMessages = profile.chatHistory
        .slice(-12)
        .map((entry) => ({
          role: entry.role === 'assistant' ? 'assistant' : 'user',
          content: entry.text,
        }));
      points = profile.points || 0;
      level = profile.level || 1;
    } catch (dbErr) {
      console.warn('Buddy DB unavailable, answering without persistence:', dbErr.message);
    }

    const { reply: aiReply, usedWebSearch = false, sources = [] } = await generateBuddyReply({
      messages: recentMessages,
      language,
    });

    const pointsEarned = usedWebSearch ? 8 : 5;
    const newPoints = points + pointsEarned;
    const newLevel = Math.max(1, Math.floor(newPoints / 100) + 1);

    if (profile) {
      try {
        profile.points = newPoints;
        profile.level = newLevel;
        profile.preferredLanguage = language;
        profile.chatHistory.push({ role: 'assistant', text: aiReply });
        if (profile.chatHistory.length > 50) {
          profile.chatHistory = profile.chatHistory.slice(-50);
        }
        await profile.save();
      } catch (saveErr) {
        console.warn('Buddy progress save failed:', saveErr.message);
      }
    }

    return json(200, {
      ok: true,
      reply: aiReply,
      usedWebSearch,
      sources,
      gamification: {
        points: newPoints,
        level: newLevel,
        pointsEarned,
      },
    });
  } catch (error) {
    console.error('buddy-chat error', error);
    return json(500, { ok: false, error: error.message || 'Failed to process Buddy chat.' });
  }
}
