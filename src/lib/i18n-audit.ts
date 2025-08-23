/**
 * i18n Audit Tool
 * Comprehensive analysis of i18n implementation across the entire codebase
 */

import { promises as fs } from 'fs';
import path from 'path';

interface I18nAuditResult {
  file: string;
  hasUseLanguage: boolean;
  hasUseTranslation: boolean;
  translationKeys: string[];
  missingTranslations: string[];
  hardcodedText: string[];
  i18nStatus: 'fully-implemented' | 'partially-implemented' | 'not-implemented';
}

interface AuditSummary {
  totalFiles: number;
  fullyImplemented: number;
  partiallyImplemented: number;
  notImplemented: number;
  filesNeedingWork: string[];
  commonMissingKeys: string[];
}

class I18nAuditor {
  private translationKeys = new Map<string, string[]>();
  private supportedLanguages = ['es', 'en', 'de', 'fr', 'ar', 'ru'];

  constructor() {
    this.loadTranslationKeys();
  }

  private async loadTranslationKeys() {
    for (const lang of this.supportedLanguages) {
      try {
        const chunkPath = path.join(process.cwd(), 'src/lib/chunks', `${lang}.chunk.ts`);
        const content = await fs.readFile(chunkPath, 'utf-8');
        const keys = this.extractTranslationKeys(content);
        this.translationKeys.set(lang, keys);
      } catch (error) {
        console.warn(`Could not load translation keys for ${lang}:`, error);
      }
    }
  }

