/**
 * Language Hook - React Integration for Chunked Language Provider
 * Example of how to use the chunked i18n system in React components
 */
'use client'

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../lib/i18n-chunked';
import { LanguageLoader } from '../lib/loaders/language-loader';

interface UseLanguageOptions {
  language?: string;
  autoLoad?: boolean;
  fallbackLanguage?: string;
}

interface UseLanguageReturn {
  // Translation functions
  t: (key: string, params?: Record<string, string | number>) => Promise<string>;
  batchT: (keys: string[]) => Promise<Record<string, string>>;

  // Language management
  currentLanguage: string;
  setLanguage: (language: string) => Promise<void>;
  availableLanguages: Array<{ code: string; name: string; flag: string }>;
  supportedLanguages: Array<{ code: string; name: string; flag: string }>;

  // Loading states
  isLoading: boolean;
  isLoaded: boolean;
  loadingProgress: number;

  // Performance
  preloadTranslations: (keys: string[]) => Promise<void>;
  getPerformanceStats: () => Record<string, any>;
}

/**
 * Main language hook for React components
 */
export const useLanguage = (options: UseLanguageOptions = {}): UseLanguageReturn => {
  const {
    language: initialLanguage = 'es',
    autoLoad = true,
    fallbackLanguage = 'en'
  } = options;

  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const { t, batchT, preload, getAvailableLanguages } = useTranslation(currentLanguage);
  const loader = LanguageLoader.getInstance();

  // Load language on mount or language change
  useEffect(() => {
    if (autoLoad) {
      loadLanguage(currentLanguage);
    }
  }, [currentLanguage, autoLoad]);

  const loadLanguage = useCallback(async (languageCode: string) => {
    setIsLoading(true);
    setLoadingProgress(0);

    try {
      setLoadingProgress(25);
      const result = await loader.loadLanguage(languageCode, {
        fallback: fallbackLanguage,
        priority: 'high'
      });

      setLoadingProgress(75);

      if (result.loaded) {
        setCurrentLanguage(languageCode);
        setIsLoaded(true);
        setLoadingProgress(100);
      } else {
        console.warn(`Failed to load language: ${languageCode}`);
        // Try fallback language
        if (fallbackLanguage && fallbackLanguage !== languageCode) {
          await loadLanguage(fallbackLanguage);
        }
      }
    } catch (error) {
      console.error(`Error loading language ${languageCode}:`, error);
      setLoadingProgress(0);
    } finally {
      setIsLoading(false);
    }
  }, [fallbackLanguage]);

  const setLanguage = useCallback(async (language: string) => {
    if (language === currentLanguage) return;

    await loadLanguage(language);
  }, [currentLanguage, loadLanguage]);

  const preloadTranslations = useCallback(async (keys: string[]) => {
    await preload(keys);
  }, [preload]);

  const getPerformanceStats = useCallback(() => {
    return loader.getPerformanceStats();
  }, []);

  return {
    // Translation functions
    t: async (key: string, params?: Record<string, string | number>) => {
      const response = await t(key, params);
      return response.text;
    },
    batchT: async (keys: string[]) => {
      const response = await batchT(keys);
      const result: Record<string, string> = {};
      keys.forEach(key => {
        result[key] = response.translations[key]?.text || key;
      });
      return result;
    },

    // Language management
    currentLanguage,
    setLanguage,
    availableLanguages: getAvailableLanguages(),
    supportedLanguages: getAvailableLanguages(),

    // Loading states
    isLoading,
    isLoaded,
    loadingProgress,

    // Performance
    preloadTranslations: preloadTranslations as (keys: string[]) => Promise<void>,
    getPerformanceStats
  };
};

/**
 * Hook for viewport-based language loading
 */
export const useViewportLanguageLoader = (language: string, options?: UseLanguageOptions) => {
  const loader = LanguageLoader.getInstance();

  const loadOnViewport = useCallback((element: Element) => {
    return loader.loadOnViewportIntersection(language, element, options);
  }, [language, options]);

  const loadOnIdle = useCallback(() => {
    return loader.loadOnIdle(language, options);
  }, [language, options]);

  return {
    loadOnViewport,
    loadOnIdle,
    isPreloaded: loader.isPreloaded(language),
    getLoadingLanguages: loader.getLoadingLanguages,
    cancelLoad: () => loader.cancelLoad(language)
  };
};

/**
 * Hook for language detection based on browser settings
 */
export const useBrowserLanguage = () => {
  const [browserLanguage, setBrowserLanguage] = useState<string>('es');
  const [detectedLanguages, setDetectedLanguages] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserLangs = navigator.languages || [navigator.language];
      setDetectedLanguages(browserLangs);

      // Find the first supported language
      const supportedCodes = ['es', 'en', 'de', 'fr', 'ar', 'ru'];
      const detected = browserLangs.find(lang =>
        supportedCodes.includes(lang.split('-')[0])
      );

      setBrowserLanguage(detected ? detected.split('-')[0] : 'es');
    }
  }, []);

  return {
    browserLanguage,
    detectedLanguages,
    supportedLanguages: ['es', 'en', 'de', 'fr', 'ar', 'ru']
  };
};