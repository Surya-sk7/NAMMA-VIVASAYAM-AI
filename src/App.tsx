// ============================================================
// 🌾 NammaVivasayam AI — Main Application Shell
// Agricultural Decision Intelligence Platform
// ============================================================

import { useState } from 'react';
import { useApp } from './context/AppContext';
import { t } from './i18n';
import type { FarmerTab } from './types';
import HomePage from './pages/HomePage';
import FarmPage from './pages/FarmPage';
import PesuPage from './pages/PesuPage';
import CropDoctorPage from './pages/CropDoctorPage';
import MorePage from './pages/MorePage';
import OnboardingPage from './pages/OnboardingPage';
import ProviderDashboard from './pages/ProviderDashboard';
import WhyEngine from './components/intelligence/WhyEngine';
import WhatIfEngine from './components/intelligence/WhatIfEngine';
import NotificationCenter from './components/common/NotificationCenter';

import OfficialDashboard from './pages/OfficialDashboard';
import FarmerMascot from './components/common/FarmerMascot';
import LanguageSelectScreen from './components/common/LanguageSelectScreen';

const NAV_ITEMS: { key: FarmerTab; icon: string; labelKey: string }[] = [
  { key: 'home', icon: '🏠', labelKey: 'nav.home' },
  { key: 'farm', icon: '🌾', labelKey: 'nav.farm' },
  { key: 'pesu', icon: '🎙️', labelKey: 'nav.pesu' },
  { key: 'crop-doctor', icon: '🌱', labelKey: 'nav.cropDoctor' },
  { key: 'more', icon: '☰', labelKey: 'nav.more' },
];

function AppContent() {
  const { state, dispatch } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProviderView, setShowProviderView] = useState(false);
  const [showOfficialView, setShowOfficialView] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Show onboarding if not authenticated
  if (!state.isAuthenticated) {
    return <OnboardingPage />;
  }

  // Official & Satellite Command Center
  if (showOfficialView) {
    return <OfficialDashboard onBackToFarmer={() => setShowOfficialView(false)} />;
  }

  // Provider Dashboard
  if (showProviderView) {
    return <ProviderDashboard onBackToFarmer={() => setShowProviderView(false)} />;
  }

  const renderPage = () => {
    switch (state.activeTab) {
      case 'home': return <HomePage />;
      case 'farm': return <FarmPage />;
      case 'pesu': return <PesuPage />;
      case 'crop-doctor': return <CropDoctorPage />;
      case 'more': return <MorePage onOpenOfficial={() => setShowOfficialView(true)} onOpenProvider={() => setShowProviderView(true)} />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="app-shell">
      {/* Demo Banner */}
      {state.isDemoMode && (
        <div className="demo-banner">
          🎮 {t('app.demo')} — {t('app.demoBanner')}
        </div>
      )}

      {/* Top Header */}
      <header className="app-header">
        <div className="app-header__brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden',
            border: '2px solid #f59e0b', background: '#fff', flexShrink: 0,
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
          }}>
            <img
              src="/images/farmer_mascot.jpg"
              alt="Mascot"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          </div>
          <span className="app-header__title">{t('app.name')}</span>
        </div>
        <div className="app-header__actions">
          {/* Official Satellite Portal Toggle */}
          <button
            className="app-header__action-btn"
            title={t('official.portal')}
            onClick={() => setShowOfficialView(true)}
            style={{ position: 'relative', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-paddy)' }}
          >
            🏛️
          </button>

          {/* Provider Dashboard Toggle */}
          <button
            className="app-header__action-btn"
            title={t('provider.dashboard')}
            onClick={() => setShowProviderView(true)}
          >
            🚜
          </button>

          {/* Notifications */}
          <button
            className="app-header__action-btn"
            title={t('common.notifications')}
            onClick={() => setShowNotifications(true)}
            style={{ position: 'relative' }}
          >
            🔔
            <span style={{
              position: 'absolute', top: '2px', right: '2px',
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--color-error)', border: '1.5px solid var(--color-paddy-dark)'
            }} />
          </button>

          {/* Luxury Language Switch */}
          <button
            className="app-header__action-btn"
            title={t('common.language')}
            onClick={() => setShowLanguageModal(true)}
            style={{ border: '1.5px solid rgba(245, 158, 11, 0.5)' }}
          >
            🌐
          </button>
        </div>
      </header>

      {/* Main Content — reactive to both tab and language */}
      <main className="app-content" key={`${state.activeTab}-${state.language}`}>
        {renderPage()}
      </main>

      {/* Interactive Cartoon Farmer Companion in Corner */}
      <FarmerMascot corner="bottom-right" size={56} />

      {/* Bottom Navigation */}
      <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
        {NAV_ITEMS.map(({ key, icon, labelKey }) => (
          <button
            key={key}
            className={`bottom-nav__item ${state.activeTab === key ? 'bottom-nav__item--active' : ''}`}
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: key })}
            aria-label={t(labelKey)}
            aria-current={state.activeTab === key ? 'page' : undefined}
          >
            <span className="bottom-nav__icon">{icon}</span>
            <span className="bottom-nav__label">{t(labelKey)}</span>
          </button>
        ))}
      </nav>

      {/* Overlay Engines */}
      {state.showWhyEngine && <WhyEngine />}
      {state.showWhatIf && <WhatIfEngine />}

      {/* Notification Center */}
      <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

      {/* Luxury Language Selection Modal */}
      {showLanguageModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px', animation: 'pageIn 0.2s ease'
        }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <button
              onClick={() => setShowLanguageModal(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px', zIndex: 20,
                background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
                width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
                fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              ✕
            </button>
            <LanguageSelectScreen onComplete={() => setShowLanguageModal(false)} isModal />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
