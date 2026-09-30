// ============================================================
// 🌾 NammaVivasayam AI — Home Page (REBUILT)
// Decision-First Intelligence Dashboard — Fully translated
// ============================================================

import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import FarmerMascot from '../components/common/FarmerMascot';
import SpeakerButton from '../components/common/SpeakerButton';

const getGreeting = (): string => {
  const hr = new Date().getHours();
  if (hr < 12) return t('home.goodMorning');
  if (hr < 17) return t('home.goodAfternoon');
  return t('home.goodEvening');
};

export default function HomePage() {
  const { state, dispatch } = useApp();
  const userName = state.user?.name || 'முருகன்';

  return (
    <div style={{ padding: 'var(--space-4)', animation: 'pageIn 0.4s ease', position: 'relative' }}>
      {/* Top-Right Decorative Farmer Peeker */}
      <div style={{ position: 'absolute', top: '12px', right: '16px', zIndex: 5 }}>
        <FarmerMascot size={46} pose="happy" />
      </div>

      {/* Greeting Banner with Farmer Avatar */}
      <div style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          border: '2.5px solid #f59e0b', overflow: 'hidden', flexShrink: 0,
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)', background: '#fff'
        }}>
          <img
            src="/images/farmer_mascot_avatar.jpg"
            alt="Mascot Avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/farmer_mascot.jpg'; }}
          />
        </div>
        <div>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, margin: '0 0 2px 0', color: 'var(--color-paddy-dark)' }}>
            {getGreeting()}, {userName}! 👋
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
            {t('app.tagline')}
          </p>
        </div>
      </div>

      {/* ═══════ PRIMARY DECISION CARD ═══════ */}
      <div className="decision-card" style={{
        background: 'linear-gradient(135deg, var(--color-paddy-dark) 0%, #2d5a3f 50%, var(--color-paddy) 100%)',
        borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', color: 'white',
        marginBottom: 'var(--space-5)', position: 'relative', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      }}>
        {/* Card Corner Cartoon Peeker */}
        <div style={{ position: 'absolute', top: '-10px', right: '10px', zIndex: 5 }}>
          <FarmerMascot size={42} pose="thinking" corner="card-corner" />
        </div>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '6rem', opacity: 0.1 }}>💧</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
          <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {t('decision.title')}
          </div>
          <SpeakerButton
            text={`${t('decision.mainTitle')} ${t('decision.mainDesc')}`}
            variant="gold"
            size="sm"
          />
        </div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 'var(--space-2)', lineHeight: 1.3 }}>
          💧 {t('decision.mainTitle')}
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', opacity: 0.9, lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
          {t('decision.mainDesc')}
        </p>

        {/* Confidence Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--text-xs)', opacity: 0.7 }}>{t('decision.confidence')}</span>
          <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: 'var(--radius-full)' }}>
            <div style={{ width: '87%', height: '100%', background: 'linear-gradient(90deg, #34d399, #6ee7b7)', borderRadius: 'var(--radius-full)', transition: 'width 1.5s ease' }} />
          </div>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>87%</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button
            onClick={() => dispatch({ type: 'SHOW_WHY_ENGINE', payload: 'demo-rec-001' })}
            style={{
              flex: 1, padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
              color: 'white', fontWeight: 700, fontSize: 'var(--text-sm)',
              border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ❓ {t('decision.why')}
          </button>
          <button
            onClick={() => dispatch({ type: 'SHOW_WHAT_IF', payload: 'demo-rec-001' })}
            style={{
              flex: 1, padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
              color: 'white', fontWeight: 700, fontSize: 'var(--text-sm)',
              border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            🔄 {t('decision.whatIf')}
          </button>
        </div>
      </div>

      {/* ═══════ QUICK STATUS GRID ═══════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        {/* Weather */}
        <div className="card" style={{ padding: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <span style={{ fontSize: '1.3rem' }}>🌡️</span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{t('weather.title')}</span>
          </div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-harvest)' }}>34°C</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{t('weather.humidity')}: 72%</div>
        </div>

        {/* Rain */}
        <div className="card" style={{ padding: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <span style={{ fontSize: '1.3rem' }}>🌧️</span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{t('weather.rainfallProbability')}</span>
          </div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-water)' }}>68%</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>IMD {t('weather.forecast')}</div>
        </div>

        {/* Soil */}
        <div className="card" style={{ padding: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <span style={{ fontSize: '1.3rem' }}>🌿</span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{t('soil.moisture')}</span>
          </div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-paddy)' }}>31%</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>✅ {t('farm.adequate')}</div>
        </div>

        {/* Crop Stage */}
        <div className="card" style={{ padding: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <span style={{ fontSize: '1.3rem' }}>🌾</span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{t('farm.stage')}</span>
          </div>
          <div style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-paddy-dark)' }}>{t('stage.flowering')}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{t('crop.paddy')} · IR 64</div>
        </div>
      </div>

      {/* ═══════ SATELLITE DATA CARD ═══════ */}
      <div className="card" style={{ marginBottom: 'var(--space-5)', borderLeft: '4px solid var(--color-water)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: '2px' }}>
              🛰️ {t('satellite.title')}
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
              {t('satellite.source')}
            </p>
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', background: 'var(--color-bg-subtle)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
            {t('satellite.resolution')}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>{t('satellite.ndvi')}</div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-paddy)' }}>0.72</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>✅ {t('risk.stable')}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>{t('satellite.ndwi')}</div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-water)' }}>0.38</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-water)' }}>{t('farm.adequate')}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>{t('satellite.cloudCover')}</div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-text-secondary)' }}>42%</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{t('weather.partlyCloudy')}</div>
          </div>
        </div>
        <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          📅 {t('satellite.lastCapture')}: 28 Sep 2024 · {t('satellite.cloudCover')}: 42%
        </div>
      </div>

      {/* ═══════ RISK RADAR ═══════ */}
      <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
          🎯 {t('risk.title')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {[
            { icon: '💧', key: 'waterStress', level: 'medium', trend: 'increasing', pct: 65 },
            { icon: '🌡️', key: 'heat', level: 'medium', trend: 'stable', pct: 55 },
            { icon: '🌧️', key: 'heavyRain', level: 'medium', trend: 'increasing', pct: 60 },
            { icon: '🦠', key: 'disease', level: 'low', trend: 'stable', pct: 20 },
            { icon: '🐛', key: 'pest', level: 'low', trend: 'stable', pct: 15 },
          ].map(risk => (
            <div key={risk.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: '1.2rem', width: '28px', textAlign: 'center' }}>{risk.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{t(`risk.${risk.key}`)}</span>
                  <span style={{
                    fontSize: 'var(--text-xs)', fontWeight: 600, padding: '1px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: risk.level === 'medium' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                    color: risk.level === 'medium' ? 'var(--color-warning)' : 'var(--color-success)',
                  }}>
                    {t(`risk.${risk.level}`)} {risk.trend === 'increasing' ? '↑' : '—'}
                  </span>
                </div>
                <div style={{ height: '6px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-full)' }}>
                  <div style={{
                    width: `${risk.pct}%`, height: '100%', borderRadius: 'var(--radius-full)',
                    transition: 'width 1s ease',
                    background: risk.level === 'medium'
                      ? 'linear-gradient(90deg, #eab308, #f59e0b)'
                      : 'linear-gradient(90deg, #22c55e, #4ade80)',
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════ RECENT INTELLIGENCE ═══════ */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
          📋 {t('home.recentIntelligence')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {[
            { icon: '🌧️', text: t('weather.rainfallProbability') + ': 68% — IMD Madurai', time: '2h', color: 'var(--color-water)' },
            { icon: '🌡️', text: t('weather.temperature') + ' 34°C — ' + t('risk.heat') + ' ' + t('risk.medium'), time: '3h', color: 'var(--color-harvest)' },
            { icon: '🛰️', text: 'NDVI 0.72 — ' + t('risk.stable') + ' (Sentinel-2)', time: '1d', color: 'var(--color-paddy)' },
            { icon: '🌿', text: t('soil.moisture') + ' 31% — ' + t('farm.adequate'), time: '4h', color: 'var(--color-success)' },
          ].map((item, i) => (
            <div key={i} className="card" style={{ padding: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{item.text}</div>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
        <button
          className="card"
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'pesu' })}
          style={{ padding: 'var(--space-3)', textAlign: 'center', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '4px' }}>🎙️</span>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{t('nav.pesu')}</span>
        </button>
        <button
          className="card"
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'crop-doctor' })}
          style={{ padding: 'var(--space-3)', textAlign: 'center', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '4px' }}>📷</span>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{t('nav.cropDoctor')}</span>
        </button>
        <button
          className="card"
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'farm' })}
          style={{ padding: 'var(--space-3)', textAlign: 'center', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '4px' }}>🌾</span>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{t('nav.farm')}</span>
        </button>
      </div>
    </div>
  );
}
