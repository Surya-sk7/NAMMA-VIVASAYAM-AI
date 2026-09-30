// 🌾 Crop Routes
import { Router } from 'express';
export const cropRouter = Router();

cropRouter.get('/', (_req, res) => {
  res.json({ crops: [{
    id: 'demo-crop-001', farmId: 'demo-farm-TN-MDU-024', cropName: 'Paddy', variety: 'IR 64',
    plantingDate: '2024-07-15', currentStage: 'FLOWERING', area: 1.8, status: 'ACTIVE'
  }]});
});

cropRouter.get('/:id', (req, res) => {
  res.json({ crop: { id: req.params.id, cropName: 'Paddy', variety: 'IR 64', currentStage: 'FLOWERING' }});
});

cropRouter.post('/', (req, res) => {
  res.status(201).json({ crop: { id: 'new-crop-id', ...req.body } });
});
