// ============================================================
// 🌾 NammaVivasayam AI — More Page (REBUILT)
// Settings, Language, Risk, Timeline, Services — Fully functional
// ============================================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t, getLanguageOptions } from '../i18n';
import type { SupportedLanguage } from '../i18n';
import UzhavanGuide from '../components/farmer/UzhavanGuide';
import ServiceBookingModal, { type AgriculturalServiceItem } from '../components/services/ServiceBookingModal';
import PlanManager from '../components/plans/PlanManager';

type MoreSection = 'menu' | 'guide' | 'risk' | 'timeline' | 'services' | 'feedback' | 'organization' | 'plans' | 'settings';

interface MorePageProps {
  onOpenOfficial?: () => void;
  onOpenProvider?: () => void;
}

const AGRICULTURAL_SERVICES: AgriculturalServiceItem[] = [
  {
    id: 'svc1',
    icon: '🚜',
    name: 'Combine Harvester — Paddy IR 64',
    category: 'Harvesting Machinery',
    provider: 'Madurai Krishi Farm Services',
    isDemoProvider: true,
    providerDescription: 'Registered agri machinery cooperative operating 12 Kubota and Claas combine harvesters across Madurai district.',
    rating: 4.8,
    completedJobs: 142,
    serviceArea: 'Madurai, Melur, Vadipatti, Thirumangalam',
    description: 'Track-mounted combine harvester for lodged or standing paddy. Threshes, cleans, and bags grain with <1.5% loss.',
    pricePerUnit: 2500,
    priceType: 'per acre',
    estimatedDuration: '1.5 - 2 hours / acre',
    availability: 'Available Oct 15 - Nov 25 (Peak Samba Season)',
    workerName: 'K. Senthil Murugan',
    workerRole: 'Senior Combine Operator & Mechanic',
    workerExperience: '9 years operating heavy paddy equipment',
    phone: '+91 94432 10890',
    terms: 'Field must be drained 7 days before harvest. Diesel and operator wage included in per-acre rate.',
    cancellation: 'Free cancellation up to 24 hours prior to scheduled arrival.'
  },
  {
    id: 'svc2',
    icon: '🚜',
    name: '45 HP Tractor + 42-Blade Rotavator',
    category: 'Land Preparation',
    provider: 'Dindigul Mechanization Center',
    isDemoProvider: true,
    providerDescription: 'High torque tilling tractors with laser levelers and cage wheels for wet paddy puddling.',
    rating: 4.5,
    completedJobs: 89,
    serviceArea: 'Vadipatti, Usilampatti, Madurai North',
    description: 'Deep tilling, weed pulverization, and mud slurry preparation for rapid seedling transplanting.',
    pricePerUnit: 1800,
    priceType: 'per acre',
    estimatedDuration: '1 hour / acre',
    availability: 'Immediate / Year-round dispatch',
    workerName: 'R. Muthuvel',
    workerRole: 'Tractor Specialist',
    workerExperience: '6 years tilling alluvial and black clay soils',
    phone: '+91 98421 55678',
    terms: 'Farmer marks boundary bunds. Diesel and driver included.',
    cancellation: 'Free cancellation up to 12 hours before slot.'
  },
  {
    id: 'svc3',
    icon: '🧪',
    name: 'Soil Testing — Comprehensive NPK & Micro-nutrients',
    category: 'Soil Diagnostic Lab',
    provider: 'Tamil Nadu Agriculture Lab (Madurai)',
    isDemoProvider: true,
    providerDescription: 'ICAR accredited soil fertility testing facility analyzing 12 essential macro and micro-nutrients.',
    rating: 4.9,
    completedJobs: 320,
    serviceArea: 'All 6 Madurai Taluks',
    description: 'Laboratory analysis of pH, EC, Organic Carbon, N, P, K, Zinc, Iron, and Boron with custom TNAU fertilizer prescription.',
    pricePerUnit: 450,
    priceType: 'per sample test',
    estimatedDuration: 'Field collection 30 mins; Report in 48 hours',
    availability: 'Daily doorstep sample pickup',
    workerName: 'Dr. V. Meenakshi',
    workerRole: 'Soil Chemist & Field Analyst',
    workerExperience: '11 years ICAR & TNAU certification',
    phone: '+91 97890 12345',
    terms: 'Composite soil sample taken from 5 field points at 15cm root-zone depth.',
    cancellation: 'Free cancellation before field technician departure.'
  },
  {
    id: 'svc4',
    icon: '✈️',
    name: 'Agri Drone Spraying — Micronutrient & Organic Repellent',
    category: 'Precision Agriculture',
    provider: 'AeroAgri Tamil Nadu Drones',
    isDemoProvider: true,
    providerDescription: 'DGCA certified drone fleet with 16-liter automated spray tanks and obstacle avoidance radar.',
    rating: 4.7,
    completedJobs: 215,
    serviceArea: 'Melur, Thirumangalam, Madurai South',
    description: 'Precision ultra-low-volume foliar spraying. Eliminates crop trampling and saves 90% water compared to manual knapsack.',
    pricePerUnit: 800,
    priceType: 'per acre',
    estimatedDuration: '10-15 mins / acre',
    availability: 'Slots available within 24 hours notice',
    workerName: 'A. Vijay Kumar',
    workerRole: 'DGCA Certified Remote Pilot',
    workerExperience: '400+ flying hours on agriculture missions',
    phone: '+91 99520 67890',
    terms: 'Chemicals or bio-formulations provided by farmer or pre-ordered via portal.',
    cancellation: 'Free automatic rescheduling if wind exceeds 18 km/h or during rainfall.'
  },
  {
    id: 'svc5',
    icon: '💧',
    name: 'Drip & Micro-Sprinkler Irrigation Installation',
    category: 'Water Engineering',
    provider: 'Vaigai Smart Water Systems',
    isDemoProvider: true,
    providerDescription: 'Turnkey micro-irrigation installation contractors affiliated with PMKSY subsidy documentation.',
    rating: 4.6,
    completedJobs: 67,
    serviceArea: 'Madurai, Theni, and Dindigul districts',
    description: 'Complete layout of sub-main pipes, inline pressure compensating drippers, screen filters, and fertigation venturi injector.',
    pricePerUnit: 15000,
    priceType: 'per acre (subsidized rate)',
    estimatedDuration: '2 days turnkey installation',
    availability: 'Engineer field survey within 48 hours',
    workerName: 'M. Pandian',
    workerRole: 'Irrigation Field Engineer',
    workerExperience: '8 years engineering drip layouts for paddy AWD & sugarcane',
    phone: '+91 96290 43211',
    terms: 'Borewell or well water output of minimum 1 HP required on site.',
    cancellation: 'Initial field survey fee credited toward installation.'
  }
];

