// ============================================================
// 🌾 NammaVivasayam AI — Provider Dashboard (REBUILT & FULLY FUNCTIONAL)
// Service provider's management interface with functional state & persistence
// ============================================================

import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import FarmerMascot from '../components/common/FarmerMascot';

interface ServiceRequest {
  id: string;
  farmerName: string;
  phone: string;
  farmLocation: string;
  taluk: string;
  service: string;
  acreage: number;
  preferredDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  agreedPrice: number;
  paymentStatus: 'UNPAID' | 'ESCROW' | 'SETTLED';
}

interface ProviderProfile {
  businessName: string;
  ownerName: string;
  phone: string;
  serviceCategory: string;
  serviceArea: string;
  description: string;
  acreRate: number;
  hourlyRate: number;
  isAvailable: boolean;
  upiId: string;
  verified: boolean;
  rating: number;
  totalJobsDone: number;
}

const DEFAULT_PROFILE: ProviderProfile = {
  businessName: 'Madurai Krishi Yantra Services',
  ownerName: 'கார்த்திக் ராஜா (Karthik Raja)',
  phone: '+91 98421 88721',
  serviceCategory: 'HARVESTER',
  serviceArea: 'Madurai, Melur, Vadipatti, Sivagangai, Theni',
  description: 'Specialized Claas & Kubota Combine Harvester services for paddy and pulses. 24x7 field breakdown support with GPS-tracked fleet.',
  acreRate: 2400,
  hourlyRate: 1950,
  isAvailable: true,
  upiId: 'maduraikrishiyantra@oksbi',
  verified: true,
  rating: 4.8,
  totalJobsDone: 142,
};

const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: 'SR-2024-001',
    farmerName: 'முருகன் (Murugan)',
    phone: '+91 98765 43210',
    farmLocation: 'Melur Road, Madurai',
    taluk: 'Melur',
    service: 'Combine Harvester — Paddy IR 64',
    acreage: 1.8,
    preferredDate: '2024-11-12',
    status: 'PENDING',
    agreedPrice: 4320,
    paymentStatus: 'ESCROW',
  },
  {
    id: 'SR-2024-002',
    farmerName: 'செல்வம் (Selvam)',
    phone: '+91 94432 11098',
    farmLocation: 'Manamadurai bypass, Sivagangai',
    taluk: 'Sivagangai',
    service: 'Combine Harvester — Samba Paddy',
    acreage: 2.5,
    preferredDate: '2024-11-15',
    status: 'ACCEPTED',
    agreedPrice: 6000,
    paymentStatus: 'ESCROW',
  },
  {
    id: 'SR-2024-003',
    farmerName: 'கண்ணன் (Kannan)',
    phone: '+91 97890 22341',
    farmLocation: 'Sholavandan, Vadipatti',
    taluk: 'Vadipatti',
    service: 'Combine Harvester — BPT 5204',
    acreage: 3.0,
    preferredDate: '2024-11-04',
    status: 'COMPLETED',
    agreedPrice: 7200,
    paymentStatus: 'SETTLED',
  },
  {
    id: 'SR-2024-004',
    farmerName: 'ராமன் (Raman)',
    phone: '+91 96551 77823',
    farmLocation: 'Aundipatti, Theni',
    taluk: 'Theni',
    service: 'Laser Land Leveler + 55HP Tractor',
    acreage: 2.0,
    preferredDate: '2024-11-20',
    status: 'PENDING',
    agreedPrice: 3800,
    paymentStatus: 'ESCROW',
  },
  {
    id: 'SR-2024-005',
    farmerName: 'சுப்பையா (Subbaiah)',
    phone: '+91 98433 99012',
    farmLocation: 'Thirumangalam South',
    taluk: 'Thirumangalam',
    service: 'Combine Harvester — Paddy IR 64',
    acreage: 1.5,
    preferredDate: '2024-11-01',
    status: 'COMPLETED',
    agreedPrice: 3600,
    paymentStatus: 'SETTLED',
  },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'var(--color-warning)',
  ACCEPTED: 'var(--color-water)',
  IN_PROGRESS: 'var(--color-paddy)',
  COMPLETED: 'var(--color-success)',
  REJECTED: 'var(--color-error)',
};

