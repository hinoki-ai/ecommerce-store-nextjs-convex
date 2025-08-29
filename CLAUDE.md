# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ΛRΛMΛC Store - AI-Powered E-Commerce SaaS Platform** - A Next.js 15 intelligent retail platform designed as a comprehensive SaaS solution with advanced AI-driven features, automated SEO optimization, and scalable multi-tenant architecture for modern e-commerce businesses.

**Core Technologies:**

- **Framework:** Next.js 15 with App Router and Turbopack
- **Language:** TypeScript with strict type checking
- **Database:** Dual database system - Convex for real-time data, SQLite/Prisma for SEO content
- **Authentication:** Clerk for user management
- **Styling:** Tailwind CSS 4 with custom design system
- **AI Integration:** OpenAI GPT-4 for content generation and SEO optimization
- **UI Components:** Radix UI primitives with custom design system

## Development Commands

### Core Development

```bash
# Start development server with Turbopack (faster compilation)
npm run dev

# Production build with Turbopack
npm run build

# Start production server
npm run start

# Type checking (includes Convex schema validation)
npx tsc --noEmit

# Linting
npm run lint
```

### Database Operations

```bash
# Prisma (SEO content database)
npx prisma generate           # Generate Prisma client after schema changes
npx prisma db push            # Push schema changes to SQLite database
npx prisma studio             # Open database GUI for inspection

# Convex (real-time e-commerce data)
npx convex dev               # Start Convex development server
npx convex deploy            # Deploy Convex functions
npx convex codegen           # Generate TypeScript types from schema
```

### Environment Validation

```bash
# Environment validation (runs automatically on build/start)
npm run validate:env         # Validate required environment variables
```

### AI SEO Operations

```bash
# Access SEO dashboard for AI operations
# Navigate to: http://localhost:3000/admin/seo-dashboard

# Generate collections from existing products
# POST /api/seo/generate-collections

# Optimize individual products with AI
# POST /api/seo/optimize-product

# Generate blog content with internal links
# POST /api/seo/generate-blog
```

## High-Level Architecture

### Dual Database Architecture

The project uses two databases for optimal performance:

**Convex Database (`convex/schema.ts`)**

- Real-time e-commerce operations (products, orders, carts, users)
- Comprehensive user management with Clerk integration and security features
- Advanced features: wishlist management, reviews, notifications, promotions
- Real-time features: cart sync, inventory tracking, push notifications
- Security: audit logs, role-based permissions, rate limiting
- Handles user interactions, inventory, reviews, notifications
- Provides real-time subscriptions and optimistic updates
- Used for dynamic content and user-facing operations

**Prisma/SQLite Database (`prisma/schema.prisma`)**

- SEO-focused content management (blogs, collections, SEO logs)
- AI-generated content storage and optimization
- Static content that benefits from SQL relationships
- Used for content generation and SEO analytics

### Domain-Driven Design Structure

```bash
src/
├── domain/                    # Business logic and entities
│   ├── entities/              # Core business entities (Product, Category, Order, etc.)
│   ├── types/                 # Domain-specific TypeScript types
│   ├── services/              # Business logic services
│   └── value-objects/         # Domain value objects (Money, Address, etc.)
├── application/               # Application services and use cases
│   ├── use-cases/             # Business use case implementations
│   ├── services/              # Application-level services
│   └── interfaces/            # Contracts for external services
├── infrastructure/            # External integrations and data access
├── presentation/              # UI components and presentation logic
└── shared/                    # Shared utilities and cross-cutting concerns
```

### AI SEO Workflow Architecture

The project implements a sophisticated AI-driven SEO system:

1. **Product Optimization Pipeline** (`src/lib/ai-seo.ts`)
   - AI-powered title generation to eliminate duplicates
   - SEO-optimized descriptions (200-300 words)
   - Automated tag generation (15-20 tags per product)
   - Language correction for target market

2. **Collection Generation System** (Shotgun Approach)
   - Mass collection creation based on AI-generated tags
   - Holiday and seasonal collection automation
   - Smart categorization by customer segments
   - Mega menu integration for better site structure

3. **Content Strategy Engine**
   - AI blog generation with internal linking
   - Topical authority building through strategic content
   - JSON-LD schema markup automation
   - Dynamic sitemap generation

### Multi-Language Support

Implements **unified divine parsing oracle system** for optimal performance:

- **Primary System**: `src/lib/divine-parsing-oracle.ts` (ONLY divine parsing oracle system allowed)
- **Languages**: ES (primary) → EN (secondary) → FR, DE, RU, AR
- **Architecture**: Chunked loading (`src/lib/chunks/`) with provider pattern
- **Spanish-first**: Design for rural Chilean audience
- **SEO-optimized**: Multilingual content generation
- **Performance**: Separate chunk files for optimal loading
- **Rules**: See `I18N-RULES.md` for strict guidelines

