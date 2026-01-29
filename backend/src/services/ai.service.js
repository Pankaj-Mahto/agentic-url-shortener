import axios from 'axios';
import { HUGGINGFACE_API_URL, HUGGINGFACE_MODEL, HUGGINGFACE_API_KEY } from '../config/huggingface.js';

// Helper: call HF Inference API with timeout
const callInference = async (prompt, maxTokens = 128, timeoutMs = 5000) => {
  if (!HUGGINGFACE_API_KEY) {
    throw new Error('Hugging Face API key not configured');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await axios.post(
      `${HUGGINGFACE_API_URL}${HUGGINGFACE_MODEL}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: maxTokens,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);
    return response.data[0]?.generated_text?.trim() || '';
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.warn(`HF Inference timeout after ${timeoutMs}ms for model ${HUGGINGFACE_MODEL}`);
    } else {
      console.error('HF Inference error:', error.message);
    }
    throw error; // Let caller handle fallback
  }
};

// 1. Smart Alias Suggestions
export const suggestAliases = async (originalUrl) => {
  const prompt = `Generate 3 short, memorable URL aliases for: ${originalUrl}. Rules: 3-15 chars, lowercase, hyphens allowed, no special chars. Return only 3 aliases separated by newlines.`;

  try {
    const response = await callInference(prompt, 64, 5000);

    // Parse: expect 3 lines
    const lines = response.split('\n').map(l => l.trim()).filter(Boolean);
    const aliases = lines.slice(0, 3).map(alias => alias.replace(/[^a-z0-9-]/gi, '')); // sanitize

    return aliases.length === 3 ? aliases : [];
  } catch (err) {
    console.warn('Alias suggestion failed:', err.message);
    return []; // fallback as per spec
  }
};

// 2. URL Categorization
export const categorizeUrl = async (originalUrl) => {
  const prompt = `Categorize this URL and extract 3-5 relevant tags: ${originalUrl}. Return format exactly:
Category: <category>
Tags: <tag1>, <tag2>, <tag3>

Categories: blog, product, documentation, social, news, video, education, ecommerce, other`;

  try {
    const response = await callInference(prompt, 96, 5000);

    // Simple parsing
    const categoryMatch = response.match(/Category:\s*(\w+)/i);
    const tagsMatch = response.match(/Tags:\s*(.+)/i);

    const category = categoryMatch ? categoryMatch[1].trim().toLowerCase() : 'uncategorized';
    const tags = tagsMatch
      ? tagsMatch[1].split(',').map(t => t.trim().toLowerCase()).filter(Boolean).slice(0, 5)
      : [];

    return { category, tags };
  } catch (err) {
    console.warn('Categorization failed:', err.message);
    return { category: 'uncategorized', tags: [] }; // fallback
  }
};

// 3. Generate Insights (basic version - full analytics aggregation in Phase 3)
// For now, accept summary string; later pass real aggregated data
export const generateInsights = async (linkId, analyticsSummary) => {
  // analyticsSummary example: "Total clicks: 45, Top countries: US(20), IN(15), Peak hour: 14:00, Devices: mobile 60%"
  const prompt = `Analyze these link analytics and provide 3 insights in JSON array format only: 
  [{"type": "trend|peak_time|geographic_pattern|anomaly", "text": "human readable insight", "confidence": 0.0-1.0}]
  
  Analytics summary: ${analyticsSummary || 'No data yet'}`;

  try {
    const response = await callInference(prompt, 256, 10000);

    // Parse JSON array
    const cleaned = response.replace(/```json|```/g, '').trim();
    let insights;
    try {
      insights = JSON.parse(cleaned);
    } catch {
      insights = [];
    }

    // Validate & limit
    return Array.isArray(insights) 
      ? insights.slice(0, 5).filter(i => i.type && i.text && typeof i.confidence === 'number')
      : [];
  } catch (err) {
    console.warn('Insights generation failed:', err.message);
    return []; // fallback
  }
};