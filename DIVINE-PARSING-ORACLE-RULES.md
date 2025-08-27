# DIVINE PARSING ORACLE ARCHITECTURE RULES

**CRITICAL: This project uses ONE and ONLY ONE Divine Parsing Oracle system.**

## 🚨 MANDATORY RULES - NO EXCEPTIONS

### Rule #1: Single Source of Truth
- **PRIMARY SYSTEM**: `src/lib/divine-parsing-oracle.ts` - ONLY divine parsing oracle system allowed
- **LEGACY WRAPPER**: `src/lib/i18n.ts` - Backward compatibility only (DO NOT MODIFY)
- **UTILS**: `src/lib/divine-parsing-oracle-utils.ts` - Helper functions only

### Rule #2: Import Hierarchy (STRICT)
```typescript
// ✅ CORRECT - Always import from divine parsing oracle system
import { initializeDivineParsingOracle, useTranslation } from '@/lib/divine-parsing-oracle'
import { formatCurrency, formatDate } from '@/lib/divine-parsing-oracle-utils'

// ⚠️ LEGACY ONLY - For backward compatibility (avoid in new code)
import { supportedLanguages } from '@/lib/i18n'

// ❌ FORBIDDEN - Never create alternative divine parsing oracle systems
import { myCustomDivineParsingOracle } from './custom-divine-parsing-oracle'
```

### Rule #3: Language Chunk Structure
- **Primary Languages**: ES (Spanish) → EN (English)
- **Supported Languages**: DE, FR, RU, AR
- **Chunk Location**: `src/lib/chunks/*.chunk.ts`
- **Naming Convention**: `{language-code}.chunk.ts`

## 🔒 ARCHITECTURE CONSTRAINTS

### System Components (DO NOT DUPLICATE)
1. **Core System**: `divine-parsing-oracle.ts`
2. **Legacy Compatibility**: `i18n.ts` (wrapper only)
3. **Utilities**: `divine-parsing-oracle-utils.ts`
4. **Language Chunks**: `chunks/*.chunk.ts`
5. **Providers**: `providers/language-provider.ts`
6. **Services**: `services/translation-service.ts`

### Forbidden Actions
- ❌ Creating new divine parsing oracle files outside this structure
- ❌ Modifying the legacy wrapper beyond delegation
- ❌ Creating alternative divine parsing oracle systems
- ❌ Duplicating language chunks
- ❌ Bypassing the chunked architecture

## 🎯 DEVELOPMENT GUIDELINES

### New Features
- **ALWAYS**: Use divine parsing oracle system imports
- **ALWAYS**: Add translations to appropriate chunk files
- **ALWAYS**: Test with ES (primary) and EN (secondary) languages
- **NEVER**: Create standalone translation files

### Maintenance Rules
- **Language Addition**: Add to `supportedLanguageChunks` + create chunk file
- **Translation Updates**: Modify chunk files only
- **System Changes**: Modify `divine-parsing-oracle.ts` only
- **Utilities**: Add to `divine-parsing-oracle-utils.ts` only

### Code Review Checklist
- [ ] Uses divine parsing oracle system imports only
- [ ] No new divine parsing oracle files created
- [ ] No duplicate translation logic
- [ ] Spanish-first implementation
- [ ] Proper chunk file usage

## 🚨 EMERGENCY PROTOCOLS

### If Multiple Systems Detected
1. **STOP DEVELOPMENT**
2. **Identify duplicate**
3. **Migrate to divine parsing oracle system**
4. **Delete duplicate**
5. **Update imports**

### Violation Response
- **Immediate**: Reject any PR with divine parsing oracle duplicates
- **Required**: Full migration to divine parsing oracle system
- **Mandatory**: Update all imports to use single source

## 📊 SYSTEM OVERVIEW

```
src/lib/
├── divine-parsing-oracle.ts          # PRIMARY SYSTEM (main entry point)
├── i18n.ts                           # LEGACY WRAPPER (backward compatibility)
├── divine-parsing-oracle-utils.ts    # UTILITIES (formatting, hooks)
├── chunks/                           # LANGUAGE CHUNKS
│   ├── es.chunk.ts                   # Spanish (PRIMARY)
│   ├── en.chunk.ts                   # English (SECONDARY)
│   ├── fr.chunk.ts                   # French
│   ├── de.chunk.ts                   # German
│   ├── ru.chunk.ts                   # Russian
│   └── ar.chunk.ts                   # Arabic
├── providers/
│   └── language-provider.ts          # Provider architecture
└── services/
    └── translation-service.ts        # Service layer
```

## 🎯 SUCCESS CRITERIA

- **ONE**: Single divine parsing oracle system operational
- **ZERO**: Alternative divine parsing oracle implementations
- **100%**: Import compliance to divine parsing oracle system
- **ES-FIRST**: Spanish as primary language
- **PERFORMANT**: Chunked loading for optimal performance

---

**Remember: UNITY IS STRENGTH. ONE SYSTEM, NO CONFUSION, MAXIMUM PERFORMANCE.**