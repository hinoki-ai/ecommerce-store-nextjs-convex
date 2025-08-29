# 🤖 AI-ONLY DEVELOPMENT GUIDELINES

## 🎯 AI ASSISTANT CONTEXT (REQUIRED)

**🚫 CRITICAL RULE**: NEVER TOUCH CLAUDE.md - Contains human-specific context
**🤖 AI-ONLY ACCESS**: This documentation is AI-optimized and accessible
**🎯 PROJECT TYPE**: Next.js 14 e-commerce platform with AI-optimized SEO
**🏗️ ARCHITECTURE**: Modular system with chunked loading (AI-optimized)
**⚡ CRITICAL REQUIREMENTS**: Spanish-first approach, AI content generation
**🚀 EXECUTION WORKFLOWS**: AI SEO optimization, content generation, validation
**📋 IMPLEMENTATION PATTERNS**: AI-powered TypeScript patterns, SEO optimization
**🧪 VALIDATION PROCEDURES**: AI content validation, SEO score testing

## 🚨 CRITICAL BRANCHING & ENVIRONMENT RULES (MANDATORY)

### 🔒 Git Branching Strategy (TWO BRANCHES ONLY)

**🚫 CRITICAL RULE**: We maintain EXACTLY TWO branches: `prod` and `dev`

- **prod** branch: Production-ready code, deployed to live site
- **dev** branch: Development branch for all feature work and testing

**🚫 NEVER CREATE ADDITIONAL BRANCHES** - This creates confusion and deployment complexity

#### 📋 Complete Development Workflow

```bash
# 🔄 START: Always begin on dev branch
git checkout dev
git pull origin dev --rebase
git status

# 🔧 DEVELOPMENT: Make your changes with proper commits
git add .
git commit -m "feat: [brief description of changes]"
git push origin dev

# 🧪 TESTING: Test thoroughly before production
npm run build
npm run test
# Manual testing in browser
# Check all critical functionality

# 🚀 PRODUCTION DEPLOYMENT
git checkout prod
git merge dev --no-ff -m "deploy: merge dev to prod [date]"
git push origin prod

# 🔙 RETURN TO DEVELOPMENT
git checkout dev
```

#### 🚨 Emergency Procedures

**🔥 Hotfix Required**:
```bash
# If production is broken and needs immediate fix
git checkout prod
git cherry-pick [specific-commit-hash]  # Only cherry-pick tested commits
git push origin prod
# Immediately merge hotfix back to dev
git checkout dev
git merge prod
git push origin dev
```

**⏪ Rollback Procedure**:
```bash
# If deployment breaks production
git checkout prod
git reset --hard HEAD~1  # Rollback to previous commit
git push origin prod --force
# Investigate issue on dev branch
```

### 🔑 Environment File Management (STRICT RULES)

**🚫 CRITICAL SECURITY RULES**:

1. **NEVER CREATE MORE ENV FILES** - We use `.env.local` ONLY
2. **NEVER RENAME ENV FILES** - Keep `.env.local` as is
3. **NEVER MODIFY LAYOUT WITHOUT APPROVAL** - Layout changes require explicit approval
4. **BE EXTREMELY CAREFUL WITH KEYS** - All API keys, secrets, and sensitive data
5. **NEVER COMMIT ENV FILES** - They must remain local only

#### 📁 Environment File Structure (MANDATORY)

