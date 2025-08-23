#!/bin/bash

# Deployment script for store.aramac.dev
# Usage: ./scripts/deploy.sh [environment]
# Environment: development | production (default: production)

set -e

ENVIRONMENT=${1:-production}
echo "🚀 Starting deployment for environment: $ENVIRONMENT"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v npx &> /dev/null; then
        log_error "npx is not available"
        exit 1
    fi
    
    log_success "All dependencies are available"
}

# Validate environment variables
validate_env() {
    log_info "Validating environment variables..."
    
    if [[ "$ENVIRONMENT" == "production" ]]; then
        ENV_FILE=".env.production"
    else
        ENV_FILE=".env.local"
    fi
    
    if [[ ! -f "$ENV_FILE" ]]; then
        log_error "Environment file $ENV_FILE not found"
        log_info "Please create $ENV_FILE based on .env.example"
        exit 1
    fi
    
    # Check for placeholder values
    if grep -q "your_.*_here" "$ENV_FILE"; then
        log_warning "Found placeholder values in $ENV_FILE"
        log_warning "Please update all placeholder values before deploying"
        
        # Show which lines contain placeholders
        echo "Lines with placeholders:"
        grep -n "your_.*_here" "$ENV_FILE" || true
        
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Deployment cancelled"
            exit 1
        fi
    fi
    
    log_success "Environment validation completed"
}

# Install dependencies
install_deps() {
    log_info "Installing dependencies..."
    npm ci --silent
    log_success "Dependencies installed"
}

# Run type checking
type_check() {
    log_info "Running type checks..."
    npx tsc --noEmit
    log_success "Type checking passed"
}

# Run linting
lint_check() {
    log_info "Running linter..."
    npm run lint
    log_success "Linting passed"
}

# Build the application
build_app() {
    log_info "Building application..."
    
    if [[ "$ENVIRONMENT" == "production" ]]; then
        # Use production environment
        cp .env.production .env.local
        NODE_ENV=production npm run build
    else
        npm run build
    fi
    
    log_success "Build completed"
}

# Database operations
setup_database() {
    log_info "Setting up database..."
    
    # Generate Prisma client
    npx prisma generate
    
    # Push database schema (for development)
    if [[ "$ENVIRONMENT" == "development" ]]; then
        npx prisma db push
    else
        log_warning "For production, ensure database migrations are properly applied"
        log_info "Run: npx prisma migrate deploy"
    fi
    
    log_success "Database setup completed"
}

# Deploy Convex functions
deploy_convex() {
    log_info "Deploying Convex functions..."
    
    if [[ "$ENVIRONMENT" == "production" ]]; then
        npx convex deploy --prod
    else
        npx convex dev &
        CONVEX_PID=$!
        sleep 5
        kill $CONVEX_PID 2>/dev/null || true
    fi
    
    log_success "Convex deployment completed"
}

# Main deployment function
main() {
    echo "
╔══════════════════════════════════════════════════════════════╗
║                    🏪 Store Deployment                       ║
║                   store.aramac.dev                           ║
╚══════════════════════════════════════════════════════════════╝
"
    
    check_dependencies
    validate_env
    install_deps
    type_check
    lint_check
    setup_database
    deploy_convex
    build_app
    
    echo ""
    log_success "🎉 Deployment preparation completed!"
    
    if [[ "$ENVIRONMENT" == "production" ]]; then
        echo ""
        log_info "Next steps for production deployment:"
        echo "  1. Push code to your Git repository"
        echo "  2. Configure production environment variables in your deployment platform"
        echo "  3. Deploy via your platform (Vercel, Netlify, etc.)"
        echo "  4. Configure custom domain: store.aramac.dev"
        echo "  5. Run post-deployment verification checklist"
        echo ""
        log_info "See DEPLOYMENT.md for detailed instructions"
    else
        echo ""
        log_info "Development build completed. Start with: npm run dev"
    fi
}

# Handle script interruption
trap 'log_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"