type ProviderView = 'overview' | 'requests' | 'earnings' | 'fleet' | 'settings';

interface ProviderDashboardProps {
  onBackToFarmer?: () => void;
}

export default function ProviderDashboard({ onBackToFarmer }: ProviderDashboardProps) {
  const { dispatch } = useApp();
  const [view, setView] = useState<ProviderView>('overview');
  const [requests, setRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('nv_provider_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_REQUESTS;
  });

  const [profile, setProfile] = useState<ProviderProfile>(() => {
    const saved = localStorage.getItem('nv_provider_profile');
    if (saved) {
      try { return { ...DEFAULT_PROFILE, ...JSON.parse(saved) }; } catch (e) { /* ignore */ }
    }
    return DEFAULT_PROFILE;
  });

  // Settings form state
  const [formBusinessName, setFormBusinessName] = useState(profile.businessName);
  const [formOwnerName, setFormOwnerName] = useState(profile.ownerName);
  const [formPhone, setFormPhone] = useState(profile.phone);
  const [formCategory, setFormCategory] = useState(profile.serviceCategory);
  const [formArea, setFormArea] = useState(profile.serviceArea);
  const [formDescription, setFormDescription] = useState(profile.description);
  const [formAcreRate, setFormAcreRate] = useState(profile.acreRate);
  const [formHourlyRate, setFormHourlyRate] = useState(profile.hourlyRate);
  const [formUpi, setFormUpi] = useState(profile.upiId);
  const [formAvailable, setFormAvailable] = useState(profile.isAvailable);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [requestFilter, setRequestFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'COMPLETED'>('ALL');

  // Persist requests
  useEffect(() => {
    localStorage.setItem('nv_provider_requests', JSON.stringify(requests));
  }, [requests]);

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const activeCount = requests.filter(r => r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS').length;
  const completedCount = requests.filter(r => r.status === 'COMPLETED').length;
  const totalGrossEarnings = requests
    .filter(r => r.status === 'COMPLETED')
    .reduce((sum, r) => sum + r.agreedPrice, 0);
  const commission = Math.round(totalGrossEarnings * 0.05);
  const netEarnings = totalGrossEarnings - commission;

  const handleAccept = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'ACCEPTED' } : r));
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
  };

  const handleComplete = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'COMPLETED', paymentStatus: 'SETTLED' } : r));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ProviderProfile = {
      ...profile,
      businessName: formBusinessName.trim() || profile.businessName,
      ownerName: formOwnerName.trim() || profile.ownerName,
      phone: formPhone.trim() || profile.phone,
      serviceCategory: formCategory,
      serviceArea: formArea.trim() || profile.serviceArea,
      description: formDescription.trim() || profile.description,
      acreRate: Number(formAcreRate) || profile.acreRate,
      hourlyRate: Number(formHourlyRate) || profile.hourlyRate,
      upiId: formUpi.trim() || profile.upiId,
      isAvailable: formAvailable,
    };
    setProfile(updated);
    localStorage.setItem('nv_provider_profile', JSON.stringify(updated));
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3500);
  };

  const handleReturnToFarmer = () => {
    if (onBackToFarmer) {
      onBackToFarmer();
    } else {
      dispatch({ type: 'SET_ACTIVE_TAB', payload: 'home' });
    }
  };

  const filteredRequests = requestFilter === 'ALL'
    ? requests
    : requests.filter(r => r.status === requestFilter);

  return (
    <div className="provider-layout" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '270px 1fr', background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside style={{
        background: 'linear-gradient(180deg, #12281b 0%, #0d1e14 100%)',
        color: 'white', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
        boxShadow: 'var(--shadow-md)', zIndex: 10
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
            🚜
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 'var(--text-base)', color: '#fff', letterSpacing: '-0.02em' }}>
              {t('app.name')}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-paddy-light)', fontWeight: 600 }}>
              {t('provider.dashboard')}
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        {[
          { key: 'overview' as ProviderView, icon: '📊', label: t('provider.overview') || 'Overview' },
          { key: 'requests' as ProviderView, icon: '📋', label: t('provider.requests'), badge: pendingCount },
          { key: 'earnings' as ProviderView, icon: '💰', label: t('provider.earnings') },
          { key: 'fleet' as ProviderView, icon: '🚜', label: 'Fleet & Machinery' },
          { key: 'settings' as ProviderView, icon: '⚙️', label: t('common.settings') },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setView(item.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '10px 14px',
              borderRadius: 'var(--radius-lg)', color: view === item.key ? '#fff' : 'rgba(255,255,255,0.7)', textAlign: 'left',
              background: view === item.key ? 'rgba(52, 211, 153, 0.2)' : 'transparent',
              border: view === item.key ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid transparent',
              cursor: 'pointer', transition: 'all 0.2s', fontWeight: view === item.key ? 700 : 500,
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            <span style={{ flex: 1, fontSize: 'var(--text-sm)' }}>{item.label}</span>
            {item.badge ? (
              <span style={{ background: 'var(--color-warning)', color: '#000', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 800 }}>
                {item.badge}
              </span>
            ) : null}
          </button>
        ))}

        {/* Active Profile Card in Sidebar */}
        <div style={{
          marginTop: 'auto', paddingTop: 'var(--space-5)', borderTop: '1px solid rgba(255,255,255,0.12)',
          display: 'flex', flexDirection: 'column', gap: 'var(--space-2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FarmerMascot size={38} pose="happy" interactive={false} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                  {profile.businessName}
                </div>
                <span style={{
                  width: '9px', height: '9px', borderRadius: '50%',
                  background: profile.isAvailable ? '#10b981' : '#9ca3af',
                  boxShadow: profile.isAvailable ? '0 0 8px #10b981' : 'none'
                }} title={profile.isAvailable ? 'Available for Bookings' : 'Offline'} />
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)' }}>
                ⭐ {profile.rating} ({profile.totalJobsDone} jobs)
              </div>
            </div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-paddy-light)' }}>
            ₹{profile.acreRate}/acre · ₹{profile.hourlyRate}/hr
          </div>
          <button
            onClick={handleReturnToFarmer}
            style={{
              marginTop: 'var(--space-2)', padding: '8px 12px', borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 'var(--text-xs)',
              fontWeight: 600, border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}
          >
            ← {t('provider.switchFarmer')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ padding: 'var(--space-8)', overflowY: 'auto', maxHeight: '100vh' }}>
        {/* Banner with Live Rates & Availability */}
        <div style={{
          background: 'linear-gradient(90deg, #064e3b 0%, #065f46 100%)',
          color: 'white', padding: 'var(--space-3) var(--space-5)', borderRadius: 'var(--radius-xl)',
          marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: '1.4rem' }}>🚜</span>
            <div>
              <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{profile.businessName}</span>
              <span style={{ margin: '0 8px', opacity: 0.5 }}>|</span>
              <span style={{ fontSize: 'var(--text-xs)', opacity: 0.9 }}>📍 {profile.serviceArea}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{
              padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 700,
              background: profile.isAvailable ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
              color: profile.isAvailable ? '#6ee7b7' : '#fca5a5', border: '1px solid rgba(255,255,255,0.15)'
            }}>
              {profile.isAvailable ? '🟢 Accepting Bookings' : '🔴 Currently Busy'}
            </span>
            <button
              onClick={() => setView('settings')}
              style={{
                background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
                padding: '4px 10px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)',
                cursor: 'pointer', fontWeight: 600
              }}
            >
              Edit Rates & Area
            </button>
          </div>
        </div>

        {/* Save feedback banner */}
        {saveSuccessMsg && (
          <div style={{
            background: 'var(--color-paddy-50)', color: 'var(--color-paddy-dark)',
            border: '1.5px solid var(--color-paddy)', padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)', animation: 'pageIn 0.3s ease'
          }}>
            ✅ <strong>Settings Saved!</strong> Your rates, business details, and service availability are live.
          </div>
        )}

        {/* ═══ 1. OVERVIEW ═══ */}
        {view === 'overview' && (
          <div style={{ animation: 'pageIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <div>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>📊 {t('provider.overview') || 'Provider Overview'}</h1>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                  Manage incoming farmer hire requests, active field jobs, and dispatch schedules
                </p>
              </div>
              <button
                className="btn btn--primary btn--sm"
                onClick={() => setView('requests')}
              >
                View All Requests ({requests.length})
              </button>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              {[
                { icon: '📋', label: t('provider.requests'), value: pendingCount, color: 'var(--color-warning)', sub: 'Requires response' },
                { icon: '🔧', label: t('provider.activeJobs'), value: activeCount, color: 'var(--color-water)', sub: 'Scheduled & queued' },
                { icon: '✅', label: t('provider.completed'), value: completedCount, color: 'var(--color-success)', sub: 'Total jobs completed' },
                { icon: '💰', label: t('provider.netEarnings'), value: `₹${netEarnings}`, color: 'var(--color-paddy-dark)', sub: 'Settled to UPI' },
              ].map(stat => (
                <div key={stat.label} className="card" style={{ padding: 'var(--space-4)', textAlign: 'left', borderTop: `4px solid ${stat.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontSize: '1.8rem' }}>{stat.icon}</span>
                    <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: stat.color }}>{stat.value}</span>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Immediate Action: Pending Requests */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0 }}>
                  🚨 Urgent Farmer Requests Awaiting Action ({pendingCount})
                </h2>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                  Accept to notify farmer and lock slot
                </span>
              </div>

              {pendingCount === 0 ? (
                <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                  ✅ All requests responded to. No pending approvals!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {requests.filter(r => r.status === 'PENDING').map(req => (
                    <div key={req.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)',
                      background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-light)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--color-paddy-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                          🌾
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                            {req.farmerName} · 📍 {req.farmLocation} ({req.acreage} acres)
                          </div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                            {req.service} · Date: <strong>{req.preferredDate}</strong> · Phone: {req.phone}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, color: 'var(--color-paddy-dark)', fontSize: 'var(--text-base)' }}>
                            ₹{req.agreedPrice}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--color-text-tertiary)' }}>Payment in Escrow</div>
                        </div>
                        <button
                          className="btn btn--primary btn--sm"
                          onClick={() => handleAccept(req.id)}
                        >
                          {t('provider.accept')}
                        </button>
                        <button
                          className="btn btn--ghost btn--sm"
                          style={{ color: 'var(--color-error)' }}
                          onClick={() => handleReject(req.id)}
                        >
                          {t('provider.reject')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* In Progress / Accepted Jobs */}
            <div className="card">
              <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                🔧 Active & Scheduled Jobs ({activeCount})
              </h2>
              {activeCount === 0 ? (
                <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                  No jobs currently active or in progress.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {requests.filter(r => r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS').map(req => (
                    <div key={req.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)',
                      background: 'var(--color-surface)', border: '1px solid var(--color-border)'
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                          {req.farmerName} — 📍 {req.farmLocation}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                          📅 Scheduled: {req.preferredDate} · {req.service} ({req.acreage} acres)
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 700, background: 'rgba(59, 130, 246, 0.15)', color: 'var(--color-water)' }}>
                          Accepted
                        </span>
                        <button
                          className="btn btn--primary btn--sm"
                          onClick={() => handleComplete(req.id)}
                        >
                          {t('provider.markComplete')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ 2. REQUESTS MANAGEMENT ═══ */}
        {view === 'requests' && (
          <div style={{ animation: 'pageIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <div>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>📋 {t('provider.requests')}</h1>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                  Filter and process farmer service bookings with real-time status transitions
                </p>
              </div>
              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: 'var(--space-2)', background: 'var(--color-surface)', padding: '4px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                {(['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setRequestFilter(tab)}
                    style={{
                      padding: '6px 14px', borderRadius: 'var(--radius-md)', border: 'none',
                      background: requestFilter === tab ? 'var(--color-paddy)' : 'transparent',
                      color: requestFilter === tab ? 'white' : 'var(--color-text-secondary)',
                      fontWeight: requestFilter === tab ? 700 : 500, fontSize: 'var(--text-xs)',
                      cursor: 'pointer', transition: 'all 0.15s'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {filteredRequests.map(req => (
                <div key={req.id} className="card" style={{ borderLeft: `5px solid ${STATUS_COLORS[req.status] || 'var(--color-border)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{ fontWeight: 800, fontSize: 'var(--text-base)' }}>{req.farmerName}</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', background: 'var(--color-bg-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
                          ID: {req.id}
                        </span>
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        📍 {req.farmLocation} ({req.taluk} Taluk) · 📱 {req.phone}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 700,
                        background: `${STATUS_COLORS[req.status]}20`, color: STATUS_COLORS[req.status]
                      }}>
                        {req.status}
                      </span>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-paddy-dark)', marginTop: '4px' }}>
                        ₹{req.agreedPrice}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)' }}>
                    <div>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>Service: </span>
                      <strong>{req.service}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>Target Date: </span>
                      <strong>{req.preferredDate}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>Area: </span>
                      <strong>{req.acreage} Acres</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                      Escrow: {req.paymentStatus === 'SETTLED' ? '✅ Paid to Provider' : '🔒 Held in Farmer Escrow'}
                    </span>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      {req.status === 'PENDING' && (
                        <>
                          <button className="btn btn--primary btn--sm" onClick={() => handleAccept(req.id)}>
                            {t('provider.accept')}
                          </button>
                          <button className="btn btn--ghost btn--sm" style={{ color: 'var(--color-error)' }} onClick={() => handleReject(req.id)}>
                            {t('provider.reject')}
                          </button>
                        </>
                      )}
                      {req.status === 'ACCEPTED' && (
                        <button className="btn btn--primary btn--sm" onClick={() => handleComplete(req.id)}>
                          ✅ {t('provider.markComplete')}
                        </button>
                      )}
                      {req.status === 'COMPLETED' && (
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-success)' }}>
                          Job Complete & Settlement Dispatched
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ 3. EARNINGS ═══ */}
        {view === 'earnings' && (
          <div style={{ animation: 'pageIn 0.3s ease' }}>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
              💰 {t('provider.earnings')}
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
              Breakdown of gross billing, platform commission, and automated UPI payouts
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              <div className="card" style={{ textAlign: 'center', borderTop: '4px solid var(--color-paddy)' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {t('provider.grossEarnings')}
                </div>
                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-paddy-dark)' }}>
                  ₹{totalGrossEarnings}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  From {completedCount} verified completed jobs
                </div>
              </div>

              <div className="card" style={{ textAlign: 'center', borderTop: '4px solid var(--color-warning)' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Platform Fee (5%)
                </div>
                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-warning)' }}>
                  ₹{commission}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  Platform maintenance & telemetry
                </div>
              </div>

              <div className="card" style={{ textAlign: 'center', borderTop: '4px solid var(--color-success)' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {t('provider.netEarnings')}
                </div>
                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-success)' }}>
                  ₹{netEarnings}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  Direct to UPI ({profile.upiId})
                </div>
              </div>
            </div>

            {/* Payout Log */}
            <div className="card">
              <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                📋 Completed & Settled Payouts
              </h2>
              {requests.filter(r => r.status === 'COMPLETED').map(req => (
                <div key={req.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-border-light)'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                      {req.farmerName} — {req.service}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                      📍 {req.farmLocation} · Date: {req.preferredDate}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--color-paddy-dark)' }}>
                      ₹{Math.round(req.agreedPrice * 0.95)}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--color-success)', fontWeight: 600 }}>
                      ✅ Settled (Net 95%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ 4. FLEET & MACHINERY ═══ */}
        {view === 'fleet' && (
          <div style={{ animation: 'pageIn 0.3s ease' }}>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
              🚜 Fleet & Equipment Inventory
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
              Active machinery registered for field booking in {profile.serviceArea}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
              {[
                { name: 'Claas CROP TIGER 30 Terra Trac', reg: 'TN-58-AG-4902', type: 'Track Combine Harvester', status: 'In Field (Melur)', fuel: '78%', hours: '1,420 hrs', icon: '🌾' },
                { name: 'Kubota DC-68G Paddy Master', reg: 'TN-58-AG-8114', type: 'Combine Harvester', status: 'Available in Yard', fuel: '92%', hours: '840 hrs', icon: '🚜' },
                { name: 'Mahindra 575 DI (47 HP) + Laser Leveler', reg: 'TN-58-TX-1022', type: 'Tractor & Precision Leveler', status: 'Available', fuel: '85%', hours: '2,100 hrs', icon: '🚜' },
                { name: 'DJI Agras T40 Agricultural Drone', reg: 'UIN-AG-2024-91', type: 'Spraying Drone (40L)', status: 'Charging (Base)', fuel: '100%', hours: '310 flights', icon: '🛸' },
              ].map(machine => (
                <div key={machine.reg} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                    <span style={{ fontSize: '2rem' }}>{machine.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 'var(--text-sm)' }}>{machine.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{machine.reg} · {machine.type}</div>
                    </div>
                    <span style={{
                      padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 700,
                      background: machine.status.includes('Available') ? 'var(--color-paddy-50)' : 'rgba(59,130,246,0.1)',
                      color: machine.status.includes('Available') ? 'var(--color-paddy-dark)' : 'var(--color-water)'
                    }}>
                      {machine.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-tertiary)', borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--space-2)' }}>
                    <span>Fuel/Battery: <strong>{machine.fuel}</strong></span>
                    <span>Runtime: <strong>{machine.hours}</strong></span>
                    <span>GPS: <strong>Active 🟢</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ 5. SETTINGS (NOW FULLY FUNCTIONAL AND PERSISTENT) ═══ */}
        {view === 'settings' && (
          <div style={{ animation: 'pageIn 0.3s ease' }}>
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>⚙️ {t('common.settings')} — Provider Profile</h1>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                Update your business name, hourly/acre rental rates, operational taluks, and availability status.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="card" style={{ maxWidth: '720px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                    🏢 {t('provider.businessName')} *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formBusinessName}
                    onChange={e => setFormBusinessName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                    👤 Contact Person / Owner Name *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formOwnerName}
                    onChange={e => setFormOwnerName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                    📱 Contact Mobile Number *
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                    🔧 {t('provider.serviceCategory')}
                  </label>
                  <select
                    className="form-input form-select"
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                  >
                    <option value="HARVESTER">Combine Harvester (Paddy / Grain)</option>
                    <option value="TRACTOR">Tractor & Tillage Implements</option>
                    <option value="SPRAYING">Agricultural Drone Spraying</option>
                    <option value="SOIL_TESTING">Mobile Soil Testing Lab</option>
                    <option value="IRRIGATION">Drip & Pump Repair Service</option>
                  </select>
                </div>
              </div>

              {/* Pricing Rates */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                    💵 Rate Per Acre (₹)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={formAcreRate}
                    onChange={e => setFormAcreRate(Number(e.target.value))}
                    min="500"
                    max="10000"
                    step="50"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                    ⏱️ Rate Per Hour (₹)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={formHourlyRate}
                    onChange={e => setFormHourlyRate(Number(e.target.value))}
                    min="300"
                    max="5000"
                    step="50"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                  📍 {t('provider.serviceArea')} (Taluks / Districts)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formArea}
                  onChange={e => setFormArea(e.target.value)}
                  placeholder="e.g. Madurai, Melur, Vadipatti, Sivagangai, Theni"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                  🏦 Bank UPI ID for Direct Settlement
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formUpi}
                  onChange={e => setFormUpi(e.target.value)}
                  placeholder="e.g. businessname@oksbi"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                  📝 {t('provider.description')}
                </label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '85px' }}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                />
              </div>

              {/* Availability Toggle */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)',
                background: 'var(--color-bg-subtle)', marginBottom: 'var(--space-6)',
                border: '1px solid var(--color-border-light)'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                    🟢 Available for New Farmer Bookings
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    Turn off during maintenance or when current slots are fully booked
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formAvailable}
                  onChange={e => setFormAvailable(e.target.checked)}
                  style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: 'var(--color-paddy)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button type="submit" className="btn btn--primary" style={{ flex: 1 }}>
                  💾 {t('common.save')}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setFormBusinessName(profile.businessName);
                    setFormArea(profile.serviceArea);
                    setFormAcreRate(profile.acreRate);
                    setFormHourlyRate(profile.hourlyRate);
                  }}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
