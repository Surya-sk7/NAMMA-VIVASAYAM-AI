// ============================================================
// 🌾 NammaVivasayam AI — Demo Data
// DEMO MODE: All values are simulated, never present as real
// ============================================================

import type {
  User, Farm, Crop, SoilObservation, WeatherSnapshot,
  SatelliteObservation, Recommendation, RecommendationEvidence,
  FarmRisk, WhatIfScenario, FarmEvent, CropHealthObservation,
  Provider, Service, ServiceRequest, Booking,
  Transaction
} from '../types';

// --- Demo User ---
export const demoUser: User = {
  id: 'demo-user-001',
  name: 'முருகன்',
  phone: '+91 98765 43210',
  email: 'murugan@demo.nv.ai',
  preferredLanguage: 'ta',
  role: 'FARMER',
  status: 'ACTIVE',
  createdAt: '2024-06-01T00:00:00Z',
  updatedAt: '2024-09-30T00:00:00Z',
};

// --- Demo Farm ---
export const demoFarm: Farm = {
  id: 'demo-farm-TN-MDU-024',
  ownerUserId: 'demo-user-001',
  farmName: 'FIELD #TN-MDU-024',
  location: 'Madurai, Tamil Nadu',
  latitude: 9.9252,
  longitude: 78.1198,
  area: 1.8,
  areaUnit: 'ACRES',
  irrigationMethod: 'CANAL',
  soilType: 'ALLUVIAL',
  createdAt: '2024-06-01T00:00:00Z',
  updatedAt: '2024-09-30T00:00:00Z',
};

// --- Demo Crop ---
export const demoCrop: Crop = {
  id: 'demo-crop-001',
  farmId: 'demo-farm-TN-MDU-024',
  cropName: 'Paddy',
  variety: 'IR 64',
  plantingDate: '2024-07-15',
  expectedHarvestDate: '2024-11-15',
  currentStage: 'FLOWERING',
  area: 1.8,
  status: 'ACTIVE',
  createdAt: '2024-07-15T00:00:00Z',
  updatedAt: '2024-09-30T00:00:00Z',
};

// --- Demo Soil ---
export const demoSoil: SoilObservation = {
  id: 'demo-soil-001',
  farmId: 'demo-farm-TN-MDU-024',
  sourceType: 'LAB_TEST',
  evidenceType: 'MEASURED',
  pH: 6.8,
  nitrogen: 245,
  phosphorus: 18,
  potassium: 210,
  moisture: 31,
  organicMatter: 2.1,
  texture: 'Clay Loam',
  confidence: 0.92,
  observedAt: '2024-09-28T08:00:00Z',
  createdAt: '2024-09-28T08:00:00Z',
};

// --- Demo Weather ---
export const demoWeather: WeatherSnapshot = {
  id: 'demo-weather-001',
  farmId: 'demo-farm-TN-MDU-024',
  temperature: 34,
  humidity: 72,
  rainfall: 0,
  rainfallProbability: 68,
  windSpeed: 12,
  weatherCondition: 'Partly Cloudy',
  forecastTime: '2024-09-30T18:00:00Z',
  source: 'DEMO_WEATHER_ADAPTER',
  observedAt: '2024-09-30T09:00:00Z',
  createdAt: '2024-09-30T09:00:00Z',
};

// --- Demo Satellite ---
export const demoSatellite: SatelliteObservation = {
  id: 'demo-satellite-001',
  farmId: 'demo-farm-TN-MDU-024',
  vegetationIndex: 0.62,
  stressIndex: 0.25,
  anomalyScore: 0.18,
  observationDate: '2024-09-29',
  source: 'DEMO_SATELLITE_ADAPTER',
  confidence: 0.78,
  createdAt: '2024-09-29T00:00:00Z',
};

