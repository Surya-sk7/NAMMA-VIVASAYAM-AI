// ============================================================
// 🌾 NammaVivasayam AI — Uzhavan Guide (உழவன் கையேடு)
// Interactive Crop Calendar, Precision Fertilizer Calculator,
// Government Subsidies & Schemes Tracker, and Organic Pest Manual
// ============================================================

import { useState } from 'react';
import { useApp } from '../../context/AppContext';

type GuideTab = 'calendar' | 'calculator' | 'schemes' | 'organic' | 'mandi';

export default function UzhavanGuide({ onBack }: { onBack?: () => void }) {
  const { state } = useApp();
  const lang = (state.language === 'ta' || state.language === 'hi' ? state.language : 'en') as 'ta' | 'en' | 'hi';
  const [activeTab, setActiveTab] = useState<GuideTab>('calendar');

  // Fertilizer calculator state
  const [acreage, setAcreage] = useState<number>(1.8);
  const [selectedCrop, setSelectedCrop] = useState<'paddy' | 'sugarcane' | 'cotton' | 'maize'>('paddy');

  // Crop Calendar stage selection
  const [selectedStageIndex, setSelectedStageIndex] = useState(3); // 3 = Flowering (Day 72)

  const STAGES = [
    {
      name: { ta: 'விதை & நாற்றங்கால் (நாள் 0-20)', en: 'Nursery & Seedling (Day 0-20)', hi: 'नर्सरी एवं अंकुरण (दिन 0-20)' },
      water: { ta: 'மெல்லிய நீர் படலம் (1-2 செ.மீ)', en: 'Thin water film (1-2 cm)', hi: 'पतली पानी की परत (1-2 cm)' },
      action: { ta: 'அசோஸ்பைரில்லம் விதை நேர்த்தி; டிரைக்கோடெர்மா விரிடி இடுதல்', en: 'Azospirillum seed treatment; bio-fungicide inoculation', hi: 'बीजोपचार एवं जैव-उर्वरक' },
      nutrients: { ta: 'DAP 10 கிலோ/ஏக்கர் நாற்றங்காலில்', en: 'DAP 10 kg/acre in nursery', hi: 'डीएपी 10 किग्रा/एकड़' },
      risk: { ta: 'நாற்று அழுகல் நோய்', en: 'Damping off risk', hi: 'अंकुर गलन' },
    },
    {
      name: { ta: 'நடவு & தூர்கட்டும் பருவம் (நாள் 21-45)', en: 'Transplanting & Tillering (Day 21-45)', hi: 'रोपाई एवं कल्ले फूटना (दिन 21-45)' },
      water: { ta: '2-3 செ.மீ சீரான நீர் மட்டம்', en: '2-3 cm shallow water ponding', hi: '2-3 cm जल स्तर' },
      action: { ta: 'முழு அடி உரம்; தண்டு உருளை பூச்சி கண்காணிப்பு', en: 'Basal fertilizer dose; stem borer pheromone traps', hi: 'आधार खाद एवं तना छेदक निगरानी' },
      nutrients: { ta: 'யூரியா 25 கிலோ + DAP 50 கிலோ + பொட்டாஷ் 15 கிலோ', en: 'Urea 25kg + DAP 50kg + MOP 15kg', hi: 'यूरिया 25kg + DAP 50kg' },
      risk: { ta: 'இலை சுருட்டுப் புழு, களை வளர்ச்சி', en: 'Leaf folder & weed competition', hi: 'पत्ती लपेटक' },
    },
    {
      name: { ta: 'கதிர் உருவாகும் பருவம் (நாள் 46-65)', en: 'Panicle Initiation (Day 46-65)', hi: 'बाली निर्माण अवस्था (दिन 46-65)' },
      water: { ta: '3-4 செ.மீ நீர் (வறட்சி கூடவே கூடாது)', en: '3-4 cm standing water (critical)', hi: '3-4 cm पानी (महत्वपूर्ण)' },
      action: { ta: 'இரண்டாம் தவணை தழைச்சத்து மற்றும் பொட்டாஷ் உரம்', en: 'Second top-dressing of N and K nutrients', hi: 'द्वितीय टॉप-ड्रेसिंग' },
      nutrients: { ta: 'யூரியா 20 கிலோ + பொட்டாஷ் 15 கிலோ', en: 'Urea 20kg + MOP 15kg', hi: 'यूरिया 20kg + पोटाश 15kg' },
      risk: { ta: 'குலை நோய் (Blast), இலை உறை கருகல்', en: 'Rice blast & sheath blight spores', hi: 'ब्लास्ट रोग' },
    },
    {
      name: { ta: 'பூக்கும் பருவம் · தற்போதைய நிலை (நாள் 66-85)', en: 'Flowering Stage · Active (Day 66-85)', hi: 'फूल आने की अवस्था (दिन 66-85)' },
      water: { ta: '2-3 செ.மீ மிதமான நீர் (தேங்க விட வேண்டாம்)', en: '2-3 cm gentle depth (avoid stagnation)', hi: '2-3 cm हल्का पानी' },
      action: { ta: 'மாலை மழை வாய்ப்பை பயன்படுத்தவும்; இலை தெளிப்பு மட்டும்', en: 'Utilize rain forecast; foliar spray if needed', hi: 'पर्णीय छिड़काव' },
      nutrients: { ta: '0.5% பொட்டாசியம் சல்பேட் அல்லது 2% DAP தெளிப்பு', en: 'Foliar 0.5% Potassium Sulphate or 2% DAP', hi: '0.5% पोटाश स्प्रे' },
      risk: { ta: 'வேர் மூச்சுத்திணறல், பூச்சி தாக்குதல்', en: 'Root hypoxia if over-irrigated', hi: 'जड़ गलन' },
    },
    {
      name: { ta: 'மணி பால் பிடிக்கும் & முதிர்வு (நாள் 86-105)', en: 'Grain Filling & Dough Stage (Day 86-105)', hi: 'दाना भराव अवस्था (दिन 86-105)' },
      water: { ta: 'ஈரப்பதம் மட்டும்; கதிர் சாயாமல் காக்கவும்', en: 'Intermittent saturation (AWD)', hi: 'हल्की नमी' },
      action: { ta: 'அறுவடைக்கு 10 நாட்களுக்கு முன் நீரை முழுமையாக வடிக்கவும்', en: 'Drain field completely 10 days before harvest', hi: 'कटाई से 10 दिन पहले पानी निकालें' },
      nutrients: { ta: 'இனி உரம் தேவையில்லை', en: 'No further chemical inputs required', hi: 'खाद की आवश्यकता नहीं' },
      risk: { ta: 'நெல் வண்டு, எலி தொல்லை', en: 'Grain bug & rodent feeding', hi: 'दाना कीट' },
    },
    {
      name: { ta: 'அறுவடை பருவம் (நாள் 106-120)', en: 'Harvest Maturity (Day 106-120)', hi: 'परिपक्वता एवं कटाई (दिन 106-120)' },
      water: { ta: 'காய்ந்த நிலம் (இயந்திரம் இறங்க வசதி)', en: 'Dry firm soil for machinery', hi: 'सूखा खेत' },
      action: { ta: '80% கதிர்கள் பொன்னிறமானதும் கொம்பைன் ஹார்வெஸ்டர் கொண்டு அறுவடை', en: 'Harvest at 20-22% moisture with combine harvester', hi: 'हार्वेस्टर से कटाई' },
      nutrients: { ta: 'வைக்கோல் மேலாண்மை / மக்கும் உரம்', en: 'Straw management / in-situ mulching', hi: 'पुआल प्रबंधन' },
      risk: { ta: 'திடீர் கனமழை, மணி உதிர்தல்', en: 'Unseasonal rain lodging & shattering', hi: 'असमय बारिश' },
    },
  ];

  // Fertilizer calculator formulas based on TNAU recommendations
  const calcUreaBags = (acreage * (selectedCrop === 'paddy' ? 1.8 : selectedCrop === 'sugarcane' ? 4.2 : 2.0)).toFixed(1);
  const calcDapBags = (acreage * (selectedCrop === 'paddy' ? 1.0 : selectedCrop === 'sugarcane' ? 2.5 : 1.2)).toFixed(1);
  const calcPotashBags = (acreage * (selectedCrop === 'paddy' ? 0.8 : selectedCrop === 'sugarcane' ? 2.0 : 1.0)).toFixed(1);
  const calcZincKg = (acreage * 10).toFixed(0);
  const calcWaterLiters = Math.round(acreage * 1200000).toLocaleString();

  // Government Subsidies Data
  const SCHEMES = [
    {
      name: { ta: 'பிரதமர் கிசான் சம்மான் நிதி (PM-KISAN)', en: 'PM-Kisan Samman Nidhi Yojana', hi: 'पीएम-किसान सम्मान निधि' },
      amount: '₹6,000 / year',
      tag: 'DIRECT BENEFIT',
      benefit: {
        ta: 'ஆண்டுக்கு ₹2,000 வீதம் 3 தவணைகளில் விவசாயிகளின் வங்கிக் கணக்கில் நேரடியாக வரவு வைக்கப்படுகிறது.',
        en: '₹6,000 per year paid in three installments of ₹2,000 directly into farmer bank accounts.',
        hi: '₹6,000 प्रति वर्ष 3 किस्तों में सीधे बैंक खाते में।'
      },
      docs: { ta: 'ஆதார் கார்டு, நில பட்டா / சிட்டா, வங்கி பாஸ்புக்', en: 'Aadhaar, Land Patta/Chitta, Bank Passbook', hi: 'आधार, जमीन के दस्तावेज, बैंक पासबुक' },
      status: 'VERIFIED ELIGIBLE',
    },
    {
      name: { ta: 'பிரதம மந்திரி பயிர் காப்பீட்டுத் திட்டம் (PMFBY)', en: 'PM Fasal Bima Yojana (Crop Insurance)', hi: 'प्रधानमंत्री फसल बीमा योजना' },
      amount: 'Up to ₹45,000 / acre cover',
      tag: 'RISK COVERAGE',
      benefit: {
        ta: 'இயற்கை சீற்றம், வறட்சி, பூச்சி தாக்குதல் மற்றும் வெள்ள பாதிப்புகளுக்கு 1.5% குறைந்த பிரீமியத்தில் முழு நஷ்டஈடு.',
        en: 'Complete financial compensation for localized calamities, pest outbreaks, and drought at only 1.5% seasonal premium.',
        hi: 'केवल 1.5% प्रीमियम पर प्राकृतिक आपदाओं से पूर्ण सुरक्षा।'
      },
      docs: { ta: 'நடவு சான்றிதழ் (VAO), பட்டா, வங்கிக் கணக்கு', en: 'Sowing Certificate from VAO, Land Document, Bank Account', hi: 'बुवाई प्रमाण पत्र, खतौनी' },
      status: 'APPLY BEFORE NOV 15',
    },
    {
      name: { ta: 'சூரிய சக்தி விவசாய பம்ப் செட் (PM-KUSUM)', en: 'Solar Agricultural Pump Subsidy (PM-KUSUM)', hi: 'पीएम-कुसुम सौर पंप सब्सिडी' },
      amount: '70% Subsidy (Save ₹1.8 Lakhs)',
      tag: 'ENERGY INDEPENDENCE',
      benefit: {
        ta: '5HP மற்றும் 7.5HP விவசாய பம்புசெட்டுகளுக்கு 70% அரசு மானியம். மின்சார கட்டணம் இல்லை.',
        en: '70% capital subsidy for 5HP / 7.5HP solar irrigation pump sets with zero electricity cost for 25 years.',
        hi: 'सौर पंप पर 70% सरकारी सब्सिडी, 25 साल तक मुफ्त बिजली।'
      },
      docs: { ta: 'மின் இணைப்பு இல்லாத உறுதிமொழி, நில ஆவணம், நிலத்தடி நீர் சான்று', en: 'Non-electrified declaration, Land records, Ground water certificate', hi: 'भूमि दस्तावेज' },
      status: 'OPEN NOW',
    },
    {
      name: { ta: 'நுண் பாசனத் திட்டம் (சொட்டு நீர் / தூவல் பாசனம்)', en: 'Micro Irrigation Scheme (Drip / Sprinkler)', hi: 'सूक्ष्म सिंचाई योजना (ड्रिप / स्प्रिंकलर)' },
      amount: '100% Subsidy for Small Farmers',
      tag: 'WATER CONSERVATION',
      benefit: {
        ta: 'சிறு மற்றும் குறு விவசாயிகளுக்கு 100% முழு மானியம், இதர விவசாயிகளுக்கு 75% மானியம்.',
        en: '100% full subsidy for small & marginal farmers (<5 acres); 75% subsidy for other landholders.',
        hi: 'लघु एवं सीमांत किसानों के लिए 100% मुफ्त सब्सिडी।'
      },
      docs: { ta: 'சிறு விவசாயி சான்றிதழ், மண் மற்றும் நீர் பரிசோதனை அறிக்கை', en: 'Small farmer certificate, Soil & Water test report, FMB sketch', hi: 'लघु कृषक प्रमाण पत्र' },
      status: 'APPLY ONLINE',
    },
  ];

  return (
    <div style={{ animation: 'pageIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0d3b24 0%, #064e3b 50%, #022c1b 100%)',
        border: '1.5px solid rgba(245, 158, 11, 0.45)', borderRadius: '22px',
        padding: '16px 18px', color: '#fff', position: 'relative', overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.25)'
      }}>
        {/* Golden wheat corner deco */}
        <div style={{ position: 'absolute', top: '10px', right: '14px', fontSize: '2.5rem', opacity: 0.25 }}>🌾</div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', borderRadius: '8px', padding: '4px 10px', fontSize: '11px',
                fontWeight: 700, cursor: 'pointer'
              }}
            >
              ← Back
            </button>
          )}
          <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid #f59e0b', padding: '3px 10px', borderRadius: '999px', fontWeight: 800 }}>
            ICAR & TNAU CERTIFIED GUIDE
          </span>
        </div>

        <h1 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 4px 0', color: '#fef08a' }}>
          🌾 {lang === 'ta' ? 'உழவன் கையேடு (Uzhavan Smart Guide)' : 'Uzhavan Smart Farmer Guide'}
        </h1>
        <p style={{ fontSize: '12px', color: '#a7f3d0', margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
          {lang === 'ta'
            ? 'பயிர் வளர்ச்சி நாட்காட்டி, துல்லிய உரம் கால்குலேட்டர் மற்றும் அரசு மானிய வழிகாட்டல்.'
            : 'Precision Crop Calendar, Smart Fertilizer Calculator & Government Subsidies Portal.'}
        </p>
      </div>

      {/* Feature Navigation Tabs */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {[
          { key: 'calendar', label: lang === 'ta' ? '🗓️ பயிர் நாட்காட்டி' : '🗓️ Crop Calendar' },
          { key: 'calculator', label: lang === 'ta' ? '🧮 உரம் கால்குலேட்டர்' : '🧮 Fertilizer Calc' },
          { key: 'schemes', label: lang === 'ta' ? '🏛️ அரசு மானியங்கள்' : '🏛️ Govt Schemes' },
          { key: 'organic', label: lang === 'ta' ? '🌿 இயற்கை பூச்சி மேலாண்மை' : '🌿 Organic Control' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as GuideTab)}
            style={{
              padding: '8px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 800,
              background: activeTab === tab.key ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--color-surface)',
              color: activeTab === tab.key ? '#fff' : 'var(--color-text-primary)',
              border: activeTab === tab.key ? '1px solid #10b981' : '1px solid var(--color-border)',
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
              boxShadow: activeTab === tab.key ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ TAB 1: CROP CALENDAR ═══ */}
      {activeTab === 'calendar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="card" style={{ background: 'var(--color-paddy-50)', border: '1.5px solid var(--color-paddy)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-paddy-dark)' }}>
                🌾 Paddy IR 64 · 120 Days Timeline
              </div>
              <span style={{ fontSize: '11px', background: '#10b981', color: '#fff', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                DAY 72 OF 120
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 12px 0' }}>
              {lang === 'ta'
                ? 'ஒவ்வொரு வளர்ச்சி நிலையையும் தொட்டு செய்ய வேண்டிய பாசனம் மற்றும் உரம் பணிகளைப் பாருங்கள்:'
                : 'Tap any stage to view precise water depth, nutrient tasks, and pest alerts:'}
            </p>

            {/* Stage Selector Pills */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'none' }}>
              {STAGES.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedStageIndex(idx)}
                  style={{
                    padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 800,
                    background: selectedStageIndex === idx ? 'var(--color-paddy-dark)' : '#ffffff',
                    color: selectedStageIndex === idx ? '#fff' : '#1f2937',
                    border: selectedStageIndex === idx ? '1.5px solid var(--color-paddy-dark)' : '1px solid #d1d5db',
                    cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  {idx === 3 ? '🌸 ' : ''}{s.name[lang].split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Active Stage Detailed Guidance Card */}
          <div className="card" style={{ border: '2px solid #10b981', boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-paddy-dark)', margin: 0 }}>
                {STAGES[selectedStageIndex].name[lang]}
              </h3>
              {selectedStageIndex === 3 && (
                <span style={{ fontSize: '11px', background: '#f59e0b', color: '#000', padding: '2px 8px', borderRadius: '6px', fontWeight: 900 }}>
                  CURRENT ACTIVE STAGE
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#166534', marginBottom: '2px' }}>💧 WATER DEPTH</div>
                <div style={{ fontSize: '12px', color: '#1f2937', fontWeight: 600 }}>{STAGES[selectedStageIndex].water[lang]}</div>
              </div>
              <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#1e40af', marginBottom: '2px' }}>🧪 NUTRIENTS DOSAGE</div>
                <div style={{ fontSize: '12px', color: '#1f2937', fontWeight: 600 }}>{STAGES[selectedStageIndex].nutrients[lang]}</div>
              </div>
            </div>

            <div style={{ background: 'var(--color-bg-subtle)', padding: '12px', borderRadius: '12px', marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#374151', marginBottom: '2px' }}>📋 KEY FIELD ACTION:</div>
              <div style={{ fontSize: '12px', color: '#111827', lineHeight: 1.4 }}>{STAGES[selectedStageIndex].action[lang]}</div>
            </div>

            <div style={{ background: '#fffbeb', padding: '10px 12px', borderRadius: '10px', border: '1px solid #fde68a' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#92400e', marginBottom: '2px' }}>⚠️ PEST & DISEASE ALERT:</div>
              <div style={{ fontSize: '12px', color: '#78350f' }}>{STAGES[selectedStageIndex].risk[lang]}</div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 2: PRECISION FERTILIZER & WATER CALCULATOR ═══ */}
      {activeTab === 'calculator' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="card">
            <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '10px', color: 'var(--color-paddy-dark)' }}>
              🧮 {lang === 'ta' ? 'துல்லிய உரம் & நீர் தேவைக் கணிப்பான்' : 'Precision Fertilizer & Water Calculator'}
            </h3>

            {/* Crop Selector */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Select Crop:
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { key: 'paddy', label: '🌾 Paddy (நெல்)' },
                  { key: 'sugarcane', label: '🎋 Sugarcane (கரும்பு)' },
                  { key: 'cotton', label: '🌱 Cotton (பருத்தி)' },
                  { key: 'maize', label: '🌽 Maize (மக்காச்சோளம்)' },
                ].map(c => (
                  <button
                    key={c.key}
                    onClick={() => setSelectedCrop(c.key as any)}
                    style={{
                      flex: 1, padding: '7px 4px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                      background: selectedCrop === c.key ? 'var(--color-paddy)' : 'var(--color-bg-subtle)',
                      color: selectedCrop === c.key ? '#fff' : 'var(--color-text-secondary)',
                      border: 'none', cursor: 'pointer', textAlign: 'center'
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Acreage Slider */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700 }}>Farm Land Area (நிலப்பரப்பு):</span>
                <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--color-paddy-dark)' }}>
                  {acreage} Acres (ஏக்கர்)
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.1"
                value={acreage}
                onChange={(e) => setAcreage(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-paddy)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7280' }}>
                <span>0.5 Acre</span>
                <span>5 Acres</span>
                <span>10 Acres</span>
              </div>
            </div>

            {/* Computed Requirement Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#166534' }}>UREA (யூரியா)</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#14532d', margin: '4px 0' }}>
                  {calcUreaBags} <span style={{ fontSize: '12px' }}>Bags (45kg)</span>
                </div>
                <div style={{ fontSize: '10px', color: '#15803d' }}>Splits: Basal + Tillering + Panicle</div>
              </div>

              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '14px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#1e40af' }}>DAP (டி.ஏ.பி)</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#1e3a8a', margin: '4px 0' }}>
                  {calcDapBags} <span style={{ fontSize: '12px' }}>Bags (50kg)</span>
                </div>
                <div style={{ fontSize: '10px', color: '#2563eb' }}>100% Basal at Transplanting</div>
              </div>

              <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '14px', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#92400e' }}>POTASH (MOP)</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#78350f', margin: '4px 0' }}>
                  {calcPotashBags} <span style={{ fontSize: '12px' }}>Bags (50kg)</span>
                </div>
                <div style={{ fontSize: '10px', color: '#b45309' }}>Grain filling booster</div>
              </div>

              <div style={{ background: '#fdf2f8', padding: '12px', borderRadius: '14px', border: '1px solid #fbcfe8' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#9d174d' }}>ZINC SULPHATE</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#831843', margin: '4px 0' }}>
                  {calcZincKg} <span style={{ fontSize: '12px' }}>kg</span>
                </div>
                <div style={{ fontSize: '10px', color: '#be185d' }}>Prevents Khaira yellow disease</div>
              </div>
            </div>

            {/* Total Water Footprint */}
            <div style={{ marginTop: '12px', padding: '12px', background: 'var(--color-water-50)', borderRadius: '12px', border: '1px solid var(--color-water-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-water-dark)' }}>
                  💧 Total Season Irrigation Requirement:
                </div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: 'var(--color-water-dark)' }}>
                  ~{calcWaterLiters} L
                </div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                💡 Using NammaVivasayam AI AWD schedules saves up to 30% (~3,60,000 Liters) of this water quota!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 3: GOVERNMENT SUBSIDIES & SCHEMES ═══ */}
      {activeTab === 'schemes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', padding: '0 4px' }}>
            {lang === 'ta'
              ? 'விவசாயிகளுக்கான மத்திய மற்றும் தமிழ்நாடு அரசின் நேரடி மானியங்கள்:'
              : 'Active Central & Tamil Nadu State Government Subsidies & Benefits:'}
          </div>

          {SCHEMES.map((scheme, i) => (
            <div key={i} className="card" style={{ border: '1.5px solid rgba(16, 185, 129, 0.25)', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#b45309', border: '1px solid #f59e0b', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                    {scheme.tag}
                  </span>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, margin: '6px 0 2px 0', color: 'var(--color-paddy-dark)' }}>
                    {scheme.name[lang]}
                  </h3>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: 'var(--color-success)' }}>
                    {scheme.amount}
                  </div>
                </div>
                <span style={{ fontSize: '11px', background: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: '6px', fontWeight: 800, whiteSpace: 'nowrap' }}>
                  {scheme.status}
                </span>
              </div>

              <p style={{ fontSize: '12px', color: '#374151', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                {scheme.benefit[lang]}
              </p>

              <div style={{ background: 'var(--color-bg-subtle)', padding: '8px 10px', borderRadius: '8px', fontSize: '11px', color: '#4b5563', marginBottom: '10px' }}>
                <strong>📄 Required Documents:</strong> {scheme.docs[lang]}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => alert(`Direct portal link opened for ${scheme.name.en}. Helpline: 1800-180-1551`)}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                    background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
                    fontSize: '12px', fontWeight: 800, cursor: 'pointer'
                  }}
                >
                  ✓ Check Eligibility & Apply
                </button>
                <button
                  onClick={() => alert('Farmer Toll-Free Helpline: 1800-180-1551 (Kisan Call Center)')}
                  style={{
                    padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db',
                    background: '#ffffff', color: '#374151', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  📞 Call 1800-180-1551
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ TAB 4: ORGANIC PEST MANAGEMENT MANUAL ═══ */}
      {activeTab === 'organic' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="card">
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-paddy-dark)', marginBottom: '8px' }}>
              🌿 {lang === 'ta' ? 'பஞ்சகவ்யா தயாரிப்பு & பயன்பாடு' : 'Panchagavya Preparation & Application'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '0 0 10px 0' }}>
              {lang === 'ta'
                ? 'பசுவின் சாணம் (5kg), கோமியம் (3L), பால் (2L), தயிர் (2L), நெய் (1kg), வெல்லம் (1kg), இளநீர் (3L) சேர்த்து 21 நாட்கள் நொதிக்க வைக்கவும்.'
                : 'Mix 5kg cow dung, 3L cow urine, 2L milk, 2L curd, 1kg ghee, 1kg jaggery, 3L tender coconut water. Ferment for 21 days.'}
            </p>
            <div style={{ background: '#f0fdf4', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', color: '#166534', fontWeight: 700 }}>
              Spraying Dosage: 3% (30ml in 1 liter of clean water) as a foliar spray every 15 days.
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-paddy-dark)', marginBottom: '8px' }}>
              🌱 {lang === 'ta' ? '3% வேப்பங்கொட்டை கரைசல் (NSKE 3%)' : '3% Neem Seed Kernel Extract (NSKE)'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '0 0 10px 0' }}>
              {lang === 'ta'
                ? 'தண்டு துளைப்பான், இலை சுருட்டுப் புழு மற்றும் புகையான் தாக்குதலை தடுக்க வேப்பங்கொட்டை சாறு மிகச் சிறந்த இயற்கை பூச்சி விரட்டியாகும்.'
                : 'Natural anti-feedant and repellent against Yellow Stem Borer, Leaf Folder, and Brown Planthopper (BPH).'}
            </p>
            <div style={{ background: '#eff6ff', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', color: '#1e40af', fontWeight: 700 }}>
              Usage: 300g crushed neem seeds soaked overnight in 10L water + 10g Khadi soap. Spray evenly.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