  private extractTranslationKeys(content: string): string[] {
    const keys: string[] = [];
    const keyRegex = /['"`]([^'"`]+)['"`]\s*:/g;
    let match;

    while ((match = keyRegex.exec(content)) !== null) {
      keys.push(match[1]);
    }

    return keys;
  }

  async auditFile(filePath: string): Promise<I18nAuditResult> {
    const content = await fs.readFile(filePath, 'utf-8');

    // Check for i18n hooks usage
    const hasUseLanguage = /useLanguage/.test(content);
    const hasUseTranslation = /useTranslation|t\(/.test(content);

    // Extract translation keys used in the file
    const translationKeyRegex = /t\(['"`]([^'"`]+)['"`]\)/g;
    const translationKeys: string[] = [];
    let match;

    while ((match = translationKeyRegex.exec(content)) !== null) {
      translationKeys.push(match[1]);
    }

    // Check for hardcoded text (simple heuristic)
    const hardcodedText: string[] = [];
    const textRegex = />[^><]*[a-zA-Z]{5,}[^><]*</g;
    let textMatch;

    while ((textMatch = textRegex.exec(content)) !== null) {
      const text = textMatch[0].slice(1, -1).trim();
      if (text.length > 10 && !text.includes('t(') && !text.includes('{')) {
        hardcodedText.push(text);
      }
    }

    // Determine i18n status
    let i18nStatus: I18nAuditResult['i18nStatus'];
    if (hasUseLanguage && translationKeys.length > 0) {
      i18nStatus = 'fully-implemented';
    } else if (hasUseLanguage || translationKeys.length > 0) {
      i18nStatus = 'partially-implemented';
    } else {
      i18nStatus = 'not-implemented';
    }

    // Check for missing translations (simplified check)
    const missingTranslations: string[] = [];
    if (translationKeys.length > 0) {
      const esKeys = this.translationKeys.get('es') || [];
      for (const key of translationKeys) {
        if (!esKeys.some(esKey => esKey.includes(key) || key.includes(esKey))) {
          missingTranslations.push(key);
        }
      }
    }

    return {
      file: filePath,
      hasUseLanguage,
      hasUseTranslation,
      translationKeys,
      missingTranslations,
      hardcodedText,
      i18nStatus
    };
  }

  async auditDirectory(directory: string): Promise<I18nAuditResult[]> {
    const results: I18nAuditResult[] = [];

    const walk = async (dir: string) => {
      const files = await fs.readdir(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          await walk(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          // Skip test files, config files, and generated files
          if (!file.includes('.test.') &&
              !file.includes('.config.') &&
              !file.includes('.generated.') &&
              !file.includes('.d.ts')) {
            try {
              const result = await this.auditFile(filePath);
              results.push(result);
            } catch (error) {
              console.warn(`Error auditing ${filePath}:`, error);
            }
          }
        }
      }
    };

    await walk(directory);
    return results;
  }

  generateSummary(results: I18nAuditResult[]): AuditSummary {
    const summary: AuditSummary = {
      totalFiles: results.length,
      fullyImplemented: 0,
      partiallyImplemented: 0,
      notImplemented: 0,
      filesNeedingWork: [],
      commonMissingKeys: []
    };

    const missingKeysCount = new Map<string, number>();

    for (const result of results) {
      switch (result.i18nStatus) {
        case 'fully-implemented':
          summary.fullyImplemented++;
          break;
        case 'partially-implemented':
          summary.partiallyImplemented++;
          summary.filesNeedingWork.push(result.file);
          break;
        case 'not-implemented':
          summary.notImplemented++;
          summary.filesNeedingWork.push(result.file);
          break;
      }

      // Count missing translation keys
      for (const key of result.missingTranslations) {
        missingKeysCount.set(key, (missingKeysCount.get(key) || 0) + 1);
      }
    }

    // Get most common missing keys
    summary.commonMissingKeys = Array.from(missingKeysCount.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([key]) => key);

    return summary;
  }

  async generateReport(directory: string): Promise<string> {
    console.log('🔍 Starting i18n audit...');

    const results = await this.auditDirectory(directory);
    const summary = this.generateSummary(results);

    let report = '# i18n Implementation Audit Report\n\n';
    report += `Generated on: ${new Date().toISOString()}\n\n`;

    report += '## 📊 Summary\n\n';
    report += `- **Total Files Analyzed**: ${summary.totalFiles}\n`;
    report += `- **Fully Implemented**: ${summary.fullyImplemented} (${Math.round(summary.fullyImplemented/summary.totalFiles*100)}%)\n`;
    report += `- **Partially Implemented**: ${summary.partiallyImplemented} (${Math.round(summary.partiallyImplemented/summary.totalFiles*100)}%)\n`;
    report += `- **Not Implemented**: ${summary.notImplemented} (${Math.round(summary.notImplemented/summary.totalFiles*100)}%)\n\n`;

    report += '## 📋 Files Needing Work\n\n';
    for (const file of summary.filesNeedingWork) {
      report += `- ${file}\n`;
    }
    report += '\n';

    if (summary.commonMissingKeys.length > 0) {
      report += '## 🔑 Most Common Missing Translation Keys\n\n';
      for (const key of summary.commonMissingKeys) {
        report += `- \`${key}\`\n`;
      }
      report += '\n';
    }

    report += '## 📁 Detailed Results by Status\n\n';

    const fullyImplemented = results.filter(r => r.i18nStatus === 'fully-implemented');
    if (fullyImplemented.length > 0) {
      report += '### ✅ Fully Implemented\n\n';
      for (const result of fullyImplemented) {
        report += `- **${result.file}**\n`;
        report += `  - Translation Keys: ${result.translationKeys.length}\n`;
        if (result.hardcodedText.length > 0) {
          report += `  - ⚠️ Hardcoded Text: ${result.hardcodedText.length} items\n`;
        }
        report += '\n';
      }
    }

    const partiallyImplemented = results.filter(r => r.i18nStatus === 'partially-implemented');
    if (partiallyImplemented.length > 0) {
      report += '### ⚠️ Partially Implemented\n\n';
      for (const result of partiallyImplemented) {
        report += `- **${result.file}**\n`;
        report += `  - Translation Keys: ${result.translationKeys.length}\n`;
        if (result.missingTranslations.length > 0) {
          report += `  - Missing Keys: ${result.missingTranslations.join(', ')}\n`;
        }
        if (result.hardcodedText.length > 0) {
          report += `  - Hardcoded Text: ${result.hardcodedText.length} items\n`;
        }
        report += '\n';
      }
    }

    const notImplemented = results.filter(r => r.i18nStatus === 'not-implemented');
    if (notImplemented.length > 0) {
      report += '### ❌ Not Implemented\n\n';
      for (const result of notImplemented) {
        report += `- **${result.file}**\n`;
        if (result.hardcodedText.length > 0) {
          report += `  - Hardcoded Text: ${result.hardcodedText.length} items\n`;
        }
        report += '\n';
      }
    }

    return report;
  }
}

export { I18nAuditor, type I18nAuditResult, type AuditSummary };