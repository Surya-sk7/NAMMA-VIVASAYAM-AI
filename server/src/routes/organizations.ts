// 🌾 Organization Routes
import { Router } from 'express';
export const organizationRouter = Router();

// GET /api/organizations/:id/dashboard — Org dashboard data
organizationRouter.get('/:id/dashboard', (req, res) => {
  res.json({
    organizationId: req.params.id,
    name: 'Madurai FPO',
    organizationType: 'FPO',
    stats: { totalFarms: 28, totalMembers: 32, activeRisks: 12, serviceRequests: 5 },
    aggregateRisks: [
      { riskType: 'WATER_STRESS', farmCount: 8, avgSeverity: 'MEDIUM' },
      { riskType: 'HEAT', farmCount: 15, avgSeverity: 'MEDIUM' },
      { riskType: 'DISEASE', farmCount: 3, avgSeverity: 'LOW' },
    ],
    alerts: [
      { type: 'AREA_RISK', message: '8 out of 28 farms showing water stress indicators.', severity: 'MEDIUM' },
    ],
    subscription: { plan: 'STANDARD', status: 'ACTIVE', farmLimit: 50 },
    isDemoData: true,
  });
});

// GET /api/organizations/:id/farms — List farms in org
organizationRouter.get('/:id/farms', (_req, res) => {
  res.json({ farms: Array.from({ length: 5 }, (_, i) => ({
    id: `farm-${i + 1}`, farmName: `Field #TN-MDU-${String(i + 20).padStart(3, '0')}`,
    location: 'Madurai', area: (1 + Math.random() * 3).toFixed(1), topRisk: ['WATER_STRESS', 'HEAT', 'NONE', 'DISEASE', 'NONE'][i],
  })), isDemoData: true });
});

// POST /api/organizations — Create org
organizationRouter.post('/', (req, res) => {
  res.status(201).json({ organization: { id: 'org-new', ...req.body }, message: 'Organization created.' });
});
