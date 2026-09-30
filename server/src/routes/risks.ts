// 🌾 Risk Routes
import { Router } from 'express';
export const riskRouter = Router();

riskRouter.get('/', (req, res) => {
  res.json({ risks: [
    { id: 'r1', riskType: 'WATER_STRESS', severity: 'MEDIUM', trend: 'INCREASING', confidence: 0.80, evidenceSummary: 'Soil moisture declining.', recommendedAction: 'Monitor closely.' },
    { id: 'r2', riskType: 'HEAT', severity: 'MEDIUM', trend: 'STABLE', confidence: 0.75, evidenceSummary: 'Temperature at 34°C, near stress threshold.', recommendedAction: 'Ensure water availability.' },
    { id: 'r3', riskType: 'DISEASE', severity: 'LOW', trend: 'STABLE', confidence: 0.65, evidenceSummary: 'No indicators detected.', recommendedAction: 'Continue monitoring.' },
    { id: 'r4', riskType: 'PEST', severity: 'LOW', trend: 'STABLE', confidence: 0.60, evidenceSummary: 'No pest activity.', recommendedAction: 'Maintain hygiene.' },
    { id: 'r5', riskType: 'HEAVY_RAIN', severity: 'MEDIUM', trend: 'INCREASING', confidence: 0.68, evidenceSummary: 'Rain probability 68%.', recommendedAction: 'Clear drainage.' },
  ], isDemoData: true });
});
