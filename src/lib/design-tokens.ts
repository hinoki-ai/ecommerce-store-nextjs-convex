/**
 * ΛRΛMΛC Design System Tokens
 * Standardized design tokens for consistent UX across the website
 */

// Spacing Scale (in rem)
export const spacing = {
  '0': '0',
  '1': '0.25rem',    // 4px
  '2': '0.5rem',     // 8px
  '3': '0.75rem',    // 12px
  '4': '1rem',       // 16px
  '5': '1.25rem',    // 20px
  '6': '1.5rem',     // 24px
  '8': '2rem',       // 32px
  '10': '2.5rem',    // 40px
  '12': '3rem',      // 48px
  '16': '4rem',      // 64px
  '20': '5rem',      // 80px
  '24': '6rem',      // 96px
  '32': '8rem',      // 128px
} as const;

// Typography Scale
export const typography = {
  // Font Sizes
  'xs': '0.75rem',   // 12px
  'sm': '0.875rem',  // 14px
  'base': '1rem',    // 16px
  'lg': '1.125rem',  // 18px
  'xl': '1.25rem',   // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
  '6xl': '3.75rem',  // 60px

  // Font Weights
  'thin': '100',
  'light': '300',
  'normal': '400',
  'medium': '500',
  'semibold': '600',
  'bold': '700',
  'extrabold': '800',
  'black': '900',

  // Line Heights
  'tight': '1.25',
  'snug': '1.375',
  'normal': '1.5',
  'relaxed': '1.625',
  'loose': '2',
} as const;

// Typography patterns for consistent text styling
export const textStyles = {
  // Headings
  h1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight',
  h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight',
  h3: 'text-lg sm:text-xl md:text-2xl font-semibold leading-snug',
  h4: 'text-base sm:text-lg md:text-xl font-semibold leading-snug',
  h5: 'text-sm sm:text-base md:text-lg font-medium leading-normal',
  h6: 'text-sm sm:text-base font-medium leading-normal',

  // Body text
  body: 'text-sm sm:text-base leading-relaxed',
  'body-sm': 'text-xs sm:text-sm leading-relaxed',
  'body-lg': 'text-base sm:text-lg leading-relaxed',

  // UI text
  caption: 'text-xs text-muted-foreground leading-normal',
  label: 'text-sm font-medium leading-none',
  button: 'text-sm font-medium leading-none',
  'button-sm': 'text-xs font-medium leading-none',
  'button-lg': 'text-base font-medium leading-none',

  // Special text
  quote: 'text-lg italic text-muted-foreground border-l-4 border-primary pl-4',
  code: 'font-mono text-sm bg-muted px-2 py-1 rounded',
  link: 'text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline',
} as const;

// Border Radius Scale
export const borderRadius = {
  'none': '0',
  'sm': '0.125rem',  // 2px
  'md': '0.375rem',  // 6px
  'lg': '0.5rem',    // 8px
  'xl': '0.75rem',   // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  'full': '9999px',
} as const;

