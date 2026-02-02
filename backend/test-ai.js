import { suggestAliases, categorizeUrl, generateInsights } from './src/services/ai.service.js';
import dotenv from 'dotenv';
dotenv.config();

console.log('HUGGINGFACE_API_KEY loaded:', 
  process.env.HUGGINGFACE_API_KEY 
    ? `present (${process.env.HUGGINGFACE_API_KEY.slice(0,4)}...${process.env.HUGGINGFACE_API_KEY.slice(-4)})` 
    : 'MISSING or empty'
);

async function runTests() {
  const url = 'https://tailwindcss.com/docs/installation';

  console.log('Testing AI functions...\n');

  const aliases = await suggestAliases(url);
  console.log('Aliases:', aliases);

  const cat = await categorizeUrl(url);
  console.log('Category:', cat.category);
  console.log('Tags:', cat.tags);

  const insights = await generateInsights('dummy-link-id', 'Total clicks: 320, US: 45%, IN: 28%, Peak: 18:00-21:00, Mobile: 62%');
  console.log('Insights:', insights);
}

runTests().catch(console.error);