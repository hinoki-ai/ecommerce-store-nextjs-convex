'use client'

import { ReactNode } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexProvider } from 'convex/react'
import { useAuth } from '@clerk/nextjs'
import { ConvexErrorBoundary } from './ErrorBoundary'

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  // Check if we should skip authentication (for development/testing)
  const skipAuth = process.env.SKIP_AUTH === 'true'

  if (skipAuth) {
    // Use regular ConvexProvider without authentication
    return (
      <ConvexErrorBoundary>
        <ConvexProvider client={convex}>
          {children}
        </ConvexProvider>
      </ConvexErrorBoundary>
    )
  }

  // Normal mode with Clerk authentication
  return (
    <ConvexErrorBoundary>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ConvexErrorBoundary>
  )
}