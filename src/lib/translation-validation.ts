/**
 * Translation Validation and Utilities
 * Comprehensive tools for ensuring translation quality and completeness
 */

import { supportedLanguageChunks } from './i18n-chunked';
import { lazyLoadLanguageProvider } from './lazy-language-loader';

export interface ValidationResult {
  language: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingKeys: string[];
  extraKeys: string[];
  keyCount: number;
  coverage: number;
}

export interface ComparisonResult {
  baseLanguage: string;
  targetLanguage: string;
  missingInTarget: string[];
  extraInTarget: string[];
  matchingKeys: string[];
  coveragePercentage: number;
  similarityScore: number;
}

export interface TranslationQualityReport {
  overallScore: number;
  languageReports: ValidationResult[];
  comparisonReports: ComparisonResult[];
  recommendations: string[];
  generatedAt: string;
}

/**
 * Validate a single language provider
 */
export async function validateLanguageProvider(
  languageCode: string,
  baseLanguage = 'en'
): Promise<ValidationResult> {
  const result: ValidationResult = {
    language: languageCode,
    isValid: true,
    errors: [],
    warnings: [],
    missingKeys: [],
    extraKeys: [],
    keyCount: 0,
    coverage: 0
  };

  try {
    // Load the language provider
    const provider = await lazyLoadLanguageProvider(languageCode);
    const baseProvider = await lazyLoadLanguageProvider(baseLanguage);

    if (!provider) {
      result.isValid = false;
      result.errors.push(`Language provider for ${languageCode} could not be loaded`);
      return result;
    }

    // Get all translation keys from the provider
    const providerTranslations = extractTranslationsFromProvider(provider);
    const baseTranslations = extractTranslationsFromProvider(baseProvider);

    result.keyCount = Object.keys(providerTranslations).length;

    // Find missing keys compared to base language
    result.missingKeys = Object.keys(baseTranslations).filter(
      key => !(key in providerTranslations)
    );

    // Find extra keys not in base language
    result.extraKeys = Object.keys(providerTranslations).filter(
      key => !(key in baseTranslations)
    );

    // Calculate coverage
    const totalBaseKeys = Object.keys(baseTranslations).length;
    const coveredKeys = totalBaseKeys - result.missingKeys.length;
    result.coverage = totalBaseKeys > 0 ? (coveredKeys / totalBaseKeys) * 100 : 0;

    // Validate translation quality
    validateTranslationQuality(providerTranslations, result);

    // Check for RTL consistency if needed
    const langConfig = supportedLanguageChunks.find(l => l.code === languageCode);
    if (langConfig?.direction === 'rtl') {
      validateRTLConsistency(providerTranslations, result);
    }

    // Determine overall validity
    result.isValid = result.errors.length === 0 && result.coverage >= 80;

  } catch (error) {
    result.isValid = false;
    result.errors.push(`Error validating language ${languageCode}: ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
}

/**
 * Extract translations from a language provider
 */
function extractTranslationsFromProvider(provider: any): Record<string, string> {
  const translations: Record<string, string> = {};

  // Recursive function to extract nested translations
  function extract(obj: any, prefix = '') {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        translations[prefix + key] = obj[key];
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        extract(obj[key], prefix + key + '.');
      }
    }
  }

  // Extract from provider's translation method if available
  if (provider && typeof provider.translate === 'function') {
    // Try to get the raw translation data
    if (provider.translations) {
      extract(provider.translations);
    } else if (provider.data) {
      extract(provider.data);
    } else {
      // Fallback: extract from common translation keys
      const commonKeys = [
        'nav.home', 'nav.products', 'common.loading', 'common.error',
        'product.price', 'cart.addToCart', 'account.login'
      ];

      commonKeys.forEach(key => {
        try {
          const translation = provider.translate(key);
          if (translation && translation !== key) {
            translations[key] = translation;
          }
        } catch (e) {
          // Ignore errors for individual keys
        }
      });
    }
  }

  return translations;
}

/**
 * Validate translation quality
 */
function validateTranslationQuality(
  translations: Record<string, string>,
  result: ValidationResult
): void {
  Object.entries(translations).forEach(([key, value]) => {
    // Check for empty translations
    if (!value || value.trim() === '') {
      result.errors.push(`Empty translation for key: ${key}`);
    }

    // Check for placeholder text
    if (value.includes('[TODO]') || value.includes('TODO:')) {
      result.warnings.push(`TODO placeholder found in key: ${key}`);
    }

    // Check for untranslated text (same as key)
    if (value === key) {
      result.warnings.push(`Translation same as key (untranslated): ${key}`);
    }

    // Check for HTML entities issues
    if (value.includes('&') && !value.includes('&amp;') && !value.includes('&lt;') && !value.includes('&gt;')) {
      result.warnings.push(`Potential HTML entity issue in key: ${key}`);
    }

    // Check for inconsistent placeholders
    const placeholderMatches = value.match(/\{\w+\}/g) || [];
    if (placeholderMatches.length > 0) {
      result.warnings.push(`Contains placeholders that should be validated: ${key} -> ${placeholderMatches.join(', ')}`);
    }
  });
}

/**
 * Validate RTL text consistency
 */
function validateRTLConsistency(
  translations: Record<string, string>,
  result: ValidationResult
): void {
  const rtlIndicators = ['العربية', 'عربي', 'arabic', 'rtl', 'right-to-left'];

  Object.entries(translations).forEach(([key, value]) => {
    // Check if RTL text contains LTR indicators
    if (rtlIndicators.some(indicator => value.includes(indicator))) {
      result.warnings.push(`RTL text may contain LTR indicators in key: ${key}`);
    }
  });
}

/**
 * Compare two language providers
 */
export async function compareLanguageProviders(
  targetLanguage: string,
  baseLanguage = 'en'
): Promise<ComparisonResult> {
  const result: ComparisonResult = {
    baseLanguage,
    targetLanguage,
    missingInTarget: [],
    extraInTarget: [],
    matchingKeys: [],
    coveragePercentage: 0,
    similarityScore: 0
  };

  try {
    const [targetProvider, baseProvider] = await Promise.all([
      lazyLoadLanguageProvider(targetLanguage),
      lazyLoadLanguageProvider(baseLanguage)
    ]);

    const targetTranslations = extractTranslationsFromProvider(targetProvider);
    const baseTranslations = extractTranslationsFromProvider(baseProvider);

    // Find missing keys
    result.missingInTarget = Object.keys(baseTranslations).filter(
      key => !(key in targetTranslations)
    );

    // Find extra keys
    result.extraInTarget = Object.keys(targetTranslations).filter(
      key => !(key in baseTranslations)
    );

    // Find matching keys
    result.matchingKeys = Object.keys(baseTranslations).filter(
      key => key in targetTranslations
    );

    // Calculate coverage
    const totalBaseKeys = Object.keys(baseTranslations).length;
    const coveredKeys = totalBaseKeys - result.missingInTarget.length;
    result.coveragePercentage = totalBaseKeys > 0 ? (coveredKeys / totalBaseKeys) * 100 : 0;

    // Calculate similarity score
    result.similarityScore = calculateSimilarityScore(
      baseTranslations,
      targetTranslations,
      result.matchingKeys
    );

  } catch (error) {
    console.error(`Error comparing languages ${baseLanguage} and ${targetLanguage}:`, error);
  }

  return result;
}

/**
 * Calculate similarity score between translations
 */
function calculateSimilarityScore(
  baseTranslations: Record<string, string>,
  targetTranslations: Record<string, string>,
  matchingKeys: string[]
): number {
  if (matchingKeys.length === 0) return 0;

  let totalScore = 0;
  let validComparisons = 0;

  matchingKeys.forEach(key => {
    const baseValue = baseTranslations[key];
    const targetValue = targetTranslations[key];

    if (baseValue && targetValue) {
      // Simple similarity based on length ratio
      const lengthRatio = Math.min(baseValue.length, targetValue.length) /
                         Math.max(baseValue.length, targetValue.length);

      // Bonus for having similar word count
      const baseWords = baseValue.split(/\s+/).length;
      const targetWords = targetValue.split(/\s+/).length;
      const wordCountRatio = Math.min(baseWords, targetWords) /
                            Math.max(baseWords, targetWords);

      const score = (lengthRatio + wordCountRatio) / 2;
      totalScore += score;
      validComparisons++;
    }
  });

  return validComparisons > 0 ? (totalScore / validComparisons) * 100 : 0;
}

/**
 * Generate comprehensive translation quality report
 */
export async function generateTranslationQualityReport(
  baseLanguage = 'en'
): Promise<TranslationQualityReport> {
  const report: TranslationQualityReport = {
    overallScore: 0,
    languageReports: [],
    comparisonReports: [],
    recommendations: [],
    generatedAt: new Date().toISOString()
  };

  try {
    // Validate all supported languages
    const validationPromises = supportedLanguageChunks
      .filter(lang => lang.code !== baseLanguage)
      .map(lang => validateLanguageProvider(lang.code, baseLanguage));

    report.languageReports = await Promise.all(validationPromises);

    // Generate comparison reports
    const comparisonPromises = supportedLanguageChunks
      .filter(lang => lang.code !== baseLanguage)
      .map(lang => compareLanguageProviders(lang.code, baseLanguage));

    report.comparisonReports = await Promise.all(comparisonPromises);

    // Calculate overall score
    if (report.languageReports.length > 0) {
      const totalCoverage = report.languageReports.reduce((sum, r) => sum + r.coverage, 0);
      report.overallScore = totalCoverage / report.languageReports.length;
    }

    // Generate recommendations
    report.recommendations = generateRecommendations(report);

  } catch (error) {
    console.error('Error generating translation quality report:', error);
    report.recommendations.push('Error generating report. Please check console for details.');
  }

  return report;
}

/**
 * Generate recommendations based on report
 */
function generateRecommendations(report: TranslationQualityReport): string[] {
  const recommendations: string[] = [];

  // Overall score recommendations
  if (report.overallScore < 50) {
    recommendations.push('CRITICAL: Overall translation coverage is very low. Immediate attention required.');
  } else if (report.overallScore < 80) {
    recommendations.push('WARNING: Translation coverage is below acceptable levels. Review missing translations.');
  } else if (report.overallScore >= 95) {
    recommendations.push('EXCELLENT: Translation coverage is excellent across all languages.');
  }

  // Language-specific recommendations
  report.languageReports.forEach(langReport => {
    if (langReport.coverage < 70) {
      recommendations.push(`URGENT: ${langReport.language} has only ${langReport.coverage.toFixed(1)}% coverage.`);
    }

    if (langReport.errors.length > 0) {
      recommendations.push(`${langReport.language}: Fix ${langReport.errors.length} critical errors.`);
    }

    if (langReport.warnings.length > 0) {
      recommendations.push(`${langReport.language}: Address ${langReport.warnings.length} warnings.`);
    }
  });

  // Comparison recommendations
  report.comparisonReports.forEach(comparison => {
    if (comparison.coveragePercentage < 80) {
      recommendations.push(`${comparison.targetLanguage}: Improve coverage from ${comparison.coveragePercentage.toFixed(1)}%`);
    }

    if (comparison.similarityScore < 50) {
      recommendations.push(`${comparison.targetLanguage}: Translation quality may be low (similarity: ${comparison.similarityScore.toFixed(1)}%)`);
    }
  });

  return recommendations;
}

/**
 * Export report to various formats
 */
export function exportReport(report: TranslationQualityReport, format: 'json' | 'csv' | 'html' = 'json'): string {
  switch (format) {
    case 'json':
      return JSON.stringify(report, null, 2);

    case 'csv':
      return generateCSVReport(report);

    case 'html':
      return generateHTMLReport(report);

    default:
      return JSON.stringify(report);
  }
}

/**
 * Generate CSV format report
 */
function generateCSVReport(report: TranslationQualityReport): string {
  const lines: string[] = [];

  // Header
  lines.push('Language,Valid,Coverage,Errors,Warnings,Missing Keys,Extra Keys');

  // Language reports
  report.languageReports.forEach(lang => {
    lines.push([
      lang.language,
      lang.isValid,
      lang.coverage.toFixed(2),
      lang.errors.length,
      lang.warnings.length,
      lang.missingKeys.length,
      lang.extraKeys.length
    ].join(','));
  });

  lines.push(''); // Empty line
  lines.push('Comparisons:');
  lines.push('Target Language,Base Language,Coverage %,Similarity %,Missing,Extra');

  // Comparison reports
  report.comparisonReports.forEach(comp => {
    lines.push([
      comp.targetLanguage,
      comp.baseLanguage,
      comp.coveragePercentage.toFixed(2),
      comp.similarityScore.toFixed(2),
      comp.missingInTarget.length,
      comp.extraInTarget.length
    ].join(','));
  });

  return lines.join('\n');
}

/**
 * Generate HTML format report
 */
function generateHTMLReport(report: TranslationQualityReport): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>Translation Quality Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f0f0; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .score { font-size: 24px; font-weight: bold; color: ${report.overallScore >= 80 ? 'green' : report.overallScore >= 50 ? 'orange' : 'red'}; }
        .language-report { margin: 10px 0; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
        .error { color: red; }
        .warning { color: orange; }
        .success { color: green; }
        .recommendations { background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Translation Quality Report</h1>
        <p>Generated: ${new Date(report.generatedAt).toLocaleString()}</p>
        <div>Overall Score: <span class="score">${report.overallScore.toFixed(1)}%</span></div>
    </div>

    <h2>Language Reports</h2>
    ${report.languageReports.map(lang => `
        <div class="language-report">
            <h3>${lang.language} - ${lang.isValid ? '<span class="success">✓ Valid</span>' : '<span class="error">✗ Invalid</span>'}</h3>
            <p>Coverage: ${lang.coverage.toFixed(1)}%</p>
            <p>Keys: ${lang.keyCount}</p>
            ${lang.errors.length > 0 ? `<p class="error">Errors: ${lang.errors.length}</p>` : ''}
            ${lang.warnings.length > 0 ? `<p class="warning">Warnings: ${lang.warnings.length}</p>` : ''}
            ${lang.missingKeys.length > 0 ? `<p class="error">Missing: ${lang.missingKeys.length} keys</p>` : ''}
            ${lang.extraKeys.length > 0 ? `<p class="warning">Extra: ${lang.extraKeys.length} keys</p>` : ''}
        </div>
    `).join('')}

    <div class="recommendations">
        <h2>Recommendations</h2>
        <ul>
            ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    </div>
</body>
</html>`;
}