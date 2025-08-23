#!/usr/bin/env tsx

/**
 * i18n Audit Runner
 * Executes comprehensive i18n audit across the entire codebase
 */

import { I18nAuditor } from '../src/lib/i18n-audit';
import { promises as fs } from 'fs';
import path from 'path';

async function runI18nAudit() {
  console.log('🌐 Starting comprehensive i18n audit...\n');

  const auditor = new I18nAuditor();
  const srcDirectory = path.join(process.cwd(), 'src');

  try {
    const report = await auditor.generateReport(srcDirectory);

    // Save report to file
    const reportPath = path.join(process.cwd(), 'i18n-audit-report.md');
    await fs.writeFile(reportPath, report, 'utf-8');

    console.log('✅ i18n audit completed successfully!');
    console.log(`📊 Report saved to: ${reportPath}\n`);

    // Print summary to console
    const lines = report.split('\n');
    const summaryLines = lines.filter(line =>
      line.includes('Total Files Analyzed') ||
      line.includes('Fully Implemented') ||
      line.includes('Partially Implemented') ||
      line.includes('Not Implemented')
    );

    console.log('📈 Summary:');
    summaryLines.forEach(line => console.log(`  ${line}`));

    console.log('\n🔍 Next steps:');
    console.log('1. Review the detailed report: i18n-audit-report.md');
    console.log('2. Start implementing i18n for files with "not-implemented" status');
    console.log('3. Add missing translation keys to language chunks');
    console.log('4. Replace hardcoded text with translation calls');

  } catch (error) {
    console.error('❌ Error running i18n audit:', error);
    process.exit(1);
  }
}

// Quick audit for specific directories
async function quickAudit(directory: string) {
  console.log(`🔍 Quick audit of: ${directory}`);

  const auditor = new I18nAuditor();
  const results = await auditor.auditDirectory(directory);

  const summary = auditor.generateSummary(results);

  console.log(`📊 Results for ${directory}:`);
  console.log(`  Total Files: ${summary.totalFiles}`);
  console.log(`  ✅ Fully Implemented: ${summary.fullyImplemented}`);
  console.log(`  ⚠️ Partially Implemented: ${summary.partiallyImplemented}`);
  console.log(`  ❌ Not Implemented: ${summary.notImplemented}`);

  if (summary.filesNeedingWork.length > 0) {
    console.log(`  📋 Files needing work: ${summary.filesNeedingWork.length}`);
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--quick')) {
    // Quick audit of specific directories
    const directories = [
      path.join(process.cwd(), 'src/app'),
      path.join(process.cwd(), 'src/components'),
      path.join(process.cwd(), 'src/hooks')
    ];

    Promise.all(directories.map(quickAudit))
      .then(() => console.log('\n✅ Quick audit completed!'))
      .catch(console.error);
  } else {
    // Full audit
    runI18nAudit();
  }
}

export { runI18nAudit, quickAudit };