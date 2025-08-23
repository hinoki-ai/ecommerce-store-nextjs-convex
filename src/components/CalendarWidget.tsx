/**
 * Calendar Widget Component
 * SEO-optimized widget for homepage and product pages
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPinIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { EcommerceCalendarEvent } from '@/domain/types/calendar';
import { categoryColors, categoryLabels } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface CalendarWidgetProps {
  title?: string;
  description?: string;
  limit?: number;
  showCategories?: boolean;
  compact?: boolean;
  productId?: string; // For product-specific events
  className?: string;
}

export function CalendarWidget({
  title = "Próximos Eventos",
  description = "Mantente informado sobre nuestras próximas actividades",
  limit = 3,
  showCategories = true,
  compact = false,
  productId,
  className
}: CalendarWidgetProps) {
  const [events, setEvents] = useState<EcommerceCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [productId, limit]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = productId
        ? `/api/calendar/product-events?productId=${productId}&limit=${limit}`
        : `/api/calendar/upcoming?limit=${limit}&publicOnly=true`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.events || []);

    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError('Error al cargar los eventos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={fetchEvents}
            className="w-full"
          >
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {productId
              ? "No hay eventos programados para este producto"
              : "No hay eventos próximos programados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild className="w-full">
            <a href="/calendario">
              Ver Calendario Completo
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              compact={compact}
              showCategory={showCategories}
            />
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" asChild className="w-full">
            <a href="/calendario">
              Ver Todos los Eventos
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface EventItemProps {
  event: EcommerceCalendarEvent;
  compact?: boolean;
  showCategory?: boolean;
}

function EventItem({ event, compact = false, showCategory = true }: EventItemProps) {
  const isEventToday = isToday(event.startDate);

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
        <div
          className={cn(
            "w-3 h-3 rounded-full flex-shrink-0",
            categoryColors[event.category]
          )}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{event.title}</p>
          <p className="text-xs text-gray-500">
            {format(event.startDate, "dd MMM", { locale: es })}
            {isEventToday && (
              <Badge className="ml-1 bg-blue-500 text-white text-xs">Hoy</Badge>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {showCategory && (
            <Badge
              className={cn(
                "text-white text-xs",
                categoryColors[event.category]
              )}
            >
              {categoryLabels[event.category]}
            </Badge>
          )}
          {isEventToday && (
            <Badge className="bg-blue-500 text-white text-xs">Hoy</Badge>
          )}
          {event.priority === 'HIGH' && (
            <Badge className="bg-red-500 text-white text-xs">Alta</Badge>
          )}
        </div>
      </div>

      <h4 className="font-medium text-sm mb-1">{event.title}</h4>

      {event.shortDescription && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {event.shortDescription}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <CalendarIcon className="h-3 w-3" />
          <span>
            {format(event.startDate, "dd MMM", { locale: es })}
            {event.endDate.getTime() !== event.startDate.getTime() &&
              ` - ${format(event.endDate, "dd MMM", { locale: es })}`}
          </span>
        </div>

        {event.location && (
          <div className="flex items-center gap-1">
            <MapPinIcon className="h-3 w-3" />
            <span className="truncate">{event.location}</span>
          </div>
        )}

        {!event.isAllDay && (
          <div className="flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            <span>
              {format(event.startDate, "HH:mm", { locale: es })}
            </span>
          </div>
        )}
      </div>

      {event.metadata?.promotionCode && (
        <div className="mt-2 p-1 bg-green-50 border border-green-200 rounded">
          <p className="text-xs font-medium text-green-800">
            Código: <code className="bg-white px-1 rounded">{event.metadata.promotionCode}</code>
          </p>
        </div>
      )}
    </div>
  );
}

// Compact version for homepage hero
export function CompactCalendarWidget({ className }: { className?: string }) {
  return (
    <CalendarWidget
      title="🎉 Próximas Actividades"
      description="Eventos y promociones que no te puedes perder"
      limit={2}
      compact={true}
      showCategories={false}
      className={cn("max-w-md", className)}
    />
  );
}