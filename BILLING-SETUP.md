# Billing Clerk Convex Login Auth System Setup

## Overview

This document outlines the billing system implementation based on patterns from Minimarket and ParkingLot projects. The system integrates Clerk authentication with Convex database and Stripe payments for a comprehensive billing solution.

## Features Implemented

### ✅ Completed
- [x] Billing-specific roles and permissions (PREMIUM, BASIC, FREE)
- [x] Enhanced auth utilities with billing checks
- [x] Payment-gated components
- [x] Custom Clerk pricing component
- [x] Convex billing schema and functions
- [x] Middleware billing route protection
- [x] Enhanced auth configuration

### 🔄 In Progress
- [ ] Environment configuration
- [ ] API endpoints for billing
- [ ] Webhook handlers
- [ ] Billing dashboard UI

## Environment Variables Required

### Clerk Configuration
```bash
# Required - Clerk Frontend API
NEXT_PUBLIC_CLERK_FRONTEND_API_URL=https://your-app.clerk.accounts.dev
CLERK_FRONTEND_API_URL=https://your-app.clerk.accounts.dev

# Required - Clerk Secret Key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# Optional - Webhooks for billing events
CLERK_WEBHOOK_URL=https://your-app.com/api/webhooks/clerk
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Stripe Configuration
```bash
# Required for billing
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Webhooks
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

# Price IDs for plans
STRIPE_BASIC_PRICE_ID=price_your_basic_plan_price_id
STRIPE_PREMIUM_PRICE_ID=price_your_premium_plan_price_id
```

### Billing Feature Flags
```bash
# Enable billing system
BILLING_ENABLED=true
SUBSCRIPTIONS_ENABLED=true
PAYMENT_GATES_ENABLED=true

# Plan limits
FREE_PLAN_PRODUCT_LIMIT=10
BASIC_PLAN_PRODUCT_LIMIT=-1
PREMIUM_PLAN_PRODUCT_LIMIT=-1

FREE_PLAN_ORDER_LIMIT=100
BASIC_PLAN_ORDER_LIMIT=1000
PREMIUM_PLAN_ORDER_LIMIT=-1
```

## Database Schema

The billing system adds the following tables to your Convex schema:

### billingPlans
- Plan definitions with features and limits
- Stripe integration support
- Active/inactive status management

### subscriptions
- User subscription management
- Plan status tracking
- Stripe subscription integration
- Period management

### paymentAttempts
- Payment tracking and history
- Stripe payment intent integration
- Failure reason logging

### billingUsage
- Resource usage tracking
- Period-based usage monitoring
- Subscription-based limits

## Billing Roles & Permissions

### FREE (Default)
- View basic products (10 limit)
- Basic analytics
- No premium features

### BASIC
- Unlimited products
- Advanced analytics
- Priority support
- Billing management access

### PREMIUM
- All BASIC features plus:
- Bulk operations
- Custom domain
- API access
- Advanced reports

### ENTERPRISE (Admin/Super Admin)
- All features
- Administrative access
- System management

## Route Protection

### Public Routes
- `/` - Landing page
- `/products` - Product catalog
- `/sign-in`, `/sign-up` - Authentication

### Protected Routes (Require Auth)
- `/cart`, `/checkout` - Shopping
- `/account`, `/orders` - User account
- `/billing`, `/subscription` - Billing management

### Premium Routes (Require Premium Plan)
- `/premium` - Premium features
- `/advanced-reports` - Advanced analytics
- `/bulk-operations` - Bulk operations

### Basic Routes (Require Basic Plan)
- `/analytics` - Advanced analytics
- `/reports` - Report generation

## Components

### PaymentGated
```tsx
<PaymentGated feature="advanced analytics" plan="premium">
  <AdvancedAnalyticsComponent />
</PaymentGated>
```

### CustomClerkPricing
```tsx
import CustomClerkPricing from '@/components/CustomClerkPricing'

<CustomClerkPricing />
```

## API Endpoints

### Authentication APIs
- `GET /api/auth/me` - Get current user with billing info
- `POST /api/auth/upgrade` - Upgrade subscription
- `POST /api/auth/cancel` - Cancel subscription

### Billing APIs
- `GET /api/billing/plans` - Get available plans
- `GET /api/billing/subscription` - Get user subscription
- `GET /api/billing/usage` - Get usage statistics
- `POST /api/billing/webhook` - Stripe webhook handler

## Setup Instructions

### 1. Install Dependencies
```bash
npm install @clerk/nextjs stripe @stripe/stripe-js
```

### 2. Configure Environment
Create `.env.local` with the variables listed above.

### 3. Initialize Billing Plans
```bash
# This will be called automatically on first deploy
# Or run manually to seed billing plans
```

### 4. Configure Stripe Webhooks
Set up webhooks in Stripe dashboard pointing to:
- `https://your-app.com/api/webhooks/stripe`

### 5. Configure Clerk Webhooks
Set up webhooks in Clerk dashboard for billing events.

## Usage Examples

### Checking Billing Access
```typescript
import { hasPremiumAccess, requirePremium } from '@/lib/auth-utils'

// Client-side check
const hasAccess = hasPremiumAccess()

// Server-side requirement
const user = await requirePremium()
```

### Payment Gating
```tsx
import PaymentGated from '@/components/PaymentGated'

function PremiumFeature() {
  return (
    <PaymentGated
      feature="advanced analytics"
      plan="premium"
      fallback={<UpgradePrompt />}
    >
      <AdvancedAnalytics />
    </PaymentGated>
  )
}
```

### Usage Tracking
```typescript
import { checkPlanLimits } from '@/convex/billing'

const limits = await checkPlanLimits({
  resource: 'products',
  currentCount: currentProductCount
})

if (!limits.withinLimit) {
  // Show upgrade prompt
}
```

## Security Considerations

1. **Rate Limiting**: Implement Redis-based rate limiting for billing endpoints
2. **Webhook Verification**: Always verify Stripe and Clerk webhook signatures
3. **Data Encryption**: Encrypt sensitive billing data at rest
4. **Audit Logging**: Log all billing-related actions for compliance
5. **Access Control**: Implement proper role-based access control

## Migration from Free Tier

1. Update existing users to have FREE role by default
2. Create billing plans in Convex database
3. Set up Stripe products and prices
4. Configure webhooks for automatic subscription updates
5. Update middleware to enforce billing rules

## Monitoring & Analytics

- Track subscription conversion rates
- Monitor payment failure rates
- Analyze feature usage by plan
- Set up alerts for billing issues
- Monitor API usage limits

## Troubleshooting

### Common Issues

1. **Webhook signature verification fails**
   - Check webhook secrets are correctly configured
   - Ensure raw body is used for verification

2. **Subscription not updating**
   - Check Convex functions are deployed
   - Verify webhook endpoints are accessible
   - Check Clerk metadata is being updated

3. **Payment gates not working**
   - Ensure user role is correctly set in Clerk
   - Check middleware is properly configured
   - Verify feature flags are enabled

## Next Steps

1. [ ] Set up Stripe account and products
2. [ ] Configure Clerk billing features
3. [ ] Test payment flows
4. [ ] Implement billing dashboard
5. [ ] Add usage tracking
6. [ ] Set up monitoring and alerts

## Support

For billing system issues, check:
1. Stripe dashboard for payment issues
2. Clerk dashboard for authentication issues
3. Convex dashboard for database issues
4. Application logs for application-specific errors