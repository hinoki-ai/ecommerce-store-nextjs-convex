#!/bin/bash

echo "🔍 ΛRΛMΛC Store - Comprehensive Deployment Validation"
echo "============================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Track validation results
ERRORS=0
WARNINGS=0

check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        ERRORS=$((ERRORS + 1))
    fi
}

warn_status() {
    echo -e "${YELLOW}⚠️ $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

echo ""
echo "📋 Phase 1: Environment & Configuration Validation"
echo "---------------------------------------------------"

# Check environment files exist
if [ -f ".env.production" ]; then
    check_status 0 "Production environment file exists"
else
    check_status 1 "Production environment file missing"
fi

# Check package.json scripts
if grep -q "build.*prisma generate" package.json; then
    check_status 0 "Prisma generation in build script"
else
    check_status 1 "Missing Prisma generation in build script"
fi

# Check for required dependencies
echo ""
echo "📦 Phase 2: Dependencies & Package Validation"
echo "---------------------------------------------"

# Check critical dependencies
CRITICAL_DEPS=("next" "react" "convex" "@clerk/nextjs" "prisma")
for dep in "${CRITICAL_DEPS[@]}"; do
    if npm list "$dep" >/dev/null 2>&1; then
        check_status 0 "Dependency: $dep"
    else
        check_status 1 "Missing critical dependency: $dep"
    fi
done

echo ""
echo "🏗️  Phase 3: Build Process Validation"
echo "------------------------------------"

# Test build process
echo "Running production build test..."
if npm run build >/dev/null 2>&1; then
    check_status 0 "Production build succeeds"
else
    check_status 1 "Production build fails"
fi

# Check for build artifacts
if [ -d ".next" ]; then
    check_status 0 "Build artifacts generated"
else
    check_status 1 "Build artifacts missing"
fi

echo ""
echo "🔧 Phase 4: Configuration Files Validation"
echo "-------------------------------------------"

# Check Next.js config
if [ -f "next.config.ts" ]; then
    if grep -q "output.*standalone" next.config.ts; then
        check_status 0 "Standalone output configured"
    else
        warn_status "Standalone output not configured (optional)"
    fi
else
    check_status 1 "Next.js config file missing"
fi

# Check Vercel config
if [ -f "vercel.json" ]; then
    if grep -q "SKIP_ENV_VALIDATION" vercel.json; then
        check_status 0 "Vercel build environment configured"
    else
        warn_status "Build environment variables not optimized"
    fi
else
    warn_status "Vercel configuration file missing (optional)"
fi

echo ""
echo "📄 Phase 5: Critical Files Validation"
echo "------------------------------------"

# Check for critical application files
CRITICAL_FILES=(
    "src/app/layout.tsx"
    "src/components/ConvexClientProvider.tsx"
    "src/hooks/useCart.tsx"
    "middleware.ts"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        check_status 0 "Critical file: $file"
    else
        check_status 1 "Missing critical file: $file"
    fi
done

echo ""
echo "🎯 Phase 6: Dynamic Route Configuration"
echo "--------------------------------------"

# Check for dynamic exports in Convex-dependent pages
DYNAMIC_PAGES=(
    "src/app/cart/page.tsx"
    "src/app/checkout/page.tsx"
    "src/app/dashboard/page.tsx"
    "src/app/products/page.tsx"
    "src/app/wishlist/page.tsx"
)

for page in "${DYNAMIC_PAGES[@]}"; do
    if [ -f "$page" ] && grep -q "export const dynamic" "$page"; then
        check_status 0 "Dynamic export: $(basename "$page")"
    elif [ -f "$page" ]; then
        warn_status "Missing dynamic export: $(basename "$page")"
    fi
done

echo ""
echo "🔒 Phase 7: Security & Build Safety"
echo "-----------------------------------"

# Check for build safety measures
if grep -q "shouldSkipAuth" src/components/ConvexClientProvider.tsx; then
    check_status 0 "ConvexClientProvider has build safety"
else
    check_status 1 "ConvexClientProvider missing build safety"
fi

if grep -q "shouldSkipAuth" src/hooks/useCart.tsx; then
    check_status 0 "CartProvider has build safety"
else
    check_status 1 "CartProvider missing build safety"
fi

echo ""
echo "📊 VALIDATION SUMMARY"
echo "===================="
echo -e "Errors: ${RED}${ERRORS}${NC}"
echo -e "Warnings: ${YELLOW}${WARNINGS}${NC}"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 DEPLOYMENT READY!${NC}"
    echo "Your application is ready for production deployment."
    exit 0
else
    echo -e "${RED}🚨 DEPLOYMENT BLOCKED!${NC}"
    echo "Please fix the errors above before deploying."
    exit 1
fi