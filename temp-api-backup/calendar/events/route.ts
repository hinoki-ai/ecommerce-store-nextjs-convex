/**
 * Calendar Events API Route
 * Handles CRUD operations for calendar events with SEO optimization
 */

import { NextRequest, NextResponse } from 'next/server';
import { calendarService } from '@/domain/services/calendar-service';
import { EcommerceCalendarEvent, CalendarFilters } from '@/domain/types/calendar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Build filters from search params
    const filters: CalendarFilters = {
      categories: searchParams.get('categories')?.split(',') as any,
      priority: searchParams.get('priority')?.split(',') as any,
      status: searchParams.get('status')?.split(',') as any,
      dateRange: searchParams.get('startDate') && searchParams.get('endDate') ? {
        start: new Date(searchParams.get('startDate')!),
        end: new Date(searchParams.get('endDate')!)
      } : undefined,
      productIds: searchParams.get('productIds')?.split(','),
      collectionIds: searchParams.get('collectionIds')?.split(','),
      search: searchParams.get('search') || undefined,
      isPublic: searchParams.get('isPublic') === 'true' ? true :
               searchParams.get('isPublic') === 'false' ? false : undefined
    };

    const limit = parseInt(searchParams.get('limit') || '1000');
    const events = await calendarService.getEvents(filters);

    // Add SEO metadata to response
    const seoMetadata = calendarService.generateCalendarPageSEO(events);

    return NextResponse.json({
      events,
      seo: seoMetadata,
      total: events.length,
      filters: filters
    });

  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.startDate || !body.endDate || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, startDate, endDate, category' },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects
    const eventData = {
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      isPublic: body.isPublic !== false, // Default to public for SEO
    };

    const newEvent = await calendarService.createEvent(eventData);

    return NextResponse.json({
      event: newEvent,
      message: 'Event created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('id');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Convert date strings to Date objects if provided
    const updateData = {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    };

    const updatedEvent = await calendarService.updateEvent(eventId, updateData);

    return NextResponse.json({
      event: updatedEvent,
      message: 'Event updated successfully'
    });

  } catch (error) {
    console.error('Error updating calendar event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('id');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    await calendarService.deleteEvent(eventId);

    return NextResponse.json({
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}