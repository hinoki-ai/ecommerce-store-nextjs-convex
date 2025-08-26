'use client'

import { ReactNode } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProvider } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth } from '@clerk/nextjs'
import { ConvexErrorBoundary } from './ErrorBoundary'

// Initialize Convex client at module level like ParkingLot
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || ''
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null

// Function to check if we should skip authentication
const shouldSkipAuth = () => {
  // During build time or when explicitly disabled
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    return true // Skip during SSG/build
  }
  
  if (typeof window === 'undefined') {
    // Server-side: check process.env
    return process.env.SKIP_AUTH === 'true' || process.env.NEXT_PUBLIC_SKIP_AUTH === 'true'
  }
  // Client-side: check runtime env vars
  return process.env.NEXT_PUBLIC_SKIP_AUTH === 'true'
}

export default function ConvexClientProvider({ 
  children, 
  useClerk = true 
}: { 
  children: ReactNode
  useClerk?: boolean 
}) {
  const skipAuth = shouldSkipAuth()

  // If we should skip auth, just return children in error boundary
  if (skipAuth) {
    return (
      <ConvexErrorBoundary>
        {children}
      </ConvexErrorBoundary>
    )
  }

  // If no convex client available, return children in error boundary
  if (!convex) {
    console.warn('ConvexClientProvider: NEXT_PUBLIC_CONVEX_URL not configured, skipping Convex integration')
    return (
      <ConvexErrorBoundary>
        {children}
      </ConvexErrorBoundary>
    )
  }

  // Use Clerk integration if enabled
  if (useClerk) {
    return (
      <ConvexErrorBoundary>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ConvexErrorBoundary>
    )
  }

  // Use regular Convex provider without Clerk
  return (
    <ConvexErrorBoundary>
      <ConvexProvider client={convex}>
        {children}
      </ConvexProvider>
    </ConvexErrorBoundary>
  )
}