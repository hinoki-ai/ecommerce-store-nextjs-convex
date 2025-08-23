/**
 * SEO Utilities for Multi-language Support
 * Comprehensive SEO tools for international e-commerce
 */

import { supportedLanguageChunks } from './i18n-chunked';

/**
 * Generate hreflang tags for all supported languages
 */
export function generateHrefLangTags(baseUrl: string, currentPath: string, currentLanguage: string) {
  const tags: Array<{
    rel: string;
    hrefLang: string;
    href: string;
  }> = [];

  supportedLanguageChunks.forEach(lang => {
    const href = lang.code === 'es'
      ? `${baseUrl}${currentPath}`
      : `${baseUrl}/${lang.code}${currentPath}`;

    tags.push({
      rel: 'alternate',
      hrefLang: lang.code,
      href
    });
  });

  // Add x-default for default language
  tags.push({
    rel: 'alternate',
    hrefLang: 'x-default',
    href: `${baseUrl}${currentPath}`
  });

  return tags;
}

/**
 * Generate language-specific meta tags
 */
export function generateLanguageMetaTags(
  language: string,
  title?: string,
  description?: string,
  keywords?: string[]
) {
  const langConfig = supportedLanguageChunks.find(lang => lang.code === language);

  if (!langConfig) {
    return {};
  }

  const siteTitle = title || langConfig.name;
  const siteDescription = description || 'Premium luxury products with AI-optimized SEO';
  const siteKeywords = keywords || ['luxury', 'premium', 'quality', 'designer'];

  return {
    title: siteTitle,
    description: siteDescription,
    keywords: siteKeywords,
    'og:title': siteTitle,
    'og:description': siteDescription,
    'og:type': 'website',
    'og:locale': `${language}_${language.toUpperCase()}`,
    'twitter:title': siteTitle,
    'twitter:description': siteDescription,
    'twitter:card': 'summary_large_image',
    'content-language': language,
    language: langConfig.name,
    ...(langConfig.direction === 'rtl' && { dir: 'rtl' })
  };
}

/**
 * Generate robots.txt content for multi-language site
 */
export function generateRobotsTxt(baseUrl: string) {
  const sitemaps = supportedLanguageChunks.map(lang => {
    const langPrefix = lang.code === 'es' ? '' : `/${lang.code}`;
    return `${baseUrl}${langPrefix}/sitemap.xml`;
  });

  return `User-agent: *
Allow: /

# Sitemaps
${sitemaps.map(sitemap => `Sitemap: ${sitemap}`).join('\n')}

# Block admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /sign-in
Disallow: /sign-up`;
}

/**
 * Generate sitemap.xml for a specific language
 */
export function generateLanguageSitemap(
  baseUrl: string,
  language: string,
  pages: Array<{
    url: string;
    lastModified?: string;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
  }>
) {
  const langPrefix = language === 'es' ? '' : `/${language}`;
  const baseUrlWithLang = `${baseUrl}${langPrefix}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map(page => {
  const pageUrl = page.url.startsWith('http') ? page.url : `${baseUrlWithLang}${page.url}`;

  return `  <url>
    <loc>${pageUrl}</loc>
${page.lastModified ? `    <lastmod>${page.lastModified}</lastmod>` : ''}
${page.changeFrequency ? `    <changefreq>${page.changeFrequency}</changefreq>` : ''}
${page.priority ? `    <priority>${page.priority}</priority>` : ''}
${generateHrefLangAlternatives(baseUrl, page.url, language)}
  </url>`;
}).join('\n')}
</urlset>`;

  return xml;
}

/**
 * Generate hreflang alternatives for sitemap
 */
function generateHrefLangAlternatives(baseUrl: string, pageUrl: string, currentLanguage: string) {
  return supportedLanguageChunks
    .filter(lang => lang.code !== currentLanguage)
    .map(lang => {
      const langPrefix = lang.code === 'es' ? '' : `/${lang.code}`;
      const alternativeUrl = pageUrl.startsWith('http')
        ? pageUrl.replace(`/${currentLanguage}`, lang.code === 'es' ? '' : `/${lang.code}`)
        : `${baseUrl}${langPrefix}${pageUrl}`;

      return `    <xhtml:link rel="alternate" hreflang="${lang.code}" href="${alternativeUrl}" />`;
    })
    .join('\n');
}

