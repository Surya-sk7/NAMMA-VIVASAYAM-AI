// ============================================================
// 🌾 NammaVivasayam AI — WHY Engine (Interactive & Explainable AI)
// Explainable AI with Interactive Follow-up Q&A and Evidence Breakdown
// ============================================================

import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../i18n';
import { demoRecommendation, demoEvidence } from '../../services/demoData';
import type { EvidenceType } from '../../types';
import SpeakerButton from '../common/SpeakerButton';

const EVIDENCE_LABELS: Record<EvidenceType, { emoji: string; key: string }> = {
  MEASURED: { emoji: '📏', key: 'measured' },
  OBSERVED: { emoji: '👁️', key: 'observed' },
  INFERRED: { emoji: '🤖', key: 'inferred' },
  UNKNOWN: { emoji: '❓', key: 'unknown' },
};

interface FAQItem {
  q: { ta: string; en: string; hi: string };
  a: { ta: string; en: string; hi: string };
  icon: string;
}

const PRESET_QUESTIONS: FAQItem[] = [
  {
    icon: '💧',
    q: {
      ta: 'இன்று நான் தண்ணீர் பாய்ச்சினால் என்ன ஆகும்?',
      en: 'What happens if I irrigate today anyway?',
      hi: 'अगर मैं आज सिंचाई कर दूँ तो क्या होगा?',
    },
    a: {
      ta: 'இன்று தண்ணீர் பாய்ச்சினால், மாலை எதிர்பார்க்கப்படும் 4mm மழையுடன் சேர்ந்து வயலில் 5cm-க்கும் மேல் தண்ணீர் தேங்கும். பூக்கும் நிலையில் உள்ள நெல் வேர்களுக்கு பிராணவாயு (Oxygen) கிடைக்காமல் வேர் அழுகல் நோய் மற்றும் இலை உறை கருகல் (Sheath Blight) நோய் அபாயம் 35% அதிகரிக்கும். மேலும் சுமார் 65,000 லிட்டர் பாசன நீர் வீணாகும்.',
      en: 'If you irrigate today, evening rainfall (~4mm) will saturate the field with >5cm standing water. At flowering stage, excess standing water starves root respiration, increasing root rot and sheath blight fungal risk by 35%, while wasting ~65,000 liters of canal water.',
      hi: 'अगर आप आज सिंचाई करते हैं, तो शाम की बारिश (~4mm) के साथ मिलकर खेत में 5cm से अधिक पानी जमा हो जाएगा। फूल आने की अवस्था में यह जड़ों में ऑक्सीजन रोक देगा, जिससे जड़ गलन और फंगल रोग का जोखिम 35% बढ़ जाएगा और लगभग 65,000 लीटर पानी बर्बाद होगा।',
    },
  },
  {
    icon: '🌾',
    q: {
      ta: '2 நாட்கள் தாமதிப்பதால் நெல் மகசூல் குறையுமா?',
      en: 'Will delaying irrigation by 2 days reduce grain yield?',
      hi: 'क्या 2 दिन प्रतीक्षा करने से धान की उपज घटेगी?',
    },
    a: {
      ta: 'இல்லை, மகசூல் குறையாது! உங்கள் நிலத்தின் தற்போதைய மண் ஈரப்பதம் 31% உள்ளது (நெல்லின் வாடல் புள்ளி 16%). வேர் மண்டலத்தில் அடுத்த 48 மணிநேரத்திற்கு தேவையான நீர் போதுமான அளவில் உள்ளது. மாறாக, சரியான நேரத்தில் உலரவிட்டு நீர் பாய்ச்சுவது (AWD முறை) வேர்களை ஆழமாக வளரச் செய்து மகசூலை 8-12% அதிகரிக்கும்.',
      en: 'No, yield will not reduce! Current soil moisture is 31% (paddy critical wilting point is 16%). There is ample moisture in the root zone for the next 48 hours. Alternate Wetting & Drying (AWD) actually stimulates deeper root vigor and boosts final grain weight by 8-12%.',
      hi: 'नहीं, उपज बिल्कुल नहीं घटेगी! वर्तमान मिट्टी की नमी 31% है (महत्वपूर्ण बिंदु 16% है)। अगले 48 घंटों के लिए पर्याप्त पानी मौजूद है। वैकल्पिक सुखाने और भिगोने की विधि जड़ों को मजबूत करती है और उपज 8-12% बढ़ाती है।',
    },
  },
  {
    icon: '🌧️',
    q: {
      ta: 'இன்று மாலை மழை வராவிட்டால் என்ன செய்வது?',
      en: 'What if the evening rain forecast fails?',
      hi: 'अगर शाम को बारिश नहीं हुई तो क्या करना होगा?',
    },
    a: {
      ta: 'வானிலை மையம் மாலை 68% வாய்ப்பு தந்துள்ளது. ஒருவேளை மழை பெய்யாவிட்டால், நாளை காலை 6:00 மணிக்கு சென்சார் மீண்டும் அளவிடும். ஈரப்பதம் 26%-க்கு கீழ் சென்றால், நம்மா விவசாயம் செயலி உடனடியாக "காலை 2 மணிநேரம் மிதமான நீர் பாய்ச்சுக" என அறிவிப்பு அனுப்பும்.',
      en: 'IMD satellite radar gives 68% confidence. If no rain occurs by tomorrow morning, Sentinel-1 radar and in-situ moisture sensors will re-assess at 6:00 AM. If moisture drops below 26%, NammaVivasayam AI will trigger an instant alert advising a light 2-hour morning irrigation.',
      hi: 'मौसम रडार 68% संभावना दर्शाता है। यदि बारिश नहीं होती है, तो कल सुबह 6:00 बजे सेंसर दोबारा माप लेंगे। यदि नमी 26% से कम होती है, तो ऐप तुरंत सुबह 2 घंटे हल्की सिंचाई की सूचना भेजेगा।',
    },
  },
  {
    icon: '🧪',
    q: {
      ta: 'தண்ணீருக்குப் பதிலாக உரம் அல்லது இலை தெளிப்பு செய்யலாமா?',
      en: 'Can I apply fertilizer or foliar spray instead today?',
      hi: 'क्या मैं आज खाद या पर्णीय स्प्रे कर सकता हूँ?',
    },
    a: {
      ta: 'தரைவழி உரம் இடவேண்டாம். ஆனால் மழைக்கு முன்னால் அல்லது மழை நின்ற பின் பொட்டாசியம் சல்பேட் (0.5%) அல்லது 2% DAP இலை தெளிப்பு செய்வது மணி பிடிக்கும் திறனை அதிகரிக்கும். கனமழைக்கு முன் இலைகளில் பூச்சிக்கொல்லி அடிக்க வேண்டாம், மருந்து அடித்துச் செல்லப்பட்டுவிடும்.',
      en: 'Avoid soil-applied basal fertilizer today. However, a post-rain foliar spray of 0.5% Potassium Sulphate or 2% DAP is excellent for kernel filling. Do not spray expensive systemic pesticides right before evening rain as runoff will wash it away.',
      hi: 'आज मिट्टी में खाद न डालें। बारिश के बाद 0.5% पोटाश या 2% डीएपी का पर्णीय छिड़काव दाना भरने के लिए बहुत अच्छा रहेगा। बारिश से ठीक पहले कीटनाशक न छिड़कें।',
    },
  },
];

