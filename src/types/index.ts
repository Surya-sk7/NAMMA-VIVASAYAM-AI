// ============================================================
// 🌾 NammaVivasayam AI — Core Type Definitions
// Agricultural Decision Intelligence Platform
// ============================================================

// --- Evidence Hierarchy ---
export type EvidenceType = 'MEASURED' | 'OBSERVED' | 'INFERRED' | 'UNKNOWN';

// --- User & Auth ---
export type UserRole = 'FARMER' | 'PROVIDER' | 'ORG_ADMIN' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferredLanguage: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Farm ---
export type IrrigationMethod = 'FLOOD' | 'DRIP' | 'SPRINKLER' | 'RAINFED' | 'CANAL' | 'BOREWELL' | 'OTHER';
export type SoilType = 'CLAY' | 'SANDY' | 'LOAM' | 'SILT' | 'RED' | 'BLACK' | 'ALLUVIAL' | 'LATERITE' | 'OTHER';
export type AreaUnit = 'ACRES' | 'HECTARES' | 'CENTS' | 'GUNTHA';

export interface Farm {
  id: string;
  ownerUserId: string;
  organizationId?: string;
  farmName: string;
  location: string;
  latitude: number;
  longitude: number;
  area: number;
  areaUnit: AreaUnit;
  irrigationMethod: IrrigationMethod;
  soilType?: SoilType;
  createdAt: string;
  updatedAt: string;
}

// --- Crop ---
export type CropStage = 'SEEDLING' | 'VEGETATIVE' | 'FLOWERING' | 'GRAIN_FILLING' | 'MATURITY' | 'HARVEST_READY' | 'HARVESTED';
export type CropStatus = 'ACTIVE' | 'HARVESTED' | 'FAILED' | 'ABANDONED';

export interface Crop {
  id: string;
  farmId: string;
  cropName: string;
  variety?: string;
  plantingDate: string;
  expectedHarvestDate?: string;
  currentStage: CropStage;
  area: number;
  status: CropStatus;
  createdAt: string;
  updatedAt: string;
}

// --- Soil ---
export type SoilSourceType = 'LAB_TEST' | 'REPORT_PHOTO' | 'VISUAL_PHOTO' | 'SENSOR' | 'FARMER_INPUT';

export interface SoilObservation {
  id: string;
  farmId: string;
  sourceType: SoilSourceType;
  evidenceType: EvidenceType;
  pH?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  moisture?: number;
  organicMatter?: number;
  texture?: string;
  imageUrl?: string;
  sourceDocumentUrl?: string;
  confidence?: number;
  observedAt: string;
  createdAt: string;
}

// --- Weather ---
export interface WeatherSnapshot {
  id: string;
  farmId: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  rainfallProbability: number;
  windSpeed: number;
  weatherCondition: string;
  forecastTime?: string;
  source: string;
  observedAt: string;
  createdAt: string;
}

// --- Satellite ---
export interface SatelliteObservation {
  id: string;
  farmId: string;
  vegetationIndex: number;
  stressIndex?: number;
  anomalyScore?: number;
  observationDate: string;
  source: string;
  confidence?: number;
  createdAt: string;
}

// --- Crop Health ---
export type ObservationType = 'PHOTO' | 'SYMPTOM_REPORT' | 'VISUAL_INSPECTION';

export interface CropHealthObservation {
  id: string;
  farmId: string;
  cropId: string;
  imageUrl?: string;
  observationType: ObservationType;
  symptoms: string;
  possibleIssue?: string;
  confidence?: number;
  evidenceType: EvidenceType;
  modelVersion?: string;
  createdAt: string;
}

// --- Recommendation ---
export type RecommendationType = 'IRRIGATION' | 'CROP_HEALTH' | 'WEATHER' | 'HARVEST' | 'RISK' | 'SERVICE' | 'GENERAL_FARM_ACTION';
export type RecommendationPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type RecommendationStatus = 'ACTIVE' | 'ACTED' | 'DISMISSED' | 'EXPIRED';

export interface Recommendation {
  id: string;
  farmId: string;
  cropId?: string;
  recommendationType: RecommendationType;
  title: string;
  description: string;
  priority: RecommendationPriority;
  confidence: number;
  status: RecommendationStatus;
  generatedAt: string;
  validUntil?: string;
  modelVersion?: string;
  createdAt: string;
}

// --- Recommendation Evidence ---
export interface RecommendationEvidence {
  id: string;
  recommendationId: string;
  evidenceType: EvidenceType;
  source: string;
  metric: string;
  value: string;
  unit?: string;
  interpretation: string;
  confidence?: number;
  createdAt: string;
}

// --- What-If ---
export interface WhatIfScenario {
  id: string;
  farmId: string;
  recommendationId?: string;
  question: string;
  scenarioA: string;
  scenarioB: string;
  resultA: WhatIfResult;
  resultB: WhatIfResult;
  assumptions: string;
  confidence: number;
  isSimulation: boolean;
  createdAt: string;
}

export interface WhatIfResult {
  soilCondition: string;
  rainfallImpact: string;
  waterUse: string;
  cropRisk: string;
  expectedEffect: string;
  confidence: number;
}

// --- Risk ---
export type RiskType = 'WATER_STRESS' | 'HEAT' | 'DISEASE' | 'PEST' | 'HEAVY_RAIN' | 'CROP_STRESS' | 'HARVEST';
export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskTrend = 'INCREASING' | 'STABLE' | 'DECREASING';
export type RiskStatus = 'ACTIVE' | 'RESOLVED' | 'EXPIRED';

