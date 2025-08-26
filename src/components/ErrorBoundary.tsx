'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetKeys?: Array<unknown>
  resetOnPropsChange?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  eventId: string | null
}

class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: NodeJS.Timeout | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const eventId = this.captureException(error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
      eventId
    })

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props
    const { hasError } = this.state

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.some((key, idx) => prevProps.resetKeys?.[idx] !== key)) {
        this.resetError()
      }
    }

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetError()
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    })
  }

  captureException = (error: Error, errorInfo: ErrorInfo): string => {
    // Log error details
    const errorDetails = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
    }

    console.error('Error Boundary caught an error:', errorDetails)

    // In production, send to monitoring service (Sentry, LogRocket, etc.)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error monitoring service
      // Sentry.captureException(error, { contexts: { errorBoundary: errorInfo } })
    }

    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorFallback
          error={this.state.error}
          resetError={this.resetError}
          eventId={this.state.eventId}
        />
      )
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error: Error | null
  resetError: () => void
  eventId: string | null
}

function ErrorFallback({ error, resetError, eventId }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-red-600 flex items-center justify-center gap-2">
            <svg 
              className="h-6 w-6" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Algo salió mal
          </CardTitle>
          <CardDescription>
            Lo sentimos, se produjo un error inesperado. Nuestro equipo ha sido notificado.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isDevelopment && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Error Details (Development Only)</h4>
              <p className="text-sm text-red-700 mb-2">
                <strong>Message:</strong> {error.message}
              </p>
              {error.stack && (
                <pre className="text-xs text-red-600 bg-white p-2 rounded overflow-auto max-h-40">
                  {error.stack}
                </pre>
              )}
            </div>
          )}

          {eventId && (
            <div className="text-sm text-gray-600">
              <strong>Error ID:</strong> {eventId}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={resetError}
              className="flex-1"
            >
              Intentar nuevamente
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              Volver al inicio
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Si el problema persiste, contacta al soporte técnico
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Specialized error boundaries for different contexts

export function ConvexErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // More detailed error logging for Convex-specific errors
        console.error('Convex Error Boundary caught an error:', {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack
          },
          errorInfo,
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.href : 'server-side'
        })
      }}
      fallback={
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Error de conexión
          </h3>
          <p className="text-gray-600 mb-4">
            No se pudo conectar con la base de datos. Por favor, recarga la página.
          </p>
          <Button onClick={() => window.location.reload()}>
            Recargar página
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export function CartErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Cart Error:', { error, errorInfo })
      }}
      fallback={
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Error en el carrito
          </h3>
          <p className="text-gray-600 mb-4">
            Hubo un problema con tu carrito de compras. Los productos se han guardado.
          </p>
          <Button onClick={() => window.location.href = '/cart'}>
            Ver carrito
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export function AuthErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Auth Error:', { error, errorInfo })
      }}
      fallback={
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Error de autenticación
          </h3>
          <p className="text-gray-600 mb-4">
            Hubo un problema con tu sesión. Por favor, inicia sesión nuevamente.
          </p>
          <Button onClick={() => window.location.href = '/sign-in'}>
            Iniciar sesión
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary