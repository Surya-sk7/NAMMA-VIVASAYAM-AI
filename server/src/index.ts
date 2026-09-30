// ============================================================
// 🌾 NammaVivasayam AI — Server Entry Point
// Agricultural Decision Intelligence Platform — API Server
// ============================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { farmRouter } from './routes/farms';
import { cropRouter } from './routes/crops';
import { recommendationRouter } from './routes/recommendations';
import { riskRouter } from './routes/risks';
import { pesuRouter } from './routes/pesu';
import { serviceRouter } from './routes/services';
import { feedbackRouter } from './routes/feedback';
import { organizationRouter } from './routes/organizations';
import { adminRouter } from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Request logging ---
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// --- Health Check ---
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'NammaVivasayam AI API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// --- API Routes ---
app.use('/api/auth', authRouter);
app.use('/api/farms', farmRouter);
app.use('/api/crops', cropRouter);
app.use('/api/recommendations', recommendationRouter);
app.use('/api/risks', riskRouter);
app.use('/api/pesu', pesuRouter);
app.use('/api/services', serviceRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/organizations', organizationRouter);
app.use('/api/admin', adminRouter);

// --- Error handler ---
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err.message);
  // Never expose technical errors to farmers
  res.status(500).json({
    error: 'Something went wrong.',
    message: 'We are working on it. Please try again later.',
  });
});

// --- 404 ---
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`\n🌾 NammaVivasayam AI API Server`);
  console.log(`   Running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Mode: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;
