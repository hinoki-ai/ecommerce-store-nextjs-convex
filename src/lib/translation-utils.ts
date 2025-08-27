/**
 * Translation Utilities
 * Helper functions for working with translations and i18n
 */

import { generateTranslationQualityReport, exportReport, ValidationResult } from './translation-validation';
import { supportedLanguageChunks } from './divine-parsing-oracle';
import { lazyLoadLanguageProvider } from './lazy-language-loader';

export interface TranslationKeyInfo {
  key: string;
  englishValue: string;
  translatedValue?: string;
  language: string;
  exists: boolean;
  isPlaceholder: boolean;
  characterCount: number;
  wordCount: number;
}

/**
 * Find missing translation keys across all languages
 */
export async function findMissingKeys(baseLanguage = 'en'): Promise<Record<string, string[]>> {
  const missing: Record<string, string[]> = {};

  try {
    const baseProvider = await lazyLoadLanguageProvider(baseLanguage);
    const baseTranslations = extractAllTranslations(baseProvider);

    // Check each language for missing keys
    for (const lang of supportedLanguageChunks) {
      if (lang.code === baseLanguage) continue;

      try {
        const provider = await lazyLoadLanguageProvider(lang.code);
        const translations = extractAllTranslations(provider);

        const missingKeys = Object.keys(baseTranslations).filter(
          key => !(key in translations)
        );

        if (missingKeys.length > 0) {
          missing[lang.code] = missingKeys;
        }
      } catch (error) {
        console.error(`Error checking ${lang.code}:`, error);
        missing[lang.code] = ['ERROR_LOADING_LANGUAGE'];
      }
    }
  } catch (error) {
    console.error('Error finding missing keys:', error);
  }

  return missing;
}

/**
 * Extract all translations from a provider
 */
function extractAllTranslations(provider: any): Record<string, string> {
  const translations: Record<string, string> = {};

  function traverse(obj: any, prefix = '') {
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'string') {
          translations[fullKey] = obj[key];
        } else {
          traverse(obj[key], fullKey);
        }
      }
    }
  }

  // Try to extract from different provider structures
  if (provider?.translations) {
    traverse(provider.translations);
  } else if (provider?.data) {
    traverse(provider.data);
  } else if (provider) {
    traverse(provider);
  }

  return translations;
}

/**
 * Get detailed information about a specific translation key
 */
export async function getTranslationKeyInfo(
  key: string,
  language: string,
  baseLanguage = 'en'
): Promise<TranslationKeyInfo> {
  const info: TranslationKeyInfo = {
    key,
    englishValue: '',
    translatedValue: '',
    language,
    exists: false,
    isPlaceholder: false,
    characterCount: 0,
    wordCount: 0
  };

  try {
    // Get English value
    const englishProvider = await lazyLoadLanguageProvider(baseLanguage);
    info.englishValue = getTranslationValue(englishProvider, key);

    // Get translated value
    const provider = await lazyLoadLanguageProvider(language);
    const translatedValue = getTranslationValue(provider, key);

    if (translatedValue && translatedValue !== key) {
      info.translatedValue = translatedValue;
      info.exists = true;
      info.characterCount = translatedValue.length;
      info.wordCount = translatedValue.split(/\s+/).filter(word => word.length > 0).length;
      info.isPlaceholder = isPlaceholderText(translatedValue);
    }
  } catch (error) {
    console.error(`Error getting translation info for ${key} in ${language}:`, error);
  }

  return info;
}

/**
 * Get translation value from provider
 */
function getTranslationValue(provider: any, key: string): string {
  try {
    if (provider?.translate) {
      return provider.translate(key);
    }

    // Try to access nested properties
    const keys = key.split('.');
    let value = provider;
    for (const k of keys) {
      value = value?.[k];
    }
    return typeof value === 'string' ? value : '';
  } catch (error) {
    return '';
  }
}

/**
 * Check if text is placeholder
 */
function isPlaceholderText(text: string): boolean {
  const placeholderPatterns = [
    /^\[.*\]$/,           // [placeholder]
    /^TODO/,             // TODO text
    /^FIXME/,            // FIXME text
    /^TRANSLATE/,        // TRANSLATE text
    /^<missing/i,        // <missing translation>
    /^placeholder/i,     // placeholder text
    /^\.\.\.$/,          // ...
    /^---$/,             // ---
    /^\*\*\*$/           // ***
  ];

  return placeholderPatterns.some(pattern => pattern.test(text.trim()));
}

/**
 * Search for translation keys containing specific text
 */
