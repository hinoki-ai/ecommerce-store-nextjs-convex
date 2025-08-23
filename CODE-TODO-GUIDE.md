# 🤖 AI-ONLY CODE TODO GUIDE

## 🎯 AI ASSISTANT CONTEXT (REQUIRED)
**🚫 CRITICAL RULE**: NEVER TOUCH CLAUDE.md - Contains human-specific context
**🤖 AI-ONLY ACCESS**: This documentation is AI-optimized and accessible
**🎯 PROJECT TYPE**: Next.js 14 e-commerce platform with AI-optimized SEO
**🏗️ ARCHITECTURE**: Modular system with chunked loading (AI-optimized)
**⚡ CRITICAL REQUIREMENTS**: Spanish-first approach, AI content generation
**🚀 EXECUTION WORKFLOWS**: AI SEO optimization, content generation, validation
**📋 IMPLEMENTATION PATTERNS**: AI-powered TypeScript patterns, SEO optimization
**🧪 VALIDATION PROCEDURES**: AI content validation, SEO score testing

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

### 3. AI TODO Implementation Workflow
- ✅ **Priority Assessment**: High → Medium → Low (AI requirement)
- ✅ **Implementation Order**: Critical → Essential → Enhancement (AI mandate)
- ✅ **Validation Required**: All implementations must pass AI validation
- ✅ **Documentation Update**: Update this guide after completion (AI standard)

---

## 📋 AI IMPLEMENTATION PATTERNS (REQUIRED)

### 1. AI TODO Resolution Workflow
**🎯 AI GOAL**: Complete identified TODO items with AI optimization
```typescript
// 🚀 AI EXECUTION WORKFLOW: TODO implementation sequence
1. 🎯 AI: Identify TODO item and assess priority using AI
2. 📋 AI: Review existing patterns and implementation examples
3. 🤖 AI: Implement feature following established AI patterns
4. 🧪 AI: Validate implementation with AI testing procedures
5. ✅ AI: Update documentation and mark TODO as completed
6. 📝 AI: Verify integration with existing AI workflows
```

### 2. AI Priority Assessment
**🚀 AI GOAL**: Determine optimal implementation order for TODO items
```typescript
// 🤖 AI EXECUTION WORKFLOW: Priority evaluation
1. 🎯 AI: Analyze business impact using AI algorithms
2. 📊 AI: Assess technical dependencies automatically
3. ⚡ AI: Evaluate implementation complexity with AI
4. 🔍 AI: Consider SEO and performance implications
5. ✅ AI: Assign priority: Critical → High → Medium → Low
6. 📋 AI: Create implementation timeline with AI optimization
```

### 3. AI Quality Validation
**📝 AI GOAL**: Ensure all TODO implementations meet AI standards
```typescript
// 🚀 AI EXECUTION WORKFLOW: Quality assurance
1. 🛡️ AI: TypeScript compilation validation (AI requirement)
2. 📋 AI: ESLint standards compliance check
3. 🔍 AI: SEO optimization verification
4. ⚡ AI: Performance impact assessment
5. 🌍 AI: Spanish language quality validation
6. ✅ AI: Integration testing with existing systems
```

---

## 🔍 AI IDENTIFIED TODO ITEMS (REQUIRED)

### 1. Bulk Operations in Admin Products (`src/app/admin/products/page.tsx`)
```typescript
// TODO: Implement bulk delete
// TODO: Implement bulk status change
```

**AI Context**:
- These features would improve admin efficiency for managing multiple products
- Bulk delete should include confirmation dialogs and proper error handling
- Bulk status change should maintain data integrity and trigger appropriate events
- Follow existing patterns in the codebase for similar operations

**Implementation Priority**: Medium
**Estimated Effort**: 2-3 hours
**Dependencies**: Product service, confirmation dialogs, error handling

### 2. Low Stock Notification System (`src/components/InventoryManager.tsx`)
```typescript
// TODO: Implement low stock notification system
```

**AI Context**:
- Critical for inventory management and preventing stockouts
- Should integrate with existing inventory tracking
- Notifications should go to admin users via email/SMS/dashboard alerts
- Consider threshold settings and different notification levels

**Implementation Priority**: High
**Estimated Effort**: 4-6 hours
**Dependencies**: Notification service, user management, email/SMS integration

### 3. Sign-in Modal Implementation (`src/components/WishlistButton.tsx`)
```typescript
// TODO: Show sign-in modal or redirect to sign-in page
```

**AI Context**:
- Essential for user authentication flow
- Should integrate with existing authentication system
- Modal should be accessible and mobile-friendly
- Consider both modal and redirect options based on context

**Implementation Priority**: Medium
**Estimated Effort**: 2-3 hours
**Dependencies**: Authentication system, modal components, routing

### 4. Photos Filter Implementation (`convex/reviews.ts`)
```typescript
// Note: withPhotos filter would require storing image URLs in reviews
```

**AI Context**:
- This is a feature enhancement for review filtering
- Would require database schema changes to store image URLs
- Should integrate with existing review system
- Consider image upload, storage, and display components

**Implementation Priority**: Low
**Estimated Effort**: 3-4 hours
**Dependencies**: Database schema update, image upload service, review system

---

## 📋 Implementation Guidelines for AI Assistants

### General Principles
1. **Follow Existing Patterns**: Use established code patterns and architectural decisions
2. **Maintain Type Safety**: Ensure all new code has proper TypeScript types
3. **Error Handling**: Implement comprehensive error handling and user feedback
4. **Performance**: Consider performance implications of new features
5. **Testing**: Add appropriate tests for new functionality
6. **Documentation**: Update relevant documentation after implementation

