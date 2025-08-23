/**
 * TypeScript type definitions for color tokens
 * Provides type safety and autocomplete for the color system
 */

import { colorTokens, semanticColors } from './colors';

// Extract color token keys
export type ColorToken = keyof typeof colorTokens.light;
export type SemanticColor = keyof typeof semanticColors;
export type ColorMode = 'light' | 'dark';

// Color value type
export type ColorValue = string;

// Color category types
export type BaseColorToken =
  | 'background'
  | 'foreground'
  | 'card'
  | 'card-foreground'
  | 'popover'
  | 'popover-foreground';

export type BrandColorToken =
  | 'primary'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-foreground'
  | 'muted'
  | 'muted-foreground'
  | 'accent'
  | 'accent-foreground';

export type StatusColorToken =
  | 'fresh'
  | 'fresh-foreground'
  | 'new'
  | 'new-foreground'
  | 'popular'
  | 'popular-foreground'
  | 'sale'
  | 'sale-foreground';

export type StockColorToken =
  | 'in-stock'
  | 'low-stock'
  | 'out-stock';

export type InteractiveColorToken =
  | 'destructive'
  | 'destructive-foreground'
  | 'border'
  | 'input'
  | 'ring';

export type BentoColorToken =
  | 'bento-primary'
  | 'bento-secondary'
  | 'bento-accent'
  | 'bento-muted';

export type ChartColorToken =
  | 'chart-1'
  | 'chart-2'
  | 'chart-3'
  | 'chart-4'
  | 'chart-5';

export type SidebarColorToken =
  | 'sidebar'
  | 'sidebar-foreground'
  | 'sidebar-primary'
  | 'sidebar-primary-foreground'
  | 'sidebar-accent'
  | 'sidebar-accent-foreground'
  | 'sidebar-border'
  | 'sidebar-ring';

export type ShadowToken =
  | 'shadow-2xs'
  | 'shadow-xs'
  | 'shadow-sm'
  | 'shadow'
  | 'shadow-md'
  | 'shadow-lg'
  | 'shadow-xl'
  | 'shadow-2xl';

// Union type for all color categories
export type AllColorTokens =
  | BaseColorToken
  | BrandColorToken
  | StatusColorToken
  | StockColorToken
  | InteractiveColorToken
  | BentoColorToken
  | ChartColorToken
  | SidebarColorToken
  | ShadowToken;

// Color system interface
export interface ColorSystem {
  light: Record<ColorToken, ColorValue>;
  dark: Record<ColorToken, ColorValue>;
}

// Semantic color interface
export interface SemanticColorSystem {
  [key: string]: {
    light: ColorValue;
    dark: ColorValue;
    foreground: {
      light: ColorValue;
      dark: ColorValue;
    };
  };
}

// Tailwind color mapping interface
export interface TailwindColorMapping {
  [key: string]: ColorValue;
}

// CSS custom properties interface
export interface CSSCustomProperties {
  [key: `--${string}`]: ColorValue;
}

// Color utility interfaces
export interface ColorUtils {
  getColorValue(token: ColorToken, mode?: ColorMode): ColorValue;
  getSemanticColor(token: SemanticColor, mode?: ColorMode): ColorValue;
  getSemanticForeground(token: SemanticColor, mode?: ColorMode): ColorValue;
}

// Theme context interface
export interface ThemeContextValue {
  mode: ColorMode;
  colors: Record<ColorToken, ColorValue>;
  semanticColors: SemanticColorSystem;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
}

// Component color props interface
export interface ComponentColorProps {
  color?: ColorToken | SemanticColor;
  mode?: ColorMode;
  variant?: 'default' | 'subtle' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Type guards
export function isColorToken(value: string): value is ColorToken {
  return value in colorTokens.light;
}

export function isSemanticColor(value: string): value is SemanticColor {
  return value in semanticColors;
}

export function isColorMode(value: string): value is ColorMode {
  return value === 'light' || value === 'dark';
}

export function isValidColorToken(token: string, mode: ColorMode = 'light'): boolean {
  return token in colorTokens[mode];
}