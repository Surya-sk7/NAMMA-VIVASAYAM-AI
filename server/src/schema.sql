-- ============================================================
-- 🌾 NammaVivasayam AI — PostgreSQL Database Schema
-- Agricultural Decision Intelligence Platform
-- ============================================================
-- WARNING: This schema creates tables with real constraints.
-- Run only on the intended database.
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    preferred_language VARCHAR(5) NOT NULL DEFAULT 'ta',
    role VARCHAR(20) NOT NULL DEFAULT 'FARMER'
        CHECK (role IN ('FARMER', 'PROVIDER', 'ORG_ADMIN', 'ADMIN')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================
-- FARMS
-- ============================================================
CREATE TABLE farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID,  -- nullable, set after org join
    farm_name VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    area DECIMAL(10, 2) NOT NULL,
    area_unit VARCHAR(20) NOT NULL DEFAULT 'ACRES'
        CHECK (area_unit IN ('ACRES', 'HECTARES', 'CENTS', 'GUNTHA')),
    irrigation_method VARCHAR(30)
        CHECK (irrigation_method IN ('FLOOD', 'DRIP', 'SPRINKLER', 'RAINFED', 'CANAL', 'BOREWELL', 'OTHER')),
    soil_type VARCHAR(30)
        CHECK (soil_type IN ('CLAY', 'SANDY', 'LOAM', 'SILT', 'RED', 'BLACK', 'ALLUVIAL', 'LATERITE', 'OTHER')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_farms_owner ON farms(owner_user_id);
CREATE INDEX idx_farms_org ON farms(organization_id);

-- ============================================================
-- CROPS
-- ============================================================
CREATE TABLE crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    crop_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    planting_date DATE NOT NULL,
    expected_harvest_date DATE,
    current_stage VARCHAR(30) NOT NULL DEFAULT 'SEEDLING'
        CHECK (current_stage IN ('SEEDLING', 'VEGETATIVE', 'FLOWERING', 'GRAIN_FILLING', 'MATURITY', 'HARVEST_READY', 'HARVESTED')),
    area DECIMAL(10, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'HARVESTED', 'FAILED', 'ABANDONED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_crops_farm ON crops(farm_id);
CREATE INDEX idx_crops_status ON crops(status);

-- ============================================================
-- SOIL OBSERVATIONS
-- ============================================================
CREATE TABLE soil_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    source_type VARCHAR(30) NOT NULL
        CHECK (source_type IN ('LAB_TEST', 'REPORT_PHOTO', 'VISUAL_PHOTO', 'SENSOR', 'FARMER_INPUT')),
    evidence_type VARCHAR(20) NOT NULL
        CHECK (evidence_type IN ('MEASURED', 'OBSERVED', 'INFERRED', 'UNKNOWN')),
    ph DECIMAL(4, 2),
    nitrogen DECIMAL(10, 2),
    phosphorus DECIMAL(10, 2),
    potassium DECIMAL(10, 2),
    moisture DECIMAL(5, 2),
    organic_matter DECIMAL(5, 2),
    texture VARCHAR(50),
    image_url TEXT,
    source_document_url TEXT,
    confidence DECIMAL(3, 2),
    observed_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_soil_farm ON soil_observations(farm_id);
CREATE INDEX idx_soil_observed ON soil_observations(observed_at DESC);

-- ============================================================
-- WEATHER SNAPSHOTS
-- ============================================================
CREATE TABLE weather_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    temperature DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    rainfall DECIMAL(7, 2),
    rainfall_probability DECIMAL(5, 2),
    wind_speed DECIMAL(5, 2),
    weather_condition VARCHAR(50),
    forecast_time TIMESTAMPTZ,
    source VARCHAR(50) NOT NULL,
    observed_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_weather_farm ON weather_snapshots(farm_id);
CREATE INDEX idx_weather_observed ON weather_snapshots(observed_at DESC);

-- ============================================================
-- SATELLITE OBSERVATIONS
-- ============================================================
CREATE TABLE satellite_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    vegetation_index DECIMAL(5, 3),
    stress_index DECIMAL(5, 3),
    anomaly_score DECIMAL(5, 3),
    observation_date DATE NOT NULL,
    source VARCHAR(50) NOT NULL,
    confidence DECIMAL(3, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_satellite_farm ON satellite_observations(farm_id);

-- ============================================================
-- CROP HEALTH OBSERVATIONS
-- ============================================================
CREATE TABLE crop_health_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    crop_id UUID REFERENCES crops(id),
    image_url TEXT,
    observation_type VARCHAR(30) NOT NULL
        CHECK (observation_type IN ('PHOTO', 'SYMPTOM_REPORT', 'VISUAL_INSPECTION')),
    symptoms TEXT NOT NULL,
    possible_issue TEXT,
    confidence DECIMAL(3, 2),
    evidence_type VARCHAR(20) NOT NULL
        CHECK (evidence_type IN ('MEASURED', 'OBSERVED', 'INFERRED', 'UNKNOWN')),
    model_version VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_crophealth_farm ON crop_health_observations(farm_id);
CREATE INDEX idx_crophealth_crop ON crop_health_observations(crop_id);

-- ============================================================
-- RECOMMENDATIONS
-- ============================================================
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    crop_id UUID REFERENCES crops(id),
    recommendation_type VARCHAR(30) NOT NULL
        CHECK (recommendation_type IN ('IRRIGATION', 'CROP_HEALTH', 'WEATHER', 'HARVEST', 'RISK', 'SERVICE', 'GENERAL_FARM_ACTION')),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(10) NOT NULL DEFAULT 'MEDIUM'
        CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    confidence DECIMAL(3, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'ACTED', 'DISMISSED', 'EXPIRED')),
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    model_version VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rec_farm ON recommendations(farm_id);
CREATE INDEX idx_rec_status ON recommendations(status);
CREATE INDEX idx_rec_type ON recommendations(recommendation_type);

-- ============================================================
-- RECOMMENDATION EVIDENCE (Powers the WHY Engine)
-- ============================================================
CREATE TABLE recommendation_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recommendation_id UUID NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
    evidence_type VARCHAR(20) NOT NULL
        CHECK (evidence_type IN ('MEASURED', 'OBSERVED', 'INFERRED', 'UNKNOWN')),
    source VARCHAR(100) NOT NULL,
    metric VARCHAR(100) NOT NULL,
    value VARCHAR(100) NOT NULL,
    unit VARCHAR(30),
    interpretation TEXT NOT NULL,
    confidence DECIMAL(3, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_evidence_rec ON recommendation_evidence(recommendation_id);

-- ============================================================
-- WHAT-IF SCENARIOS
-- ============================================================
CREATE TABLE what_if_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    recommendation_id UUID REFERENCES recommendations(id),
    question TEXT NOT NULL,
    scenario_a TEXT NOT NULL,
    scenario_b TEXT NOT NULL,
    result_a JSONB NOT NULL,
    result_b JSONB NOT NULL,
    assumptions TEXT NOT NULL,
    confidence DECIMAL(3, 2) NOT NULL,
    is_simulation BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_whatif_farm ON what_if_scenarios(farm_id);

-- ============================================================
-- FARM RISKS
-- ============================================================
CREATE TABLE farm_risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    crop_id UUID REFERENCES crops(id),
    risk_type VARCHAR(30) NOT NULL
        CHECK (risk_type IN ('WATER_STRESS', 'HEAT', 'DISEASE', 'PEST', 'HEAVY_RAIN', 'CROP_STRESS', 'HARVEST')),
    severity VARCHAR(10) NOT NULL
        CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    trend VARCHAR(15) NOT NULL
        CHECK (trend IN ('INCREASING', 'STABLE', 'DECREASING')),
    confidence DECIMAL(3, 2) NOT NULL,
    evidence_summary TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'RESOLVED', 'EXPIRED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_risks_farm ON farm_risks(farm_id);
CREATE INDEX idx_risks_status ON farm_risks(status);
CREATE INDEX idx_risks_type ON farm_risks(risk_type);

-- ============================================================
-- FARMER FEEDBACK
-- ============================================================
CREATE TABLE farmer_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    recommendation_id UUID REFERENCES recommendations(id),
    action_taken VARCHAR(20) NOT NULL
        CHECK (action_taken IN ('DONE', 'NOT_DONE', 'PARTIALLY_DONE')),
    outcome VARCHAR(20)
        CHECK (outcome IN ('WORKED', 'DID_NOT_WORK', 'PARTIALLY_WORKED', 'TOO_EARLY')),
    feedback_text TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_feedback_farm ON farmer_feedback(farm_id);
CREATE INDEX idx_feedback_rec ON farmer_feedback(recommendation_id);

-- ============================================================
-- FARM EVENTS (Timeline)
-- ============================================================
CREATE TABLE farm_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    event_type VARCHAR(30) NOT NULL
        CHECK (event_type IN ('PLANTING', 'IRRIGATION', 'FERTILIZER', 'SPRAY', 'HARVEST', 
            'RECOMMENDATION', 'OBSERVATION', 'WEATHER_EVENT', 'RISK_EVENT', 
            'SERVICE_BOOKING', 'SERVICE_COMPLETION', 'FEEDBACK', 'PHOTO')),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    source VARCHAR(50) NOT NULL,
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    occurred_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_farm ON farm_events(farm_id);
CREATE INDEX idx_events_occurred ON farm_events(occurred_at DESC);
CREATE INDEX idx_events_type ON farm_events(event_type);

-- ============================================================
-- PROVIDERS
-- ============================================================
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(200) NOT NULL,
    service_category VARCHAR(50) NOT NULL,
    description TEXT,
    service_area VARCHAR(200),
    verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    rating DECIMAL(3, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_providers_user ON providers(user_id);
CREATE INDEX idx_providers_category ON providers(service_category);

-- ============================================================
-- SERVICES
-- ============================================================
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price_type VARCHAR(20) NOT NULL
        CHECK (price_type IN ('FIXED', 'PER_ACRE', 'PER_HOUR', 'NEGOTIABLE')),
    price DECIMAL(10, 2),
    availability VARCHAR(200),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_provider ON services(provider_id);

-- ============================================================
-- SERVICE REQUESTS
-- ============================================================
CREATE TABLE service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id),
    farmer_id UUID NOT NULL REFERENCES users(id),
    service_id UUID NOT NULL REFERENCES services(id),
    recommendation_id UUID REFERENCES recommendations(id),
    request_description TEXT NOT NULL,
    preferred_date DATE,
    location VARCHAR(200),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sr_farm ON service_requests(farm_id);
CREATE INDEX idx_sr_farmer ON service_requests(farmer_id);
CREATE INDEX idx_sr_status ON service_requests(status);

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_request_id UUID NOT NULL REFERENCES service_requests(id),
    provider_id UUID NOT NULL REFERENCES providers(id),
    farmer_id UUID NOT NULL REFERENCES users(id),
    agreed_price DECIMAL(10, 2) NOT NULL,
    platform_commission DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED'
        CHECK (status IN ('CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    scheduled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_farmer ON bookings(farmer_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ============================================================
-- TRANSACTIONS
-- ============================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    payer_id UUID REFERENCES users(id),
    receiver_id UUID REFERENCES users(id),
    gross_amount DECIMAL(10, 2) NOT NULL,
    platform_commission DECIMAL(10, 2) NOT NULL,
    provider_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(5) NOT NULL DEFAULT 'INR',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    transaction_type VARCHAR(20) NOT NULL
        CHECK (transaction_type IN ('SERVICE_PAYMENT', 'COMMISSION', 'REFUND')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_txn_booking ON transactions(booking_id);
CREATE INDEX idx_txn_payer ON transactions(payer_id);
CREATE INDEX idx_txn_type ON transactions(transaction_type);

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    organization_type VARCHAR(30) NOT NULL
        CHECK (organization_type IN ('FPO', 'COOPERATIVE', 'AGRICULTURAL_ORGANIZATION')),
    location VARCHAR(200),
    subscription_plan VARCHAR(20)
        CHECK (subscription_plan IN ('BASIC', 'STANDARD', 'PREMIUM')),
    subscription_status VARCHAR(20)
        CHECK (subscription_status IN ('ACTIVE', 'EXPIRED', 'CANCELLED', 'TRIAL')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key from farms to organizations
ALTER TABLE farms
    ADD CONSTRAINT fk_farms_org FOREIGN KEY (organization_id) REFERENCES organizations(id);

-- ============================================================
-- ORGANIZATION MEMBERS
-- ============================================================
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER'
        CHECK (role IN ('ADMIN', 'MEMBER')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),
    UNIQUE(organization_id, user_id)
);

CREATE INDEX idx_orgmembers_org ON organization_members(organization_id);
CREATE INDEX idx_orgmembers_user ON organization_members(user_id);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan VARCHAR(20) NOT NULL
        CHECK (plan IN ('BASIC', 'STANDARD', 'PREMIUM')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED', 'TRIAL')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    billing_reference VARCHAR(200),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sub_org ON subscriptions(organization_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ============================================================
-- PLATFORM CONFIGURATION (for configurable commission etc.)
-- ============================================================
CREATE TABLE platform_config (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default commission configuration
INSERT INTO platform_config (key, value, description) VALUES
    ('commission_percentage', '5.0', 'Default platform commission percentage. CONFIGURABLE — never hardcoded.'),
    ('free_farmer_features', '["farm_profile", "recommendations", "why_engine", "what_if", "crop_doctor", "pesu", "risk_radar", "feedback", "timeline"]', 'Features included in Free Farmer plan'),
    ('supported_languages', '["ta", "en", "hi", "kn", "te", "ml"]', 'Supported platform languages');

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON farms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crops_updated_at BEFORE UPDATE ON crops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sr_updated_at BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 🌾 Schema Complete
-- Tables: 22 | Indexes: 30+ | Triggers: 5 | Constraints: Full
-- Ready for NammaVivasayam AI
-- ============================================================
