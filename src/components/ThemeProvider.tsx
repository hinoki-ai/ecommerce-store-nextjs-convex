'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'
import { ColorSystemProvider } from './ColorSystemProvider'

interface ExtendedThemeProviderProps extends Omit<ThemeProviderProps, 'children'> {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  themes = ['light', 'dark'],
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ExtendedThemeProviderProps) {
  return (
    <NextThemesProvider
      defaultTheme={defaultTheme}
      themes={themes}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      attribute="class"
      storageKey="konbini-theme"
      {...props}
    >
      <ColorSystemProvider>
        {children}
      </ColorSystemProvider>
    </NextThemesProvider>
  )
}