# i18n Implementation Audit Report

Generated on: 2025-08-26T04:17:39.664Z

## 📊 Summary

- **Total Files Analyzed**: 195
- **Fully Implemented**: 17 (9%)
- **Partially Implemented**: 40 (21%)
- **Not Implemented**: 138 (71%)

## 📋 Files Needing Work

- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/[lang]/layout.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/billing/plans/route.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/billing/subscription/route.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/billing/usage/route.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/calendar/events/route.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/calendar/product-events/route.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/calendar/promotions/route.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/calendar/statistics/route.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/calendar/upcoming/route.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/webhooks/stripe/route.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/calendario/page.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/categories/[slug]/page.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/categories/page.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/checkout/page.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/checkout/success/page.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/collections/page.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/dashboard/page.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/layout.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/offline/page.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/orders/[orderNumber]/page.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/orders/page.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/ref/[code]/page.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/search/page.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/sign-in/page.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/sign-up/page.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/track/page.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/wishlist/page.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/application/interfaces/external-services.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/application/interfaces/index.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/application/interfaces/repositories.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/application/use-cases/index.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/application/use-cases/product-use-cases.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/AddressAutocomplete.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/BillingExample.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/Breadcrumbs.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/CalendarWidget.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/CartAbandonmentRecovery.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ColorPalette.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ColorSystemProvider.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ConvexClientProvider.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/CurrencyProvider.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/CurrencySelector.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/CustomClerkPricing.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/EnhancedProductCard.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ErrorBoundary.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/LanguageAttributes.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/LanguageSwitcher.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/MegaMenu.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/OptimizedImage.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/OrderCancellation.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/OrderNotifications.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/OrderStatusTracker.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/PaymentGated.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ProductGallery.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ProductRecommendations.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ProductVariants.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ReviewForm.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ReviewList.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/SocialShareButtons.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/StarRating.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/StockIndicator.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ThemeProvider.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ThemeToggle.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/WishlistButton.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/alert-dialog.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/avatar.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/badge.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/button.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/calendar.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/card.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/checkbox.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/dialog.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/dropdown-menu.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/input.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/label.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/progress.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/select.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/separator.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/slider.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/switch.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/table.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/tabs.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/textarea.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/convex/_generated/api.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/entities/base-entity.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/entities/cart.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/entities/category.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/entities/index.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/entities/order.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/entities/product.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/entities/promotion.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/entities/user.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/services/calendar-service.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/services/cart-service.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/services/index.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/services/personalization-service.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/services/product-service.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/services/promotion-service.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/services/social-media-service.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/calendar.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/cart.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/category.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/common.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/index.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/inventory.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/order.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/product.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/review.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/seo.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/user.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/value-objects/address.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/value-objects/email.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/value-objects/index.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/value-objects/money.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/value-objects/phone.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/value-objects/seo-score.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/value-objects/slug.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/hooks/useAdvancedCart.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/hooks/useCart.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/hooks/useColors.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/hooks/useLazyLanguage.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/hooks/usePWA.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/hooks/usePersonalization.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/affiliate.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/ai-seo.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/analytics.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/api-security.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/api.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/auth-bypass.tsx
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/auth-utils.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/chunks/ar.chunk.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/chunks/de.chunk.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/chunks/en.chunk.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/chunks/es.chunk.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/chunks/fr.chunk.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/chunks/ru.chunk.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/color-types.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/colors.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/currency.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/env.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/i18n-utils.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/i18n.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/inventory.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/lazy-language-loader.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/mock-data.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/performance-cache.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/performance.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/prisma.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/promotions.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/providers/language-provider.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/schema-markup.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/seo-utils.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/services/translation-service.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/social.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/subscription.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/translation-utils.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/translation-validation.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/types/i18n.types.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/utils.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/constants/app.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/constants/business-rules.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/constants/index.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/constants/ui.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/errors/application-errors.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/errors/base-error.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/errors/domain-errors.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/errors/index.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/errors/infrastructure-errors.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/types/api.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/types/forms.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/types/index.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/types/ui.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/utils/date.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/utils/formatting.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/utils/index.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/utils/number.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/utils/string.ts
- /home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/utils/validation.ts

## 🔑 Most Common Missing Translation Keys

