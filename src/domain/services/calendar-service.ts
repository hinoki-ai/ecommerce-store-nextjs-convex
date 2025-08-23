/**
 * Advanced Calendar Service for Ecommerce
 * Handles event management, SEO optimization, and business logic
 */

import { EcommerceCalendarEvent, CalendarFilters, CalendarStatistics, EcommerceEventCategory } from '../types/calendar';
import { api } from '@/lib/api';

export class CalendarService {
  private static instance: CalendarService;

  static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  /**
   * Get events with ecommerce-specific filtering
   */
  async getEvents(filters?: CalendarFilters): Promise<EcommerceCalendarEvent[]> {
    try {
      const params = this.buildFilterParams(filters);
      const response = await api.get('/api/calendar/events', { params });
      return this.transformApiResponse(response.data);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }

  /**
   * Get upcoming events optimized for homepage display
   */
  async getUpcomingEvents(limit: number = 5): Promise<EcommerceCalendarEvent[]> {
    try {
      const response = await api.get('/api/calendar/upcoming', {
        params: { limit, publicOnly: true }
      });
      return this.transformApiResponse(response.data);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  }

  /**
   * Get events related to specific products
   */
  async getProductRelatedEvents(productId: string): Promise<EcommerceCalendarEvent[]> {
    try {
      const response = await api.get('/api/calendar/product-events', {
        params: { productId }
      });
      return this.transformApiResponse(response.data);
    } catch (error) {
      console.error('Error fetching product events:', error);
      return [];
    }
  }

  /**
   * Get active promotions for homepage display
   */
  async getActivePromotions(): Promise<EcommerceCalendarEvent[]> {
    try {
      const response = await api.get('/api/calendar/promotions', {
        params: { active: true }
      });
      return this.transformApiResponse(response.data);
    } catch (error) {
      console.error('Error fetching active promotions:', error);
      return [];
    }
  }

  /**
   * Get calendar statistics for dashboard
   */
  async getStatistics(): Promise<CalendarStatistics> {
    try {
      const response = await api.get('/api/calendar/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar statistics:', error);
      return this.getDefaultStatistics();
    }
  }

  /**
   * Create SEO-optimized event
   */
  async createEvent(event: Omit<EcommerceCalendarEvent, 'id'>): Promise<EcommerceCalendarEvent> {
    try {
      const seoOptimizedEvent = this.optimizeEventForSEO(event);
      const response = await api.post('/api/calendar/events', seoOptimizedEvent);
      return this.transformApiResponse([response.data])[0];
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  /**
   * Update event with SEO optimization
   */
  async updateEvent(id: string, updates: Partial<EcommerceCalendarEvent>): Promise<EcommerceCalendarEvent> {
    try {
      const seoOptimizedUpdates = this.optimizeEventForSEO(updates);
      const response = await api.put(`/api/calendar/events/${id}`, seoOptimizedUpdates);
      return this.transformApiResponse([response.data])[0];
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  /**
   * Delete event
   */
  async deleteEvent(id: string): Promise<void> {
    try {
      await api.delete(`/api/calendar/events/${id}`);
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  /**
   * Generate SEO-optimized calendar page content
   */
  generateCalendarPageSEO(events: EcommerceCalendarEvent[]) {
    const totalEvents = events.length;
    const categories = [...new Set(events.map(e => e.category))];
    const upcomingEvents = events.filter(e => e.startDate > new Date());

    return {
      metaTitle: `Calendario de Eventos - ${totalEvents} eventos programados`,
      metaDescription: `Descubre nuestro calendario completo con ${upcomingEvents.length} eventos próximos. ${categories.join(', ')}. Planifica tu visita y mantente informado.`,
      keywords: [
        'calendario eventos',
        'eventos tienda',
        'promociones',
        'ofertas especiales',
        'horarios tienda',
        ...categories.map(cat => `eventos ${cat.toLowerCase()}`)
      ],
      structuredData: this.generateCalendarStructuredData(events)
    };
  }

  /**
   * Generate structured data for events
   */
  private generateCalendarStructuredData(events: EcommerceCalendarEvent[]) {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Calendario de Eventos",
      "description": "Lista completa de eventos, promociones y actividades programadas",
      "numberOfItems": events.length,
      "itemListElement": events.slice(0, 10).map((event, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Event",
          "name": event.title,
          "description": event.shortDescription || event.description,
          "startDate": event.startDate.toISOString(),
          "endDate": event.endDate.toISOString(),
          "eventStatus": this.mapEventStatusToSchema(event.status),
          "eventAttendanceMode": event.location ? "https://schema.org/OfflineEventAttendanceMode" : "https://schema.org/OnlineEventAttendanceMode",
          ...(event.location && {
            "location": {
              "@type": "Place",
              "name": event.location
            }
          }),
          ...(event.seo?.structuredData?.image && {
            "image": event.seo.structuredData.image
          })
        }
      }))
    };
  }

  /**
   * Optimize event data for SEO
   */
  private optimizeEventForSEO(event: Partial<EcommerceCalendarEvent>): Partial<EcommerceCalendarEvent> {
    const title = event.title || '';
    const description = event.description || '';

    // Generate SEO-friendly short description
    const shortDescription = description.length > 160
      ? description.substring(0, 157) + '...'
      : description;

    // Generate meta title
    const metaTitle = title.length > 60
      ? title.substring(0, 57) + '...'
      : title;

    // Generate meta description
    const metaDescription = shortDescription ||
      `Descubre detalles sobre ${title.toLowerCase()}. Información completa sobre este evento especial.`;

    return {
      ...event,
      shortDescription,
      seo: {
        metaTitle,
        metaDescription,
        keywords: this.generateEventKeywords(event),
        structuredData: this.generateEventStructuredData(event),
        ...event.seo
      }
    };
  }

  /**
   * Generate keywords for event
   */
  private generateEventKeywords(event: Partial<EcommerceCalendarEvent>): string[] {
    const keywords: string[] = ['evento', 'actividad'];

    if (event.category) {
      keywords.push(event.category.toLowerCase());
    }

    if (event.title) {
      const titleWords = event.title.toLowerCase().split(' ').filter(word => word.length > 2);
      keywords.push(...titleWords);
    }

    return [...new Set(keywords)];
  }

  /**
   * Generate structured data for individual event
   */
  private generateEventStructuredData(event: Partial<EcommerceCalendarEvent>) {
    if (!event.title || !event.startDate || !event.endDate) return undefined;

    return {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": event.title,
      "description": event.shortDescription || event.description,
      "startDate": event.startDate.toISOString(),
      "endDate": event.endDate.toISOString(),
      "eventStatus": this.mapEventStatusToSchema(event.status),
      "eventAttendanceMode": event.location ? "https://schema.org/OfflineEventAttendanceMode" : "https://schema.org/OnlineEventAttendanceMode",
      ...(event.location && {
        "location": {
          "@type": "Place",
          "name": event.location
        }
      })
    };
  }

  /**
   * Map internal status to Schema.org event status
   */
  private mapEventStatusToSchema(status?: string): string {
    switch (status) {
      case 'ACTIVE':
      case 'SCHEDULED':
        return "https://schema.org/EventScheduled";
      case 'COMPLETED':
        return "https://schema.org/EventPostponed"; // Schema doesn't have "completed"
      case 'CANCELLED':
        return "https://schema.org/EventCancelled";
      case 'POSTPONED':
        return "https://schema.org/EventPostponed";
      default:
        return "https://schema.org/EventScheduled";
    }
  }

  /**
   * Build filter parameters for API requests
   */
  private buildFilterParams(filters?: CalendarFilters): Record<string, any> {
    if (!filters) return {};

    const params: Record<string, any> = {};

    if (filters.categories?.length) {
      params.categories = filters.categories.join(',');
    }

    if (filters.priority?.length) {
      params.priority = filters.priority.join(',');
    }

    if (filters.status?.length) {
      params.status = filters.status.join(',');
    }

    if (filters.dateRange) {
      params.startDate = filters.dateRange.start.toISOString();
      params.endDate = filters.dateRange.end.toISOString();
    }

    if (filters.productIds?.length) {
      params.productIds = filters.productIds.join(',');
    }

    if (filters.collectionIds?.length) {
      params.collectionIds = filters.collectionIds.join(',');
    }

    if (filters.search) {
      params.search = filters.search;
    }

    if (filters.isPublic !== undefined) {
      params.isPublic = filters.isPublic;
    }

    return params;
  }

  /**
   * Transform API response to match our types
   */
  private transformApiResponse(data: any[]): EcommerceCalendarEvent[] {
    return data.map(event => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      category: event.category as EcommerceEventCategory,
      priority: event.priority || 'MEDIUM',
      status: event.status || 'SCHEDULED',
      source: event.source || 'DATABASE',
      isAllDay: event.isAllDay || false,
      isPublic: event.isPublic !== false
    }));
  }

  /**
   * Get default statistics
   */
  private getDefaultStatistics(): CalendarStatistics {
    return {
      totalEvents: 0,
      eventsByCategory: {},
      eventsByStatus: {},
      eventsByPriority: {},
      upcomingEvents: 0,
      activePromotions: 0,
      completedEvents: 0,
      avgEventDuration: 0
    };
  }
}

export const calendarService = CalendarService.getInstance();