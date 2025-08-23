'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useColorSystem } from '@/components/ColorSystemProvider'

interface ThemeToggleProps {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ThemeToggle({
  variant = 'ghost',
  size = 'sm',
  className
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const { mode, toggleMode } = useColorSystem()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled
      >
        <div className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleMode}
      className={className}
      title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
    >
      {mode === 'light' ? (
        <Moon className="h-4 w-4 transition-transform duration-200" />
      ) : (
        <Sun className="h-4 w-4 transition-transform duration-200" />
      )}
      <span className="sr-only">
        Toggle theme ({mode === 'light' ? 'dark' : 'light'})
      </span>
    </Button>
  )
}

// Alternative theme toggle with labels
export function LabeledThemeToggle({
  className
}: {
  className?: string
}) {
  const { mode, toggleMode } = useColorSystem()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        className={className}
        disabled
      >
        Loading...
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={toggleMode}
      className={className}
    >
      {mode === 'light' ? (
        <>
          <Moon className="h-4 w-4 mr-2" />
          Dark Mode
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 mr-2" />
          Light Mode
        </>
      )}
    </Button>
  )
}