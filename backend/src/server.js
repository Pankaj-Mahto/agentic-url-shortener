import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';

import redirectRoutes from './routes/redirect.routes.js';
import authRoutes from './routes/auth.routes.js';
import linksRoutes from './routes/links.routes.js';
import aiRoutes from './routes/ai.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';   // ← Add this

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ 
  origin: process.env.CORS_ORIGIN, 
  credentials: true 
}));
app.use(express.json());

// Existing routes
app.use('/api/auth', authRoutes);
app.use('/', redirectRoutes);
app.use('/api/links', linksRoutes);
app.use('/api/ai', aiRoutes);

// NEW: Analytics Routes
app.use('/api/links/analytics', analyticsRoutes);   // ← This is the important line

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();