```
.env.local                    # ONLY env file - DO NOT CREATE OTHERS
├── # Database Configuration
├── DATABASE_URL="postgresql://..."
├── DIRECT_URL="postgresql://..."
├──
├── # Authentication Keys
├── NEXTAUTH_SECRET="your-secret-key"
├── NEXTAUTH_URL="https://yourdomain.com"
├──
├── # External API Keys
├── OPENAI_API_KEY="sk-..."
├── STRIPE_SECRET_KEY="sk_..."
├── STRIPE_PUBLISHABLE_KEY="pk_..."
├──
├── # Service URLs
├── CONVEX_URL="https://..."
├── CLERK_SECRET_KEY="sk_..."
├──
├── # Development Settings
├── NODE_ENV="development"
└── NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### 🔐 Security Best Practices

**✅ BEFORE Adding New Environment Variables**:
- [ ] Document the purpose and usage
- [ ] Verify it's actually needed
- [ ] Check if it can be derived from existing vars
- [ ] Test locally before committing code that uses it

**✅ WHEN Modifying Existing Keys**:
- [ ] Backup current working keys
- [ ] Test new keys in development first
- [ ] Have rollback plan ready
- [ ] Notify team of changes

**🚫 FORBIDDEN ACTIONS**:
- ❌ Creating `.env.production`, `.env.staging`, `.env.dev`
- ❌ Creating `.env.local.backup` or similar
- ❌ Renaming `.env.local` to anything else
- ❌ Modifying layout files without approval
- ❌ Committing any `.env*` files to git
- ❌ Sharing environment files via email/chat
- ❌ Using production keys in development

**✅ APPROVED ACTIONS**:
- ✅ Update `.env.local` with new required variables (document first)
- ✅ Modify existing keys (with extreme caution and backup)
- ✅ Request approval for layout changes before implementing
- ✅ Use environment variables for all sensitive data

### ⚠️ Approval & Communication Requirements

#### 📝 Pre-Implementation Requirements

**Layout Modifications**:
- [ ] Written approval from project lead
- [ ] Document impact on existing functionality
- [ ] Provide before/after mockups or diagrams
- [ ] Test on dev environment first

**Environment Changes**:
- [ ] Document all key additions/modifications
- [ ] Provide justification for new variables
- [ ] Include security review checklist
- [ ] Test deployment process

**Production Deployments**:
- [ ] Test thoroughly on dev branch
- [ ] Verify all critical functionality
- [ ] Check performance metrics
- [ ] Have rollback plan ready

#### 📢 Communication Protocol

**Before Major Changes**:
```
Subject: [PROJECT] Requesting Approval: [Change Description]

Details:
- What: [Specific changes]
- Why: [Business justification]
- Impact: [Affected systems/features]
- Testing: [Test plan]
- Rollback: [Recovery plan]

@team-lead Please approve/disapprove
```

**After Deployment**:
```
✅ DEPLOYMENT COMPLETE: [Project Name]
- Changes: [Brief summary]
- Status: All systems operational
- Monitoring: [24h watch period]
- Next steps: [Follow-up actions]
```

### 🚨 Emergency Response Procedures

#### 🔥 Critical Production Issues

1. **IMMEDIATE RESPONSE**:
   - Assess severity and impact
   - Notify team immediately
   - Begin rollback if necessary

2. **INVESTIGATION**:
   - Check error logs and monitoring
   - Identify root cause
   - Document findings

3. **RESOLUTION**:
   - Implement fix on dev branch
   - Test thoroughly
   - Deploy to production
   - Monitor for 24 hours

#### 📊 Monitoring & Alerting

**Required Monitoring**:
- Application uptime and response times
- Error rates and logs
- Database performance
- API key usage and limits
- Security alerts

**Alert Thresholds**:
- Response time > 3 seconds
- Error rate > 5%
- Database connection failures
- API key exhaustion warnings

### 🛡️ Security Checklist (MANDATORY)

#### 🔐 Pre-Deployment Security Review

- [ ] All sensitive data uses environment variables
- [ ] No hardcoded secrets in codebase
- [ ] Environment files are gitignored
- [ ] API keys have appropriate permissions
- [ ] Database credentials are encrypted
- [ ] CORS settings are production-appropriate
- [ ] HTTPS is enforced
- [ ] Security headers are configured

#### 🔍 Code Security Scan

```bash
# Run before every deployment
npm audit
npm run security-check
# Check for exposed secrets
grep -r "password\|secret\|key" src/ --exclude-dir=node_modules
```

---

**🚨 ENFORCEMENT**: These rules are MANDATORY and must be followed by ALL team members. Violations will result in immediate code rollback and security review.

## 🚀 AI EXECUTION WORKFLOWS (REQUIRED)

### 1. AI Development Environment Setup

```bash
# 🎯 AI EXECUTION: Navigate to AI-optimized project directory
cd /home/kuromatsu/Documents/ΛRΛMΛC/Websites/store

