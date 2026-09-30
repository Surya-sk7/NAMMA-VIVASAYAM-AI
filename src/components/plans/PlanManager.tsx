// ============================================================
// 🌾 NammaVivasayam AI — Central Plan Management & Sandbox Checkout
// Enforces FREE vs PAID vs ORGANIZATION entitlements
// Instant Free activation (no payment), Safe Sandbox checkout for Paid
// ============================================================

import { useState } from 'react';
import { useApp, type FarmerPlan, type PlanFeature, checkPlanAccess } from '../../context/AppContext';

interface PlanManagerProps {
  onPlanChanged?: (newPlan: FarmerPlan) => void;
  onClose?: () => void;
}

export default function PlanManager({ onPlanChanged, onClose }: PlanManagerProps) {
  const { state, dispatch } = useApp();
  const currentPlan = state.plan;

  const [checkoutModalPlan, setCheckoutModalPlan] = useState<FarmerPlan | null>(null);
  const [demoPaymentMethod, setDemoPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);
  const [freePlanNotice, setFreePlanNotice] = useState(false);

  // Activate FREE Plan Immediately (No payment required, no card form)
  const handleSelectFreePlan = () => {
    dispatch({ type: 'SET_PLAN', payload: 'FREE' });
    setFreePlanNotice(true);
    if (onPlanChanged) onPlanChanged('FREE');
    setTimeout(() => setFreePlanNotice(false), 4000);
  };

  // Open Safe Sandbox Checkout for Paid Plan
  const handleOpenPaidCheckout = (planToBuy: FarmerPlan) => {
    setCheckoutModalPlan(planToBuy);
  };

  // Execute Simulated Sandbox Payment (No real credentials collected)
  const handleCompleteSandboxPayment = () => {
    if (!checkoutModalPlan) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      const selected = checkoutModalPlan;
      dispatch({ type: 'SET_PLAN', payload: selected });
      setIsProcessingPayment(false);
      setCheckoutModalPlan(null);
      setPaymentSuccessMessage(`🎉 ${selected} Plan Activated Successfully!`);
      if (onPlanChanged) onPlanChanged(selected);
      setTimeout(() => setPaymentSuccessMessage(null), 5000);
    }, 900);
  };

  const planFeaturesList: { name: string; feature: PlanFeature; description: string }[] = [
    { name: 'Core Agricultural Intelligence', feature: 'basicIntelligence', description: 'Real-time soil, crop stage, and weather advisories' },
    { name: 'Explainable AI (WHY Engine)', feature: 'basicWhy', description: 'Transparent agronomic evidence and telemetry breakdown' },
    { name: 'Basic WHAT-IF Simulation', feature: 'basicWhatIf', description: 'Decision comparison (Irrigate today vs Wait 2 days)' },
    { name: 'Crop Doctor (Image Diagnosis)', feature: 'basicCropDoctor', description: 'Pest & disease identification with ICAR remedies' },
    { name: 'Multilingual Voice Assistance', feature: 'multilingualVoice', description: 'Fluent regional speech synthesis across 10 Indian languages' },
    { name: 'Advanced Farm Intelligence', feature: 'advancedAnalytics', description: 'Deep root-zone moisture forecasting and historical yield analytics' },
    { name: 'Sentinel-2 Spectral Indices (NDRE/SWIR/SAR)', feature: 'satelliteSpectral', description: 'High-res synthetic aperture radar soil moisture & chlorophyll layers' },
    { name: 'Multi-Scenario Climate Simulations', feature: 'multiScenarioWhatIf', description: 'Simulate rain shocks, borewell salinity, and drought stress' },
    { name: 'Official Advisory PDF Export', feature: 'advancedReports', description: 'Government compliant crop damage and compliance reports' },
    { name: 'District Organization Command Center', feature: 'organizationDashboard', description: 'FPO / cooperative cluster analytics and group advisories' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Plan Header & Status Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
        border: '1.5px solid var(--color-paddy, #10b981)',
        borderRadius: '16px', padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-paddy-dark, #065f46)', fontWeight: 800 }}>
            Active Subscription Tier
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{currentPlan === 'FREE' ? '🌱 FREE FARMER' : currentPlan === 'PAID' ? '⭐ ADVANCED FARMER' : '🏛️ FPO / ORGANIZATION'}</span>
            <span style={{
              fontSize: '11px', padding: '2px 8px', borderRadius: '999px',
              background: '#10b981', color: '#062b1b', fontWeight: 800
            }}>
              ACTIVE
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary, #6b7280)', marginTop: '4px' }}>
            {currentPlan === 'FREE'
              ? 'Core agronomic intelligence, AI recommendations & Crop Doctor — 100% Free Forever'
              : currentPlan === 'PAID'
              ? 'Full Precision Agriculture Suite, Advanced Spectral Layers & Priority Support'
              : 'FPO Regional Command Center & Cluster Telemetry Enabled'}
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className="btn btn--ghost" style={{ fontSize: '13px' }}>
            ← Back to Settings
          </button>
        )}
      </div>

      {/* Free Plan Instant Activation Notice */}
      {freePlanNotice && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981',
          color: '#065f46', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
          animation: 'fadeIn 0.3s ease'
        }}>
          ✅ Free Plan activated! No payment required. All core agricultural intelligence is ready to use.
        </div>
      )}

      {/* Payment Success Alert */}
      {paymentSuccessMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.25)', border: '1.5px solid #10b981',
          color: '#065f46', padding: '14px 18px', borderRadius: '12px', fontSize: '14px', fontWeight: 800,
          animation: 'fadeIn 0.3s ease'
        }}>
          {paymentSuccessMessage}
        </div>
      )}

      {/* 3 Tier Pricing Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* TIER 1: FREE FARMER PLAN */}
        <div style={{
          border: currentPlan === 'FREE' ? '2.5px solid #10b981' : '1px solid var(--color-border, #e5e7eb)',
          borderRadius: '16px', padding: '20px', background: 'var(--color-bg-card, #ffffff)',
          display: 'flex', flexDirection: 'column', position: 'relative',
          boxShadow: currentPlan === 'FREE' ? '0 8px 24px rgba(16, 185, 129, 0.2)' : 'none'
        }}>
          {currentPlan === 'FREE' && (
            <span style={{
              position: 'absolute', top: '-10px', right: '16px',
              background: '#10b981', color: '#fff', fontSize: '10px', fontWeight: 800,
              padding: '2px 8px', borderRadius: '999px'
            }}>
              CURRENT PLAN
            </span>
          )}
          <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px 0' }}>🌱 Free Farmer</h3>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-paddy-dark, #065f46)', margin: '8px 0' }}>
            ₹0 <span style={{ fontSize: '12px', fontWeight: 400, color: '#6b7280' }}>/ Forever</span>
          </div>
          <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 16px 0', lineHeight: 1.4 }}>
            Zero fees, no payment card needed. Full access to everyday farming decisions and Crop Doctor.
          </p>
          <ul style={{ fontSize: '11px', color: '#374151', paddingLeft: '18px', margin: '0 0 20px 0', lineHeight: 1.8 }}>
            <li>✓ Today's Farm Decision</li>
            <li>✓ Transparent WHY Engine</li>
            <li>✓ Basic WHAT-IF Simulation</li>
            <li>✓ Visual Crop Doctor</li>
            <li>✓ Multilingual Speech (10 Languages)</li>
          </ul>
          <button
            type="button"
            onClick={handleSelectFreePlan}
            disabled={currentPlan === 'FREE'}
            style={{
              marginTop: 'auto', padding: '10px', borderRadius: '10px',
              background: currentPlan === 'FREE' ? '#e5e7eb' : '#10b981',
              color: currentPlan === 'FREE' ? '#9ca3af' : '#ffffff',
              border: 'none', fontWeight: 800, fontSize: '12px',
              cursor: currentPlan === 'FREE' ? 'default' : 'pointer'
            }}
          >
            {currentPlan === 'FREE' ? 'Active Plan' : 'Switch to Free Plan'}
          </button>
        </div>

        {/* TIER 2: ADVANCED / PAID FARMER PLAN */}
        <div style={{
          border: currentPlan === 'PAID' ? '2.5px solid #f59e0b' : '1px solid var(--color-border, #e5e7eb)',
          borderRadius: '16px', padding: '20px', background: 'var(--color-bg-card, #ffffff)',
          display: 'flex', flexDirection: 'column', position: 'relative',
          boxShadow: currentPlan === 'PAID' ? '0 8px 24px rgba(245, 158, 11, 0.25)' : 'none'
        }}>
          {currentPlan === 'PAID' ? (
            <span style={{
              position: 'absolute', top: '-10px', right: '16px',
              background: '#f59e0b', color: '#fff', fontSize: '10px', fontWeight: 800,
              padding: '2px 8px', borderRadius: '999px'
            }}>
              CURRENT PLAN
            </span>
          ) : (
            <span style={{
              position: 'absolute', top: '-10px', right: '16px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', fontSize: '10px', fontWeight: 800,
              padding: '2px 8px', borderRadius: '999px'
            }}>
              POPULAR
            </span>
          )}
          <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px 0' }}>⭐ Advanced Farmer</h3>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#b45309', margin: '8px 0' }}>
            ₹499 <span style={{ fontSize: '12px', fontWeight: 400, color: '#6b7280' }}>/ Season (4 Months)</span>
          </div>
          <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 16px 0', lineHeight: 1.4 }}>
            For commercial yields and precision moisture control with real Sentinel-2 satellite indices.
          </p>
          <ul style={{ fontSize: '11px', color: '#374151', paddingLeft: '18px', margin: '0 0 20px 0', lineHeight: 1.8 }}>
            <li>✓ Everything in Free Plan</li>
            <li>✓ Sentinel-2 Radar & NDVI Telemetry</li>
            <li>✓ Multi-Scenario Salinity / Rain What-If</li>
            <li>✓ Priority Harvester Booking</li>
            <li>✓ Exportable Crop Insurance PDF Reports</li>
          </ul>
          <button
            type="button"
            onClick={() => handleOpenPaidCheckout('PAID')}
            disabled={currentPlan === 'PAID'}
            style={{
              marginTop: 'auto', padding: '10px', borderRadius: '10px',
              background: currentPlan === 'PAID' ? '#e5e7eb' : 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: currentPlan === 'PAID' ? '#9ca3af' : '#ffffff',
              border: 'none', fontWeight: 800, fontSize: '12px',
              cursor: currentPlan === 'PAID' ? 'default' : 'pointer'
            }}
          >
            {currentPlan === 'PAID' ? 'Active Plan' : 'Upgrade to Advanced · ₹499'}
          </button>
        </div>

        {/* TIER 3: FPO / ORGANIZATION PLAN */}
        <div style={{
          border: currentPlan === 'ORGANIZATION' ? '2.5px solid #0284c7' : '1px solid var(--color-border, #e5e7eb)',
          borderRadius: '16px', padding: '20px', background: 'var(--color-bg-card, #ffffff)',
          display: 'flex', flexDirection: 'column', position: 'relative'
        }}>
          {currentPlan === 'ORGANIZATION' && (
            <span style={{
              position: 'absolute', top: '-10px', right: '16px',
              background: '#0284c7', color: '#fff', fontSize: '10px', fontWeight: 800,
              padding: '2px 8px', borderRadius: '999px'
            }}>
              CURRENT PLAN
            </span>
          )}
          <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px 0' }}>🏛️ FPO / Organization</h3>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0369a1', margin: '8px 0' }}>
            ₹1,999 <span style={{ fontSize: '12px', fontWeight: 400, color: '#6b7280' }}>/ Annual</span>
          </div>
          <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 16px 0', lineHeight: 1.4 }}>
            For Farmer Producer Orgs, cooperatives, and district officers monitoring multi-taluk clusters.
          </p>
          <ul style={{ fontSize: '11px', color: '#374151', paddingLeft: '18px', margin: '0 0 20px 0', lineHeight: 1.8 }}>
            <li>✓ District Agriculture Dashboard</li>
            <li>✓ Multi-farm aggregated water stress</li>
            <li>✓ Bulk SMS Agromet Broadcast</li>
            <li>✓ PM-KISAN / PMFBY Verification</li>
          </ul>
          <button
            type="button"
            onClick={() => handleOpenPaidCheckout('ORGANIZATION')}
            disabled={currentPlan === 'ORGANIZATION'}
            style={{
              marginTop: 'auto', padding: '10px', borderRadius: '10px',
              background: currentPlan === 'ORGANIZATION' ? '#e5e7eb' : 'linear-gradient(135deg, #0284c7, #0369a1)',
              color: currentPlan === 'ORGANIZATION' ? '#9ca3af' : '#ffffff',
              border: 'none', fontWeight: 800, fontSize: '12px',
              cursor: currentPlan === 'ORGANIZATION' ? 'default' : 'pointer'
            }}
          >
            {currentPlan === 'ORGANIZATION' ? 'Active Plan' : 'Activate Org Plan · ₹1,999'}
          </button>
        </div>
      </div>

      {/* Central Feature Entitlement Matrix */}
      <div style={{
        background: 'var(--color-bg-card, #ffffff)', border: '1px solid var(--color-border, #e5e7eb)',
        borderRadius: '16px', padding: '20px'
      }}>
        <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 12px 0' }}>
          🛡️ Entitlement & Feature Access Matrix
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
          {planFeaturesList.map(item => {
            const hasAccess = checkPlanAccess(currentPlan, item.feature);
            return (
              <div
                key={item.feature}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 10px', borderRadius: '8px',
                  background: hasAccess ? 'rgba(16, 185, 129, 0.05)' : 'rgba(0,0,0,0.02)',
                  border: hasAccess ? '1px solid rgba(16, 185, 129, 0.2)' : '1px dashed #e5e7eb'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: hasAccess ? '#111827' : '#9ca3af' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>{item.description}</div>
                </div>
                <div>
                  {hasAccess ? (
                    <span style={{ color: '#059669', fontWeight: 800, fontSize: '13px' }}>✓ Unlocked</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenPaidCheckout('PAID')}
                      style={{
                        background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b',
                        color: '#b45309', borderRadius: '6px', padding: '3px 8px', fontSize: '11px',
                        fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      🔒 Available on Advanced Plan →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ SAFE SANDBOX CHECKOUT MODAL (User Requirement: NO REAL CARD COLLECTION) ═══ */}
      {checkoutModalPlan && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
          backdropFilter: 'blur(6px)'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '20px', maxWidth: '480px', width: '100%',
            overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            color: '#111827'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 20px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
              color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
                  🛒 Checkout: {checkoutModalPlan} Farmer Plan
                </h3>
                <span style={{ fontSize: '11px', color: '#a7f3d0' }}>
                  Safe Sandbox Simulation Mode
                </span>
              </div>
              <button
                onClick={() => setCheckoutModalPlan(null)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Sandbox Notice Banner */}
            <div style={{
              background: '#fef3c7', borderBottom: '1px solid #fde68a',
              padding: '10px 16px', fontSize: '11px', color: '#92400e', lineHeight: 1.4
            }}>
              <strong>🔒 SAFE DEMO SANDBOX:</strong> No actual money is debited. Do NOT enter real card numbers, passwords, or UPI PINs.
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Order Item Summary */}
              <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '12px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>{checkoutModalPlan} Subscription:</span>
                  <span>{checkoutModalPlan === 'PAID' ? '₹499.00' : '₹1,999.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#6b7280', fontSize: '11px' }}>
                  <span>Applicable GST (18%):</span>
                  <span>{checkoutModalPlan === 'PAID' ? '₹89.82' : '₹359.82'}</span>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb',
                  paddingTop: '6px', fontWeight: 800, fontSize: '14px', color: '#065f46'
                }}>
                  <span>Total Amount Due:</span>
                  <span>{checkoutModalPlan === 'PAID' ? '₹588.82' : '₹2,358.82'}</span>
                </div>
              </div>

              {/* Demo Payment Method Selector */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Select Demo Payment Method:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'upi', label: '📱 Demo UPI (Virtual VPA: farmer@okaxis)' },
                    { id: 'card', label: '💳 Sandbox Test Card (•••• 4242)' },
                    { id: 'netbanking', label: '🏦 Demo Net Banking (SBI / Canara / Indian Bank)' },
                  ].map(m => (
                    <label
                      key={m.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px',
                        padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                        border: demoPaymentMethod === m.id ? '1.5px solid #10b981' : '1px solid #e5e7eb',
                        background: demoPaymentMethod === m.id ? 'rgba(16, 185, 129, 0.08)' : '#ffffff'
                      }}
                    >
                      <input
                        type="radio"
                        name="demoPayment"
                        checked={demoPaymentMethod === m.id}
                        onChange={() => setDemoPaymentMethod(m.id as any)}
                      />
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Simulated Pay Action */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setCheckoutModalPlan(null)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '10px',
                    background: '#f3f4f6', border: '1px solid #d1d5db',
                    fontSize: '13px', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCompleteSandboxPayment}
                  disabled={isProcessingPayment}
                  className="btn btn--primary"
                  style={{
                    flex: 2, padding: '12px', borderRadius: '10px',
                    fontSize: '13px', fontWeight: 800, cursor: isProcessingPayment ? 'wait' : 'pointer'
                  }}
                >
                  {isProcessingPayment
                    ? 'Processing Sandbox...'
                    : `Complete Sandbox Payment · ${checkoutModalPlan === 'PAID' ? '₹588.82' : '₹2,358.82'}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
