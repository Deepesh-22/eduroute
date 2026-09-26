/**
 * Soft env presence checks for Netlify functions (no secrets logged).
 */
function has(name) {
  try {
    const v = process.env[name];
    return Boolean(v && String(v).trim());
  } catch {
    return false;
  }
}

function summarizeAiEnv() {
  return {
    GEMINI_API_KEY: has('GEMINI_API_KEY'),
    GROQ_API_KEY: has('GROQ_API_KEY'),
    OPENAI_API_KEY: has('OPENAI_API_KEY'),
  };
}

module.exports = {
  has,
  summarizeAiEnv,
};
