export const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/';
export const HUGGINGFACE_MODEL = process.env.HUGGINGFACE_MODEL || 'Qwen/Qwen2.5-3B-Instruct';
export const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!HUGGINGFACE_API_KEY) {
  console.warn('⚠️ HUGGINGFACE_API_KEY not set in .env - AI features will fallback to defaults');
}