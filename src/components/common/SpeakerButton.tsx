// ============================================================
// 🌾 NammaVivasayam AI — Reusable Multilingual Speaker Button
// Follows selected application language, prevents overlaps,
// displays native language label & handles voice availability
// ============================================================

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LANGUAGES } from '../../i18n';
import voiceService from '../../services/voiceService';

interface SpeakerButtonProps {
  text: string;
  labelPrefix?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'gold' | 'glass';
  className?: string;
}

export default function SpeakerButton({
  text,
  size = 'md',
  variant = 'glass',
  className = '',
}: SpeakerButtonProps) {
  const { state } = useApp();
  const lang = state.language;
  const langInfo = LANGUAGES[lang] || LANGUAGES.ta;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMissing, setVoiceMissing] = useState(false);

  useEffect(() => {
    // Reset state if language changes while playing
    voiceService.stop();
    setIsSpeaking(false);
    setVoiceMissing(false);
  }, [lang]);

  const handleToggleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isSpeaking) {
      voiceService.stop();
      setIsSpeaking(false);
      return;
    }

    setVoiceMissing(false);

    const started = voiceService.speak(text, lang, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
      onVoiceMissing: () => {
        setIsSpeaking(false);
        setVoiceMissing(true);
        setTimeout(() => setVoiceMissing(false), 4000);
      },
    });

    if (!started && !voiceMissing) {
      setIsSpeaking(false);
    }
  };

  const getButtonStyles = (): React.CSSProperties => {
    const isSmall = size === 'sm';
    const isLarge = size === 'lg';

    let baseBg = 'rgba(255, 255, 255, 0.15)';
    let baseBorder = '1px solid rgba(255, 255, 255, 0.25)';
    let baseColor = '#ffffff';

    if (variant === 'gold') {
      baseBg = isSpeaking ? '#b45309' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      baseBorder = '1px solid #fbbf24';
      baseColor = '#ffffff';
    } else if (variant === 'primary') {
      baseBg = isSpeaking ? '#047857' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      baseBorder = '1px solid #34d399';
      baseColor = '#ffffff';
    }

    if (isSpeaking) {
      baseBg = '#ef4444';
      baseBorder = '1px solid #f87171';
    }

    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: isSmall ? '4px 10px' : isLarge ? '10px 18px' : '7px 14px',
      fontSize: isSmall ? '11px' : isLarge ? '14px' : '12px',
      fontWeight: 700,
      borderRadius: '999px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: baseBorder,
      background: baseBg,
      color: baseColor,
      backdropFilter: 'blur(8px)',
      boxShadow: isSpeaking ? '0 0 14px rgba(239, 68, 68, 0.6)' : '0 2px 8px rgba(0,0,0,0.15)',
      userSelect: 'none',
      whiteSpace: 'nowrap',
    };
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }} className={className}>
      <button
        type="button"
        onClick={handleToggleSpeak}
        style={getButtonStyles()}
        title={isSpeaking ? 'Stop Audio' : `Read aloud in ${langInfo.name}`}
      >
        <span>{isSpeaking ? '⏹️' : '🔊'}</span>
        <span>
          {isSpeaking
            ? lang === 'ta'
              ? 'நிறுத்து'
              : 'Stop'
            : langInfo.nativeName}
        </span>
        {isSpeaking && (
          <span style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            <span style={{ width: '3px', height: '10px', background: '#fff', borderRadius: '1px', animation: 'pulse 0.8s infinite alternate' }} />
            <span style={{ width: '3px', height: '14px', background: '#fff', borderRadius: '1px', animation: 'pulse 0.6s infinite alternate 0.2s' }} />
            <span style={{ width: '3px', height: '8px', background: '#fff', borderRadius: '1px', animation: 'pulse 0.7s infinite alternate 0.4s' }} />
          </span>
        )}
      </button>

      {/* Voice Missing Notice (Never fake audio or speak English unexpectedly) */}
      {voiceMissing && (
        <span style={{
          fontSize: '10px',
          color: '#fbbf24',
          background: 'rgba(0, 0, 0, 0.8)',
          border: '1px solid #f59e0b',
          borderRadius: '4px',
          padding: '2px 6px',
          marginTop: '4px',
          display: 'inline-block',
          animation: 'fadeIn 0.2s ease'
        }}>
          ⚠️ Voice for {langInfo.name} is not installed on this device.
        </span>
      )}
    </div>
  );
}
