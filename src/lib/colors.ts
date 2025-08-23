/**
 * Aramac Branfing Color Token System
 * Comprehensive design system with semantic color tokens
 * Supports both light and dark modes with proper contrast ratios
 * Using OKLCH color space for better color manipulation and accessibility
 */

// Base color tokens - Aramac Branfing palette
export const colorTokens = {
  // Light mode color palette - Aramac Branfing
  light: {
    // Base system colors
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.145 0 0)',
    card: 'oklch(1 0 0)',
    'card-foreground': 'oklch(0.145 0 0)',
    popover: 'oklch(1 0 0)',
    'popover-foreground': 'oklch(0.145 0 0)',
    modal: 'oklch(1 0 0)',
    'modal-foreground': 'oklch(0.145 0 0)',
    sheet: 'oklch(1 0 0)',
    'sheet-foreground': 'oklch(0.145 0 0)',

    // Primary brand colors - Aramac Branfing brand colors
    primary: 'oklch(0.55 0.15 240)',
    'primary-foreground': 'oklch(0.99 0 0)',
    'primary-hover': 'oklch(0.6 0.15 240)',
    'primary-active': 'oklch(0.5 0.15 240)',
    'primary-light': 'oklch(0.92 0.08 240)',
    'primary-lighter': 'oklch(0.96 0.04 240)',

    // Secondary colors
    secondary: 'oklch(0.97 0 0)',
    'secondary-foreground': 'oklch(0.18 0 0)',
    'secondary-hover': 'oklch(0.94 0 0)',
    'secondary-active': 'oklch(0.9 0 0)',

    // Neutral colors
    muted: 'oklch(0.97 0 0)',
    'muted-foreground': 'oklch(0.32 0 0)',
    accent: 'oklch(0.97 0 0)',
    'accent-foreground': 'oklch(0.14 0 0)',
    'accent-hover': 'oklch(0.94 0 0)',

    // Surface colors
    surface: 'oklch(0.99 0 0)',
    'surface-foreground': 'oklch(0.2 0 0)',
    'surface-hover': 'oklch(0.96 0 0)',
    'surface-active': 'oklch(0.93 0 0)',

    // Product status colors
    fresh: 'oklch(0.65 0.15 145)',
    'fresh-foreground': 'oklch(0.985 0 0)',
    new: 'oklch(0.55 0.2 25)',
    'new-foreground': 'oklch(0.985 0 0)',
    popular: 'oklch(0.45 0.2 345)',
    'popular-foreground': 'oklch(0.985 0 0)',
    sale: 'oklch(0.6 0.25 60)',
    'sale-foreground': 'oklch(0.145 0 0)',
    featured: 'oklch(0.7 0.15 280)',
    'featured-foreground': 'oklch(0.145 0 0)',
    limited: 'oklch(0.75 0.2 45)',
    'limited-foreground': 'oklch(0.145 0 0)',

    // Stock status colors
    'in-stock': 'oklch(0.65 0.15 145)',
    'low-stock': 'oklch(0.6 0.25 60)',
    'out-stock': 'oklch(0.55 0.2 25)',
    'back-order': 'oklch(0.7 0.1 280)',
    'pre-order': 'oklch(0.65 0.15 240)',

    // Interactive colors
    destructive: 'oklch(0.577 0.245 27.325)',
    'destructive-foreground': 'oklch(0.985 0 0)',
    'destructive-hover': 'oklch(0.62 0.245 27.325)',
    'destructive-active': 'oklch(0.54 0.245 27.325)',
    warning: 'oklch(0.6 0.25 60)',
    'warning-foreground': 'oklch(0.145 0 0)',
    success: 'oklch(0.65 0.15 145)',
    'success-foreground': 'oklch(0.985 0 0)',

    // Border and input colors
    border: 'oklch(0.922 0 0)',
    'border-hover': 'oklch(0.85 0 0)',
    'border-focus': 'oklch(0.55 0.15 240)',
    input: 'oklch(0.922 0 0)',
    'input-hover': 'oklch(0.96 0 0)',
    'input-focus': 'oklch(0.99 0 0)',
    ring: 'oklch(0.708 0 0)',
    'ring-focus': 'oklch(0.55 0.15 240)',

    // Grid and layout colors
    'bento-primary': 'oklch(0.26 0.15 240)',
    'bento-secondary': 'oklch(0.65 0.15 145)',
    'bento-accent': 'oklch(0.55 0.2 25)',
    'bento-muted': 'oklch(0.97 0 0)',

    // Chart colors - Extended palette
    'chart-1': 'oklch(0.81 0.1 252)',
    'chart-2': 'oklch(0.62 0.19 260)',
    'chart-3': 'oklch(0.55 0.22 263)',
    'chart-4': 'oklch(0.49 0.22 264)',
    'chart-5': 'oklch(0.42 0.18 266)',
    'chart-6': 'oklch(0.35 0.15 268)',
    'chart-7': 'oklch(0.28 0.12 270)',
    'chart-8': 'oklch(0.21 0.1 272)',

    // Navigation colors
    sidebar: 'oklch(0.985 0 0)',
    'sidebar-foreground': 'oklch(0.145 0 0)',
    'sidebar-primary': 'oklch(0.205 0 0)',
    'sidebar-primary-foreground': 'oklch(0.985 0 0)',
    'sidebar-accent': 'oklch(0.94 0 0)',
    'sidebar-accent-foreground': 'oklch(0.205 0 0)',
    'sidebar-border': 'oklch(0.922 0 0)',
    'sidebar-ring': 'oklch(0.708 0 0)',

    // Enhanced shadow system
    'shadow-color': 'oklch(0 0 0)',
    'shadow-2xs': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.05)',
    'shadow-xs': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.05)',
    'shadow-sm': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.1), 0 1px 2px -1px rgb(from var(--shadow-color) r g b / 0.1)',
    'shadow': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.1), 0 1px 2px -1px rgb(from var(--shadow-color) r g b / 0.1)',
    'shadow-md': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.1), 0 2px 4px -1px rgb(from var(--shadow-color) r g b / 0.1)',
    'shadow-lg': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.1), 0 4px 6px -1px rgb(from var(--shadow-color) r g b / 0.1)',
    'shadow-xl': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.1), 0 8px 10px -1px rgb(from var(--shadow-color) r g b / 0.1)',
    'shadow-2xl': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.1)',

    // Additional UI colors
    'code-background': 'oklch(0.98 0 0)',
    'code-foreground': 'oklch(0.25 0 0)',
    'code-border': 'oklch(0.9 0 0)',
    'blockquote-background': 'oklch(0.96 0 0)',
    'blockquote-border': 'oklch(0.85 0 0)',
    'table-header': 'oklch(0.96 0 0)',
    'table-row-hover': 'oklch(0.96 0 0)',
  },

  // Dark mode color palette - Enhanced for better contrast
  dark: {
    // Base system colors
    background: 'oklch(0.145 0 0)',
    foreground: 'oklch(0.985 0 0)',
    card: 'oklch(0.205 0 0)',
    'card-foreground': 'oklch(0.985 0 0)',
    popover: 'oklch(0.269 0 0)',
    'popover-foreground': 'oklch(0.985 0 0)',
    modal: 'oklch(0.205 0 0)',
    'modal-foreground': 'oklch(0.985 0 0)',
    sheet: 'oklch(0.205 0 0)',
    'sheet-foreground': 'oklch(0.985 0 0)',

    // Primary brand colors - enhanced for dark mode
    primary: 'oklch(0.75 0.15 240)',
    'primary-foreground': 'oklch(0.145 0 0)',
    'primary-hover': 'oklch(0.8 0.15 240)',
    'primary-active': 'oklch(0.7 0.15 240)',
    'primary-light': 'oklch(0.35 0.15 240)',
    'primary-lighter': 'oklch(0.25 0.12 240)',

    // Secondary colors
    secondary: 'oklch(0.269 0 0)',
    'secondary-foreground': 'oklch(0.985 0 0)',
    'secondary-hover': 'oklch(0.32 0 0)',
    'secondary-active': 'oklch(0.35 0 0)',

    // Neutral colors
    muted: 'oklch(0.269 0 0)',
    'muted-foreground': 'oklch(0.653 0 0)',
    accent: 'oklch(0.269 0 0)',
    'accent-foreground': 'oklch(0.985 0 0)',
    'accent-hover': 'oklch(0.32 0 0)',

    // Surface colors
    surface: 'oklch(0.18 0 0)',
    'surface-foreground': 'oklch(0.92 0 0)',
    'surface-hover': 'oklch(0.22 0 0)',
    'surface-active': 'oklch(0.25 0 0)',

    // Product status colors for dark mode
    fresh: 'oklch(0.75 0.15 145)',
    'fresh-foreground': 'oklch(0.145 0 0)',
    new: 'oklch(0.65 0.2 25)',
    'new-foreground': 'oklch(0.145 0 0)',
    popular: 'oklch(0.65 0.2 345)',
    'popular-foreground': 'oklch(0.145 0 0)',
    sale: 'oklch(0.75 0.25 60)',
    'sale-foreground': 'oklch(0.145 0 0)',
    featured: 'oklch(0.8 0.15 280)',
    'featured-foreground': 'oklch(0.145 0 0)',
    limited: 'oklch(0.85 0.2 45)',
    'limited-foreground': 'oklch(0.145 0 0)',

    // Stock status colors for dark mode
    'in-stock': 'oklch(0.75 0.15 145)',
    'low-stock': 'oklch(0.75 0.25 60)',
    'out-stock': 'oklch(0.65 0.2 25)',
    'back-order': 'oklch(0.8 0.1 280)',
    'pre-order': 'oklch(0.75 0.15 240)',

    // Interactive colors
    destructive: 'oklch(0.65 0.245 27.325)',
    'destructive-foreground': 'oklch(0.145 0 0)',
    'destructive-hover': 'oklch(0.7 0.245 27.325)',
    'destructive-active': 'oklch(0.6 0.245 27.325)',
    warning: 'oklch(0.75 0.25 60)',
    'warning-foreground': 'oklch(0.145 0 0)',
    success: 'oklch(0.75 0.15 145)',
    'success-foreground': 'oklch(0.145 0 0)',

    // Border and input colors
    border: 'oklch(0.269 0 0)',
    'border-hover': 'oklch(0.35 0 0)',
    'border-focus': 'oklch(0.75 0.15 240)',
    input: 'oklch(0.269 0 0)',
    'input-hover': 'oklch(0.32 0 0)',
    'input-focus': 'oklch(0.35 0 0)',
    ring: 'oklch(0.85 0 0)',
    'ring-focus': 'oklch(0.75 0.15 240)',

    // Grid and layout colors
    'bento-primary': 'oklch(0.35 0.15 240)',
    'bento-secondary': 'oklch(0.75 0.15 145)',
    'bento-accent': 'oklch(0.65 0.2 25)',
    'bento-muted': 'oklch(0.269 0 0)',

    // Chart colors - Enhanced for dark mode
    'chart-1': 'oklch(0.85 0.1 252)',
    'chart-2': 'oklch(0.72 0.19 260)',
    'chart-3': 'oklch(0.65 0.22 263)',
    'chart-4': 'oklch(0.59 0.22 264)',
    'chart-5': 'oklch(0.52 0.18 266)',
    'chart-6': 'oklch(0.45 0.15 268)',
    'chart-7': 'oklch(0.38 0.12 270)',
    'chart-8': 'oklch(0.31 0.1 272)',

    // Navigation colors
    sidebar: 'oklch(0.145 0 0)',
    'sidebar-foreground': 'oklch(0.985 0 0)',
    'sidebar-primary': 'oklch(0.755 0 0)',
    'sidebar-primary-foreground': 'oklch(0.145 0 0)',
    'sidebar-accent': 'oklch(0.269 0 0)',
    'sidebar-accent-foreground': 'oklch(0.985 0 0)',
    'sidebar-border': 'oklch(0.269 0 0)',
    'sidebar-ring': 'oklch(0.85 0 0)',

    // Enhanced shadow system for dark mode
    'shadow-color': 'oklch(0 0 0 / 0.3)',
    'shadow-2xs': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.15)',
    'shadow-xs': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.15)',
    'shadow-sm': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.2), 0 1px 2px -1px rgb(from var(--shadow-color) r g b / 0.2)',
    'shadow': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.2), 0 1px 2px -1px rgb(from var(--shadow-color) r g b / 0.2)',
    'shadow-md': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.2), 0 2px 4px -1px rgb(from var(--shadow-color) r g b / 0.2)',
    'shadow-lg': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.2), 0 4px 6px -1px rgb(from var(--shadow-color) r g b / 0.2)',
    'shadow-xl': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.2), 0 8px 10px -1px rgb(from var(--shadow-color) r g b / 0.2)',
    'shadow-2xl': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.2)',

    // Additional UI colors for dark mode
    'code-background': 'oklch(0.18 0 0)',
    'code-foreground': 'oklch(0.85 0 0)',
    'code-border': 'oklch(0.3 0 0)',
    'blockquote-background': 'oklch(0.22 0 0)',
    'blockquote-border': 'oklch(0.35 0 0)',
    'table-header': 'oklch(0.22 0 0)',
    'table-row-hover': 'oklch(0.18 0 0)',
  }
} as const;

