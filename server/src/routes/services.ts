// 🌾 Service & Marketplace Routes
import { Router } from 'express';
export const serviceRouter = Router();

// GET /api/services — List available services
serviceRouter.get('/', (_req, res) => {
  res.json({ services: [
    { id: 'svc-001', serviceType: 'HARVESTER', title: 'Combine Harvester — Paddy', provider: { businessName: 'Madurai Agri Services', rating: 4.5, verified: true }, priceType: 'PER_ACRE', price: 2500, availability: 'Oct-Nov' },
    { id: 'svc-002', serviceType: 'TRACTOR', title: 'Tractor + Ploughing', provider: { businessName: 'Dindigul Farm Equipment', rating: 4.2, verified: true }, priceType: 'PER_ACRE', price: 1800, availability: 'Year-round' },
    { id: 'svc-003', serviceType: 'SOIL_TESTING', title: 'Soil Testing — Full Panel', provider: { businessName: 'TN Agriculture Lab', rating: 4.8, verified: true }, priceType: 'FIXED', price: 450, availability: 'Year-round' },
    { id: 'svc-004', serviceType: 'SPRAYING', title: 'Drone Spraying Service', provider: { businessName: 'AgriDrone TN', rating: 4.6, verified: true }, priceType: 'PER_ACRE', price: 800, availability: 'Year-round' },
    { id: 'svc-005', serviceType: 'IRRIGATION', title: 'Drip Irrigation Installation', provider: { businessName: 'Water Smart Solutions', rating: 4.3, verified: true }, priceType: 'FIXED', price: 15000, availability: 'Year-round' },
  ], isDemoData: true });
});

// POST /api/services/request — Create service request
serviceRouter.post('/request', (req, res) => {
  const { serviceId, farmId, preferredDate, description } = req.body;
  res.status(201).json({
    serviceRequest: {
      id: 'sr-new-001', serviceId, farmId, preferredDate, description,
      status: 'PENDING', createdAt: new Date().toISOString()
    },
    message: 'Service request created. Provider will be notified.',
  });
});

// POST /api/services/book — Create booking
serviceRouter.post('/book', (req, res) => {
  const { serviceRequestId, agreedPrice } = req.body;
  const commissionRate = 0.05; // 5% — CONFIGURABLE
  const commission = Math.round(agreedPrice * commissionRate * 100) / 100;
  res.status(201).json({
    booking: {
      id: 'bk-new-001', serviceRequestId, agreedPrice,
      platformCommission: commission, providerAmount: agreedPrice - commission,
      commissionRate: `${commissionRate * 100}%`,
      status: 'CONFIRMED',
    },
    message: 'Booking confirmed. Commission is configurable.',
  });
});

// GET /api/services/bookings — List user bookings
serviceRouter.get('/bookings', (_req, res) => {
  res.json({ bookings: [
    { id: 'bk-001', service: 'Combine Harvester', provider: 'Madurai Agri Services', agreedPrice: 4500, platformCommission: 225, status: 'CONFIRMED', scheduledAt: '2024-11-15T06:00:00Z' }
  ], isDemoData: true });
});
