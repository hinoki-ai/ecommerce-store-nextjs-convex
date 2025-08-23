// UI Constants - User interface related constants
export const UI_CONFIG = {
  // Animation durations
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },

  // Breakpoints (Tailwind CSS defaults)
  BREAKPOINTS: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },

  // Z-index layers
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    TOAST: 1080,
  },

  // Spacing scale
  SPACING: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },

  // Border radius
  BORDER_RADIUS: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  // Colors (complementary to existing palette)
  COLORS: {
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#3B82F6',
    BACKGROUND: '#FFFFFF',
    SURFACE: '#F9FAFB',
    TEXT_PRIMARY: '#111827',
    TEXT_SECONDARY: '#6B7280',
    BORDER: '#E5E7EB',
  },

  // Component sizes
  COMPONENT_SIZE: {
    SMALL: 'sm',
    MEDIUM: 'md',
    LARGE: 'lg',
    EXTRA_LARGE: 'xl',
  },

  // Loading states
  LOADING_SIZES: {
    xs: 12,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
} as const;

// Toast configurations
export const TOAST_CONFIG = {
  DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 8000,
    INFINITE: 0,
  },
  POSITION: {
    TOP_LEFT: 'top-left',
    TOP_RIGHT: 'top-right',
    TOP_CENTER: 'top-center',
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_CENTER: 'bottom-center',
  },
} as const;

// Form configurations
export const FORM_CONFIG = {
  INPUT_HEIGHT: 40,
  TEXTAREA_MIN_HEIGHT: 80,
  LABEL_MARGIN_BOTTOM: 8,
  ERROR_MESSAGE_HEIGHT: 20,
  BORDER_RADIUS: 8,
} as const;