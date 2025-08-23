/**
 * Calendar Widget Component
 * SEO-optimized widget for homepage and product pages
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPinIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { EcommerceCalendarEvent } from '@/domain/types/calendar';
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
      setEvents(data.events || data || []);

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
          <Button variant="outline" onClick={fetchEvents}>
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!events.length) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No hay eventos próximos</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Revisa más tarde para nuevas actividades
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayEvents = events.slice(0, limit);

  if (compact) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <Link href="/calendario">
              <Button variant="ghost" size="sm">
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {displayEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {event.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <ClockIcon className="h-3 w-3" />
                    <span>{format(event.startDate, 'dd MMM', { locale: es })}</span>
                    {event.location && (
                      <>
                        <MapPinIcon className="h-3 w-3" />
                        <span className="truncate">{event.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t">
            <Link href="/calendario">
              <Button variant="outline" size="sm" className="w-full">
                Ver todos los eventos
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-primary" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Link href="/calendario">
            <Button variant="ghost" size="sm">
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayEvents.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    {isToday(event.startDate) && (
                      <Badge variant="secondary" className="text-xs">
                        Hoy
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {event.shortDescription || event.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{format(event.startDate, 'dd MMM yyyy', { locale: es })}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t">
          <Link href="/calendario">
            <Button variant="outline" className="w-full">
              Ver calendario completo
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function CompactCalendarWidget(props: CalendarWidgetProps) {
  return <CalendarWidget {...props} compact={true} />;
} 