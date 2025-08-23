# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI-Powered E-Commerce SEO System** - A Next.js 15 e-commerce platform optimized for AI-assisted development with comprehensive SEO automation for rural Chilean markets.

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
- Handles user interactions, inventory, reviews, notifications
- Provides real-time subscriptions and optimistic updates
- Used for dynamic content and user-facing operations

**Prisma/SQLite Database (`prisma/schema.prisma`)**
- SEO-focused content management (blogs, collections, SEO logs)
- AI-generated content storage and optimization
- Static content that benefits from SQL relationships
- Used for content generation and SEO analytics

### Domain-Driven Design Structure
```
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
Implements chunked i18n system for optimal performance:
- Spanish-first design for rural Chilean audience
- Chunked language loading (`src/lib/chunks/`)
- Professional, accessible tone maintenance
- SEO-optimized multilingual content generation

### Real-Time Features
- Shopping cart synchronization via Convex
- Live inventory updates
- Real-time order tracking
- Dynamic product recommendations
- Live chat widget integration

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
- Real-time queries for dynamic content
- Optimistic updates for user interactions
- Server-side validation and business rules

**Prisma Operations:**
- Complex SQL queries for SEO analytics
- Batch operations for content generation
- Migration management for schema evolution

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

**Target Audience:** Rural Chilean users requiring professional Spanish-first experience
**Revenue Model:** E-commerce with AI-driven SEO for organic traffic growth
**Growth Strategy:** SEO-first approach targeting 2000+ monthly organic visitors within 6 months
**Content Strategy:** Professional, accessible tone with comprehensive product information

## Administrative Access

Key admin routes for development and content management:
- `/admin` - Main admin dashboard
- `/admin/seo-dashboard` - AI SEO optimization interface
- `/admin/products` - Product management
- `/admin/analytics` - Performance analytics
- `/admin/orders` - Order management system
- `/admin/users` - User management interface

When working on this project, always prioritize the established patterns, maintain consistency with the dual-database architecture, and ensure all AI-generated content maintains the professional Spanish-first approach for the target Chilean market.