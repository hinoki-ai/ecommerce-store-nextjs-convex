'use client'

import { ReactNode } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexProvider } from 'convex/react'
import { useAuth } from '@clerk/nextjs'
import { ConvexErrorBoundary } from './ErrorBoundary'

// Check if we should skip authentication (for development/testing)
const skipAuth = process.env.SKIP_AUTH === 'true' || process.env.NEXT_PUBLIC_SKIP_AUTH === 'true'

// Only create Convex client if not skipping auth
let convex: ConvexReactClient | undefined
if (!skipAuth && process.env.NEXT_PUBLIC_CONVEX_URL) {
  convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)
} else if (!skipAuth) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (skipAuth) {
    // Skip Convex entirely for testing - just return children wrapped in error boundary
    return (
      <ConvexErrorBoundary>
        {children}
      </ConvexErrorBoundary>
    )
  }

  // useAuth must be called at the top level, not conditionally
  const auth = useAuth()

  if (!convex) {
    throw new Error('Convex client not initialized')
  }

  // Normal mode with Clerk authentication
  return (
    <ConvexErrorBoundary>
      <ConvexProviderWithClerk client={convex} useAuth={auth}>
        {children}
      </ConvexProviderWithClerk>
    </ConvexErrorBoundary>
  )
}