// --- Demo Primary Recommendation ---
export const demoRecommendation: Recommendation = {
  id: 'demo-rec-001',
  farmId: 'demo-farm-TN-MDU-024',
  cropId: 'demo-crop-001',
  recommendationType: 'IRRIGATION',
  title: "Don't irrigate today.",
  description: 'Rain probability is high and current soil moisture is adequate.',
  priority: 'HIGH',
  confidence: 0.87,
  status: 'ACTIVE',
  generatedAt: '2024-09-30T06:00:00Z',
  validUntil: '2024-09-30T23:59:59Z',
  modelVersion: 'nv-rec-v1.0-demo',
  createdAt: '2024-09-30T06:00:00Z',
};

// --- Demo Evidence ---
export const demoEvidence: RecommendationEvidence[] = [
  {
    id: 'demo-ev-001',
    recommendationId: 'demo-rec-001',
    evidenceType: 'MEASURED',
    source: 'Weather Station (Demo)',
    metric: 'Rain Probability',
    value: '68',
    unit: '%',
    interpretation: 'Elevated chance of rainfall in the next 12 hours.',
    confidence: 0.85,
    createdAt: '2024-09-30T06:00:00Z',
  },
  {
    id: 'demo-ev-002',
    recommendationId: 'demo-rec-001',
    evidenceType: 'MEASURED',
    source: 'Soil Sensor (Demo)',
    metric: 'Soil Moisture',
    value: '31',
    unit: '%',
    interpretation: 'Current soil moisture level is adequate for paddy at flowering stage.',
    confidence: 0.92,
    createdAt: '2024-09-30T06:00:00Z',
  },
  {
    id: 'demo-ev-003',
    recommendationId: 'demo-rec-001',
    evidenceType: 'OBSERVED',
    source: 'Farm Profile',
    metric: 'Crop',
    value: 'Paddy',
    unit: '',
    interpretation: 'Paddy at flowering stage requires careful water management.',
    confidence: 1.0,
    createdAt: '2024-09-30T06:00:00Z',
  },
  {
    id: 'demo-ev-004',
    recommendationId: 'demo-rec-001',
    evidenceType: 'OBSERVED',
    source: 'Farm Profile',
    metric: 'Crop Stage',
    value: 'Flowering',
    unit: '',
    interpretation: 'Flowering is a critical water-sensitive stage.',
    confidence: 1.0,
    createdAt: '2024-09-30T06:00:00Z',
  },
  {
    id: 'demo-ev-005',
    recommendationId: 'demo-rec-001',
    evidenceType: 'INFERRED',
    source: 'Satellite (Demo)',
    metric: 'Vegetation Stress',
    value: 'Low',
    unit: '',
    interpretation: 'Satellite data indicates low stress levels on the crop canopy.',
    confidence: 0.78,
    createdAt: '2024-09-30T06:00:00Z',
  },
];

// --- Demo What-If ---
export const demoWhatIf: WhatIfScenario = {
  id: 'demo-whatif-001',
  farmId: 'demo-farm-TN-MDU-024',
  recommendationId: 'demo-rec-001',
  question: 'What if I irrigate today?',
  scenarioA: 'Irrigate Today',
  scenarioB: 'Wait 2 Days',
  resultA: {
    soilCondition: 'Saturated — possible waterlogging',
    rainfallImpact: 'Combined with expected rain, excess water likely',
    waterUse: 'High — unnecessary consumption',
    cropRisk: 'Medium — over-watering risk at flowering',
    expectedEffect: 'Limited benefit, possible root stress',
    confidence: 0.82,
  },
  resultB: {
    soilCondition: 'Stable — maintained by expected rain',
    rainfallImpact: 'Natural rainfall supplements soil moisture',
    waterUse: 'Low — conserve water for later',
    cropRisk: 'Low — natural conditions sufficient',
    expectedEffect: 'Optimal water use, reduced cost',
    confidence: 0.85,
  },
  assumptions: 'Based on current soil moisture (31%), expected rainfall probability (68%), and flowering stage water requirements.',
  confidence: 0.84,
  isSimulation: true,
  createdAt: '2024-09-30T06:00:00Z',
};

