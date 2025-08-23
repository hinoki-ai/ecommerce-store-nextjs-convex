# Deployment Guide for store.aramac.dev

## Overview
This guide covers the deployment process for the AI-Powered E-Commerce SEO System to the production subdomain `store.aramac.dev`.

## Prerequisites

### 1. Environment Setup
- Copy `.env.production` to your deployment platform
- Update all placeholder values with production credentials
- Ensure all required services are configured for production

### 2. Required Services Configuration

#### Convex Database
- Deploy your Convex functions: `npx convex deploy --prod`
- Update `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` in production environment
- Configure Convex environment variables in dashboard

#### Clerk Authentication
- Set up production Clerk application
- Configure production domain in Clerk dashboard: `store.aramac.dev`
- Update redirect URLs to use `https://store.aramac.dev`
- Set up webhook endpoints for production
- Update all Clerk environment variables

#### Database Setup
- Configure production SQLite database or upgrade to PostgreSQL
- Run database migrations: `npx prisma migrate deploy`
- Generate Prisma client: `npx prisma generate`

#### AI Services
- Configure production OpenAI API key with appropriate usage limits
- Set up monitoring for API usage and costs

## Deployment Steps

### Using Vercel (Recommended)

1. **Initial Setup**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   ```

2. **Project Configuration**
   ```bash
   # Link project to Vercel
   vercel link
   
   # Configure environment variables
   vercel env add NEXT_PUBLIC_APP_URL production
   vercel env add NEXT_PUBLIC_APP_DOMAIN production
   vercel env add CONVEX_DEPLOYMENT production
   vercel env add NEXT_PUBLIC_CONVEX_URL production
   vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
   vercel env add CLERK_SECRET_KEY production
   vercel env add CLERK_WEBHOOK_SECRET production
   vercel env add NEXT_PUBLIC_CLERK_FRONTEND_API_URL production
   vercel env add DATABASE_URL production
   vercel env add OPENAI_API_KEY production
   ```

3. **Domain Configuration**
   - Add `store.aramac.dev` as custom domain in Vercel dashboard
   - Configure DNS records to point to Vercel
   - SSL certificates will be automatically provisioned

4. **Deploy**
   ```bash
   # Deploy to production
   vercel --prod
   ```

### Using Other Platforms

For other platforms (Netlify, Railway, etc.), ensure:
- Build command: `npm run build`
- Start command: `npm start`
- Node.js version: 18.x or higher
- Environment variables are properly configured

## Post-Deployment Checklist

### 1. Service Verification
- [ ] Application loads at `https://store.aramac.dev`
- [ ] Convex database connectivity
- [ ] Clerk authentication flows
- [ ] Database migrations applied
- [ ] AI services responding

### 2. SEO Configuration
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Sitemap.xml accessible at `/sitemap.xml`
- [ ] Meta tags and JSON-LD structured data
- [ ] Core Web Vitals performance targets met

### 3. Security Validation
- [ ] HTTPS properly configured
- [ ] Security headers implemented
- [ ] Environment variables secured
- [ ] No secrets exposed in client-side code

### 4. Performance Testing
- [ ] Page load times under 3 seconds
- [ ] Core Web Vitals within green thresholds
- [ ] Database query performance
- [ ] AI API response times acceptable

### 5. Functionality Testing
- [ ] User registration and authentication
- [ ] Product browsing and search
- [ ] Shopping cart functionality
- [ ] Order processing
- [ ] Admin dashboard access
- [ ] SEO dashboard operations
- [ ] Multi-language switching

## Monitoring and Maintenance

### Analytics Setup
- Configure web analytics (Google Analytics, etc.)
- Set up error tracking (Sentry, etc.)
- Monitor Core Web Vitals
- Track conversion metrics

### Regular Maintenance
- Monitor AI API usage and costs
- Database performance optimization
- Security updates and patches
- Content and SEO performance review

## Troubleshooting

### Common Issues

1. **Environment Variable Issues**
   - Verify all required variables are set
   - Check variable names match exactly
   - Ensure no trailing spaces or quotes

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database accessibility from deployment platform
   - Ensure migrations are applied

3. **Authentication Issues**
   - Verify Clerk domain configuration
   - Check redirect URLs match production domain
   - Validate webhook configurations

4. **AI Service Issues**
   - Check OpenAI API key validity
   - Monitor API usage limits
   - Verify request/response formats

### Support Resources
- Next.js deployment documentation
- Convex deployment guides
- Clerk production setup guides
- Vercel custom domain setup

## Environment Variables Reference

See `.env.production` for complete list of required environment variables with production values.

## Security Notes
- Never commit real API keys to version control
- Use secure environment variable storage
- Regularly rotate secrets and API keys
- Monitor for unauthorized access attempts
- Keep dependencies updated for security patches