export async function searchTranslationKeys(
  searchText: string,
  language: string,
  caseSensitive = false
): Promise<string[]> {
  const results: string[] = [];

  try {
    const provider = await lazyLoadLanguageProvider(language);
    const translations = extractAllTranslations(provider);

    const searchTerm = caseSensitive ? searchText : searchText.toLowerCase();

    Object.entries(translations).forEach(([key, value]) => {
      const searchValue = caseSensitive ? value : value.toLowerCase();
      if (searchValue.includes(searchTerm)) {
        results.push(key);
      }
    });
  } catch (error) {
    console.error(`Error searching translations in ${language}:`, error);
  }

  return results;
}

/**
 * Get translation statistics for a language
 */
export async function getTranslationStats(language: string): Promise<{
  totalKeys: number;
  translatedKeys: number;
  placeholderKeys: number;
  emptyKeys: number;
  coverage: number;
  averageLength: number;
  longestKey: string;
  shortestKey: string;
}> {
  const stats = {
    totalKeys: 0,
    translatedKeys: 0,
    placeholderKeys: 0,
    emptyKeys: 0,
    coverage: 0,
    averageLength: 0,
    longestKey: '',
    shortestKey: ''
  };

  try {
    const provider = await lazyLoadLanguageProvider(language);
    const translations = extractAllTranslations(provider);

    stats.totalKeys = Object.keys(translations).length;

    let totalLength = 0;
    let longestLength = 0;
    let shortestLength = Infinity;

    Object.entries(translations).forEach(([key, value]) => {
      const length = value.length;

      if (value.trim() === '' || value === key) {
        stats.emptyKeys++;
      } else if (isPlaceholderText(value)) {
        stats.placeholderKeys++;
      } else {
        stats.translatedKeys++;
      }

      totalLength += length;

      if (length > longestLength) {
        longestLength = length;
        stats.longestKey = key;
      }

      if (length < shortestLength) {
        shortestLength = length;
        stats.shortestKey = key;
      }
    });

    stats.coverage = stats.totalKeys > 0 ? (stats.translatedKeys / stats.totalKeys) * 100 : 0;
    stats.averageLength = stats.translatedKeys > 0 ? totalLength / stats.translatedKeys : 0;

    if (shortestLength === Infinity) {
      stats.shortestKey = '';
    }
  } catch (error) {
    console.error(`Error getting translation stats for ${language}:`, error);
  }

  return stats;
}

/**
 * Validate translation placeholders and variables
 */
export async function validateTranslationPlaceholders(
  baseLanguage = 'en'
): Promise<Record<string, { missing: string[]; extra: string[]; inconsistent: string[] }>> {
  const results: Record<string, { missing: string[]; extra: string[]; inconsistent: string[] }> = {};

  try {
    const baseProvider = await lazyLoadLanguageProvider(baseLanguage);
    const baseTranslations = extractAllTranslations(baseProvider);

    // Extract placeholders from base language
    const basePlaceholders: Record<string, string[]> = {};
    Object.entries(baseTranslations).forEach(([key, value]) => {
      const placeholders = extractPlaceholders(value);
      if (placeholders.length > 0) {
        basePlaceholders[key] = placeholders;
      }
    });

    // Check each language
    for (const lang of supportedLanguageChunks) {
      if (lang.code === baseLanguage) continue;

      results[lang.code] = { missing: [], extra: [], inconsistent: [] };

      try {
        const provider = await lazyLoadLanguageProvider(lang.code);
        const translations = extractAllTranslations(provider);

        Object.entries(basePlaceholders).forEach(([key, basePlaceholders]) => {
          const translatedValue = translations[key];

          if (!translatedValue) {
            results[lang.code].missing.push(key);
            return;
          }

          const translatedPlaceholders = extractPlaceholders(translatedValue);

          // Check for missing placeholders
          const missing = basePlaceholders.filter(p => !translatedPlaceholders.includes(p));
          if (missing.length > 0) {
            results[lang.code].missing.push(`${key}: missing [${missing.join(', ')}]`);
          }

          // Check for extra placeholders
          const extra = translatedPlaceholders.filter(p => !basePlaceholders.includes(p));
          if (extra.length > 0) {
            results[lang.code].extra.push(`${key}: extra [${extra.join(', ')}]`);
          }
        });
      } catch (error) {
        console.error(`Error validating placeholders for ${lang.code}:`, error);
      }
    }
  } catch (error) {
    console.error('Error validating translation placeholders:', error);
  }

  return results;
}

/**
 * Extract placeholders from text (like {name}, {count}, etc.)
 */
function extractPlaceholders(text: string): string[] {
  const placeholderRegex = /\{([^}]+)\}/g;
  const placeholders: string[] = [];
  let match;

  while ((match = placeholderRegex.exec(text)) !== null) {
    placeholders.push(match[1]);
  }

  return [...new Set(placeholders)]; // Remove duplicates
}

