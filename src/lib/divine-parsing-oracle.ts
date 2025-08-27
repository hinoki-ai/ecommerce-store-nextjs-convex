/**
 * Divine Parsing Oracle System - SINGLE SOURCE OF TRUTH
 *
 * ⚠️  CRITICAL: This is the ONLY divine parsing oracle system allowed in this project
 * ⚠️  DO NOT create alternative divine parsing oracle implementations
 * ⚠️  See DIVINE-PARSING-ORACLE-RULES.md for mandatory guidelines
 *
 * Replaces the monolithic i18n with a scalable divine parsing oracle architecture
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
 * Initialize the divine parsing oracle system
 */
export const initializeDivineParsingOracle = async (): Promise<void> => {
  const factory = LanguageProviderFactory.getInstance();

  // Register all supported languages
  supportedLanguageChunks.forEach(chunk => {
    factory.registerLanguage(chunk);
  });

  // Try to preload critical language chunks, but don't fail if it doesn't work
  try {
    await factory.preloadCriticalChunks();
    console.log('Critical language chunks preloaded successfully');
  } catch (error) {
    console.warn('Failed to preload critical chunks, will load on demand:', error);
  }

  console.log('Divine parsing oracle system initialized with languages:', supportedLanguageChunks.map(l => l.code));
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
 * Enhanced hreflang tags generation for multi-language SEO
 * Includes region-specific variants and proper x-default handling
 */
export const generateHrefLangTags = (currentUrl: string, currentLanguage: string) => {
  const hreflangs = [];

  // Add x-default for the default language (Spanish)
  if (currentLanguage === defaultLanguage) {
    hreflangs.push({
      rel: 'alternate',
      hrefLang: 'x-default',
      href: currentUrl.replace(`/${currentLanguage}`, '')
    });
  }

  // Add specific language variants
  supportedLanguageChunks.forEach(lang => {
    const href = lang.code === 'en'
      ? currentUrl.replace(`/${currentLanguage}`, '')
      : currentUrl.replace(`/${currentLanguage}`, `/${lang.code}`);

    hreflangs.push({
      rel: 'alternate',
      hrefLang: lang.code,
      href: href
    });

    // Add region-specific variants for Spanish-speaking countries
    if (lang.code === 'es') {
      const spanishRegions = ['es-ES', 'es-MX', 'es-AR', 'es-CO', 'es-PE', 'es-VE', 'es-CL'];
      spanishRegions.forEach(region => {
        hreflangs.push({
          rel: 'alternate',
          hrefLang: region,
          href: href
        });
      });
    }
  });

  return hreflangs;
};

/**
 * Generate comprehensive SEO metadata for multilingual pages
 */
export const generateMultilingualSEO = async (path: string, currentLanguage: string) => {
  const factory = LanguageProviderFactory.getInstance();

  try {
    const provider = await factory.getProvider(currentLanguage);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourstore.com';

    // Generate canonical URL
    const canonicalUrl = currentLanguage === 'en'
      ? `${baseUrl}${path}`
      : `${baseUrl}/${currentLanguage}${path}`;

    // Generate hreflang tags
    const hreflangs = generateHrefLangTags(canonicalUrl, currentLanguage);

    // Get language-specific meta tags
    const metaTags = provider.getMetaTags();

    return {
      canonical: canonicalUrl,
      hreflangs,
      metaTags: {
        ...metaTags,
        language: currentLanguage,
        'og:locale': currentLanguage === 'en' ? 'en_US' : `${currentLanguage}_${currentLanguage.toUpperCase()}`,
        'og:url': canonicalUrl,
      },
      alternateLanguages: supportedLanguageChunks
        .filter(lang => lang.code !== currentLanguage)
        .map(lang => ({
          code: lang.code,
          name: lang.name,
          url: lang.code === 'en'
            ? `${baseUrl}${path}`
            : `${baseUrl}/${lang.code}${path}`,
          flag: lang.flag
        }))
    };
  } catch (error) {
    console.error('Error generating multilingual SEO:', error);
    return null;
  }
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
 * Export core classes for use in components
 */
export {
  LanguageProviderFactory,
  TranslationService,
  LanguageLoader
};

// Re-export types for convenience
export type { LanguageChunk, LanguageProvider, TranslationRequest, TranslationResponse };