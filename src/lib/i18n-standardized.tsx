import React, { createContext, useContext, useState, useEffect } from 'react'

// Locales supported by the store platform (focusing on primary languages)
export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]

// Type for nested translation objects
type TranslationValue = string | string[] | { [key: string]: TranslationValue }

// Divine Parsing Oracle - Store E-Commerce EN/ES translations
const translations = {
  en: {
    // Navigation & Global
    nav: {
      home: 'Home',
      products: 'Products',
      categories: 'Categories',
      collections: 'Collections',
      brands: 'Brands',
      sale: 'Sale',
      search: 'Search products...',
      cart: 'Cart',
      wishlist: 'Wishlist',
      account: 'Account',
      languageToggle: 'Toggle language',
    },

    // Hero Section
    hero: {
      title: 'Premium Fashion & Lifestyle',
      subtitle: 'Discover unique pieces from top designers',
      description: 'Shop the latest trends in fashion, accessories, and lifestyle products with worldwide shipping.',
      shopNow: 'Shop Now',
      exploreCollections: 'Explore Collections',
      freeShipping: 'Free Shipping on Orders Over $100'
    },

    // Categories
    categories: {
      title: 'Shop by Category',
      subtitle: 'Find your perfect style in our curated collections',
      fashion: {
        name: 'Fashion',
        description: 'Clothing, shoes, and accessories'
      },
      lifestyle: {
        name: 'Lifestyle',
        description: 'Home decor, beauty, and wellness'
      },
      electronics: {
        name: 'Electronics',
        description: 'Latest gadgets and tech accessories'
      },
      jewelry: {
        name: 'Jewelry',
        description: 'Fine jewelry and luxury watches'
      },
      beauty: {
        name: 'Beauty',
        description: 'Skincare, makeup, and fragrances'
      },
      home: {
        name: 'Home & Garden',
        description: 'Furniture, decor, and garden supplies'
      }
    },

    // Products
    products: {
      title: 'Our Products',
      subtitle: 'Discover our carefully curated selection',
      noResults: 'No products found',
      loading: 'Loading products...',
      viewDetails: 'View Details',
      addToCart: 'Add to Cart',
      addToWishlist: 'Add to Wishlist',
      outOfStock: 'Out of Stock',
      inStock: 'In Stock',
      price: 'Price',
      originalPrice: 'Original Price',
      sale: 'Sale',
      new: 'New',
      featured: 'Featured',
      bestseller: 'Bestseller',
    },

    // Cart & Checkout
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      emptySubtitle: 'Add some amazing products to get started',
      continueShopping: 'Continue Shopping',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax',
      total: 'Total',
      checkout: 'Proceed to Checkout',
      remove: 'Remove',
      quantity: 'Quantity',
      update: 'Update Cart',
    },

    // User Account
    account: {
      title: 'My Account',
      profile: 'Profile',
      orders: 'Orders',
      wishlist: 'Wishlist',
      addresses: 'Addresses',
      settings: 'Settings',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
    },

    // Common UI Elements
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      retry: 'Try Again',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      close: 'Close',
      next: 'Next',
      previous: 'Previous',
      viewAll: 'View All',
      learnMore: 'Learn More',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort by',
      showMore: 'Show More',
      showLess: 'Show Less',
    },

    // Footer
    footer: {
      description: 'Your premium destination for fashion, lifestyle, and luxury goods. Worldwide shipping and exceptional service.',
      quickLinks: 'Quick Links',
      categories: 'Categories',
      customerService: 'Customer Service',
      aboutUs: 'About Us',
      contact: 'Contact',
      shipping: 'Shipping Info',
      returns: 'Returns',
      faq: 'FAQ',
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy',
      followUs: 'Follow Us',
      newsletter: 'Newsletter',
      subscribe: 'Subscribe',
      emailPlaceholder: 'Enter your email',
      copyright: 'All rights reserved.',
      designedBy: 'Designed by ΛRΛMΛC'
    },

    // SEO & Meta
    meta: {
      title: 'Premium Store | Fashion, Lifestyle & Luxury Goods',
      description: 'Discover premium fashion, lifestyle products, and luxury goods. Worldwide shipping and exceptional customer service.',
      keywords: 'fashion, lifestyle, luxury, premium, store, shopping, worldwide shipping',
    },
  },

  es: {
    // Navigation & Global
    nav: {
      home: 'Inicio',
      products: 'Productos',
      categories: 'Categorías',
      collections: 'Colecciones',
      brands: 'Marcas',
      sale: 'Oferta',
      search: 'Buscar productos...',
      cart: 'Carrito',
      wishlist: 'Lista de Deseos',
      account: 'Cuenta',
      languageToggle: 'Cambiar idioma',
    },

    // Hero Section
    hero: {
      title: 'Moda Premium y Estilo de Vida',
      subtitle: 'Descubre piezas únicas de los mejores diseñadores',
      description: 'Compra las últimas tendencias en moda, accesorios y productos de estilo de vida con envío mundial.',
      shopNow: 'Comprar Ahora',
      exploreCollections: 'Explorar Colecciones',
      freeShipping: 'Envío Gratis en Pedidos Sobre $100'
    },

    // Categories
    categories: {
      title: 'Compra por Categoría',
      subtitle: 'Encuentra tu estilo perfecto en nuestras colecciones curadas',
      fashion: {
        name: 'Moda',
        description: 'Ropa, zapatos y accesorios'
      },
      lifestyle: {
        name: 'Estilo de Vida',
        description: 'Decoración del hogar, belleza y bienestar'
      },
      electronics: {
        name: 'Electrónicos',
        description: 'Últimos gadgets y accesorios tecnológicos'
      },
      jewelry: {
        name: 'Joyería',
        description: 'Joyería fina y relojes de lujo'
      },
      beauty: {
        name: 'Belleza',
        description: 'Cuidado de la piel, maquillaje y fragancias'
      },
      home: {
        name: 'Hogar y Jardín',
        description: 'Muebles, decoración y artículos de jardín'
      }
    },

    // Products
    products: {
      title: 'Nuestros Productos',
      subtitle: 'Descubre nuestra selección cuidadosamente curada',
      noResults: 'No se encontraron productos',
      loading: 'Cargando productos...',
      viewDetails: 'Ver Detalles',
      addToCart: 'Agregar al Carrito',
      addToWishlist: 'Agregar a Deseos',
      outOfStock: 'Sin Stock',
      inStock: 'En Stock',
      price: 'Precio',
      originalPrice: 'Precio Original',
      sale: 'Oferta',
      new: 'Nuevo',
      featured: 'Destacado',
      bestseller: 'Más Vendido',
    },

    // Cart & Checkout
    cart: {
      title: 'Carrito de Compras',
      empty: 'Tu carrito está vacío',
      emptySubtitle: 'Agregá algunos productos increíbles para comenzar',
      continueShopping: 'Seguir Comprando',
      subtotal: 'Subtotal',
      shipping: 'Envío',
      tax: 'Impuestos',
      total: 'Total',
      checkout: 'Proceder al Pago',
      remove: 'Eliminar',
      quantity: 'Cantidad',
      update: 'Actualizar Carrito',
    },

    // User Account
    account: {
      title: 'Mi Cuenta',
      profile: 'Perfil',
      orders: 'Pedidos',
      wishlist: 'Lista de Deseos',
      addresses: 'Direcciones',
      settings: 'Configuración',
      logout: 'Cerrar Sesión',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
    },

    // Common UI Elements
    common: {
      loading: 'Cargando...',
      error: 'Algo salió mal',
      retry: 'Intentar de Nuevo',
      save: 'Guardar',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Eliminar',
      confirm: 'Confirmar',
      close: 'Cerrar',
      next: 'Siguiente',
      previous: 'Anterior',
      viewAll: 'Ver Todo',
      learnMore: 'Saber Más',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar por',
      showMore: 'Mostrar Más',
      showLess: 'Mostrar Menos',
    },

    // Footer
    footer: {
      description: 'Tu destino premium para moda, estilo de vida y productos de lujo. Envío mundial y servicio excepcional.',
      quickLinks: 'Enlaces Rápidos',
      categories: 'Categorías',
      customerService: 'Servicio al Cliente',
      aboutUs: 'Sobre Nosotros',
      contact: 'Contacto',
      shipping: 'Información de Envío',
      returns: 'Devoluciones',
      faq: 'Preguntas Frecuentes',
      terms: 'Términos y Condiciones',
      privacy: 'Política de Privacidad',
      followUs: 'Síguenos',
      newsletter: 'Newsletter',
      subscribe: 'Suscribirse',
      emailPlaceholder: 'Ingresa tu email',
      copyright: 'Todos los derechos reservados.',
      designedBy: 'Diseñado por ΛRΛMΛC'
    },

    // SEO & Meta
    meta: {
      title: 'Tienda Premium | Moda, Estilo de Vida y Productos de Lujo',
      description: 'Descubre moda premium, productos de estilo de vida y artículos de lujo. Envío mundial y servicio al cliente excepcional.',
      keywords: 'moda, estilo de vida, lujo, premium, tienda, compras, envío mundial',
    },
  },
} satisfies Record<Locale, { [key: string]: TranslationValue }>