// Shadow Scale
export const shadows = {
  'none': 'none',
  'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

// Z-Index Scale
export const zIndex = {
  '0': '0',
  '10': '10',
  '20': '20',
  '30': '30',
  '40': '40',
  '50': '50',
  'auto': 'auto',
} as const;

// Component-specific design tokens
export const componentTokens = {
  // Card
  card: {
    padding: spacing['6'],
    borderRadius: borderRadius['xl'],
    shadow: shadows['sm'],
  },

  // Button
  button: {
    height: {
      sm: '2.25rem',    // 36px
      default: '2.5rem', // 40px
      lg: '2.75rem',    // 44px
    },
    padding: {
      sm: `${spacing['2']} ${spacing['4']}`,
      default: `${spacing['2']} ${spacing['4']}`,
      lg: `${spacing['3']} ${spacing['8']}`,
    },
  },

  // Input
  input: {
    height: '2.5rem', // 40px
    padding: `${spacing['2']} ${spacing['4']}`,
    borderRadius: borderRadius['md'],
  },

  // Product Card
  productCard: {
    aspectRatio: 'square',
    borderRadius: borderRadius['lg'],
    hover: {
      transform: 'translateY(-4px)',
      shadow: shadows['lg'],
    },
  },

  // Navigation
  nav: {
    height: '4rem', // 64px
    item: {
      padding: `${spacing['2']} ${spacing['4']}`,
    },
  },

  // Modal/Dialog
  modal: {
    maxWidth: '32rem', // 512px
    padding: spacing['8'],
    borderRadius: borderRadius['xl'],
  },
} as const;

// Animation/Transition tokens
export const transitions = {
  fast: '150ms ease-in-out',
  normal: '250ms ease-in-out',
  slow: '350ms ease-in-out',
  bounce: '300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Responsive breakpoints (in px)
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Responsive design patterns
export const responsive = {
  // Container queries and responsive utilities
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',

  // Grid patterns for different screen sizes
  grid: {
    // Product grids
    products: {
      mobile: 'grid grid-cols-1 gap-4',
      tablet: 'md:grid-cols-2 md:gap-6',
      desktop: 'lg:grid-cols-3 xl:grid-cols-4',
    },

    // Feature grids
    features: {
      mobile: 'grid grid-cols-1 gap-8',
      tablet: 'md:grid-cols-2',
      desktop: 'lg:grid-cols-3',
    },

    // Navigation
    nav: {
      mobile: 'flex flex-col space-y-4 lg:hidden',
      desktop: 'hidden lg:flex lg:items-center lg:space-x-6',
    },
  },

  // Typography scaling
  text: {
    hero: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
    heading: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
    subheading: 'text-lg sm:text-xl md:text-2xl',
    body: 'text-sm sm:text-base',
    caption: 'text-xs sm:text-sm',
  },

  // Spacing patterns
  spacing: {
    section: 'py-8 sm:py-12 md:py-16 lg:py-20',
    card: 'p-4 sm:p-6 md:p-8',
    button: 'px-4 py-2 sm:px-6 sm:py-3',
  },

  // Flexbox patterns
  flex: {
    center: 'flex flex-col items-center justify-center text-center',
    between: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6',
    stack: 'flex flex-col gap-4 sm:gap-6 md:gap-8',
  },
} as const;

// Grid system
export const grid = {
  cols: {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  },
  gap: {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
  },
} as const;

// Layout utilities for consistent page structure
export const layout = {
  // Container max widths
  container: {
    sm: 'max-w-sm',   // 384px
    md: 'max-w-md',   // 448px
    lg: 'max-w-lg',   // 512px
    xl: 'max-w-xl',   // 576px
    '2xl': 'max-w-2xl', // 672px
    '3xl': 'max-w-3xl', // 768px
    '4xl': 'max-w-4xl', // 896px
    '5xl': 'max-w-5xl', // 1024px
    '6xl': 'max-w-6xl', // 1152px
    '7xl': 'max-w-7xl', // 1280px
    full: 'max-w-full',
  },

  // Section spacing
  section: {
    padding: {
      sm: 'py-8',      // 32px
      md: 'py-12',     // 48px
      lg: 'py-16',     // 64px
      xl: 'py-20',     // 80px
      '2xl': 'py-24',  // 96px
    },
  },

  // Page structure
  page: {
    header: 'sticky top-0 z-50',
    footer: 'border-t',
    main: 'flex-1',
  },
} as const

// Utility functions for consistent application
export const createComponentClasses = {
  // Button utilities
  button: (variant: 'primary' | 'secondary' | 'outline' | 'ghost', size: 'sm' | 'default' | 'lg' = 'default') => {
    const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
    const variantClasses = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    }
    const sizeClasses = {
      sm: 'h-9 rounded-md px-3 text-sm',
      default: 'h-10 px-4 py-2 text-sm',
      lg: 'h-11 rounded-md px-8 text-base',
    }

    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`
  },

  // Card utilities
  card: (interactive: boolean = false) => {
    const baseClasses = 'bg-card text-card-foreground border rounded-lg'
    const interactiveClasses = interactive ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''

    return `${baseClasses} ${interactiveClasses}`.trim()
  },

  // Product card utilities
  productCard: (viewMode: 'grid' | 'list' = 'grid') => {
    const baseClasses = 'group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
    const viewClasses = viewMode === 'list'
      ? 'product-card-list'
      : 'product-card'

    return `${baseClasses} ${viewClasses}`
  },

  // Interactive elements
  interactive: {
    // Hover effects
    card: 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer',
    button: 'transition-all duration-200 hover:scale-105 active:scale-95',
    link: 'transition-colors duration-200 hover:text-primary',

    // Focus states
    focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

    // Loading states
    loading: 'animate-pulse opacity-60 cursor-not-allowed',

    // Disabled states
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
  },

  // Animation patterns
  animation: {
    fadeIn: 'animate-in fade-in duration-300',
    slideUp: 'animate-in slide-in-from-bottom-4 duration-300',
    scale: 'transition-transform duration-200 hover:scale-105',
    bounce: 'animate-bounce',
    spin: 'animate-spin',
  },

  // State patterns for consistent UX
  states: {
    // Loading states
    loading: {
      skeleton: 'animate-pulse bg-muted rounded',
      spinner: 'animate-spin rounded-full border-2 border-muted border-t-primary',
      overlay: 'absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50',
    },

    // Error states
    error: {
      container: 'bg-destructive/10 border border-destructive/20 rounded-lg p-4',
      icon: 'text-destructive',
      message: 'text-destructive text-sm',
      title: 'text-destructive font-medium',
    },

    // Success states
    success: {
      container: 'bg-success/10 border border-success/20 rounded-lg p-4',
      icon: 'text-success',
      message: 'text-success text-sm',
      title: 'text-success font-medium',
    },

    // Warning states
    warning: {
      container: 'bg-warning/10 border border-warning/20 rounded-lg p-4',
      icon: 'text-warning',
      message: 'text-warning text-sm',
      title: 'text-warning font-medium',
    },

    // Empty states
    empty: {
      container: 'flex flex-col items-center justify-center py-12 px-4 text-center',
      icon: 'text-muted-foreground mb-4',
      title: 'text-muted-foreground font-medium mb-2',
      message: 'text-muted-foreground text-sm',
      action: 'mt-6',
    },

    // Disabled states
    disabled: {
      button: 'opacity-50 cursor-not-allowed pointer-events-none',
      input: 'bg-muted cursor-not-allowed opacity-50',
      text: 'text-muted-foreground cursor-not-allowed',
    },
  },
} as const

export type SpacingToken = keyof typeof spacing
export type TypographyToken = keyof typeof typography
export type BorderRadiusToken = keyof typeof borderRadius
export type ShadowToken = keyof typeof shadows
export type ZIndexToken = keyof typeof zIndex