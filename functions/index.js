const { onRequest, defineSecret } = require('firebase-functions/v2/http');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');

admin.initializeApp();

const OPENROUTER_KEY = defineSecret('OPENROUTER_API_KEY');
const GEMINI_KEY = defineSecret('GEMINI_API_KEY');

const SYSTEM_PROMPT = `You are an AI logistics assistant for CrownPrevail Logistics company in Nigeria. You help with:
- Financial analysis (income, expenses, profit/loss tracking)
- Invoice generation and management
- Shipment tracking and optimization
- Performance analytics and forecasting
- Business recommendations and insights
- Report generation
Be concise, professional, and data-driven. Provide actionable insights. Use Nigerian Naira (₦) for currency.

FORMAT RULES (important):
- Structure every answer: begin with a short **Bold heading**, then bullet lists (- item) or numbered steps.
- Bold key figures like ₦ amounts, percentages, and counts.
- Keep paragraphs to 1-2 sentences max; never write walls of text.
- Use markdown tables only when comparing 3+ items across attributes.
- Never output raw HTML. Default to 180 words or fewer unless the user asks for detail.`;

// Simple in-memory per-user rate limit (best-effort; fine for admin scale)
const rateBuckets = new Map();
function rateLimited(uid) {
  const now = Date.now();
  const bucket = rateBuckets.get(uid) || [];
  const recent = bucket.filter(t => now - t < 60000);
  if (recent.length >= 20) return true;
  recent.push(now);
  rateBuckets.set(uid, recent);
  return false;
}

async function callOpenRouter(key, messages) {
  // Rotate through known-good free models — free tiers go down often
  const models = ['poolside/laguna-s-2.1:free', 'poolside/laguna-xs-2.1:free', 'nvidia/nemotron-3.5-super-vl:free'];
  let lastErr = null;
  for (const model of models) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: AbortSignal.timeout(45000),
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 500,
          temperature: 0.7
        })
      });
      if (!res.ok) throw new Error(`OpenRouter ${res.status}`);
      const data = await res.json();
      const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!text) throw new Error('Empty OpenRouter response');
      return text;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error('Empty OpenRouter response');
}

async function callGemini(key, prompt, history) {
  let context = `${SYSTEM_PROMPT}\n\n`;
  (history || []).forEach(m => {
    context += `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}\n`;
  });
  context += `User: ${prompt}`;
  // Specific model first, then the always-available latest alias
  let lastErr = null;
  for (const model of ['gemini-3.8-flash', 'gemini-flash-latest']) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: 'POST',
        signal: AbortSignal.timeout(20000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: context }] }] })
      });
      if (!res.ok) throw new Error(`Gemini ${res.status}`);
      const data = await res.json();
      const text = data.candidates && data.candidates[0] &&
        data.candidates[0].content && data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
      if (!text) throw new Error('Empty Gemini response');
      return text;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error('Empty Gemini response');
}

/**
 * aiProxy — keeps OpenRouter/Gemini API keys server-side.
 * POST { prompt, conversationHistory } with `Authorization: Bearer <Firebase ID token>`.
 * Deploy: firebase deploy --only functions:aiProxy
 * Then set VITE_AI_PROXY_URL (or fill admin/assets/config.js aiProxyConfig.url)
 * to this function's HTTPS trigger URL.
 *
 * TODO (production email delivery): add a scheduled function that drains the
 * Firestore `email_queue` collection via a real SMTP provider and flips
 * status to 'sent'/'failed'.
 */
exports.aiProxy = onRequest(
  { secrets: [OPENROUTER_KEY, GEMINI_KEY], cors: true, maxInstances: 10 },
  async (req, res) => {
    try {
      if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

      // Require a valid signed-in Firebase user
      const authHeader = req.headers.authorization || '';
      const idToken = authHeader.replace(/^Bearer\s+/i, '');
      if (!idToken) return res.status(401).json({ error: 'Missing ID token' });
      let decoded;
      try {
        decoded = await admin.auth().verifyIdToken(idToken);
      } catch (e) {
        return res.status(401).json({ error: 'Invalid ID token' });
      }
      if (rateLimited(decoded.uid)) return res.status(429).json({ error: 'Rate limit exceeded' });

      const { prompt, conversationHistory } = req.body || {};
      if (!prompt || typeof prompt !== 'string' || prompt.length > 4000) {
        return res.status(400).json({ error: 'Invalid prompt' });
      }

      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...(Array.isArray(conversationHistory) ? conversationHistory.slice(-10) : []),
        { role: 'user', content: prompt }
      ];

      let response = null;
      let provider = null;
      if (OPENROUTER_KEY.value()) {
        try {
          response = await callOpenRouter(OPENROUTER_KEY.value(), messages);
          provider = 'OpenRouter';
        } catch (err) {
          logger.warn('OpenRouter failed', err.message);
        }
      }
      if (!response && GEMINI_KEY.value()) {
        response = await callGemini(GEMINI_KEY.value(), prompt, conversationHistory);
        provider = 'Gemini';
      }
      if (!response) return res.status(503).json({ error: 'No AI provider available' });

      return res.json({ success: true, response, provider });
    } catch (err) {
      logger.error('aiProxy error', err);
      return res.status(500).json({ error: 'Internal error' });
    }
  }
);
