import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

// Rate limiting configurations
const createRateLimiter = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const rateLimiters = {
  // 100 requests per 15 minutes for general API
  general: createRateLimiter(15 * 60 * 1000, 100),
  
  // 5 requests per minute for sensitive operations
  strict: createRateLimiter(60 * 1000, 5),
  
  // 20 requests per hour for AI operations (expensive)
  ai: createRateLimiter(60 * 60 * 1000, 20),
  
  // 1000 requests per hour for read operations
  read: createRateLimiter(60 * 60 * 1000, 1000),
};

// Speed limiting for brute force protection
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 10, // Allow 10 requests per windowMs without delay
  delayMs: () => 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 5000, // Max delay of 5 seconds
});

// Security headers
export function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', "default-src 'self'");
  
  return response;
}

// Input sanitization
export function sanitizeInput(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeInput);
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Basic XSS prevention
      sanitized[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    } else {
      sanitized[key] = sanitizeInput(value);
    }
  }
  
  return sanitized;
}

// Error response wrapper with security considerations
export function createErrorResponse(
  error: string, 
  status: number = 500, 
  details?: any,
  request?: NextRequest
) {
  // Log error securely (avoid logging sensitive data)
  const logData = {
    error: error,
    status,
    timestamp: new Date().toISOString(),
    url: request?.url,
    method: request?.method,
    userAgent: request?.headers.get('user-agent'),
    ip: request?.headers.get('x-forwarded-for') || 
        request?.headers.get('x-real-ip') || 
        'unknown'
  };
  
  console.error('API Error:', JSON.stringify(logData));

  // Return safe error response (avoid leaking internal details in production)
  const safeError = process.env.NODE_ENV === 'production' 
    ? (status < 500 ? error : 'Internal server error')
    : error;

  const response = NextResponse.json(
    { 
      error: safeError, 
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV !== 'production' && details && { details })
    },
    { status }
  );

  return addSecurityHeaders(response);
}

// Success response wrapper
export function createSuccessResponse(data: any, status: number = 200) {
  const response = NextResponse.json({
    success: true,
    data,
    timestamp: new Date().toISOString()
  }, { status });

  return addSecurityHeaders(response);
}

// Authentication middleware
export async function requireAuth(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Authentication required');
    }
    
    return userId;
  } catch (error) {
    throw new Error('Authentication required');
  }
}

// Role-based authorization
export async function requireRole(request: NextRequest, allowedRoles: string[] = ['admin']) {
  const userId = await requireAuth(request);
  
  // Get user role from your database or Clerk metadata
  // This is a placeholder - implement based on your user system
  const userRole = await getUserRole(userId);
  
  if (!allowedRoles.includes(userRole)) {
    throw new Error('Insufficient permissions');
  }
  
  return { userId, role: userRole };
}

// Placeholder for user role retrieval
async function getUserRole(userId: string): Promise<string> {
  // Implementation depends on user management system - placeholder for future enhancement
  // For now, return 'user' as default
  // In production, check Clerk metadata or your database
  return 'user';
}

// Admin route protection
export async function requireAdmin(request: NextRequest) {
  return await requireRole(request, ['admin', 'super_admin']);
}

// API route wrapper with security
export function withSecurity(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean;
    requireAdmin?: boolean;
    rateLimit?: 'general' | 'strict' | 'ai' | 'read';
    allowedMethods?: string[];
  } = {}
) {
  return async (request: NextRequest, context?: any) => {
    try {
      // Method validation
      if (options.allowedMethods && !options.allowedMethods.includes(request.method)) {
        return createErrorResponse('Method not allowed', 405, null, request);
      }

      // Authentication
      if (options.requireAuth || options.requireAdmin) {
        try {
          if (options.requireAdmin) {
            await requireAdmin(request);
          } else {
            await requireAuth(request);
          }
        } catch (authError) {
          return createErrorResponse('Authentication required', 401, null, request);
        }
      }

      // Rate limiting implementation can be added with Redis or memory store when needed
      // Rate limiting would go here

      return await handler(request, context);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      return createErrorResponse(errorMessage, 500, null, request);
    }
  };
}

// Validation wrapper
export function withValidation<T>(
  schema: any, // Zod schema
  handler: (request: NextRequest, validatedData: T, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    try {
      const body = await request.json();
      const sanitizedBody = sanitizeInput(body);
      const validatedData = schema.parse(sanitizedBody);
      
      return await handler(request, validatedData, context);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return createErrorResponse('Invalid input data', 400, error, request);
      }
      throw error;
    }
  };
}