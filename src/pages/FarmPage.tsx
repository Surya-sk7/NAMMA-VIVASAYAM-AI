// ============================================================
// 🌾 NammaVivasayam AI — Farm Page (Digital Twin)
// Farm Intelligence Profile — structured state of the farm
// ============================================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import {
  demoFarm, demoCrop, demoSoil, demoWeather, demoSatellite, demoEvents
} from '../services/demoData';
import FarmerMascot from '../components/common/FarmerMascot';
import SatelliteMapViewer from '../components/farm/SatelliteMapViewer';

export default function FarmPage() {
  const { state } = useApp();
  const farm = demoFarm;
  const crop = demoCrop;
  const soil = demoSoil;
  const weather = demoWeather;
  const sat = demoSatellite;
  const [selectedMetric, setSelectedMetric] = useState<'ndvi' | 'stress' | 'anomaly'>('ndvi');

  return (
    <div className="page-enter" style={{ position: 'relative' }}>
      {/* Corner Farmer Companion */}
      <div style={{ position: 'absolute', top: '0', right: '8px', zIndex: 10 }}>
        <FarmerMascot size={46} pose="happy" />
      </div>

      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-paddy-dark)', marginBottom: 'var(--space-5)' }}>
        🌾 {t('farm.digitalTwin')}
      </h1>

      {/* Farm Identity Card */}
      <div className="card" style={{ marginBottom: 'var(--space-4)', background: 'linear-gradient(135deg, var(--color-paddy-50), var(--color-bg-card))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
              {t('farm.profile')}
            </div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{farm.farmName}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
              📍 {farm.location}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-paddy-dark)' }}>{farm.area}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{t('farm.acres')}</div>
          </div>
        </div>
      </div>

      {/* Crop Info */}
      <div className="section-header">
        <h2 className="section-header__title">🌾 {t('farm.crop')}</h2>
      </div>
      <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', background: 'var(--color-paddy-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>
            🌾
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{t('crop.paddy')}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{crop.variety}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
              <span style={{ padding: '2px 10px', background: 'var(--color-paddy-50)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-paddy-dark)' }}>
                🌸 {t('stage.flowering')}
              </span>
              <span style={{ padding: '2px 10px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                📅 {new Date(crop.plantingDate).toLocaleDateString(state.language === 'ta' ? 'ta-IN' : 'en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Soil Intelligence */}
      <div className="section-header">
        <h2 className="section-header__title">🪨 {t('soil.title')}</h2>
        <span className="evidence-card__badge evidence-card__badge--measured" style={{ fontSize: 'var(--text-xs)' }}>
          📏 {t('why.measured')}
        </span>
      </div>
      <div className="metric-grid" style={{ marginBottom: 'var(--space-4)' }}>
        {[
          { icon: '💧', label: t('soil.moisture'), value: `${soil.moisture}%`, status: '✓' },
          { icon: '⚗️', label: t('soil.ph'), value: `${soil.pH}`, status: '✓' },
          { icon: '🧪', label: t('soil.nitrogen'), value: `${soil.nitrogen}`, status: 'kg/ha' },
          { icon: '🧬', label: t('soil.phosphorus'), value: `${soil.phosphorus}`, status: 'kg/ha' },
          { icon: '⚡', label: t('soil.potassium'), value: `${soil.potassium}`, status: 'kg/ha' },
          { icon: '🌿', label: t('soil.organicMatter'), value: `${soil.organicMatter}%`, status: '' },
        ].map(({ icon, label, value, status }) => (
          <div key={label} className="metric-card">
            <div className="metric-card__icon">{icon}</div>
            <div className="metric-card__label">{label}</div>
            <div className="metric-card__value">{value}</div>
            {status && <div className="metric-card__status" style={{ color: 'var(--color-success)' }}>{status}</div>}
          </div>
        ))}
      </div>

      {/* Weather */}
      <div className="section-header">
        <h2 className="section-header__title">☁️ {t('weather.title')}</h2>
      </div>
      <div className="metric-grid" style={{ marginBottom: 'var(--space-4)' }}>
        <div className="metric-card">
          <div className="metric-card__icon">🌡️</div>
          <div className="metric-card__label">{t('weather.temperature')}</div>
          <div className="metric-card__value">{weather.temperature}°C</div>
        </div>
        <div className="metric-card">
          <div className="metric-card__icon">💨</div>
          <div className="metric-card__label">{t('weather.humidity')}</div>
          <div className="metric-card__value">{weather.humidity}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-card__icon">🌧️</div>
          <div className="metric-card__label">{t('weather.rainfallProbability')}</div>
          <div className="metric-card__value">{weather.rainfallProbability}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-card__icon">💨</div>
          <div className="metric-card__label">{t('weather.windSpeed')}</div>
          <div className="metric-card__value">{weather.windSpeed} km/h</div>
        </div>
      </div>

      {/* Satellite Intelligence with India Map & Location Zoom */}
      <div className="section-header">
        <h2 className="section-header__title">
          🛰️ {state.language === 'ta' ? 'இந்திய வரைபடம் & செயற்கைக்கோள் பார்வை' : state.language === 'hi' ? 'भारत मानचित्र एवं उपग्रह डेटा' : 'India Satellite Map & Field Telemetry'}
        </h2>
        <span className="evidence-card__badge evidence-card__badge--inferred" style={{ fontSize: 'var(--text-xs)' }}>
          🛰️ Sentinel-2 MSI (10m)
        </span>
      </div>

      {/* Interactive India Map to Farm Location Zoom Component */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <SatelliteMapViewer initialLocationId="melur" />
      </div>

      {/* Numeric Satellite Cards (Clickable for details) */}
      <div className="card" style={{ marginBottom: 'var(--space-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div
            onClick={() => setSelectedMetric('ndvi')}
            style={{
              cursor: 'pointer', padding: '6px', borderRadius: '10px', flex: 1,
              background: selectedMetric === 'ndvi' ? 'var(--color-paddy-50)' : 'transparent',
              border: selectedMetric === 'ndvi' ? '1.5px solid var(--color-paddy)' : '1.5px solid transparent'
            }}
          >
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>
              {state.language === 'ta' ? 'தாவர குறியீடு (NDVI)' : 'Vegetation Index (NDVI)'}
            </div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-paddy)' }}>{sat.vegetationIndex}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', fontWeight: 700 }}>
              {state.language === 'ta' ? '✓ மிக நன்று (Top 10%)' : '✓ Excellent'}
            </div>
          </div>

          <div style={{ width: '1px', background: 'var(--color-border-light)' }} />

          <div
            onClick={() => setSelectedMetric('stress')}
            style={{
              cursor: 'pointer', padding: '6px', borderRadius: '10px', flex: 1,
              background: selectedMetric === 'stress' ? 'var(--color-paddy-50)' : 'transparent',
              border: selectedMetric === 'stress' ? '1.5px solid var(--color-paddy)' : '1.5px solid transparent'
            }}
          >
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>
              {state.language === 'ta' ? 'அழுத்த குறியீடு' : 'Stress Index'}
            </div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-risk-low)' }}>{sat.stressIndex}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', fontWeight: 700 }}>
              {state.language === 'ta' ? 'குறைவு (பாதுகாப்பானது)' : 'Low (Safe)'}
            </div>
          </div>

          <div style={{ width: '1px', background: 'var(--color-border-light)' }} />

          <div
            onClick={() => setSelectedMetric('anomaly')}
            style={{
              cursor: 'pointer', padding: '6px', borderRadius: '10px', flex: 1,
              background: selectedMetric === 'anomaly' ? 'var(--color-paddy-50)' : 'transparent',
              border: selectedMetric === 'anomaly' ? '1.5px solid var(--color-paddy)' : '1.5px solid transparent'
            }}
          >
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>
              {state.language === 'ta' ? 'சீரற்ற தன்மை' : 'Anomaly Score'}
            </div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-risk-low)' }}>{sat.anomalyScore}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', fontWeight: 700 }}>
              {state.language === 'ta' ? '95% சீரான பயிர்' : '95% Uniform'}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FARMER EXPLANATION & ACTION GUIDE (User Request) ═══ */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)',
        border: '1.5px solid rgba(16, 185, 129, 0.35)', borderRadius: '18px', padding: '14px 16px',
        marginBottom: 'var(--space-4)'
      }}>
        {/* What This Data Means */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '13px', color: 'var(--color-paddy-dark)', marginBottom: '4px' }}>
            <span>📊</span>
            <span>{state.language === 'ta' ? 'இந்த எண் என்ன சொல்கிறது? (விளக்கம்):' : 'What does this satellite data mean?'}</span>
          </div>
          <p style={{ fontSize: '12px', color: '#1f2937', margin: 0, lineHeight: 1.5 }}>
            {selectedMetric === 'ndvi' && (
              state.language === 'ta'
                ? 'உங்கள் நிலத்தின் NDVI அளவு 0.72 என்பது மிகுந்த பசுமையையும் அடர்த்தியான பயிர் விதானத்தையும் காட்டுகிறது. பயிர் ஒளிச்சேர்க்கை (Photosynthesis) உச்சகட்டத்தில் உள்ளது. உங்கள் பகுதி சராசரி 0.58-ஐ விட இது 24% அதிகம்.'
                : 'NDVI 0.72 indicates lush, vigorous vegetative canopy with high chlorophyll absorption. Crop photosynthesis is peak efficient, rating 24% higher than regional Madurai district baseline (0.58).'
            )}
            {selectedMetric === 'stress' && (
              state.language === 'ta'
                ? 'அழுத்தக் குறியீடு 0.15 என்பது மிகக் குறைவு. பயிரின் வேர்களுக்கு போதிய காற்றோட்டம் மற்றும் ஈரப்பதம் உள்ளது. இலைகள் வாடல் அடையவில்லை.'
                : 'Stress Index 0.15 reflects negligible plant stress (<0.25 is optimal). Plant xylem vessels are adequately hydrated and root respiration is unimpeded.'
            )}
            {selectedMetric === 'anomaly' && (
              state.language === 'ta'
                ? 'அசாதாரண மதிப்பெண் 0.05 மட்டுமே. அதாவது 1.8 ஏக்கர் நிலம் முழுவதும் பயிர் வளர்ச்சி 95% ஒரே சீராக வளர்ந்துள்ளது. எங்கும் திட்டு திட்டாக பயிர் கருகவோ அழுகவோ இல்லை.'
                : 'Anomaly Score 0.05 indicates 95% spatial canopy uniformity across all four quadrants of your 1.8-acre plot. No localized drowning or crop lodging spots detected.'
            )}
          </p>
        </div>

        {/* What the Farmer Should Do */}
        <div style={{
          background: '#ffffff', padding: '10px 14px', borderRadius: '12px',
          border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '13px', color: '#065f46', marginBottom: '4px' }}>
            <span>🚜</span>
            <span>{state.language === 'ta' ? 'இந்த தரவை வைத்து விவசாயி என்ன செய்ய வேண்டும்?' : 'What will the farmer do with this data?'}</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>
            {selectedMetric === 'ndvi' && (
              state.language === 'ta' ? (
                <>
                  <li><strong>கூடுதல் யூரியா வேண்டாம்:</strong> தழைச்சத்து (Nitrogen) போதுமான அளவு உள்ளது. மேலும் யூரியா போட்டால் இலை மென்மையாகி பூச்சி தாக்கும்.</li>
                  <li><strong>நீர் மட்டம்:</strong> பூக்கும் நிலையில் 2 முதல் 3 செ.மீ நீர் மட்டத்தை தொடர்ந்து பராமரியுங்கள்.</li>
                </>
              ) : (
                <>
                  <li><strong>Hold Additional Nitrogen:</strong> Crop canopy already contains optimal N reserves. Extra urea will soften leaf cuticles and attract Stem Borers.</li>
                  <li><strong>Maintain Water Depth:</strong> Keep standing water at 2-3 cm during active flowering stage.</li>
                </>
              )
            )}
            {selectedMetric === 'stress' && (
              state.language === 'ta' ? (
                <>
                  <li><strong>அவசர பாசனம் தேவையில்லை:</strong> நிலம் போதுமான அளவு ஈரமாக இருப்பதால் கூடுதல் பம்பு செலவு (மின்சாரம்/டீசல்) செய்ய வேண்டாம்.</li>
                  <li><strong>3 நாட்கள் கழித்து சரிபார்க்கவும்:</strong> அடுத்த செயற்கைக்கோள் வருகை வரை தற்போதைய அட்டவணையை தொடரலாம்.</li>
                </>
              ) : (
                <>
                  <li><strong>Skip Emergency Pumping:</strong> Root moisture is safe; avoid unnecessary pumping electricity and diesel costs today.</li>
                  <li><strong>Next Scan:</strong> Routine status confirmed. Re-check after the next satellite overpass in 3 days.</li>
                </>
              )
            )}
            {selectedMetric === 'anomaly' && (
              state.language === 'ta' ? (
                <>
                  <li><strong>மறுநடவு தேவையில்லை:</strong> வயல் முழுவதும் சீரான வளர்ச்சி இருப்பதால் கூடுதல் ஆட்களை வைத்து மறுநடவு செய்யத் தேவையில்லை.</li>
                  <li><strong>வடிகால் வாய்க்கால்:</strong> மாலை மழைக்கு முன் வரப்பு ஓரங்களில் உள்ள வடிகால் மதகுகளை மட்டும் தடங்கல் இல்லாமல் பார்த்துக் கொள்ளுங்கள்.</li>
                </>
              ) : (
                <>
                  <li><strong>No Gap Filling Needed:</strong> Uniformity confirms excellent seedling survival across the entire 1.8 acres.</li>
                  <li><strong>Clear Bund Drainage:</strong> Simply verify field bund drainage outlets are open before evening precipitation.</li>
                </>
              )
            )}
          </ul>
        </div>
      </div>

      {/* Timeline Preview */}
      <div className="section-header">
        <h2 className="section-header__title">📅 {t('timeline.title')}</h2>
      </div>
      <div className="timeline">
        {demoEvents.slice(-5).reverse().map((event) => (
          <div key={event.id} className="timeline-item">
            <div className="timeline-item__time">
              {new Date(event.occurredAt).toLocaleDateString(state.language === 'ta' ? 'ta-IN' : 'en-IN', {
                month: 'short', day: 'numeric', year: 'numeric'
              })}
            </div>
            <div className="timeline-item__title">{event.title}</div>
            <div className="timeline-item__desc">{event.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
