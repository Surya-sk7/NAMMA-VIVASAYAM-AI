// ============================================================
// 🌾 NammaVivasayam AI — Ultra-Luxury Language & Front Screen
// World-Class Aesthetic inspired by Apple, CRED, & Duolingo
// Royal Emerald & 24K Gold Foil, Cartoon Farmer Mascot Greetings,
// Regional Category Filters, Voice Pronunciation, and Instant Demo
// ============================================================
import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LANGUAGES, type SupportedLanguage } from '../../i18n';

interface LanguageSelectScreenProps {
  onComplete?: () => void;
  isModal?: boolean;
}

interface LanguageMeta {
  code: SupportedLanguage;
  greeting: string;
  motto: string;
  stateName: string;
  region: 'south' | 'north' | 'west' | 'east' | 'all';
  symbol: string;
  spokenSample: string;
  culturalNote: string;
}

const LANGUAGE_DETAILS: Record<SupportedLanguage, LanguageMeta> = {
  ta: {
    code: 'ta',
    greeting: 'வணக்கம்!',
    motto: 'உழவுக்கும் தொழிலுக்கும் வந்தனை செய்வோம்',
    stateName: 'தமிழ்நாடு · Tamil Nadu',
    region: 'south',
    symbol: '🌾',
    spokenSample: 'வணக்கம்! நம்ம விவசாயம் AI-க்கு உங்களை அன்போடு வரவேற்கிறோம்.',
    culturalNote: 'உழவர் திருநாள் & பொங்கல் பூமி',
  },
  en: {
    code: 'en',
    greeting: 'Welcome!',
    motto: 'Empowering Farmers with Satellite AI & Precision Ag',
    stateName: 'Pan-India & Global',
    region: 'all',
    symbol: '🌍',
    spokenSample: 'Welcome to NammaVivasayam AI! Know your farm, know what to do.',
    culturalNote: 'Universal Farming Intelligence',
  },
  hi: {
    code: 'hi',
    greeting: 'नमस्ते!',
    motto: 'जय जवान, जय किसान, जय विज्ञान',
    stateName: 'उत्तर एवं मध्य भारत (North & Central India)',
    region: 'north',
    symbol: '🌱',
    spokenSample: 'नमस्ते! नम्मा विवसायम AI में आपका हार्दिक स्वागत है।',
    culturalNote: 'हरित क्रांति एवं अन्नदाता की भूमि',
  },
  te: {
    code: 'te',
    greeting: 'నమస్కారం!',
    motto: 'రైతే దేశానికి వెన్నెముక · అన్నదాత సుఖీభవ',
    stateName: 'ఆంధ్రప్రదేశ్ & తెలంగాణ (AP & TS)',
    region: 'south',
    symbol: '🌾',
    spokenSample: 'నమస్కారం! నమ్మ వివసాయం AI కి సాదర స్వాగతం.',
    culturalNote: 'వరి ధాన్యం & గోదావరి లోయ',
  },
  kn: {
    code: 'kn',
    greeting: 'ನಮಸ್ಕಾರ!',
    motto: 'ಕೃಷಿಕನೇ ದೇಶದ ಬೆನ್ನೆಲುಬು · ಅನ್ನದಾತೋ ಸುಖೀಭವ',
    stateName: 'ಕರ್ನಾಟಕ (Karnataka)',
    region: 'south',
    symbol: '🌴',
    spokenSample: 'ನಮಸ್ಕಾರ! ನಮ್ಮ ವಿವಸಾಯಂ AI ಗೆ ಹೃತ್ಪೂರ್ವಕ ಸ್ವಾಗತ.',
    culturalNote: 'ಕಾವೇರಿ ಕಣಿವೆ & ಸಿರಿಧಾನ್ಯ ನಾಡು',
  },
  ml: {
    code: 'ml',
    greeting: 'നമസ്കാരം!',
    motto: 'കർഷകനാണ് നാടിന്റെ ജീവവായു',
    stateName: 'കേരളം (Kerala)',
    region: 'south',
    symbol: '🥥',
    spokenSample: 'നമസ്കാരം! നമ്മ വിവസായം AI ലേക്ക് സ്വാഗതം.',
    culturalNote: 'സുഗന്ധവ്യഞ്ജനങ്ങളുടെ നാട്',
  },
  mr: {
    code: 'mr',
    greeting: 'नमस्कार!',
    motto: 'बळीराजा सुखी भव · शेतकरी जगला तर देश जगेल',
    stateName: 'महाराष्ट्र (Maharashtra)',
    region: 'west',
    symbol: '🌻',
    spokenSample: 'नमस्कार! नम्मा विवसायम AI मध्ये आपले सहर्ष स्वागत आहे.',
    culturalNote: 'सह्याद्रीची माती व काळी कसदार जमीन',
  },
  bn: {
    code: 'bn',
    greeting: 'নমস্কার!',
    motto: 'কৃষিকাজই দেশের প্রাণ ও সমৃদ্ধি',
    stateName: 'পশ্চিমবঙ্গ ও ত্রিপুরা (Bengal & Tripura)',
    region: 'east',
    symbol: '🌾',
    spokenSample: 'নমস্কার! নম্মা বিবসায়ম AI-তে আপনাকে সাদর আমন্ত্রণ।',
    culturalNote: 'গঙ্গা অববাহিকা ও সোনালী ধানের দেশ',
  },
  gu: {
    code: 'gu',
    greeting: 'નમસ્તે!',
    motto: 'ખેડૂત સુખી તો જગત સુખી · જય કિસાન',
    stateName: 'ગુજરાત (Gujarat)',
    region: 'west',
    symbol: '🌿',
    spokenSample: 'નમસ્તે! નમ્મા વિવસાયમ AI માં આપનું હાર્દિક સ્વાગત છે.',
    culturalNote: 'શ્વેત ક્રાંતિ & સમૃદ્ધ ખેતી',
  },
  or: {
    code: 'or',
    greeting: 'ନମସ୍କାର!',
    motto: 'କୃଷି ହିଁ ଜୀବନ ଓ ପ୍ରଗତି · ଜୟ କିଷାନ',
    stateName: 'ଓଡ଼ିଶା (Odisha)',
    region: 'east',
    symbol: '🌾',
    spokenSample: 'ନମସ୍କାର! ନମ୍ମା ବିବସାୟମ AI କୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ।',
    culturalNote: 'ଉତ୍କଳର ଶସ୍ୟ ଶ୍ୟାମଳା ଭୂମି ଓ ଧାନ କ୍ଷେତ୍ର',
  },
  pa: {
    code: 'pa',
    greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ!',
    motto: 'ਕਿਸਾਨ ਮਜ਼ਦੂਰ ਏਕਤਾ ਜ਼ਿੰਦਾਬਾਦ',
    stateName: 'ਪੰਜਾਬ (Punjab & North)',
    region: 'north',
    symbol: '🌾',
    spokenSample: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਨੰਮਾ ਵਿਵਾਸਾਯਮ AI ਵਿੱਚ ਤੁਹਾਡਾ ਨਿੱਘਾ ਸਵਾਗਤ ਹੈ।',
    culturalNote: 'ਪੰਜ ਦਰਿਆਵਾਂ ਦੀ ਧਰਤੀ & ਕਣਕ ਦਾ ਕਟੋਰਾ',
  },
};

