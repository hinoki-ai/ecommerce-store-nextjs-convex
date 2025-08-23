/**
 * Translation Service - Chunked Translation Management
 * Handles dynamic translation requests and chunked language loading
 */

import { LanguageProviderFactory } from '../providers/language-provider';

export interface TranslationRequest {
  key: string;
  language: string;
  fallback?: string;
  params?: Record<string, string | number>;
}

export interface TranslationResponse {
  text: string;
  language: string;
  found: boolean;
  fallbackUsed?: boolean;
}

export interface BatchTranslationRequest {
  keys: string[];
  language: string;
  fallbackLanguage?: string;
}

export interface BatchTranslationResponse {
  translations: Record<string, TranslationResponse>;
  language: string;
}

/**
 * Translation Service with chunked loading support
 */
export class TranslationService {
  private static instance: TranslationService;
  private providerFactory = LanguageProviderFactory.getInstance();
  private translationCache = new Map<string, Map<string, string>>();
  private loadingPromises = new Map<string, Promise<void>>();

  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  /**
   * Translate a single key
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    // Check cache first
    const cached = this.getCachedTranslation(request.language, request.key);
    if (cached) {
      return {
        text: this.interpolateParams(cached, request.params),
        language: request.language,
        found: true
      };
    }

    try {
      // Ensure language chunk is loaded
      await this.ensureLanguageLoaded(request.language);

      // Get provider and translate
      const provider = this.providerFactory.getCachedProvider(request.language);
      if (!provider) {
        return this.handleFallbackTranslation(request);
      }

      const translatedText = provider.translate(request.key);
      const finalText = this.interpolateParams(translatedText, request.params);

      // Cache the result
      this.setCachedTranslation(request.language, request.key, translatedText);

      return {
        text: finalText,
        language: request.language,
        found: translatedText !== request.key // Check if translation was found
      };

    } catch (error) {
      console.error(`Translation error for key "${request.key}":`, error);
      return this.handleFallbackTranslation(request);
    }
  }

  /**
   * Translate multiple keys in batch
   */
  async batchTranslate(request: BatchTranslationRequest): Promise<BatchTranslationResponse> {
    const translations: Record<string, TranslationResponse> = {};

    // Ensure language chunk is loaded
    await this.ensureLanguageLoaded(request.language);

    // Process all translations
    const promises = request.keys.map(key =>
      this.translate({
        key,
        language: request.language,
        fallback: request.fallbackLanguage
      }).then(response => {
        translations[key] = response;
      })
    );

    await Promise.all(promises);

    return {
      translations,
      language: request.language
    };
  }

  /**
   * Preload translations for better performance
   */
  async preloadTranslations(language: string, keys: string[]): Promise<void> {
    const preloadKey = `${language}:preload`;

    if (this.loadingPromises.has(preloadKey)) {
      return this.loadingPromises.get(preloadKey);
    }

    const preloadPromise = this.batchTranslate({
      keys,
      language
    }).then(() => {
      // Preload complete
    });

    this.loadingPromises.set(preloadKey, preloadPromise);

    try {
      await preloadPromise;
    } finally {
      this.loadingPromises.delete(preloadKey);
    }
  }

  /**
   * Get available languages
   */
  getAvailableLanguages() {
    return this.providerFactory.getSupportedLanguages();
  }

  /**
   * Ensure language chunk is loaded
   */
  private async ensureLanguageLoaded(language: string): Promise<void> {
    const loadKey = `load:${language}`;

    if (this.loadingPromises.has(loadKey)) {
      return this.loadingPromises.get(loadKey);
    }

    const loadPromise = this.providerFactory.getProvider(language).then(() => {
      // Language loaded
    });

    this.loadingPromises.set(loadKey, loadPromise);

    try {
      await loadPromise;
    } finally {
      this.loadingPromises.delete(loadKey);
    }
  }

  /**
   * Handle fallback translation
   */
  private async handleFallbackTranslation(request: TranslationRequest): Promise<TranslationResponse> {
    // Try fallback language if specified
    if (request.fallback && request.fallback !== request.language) {
      try {
        const fallbackResponse = await this.translate({
          ...request,
          language: request.fallback
        });

        if (fallbackResponse.found) {
          return {
            ...fallbackResponse,
            fallbackUsed: true
          };
        }
      } catch (error) {
        console.warn(`Fallback translation failed for "${request.key}":`, error);
      }
    }

    // Return original key as last resort
    return {
      text: request.params ? this.interpolateParams(request.key, request.params) : request.key,
      language: request.language,
      found: false,
      fallbackUsed: true
    };
  }

  /**
   * Interpolate parameters in translation text
   */
  private interpolateParams(text: string, params?: Record<string, string | number>): string {
    if (!params) return text;

    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }

  /**
   * Get cached translation
   */
  private getCachedTranslation(language: string, key: string): string | undefined {
    const langCache = this.translationCache.get(language);
    return langCache?.get(key);
  }

  /**
   * Set cached translation
   */
  private setCachedTranslation(language: string, key: string, text: string): void {
    let langCache = this.translationCache.get(language);
    if (!langCache) {
      langCache = new Map();
      this.translationCache.set(language, langCache);
    }
    langCache.set(key, text);
  }

  /**
   * Clear translation cache
   */
  clearCache(language?: string): void {
    if (language) {
      this.translationCache.delete(language);
    } else {
      this.translationCache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const stats = {
      languages: 0,
      totalEntries: 0,
      languagesBreakdown: [] as Array<{ language: string; entries: number }>
    };

    for (const [language, cache] of this.translationCache) {
      stats.languages++;
      stats.totalEntries += cache.size;
      stats.languagesBreakdown.push({
        language,
        entries: cache.size
      });
    }

    return stats;
  }
}

/**
 * React hook for using translations
 */
export const useTranslation = (language: string = 'es') => {
  const service = TranslationService.getInstance();

  return {
    t: (key: string, params?: Record<string, string | number>) =>
      service.translate({ key, language, params }),

    batchT: (keys: string[]) =>
      service.batchTranslate({ keys, language }),

    preload: (keys: string[]) =>
      service.preloadTranslations(language, keys),

    getAvailableLanguages: () => service.getAvailableLanguages(),

    clearCache: () => service.clearCache(language)
  };
};