// Semantic color tokens for better accessibility and consistency
export const semanticColors = {
  // Success states - enhanced
  success: {
    light: 'oklch(0.65 0.15 145)',
    dark: 'oklch(0.75 0.15 145)',
    foreground: {
      light: 'oklch(0.985 0 0)',
      dark: 'oklch(0.145 0 0)'
    },
    hover: {
      light: 'oklch(0.7 0.15 145)',
      dark: 'oklch(0.8 0.15 145)'
    },
    active: {
      light: 'oklch(0.6 0.15 145)',
      dark: 'oklch(0.7 0.15 145)'
    }
  },

  // Warning states - enhanced
  warning: {
    light: 'oklch(0.6 0.25 60)',
    dark: 'oklch(0.75 0.25 60)',
    foreground: {
      light: 'oklch(0.145 0 0)',
      dark: 'oklch(0.145 0 0)'
    },
    hover: {
      light: 'oklch(0.65 0.25 60)',
      dark: 'oklch(0.8 0.25 60)'
    },
    active: {
      light: 'oklch(0.55 0.25 60)',
      dark: 'oklch(0.7 0.25 60)'
    }
  },

  // Error states - enhanced
  error: {
    light: 'oklch(0.577 0.245 27.325)',
    dark: 'oklch(0.65 0.245 27.325)',
    foreground: {
      light: 'oklch(0.985 0 0)',
      dark: 'oklch(0.145 0 0)'
    },
    hover: {
      light: 'oklch(0.62 0.245 27.325)',
      dark: 'oklch(0.7 0.245 27.325)'
    },
    active: {
      light: 'oklch(0.54 0.245 27.325)',
      dark: 'oklch(0.6 0.245 27.325)'
    }
  },

  // Info states - enhanced
  info: {
    light: 'oklch(0.65 0.1 240)',
    dark: 'oklch(0.75 0.15 240)',
    foreground: {
      light: 'oklch(0.985 0 0)',
      dark: 'oklch(0.145 0 0)'
    },
    hover: {
      light: 'oklch(0.7 0.1 240)',
      dark: 'oklch(0.8 0.15 240)'
    },
    active: {
      light: 'oklch(0.6 0.1 240)',
      dark: 'oklch(0.7 0.15 240)'
    }
  },

  // Extended semantic colors
  neutral: {
    light: 'oklch(0.97 0 0)',
    dark: 'oklch(0.269 0 0)',
    foreground: {
      light: 'oklch(0.32 0 0)',
      dark: 'oklch(0.653 0 0)'
    },
    hover: {
      light: 'oklch(0.94 0 0)',
      dark: 'oklch(0.32 0 0)'
    },
    active: {
      light: 'oklch(0.9 0 0)',
      dark: 'oklch(0.35 0 0)'
    }
  },

  surface: {
    light: 'oklch(1 0 0)',
    dark: 'oklch(0.205 0 0)',
    foreground: {
      light: 'oklch(0.145 0 0)',
      dark: 'oklch(0.985 0 0)'
    },
    hover: {
      light: 'oklch(0.99 0 0)',
      dark: 'oklch(0.25 0 0)'
    },
    active: {
      light: 'oklch(0.96 0 0)',
      dark: 'oklch(0.28 0 0)'
    }
  },

  // Interactive states - enhanced
  hover: {
    light: 'oklch(0.94 0 0)',
    dark: 'oklch(0.269 0 0)',
    foreground: {
      light: 'oklch(0.205 0 0)',
      dark: 'oklch(0.985 0 0)'
    }
  },

  focus: {
    light: 'oklch(0.55 0.15 240)',
    dark: 'oklch(0.75 0.15 240)',
    foreground: {
      light: 'oklch(0.99 0 0)',
      dark: 'oklch(0.145 0 0)'
    }
  },

  active: {
    light: 'oklch(0.9 0 0)',
    dark: 'oklch(0.35 0 0)',
    foreground: {
      light: 'oklch(0.18 0 0)',
      dark: 'oklch(0.985 0 0)'
    }
  },

  // Feedback colors
  positive: {
    light: 'oklch(0.65 0.15 145)',
    dark: 'oklch(0.75 0.15 145)',
    foreground: {
      light: 'oklch(0.985 0 0)',
      dark: 'oklch(0.145 0 0)'
    },
    hover: {
      light: 'oklch(0.7 0.15 145)',
      dark: 'oklch(0.8 0.15 145)'
    },
    active: {
      light: 'oklch(0.6 0.15 145)',
      dark: 'oklch(0.7 0.15 145)'
    }
  },

  negative: {
    light: 'oklch(0.577 0.245 27.325)',
    dark: 'oklch(0.65 0.245 27.325)',
    foreground: {
      light: 'oklch(0.985 0 0)',
      dark: 'oklch(0.145 0 0)'
    },
    hover: {
      light: 'oklch(0.62 0.245 27.325)',
      dark: 'oklch(0.7 0.245 27.325)'
    },
    active: {
      light: 'oklch(0.54 0.245 27.325)',
      dark: 'oklch(0.6 0.245 27.325)'
    }
  },

  // Status indicators - enhanced
  pending: {
    light: 'oklch(0.6 0.25 60)',
    dark: 'oklch(0.75 0.25 60)',
    foreground: {
      light: 'oklch(0.145 0 0)',
      dark: 'oklch(0.145 0 0)'
    },
    hover: {
      light: 'oklch(0.65 0.25 60)',
      dark: 'oklch(0.8 0.25 60)'
    },
    active: {
      light: 'oklch(0.55 0.25 60)',
      dark: 'oklch(0.7 0.25 60)'
    }
  },

  processing: {
    light: 'oklch(0.55 0.2 25)',
    dark: 'oklch(0.65 0.2 25)',
    foreground: {
      light: 'oklch(0.985 0 0)',
      dark: 'oklch(0.145 0 0)'
    },
    hover: {
      light: 'oklch(0.6 0.2 25)',
      dark: 'oklch(0.7 0.2 25)'
    },
    active: {
      light: 'oklch(0.5 0.2 25)',
      dark: 'oklch(0.6 0.2 25)'
    }
  },

  // Additional e-commerce specific states
  onSale: {
    light: 'oklch(0.6 0.25 60)',
    dark: 'oklch(0.75 0.25 60)',
    foreground: {
      light: 'oklch(0.145 0 0)',
      dark: 'oklch(0.145 0 0)'
    }
  },

  outOfStock: {
    light: 'oklch(0.55 0.2 25)',
    dark: 'oklch(0.65 0.2 25)',
    foreground: {
      light: 'oklch(0.985 0 0)',
      dark: 'oklch(0.145 0 0)'
    }
  },

  inStock: {
    light: 'oklch(0.65 0.15 145)',
    dark: 'oklch(0.75 0.15 145)',
    foreground: {
      light: 'oklch(0.985 0 0)',
      dark: 'oklch(0.145 0 0)'
    }
  }
} as const;