# 🤖 AI EXECUTION: Install AI-required dependencies
npm install

# 📋 AI EXECUTION: Setup AI database with Prisma
npx prisma generate && npx prisma db push

# 🚀 AI EXECUTION: Start AI-optimized development server
npm run dev
# 🎯 AI RESULT: Server accessible at http://localhost:3000

```

### 2. AI Essential Access Points

- **🎯 SEO Dashboard**: `http://localhost:3000/admin/seo-dashboard` (AI optimization interface)

- **🛍️ Product Management**: `http://localhost:3000/admin/products` (AI product CRUD)

- **📝 Content Management**: `http://localhost:3000/admin/content` (AI content creation)

- **🚀 API Routes**: `/api/seo/`, `/api/products`, `/api/collections` (AI endpoints)

### 3. AI Technical Standards

- ✅ **Spanish-First**: All user-facing content in Spanish (AI requirement)

- ✅ **Modular Architecture**: Prefer chunked systems over monolithic code (AI mandate)

- ✅ **TypeScript Strict**: Full type safety and error prevention (AI standard)

- ✅ **Performance Optimization**: Lazy loading and chunked loading (AI critical)

- ✅ **SEO Focus**: Every feature optimized for search engines (AI requirement)

---

## 📋 AI IMPLEMENTATION PATTERNS (REQUIRED)

### 1. TypeScript Standards

```typescript
// ✅ Correct: Explicit typing with interfaces
interface ProductData {
  id: string;
  title: string;
  description: string;
  price: number;
  tags: string[];
}

// ✅ Correct: Function signatures with return types
const optimizeProductSEO = async (
  product: ProductData,
  options: SEOOptions
): Promise<OptimizedProduct> => {
  // Implementation
};

// ❌ Avoid: Any types without proper justification
const processData = (data: any) => { ... };

```

### 2. React Component Patterns

```typescript
// ✅ Correct: Functional components with TypeScript
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      {/* Implementation */}
    </div>
  );
};

// ✅ Correct: Custom hooks for reusable logic
const useProductSEO = (productId: string) => {
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [loading, setLoading] = useState(true);

  // Hook implementation
  return { seoData, loading };
};

```

### 3. File and Folder Organization

```text
/src
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   └── (marketing)/       # Marketing pages
├── components/            # Reusable React components
│   ├── ui/                # Basic UI components
│   ├── forms/             # Form components
│   └── layout/            # Layout components
├── lib/                   # Utilities and configurations
│   ├── ai/                # AI-related utilities
│   ├── seo/               # SEO utilities
│   └── i18n/              # Internationalization (UNIFIED CHUNKED SYSTEM ONLY)
├── hooks/                 # Custom React hooks
├── services/              # Business logic services
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions

```

### 4. Naming Conventions

- **Components**: PascalCase (`ProductCard`, `SEOOptimizer`)

- **Files**: kebab-case (`product-card.tsx`, `seo-optimizer.ts`)

- **Functions/Variables**: camelCase (`optimizeProduct`, `generateTags`)

- **Types/Interfaces**: PascalCase (`ProductData`, `SEOOptions`)

- **Constants**: SCREAMING_SNAKE_CASE (`MAX_TAGS_COUNT`)

- **Folders**: kebab-case (`seo-dashboard`, `product-management`)

---

## 🏛️ Architectural Patterns

### 1. API Route Structure

```typescript
// ✅ Correct: API routes with proper error handling
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = validateProductData(body);

    // Process request
    const result = await optimizeProductSEO(validatedData);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Product optimization error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to optimize product' },
      { status: 500 }
    );
  }
}

```

### 2. Service Layer Pattern

