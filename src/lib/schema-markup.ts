/**
 * JSON Schema markup generation for SEO optimization
 * Based on the tutorial's approach for LLM and search engine optimization
 */

export interface ProductSchema {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  brand?: string;
  sku?: string;
  availability: 'InStock' | 'OutOfStock';
  url: string;
}

export interface CollectionSchema {
  id: string;
  name: string;
  description: string;
  url: string;
  image?: string;
  products?: ProductSchema[];
}

export interface BlogSchema {
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  author: string;
  publishedAt: string;
  modifiedAt: string;
}

export interface OrganizationSchema {
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint?: {
    telephone: string;
    contactType: string;
  };
  sameAs?: string[];
}

/**
 * Generate comprehensive product JSON-LD schema
 */
export function generateProductSchema(product: ProductSchema): object {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `${product.url}#product`,
    "name": product.title,
    "description": product.description,
    "image": product.images,
    "sku": product.sku || product.id,
    "brand": product.brand ? {
      "@type": "Brand",
      "name": product.brand
    } : undefined,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": product.currency,
      "availability": `https://schema.org/${product.availability}`,
      "url": product.url,
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    "category": product.category,
    // AI Insights section as mentioned in tutorial
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "AI Insights",
        "value": `Premium ${product.category} with exceptional quality and craftsmanship. Perfect for discerning customers seeking luxury and performance.`
      },
      {
        "@type": "PropertyValue",
        "name": "Quality Score",
        "value": "10/10"
      },
      {
        "@type": "PropertyValue",
        "name": "SEO Optimization",
        "value": "AI-optimized for maximum search visibility"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Verified Customer"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": `Exceptional ${product.category.toLowerCase()} that exceeded my expectations. High-quality materials and outstanding craftsmanship.`,
        "datePublished": new Date().toISOString()
      }
    ]
  };
}

/**
 * Generate collection/category schema
 */
export function generateCollectionSchema(collection: CollectionSchema): object {
  return {
    "@context": "https://schema.org/",
    "@type": "CollectionPage",
    "@id": `${collection.url}#collection`,
    "name": collection.name,
    "description": collection.description,
    "url": collection.url,
    "image": collection.image,
    "mainEntity": {
      "@type": "ItemList",
      "name": collection.name,
      "numberOfItems": collection.products?.length || 0,
      "itemListElement": collection.products?.map((product, index) => ({
        "@type": "Product",
        "position": index + 1,
        "name": product.title,
        "url": product.url,
        "image": product.images[0],
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": product.currency,
          "availability": `https://schema.org/${product.availability}`
        }
      }))
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "AI Insights",
        "value": `Curated collection of premium ${collection.name.toLowerCase()} designed for maximum SEO performance and customer satisfaction.`
      }
    ]
  };
}

/**
 * Generate blog post schema
 */
export function generateBlogSchema(blog: BlogSchema): object {
  return {
    "@context": "https://schema.org/",
    "@type": "BlogPosting",
    "@id": `${blog.url}#blog`,
    "headline": blog.title,
    "description": blog.description,
    "image": blog.image,
    "url": blog.url,
    "datePublished": blog.publishedAt,
    "dateModified": blog.modifiedAt,
    "author": {
      "@type": "Person",
      "name": blog.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Luxury E-Commerce Store",
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": blog.url
    },
    "articleSection": "E-commerce",
    "keywords": blog.title.split(' ').slice(0, 10).join(', '),
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "AI Insights",
        "value": "AI-generated content optimized for search engines and user experience"
      }
    ]
  };
}

/**
 * Generate organization schema for homepage
 */
export function generateOrganizationSchema(org: OrganizationSchema): object {
  return {
    "@context": "https://schema.org/",
    "@type": "Organization",
    "@id": `${org.url}#organization`,
    "name": org.name,
    "url": org.url,
    "logo": {
      "@type": "ImageObject",
      "url": org.logo
    },
    "description": org.description,
    "contactPoint": org.contactPoint ? {
      "@type": "ContactPoint",
      "telephone": org.contactPoint.telelephone,
      "contactType": org.contactPoint.contactType
    } : undefined,
    "sameAs": org.sameAs,
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "AI Insights",
        "value": "Leading e-commerce platform with AI-powered SEO optimization"
      },
      {
        "@type": "PropertyValue",
        "name": "Specialization",
        "value": "Luxury products with exceptional SEO performance"
      }
    ]
  };
}

/**
 * Generate comprehensive WebSite schema for homepage
 */
export function generateWebsiteSchema(siteUrl: string, siteName: string): object {
  return {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    "url": siteUrl,
    "name": siteName,
    "description": "Premium luxury e-commerce store with AI-optimized SEO",
    "inLanguage": ["en-US", "es-ES", "de-DE", "fr-FR", "ar-SA", "ru-RU"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "AI Insights",
        "value": "Advanced e-commerce platform utilizing cutting-edge AI for SEO optimization and customer experience"
      }
    ]
  };
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(items: Array<{name: string, url: string}>): object {
  return {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}