// Pastel color variations for softer design elements
export const pastelColors = {
  light: {
    rose: 'oklch(0.92 0.05 350)',
    pink: 'oklch(0.93 0.08 330)',
    lavender: 'oklch(0.94 0.06 280)',
    blue: 'oklch(0.92 0.06 240)',
    mint: 'oklch(0.93 0.05 160)',
    green: 'oklch(0.91 0.06 140)',
    yellow: 'oklch(0.94 0.08 80)',
    peach: 'oklch(0.93 0.07 40)',
    coral: 'oklch(0.92 0.08 20)',
    gray: 'oklch(0.96 0.02 0)',
  },
  dark: {
    rose: 'oklch(0.35 0.08 350)',
    pink: 'oklch(0.38 0.1 330)',
    lavender: 'oklch(0.4 0.08 280)',
    blue: 'oklch(0.42 0.08 240)',
    mint: 'oklch(0.4 0.06 160)',
    green: 'oklch(0.38 0.08 140)',
    yellow: 'oklch(0.45 0.1 80)',
    peach: 'oklch(0.42 0.09 40)',
    coral: 'oklch(0.4 0.1 20)',
    gray: 'oklch(0.35 0.04 0)',
  }
} as const;

// Gradient combinations
export const gradients = {
  light: {
    primary: 'linear-gradient(135deg, oklch(0.24 0.15 240) 0%, oklch(0.35 0.15 240) 100%)',
    success: 'linear-gradient(135deg, oklch(0.65 0.15 145) 0%, oklch(0.75 0.15 145) 100%)',
    warning: 'linear-gradient(135deg, oklch(0.6 0.25 60) 0%, oklch(0.7 0.25 60) 100%)',
    fresh: 'linear-gradient(135deg, oklch(0.65 0.15 145) 0%, oklch(0.55 0.2 25) 100%)',
    sunset: 'linear-gradient(135deg, oklch(0.55 0.2 25) 0%, oklch(0.45 0.2 345) 100%)',
    ocean: 'linear-gradient(135deg, oklch(0.65 0.1 240) 0%, oklch(0.75 0.15 145) 100%)',
  },
  dark: {
    primary: 'linear-gradient(135deg, oklch(0.85 0.15 240) 0%, oklch(0.75 0.15 240) 100%)',
    success: 'linear-gradient(135deg, oklch(0.75 0.15 145) 0%, oklch(0.65 0.15 145) 100%)',
    warning: 'linear-gradient(135deg, oklch(0.75 0.25 60) 0%, oklch(0.65 0.25 60) 100%)',
    fresh: 'linear-gradient(135deg, oklch(0.75 0.15 145) 0%, oklch(0.65 0.2 25) 100%)',
    sunset: 'linear-gradient(135deg, oklch(0.65 0.2 25) 0%, oklch(0.65 0.2 345) 100%)',
    ocean: 'linear-gradient(135deg, oklch(0.75 0.15 240) 0%, oklch(0.85 0.15 145) 100%)',
  }
} as const;

