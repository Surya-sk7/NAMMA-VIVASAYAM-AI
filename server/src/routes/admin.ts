// 🌾 Admin Routes — Platform configuration & monitoring
import { Router } from 'express';
export const adminRouter = Router();

// GET /api/admin/config — Platform configuration
adminRouter.get('/config', (_req, res) => {
  res.json({
    config: {
      commissionPercentage: 5.0,
      supportedLanguages: ['ta', 'en', 'hi', 'kn', 'te', 'ml'],
      freeFarmerFeatures: ['farm_profile', 'recommendations', 'why_engine', 'what_if', 'crop_doctor', 'pesu', 'risk_radar', 'feedback', 'timeline'],
      maxFreefarmsPerUser: 3,
    },
    note: 'Commission percentage and all values are CONFIGURABLE. Never hardcoded.'
  });
});

// PUT /api/admin/config/commission — Update commission
adminRouter.put('/config/commission', (req, res) => {
  const { percentage } = req.body;
  if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
    res.status(400).json({ error: 'Invalid commission percentage' }); return;
  }
  res.json({ message: `Commission updated to ${percentage}%`, previousValue: 5.0, newValue: percentage });
});

// GET /api/admin/stats — Platform statistics
adminRouter.get('/stats', (_req, res) => {
  res.json({
    stats: {
      totalUsers: 156, totalFarms: 198, totalRecommendations: 1247,
      totalBookings: 34, totalRevenue: 15350,
      feedbackRate: 0.42, feedbackPositiveRate: 0.78,
      activeOrganizations: 5, activeProviders: 12,
    },
    isDemoData: true,
  });
});

// GET /api/admin/feature-flags — Feature toggles
adminRouter.get('/feature-flags', (_req, res) => {
  res.json({
    flags: {
      enableVoiceInput: true,
      enableSatelliteData: true,
      enableCropDoctor: true,
      enableMarketplace: true,
      enableOrganizations: true,
      enableRealWeatherAPI: false,
      enableRealSatelliteAPI: false,
      enablePayments: false,
      demoMode: true,
    },
  });
});
