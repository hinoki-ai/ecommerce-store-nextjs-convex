/**
 * Advanced Calendar System for Ecommerce SEO
 * Comprehensive event management with ecommerce-specific categories
 */

export type EcommerceEventCategory =
  | "PROMOTION"
  | "SALE"
  | "PRODUCT_LAUNCH"
  | "INVENTORY"
  | "SHIPPING"
  | "CUSTOMER_SERVICE"
  | "MAINTENANCE"
  | "HOLIDAY"
  | "TRAINING"
  | "MARKETING"
  | "SEO_UPDATE"
  | "CONTENT"
  | "TECHNOLOGY"
  | "SECURITY"
  | "COMPLIANCE"
  | "OPERATIONS"
  | "WEATHER"
  | "COMMUNITY";

export interface EcommerceCalendarEvent {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string; // For SEO snippets
  startDate: Date;
  endDate: Date;
  category: EcommerceEventCategory;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  location?: string;
  productIds?: string[]; // Related products
  collectionIds?: string[]; // Related collections
  status?:
    | "DRAFT"
    | "SCHEDULED"
    | "ACTIVE"
    | "COMPLETED"
    | "CANCELLED"
    | "POSTPONED";
  source: "STATIC" | "DATABASE";
  isAllDay?: boolean;
  isPublic?: boolean; // For SEO visibility
  metadata?: EcommerceEventMetadata;
  seo?: CalendarEventSEO;
}

export interface EcommerceEventMetadata {
  // Ecommerce specific
  productIds?: string[];
  collectionIds?: string[];
  promotionCode?: string;
  discountPercentage?: number;
  freeShipping?: boolean;
  specialOffers?: string[];

  // Operational
  requiresStaff?: boolean;
  estimatedDuration?: number; // in minutes
  preparationTime?: number; // in minutes
  cleanupTime?: number; // in minutes

  // Impact assessment
  expectedTrafficIncrease?: number; // percentage
  inventoryImpact?: "LOW" | "MEDIUM" | "HIGH";
  customerImpact?: "LOW" | "MEDIUM" | "HIGH";

  // Technical
  requiresMaintenance?: boolean;
  affectsDelivery?: boolean;
  affectsPayments?: boolean;

  // Marketing
  marketingChannels?: string[];
  targetAudience?: string[];
  expectedConversions?: number;

  // Additional fields
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  attachments?: CalendarAttachment[];
  customFields?: Record<string, any>;
}

export interface CalendarAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  thumbnailUrl?: string;
}

export interface CalendarEventSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  structuredData?: CalendarStructuredData;
  openGraph?: CalendarOpenGraph;
  twitterCard?: CalendarTwitterCard;
}

export interface CalendarStructuredData {
  "@context": "https://schema.org";
  "@type": "Event";
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: {
    "@type": "Place";
    name: string;
    address?: string;
  };
  organizer?: {
    "@type": "Organization";
    name: string;
    url?: string;
  };
  offers?: {
    "@type": "Offer";
    price?: string;
    priceCurrency?: string;
    availability?: string;
  };
  image?: string[];
  eventStatus?: string;
  eventAttendanceMode?: string;
}

export interface CalendarOpenGraph {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "event" | "article";
  siteName?: string;
}

export interface CalendarTwitterCard {
  card: "summary" | "summary_large_image";
  title: string;
  description: string;
  image?: string;
  site?: string;
}

export interface CalendarFilters {
  categories?: EcommerceEventCategory[];
  priority?: ("LOW" | "MEDIUM" | "HIGH" | "CRITICAL")[];
  status?: ("DRAFT" | "SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "POSTPONED")[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  productIds?: string[];
  collectionIds?: string[];
  search?: string;
  isPublic?: boolean;
}

export interface CalendarStatistics {
  totalEvents: number;
  eventsByCategory: Record<string, number>;
  eventsByStatus: Record<string, number>;
  eventsByPriority: Record<string, number>;
  upcomingEvents: number;
  activePromotions: number;
  completedEvents: number;
  avgEventDuration: number;
}

export interface CalendarRecurrence {
  pattern: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "CUSTOM";
  interval?: number;
  daysOfWeek?: string[];
  monthOfYear?: number;
  weekOfMonth?: number;
  endDate?: Date;
  occurrences?: number;
  exceptions?: Date[];
}