// Color utilities
export type ColorToken = keyof typeof colorTokens.light;
export type SemanticColor = keyof typeof semanticColors;
export type PastelColor = keyof typeof pastelColors.light;
export type GradientName = keyof typeof gradients.light;

// Helper function to get color value
export function getColorValue(token: ColorToken, mode: 'light' | 'dark' = 'light'): string {
  return colorTokens[mode][token];
}

// Helper function to get semantic color
export function getSemanticColor(
  token: SemanticColor,
  mode: 'light' | 'dark' = 'light'
): string {
  return semanticColors[token][mode];
}

// Helper function to get semantic color foreground
export function getSemanticForeground(
  token: SemanticColor,
  mode: 'light' | 'dark' = 'light'
): string {
  return semanticColors[token].foreground[mode];
}

// Helper function to get pastel color
export function getPastelColor(
  token: PastelColor,
  mode: 'light' | 'dark' = 'light'
): string {
  return pastelColors[mode][token];
}

// Helper function to get gradient
export function getGradient(
  name: GradientName,
  mode: 'light' | 'dark' = 'light'
): string {
  return gradients[mode][name];
}

// Helper function to create CSS custom property
export function createCssVariable(token: ColorToken | string): string {
  return `var(--${token})`;
}

// Helper function to create color with opacity
export function createColorWithOpacity(
  color: string,
  opacity: number
): string {
  // Convert OKLCH to color with opacity
  return color.replace(')', ` / ${opacity})`).replace('oklch(', 'oklch(');
}

// Helper function to generate color scale
export function generateColorScale(
  baseColor: string,
  steps: number = 5
): string[] {
  // This is a simplified version - in practice you'd want more sophisticated color manipulation
  const colors: string[] = [];

  for (let i = 0; i < steps; i++) {
    const lightness = 0.2 + (i * 0.15); // Generate lightness variations
    colors.push(baseColor.replace(/oklch\(([^)]+)\)/, `oklch(${lightness} $1)`));
  }

  return colors;
}

// Enhanced Color Utilities

// Color manipulation utilities
export function adjustLightness(color: string, adjustment: number): string {
  const match = color.match(/oklch\(([^)]+)\)/);
  if (!match) return color;

  const values = match[1].split(' ');
  const lightness = Math.max(0, Math.min(1, parseFloat(values[0]) + adjustment));
  return `oklch(${lightness} ${values[1]} ${values[2]})`;
}

export function adjustChroma(color: string, adjustment: number): string {
  const match = color.match(/oklch\(([^)]+)\)/);
  if (!match) return color;

  const values = match[1].split(' ');
  const chroma = Math.max(0, parseFloat(values[1]) + adjustment);
  return `oklch(${values[0]} ${chroma} ${values[2]})`;
}

export function adjustHue(color: string, adjustment: number): string {
  const match = color.match(/oklch\(([^)]+)\)/);
  if (!match) return color;

  const values = match[1].split(' ');
  const hue = (parseFloat(values[2]) + adjustment) % 360;
  return `oklch(${values[0]} ${values[1]} ${hue})`;
}

