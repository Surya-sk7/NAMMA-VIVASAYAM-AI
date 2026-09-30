// ============================================================
// 🌾 NammaVivasayam AI — Official & Satellite Command Center
// Government / Remote Sensing Cell / Agricultural Officer Portal
// ============================================================

import { useState } from 'react';
import { t } from '../i18n';
import FarmerMascot from '../components/common/FarmerMascot';

interface TalukData {
  name: string;
  cultivatedHa: number;
  mainCrop: string;
  avgNdvi: number;
  waterStressIdx: number;
  activeFarms: number;
  alertLevel: 'NORMAL' | 'WATCH' | 'WARNING';
  soilMoistureSar: number;
}

const TALUK_METRICS: TalukData[] = [
  { name: 'Melur', cultivatedHa: 24100, mainCrop: 'Paddy (IR 64 / Samba)', avgNdvi: 0.72, waterStressIdx: 18, activeFarms: 8420, alertLevel: 'NORMAL', soilMoistureSar: 32.1 },
  { name: 'Vadipatti', cultivatedHa: 18300, mainCrop: 'Paddy & Banana', avgNdvi: 0.69, waterStressIdx: 24, activeFarms: 6150, alertLevel: 'WATCH', soilMoistureSar: 29.8 },
  { name: 'Madurai North', cultivatedHa: 14200, mainCrop: 'Paddy (Samba)', avgNdvi: 0.66, waterStressIdx: 22, activeFarms: 4890, alertLevel: 'NORMAL', soilMoistureSar: 30.5 },
  { name: 'Madurai South', cultivatedHa: 12800, mainCrop: 'Paddy & Vegetables', avgNdvi: 0.64, waterStressIdx: 28, activeFarms: 4320, alertLevel: 'NORMAL', soilMoistureSar: 28.4 },
  { name: 'Usilampatti', cultivatedHa: 15400, mainCrop: 'Pulses & Millets', avgNdvi: 0.58, waterStressIdx: 46, activeFarms: 5210, alertLevel: 'WARNING', soilMoistureSar: 21.2 },
  { name: 'Thirumangalam', cultivatedHa: 16800, mainCrop: 'Cotton & Maize', avgNdvi: 0.61, waterStressIdx: 34, activeFarms: 5640, alertLevel: 'NORMAL', soilMoistureSar: 25.7 },
];

