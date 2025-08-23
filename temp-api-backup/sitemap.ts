import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/search',
    '/blog',
    '/categories',
    '/products'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Skip database operations during testing mode
  if (process.env.SKIP_AUTH === 'true' || process.env.NEXT_PUBLIC_SKIP_AUTH === 'true') {
    console.log('Sitemap: Skipping database operations in testing mode');
    return staticPages;
  }

  try {
    // Dynamic product pages
    const products = await prisma.product.findMany({
      select: { id: true, updatedAt: true }
    });

    const productPages = products.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Dynamic collection pages
    const collections = await prisma.collection.findMany({
      select: { slug: true, updatedAt: true }
    });

    const collectionPages = collections.map((collection) => ({
      url: `${baseUrl}/collections/${collection.slug}`,
      lastModified: collection.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

    // Blog pages
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true }
    });

    const blogPages = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [
      ...staticPages,
      ...collectionPages,
      ...productPages,
      ...blogPages
    ];

  } catch (error) {
    console.error('Sitemap generation error:', error);
    // Return static pages if database is unavailable
    return staticPages;
  }
}