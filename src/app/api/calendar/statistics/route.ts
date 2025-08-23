import { NextRequest, NextResponse } from 'next/server';

// Mock statistics data
const mockStatistics = {
  totalEvents: 15,
  activeEvents: 8,
  completedEvents: 5,
  cancelledEvents: 2,
  upcomingEvents: 3,
  totalPromotions: 6,
  activePromotions: 4,
  totalCategories: 4,
  eventsByCategory: {
    PROMOTION: 6,
    LAUNCH: 4,
    WORKSHOP: 3,
    SPECIAL: 2
  },
  averageEventDuration: 3.5, // days
  mostPopularCategory: 'PROMOTION',
  eventsThisMonth: 8,
  eventsNextMonth: 5
};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(mockStatistics);
  } catch (error) {
    console.error('Error fetching calendar statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
} 