// ============================================================
// 🌾 NammaVivasayam AI — Data Provider Adapters
// Interface + Mock implementations for external services
// Architecture: Adapter pattern — swap mocks for real APIs later
// ============================================================

// --- Weather Adapter ---
export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  rainfallProbability: number;
  windSpeed: number;
  weatherCondition: string;
  forecastTime?: string;
  source: string;
}

export interface WeatherAdapter {
  getCurrentWeather(lat: number, lon: number): Promise<WeatherData>;
  getForecast(lat: number, lon: number, days: number): Promise<WeatherData[]>;
}

export class MockWeatherAdapter implements WeatherAdapter {
  async getCurrentWeather(_lat: number, _lon: number): Promise<WeatherData> {
    return {
      temperature: 34,
      humidity: 72,
      rainfall: 0,
      rainfallProbability: 68,
      windSpeed: 12,
      weatherCondition: 'Partly Cloudy',
      source: 'DEMO_WEATHER_ADAPTER',
    };
  }
  async getForecast(_lat: number, _lon: number, days: number): Promise<WeatherData[]> {
    return Array.from({ length: days }, (_, i) => ({
      temperature: 32 + Math.random() * 4,
      humidity: 65 + Math.random() * 15,
      rainfall: Math.random() > 0.6 ? Math.random() * 10 : 0,
      rainfallProbability: 40 + Math.random() * 40,
      windSpeed: 8 + Math.random() * 10,
      weatherCondition: Math.random() > 0.5 ? 'Partly Cloudy' : 'Cloudy',
      forecastTime: new Date(Date.now() + (i + 1) * 86400000).toISOString(),
      source: 'DEMO_WEATHER_ADAPTER',
    }));
  }
}

// --- Satellite Adapter ---
export interface SatelliteData {
  vegetationIndex: number;
  stressIndex?: number;
  anomalyScore?: number;
  observationDate: string;
  source: string;
  confidence?: number;
}

export interface SatelliteAdapter {
  getLatestObservation(lat: number, lon: number): Promise<SatelliteData>;
}

export class MockSatelliteAdapter implements SatelliteAdapter {
  async getLatestObservation(_lat: number, _lon: number): Promise<SatelliteData> {
    return {
      vegetationIndex: 0.62,
      stressIndex: 0.25,
      anomalyScore: 0.18,
      observationDate: new Date().toISOString().split('T')[0],
      source: 'DEMO_SATELLITE_ADAPTER',
      confidence: 0.78,
    };
  }
}

// --- Soil Adapter ---
export interface SoilAnalysisResult {
  pH?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  organicMatter?: number;
  texture?: string;
  confidence: number;
}

export interface SoilAdapter {
  analyzeReportPhoto(imageUrl: string): Promise<SoilAnalysisResult>;
  analyzeVisualPhoto(imageUrl: string): Promise<{ dryness: string; cracks: boolean; waterlogging: boolean; erosion: boolean; textureClue: string; confidence: number }>;
}

export class MockSoilAdapter implements SoilAdapter {
  async analyzeReportPhoto(_imageUrl: string): Promise<SoilAnalysisResult> {
    return { pH: 6.8, nitrogen: 245, phosphorus: 18, potassium: 210, organicMatter: 2.1, texture: 'Clay Loam', confidence: 0.85 };
  }
  async analyzeVisualPhoto(_imageUrl: string) {
    return { dryness: 'Moderate', cracks: false, waterlogging: false, erosion: false, textureClue: 'Fine-grained', confidence: 0.55 };
  }
}

// --- Crop Health / Image Analysis Adapter ---
export interface CropAnalysisResult {
  possibleIssue: string;
  symptoms: string;
  confidence: number;
  modelVersion: string;
}

export interface CropHealthAdapter {
  analyzeImage(imageUrl: string, cropName: string, stage: string): Promise<CropAnalysisResult>;
}

export class MockCropHealthAdapter implements CropHealthAdapter {
  async analyzeImage(_imageUrl: string, _cropName: string, _stage: string): Promise<CropAnalysisResult> {
    return {
      possibleIssue: 'Minor nitrogen deficiency or natural aging of lower leaves',
      symptoms: 'Slight yellowing on lower leaves',
      confidence: 0.72,
      modelVersion: 'nv-crop-v1.0-demo',
    };
  }
}

// --- Speech Adapter ---
export interface SpeechAdapter {
  speechToText(audioBuffer: Buffer, language: string): Promise<string>;
  textToSpeech(text: string, language: string): Promise<Buffer>;
}

export class MockSpeechAdapter implements SpeechAdapter {
  async speechToText(_audioBuffer: Buffer, _language: string): Promise<string> {
    return 'நாளைக்கு தண்ணி பாய்ச்சலாமா?';
  }
  async textToSpeech(_text: string, _language: string): Promise<Buffer> {
    return Buffer.from('mock-audio-data');
  }
}

// --- Geolocation Adapter ---
export interface GeoAdapter {
  reverseGeocode(lat: number, lon: number): Promise<{ district: string; state: string; country: string }>;
}

export class MockGeoAdapter implements GeoAdapter {
  async reverseGeocode(_lat: number, _lon: number) {
    return { district: 'Madurai', state: 'Tamil Nadu', country: 'India' };
  }
}

// --- Adapter Factory ---
export interface AdapterConfig {
  weather: WeatherAdapter;
  satellite: SatelliteAdapter;
  soil: SoilAdapter;
  cropHealth: CropHealthAdapter;
  speech: SpeechAdapter;
  geo: GeoAdapter;
}

export function createMockAdapters(): AdapterConfig {
  return {
    weather: new MockWeatherAdapter(),
    satellite: new MockSatelliteAdapter(),
    soil: new MockSoilAdapter(),
    cropHealth: new MockCropHealthAdapter(),
    speech: new MockSpeechAdapter(),
    geo: new MockGeoAdapter(),
  };
}

// Global adapters instance — swap to real adapters in production
export const adapters = createMockAdapters();
