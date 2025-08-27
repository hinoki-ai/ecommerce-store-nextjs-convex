/**
 * Comprehensive i18n Hooks with Autoloop Multi-Completion
 * Provides type-safe translation functions with intelligent auto-completion
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { LanguageProviderFactory } from '../providers/language-provider';
import { TranslationService } from '../services/translation-service';
import { LanguageLoader } from '../loaders/language-loader';
import { supportedLanguageChunks, defaultLanguage } from '../divine-parsing-oracle';
import {
  CompleteTranslationSchema,
  UseTranslationReturn,
  UseLanguageSwitcherReturn,
  UseLanguageLoaderReturn,
  TranslateFunction,
  TranslationKey,
  NestedTranslationKey
} from '../types/divine-parsing-oracle.types';

export const useTranslation = (): UseTranslationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);

  // Get current language from various sources
  useEffect(() => {
    const detectLanguage = async () => {
      try {
        // Check URL path for language
        const pathLanguage = window.location.pathname.split('/')[1];
        if (supportedLanguageChunks.some(lang => lang.code === pathLanguage)) {
          setCurrentLanguage(pathLanguage);
          return;
        }

        // Check localStorage
        const storedLanguage = localStorage.getItem('preferred-language');
        if (storedLanguage && supportedLanguageChunks.some(lang => lang.code === storedLanguage)) {
          setCurrentLanguage(storedLanguage);
          return;
        }

        // Check browser language
        const browserLang = navigator.language.split('-')[0];
        if (supportedLanguageChunks.some(lang => lang.code === browserLang)) {
          setCurrentLanguage(browserLang);
          return;
        }

        // Default to Spanish
        setCurrentLanguage(defaultLanguage);
      } catch (err) {
        console.warn('Language detection failed:', err);
        setCurrentLanguage(defaultLanguage);
      }
    };

    detectLanguage();
  }, []);

  // Type-safe translation function with autoloop multi-completion
  const t: TranslateFunction = useCallback(<T extends TranslationKey>(
    key: T
  ) => async <K extends NestedTranslationKey<T>>(
    subKey: K
  ): Promise<CompleteTranslationSchema[T][K]> => {
    try {
      const factory = LanguageProviderFactory.getInstance();
      const provider = await factory.getProvider(currentLanguage);

      if (!provider) {
        console.warn(`No provider found for language: ${currentLanguage}`);
        // Fallback to default language
        const fallbackProvider = await factory.getProvider(defaultLanguage);
        const fallbackResult = fallbackProvider?.translate(`${key}.${String(subKey)}`);
        return (fallbackResult && fallbackResult !== `${key}.${String(subKey)}`)
          ? fallbackResult as CompleteTranslationSchema[T][K]
          : `${key}.${String(subKey)}` as CompleteTranslationSchema[T][K];
      }

      const translation = provider.translate(`${key}.${String(subKey)}`);

      if (!translation || translation === `${key}.${String(subKey)}`) {
        console.warn(`Missing translation: ${currentLanguage}.${key}.${String(subKey)}`);
        // Try fallback to default language
        if (currentLanguage !== defaultLanguage) {
          const fallbackProvider = await factory.getProvider(defaultLanguage);
          const fallbackTranslation = fallbackProvider?.translate(`${key}.${String(subKey)}`);
          if (fallbackTranslation && fallbackTranslation !== `${key}.${String(subKey)}`) {
            return fallbackTranslation as CompleteTranslationSchema[T][K];
          }
        }
        return `${key}.${String(subKey)}` as CompleteTranslationSchema[T][K];
      }

      return translation as CompleteTranslationSchema[T][K];
    } catch (err) {
      console.error('Translation error:', err);
      setError(`Translation failed: ${key}.${String(subKey)}`);
      return `${key}.${String(subKey)}` as CompleteTranslationSchema[T][K];
    }
  }, [currentLanguage]);

  return {
    t,
    language: currentLanguage,
    isLoading,
    error
  };
};

export const useLanguageSwitcher = (): UseLanguageSwitcherReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [error, setError] = useState<string | null>(null);

  // Initialize language from storage/URL
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Check URL first
        const urlLanguage = window.location.pathname.split('/')[1];
        if (supportedLanguageChunks.some(lang => lang.code === urlLanguage)) {
          setCurrentLanguage(urlLanguage);
          return;
        }

        // Check localStorage
        const stored = localStorage.getItem('preferred-language');
        if (stored && supportedLanguageChunks.some(lang => lang.code === stored)) {
          setCurrentLanguage(stored);
          return;
        }

        setCurrentLanguage(defaultLanguage);
      } catch (err) {
        console.warn('Language initialization failed:', err);
        setCurrentLanguage(defaultLanguage);
      }
    };

    initializeLanguage();
  }, []);

  const setLanguage = useCallback(async (language: string): Promise<void> => {
    if (!supportedLanguageChunks.some(lang => lang.code === language)) {
      console.warn(`Unsupported language: ${language}`);
      return;
    }

    setIsLoading(true);
    try {
      const factory = LanguageProviderFactory.getInstance();

      // Load the language if not already loaded
      await factory.getProvider(language);

      // Update localStorage
      localStorage.setItem('preferred-language', language);

      // Update state
      setCurrentLanguage(language);

      // Update document language attribute
      document.documentElement.lang = language;

      // Update URL if needed
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split('/').filter(Boolean);

      if (pathParts.length > 0 && supportedLanguageChunks.some(lang => lang.code === pathParts[0])) {
        // Replace language in URL
        const newPath = `/${language}/${pathParts.slice(1).join('/')}`;
        window.history.replaceState({}, '', newPath);
      } else {
        // Add language to URL
        const newPath = `/${language}${currentPath}`;
        window.history.replaceState({}, '', newPath);
      }

      console.log(`Language switched to: ${language}`);
    } catch (err) {
      console.error('Language switch failed:', err);
      setError(`Failed to switch language: ${language}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const supportedLanguages = useMemo(() => {
    return supportedLanguageChunks.map(({ code, name, flag, direction }) => ({
      code,
      name,
      flag,
      direction: direction || 'ltr'
    }));
  }, []);

  return {
    currentLanguage,
    supportedLanguages,
    setLanguage,
    isLoading
  };
};

export const useLanguageLoader = (): UseLanguageLoaderReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedLanguages, setLoadedLanguages] = useState<string[]>([defaultLanguage]);

  const loadLanguage = useCallback(async (language: string): Promise<void> => {
    if (loadedLanguages.includes(language)) {
      return; // Already loaded
    }

    setIsLoading(true);
    try {
      const factory = LanguageProviderFactory.getInstance();
      await factory.getProvider(language);
      setLoadedLanguages(prev => [...prev, language]);
      console.log(`Language loaded: ${language}`);
    } catch (err) {
      console.error(`Failed to load language: ${language}`, err);
    } finally {
      setIsLoading(false);
    }
  }, [loadedLanguages]);

  const preloadLanguages = useCallback(async (languages: string[]): Promise<void> => {
    const languagesToLoad = languages.filter(lang => !loadedLanguages.includes(lang));

    if (languagesToLoad.length === 0) {
      return; // All already loaded
    }

    setIsLoading(true);
    try {
      const factory = LanguageProviderFactory.getInstance();
              await Promise.all(languagesToLoad.map(lang => factory.getProvider(lang)));
      setLoadedLanguages(prev => [...prev, ...languagesToLoad]);
      console.log(`Languages preloaded: ${languagesToLoad.join(', ')}`);
    } catch (err) {
      console.error('Failed to preload languages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [loadedLanguages]);

  return {
    loadLanguage,
    preloadLanguages,
    isLoading,
    loadedLanguages
  };
};

// Specialized hooks for specific domains

export const useNavigationTranslations = () => {
  const { t } = useTranslation();
  return {
    home: t('nav')('home'),
    products: t('nav')('products'),
    categories: t('nav')('categories'),
    collections: t('nav')('collections'),
    blog: t('nav')('blog'),
    about: t('nav')('about'),
    contact: t('nav')('contact'),
    cart: t('nav')('cart'),
    wishlist: t('nav')('wishlist'),
    account: t('nav')('account'),
    search: t('nav')('search'),
    signIn: t('nav')('signIn'),
    signUp: t('nav')('signUp'),
    signOut: t('nav')('signOut'),
    dashboard: t('nav')('dashboard'),
    orders: t('nav')('orders'),
    profile: t('nav')('profile'),
    settings: t('nav')('settings')
  };
};

export const useProductTranslations = () => {
  const { t } = useTranslation();
  return {
    addToCart: t('product')('addToCart'),
    buyNow: t('product')('buyNow'),
    outOfStock: t('product')('outOfStock'),
    inStock: t('product')('inStock'),
    lowStock: t('product')('lowStock'),
    price: t('product')('price'),
    originalPrice: t('product')('originalPrice'),
    salePrice: t('product')('salePrice'),
    discount: t('product')('discount'),
    freeShipping: t('product')('freeShipping'),
    shippingCost: t('product')('shippingCost'),
    estimatedDelivery: t('product')('estimatedDelivery'),
    reviews: t('product')('reviews'),
    rating: t('product')('rating'),
    noReviews: t('product')('noReviews'),
    writeReview: t('product')('writeReview'),
    relatedProducts: t('product')('relatedProducts'),
    productDetails: t('product')('productDetails'),
    specifications: t('product')('specifications'),
    description: t('product')('description'),
    features: t('product')('features'),
    dimensions: t('product')('dimensions'),
    weight: t('product')('weight'),
    materials: t('product')('materials'),
    careInstructions: t('product')('careInstructions'),
    warranty: t('product')('warranty'),
    returnPolicy: t('product')('returnPolicy'),
    sizeGuide: t('product')('sizeGuide'),
    color: t('product')('color'),
    size: t('product')('size'),
    quantity: t('product')('quantity'),
    sku: t('product')('sku'),
    brand: t('product')('brand'),
    category: t('product')('category'),
    tags: t('product')('tags'),
    share: t('product')('share'),
    wishlistAdd: t('product')('wishlistAdd'),
    wishlistRemove: t('product')('wishlistRemove'),
    compare: t('product')('compare'),
    recentlyViewed: t('product')('recentlyViewed'),
    bestSellers: t('product')('bestSellers'),
    newArrivals: t('product')('newArrivals'),
    featured: t('product')('featured'),
    onSale: t('product')('onSale'),
    limitedStock: t('product')('limitedStock')
  };
};

export const useCartTranslations = () => {
  const { t } = useTranslation();
  return {
    cartEmpty: t('cart')('cartEmpty'),
    cartTitle: t('cart')('cartTitle'),
    subtotal: t('cart')('subtotal'),
    tax: t('cart')('tax'),
    shipping: t('cart')('shipping'),
    total: t('cart')('total'),
    checkout: t('cart')('checkout'),
    continueShopping: t('cart')('continueShopping'),
    removeItem: t('cart')('removeItem'),
    updateQuantity: t('cart')('updateQuantity'),
    couponCode: t('cart')('couponCode'),
    applyCoupon: t('cart')('applyCoupon'),
    couponApplied: t('cart')('couponApplied'),
    couponInvalid: t('cart')('couponInvalid'),
    estimatedShipping: t('cart')('estimatedShipping'),
    freeShippingThreshold: t('cart')('freeShippingThreshold'),
    cartUpdated: t('cart')('cartUpdated'),
    itemRemoved: t('cart')('itemRemoved'),
    quantityUpdated: t('cart')('quantityUpdated'),
    maximumQuantity: t('cart')('maximumQuantity'),
    minimumQuantity: t('cart')('minimumQuantity'),
    outOfStockInCart: t('cart')('outOfStockInCart'),
    proceedToCheckout: t('cart')('proceedToCheckout'),
    guestCheckout: t('cart')('guestCheckout'),
    signInToCheckout: t('cart')('signInToCheckout')
  };
};

export const useCheckoutTranslations = () => {
  const { t } = useTranslation();
  return {
    checkoutTitle: t('checkout')('checkoutTitle'),
    billingAddress: t('checkout')('billingAddress'),
    shippingAddress: t('checkout')('shippingAddress'),
    paymentMethod: t('checkout')('paymentMethod'),
    orderSummary: t('checkout')('orderSummary'),
    placeOrder: t('checkout')('placeOrder'),
    orderProcessing: t('checkout')('orderProcessing'),
    orderSuccess: t('checkout')('orderSuccess'),
    orderFailed: t('checkout')('orderFailed'),
    paymentProcessing: t('checkout')('paymentProcessing'),
    paymentFailed: t('checkout')('paymentFailed'),
    paymentSuccess: t('checkout')('paymentSuccess'),
    shippingMethod: t('checkout')('shippingMethod'),
    deliveryDate: t('checkout')('deliveryDate'),
    trackingNumber: t('checkout')('trackingNumber'),
    orderNumber: t('checkout')('orderNumber'),
    orderDate: t('checkout')('orderDate'),
    orderStatus: t('checkout')('orderStatus'),
    orderDetails: t('checkout')('orderDetails'),
    customerInfo: t('checkout')('customerInfo'),
    contactInfo: t('checkout')('contactInfo'),
    deliveryInfo: t('checkout')('deliveryInfo'),
    billingInfo: t('checkout')('billingInfo'),
    paymentInfo: t('checkout')('paymentInfo'),
    orderConfirmation: t('checkout')('orderConfirmation'),
    thankYou: t('checkout')('thankYou'),
    orderReceived: t('checkout')('orderReceived'),
    emailConfirmation: t('checkout')('emailConfirmation'),
    continueShopping: t('checkout')('continueShopping'),
    printReceipt: t('checkout')('printReceipt'),
    downloadInvoice: t('checkout')('downloadInvoice')
  };
};

export const useCommonUITranslations = () => {
  const { t } = useTranslation();
  return {
    loading: t('common')('loading'),
    error: t('common')('error'),
    success: t('common')('success'),
    warning: t('common')('warning'),
    info: t('common')('info'),
    cancel: t('common')('cancel'),
    confirm: t('common')('confirm'),
    save: t('common')('save'),
    delete: t('common')('delete'),
    edit: t('common')('edit'),
    add: t('common')('add'),
    remove: t('common')('remove'),
    back: t('common')('back'),
    next: t('common')('next'),
    previous: t('common')('previous'),
    close: t('common')('close'),
    open: t('common')('open'),
    submit: t('common')('submit'),
    reset: t('common')('reset'),
    clear: t('common')('clear'),
    filter: t('common')('filter'),
    sort: t('common')('sort'),
    view: t('common')('view'),
    hide: t('common')('hide'),
    show: t('common')('show'),
    more: t('common')('more'),
    less: t('common')('less'),
    expand: t('common')('expand'),
    collapse: t('common')('collapse'),
    select: t('common')('select'),
    selected: t('common')('selected'),
    available: t('common')('available'),
    unavailable: t('common')('unavailable'),
    required: t('common')('required'),
    optional: t('common')('optional')
  };
};

export const useErrorTranslations = () => {
  const { t } = useTranslation();
  return {
    pageNotFound: t('errors')('pageNotFound'),
    accessDenied: t('errors')('accessDenied'),
    serverError: t('errors')('serverError'),
    networkError: t('errors')('networkError'),
    timeoutError: t('errors')('timeoutError'),
    validationError: t('errors')('validationError'),
    authenticationError: t('errors')('authenticationError'),
    authorizationError: t('errors')('authorizationError'),
    paymentError: t('errors')('paymentError'),
    shippingError: t('errors')('shippingError'),
    inventoryError: t('errors')('inventoryError'),
    cartError: t('errors')('cartError'),
    wishlistError: t('errors')('wishlistError'),
    searchError: t('errors')('searchError'),
    formError: t('errors')('formError'),
    fileError: t('errors')('fileError'),
    uploadError: t('errors')('uploadError'),
    downloadError: t('errors')('downloadError'),
    connectionError: t('errors')('connectionError'),
    maintenanceError: t('errors')('maintenanceError'),
    quotaExceeded: t('errors')('quotaExceeded'),
    rateLimited: t('errors')('rateLimited'),
    serviceUnavailable: t('errors')('serviceUnavailable'),
    unexpectedError: t('errors')('unexpectedError'),
    tryAgain: t('errors')('tryAgain'),
    contactSupport: t('errors')('contactSupport'),
    goBack: t('errors')('goBack'),
    refreshPage: t('errors')('refreshPage')
  };
};

export const useSEOMetadataTranslations = () => {
  const { t } = useTranslation();
  return {
    homeTitle: t('seo')('homeTitle'),
    homeDescription: t('seo')('homeDescription'),
    productsTitle: t('seo')('productsTitle'),
    productsDescription: t('seo')('productsDescription'),
    categoriesTitle: t('seo')('categoriesTitle'),
    categoriesDescription: t('seo')('categoriesDescription'),
    cartTitle: t('seo')('cartTitle'),
    cartDescription: t('seo')('cartDescription'),
    checkoutTitle: t('seo')('checkoutTitle'),
    checkoutDescription: t('seo')('checkoutDescription'),
    accountTitle: t('seo')('accountTitle'),
    accountDescription: t('seo')('accountDescription'),
    aboutTitle: t('seo')('aboutTitle'),
    aboutDescription: t('seo')('aboutDescription'),
    contactTitle: t('seo')('contactTitle'),
    contactDescription: t('seo')('contactDescription'),
    blogTitle: t('seo')('blogTitle'),
    blogDescription: t('seo')('blogDescription'),
    searchTitle: t('seo')('searchTitle'),
    searchDescription: t('seo')('searchDescription'),
    privacyTitle: t('seo')('privacyTitle'),
    privacyDescription: t('seo')('privacyDescription'),
    termsTitle: t('seo')('termsTitle'),
    termsDescription: t('seo')('termsDescription'),
    returnsTitle: t('seo')('returnsTitle'),
    returnsDescription: t('seo')('returnsDescription'),
    shippingTitle: t('seo')('shippingTitle'),
    shippingDescription: t('seo')('shippingDescription')
  };
};

export const useFooterTranslations = () => {
  const { t } = useTranslation();
  return {
    aboutUs: t('footer')('aboutUs'),
    customerService: t('footer')('customerService'),
    help: t('footer')('help'),
    contact: t('footer')('contact'),
    shipping: t('footer')('shipping'),
    returns: t('footer')('returns'),
    sizeGuide: t('footer')('sizeGuide'),
    faq: t('footer')('faq'),
    privacyPolicy: t('footer')('privacyPolicy'),
    termsOfService: t('footer')('termsOfService'),
    cookiePolicy: t('footer')('cookiePolicy'),
    accessibility: t('footer')('accessibility'),
    sitemap: t('footer')('sitemap'),
    followUs: t('footer')('followUs'),
    newsletter: t('footer')('newsletter'),
    subscribe: t('footer')('subscribe'),
    emailPlaceholder: t('footer')('emailPlaceholder'),
    copyright: t('footer')('copyright'),
    allRightsReserved: t('footer')('allRightsReserved'),
    paymentMethods: t('footer')('paymentMethods'),
    securePayment: t('footer')('securePayment'),
    sslSecured: t('footer')('sslSecured')
  };
};

// Utility hook for batch translations
export const useBatchTranslations = (translationGroups: string[]) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadBatchTranslations = async () => {
      setIsLoading(true);
      try {
        const batch: Record<string, any> = {};

        for (const group of translationGroups) {
          switch (group) {
            case 'nav':
              batch.nav = {
                home: t('nav')('home'),
                products: t('nav')('products'),
                categories: t('nav')('categories'),
                collections: t('nav')('collections'),
                blog: t('nav')('blog'),
                about: t('nav')('about'),
                contact: t('nav')('contact'),
                cart: t('nav')('cart'),
                wishlist: t('nav')('wishlist'),
                account: t('nav')('account'),
                search: t('nav')('search'),
                signIn: t('nav')('signIn'),
                signUp: t('nav')('signUp'),
                signOut: t('nav')('signOut'),
                dashboard: t('nav')('dashboard'),
                orders: t('nav')('orders'),
                profile: t('nav')('profile'),
                settings: t('nav')('settings')
              };
              break;

            case 'common':
              batch.common = {
                loading: t('common')('loading'),
                error: t('common')('error'),
                success: t('common')('success'),
                warning: t('common')('warning'),
                info: t('common')('info'),
                cancel: t('common')('cancel'),
                confirm: t('common')('confirm'),
                save: t('common')('save'),
                delete: t('common')('delete'),
                edit: t('common')('edit'),
                add: t('common')('add'),
                remove: t('common')('remove'),
                back: t('common')('back'),
                next: t('common')('next'),
                previous: t('common')('previous'),
                close: t('common')('close'),
                open: t('common')('open'),
                submit: t('common')('submit'),
                reset: t('common')('reset'),
                clear: t('common')('clear'),
                filter: t('common')('filter'),
                sort: t('common')('sort'),
                view: t('common')('view'),
                hide: t('common')('hide'),
                show: t('common')('show'),
                more: t('common')('more'),
                less: t('common')('less'),
                expand: t('common')('expand'),
                collapse: t('common')('collapse'),
                select: t('common')('select'),
                selected: t('common')('selected'),
                available: t('common')('available'),
                unavailable: t('common')('unavailable'),
                required: t('common')('required'),
                optional: t('common')('optional')
              };
              break;

            // Add other groups as needed
            default:
              console.warn(`Unknown translation group: ${group}`);
          }
        }

        setTranslations(batch);
      } catch (err) {
        console.error('Batch translation failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBatchTranslations();
  }, [translationGroups, t]);

  return { translations, isLoading };
};