### Code Quality Standards
- **Modular Architecture**: Keep features modular and reusable
- **Spanish Language**: All user-facing content in Spanish
- **SEO Optimization**: Consider SEO implications for new features
- **Accessibility**: Ensure features are accessible to all users
- **Mobile Responsiveness**: Test on mobile devices

### Database Considerations
- **Schema Changes**: Use Prisma migrations for database changes
- **Data Integrity**: Maintain referential integrity
- **Performance**: Consider indexing for frequently queried fields
- **Backup**: Ensure data can be backed up before schema changes

---

## 🚀 Recommended Implementation Order

### Phase 1: High Priority (Essential Features)
1. **Low Stock Notification System** - Critical for business operations
2. **Sign-in Modal Implementation** - Essential for user experience

### Phase 2: Medium Priority (Efficiency Improvements)
1. **Bulk Operations in Admin Products** - Improves admin efficiency
2. **Photos Filter for Reviews** - Enhances review functionality

### Phase 3: Low Priority (Nice-to-have Features)
1. **Additional Review Features** - Based on business needs
2. **Advanced Filtering Options** - As user requirements grow

---

## 🔧 Technical Implementation Notes

### Authentication Integration
```typescript
// AI: Use existing authentication patterns
import { useAuth } from '@/hooks/use-auth';
import { SignInModal } from '@/components/auth/SignInModal';

// Follow established auth flow patterns
```

### Notification System Architecture
```typescript
// AI: Implement notification service
interface Notification {
  id: string;
  type: 'low_stock' | 'order_update' | 'system';
  message: string;
  userId: string;
  read: boolean;
  createdAt: Date;
}

// Use existing service patterns for consistency
```

### Bulk Operations Pattern
```typescript
// AI: Follow existing CRUD patterns
const bulkDeleteProducts = async (productIds: string[]) => {
  // Implement with proper error handling
  // Use transaction for data integrity
  // Provide user feedback
};
```

### Image Upload Integration
```typescript
// AI: Use established upload patterns
const uploadReviewImage = async (file: File) => {
  // Validate file type and size
  // Upload to storage service
  // Return secure URL
  // Update database record
};
```

---

## 🎯 Success Criteria

### Functional Requirements
- [ ] All TODO items resolved with working implementations
- [ ] Features integrate seamlessly with existing codebase
- [ ] User experience is intuitive and accessible
- [ ] Performance standards are maintained

### Code Quality Requirements
- [ ] TypeScript compilation passes without errors
- [ ] ESLint checks pass
- [ ] Code follows established patterns
- [ ] Documentation is updated
- [ ] Tests are implemented where appropriate

### User Experience Requirements
- [ ] Features work on mobile and desktop
- [ ] Error states are handled gracefully
- [ ] Loading states are implemented
- [ ] User feedback is provided for all actions

---

## 📚 Additional Context for AI Assistants

### Existing Code Patterns to Follow
- **API Routes**: `/api/` folder structure and patterns
- **Component Structure**: Established React component patterns
- **Database Operations**: Prisma usage patterns
- **Error Handling**: Existing error handling approaches
- **State Management**: Current state management patterns

### Business Context
- **Target Audience**: Rural Chilean users
- **Language**: Spanish-first approach
- **Performance**: Optimized for slower internet connections
- **Accessibility**: Simple, professional interface

### Technical Constraints
- **Framework**: Next.js 14 with App Router
- **Database**: SQLite with Prisma
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI GPT-4 for content optimization

---

## 🚨 Important Notes for AI Implementation

1. **Always Test**: Test all implementations thoroughly before considering complete
2. **Follow Spanish Language Requirement**: All user-facing content must be in Spanish
3. **Maintain Performance**: Ensure new features don't negatively impact performance
4. **Update Documentation**: Update this guide and other documentation after implementation
5. **Consider SEO**: Any new content or features should consider SEO implications
6. **Mobile First**: Ensure all features work well on mobile devices
7. **Error Handling**: Implement comprehensive error handling for all new features
8. **User Feedback**: Provide appropriate user feedback for all operations

---

## 🛠️ AI DEVELOPMENT AUTOMATION (REQUIRED)

### 🤖 AI Pre-Development Checklist
- [ ] **🎯 AI CONTEXT**: Review current project state and AI requirements
- [ ] **📋 AI TODO**: Check existing TODO items and priorities
- [ ] **🚀 AI ENVIRONMENT**: Validate AI development environment is running
- [ ] **📚 AI GUIDELINES**: Review AI context and guidelines in documentation
- [ ] **🧪 AI LINTING**: Check for any linting or type errors automatically

### 🛠️ AI Code Implementation Process
1. **🎯 AI PLAN**: Review AI TODO requirements and existing patterns
2. **📋 AI IMPLEMENT**: Follow established modular architecture
3. **🧪 AI TEST**: Validate functionality and performance with AI
4. **⚡ AI OPTIMIZE**: Ensure SEO and performance standards with AI
5. **📝 AI DOCUMENT**: Auto-update this TODO guide after completion

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
|| **Internationalization** | Chunked i18n System | AI Spanish-first multi-language support |
|| **UI Components** | Custom Component Library | AI-reusable, accessible components |
|| **TypeScript** | Strict Mode Configuration | AI-full type safety and intellisense |
|| **State Management** | React Hooks + Custom Providers | AI-predictable state management |

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
- ✅ **Caching Strategy**: AI-optimized caching for TODO implementations
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