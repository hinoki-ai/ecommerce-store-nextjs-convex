import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

async function adminMiddlewareHandler(auth: any, req: any): Promise<NextResponse> {
  // TEMPORARY: Skip authentication for development/testing
  const skipAuth = process.env.SKIP_AUTH === 'true'

  if (skipAuth) {
    console.log('🔓 AUTH DISABLED (Admin): Skipping authentication checks')
    return NextResponse.next()
  }

  // Protect admin routes
  if (isAdminRoute(req)) {
    const { userId } = await auth()

    if (!userId) {
      // Redirect to sign-in if not authenticated
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return NextResponse.redirect(signInUrl)
    }

    // For now, we'll allow all authenticated users to access admin
    // In production, you should check user roles from your database
    // const isAdmin = await checkUserRole(userId)
    // if (!isAdmin) {
    //   return NextResponse.redirect(new URL('/', req.url))
    // }
  }

  return NextResponse.next()
}

// Conditional export: bypass Clerk when SKIP_AUTH=true
const skipAuth = process.env.SKIP_AUTH === 'true'

export default skipAuth
  ? (async (req: any) => await adminMiddlewareHandler(null, req))
  : clerkMiddleware(adminMiddlewareHandler)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Match admin routes
    '/admin(.*)',
  ],
}