// --- Demo Risks ---
export const demoRisks: FarmRisk[] = [
  {
    id: 'demo-risk-001', farmId: 'demo-farm-TN-MDU-024', cropId: 'demo-crop-001',
    riskType: 'WATER_STRESS', severity: 'MEDIUM', trend: 'INCREASING', confidence: 0.80,
    evidenceSummary: 'Soil moisture is declining. Monitor closely.',
    recommendedAction: 'Monitor soil moisture. Irrigate if rain does not arrive within 48 hours.',
    detectedAt: '2024-09-30T06:00:00Z', status: 'ACTIVE',
  },
  {
    id: 'demo-risk-002', farmId: 'demo-farm-TN-MDU-024', cropId: 'demo-crop-001',
    riskType: 'HEAT', severity: 'MEDIUM', trend: 'STABLE', confidence: 0.75,
    evidenceSummary: 'Temperature at 34°C. Close to stress threshold for paddy at flowering.',
    recommendedAction: 'Ensure adequate water availability. Consider shade measures if prolonged.',
    detectedAt: '2024-09-30T06:00:00Z', status: 'ACTIVE',
  },
  {
    id: 'demo-risk-003', farmId: 'demo-farm-TN-MDU-024', cropId: 'demo-crop-001',
    riskType: 'DISEASE', severity: 'LOW', trend: 'STABLE', confidence: 0.65,
    evidenceSummary: 'No disease indicators detected. Humidity levels are elevated.',
    recommendedAction: 'Continue regular monitoring. Watch for leaf discoloration.',
    detectedAt: '2024-09-30T06:00:00Z', status: 'ACTIVE',
  },
  {
    id: 'demo-risk-004', farmId: 'demo-farm-TN-MDU-024', cropId: 'demo-crop-001',
    riskType: 'PEST', severity: 'LOW', trend: 'STABLE', confidence: 0.60,
    evidenceSummary: 'No pest activity detected in recent observations.',
    recommendedAction: 'Maintain field hygiene. Check regularly.',
    detectedAt: '2024-09-30T06:00:00Z', status: 'ACTIVE',
  },
  {
    id: 'demo-risk-005', farmId: 'demo-farm-TN-MDU-024',
    riskType: 'HEAVY_RAIN', severity: 'MEDIUM', trend: 'INCREASING', confidence: 0.68,
    evidenceSummary: 'Rain probability is 68%. Expected rainfall ~4mm.',
    recommendedAction: 'Ensure drainage channels are clear.',
    detectedAt: '2024-09-30T06:00:00Z', status: 'ACTIVE',
  },
  {
    id: 'demo-risk-006', farmId: 'demo-farm-TN-MDU-024', cropId: 'demo-crop-001',
    riskType: 'CROP_STRESS', severity: 'LOW', trend: 'STABLE', confidence: 0.72,
    evidenceSummary: 'Satellite vegetation index is moderate. No significant stress zones.',
    recommendedAction: 'Continue current management practices.',
    detectedAt: '2024-09-30T06:00:00Z', status: 'ACTIVE',
  },
  {
    id: 'demo-risk-007', farmId: 'demo-farm-TN-MDU-024', cropId: 'demo-crop-001',
    riskType: 'HARVEST', severity: 'LOW', trend: 'INCREASING', confidence: 0.70,
    evidenceSummary: 'Crop is at flowering stage. Estimated 45-50 days to harvest readiness.',
    recommendedAction: 'Plan harvesting resources. Monitor grain filling progress.',
    detectedAt: '2024-09-30T06:00:00Z', status: 'ACTIVE',
  },
];

// --- Demo Crop Health ---
export const demoCropHealth: CropHealthObservation = {
  id: 'demo-crophealth-001',
  farmId: 'demo-farm-TN-MDU-024',
  cropId: 'demo-crop-001',
  observationType: 'VISUAL_INSPECTION',
  symptoms: 'Slight yellowing on lower leaves',
  possibleIssue: 'Minor nitrogen deficiency or natural aging of lower leaves',
  confidence: 0.72,
  evidenceType: 'INFERRED',
  modelVersion: 'nv-crop-v1.0-demo',
  createdAt: '2024-09-29T10:00:00Z',
};

