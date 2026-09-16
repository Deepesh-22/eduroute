# Buddy Live Web Search

Buddy now answers with **real-time web search** when the question needs fresh data (internships, hackathons, salaries, latest tools, events, company news, etc.).

## How it works

1. Heuristic detects whether the user message needs live data.
2. Search is performed via (in order):
   - **Tavily** (`TAVILY_API_KEY`) – best for AI
   - **Serper** (`SERPER_API_KEY`) – Google results
   - **Brave** (`BRAVE_API_KEY`)
   - **DuckDuckGo Instant Answer** – free, no key (limited coverage)
3. Results are injected into the AI system prompt so OpenAI / Gemini ground the reply.
4. Frontend shows a **“Live web search”** badge and up to 3 source links.

## Environment variables

```env
SEARCH_PROVIDER=auto          # auto | tavily | serper | brave
TAVILY_API_KEY=
SERPER_API_KEY=
BRAVE_API_KEY=

AI_PROVIDER=openai
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
# or
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
```

Without any search API key, DuckDuckGo is used automatically.  
Without any AI key, Buddy still returns a readable summary of the search results.

## Files changed

- `netlify/functions/_lib/aiClient.js` – search + AI orchestration
- `netlify/functions/buddy-chat.js` – returns `usedWebSearch` + `sources`
- `src/types/buddy.ts` – message types
- `src/pages/Buddy/BuddyChat.tsx` – UI badge + source links
- `.env.example` – documented keys

## Manual test ideas

- “Suggest internships for fresher web developers in India”
- “Recommend hackathons in Bengaluru this month”
- “Create a Web Developer roadmap for beginner to pro” (should **not** search)
