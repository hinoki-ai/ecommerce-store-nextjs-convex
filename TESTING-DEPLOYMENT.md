# Testing Deployment Guide - store.aramac.dev

## Overview

This guide sets up the e-commerce platform for **free testing access** on `store.aramac.dev` without requiring Convex, Clerk, or database setup. Perfect for demonstration and testing purposes.

## 🚀 Quick Deploy (No Authentication Required)

### Option 1: Automated Script

```bash
# Run the automated testing deployment script
./scripts/deploy-testing.sh
```

### Option 2: Manual Setup

1. **Set up testing environment:**
   ```bash
   cp .env.testing .env.local
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🔧 What's Bypassed in Testing Mode

### Authentication (Clerk)
- ✅ No Clerk account needed
- ✅ No authentication setup required
- ✅ Mock user automatically logged in
- ✅ All protected routes accessible

### Database (Convex)
- ✅ No Convex account needed
- ✅ No database setup required
- ✅ Mock data for products, categories, orders
- ✅ All e-commerce functionality works

### External Services
- ✅ No OpenAI API key needed
- ✅ No third-party integrations required
- ✅ Mock responses for all external calls

## 📱 Available Features in Testing Mode

### ✅ Fully Working Features
- Browse products and categories
- Add items to cart
- View product details
- Search functionality
- Multi-language support (ES/EN/FR/DE/RU/AR)
- Responsive design
- Shopping cart management
- Mock order processing
- Admin dashboard access
- SEO-optimized pages

### 🔄 Mock Features (Simulated)
- User authentication (auto-logged in)
- Order processing (mock confirmation)
- Payment processing (simulation)
- Real-time updates (mock responses)

## 🌐 Deployment Options

### Vercel (Recommended)

1. **Using Vercel CLI:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy with testing config
   vercel --prod --local-config vercel-testing.json
   ```

2. **Using Vercel Dashboard:**
   - Import project from GitHub
   - Use these environment variables:
     ```
     SKIP_AUTH=true
     NEXT_PUBLIC_SKIP_AUTH=true
     NEXT_PUBLIC_APP_URL=https://store.aramac.dev
     NEXT_PUBLIC_APP_DOMAIN=store.aramac.dev
     NEXT_PUBLIC_USE_MOCK_DATA=true
     NODE_ENV=production
     ```

### Netlify

1. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

2. **Environment variables:**
   ```
   SKIP_AUTH=true
   NEXT_PUBLIC_SKIP_AUTH=true
   NEXT_PUBLIC_APP_URL=https://store.aramac.dev
   NEXT_PUBLIC_APP_DOMAIN=store.aramac.dev
   NEXT_PUBLIC_USE_MOCK_DATA=true
   ```

### Railway / Render / Other Platforms

1. **Environment variables:** Use the same as above
2. **Build command:** `npm run build`
3. **Start command:** `npm start`

## 🛠️ Custom Domain Setup

### DNS Configuration
Point your domain `store.aramac.dev` to your hosting provider:

- **Vercel:** Add custom domain in project settings
- **Netlify:** Add custom domain in site settings
- **Others:** Follow provider-specific instructions

### SSL Certificate
Most modern hosting platforms automatically provision SSL certificates for custom domains.

## 🧪 Testing Checklist

After deployment, verify these features work:

### Core Functionality
- [ ] Homepage loads correctly
- [ ] Product listing displays mock products
- [ ] Individual product pages work
- [ ] Add to cart functionality
- [ ] Cart page shows items
- [ ] Search functionality
- [ ] Category browsing

### Multi-language
- [ ] Language switcher works
- [ ] Content displays in selected language
- [ ] URLs update correctly

### Responsive Design
- [ ] Mobile view works correctly
- [ ] Tablet view works correctly
- [ ] Desktop view works correctly

### Admin Features
- [ ] `/admin` dashboard accessible
- [ ] All admin pages load
- [ ] Mock data displays correctly

## 🔍 Troubleshooting

### Build Errors

1. **Missing environment variables:**
   - Ensure `SKIP_AUTH=true` is set
   - Check all required testing variables are present

2. **Module not found errors:**
   - Run `npm ci` to ensure clean install
   - Clear `.next` folder and rebuild

### Runtime Errors

1. **Authentication errors:**
   - Verify `NEXT_PUBLIC_SKIP_AUTH=true` is set in client-side environment
   - Check browser console for environment variable values

2. **Database errors:**
   - Ensure mock data is loading correctly
   - Check `NEXT_PUBLIC_USE_MOCK_DATA=true` is set

### Performance Issues

1. **Slow loading:**
   - Enable compression in hosting platform
   - Verify image optimization is working
   - Check Core Web Vitals in browser DevTools

## 📊 Mock Data Available

### Products
- 4 sample products with Chilean pricing (CLP)
- Electronics, computers, home & garden categories
- Realistic product descriptions in Spanish
- Mock ratings and reviews

### User Data
- Mock user: "Usuario Prueba" (test@aramac.dev)
- Mock cart with sample items
- Mock order history

### Categories
- Electronics (Electrónicos)
- Computers (Computadoras)
- Home & Garden (Hogar y Jardín)

## 🔒 Security Note

**This configuration is for TESTING ONLY!**

- Authentication is completely bypassed
- All data is mock/fake
- Do not use for production
- No real payment processing
- No real user data storage

## 🚀 Converting to Production Later

When ready for production:

1. Remove `.env.testing` 
2. Set up real `.env.production` with actual credentials
3. Configure Convex database
4. Set up Clerk authentication
5. Configure OpenAI API
6. Update deployment configuration
7. Remove all mock data and bypass logic

## 📞 Support

If you encounter issues:

1. Check browser console for JavaScript errors
2. Verify environment variables are set correctly
3. Ensure the build completed successfully
4. Check hosting platform logs for server errors

The testing deployment should work without any external service dependencies!