### Real-Time Features

- Shopping cart synchronization via Convex
- Live inventory updates and stock tracking
- Real-time order tracking and status updates
- Dynamic product recommendations based on user behavior
- Push notifications system with subscription management
- Real-time user activity tracking and personalization
- Live pricing updates and promotion management
- Affiliate system with real-time commission tracking

## Key Development Patterns

### API Route Structure

All API routes follow consistent error handling and validation patterns:

```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Input validation with Zod
    // Business logic processing
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    // Comprehensive error handling with user-friendly messages
    return NextResponse.json({ error: message }, { status: code });
  }
}
```

### AI Service Integration

AI services are centralized in `src/lib/ai-seo.ts` with proper error handling:

- OpenAI GPT-4 integration for content optimization
- Fallback strategies for API failures
- Cost optimization through intelligent caching
- Batch processing for bulk operations

### Component Architecture

- Functional components with TypeScript interfaces
- Radix UI primitives for accessibility
- Custom hooks for business logic reuse
- Error boundaries for graceful failure handling

### Database Access Patterns

**Convex Queries/Mutations:**

- Real-time queries for dynamic content (products, orders, carts)
- Optimistic updates for user interactions (cart updates, wishlist changes)
- Server-side validation and business rules
- Real-time subscriptions for live data updates
- Complex queries with multiple indexes for performance
- Full-text search capabilities for products and collections

**Prisma Operations:**

- Complex SQL queries for SEO analytics and reporting
- Batch operations for content generation and optimization
- Migration management for schema evolution
- Relational data modeling for SEO-focused content
- AI-generated content storage with optimization tracking

## Environment Configuration

Required environment variables:

```bash
# AI Integration
OPENAI_API_KEY=your_openai_api_key

# Convex Database
CONVEX_DEPLOYMENT=your_convex_deployment_url

# Prisma Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Note: Environment validation runs automatically via npm scripts
# Use 'npm run validate:env' to manually check required variables
```

## SEO-Specific Features

### Automated SEO Dashboard

Access comprehensive SEO management at `/admin/seo-dashboard`:

- AI product optimization interface
- Bulk collection generation (hundreds at once)
- Blog content creation with internal linking
- SEO score tracking and analytics
- Performance monitoring dashboard

### Technical SEO Implementation

- Dynamic sitemap generation (`app/sitemap.ts`)
- Robots.txt automation (`app/robots.ts`)
- JSON-LD structured data for all entities
- Core Web Vitals optimization
- Meta tag automation with AI-generated content

### Content Strategy

- Strategic internal linking system
- Long-tail keyword targeting through collections
- Holiday and seasonal content automation
- Multi-language SEO optimization

## Performance Considerations

### Code Splitting Strategy

- Dynamic imports for heavy components
- Route-based code splitting via Next.js App Router
- Chunked language loading for i18n
- Lazy loading for admin dashboard components

### Database Optimization

- Indexed queries on frequently accessed fields
- Pagination for large datasets
- Caching strategies for AI-generated content
- Connection pooling for concurrent requests

### AI Cost Management

- Intelligent prompt engineering to minimize tokens
- Response caching for repeated operations
- Batch processing for bulk optimizations
- Rate limiting on AI endpoints

## Testing Approach

### Key Testing Areas

- AI content generation accuracy
- SEO score validation (target: 80%+ after optimization)
- Database integrity across dual-database operations
- Real-time synchronization between Convex and client
- Multi-language content validation

### Performance Targets

- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- AI response time: <5s for individual optimizations
- Page load time: <3s on 3G networks
- Bundle size: <500KB initial, <2MB total

## Business Context

**Target Audience:** Modern businesses and enterprises seeking intelligent e-commerce solutions with AI automation
**Revenue Model:** SaaS platform with tiered subscription plans, AI-enhanced services, and enterprise solutions
**Growth Strategy:** Technology-driven approach targeting B2B clients and innovative retailers seeking advanced automation
**Content Strategy:** Professional, technical documentation with comprehensive AI-powered features and enterprise-grade capabilities

## Administrative Access

Key admin routes for development and content management:

- `/admin` - Main admin dashboard
- `/admin/seo-dashboard` - AI SEO optimization interface
- `/admin/products` - Product management
- `/admin/analytics` - Performance analytics
- `/admin/orders` - Order management system
- `/admin/users` - User management interface

When working on this project, always prioritize the established patterns, maintain consistency with the dual-database architecture, and ensure all AI-generated content maintains the professional, enterprise-grade standards expected of a modern SaaS platform with global scalability and technical excellence.