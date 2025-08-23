/**
 * Advanced I18n Utility Hooks
 * Provides comprehensive internationalization utilities for autoloop ultimate completion
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { LanguageProviderFactory } from '@/lib/providers/language-provider';
import { TranslationService } from '@/lib/services/translation-service';

interface UseI18nBatchOptions {
  keys: string[];
  fallback?: string;
  priority?: 'high' | 'normal' | 'low';
}

interface UseI18nFormatOptions {
  locale?: string;
  currency?: string;
  dateFormat?: string;
  timeFormat?: string;
}

interface UseI18nSEOOptions {
  generateMeta?: boolean;
  generateStructuredData?: boolean;
  optimizeForSearch?: boolean;
}

/**
 * Hook for batch translation operations
 */
export const useI18nBatch = () => {
  const { t } = useLanguage();
  const factory = LanguageProviderFactory.getInstance();

  const translateBatch = useCallback(async (options: UseI18nBatchOptions) => {
    const { keys, fallback = '', priority = 'normal' } = options;

    try {
      const results = await Promise.all(
        keys.map(key => {
          try {
            return t(key);
          } catch (error) {
            console.warn(`Translation failed for key: ${key}`, error);
            return fallback;
          }
        })
      );

      return keys.reduce((acc, key, index) => {
        acc[key] = results[index];
        return acc;
      }, {} as Record<string, string>);

    } catch (error) {
      console.error('Batch translation error:', error);
      return keys.reduce((acc, key) => {
        acc[key] = fallback;
        return acc;
      }, {} as Record<string, string>);
    }
  }, [t]);

  const translateBatchSync = useCallback((options: UseI18nBatchOptions) => {
    const { keys, fallback = '' } = options;

    return keys.reduce((acc, key) => {
      try {
        acc[key] = t(key);
      } catch (error) {
        console.warn(`Translation failed for key: ${key}`, error);
        acc[key] = fallback;
      }
      return acc;
    }, {} as Record<string, string>);
  }, [t]);

  return { translateBatch, translateBatchSync };
};

/**
 * Hook for formatted translations (numbers, dates, currencies)
 */
export const useI18nFormat = (options: UseI18nFormatOptions = {}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useLanguage();

  const formatNumber = useCallback((number: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(currentLanguage, options).format(number);
  }, [currentLanguage]);

  const formatCurrency = useCallback((amount: number, currency = 'CLP') => {
    return new Intl.NumberFormat(currentLanguage, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, [currentLanguage]);

  const formatDate = useCallback((date: Date, options?: Intl.DateTimeFormatOptions) => {
    return new Intl.DateTimeFormat(currentLanguage, options).format(date);
  }, [currentLanguage]);

  const formatRelativeTime = useCallback((value: number, unit: Intl.RelativeTimeFormatUnit) => {
    return new Intl.RelativeTimeFormat(currentLanguage, { numeric: 'auto' }).format(value, unit);
  }, [currentLanguage]);

  const formatList = useCallback((items: string[], type: 'conjunction' | 'disjunction' | 'unit' = 'conjunction') => {
    return new Intl.ListFormat(currentLanguage, { type }).format(items);
  }, [currentLanguage]);

  return {
    formatNumber,
    formatCurrency,
    formatDate,
    formatRelativeTime,
    formatList
  };
};

/**
 * Hook for SEO-optimized translations
 */
export const useI18nSEO = (options: UseI18nSEOOptions = {}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useLanguage();
  const factory = LanguageProviderFactory.getInstance();

  const generateMetaTags = useCallback(() => {
    const provider = factory.getCachedProvider(currentLanguage);
    if (!provider) return {};

    const config = provider.config;
    return {
      title: config.siteName,
      description: config.description,
      keywords: config.keywords.join(', '),
      'og:title': config.siteName,
      'og:description': config.description,
      'og:locale': currentLanguage,
      'twitter:title': config.siteName,
      'twitter:description': config.description,
    };
  }, [currentLanguage, factory]);

  const generateStructuredData = useCallback((type: string, data: any) => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type,
      'inLanguage': currentLanguage,
    };

    switch (type) {
      case 'Product':
        return {
          ...baseData,
          name: data.name,
          description: data.description,
          sku: data.sku,
          image: data.images?.[0]?.url,
          offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: 'CLP',
            availability: data.inStock ? 'InStock' : 'OutOfStock',
          },
        };

      case 'Organization':
        return {
          ...baseData,
          name: t('common.siteName'),
          description: t('common.siteDescription'),
          url: window.location.origin,
        };

      default:
        return baseData;
    }
  }, [currentLanguage, t]);

  const optimizeForSearch = useCallback((content: string) => {
    // This would implement AI-powered SEO optimization
    // For now, return basic optimizations
    return content
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }, []);

  return {
    generateMetaTags,
    generateStructuredData,
    optimizeForSearch
  };
};

