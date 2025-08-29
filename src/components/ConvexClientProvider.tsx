'use client'

import { ReactNode, useEffect, useState } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProvider } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth } from '@clerk/nextjs'
import AuthErrorBoundary from '@/lib/auth-error-boundary'

// Initialize Convex client at module level (matches successful parking project pattern)
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || ''

let convex: ConvexReactClient | null = null

// Initialize client safely
const initializeConvexClient = () => {
  if (!convex) {
    if (!convexUrl) {
      console.error('NEXT_PUBLIC_CONVEX_URL is not set')
      throw new Error('Convex URL is required')
    }
    
    try {
      convex = new ConvexReactClient(convexUrl)
      console.log('✅ Convex client initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Convex client:', error)
      throw error
    }
  }
  return convex
}

export default function ConvexClientProvider({ 
  children, 
  useClerk = true 
}: { 
  children: ReactNode
  useClerk?: boolean 
}) {
  const [client, setClient] = useState<ConvexReactClient | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const convexClient = initializeConvexClient()
      setClient(convexClient)
      setError(null)
    } catch (err) {
      console.error('Failed to initialize Convex:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }, [])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Error de Conexión a Base de Datos
          </h3>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Conectando a la base de datos...</p>
        </div>
      </div>
    )
  }

  // Simplified pattern matching successful parking project - no complex auth skipping
  if (useClerk) {
    return (
      <AuthErrorBoundary>
        <ConvexProviderWithClerk client={client} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </AuthErrorBoundary>
    )
  }

  return (
    <AuthErrorBoundary>
      <ConvexProvider client={client}>
        {children}
      </ConvexProvider>
    </AuthErrorBoundary>
  )
}