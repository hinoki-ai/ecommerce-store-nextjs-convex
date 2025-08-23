import { NextRequest, NextResponse } from 'next/server';
import { AISEOService, type ProductData } from '@/lib/ai-seo';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, products } = body;

    if (!topic || !products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Topic and products array are required' },
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

    // Generate blog content with internal links
    const blogContent = await AISEOService.generateBlogContent(topic, productData);

    // Generate unique slug
    const slug = slugify(blogContent.title);
    let counter = 1;
    let uniqueSlug = slug;

    while (await prisma.blog.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    // Create blog post
    const blog = await prisma.blog.create({
      data: {
        title: blogContent.title,
        slug: uniqueSlug,
        content: blogContent.content,
        excerpt: blogContent.content.substring(0, 200) + '...',
        internalLinks: blogContent.internalLinks,
        seoTitle: `${blogContent.title} | Luxury E-Commerce Store`,
        seoDescription: blogContent.content.substring(0, 155) + '...'
      }
    });

    // Log the blog creation
    await prisma.sEOLog.create({
      data: {
        action: 'create_blog',
        entityId: blog.id,
        entityType: 'blog',
        details: {
          title: blogContent.title,
          topic: topic,
          internalLinksCount: blogContent.internalLinks.length
        }
      }
    });

    return NextResponse.json({
      success: true,
      blog,
      message: 'Blog post created successfully with internal linking'
    });

  } catch (error) {
    console.error('Blog generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        _count: {
          select: { id: true }
        }
      }
    });

    return NextResponse.json({ blogs });

  } catch (error) {
    console.error('Fetch blogs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}