/**
 * Hook for pluralization and gender-based translations
 */
export const useI18nPluralization = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useLanguage();

  const getPlural = useCallback((key: string, count: number) => {
    const pluralRules = new Intl.PluralRules(currentLanguage);
    const rule = pluralRules.select(count);

    // Try language-specific plural forms
    const pluralKey = `${key}_${rule}`;
    try {
      return t(pluralKey);
    } catch {
      // Fallback to singular/plural pattern
      return count === 1 ? t(key) : t(`${key}_plural`);
    }
  }, [currentLanguage, t]);

  const getGendered = useCallback((key: string, gender: 'male' | 'female' | 'neutral' = 'neutral') => {
    try {
      return t(`${key}_${gender}`);
    } catch {
      return t(key);
    }
  }, [t]);

  return { getPlural, getGendered };
};

/**
 * Hook for RTL/LTR language support
 */
export const useI18nDirection = () => {
  const { currentLanguage } = useLanguage();
  const factory = LanguageProviderFactory.getInstance();

  const isRTL = useMemo(() => {
    const provider = factory.getCachedProvider(currentLanguage);
    return provider?.config?.direction === 'rtl';
  }, [currentLanguage, factory]);

  const direction = isRTL ? 'rtl' : 'ltr';

  const textAlign = isRTL ? 'right' : 'left';
  const textAlignOpposite = isRTL ? 'left' : 'right';

  const marginStart = isRTL ? 'marginRight' : 'marginLeft';
  const marginEnd = isRTL ? 'marginLeft' : 'marginRight';

  const paddingStart = isRTL ? 'paddingRight' : 'paddingLeft';
  const paddingEnd = isRTL ? 'paddingLeft' : 'paddingRight';

  return {
    isRTL,
    direction,
    textAlign,
    textAlignOpposite,
    marginStart,
    marginEnd,
    paddingStart,
    paddingEnd
  };
};

/**
 * Hook for language detection and auto-switching
 */
export const useI18nAutoDetect = () => {
  const { setLanguage } = useLanguage();
  const factory = LanguageProviderFactory.getInstance();

  const detectBrowserLanguage = useCallback(() => {
    if (typeof window === 'undefined') return null;

    const browserLangs = navigator.languages || [navigator.language];
    const supportedLanguages = factory.getSupportedLanguages();

    for (const lang of browserLangs) {
      const langCode = lang.split('-')[0];
      const supportedLang = supportedLanguages.find(l => l.code === langCode);
      if (supportedLang) {
        return supportedLang.code;
      }
    }

    return null;
  }, [factory]);

  const detectFromURL = useCallback((pathname: string) => {
    const supportedLanguages = factory.getSupportedLanguages();
    const langCodes = supportedLanguages.map(l => l.code);

    for (const langCode of langCodes) {
      if (pathname.startsWith(`/${langCode}`)) {
        return langCode;
      }
    }

    return null;
  }, [factory]);

  const autoSwitchLanguage = useCallback(async () => {
    // Priority: URL > localStorage > browser > default
    const urlLang = detectFromURL(window.location.pathname);
    if (urlLang) {
      await setLanguage(urlLang);
      return urlLang;
    }

    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang) {
      await setLanguage(savedLang);
      return savedLang;
    }

    const browserLang = detectBrowserLanguage();
    if (browserLang) {
      await setLanguage(browserLang);
      return browserLang;
    }

    // Default to Spanish
    await setLanguage('es');
    return 'es';
  }, [setLanguage, detectFromURL, detectBrowserLanguage]);

  return {
    detectBrowserLanguage,
    detectFromURL,
    autoSwitchLanguage
  };
};

