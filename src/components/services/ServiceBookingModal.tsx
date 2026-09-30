// ============================================================
// 🌾 NammaVivasayam AI — Agricultural Service Booking Modal
// Two-step flow: View Details → Confirm Request → Booking Confirmed
// Features verified provider details, transparent pricing & commission
// ============================================================

import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export interface AgriculturalServiceItem {
  id: string;
  icon: string;
  name: string;
  category: string;
  provider: string;
  isDemoProvider: boolean;
  providerDescription: string;
  rating: number;
  completedJobs: number;
  serviceArea: string;
  description: string;
  pricePerUnit: number;
  priceType: string;
  estimatedDuration: string;
  availability: string;
  workerName: string;
  workerRole: string;
  workerExperience: string;
  phone: string;
  terms: string;
  cancellation: string;
}

interface ServiceBookingModalProps {
  service: AgriculturalServiceItem;
  onClose: () => void;
  onConfirmed: (bookingSummary: {
    bookingId: string;
    grossAmount: number;
    platformCommission: number;
    providerAmount: number;
    preferredDate: string;
    acres: number;
  }) => void;
}

export default function ServiceBookingModal({
  service,
  onClose,
  onConfirmed,
}: ServiceBookingModalProps) {
  const { state } = useApp();
  const [step, setStep] = useState<'details' | 'confirmed'>('details');
  const [acres, setAcres] = useState<number>(state.farm?.area || 1.8);
  const [preferredDate, setPreferredDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [bookingId, setBookingId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Revenue model: configurable platform fee (e.g. 10%)
  const commissionRate = (state.platformCommissionPct || 10) / 100;
  const grossAmount = Math.round(service.pricePerUnit * acres);
  const platformCommission = Math.round(grossAmount * commissionRate);
  const providerAmount = grossAmount - platformCommission;

  const handleConfirmBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `NV-SRV-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingId(generatedId);
      setIsSubmitting(false);
      setStep('confirmed');
      onConfirmed({
        bookingId: generatedId,
        grossAmount,
        platformCommission,
        providerAmount,
        preferredDate,
        acres,
      });
    }, 600);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      backdropFilter: 'blur(6px)'
    }}>
      <div style={{
        background: 'var(--color-bg-card, #ffffff)',
        color: 'var(--color-text-primary, #111827)',
        borderRadius: '24px', maxWidth: '560px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
        border: '1px solid var(--color-border, #e5e7eb)',
        position: 'relative'
      }}>
        {/* Top Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border-light, #f3f4f6)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>{service.icon}</span>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
                {step === 'confirmed' ? '✅ Booking Confirmed' : service.name}
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary, #6b7280)' }}>
                {service.category} · {service.serviceArea}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', fontSize: '20px',
              cursor: 'pointer', color: 'var(--color-text-secondary, #6b7280)', padding: '4px 8px'
            }}
          >
            ✕
          </button>
        </div>

        {/* STEP 1: DETAILED SERVICE & PROVIDER VIEW */}
        {step === 'details' && (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Provider Verification Banner */}
            <div style={{
              background: service.isDemoProvider ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              border: service.isDemoProvider ? '1px solid #f59e0b' : '1px solid #10b981',
              borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '13px', color: service.isDemoProvider ? '#b45309' : '#065f46' }}>
                  🏢 {service.provider}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary, #6b7280)', marginTop: '2px' }}>
                  {service.providerDescription}
                </div>
              </div>
              <span style={{
                fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '999px',
                background: service.isDemoProvider ? '#f59e0b' : '#10b981', color: '#fff', letterSpacing: '0.04em'
              }}>
                {service.isDemoProvider ? 'DEMO PROVIDER' : 'VERIFIED PROVIDER'}
              </span>
            </div>

            {/* Provider Stats & Assigned Operator */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px',
              background: 'var(--color-bg-subtle, #f9fafb)', padding: '12px', borderRadius: '12px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary, #9ca3af)' }}>Rating</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#f59e0b' }}>⭐ {service.rating} / 5.0</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary, #9ca3af)' }}>Jobs Done</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-paddy-dark, #065f46)' }}>{service.completedJobs}+</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary, #9ca3af)' }}>Availability</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>{service.availability}</div>
              </div>
            </div>

            {/* Assigned Worker / Specialist Profile */}
            <div style={{
              border: '1px solid var(--color-border-light, #e5e7eb)', borderRadius: '12px', padding: '12px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-tertiary, #9ca3af)', marginBottom: '6px' }}>
                👤 Assigned Equipment Specialist
              </div>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>
                {service.workerName} · <span style={{ fontWeight: 500, color: 'var(--color-text-secondary, #6b7280)' }}>{service.workerRole}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary, #6b7280)', marginTop: '2px' }}>
                Experience: {service.workerExperience}
              </div>
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a
                  href={`tel:${service.phone}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '11px', fontWeight: 700, color: '#0284c7', textDecoration: 'none',
                    background: 'rgba(2, 132, 199, 0.1)', padding: '4px 10px', borderRadius: '6px'
                  }}
                >
                  📞 Call Provider ({service.phone})
                </a>
              </div>
            </div>

            {/* Service Scope & Estimated Duration */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Description</div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary, #4b5563)', margin: 0, lineHeight: 1.5 }}>
                {service.description}
              </p>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
                ⏱️ Estimated Completion: {service.estimatedDuration}
              </div>
            </div>

            {/* Interactive Farm Acreage & Date Selection */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
              borderTop: '1px dashed var(--color-border, #d1d5db)', paddingTop: '14px'
            }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Acres to Service
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setAcres(prev => Math.max(0.5, Number((prev - 0.5).toFixed(1))))}
                    style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#f3f4f6', cursor: 'pointer', fontWeight: 800 }}
                  >
                    −
                  </button>
                  <span style={{ fontSize: '14px', fontWeight: 800 }}>{acres} acres</span>
                  <button
                    type="button"
                    onClick={() => setAcres(prev => Number((prev + 0.5).toFixed(1)))}
                    style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#f3f4f6', cursor: 'pointer', fontWeight: 800 }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Preferred Execution Date
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  style={{
                    padding: '6px 10px', borderRadius: '8px', border: '1px solid #d1d5db',
                    fontSize: '12px', width: '100%', boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Transparent Pricing & Configurable Commission Breakdown */}
            <div style={{
              background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px',
              fontSize: '12px'
            }}>
              <div style={{ fontWeight: 800, marginBottom: '8px', color: '#1e293b' }}>
                💰 Transparent Pricing & Settlement Breakdown
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Rate per acre:</span>
                <span>₹{service.pricePerUnit.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Total Gross Amount:</span>
                <span style={{ fontWeight: 800 }}>₹{grossAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px' }}>
                <span style={{ color: '#64748b' }}>Platform Commission ({state.platformCommissionPct}%):</span>
                <span style={{ color: '#0284c7' }}>₹{platformCommission.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#059669' }}>
                <span>Provider Net Payout:</span>
                <span>₹{providerAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Terms & Cancellation Policy */}
            <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: 1.4 }}>
              <strong>Cancellation Policy:</strong> {service.cancellation}
              <br />
              <strong>Terms:</strong> {service.terms}
            </div>

            {/* Explicit Confirm Button (DO NOT BOOK IMMEDIATELY) */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={onClose}
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
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="btn btn--primary"
                style={{
                  flex: 2, padding: '12px', borderRadius: '10px',
                  fontSize: '13px', fontWeight: 800, cursor: isSubmitting ? 'wait' : 'pointer'
                }}
              >
                {isSubmitting ? 'Securing Booking...' : `Confirm Request · ₹${grossAmount.toLocaleString()}`}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BOOKING CONFIRMATION SCREEN */}
        {step === 'confirmed' && (
          <div style={{ padding: '28px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '12px', animation: 'bounce 0.6s ease' }}>
              🎉
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-paddy-dark, #065f46)', margin: '0 0 6px 0' }}>
              Service Request Successfully Placed!
            </h3>
            <p style={{ fontSize: '13px', color: '#4b5563', margin: '0 0 16px 0' }}>
              Your service request has been transmitted to {service.provider}.
            </p>

            <div style={{
              background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '14px',
              padding: '16px', textAlign: 'left', fontSize: '12px', marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#166534', fontWeight: 700 }}>Booking ID:</span>
                <strong style={{ color: '#065f46' }}>{bookingId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#166534' }}>Scheduled Date:</span>
                <strong>{preferredDate}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#166534' }}>Acreage:</span>
                <strong>{acres} acres</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#166534' }}>Estimated Amount:</span>
                <strong style={{ fontSize: '13px' }}>₹{grossAmount.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0284c7' }}>
                <span>Operator Contact:</span>
                <strong>{service.workerName} ({service.phone})</strong>
              </div>
            </div>

            <button
              type="button"
              className="btn btn--primary"
              onClick={onClose}
              style={{ width: '100%', padding: '12px', fontSize: '13px', fontWeight: 800 }}
            >
              Done & Return to Services
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
