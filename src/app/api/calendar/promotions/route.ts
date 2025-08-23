/**
 * Active Promotions API Route
 * Returns currently active promotions and sales
 */

import { NextRequest, NextResponse } from 'next/server';
import { calendarService } from '@/domain/services/calendar-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active') !== 'false';

    const promotions = active
      ? await calendarService.getActivePromotions()
      : await calendarService.getUpcomingEvents(20).then(events =>
          events.filter(e => e.category === 'PROMOTION' || e.category === 'SALE')
        );

    return NextResponse.json({
      promotions,
      total: promotions.length,
      active
    });

  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}