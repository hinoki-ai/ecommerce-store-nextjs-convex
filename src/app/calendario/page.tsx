/**
 * Advanced Ecommerce Calendar Page
 * SEO-optimized calendar with Chilean market focus
 */

import { Metadata } from 'next';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, MapPinIcon, ClockIcon, TagIcon, FilterIcon } from 'lucide-react';
import { format, isToday, isFuture, isPast } from 'date-fns';
import { es } from 'date-fns/locale';
import { calendarService } from '@/domain/services/calendar-service';
import { EcommerceCalendarEvent, EcommerceEventCategory } from '@/domain/types/calendar';
import { categoryColors, categoryLabels } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import Script from 'next/script';

// Generate SEO metadata
export async function generateMetadata(): Promise<Metadata> {
  const events = await calendarService.getUpcomingEvents(20);
  const seo = calendarService.generateCalendarPageSEO(events);

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords,
    alternates: {
      canonical: 'https://www.tutienda.cl/calendario',
    },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      url: 'https://www.tutienda.cl/calendario',
      siteName: 'Tu Tienda Online',
      type: 'website',
      locale: 'es_CL',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.metaTitle,
      description: seo.metaDescription,
    },
  };
}

// Generate structured data for the calendar page
function generateCalendarPageStructuredData(events: EcommerceCalendarEvent[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Calendario de Eventos - Tu Tienda Online",
    "description": "Descubre todos nuestros eventos, promociones y actividades especiales. Mantente informado sobre ofertas, lanzamientos y eventos en nuestra tienda.",
    "url": "https://www.tutienda.cl/calendario",
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
        "eventStatus": event.status === 'ACTIVE' ? "https://schema.org/EventScheduled" :
                     event.status === 'COMPLETED' ? "https://schema.org/EventPostponed" :
                     event.status === 'CANCELLED' ? "https://schema.org/EventCancelled" :
                     "https://schema.org/EventScheduled",
        "location": event.location ? {
          "@type": "Place",
          "name": event.location,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Santiago",
            "addressRegion": "RM",
            "addressCountry": "CL"
          }
        } : undefined,
        "organizer": {
          "@type": "Organization",
          "name": "Tu Tienda Online",
          "url": "https://www.tutienda.cl"
        }
      }
    }))
  };
}

