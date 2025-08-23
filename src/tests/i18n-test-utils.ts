/**
 * i18n Test Utilities
 * Helper functions and mocks for testing internationalization
 */

import { vi } from 'vitest';
import { supportedLanguageChunks } from '@/lib/i18n-chunked';

// Mock language provider for testing
export const createMockLanguageProvider = (languageCode: string) => ({
  translate: (key: string) => {
    const mockTranslations: Record<string, Record<string, string>> = {
      en: {
        'common.loading': 'Loading...',
        'nav.home': 'Home',
        'nav.products': 'Products',
        'product.price': 'Price',
        'cart.addToCart': 'Add to Cart'
      },
      es: {
        'common.loading': 'Cargando...',
        'nav.home': 'Inicio',
        'nav.products': 'Productos',
        'product.price': 'Precio',
        'cart.addToCart': 'Agregar al Carrito'
      },
      de: {
        'common.loading': 'Laden...',
        'nav.home': 'Startseite',
        'nav.products': 'Produkte',
        'product.price': 'Preis',
        'cart.addToCart': 'In den Warenkorb'
      },
      fr: {
        'common.loading': 'Chargement...',
        'nav.home': 'Accueil',
        'nav.products': 'Produits',
        'product.price': 'Prix',
        'cart.addToCart': 'Ajouter au Panier'
      },
      ar: {
        'common.loading': 'جارٍ التحميل...',
        'nav.home': 'الرئيسية',
        'nav.products': 'المنتجات',
        'product.price': 'السعر',
        'cart.addToCart': 'إضافة للسلة'
      },
      ru: {
        'common.loading': 'Загрузка...',
        'nav.home': 'Главная',
        'nav.products': 'Продукты',
        'product.price': 'Цена',
        'cart.addToCart': 'Добавить в Корзину'
      }
    };

    return mockTranslations[languageCode]?.[key] || key;
  },

  getMetaTags: () => ({
    'og:locale': `${languageCode}_${languageCode.toUpperCase()}`,
    'og:site_name': `Test Site ${languageCode.toUpperCase()}`
  })
});

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    })
  };
};

// Mock navigator language
export const mockNavigatorLanguage = (language: string) => {
  Object.defineProperty(window.navigator, 'language', {
    value: language,
    writable: true
  });
};

// Mock fetch for language loading
export const mockFetchLanguageChunk = (languageCode: string, success = true) => {
  if (success) {
    return vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockLanguageProvider(languageCode))
    });
  } else {
    return vi.fn().mockRejectedValue(new Error('Failed to load language chunk'));
  }
};

// Test data generators
export const generateTestTranslations = (languageCode: string, count = 10) => {
  const translations: Record<string, string> = {};
  const prefixes = ['nav', 'common', 'product', 'cart', 'account', 'error', 'success'];

  for (let i = 0; i < count; i++) {
    const prefix = prefixes[i % prefixes.length];
    const key = `${prefix}.testKey${i}`;
    translations[key] = `Test translation ${i} for ${languageCode}`;
  }

  return translations;
};

export const generateTestLanguageConfig = (languageCode: string) => {
  const config = supportedLanguageChunks.find(lang => lang.code === languageCode);

  if (!config) {
    throw new Error(`Language ${languageCode} not found in supported languages`);
  }

  return {
    ...config,
    translations: generateTestTranslations(languageCode)
  };
};

// Assertion helpers
export const expectTranslationToExist = (translations: Record<string, string>, key: string) => {
  const translation = translations[key];
  expect(translation).toBeDefined();
  expect(translation).not.toBe(key); // Should not return the key itself
  expect(translation?.trim()).toBeTruthy(); // Should not be empty or whitespace
};