// --- Demo Farm Events ---
export const demoEvents: FarmEvent[] = [
  { id: 'de-01', farmId: 'demo-farm-TN-MDU-024', eventType: 'PLANTING', title: 'Paddy planted', description: 'IR 64 variety planted across 1.8 acres', source: 'Farmer', occurredAt: '2024-07-15T06:00:00Z', createdAt: '2024-07-15T06:00:00Z' },
  { id: 'de-02', farmId: 'demo-farm-TN-MDU-024', eventType: 'IRRIGATION', title: 'First irrigation', description: 'Canal water used for initial flooding', source: 'Farmer', occurredAt: '2024-07-16T07:00:00Z', createdAt: '2024-07-16T07:00:00Z' },
  { id: 'de-03', farmId: 'demo-farm-TN-MDU-024', eventType: 'FERTILIZER', title: 'Urea applied', description: 'First dose of urea applied - 20kg/acre', source: 'Farmer', occurredAt: '2024-07-30T08:00:00Z', createdAt: '2024-07-30T08:00:00Z' },
  { id: 'de-04', farmId: 'demo-farm-TN-MDU-024', eventType: 'RECOMMENDATION', title: 'Reduce water level', description: 'System recommended reducing standing water depth during tillering', source: 'NammaVivasayam AI', occurredAt: '2024-08-20T06:00:00Z', createdAt: '2024-08-20T06:00:00Z' },
  { id: 'de-05', farmId: 'demo-farm-TN-MDU-024', eventType: 'WEATHER_EVENT', title: 'Heavy rainfall', description: '32mm rainfall recorded over 6 hours', source: 'Weather Adapter', occurredAt: '2024-09-10T14:00:00Z', createdAt: '2024-09-10T14:00:00Z' },
  { id: 'de-06', farmId: 'demo-farm-TN-MDU-024', eventType: 'OBSERVATION', title: 'Flowering started', description: 'Farmer observed first panicle emergence', source: 'Farmer', occurredAt: '2024-09-22T07:00:00Z', createdAt: '2024-09-22T07:00:00Z' },
  { id: 'de-07', farmId: 'demo-farm-TN-MDU-024', eventType: 'RECOMMENDATION', title: 'Wait before irrigating', description: 'Rain expected, soil moisture adequate', source: 'NammaVivasayam AI', occurredAt: '2024-09-30T06:00:00Z', createdAt: '2024-09-30T06:00:00Z' },
];

// --- Demo Provider ---
export const demoProvider: Provider = {
  id: 'demo-provider-001',
  userId: 'demo-provider-user-001',
  businessName: 'Madurai Agri Services',
  serviceCategory: 'HARVESTER',
  description: 'Professional combine harvester service for paddy and other crops. 5+ years experience in Madurai region.',
  serviceArea: 'Madurai, Sivagangai, Dindigul',
  verificationStatus: 'VERIFIED',
  rating: 4.5,
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-09-30T00:00:00Z',
};

export const demoService: Service = {
  id: 'demo-service-001',
  providerId: 'demo-provider-001',
  serviceType: 'HARVESTER',
  title: 'Combine Harvester — Paddy',
  description: 'Professional paddy harvesting with modern combine harvester. Includes grain collection and straw management.',
  priceType: 'PER_ACRE',
  price: 2500,
  availability: 'Available Oct-Nov',
  status: 'ACTIVE',
  createdAt: '2024-01-15T00:00:00Z',
};

export const demoServiceRequest: ServiceRequest = {
  id: 'demo-sr-001',
  farmId: 'demo-farm-TN-MDU-024',
  farmerId: 'demo-user-001',
  serviceId: 'demo-service-001',
  requestDescription: 'Need harvester for 1.8 acres paddy. Crop expected to be ready mid-November.',
  preferredDate: '2024-11-15',
  location: 'Madurai, Tamil Nadu',
  status: 'PENDING',
  createdAt: '2024-09-30T10:00:00Z',
  updatedAt: '2024-09-30T10:00:00Z',
};

