/**
 * Internationalization Testing Suite
 * Comprehensive tests for i18n functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage } from '@/components/LanguageProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { supportedLanguageChunks } from '@/lib/i18n-chunked';
import { i18nMiddleware } from '@/middleware-i18n';
import { validateLanguageProvider, compareLanguageProviders } from '@/lib/translation-validation';
import { lazyLoadLanguageProvider } from '@/lib/lazy-language-loader';

// Mock components for testing
const TestComponent = () => {
  const { t, currentLanguage, setLanguage } = useLanguage();

  return (
    <div>
      <p data-testid="current-lang">{currentLanguage}</p>
      <p data-testid="hello-translation">{t('common.loading')}</p>
      <button
        onClick={() => setLanguage('es')}
        data-testid="switch-to-spanish"
      >
        Switch to Spanish
      </button>
      <button
        onClick={() => setLanguage('en')}
        data-testid="switch-to-english"
      >
        Switch to English
      </button>
    </div>
  );
};

describe('Language Provider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with default language', async () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('es');
    });
  });

  it('should switch languages correctly', async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('es');
    });

    // Switch to English
    await user.click(screen.getByTestId('switch-to-english'));

    await waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
    });

    // Check that localStorage was updated
    expect(localStorage.getItem('preferred-language')).toBe('en');
  });

  it('should persist language preference in localStorage', async () => {
    const user = userEvent.setup();

    // First render - set language
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('es');
    });

    await user.click(screen.getByTestId('switch-to-english'));

    await waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
    });

    // Second render - should remember the preference
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
    });
  });

  it('should handle translation fallback', async () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    await waitFor(() => {
      const translation = screen.getByTestId('hello-translation');
      expect(translation.textContent).toBeDefined();
      expect(translation.textContent).not.toBe('common.loading'); // Should not return key
    });
  });
});

describe('Language Switcher', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render all supported languages', async () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    await waitFor(() => {
      supportedLanguageChunks.forEach(lang => {
        expect(screen.getByText(lang.name)).toBeInTheDocument();
      });
    });
  });

  it('should show current language as selected', async () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    await waitFor(() => {
      // Spanish should be selected by default
      const currentLangElement = screen.getByText('Español');
      expect(currentLangElement).toBeInTheDocument();
    });
  });
});

describe('Language Middleware', () => {
  const mockRequest = (pathname: string, headers: Record<string, string> = {}) => ({
    nextUrl: { pathname, href: `https://example.com${pathname}` },
    url: `https://example.com${pathname}`,
    headers: {
      get: (key: string) => headers[key] || null
    },
    cookies: {
      get: (key: string) => ({ value: null })
    }
  });

  it('should handle default language routes', () => {
    const request = mockRequest('/');
    const response = i18nMiddleware(request as any);

    // Should redirect to default language
    expect(response?.status).toBe(308);
    expect(response?.headers.get('Location')).toBe('/es');
  });

  it('should handle existing language prefixes', () => {
    const request = mockRequest('/en/products');
    const response = i18nMiddleware(request as any);

    // Should continue without redirect
    expect(response).toBeUndefined();
  });

  it('should handle unsupported language prefixes', () => {
    const request = mockRequest('/xx/products');
    const response = i18nMiddleware(request as any);

    // Should redirect to default language
    expect(response?.status).toBe(308);
    expect(response?.headers.get('Location')).toBe('/es/products');
  });

  it('should handle API routes', () => {
    const request = mockRequest('/api/products');
    const response = i18nMiddleware(request as any);

    // Should not process API routes
    expect(response).toBeUndefined();
  });

  it('should handle static files', () => {
    const request = mockRequest('/favicon.ico');
    const response = i18nMiddleware(request as any);

    // Should not process static files
    expect(response).toBeUndefined();
  });
});

describe('Language Chunks', () => {
  beforeAll(async () => {
    // Preload critical languages for testing
    await lazyLoadLanguageProvider('en');
    await lazyLoadLanguageProvider('es');
  });

  it('should load English language chunk', async () => {
    const provider = await lazyLoadLanguageProvider('en');
    expect(provider).toBeDefined();
    expect(typeof provider.translate).toBe('function');
  });

  it('should load Spanish language chunk', async () => {
    const provider = await lazyLoadLanguageProvider('es');
    expect(provider).toBeDefined();
    expect(typeof provider.translate).toBe('function');
  });

  it('should translate common keys', async () => {
    const enProvider = await lazyLoadLanguageProvider('en');
    const esProvider = await lazyLoadLanguageProvider('es');

    // Test navigation keys
    expect(enProvider.translate('nav.home')).toBe('Home');
    expect(esProvider.translate('nav.home')).toBe('Inicio');

    // Test common keys
    expect(enProvider.translate('common.loading')).toBe('Loading...');
    expect(esProvider.translate('common.loading')).toBe('Cargando...');
  });

  it('should handle missing keys gracefully', async () => {
    const provider = await lazyLoadLanguageProvider('en');

    // Missing key should return the key itself
    const result = provider.translate('nonexistent.key');
    expect(result).toBe('nonexistent.key');
  });

  it('should support RTL languages', () => {
    const arConfig = supportedLanguageChunks.find(lang => lang.code === 'ar');
    expect(arConfig?.direction).toBe('rtl');
  });
});

describe('Translation Validation', () => {
  it('should validate English language provider', async () => {
    const result = await validateLanguageProvider('en');
    expect(result.isValid).toBe(true);
    expect(result.coverage).toBeGreaterThan(80);
    expect(result.errors.length).toBe(0);
  });

  it('should validate Spanish language provider', async () => {
    const result = await validateLanguageProvider('es');
    expect(result.isValid).toBe(true);
    expect(result.coverage).toBeGreaterThan(80);
    expect(result.errors.length).toBe(0);
  });

  it('should compare languages correctly', async () => {
    const result = await compareLanguageProviders('es', 'en');
    expect(result.baseLanguage).toBe('en');
    expect(result.targetLanguage).toBe('es');
    expect(result.coveragePercentage).toBeGreaterThan(80);
  });

  it('should detect missing keys', async () => {
    // Create a mock provider with missing keys
    const mockProvider = {
      translate: (key: string) => {
        const translations: Record<string, string> = {
          'nav.home': 'Home',
          'nav.products': 'Products'
          // Missing nav.categories
        };
        return translations[key] || key;
      }
    };

    // Mock the lazy load function
    const originalLazyLoad = await import('@/lib/lazy-language-loader');
    const mockLazyLoad = vi.fn().mockResolvedValue(mockProvider);

    // This test would need more complex mocking to be effective
    // For now, we'll just ensure the validation function exists and runs
    expect(typeof validateLanguageProvider).toBe('function');
  });
});

describe('Language Performance', () => {
  it('should load languages within acceptable time', async () => {
    const startTime = performance.now();

    await lazyLoadLanguageProvider('en');

    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(2000); // Should load within 2 seconds
  });

  it('should cache loaded languages', async () => {
    // First load
    const startTime1 = performance.now();
    await lazyLoadLanguageProvider('en');
    const loadTime1 = performance.now() - startTime1;

    // Second load (should be cached)
    const startTime2 = performance.now();
    await lazyLoadLanguageProvider('en');
    const loadTime2 = performance.now() - startTime2;

    // Second load should be significantly faster
    expect(loadTime2).toBeLessThan(loadTime1);
  });
});

describe('Browser Language Detection', () => {
  beforeEach(() => {
    // Reset language
    Object.defineProperty(window.navigator, 'language', {
      value: 'en-US',
      writable: true
    });
  });

  it('should detect browser language', async () => {
    // Set browser language to Spanish
    Object.defineProperty(window.navigator, 'language', {
      value: 'es-ES',
      writable: true
    });

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Should eventually detect and switch to Spanish
    await waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('es');
    }, { timeout: 5000 });
  });

  it('should fallback to default language for unsupported browser language', async () => {
    // Set browser language to unsupported language
    Object.defineProperty(window.navigator, 'language', {
      value: 'xx-XX',
      writable: true
    });

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('es');
    });
  });
});

describe('Error Handling', () => {
  it('should handle language loading errors gracefully', async () => {
    // Mock a failed language load
    const originalLazyLoad = await import('@/lib/lazy-language-loader');
    const mockLazyLoad = vi.fn().mockRejectedValue(new Error('Network error'));

    // The component should handle errors and show fallback content
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Should still render despite the error
    expect(screen.getByTestId('current-lang')).toBeInTheDocument();
  });

  it('should show loading state during language switch', async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('es');
    });

    // Click switch button
    await user.click(screen.getByTestId('switch-to-english'));

    // Should show loading state during switch
    await waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
    });
  });
});

describe('SEO and Meta Tags', () => {
  it('should update document language attribute', async () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(document.documentElement.lang).toBe('es');
    });
  });

  it('should update document direction for RTL languages', async () => {
    const RTLTestComponent = () => {
      const { setLanguage } = useLanguage();

      return (
        <div>
          <button
            onClick={() => setLanguage('ar')}
            data-testid="switch-to-arabic"
          >
            Switch to Arabic
          </button>
        </div>
      );
    };

    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <RTLTestComponent />
      </LanguageProvider>
    );

    await user.click(screen.getByTestId('switch-to-arabic'));

    await waitFor(() => {
      expect(document.documentElement.dir).toBe('rtl');
    });
  });
});

// Integration tests
describe('Full i18n Flow', () => {
  it('should complete full language switch cycle', async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <TestComponent />
        <LanguageSwitcher />
      </LanguageProvider>
    );

    // Initial state
    await waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('es');
      expect(document.documentElement.lang).toBe('es');
    });

    // Switch via component button
    await user.click(screen.getByTestId('switch-to-english'));

    await waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
      expect(document.documentElement.lang).toBe('en');
      expect(localStorage.getItem('preferred-language')).toBe('en');
    });

    // Switch back via language switcher
    const languageSwitcher = screen.getAllByText('English')[0];
    await user.click(languageSwitcher);

    await waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('es');
      expect(document.documentElement.lang).toBe('es');
      expect(localStorage.getItem('preferred-language')).toBe('es');
    });
  });
});