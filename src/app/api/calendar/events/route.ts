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
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let events = mockEvents;
    
    if (category) {
      events = events.filter(event => event.category === category);
    }
    
    if (status) {
      events = events.filter(event => event.status === status);
    }
    
    events = events.slice(0, limit);

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock response for creating an event
    const newEvent = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
} 