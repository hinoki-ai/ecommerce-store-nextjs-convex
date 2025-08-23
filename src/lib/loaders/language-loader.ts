/**
 * Dynamic Language Loader
 * Handles on-demand loading of language chunks for optimal performance
 */

import { LanguageProviderFactory } from '../providers/language-provider';

export interface LanguageLoadOptions {
  priority?: 'critical' | 'high' | 'normal' | 'low';
  preload?: boolean;
  fallback?: string;
}

export interface LanguageLoadResult {
  provider: import('../providers/language-provider').LanguageProvider | null;
  loaded: boolean;
  fromCache: boolean;
  loadTime: number;
}

export interface LanguagePreloadConfig {
  languages: string[];
  options?: LanguageLoadOptions;
}

/**
 * Dynamic Language Loader with performance optimization
 */
export class LanguageLoader {
  private static instance: LanguageLoader;
  private providerFactory = LanguageProviderFactory.getInstance();
  private loadQueue = new Map<string, Promise<LanguageLoadResult>>();
  private preloadedLanguages = new Set<string>();
  private loadingPerformance = new Map<string, number[]>();

  static getInstance(): LanguageLoader {
    if (!LanguageLoader.instance) {
      LanguageLoader.instance = new LanguageLoader();
    }
    return LanguageLoader.instance;
  }

  /**
   * Load a language chunk dynamically
   */
  async loadLanguage(
    languageCode: string,
    options: LanguageLoadOptions = {}
  ): Promise<LanguageLoadResult> {
    const startTime = performance.now();
    const queueKey = `${languageCode}:${options.priority || 'normal'}`;

    // Check if already loading
    if (this.loadQueue.has(queueKey)) {
      return this.loadQueue.get(queueKey)!;
    }

    // Check if already cached
    const cachedProvider = this.providerFactory.getCachedProvider(languageCode);
    if (cachedProvider) {
      return {
        provider: cachedProvider,
        loaded: true,
        fromCache: true,
        loadTime: 0
      };
    }

    // Start loading
    const loadPromise = this.performLanguageLoad(languageCode, options, startTime);
    this.loadQueue.set(queueKey, loadPromise);

    try {
      const result = await loadPromise;
      this.trackPerformance(languageCode, result.loadTime);
      return result;
    } finally {
      this.loadQueue.delete(queueKey);
    }
  }

  /**
   * Preload multiple language chunks
   */
  async preloadLanguages(config: LanguagePreloadConfig): Promise<void> {
    const { languages, options = { priority: 'low', preload: true } } = config;

    const loadPromises = languages.map(language =>
      this.loadLanguage(language, options)
    );

    await Promise.all(loadPromises);

    // Mark as preloaded
    languages.forEach(lang => this.preloadedLanguages.add(lang));
  }

  /**
   * Load language with intersection observer for viewport-based loading
   */
  loadOnViewportIntersection(
    languageCode: string,
    element: Element,
    options: LanguageLoadOptions = {}
  ): () => void {
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without IntersectionObserver
      this.loadLanguage(languageCode, options);
      return () => {};
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadLanguage(languageCode, { ...options, priority: 'normal' });
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before element enters viewport
        threshold: 0.1
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }

  /**
   * Load language with idle callback for non-blocking loading
   */
  loadOnIdle(
    languageCode: string,
    options: LanguageLoadOptions = {}
  ): Promise<LanguageLoadResult> {
    return new Promise((resolve) => {
      if ('requestIdleCallback' in window) {
        (window as Window & { requestIdleCallback: (callback: () => void, options: { timeout: number }) => void }).requestIdleCallback(() => {
          this.loadLanguage(languageCode, { ...options, priority: 'low' })
            .then(resolve);
        }, { timeout: 5000 }); // Fallback timeout
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          this.loadLanguage(languageCode, { ...options, priority: 'low' })
            .then(resolve);
        }, 100);
      }
    });
  }

  /**
   * Get loading performance statistics
   */
  getPerformanceStats() {
    const stats: Record<string, {
      averageLoadTime: number;
      minLoadTime: number;
      maxLoadTime: number;
      loadCount: number;
    }> = {};

    for (const [language, times] of this.loadingPerformance) {
      const sorted = [...times].sort((a, b) => a - b);
      stats[language] = {
        averageLoadTime: times.reduce((a, b) => a + b, 0) / times.length,
        minLoadTime: sorted[0],
        maxLoadTime: sorted[sorted.length - 1],
        loadCount: times.length
      };
    }

    return stats;
  }

  /**
   * Check if language is preloaded
   */
  isPreloaded(languageCode: string): boolean {
    return this.preloadedLanguages.has(languageCode);
  }

  /**
   * Get currently loading languages
   */
  getLoadingLanguages(): string[] {
    return Array.from(this.loadQueue.keys()).map(key => key.split(':')[0]);
  }

  /**
   * Cancel loading of a specific language
   */
  cancelLoad(languageCode: string): void {
    const keysToDelete: string[] = [];
    for (const key of this.loadQueue.keys()) {
      if (key.startsWith(`${languageCode}:`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.loadQueue.delete(key));
  }

  /**
   * Perform the actual language loading
   */
  private async performLanguageLoad(
    languageCode: string,
    options: LanguageLoadOptions,
    startTime: number
  ): Promise<LanguageLoadResult> {
    try {
      const provider = await this.providerFactory.getProvider(languageCode);
      const loadTime = performance.now() - startTime;

      return {
        provider,
        loaded: true,
        fromCache: false,
        loadTime
      };
    } catch (error) {
      console.error(`Failed to load language: ${languageCode}`, error);

      // Try fallback if specified
      if (options.fallback) {
        try {
          const fallbackProvider = await this.providerFactory.getProvider(options.fallback);
          const loadTime = performance.now() - startTime;

          return {
            provider: fallbackProvider,
            loaded: true,
            fromCache: false,
            loadTime
          };
        } catch (fallbackError) {
          console.error(`Fallback language failed: ${options.fallback}`, fallbackError);
        }
      }

      // Return error result
      const loadTime = performance.now() - startTime;
      return {
        provider: null,
        loaded: false,
        fromCache: false,
        loadTime
      };
    }
  }

  /**
   * Track performance metrics
   */
  private trackPerformance(languageCode: string, loadTime: number): void {
    let times = this.loadingPerformance.get(languageCode);
    if (!times) {
      times = [];
      this.loadingPerformance.set(languageCode, times);
    }
    times.push(loadTime);

    // Keep only last 10 measurements to avoid memory leaks
    if (times.length > 10) {
      times.shift();
    }
  }
}

/**
 * React hook for dynamic language loading
 */
export const useLanguageLoader = () => {
  const loader = LanguageLoader.getInstance();

  return {
    loadLanguage: (language: string, options?: LanguageLoadOptions) =>
      loader.loadLanguage(language, options),

    preloadLanguages: (config: LanguagePreloadConfig) =>
      loader.preloadLanguages(config),

    loadOnViewport: (language: string, element: Element, options?: LanguageLoadOptions) =>
      loader.loadOnViewportIntersection(language, element, options),

    loadOnIdle: (language: string, options?: LanguageLoadOptions) =>
      loader.loadOnIdle(language, options),

    getPerformanceStats: () => loader.getPerformanceStats(),

    isPreloaded: (language: string) => loader.isPreloaded(language),

    getLoadingLanguages: () => loader.getLoadingLanguages(),

    cancelLoad: (language: string) => loader.cancelLoad(language)
  };
};