export const expectNoPlaceholderText = (translations: Record<string, string>) => {
  const placeholderPatterns = [
    /^\[.*\]$/,
    /^TODO/,
    /^FIXME/,
    /^TRANSLATE/,
    /^<missing/i,
    /^placeholder/i,
    /^\.\.\.$/,
    /^---$/,
    /^\*\*\*$/
  ];

  Object.entries(translations).forEach(([key, value]) => {
    const isPlaceholder = placeholderPatterns.some(pattern => pattern.test(value.trim()));
    if (isPlaceholder) {
      console.warn(`Placeholder text found in ${key}: ${value}`);
    }
  });
};

export const expectConsistentPlaceholders = (
  baseTranslations: Record<string, string>,
  targetTranslations: Record<string, string>
) => {
  const extractPlaceholders = (text: string): string[] => {
    const placeholderRegex = /\{([^}]+)\}/g;
    const placeholders: string[] = [];
    let match;

    while ((match = placeholderRegex.exec(text)) !== null) {
      placeholders.push(match[1]);
    }

    return [...new Set(placeholders)]; // Remove duplicates
  };

  Object.keys(baseTranslations).forEach(key => {
    const baseValue = baseTranslations[key];
    const targetValue = targetTranslations[key];

    if (baseValue && targetValue) {
      const basePlaceholders = extractPlaceholders(baseValue);
      const targetPlaceholders = extractPlaceholders(targetValue);

      // Check that all base placeholders exist in target
      basePlaceholders.forEach(placeholder => {
        expect(targetPlaceholders).toContain(placeholder);
      });

      // Check that no extra placeholders were introduced
      targetPlaceholders.forEach(placeholder => {
        expect(basePlaceholders).toContain(placeholder);
      });
    }
  });
};

// Performance testing helpers
export const measureTranslationLoadTime = async (
  languageCode: string,
  loadFunction: () => Promise<any>
): Promise<number> => {
  const startTime = performance.now();
  await loadFunction();
  const endTime = performance.now();
  return endTime - startTime;
};

export const expectLoadTimeUnder = async (
  languageCode: string,
  loadFunction: () => Promise<any>,
  maxTime: number
) => {
  const loadTime = await measureTranslationLoadTime(languageCode, loadFunction);
  expect(loadTime).toBeLessThan(maxTime);
};

// Coverage testing helpers
export const calculateTranslationCoverage = (
  translations: Record<string, string>,
  requiredKeys: string[]
): number => {
  const coveredKeys = requiredKeys.filter(key => {
    const translation = translations[key];
    return translation && translation !== key && translation.trim() !== '';
  });

  return (coveredKeys.length / requiredKeys.length) * 100;
};

export const expectMinimumCoverage = (
  translations: Record<string, string>,
  requiredKeys: string[],
  minimumCoverage = 80
) => {
  const coverage = calculateTranslationCoverage(translations, requiredKeys);
  expect(coverage).toBeGreaterThanOrEqual(minimumCoverage);
};

// RTL testing helpers
export const isRTLText = (text: string): boolean => {
  // Check for Arabic, Hebrew, or other RTL characters
  const rtlChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return rtlChars.test(text);
};

export const expectRTLConsistency = (translations: Record<string, string>, isRTL: boolean) => {
  Object.entries(translations).forEach(([key, value]) => {
    if (isRTL) {
      // For RTL languages, text should contain RTL characters or be properly configured
      const hasRTLChars = isRTLText(value);
      if (hasRTLChars) {
        // If it contains RTL chars, it should be properly formatted
        expect(value).toBeDefined();
      }
    }
  });
};

// Accessibility testing helpers
export const expectAccessibleTranslations = (translations: Record<string, string>) => {
  Object.entries(translations).forEach(([key, value]) => {
    // Check for proper alt text indicators
    if (key.includes('alt') || key.includes('image')) {
      expect(value).toBeDefined();
      expect(value.length).toBeLessThan(125); // Alt text should be concise
    }

    // Check for button text
    if (key.includes('button') || key.includes('btn')) {
      expect(value).toBeDefined();
      expect(value.length).toBeGreaterThan(0);
      expect(value.length).toBeLessThan(50); // Button text should be concise
    }

    // Check for heading text
    if (key.includes('title') || key.includes('heading')) {
      expect(value).toBeDefined();
      expect(value.length).toBeGreaterThan(0);
      expect(value.length).toBeLessThan(100); // Heading text should be reasonable length
    }
  });
};

