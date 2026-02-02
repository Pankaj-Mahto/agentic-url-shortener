import express from 'express';
import { suggestAliases } from '../services/ai.service.js';

const router = express.Router();

router.post('/suggest-aliases', async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ success: false, message: 'originalUrl is required' });
  }

  try {
    const aliases = await suggestAliases(originalUrl);
    res.json({ success: true, aliases });
  } catch (err) {
    console.error('Suggest aliases error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate aliases' });
  }
});

export default router;