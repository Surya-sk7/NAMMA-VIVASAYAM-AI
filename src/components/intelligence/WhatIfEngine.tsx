// ============================================================
// 🌾 NammaVivasayam AI — WHAT-IF Engine (Interactive Simulation)
// Compare decisions, simulate custom agricultural scenarios & ask questions
// ============================================================

import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../i18n';
import { demoWhatIf } from '../../services/demoData';
import SpeakerButton from '../common/SpeakerButton';

type ScenarioMode = 'default' | 'light' | 'rain_shock' | 'saline';

export default function WhatIfEngine() {
  const { state, dispatch } = useApp();
  const defaultScenario = demoWhatIf;
  const lang = (state.language === 'ta' || state.language === 'hi' ? state.language : 'en') as 'ta' | 'en' | 'hi';

  const [activeScenario, setActiveScenario] = useState<ScenarioMode>('default');
  const [customQuery, setCustomQuery] = useState('');
  const [customReply, setCustomReply] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Dynamic scenario data
  const scenarioDetails: Record<ScenarioMode, {
    title: { ta: string; en: string };
    waterSaved: string;
    yieldEffect: string;
    riskLevel: string;
    explanation: { ta: string; en: string };
  }> = {
    default: {
      title: { ta: 'திட்டம் B: 2 நாட்கள் காத்திருப்பது (பரிந்துரை)', en: 'Option B: Wait 2 Days (Recommended)' },
      waterSaved: '65,000 L',
      yieldEffect: '+8% to +12% Grain Weight',
      riskLevel: 'LOW (12%)',
      explanation: {
        ta: 'மாலை மழை வாய்ப்பைப் பயன்படுத்தி 65,000 லிட்டர் தண்ணீரை மிச்சப்படுத்தலாம். வேர் அழுகல் தடுக்கப்படுகிறது.',
        en: 'Harnesses forecasted 4mm evening precipitation, saving 65,000L canal water and eliminating root hypoxia.',
      },
    },
    light: {
      title: { ta: 'திட்டம் C: 50% குறைவான தெளிப்பு நீர்', en: 'Option C: Light 50% Irrigation Quota' },
      waterSaved: '32,500 L',
      yieldEffect: '+4% Grain Filling',
      riskLevel: 'MODERATE (24%)',
      explanation: {
        ta: 'நிலத்தின் மேலடுக்கை மட்டும் நனைத்து அதிகப்படியான நீர் தேங்குவதைத் தவிர்க்கலாம். தூவல் பாசனம் உகந்தது.',
        en: 'Moistens top 5cm without standing water pool. Safe if you operate sprinkler or regulated micro-channel.',
      },
    },
    rain_shock: {
      title: { ta: 'திட்டம் D: கனமழை (15mm) பெய்தால் என்ன செய்வது?', en: 'Option D: Heavy Rain Shock (15mm)' },
      waterSaved: '1,20,000 L',
      yieldEffect: 'Drainage Required immediately',
      riskLevel: 'WATCH DRAINAGE (42%)',
      explanation: {
        ta: 'திடீரென 15mm-க்கு மேல் கனமழை பெய்தால் உடனடியாக வயல் வடிகால் மதகுகளைத் திறந்து 5cm-க்கு மேல் உள்ள நீரை வெளியேற்ற வேண்டும்.',
        en: 'If unseasonal torrential shower exceeds 15mm, open field bund sluices before night to prevent panicle submergence.',
      },
    },
    saline: {
      title: { ta: 'திட்டம் E: போர்வெல் உப்புத் தண்ணீர் பாய்ச்சினால்?', en: 'Option E: Borewell Saline Water Use' },
      waterSaved: '0 L',
      yieldEffect: '-15% Grain Shriveling',
      riskLevel: 'HIGH SALINITY RISK (68%)',
      explanation: {
        ta: 'பூக்கும் நிலையில் EC > 2.5 உள்ள போர்வெல் உப்பு நீரை பாய்ச்சினால் நெல்மணிகள் பதராகும். மழை நீருக்காக காத்திருப்பதே சிறந்தது.',
        en: 'High salinity borewell water during anthesis causes sterility and chaffy grains. Waiting for rain is far safer.',
      },
    },
  };

  const handleCustomSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    setIsSimulating(true);
    setTimeout(() => {
      const q = customQuery.toLowerCase();
      let res = '';

      if (q.includes('drip') || q.includes('சொட்டு') || q.includes('ड्रिप')) {
        res = lang === 'ta'
          ? '💧 சொட்டு நீர் பாசனம்: நெல்லில் சொட்டு நீர் பாசனம் அமைத்தால் 40% வரை தண்ணீர் சேமிக்கப்படும், பூஞ்சை நோய்கள் 50% குறையும்.'
          : '💧 Drip Irrigation Simulation: Saves up to 40% water, keeps soil matric potential at -10 to -20 kPa, reducing sheath rot by 50%.';
      } else if (q.includes('pump') || q.includes('மின்சாரம்') || q.includes('बिजली')) {
        res = lang === 'ta'
          ? '⚡ மின்சார வெட்டு: பகல் நேரத்தில் மின்சாரம் தடைபட்டால், 31% மண் ஈரப்பதம் இருப்பதால் 48 மணிநேரத்திற்கு பயிர் பாதுகாப்பாக இருக்கும்.'
          : '⚡ Power Outage Simulation: Even with 24h power disruption, existing 31% soil capillary water secures root intake through day 74.';
      } else {
        res = lang === 'ta'
          ? `🔍 "${customQuery}" குறித்த உருவகப்படுத்துதல்: இந்த சூழ்நிலையில் பரிந்துரைக்கப்பட்ட காத்திருப்பு முடிவே குறைந்தபட்ச செலவிலும் அதிகபட்ச மகசூலிலும் அமையும்.`
          : `🔍 Simulation for "${customQuery}": Under this scenario, Option B (Wait 2 Days) remains optimal with lowest risk and highest benefit.`;
      }

      setCustomReply(res);
      setIsSimulating(false);
    }, 600);
  };

  const labels = [
    { key: 'soilCondition', label: t('whatIf.soilCondition') },
    { key: 'rainfallImpact', label: t('whatIf.rainfallImpact') },
    { key: 'waterUse', label: t('whatIf.waterUse') },
    { key: 'cropRisk', label: t('whatIf.cropRisk') },
    { key: 'expectedEffect', label: t('whatIf.expectedEffect') },
  ];

  return (
    <>
      <div className="modal-overlay" onClick={() => dispatch({ type: 'HIDE_WHAT_IF' })} />
      <div className="bottom-sheet" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="bottom-sheet__handle" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-paddy-dark)', margin: 0 }}>
                🔄 {t('whatIf.title')}
              </h2>
              <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.15)', color: '#b45309', border: '1px solid #f59e0b', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                DECISION SIMULATOR
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
              {t('whatIf.compareTitle')}
            </p>
          </div>
          <button
            className="btn btn--ghost"
            onClick={() => dispatch({ type: 'HIDE_WHAT_IF' })}
            style={{ fontSize: 'var(--text-xl)', padding: '4px 8px' }}
          >
            ✕
          </button>
        </div>

        {/* Scenario Switcher Tabs */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px', scrollbarWidth: 'none' }}>
          {[
            { key: 'default', label: 'Option A vs B (Classic)' },
            { key: 'light', label: 'Light 50% Quota' },
            { key: 'rain_shock', label: 'Heavy Rain Shock' },
            { key: 'saline', label: 'Saline Borewell' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveScenario(tab.key as ScenarioMode);
                setCustomReply(null);
              }}
              style={{
                padding: '6px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                background: activeScenario === tab.key ? 'var(--color-paddy)' : 'rgba(0,0,0,0.05)',
                color: activeScenario === tab.key ? '#fff' : 'var(--color-text-secondary)',
                border: 'none', cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Live Scenario Highlight Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(245, 158, 11, 0.12) 100%)',
          border: '1.5px solid var(--color-paddy)', borderRadius: '16px', padding: '12px 14px', marginBottom: 'var(--space-4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontWeight: 800, fontSize: '13px', color: 'var(--color-paddy-dark)' }}>
              {scenarioDetails[activeScenario].title[state.language === 'ta' ? 'ta' : 'en']}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SpeakerButton
                text={`${scenarioDetails[activeScenario].title[state.language === 'ta' ? 'ta' : 'en']}. ${scenarioDetails[activeScenario].explanation[state.language === 'ta' ? 'ta' : 'en']}`}
                size="sm"
                variant="primary"
              />
              <span style={{ fontSize: '11px', background: '#10b981', color: '#fff', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                {scenarioDetails[activeScenario].waterSaved} SAVED
              </span>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#374151', margin: '0 0 8px 0', lineHeight: 1.4 }}>
            {scenarioDetails[activeScenario].explanation[state.language === 'ta' ? 'ta' : 'en']}
          </p>
          <div style={{ display: 'flex', gap: '10px', fontSize: '11px', fontWeight: 700 }}>
            <span style={{ color: 'var(--color-success)' }}>📈 Yield: {scenarioDetails[activeScenario].yieldEffect}</span>
            <span style={{ color: '#b45309' }}>🛡️ Risk: {scenarioDetails[activeScenario].riskLevel}</span>
          </div>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="whatif-compare" style={{ marginBottom: 'var(--space-4)' }}>
          {/* Option A: Irrigate Today */}
          <div className="whatif-option whatif-option--a">
            <div className="whatif-option__header" style={{ color: 'var(--color-harvest)' }}>
              💧 {state.language === 'ta' ? 'இன்று தண்ணீர் பாய்ச்சுவது' :
                   state.language === 'hi' ? 'आज सिंचाई' :
                   t('whatIf.irrigateToday')}
            </div>
            {labels.map(({ key, label }) => (
              <div key={key} className="whatif-row">
                <div className="whatif-row__label">{label}</div>
                <div className="whatif-row__value" style={{ color: key === 'cropRisk' || key === 'waterUse' ? 'var(--color-warning)' : undefined }}>
                  {defaultScenario.resultA[key as keyof typeof defaultScenario.resultA] as string}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 'var(--space-3)', textAlign: 'center' }}>
              <div className="confidence">
                <span className="confidence__label">{t('decision.confidence')}</span>
                <div className="confidence__bar">
                  <div className="confidence__fill" style={{ width: `${defaultScenario.resultA.confidence * 100}%` }} />
                </div>
                <span className="confidence__value">{Math.round(defaultScenario.resultA.confidence * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Option B: Wait 2 Days */}
          <div className="whatif-option whatif-option--b">
            <div className="whatif-option__header" style={{ color: 'var(--color-paddy)' }}>
              ⏳ {state.language === 'ta' ? '2 நாட்கள் காத்திருப்பது' :
                   state.language === 'hi' ? '2 दिन प्रतीक्षा' :
                   t('whatIf.waitTwoDays')}
            </div>
            {labels.map(({ key, label }) => (
              <div key={key} className="whatif-row">
                <div className="whatif-row__label">{label}</div>
                <div className="whatif-row__value" style={{ color: key === 'cropRisk' ? 'var(--color-success)' : undefined }}>
                  {defaultScenario.resultB[key as keyof typeof defaultScenario.resultB] as string}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 'var(--space-3)', textAlign: 'center' }}>
              <div className="confidence">
                <span className="confidence__label">{t('decision.confidence')}</span>
                <div className="confidence__bar">
                  <div className="confidence__fill" style={{ width: `${defaultScenario.resultB.confidence * 100}%`, background: 'var(--color-paddy)' }} />
                </div>
                <span className="confidence__value">{Math.round(defaultScenario.resultB.confidence * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ INTERACTIVE WHAT-IF QUESTION BOX ═══ */}
        <div style={{
          background: 'var(--color-bg-subtle)', borderRadius: '16px', padding: '14px',
          border: '1px solid var(--color-border)', marginBottom: 'var(--space-4)'
        }}>
          <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
            💬 {lang === 'ta' ? 'உங்கள் சொந்த சூழ்நிலையை உருவகப்படுத்துக' : 'Simulate Your Custom What-If Question'}
          </div>
          <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: '0 0 10px 0' }}>
            {lang === 'ta' ? 'எடுத்துக்காட்டு: "சொட்டு நீர் பாசனம் அமைத்தால்?", "மின்சாரம் தடைபட்டால்?"' : 'e.g., "What if I switch to drip irrigation?", "What if power cuts out?"'}
          </p>

          <form onSubmit={handleCustomSimulate} style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder={lang === 'ta' ? 'சூழ்நிலையை தட்டச்சு செய்க...' : 'Type scenario here...'}
              style={{
                flex: 1, padding: '10px 12px', borderRadius: '10px',
                border: '1px solid #d1d5db', fontSize: '12px', outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={isSimulating}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#1a1003', border: 'none', borderRadius: '10px', padding: '0 14px',
                fontWeight: 900, fontSize: '12px', cursor: 'pointer'
              }}
            >
              {isSimulating ? '...' : lang === 'ta' ? 'ஒப்பிடு' : 'Simulate'}
            </button>
          </form>

          {customReply && (
            <div style={{
              marginTop: '10px', padding: '10px 12px', background: '#fffbeb',
              border: '1.5px solid #f59e0b', borderRadius: '10px', fontSize: '12px',
              color: '#92400e', lineHeight: 1.5
            }}>
              <div style={{ fontWeight: 800, marginBottom: '3px' }}>🌾 Simulation Result:</div>
              <div>{customReply}</div>
            </div>
          )}
        </div>

        {/* Back to Why CTA */}
        <button
          className="btn btn--ghost btn--full"
          onClick={() => {
            dispatch({ type: 'HIDE_WHAT_IF' });
            setTimeout(() => dispatch({ type: 'SHOW_WHY_ENGINE', payload: defaultScenario.recommendationId || 'rec-1' }), 300);
          }}
        >
          ← {t('common.back')} · {t('why.title')}
        </button>
      </div>
    </>
  );
}
