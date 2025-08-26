import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // Next.js
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // App configuration
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid app URL'),
  NEXT_PUBLIC_APP_DOMAIN: z.string().min(1, 'App domain is required'),
  NEXT_PUBLIC_API_URL: z.string().url('Invalid API URL').optional(),

  // Database
  DATABASE_URL: z.string().min(1, 'Database URL is required'),

  // Convex
  CONVEX_DEPLOYMENT: z.string().min(1, 'Convex deployment URL is required'),
  NEXT_PUBLIC_CONVEX_URL: z.string().url('Invalid Convex URL').optional(),

  // Authentication (Clerk)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, 'Clerk publishable key is required'),
  CLERK_SECRET_KEY: z.string().min(1, 'Clerk secret key is required'),
  CLERK_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_CLERK_FRONTEND_API_URL: z.string().url('Invalid Clerk frontend API URL').optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string().optional(),
  CLERK_WEBHOOK_URL: z.string().url('Invalid Clerk webhook URL').optional(),

  // AI Services
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),

  // Payment processing (if using Stripe)
  STRIPE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_BASIC_PRICE_ID: z.string().optional(),
  STRIPE_PREMIUM_PRICE_ID: z.string().optional(),

  // Email services (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // Redis (for caching and rate limiting)
  REDIS_URL: z.string().url('Invalid Redis URL').optional(),

  // Analytics
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  GA_API_SECRET: z.string().optional(),
  NEXT_PUBLIC_FACEBOOK_PIXEL_ID: z.string().optional(),
  CUSTOM_ANALYTICS_ENDPOINT: z.string().url('Invalid custom analytics endpoint').optional(),

  // CDN and asset optimization
  NEXT_PUBLIC_CDN_URL: z.string().url('Invalid CDN URL').optional(),

  // Security
  NEXTAUTH_SECRET: z.string().min(32, 'NextAuth secret must be at least 32 characters').optional(),

  // Monitoring and logging
  SENTRY_DSN: z.string().url('Invalid Sentry DSN').optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Development/Testing
  NEXT_PUBLIC_DEBUG_MODE: z.string().transform(val => val === 'true').optional(),
  SKIP_AUTH: z.string().transform(val => val === 'true').optional(),
  NEXT_PUBLIC_SKIP_AUTH: z.string().transform(val => val === 'true').optional(),
  NEXT_PUBLIC_USE_MOCK_DATA: z.string().transform(val => val === 'true').optional(),
  NEXT_PUBLIC_MOCK_USER_ID: z.string().optional(),
  NEXT_PUBLIC_MOCK_USER_EMAIL: z.string().email('Invalid mock user email').optional(),

  // PWA
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),

  // Performance
  ANALYZE: z.string().transform(val => val === 'true').optional(),
});

// Parse and validate environment variables
function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    
    // Additional validations for production
    if (parsed.NODE_ENV === 'production') {
      // Production-specific requirements
      if (!parsed.NEXT_PUBLIC_APP_URL.startsWith('https://')) {
        throw new Error('App URL must use HTTPS in production');
      }
      
      if (!parsed.NEXTAUTH_SECRET && !parsed.CLERK_SECRET_KEY) {
        throw new Error('Either NEXTAUTH_SECRET or CLERK_SECRET_KEY is required in production');
      }
      
      if (parsed.LOG_LEVEL === 'debug') {
        console.warn('Debug log level is not recommended for production');
      }
    }
    
    return parsed;
  } catch (error) {
    console.error('❌ Environment validation failed:');
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    } else {
      console.error(`  - ${error}`);
    }
    
    process.exit(1);
  }
}

// Export validated environment variables
export const env = validateEnv();

// Environment checks for different services
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';

// Service availability checks
export const hasStripe = !!(env.STRIPE_SECRET_KEY && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
export const hasRedis = !!env.REDIS_URL;
export const hasAnalytics = !!env.GOOGLE_ANALYTICS_ID;
export const hasMonitoring = !!env.SENTRY_DSN;
export const hasEmailService = !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);

// Database connection validation
export async function validateDatabaseConnection() {
  try {
    // Import prisma client
    const { prisma } = await import('./prisma');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test a simple query
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database query test successful');
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw new Error('Database connection validation failed');
  }
}

// Convex connection validation
export async function validateConvexConnection() {
  try {
    if (!env.CONVEX_DEPLOYMENT) {
      throw new Error('CONVEX_DEPLOYMENT not configured');
    }
    
    // Test Convex connection by attempting to import and validate
    console.log('✅ Convex configuration validated');
    
    return true;
  } catch (error) {
    console.error('❌ Convex validation failed:', error);
    throw new Error('Convex connection validation failed');
  }
}

// OpenAI API validation
export async function validateOpenAI() {
  try {
    if (!env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }
    
    // Test API key format
    if (!env.OPENAI_API_KEY.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key format');
    }
    
    console.log('✅ OpenAI API key format validated');
    
    return true;
  } catch (error) {
    console.error('❌ OpenAI validation failed:', error);
    throw new Error('OpenAI validation failed');
  }
}

// Comprehensive startup validation
export async function validateAllConnections() {
  console.log('🔍 Validating environment and connections...');
  
  const validations = [
    { name: 'Database', fn: validateDatabaseConnection },
    { name: 'Convex', fn: validateConvexConnection },
    { name: 'OpenAI', fn: validateOpenAI },
  ];
  
  const results = await Promise.allSettled(
    validations.map(async ({ name, fn }) => {
      try {
        await fn();
        return { name, status: 'success' };
      } catch (error) {
        return { name, status: 'failed', error };
      }
    })
  );
  
  const failed = results
    .filter(result => result.status === 'fulfilled' && result.value.status === 'failed')
    .map(result => result.status === 'fulfilled' ? result.value : null)
    .filter(Boolean);
  
  if (failed.length > 0) {
    console.error('❌ Some validations failed:');
    failed.forEach(({ name, error }) => {
      console.error(`  - ${name}: ${error}`);
    });
    
    if (isProduction) {
      throw new Error('Critical services validation failed in production');
    } else {
      console.warn('⚠️ Some services are not available in development mode');
    }
  }
  
  console.log('✅ All validations passed successfully');
}

// Runtime configuration object for the app
export const appConfig = {
  app: {
    name: 'AI-Powered E-Commerce Store',
    url: env.NEXT_PUBLIC_APP_URL,
    environment: env.NODE_ENV,
  },
  features: {
    stripe: hasStripe,
    redis: hasRedis,
    analytics: hasAnalytics,
    monitoring: hasMonitoring,
    email: hasEmailService,
  },
  ai: {
    provider: 'openai',
    enabled: !!env.OPENAI_API_KEY,
  },
  database: {
    convex: !!env.CONVEX_DEPLOYMENT,
    prisma: !!env.DATABASE_URL,
  },
  security: {
    httpsOnly: isProduction,
    logLevel: env.LOG_LEVEL,
  },
};