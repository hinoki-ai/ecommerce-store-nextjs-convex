"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { LanguageProviderFactory, LanguageChunk, LanguageContextType } from '@/lib/providers/language-provider';
import { initializeDivineParsingOracle } from '@/lib/divine-parsing-oracle';

// Enhanced context type with error handling
interface EnhancedLanguageContextType extends LanguageContextType {
  error: string | null;
  retry: () => void;
  isRetrying: boolean;
  loadingState: 'idle' | 'loading' | 'success' | 'error';
}

// Loading states
enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

// Create the context
const LanguageContext = createContext<EnhancedLanguageContextType | undefined>(undefined);

// Language provider component with enhanced error handling
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('es'); // Default to Spanish
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.LOADING);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const factory = LanguageProviderFactory.getInstance();
  const maxRetries = 3;

  // Enhanced translation function with error handling and fallbacks
  const t = useCallback((key: string, fallback?: string): string => {
    try {
      const provider = factory.getCachedProvider(currentLanguage);
      if (provider) {
        const translation = provider.translate(key);
        if (translation && translation !== key) {
          return translation;
        }
      }

      // Try English as fallback if current language fails
      if (currentLanguage !== 'en') {
        const englishProvider = factory.getCachedProvider('en');
        if (englishProvider) {
          const englishTranslation = englishProvider.translate(key);
          if (englishTranslation && englishTranslation !== key) {
            return englishTranslation;
          }
        }
      }

      // Use provided fallback or return key
      return fallback || key;
    } catch (error) {
      console.error('Translation error:', error);
      return fallback || key;
    }
  }, [currentLanguage, factory]);

  // Retry function for failed operations
  const retry = useCallback(async () => {
    if (retryCount >= maxRetries) {
      setError('Maximum retry attempts reached. Please refresh the page.');
      return;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    setError(null);
    setLoadingState(LoadingState.LOADING);

    try {
      await factory.preloadCriticalChunks();
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error('Retry failed:', error);
      setError('Failed to load language data. Please try again.');
      setLoadingState(LoadingState.ERROR);
    } finally {
      setIsRetrying(false);
    }
  }, [retryCount, maxRetries, factory]);

  // Initialize language from localStorage or browser preference
  useEffect(() => {
    const initializeLanguage = async () => {
      setLoadingState(LoadingState.LOADING);
      setError(null);

      try {
        // First, initialize the divine parsing oracle system to register supported languages
        await initializeDivineParsingOracle();

        const supportedLanguages = factory.getSupportedLanguages();
        console.log('Available languages after init:', supportedLanguages.map(l => l.code));

        if (supportedLanguages.length === 0) {
          throw new Error('No supported languages found after initialization');
        }

        // Check localStorage first
        const savedLanguage = localStorage.getItem('preferred-language');
        if (savedLanguage && supportedLanguages.some(lang => lang.code === savedLanguage)) {
          await setLanguage(savedLanguage);
        } else {
          // Check browser language
          const browserLang = navigator.language.split('-')[0];
          const supportedLang = supportedLanguages.find(lang => lang.code === browserLang);
          if (supportedLang) {
            await setLanguage(supportedLang.code);
          } else {
            // Fall back to default language (just set it directly if setLanguage fails)
            try {
              await setLanguage('es');
            } catch (langError) {
              console.warn('Failed to set Spanish language, using direct fallback:', langError);
              setCurrentLanguage('es');
            }
          }
        }

        setLoadingState(LoadingState.SUCCESS);
      } catch (error) {
        console.error('Error initializing language:', error);
        setError('Failed to initialize language settings. Using default language.');
        setLoadingState(LoadingState.ERROR);
        // Still set a default language even if initialization fails
        setCurrentLanguage('es');
      }
    };

    initializeLanguage();
  }, [factory]);

  const setLanguage = async (languageCode: string): Promise<void> => {
    setLoadingState(LoadingState.LOADING);
    setError(null);

    try {
      await factory.getProvider(languageCode);
      setCurrentLanguage(languageCode);
      localStorage.setItem('preferred-language', languageCode);

      // Update document lang attribute
      document.documentElement.lang = languageCode;

      // Update document direction for RTL languages
      const isRTL = factory.getSupportedLanguages().find(lang => lang.code === languageCode)?.direction === 'rtl';
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error('Error setting language:', error);
      setError(`Failed to load language: ${languageCode}. Please try again.`);
      setLoadingState(LoadingState.ERROR);

      // Don't change the current language if setting fails
      throw error;
    }
  };

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo<EnhancedLanguageContextType>(() => ({
    currentLanguage,
    supportedLanguages: factory.getSupportedLanguages(),
    setLanguage,
    t,
    isLoading: loadingState === LoadingState.LOADING,
    error,
    retry,
    isRetrying,
    loadingState: loadingState as any
  }), [
    currentLanguage,
    factory,
    setLanguage,
    t,
    loadingState,
    error,
    retry,
    isRetrying
  ]);

  // Loading fallback component
  if (loadingState === LoadingState.LOADING && !isRetrying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading language settings...</p>
        </div>
      </div>
    );
  }

  // Error fallback component
  if (loadingState === LoadingState.ERROR && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h2 className="text-xl font-semibold">Language Loading Error</h2>
          <p className="text-muted-foreground">{error}</p>
          {retryCount < maxRetries && (
            <button
              onClick={retry}
              disabled={isRetrying}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 ml-2"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// Enhanced hook to use language context with error handling
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Hook for safe translation with error boundary
export function useTranslation() {
  const { t, error, loadingState } = useLanguage();

  const safeTranslate = useCallback((key: string, fallback?: string, options?: { throwOnError?: boolean }) => {
    if (loadingState === LoadingState.ERROR && options?.throwOnError) {
      throw new Error(`Translation failed: ${error || 'Unknown error'}`);
    }
    return t(key, fallback);
  }, [t, error, loadingState]);

  return { t: safeTranslate, error, isLoading: loadingState === LoadingState.LOADING };
}