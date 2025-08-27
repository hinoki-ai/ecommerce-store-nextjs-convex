"use client"

import * as React from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  message?: string
  icon?: React.ReactNode
  onRetry?: () => void
  showHomeButton?: boolean
  variant?: "default" | "inline" | "page"
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error while loading this content. Please try again.",
  icon,
  onRetry,
  showHomeButton = false,
  variant = "default",
  className,
  ...props
}: ErrorStateProps) {
  const containerClasses = {
    default: "bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center",
    inline: "flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg",
    page: "flex flex-col items-center justify-center min-h-[400px] text-center p-8",
  }

  const iconElement = icon || <AlertTriangle className="h-8 w-8 text-destructive" />

  if (variant === "inline") {
    return (
      <div className={cn(containerClasses.inline, className)} {...props}>
        <div className="flex-shrink-0">
          {iconElement}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-destructive">{title}</h3>
          <p className="text-sm text-destructive/80">{message}</p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
      </div>
    )
  }

  if (variant === "page") {
    return (
      <div className={cn(containerClasses.page, className)} {...props}>
        <div className="max-w-md">
          <div className="mb-6">
            {iconElement}
          </div>
          <h1 className="text-2xl font-bold text-destructive mb-2">{title}</h1>
          <p className="text-muted-foreground mb-6">{message}</p>
          <div className="flex gap-3 justify-center">
            {onRetry && (
              <Button onClick={onRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            {showHomeButton && (
              <Button variant="outline" asChild>
                <a href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(containerClasses.default, className)} {...props}>
      <div className="mb-4">
        {iconElement}
      </div>
      <h3 className="font-medium text-destructive mb-2">{title}</h3>
      <p className="text-sm text-destructive/80 mb-4">{message}</p>
      <div className="flex gap-2 justify-center">
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
        {showHomeButton && (
          <Button variant="outline" size="sm" asChild>
            <a href="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}

export function ErrorMessage({ error, onRetry, className, ...props }: {
  error: Error | string
  onRetry?: () => void
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  const message = typeof error === 'string' ? error : error.message

  return (
    <ErrorState
      title="Error"
      message={message}
      onRetry={onRetry}
      variant="inline"
      className={className}
      {...props}
    />
  )
}