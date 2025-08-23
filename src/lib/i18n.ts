/**
 * Internationalization - Chunked Architecture (Legacy Compatibility)
 *
 * This file provides backward compatibility for the existing monolithic i18n system
 * while delegating to the new chunked language provider architecture.
 *
 * For new implementations, use the chunked system from './i18n-chunked'
 */

// Re-export everything from the new chunked system
export {
  supportedLanguageChunks as supportedLanguages,
  defaultLanguage,
  initializeChunkedI18n,
  getLocalizedUrl,
  generateHrefLangTags,
  translateContent,
  generateLanguageCollections,
  LanguageProviderFactory,
  TranslationService,
  LanguageLoader,
  useTranslation,
  useLanguageLoader,
  type LanguageChunk,
  type LanguageProvider,
  type TranslationRequest,
  type TranslationResponse
} from './i18n-chunked';

// Legacy interface for backward compatibility
export interface LanguageContent {
  language: string;
  title: string;
  description: string;
  content: string;
}

// Legacy language configurations (now handled by chunks)
// These are kept for backward compatibility but will be deprecated
export const languageConfigs = {
  en: {
    siteName: 'Luxury E-Commerce Store',
    description: 'Premium luxury products with AI-optimized SEO',
    keywords: ['luxury', 'premium', 'quality', 'designer']
  },
  es: {
    siteName: 'Tienda de Lujo en Línea',
    description: 'Productos de lujo premium con SEO optimizado por IA',
    keywords: ['lujo', 'premium', 'calidad', 'diseñador']
  },
  de: {
    siteName: 'Luxus E-Commerce Shop',
    description: 'Premium Luxusprodukte mit KI-optimiertem SEO',
    keywords: ['Luxus', 'Premium', 'Qualität', 'Designer']
  },
  fr: {
    siteName: 'Boutique de Luxe en Ligne',
    description: 'Produits de luxe premium avec SEO optimisé par IA',
    keywords: ['luxe', 'premium', 'qualité', 'designer']
  },
  ar: {
    siteName: 'متجر التجارة الإلكترونية الفاخرة',
    description: 'منتجات فاخرة مميزة مع تحسين SEO بالذكاء الاصطناعي',
    keywords: ['فاخر', 'مميز', 'جودة', 'مصمم']
  },
  ru: {
    siteName: 'Роскошный интернет-магазин',
    description: 'Премиальные luxury товары с AI-оптимизированным SEO',
    keywords: ['роскошь', 'премиум', 'качество', 'дизайнер']
  }
};

/**
 * Initialize the i18n system (backward compatibility)
 * This now initializes the chunked system
 */
export const initializeI18n = async (): Promise<void> => {
  console.warn('initializeI18n is deprecated. Use initializeChunkedI18n from i18n-chunked instead.');
  return initializeChunkedI18n();
};