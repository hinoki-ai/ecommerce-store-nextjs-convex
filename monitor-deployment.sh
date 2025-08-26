#!/bin/bash

echo "🚀 ARAMAC Store - Production Deployment Monitor"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

SITE_URL="https://store.aramac.dev"
MAX_CHECKS=10
CHECK_INTERVAL=10

echo -e "${BLUE}🔍 Monitoring deployment at: $SITE_URL${NC}"
echo ""

check_site() {
    local url=$1
    local expected_status=$2
    
    echo "Checking $url..."
    response=$(curl -s -w "%{http_code}" -o /dev/null "$url" --connect-timeout 30)
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ Status $response - OK${NC}"
        return 0
    else
        echo -e "${RED}❌ Status $response - Expected $expected_status${NC}"
        return 1
    fi
}

check_site_content() {
    local url=$1
    
    echo "Checking site content..."
    content=$(curl -s "$url" --connect-timeout 30)
    
    if echo "$content" | grep -q "ΛRΛMΛC Store"; then
        echo -e "${GREEN}✅ Site content loads correctly${NC}"
        return 0
    else
        echo -e "${RED}❌ Site content not loading properly${NC}"
        echo "First 200 chars of response:"
        echo "$content" | head -c 200
        return 1
    fi
}

echo "🚀 Phase 1: Basic Connectivity Test"
echo "-----------------------------------"

for i in $(seq 1 $MAX_CHECKS); do
    echo -e "${BLUE}Check $i/$MAX_CHECKS ($(date))${NC}"
    
    if check_site "$SITE_URL" "200"; then
        echo -e "${GREEN}🎉 Site is reachable!${NC}"
        break
    else
        if [ $i -eq $MAX_CHECKS ]; then
            echo -e "${RED}🚨 Site failed to respond after $MAX_CHECKS attempts${NC}"
            exit 1
        fi
        echo -e "${YELLOW}⏳ Waiting ${CHECK_INTERVAL}s before next check...${NC}"
        sleep $CHECK_INTERVAL
    fi
done

echo ""
echo "📄 Phase 2: Content Validation"
echo "------------------------------"

if check_site_content "$SITE_URL"; then
    echo -e "${GREEN}✅ Content validation passed${NC}"
else
    echo -e "${RED}❌ Content validation failed${NC}"
fi

echo ""
echo "🔍 Phase 3: Key Pages Test"
echo "--------------------------"

KEY_PAGES=(
    "/"
    "/products" 
    "/categories"
    "/collections"
    "/cart"
    "/sign-in"
    "/dashboard"
)

PASSED=0
TOTAL=${#KEY_PAGES[@]}

for page in "${KEY_PAGES[@]}"; do
    if check_site "$SITE_URL$page" "200"; then
        PASSED=$((PASSED + 1))
    fi
done

echo ""
echo "📊 Results: $PASSED/$TOTAL pages responding correctly"

if [ $PASSED -eq $TOTAL ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Deployment successful!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️ Some pages may need attention${NC}"
    exit 1
fi