export function lighten(color: string, amount: number = 0.1): string {
  return adjustLightness(color, amount);
}

export function darken(color: string, amount: number = 0.1): string {
  return adjustLightness(color, -amount);
}

export function saturate(color: string, amount: number = 0.05): string {
  return adjustChroma(color, amount);
}

export function desaturate(color: string, amount: number = 0.05): string {
  return adjustChroma(color, -amount);
}

export function rotateHue(color: string, degrees: number): string {
  return adjustHue(color, degrees);
}

// Color contrast utilities
export function getContrastColor(backgroundColor: string): 'light' | 'dark' {
  const match = backgroundColor.match(/oklch\(([^)]+)\)/);
  if (match) {
    const lightness = parseFloat(match[1].split(' ')[0]);
    return lightness > 0.5 ? 'dark' : 'light';
  }
  return 'dark';
}

// WCAG compliant contrast ratio calculation
export function calculateContrastRatio(color1: string, color2: string): number {
  // This is a simplified implementation
  // In practice, you'd want a more accurate calculation
  const getLuminance = (color: string): number => {
    const match = color.match(/oklch\(([^)]+)\)/);
    if (match) {
      const lightness = parseFloat(match[1].split(' ')[0]);
      return lightness;
    }
    return 0.5;
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export function hasSufficientContrast(color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = calculateContrastRatio(color1, color2);
  const minRatio = level === 'AA' ? 4.5 : 7;
  return ratio >= minRatio;
}

// Color palette generation utilities
export function generateShades(baseColor: string, count: number = 5): string[] {
  const shades: string[] = [];
  const step = 0.8 / (count - 1);

  for (let i = 0; i < count; i++) {
    const lightness = 0.1 + (step * i);
    const match = baseColor.match(/oklch\(([^)]+)\)/);
    if (match) {
      const values = match[1].split(' ');
      shades.push(`oklch(${lightness} ${values[1]} ${values[2]})`);
    }
  }

  return shades;
}

