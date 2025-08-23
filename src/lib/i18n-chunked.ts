/**
 * Chunked Internationalization System - SINGLE SOURCE OF TRUTH
 * 
 * ⚠️  CRITICAL: This is the ONLY i18n system allowed in this project
 * ⚠️  DO NOT create alternative i18n implementations
 * ⚠️  See I18N-RULES.md for mandatory guidelines
 * 
 * Replaces the monolithic i18n with a scalable chunked architecture
 */

import { LanguageProviderFactory, LanguageChunk, LanguageProvider } from './providers/language-provider';
import type { TranslationRequest, TranslationResponse } from './services/translation-service';
import { TranslationService } from './services/translation-service';
import { LanguageLoader } from './loaders/language-loader';

// Define supported languages with priority loading
export const supportedLanguageChunks: LanguageChunk[] = [
  // Critical priority (always loaded)
  { code: 'es', name: 'Español', flag: '🇪🇸', loadPriority: 0 },
  { code: 'en', name: 'English', flag: '🇺🇸', loadPriority: 1 },

  // High priority (loaded on demand)
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', loadPriority: 2 },
  { code: 'fr', name: 'Français', flag: '🇫🇷', loadPriority: 2 },

  // Normal priority (loaded when needed)
  { code: 'ar', name: 'العربية', flag: '🇸🇦', direction: 'rtl', loadPriority: 3 },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', loadPriority: 3 }
];

export const defaultLanguage = 'es'; // Spanish as primary language

/**
 * Initialize the chunked language system
 */
export const initializeChunkedI18n = async (): Promise<void> => {
  const factory = LanguageProviderFactory.getInstance();

  // Register all supported languages
  supportedLanguageChunks.forEach(chunk => {
    factory.registerLanguage(chunk);
  });

  // Preload critical language chunks (Spanish and English)
  await factory.preloadCriticalChunks();

  console.log('Chunked i18n system initialized with languages:', supportedLanguageChunks.map(l => l.code));
  console.log('Enhanced i18n includes: Admin, Analytics, Order Management, Regional variations, and comprehensive error/success messages');
};

/**
 * Get language-specific URLs (backward compatibility)
 */
export const getLocalizedUrl = (path: string, language: string = defaultLanguage): string => {
  if (language === 'en') {
    return path;
  }
  return `/${language}${path}`;
};

/**
 * Get language-specific meta tags (backward compatibility)
 */
export const getLanguageMeta = async (language: string = defaultLanguage) => {
  const factory = LanguageProviderFactory.getInstance();
  const provider = await factory.getProvider(language);
  return provider.getMetaTags();
};

/**
 * Generate hreflang tags for multi-language SEO
 */
export const generateHrefLangTags = (currentUrl: string, currentLanguage: string) => {
  return supportedLanguageChunks.map(lang => ({
    rel: 'alternate',
    hrefLang: lang.code,
    href: currentUrl.replace(`/${currentLanguage}`, lang.code === 'en' ? '' : `/${lang.code}`)
  }));
};

/**
 * Legacy translation function for backward compatibility
 */
export const translateContent = async (
  content: string,
  targetLanguage: string,
  sourceLanguage = 'es'
): Promise<string> => {
  const service = TranslationService.getInstance();

  // For now, return a simple placeholder
  // In a real implementation, this would use AI translation
  return `[${targetLanguage.toUpperCase()}] ${content}`;
};

/**
 * Generate language-specific collections (backward compatibility)
 */
export const generateLanguageCollections = async (baseCollection: Record<string, unknown>, language: string) => {
  const provider = await LanguageProviderFactory.getInstance().getProvider(language);
  const config = provider.config;

  return {
    ...baseCollection,
    name: `${String(baseCollection.name)} - ${config.siteName}`,
    description: `${String(baseCollection.description)} | ${config.description}`,
    language: language,
    localizedTags: String(baseCollection.tags).split(',').map((tag: string) =>
      `${tag.trim()} ${language}`
    ).join(',')
  };
};

/**
 * Import and re-export utilities for use in components
 */
import { useTranslation } from './i18n-utils';
import { useLanguageLoader } from './loaders/language-loader';

export {
  LanguageProviderFactory,
  TranslationService,
  LanguageLoader,
  useTranslation,
  useLanguageLoader
};

// Re-export types for convenience
export type { LanguageChunk, LanguageProvider, TranslationRequest, TranslationResponse };