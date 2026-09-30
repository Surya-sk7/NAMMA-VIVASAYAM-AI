// 🌾 Recommendation Routes (WHY + WHAT-IF)
import { Router } from 'express';
export const recommendationRouter = Router();

// GET /api/recommendations — Active recommendations for a farm
recommendationRouter.get('/', (req, res) => {
  const farmId = req.query.farmId || 'demo-farm-TN-MDU-024';
  res.json({ recommendations: [{
    id: 'demo-rec-001', farmId, cropId: 'demo-crop-001',
    recommendationType: 'IRRIGATION', title: "Don't irrigate today.",
    description: 'Rain probability is high and current soil moisture is adequate.',
    priority: 'HIGH', confidence: 0.87, status: 'ACTIVE',
    generatedAt: '2024-09-30T06:00:00Z', modelVersion: 'nv-rec-v1.0-demo'
  }]});
});

// GET /api/recommendations/:id/why — WHY Engine
recommendationRouter.get('/:id/why', (req, res) => {
  res.json({
    recommendationId: req.params.id,
    evidence: [
      { evidenceType: 'MEASURED', source: 'Weather Station (Demo)', metric: 'Rain Probability', value: '68', unit: '%', interpretation: 'Elevated chance of rainfall in the next 12 hours.', confidence: 0.85 },
      { evidenceType: 'MEASURED', source: 'Soil Sensor (Demo)', metric: 'Soil Moisture', value: '31', unit: '%', interpretation: 'Current soil moisture level is adequate for paddy at flowering stage.', confidence: 0.92 },
      { evidenceType: 'OBSERVED', source: 'Farm Profile', metric: 'Crop Stage', value: 'Flowering', unit: '', interpretation: 'Flowering is a critical water-sensitive stage.', confidence: 1.0 },
      { evidenceType: 'INFERRED', source: 'Satellite (Demo)', metric: 'Vegetation Stress', value: 'Low', unit: '', interpretation: 'Satellite data indicates low stress levels.', confidence: 0.78 },
    ],
    reasoning: 'Current soil moisture is adequate and rainfall probability is elevated. Immediate irrigation may provide limited additional benefit.',
    overallConfidence: 0.87,
    isDemoData: true,
  });
});

// GET /api/recommendations/:id/what-if — WHAT-IF Engine
recommendationRouter.get('/:id/what-if', (req, res) => {
  res.json({
    recommendationId: req.params.id,
    question: 'What if I irrigate today?',
    scenarioA: { label: 'Irrigate Today', soilCondition: 'Saturated — possible waterlogging', rainfallImpact: 'Combined with expected rain, excess water likely', waterUse: 'High — unnecessary consumption', cropRisk: 'Medium — over-watering risk at flowering', expectedEffect: 'Limited benefit, possible root stress', confidence: 0.82 },
    scenarioB: { label: 'Wait 2 Days', soilCondition: 'Stable — maintained by expected rain', rainfallImpact: 'Natural rainfall supplements soil moisture', waterUse: 'Low — conserve water', cropRisk: 'Low — natural conditions sufficient', expectedEffect: 'Optimal water use, reduced cost', confidence: 0.85 },
    assumptions: 'Based on current soil moisture (31%), expected rainfall probability (68%), and flowering stage water requirements.',
    isSimulation: true,
    isDemoData: true,
  });
});
