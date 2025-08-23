/**
 * Upcoming Events API Route
 * Optimized for homepage widgets and quick event display
 */

import { NextRequest, NextResponse } from 'next/server';
import { calendarService } from '@/domain/services/calendar-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const publicOnly = searchParams.get('publicOnly') !== 'false';

    const events = await calendarService.getUpcomingEvents(limit);

    // Filter for public events only if requested
    const filteredEvents = publicOnly
      ? events.filter(event => event.isPublic)
      : events;

    return NextResponse.json({
      events: filteredEvents,
      total: filteredEvents.length,
      limit,
      publicOnly
    });

  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}