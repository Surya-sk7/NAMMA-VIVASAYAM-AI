// 🌾 Feedback Routes
import { Router } from 'express';
export const feedbackRouter = Router();

// POST /api/feedback — Submit farmer feedback
feedbackRouter.post('/', (req, res) => {
  const { farmId, recommendationId, actionTaken, outcome, feedbackText } = req.body;
  if (!actionTaken) { res.status(400).json({ error: 'Action taken is required' }); return; }
  res.status(201).json({
    feedback: {
      id: 'fb-new-001', farmId, recommendationId, actionTaken, outcome,
      feedbackText, createdAt: new Date().toISOString()
    },
    message: 'Thank you for your feedback. This helps us improve recommendations.',
  });
});

// GET /api/feedback — List feedback history
feedbackRouter.get('/', (_req, res) => {
  res.json({ feedback: [
    { id: 'fb-001', recommendationTitle: "Don't irrigate today.", actionTaken: 'DONE', outcome: 'WORKED', createdAt: '2024-09-30T18:00:00Z' }
  ], isDemoData: true });
});