/**
 * Generate a translation template for a new language
 */
export async function generateTranslationTemplate(
  targetLanguage: string,
  baseLanguage = 'en'
): Promise<Record<string, string>> {
  try {
    const baseProvider = await lazyLoadLanguageProvider(baseLanguage);
    const baseTranslations = extractAllTranslations(baseProvider);

    const template: Record<string, string> = {};

    Object.entries(baseTranslations).forEach(([key, value]) => {
      // Generate placeholder text with context
      const context = getTranslationContext(key);
      template[key] = `[${targetLanguage.toUpperCase()}] ${context}: ${value}`;
    });

    return template;
  } catch (error) {
    console.error('Error generating translation template:', error);
    return {};
  }
}

/**
 * Get context for a translation key
 */
function getTranslationContext(key: string): string {
  const contextMap: Record<string, string> = {
    nav: 'Navigation',
    common: 'Common UI',
    product: 'Product related',
    cart: 'Shopping cart',
    account: 'User account',
    error: 'Error message',
    success: 'Success message',
    form: 'Form element',
    button: 'Button text',
    title: 'Page title',
    description: 'Description text'
  };

  const firstPart = key.split('.')[0];
  return contextMap[firstPart] || 'General';
}

/**
 * Export translations to different formats
 */
export async function exportTranslations(
  language: string,
  format: 'json' | 'csv' | 'xlsx' = 'json'
): Promise<string | Buffer> {
  try {
    const provider = await lazyLoadLanguageProvider(language);
    const translations = extractAllTranslations(provider);

    switch (format) {
      case 'json':
        return JSON.stringify(translations, null, 2);

      case 'csv':
        return exportToCSV(translations);

      case 'xlsx':
        return exportToXLSX(translations);

      default:
        return JSON.stringify(translations);
    }
  } catch (error) {
    console.error(`Error exporting translations for ${language}:`, error);
    return '';
  }
}

/**
 * Export translations to CSV format
 */
function exportToCSV(translations: Record<string, string>): string {
  const lines = ['Key,Translation'];

  Object.entries(translations).forEach(([key, value]) => {
    // Escape quotes and wrap in quotes if contains comma or quote
    const escapedValue = value.includes(',') || value.includes('"')
      ? `"${value.replace(/"/g, '""')}"`
      : value;
    lines.push(`${key},${escapedValue}`);
  });

  return lines.join('\n');
}

/**
 * Export translations to XLSX format (placeholder - would require xlsx library)
 */
function exportToXLSX(translations: Record<string, string>): Buffer {
  // This would require an XLSX library like 'xlsx' or 'exceljs'
  // For now, return a simple JSON buffer
  return Buffer.from(JSON.stringify(translations, null, 2));
}

/**
 * Utility script runner for CLI usage
 */
export async function runTranslationUtils() {
  console.log('🔍 Translation Utils\n');

  // Generate quality report
  console.log('Generating translation quality report...');
  const report = await generateTranslationQualityReport();
  console.log(`Overall Score: ${report.overallScore.toFixed(1)}%`);
  console.log(`Languages Checked: ${report.languageReports.length}`);
  console.log(`Recommendations: ${report.recommendations.length}\n`);

  // Find missing keys
  console.log('Checking for missing keys...');
  const missing = await findMissingKeys();
  const languagesWithMissing = Object.keys(missing).filter(lang => missing[lang].length > 0);

  if (languagesWithMissing.length > 0) {
    console.log(`Languages with missing keys: ${languagesWithMissing.join(', ')}`);
    languagesWithMissing.forEach(lang => {
      console.log(`  ${lang}: ${missing[lang].length} missing keys`);
    });
  } else {
    console.log('✅ No missing keys found!');
  }

  // Validate placeholders
  console.log('\nValidating translation placeholders...');
  const placeholderResults = await validateTranslationPlaceholders();
  const languagesWithPlaceholderIssues = Object.keys(placeholderResults).filter(
    lang => {
      const result = placeholderResults[lang];
      return result.missing.length > 0 || result.extra.length > 0;
    }
  );

  if (languagesWithPlaceholderIssues.length > 0) {
    console.log(`Languages with placeholder issues: ${languagesWithPlaceholderIssues.join(', ')}`);
  } else {
    console.log('✅ All placeholders are consistent!');
  }

  // Get statistics
  console.log('\nTranslation Statistics:');
  for (const lang of supportedLanguageChunks) {
    const stats = await getTranslationStats(lang.code);
    console.log(`  ${lang.code}: ${stats.coverage.toFixed(1)}% coverage (${stats.translatedKeys}/${stats.totalKeys} keys)`);
  }
}

// CLI runner
if (require.main === module) {
  runTranslationUtils().catch(console.error);
}