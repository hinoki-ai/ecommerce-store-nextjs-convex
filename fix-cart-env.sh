#!/bin/bash

# Fix for cart functionality in production
# This script updates the production environment file to enable Convex

echo "🔧 Fixing cart functionality by enabling Convex in production environment..."

# Create backup of current production env file
cp .env.production .env.production.backup

# Update the SKIP_AUTH settings to enable Convex
sed -i 's/SKIP_AUTH=true/SKIP_AUTH=false/g' .env.production
sed -i 's/NEXT_PUBLIC_SKIP_AUTH=true/NEXT_PUBLIC_SKIP_AUTH=false/g' .env.production

echo "✅ Production environment updated:"
echo "   - SKIP_AUTH=false"
echo "   - NEXT_PUBLIC_SKIP_AUTH=false"
echo ""
echo "📦 The cart functionality should now work properly in production."
echo "   You can redeploy to apply these changes."
echo ""
echo "🔄 To redeploy:"
echo "   1. Commit and push these changes"
echo "   2. Your deployment platform will automatically redeploy"
echo "   3. Test the cart functionality at https://store.aramac.dev/products"