// ============================================================
// 🌾 NammaVivasayam AI — Central Multilingual Voice Service
// Uses Web Speech API (window.speechSynthesis) dynamically
// ============================================================

import type { SupportedLanguage } from '../i18n';

export const LANGUAGE_LOCALE_MAP: Record<SupportedLanguage, string> = {
  en: 'en-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  ml: 'ml-IN',
  kn: 'kn-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  or: 'or-IN',
  pa: 'pa-IN',
};

// Fallback prefixes if strict IN subtag not found (e.g. 'ta', 'te', 'ml')
const LANG_PREFIX_MAP: Record<SupportedLanguage, string[]> = {
  en: ['en-IN', 'en-GB', 'en-US', 'en'],
  ta: ['ta-IN', 'ta-LK', 'ta-SG', 'ta'],
  te: ['te-IN', 'te'],
  ml: ['ml-IN', 'ml'],
  kn: ['kn-IN', 'kn'],
  hi: ['hi-IN', 'hi'],
  bn: ['bn-IN', 'bn-BD', 'bn'],
  mr: ['mr-IN', 'mr'],
  gu: ['gu-IN', 'gu'],
  or: ['or-IN', 'or', 'ory-IN', 'ory'],
  pa: ['pa-IN', 'pa-PK', 'pa'],
};

export interface VoiceSpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onVoiceMissing?: () => void;
  rate?: number;
  pitch?: number;
}

class VoiceService {
  private isSpeaking = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voicesLoaded = false;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }
    }
  }

  private initVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.cachedVoices = window.speechSynthesis.getVoices();
    if (this.cachedVoices.length > 0) {
      this.voicesLoaded = true;
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.voicesLoaded) {
      this.initVoices();
    }
    return this.cachedVoices;
  }

  public findBestVoice(lang: SupportedLanguage): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    if (!voices || voices.length === 0) return null;

    const prefixes = LANG_PREFIX_MAP[lang] || [LANGUAGE_LOCALE_MAP[lang]];

    // 1. Exact match
    for (const prefix of prefixes) {
      const match = voices.find(v => v.lang.toLowerCase() === prefix.toLowerCase());
      if (match) return match;
    }

    // 2. Starts with language code (e.g. 'ta', 'te', 'ml')
    for (const prefix of prefixes) {
      const base = prefix.split('-')[0].toLowerCase();
      const match = voices.find(v => v.lang.toLowerCase().startsWith(base));
      if (match) return match;
    }

    // 3. Name contains language string (e.g. 'Tamil', 'Telugu')
    const langNames: Record<SupportedLanguage, string> = {
      en: 'english',
      ta: 'tamil',
      te: 'telugu',
      ml: 'malayalam',
      kn: 'kannada',
      hi: 'hindi',
      bn: 'bengali',
      mr: 'marathi',
      gu: 'gujarati',
      or: 'odia',
      pa: 'punjabi',
    };
    const targetName = langNames[lang];
    if (targetName) {
      const match = voices.find(v => v.name.toLowerCase().includes(targetName));
      if (match) return match;
    }

    return null;
  }

  public hasVoiceForLanguage(lang: SupportedLanguage): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return this.findBestVoice(lang) !== null;
  }

  public speak(
    text: string,
    lang: SupportedLanguage,
    options?: VoiceSpeakOptions
  ): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      options?.onError?.('SpeechSynthesis is not supported on this browser/device.');
      return false;
    }

    if (!text || !text.trim()) {
      options?.onError?.('No text provided to speak.');
      return false;
    }

    // Stop any existing playback to prevent overlapping
    this.stop();

    const voice = this.findBestVoice(lang);
    const localeCode = LANGUAGE_LOCALE_MAP[lang] || 'en-IN';

    // If no compatible voice exists on this machine, do NOT silently utter in English!
    if (!voice && lang !== 'en') {
      // In Chromium/WebSpeech, an utterance can be constructed with lang tag, but if voice is missing,
      // browsers might fall back to default English voice. To avoid speaking English when user chose Tamil/etc:
      const voices = this.getAvailableVoices();
      const hasAnyLangVoice = voices.some(v => v.lang.toLowerCase().startsWith(lang.toLowerCase()));

      if (!hasAnyLangVoice && voices.length > 0) {
        // Genuinely no native voice installed on this computer
        options?.onVoiceMissing?.();
        return false;
      }
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = localeCode;
      if (voice) {
        utterance.voice = voice;
      }
      utterance.pitch = options?.pitch ?? 1.05;
      utterance.rate = options?.rate ?? 0.95;

      utterance.onstart = () => {
        this.isSpeaking = true;
        options?.onStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        options?.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        options?.onError?.(e.error || 'Speech error occurred');
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err: any) {
      this.isSpeaking = false;
      options?.onError?.(err?.message || 'Failed to start speech synthesis.');
      return false;
    }
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  public pause(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }
}

export const voiceService = new VoiceService();
export default voiceService;