/**
 * Hook for translation performance monitoring
 */
export const useI18nPerformance = () => {
  const [metrics, setMetrics] = useState({
    translationTime: 0,
    cacheHitRate: 0,
    errorRate: 0,
    totalTranslations: 0
  });

  const measureTranslationTime = useCallback((startTime: number) => {
    const endTime = performance.now();
    const duration = endTime - startTime;

    setMetrics(prev => ({
      ...prev,
      translationTime: duration,
      totalTranslations: prev.totalTranslations + 1
    }));

    return duration;
  }, []);

  const trackCacheHit = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      cacheHitRate: (prev.cacheHitRate * prev.totalTranslations + 1) / (prev.totalTranslations + 1)
    }));
  }, []);

  const trackError = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      errorRate: (prev.errorRate * prev.totalTranslations + 1) / (prev.totalTranslations + 1)
    }));
  }, []);

  const resetMetrics = useCallback(() => {
    setMetrics({
      translationTime: 0,
      cacheHitRate: 0,
      errorRate: 0,
      totalTranslations: 0
    });
  }, []);

  return {
    metrics,
    measureTranslationTime,
    trackCacheHit,
    trackError,
    resetMetrics
  };
};

/**
 * Hook for AI-powered translation suggestions
 */
export const useI18nAI = () => {
  const { currentLanguage } = useLanguage();
  const translationService = TranslationService.getInstance();

  const suggestTranslations = useCallback(async (text: string, targetLanguages: string[] = []) => {
    try {
      const suggestions = await Promise.all(
        targetLanguages.map(async (lang) => {
          const result = await translationService.translate(text, {
            sourceLanguage: currentLanguage,
            targetLanguage: lang,
            context: 'ui_element'
          });
          return { language: lang, translation: result.text };
        })
      );

      return suggestions;
    } catch (error) {
      console.error('AI translation suggestion error:', error);
      return [];
    }
  }, [currentLanguage, translationService]);

  const optimizeTranslation = useCallback(async (text: string, context: string) => {
    try {
      const result = await translationService.optimize(text, {
        context,
        language: currentLanguage,
        optimizeFor: 'seo'
      });
      return result.text;
    } catch (error) {
      console.error('AI translation optimization error:', error);
      return text;
    }
  }, [currentLanguage, translationService]);

  return {
    suggestTranslations,
    optimizeTranslation
  };
};

/**
 * Master hook that combines all i18n utilities
 */
export const useI18nUltimate = () => {
  const language = useLanguage();
  const batch = useI18nBatch();
  const format = useI18nFormat();
  const seo = useI18nSEO();
  const pluralization = useI18nPluralization();
  const direction = useI18nDirection();
  const autoDetect = useI18nAutoDetect();
  const performance = useI18nPerformance();
  const ai = useI18nAI();

  return {
    // Core language functionality
    ...language,

    // Advanced utilities
    batch,
    format,
    seo,
    pluralization,
    direction,
    autoDetect,
    performance,
    ai,

    // Ultimate completion features
    utils: {
      // Auto-complete missing translations
      autoComplete: async (keys: string[]) => {
        const missingKeys = keys.filter(key => {
          try {
            language.t(key);
            return false;
          } catch {
            return true;
          }
        });

        if (missingKeys.length > 0) {
          const suggestions = await ai.suggestTranslations(
            missingKeys.join(', '),
            [language.currentLanguage]
          );

          return suggestions.reduce((acc, suggestion) => {
            acc[suggestion.language] = suggestion.translation;
            return acc;
          }, {} as Record<string, string>);
        }

        return {};
      },

      // Performance optimization
      optimize: async (content: string) => {
        const optimized = await ai.optimizeTranslation(content, 'page_content');
        return seo.optimizeForSearch(optimized);
      },

      // Auto-detect and switch language
      autoAdapt: async () => {
        const detectedLang = await autoDetect.autoSwitchLanguage();
        return detectedLang;
      }
    }
  };
};