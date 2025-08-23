/**
 * Lazy Language Loading Hook
 * React hook for lazy loading language providers with intelligent caching
 */

"use client"

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  lazyLoadLanguageProvider,
  LazyLoadingState,
  preloadLanguage,
  getLanguageCacheStats,
  LanguagePredictor,
  LanguagePerformanceMonitor,
  useLazyLanguage as useLazyLanguageLoader
} from '@/lib/lazy-language-loader';
import { supportedLanguageChunks } from '@/lib/i18n-chunked';

interface UseLazyLanguageOptions {
  autoPreload?: boolean;
  preloadRelated?: boolean;
  timeout?: number;
  retries?: number;
}

interface UseLazyLanguageReturn {
  provider: any;
  loading: boolean;
  error: Error | null;
  load: () => Promise<void>;
  preload: (languageCode: string) => void;
  state: LazyLoadingState;
  cacheStats: Record<string, any>;
  performanceMetrics: Record<string, any>;
}

/**
 * Enhanced lazy language loading hook with performance optimization
 */
export function useLazyLanguage(
  languageCode: string,
  options: UseLazyLanguageOptions = {}
): UseLazyLanguageReturn {
  const {
    autoPreload = true,
    preloadRelated = true,
    timeout = 10000,
    retries = 3
  } = options;

  const [state, setState] = useState<LazyLoadingState>(LazyLoadingState.IDLE);
  const [provider, setProvider] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [cacheStats, setCacheStats] = useState<Record<string, any>>({});
  const [performanceMetrics, setPerformanceMetrics] = useState<Record<string, any>>({});

  const predictor = LanguagePredictor.getInstance();
  const performanceMonitor = LanguagePerformanceMonitor.getInstance();

  // Load language provider
  const load = useCallback(async () => {
    if (state === LazyLoadingState.LOADING) return;

    setState(LazyLoadingState.LOADING);
    setError(null);

    try {
      const startTime = performance.now();
      const loadedProvider = await lazyLoadLanguageProvider(languageCode, {
        priority: 'high',
        timeout,
        retries
      });
      const loadTime = performance.now() - startTime;

      // Record usage for prediction
      predictor.recordLanguageUsage(languageCode);
      performanceMonitor.recordLoadTime(languageCode, loadTime);

      setProvider(loadedProvider);
      setState(LazyLoadingState.SUCCESS);

      // Update stats
      setCacheStats(getLanguageCacheStats());
      setPerformanceMetrics(performanceMonitor.getMetrics());

    } catch (err) {
      setError(err as Error);
      setState(LazyLoadingState.ERROR);
    }
  }, [languageCode, state, timeout, retries, predictor, performanceMonitor]);

  // Preload related languages
  const preloadRelatedLanguages = useCallback(() => {
    if (!preloadRelated) return;

    const predictedLanguages = predictor.getPredictedLanguages(3);
    const relatedLanguages = supportedLanguageChunks
      .filter(lang => predictedLanguages.includes(lang.code) && lang.code !== languageCode)
      .map(lang => lang.code);

    relatedLanguages.forEach(lang => {
      preloadLanguage(lang);
    });
  }, [languageCode, preloadRelated, predictor]);

  // Preload specific language
  const preload = useCallback((langCode: string) => {
    preloadLanguage(langCode);
  }, []);

  // Auto-load and preload on mount
  useEffect(() => {
    if (languageCode && state === LazyLoadingState.IDLE) {
      load();
    }
  }, [languageCode, load, state]);

  // Auto-preload related languages after successful load
  useEffect(() => {
    if (state === LazyLoadingState.SUCCESS && autoPreload) {
      preloadRelatedLanguages();
    }
  }, [state, autoPreload, preloadRelatedLanguages]);

  // Update cache stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCacheStats(getLanguageCacheStats());
      setPerformanceMetrics(performanceMonitor.getMetrics());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [performanceMonitor]);

  return {
    provider,
    loading: state === LazyLoadingState.LOADING,
    error,
    load,
    preload,
    state,
    cacheStats,
    performanceMetrics
  };
}

/**
 * Hook for language prediction based on user behavior
 */
export function useLanguagePrediction() {
  const predictor = LanguagePredictor.getInstance();

  const recordUsage = useCallback((languageCode: string) => {
    predictor.recordLanguageUsage(languageCode);
  }, [predictor]);

  const getPredictions = useCallback((limit = 3) => {
    return predictor.getPredictedLanguages(limit);
  }, [predictor]);

  const getPredictionScore = useCallback((languageCode: string) => {
    return predictor.getPredictionScore(languageCode);
  }, [predictor]);

  return {
    recordUsage,
    getPredictions,
    getPredictionScore
  };
}

/**
 * Hook for monitoring language loading performance
 */
export function useLanguagePerformance() {
  const monitor = LanguagePerformanceMonitor.getInstance();

  const getMetrics = useCallback((languageCode?: string) => {
    return monitor.getMetrics(languageCode);
  }, [monitor]);

  const getSlowestLanguages = useCallback(() => {
    return monitor.getSlowestLanguages();
  }, [monitor]);

  return {
    getMetrics,
    getSlowestLanguages
  };
}

/**
 * Hook for intelligent language preloading based on user context
 */
export function useSmartLanguagePreloading(userContext: {
  currentLanguage: string;
  userLocation?: string;
  userPreferences?: string[];
  browserLanguage?: string;
}) {
  const { preload } = useLazyLanguage(userContext.currentLanguage, { autoPreload: false });

  const smartPreload = useCallback(() => {
    const languagesToPreload = new Set<string>();

    // Add current language (already loaded, but for cache warming)
    languagesToPreload.add(userContext.currentLanguage);

    // Add user's preferred languages
    userContext.userPreferences?.forEach(lang => {
      languagesToPreload.add(lang);
    });

    // Add browser language if different
    if (userContext.browserLanguage && userContext.browserLanguage !== userContext.currentLanguage) {
      languagesToPreload.add(userContext.browserLanguage);
    }

    // Add default language
    languagesToPreload.add('es');

    // Add English as fallback
    languagesToPreload.add('en');

    // Preload all unique languages
    Array.from(languagesToPreload).forEach(lang => {
      if (lang !== userContext.currentLanguage) {
        preload(lang);
      }
    });
  }, [userContext, preload]);

  useEffect(() => {
    // Smart preload after a short delay to not block initial page load
    const timer = setTimeout(smartPreload, 1000);
    return () => clearTimeout(timer);
  }, [smartPreload]);

  return { smartPreload };
}

/**
 * Hook for language loading with progress tracking
 */
export function useLanguageWithProgress(languageCode: string) {
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);

  const lazyLanguage = useLazyLanguage(languageCode, {
    autoPreload: false
  });

  const loadWithProgress = useCallback(async () => {
    setProgress(0);

    // Get historical performance data
    const monitor = LanguagePerformanceMonitor.getInstance();
    const metrics = monitor.getMetrics(languageCode);

    if (metrics?.averageTime) {
      setEstimatedTime(metrics.averageTime);
    }

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 15 + 5; // Random increment between 5-20
        const newProgress = Math.min(prev + increment, 90);
        return newProgress;
      });
    }, 200);

    try {
      await lazyLanguage.load();
      setProgress(100);
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
    }
  }, [languageCode, lazyLanguage]);

  return {
    ...lazyLanguage,
    progress,
    estimatedTime,
    loadWithProgress
  };
}