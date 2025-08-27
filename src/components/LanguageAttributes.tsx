"use client"

import { useLanguage } from './LanguageProvider';
import { generateMultilingualSEO } from '@/lib/divine-parsing-oracle';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface MultilingualSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'product';
}

export function LanguageAttributes() {
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    // Update document language and direction
    document.documentElement.lang = currentLanguage;

    // Set direction for RTL languages
    const isRTL = currentLanguage === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

    // Add RTL class for styling
    if (isRTL) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [currentLanguage]);

  return null; // This component doesn't render anything
}

/**
 * Component to add comprehensive multilingual SEO metadata
 */
export function MultilingualSEO({
  title,
  description,
  keywords = [],
  image,
  type = 'website'
}: MultilingualSEOProps) {
  const { currentLanguage } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const updateSEO = async () => {
      try {
        const seoData = await generateMultilingualSEO(pathname, currentLanguage);

        if (!seoData) return;

        // Update document title
        if (title) {
          document.title = title;
        }

        // Update meta description
        if (description) {
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', description);
          } else {
            const newMeta = document.createElement('meta');
            newMeta.name = 'description';
            newMeta.content = description;
            document.head.appendChild(newMeta);
          }
        }

        // Update keywords
        if (keywords.length > 0) {
          const metaKeywords = document.querySelector('meta[name="keywords"]');
          if (metaKeywords) {
            metaKeywords.setAttribute('content', keywords.join(', '));
          } else {
            const newMeta = document.createElement('meta');
            newMeta.name = 'keywords';
            newMeta.content = keywords.join(', ');
            document.head.appendChild(newMeta);
          }
        }

        // Add hreflang links
        seoData.hreflangs.forEach(hreflang => {
          const existingLink = document.querySelector(`link[rel="alternate"][hreflang="${hreflang.hrefLang}"]`);
          if (!existingLink) {
            const link = document.createElement('link');
            link.rel = 'alternate';
            link.hreflang = hreflang.hrefLang;
            link.href = hreflang.href;
            document.head.appendChild(link);
          }
        });

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && title) {
          ogTitle.setAttribute('content', title);
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription && description) {
          ogDescription.setAttribute('content', description);
        }

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) {
          ogUrl.setAttribute('content', seoData.canonical);
        }

        const ogLocale = document.querySelector('meta[property="og:locale"]');
        if (ogLocale) {
          ogLocale.setAttribute('content', seoData.metaTags['og:locale'] || currentLanguage);
        }

        if (image) {
          const ogImage = document.querySelector('meta[property="og:image"]');
          if (ogImage) {
            ogImage.setAttribute('content', image);
          } else {
            const newMeta = document.createElement('meta');
            newMeta.setAttribute('property', 'og:image');
            newMeta.content = image;
            document.head.appendChild(newMeta);
          }
        }

        console.log('Multilingual SEO updated:', { currentLanguage, canonical: seoData.canonical });
      } catch (error) {
        console.error('Failed to update multilingual SEO:', error);
      }
    };

    updateSEO();
  }, [currentLanguage, pathname, title, description, keywords, image, type]);

  return null; // This component doesn't render anything
}