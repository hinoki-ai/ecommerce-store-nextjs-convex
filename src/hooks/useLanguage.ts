/**
 * Language Hook - React Integration for Chunked Language Provider
 * Example of how to use the divine parsing oracle system in React components
 */
'use client'

import { useState, useEffect, useCallback } from 'react';
import { TranslationService } from '../lib/services/translation-service';
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

  const translationService = TranslationService.getInstance();
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
    await translationService.preloadTranslations(currentLanguage, keys);
  }, [translationService, currentLanguage]);

  const getPerformanceStats = useCallback(() => {
    return loader.getPerformanceStats();
  }, []);

  return {
    // Translation functions
    t: async (key: string, params?: Record<string, string | number>) => {
      const response = await translationService.translate({ key, language: currentLanguage, params });
      return response.text;
    },
    batchT: async (keys: string[]) => {
      const response = await translationService.batchTranslate({ keys, language: currentLanguage });
      const result: Record<string, string> = {};
      keys.forEach(key => {
        result[key] = response.translations[key]?.text || key;
      });
      return result;
    },

    // Language management
    currentLanguage,
    setLanguage,
    availableLanguages: translationService.getAvailableLanguages(),
    supportedLanguages: translationService.getAvailableLanguages(),

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
 * Enhanced hook for language detection based on browser settings
 * Includes region-specific logic for better Spanish detection
 */
export const useBrowserLanguage = () => {
  const [browserLanguage, setBrowserLanguage] = useState<string>('es');
  const [detectedLanguages, setDetectedLanguages] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<number>(0);
  const [regionInfo, setRegionInfo] = useState<{region?: string, isSpanishSpeaking: boolean}>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserLangs = navigator.languages || [navigator.language];
      setDetectedLanguages(browserLangs);

      // Enhanced Spanish-speaking region detection
      const spanishRegions = ['ES', 'MX', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY'];

      let bestMatch = 'es'; // Default to Spanish
      let highestConfidence = 0;
      let region = '';

      // Analyze each language preference
      for (const lang of browserLangs) {
        const [primaryCode, regionCode] = lang.split('-');
        const quality = 1 - (browserLangs.indexOf(lang) * 0.1); // Decreasing quality by position

        if (primaryCode === 'es') {
          let spanishConfidence = quality;

          // Boost confidence for Spanish-speaking regions
          if (regionCode && spanishRegions.includes(regionCode.toUpperCase())) {
            spanishConfidence *= 1.5;
            region = regionCode;
          }

          if (spanishConfidence > highestConfidence) {
            highestConfidence = spanishConfidence;
            bestMatch = 'es';
          }
        } else if (primaryCode === 'en' && highestConfidence < quality) {
          // English is a fallback but with lower priority
          highestConfidence = quality * 0.8;
          bestMatch = 'en';
        }
      }

      setBrowserLanguage(bestMatch);
      setConfidence(highestConfidence);
      setRegionInfo({
        region,
        isSpanishSpeaking: spanishRegions.includes(region.toUpperCase())
      });
    }
  }, []);

  return {
    browserLanguage,
    detectedLanguages,
    confidence,
    regionInfo,
    supportedLanguages: ['es', 'en', 'de', 'fr', 'ar', 'ru']
  };
};