```typescript
// ✅ Correct: Service layer for business logic
class SEOService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async optimizeProduct(product: ProductData): Promise<OptimizedProduct> {
    // Implementation with proper error handling
  }

  async generateTags(description: string): Promise<string[]> {
    // Implementation
  }
}

// Usage in API routes
const seoService = new SEOService();
const optimized = await seoService.optimizeProduct(productData);

```

### 3. Chunked Loading Pattern

```typescript
// ✅ Correct: Dynamic imports for code splitting
const SEODashboard = dynamic(
  () => import('@/components/admin/SEODashboard'),
  {
    loading: () => <div>Cargando dashboard SEO...</div>,
    ssr: false
  }
);

// ✅ Correct: Language chunks
const loadLanguageChunk = async (language: string) => {
  const chunk = await import(`@/lib/chunks/${language}.chunk.ts`);
  return chunk.default;
};

```

---

## 🔧 Development Workflows

### 1. Feature Implementation Process

```typescript
// 1. Plan the feature
// - Review requirements and existing patterns
// - Identify required components and services
// - Plan database changes if needed

// 2. Implement step by step
// - Create types and interfaces
// - Implement business logic (services)
// - Create UI components
// - Add API routes if needed
// - Update database schema if needed

// 3. Test thoroughly
// - TypeScript compilation
// - ESLint checks
// - Manual testing
// - Performance testing

// 4. Document and optimize
// - Update documentation
// - Optimize performance
// - Add error handling

```

### 2. Database Migration Workflow

```typescript
// 1. Plan schema changes
// - Review current schema
// - Plan migration with Prisma
// - Consider data migration needs

// 2. Create migration
npx prisma migrate dev --name add-seo-fields

// 3. Update Prisma client
npx prisma generate

// 4. Test with real data
// - Test new features with existing data
// - Validate data integrity
// - Test rollback if needed

```

### 3. SEO Implementation Workflow

```typescript
// 1. Plan SEO strategy
// - Research target keywords
// - Plan content structure
// - Identify internal linking opportunities

// 2. Implement SEO features
// - Add meta tags and structured data
// - Implement internal linking
// - Optimize for Core Web Vitals
// - Add sitemap entries

// 3. Test and validate
// - Use SEO testing tools
// - Validate structured data
// - Check page speed
// - Monitor search console

```

---

## 🎨 UI/UX Guidelines

### 1. Design System

- **Primary Colors**: Follow established color palette

- **Typography**: Professional, accessible fonts

- **Spacing**: Consistent spacing system (Tailwind classes)

- **Components**: Use established component library

### 2. Spanish Language Guidelines

```typescript
// ✅ Correct: Professional Spanish for rural audience
const messages = {
  welcome: 'Bienvenido a nuestra tienda en línea',
  loading: 'Cargando productos...',
  error: 'Ha ocurrido un error, por favor intente nuevamente',
  success: 'Operación completada exitosamente'
};

// ✅ Correct: Accessible language
const productDescription = 'Producto de alta calidad, perfecto para su hogar';

```

### 3. Accessibility Standards

```typescript
// ✅ Correct: Accessible components
const AccessibleButton = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={children}
    className="accessible-button"
  >
    {children}
  </button>
);

// ✅ Correct: Form accessibility
const AccessibleForm = () => (
  <form role="form" aria-labelledby="form-title">
    <h2 id="form-title">Información del producto</h2>
    <label htmlFor="product-name">Nombre del producto:</label>
    <input
      id="product-name"
      type="text"
      aria-required="true"
      aria-describedby="name-help"
    />
  </form>
);

```

---

## ⚡ Performance Guidelines

### 1. Bundle Optimization

```typescript
// ✅ Correct: Dynamic imports for large components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Cargando...</div>
});

// ✅ Correct: Tree shaking friendly imports
import { optimizeProduct } from '@/lib/ai/seo'; // Specific import
// Avoid: import * as SEO from '@/lib/ai/seo'; // Bundle everything

```

### 2. Image Optimization

