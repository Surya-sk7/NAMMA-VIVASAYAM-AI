import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { User, Farm, Crop, FarmerTab } from '../types';
import { initLanguage, setLanguage as setI18nLanguage, loadTranslations, onLanguageChange } from '../i18n';
import type { SupportedLanguage } from '../i18n';
import ta from '../i18n/locales/ta';
import en from '../i18n/locales/en';
import hi from '../i18n/locales/hi';
import kn from '../i18n/locales/kn';
import te from '../i18n/locales/te';
import ml from '../i18n/locales/ml';
import bn from '../i18n/locales/bn';
import mr from '../i18n/locales/mr';
import gu from '../i18n/locales/gu';
import orLocale from '../i18n/locales/or';
import pa from '../i18n/locales/pa';

export type FarmerPlan = 'FREE' | 'PAID' | 'ORGANIZATION';

export type PlanFeature =
  | 'basicIntelligence'
  | 'basicWhy'
  | 'basicWhatIf'
  | 'basicCropDoctor'
  | 'multilingualVoice'
  | 'advancedAnalytics'
  | 'advancedReports'
  | 'satelliteSpectral'
  | 'multiScenarioWhatIf'
  | 'priorityBooking'
  | 'organizationDashboard';

export function checkPlanAccess(plan: FarmerPlan, feature: PlanFeature): boolean {
  // Free tier has all core agricultural intelligence
  if (
    feature === 'basicIntelligence' ||
    feature === 'basicWhy' ||
    feature === 'basicWhatIf' ||
    feature === 'basicCropDoctor' ||
    feature === 'multilingualVoice'
  ) {
    return true;
  }

  // Paid and Organization tiers have advanced features
  if (plan === 'PAID' || plan === 'ORGANIZATION') {
    if (feature !== 'organizationDashboard') return true;
  }

  // Organization tier has everything including org dashboard
  if (plan === 'ORGANIZATION') {
    return true;
  }

  return false;
}

// --- State ---
interface AppState {
  user: User | null;
  farm: Farm | null;
  crop: Crop | null;
  language: SupportedLanguage;
  isDemoMode: boolean;
  isAuthenticated: boolean;
  isOnboarding: boolean;
  activeTab: FarmerTab;
  showWhyEngine: boolean;
  showWhatIf: boolean;
  currentRecommendationId: string | null;
  plan: FarmerPlan;
  platformCommissionPct: number;
}

const savedPlan = (typeof window !== 'undefined' ? localStorage.getItem('nv_plan') : null) as FarmerPlan | null;

const initialState: AppState = {
  user: null,
  farm: null,
  crop: null,
  language: 'ta',
  isDemoMode: true,
  isAuthenticated: false,
  isOnboarding: false,
  activeTab: 'home',
  showWhyEngine: false,
  showWhatIf: false,
  currentRecommendationId: null,
  plan: savedPlan === 'PAID' || savedPlan === 'ORGANIZATION' ? savedPlan : 'FREE',
  platformCommissionPct: 10, // Configurable 10% commission on service transactions
};

// --- Actions ---
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_FARM'; payload: Farm }
  | { type: 'SET_CROP'; payload: Crop }
  | { type: 'SET_LANGUAGE'; payload: SupportedLanguage }
  | { type: 'SET_DEMO_MODE'; payload: boolean }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_ONBOARDING'; payload: boolean }
  | { type: 'SET_ACTIVE_TAB'; payload: FarmerTab }
  | { type: 'SHOW_WHY_ENGINE'; payload: string }
  | { type: 'HIDE_WHY_ENGINE' }
  | { type: 'SHOW_WHAT_IF'; payload: string }
  | { type: 'HIDE_WHAT_IF' }
  | { type: 'SET_PLAN'; payload: FarmerPlan }
  | { type: 'SET_COMMISSION_PCT'; payload: number }
  | { type: 'LOGIN_DEMO' }
  | { type: 'LOGOUT' };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_FARM':
      return { ...state, farm: action.payload };
    case 'SET_CROP':
      return { ...state, crop: action.payload };
    case 'SET_LANGUAGE':
      if (state.language !== action.payload) {
        setI18nLanguage(action.payload);
      }
      return { ...state, language: action.payload };
    case 'SET_DEMO_MODE':
      return { ...state, isDemoMode: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_ONBOARDING':
      return { ...state, isOnboarding: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload, showWhyEngine: false, showWhatIf: false };
    case 'SHOW_WHY_ENGINE':
      return { ...state, showWhyEngine: true, currentRecommendationId: action.payload };
    case 'HIDE_WHY_ENGINE':
      return { ...state, showWhyEngine: false, currentRecommendationId: null };
    case 'SHOW_WHAT_IF':
      return { ...state, showWhatIf: true, currentRecommendationId: action.payload };
    case 'HIDE_WHAT_IF':
      return { ...state, showWhatIf: false, currentRecommendationId: null };
    case 'SET_PLAN':
      localStorage.setItem('nv_plan', action.payload);
      return { ...state, plan: action.payload };
    case 'SET_COMMISSION_PCT':
      return { ...state, platformCommissionPct: action.payload };
    case 'LOGIN_DEMO':
      return { ...state, isAuthenticated: true, isDemoMode: true, isOnboarding: false };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
}

// --- Context ---
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  canAccess: (feature: PlanFeature) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- Provider ---
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize translations on mount
  useEffect(() => {
    // Load ALL 11 languages (10 requested + Punjabi)
    loadTranslations('ta', ta as unknown as Record<string, unknown>);
    loadTranslations('en', en as unknown as Record<string, unknown>);
    loadTranslations('hi', hi as unknown as Record<string, unknown>);
    loadTranslations('kn', kn as unknown as Record<string, unknown>);
    loadTranslations('te', te as unknown as Record<string, unknown>);
    loadTranslations('ml', ml as unknown as Record<string, unknown>);
    loadTranslations('bn', bn as unknown as Record<string, unknown>);
    loadTranslations('mr', mr as unknown as Record<string, unknown>);
    loadTranslations('gu', gu as unknown as Record<string, unknown>);
    loadTranslations('or', orLocale as unknown as Record<string, unknown>);
    loadTranslations('pa', pa as unknown as Record<string, unknown>);

    const savedLang = initLanguage();
    dispatch({ type: 'SET_LANGUAGE', payload: savedLang });
  }, []);

  // Listen for language changes and update state cleanly
  useEffect(() => {
    const unsubscribe = onLanguageChange((newLang) => {
      if (newLang !== state.language) {
        dispatch({ type: 'SET_LANGUAGE', payload: newLang });
      }
    });
    return unsubscribe;
  }, [state.language]);

  const canAccess = (feature: PlanFeature): boolean => {
    return checkPlanAccess(state.plan, feature);
  };

  return (
    <AppContext.Provider value={{ state, dispatch, canAccess }}>
      {children}
    </AppContext.Provider>
  );
}

// --- Hook ---
export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
