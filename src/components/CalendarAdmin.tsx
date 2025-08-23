/**
 * Calendar Admin Management Interface
 * Advanced event management with SEO optimization tools
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  TagIcon,
  SearchIcon,
  FilterIcon,
  SaveIcon,
  EyeIcon,
  EyeOffIcon,
  GlobeIcon,
  SettingsIcon
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { EcommerceCalendarEvent, EcommerceEventCategory, CalendarFilters } from '@/domain/types/calendar';
import { categoryColors, categoryLabels } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface CalendarAdminProps {
  className?: string;
}

export function CalendarAdmin({ className }: CalendarAdminProps) {
  const [events, setEvents] = useState<EcommerceCalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EcommerceCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EcommerceCalendarEvent | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<CalendarFilters>({});
  const [statistics, setStatistics] = useState({
    totalEvents: 0,
    activePromotions: 0,
    upcomingEvents: 0,
    completedEvents: 0
  });

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    startDate: new Date(),
    endDate: new Date(),
    category: 'PROMOTION' as EcommerceEventCategory,
    priority: 'MEDIUM' as const,
    location: '',
    productIds: [] as string[],
    collectionIds: [] as string[],
    isAllDay: false,
    isPublic: true,
    status: 'DRAFT' as const,
    metadata: {
      promotionCode: '',
      discountPercentage: 0,
      freeShipping: false,
      specialOffers: [] as string[]
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [] as string[]
    }
  });

  useEffect(() => {
    fetchEvents();
    fetchStatistics();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, searchTerm, filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/calendar/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/calendar/statistics');
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const applyFilters = () => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(search) ||
        event.description.toLowerCase().includes(search) ||
        event.location?.toLowerCase().includes(search)
      );
    }

    // Category filter
    if (filters.categories?.length) {
      filtered = filtered.filter(event =>
        filters.categories!.includes(event.category)
      );
    }

    // Status filter
    if (filters.status?.length) {
      filtered = filtered.filter(event =>
        filters.status!.includes(event.status!)
      );
    }

    // Priority filter
    if (filters.priority?.length) {
      filtered = filtered.filter(event =>
        filters.priority!.includes(event.priority!)
      );
    }

    setFilteredEvents(filtered);
  };

  const handleCreateEvent = async () => {
    try {
      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm),
      });

      if (!response.ok) throw new Error('Failed to create event');

      await fetchEvents();
      await fetchStatistics();
      setIsCreateDialogOpen(false);
      resetEventForm();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;

    try {
      const response = await fetch(`/api/calendar/events?id=${selectedEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm),
      });

      if (!response.ok) throw new Error('Failed to update event');

      await fetchEvents();
      await fetchStatistics();
      setIsEditDialogOpen(false);
      setSelectedEvent(null);
      resetEventForm();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/calendar/events?id=${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete event');

      await fetchEvents();
      await fetchStatistics();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      shortDescription: '',
      startDate: new Date(),
      endDate: new Date(),
      category: 'PROMOTION',
      priority: 'MEDIUM',
      location: '',
      productIds: [],
      collectionIds: [],
      isAllDay: false,
      isPublic: true,
      status: 'DRAFT',
      metadata: {
        promotionCode: '',
        discountPercentage: 0,
        freeShipping: false,
        specialOffers: []
      },
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: []
      }
    });
  };

  const openEditDialog = (event: EcommerceCalendarEvent) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      description: event.description || '',
      shortDescription: event.shortDescription || '',
      startDate: event.startDate,
      endDate: event.endDate,
      category: event.category,
      priority: (event.priority || 'MEDIUM') as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      location: event.location || '',
      productIds: event.productIds || [],
      collectionIds: event.collectionIds || [],
      isAllDay: event.isAllDay || false,
      isPublic: event.isPublic !== false,
      status: (event.status || 'DRAFT') as "DRAFT" | "SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "POSTPONED",
      metadata: {
        promotionCode: event.metadata?.promotionCode || '',
        discountPercentage: event.metadata?.discountPercentage || 0,
        freeShipping: event.metadata?.freeShipping || false,
        specialOffers: event.metadata?.specialOffers || []
      },
      seo: {
        metaTitle: event.seo?.metaTitle || '',
        metaDescription: event.seo?.metaDescription || '',
        keywords: event.seo?.keywords || []
      }
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Administrar Calendario</h1>
          <p className="text-muted-foreground">Gestiona eventos, promociones y actividades</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Nuevo Evento
            </Button>
          </DialogTrigger>
          <EventFormDialog
            form={eventForm}
            setForm={setEventForm}
            onSubmit={handleCreateEvent}
            onCancel={() => {
              setIsCreateDialogOpen(false);
              resetEventForm();
            }}
            title="Crear Nuevo Evento"
          />
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{statistics.totalEvents}</div>
            <p className="text-sm text-muted-foreground">Total Eventos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{statistics.activePromotions}</div>
            <p className="text-sm text-muted-foreground">Promociones Activas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{statistics.upcomingEvents}</div>
            <p className="text-sm text-muted-foreground">Próximos Eventos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{statistics.completedEvents}</div>
            <p className="text-sm text-muted-foreground">Eventos Completados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FilterIcon className="h-5 w-5" />
            <CardTitle>Filtros y Búsqueda</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Categoría</Label>
              <Select
                value={filters.categories?.[0] || ''}
                onValueChange={(value) =>
                  setFilters(prev => ({ ...prev, categories: value ? [value as EcommerceEventCategory] : [] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([category, label]) => (
                    <SelectItem key={category} value={category}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Estado</Label>
              <Select
                value={filters.status?.[0] || ''}
                onValueChange={(value) =>
                  setFilters(prev => ({ ...prev, status: value ? [value as any] : [] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Borrador</SelectItem>
                  <SelectItem value="SCHEDULED">Programado</SelectItem>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="COMPLETED">Completado</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Prioridad</Label>
              <Select
                value={filters.priority?.[0] || ''}
                onValueChange={(value) =>
                  setFilters(prev => ({ ...prev, priority: value ? [value as any] : [] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baja</SelectItem>
                  <SelectItem value="MEDIUM">Media</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="CRITICAL">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Eventos</CardTitle>
          <CardDescription>
            {filteredEvents.length} de {events.length} eventos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando eventos...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron eventos
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={() => openEditDialog(event)}
                  onDelete={() => handleDeleteEvent(event.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <EventFormDialog
          form={eventForm}
          setForm={setEventForm}
          onSubmit={handleUpdateEvent}
          onCancel={() => {
            setIsEditDialogOpen(false);
            setSelectedEvent(null);
            resetEventForm();
          }}
          title="Editar Evento"
        />
      </Dialog>
    </div>
  );
}

// Event Card Component
interface EventCardProps {
  event: EcommerceCalendarEvent;
  onEdit: () => void;
  onDelete: () => void;
}

function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "text-white text-xs",
                categoryColors[event.category]
              )}
            >
              {categoryLabels[event.category]}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {event.status}
            </Badge>
            {event.isPublic ? (
              <EyeIcon className="h-4 w-4 text-green-600" title="Público" />
            ) : (
              <EyeOffIcon className="h-4 w-4 text-gray-400" title="Privado" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <EditIcon className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará permanentemente el evento "{event.title}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
        <p className="text-muted-foreground text-sm mb-3">{event.shortDescription}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{format(event.startDate, "dd MMM yyyy", { locale: es })}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <TagIcon className="h-4 w-4" />
            <span>{event.priority}</span>
          </div>
          <div className="flex items-center gap-1">
            <GlobeIcon className="h-4 w-4" />
            <span>{event.isPublic ? 'Público' : 'Privado'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Event Form Dialog Component
interface EventFormDialogProps {
  form: any;
  setForm: (form: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  title: string;
}

function EventFormDialog({ form, setForm, onSubmit, onCancel, title }: EventFormDialogProps) {
  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          Complete los detalles del evento. Los campos marcados con * son obligatorios.
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ej: Gran Venta de Verano"
              />
            </div>
            <div>
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([category, label]) => (
                    <SelectItem key={category} value={category}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="shortDescription">Descripción Corta</Label>
            <Textarea
              id="shortDescription"
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              placeholder="Breve descripción para listas y widgets..."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción Completa</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descripción detallada del evento..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha de Inicio</Label>
              <Input
                type="datetime-local"
                value={form.startDate.toISOString().slice(0, 16)}
                onChange={(e) => setForm({ ...form, startDate: new Date(e.target.value) })}
              />
            </div>
            <div>
              <Label>Fecha de Fin</Label>
              <Input
                type="datetime-local"
                value={form.endDate.toISOString().slice(0, 16)}
                onChange={(e) => setForm({ ...form, endDate: new Date(e.target.value) })}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Ej: Tienda Principal, Santiago"
              />
            </div>
            <div>
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                value={form.priority}
                onValueChange={(value) => setForm({ ...form, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baja</SelectItem>
                  <SelectItem value="MEDIUM">Media</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="CRITICAL">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAllDay"
              checked={form.isAllDay}
              onCheckedChange={(checked) => setForm({ ...form, isAllDay: checked })}
            />
            <Label htmlFor="isAllDay">Todo el día</Label>
          </div>

          <div className="space-y-2">
            <Label>Códigos de Promoción</Label>
            <Input
              value={form.metadata.promotionCode}
              onChange={(e) => setForm({
                ...form,
                metadata: { ...form.metadata, promotionCode: e.target.value }
              })}
              placeholder="Ej: VERANO2025"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Porcentaje de Descuento</Label>
              <Input
                type="number"
                value={form.metadata.discountPercentage}
                onChange={(e) => setForm({
                  ...form,
                  metadata: { ...form.metadata, discountPercentage: parseFloat(e.target.value) || 0 }
                })}
                placeholder="Ej: 20"
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="freeShipping"
                checked={form.metadata.freeShipping}
                onCheckedChange={(checked) => setForm({
                  ...form,
                  metadata: { ...form.metadata, freeShipping: checked }
                })}
              />
              <Label htmlFor="freeShipping">Envío Gratis</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">Meta Título</Label>
            <Input
              id="metaTitle"
              value={form.seo.metaTitle}
              onChange={(e) => setForm({
                ...form,
                seo: { ...form.seo, metaTitle: e.target.value }
              })}
              placeholder="Título para SEO"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {form.seo.metaTitle.length}/60 caracteres
            </p>
          </div>

          <div>
            <Label htmlFor="metaDescription">Meta Descripción</Label>
            <Textarea
              id="metaDescription"
              value={form.seo.metaDescription}
              onChange={(e) => setForm({
                ...form,
                seo: { ...form.seo, metaDescription: e.target.value }
              })}
              placeholder="Descripción para SEO"
              rows={2}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {form.seo.metaDescription.length}/160 caracteres
            </p>
          </div>

          <div>
            <Label htmlFor="keywords">Palabras Clave</Label>
            <Input
              id="keywords"
              value={form.seo.keywords.join(', ')}
              onChange={(e) => setForm({
                ...form,
                seo: { ...form.seo, keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) }
              })}
              placeholder="evento, promoción, tienda, ofertas"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separadas por comas
            </p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div>
            <Label htmlFor="status">Estado</Label>
            <Select
              value={form.status}
              onValueChange={(value) => setForm({ ...form, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Borrador</SelectItem>
                <SelectItem value="SCHEDULED">Programado</SelectItem>
                <SelectItem value="ACTIVE">Activo</SelectItem>
                <SelectItem value="COMPLETED">Completado</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublic"
              checked={form.isPublic}
              onCheckedChange={(checked) => setForm({ ...form, isPublic: checked })}
            />
            <Label htmlFor="isPublic">Visible al público (SEO)</Label>
          </div>

          <div>
            <Label>IDs de Productos (separados por comas)</Label>
            <Input
              value={form.productIds.join(', ')}
              onChange={(e) => setForm({
                ...form,
                productIds: e.target.value.split(',').map(id => id.trim()).filter(id => id)
              })}
              placeholder="prod_1, prod_2, prod_3"
            />
          </div>

          <div>
            <Label>IDs de Colecciones (separados por comas)</Label>
            <Input
              value={form.collectionIds.join(', ')}
              onChange={(e) => setForm({
                ...form,
                collectionIds: e.target.value.split(',').map(id => id.trim()).filter(id => id)
              })}
              placeholder="col_1, col_2, col_3"
            />
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSubmit}>
          <SaveIcon className="mr-2 h-4 w-4" />
          {title.includes('Crear') ? 'Crear Evento' : 'Guardar Cambios'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}