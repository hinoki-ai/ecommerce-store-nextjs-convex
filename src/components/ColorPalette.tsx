'use client'

import * as React from 'react'
import { useColorSystem } from '@/components/ColorSystemProvider'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ColorToken, SemanticColor } from '@/lib/color-types'

interface ColorSwatchProps {
  token: string
  value: string
  className?: string
}

function ColorSwatch({ token, value, className }: ColorSwatchProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch (err) {
      console.error('Failed to copy color:', err)
    }
  }

  return (
    <div
      className={cn(
        "group relative h-16 w-full rounded-md border cursor-pointer transition-all hover:scale-105",
        className
      )}
      style={{ backgroundColor: value }}
      onClick={copyToClipboard}
      title={`Click to copy: ${value}`}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-md">
        <span className="text-xs font-mono text-white drop-shadow-sm">
          {token}
        </span>
      </div>
      <div className="absolute bottom-1 left-1">
        <span className="text-xs font-mono text-white drop-shadow-sm">
          {value}
        </span>
      </div>
    </div>
  )
}

interface ColorSectionProps {
  title: string
  colors: Record<string, string>
  className?: string
}

function ColorSection({ title, colors, className }: ColorSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Object.entries(colors).map(([token, value]) => (
            <div key={token} className="space-y-2">
              <ColorSwatch token={token} value={value} />
              <div className="text-xs text-center text-muted-foreground">
                {token}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ColorPalette() {
  const { colors, semanticColors, mode } = useColorSystem()

  // Group colors by category
  const baseColors = {
    background: colors.background,
    foreground: colors.foreground,
    card: colors.card,
    'card-foreground': colors['card-foreground'],
    popover: colors.popover,
    'popover-foreground': colors['popover-foreground'],
  }

  const brandColors = {
    primary: colors.primary,
    'primary-foreground': colors['primary-foreground'],
    secondary: colors.secondary,
    'secondary-foreground': colors['secondary-foreground'],
    accent: colors.accent,
    'accent-foreground': colors['accent-foreground'],
    muted: colors.muted,
    'muted-foreground': colors['muted-foreground'],
  }

  const statusColors = {
    fresh: colors.fresh,
    'fresh-foreground': colors['fresh-foreground'],
    new: colors.new,
    'new-foreground': colors['new-foreground'],
    popular: colors.popular,
    'popular-foreground': colors['popular-foreground'],
    sale: colors.sale,
    'sale-foreground': colors['sale-foreground'],
  }

  const stockColors = {
    'in-stock': colors['in-stock'],
    'low-stock': colors['low-stock'],
    'out-stock': colors['out-stock'],
  }

  const semantic = {
    success: semanticColors.success[mode],
    'success-foreground': semanticColors.success.foreground[mode],
    warning: semanticColors.warning[mode],
    'warning-foreground': semanticColors.warning.foreground[mode],
    error: semanticColors.error[mode],
    'error-foreground': semanticColors.error.foreground[mode],
    info: semanticColors.info[mode],
    'info-foreground': semanticColors.info.foreground[mode],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Color System</h2>
        <Badge variant="secondary">
          {mode === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </Badge>
      </div>

      <div className="grid gap-6">
        <ColorSection
          title="Base Colors"
          colors={baseColors}
        />
        <ColorSection
          title="Brand Colors"
          colors={brandColors}
        />
        <ColorSection
          title="Status Colors"
          colors={statusColors}
        />
        <ColorSection
          title="Stock Colors"
          colors={stockColors}
        />
        <ColorSection
          title="Semantic Colors"
          colors={semantic}
        />
      </div>
    </div>
  )
}

// Compact version for documentation
export function CompactColorPalette() {
  const { colors } = useColorSystem()

  return (
    <div className="grid grid-cols-8 gap-2 p-4 border rounded-lg">
      {Object.entries(colors).slice(0, 16).map(([token, value]) => (
        <div key={token} className="space-y-1">
          <div
            className="h-8 w-full rounded border cursor-pointer transition-transform hover:scale-110"
            style={{ backgroundColor: value }}
            title={`${token}: ${value}`}
          />
          <div className="text-xs text-center truncate text-muted-foreground">
            {token}
          </div>
        </div>
      ))}
    </div>
  )
}