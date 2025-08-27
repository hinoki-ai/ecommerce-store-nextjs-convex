"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  message?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "compact" | "card"
}

export function EmptyState({
  title = "No items found",
  message = "There are no items to display at the moment.",
  icon,
  action,
  variant = "default",
  className,
  ...props
}: EmptyStateProps) {
  const containerClasses = {
    default: "flex flex-col items-center justify-center py-12 px-4 text-center",
    compact: "flex flex-col items-center justify-center py-8 px-4 text-center",
    card: "flex flex-col items-center justify-center py-12 px-6 text-center bg-card border rounded-lg",
  }

  const iconClasses = {
    default: "text-muted-foreground mb-4",
    compact: "text-muted-foreground mb-2",
    card: "text-muted-foreground mb-4",
  }

  const titleClasses = {
    default: "text-muted-foreground font-medium mb-2",
    compact: "text-muted-foreground font-medium mb-1",
    card: "text-muted-foreground font-medium mb-2",
  }

  const messageClasses = {
    default: "text-muted-foreground text-sm",
    compact: "text-muted-foreground text-xs",
    card: "text-muted-foreground text-sm",
  }

  const actionClasses = {
    default: "mt-6",
    compact: "mt-4",
    card: "mt-6",
  }

  return (
    <div className={cn(containerClasses[variant], className)} {...props}>
      {icon && (
        <div className={cn(iconClasses[variant])}>
          {icon}
        </div>
      )}
      <h3 className={cn(titleClasses[variant])}>
        {title}
      </h3>
      <p className={cn(messageClasses[variant])}>
        {message}
      </p>
      {action && (
        <div className={cn(actionClasses[variant])}>
          {action}
        </div>
      )}
    </div>
  )
}

// Common empty state patterns
export function EmptyProducts({ onBrowse, className, ...props }: {
  onBrowse?: () => void
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <EmptyState
      title="No products found"
      message="We couldn't find any products matching your criteria."
      icon={
        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" />
        </svg>
      }
      action={onBrowse && (
        <Button onClick={onBrowse}>
          Browse Products
        </Button>
      )}
      className={className}
      {...props}
    />
  )
}

export function EmptyCart({ onContinue, className, ...props }: {
  onContinue?: () => void
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <EmptyState
      title="Your cart is empty"
      message="Add some products to get started with your shopping."
      icon={
        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1 5m1-5h10m-10 0V9m10 4v5m0-5l1-5m-1 5H7m10 0a2 2 0 11-4 0m-6 0a2 2 0 11-4 0" />
        </svg>
      }
      action={onContinue && (
        <Button onClick={onContinue}>
          Continue Shopping
        </Button>
      )}
      className={className}
      {...props}
    />
  )
}

export function EmptyWishlist({ onBrowse, className, ...props }: {
  onBrowse?: () => void
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <EmptyState
      title="Your wishlist is empty"
      message="Save items you love to your wishlist for later."
      icon={
        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      }
      action={onBrowse && (
        <Button onClick={onBrowse}>
          Browse Products
        </Button>
      )}
      className={className}
      {...props}
    />
  )
}