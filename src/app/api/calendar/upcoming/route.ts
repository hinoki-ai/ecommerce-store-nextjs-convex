import { NextRequest, NextResponse } from 'next/server';

// Mock data for calendar events
const mockEvents = [
  {
    id: '1',
    title: 'Gran Liquidación de Verano',
    description: 'Descuentos de hasta 70% en toda la tienda',
    shortDescription: 'Liquidación de verano',
    startDate: new Date('2024-12-15'),
    endDate: new Date('2024-12-31'),
    category: 'PROMOTION',
    status: 'ACTIVE',
    location: 'Tienda Principal',
    isPublic: true,
    priority: 'HIGH'
  },
  {
    id: '2',
    title: 'Lanzamiento de Nueva Colección',
    description: 'Descubre nuestra nueva colección de productos',
    shortDescription: 'Nueva colección',
    startDate: new Date('2024-12-20'),
    endDate: new Date('2024-12-25'),
    category: 'LAUNCH',
    status: 'ACTIVE',
    location: 'Tienda Principal',
    isPublic: true,
    priority: 'MEDIUM'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const publicOnly = searchParams.get('publicOnly') === 'true';

    let events = mockEvents;
    
    if (publicOnly) {
      events = events.filter(event => event.isPublic);
    }
    
    events = events.slice(0, limit);

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
} 