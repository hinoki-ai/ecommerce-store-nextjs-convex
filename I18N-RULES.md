# I18N ARCHITECTURE RULES

**CRITICAL: This project uses ONE and ONLY ONE internationalization system.**

## 🚨 MANDATORY RULES - NO EXCEPTIONS

### Rule #1: Single Source of Truth
- **PRIMARY SYSTEM**: `src/lib/i18n-chunked.ts` - ONLY chunked system allowed
- **LEGACY WRAPPER**: `src/lib/i18n.ts` - Backward compatibility only (DO NOT MODIFY)
- **UTILS**: `src/lib/i18n-utils.ts` - Helper functions only

### Rule #2: Import Hierarchy (STRICT)
```typescript
// ✅ CORRECT - Always import from chunked system
import { initializeChunkedI18n, useTranslation } from '@/lib/i18n-chunked'
import { formatCurrency, formatDate } from '@/lib/i18n-utils'

// ⚠️ LEGACY ONLY - For backward compatibility (avoid in new code)
import { supportedLanguages } from '@/lib/i18n'

// ❌ FORBIDDEN - Never create alternative i18n systems
import { myCustomI18n } from './custom-i18n'
```

### Rule #3: Language Chunk Structure
- **Primary Languages**: ES (Spanish) → EN (English)
- **Supported Languages**: DE, FR, RU, AR
- **Chunk Location**: `src/lib/chunks/*.chunk.ts`
- **Naming Convention**: `{language-code}.chunk.ts`

## 🔒 ARCHITECTURE CONSTRAINTS

### System Components (DO NOT DUPLICATE)
1. **Core System**: `i18n-chunked.ts`
2. **Legacy Compatibility**: `i18n.ts` (wrapper only)
3. **Utilities**: `i18n-utils.ts`
4. **Language Chunks**: `chunks/*.chunk.ts`
5. **Providers**: `providers/language-provider.ts`
6. **Services**: `services/translation-service.ts`

### Forbidden Actions
- ❌ Creating new i18n files outside this structure
- ❌ Modifying the legacy wrapper beyond delegation
- ❌ Creating alternative translation systems
- ❌ Duplicating language chunks
- ❌ Bypassing the chunked architecture

## 🎯 DEVELOPMENT GUIDELINES

### New Features
- **ALWAYS**: Use chunked system imports
- **ALWAYS**: Add translations to appropriate chunk files
- **ALWAYS**: Test with ES (primary) and EN (secondary) languages
- **NEVER**: Create standalone translation files

### Maintenance Rules
- **Language Addition**: Add to `supportedLanguageChunks` + create chunk file
- **Translation Updates**: Modify chunk files only
- **System Changes**: Modify `i18n-chunked.ts` only
- **Utilities**: Add to `i18n-utils.ts` only

### Code Review Checklist
- [ ] Uses chunked system imports only
- [ ] No new i18n files created
- [ ] No duplicate translation logic
- [ ] Spanish-first implementation
- [ ] Proper chunk file usage

## 🚨 EMERGENCY PROTOCOLS

### If Multiple Systems Detected
1. **STOP DEVELOPMENT**
2. **Identify duplicate**
3. **Migrate to chunked system**
4. **Delete duplicate**
5. **Update imports**

### Violation Response
- **Immediate**: Reject any PR with i18n duplicates
- **Required**: Full migration to chunked system
- **Mandatory**: Update all imports to use single source

## 📊 SYSTEM OVERVIEW

```
src/lib/
├── i18n-chunked.ts          # PRIMARY SYSTEM (main entry point)
├── i18n.ts                  # LEGACY WRAPPER (backward compatibility)
├── i18n-utils.ts            # UTILITIES (formatting, hooks)
├── chunks/                  # LANGUAGE CHUNKS
│   ├── es.chunk.ts         # Spanish (PRIMARY)
│   ├── en.chunk.ts         # English (SECONDARY)
│   ├── fr.chunk.ts         # French
│   ├── de.chunk.ts         # German
│   ├── ru.chunk.ts         # Russian
│   └── ar.chunk.ts         # Arabic
├── providers/
│   └── language-provider.ts # Provider architecture
└── services/
    └── translation-service.ts # Service layer
```

## 🎯 SUCCESS CRITERIA

- **ONE**: Single chunked i18n system operational
- **ZERO**: Alternative i18n implementations
- **100%**: Import compliance to chunked system
- **ES-FIRST**: Spanish as primary language
- **PERFORMANT**: Chunked loading for optimal performance

---

**Remember: UNITY IS STRENGTH. ONE SYSTEM, NO CONFUSION, MAXIMUM PERFORMANCE.**