```typescript
// ✅ Correct: Next.js Image component
import Image from 'next/image';

const OptimizedImage = ({ src, alt }) => (
  <Image
    src={src}
    alt={alt}
    width={400}
    height={300}
    loading="lazy"
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
  />
);

```

### 3. Database Performance

```typescript
// ✅ Correct: Indexed queries
const getOptimizedProducts = async () => {
  return await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
    // Use indexes for these fields
    select: {
      id: true,
      title: true,
      price: true,
      seoScore: true
    }
  });
};

```

---

## 🔒 Security Guidelines

### 1. Input Validation

```typescript
// ✅ Correct: Input validation with Zod
import { z } from 'zod';

const ProductSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().positive(),
  tags: z.array(z.string()).max(20)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = ProductSchema.parse(body);

    // Process validated data
    return NextResponse.json({ success: true });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }
    // Handle other errors
  }
}

```

### 2. API Security

```typescript
// ✅ Correct: Rate limiting
import rateLimit from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500
});

export async function POST(request: Request) {
  try {
    await limiter.check(request);

    // API logic
    return NextResponse.json({ success: true });

  } catch {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes' },
      { status: 429 }
    );
  }
}

```

### 3. Authentication & Authorization

```typescript
// ✅ Correct: Protected routes
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  const user = await getCurrentUser(request);

  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  // Admin-only logic
}

```

---

## 🧪 Testing Guidelines

### 1. Unit Testing

```typescript
// ✅ Correct: Component testing
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    const product = {
      id: '1',
      title: 'Test Product',
      price: 99.99
    };

    render(<ProductCard product={product} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });
});

```

### 2. API Testing

```typescript
// ✅ Correct: API route testing
import { POST } from './route';

describe('/api/seo/optimize-product', () => {
  it('optimizes product successfully', async () => {
    const request = new Request('http://localhost:3000/api/seo/optimize-product', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Product',
        description: 'Test description'
      })
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
  });
});

```

---

## 📊 SEO Guidelines

### 1. Meta Tags Implementation

```typescript
// ✅ Correct: SEO-optimized meta tags
export const metadata: Metadata = {
  title: 'Tienda en Línea - Productos Premium',
  description: 'Descubre nuestra amplia gama de productos premium con entrega a domicilio',
  keywords: ['productos', 'tienda', 'premium', 'calidad'],
  openGraph: {
    title: 'Tienda en Línea - Productos Premium',
    description: 'Descubre nuestra amplia gama de productos premium',
    images: [{ url: '/og-image.jpg' }]
  }
};

```

### 2. Structured Data

```typescript
// ✅ Correct: JSON-LD structured data
const productStructuredData = {
  '@context': 'https://schema.org/',
  '@type': 'Product',
  'name': product.title,
  'description': product.description,
  'sku': product.sku,
  'image': product.images,
  'offers': {
    '@type': 'Offer',
    'price': product.price,
    'priceCurrency': 'CLP',
    'availability': 'https://schema.org/InStock'
  }
};

```

### 3. Internal Linking Strategy

```typescript
// ✅ Correct: SEO-friendly internal links
const ProductLinks = ({ relatedProducts }) => (
  <div className="related-products">
    <h3>Productos relacionados</h3>
    {relatedProducts.map(product => (
      <Link
        key={product.id}
        href={`/productos/${product.slug}`}
        title={`Ver ${product.title}`}
      >
        {product.title}
      </Link>
    ))}
  </div>
);

```

---

## 🚨 Error Handling and Logging

### 1. Error Boundaries

```typescript
// ✅ Correct: Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

```

### 2. API Error Handling

```typescript
// ✅ Correct: Comprehensive API error handling
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation
    if (!body.productId) {
      return NextResponse.json(
        { error: 'ID del producto es requerido' },
        { status: 400 }
      );
    }

    // Business logic with error handling
    const result = await processProduct(body.productId);

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    console.error('API Error:', error);

    // Different error types
    if (error.code === 'PRODUCT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

```

### 3. User-Friendly Error Messages

```typescript
// ✅ Correct: User-friendly error messages
const errorMessages = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu internet.',
  VALIDATION_ERROR: 'Los datos ingresados no son válidos.',
  SERVER_ERROR: 'Ha ocurrido un error. Por favor, intenta nuevamente.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.'
};

```

---

## 📈 Performance Monitoring

### 1. Core Web Vitals

- **LCP (Largest Contentful Paint)**: Target < 2.5s

- **FID (First Input Delay)**: Target < 100ms

- **CLS (Cumulative Layout Shift)**: Target < 0.1

### 2. Performance Tracking

```typescript
// ✅ Correct: Performance monitoring
const trackPerformance = () => {
  if (typeof window !== 'undefined') {
    // Use web-vitals library
    import('web-vitals').then(({ getLCP, getFID, getCLS }) => {
      getLCP(console.log);
      getFID(console.log);
      getCLS(console.log);
    });
  }
};

```

---

## 🎯 Best Practices Summary

### Code Quality

- ✅ Use TypeScript with strict typing

- ✅ Follow established naming conventions

- ✅ Implement comprehensive error handling

- ✅ Write unit tests for critical functionality

- ✅ Use ESLint and follow its recommendations

### Performance

- ✅ Implement code splitting and lazy loading

- ✅ Optimize images and assets

- ✅ Use caching strategies appropriately

- ✅ Monitor and optimize Core Web Vitals

- ✅ Minimize bundle size

### SEO & Accessibility

- ✅ Implement proper meta tags and structured data

- ✅ Ensure accessibility compliance

- ✅ Use semantic HTML

- ✅ Optimize for search engines

- ✅ Test with screen readers

### Security

- ✅ Validate all inputs

- ✅ Implement proper authentication

- ✅ Use HTTPS and security headers

- ✅ Sanitize user inputs

- ✅ Follow OWASP guidelines

### User Experience

- ✅ Maintain consistent Spanish language

- ✅ Provide clear error messages

- ✅ Implement loading states

- ✅ Ensure mobile responsiveness

- ✅ Test with target audience

---

## 🛠️ AI DEVELOPMENT AUTOMATION (REQUIRED)

### 🤖 AI Pre-Development Checklist

- [ ] **🎯 AI CONTEXT**: Review current project state and AI requirements

- [ ] **📋 AI TODO**: Check for any existing AI TODO comments or issues

- [ ] **🚀 AI ENVIRONMENT**: Validate AI development environment is running

- [ ] **📚 AI GUIDELINES**: Review AI context and guidelines in documentation

- [ ] **🧪 AI LINTING**: Check for any linting or type errors automatically

### 🛠️ AI Code Implementation Process

1. **🎯 AI PLAN**: Review AI requirements and existing patterns

2. **📋 AI IMPLEMENT**: Follow established modular architecture

3. **🧪 AI TEST**: Validate functionality and performance with AI

4. **⚡ AI OPTIMIZE**: Ensure SEO and performance standards with AI

5. **📝 AI DOCUMENT**: Auto-update relevant AI documentation

### 🧪 AI Quality Assurance Steps

- [ ] **🛡️ AI TYPESCRIPT**: TypeScript compilation passes (AI requirement)

- [ ] **📋 AI LINTING**: ESLint checks pass (AI code quality)

- [ ] **🔍 AI SEO**: SEO validation for any content changes (AI critical)

- [ ] **⚡ AI PERFORMANCE**: Performance testing (Core Web Vitals) with AI

- [ ] **🌐 AI COMPATIBILITY**: Cross-browser compatibility check with AI

---

## 🔧 AI TECHNICAL SPECIFICATIONS (REQUIRED)

### 🎯 AI Technology Stack

|| Component | Technology | AI Purpose |
||-----------|------------|---------|
|| **Framework** | Next.js 14 + App Router | AI-optimized React framework with TypeScript |
|| **Database** | SQLite + Prisma ORM | AI-safe database operations |
|| **AI Integration** | OpenAI GPT-4 | AI content optimization and generation |
|| **Styling** | Tailwind CSS + Custom Design System | AI-responsive UI with color tokenization |
|| **Internationalization** | UNIFIED Chunked i18n System ONLY | AI Spanish-first (See I18N-RULES.md) |
|| **UI Components** | Custom Component Library | AI-reusable, accessible components |
|| **TypeScript** | Strict Mode Configuration | AI-full type safety and intellisense |
|| **State Management** | React Hooks + Custom Providers | AI-predictable state management |