/**
 * Generate SEO-friendly slug
 */
export function generateSEOSlug(text: string, language: string = 'en'): string {
  // Language-specific transliteration maps
  const transliterationMap: Record<string, Record<string, string>> = {
    es: {
      'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
      'Á': 'a', 'É': 'e', 'Í': 'i', 'Ó': 'o', 'Ú': 'u',
      'ñ': 'n', 'Ñ': 'n', 'ü': 'u', 'Ü': 'u'
    },
    de: {
      'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss',
      'Ä': 'ae', 'Ö': 'oe', 'Ü': 'ue'
    },
    fr: {
      'à': 'a', 'á': 'a', 'â': 'a', 'ä': 'a',
      'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
      'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
      'ò': 'o', 'ó': 'o', 'ô': 'o', 'ö': 'o',
      'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
      'ÿ': 'y', 'ç': 'c', 'ñ': 'n'
    },
    ar: {
      // Arabic characters are kept as is for now
    },
    ru: {
      // Russian characters are kept as is for now
    }
  };

  let processedText = text;

  // Apply transliteration if map exists for the language
  if (transliterationMap[language]) {
    Object.entries(transliterationMap[language]).forEach(([char, replacement]) => {
      processedText = processedText.replace(new RegExp(char, 'g'), replacement);
    });
  }

  // Convert to lowercase and replace non-alphanumeric characters
  return processedText
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate SEO title with optimal length
 */
export function generateSEOTitle(title: string, language: string): string {
  const langConfig = supportedLanguageChunks.find(lang => lang.code === language);
  const siteName = langConfig?.name || 'Luxury E-Commerce Store';

  // Optimal title length: 50-60 characters
  const maxLength = 60;
  const titleWithSite = `${title} | ${siteName}`;

  if (titleWithSite.length <= maxLength) {
    return titleWithSite;
  }

  // Truncate title to fit
  const availableSpace = maxLength - siteName.length - 3; // 3 for " | "
  const truncatedTitle = title.substring(0, availableSpace).trim();

  return `${truncatedTitle} | ${siteName}`;
}

/**
 * Generate SEO description with optimal length
 */
export function generateSEODescription(description: string, language: string): string {
  // Optimal description length: 150-160 characters
  const maxLength = 160;

  if (description.length <= maxLength) {
    return description;
  }

  // Find last complete word within limit
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > maxLength * 0.8
    ? truncated.substring(0, lastSpace)
    : truncated;
}

/**
 * Generate focus keywords for content
 */
export function generateFocusKeywords(content: string, language: string): string[] {
  // Simple keyword extraction (in production, use more sophisticated NLP)
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['that', 'with', 'have', 'this', 'will', 'your', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were'].includes(word));

  // Count word frequency
  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

/**
 * Generate structured data for organization
 */
export function generateOrganizationStructuredData(baseUrl: string, language: string) {
  const langConfig = supportedLanguageChunks.find(lang => lang.code === language);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": langConfig?.name || 'Luxury E-Commerce Store',
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": langConfig ? `Premium luxury products with AI-optimized SEO in ${langConfig.name}` : 'Premium luxury products with AI-optimized SEO',
    "foundingDate": "2024",
    "sameAs": [
      "https://facebook.com/luxurystore",
      "https://twitter.com/luxurystore",
      "https://instagram.com/luxurystore"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service",
      "availableLanguage": supportedLanguageChunks.map(lang => lang.name)
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Commerce St",
      "addressLocality": "City",
      "addressRegion": "State",
      "postalCode": "12345",
      "addressCountry": "US"
    }
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Generate how-to structured data
 */
export function generateHowToStructuredData(steps: Array<{ name: string; text: string; image?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to use our products",
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && { "image": step.image })
    }))
  };
}