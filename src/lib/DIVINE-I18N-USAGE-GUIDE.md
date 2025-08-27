# Divine Parsing Oracle i18n System - Usage Guide

## Overview

The Divine Parsing Oracle i18n system is the **single source of truth** for internationalization in this project. It provides a scalable, chunked architecture for language support with automatic loading and caching.

## Architecture

### Core Components

1. **Language Chunks** (`/src/lib/chunks/`): Individual language implementations
2. **Language Provider Factory** (`/src/lib/providers/language-provider.ts`): Manages chunk loading and caching
3. **Divine Parsing Oracle** (`/src/lib/divine-parsing-oracle.ts`): Main system coordinator
4. **Middleware** (`/middleware-divine-parsing-oracle.ts`): Handles URL routing and language detection
5. **Hooks** (`/src/lib/hooks/i18n-hooks.ts`): React integration with type-safe translations

### Supported Languages

- **es** (Spanish) - Default/Primary language
- **en** (English)
- **de** (German)
- **fr** (French)
- **ar** (Arabic) - RTL support
- **ru** (Russian)

## Usage Patterns

### 1. Simple Translation Hook (Most Components)

For basic translation needs, use the `useLanguage` hook from the LanguageProvider:

```tsx
import { useLanguage } from "@/components/LanguageProvider";

export function MyComponent() {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <p>{t('product.description')}</p>
    </div>
  );
}
```

### 2. Advanced Type-Safe Hooks (Complex Components)

For components needing type safety and advanced features:

```tsx
import { useLanguageSwitcher, useNavigationTranslations } from "@/lib/hooks/i18n-hooks";

export function Navigation() {
  const { currentLanguage, setLanguage } = useLanguageSwitcher();
  const nav = useNavigationTranslations();

  return (
    <nav>
      <Link href="/">{nav.home}</Link>
      <Link href="/products">{nav.products}</Link>
    </nav>
  );
}
```

### 3. Unified Translation Hook (Migration Support)

For gradual migration between systems:

```tsx
import { useUnifiedTranslation } from "@/lib/divine-parsing-oracle-utils";

export function FlexibleComponent() {
  const { t, simpleT } = useUnifiedTranslation();

  return (
    <div>
      {/* Advanced interface */}
      <h1>{t('nav')('home')}</h1>
      {/* Simple interface */}
      <p>{simpleT('product.description')}</p>
    </div>
  );
}
```

## Key Translation Keys Structure

### Navigation (`nav.*`)

- `nav.home` - Home page
- `nav.products` - Products page
- `nav.categories` - Categories page
- `nav.collections` - Collections page
- `nav.blog` - Blog page
- `nav.contact` - Contact page
- `nav.cart` - Shopping cart
- `nav.account` - User account

### Common UI (`common.*`)

- `common.loading` - Loading state
- `common.error` - Error state
- `common.success` - Success state
- `common.cancel` - Cancel action
- `common.save` - Save action
- `common.edit` - Edit action
- `common.delete` - Delete action

### Products (`product.*`)

- `product.price` - Price label
- `product.addToCart` - Add to cart button
- `product.description` - Description label
- `product.inStock` - In stock status
- `product.outOfStock` - Out of stock status

### Cart (`cart.*`)

- `cart.title` - Cart page title
- `cart.empty` - Empty cart message
- `cart.checkout` - Checkout button
- `cart.total` - Total amount

## Best Practices

### 1. Consistent Hook Usage

- Use `useLanguage` for simple components
- Use advanced hooks (`useNavigationTranslations`, etc.) for complex components
- Avoid mixing different hook patterns in the same component

### 2. Translation Key Naming

- Use dot notation: `section.subsection.key`
- Keep keys descriptive but concise
- Follow existing patterns in the chunks

### 3. Fallback Handling

The system automatically provides fallbacks:

- Missing translation → English → Key itself
- Network error → Cached version → Fallback text

### 4. Language Switching

```tsx
const { setLanguage } = useLanguageSwitcher();

// Switch to Spanish
await setLanguage('es');

// The system will:
// 1. Update localStorage
// 2. Update document.lang attribute
// 3. Update URL (if needed)
// 4. Trigger re-render with new language
```

## Component Integration Checklist

### ✅ Required for all components

- [ ] Import appropriate translation hook
- [ ] Use `t()` function for all user-facing text
- [ ] Handle loading states if needed
- [ ] Test with different languages

### ✅ Required for language-aware components

- [ ] Use `useLanguageSwitcher` for language switching
- [ ] Update document title/meta tags
- [ ] Handle RTL languages if needed
- [ ] Test URL routing with language prefixes

## Middleware Integration

The divine parsing oracle middleware automatically:

- Detects language from URL path
- Falls back to browser preference
- Falls back to localStorage
- Redirects to appropriate language version
- Sets language cookie

## Performance Features

### 1. Chunked Loading

- Languages load on-demand
- Critical chunks preload automatically
- Non-critical chunks load lazily

### 2. Intelligent Caching

- Loaded chunks stay in memory
- Performance metrics tracked
- Automatic fallback handling

### 3. Batch Translations

```tsx
const { batchTranslate } = useBatchTranslation();
const translations = await batchTranslate(['nav.home', 'nav.products', 'nav.cart']);
```

## SEO Considerations

### 1. Hreflang Tags

The system automatically generates hreflang tags for:

- Default language: `/path`
- Other languages: `/lang/path`

### 2. Language-Specific Meta Tags

```tsx
const { getLanguageMeta } = useLanguage();
const meta = await getLanguageMeta('es'); // Returns localized meta tags
```

### 3. URL Structure

- Default language (es): `/products/123`
- Other languages: `/en/products/123`

## Testing

### 1. Language Switching

- Test all supported languages
- Verify URL updates correctly
- Check localStorage persistence

### 2. Translation Completeness

- Verify all translation keys exist
- Test fallback behavior
- Check for missing translations

### 3. Performance

- Monitor chunk loading times
- Verify caching behavior
- Test with slow networks

## Migration Guide

### From Legacy i18n

1. **Replace imports:**

   ```tsx
   // Old
   import { useTranslation } from '@/lib/i18n';

   // New
   import { useLanguage } from '@/components/LanguageProvider';
   ```

2. **Update translation calls:**

   ```tsx
   // Old
   const { t } = useTranslation();
   return t('home.title');

   // New
   const { t } = useLanguage();
   return t('nav.home');
   ```

3. **Update key names** to match the new structure

## Troubleshooting

### Common Issues

1. **Translations not loading**
   - Check if `initializeDivineParsingOracle()` was called
   - Verify chunk files exist
   - Check browser console for errors

2. **Language not switching**
   - Ensure middleware is properly integrated
   - Check localStorage for language preference
   - Verify URL routing

3. **Type errors with advanced hooks**
   - Use the simple `useLanguage` hook instead
   - Or use the `useUnifiedTranslation` hook for migration

### Debug Information

Enable debug mode by checking:

- Browser localStorage for `preferred-language`
- Network tab for chunk loading
- Console for initialization messages

## Future Enhancements

- [ ] Real-time translation updates
- [ ] A/B testing for translations
- [ ] Translation quality scoring
- [ ] Integration with translation services
- [ ] Pluralization support
- [ ] Context-aware translations