### 🛠️ AI Development Tools

|| Tool | Purpose | AI Configuration |
||------|---------|---------------|
|| **Package Manager** | npm | AI dependency management |
|| **Type Checking** | TypeScript (strict mode) | AI type safety and error prevention |
|| **Linting** | ESLint | AI code quality and consistency |
|| **Code Formatting** | Prettier | AI consistent code formatting |
|| **Testing** | Jest + React Testing Library | AI unit and integration testing |
|| **Build Tool** | Next.js Built-in Bundler | AI optimized production builds |

---

## ⚡ AI PERFORMANCE OPTIMIZATION (REQUIRED)

### 🤖 AI Performance Standards

- **LCP (Largest Contentful Paint)**: Target < 2.5s (AI critical)

- **FID (First Input Delay)**: Target < 100ms (AI requirement)

- **CLS (Cumulative Layout Shift)**: Target < 0.1 (AI mandate)

- **Core Web Vitals**: 90%+ compliance (AI SEO requirement)

### 🚀 AI Optimization Techniques

- ✅ **Lazy Loading**: Dynamic imports for AI component optimization

- ✅ **Code Splitting**: Chunked loading for AI performance

- ✅ **Image Optimization**: Next.js Image component with AI alt text

- ✅ **Caching Strategy**: AI-optimized caching for content

- ✅ **Bundle Analysis**: AI-driven bundle size optimization

---

## 🧪 AI TESTING & VALIDATION (REQUIRED)

### 🎯 AI Content Validation

- ✅ **SEO Score Validation**: 80%+ threshold for AI content

- ✅ **Language Quality**: Spanish-first content verification

- ✅ **Internal Linking**: 3-5 links per AI-generated content

- ✅ **Keyword Integration**: AI keyword optimization validation

- ✅ **Content Uniqueness**: AI duplicate content detection

### 🧪 AI Technical Testing

- ✅ **TypeScript Compilation**: 100% success rate (AI requirement)

- ✅ **ESLint Validation**: Zero linting errors (AI standard)

- ✅ **Performance Testing**: Core Web Vitals compliance

- ✅ **Cross-browser Testing**: AI compatibility validation

- ✅ **Mobile Responsiveness**: AI mobile-first testing

---

## 📚 AI RESOURCE REFERENCES (REQUIRED)

### 🎯 AI Documentation Hierarchy

- **📋 README.md**: AI project overview and execution workflows

- **🚀 AI-WORKFLOW-GUIDE.md**: AI task-specific workflows and automation

- **🛠️ DEVELOPMENT-GUIDELINES.md**: AI technical standards and patterns

- **📝 CODE-TODO-GUIDE.md**: AI implementation guidance and priorities

- **🌍 src/lib/README-chunked-i18n.md**: AI i18n system documentation

### 🔧 AI Essential References

- **🤖 AI Context**: Always review AI ASSISTANT CONTEXT sections

- **🚀 AI Workflows**: Follow established AI EXECUTION WORKFLOWS

- **📋 AI Patterns**: Use AI IMPLEMENTATION PATTERNS for consistency

- **🧪 AI Validation**: Apply AI TESTING & VALIDATION procedures

- **⚡ AI Optimization**: Implement AI PERFORMANCE OPTIMIZATION standards

---

**🤖 AI Documentation Standard**: v2.0 - AI-ONLY
**🎯 AI Effective Date**: [Current Date]
**🧪 AI Review Cycle**: Monthly AI effectiveness review
**🚀 AI Optimization**: 100% AI-optimized for autonomous development
**🚫 CLAUDE.md RULE**: PERMANENTLY ENFORCED - NEVER TOUCH
