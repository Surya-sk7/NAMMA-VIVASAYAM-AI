// ============================================================
// 🌾 NammaVivasayam AI — Cartoon Farmer Mascot Component
// Creative, cheerful agricultural companion present across every corner of the app
// Supports 3D cartoon avatars, doctor pose, happy pose, voice tips, and corner peekers
// ============================================================

import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export type MascotPose = 'waving' | 'thinking' | 'doctor' | 'speaking' | 'celebrating' | 'mini' | 'happy' | 'peeker';

interface FarmerMascotProps {
  pose?: MascotPose;
  size?: number;
  message?: string;
  showBubble?: boolean;
  corner?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'inline' | 'card-corner';
  onClick?: () => void;
  interactive?: boolean;
}

const MASCOT_TIPS: Record<string, string[]> = {
  ta: [
    'வணக்கம்! இன்று மாலை மழை வாய்ப்புள்ளது, வடிகால் வாய்க்காலை கவனியுங்கள்! 🌧️',
    'உரத்தை மழைக்கு முன் போடாதீர்கள், மழை நின்ற பின் தெளிப்பதே சிறந்தது! 🧪',
    'பூக்கும் நிலையில் அதிக நீர் தேங்கினால் வேர் மூச்சுத்திணறல் ஏற்படும்! 💧',
    'Crop Doctor-ல் இலை புகைப்படத்தை பதிவேற்றி நோய்களை உடனே கண்டறியுங்கள்! 📸',
    'Services பக்கத்தில் முன்னரே Combine Harvester முன்பதிவு செய்யுங்கள்! 🚜',
    'மண் ஈரம் 68%-ல் உள்ளது — இன்று பாசனம் தேவையில்லை! 🌱',
  ],
  en: [
    'Hello farmer friend! Keep drainage channels clear before evening showers! 🌧️',
    'Avoid top-dressing urea before heavy rain to prevent surface nutrient runoff! 🧪',
    'Excess water during flowering restricts root aeration — let soil breathe! 💧',
    'Snap a quick leaf picture in Crop Doctor for instant disease diagnostics! 📸',
    'Book combine harvesters early on the Services tab to avoid harvest rush! 🚜',
    'Soil moisture is at optimal 68% — skip irrigation today to save water & power! 🌱',
  ],
  hi: [
    'नमस्ते किसान भाई! शाम की बारिश से पहले खेत की नाली साफ रखें! 🌧️',
    'बारिश से पहले यूरिया न डालें, वरना पोषक तत्व बह जाएंगे! 🧪',
    'फूल आने पर अधिक पानी न भरें, जड़ों को नुकसान हो सकता है! 💧',
    'फसल डॉक्टर में पत्ती की फोटो डालकर तुरंत बीमारी पहचानें! 📸',
    'मिट्टी में 68% नमी है — आज सिंचाई की आवश्यकता नहीं है! 🌱',
  ],
  te: [
    'నమస్కారం రైతు సోదరా! సాయంత్రం వర్షం సూచన ఉంది, కాలువలు శుభ్రం చేయండి! 🌧️',
    'భారీ వర్షానికి ముందు యూరియా వేయకండి, పోషకాలు కొట్టుకుపోతాయి! 🧪',
    'క్రాప్ డాక్టర్ లో ఆకు ఫోటో తీసి వెంటనే తెగుళ్లను గుర్తించండి! 📸',
  ],
  kn: [
    'ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೇ! ಸಂಜೆ ಮಳೆ ಸಾಧ್ಯತೆ ಇದೆ, ಚರಂಡಿ ಸ್ವಚ್ಛವಾಗಿಡಿ! 🌧️',
    'ಬೆಳೆ ಡಾಕ್ಟರ್ ನಲ್ಲಿ ಎಲೆ ಫೋಟೋ ಹಾಕಿ ರೋಗ ಪತ್ತೆ ಹಚ್ಚಿ! 📸',
  ],
};

