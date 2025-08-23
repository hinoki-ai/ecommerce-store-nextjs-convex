/**
 * Product Events API Route
 * Returns events related to specific products
 */

import { NextRequest, NextResponse } from 'next/server';
import { calendarService } from '@/domain/services/calendar-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const includePast = searchParams.get('includePast') === 'true';

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const events = await calendarService.getProductRelatedEvents(productId);

    // Filter based on includePast parameter
    const filteredEvents = includePast
      ? events.slice(0, limit)
      : events.filter(event => event.endDate > new Date()).slice(0, limit);

    return NextResponse.json({
      events: filteredEvents,
      total: filteredEvents.length,
      productId,
      includePast,
      limit
    });

  } catch (error) {
    console.error('Error fetching product events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}