// i18n Context
interface I18nContextType {
  locale: Locale
  t: (key: string, options?: { defaultValue?: string }) => string
  changeLocale: (newLocale: Locale) => void
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

// Provider component that manages locale state
export function I18nProviderClient({ children, locale: initialLocale }: { children: React.ReactNode, locale: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale)

  // Update locale when initialLocale changes (for SSR/hydration)
  useEffect(() => {
    setLocale(initialLocale)
  }, [initialLocale])

  const t = (key: string, options?: { defaultValue?: string }): string => {
    const keys = key.split('.')
    let value: TranslationValue = translations[locale]

    for (const k of keys) {
      value = (value as { [key: string]: TranslationValue })?.[k]
    }

    // Always return a string for React components
    if (typeof value === 'string') {
      return value
    }
    return options?.defaultValue || key
  }

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    // Set cookie for persistence
    document.cookie = `aramac-store-locale=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}`
  }

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

// Hook to use current locale
export function useCurrentLocale(): Locale {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useCurrentLocale must be used within I18nProviderClient')
  }
  return context.locale
}

// Hook to get translation function
export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProviderClient')
  }
  return context.t
}

// Hook to change locale
export function useChangeLocale() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useChangeLocale must be used within I18nProviderClient')
  }
  return context.changeLocale
}

// Scoped i18n (same as useI18n for now)
export const useScopedI18n = useI18n

// Get direction for locale (for RTL support if needed)
export function getDirection(_locale: Locale): 'ltr' | 'rtl' {
  return 'ltr' // All supported locales are LTR
}

// Format currency based on locale
export function formatCurrency(amount: number, locale: Locale): string {
  if (locale === 'es') {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Format date based on locale
export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-CL' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}