import { customAlphabet } from 'nanoid';
import Link from '../models/Link.js';

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const generateId = customAlphabet(alphabet, 6);

export const generateUniqueShortCode = async () => {
  let shortCode;
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    shortCode = generateId().toLowerCase();
    
    const existing = await Link.findOne({ shortCode });
    if (!existing) {
      return shortCode;
    }
    
    attempts++;
  }

  throw new Error('Could not generate a unique short code after multiple attempts');
};