export function generateTints(baseColor: string, count: number = 5): string[] {
  const tints: string[] = [];
  const step = 0.8 / (count - 1);

  for (let i = 0; i < count; i++) {
    const lightness = 0.2 + (step * i);
    const match = baseColor.match(/oklch\(([^)]+)\)/);
    if (match) {
      const values = match[1].split(' ');
      tints.push(`oklch(${lightness} ${values[1]} ${values[2]})`);
    }
  }

  return tints;
}

export function generateAnalogousColors(baseColor: string, count: number = 3): string[] {
  const colors: string[] = [];
  const hueStep = 30;

  for (let i = 0; i < count; i++) {
    const hueOffset = (i - Math.floor(count / 2)) * hueStep;
    colors.push(adjustHue(baseColor, hueOffset));
  }

  return colors;
}

export function generateComplementaryColors(baseColor: string): string[] {
  return [baseColor, adjustHue(baseColor, 180)];
}

export function generateTriadicColors(baseColor: string): string[] {
  return [
    baseColor,
    adjustHue(baseColor, 120),
    adjustHue(baseColor, 240)
  ];
}

// Color conversion utilities
export function oklchToHex(oklchColor: string): string {
  // This is a placeholder implementation
  // In practice, you'd need proper color space conversion
  const match = oklchColor.match(/oklch\(([^)]+)\)/);
  if (!match) return '#000000';

  const values = match[1].split(' ');
  const lightness = parseFloat(values[0]);
  const _chroma = parseFloat(values[1]); // Prefix with underscore to indicate intentionally unused
  const _hue = parseFloat(values[2]); // Prefix with underscore to indicate intentionally unused

  // Simplified conversion (not accurate)
  const r = Math.round(255 * lightness);
  const g = Math.round(255 * lightness);
  const b = Math.round(255 * lightness);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function hexToOklch(hexColor: string): string {
  // This is a placeholder implementation
  // In practice, you'd need proper color space conversion
  const match = hexColor.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return 'oklch(0 0 0)';

  const r = parseInt(match[1], 16) / 255;
  const g = parseInt(match[2], 16) / 255;
  const b = parseInt(match[3], 16) / 255;

  const lightness = (r + g + b) / 3;
  return `oklch(${lightness} 0 0)`;
}

// Theme-aware color utilities
export function useThemeAwareColor(token: ColorToken, mode?: 'light' | 'dark'): string {
  if (mode) {
    return colorTokens[mode][token];
  }

  // In a real app, you'd get the current theme from context
  // For now, we'll assume light mode as default
  return colorTokens.light[token];
}

export function getAccessibleTextColor(backgroundColor: string): string {
  const contrastColor = getContrastColor(backgroundColor);
  return contrastColor === 'light' ? 'oklch(0.985 0 0)' : 'oklch(0.145 0 0)';
}

// Color validation utilities
export function isValidOklchColor(color: string): boolean {
  const match = color.match(/oklch\(([^)]+)\)/);
  if (!match) return false;

  const values = match[1].split(' ');
  if (values.length !== 3) return false;

  const [lightness, chroma, hue] = values.map(parseFloat);

  return (
    lightness >= 0 && lightness <= 1 &&
    chroma >= 0 && chroma <= 0.4 &&
    hue >= 0 && hue <= 360
  );
}

export function sanitizeOklchColor(color: string): string {
  if (!isValidOklchColor(color)) {
    return 'oklch(0.5 0 0)'; // Return a default color
  }
  return color;
}

// Animation and transition utilities
export function getColorTransition(color1: string, color2: string, duration: number = 300): string {
  return `color ${duration}ms ease-in-out`;
}

