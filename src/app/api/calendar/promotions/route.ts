import { NextRequest, NextResponse } from 'next/server';

// Mock data for promotions
const mockPromotions = [
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
    priority: 'HIGH',
    discountPercentage: 70,
    applicableProducts: ['all'],
    conditions: 'Válido solo en tienda física'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    let promotions = mockPromotions;
    
    if (active) {
      promotions = promotions.filter(promo => promo.status === 'ACTIVE');
    }
    
    promotions = promotions.slice(0, limit);

    return NextResponse.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json({ error: 'Failed to fetch promotions' }, { status: 500 });
  }
} 