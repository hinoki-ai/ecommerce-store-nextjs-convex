"use client"

import { useLanguage } from './LanguageProvider';
import { supportedLanguageChunks } from '@/lib/i18n-chunked';
import Head from 'next/head';

interface LanguageSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object;
  noIndex?: boolean;
}

/**
 * Enhanced Language SEO Component
 * Handles comprehensive SEO for multi-language sites
 */
export function LanguageSEO({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  structuredData,
  noIndex = false
}: LanguageSEOProps) {
  const { currentLanguage } = useLanguage();

  // Get current language configuration
  const currentLangConfig = supportedLanguageChunks.find(lang => lang.code === currentLanguage);

  // Generate base URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';

  // Generate canonical URL
  const canonical = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : baseUrl);

  // Generate alternate URLs for hreflang
  const alternateUrls = supportedLanguageChunks.map(lang => ({
    lang: lang.code,
    url: canonical.replace(`/${currentLanguage}`, lang.code === 'es' ? '' : `/${lang.code}`)
  }));

  // Generate title with language-specific site name
  const siteTitle = currentLangConfig ? `${title || 'Luxury E-Commerce Store'} | ${currentLangConfig.name}` : (title || 'Luxury E-Commerce Store');

  // Generate description with language-specific content
  const siteDescription = description || 'Premium luxury products with AI-optimized SEO';

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Language and Direction */}
      <meta httpEquiv="content-language" content={currentLanguage} />
      {currentLangConfig?.direction === 'rtl' && (
        <meta name="dir" content="rtl" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Hreflang Tags for Multi-language SEO */}
      {alternateUrls.map(alt => (
        <link
          key={alt.lang}
          rel="alternate"
          hrefLang={alt.lang}
          href={alt.url}
        />
      ))}
      {/* Default hreflang */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={baseUrl}
      />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={currentLangConfig?.name || 'Luxury E-Commerce Store'} />
      <meta property="og:locale" content={`${currentLanguage}_${currentLanguage.toUpperCase()}`} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Alternate locales for Open Graph */}
      {alternateUrls.filter(alt => alt.lang !== currentLanguage).map(alt => (
        <meta
          key={alt.lang}
          property="og:locale:alternate"
          content={`${alt.lang}_${alt.lang.toUpperCase()}`}
        />
      ))}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="author" content="Luxury E-Commerce Store" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Language-specific meta tags */}
      {currentLangConfig && (
        <>
          <meta name="language" content={currentLangConfig.name} />
          <meta name="geo.region" content={`${currentLanguage}-${currentLanguage.toUpperCase()}`} />
          <meta name="geo.position" content="0;0" />
          <meta name="ICBM" content="0,0" />
        </>
      )}

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}

      {/* Language-specific structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": currentLangConfig?.name || 'Luxury E-Commerce Store',
            "description": siteDescription,
            "url": baseUrl,
            "inLanguage": currentLanguage,
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${baseUrl}/${currentLanguage}/search?q={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            },
            "hasPart": alternateUrls.map(alt => ({
              "@type": "WebPage",
              "name": `${currentLangConfig?.name} - ${alt.lang.toUpperCase()}`,
              "url": alt.url,
              "inLanguage": alt.lang
            }))
          })
        }}
      />
    </Head>
  );
}

/**
 * Generate SEO-friendly URL for products
 */
export function generateProductUrl(product: { slug: string; name: string }, language: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';

  // Create SEO-friendly URL with product name and ID
  const seoSlug = `${product.slug}-${product.name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  }`;

  return language === 'es'
    ? `${baseUrl}/productos/${seoSlug}`
    : `${baseUrl}/${language}/products/${seoSlug}`;
}

/**
 * Generate SEO-friendly URL for categories
 */
export function generateCategoryUrl(category: { slug: string; name: string }, language: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';

  const seoSlug = `${category.slug}-${category.name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  }`;

  return language === 'es'
    ? `${baseUrl}/categorias/${seoSlug}`
    : `${baseUrl}/${language}/categories/${seoSlug}`;
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      ...(crumb.url && { "item": crumb.url })
    }))
  };
}

/**
 * Generate product structured data
 */
export function generateProductStructuredData(product: {
  name: string;
  description: string;
  sku: string;
  price: number;
  currency: string;
  image: string;
  availability: string;
  brand?: string;
  rating?: { ratingValue: number; reviewCount: number };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "sku": product.sku,
    "image": product.image,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": product.currency,
      "availability": `https://schema.org/${product.availability}`,
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    ...(product.brand && { "brand": { "@type": "Brand", "name": product.brand } }),
    ...(product.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating.ratingValue,
        "reviewCount": product.rating.reviewCount
      }
    })
  };
}