export interface FarmRisk {
  id: string;
  farmId: string;
  cropId?: string;
  riskType: RiskType;
  severity: RiskSeverity;
  trend: RiskTrend;
  confidence: number;
  evidenceSummary: string;
  recommendedAction: string;
  detectedAt: string;
  expiresAt?: string;
  status: RiskStatus;
}

// --- Feedback ---
export type ActionTaken = 'DONE' | 'NOT_DONE' | 'PARTIALLY_DONE';
export type FeedbackOutcome = 'WORKED' | 'DID_NOT_WORK' | 'PARTIALLY_WORKED' | 'TOO_EARLY';

export interface FarmerFeedback {
  id: string;
  farmId: string;
  recommendationId?: string;
  actionTaken: ActionTaken;
  outcome?: FeedbackOutcome;
  feedbackText?: string;
  imageUrl?: string;
  createdAt: string;
}

// --- Farm Events (Timeline) ---
export type FarmEventType = 'PLANTING' | 'IRRIGATION' | 'FERTILIZER' | 'SPRAY' | 'HARVEST' | 'RECOMMENDATION' | 'OBSERVATION' | 'WEATHER_EVENT' | 'RISK_EVENT' | 'SERVICE_BOOKING' | 'SERVICE_COMPLETION' | 'FEEDBACK' | 'PHOTO';

export interface FarmEvent {
  id: string;
  farmId: string;
  eventType: FarmEventType;
  title: string;
  description: string;
  source: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  occurredAt: string;
  createdAt: string;
}

// --- Service Marketplace ---
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type ServicePriceType = 'FIXED' | 'PER_ACRE' | 'PER_HOUR' | 'NEGOTIABLE';
export type ServiceRequestStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type BookingStatus = 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Provider {
  id: string;
  userId: string;
  businessName: string;
  serviceCategory: string;
  description: string;
  serviceArea: string;
  verificationStatus: VerificationStatus;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  providerId: string;
  serviceType: string;
  title: string;
  description: string;
  priceType: ServicePriceType;
  price?: number;
  availability: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  farmId: string;
  farmerId: string;
  serviceId: string;
  recommendationId?: string;
  requestDescription: string;
  preferredDate: string;
  location: string;
  status: ServiceRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  serviceRequestId: string;
  providerId: string;
  farmerId: string;
  agreedPrice: number;
  platformCommission: number;
  status: BookingStatus;
  scheduledAt: string;
  completedAt?: string;
  createdAt: string;
}

// --- Transactions ---
export type TransactionType = 'SERVICE_PAYMENT' | 'COMMISSION' | 'REFUND';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface Transaction {
  id: string;
  bookingId?: string;
  payerId?: string;
  receiverId?: string;
  grossAmount: number;
  platformCommission: number;
  providerAmount: number;
  currency: string;
  status: TransactionStatus;
  transactionType: TransactionType;
  createdAt: string;
}

// --- Organization ---
export type OrganizationType = 'FPO' | 'COOPERATIVE' | 'AGRICULTURAL_ORGANIZATION';
export type SubscriptionPlan = 'BASIC' | 'STANDARD' | 'PREMIUM';
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'TRIAL';

export interface Organization {
  id: string;
  name: string;
  organizationType: OrganizationType;
  location: string;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionStatus?: SubscriptionStatus;
  createdAt: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: 'ADMIN' | 'MEMBER';
  joinedAt: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Subscription {
  id: string;
  organizationId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  billingReference?: string;
  createdAt: string;
}

// --- Feature Flags ---
export type FeatureFlagCategory = 'CORE' | 'OPTIONAL' | 'EXPERIMENTAL' | 'DEMO' | 'PROVIDER' | 'ORGANIZATION' | 'ADMIN';

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  category: FeatureFlagCategory;
  roles?: UserRole[];
}

// --- Farm Digital Twin ---
export interface FarmDigitalTwin {
  farm: Farm;
  crops: Crop[];
  latestSoil?: SoilObservation;
  latestWeather?: WeatherSnapshot;
  latestSatellite?: SatelliteObservation;
  latestCropHealth?: CropHealthObservation[];
  activeRisks: FarmRisk[];
  activeRecommendations: Recommendation[];
  recentEvents: FarmEvent[];
  recentFeedback: FarmerFeedback[];
}

// --- Pesu (Chat) ---
export interface PesuMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  language: string;
  context?: PesuContext;
  timestamp: string;
}

export interface PesuContext {
  farmId?: string;
  cropId?: string;
  weather?: WeatherSnapshot;
  soil?: SoilObservation;
  risks?: FarmRisk[];
  recommendation?: Recommendation;
}

// --- Navigation ---
export type FarmerTab = 'home' | 'farm' | 'pesu' | 'crop-doctor' | 'more';
export type ProviderTab = 'dashboard' | 'requests' | 'active' | 'completed' | 'earnings' | 'services' | 'profile';
export type OrgTab = 'overview' | 'farms' | 'risk' | 'trends' | 'reports' | 'services' | 'members' | 'subscription';

// --- App State ---
export interface AppState {
  user: User | null;
  farm: Farm | null;
  language: string;
  isDemoMode: boolean;
  isLoading: boolean;
  activeTab: FarmerTab;
}
