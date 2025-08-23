import { ID, Timestamp } from './common';

export type SEOEntityType = 'product' | 'category' | 'blog' | 'collection' | 'page';

export interface BlogPost {
  id: ID;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  internalLinks?: BlogPostInternalLink[];
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    tags: string[];
    seoScore?: number;
  };
  published: boolean;
  audit: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
}

export interface BlogPostInternalLink {
  productId: ID;
  anchorText: string;
  url: string;
}

export interface Collection {
  id: ID;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  tags: string[];
  productIds: ID[];
  isHoliday: boolean;
  holidayDate?: Timestamp;
  isActive: boolean;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    seoScore?: number;
  };
  audit: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
}

export interface SEOLog {
  id: ID;
  action: string;
  entityId: ID;
  entityType: SEOEntityType;
  details?: Record<string, any>;
  userId?: ID;
  audit: {
    createdAt: Timestamp;
  };
}