import axios from 'axios';

// ────────────────────────────────────────────────
// LM Studio local OpenAI-compatible endpoint
// ────────────────────────────────────────────────
const LM_BASE_URL = 'http://localhost:1234/v1';   // ← change only if you used a different port

const lmClient = axios.create({
  baseURL: LM_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Helper: call local Phi-3 model with timeout
const callLocalModel = async (prompt, maxTokens = 128, timeoutMs = 90000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await lmClient.post('/chat/completions', {
      model: 'phi-3-mini-4k-instruct',   // name is mostly ignored by LM Studio
      messages: [
        {
          role: 'system',
          content: 'You are a precise assistant. Follow instructions exactly. Return only the requested format, nothing else.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.65,
      top_p: 0.9,
      stream: false
    }, { signal: controller.signal });

    clearTimeout(timeoutId);
    return response.data.choices?.[0]?.message?.content?.trim() || '';
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.warn(`Local model timeout after ${timeoutMs}ms`);
    } else {
      console.error('Local model error:', error.message);
    }
    throw error;
  }
};

// ────────────────────────────────────────────────
// 1. Smart Alias Suggestions
// ────────────────────────────────────────────────
export const suggestAliases = async (originalUrl) => {
  const prompt = `Generate 3 short, memorable URL aliases for: ${originalUrl}. Rules: 3-15 chars, lowercase, hyphens allowed, no special chars. Return only 3 aliases separated by newlines.`;

  try {
    const text = await callLocalModel(prompt, 64, 30000);
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean).slice(0, 3);
    return lines.map(alias => alias.replace(/[^a-z0-9-]/gi, '').slice(0, 15));
  } catch (err) {
    console.warn('Alias suggestion failed:', err.message);
    return [];
  }
};

// ────────────────────────────────────────────────
// 2. URL Categorization
// ────────────────────────────────────────────────
export const categorizeUrl = async (originalUrl) => {
  const prompt = `Categorize this URL and extract 3-5 relevant tags: ${originalUrl}. Return format exactly:
Category: <category>
Tags: <tag1>, <tag2>, <tag3>

Categories: blog, product, documentation, social, news, video, education, ecommerce, other`;

  try {
    const text = await callLocalModel(prompt, 96, 30000);

    const catMatch = text.match(/Category:\s*(\w+)/i);
    const tagsMatch = text.match(/Tags:\s*(.+)/i);

    const category = catMatch ? catMatch[1].trim().toLowerCase() : 'uncategorized';
    const tags = tagsMatch
      ? tagsMatch[1].split(',').map(t => t.trim().toLowerCase()).filter(Boolean).slice(0, 5)
      : [];

    return { category, tags };
  } catch (err) {
    console.warn('Categorization failed:', err.message);
    return { category: 'uncategorized', tags: [] };
  }
};

// ────────────────────────────────────────────────
// 3. Generate Insights
// ────────────────────────────────────────────────
export const generateInsights = async (linkId, analyticsSummary = 'No analytics data yet') => {
  const prompt = `Analyze these link analytics and provide 3-5 insights. Return **only** a JSON array:

[{"type": "trend|peak_time|geographic_pattern|anomaly", "text": "human readable insight", "confidence": 0.0-1.0}]

Analytics summary: ${analyticsSummary}`;

  try {
    const text = await callLocalModel(prompt, 256, 60000);

    const cleaned = text.replace(/```json|```/g, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = [];
    }

    if (!Array.isArray(parsed)) return [];
    return parsed.filter(i => i.type && i.text && typeof i.confidence === 'number').slice(0, 5);
  } catch (err) {
    console.warn('Insights generation failed:', err.message);
    return [];
  }
};