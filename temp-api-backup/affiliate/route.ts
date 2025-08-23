import { NextRequest } from "next/server"
import { z } from 'zod';
import { getAffiliateService } from "@/lib/affiliate"
import { 
  withSecurity, 
  withValidation, 
  createSuccessResponse, 
  createErrorResponse,
  requireAuth
} from '@/lib/api-security';

const affiliateService = getAffiliateService()

// Validation schemas
const createAffiliateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  code: z.string().optional(),
  payoutMethod: z.enum(['paypal', 'bank', 'stripe']).default('paypal')
});

const getAffiliateQuerySchema = z.object({
  userId: z.string().optional(),
  code: z.string().optional(),
  affiliateId: z.string().optional()
}).refine(data => data.userId || data.code || data.affiliateId, {
  message: "At least one of userId, code, or affiliateId must be provided"
});

export const GET = withSecurity(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const params = {
      userId: searchParams.get('userId'),
      code: searchParams.get('code'),
      affiliateId: searchParams.get('affiliateId')
    };

    const validatedParams = getAffiliateQuerySchema.parse(params);

    // Get the authenticated user's ID
    const authenticatedUserId = await requireAuth(request);

    let affiliate = null;

    if (validatedParams.userId) {
      // Users can only access their own affiliate data
      if (validatedParams.userId !== authenticatedUserId) {
        return createErrorResponse('Access denied', 403, null, request);
      }
      affiliate = await affiliateService.getAffiliateByUserId(validatedParams.userId);
    } else if (validatedParams.code) {
      // Public access for codes (needed for referral links)
      affiliate = await affiliateService.getAffiliateByCode(validatedParams.code);
    } else if (validatedParams.affiliateId) {
      // Check if this affiliate belongs to the authenticated user
      affiliate = await affiliateService.getAffiliate(validatedParams.affiliateId);
      if (affiliate && affiliate.userId !== authenticatedUserId) {
        return createErrorResponse('Access denied', 403, null, request);
      }
    }

    if (!affiliate) {
      return createErrorResponse('Affiliate not found', 404, null, request);
    }

    return createSuccessResponse(affiliate);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Invalid parameters', 400, error.errors, request);
    }
    throw error;
  }
}, {
  requireAuth: true,
  rateLimit: 'general',
  allowedMethods: ['GET']
});

export const POST = withSecurity(
  withValidation(createAffiliateSchema, async (request: NextRequest, validatedData: z.infer<typeof createAffiliateSchema>) => {
    const { userId, code, payoutMethod } = validatedData;

    // Get the authenticated user's ID
    const authenticatedUserId = await requireAuth(request);

    // Users can only create affiliate accounts for themselves
    if (userId !== authenticatedUserId) {
      return createErrorResponse('Access denied', 403, null, request);
    }

    // Check if user already has an affiliate account
    const existingAffiliate = await affiliateService.getAffiliateByUserId(userId);
    if (existingAffiliate) {
      return createErrorResponse('User already has an affiliate account', 409, null, request);
    }

    // Create new affiliate
    const affiliate = await affiliateService.createAffiliate(userId, {
      code,
      payoutMethod
    });

    return createSuccessResponse(affiliate, 201);
  }),
  {
    requireAuth: true,
    rateLimit: 'strict', // Strict rate limiting for account creation
    allowedMethods: ['POST']
  }
);