const BCP47_LOCALES: Record<SupportedLanguage, string> = {
  ta: 'ta-IN', en: 'en-IN', hi: 'hi-IN', te: 'te-IN', kn: 'kn-IN',
  ml: 'ml-IN', mr: 'mr-IN', bn: 'bn-IN', gu: 'gu-IN', or: 'or-IN', pa: 'pa-IN',
};

const AI_WELCOME_TEXT = 'Hi! Hello! Thank you for choosing our app. Please select your language. Have a great experience!';

export default function LanguageSelectScreen({ onComplete, isModal = false }: LanguageSelectScreenProps) {
  const { state, dispatch } = useApp();
  const [selected, setSelected] = useState<SupportedLanguage>(state.language || 'ta');
  const [playingCode, setPlayingCode] = useState<string | null>(null);
  const [isPlayingAiIntro, setIsPlayingAiIntro] = useState(false);
  const [regionFilter, setRegionFilter] = useState<'all' | 'south' | 'north' | 'west' | 'east'>('all');
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load voices in background if available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
    return () => {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playVoiceAudio = (
    text: string,
    langCode: SupportedLanguage | 'en',
    trackId: string,
    onEndedCallback?: () => void
  ) => {
    // If currently playing the same track, stop it
    if (playingCode === trackId) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingCode(null);
      setIsPlayingAiIntro(false);
      return;
    }

    // Stop existing playback
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setPlayingCode(trackId);
    if (trackId === 'ai-intro') {
      setIsPlayingAiIntro(true);
    }

    const handleFinished = () => {
      setPlayingCode(null);
      setIsPlayingAiIntro(false);
      activeAudioRef.current = null;
      onEndedCallback?.();
    };

    // Google Translate TTS URL provides fluent native Indian human audio for all 10 languages
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodeURIComponent(text)}`;
    const audio = new Audio(ttsUrl);
    activeAudioRef.current = audio;

    audio.onended = handleFinished;
    audio.onerror = () => {
      // Fallback: Web Speech API with locale
      activeAudioRef.current = null;
      if (!('speechSynthesis' in window)) {
        handleFinished();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = BCP47_LOCALES[langCode as SupportedLanguage] || 'en-IN';
      utterance.rate = 0.92;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const matched = voices.find(v => v.lang.toLowerCase().startsWith(langCode));
      if (matched) utterance.voice = matched;

      utterance.onend = handleFinished;
      utterance.onerror = handleFinished;
      window.speechSynthesis.speak(utterance);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy or network fallback
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = BCP47_LOCALES[langCode as SupportedLanguage] || 'en-IN';
          utterance.rate = 0.92;
          utterance.pitch = 1.05;
          const voices = window.speechSynthesis.getVoices();
          const matched = voices.find(v => v.lang.toLowerCase().startsWith(langCode));
          if (matched) utterance.voice = matched;
          utterance.onend = handleFinished;
          utterance.onerror = handleFinished;
          window.speechSynthesis.speak(utterance);
        } else {
          handleFinished();
        }
      });
    }
  };

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setSelected(code);
    dispatch({ type: 'SET_LANGUAGE', payload: code });
  };

  const handlePlayVoiceSample = (e: React.MouseEvent, code: SupportedLanguage) => {
    e.stopPropagation();
    const sample = LANGUAGE_DETAILS[code].spokenSample;
    playVoiceAudio(sample, code, code);
  };

  const handlePlayAiIntro = () => {
    playVoiceAudio(AI_WELCOME_TEXT, 'en', 'ai-intro');
  };

  // Start in Real Farming Mode (Direct live experience, no demo banner)
  const handleStartRealMode = () => {
    dispatch({ type: 'SET_LANGUAGE', payload: selected });
    const realUser = {
      id: `u-${Date.now()}`,
      name: 'Murugan (முருகன்)',
      phone: '+91 98765 43210',
      location: 'Madurai, Tamil Nadu',
      role: 'farmer' as const,
      createdAt: new Date().toISOString(),
    };
    const realFarm = {
      id: `f-${Date.now()}`,
      userId: realUser.id,
      farmName: 'Madurai Agricultural Field (முருகன் பண்ணை)',
      location: 'Madurai, Tamil Nadu',
      area: 1.8,
      soilType: 'ALLUVIAL' as const,
      irrigationSource: 'CANAL' as const,
      cropStage: 'flowering' as const,
      cropName: 'Paddy IR 64',
      plantingDate: '2024-07-15',
      boundary: [],
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'SET_USER', payload: realUser as any });
    dispatch({ type: 'SET_FARM', payload: realFarm as any });
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    dispatch({ type: 'SET_DEMO_MODE', payload: false });
    dispatch({ type: 'SET_ONBOARDING', payload: false });
    if (onComplete) onComplete();
  };

  const handleConfirm = () => {
    dispatch({ type: 'SET_LANGUAGE', payload: selected });
    if (onComplete) {
      onComplete();
    } else {
      handleStartRealMode();
    }
  };

  const handleQuickDemo = () => {
    dispatch({ type: 'SET_LANGUAGE', payload: selected });
    dispatch({ type: 'LOGIN_DEMO' });
    if (onComplete) onComplete();
  };

  const selectedDetails = LANGUAGE_DETAILS[selected];

  const filteredLanguages = (Object.keys(LANGUAGE_DETAILS) as SupportedLanguage[]).filter(code => {
    if (regionFilter === 'all') return true;
    const meta = LANGUAGE_DETAILS[code];
    return meta.region === regionFilter || meta.region === 'all';
  });

  return (
    <div style={{
      minHeight: isModal ? 'auto' : '100vh',
      background: 'radial-gradient(ellipse at 50% 0%, #0d3b24 0%, #051e12 45%, #020c07 100%)',
      color: '#f9fafb',
      display: 'flex', flexDirection: 'column',
      padding: isModal ? 'var(--space-4)' : 'var(--space-5) var(--space-4)',
      position: 'relative', overflow: 'hidden',
      boxShadow: isModal ? '0 25px 60px -10px rgba(0,0,0,0.85)' : 'none',
      borderRadius: isModal ? '28px' : '0',
      border: isModal ? '1px solid rgba(245, 158, 11, 0.35)' : 'none'
    }}>
      {/* 24K Gold Ambient Light Beams */}
      <div style={{
        position: 'absolute', top: '-140px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.28) 0%, rgba(16, 185, 129, 0.18) 45%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(40px)'
      }} />

      {/* Decorative Golden Corner Wheat Sprigs */}
      <div style={{ position: 'absolute', top: '12px', left: '16px', opacity: 0.35, fontSize: '1.4rem', pointerEvents: 'none' }}>🌾</div>
      <div style={{ position: 'absolute', top: '12px', right: '16px', opacity: 0.35, fontSize: '1.4rem', pointerEvents: 'none' }}>✨</div>

      {/* Top Luxury Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 10, marginBottom: 'var(--space-3)'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '999px', padding: '4px 12px', backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          <span style={{ fontSize: '12px' }}>🇮🇳</span>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.04em' }}>
            SIH 2026 · 10 INDIAN LANGUAGES
          </span>
        </div>

        <div style={{
          fontSize: '11px', color: '#6ee7b7', background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.35)', padding: '4px 10px',
          borderRadius: '999px', fontWeight: 700
        }}>
          🛰️ Remote Sensing AI
        </div>
      </div>

      {/* Hero Brand & Cartoon Farmer Mascot Greeting */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, marginBottom: 'var(--space-4)' }}>
        {/* Cartoon Farmer Mascot with 3D Gold Ring & Speech Bubble */}
        <div style={{
          position: 'relative', width: '105px', height: '105px',
          margin: '0 auto var(--space-3) auto',
        }}>
          <div style={{
            width: '100%', height: '100%', borderRadius: '50%', padding: '4px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #10b981 40%, #fbbf24 100%)',
            boxShadow: '0 0 40px rgba(245, 158, 11, 0.55), inset 0 0 15px rgba(255, 255, 255, 0.3)',
            position: 'relative', animation: 'mascotBob 3s ease-in-out infinite'
          }}>
            <img
              src="/images/farmer_mascot_avatar.jpg"
              alt="Uzhavan Kisaan Mascot"
              style={{
                width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%',
                display: 'block'
              }}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/images/farmer_mascot.jpg';
              }}
            />
            {/* Mascot AI Crown Badge */}
            <span style={{
              position: 'absolute', bottom: '-4px', right: '-4px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000', fontSize: '11px', fontWeight: 900,
              borderRadius: '999px', padding: '2px 8px', border: '2px solid #051e12',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}>
              AI 🌾
            </span>
          </div>

          {/* Floating Welcoming Dialogue Bubble */}
          <div style={{
            position: 'absolute', top: '-18px', left: '100%', transform: 'translateX(-20px)',
            background: 'rgba(255, 255, 255, 0.95)', color: '#064e3b',
            borderRadius: '16px', padding: '6px 12px', fontSize: '11px', fontWeight: 800,
            whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            border: '1.5px solid #f59e0b', zIndex: 12,
            animation: 'pulse 2.5s infinite'
          }}>
            {selectedDetails.greeting} உங்களை வரவேற்கிறோம்! 👨‍🌾
            <div style={{
              position: 'absolute', bottom: '-6px', left: '18px', width: '10px', height: '10px',
              background: '#fff', transform: 'rotate(45deg)', borderRight: '1.5px solid #f59e0b',
              borderBottom: '1.5px solid #f59e0b'
            }} />
          </div>
        </div>

        <h1 style={{
          fontSize: '25px', fontWeight: 900, margin: '0 0 6px 0',
          background: 'linear-gradient(90deg, #fffbeb 0%, #fde047 30%, #f59e0b 70%, #fef08a 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em', textShadow: '0 0 25px rgba(245, 158, 11, 0.3)'
        }}>
          உங்கள் தாய்மொழியைத் தேர்வு செய்க
        </h1>
        <p style={{ fontSize: '13px', color: '#a7f3d0', margin: 0, fontWeight: 600 }}>
          Choose Your Native Language · AI Precision Farming Platform
        </p>

        {/* AI Audio Greeting stating words requested by user */}
        <div style={{ marginTop: '12px' }}>
          <button
            onClick={handlePlayAiIntro}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: isPlayingAiIntro
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(16, 185, 129, 0.25))',
              border: isPlayingAiIntro ? '2px solid #ef4444' : '1.5px solid #fbbf24',
              borderRadius: '999px', padding: '7px 16px', color: '#fef08a',
              fontSize: '12px', fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
              transition: 'all 0.2s', backdropFilter: 'blur(8px)'
            }}
          >
            <span>{isPlayingAiIntro ? '⏹️ Stop Audio' : '🔊 AI Audio Welcome'}</span>
            <span style={{ fontSize: '11px', color: '#fff', opacity: 0.9 }}>
              "Hi! Hello! Thank you for choosing our app..."
            </span>
          </button>
        </div>
      </div>

      {/* Region Category Filter Tabs */}
      <div style={{
        display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px',
        marginBottom: 'var(--space-3)', scrollbarWidth: 'none'
      }}>
        {[
          { key: 'all', label: 'All 10 (அனைத்தும்)' },
          { key: 'south', label: 'South (தெற்கு)' },
          { key: 'north', label: 'North (उत्तर)' },
          { key: 'west', label: 'West (पश्चिम)' },
          { key: 'east', label: 'East (পূর্ব)' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setRegionFilter(tab.key as any)}
            style={{
              padding: '6px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
              background: regionFilter === tab.key ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.05)',
              color: regionFilter === tab.key ? '#111827' : 'rgba(255, 255, 255, 0.7)',
              border: regionFilter === tab.key ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
              boxShadow: regionFilter === tab.key ? '0 2px 8px rgba(245, 158, 11, 0.4)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Showcase Card for Selected Language */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(16, 185, 129, 0.22) 100%)',
        border: '2px solid rgba(245, 158, 11, 0.55)', borderRadius: '20px',
        padding: '14px 18px', marginBottom: 'var(--space-4)', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(12px)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.45)', position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            fontSize: '2.4rem', width: '52px', height: '52px', borderRadius: '14px',
            background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            {selectedDetails.symbol}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#fef08a' }}>
                {LANGUAGES[selected]?.nativeName}
              </span>
              <span style={{
                fontSize: '11px', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)', padding: '2px 8px', borderRadius: '6px',
                fontWeight: 700
              }}>
                {LANGUAGES[selected]?.name}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#6ee7b7', fontStyle: 'italic', marginTop: '3px', fontWeight: 600 }}>
              "{selectedDetails.motto}"
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
              📍 {selectedDetails.stateName} · {selectedDetails.culturalNote}
            </div>
          </div>
        </div>

        {/* Audio Pronunciation Button */}
        <button
          onClick={(e) => handlePlayVoiceSample(e, selected)}
          style={{
            background: playingCode === selected ? '#ef4444' : 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: 'none', color: '#1a1003', padding: '8px 14px',
            borderRadius: '999px', fontSize: '12px', fontWeight: 900,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)', flexShrink: 0
          }}
        >
          {playingCode === selected ? '⏹️ Stop' : '🔊 Pronounce'}
        </button>
      </div>

      {/* 10-Language Luxury Card Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px',
        marginBottom: 'var(--space-5)', flex: 1, overflowY: 'auto',
        maxHeight: isModal ? '340px' : '360px', paddingRight: '2px'
      }}>
        {filteredLanguages.map((code) => {
          const info = LANGUAGES[code];
          const meta = LANGUAGE_DETAILS[code];
          const isSelected = selected === code;

          return (
            <div
              key={code}
              onClick={() => handleSelectLanguage(code)}
              style={{
                position: 'relative',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.32) 0%, rgba(245, 158, 11, 0.28) 100%)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isSelected ? '2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '18px', padding: '12px 14px', cursor: 'pointer',
                transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: isSelected
                  ? '0 0 28px rgba(245, 158, 11, 0.45), inset 0 0 16px rgba(245, 158, 11, 0.2)'
                  : '0 4px 12px rgba(0,0,0,0.2)',
                transform: isSelected ? 'translateY(-2px) scale(1.02)' : 'none',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                backdropFilter: 'blur(8px)'
              }}
            >
              {/* Selected Checkmark Badge */}
              {isSelected && (
                <div style={{
                  position: 'absolute', top: '8px', right: '8px',
                  width: '22px', height: '22px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#000', fontSize: '12px', fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                }}>
                  ✓
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '1.3rem' }}>{meta.symbol}</span>
                  <span style={{
                    fontSize: '18px', fontWeight: 900,
                    color: isSelected ? '#fef08a' : '#ffffff',
                    letterSpacing: '-0.01em'
                  }}>
                    {info.nativeName}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>
                  {info.name}
                </div>
                <div style={{ fontSize: '10px', color: '#6ee7b7', marginTop: '2px' }}>
                  {meta.stateName.split('·')[0].trim()}
                </div>
              </div>

              {/* Greeting & Voice Sample Pill */}
              <div style={{
                marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '12px', color: '#a7f3d0', fontWeight: 700 }}>
                  {meta.greeting}
                </span>

                <button
                  onClick={(e) => handlePlayVoiceSample(e, code)}
                  title="Pronounce greeting"
                  style={{
                    background: playingCode === code ? '#ef4444' : 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.15)', color: '#f3f4f6',
                    width: '26px', height: '26px', borderRadius: '50%',
                    fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                  }}
                >
                  {playingCode === code ? '⏹' : '🔊'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 24K Gold Luxury Action Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', zIndex: 10 }}>
        {/* Primary Proceed CTA — Direct Real Mode */}
        <button
          onClick={handleStartRealMode}
          className="gold-shimmer-btn"
          style={{
            width: '100%', padding: '16px', borderRadius: '18px',
            color: '#1a1003', fontWeight: 900, fontSize: '15px',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 10px 35px rgba(245, 158, 11, 0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            textTransform: 'uppercase', letterSpacing: '0.03em'
          }}
        >
          <span>✨ Continue in Real Mode · {LANGUAGES[selected]?.nativeName} (தொடர்க)</span>
          <span style={{ fontSize: '1.2rem' }}>➔</span>
        </button>

        {/* Step-by-Step Onboarding Profile Setup */}
        {onComplete && (
          <button
            onClick={handleConfirm}
            style={{
              width: '100%', padding: '12px', borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              color: '#fef08a', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <span>📝 Register & Setup Farm Profile (புதிய பதிவு)</span>
          </button>
        )}

        {/* Demo Mode Instant Launch */}
        <button
          onClick={handleQuickDemo}
          style={{
            width: '100%', padding: '12px', borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(16, 185, 129, 0.09) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#a7f3d0', fontSize: '12px', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            backdropFilter: 'blur(8px)'
          }}
        >
          <span>🚀 Explore Instant Interactive Demo (டெமோ முறை)</span>
        </button>

        {/* Government & Satellite Trust Seal */}
        <div style={{
          textAlign: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '2px'
        }}>
          <span>🛡️ ICAR Standardized</span>
          <span>•</span>
          <span>🛰️ Sentinel-2 Remote Sensing</span>
          <span>•</span>
          <span>🌾 100% Free for Farmers</span>
        </div>
      </div>
    </div>
  );
}

