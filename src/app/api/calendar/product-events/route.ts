import { NextRequest, NextResponse } from 'next/server';

// Mock data for product-related events
const mockProductEvents = [
  {
    id: '1',
    title: 'Lanzamiento de Nueva Colección',
    description: 'Descubre nuestra nueva colección de productos',
    shortDescription: 'Nueva colección',
    startDate: new Date('2024-12-20'),
    endDate: new Date('2024-12-25'),
    category: 'LAUNCH',
    status: 'ACTIVE',
    location: 'Tienda Principal',
    isPublic: true,
    priority: 'MEDIUM',
    relatedProducts: ['prod-001', 'prod-002', 'prod-003'],
    productCategory: 'CLOTHING'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const limit = parseInt(searchParams.get('limit') || '50');

    let events = mockProductEvents;
    
    if (productId) {
      events = events.filter(event => 
        event.relatedProducts.includes(productId)
      );
    }
    
    events = events.slice(0, limit);

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching product events:', error);
    return NextResponse.json({ error: 'Failed to fetch product events' }, { status: 500 });
  }
} 