export function getBackgroundColorTransition(color1: string, color2: string, duration: number = 300): string {
  return `background-color ${duration}ms ease-in-out`;
}

// CSS Custom Properties Generator
export function generateCSSVariables(mode: 'light' | 'dark' = 'light'): Record<string, string> {
  const tokens = colorTokens[mode];
  const variables: Record<string, string> = {};

  // Generate CSS variables for all color tokens
  Object.entries(tokens).forEach(([key, value]) => {
    variables[`--${key}`] = value;
  });

  // Add semantic color variables
  Object.entries(semanticColors).forEach(([semanticKey, semanticValue]) => {
    variables[`--semantic-${semanticKey}`] = semanticValue[mode];
    if (semanticValue.foreground) {
      variables[`--semantic-${semanticKey}-foreground`] = semanticValue.foreground[mode];
    }
    // Add hover and active states if available
    if ('hover' in semanticValue && typeof semanticValue.hover === 'object') {
      variables[`--semantic-${semanticKey}-hover`] = semanticValue.hover[mode];
    }
    if ('active' in semanticValue && typeof semanticValue.active === 'object') {
      variables[`--semantic-${semanticKey}-active`] = semanticValue.active[mode];
    }
  });

  // Add pastel color variables
  Object.entries(pastelColors[mode]).forEach(([key, value]) => {
    variables[`--pastel-${key}`] = value;
  });

  return variables;
}

// Generate CSS string for root/application
export function generateRootCSS(mode: 'light' | 'dark' = 'light'): string {
  const variables = generateCSSVariables(mode);
  const cssLines = Object.entries(variables).map(([property, value]) => {
    return `  ${property}: ${value};`;
  });

  return `:root {\n${cssLines.join('\n')}\n}`;
}

// Generate complete CSS theme
export function generateThemeCSS(): string {
  const lightVariables = generateCSSVariables('light');
  const darkVariables = generateCSSVariables('dark');

  const lightCSS = Object.entries(lightVariables).map(([property, value]) => {
    return `  ${property}: ${value};`;
  }).join('\n');

  const darkCSS = Object.entries(darkVariables).map(([property, value]) => {
    return `  ${property}: ${value};`;
  }).join('\n');

  return `
/* Light theme colors */
:root {
${lightCSS}
}

/* Dark theme colors */
.dark {
${darkCSS}
}

/* Data theme attribute support */
[data-theme="light"] {
${lightCSS}
}

[data-theme="dark"] {
${darkCSS}
}
`;
}

// Color palette for design system documentation
export function getColorPalette(): Array<{
  name: string;
  light: string;
  dark: string;
  category: string;
}> {
  const palette = [];

  // Base colors
  const baseColors = ['background', 'foreground', 'card', 'popover', 'modal'];
  baseColors.forEach(name => {
    palette.push({
      name,
      light: colorTokens.light[name],
      dark: colorTokens.dark[name],
      category: 'Base'
    });
  });

  // Brand colors
  const brandColors = ['primary', 'secondary', 'accent', 'muted'];
  brandColors.forEach(name => {
    palette.push({
      name,
      light: colorTokens.light[name],
      dark: colorTokens.dark[name],
      category: 'Brand'
    });
  });

  // Status colors
  const statusColors = ['fresh', 'new', 'popular', 'sale', 'featured', 'limited'];
  statusColors.forEach(name => {
    palette.push({
      name,
      light: colorTokens.light[name],
      dark: colorTokens.dark[name],
      category: 'Status'
    });
  });

  // Stock colors
  const stockColors = ['in-stock', 'low-stock', 'out-stock', 'back-order', 'pre-order'];
  stockColors.forEach(name => {
    palette.push({
      name,
      light: colorTokens.light[name],
      dark: colorTokens.dark[name],
      category: 'Stock'
    });
  });

  // Interactive colors
  const interactiveColors = ['destructive', 'warning', 'success', 'info'];
  interactiveColors.forEach(name => {
    const lightColor = name === 'destructive' ? colorTokens.light.destructive :
                      name === 'warning' ? colorTokens.light.warning :
                      name === 'success' ? colorTokens.light.success :
                      colorTokens.light.info;

    const darkColor = name === 'destructive' ? colorTokens.dark.destructive :
                     name === 'warning' ? colorTokens.dark.warning :
                     name === 'success' ? colorTokens.dark.success :
                     colorTokens.dark.info;

    palette.push({
      name,
      light: lightColor,
      dark: darkColor,
      category: 'Interactive'
    });
  });

  return palette;
}