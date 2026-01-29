import { suggestAliases, categorizeUrl, generateInsights } from './src/services/ai.service.js';
import dotenv from 'dotenv';
dotenv.config();


async function testAI() {
  console.log('Testing AI service...\n');

  try {
    const aliases = await suggestAliases('https://myawesomeproduct.com/features/pricing');
    console.log('Suggested aliases:', aliases);

    const cat = await categorizeUrl('https://myawesomeproduct.com/features/pricing');
    console.log('Category & tags:', cat);

    const insights = await generateInsights('dummyId', 'Total clicks: 120, Top countries: US 45%, IN 30%, Peak: evenings, Devices: desktop 70%');
    console.log('Insights:', insights);
  } catch (err) {
    console.error('Test failed:', err);
  }
}

testAI();