const BCP47_LOCALES: Record<string, string> = {
  ta: 'ta-IN', en: 'en-IN', hi: 'hi-IN', te: 'te-IN', kn: 'kn-IN',
  ml: 'ml-IN', mr: 'mr-IN', bn: 'bn-IN', gu: 'gu-IN', pa: 'pa-IN',
};

export default function FarmerMascot({
  pose = 'happy',
  size = 56,
  message,
  showBubble = false,
  corner = 'inline',
  onClick,
  interactive = true,
}: FarmerMascotProps) {
  const { state, dispatch } = useApp();
  const [bubbleOpen, setBubbleOpen] = useState(showBubble);
  const [tipIndex, setTipIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const lang = state.language;
  const tips = MASCOT_TIPS[lang] || MASCOT_TIPS['en'];
  const activeMessage = message || tips[tipIndex % tips.length];

  const handleMascotClick = () => {
    if (onClick) {
      onClick();
    } else if (interactive) {
      setBubbleOpen(prev => !prev);
      setTipIndex(prev => prev + 1);
    }
  };

  const handleSpeakTip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(activeMessage);
    utter.lang = BCP47_LOCALES[lang] || 'ta-IN';
    utter.rate = 0.95;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const getMascotImage = () => {
    switch (pose) {
      case 'doctor':
        return '/images/farmer_crop_doctor.jpg';
      case 'happy':
      case 'celebrating':
        return '/images/farmer_mascot_happy.jpg';
      case 'waving':
      case 'thinking':
      case 'speaking':
      default:
        return '/images/farmer_mascot_avatar.jpg';
    }
  };

  const getPoseBadge = () => {
    switch (pose) {
      case 'doctor': return '🩺';
      case 'speaking': return '🎙️';
      case 'thinking': return '💡';
      case 'celebrating': return '🎉';
      case 'happy': return '🌾';
      case 'peeker': return '👋';
      default: return '✨';
    }
  };

  // Card corner decorative peeker
  if (corner === 'card-corner') {
    return (
      <div
        onClick={handleMascotClick}
        style={{
          position: 'absolute', top: '-14px', right: '12px',
          display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', zIndex: 10
        }}
      >
        <div style={{
          width: `${size}px`, height: `${size}px`, borderRadius: '50%',
          border: '2px solid #f59e0b', overflow: 'hidden',
          background: 'linear-gradient(135deg, #10b981, #064e3b)',
          boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)', position: 'relative'
        }}>
          <img
            src={getMascotImage()}
            alt="Mascot"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/farmer_mascot.jpg'; }}
          />
        </div>
      </div>
    );
  }

  // Inline render
  if (corner === 'inline') {
    return (
      <div
        className="farmer-mascot-inline"
        onClick={handleMascotClick}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: interactive ? 'pointer' : 'default',
          position: 'relative'
        }}
      >
        <div style={{
          width: `${size}px`, height: `${size}px`, borderRadius: '50%',
          border: '2.5px solid #f59e0b', overflow: 'hidden',
          background: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
          flexShrink: 0, position: 'relative',
          animation: 'mascotBob 3s ease-in-out infinite'
        }}>
          <img
            src={getMascotImage()}
            alt="NammaVivasayam Farmer Mascot"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/farmer_mascot.jpg'; }}
          />
          <span style={{
            position: 'absolute', bottom: '0', right: '0',
            fontSize: '11px', background: 'rgba(0,0,0,0.65)', borderRadius: '50%',
            padding: '2px', lineHeight: 1
          }}>
            {getPoseBadge()}
          </span>
        </div>

        {bubbleOpen && (
          <div style={{
            background: '#ffffff', color: '#1f2937', padding: '8px 12px',
            borderRadius: '14px 14px 14px 4px', fontSize: '12px', fontWeight: 600,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)', border: '1.5px solid #fcd34d',
            maxWidth: '240px', lineHeight: 1.4, animation: 'pageIn 0.2s ease', zIndex: 10
          }}>
            {activeMessage}
          </div>
        )}
      </div>
    );
  }

  // Fixed Corner Floating Companion
  const isBottomRight = corner === 'bottom-right';
  const isBottomLeft = corner === 'bottom-left';
  const isTopRight = corner === 'top-right';
  const isTopLeft = corner === 'top-left';

  return (
    <div style={{
      position: 'fixed',
      bottom: (isBottomRight || isBottomLeft) ? '84px' : undefined,
      top: (isTopRight || isTopLeft) ? '68px' : undefined,
      right: (isBottomRight || isTopRight) ? '16px' : undefined,
      left: (isBottomLeft || isTopLeft) ? '16px' : undefined,
      zIndex: 90,
      display: 'flex',
      flexDirection: 'column',
      alignItems: (isBottomRight || isTopRight) ? 'flex-end' : 'flex-start',
      pointerEvents: 'auto'
    }}>
      {/* Speech Bubble */}
      {bubbleOpen && (
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)',
          color: '#1f2937', padding: '12px 16px',
          borderRadius: isBottomRight ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          boxShadow: '0 12px 35px rgba(0,0,0,0.25), 0 0 20px rgba(245, 158, 11, 0.3)',
          border: '2px solid #f59e0b', fontSize: '12px', fontWeight: 600,
          maxWidth: '260px', marginBottom: '8px', lineHeight: 1.45,
          animation: 'pageIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', borderBottom: '1px solid rgba(245, 158, 11, 0.3)', paddingBottom: '3px' }}>
            <span style={{ fontSize: '10px', color: '#b45309', fontWeight: 800, textTransform: 'uppercase' }}>
              🌾 Uzhavan Guide (உழவன் தோழன்)
            </span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                onClick={handleSpeakTip}
                title="Read tip aloud"
                style={{
                  background: isSpeaking ? '#ef4444' : 'rgba(245, 158, 11, 0.2)',
                  border: 'none', borderRadius: '50%', width: '18px', height: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', cursor: 'pointer', color: isSpeaking ? '#fff' : '#b45309'
                }}
              >
                {isSpeaking ? '⏹' : '🔊'}
              </button>
              <span
                onClick={() => setBubbleOpen(false)}
                style={{ cursor: 'pointer', fontSize: '11px', color: '#9ca3af', fontWeight: 700 }}
              >
                ✕
              </span>
            </div>
          </div>

          <div>{activeMessage}</div>

          <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
            <button
              onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'pesu' })}
              style={{
                flex: 1, padding: '4px 8px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none',
                fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
              }}
            >
              Ask Pesu 🎙️
            </button>
            <button
              onClick={() => setTipIndex(prev => prev + 1)}
              style={{
                padding: '4px 10px', borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.25)', color: '#b45309', border: '1px solid rgba(245, 158, 11, 0.4)',
                fontSize: '11px', fontWeight: 800, cursor: 'pointer'
              }}
            >
              Next 💡
            </button>
          </div>
        </div>
      )}

      {/* Floating Animated Mascot Button */}
      <button
        onClick={handleMascotClick}
        aria-label="Farmer Mascot Guide"
        style={{
          width: `${size}px`, height: `${size}px`, borderRadius: '50%',
          border: '3px solid #f59e0b', background: 'linear-gradient(135deg, #f59e0b, #10b981)',
          padding: '0', overflow: 'hidden', cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(0,0,0,0.3), 0 0 20px rgba(245, 158, 11, 0.5)',
          position: 'relative', transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          outline: 'none', animation: 'mascotBob 3.5s ease-in-out infinite'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.12) rotate(-5deg)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')}
      >
        <img
          src={getMascotImage()}
          alt="NammaVivasayam Mascot"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/farmer_mascot.jpg'; }}
        />
        {/* Mood badge */}
        <span style={{
          position: 'absolute', top: '1px', right: '1px',
          fontSize: '11px', background: 'rgba(0,0,0,0.7)', borderRadius: '50%',
          width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {getPoseBadge()}
        </span>
      </button>
    </div>
  );
}

