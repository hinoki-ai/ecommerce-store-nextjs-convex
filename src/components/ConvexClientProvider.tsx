'use client'

import { ReactNode } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProvider } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth } from '@clerk/nextjs'

// Initialize Convex client at module level (matches successful parking project pattern)
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || ''
const convex = new ConvexReactClient(convexUrl)

export default function ConvexClientProvider({ 
  children, 
  useClerk = true 
}: { 
  children: ReactNode
  useClerk?: boolean 
}) {
  // Simplified pattern matching successful parking project - no complex auth skipping
  if (useClerk) {
    return (
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    )
  }

  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  )
}