/**
 * Calendar Statistics API Route
 * Provides comprehensive calendar analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { calendarService } from '@/domain/services/calendar-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;

    // Get all events for the period
    const allEvents = await calendarService.getEvents({
      dateRange: startDate && endDate ? { start: startDate, end: endDate } : undefined
    });

    // Calculate comprehensive statistics
    const totalEvents = allEvents.length;
    const now = new Date();

    const upcomingEvents = allEvents.filter(event => event.startDate > now);
    const activePromotions = allEvents.filter(event =>
      (event.category === 'PROMOTION' || event.category === 'SALE') &&
      event.status === 'ACTIVE' &&
      event.startDate <= now &&
      event.endDate >= now
    );
    const completedEvents = allEvents.filter(event => event.status === 'COMPLETED');
    const publicEvents = allEvents.filter(event => event.isPublic);

    // Category breakdown
    const eventsByCategory = allEvents.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Status breakdown
    const eventsByStatus = allEvents.reduce((acc, event) => {
      acc[event.status || 'SCHEDULED'] = (acc[event.status || 'SCHEDULED'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Priority breakdown
    const eventsByPriority = allEvents.reduce((acc, event) => {
      acc[event.priority || 'MEDIUM'] = (acc[event.priority || 'MEDIUM'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Monthly breakdown for the last 12 months
    const monthlyBreakdown = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthEvents = allEvents.filter(event =>
        event.startDate >= monthStart && event.startDate <= monthEnd
      );

      monthlyBreakdown.push({
        month: monthStart.toLocaleDateString('es-CL', { month: 'short', year: 'numeric' }),
        events: monthEvents.length,
        promotions: monthEvents.filter(e => e.category === 'PROMOTION' || e.category === 'SALE').length
      });
    }

    // Average event duration
    const totalDuration = allEvents.reduce((sum, event) => {
      return sum + (event.endDate.getTime() - event.startDate.getTime());
    }, 0);
    const avgEventDuration = totalEvents > 0 ? Math.round(totalDuration / totalEvents / (1000 * 60)) : 0; // in minutes

    // SEO performance metrics
    const seoOptimizedEvents = allEvents.filter(event =>
      event.seo?.metaTitle &&
      event.seo?.metaDescription &&
      event.isPublic
    );

    // Top performing categories
    const topCategories = Object.entries(eventsByCategory)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentEvents = allEvents.filter(event => event.startDate > thirtyDaysAgo);

    return NextResponse.json({
      // Basic metrics
      totalEvents,
      upcomingEvents: upcomingEvents.length,
      activePromotions: activePromotions.length,
      completedEvents: completedEvents.length,
      publicEvents: publicEvents.length,

      // Breakdowns
      eventsByCategory,
      eventsByStatus,
      eventsByPriority,

      // Time-based analytics
      monthlyBreakdown,
      avgEventDuration,

      // SEO metrics
      seoOptimizedEvents: seoOptimizedEvents.length,
      seoOptimizationRate: totalEvents > 0 ? Math.round((seoOptimizedEvents.length / totalEvents) * 100) : 0,

      // Performance metrics
      topCategories,
      recentEvents: recentEvents.length,

      // Period info
      period: startDate && endDate ?
        `From ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}` :
        'All time',

      // Generated at
      generatedAt: now.toISOString()
    });

  } catch (error) {
    console.error('Error fetching calendar statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}