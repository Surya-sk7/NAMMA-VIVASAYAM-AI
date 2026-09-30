// ============================================================
// 🌾 NammaVivasayam AI — Multilingual System (REACTIVE)
// Supports 10 Indian languages
// ============================================================

export type SupportedLanguage = 'ta' | 'en' | 'hi' | 'kn' | 'te' | 'ml' | 'bn' | 'mr' | 'gu' | 'or' | 'pa';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  fontFamily: string;
}

export const LANGUAGES: Record<SupportedLanguage, LanguageInfo> = {
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', direction: 'ltr', fontFamily: "'Noto Sans Tamil', sans-serif" },
  en: { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', fontFamily: "'Inter', sans-serif" },
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr', fontFamily: "'Noto Sans Telugu', sans-serif" },
  ml: { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', direction: 'ltr', fontFamily: "'Noto Sans Malayalam', sans-serif" },
  kn: { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', direction: 'ltr', fontFamily: "'Noto Sans Kannada', sans-serif" },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', fontFamily: "'Noto Sans Devanagari', sans-serif" },
  bn: { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr', fontFamily: "'Noto Sans Bengali', sans-serif" },
  mr: { code: 'mr', name: 'Marathi', nativeName: 'मराठी', direction: 'ltr', fontFamily: "'Noto Sans Devanagari', sans-serif" },
  gu: { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', direction: 'ltr', fontFamily: "'Noto Sans Gujarati', sans-serif" },
  or: { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', direction: 'ltr', fontFamily: "'Noto Sans Oriya', sans-serif" },
  pa: { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', direction: 'ltr', fontFamily: "'Noto Sans Gurmukhi', sans-serif" },
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'ta';

// Deep translation key access
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  if (Array.isArray(current)) return current as unknown as string;
  return typeof current === 'string' ? current : path;
}

// Translation store
const translations: Record<string, Record<string, unknown>> = {};

let currentLanguage: SupportedLanguage = DEFAULT_LANGUAGE;

// Listener pattern so React can re-render on language change
type LanguageListener = (lang: SupportedLanguage) => void;
const listeners: Set<LanguageListener> = new Set();

export function onLanguageChange(fn: LanguageListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setLanguage(lang: SupportedLanguage): void {
  if (currentLanguage === lang) return;
  currentLanguage = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = LANGUAGES[lang]?.direction || 'ltr';
  localStorage.setItem('preferredLanguage', lang);
  localStorage.setItem('nv_language', lang);
  listeners.forEach(fn => fn(lang));
}

export function getLanguage(): SupportedLanguage {
  return currentLanguage;
}

export function initLanguage(): SupportedLanguage {
  const saved = (localStorage.getItem('preferredLanguage') || localStorage.getItem('nv_language')) as SupportedLanguage | null;
  if (saved && saved in LANGUAGES) {
    currentLanguage = saved;
    document.documentElement.lang = saved;
    return saved;
  }
  currentLanguage = DEFAULT_LANGUAGE;
  return DEFAULT_LANGUAGE;
}

export function loadTranslations(lang: string, data: Record<string, unknown>): void {
  translations[lang] = data;
}

export function t(key: string, params?: Record<string, string | number>): string {
  // Try current language
  let value = getNestedValue(translations[currentLanguage] || {}, key);

  // Fallback to English
  if (value === key && currentLanguage !== 'en') {
    value = getNestedValue(translations['en'] || {}, key);
  }

  // Fallback to Tamil
  if (value === key && currentLanguage !== 'ta') {
    value = getNestedValue(translations['ta'] || {}, key);
  }

  // Replace parameters
  if (params && typeof value === 'string') {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      value = value.replace(`{${paramKey}}`, String(paramValue));
    });
  }

  return typeof value === 'string' ? value : key;
}

export function getLanguageOptions(): LanguageInfo[] {
  return Object.values(LANGUAGES);
}
