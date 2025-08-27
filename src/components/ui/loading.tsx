"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg"
  variant?: "spinner" | "dots" | "pulse"
}

export function Loading({ className, size = "default", variant = "spinner", ...props }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  }

  if (variant === "spinner") {
    return (
      <Loader2
        className={cn("animate-spin", sizeClasses[size], className)}
        {...props}
      />
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex space-x-1", className)} {...props}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "h-2 w-2 rounded-full bg-current animate-bounce",
              size === "sm" && "h-1 w-1",
              size === "lg" && "h-3 w-3"
            )}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("animate-pulse", className)} {...props}>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  return null
}

export function LoadingOverlay({ children, loading, className, ...props }: {
  children: React.ReactNode
  loading: boolean
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Loading size="lg" />
        </div>
      )}
    </div>
  )
}

export function LoadingCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 space-y-3", className)} {...props}>
      <div className="animate-pulse">
        <div className="h-48 bg-muted rounded-lg mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-6 bg-muted rounded w-1/4"></div>
        </div>
      </div>
    </div>
  )
}