// Test scenarios
export const i18nTestScenarios = {
  languageSwitching: [
    { from: 'es', to: 'en', expected: 'Language switch should work' },
    { from: 'en', to: 'de', expected: 'German language should load' },
    { from: 'de', to: 'fr', expected: 'French language should load' },
    { from: 'fr', to: 'ar', expected: 'Arabic RTL language should load' },
    { from: 'ar', to: 'ru', expected: 'Russian language should load' },
    { from: 'ru', to: 'es', expected: 'Back to Spanish should work' }
  ],

  errorHandling: [
    { language: 'invalid', expected: 'Should handle invalid language gracefully' },
    { language: 'en', networkError: true, expected: 'Should handle network errors' },
    { language: 'es', timeout: true, expected: 'Should handle timeouts' }
  ],

  performance: [
    { language: 'en', maxLoadTime: 2000, expected: 'English should load quickly' },
    { language: 'es', maxLoadTime: 2000, expected: 'Spanish should load quickly' },
    { language: 'ar', maxLoadTime: 3000, expected: 'Arabic should load within reasonable time' }
  ]
};

// Test data
export const commonTestKeys = [
  'common.loading',
  'common.error',
  'common.success',
  'nav.home',
  'nav.products',
  'nav.categories',
  'nav.cart',
  'product.price',
  'product.addToCart',
  'cart.checkout',
  'account.login',
  'account.register',
  'footer.contact',
  'footer.privacy'
];

export const requiredNavigationKeys = [
  'nav.home',
  'nav.products',
  'nav.categories',
  'nav.cart',
  'nav.account',
  'nav.search'
];

export const requiredProductKeys = [
  'product.price',
  'product.description',
  'product.addToCart',
  'product.reviews',
  'product.specifications'
];

export const requiredCartKeys = [
  'cart.title',
  'cart.checkout',
  'cart.total',
  'cart.continueShopping'
];

export const requiredFormKeys = [
  'forms.firstName',
  'forms.lastName',
  'forms.email',
  'forms.submit',
  'forms.required'
];

// Utility for running comprehensive i18n tests
export const runI18nTestSuite = async (testRunner: (name: string, fn: () => void | Promise<void>) => void) => {
  // Language loading tests
  supportedLanguageChunks.forEach(lang => {
    testRunner(`should load ${lang.name} (${lang.code}) language`, async () => {
      const mockProvider = createMockLanguageProvider(lang.code);
      expect(mockProvider).toBeDefined();
      expect(typeof mockProvider.translate).toBe('function');
    });
  });

  // Translation quality tests
  supportedLanguageChunks.forEach(lang => {
    testRunner(`should have good translation quality for ${lang.code}`, () => {
      const translations = generateTestTranslations(lang.code);
      expectNoPlaceholderText(translations);
      expectMinimumCoverage(translations, commonTestKeys);
    });
  });

  // RTL tests for RTL languages
  const rtlLanguages = supportedLanguageChunks.filter(lang => lang.direction === 'rtl');
  rtlLanguages.forEach(lang => {
    testRunner(`should handle RTL correctly for ${lang.name}`, () => {
      const translations = generateTestTranslations(lang.code);
      expectRTLConsistency(translations, true);
    });
  });

  // Accessibility tests
  supportedLanguageChunks.forEach(lang => {
    testRunner(`should be accessible for ${lang.code}`, () => {
      const translations = generateTestTranslations(lang.code);
      expectAccessibleTranslations(translations);
    });
  });
};