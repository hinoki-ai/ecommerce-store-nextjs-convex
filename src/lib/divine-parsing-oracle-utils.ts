/**
 * Divine Parsing Oracle Utility Functions
 * Helper functions for easier divine parsing oracle usage throughout the application
 */

import { useLanguage } from '../../hooks/useLanguage';
import { LanguageProviderFactory } from './providers/language-provider';

/**
 * Unified Translation Hook
 * Provides both simple and advanced translation interfaces for backward compatibility
 */
export const useUnifiedTranslation = () => {
  const { t: simpleTranslate } = useLanguage();

  // Advanced translation function that supports nested keys
  const advancedTranslate = async (key: string) => {
    return (subKey: string) => {
      const fullKey = `${key}.${subKey}`;
      return simpleTranslate(fullKey);
    };
  };

  // Simple translation function for backward compatibility
  const simpleT = (key: string) => {
    return simpleTranslate(key);
  };

  return {
    // Advanced interface (supports nested keys)
    t: advancedTranslate,
    // Simple interface (backward compatible)
    simpleT,
    // Direct access to simple translate for components that need it
    translate: simpleTranslate
  };
};

/**
 * Hook for getting translated text with optional parameters
 */
export const useTranslation = () => {
  const { t, supportedLanguages } = useLanguage();

  const translate = async (key: string, params?: Record<string, string | number>): Promise<{ text: string }> => {
    let translatedText = await t(key);

    // Replace parameters in the translated text
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translatedText = translatedText.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
      });
    }

    return { text: translatedText };
  };

  const simpleBatchTranslate = async (keys: string[]): Promise<Record<string, string>> => {
    const translations: Record<string, string> = {};
    for (const key of keys) {
      const result = await translate(key);
      translations[key] = result.text;
    }
    return translations;
  };

  const preload = async (keys: string[]): Promise<void> => {
    // For now, just load the translations (they're already loaded)
    for (const key of keys) {
      await translate(key);
    }
  };

  const getAvailableLanguages = () => {
    return [
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'ru', name: 'Русский', flag: '🇷🇺' },
      { code: 'ar', name: 'العربية', flag: '🇸🇦', direction: 'rtl' }
    ];
  };

  return {
    t: translate,
    batchT: simpleBatchTranslate,
    preload,
    getAvailableLanguages,
    supportedLanguages
  };
};

/**
 * Hook for getting multiple translations at once
 */
export const useBatchTranslation = () => {
  const { t } = useLanguage();

  const batchTranslate = async (keys: string[]): Promise<Record<string, string>> => {
    const translations: Record<string, string> = {};
    for (const key of keys) {
      const result = await t(key);
      translations[key] = result;
    }
    return translations;
  };

  return { batchTranslate };
};

/**
 * Get current language code
 */
export const useCurrentLanguage = () => {
  const { currentLanguage } = useLanguage();
  return currentLanguage;
};

/**
 * Get available languages
 */
export const useAvailableLanguages = () => {
  const { supportedLanguages } = useLanguage();
  return supportedLanguages;
};

/**
 * Utility function to format currency with divine parsing oracle support
 */
export const formatCurrency = (amount: number, currency: string = 'CLP', language: string = 'es'): string => {
  try {
    return new Intl.NumberFormat(language === 'es' ? 'es-CL' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Fallback to simple formatting
    const symbol = currency === 'CLP' ? '$' : '$';
    return `${symbol}${amount.toLocaleString()}`;
  }
};

/**
 * Utility function to format date with divine parsing oracle support
 */
export const formatDate = (date: Date | string, language: string = 'es'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(language === 'es' ? 'es-CL' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
  } catch {
    // Fallback to simple formatting
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  }
};

/**
 * Utility function to format relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (date: Date | string, language: string = 'es'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return language === 'es' ? 'Hoy' : 'Today';
    } else if (diffInDays === 1) {
      return language === 'es' ? 'Ayer' : 'Yesterday';
    } else if (diffInDays < 7) {
      return language === 'es' ? `Hace ${diffInDays} días` : `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return language === 'es' ? `Hace ${weeks} semana${weeks > 1 ? 's' : ''}` : `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateObj, language);
    }
  } catch {
    // Fallback to simple date formatting
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  }
};

/**
 * Get translated month names
 */
export const getMonthNames = (language: string = 'es'): string[] => {
  const factory = LanguageProviderFactory.getInstance();
  const provider = factory.getCachedProvider(language);
  if (provider && provider.translations.date && typeof provider.translations.date === 'object' && 'months' in provider.translations.date) {
    return provider.translations.date.months as string[];
  }
  // Fallback
  return language === 'es'
    ? ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
};

/**
 * Get translated day names
 */
export const getDayNames = (language: string = 'es'): string[] => {
  const factory = LanguageProviderFactory.getInstance();
  const provider = factory.getCachedProvider(language);
  if (provider && provider.translations.date && typeof provider.translations.date === 'object' && 'days' in provider.translations.date) {
    return provider.translations.date.days as string[];
  }
  // Fallback
  return language === 'es'
    ? ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
};

/**
 * Utility function to get language-specific SEO keywords
 */
export const getLanguageKeywords = (language: string = 'es'): string[] => {
  const factory = LanguageProviderFactory.getInstance();
  const provider = factory.getCachedProvider(language);
  if (provider) {
    return provider.config.keywords;
  }
  // Fallback
  return ['lujo', 'premium', 'calidad', 'diseñador', 'moda', 'accesorios'];
};

/**
 * Utility function to get language-specific meta tags
 */
export const getLanguageMetaTags = (language: string = 'es'): Record<string, string> => {
  const factory = LanguageProviderFactory.getInstance();
  const provider = factory.getCachedProvider(language);
  if (provider) {
    return provider.getMetaTags();
  }
  // Fallback
  return {
    title: 'Tienda de Lujo en Línea',
    description: 'Productos de lujo premium con SEO optimizado por IA',
    keywords: 'lujo, premium, calidad, diseñador, moda, accesorios',
    language: 'es'
  };
};

/**
 * Utility function for pluralization
 */
export const pluralize = (count: number, singular: string, plural: string): string => {
  return count === 1 ? singular : plural;
};

/**
 * Utility function for conditional text based on count
 */
export const useConditionalText = () => {
  const { currentLanguage } = useLanguage();

  const getConditionalText = (count: number, options: {
    zero?: string;
    one?: string;
    many?: string;
    es?: { zero?: string; one?: string; many?: string };
    en?: { zero?: string; one?: string; many?: string };
  }): string => {
    const langOptions = options[currentLanguage as keyof typeof options] || options;

    // Check if langOptions is an object with the expected properties
    if (typeof langOptions === 'object' && langOptions !== null) {
      if (count === 0 && 'zero' in langOptions && langOptions.zero) return langOptions.zero;
      if (count === 1 && 'one' in langOptions && langOptions.one) return langOptions.one;
      if (count > 1 && 'many' in langOptions && langOptions.many) return langOptions.many;
    }

    // Fallback to general options
    if (count === 0 && options.zero) return options.zero;
    if (count === 1 && options.one) return options.one;
    if (count > 1 && options.many) return options.many;

    return '';
  };

  return getConditionalText;
};