- `common`
- `product`
- `nav`
- `checkout`
- `errors`
- `seo`
- `cart`
- `footer`
- ` `
- `nav.collections`

## 📁 Detailed Results by Status

### ✅ Fully Implemented

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/[lang]/page.tsx**
  - Translation Keys: 18

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/cart/page.tsx**
  - Translation Keys: 37
  - ⚠️ Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/page.tsx**
  - Translation Keys: 30

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/products/[slug]/page.tsx**
  - Translation Keys: 20
  - ⚠️ Hardcoded Text: 12 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/products/page.tsx**
  - Translation Keys: 29
  - ⚠️ Hardcoded Text: 5 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/Footer.tsx**
  - Translation Keys: 21

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/Header.tsx**
  - Translation Keys: 10

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/LanguageProvider.tsx**
  - Translation Keys: 1
  - ⚠️ Hardcoded Text: 5 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/LanguageSEO.tsx**
  - Translation Keys: 1

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ProductCard.tsx**
  - Translation Keys: 14
  - ⚠️ Hardcoded Text: 3 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/SearchBar.tsx**
  - Translation Keys: 1
  - ⚠️ Hardcoded Text: 4 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/hooks/useI18nUtils.ts**
  - Translation Keys: 5

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/hooks/useLanguage.ts**
  - Translation Keys: 2
  - ⚠️ Hardcoded Text: 3 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/hooks/i18n-hooks.ts**
  - Translation Keys: 289
  - ⚠️ Hardcoded Text: 2 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/i18n-audit.ts**
  - Translation Keys: 1

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/i18n-chunked.ts**
  - Translation Keys: 1

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/loaders/language-loader.ts**
  - Translation Keys: 2
  - ⚠️ Hardcoded Text: 3 items

### ⚠️ Partially Implemented

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/[lang]/layout.tsx**
  - Translation Keys: 0

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/calendar/events/route.ts**
  - Translation Keys: 3
  - Missing Keys: category, status, limit

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/calendar/product-events/route.ts**
  - Translation Keys: 2
  - Missing Keys: productId, limit

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/calendar/promotions/route.ts**
  - Translation Keys: 2
  - Missing Keys: active, limit

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/calendar/upcoming/route.ts**
  - Translation Keys: 2
  - Missing Keys: limit, publicOnly

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/webhooks/stripe/route.ts**
  - Translation Keys: 1
  - Missing Keys: stripe-signature

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/orders/page.tsx**
  - Translation Keys: 1
  - Missing Keys: user@example.com
  - Hardcoded Text: 21 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/ref/[code]/page.tsx**
  - Translation Keys: 1
  - Missing Keys: /
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/search/page.tsx**
  - Translation Keys: 3
  - Missing Keys: q,  ,  
  - Hardcoded Text: 18 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/track/page.tsx**
  - Translation Keys: 2
  - Missing Keys: order, email
  - Hardcoded Text: 28 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/BillingExample.tsx**
  - Translation Keys: 3
  - Missing Keys: Suscripción cancelada exitosamente, Error al cancelar la suscripción, Error al cancelar la suscripción
  - Hardcoded Text: 29 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/Breadcrumbs.tsx**
  - Translation Keys: 1
  - Missing Keys: /

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ColorSystemProvider.tsx**
  - Translation Keys: 3
  - Missing Keys:  ,  ,  
  - Hardcoded Text: 2 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/CurrencySelector.tsx**
  - Translation Keys: 0
  - Hardcoded Text: 6 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/EnhancedProductCard.tsx**
  - Translation Keys: 1
  - Missing Keys: ${window.location.origin}/products/${product.slug}
  - Hardcoded Text: 6 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/LanguageAttributes.tsx**
  - Translation Keys: 0

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/LanguageSwitcher.tsx**
  - Translation Keys: 0
  - Hardcoded Text: 4 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/MegaMenu.tsx**
  - Translation Keys: 2
  - Missing Keys: ,, ,
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/SocialShareButtons.tsx**
  - Translation Keys: 1
  - Missing Keys: ${content.description}\n\n${content.url}
  - Hardcoded Text: 3 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/convex/_generated/api.ts**
  - Translation Keys: 1
  - Missing Keys: mock://convex.cloud

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/services/calendar-service.ts**
  - Translation Keys: 2
  - Missing Keys: /api/calendar/statistics,  

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/services/social-media-service.ts**
  - Translation Keys: 1
  - Missing Keys: ${shareContent.description}\n\n${shareContent.url}

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/value-objects/email.ts**
  - Translation Keys: 2
  - Missing Keys: @, @

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/hooks/useLazyLanguage.ts**
  - Translation Keys: 0
  - Hardcoded Text: 5 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/hooks/usePWA.ts**
  - Translation Keys: 2
  - Missing Keys: pwa-show-install-prompt, pwa-hide-install-prompt
  - Hardcoded Text: 2 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/ai-seo.ts**
  - Translation Keys: 1
  - Missing Keys: ,

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/api-security.ts**
  - Translation Keys: 3
  - Missing Keys: user-agent, x-forwarded-for, x-real-ip

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/auth-utils.ts**
  - Translation Keys: 5
  - Missing Keys: origin, referer, user-agent, x-forwarded-for, x-real-ip

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/colors.ts**
  - Translation Keys: 9
  - Missing Keys:  ,  ,  ,  ,  ,  ,  ,  ,  
  - Hardcoded Text: 2 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/currency.ts**
  - Translation Keys: 1
  - Missing Keys: -

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/env.ts**
  - Translation Keys: 3
  - Missing Keys: development, info, ./prisma

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/i18n-utils.ts**
  - Translation Keys: 0

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/i18n.ts**
  - Translation Keys: 0

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/lazy-language-loader.ts**
  - Translation Keys: 6
  - Missing Keys: ./chunks/en.chunk, ./chunks/es.chunk, ./chunks/de.chunk, ./chunks/fr.chunk, ./chunks/ar.chunk, ./chunks/ru.chunk
  - Hardcoded Text: 3 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/performance.ts**
  - Translation Keys: 4
  - Missing Keys: link, link, web-vitals, link
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/providers/language-provider.ts**
  - Translation Keys: 2
  - Missing Keys: ., ../chunks/${languageCode}.chunk
  - Hardcoded Text: 3 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/schema-markup.ts**
  - Translation Keys: 2
  - Missing Keys: T,  

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/translation-utils.ts**
  - Translation Keys: 2
  - Missing Keys: ., .

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/utils/formatting.ts**
  - Translation Keys: 1
  - Missing Keys: en-US
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/utils/string.ts**
  - Translation Keys: 1
  - Missing Keys: @
  - Hardcoded Text: 1 items

