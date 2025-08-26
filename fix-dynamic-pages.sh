#!/bin/bash
# Quick fix script to add dynamic export to pages that use Convex

pages=(
    "src/app/wishlist/page.tsx"
    "src/app/orders/page.tsx"
    "src/app/search/page.tsx"
    "src/app/collections/page.tsx"
    "src/app/categories/page.tsx"
    "src/app/track/page.tsx"
)

for page in "${pages[@]}"; do
    if [ -f "$page" ]; then
        # Check if it already has the export
        if ! grep -q "export const dynamic" "$page"; then
            # Add after the first line (use client)
            sed -i '1a\\n// Force dynamic rendering to prevent build-time issues with Convex\nexport const dynamic = '"'"'force-dynamic'"'"'' "$page"
            echo "Fixed: $page"
        else
            echo "Already fixed: $page"
        fi
    else
        echo "Not found: $page"
    fi
done