interface InsuranceClaim {
  id: string;
  farmer: string;
  taluk: string;
  crop: string;
  acres: number;
  cause: string;
  preNdvi: number;
  postNdvi: number;
  lossPct: number;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

const SAMPLE_CLAIMS: InsuranceClaim[] = [
  { id: 'PMFBY-TN-0912', farmer: 'முத்துராமன் (Muthuraman)', taluk: 'Usilampatti', crop: 'Black Gram', acres: 2.5, cause: 'Localized Water Deficit', preNdvi: 0.62, postNdvi: 0.38, lossPct: 38, status: 'PENDING' },
  { id: 'PMFBY-TN-0913', farmer: 'அன்பழகன் (Anbazhagan)', taluk: 'Vadipatti', crop: 'Paddy IR 64', acres: 1.8, cause: 'Sheath Blight Outbreak', preNdvi: 0.74, postNdvi: 0.51, lossPct: 31, status: 'VERIFIED' },
  { id: 'PMFBY-TN-0914', farmer: 'கணேசன் (Ganesan)', taluk: 'Melur', crop: 'Paddy Samba', acres: 3.2, cause: 'Flash Waterlogging', preNdvi: 0.71, postNdvi: 0.44, lossPct: 38, status: 'PENDING' },
];

type OfficialTab = 'telemetry' | 'taluks' | 'claims' | 'advisory';

interface OfficialDashboardProps {
  onBackToFarmer: () => void;
}

export default function OfficialDashboard({ onBackToFarmer }: OfficialDashboardProps) {
  const [activeTab, setActiveTab] = useState<OfficialTab>('telemetry');
  const [selectedTaluk, setSelectedTaluk] = useState<TalukData>(TALUK_METRICS[0]);
  const [claims, setClaims] = useState<InsuranceClaim[]>(SAMPLE_CLAIMS);
  const [spectralMode, setSpectralMode] = useState<'NDVI' | 'NDWI' | 'NDRE' | 'SAR'>('NDVI');
  const [advisorySent, setAdvisorySent] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const playAdvisoryAudio = (lang: 'ta' | 'en') => {
    try {
      setIsPlayingAudio(true);
      const text = lang === 'ta'
        ? 'வானிலை எச்சரிக்கை: மாலை நேரத்தில் மிதமான மழைக்கு வாய்ப்பு உள்ளது. நெல் பயிருக்கு பாசனம் செய்வதை தவிர்க்கவும். யூரியா உரம் இடுவதை தள்ளிப்போடவும்.'
        : 'Weather alert: Evening thunderstorm and moderate rainfall expected. Farmers are advised to postpone field irrigation and avoid top dressing urea today.';
      
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`;
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(text);
          utter.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
          utter.pitch = 1.05;
          utter.rate = 0.95;
          utter.onend = () => setIsPlayingAudio(false);
          utter.onerror = () => setIsPlayingAudio(false);
          window.speechSynthesis.speak(utter);
        } else {
          setIsPlayingAudio(false);
        }
      };
      audio.play().catch(() => {
        setIsPlayingAudio(false);
      });
    } catch {
      setIsPlayingAudio(false);
    }
  };

  const handleVerifyClaim = (id: string, approve: boolean) => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status: approve ? 'VERIFIED' : 'REJECTED' } : c));
  };

  const handleSendAdvisory = () => {
    setAdvisorySent(true);
    setTimeout(() => setAdvisorySent(false), 4000);
  };

  return (
    <div className="official-command-center" style={{ minHeight: '100vh', background: '#0a1612', color: '#e5e7eb', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header style={{
        background: 'linear-gradient(90deg, #062b1b 0%, #0d3b25 50%, #071f14 100%)',
        borderBottom: '1px solid rgba(52, 211, 153, 0.25)', padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
          }}>
            🏛️
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: '#f3f4f6', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {t('official.portal')}
              <span style={{ fontSize: '10px', background: '#10b981', color: '#062b1b', padding: '1px 8px', borderRadius: '999px', fontWeight: 800 }}>
                GOVT PORTAL
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#a7f3d0', opacity: 0.85 }}>
              {t('official.subtitle')} · {t('official.district')}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Realtime Satellite Status Pill */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '999px', padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#d1fae5', fontWeight: 600 }}>Sentinel-2B MSI Orbit 133 Active</span>
          </div>

          {/* Official Corner Farmer Peeker */}
          <FarmerMascot size={38} pose="happy" />

          <button
            onClick={onBackToFarmer}
            style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '12px',
              fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            {t('official.switchToFarmer')}
          </button>
        </div>
      </header>

      {/* Secondary Navigation Bar */}
      <nav style={{
        background: '#0d2319', borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 24px', display: 'flex', gap: '8px', overflowX: 'auto'
      }}>
        {[
          { key: 'telemetry' as OfficialTab, icon: '🛰️', label: t('official.liveTelemetry') },
          { key: 'taluks' as OfficialTab, icon: '🗺️', label: t('official.talukOverview') },
          { key: 'claims' as OfficialTab, icon: '📑', label: t('official.pmkisanVerification') },
          { key: 'advisory' as OfficialTab, icon: '📢', label: t('official.advisoryAlert') },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '14px 18px', background: 'transparent', border: 'none',
              borderBottom: activeTab === tab.key ? '3px solid #10b981' : '3px solid transparent',
              color: activeTab === tab.key ? '#34d399' : 'rgba(255,255,255,0.65)',
              fontSize: '13px', fontWeight: activeTab === tab.key ? 700 : 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Command Dashboard */}
      <main style={{ flex: 1, padding: '24px', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {/* State Summary Strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px'
        }}>
          {[
            { label: 'Cultivated Area', value: '101,600 ha', sub: '92% of Rabi/Samba target', color: '#34d399' },
            { label: 'Mean District NDVI', value: '0.67', sub: '0.04 above 5-yr baseline', color: '#6ee7b7' },
            { label: 'Vaigai Reservoir Storage', value: '58.4 ft / 71 ft', sub: '82.2% Capacity · Inflow 1,420 cusecs', color: '#60a5fa' },
            { label: 'PM-Kisan Beneficiaries', value: '142,380', sub: '94.2% e-KYC verified', color: '#f59e0b' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px', padding: '16px', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: stat.color, margin: '6px 0 2px 0' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* ═══ TAB 1: SATELLITE TELEMETRY ═══ */}
        {activeTab === 'telemetry' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            {/* Satellite Map Visualizer Panel */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#f3f4f6' }}>
                    🛰️ {t('official.sentinel2')} — Tile T44PMV
                  </h2>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }}>
                    Acquired 2024-10-28 10:38:22 IST · 10m Ground Sampling · 11.4% Cloud Masked
                  </p>
                </div>
                {/* Spectral Index Buttons */}
                <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px' }}>
                  {(['NDVI', 'NDWI', 'NDRE', 'SAR'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setSpectralMode(mode)}
                      style={{
                        padding: '6px 12px', borderRadius: '6px', border: 'none',
                        background: spectralMode === mode ? '#10b981' : 'transparent',
                        color: spectralMode === mode ? '#062b1b' : 'rgba(255,255,255,0.7)',
                        fontWeight: 700, fontSize: '11px', cursor: 'pointer'
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Graphic Satellite Grid Visualizer */}
              <div style={{
                height: '360px', borderRadius: '12px', position: 'relative', overflow: 'hidden',
                background: '#04130d',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
              }}>
                {/* Real Satellite Background Layer */}
                <img
                  src={spectralMode === 'NDVI' || spectralMode === 'NDRE' ? '/images/field_satellite_ndvi.jpg' : '/images/field_satellite_rgb.jpg'}
                  alt="Sentinel-2 Satellite Feed"
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    objectFit: 'cover', opacity: 0.85, zIndex: 0,
                    filter: spectralMode === 'SAR' ? 'grayscale(100%) contrast(150%)' : spectralMode === 'NDWI' ? 'hue-rotate(180deg) saturate(140%)' : 'none'
                  }}
                  onError={(e) => {
                    // Fallback to stylized gradient if image not loaded
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Satellite Scanning Line Overlay */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.08) 1px, transparent 1px)',
                  backgroundSize: '24px 24px', pointerEvents: 'none', zIndex: 1
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                  <span style={{ background: 'rgba(0,0,0,0.75)', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', color: '#a7f3d0', border: '1px solid rgba(52,211,153,0.3)', backdropFilter: 'blur(4px)' }}>
                    🛰️ Spectral Index: <strong>{spectralMode}</strong> {spectralMode === 'NDVI' ? '(Canopy Health)' : spectralMode === 'NDWI' ? '(Moisture)' : spectralMode === 'SAR' ? '(Radar Surface)' : '(Chlorophyll)'}
                  </span>
                  <span style={{ background: 'rgba(0,0,0,0.75)', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', color: '#f3f4f6', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
                    📍 10°00'N 78°06'E (Vaigai Basin, Madurai)
                  </span>
                </div>

                {/* Overlaid Taluk Labels */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                  {TALUK_METRICS.slice(0, 6).map(taluk => (
                    <div
                      key={taluk.name}
                      onClick={() => setSelectedTaluk(taluk)}
                      style={{
                        background: selectedTaluk.name === taluk.name ? 'rgba(16, 185, 129, 0.75)' : 'rgba(0,0,0,0.65)',
                        border: selectedTaluk.name === taluk.name ? '2px solid #34d399' : '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px', padding: '8px', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(6px)'
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '12px', color: selectedTaluk.name === taluk.name ? '#062b1b' : '#fff' }}>{taluk.name}</div>
                      <div style={{ fontSize: '10px', color: selectedTaluk.name === taluk.name ? '#062b1b' : '#6ee7b7', fontWeight: 600 }}>NDVI: {taluk.avgNdvi} · {taluk.alertLevel}</div>
                    </div>
                  ))}
                </div>

                {/* Color Legend Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.8)', padding: '6px 12px', borderRadius: '8px', position: 'relative', zIndex: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Stressed (0.1)</span>
                  <div style={{
                    flex: 1, height: '8px', borderRadius: '4px',
                    background: 'linear-gradient(90deg, #ef4444 0%, #eab308 30%, #84cc16 60%, #15803d 100%)'
                  }} />
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Vigorous (0.85)</span>
                </div>
              </div>

              {/* Band Matrix */}
              <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '11px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>B04 (Red 665nm):</span> <strong style={{ color: '#fca5a5' }}>0.042</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>B08 (NIR 842nm):</span> <strong style={{ color: '#86efac' }}>0.418</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>B11 (SWIR 1610nm):</span> <strong style={{ color: '#93c5fd' }}>0.182</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>SAR C-Band VV/VH:</span> <strong style={{ color: '#fde047' }}>-14.2 dB</strong>
                </div>
              </div>
            </div>

            {/* Selected Taluk Detail Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px'
            }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
                  Taluk Telemetry
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0 0 0', color: '#fff' }}>
                  📍 {selectedTaluk.name} Taluk
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Principal Crop:</span>
                  <strong>{selectedTaluk.mainCrop}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Cultivated Area:</span>
                  <strong>{selectedTaluk.cultivatedHa.toLocaleString()} ha</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Registered Farmers:</span>
                  <strong>{selectedTaluk.activeFarms.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>SAR Volumetric Soil Moisture:</span>
                  <strong style={{ color: '#34d399' }}>{selectedTaluk.soilMoistureSar}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Water Deficit Risk:</span>
                  <strong style={{ color: selectedTaluk.waterStressIdx > 35 ? '#f87171' : '#34d399' }}>
                    {selectedTaluk.waterStressIdx}% ({selectedTaluk.alertLevel})
                  </strong>
                </div>
              </div>

              {/* Next Satellite Pass Countdown */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '10px', padding: '12px', fontSize: '11px', color: '#d1fae5'
              }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>🛰️ Next Orbital Overpass:</div>
                <div>Sentinel-2A · 2024-11-02 10:41 IST (In ~48 hours)</div>
                <div style={{ opacity: 0.7, marginTop: '2px' }}>Cloud forecast: &lt;15% clear optical window</div>
              </div>

              <button
                className="btn btn--primary"
                style={{ width: '100%', marginTop: 'auto' }}
                onClick={() => setActiveTab('advisory')}
              >
                📢 Issue Taluk Advisory
              </button>
            </div>
          </div>
        )}

        {/* ═══ TAB 2: TALUKS TABLE ═══ */}
        {activeTab === 'taluks' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px', padding: '20px'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#f3f4f6' }}>
              🗺️ Madurai District — Taluk-wise Crop Distribution & Satellite Biomass
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', textAlign: 'left', color: 'rgba(255,255,255,0.6)' }}>
                    <th style={{ padding: '10px' }}>Taluk</th>
                    <th style={{ padding: '10px' }}>Cultivated Area (ha)</th>
                    <th style={{ padding: '10px' }}>Major Crops</th>
                    <th style={{ padding: '10px' }}>Sentinel-2 NDVI</th>
                    <th style={{ padding: '10px' }}>SAR Soil Moisture</th>
                    <th style={{ padding: '10px' }}>Registered Farmers</th>
                    <th style={{ padding: '10px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {TALUK_METRICS.map(tData => (
                    <tr key={tData.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 700, color: '#fff' }}>{tData.name}</td>
                      <td style={{ padding: '12px 10px' }}>{tData.cultivatedHa.toLocaleString()} ha</td>
                      <td style={{ padding: '12px 10px', color: 'rgba(255,255,255,0.8)' }}>{tData.mainCrop}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{ color: '#34d399', fontWeight: 700 }}>{tData.avgNdvi}</span>
                      </td>
                      <td style={{ padding: '12px 10px' }}>{tData.soilMoistureSar}%</td>
                      <td style={{ padding: '12px 10px' }}>{tData.activeFarms.toLocaleString()}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{
                          padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                          background: tData.alertLevel === 'NORMAL' ? 'rgba(16,185,129,0.2)' : tData.alertLevel === 'WATCH' ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.2)',
                          color: tData.alertLevel === 'NORMAL' ? '#6ee7b7' : tData.alertLevel === 'WATCH' ? '#fde047' : '#fca5a5'
                        }}>
                          {tData.alertLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ TAB 3: PM-KISAN & PMFBY CLAIMS ═══ */}
        {activeTab === 'claims' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px', padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#f3f4f6' }}>
                  📑 PMFBY Satellite-Verified Crop Damage Claims
                </h2>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }}>
                  Automated Pre- vs Post-event Sentinel-2 NDVI anomaly delta calculation
                </p>
              </div>
              <button
                onClick={() => alert('Official PMFBY Crop Anomaly Report exported to CSV.')}
                style={{
                  background: 'rgba(52, 211, 153, 0.15)', border: '1px solid #10b981', color: '#6ee7b7',
                  padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer'
                }}
              >
                📥 Export Verification CSV
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {claims.map(claim => (
                <div key={claim.id} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>
                      {claim.farmer} · {claim.taluk} Taluk
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                      Claim ID: {claim.id} · {claim.crop} ({claim.acres} acres) · Cause: <strong>{claim.cause}</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '4px' }}>
                      Pre-event NDVI: {claim.preNdvi} ➔ Post-event NDVI: {claim.postNdvi} (Loss: <strong>{claim.lossPct}%</strong>)
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                      background: claim.status === 'VERIFIED' ? 'rgba(16,185,129,0.2)' : claim.status === 'PENDING' ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.2)',
                      color: claim.status === 'VERIFIED' ? '#6ee7b7' : claim.status === 'PENDING' ? '#fde047' : '#fca5a5'
                    }}>
                      {claim.status}
                    </span>
                    {claim.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => handleVerifyClaim(claim.id, true)}
                          style={{
                            background: '#10b981', color: '#062b1b', border: 'none',
                            padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer'
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerifyClaim(claim.id, false)}
                          style={{
                            background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid #ef4444',
                            padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer'
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TAB 4: ADVISORY GENERATION ═══ */}
        {activeTab === 'advisory' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px', padding: '20px', maxWidth: '800px'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#f3f4f6' }}>
              📢 District Agricultural Advisory Bulletin Formulation
            </h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
              Synthesized by AI Engine using IMD weather forecasts, Sentinel-2 canopy health, and reservoir levels
            </p>

            {advisorySent && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981',
                padding: '12px', borderRadius: '8px', marginBottom: '16px', color: '#6ee7b7', fontSize: '12px', fontWeight: 600
              }}>
                ✅ District Agricultural Advisory Broadcast to 142,380 Registered Farmers via SMS and NammaVivasayam App Notifications!
              </div>
            )}

            <div style={{
              background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)',
              fontSize: '13px', lineHeight: 1.6, color: '#d1fae5', marginBottom: '16px'
            }}>
              <strong>🌾 TNAU-IMD District Agromet Advisory Bulletin (Madurai):</strong>
              <br /><br />
              1. <strong>Weather Alert:</strong> Thunderstorm with light to moderate rainfall (~4mm) expected in evening hours. Farmers are advised to postpone field irrigation for paddy at flowering stage.
              <br />
              2. <strong>Fertilizer Guidance:</strong> Avoid top-dressing urea today as surface runoff risk is high. Recommend foliar spray of 2% DAP or Potassium Sulphate after rain subsides.
              <br />
              3. <strong>Pest / Disease Watch:</strong> Sheath Blight conditions favorable in Vadipatti taluk due to elevated humidity (72%). Monitor lower leaf sheaths.
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <button
                className="btn btn--primary"
                onClick={handleSendAdvisory}
              >
                📢 Broadcast to All District Farmers
              </button>
              <button
                type="button"
                onClick={() => playAdvisoryAudio('ta')}
                disabled={isPlayingAudio}
                style={{
                  background: isPlayingAudio ? '#047857' : 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10b981', color: '#6ee7b7',
                  padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                  cursor: isPlayingAudio ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                🔊 {isPlayingAudio ? 'ஒலிப்பது...' : 'தமிழ் குரல் எச்சரிக்கை (Tamil Audio)'}
              </button>
              <button
                type="button"
                onClick={() => playAdvisoryAudio('en')}
                disabled={isPlayingAudio}
                style={{
                  background: isPlayingAudio ? '#047857' : 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid #38bdf8', color: '#7dd3fc',
                  padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                  cursor: isPlayingAudio ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                🔊 English Voice Advisory
              </button>
              <button
                style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                }}
                onClick={() => alert('Official Advisory PDF generated and downloaded.')}
              >
                📄 {t('official.exportReport')}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
