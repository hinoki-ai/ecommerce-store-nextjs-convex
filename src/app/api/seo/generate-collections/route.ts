import { NextRequest, NextResponse } from 'next/server';
import { AISEOService, type ProductData } from '@/lib/ai-seo';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { products } = body;

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Products array is required' },
        { status: 400 }
      );
    }

    // Convert products to ProductData format
    const productData: ProductData[] = products.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      price: p.price,
      tags: p.tags
    }));

    // Generate collection suggestions using AI
    const collectionSuggestions = await AISEOService.generateCollections(productData);

    // Create collections in database
    const createdCollections = [];

    for (const suggestion of collectionSuggestions) {
      try {
        // Generate unique slug
        let slug = slugify(suggestion.name);
        let counter = 1;
        let uniqueSlug = slug;

        while (await prisma.collection.findUnique({ where: { slug: uniqueSlug } })) {
          uniqueSlug = `${slug}-${counter}`;
          counter++;
        }

        // Create collection
        const collection = await prisma.collection.create({
          data: {
            name: suggestion.name,
            slug: uniqueSlug,
            description: suggestion.description,
            tags: suggestion.tags.join(','),
            isHoliday: suggestion.isHoliday,
            holidayDate: suggestion.holidayDate
          }
        });

        createdCollections.push(collection);

        // Log the collection creation
        await prisma.sEOLog.create({
          data: {
            action: 'create_collection',
            entityId: collection.id,
            entityType: 'collection',
            details: {
              name: suggestion.name,
              tags: suggestion.tags,
              isHoliday: suggestion.isHoliday
            }
          }
        });

      } catch (error) {
        console.error(`Error creating collection ${suggestion.name}:`, error);
        // Continue with next collection
      }
    }

    return NextResponse.json({
      success: true,
      collectionsCreated: createdCollections.length,
      collections: createdCollections,
      message: `Successfully created ${createdCollections.length} AI-generated collections`
    });

  } catch (error) {
    console.error('Collection generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate collections' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return NextResponse.json({ collections });

  } catch (error) {
    console.error('Fetch collections error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}