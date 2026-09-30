// 🌾 Farm Routes
import { Router } from 'express';
export const farmRouter = Router();

// GET /api/farms — List user's farms
farmRouter.get('/', (_req, res) => {
  res.json({ farms: [{
    id: 'demo-farm-TN-MDU-024', farmName: 'FIELD #TN-MDU-024',
    location: 'Madurai, Tamil Nadu', latitude: 9.9252, longitude: 78.1198,
    area: 1.8, areaUnit: 'ACRES', irrigationMethod: 'CANAL', soilType: 'ALLUVIAL'
  }]});
});

// GET /api/farms/:id — Farm detail
farmRouter.get('/:id', (req, res) => {
  res.json({ farm: {
    id: req.params.id, farmName: 'FIELD #TN-MDU-024',
    location: 'Madurai, Tamil Nadu', latitude: 9.9252, longitude: 78.1198,
    area: 1.8, areaUnit: 'ACRES', irrigationMethod: 'CANAL', soilType: 'ALLUVIAL'
  }});
});

// GET /api/farms/:id/digital-twin — Farm Digital Twin
farmRouter.get('/:id/digital-twin', (req, res) => {
  res.json({
    farmId: req.params.id,
    crop: { cropName: 'Paddy', variety: 'IR 64', currentStage: 'FLOWERING', plantingDate: '2024-07-15' },
    soil: { moisture: 31, pH: 6.8, nitrogen: 245, phosphorus: 18, potassium: 210, evidenceType: 'MEASURED' },
    weather: { temperature: 34, humidity: 72, rainfallProbability: 68, windSpeed: 12, weatherCondition: 'Partly Cloudy' },
    satellite: { vegetationIndex: 0.62, stressIndex: 0.25, anomalyScore: 0.18 },
    risks: [
      { riskType: 'WATER_STRESS', severity: 'MEDIUM', trend: 'INCREASING' },
      { riskType: 'HEAT', severity: 'MEDIUM', trend: 'STABLE' },
      { riskType: 'DISEASE', severity: 'LOW', trend: 'STABLE' },
    ],
    isDemoData: true,
  });
});

// POST /api/farms — Create farm
farmRouter.post('/', (req, res) => {
  res.status(201).json({ farm: { id: 'new-farm-id', ...req.body }, message: 'Farm created successfully' });
});
