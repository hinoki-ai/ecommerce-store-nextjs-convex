#!/bin/bash

# Testing deployment script for store.aramac.dev
# This script sets up the project for testing without authentication

set -e

echo "🧪 Setting up testing deployment for store.aramac.dev"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Copy testing environment
log_info "Setting up testing environment..."
cp .env.testing .env.local
log_success "Testing environment configured"

# Install dependencies
log_info "Installing dependencies..."
npm ci --silent
log_success "Dependencies installed"

# Create mock images directory if it doesn't exist
log_info "Setting up mock assets..."
mkdir -p public/images/products
mkdir -p public/images/categories
mkdir -p public/images

# Create placeholder images if they don't exist
if [ ! -f "public/images/products/smartphone.jpg" ]; then
    # Create simple placeholder SVGs as JPGs aren't needed for testing
    echo '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" fill="#666">Smartphone</text></svg>' > public/images/products/smartphone.svg
fi

# Build the application
log_info "Building application for testing..."
NODE_ENV=production npm run build
log_success "Build completed"

echo ""
log_success "🎉 Testing deployment ready!"
echo ""
log_info "Next steps:"
echo "  1. Deploy the built application to your hosting platform"
echo "  2. Set environment variables from .env.testing"
echo "  3. Point store.aramac.dev to your deployment"
echo "  4. The site will run without authentication or database dependencies"
echo ""
log_warning "⚠️  This is for TESTING ONLY - not for production use"
echo ""