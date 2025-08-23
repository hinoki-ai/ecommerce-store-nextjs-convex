'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { colorTokens, semanticColors, generateCSSVariables } from '@/lib/colors'
import type { ColorSystemContextValue, ColorMode } from '@/lib/color-types'

interface EnhancedColorSystemContextValue extends ColorSystemContextValue {
  // Enhanced theme management
  systemPreference: ColorMode | 'system'
  setSystemPreference: (preference: ColorMode | 'system') => void
  // CSS variables for direct use
  cssVariables: Record<string, string>
  // Theme utilities
  isSystemTheme: boolean
  // Color manipulation helpers
  getAdjustedColor: (token: string, adjustments: {
    lightness?: number
    chroma?: number
    hue?: number
  }) => string
}

const ColorSystemContext = React.createContext<EnhancedColorSystemContextValue | undefined>(undefined)

interface ColorSystemProviderProps {
  children: React.ReactNode
  defaultMode?: ColorMode
  enableSystemPreference?: boolean
}

export function ColorSystemProvider({
  children,
  defaultMode = 'light',
  enableSystemPreference = true
}: ColorSystemProviderProps) {
  const { theme, setTheme, systemTheme } = useTheme()
  const [systemPreference, setSystemPreference] = React.useState<ColorMode | 'system'>('system')

  // Determine the actual mode based on theme and system preference
  const actualMode = React.useMemo((): ColorMode => {
    if (!enableSystemPreference || systemPreference === 'system') {
      if (theme === 'system') {
        return (systemTheme as ColorMode) || defaultMode
      }
      return (theme as ColorMode) || defaultMode
    }
    return systemPreference
  }, [theme, systemTheme, systemPreference, defaultMode, enableSystemPreference])

  // Generate CSS variables for the current mode
  const cssVariables = React.useMemo(() => {
    return generateCSSVariables(actualMode)
  }, [actualMode])

  // Apply CSS variables to document root
  React.useEffect(() => {
    const root = document.documentElement

    // Set theme attribute for CSS selectors
    root.setAttribute('data-theme', actualMode)

    // Add or remove dark class
    if (actualMode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Apply CSS variables
    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', actualMode === 'dark' ? '#0f172a' : '#ffffff')
    }
  }, [cssVariables, actualMode])

  const contextValue = React.useMemo<EnhancedColorSystemContextValue>(() => ({
    mode: actualMode,
    colors: colorTokens[actualMode],
    semanticColors,
    setMode: (newMode: ColorMode) => {
      setSystemPreference(newMode)
      setTheme(newMode)
    },
    toggleMode: () => {
      const newMode = actualMode === 'light' ? 'dark' : 'light'
      setSystemPreference(newMode)
      setTheme(newMode)
    },
    // Enhanced properties
    systemPreference,
    setSystemPreference,
    cssVariables,
    isSystemTheme: enableSystemPreference && systemPreference === 'system',
    getAdjustedColor: (token: string, adjustments: {
      lightness?: number
      chroma?: number
      hue?: number
    }) => {
      const baseColor = colorTokens[actualMode][token as keyof typeof colorTokens.light]
      if (!baseColor) return baseColor

      let adjustedColor = baseColor

      if (adjustments.lightness !== undefined) {
        const match = adjustedColor.match(/oklch\(([^)]+)\)/)
        if (match) {
          const values = match[1].split(' ')
          const lightness = Math.max(0, Math.min(1, parseFloat(values[0]) + adjustments.lightness))
          adjustedColor = `oklch(${lightness} ${values[1]} ${values[2]})`
        }
      }

      if (adjustments.chroma !== undefined) {
        const match = adjustedColor.match(/oklch\(([^)]+)\)/)
        if (match) {
          const values = match[1].split(' ')
          const chroma = Math.max(0, parseFloat(values[1]) + adjustments.chroma)
          adjustedColor = `oklch(${values[0]} ${chroma} ${values[2]})`
        }
      }

      if (adjustments.hue !== undefined) {
        const match = adjustedColor.match(/oklch\(([^)]+)\)/)
        if (match) {
          const values = match[1].split(' ')
          const hue = (parseFloat(values[2]) + adjustments.hue) % 360
          adjustedColor = `oklch(${values[0]} ${values[1]} ${hue})`
        }
      }

      return adjustedColor
    },
  }), [actualMode, cssVariables, systemPreference, setTheme, enableSystemPreference])

  return (
    <ColorSystemContext.Provider value={contextValue}>
      {children}
    </ColorSystemContext.Provider>
  )
}

export function useColorSystem() {
  const context = React.useContext(ColorSystemContext)
  if (context === undefined) {
    throw new Error('useColorSystem must be used within a ColorSystemProvider')
  }
  return context
}

// Enhanced hook for easy color access with theme awareness
export function useColors() {
  const {
    colors,
    mode,
    cssVariables,
    getAdjustedColor,
    systemPreference,
    isSystemTheme
  } = useColorSystem()

  return {
    colors,
    mode,
    cssVariables,
    systemPreference,
    isSystemTheme,
    // Helper to get CSS custom property name
    getCssVariable: (token: keyof typeof colors) => `var(--${token})`,
    // Helper to get color with opacity
    getColorWithOpacity: (token: keyof typeof colors, opacity: number) => {
      const colorValue = colors[token]
      // Convert OKLCH to color with opacity
      return colorValue.replace(')', ` / ${opacity})`).replace('oklch(', 'oklch(')
    },
    // Enhanced color manipulation
    lighten: (token: keyof typeof colors, amount: number = 0.1) =>
      getAdjustedColor(token as string, { lightness: amount }),
    darken: (token: keyof typeof colors, amount: number = 0.1) =>
      getAdjustedColor(token as string, { lightness: -amount }),
    saturate: (token: keyof typeof colors, amount: number = 0.05) =>
      getAdjustedColor(token as string, { chroma: amount }),
    desaturate: (token: keyof typeof colors, amount: number = 0.05) =>
      getAdjustedColor(token as string, { chroma: -amount }),
    rotateHue: (token: keyof typeof colors, degrees: number) =>
      getAdjustedColor(token as string, { hue: degrees }),
    // Utility to get theme-aware colors
    getThemeAwareColor: (lightColor: string, darkColor?: string) => {
      return mode === 'dark' ? (darkColor || lightColor) : lightColor
    },
  }
}

// Hook for responsive color adjustments
export function useResponsiveColors() {
  const { mode, getAdjustedColor } = useColorSystem()

  return {
    // Adjust colors based on screen size or other conditions
    getResponsiveColor: (baseToken: string, options: {
      mobile?: { lightness?: number; chroma?: number }
      tablet?: { lightness?: number; chroma?: number }
      desktop?: { lightness?: number; chroma?: number }
    }) => {
      // In a real implementation, you'd check screen size
      // For now, return base color
      return colorTokens[mode][baseToken as keyof typeof colorTokens.light]
    },
  }
}