export const demoBooking: Booking = {
  id: 'demo-booking-001',
  serviceRequestId: 'demo-sr-001',
  providerId: 'demo-provider-001',
  farmerId: 'demo-user-001',
  agreedPrice: 4500,
  platformCommission: 225,
  status: 'CONFIRMED',
  scheduledAt: '2024-11-15T06:00:00Z',
  createdAt: '2024-09-30T12:00:00Z',
};

export const demoTransaction: Transaction = {
  id: 'demo-txn-001',
  bookingId: 'demo-booking-001',
  payerId: 'demo-user-001',
  receiverId: 'demo-provider-001',
  grossAmount: 4500,
  platformCommission: 225,
  providerAmount: 4275,
  currency: 'INR',
  status: 'COMPLETED',
  transactionType: 'SERVICE_PAYMENT',
  createdAt: '2024-11-15T18:00:00Z',
};

// --- Demo Pesu Responses ---
export const demoPesuResponses: Record<string, { ta: string; en: string }> = {
  irrigation: {
    ta: 'இன்றைய நிலவரப்படி, மழை வருவதற்கான வாய்ப்பு 68% ஆக உள்ளது. உங்கள் நிலத்தின் ஈரப்பதம் 31% ஆக உள்ளது, இது நெல் பூக்கும் நிலைக்கு போதுமானது. நாளை வரை காத்திருப்பது நல்லது. மழை வந்தால் தண்ணீர் சேமிக்கலாம்.',
    en: "Based on today's conditions, rain probability is 68%. Your soil moisture is at 31%, which is adequate for paddy at flowering stage. It would be better to wait until tomorrow. If rain arrives, you can save water.",
  },
  yellowLeaves: {
    ta: 'நெல்லின் கீழ் இலைகள் மஞ்சளாவது சில நேரங்களில் இயற்கையானது, குறிப்பாக பூக்கும் நிலையில். ஆனால் மேல் இலைகளும் மஞ்சளாக ஆரம்பித்தால், நைட்ரஜன் பற்றாக்குறையாக இருக்கலாம். உரம் இடுவதை பற்றி சிந்தியுங்கள். ஒரு புகைப்படம் எடுத்து பயிர் மருத்துவரிடம் காட்டுங்கள்.',
    en: 'Yellowing of lower leaves in paddy can be natural during flowering. However, if upper leaves also start yellowing, it may indicate nitrogen deficiency. Consider applying fertilizer. Take a photo and show it to Crop Doctor for a detailed assessment.',
  },
  rain: {
    ta: 'வானிலை தகவல்படி, இன்று மாலை மழை வருவதற்கான வாய்ப்பு 68% உள்ளது. எதிர்பார்க்கப்படும் மழையளவு சுமார் 4 மி.மீ. வடிகால் வாய்க்கால்கள் சரியாக இருக்கிறதா என்று பாருங்கள்.',
    en: "According to weather data, there's a 68% chance of rain this evening. Expected rainfall is approximately 4mm. Please check that drainage channels are clear.",
  },
  whatToDo: {
    ta: 'உங்கள் நெல் இப்போது பூக்கும் நிலையில் உள்ளது. முக்கியமான விஷயங்கள்:\n\n1. 💧 இன்று தண்ணீர் பாய்ச்ச வேண்டாம் — மழை வாய்ப்பு அதிகம்\n2. 🌡 வெப்பநிலை 34°C — கவனமாக கண்காணியுங்கள்\n3. 🌾 பூக்கும் நிலை — தண்ணீர் மேலாண்மை மிக முக்கியம்\n4. 🦠 நோய் அபாயம் குறைவு — ஆனால் ஈரப்பதம் அதிகம், கவனம் தேவை',
    en: "Your paddy is currently at flowering stage. Key actions:\n\n1. 💧 Don't irrigate today — rain probability is high\n2. 🌡 Temperature at 34°C — monitor closely\n3. 🌾 Flowering stage — water management is critical\n4. 🦠 Disease risk is low — but humidity is high, stay vigilant",
  },
};
