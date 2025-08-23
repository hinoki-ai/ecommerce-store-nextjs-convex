/**
 * Lazy Language Loader
 * Implements intelligent lazy loading for language chunks with caching and preloading
 */

import React from 'react';
import { LanguageChunk, supportedLanguageChunks } from './i18n-chunked';

// Cache for loaded language chunks
interface CacheEntry {
  provider: any;
  loadTime: number;
  accessCount: number;
  lastAccessed: number;
}

class LazyLanguageCache {
  private cache = new Map<string, CacheEntry>();
  private maxCacheSize = 5; // Maximum number of cached language providers
  private cacheExpiryTime = 30 * 60 * 1000; // 30 minutes

  get(languageCode: string): any | null {
    const entry = this.cache.get(languageCode);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.loadTime > this.cacheExpiryTime) {
      this.cache.delete(languageCode);
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    return entry.provider;
  }

  set(languageCode: string, provider: any): void {
    // If cache is full, remove least recently used item
    if (this.cache.size >= this.maxCacheSize) {
      let oldestKey = '';
      let oldestTime = Date.now();

      for (const [key, entry] of this.cache.entries()) {
        if (entry.lastAccessed < oldestTime) {
          oldestTime = entry.lastAccessed;
          oldestKey = key;
        }
      }

      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(languageCode, {
      provider,
      loadTime: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): Record<string, any> {
    const stats: Record<string, any> = {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      languages: {}
    };

    for (const [lang, entry] of this.cache.entries()) {
      stats.languages[lang] = {
        accessCount: entry.accessCount,
        age: Date.now() - entry.loadTime,
        lastAccessed: Date.now() - entry.lastAccessed
      };
    }

    return stats;
  }
}

// Global cache instance
const languageCache = new LazyLanguageCache();

// Loading states for lazy loading
export enum LazyLoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

// Lazy loading promise cache to prevent duplicate requests
const loadingPromises = new Map<string, Promise<any>>();

/**
 * Lazy load a language provider
 */
export async function lazyLoadLanguageProvider(
  languageCode: string,
  options: {
    priority?: 'critical' | 'high' | 'normal';
    timeout?: number;
    retries?: number;
  } = {}
): Promise<any> {
  const { priority = 'normal', timeout = 10000, retries = 3 } = options;

  // Check cache first
  const cachedProvider = languageCache.get(languageCode);
  if (cachedProvider) {
    return cachedProvider;
  }

  // Check if already loading
  const existingPromise = loadingPromises.get(languageCode);
  if (existingPromise) {
    return existingPromise;
  }

  // Create loading promise
  const loadingPromise = loadLanguageProviderWithRetry(languageCode, timeout, retries);
  loadingPromises.set(languageCode, loadingPromise);

  try {
    const provider = await loadingPromise;
    languageCache.set(languageCode, provider);
    return provider;
  } finally {
    loadingPromises.delete(languageCode);
  }
}

/**
 * Load language provider with retry logic and timeout
 */
async function loadLanguageProviderWithRetry(
  languageCode: string,
  timeout: number,
  retries: number
): Promise<any> {
  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const provider = await Promise.race([
        loadLanguageProvider(languageCode),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeout)
        )
      ]);

      return provider;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Language loading attempt ${attempt + 1} failed for ${languageCode}:`, error);

      if (attempt < retries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  throw new Error(`Failed to load language provider for ${languageCode} after ${retries + 1} attempts: ${lastError?.message}`);
}

/**
 * Load language provider based on language code
 */
async function loadLanguageProvider(languageCode: string): Promise<any> {
  const languageConfig = supportedLanguageChunks.find(lang => lang.code === languageCode);

  if (!languageConfig) {
    throw new Error(`Unsupported language: ${languageCode}`);
  }

  // Dynamic import based on language code
  try {
    switch (languageCode) {
      case 'en':
        const { default: englishProvider } = await import('./chunks/en.chunk');
        return englishProvider;
      case 'es':
        const { default: spanishProvider } = await import('./chunks/es.chunk');
        return spanishProvider;
      case 'de':
        const { default: germanProvider } = await import('./chunks/de.chunk');
        return germanProvider;
      case 'fr':
        const { default: frenchProvider } = await import('./chunks/fr.chunk');
        return frenchProvider;
      case 'ar':
        const { default: arabicProvider } = await import('./chunks/ar.chunk');
        return arabicProvider;
      case 'ru':
        const { default: russianProvider } = await import('./chunks/ru.chunk');
        return russianProvider;
      default:
        throw new Error(`No chunk file found for language: ${languageCode}`);
    }
  } catch (error) {
    console.error(`Error loading language chunk for ${languageCode}:`, error);
    throw new Error(`Failed to load language chunk for ${languageCode}`);
  }
}

/**
 * Preload critical language providers
 */
export async function preloadCriticalLanguages(): Promise<void> {
  const criticalLanguages = supportedLanguageChunks
    .filter(lang => lang.loadPriority <= 1)
    .map(lang => lang.code);

  console.log('Preloading critical languages:', criticalLanguages);

  const promises = criticalLanguages.map(lang =>
    lazyLoadLanguageProvider(lang, { priority: 'critical', timeout: 15000 })
  );

  await Promise.allSettled(promises);
}

/**
 * Preload language provider in background
 */
export function preloadLanguage(languageCode: string): void {
  // Don't await - just start the loading process
  lazyLoadLanguageProvider(languageCode, { priority: 'high' })
    .catch(error => console.warn(`Background preload failed for ${languageCode}:`, error));
}

/**
 * Warm up cache with predicted languages
 */
export function warmUpLanguageCache(userPreferences: {
  browserLanguage?: string;
  savedLanguage?: string;
  location?: string;
}): void {
  const languagesToWarmUp = new Set<string>();

  // Add user's saved language
  if (userPreferences.savedLanguage) {
    languagesToWarmUp.add(userPreferences.savedLanguage);
  }

  // Add browser language
  if (userPreferences.browserLanguage) {
    languagesToWarmUp.add(userPreferences.browserLanguage);
  }

  // Add default language
  languagesToWarmUp.add('es');

  // Add English as fallback
  languagesToWarmUp.add('en');

  // Start preloading in background
  languagesToWarmUp.forEach(lang => {
    if (lang !== userPreferences.savedLanguage) {
      preloadLanguage(lang);
    }
  });
}

/**
 * Get cache statistics
 */
export function getLanguageCacheStats(): Record<string, any> {
  return {
    ...languageCache.getStats(),
    loadingPromises: Array.from(loadingPromises.keys())
  };
}

/**
 * Clear language cache
 */
export function clearLanguageCache(): void {
  languageCache.clear();
  loadingPromises.clear();
}

/**
 * Smart language prediction based on user behavior
 */
export class LanguagePredictor {
  private static instance: LanguagePredictor;
  private predictions = new Map<string, number>();

  static getInstance(): LanguagePredictor {
    if (!LanguagePredictor.instance) {
      LanguagePredictor.instance = new LanguagePredictor();
    }
    return LanguagePredictor.instance;
  }

  recordLanguageUsage(languageCode: string): void {
    const current = this.predictions.get(languageCode) || 0;
    this.predictions.set(languageCode, current + 1);
  }

  getPredictedLanguages(limit = 3): string[] {
    return Array.from(this.predictions.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([lang]) => lang);
  }

  getPredictionScore(languageCode: string): number {
    return this.predictions.get(languageCode) || 0;
  }
}

/**
 * Performance monitoring for language loading
 */
export class LanguagePerformanceMonitor {
  private static instance: LanguagePerformanceMonitor;
  private metrics = new Map<string, any>();

  static getInstance(): LanguagePerformanceMonitor {
    if (!LanguagePerformanceMonitor.instance) {
      LanguagePerformanceMonitor.instance = new LanguagePerformanceMonitor();
    }
    return LanguagePerformanceMonitor.instance;
  }

  recordLoadTime(languageCode: string, loadTime: number): void {
    const existing = this.metrics.get(languageCode) || { loads: 0, totalTime: 0, averageTime: 0 };
    existing.loads++;
    existing.totalTime += loadTime;
    existing.averageTime = existing.totalTime / existing.loads;
    this.metrics.set(languageCode, existing);
  }

  getMetrics(languageCode?: string): any {
    if (languageCode) {
      return this.metrics.get(languageCode);
    }
    return Object.fromEntries(this.metrics.entries());
  }

  getSlowestLanguages(): string[] {
    return Array.from(this.metrics.entries())
      .sort(([, a], [, b]) => b.averageTime - a.averageTime)
      .map(([lang]) => lang);
  }
}

/**
 * Hook for lazy loading with React integration
 */
export function useLazyLanguage(languageCode: string) {
  const [state, setState] = React.useState<LazyLoadingState>(LazyLoadingState.IDLE);
  const [provider, setProvider] = React.useState<any>(null);
  const [error, setError] = React.useState<Error | null>(null);

  const load = React.useCallback(async () => {
    if (state === LazyLoadingState.LOADING) return;

    setState(LazyLoadingState.LOADING);
    setError(null);

    try {
      const startTime = performance.now();
      const loadedProvider = await lazyLoadLanguageProvider(languageCode);
      const loadTime = performance.now() - startTime;

      // Record performance metrics
      LanguagePerformanceMonitor.getInstance().recordLoadTime(languageCode, loadTime);

      setProvider(loadedProvider);
      setState(LazyLoadingState.SUCCESS);
    } catch (err) {
      setError(err as Error);
      setState(LazyLoadingState.ERROR);
    }
  }, [languageCode, state]);

  React.useEffect(() => {
    // Auto-load if language changes and not already loaded
    if (languageCode && state === LazyLoadingState.IDLE) {
      load();
    }
  }, [languageCode, load, state]);

  return {
    provider,
    loading: state === LazyLoadingState.LOADING,
    error,
    load,
    state
  };
}