export default function MorePage({ onOpenOfficial, onOpenProvider }: MorePageProps) {
  const { state, dispatch } = useApp();
  const [section, setSection] = useState<MoreSection>('menu');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<AgriculturalServiceItem | null>(null);
  const [confirmedBookingNotice, setConfirmedBookingNotice] = useState<string | null>(null);
  const [feedbackAction, setFeedbackAction] = useState('');
  const [feedbackOutcome, setFeedbackOutcome] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  const languages = getLanguageOptions();

  const handleLanguageChange = (langCode: SupportedLanguage) => {
    dispatch({ type: 'SET_LANGUAGE', payload: langCode });
  };

  const handleFeedbackSubmit = () => {
    if (feedbackAction) {
      setFeedbackSubmitted(true);
      setTimeout(() => setFeedbackSubmitted(false), 3000);
    }
  };

  if (section !== 'menu') {
    return (
      <div style={{ padding: 'var(--space-4)', animation: 'pageIn 0.3s ease' }}>
        <button onClick={() => setSection('menu')} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', color: 'var(--color-paddy-dark)', fontWeight: 600, fontSize: 'var(--text-sm)', background: 'none', border: 'none', cursor: 'pointer' }}>
          ← {t('common.back')}
        </button>

        {/* ═══ UZHAVAN GUIDE ═══ */}
        {section === 'guide' && (
          <UzhavanGuide onBack={() => setSection('menu')} />
        )}

        {/* ═══ RISK RADAR ═══ */}
        {section === 'risk' && (
          <>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>🎯 {t('risk.title')}</h2>
            {[
              { icon: '💧', key: 'waterStress', level: 'medium', trend: 'increasing', pct: 65, detail: 'Soil moisture declining over 3 days. NDWI: 0.38 → 0.32. Monitor closely.' },
              { icon: '🌡️', key: 'heat', level: 'medium', trend: 'stable', pct: 55, detail: 'Temperature 34°C near stress threshold (35°C) for flowering paddy.' },
              { icon: '🌧️', key: 'heavyRain', level: 'medium', trend: 'increasing', pct: 60, detail: 'IMD forecasts 68% rain probability. Check drainage channels.' },
              { icon: '🦠', key: 'disease', level: 'low', trend: 'stable', pct: 20, detail: 'No disease indicators. Humidity 72% — watch for Sheath Blight.' },
              { icon: '🐛', key: 'pest', level: 'low', trend: 'stable', pct: 15, detail: 'No pest activity. Keep field borders clean.' },
              { icon: '🌾', key: 'harvest', level: 'low', trend: 'stable', pct: 10, detail: 'Harvest expected November 1-15. ~45 days remaining.' },
              { icon: '😓', key: 'cropStress', level: 'low', trend: 'stable', pct: 12, detail: 'NDVI: 0.72 — healthy vegetation. No stress detected.' },
            ].map(risk => (
              <div key={risk.key} className="card" style={{ marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: '1.5rem' }}>{risk.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{t(`risk.${risk.key}`)}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: risk.level === 'medium' ? 'var(--color-warning)' : 'var(--color-success)' }}>
                      {t(`risk.${risk.level}`)} · {t(`risk.${risk.trend}`)}
                    </div>
                  </div>
                  <span style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: risk.level === 'medium' ? 'var(--color-warning)' : 'var(--color-success)' }}>{risk.pct}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-2)' }}>
                  <div style={{ width: `${risk.pct}%`, height: '100%', borderRadius: 'var(--radius-full)', background: risk.level === 'medium' ? 'var(--color-warning)' : 'var(--color-success)' }} />
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{risk.detail}</p>
              </div>
            ))}
          </>
        )}

        {/* ═══ TIMELINE ═══ */}
        {section === 'timeline' && (
          <>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>📅 {t('timeline.title')}</h2>
            {[
              { icon: '💧', type: 'recommendation', title: t('decision.mainTitle'), date: 'Sep 30, 06:00', detail: t('decision.mainDesc') },
              { icon: '🛰️', type: 'observation', title: 'Sentinel-2 NDVI Update', date: 'Sep 28, 10:30', detail: 'NDVI: 0.72 (Healthy). Cloud cover: 42%. Source: ESA Copernicus.' },
              { icon: '🌧️', type: 'weather', title: t('weather.rainfallProbability') + ' 68%', date: 'Sep 30, 03:00', detail: 'IMD Madurai district forecast. Expected ~4mm evening.' },
              { icon: '🌿', type: 'observation', title: t('soil.moisture') + ' 31%', date: 'Sep 29, 14:00', detail: 'Soil sensor reading. Status: Adequate for flowering paddy.' },
              { icon: '🌾', type: 'planting', title: t('stage.flowering') + ' — Paddy IR 64', date: 'Sep 22', detail: 'Crop entered flowering stage. Critical water management period.' },
              { icon: '🧪', type: 'fertilizer', title: t('timeline.fertilizer') + ' — Potassium', date: 'Sep 15', detail: 'Applied KCl 25 kg/acre for grain filling preparation.' },
              { icon: '🌱', type: 'planting', title: t('timeline.planting') + ' — Paddy IR 64', date: 'Jul 15', detail: 'Transplanted 1.8 acres. Alluvial soil, canal irrigation.' },
            ].map((event, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', position: 'relative' }}>
                {i < 6 && <div style={{ position: 'absolute', left: '19px', top: '40px', bottom: '-16px', width: '2px', background: 'var(--color-border-light)' }} />}
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-paddy-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0, zIndex: 1 }}>{event.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{event.title}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: '2px' }}>{event.date}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{event.detail}</div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ═══ SERVICES ═══ */}
        {section === 'services' && (
          <>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>🔧 {t('services.title')}</h2>
            {confirmedBookingNotice && (
              <div style={{ padding: 'var(--space-4)', background: 'rgba(34,197,94,0.1)', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--color-success)', marginBottom: 'var(--space-4)', textAlign: 'center' }}>
                <span style={{ fontSize: '2.5rem' }}>✅</span>
                <div style={{ fontWeight: 800, color: 'var(--color-paddy-dark)', fontSize: 'var(--text-base)', marginTop: 'var(--space-1)' }}>
                  {confirmedBookingNotice}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                  Service provider has received your confirmed request with farm acreage and preferred date.
                </div>
              </div>
            )}

            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
              Click any agricultural service below to inspect complete provider credentials, worker qualifications, transparent rates, and choose your preferred date before booking.
            </div>

            {AGRICULTURAL_SERVICES.map(svc => (
              <div key={svc.id} className="card" style={{ marginBottom: 'var(--space-3)', border: '1px solid var(--color-border-light)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-lg)', background: 'var(--color-paddy-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                    {svc.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                      <div style={{ fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--color-paddy-dark)' }}>{svc.name}</div>
                      <span style={{ fontSize: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#b45309', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                        {svc.isDemoProvider ? 'DEMO PROVIDER' : 'VERIFIED'}
                      </span>
                    </div>

                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {svc.provider} · ⭐ {svc.rating} ({svc.completedJobs} jobs)
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '4px', lineHeight: 1.4 }}>
                      👤 Specialist: <strong>{svc.workerName}</strong> ({svc.workerRole})
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-3)', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontWeight: 800, color: 'var(--color-paddy-dark)', fontSize: '15px' }}>
                        ₹{svc.pricePerUnit.toLocaleString('en-IN')}{' '}
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 400, color: 'var(--color-text-secondary)' }}>/{svc.priceType}</span>
                      </span>

                      {/* User Request Requirement 6: DO NOT book immediately. Show View Details & Book button */}
                      <button
                        onClick={() => setSelectedServiceForModal(svc)}
                        className="btn btn--primary btn--sm"
                        style={{ fontSize: 'var(--text-xs)', padding: '6px 14px' }}
                      >
                        🔍 View Details & Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {selectedServiceForModal && (
              <ServiceBookingModal
                service={selectedServiceForModal}
                onClose={() => setSelectedServiceForModal(null)}
                onConfirmed={(booking) => {
                  setConfirmedBookingNotice(`🎉 Booking ${booking.bookingId} Confirmed for ${selectedServiceForModal.name}! Total: ₹${booking.grossAmount}`);
                  setSelectedServiceForModal(null);
                }}
              />
            )}

            {onOpenProvider && (
              <button
                className="btn btn--ghost"
                onClick={onOpenProvider}
                style={{ width: '100%', marginTop: 'var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid var(--color-border)' }}
              >
                🚜 {t('provider.dashboard')} →
              </button>
            )}
          </>
        )}

        {/* ═══ FEEDBACK ═══ */}
        {section === 'feedback' && (
          <>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>💬 {t('feedback.title')}</h2>
            {feedbackSubmitted ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>🙏</div>
                <div style={{ fontWeight: 700, color: 'var(--color-paddy-dark)', fontSize: 'var(--text-lg)' }}>{t('feedback.thankYou')}</div>
              </div>
            ) : (
              <div className="card">
                <div style={{ padding: 'var(--space-3)', background: 'var(--color-paddy-50)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>💧 {t('decision.mainTitle')}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('decision.confidence')}: 87%</div>
                </div>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ fontWeight: 600, fontSize: 'var(--text-sm)', display: 'block', marginBottom: 'var(--space-2)' }}>{t('feedback.howWasIt')}</label>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {['done', 'notDone', 'partiallyDone'].map(a => (
                      <button key={a} onClick={() => setFeedbackAction(a)} style={{ flex: 1, padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: feedbackAction === a ? '2px solid var(--color-paddy)' : '1px solid var(--color-border)', background: feedbackAction === a ? 'var(--color-paddy-50)' : 'white', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer' }}>
                        {t(`feedback.${a}`)}
                      </button>
                    ))}
                  </div>
                </div>
                {feedbackAction && (
                  <div style={{ marginBottom: 'var(--space-4)', animation: 'pageIn 0.2s ease' }}>
                    <label style={{ fontWeight: 600, fontSize: 'var(--text-sm)', display: 'block', marginBottom: 'var(--space-2)' }}>Result?</label>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      {['worked', 'didNotWork', 'partiallyWorked'].map(o => (
                        <button key={o} onClick={() => setFeedbackOutcome(o)} style={{ flex: 1, padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: feedbackOutcome === o ? '2px solid var(--color-paddy)' : '1px solid var(--color-border)', background: feedbackOutcome === o ? 'var(--color-paddy-50)' : 'white', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer' }}>
                          {t(`feedback.${o}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="form-group">
                  <textarea className="form-input" placeholder={t('feedback.addObservation')} value={feedbackText} onChange={e => setFeedbackText(e.target.value)} style={{ minHeight: '80px' }} />
                </div>
                <button className="btn btn--primary" onClick={handleFeedbackSubmit} disabled={!feedbackAction} style={{ width: '100%' }}>
                  {t('feedback.submit')}
                </button>
              </div>
            )}
          </>
        )}

        {/* ═══ ORGANIZATION ═══ */}
        {section === 'organization' && (
          <>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>🏛️ {t('organization.dashboard')}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              {[
                { icon: '🌾', label: t('organization.farms'), value: '28', color: 'var(--color-paddy)' },
                { icon: '👥', label: t('organization.members'), value: '32', color: 'var(--color-water)' },
                { icon: '⚠️', label: t('organization.activeRisks'), value: '12', color: 'var(--color-warning)' },
                { icon: '🔧', label: t('organization.serviceRequests'), value: '5', color: 'var(--color-harvest)' },
              ].map(s => (
                <div key={s.label} className="card" style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
              <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-1)' }}>⚠️ {t('organization.areaAlert')}</h4>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                {t('organization.aggregateAlert', { count: '8' })}
              </p>
            </div>
            {onOpenOfficial && (
              <button
                className="btn btn--primary"
                onClick={onOpenOfficial}
                style={{ width: '100%', marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                🏛️ {t('official.portal')} →
              </button>
            )}
          </>
        )}

        {/* ═══ PLANS (User Request 9, 10, 11, 12) ═══ */}
        {section === 'plans' && (
          <PlanManager onPlanChanged={() => {}} onClose={() => setSection('menu')} />
        )}

        {/* ═══ SETTINGS ═══ */}
        {section === 'settings' && (
          <>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>⚙️ {t('common.settings')}</h2>

            {/* Active Plan UI & Switcher (User Request 13) */}
            <div className="card" style={{ marginBottom: 'var(--space-4)', borderLeft: '4px solid var(--color-paddy)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Current Subscription
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-paddy-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{state.plan === 'FREE' ? '🌾 FREE FARMER' : state.plan === 'PAID' ? '⭐ ADVANCED FARMER' : '🏛️ ORGANIZATION TIER'}</span>
                    <span style={{ fontSize: '10px', background: 'var(--color-success)', color: '#fff', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                      ACTIVE
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSection('plans')}
                  className="btn btn--sm btn--primary"
                  style={{ fontSize: '11px', padding: '6px 14px' }}
                >
                  {state.plan === 'FREE' ? '⚡ Upgrade' : '📋 Manage Plan'}
                </button>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                {state.plan === 'FREE'
                  ? 'Core agricultural intelligence is 100% free: WHY Engine, WHAT-IF Engine, Crop Doctor, and Multilingual Voice.'
                  : 'Advanced tier active: Sentinel-2 spectral indices, multi-scenario simulations, and priority provider access.'}
              </div>
            </div>

            <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-3)' }}>🌐 {t('common.language')}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)' }}>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    style={{
                      padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)',
                      border: state.language === lang.code ? '2px solid var(--color-paddy)' : '1px solid var(--color-border-light)',
                      background: state.language === lang.code ? 'var(--color-paddy-50)' : 'white',
                      textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontWeight: state.language === lang.code ? 700 : 400, color: state.language === lang.code ? 'var(--color-paddy-dark)' : 'var(--color-text-primary)' }}>
                      {lang.nativeName}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{lang.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="card" style={{ marginBottom: 'var(--space-3)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>👤 {t('common.profile')}</h3>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                <div>முருகன் (Murugan)</div>
                <div>📱 +91 98765 43210</div>
                <div>📍 Madurai, Tamil Nadu</div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>🎮 {t('common.demoMode')}</span>
                <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(234,179,8,0.15)', color: 'var(--color-warning)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  {state.isDemoMode ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>

            <button
              onClick={() => dispatch({ type: 'LOGOUT' })}
              style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', background: 'rgba(239,68,68,0.1)', color: 'var(--color-error)', fontWeight: 600, border: 'none', cursor: 'pointer', marginTop: 'var(--space-2)' }}
            >
              🚪 {t('common.logout')}
            </button>
          </>
        )}
      </div>
    );
  }

  // ═══ MAIN MENU ═══
  const menuItems = [
    { key: 'guide' as MoreSection, icon: '🌾', label: state.language === 'ta' ? 'உழவன் கையேடு (Uzhavan Guide)' : 'Uzhavan Smart Guide', color: 'var(--color-paddy)' },
    { key: 'risk' as MoreSection, icon: '🎯', label: t('risk.title'), color: 'var(--color-warning)' },
    { key: 'timeline' as MoreSection, icon: '📅', label: t('timeline.title'), color: 'var(--color-water)' },
    { key: 'services' as MoreSection, icon: '🔧', label: t('services.title'), color: 'var(--color-harvest)' },
    { key: 'feedback' as MoreSection, icon: '💬', label: t('feedback.title'), color: 'var(--color-paddy)' },
    { key: 'organization' as MoreSection, icon: '🏛️', label: t('organization.dashboard'), color: 'var(--color-earth-dark)' },
    { key: 'plans' as MoreSection, icon: '📋', label: t('plans.plans') || 'Plans', color: 'var(--color-success)' },
    { key: 'settings' as MoreSection, icon: '⚙️', label: t('common.settings'), color: 'var(--color-text-secondary)' },
  ];

  return (
    <div style={{ padding: 'var(--space-4)', animation: 'pageIn 0.3s ease' }}>
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
        {t('nav.more')}
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {menuItems.map(item => (
          <button
            key={item.key}
            onClick={() => setSection(item.key)}
            className="card"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer', textAlign: 'left' }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
              {item.icon}
            </div>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 'var(--text-sm)' }}>{item.label}</span>
            <span style={{ color: 'var(--color-text-tertiary)' }}>→</span>
          </button>
        ))}
      </div>

      {/* Current Language Display */}
      <div style={{ marginTop: 'var(--space-4)', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
        🌐 {languages.find(l => l.code === state.language)?.nativeName} ({languages.find(l => l.code === state.language)?.name})
      </div>
    </div>
  );
}