interface CalendarPageProps {
  searchParams: {
    category?: string;
    date?: string;
    view?: 'month' | 'week' | 'day';
  };
}

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  // Fetch calendar data
  const [upcomingEvents, activePromotions] = await Promise.all([
    calendarService.getUpcomingEvents(50),
    calendarService.getActivePromotions(),
  ]);

  const allEvents = [...upcomingEvents, ...activePromotions];
  const selectedCategory = searchParams.category as EcommerceEventCategory;
  const selectedDate = searchParams.date ? new Date(searchParams.date) : undefined;

  // Filter events by category if specified
  const filteredEvents = selectedCategory
    ? allEvents.filter(event => event.category === selectedCategory)
    : allEvents;

  // Group events by date for display
  const eventsByDate = filteredEvents.reduce((acc, event) => {
    const dateKey = format(event.startDate, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, EcommerceCalendarEvent[]>);

  // Generate structured data
  const structuredData = generateCalendarPageStructuredData(allEvents);

  return (
    <>
      {/* SEO Structured Data */}
      <Script
        id="calendar-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📅 Calendario de Eventos
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Mantente informado sobre todas nuestras promociones, lanzamientos de productos,
            eventos especiales y actividades. Planifica tu visita y no te pierdas ninguna oferta.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{allEvents.length}</div>
              <p className="text-sm text-gray-600">Total Eventos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{activePromotions.length}</div>
              <p className="text-sm text-gray-600">Promociones Activas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {Object.keys(eventsByDate).length}
              </div>
              <p className="text-sm text-gray-600">Días con Eventos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {filteredEvents.filter(e => isFuture(e.startDate)).length}
              </div>
              <p className="text-sm text-gray-600">Próximos Eventos</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FilterIcon className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold">Filtrar por Categoría</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!selectedCategory ? "default" : "outline"}
              size="sm"
              asChild
            >
              <a href="/calendario">Todos los Eventos</a>
            </Button>
            {Object.entries(categoryLabels).map(([category, label]) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                asChild
              >
                <a href={`/calendario?category=${category}`}>{label}</a>
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calendar">Vista Calendario</TabsTrigger>
            <TabsTrigger value="list">Lista de Eventos</TabsTrigger>
            <TabsTrigger value="today">Eventos de Hoy</TabsTrigger>
          </TabsList>

          {/* Calendar View */}
          <TabsContent value="calendar" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendario Interactivo</CardTitle>
                    <CardDescription>
                      Navega por el calendario y descubre todos nuestros eventos programados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      events={filteredEvents}
                      showEventIndicators={true}
                      compact={false}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar with upcoming events */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Próximos Eventos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {filteredEvents
                      .filter(event => isFuture(event.startDate))
                      .slice(0, 5)
                      .map((event) => (
                        <div
                          key={event.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge
                              className={cn(
                                "text-white text-xs",
                                categoryColors[event.category]
                              )}
                            >
                              {categoryLabels[event.category]}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {format(event.startDate, "dd MMM", { locale: es })}
                            </span>
                          </div>
                          <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {event.shortDescription || event.description}
                          </p>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                {/* Category Legend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Leyenda de Categorías</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(categoryLabels).map(([category, label]) => (
                        <div key={category} className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full",
                              categoryColors[category as EcommerceEventCategory]
                            )}
                          />
                          <span className="text-xs">{label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Todos los Eventos</CardTitle>
                <CardDescription>
                  Lista completa de eventos ordenados por fecha
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(eventsByDate)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([dateStr, events]) => (
                      <div key={dateStr} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-semibold text-lg mb-3">
                          {format(new Date(dateStr), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
                          {isToday(new Date(dateStr)) && (
                            <Badge className="ml-2 bg-green-500">Hoy</Badge>
                          )}
                        </h3>
                        <div className="space-y-3">
                          {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Today's Events */}
          <TabsContent value="today" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Eventos de Hoy</CardTitle>
                  <CardDescription>
                    Actividades programadas para {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredEvents
                      .filter(event => isToday(event.startDate))
                      .map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    {filteredEvents.filter(event => isToday(event.startDate)).length === 0 && (
                      <p className="text-gray-500 text-center py-8">
                        No hay eventos programados para hoy
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Promociones Activas</CardTitle>
                  <CardDescription>
                    Ofertas y promociones vigentes en este momento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activePromotions.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                    {activePromotions.length === 0 && (
                      <p className="text-gray-500 text-center py-8">
                        No hay promociones activas en este momento
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

// Event Card Component
interface EventCardProps {
  event: EcommerceCalendarEvent;
}

function EventCard({ event }: EventCardProps) {
  const isEventToday = isToday(event.startDate);
  const isEventPast = isPast(event.endDate);
  const isEventFuture = isFuture(event.startDate);

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      isEventToday && "ring-2 ring-blue-500",
      isEventPast && "opacity-60"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "text-white text-xs",
                categoryColors[event.category]
              )}
            >
              {categoryLabels[event.category]}
            </Badge>
            {isEventToday && (
              <Badge className="bg-blue-500 text-white text-xs">Hoy</Badge>
            )}
            {event.priority === 'HIGH' && (
              <Badge className="bg-red-500 text-white text-xs">Alta Prioridad</Badge>
            )}
          </div>
          {event.status && (
            <Badge variant="outline" className="text-xs">
              {event.status}
            </Badge>
          )}
        </div>

        <h4 className="font-semibold text-base mb-2">{event.title}</h4>

        {event.shortDescription && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {event.shortDescription}
          </p>
        )}

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {format(event.startDate, "dd MMM yyyy", { locale: es })}
              {event.endDate.getTime() !== event.startDate.getTime() &&
                ` - ${format(event.endDate, "dd MMM yyyy", { locale: es })}`}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}

          {!event.isAllDay && (
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <span>
                {format(event.startDate, "HH:mm", { locale: es })} - {format(event.endDate, "HH:mm", { locale: es })}
              </span>
            </div>
          )}

          {event.priority && (
            <div className="flex items-center gap-2">
              <TagIcon className="h-4 w-4" />
              <span>Prioridad: {event.priority}</span>
            </div>
          )}
        </div>

        {event.metadata?.promotionCode && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm font-medium text-green-800">
              Código de promoción: <code className="bg-white px-1 rounded">{event.metadata.promotionCode}</code>
            </p>
          </div>
        )}

        {event.productIds && event.productIds.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Productos relacionados:</p>
            <div className="flex flex-wrap gap-1">
              {event.productIds.slice(0, 3).map((productId) => (
                <Badge key={productId} variant="secondary" className="text-xs">
                  Producto {productId}
                </Badge>
              ))}
              {event.productIds.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{event.productIds.length - 3} más
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}