import { NextRequest } from 'next/server';
import { z } from 'zod';
import { AISEOService, type ProductData } from '@/lib/ai-seo';
import { prisma } from '@/lib/prisma';
import { 
  withSecurity, 
  withValidation, 
  createSuccessResponse, 
  createErrorResponse 
} from '@/lib/api-security';

// Validation schemas
const optimizeProductSchema = z.object({
  productId: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  category: z.string().optional(),
  price: z.number().min(0).optional()
});

const getProductSchema = z.object({
  productId: z.string().min(1, 'Product ID is required')
});

export const POST = withSecurity(
  withValidation(optimizeProductSchema, async (request: NextRequest, validatedData: z.infer<typeof optimizeProductSchema>) => {
    const { productId, title, description, category, price } = validatedData;

    const productData: ProductData = {
      id: productId,
      title,
      description,
      category,
      price
    };

    // Optimize the product using AI
    const optimized = await AISEOService.optimizeProduct(productData);

    // Update product in database if productId provided
    if (productId) {
      await prisma.product.update({
        where: { id: productId },
        data: {
          optimizedTitle: optimized.optimizedTitle,
          optimizedDescription: optimized.optimizedDescription,
          tags: optimized.tags.join(','),
          seoScore: optimized.seoScore,
          originalTitle: title,
          originalDescription: description
        }
      });

      // Log the optimization
      await prisma.sEOLog.create({
        data: {
          action: 'optimize_product',
          entityId: productId,
          entityType: 'product',
          details: {
            originalTitle: title,
            newTitle: optimized.optimizedTitle,
            seoScore: optimized.seoScore,
            reasoning: optimized.reasoning
          }
        }
      });
    }

    return createSuccessResponse({
      optimized,
      message: 'Product optimized successfully'
    });
  }),
  {
    requireAdmin: true, // Only admins can optimize products
    rateLimit: 'ai', // AI operations have strict rate limiting
    allowedMethods: ['POST']
  }
);

export const GET = withSecurity(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const validatedParams = getProductSchema.parse({ productId });

    const product = await prisma.product.findUnique({
      where: { id: validatedParams.productId },
      include: { images: true }
    });

    if (!product) {
      return createErrorResponse('Product not found', 404, null, request);
    }

    return createSuccessResponse({ product });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Invalid parameters', 400, error.errors, request);
    }
    throw error;
  }
}, {
  requireAuth: true, // Require authentication for reading product details
  rateLimit: 'read',
  allowedMethods: ['GET']
});