export default function WhyEngine() {
  const { state, dispatch } = useApp();
  const rec = demoRecommendation;
  const evidence = demoEvidence;
  const lang = (state.language === 'ta' || state.language === 'hi' ? state.language : 'en') as 'ta' | 'en' | 'hi';

  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const handleToggleFaq = (index: number) => {
    setActiveFaqIndex(prev => prev === index ? null : index);
    setCustomAnswer(null);
  };

  const handleAskCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    setIsAnswering(true);
    setTimeout(() => {
      const q = customQuestion.toLowerCase();
      let reply = '';

      if (q.includes('rain') || q.includes('மழை') || q.includes('बारिश')) {
        reply = lang === 'ta'
          ? '🛰️ செயற்கைக்கோள் மேகக் கூட்டங்கள் மதுரை மாவட்டத்தை நோக்கி நகர்கின்றன. மாலை 4:30 முதல் 7:00 மணிக்குள் இடியுடன் கூடிய மழை பெய்ய 68% சாத்தியக்கூறு உள்ளது.'
          : '🛰️ Satellite cloud bands from the Bay of Bengal are moving inland across Madurai. Convective showers (3-5mm) are expected between 4:30 PM and 7:00 PM.';
      } else if (q.includes('yield') || q.includes('மகசூல்') || q.includes('पैदावार')) {
        reply = lang === 'ta'
          ? '🌾 சரியான இடைவெளியில் நீர் மேலாண்மை செய்வதன் மூலம் உங்கள் 1.8 ஏக்கரில் 48-52 நெல் மூட்டைகள் (உயர் தரம்) மகசூல் பெற முடியும்.'
          : '🌾 Following precision Alternate Wetting and Drying (AWD) avoids grain discoloration and lodging, maximizing harvest to 48-52 bags (~36 quintals) for your 1.8 acres.';
      } else if (q.includes('pest') || q.includes('பூச்சி') || q.includes('कीट')) {
        reply = lang === 'ta'
          ? '🐛 தற்போது பூச்சி தாக்குதல் இல்லை (15% குறைந்த ஆபத்து). ஈரப்பதம் அதிகமாக இருப்பதால் இலை சுருட்டுப் புழு கண்காணிக்கப்படுகிறது. தேவைப்பட்டால் வேப்ப எண்ணெய் 3% தெளிக்கலாம்.'
          : '🐛 Pest risk is low (15%). With 72% humidity, keep an eye on Leaf Folder. If moths are spotted, spray 3% Neem Seed Kernel Extract (NSKE) as an organic deterrent.';
      } else {
        reply = lang === 'ta'
          ? `💡 உங்கள் கேள்வி "${customQuestion}" குறித்த AI விளக்கம்: தற்போதைய 31% ஈரப்பதம் மற்றும் பூக்கும் நிலை சூழலில் பயிரின் உடலியல் செயல்பாடு மிகச் சீராக உள்ளது. எந்த மாற்றமும் தேவையில்லை.`
          : `💡 AI Analysis for "${customQuestion}": Under current 31% root moisture and 72-day flowering stage, crop physiology is functioning in the ideal green zone. Maintain current schedule without sudden alterations.`;
      }

      setCustomAnswer(reply);
      setIsAnswering(false);
    }, 600);
  };

  return (
    <>
      <div className="modal-overlay" onClick={() => dispatch({ type: 'HIDE_WHY_ENGINE' })} />
      <div className="bottom-sheet" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="bottom-sheet__handle" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-paddy-dark)', margin: 0 }}>
                ❓ {t('why.title')}
              </h2>
              <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.15)', color: '#065f46', border: '1px solid #10b981', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                EXPLAINABLE AI
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
              {state.language === 'ta' ? 'ஏன் இன்று தண்ணீர் பாய்ச்ச வேண்டாம்? (விளக்கம் & ஆதாரங்கள்)' :
               state.language === 'hi' ? 'आज सिंचाई क्यों नहीं करनी चाहिए? (कारण और साक्ष्य)' :
               'Why should I wait before irrigating? (Transparent Science & Telemetry)'}
            </p>
          </div>
          <button
            className="btn btn--ghost"
            onClick={() => dispatch({ type: 'HIDE_WHY_ENGINE' })}
            style={{ fontSize: 'var(--text-xl)', padding: '4px 8px' }}
          >
            ✕
          </button>
        </div>

        {/* Evidence Cards */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--color-text-primary)' }}>
            📋 {t('why.evidence')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {evidence.map((ev) => {
              const badge = EVIDENCE_LABELS[ev.evidenceType];
              return (
                <div key={ev.id} className="evidence-card" style={{ transition: 'transform 0.15s ease' }}>
                  <div>
                    <span className={`evidence-card__badge evidence-card__badge--${ev.evidenceType.toLowerCase()}`}>
                      {badge.emoji} {t(`why.${badge.key}`)}
                    </span>
                    <div className="evidence-card__metric" style={{ marginTop: 'var(--space-2)' }}>
                      {ev.metric}
                    </div>
                    <div className="evidence-card__value">
                      {ev.value}{ev.unit ? ` ${ev.unit}` : ''}
                    </div>
                    <div className="evidence-card__interpretation">
                      {ev.interpretation}
                    </div>
                    {ev.confidence && (
                      <div className="confidence" style={{ marginTop: 'var(--space-2)' }}>
                        <div className="confidence__bar">
                          <div className="confidence__fill" style={{ width: `${ev.confidence * 100}%` }} />
                        </div>
                        <span className="confidence__value">{Math.round(ev.confidence * 100)}% {t('why.confidence')}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Core System Reasoning with Listen Aloud */}
        <div className="card" style={{ background: 'var(--color-paddy-50)', border: '1px solid var(--color-paddy-200)', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-paddy-dark)', margin: 0 }}>
              🧠 {t('why.reasoning')}
            </h3>
            <SpeakerButton
              text={t('why.systemReason')}
              size="sm"
              variant="primary"
            />
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
            {t('why.systemReason')}
          </p>
        </div>

        {/* ═══ NEW: INTERACTIVE DRILL-DOWN Q&A (User Request) ═══ */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.3)', borderRadius: '18px',
          padding: '14px', marginBottom: 'var(--space-4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-paddy-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>💬 {lang === 'ta' ? 'மேலும் கேள்விகள் கேட்டு தெளிவுபெறுக' : 'Ask Further Questions & Interact'}</span>
              <span style={{ fontSize: '10px', background: '#f59e0b', color: '#000', padding: '1px 6px', borderRadius: '6px', fontWeight: 800 }}>LIVE</span>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 10px 0' }}>
            {lang === 'ta' ? 'கீழே உள்ள கேள்விகளைத் தொட்டு உடனடி விஞ்ஞான விளக்கத்தைப் பெறுங்கள்:' : 'Tap any question below for deeper agronomic insights:'}
          </p>

          {/* Interactive Question Chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PRESET_QUESTIONS.map((item, i) => {
              const isExpanded = activeFaqIndex === i;
              return (
                <div key={i} style={{
                  background: isExpanded ? '#ffffff' : 'rgba(255,255,255,0.7)',
                  border: isExpanded ? '1.5px solid #10b981' : '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '12px', padding: '10px 12px', cursor: 'pointer',
                  transition: 'all 0.2s', boxShadow: isExpanded ? '0 4px 14px rgba(16, 185, 129, 0.15)' : 'none'
                }}>
                  <div
                    onClick={() => handleToggleFaq(i)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#1f2937' }}>
                      <span>{item.icon}</span>
                      <span>{item.q[state.language as keyof typeof item.q] || item.q.en}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{isExpanded ? '▲' : '▼'}</span>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #d1d5db' }}>
                      <p style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5, margin: '0 0 8px 0' }}>
                        {item.a[state.language as keyof typeof item.a] || item.a.en}
                      </p>
                      <div style={{ marginTop: '6px' }}>
                        <SpeakerButton
                          text={item.a[state.language as keyof typeof item.a] || item.a.en}
                          size="sm"
                          variant="primary"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Ask Your Own Question Box */}
          <form onSubmit={handleAskCustom} style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder={lang === 'ta' ? 'உங்கள் சொந்த கேள்வியை தட்டச்சு செய்க...' : 'Type your custom farming question here...'}
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: '10px',
                  border: '1px solid #d1d5db', fontSize: '12px', outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={isAnswering}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff', border: 'none', borderRadius: '10px', padding: '0 14px',
                  fontWeight: 800, fontSize: '12px', cursor: 'pointer'
                }}
              >
                {isAnswering ? '...' : lang === 'ta' ? 'கேள்' : 'Ask'}
              </button>
            </div>

            {customAnswer && (
              <div style={{
                marginTop: '10px', padding: '10px 12px', background: '#ecfdf5',
                border: '1.5px solid #10b981', borderRadius: '10px', fontSize: '12px',
                color: '#065f46', lineHeight: 1.5
              }}>
                <div style={{ fontWeight: 800, marginBottom: '4px' }}>🤖 AI Advisor:</div>
                <div>{customAnswer}</div>
              </div>
            )}
          </form>
        </div>

        {/* Overall Confidence */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
            🎯 {t('why.confidence')}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: '80px', height: '8px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${rec.confidence * 100}%`, height: '100%', background: 'var(--color-paddy)', borderRadius: 'var(--radius-full)' }} />
            </div>
            <span style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-paddy-dark)' }}>
              {Math.round(rec.confidence * 100)}%
            </span>
          </div>
        </div>

        {/* What-If CTA */}
        <button
          className="btn btn--secondary btn--full mt-4"
          onClick={() => {
            dispatch({ type: 'HIDE_WHY_ENGINE' });
            setTimeout(() => dispatch({ type: 'SHOW_WHAT_IF', payload: rec.id }), 300);
          }}
        >
          🔄 {t('decision.whatIf')} (ஒப்பீடு செய்க)
        </button>
      </div>
    </>
  );
}
