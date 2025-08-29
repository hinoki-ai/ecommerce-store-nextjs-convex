/**
 * Divine Parsing Oracle Middleware
 * Handles automatic language detection and URL routing
 */

import { NextRequest, NextResponse } from 'next/server';
import { supportedLanguageChunks, defaultLanguage } from 'src/lib/divine-parsing-oracle';

// Define public routes that don't need language prefix
const publicRoutes = [
  '/api',
  '/_next',
  '/favicon.ico',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml'
];

// Define routes that should always be in default language
const defaultLanguageRoutes = [
  '/',
  '/offline',
  '/track'
];

// Define routes that should bypass language routing (like auth routes)
const bypassLanguageRoutes = [
  '/sign-in',
  '/sign-up',
  '/dashboard',
  '/admin',
  '/api/auth',
  '/api/webhooks',
  '/cart',
  '/checkout',
  '/account',
  '/orders',
  '/wishlist',
  '/billing',
  '/subscription',
  '/payments'
];

// Supported language codes
const supportedLanguages = supportedLanguageChunks.map(lang => lang.code);

/**
 * Check if path is a public route
 */
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route));
}

/**
 * Check if path should always be in default language
 */
function isDefaultLanguageRoute(pathname: string): boolean {
  return defaultLanguageRoutes.some(route => pathname === route);
}

/**
 * Check if path should bypass language routing entirely
 */
function shouldBypassLanguageRouting(pathname: string): boolean {
  return bypassLanguageRoutes.some(route => pathname.startsWith(route));
}

/**
 * Extract language from pathname
 */
function extractLanguageFromPath(pathname: string): { lang: string; path: string } | null {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const potentialLang = segments[0];

  if (supportedLanguages.includes(potentialLang)) {
    return {
      lang: potentialLang,
      path: '/' + segments.slice(1).join('/')
    };
  }

  return null;
}

/**
 * Enhanced language detection from Accept-Language header
 * Includes region-specific logic for Spanish-speaking countries
 */
function detectLanguageFromHeader(acceptLanguage: string | null): string {
  if (!acceptLanguage) {
    return defaultLanguage;
  }

  // Parse Accept-Language header with enhanced region detection
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, quality = '1'] = lang.trim().split(';q=');
      const [primaryCode, regionCode] = code.split('-');
      return {
        code: primaryCode,
        region: regionCode,
        quality: parseFloat(quality),
        fullCode: code
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // Enhanced Spanish detection for Spanish-speaking regions
  const spanishRegions = ['ES', 'MX', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY'];

  // First pass: Check for Spanish with high priority regions
  for (const lang of languages) {
    if (lang.code === 'es') {
      // If it's Spanish from a Spanish-speaking region, prioritize it
      if (lang.region && spanishRegions.includes(lang.region.toUpperCase())) {
        return 'es';
      }
      // If it's generic Spanish, still consider it but check others first
      if (!lang.region) {
        // Look for English with higher quality first
        const englishLang = languages.find(l => l.code === 'en' && l.quality > lang.quality);
        if (!englishLang) {
          return 'es';
        }
      }
    }
  }

  // Second pass: Find any supported language
  for (const lang of languages) {
    if (supportedLanguages.includes(lang.code)) {
      return lang.code;
    }
  }

  return defaultLanguage;
}

/**
 * Get language from cookie
 */
function getLanguageFromCookie(request: NextRequest): string | null {
  const cookie = request.cookies.get('preferred-language');
  return cookie?.value || null;
}

/**
 * Set language cookie
 */
function setLanguageCookie(response: NextResponse, language: string) {
  response.cookies.set('preferred-language', language, {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
}

/**
 * Create redirect response with language
 */
function createLanguageRedirect(
  request: NextRequest,
  language: string,
  path: string = '/'
): NextResponse {
  const url = new URL(request.url);

  // For default language, don't add language prefix
  const targetPath = language === defaultLanguage
    ? path
    : `/${language}${path}`;

  url.pathname = targetPath;

  const response = NextResponse.redirect(url);

  // Set language cookie
  setLanguageCookie(response, language);

  return response;
}

/**
 * Main middleware function
 */
export function divineParsingOracleMiddleware(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes
  if (isPublicRoute(pathname)) {
    return null;
  }

  // Skip middleware for routes that should bypass language routing
  if (shouldBypassLanguageRouting(pathname)) {
    return null;
  }

  // Handle default language routes
  if (isDefaultLanguageRoute(pathname)) {
    // Check if user has a preferred language in cookie
    const cookieLang = getLanguageFromCookie(request);

    if (cookieLang && cookieLang !== defaultLanguage) {
      return createLanguageRedirect(request, cookieLang, pathname);
    }

    // Check browser language preference
    const browserLang = detectLanguageFromHeader(request.headers.get('accept-language'));

    if (browserLang !== defaultLanguage) {
      return createLanguageRedirect(request, browserLang, pathname);
    }

    return null;
  }

  // Check if path already has language prefix
  const langFromPath = extractLanguageFromPath(pathname);

  if (langFromPath) {
    // Valid language prefix found
    const { lang } = langFromPath;

    // Update cookie with current language
    const response = NextResponse.next();
    setLanguageCookie(response, lang);

    return response;
  }

  // No language prefix found - detect and redirect
  let targetLanguage = defaultLanguage;

  // First, check cookie
  const cookieLang = getLanguageFromCookie(request);
  if (cookieLang) {
    targetLanguage = cookieLang;
  } else {
    // Then check browser preference
    targetLanguage = detectLanguageFromHeader(request.headers.get('accept-language'));
  }

  return createLanguageRedirect(request, targetLanguage, pathname);
}

/**
 * Utility function to get current language from request
 */
export function getCurrentLanguage(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;

  // Check for language in path
  const langFromPath = extractLanguageFromPath(pathname);
  if (langFromPath) {
    return langFromPath.lang;
  }

  // Check cookie
  const cookieLang = getLanguageFromCookie(request);
  if (cookieLang) {
    return cookieLang;
  }

  // Check browser preference
  return detectLanguageFromHeader(request.headers.get('accept-language'));
}

/**
 * Generate hreflang links for SEO
 */
export function generateHrefLangLinks(request: NextRequest, currentPath: string) {
  const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  const links: { rel: string; hrefLang: string; href: string }[] = [];

  supportedLanguages.forEach(lang => {
    const href = lang === defaultLanguage
      ? `${baseUrl}${currentPath}`
      : `${baseUrl}/${lang}${currentPath}`;

    links.push({
      rel: 'alternate',
      hrefLang: lang,
      href
    });
  });

  return links;
}

/**
 * Note: This middleware is integrated into the main middleware.ts file
 * The matcher configuration is handled by the main middleware
 */