# Aramac Branfing Color Tokenization System

A comprehensive, enterprise-grade color system designed for modern e-commerce platforms. This system provides a complete color tokenization solution with semantic naming, accessibility compliance, and seamless integration with design tools and development workflows.

## 🎨 Overview

This color system is built around the following principles:

- **Semantic naming**: Colors are named by their function, not appearance
- **Accessibility-first**: All color combinations meet WCAG AA standards
- **Theme-aware**: Support for light/dark mode with automatic switching
- **Tool integration**: Seamless integration with Tailwind CSS, Figma, and design tools
- **Type-safe**: Full TypeScript support with autocomplete
- **Performance optimized**: CSS custom properties for efficient theming

## 📚 Table of Contents

- [Quick Start](#-quick-start)
- [Color Tokens](#-color-tokens)
- [Semantic Colors](#-semantic-colors)
- [Using Colors in Components](#-using-colors-in-components)
- [Tailwind CSS Integration](#-tailwind-css-integration)
- [Theme Management](#-theme-management)
- [Color Utilities](#-color-utilities)
- [Accessibility](#-accessibility)
- [Design System Integration](#-design-system-integration)
- [API Reference](#-api-reference)

## 🚀 Quick Start

### 1. Basic Usage

```tsx
import { useColors } from '@/components/color-system-provider'

function MyComponent() {
  const { colors, getCssVariable } = useColors()

  return (
    <div
      className="p-4 rounded-lg"
      style={{
        backgroundColor: colors.primary,
        color: colors['primary-foreground']
      }}
    >
      <h2 style={{ color: colors.foreground }}>
        Hello World
      </h2>
    </div>
  )
}
```

### 2. With Tailwind CSS

```tsx
function MyComponent() {
  return (
    <div className="bg-primary text-primary-foreground p-4 rounded-lg">
      <h2 className="text-foreground">
        Hello World
      </h2>
    </div>
  )
}
```

### 3. CSS Custom Properties

```css
.my-component {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: 1px solid var(--border);
}
```

## 🎯 Color Tokens

### Base System Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|--------|
| `background` | White | Dark Gray | Page background |
| `foreground` | Dark Gray | Light Gray | Primary text |
| `card` | White | Dark Gray | Card backgrounds |
| `popover` | White | Dark Gray | Dropdown/popover backgrounds |

### Brand Colors

| Token | Usage |
|-------|--------|
| `primary` | Main brand actions, links |
| `primary-hover` | Primary button hover states |
| `primary-active` | Primary button active states |
| `primary-light` | Light primary backgrounds |
| `primary-lighter` | Very light primary backgrounds |

### Status Colors

| Token | Usage |
|-------|--------|
| `fresh` | New or fresh products |
| `new` | New arrivals |
| `popular` | Popular/trending items |
| `sale` | Sale/discount items |
| `featured` | Featured products |
| `limited` | Limited edition items |

### Stock Status Colors

| Token | Usage |
|-------|--------|
| `in-stock` | Products in stock |
| `low-stock` | Low stock warning |
| `out-stock` | Out of stock |
| `back-order` | Available for backorder |
| `pre-order` | Available for preorder |

### Interactive Colors

| Token | Usage |
|-------|--------|
| `destructive` | Delete, remove actions |
| `destructive-hover` | Destructive button hover |
| `destructive-active` | Destructive button active |
| `success` | Success states, confirmations |
| `warning` | Warning states, cautions |
| `info` | Information, notices |

## 🔍 Semantic Colors

Semantic colors provide context-aware color application:

```tsx
import { useColorSystem } from '@/components/color-system-provider'

function StatusBadge({ status }) {
  const { semanticColors, mode } = useColorSystem()

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return {
          background: semanticColors.success[mode],
          foreground: semanticColors.success.foreground[mode]
        }
      case 'warning':
        return {
          background: semanticColors.warning[mode],
          foreground: semanticColors.warning.foreground[mode]
        }
      case 'error':
        return {
          background: semanticColors.error[mode],
          foreground: semanticColors.error.foreground[mode]
        }
      default:
        return {
          background: semanticColors.info[mode],
          foreground: semanticColors.info.foreground[mode]
        }
    }
  }

  const colors = getStatusColor()

  return (
    <span
      className="px-2 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: colors.background,
        color: colors.foreground
      }}
    >
      {status}
    </span>
  )
}
```

## 🧩 Using Colors in Components

### Hook-based Approach

```tsx
import { useColors } from '@/components/color-system-provider'

function ProductCard({ product }) {
  const { colors, lighten, darken } = useColors()

  return (
    <div
      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        color: colors.foreground
      }}
    >
      <h3 style={{ color: colors.foreground }}>
        {product.name}
      </h3>
      <p style={{ color: colors.muted }}>
        {product.description}
      </p>
      <div className="flex justify-between items-center mt-4">
        <span
          className="font-bold"
          style={{ color: colors.primary }}
        >
          ${product.price}
        </span>
        <button
          className="px-4 py-2 rounded-md font-medium transition-colors"
          style={{
            backgroundColor: colors.primary,
            color: colors['primary-foreground'],
            ':hover': {
              backgroundColor: lighten('primary', 0.1)
            }
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
```

### CSS Variable Approach

```tsx
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p className="description">{product.description}</p>
      <div className="footer">
        <span className="price">${product.price}</span>
        <button className="add-to-cart">Add to Cart</button>
      </div>
    </div>
  )
}

// In your CSS:
.product-card {
  background-color: var(--card);
  border: 1px solid var(--border);
  color: var(--foreground);
  padding: 1rem;
  border-radius: 0.5rem;
}

.product-card .description {
  color: var(--muted-foreground);
}

.product-card .price {
  color: var(--primary);
  font-weight: bold;
}

.add-to-cart {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.add-to-cart:hover {
  background-color: var(--primary-hover);
}
```

## 🎨 Tailwind CSS Integration

### Configuration

The color system is automatically integrated with Tailwind CSS. All color tokens are available as utilities:

```html
<!-- Background colors -->
<div className="bg-primary">Primary background</div>
<div className="bg-primary-light">Light primary background</div>
<div className="bg-success">Success background</div>
<div className="bg-warning">Warning background</div>

<!-- Text colors -->
<span className="text-foreground">Primary text</span>
<span className="text-muted-foreground">Muted text</span>
<span className="text-primary">Primary text</span>

<!-- Border colors -->
<div className="border border-primary">Primary border</div>
<div className="border border-destructive">Destructive border</div>

<!-- Interactive states -->
<button className="bg-primary hover:bg-primary-hover active:bg-primary-active">
  Interactive Button
</button>
```

### Custom Utilities

```css
/* In your CSS file */
@layer utilities {
  .btn-primary {
    @apply px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium transition-colors;
  }

  .btn-primary:hover {
    @apply bg-primary-hover;
  }

  .btn-primary:active {
    @apply bg-primary-active;
  }

  .card {
    @apply bg-card border border-border rounded-lg p-4;
  }

  .input {
    @apply bg-background border border-input rounded-md px-3 py-2;
  }

  .input:focus {
    @apply border-ring ring-2 ring-ring-focus;
  }
}
```

## 🌙 Theme Management

### Automatic Theme Switching

```tsx
import { ColorSystemProvider } from '@/components/color-system-provider'

function App({ children }) {
  return (
    <ColorSystemProvider
      defaultMode="light"
      enableSystemPreference={true}
    >
      {children}
    </ColorSystemProvider>
  )
}
```

### Manual Theme Control

```tsx
import { useColorSystem } from '@/components/color-system-provider'

function ThemeToggle() {
  const { mode, toggleMode, systemPreference, setSystemPreference } = useColorSystem()

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleMode}
        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
      >
        {mode === 'light' ? '🌙' : '☀️'} Toggle Theme
      </button>

      <select
        value={systemPreference}
        onChange={(e) => setSystemPreference(e.target.value as any)}
        className="px-3 py-2 bg-background border border-input rounded-md"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>

      <span className="text-sm text-muted-foreground">
        Current: {mode} mode
        {systemPreference === 'system' && ' (following system)'}
      </span>
    </div>
  )
}
```

### Theme-aware Components

```tsx
function ThemeAwareComponent() {
  const { mode, isSystemTheme } = useColorSystem()

  return (
    <div className="p-4 rounded-lg">
      <p>Current theme: <strong>{mode}</strong></p>
      {isSystemTheme && (
        <p className="text-sm text-muted-foreground">
          Following system preference
        </p>
      )}
    </div>
  )
}
```

## 🛠️ Color Utilities

### Color Manipulation

```tsx
import { useColors } from '@/components/color-system-provider'

function ColorManipulationExample() {
  const {
    lighten,
    darken,
    saturate,
    desaturate,
    rotateHue,
    getColorWithOpacity
  } = useColors()

  return (
    <div className="grid grid-cols-2 gap-4">
      <div
        className="p-4 rounded-lg"
        style={{
          backgroundColor: lighten('primary', 0.2),
          color: 'white'
        }}
      >
        Lightened Primary
      </div>

      <div
        className="p-4 rounded-lg"
        style={{
          backgroundColor: darken('primary', 0.2),
          color: 'white'
        }}
      >
        Darkened Primary
      </div>

      <div
        className="p-4 rounded-lg"
        style={{
          backgroundColor: saturate('success', 0.1),
          color: 'white'
        }}
      >
        Saturated Success
      </div>

      <div
        className="p-4 rounded-lg"
        style={{
          backgroundColor: rotateHue('info', 45),
          color: 'white'
        }}
      >
        Rotated Info
      </div>
    </div>
  )
}
```

### Advanced Color Functions

```tsx
import {
  generateShades,
  generateTints,
  calculateContrastRatio,
  hasSufficientContrast
} from '@/lib/colors'

function AdvancedColorExample() {
  const baseColor = 'oklch(0.55 0.15 240)'

  // Generate color variations
  const shades = generateShades(baseColor, 5)
  const tints = generateTints(baseColor, 5)

  // Check contrast
  const contrastRatio = calculateContrastRatio(
    'oklch(0.55 0.15 240)',
    'oklch(0.985 0 0)'
  )

  const hasGoodContrast = hasSufficientContrast(
    'oklch(0.55 0.15 240)',
    'oklch(0.985 0 0)',
    'AAA'
  )

  return (
    <div className="space-y-4">
      <div>
        <h3>Shades</h3>
        <div className="flex gap-2">
          {shades.map((shade, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded"
              style={{ backgroundColor: shade }}
            />
          ))}
        </div>
      </div>

      <div>
        <h3>Tints</h3>
        <div className="flex gap-2">
          {tints.map((tint, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded"
              style={{ backgroundColor: tint }}
            />
          ))}
        </div>
      </div>

      <div>
        <p>Contrast Ratio: {contrastRatio.toFixed(2)}:1</p>
        <p>Has AAA Contrast: {hasGoodContrast ? '✅' : '❌'}</p>
      </div>
    </div>
  )
}
```

## ♿ Accessibility

### WCAG Compliance

All color combinations in this system meet WCAG AA standards (4.5:1 contrast ratio) by default. For AAA compliance (7:1), use the appropriate semantic colors:

```tsx
function AccessibleButton({ variant = 'primary' }) {
  const { colors } = useColors()

  const getAccessibleColors = () => {
    switch (variant) {
      case 'primary':
        return {
          background: colors.primary,
          foreground: colors['primary-foreground'] // High contrast guaranteed
        }
      case 'secondary':
        return {
          background: colors.secondary,
          foreground: colors['secondary-foreground'] // High contrast guaranteed
        }
      case 'success':
        return {
          background: colors.success,
          foreground: colors['success-foreground'] // High contrast guaranteed
        }
      default:
        return {
          background: colors.muted,
          foreground: colors['muted-foreground'] // High contrast guaranteed
        }
    }
  }

  const { background, foreground } = getAccessibleColors()

  return (
    <button
      className="px-4 py-2 rounded-md font-medium"
      style={{
        backgroundColor: background,
        color: foreground
      }}
    >
      Accessible Button
    </button>
  )
}
```

### Focus Indicators

```css
/* Ensure focus indicators are always visible */
.focus-visible {
  outline: 2px solid var(--ring-focus);
  outline-offset: 2px;
}

.focus-visible:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### High Contrast Mode Support

```tsx
function HighContrastAwareComponent() {
  const { mode } = useColorSystem()

  // Detect high contrast mode
  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches

  const highContrastColors = {
    background: prefersHighContrast ? 'black' : 'white',
    foreground: prefersHighContrast ? 'white' : 'black',
    border: prefersHighContrast ? 'white' : 'gray'
  }

  return (
    <div
      style={{
        backgroundColor: prefersHighContrast ? highContrastColors.background : undefined,
        color: prefersHighContrast ? highContrastColors.foreground : undefined,
        border: prefersHighContrast ? `1px solid ${highContrastColors.border}` : undefined
      }}
    >
      Content that respects high contrast preferences
    </div>
  )
}
```

## 🎭 Design System Integration

### Figma Integration

1. **Export Color Tokens**: Use the `getColorPalette()` function to export colors for design tools
2. **Import from Figma**: Convert Figma styles to color tokens
3. **Sync Design Tokens**: Keep design and development in sync

```tsx
// Export colors for Figma
function exportColorsForFigma() {
  const { getColorPalette } = require('@/lib/colors')
  const palette = getColorPalette()

  // This can be exported as JSON for Figma
  return palette.map(item => ({
    name: item.name,
    category: item.category,
    light: item.light,
    dark: item.dark,
    figmaName: `${item.category}/${item.name}`
  }))
}
```

### Storybook Integration

```tsx
// .storybook/preview.js
import { ColorSystemProvider } from '@/components/color-system-provider'

export const decorators = [
  (Story) => (
    <ColorSystemProvider>
      <Story />
    </ColorSystemProvider>
  )
]

export const parameters = {
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: 'var(--background)' },
      { name: 'dark', value: 'var(--background)' }
    ]
  }
}
```

## 📖 API Reference

### Hooks

#### `useColorSystem()`

Returns the complete color system context.

```tsx
const {
  mode,                    // 'light' | 'dark'
  colors,                  // All color tokens
  semanticColors,          // Semantic color definitions
  setMode,                 // (mode: ColorMode) => void
  toggleMode,              // () => void
  systemPreference,        // ColorMode | 'system'
  setSystemPreference,     // (pref: ColorMode | 'system') => void
  cssVariables,            // Record<string, string>
  isSystemTheme,           // boolean
  getAdjustedColor         // Color manipulation function
} = useColorSystem()
```

#### `useColors()`

Returns color utilities and manipulation functions.

```tsx
const {
  colors,                    // Color tokens
  mode,                      // Current theme mode
  getCssVariable,            // (token) => string
  getColorWithOpacity,       // (token, opacity) => string
  lighten,                   // (token, amount) => string
  darken,                    // (token, amount) => string
  saturate,                  // (token, amount) => string
  desaturate,                // (token, amount) => string
  rotateHue,                 // (token, degrees) => string
  getThemeAwareColor         // (light, dark?) => string
} = useColors()
```

### Utility Functions

#### Color Manipulation

```tsx
import {
  adjustLightness,
  adjustChroma,
  adjustHue,
  lighten,
  darken,
  saturate,
  desaturate,
  rotateHue
} from '@/lib/colors'

// Adjust individual properties
const lighterColor = adjustLightness('oklch(0.5 0.2 240)', 0.1)
const moreSaturated = adjustChroma('oklch(0.5 0.2 240)', 0.05)
const rotatedHue = adjustHue('oklch(0.5 0.2 240)', 45)

// Convenience functions
const lighter = lighten('oklch(0.5 0.2 240)', 0.1)
const darker = darken('oklch(0.5 0.2 240)', 0.1)
const moreVibrant = saturate('oklch(0.5 0.2 240)', 0.05)
```

#### Color Generation

```tsx
import {
  generateShades,
  generateTints,
  generateAnalogousColors,
  generateComplementaryColors,
  generateTriadicColors
} from '@/lib/colors'

const shades = generateShades('oklch(0.5 0.2 240)', 5)
const tints = generateTints('oklch(0.5 0.2 240)', 5)
const analogous = generateAnalogousColors('oklch(0.5 0.2 240)', 3)
const complementary = generateComplementaryColors('oklch(0.5 0.2 240)')
const triadic = generateTriadicColors('oklch(0.5 0.2 240)')
```

#### Accessibility Utilities

```tsx
import {
  calculateContrastRatio,
  hasSufficientContrast,
  getContrastColor,
  getAccessibleTextColor
} from '@/lib/colors'

const ratio = calculateContrastRatio(color1, color2)
const hasAAContrast = hasSufficientContrast(color1, color2, 'AA')
const contrastColor = getContrastColor(backgroundColor)
const accessibleText = getAccessibleTextColor(backgroundColor)
```

### CSS Custom Properties

All color tokens are available as CSS custom properties:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.55 0.15 240);
  --primary-foreground: oklch(0.99 0 0);
  /* ... all other tokens */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.75 0.15 240);
  --primary-foreground: oklch(0.145 0 0);
  /* ... all other tokens */
}
```

## 🎨 Best Practices

### 1. Use Semantic Colors

```tsx
// ✅ Good - semantic naming
<div className="bg-primary text-primary-foreground">
  Primary Action
</div>

// ❌ Avoid - appearance-based naming
<div className="bg-blue-500 text-white">
  Primary Action
</div>
```

### 2. Leverage Theme Awareness

```tsx
// ✅ Good - theme-aware
function ThemedComponent() {
  const { colors, mode } = useColors()

  return (
    <div style={{ backgroundColor: colors.background }}>
      Theme-aware content
    </div>
  )
}
```

### 3. Use CSS Custom Properties for Performance

```tsx
// ✅ Good - CSS variables
<div className="bg-primary text-primary-foreground">
  Styled with CSS variables
</div>

// ❌ Avoid - inline styles for frequently used colors
<div style={{ backgroundColor: colors.primary }}>
  Styled with inline styles
</div>
```

### 4. Test Across Themes

Always test your components in both light and dark modes to ensure proper contrast and readability.

### 5. Document Custom Colors

When creating custom colors, document their intended use and ensure they meet accessibility standards.

```tsx
// Custom colors should be documented
const customColors = {
  'brand-gold': {
    light: 'oklch(0.7 0.1 85)',
    dark: 'oklch(0.8 0.15 85)',
    usage: 'Premium features, VIP indicators',
    contrast: 'High contrast against both themes'
  }
}
```

## 🚀 Migration Guide

### From CSS-in-JS to Color Tokens

```tsx
// Before
<div style={{
  backgroundColor: '#3B82F6',
  color: '#FFFFFF'
}} />

// After
<div className="bg-primary text-primary-foreground" />
```

### From Styled Components

```tsx
// Before
const Button = styled.button`
  background-color: #3B82F6;
  color: #FFFFFF;
`

// After
const Button = styled.button`
  background-color: var(--primary);
  color: var(--primary-foreground);
`
```

### From Theme Objects

```tsx
// Before
const theme = {
  colors: {
    primary: '#3B82F6',
    secondary: '#6B7280'
  }
}

// After
import { colorTokens } from '@/lib/colors'

const theme = {
  colors: colorTokens.light // or colorTokens.dark
}
```

## 📞 Support

For questions, issues, or contributions regarding the color system:

1. **Documentation**: Check this README for comprehensive guides
2. **Issues**: Create GitHub issues for bugs or feature requests
3. **Discussions**: Use GitHub Discussions for questions and community support
4. **Contributing**: See CONTRIBUTING.md for development guidelines

## 📄 License

This color system is part of your project and follows the same license terms.