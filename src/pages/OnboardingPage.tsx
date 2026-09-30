// ============================================================
// 🌾 NammaVivasayam AI — Onboarding (REBUILT)
// 10-language selector, fully functional, realistic
// ============================================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import LanguageSelectScreen from '../components/common/LanguageSelectScreen';
import FarmerMascot from '../components/common/FarmerMascot';

export default function OnboardingPage() {
  const { dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '', phone: '', location: '', farmArea: '', cropName: 'Paddy',
    plantingDate: '', irrigationMethod: 'CANAL', soilType: '',
  });

  const updateField = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFinish = (isReal = true) => {
    const user = {
      id: `u-${Date.now()}`,
      name: formData.name.trim() || 'Murugan (முருகன்)',
      phone: formData.phone.trim() || '+91 98765 43210',
      location: formData.location.trim() || 'Madurai, Tamil Nadu',
      role: 'farmer' as const,
      createdAt: new Date().toISOString(),
    };

    const farm = {
      id: `f-${Date.now()}`,
      userId: user.id,
      farmName: `${user.name}'s Farm`,
      location: formData.location.trim() || 'Madurai, Tamil Nadu',
      area: parseFloat(formData.farmArea) || 1.8,
      soilType: (formData.soilType as any) || 'ALLUVIAL',
      irrigationSource: (formData.irrigationMethod as any) || 'CANAL',
      cropStage: 'flowering' as const,
      cropName: formData.cropName || 'Paddy',
      plantingDate: formData.plantingDate || new Date().toISOString().split('T')[0],
      boundary: [],
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'SET_USER', payload: user as any });
    dispatch({ type: 'SET_FARM', payload: farm as any });
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    dispatch({ type: 'SET_DEMO_MODE', payload: !isReal });
    dispatch({ type: 'SET_ONBOARDING', payload: false });
  };

  const totalSteps = 4;

  // STEP 0: Catchy & Expensive Luxury Language Selection Screen
  if (step === 0) {
    return <LanguageSelectScreen onComplete={() => setStep(1)} />;
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg, #f0f7f1 0%, #e8f5e9 50%, #c8e6c9 100%)',
      position: 'relative'
    }}>
      {/* Corner Cartoon Farmer Mascot */}
      <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
        <FarmerMascot size={46} pose="waving" />
      </div>
      {/* Header */}
      <div style={{ padding: 'var(--space-6) var(--space-4)', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>🌾</div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-paddy-dark)', marginBottom: 'var(--space-1)' }}>
          {t('onboarding.welcome')}
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: '320px', margin: '0 auto' }}>
          {t('onboarding.subtitle')}
        </p>
      </div>

      {/* Progress */}
      <div style={{ padding: '0 var(--space-6)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: '4px', borderRadius: 'var(--radius-full)',
              background: i <= step ? 'var(--color-paddy)' : 'rgba(0,0,0,0.1)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textAlign: 'center', marginTop: 'var(--space-1)' }}>
          {t('onboarding.step', { current: String(step + 1), total: String(totalSteps) })}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 'var(--space-4)', maxWidth: '480px', margin: '0 auto', width: '100%' }}>


        {/* STEP 1: Personal Info */}
        {step === 1 && (
          <div style={{ animation: 'pageIn 0.3s ease' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              👤 {t('common.profile')}
            </h2>
            <div className="form-group">
              <label className="form-label">{t('onboarding.name')}</label>
              <input className="form-input" value={formData.name} onChange={e => updateField('name', e.target.value)} placeholder="e.g., முருகன்" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('onboarding.phone')}</label>
              <input className="form-input" type="tel" value={formData.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+91 98765 43210" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('onboarding.location')}</label>
              <input className="form-input" value={formData.location} onChange={e => updateField('location', e.target.value)} placeholder="e.g., Madurai, Tamil Nadu" />
            </div>
          </div>
        )}

        {/* STEP 2: Farm Info */}
        {step === 2 && (
          <div style={{ animation: 'pageIn 0.3s ease' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              🌾 {t('nav.farm')}
            </h2>
            <div className="form-group">
              <label className="form-label">{t('onboarding.farmArea')} ({t('farm.acres')})</label>
              <input className="form-input" type="number" step="0.1" value={formData.farmArea} onChange={e => updateField('farmArea', e.target.value)} placeholder="e.g., 1.8" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('onboarding.cropName')}</label>
              <select className="form-input form-select" value={formData.cropName} onChange={e => updateField('cropName', e.target.value)}>
                <option value="">{t('common.selectCrop')}</option>
                {['paddy','sugarcane','cotton','groundnut','banana','coconut','millet','maize','turmeric'].map(c => (
                  <option key={c} value={c}>{t(`crop.${c}`)}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('onboarding.plantingDate')}</label>
              <input className="form-input" type="date" value={formData.plantingDate} onChange={e => updateField('plantingDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('onboarding.irrigationMethod')}</label>
              <select className="form-input form-select" value={formData.irrigationMethod} onChange={e => updateField('irrigationMethod', e.target.value)}>
                <option value="">{t('common.selectMethod')}</option>
                <option value="CANAL">Canal</option>
                <option value="BOREWELL">Borewell</option>
                <option value="DRIP">Drip</option>
                <option value="SPRINKLER">Sprinkler</option>
                <option value="RAINFED">Rainfed</option>
                <option value="FLOOD">Flood</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 3: Optional Info + Complete */}
        {step === 3 && (
          <div style={{ animation: 'pageIn 0.3s ease' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              🧪 {t('onboarding.soilType')}
            </h2>
            <div className="form-group">
              <label className="form-label">{t('onboarding.soilType')}</label>
              <select className="form-input form-select" value={formData.soilType} onChange={e => updateField('soilType', e.target.value)}>
                <option value="">---</option>
                <option value="CLAY">Clay</option>
                <option value="SANDY">Sandy</option>
                <option value="LOAM">Loam</option>
                <option value="SILT">Silt</option>
                <option value="RED">Red Soil</option>
                <option value="BLACK">Black Soil</option>
                <option value="ALLUVIAL">Alluvial</option>
              </select>
            </div>

            <div style={{
              padding: 'var(--space-4)', background: 'var(--color-paddy-50)', borderRadius: 'var(--radius-lg)',
              marginTop: 'var(--space-4)', textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🎉</div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-paddy-dark)', fontWeight: 600 }}>
                {t('onboarding.noHistory')}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
              <button
                onClick={() => handleFinish(true)}
                className="btn btn--primary"
                style={{
                  width: '100%', padding: 'var(--space-4)',
                  fontSize: 'var(--text-base)', fontWeight: 800
                }}
              >
                🌾 {t('onboarding.finish') || 'Start in Real Farming Mode (நேரடி பயன்பாடு)'}
              </button>
              <button
                onClick={() => handleFinish(false)}
                className="btn btn--secondary"
                style={{
                  width: '100%', padding: 'var(--space-3)',
                  fontSize: 'var(--text-sm)'
                }}
              >
                🎮 {t('app.demo') || 'Try Demo Mode'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)' }}>
        {step > 0 && (
          <button className="btn btn--ghost" onClick={() => setStep(s => s - 1)} style={{ flex: 1 }}>
            ← {t('onboarding.previous')}
          </button>
        )}
        {step < totalSteps - 1 && (
          <button className="btn btn--primary" onClick={() => setStep(s => s + 1)} style={{ flex: 1 }}>
            {t('onboarding.next')} →
          </button>
        )}
      </div>
    </div>
  );
}