### ❌ Not Implemented

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/billing/plans/route.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/billing/subscription/route.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/billing/usage/route.ts**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/api/calendar/statistics/route.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/calendario/page.tsx**
  - Hardcoded Text: 28 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/categories/[slug]/page.tsx**
  - Hardcoded Text: 23 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/categories/page.tsx**
  - Hardcoded Text: 9 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/checkout/page.tsx**
  - Hardcoded Text: 44 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/checkout/success/page.tsx**
  - Hardcoded Text: 40 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/collections/page.tsx**
  - Hardcoded Text: 28 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/dashboard/page.tsx**
  - Hardcoded Text: 26 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/layout.tsx**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/offline/page.tsx**
  - Hardcoded Text: 16 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/orders/[orderNumber]/page.tsx**
  - Hardcoded Text: 24 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/sign-in/page.tsx**
  - Hardcoded Text: 2 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/sign-up/page.tsx**
  - Hardcoded Text: 2 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/app/wishlist/page.tsx**
  - Hardcoded Text: 30 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/application/interfaces/external-services.ts**
  - Hardcoded Text: 27 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/application/interfaces/index.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/application/interfaces/repositories.ts**
  - Hardcoded Text: 32 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/application/use-cases/index.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/application/use-cases/product-use-cases.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/AddressAutocomplete.tsx**
  - Hardcoded Text: 6 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/CalendarWidget.tsx**
  - Hardcoded Text: 6 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/CartAbandonmentRecovery.tsx**
  - Hardcoded Text: 8 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ColorPalette.tsx**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ConvexClientProvider.tsx**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/CurrencyProvider.tsx**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/CustomClerkPricing.tsx**
  - Hardcoded Text: 16 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ErrorBoundary.tsx**
  - Hardcoded Text: 15 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/OptimizedImage.tsx**
  - Hardcoded Text: 3 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/OrderCancellation.tsx**
  - Hardcoded Text: 27 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/OrderNotifications.tsx**
  - Hardcoded Text: 21 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/OrderStatusTracker.tsx**
  - Hardcoded Text: 18 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/PaymentGated.tsx**
  - Hardcoded Text: 14 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ProductGallery.tsx**
  - Hardcoded Text: 5 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ProductRecommendations.tsx**
  - Hardcoded Text: 10 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ProductVariants.tsx**
  - Hardcoded Text: 5 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ReviewForm.tsx**
  - Hardcoded Text: 8 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ReviewList.tsx**
  - Hardcoded Text: 21 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/StarRating.tsx**
  - Hardcoded Text: 19 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/StockIndicator.tsx**
  - Hardcoded Text: 12 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ThemeProvider.tsx**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ThemeToggle.tsx**
  - Hardcoded Text: 2 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/WishlistButton.tsx**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/alert-dialog.tsx**
  - Hardcoded Text: 11 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/avatar.tsx**
  - Hardcoded Text: 5 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/badge.tsx**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/button.tsx**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/calendar.tsx**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/card.tsx**
  - Hardcoded Text: 5 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/checkbox.tsx**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/dialog.tsx**
  - Hardcoded Text: 7 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/dropdown-menu.tsx**
  - Hardcoded Text: 15 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/input.tsx**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/label.tsx**
  - Hardcoded Text: 2 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/progress.tsx**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/select.tsx**
  - Hardcoded Text: 13 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/separator.tsx**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/slider.tsx**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/switch.tsx**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/table.tsx**
  - Hardcoded Text: 7 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/tabs.tsx**
  - Hardcoded Text: 5 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/components/ui/textarea.tsx**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/entities/base-entity.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/entities/cart.ts**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/entities/category.ts**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/entities/index.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/entities/order.ts**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/entities/product.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/entities/promotion.ts**
  - Hardcoded Text: 2 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/entities/user.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/services/cart-service.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/services/index.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/services/personalization-service.ts**
  - Hardcoded Text: 5 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/services/product-service.ts**
  - Hardcoded Text: 2 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/services/promotion-service.ts**
  - Hardcoded Text: 2 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/calendar.ts**
  - Hardcoded Text: 2 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/cart.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/category.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/common.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/index.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/inventory.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/order.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/product.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/review.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/seo.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/types/user.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/value-objects/address.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/value-objects/index.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/value-objects/money.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/value-objects/phone.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/value-objects/seo-score.ts**
  - Hardcoded Text: 3 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/domain/value-objects/slug.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/hooks/useAdvancedCart.tsx**
  - Hardcoded Text: 6 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/hooks/useCart.tsx**
  - Hardcoded Text: 7 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/hooks/useColors.ts**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/hooks/usePersonalization.ts**
  - Hardcoded Text: 7 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/affiliate.ts**
  - Hardcoded Text: 6 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/analytics.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/api.ts**
  - Hardcoded Text: 4 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/auth-bypass.tsx**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/chunks/ar.chunk.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/chunks/de.chunk.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/chunks/en.chunk.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/chunks/es.chunk.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/chunks/fr.chunk.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/chunks/ru.chunk.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/color-types.ts**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/inventory.ts**
  - Hardcoded Text: 8 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/mock-data.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/performance-cache.ts**
  - Hardcoded Text: 7 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/prisma.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/promotions.ts**
  - Hardcoded Text: 7 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/seo-utils.ts**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/services/translation-service.ts**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/social.ts**
  - Hardcoded Text: 6 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/subscription.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/translation-validation.ts**
  - Hardcoded Text: 6 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/types/i18n.types.ts**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/lib/utils.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/constants/app.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/constants/business-rules.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/constants/index.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/constants/ui.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/errors/application-errors.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/errors/base-error.ts**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/errors/domain-errors.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/errors/index.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/errors/infrastructure-errors.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/types/api.ts**
  - Hardcoded Text: 2 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/types/forms.ts**
  - Hardcoded Text: 11 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/types/index.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/types/ui.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/utils/date.ts**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/utils/index.ts**

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/utils/number.ts**
  - Hardcoded Text: 1 items

- **/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store/src/shared/utils/validation.ts**
  - Hardcoded Text: 1 items

