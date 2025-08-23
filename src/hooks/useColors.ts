/**
 * Custom hook for accessing the color system
 * Provides type-safe color access and theme-aware color resolution
 */

import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { colorTokens, semanticColors, getColorValue, getSemanticColor, getSemanticForeground } from '@/lib/colors';
import type { ColorToken, SemanticColor, ColorMode, ColorValue } from '@/lib/color-types';

interface UseColorsReturn {
  // Current theme mode
  mode: ColorMode;

  // Color accessors
  getColor: (token: ColorToken) => ColorValue;
  getSemantic: (token: SemanticColor) => ColorValue;
  getSemanticFg: (token: SemanticColor) => ColorValue;

  // Direct color access
  colors: Record<ColorToken, ColorValue>;
  semantic: typeof semanticColors;

  // Utility functions
  isDark: boolean;
  isLight: boolean;
}

export function useColors(): UseColorsReturn {
  const { theme } = useTheme();
  const mode = (theme as ColorMode) || 'light';

  const colors = useMemo(() => {
    return colorTokens[mode];
  }, [mode]);

  const getColor = useMemo(() => {
    return (token: ColorToken): ColorValue => {
      return getColorValue(token, mode);
    };
  }, [mode]);

  const getSemantic = useMemo(() => {
    return (token: SemanticColor): ColorValue => {
      return getSemanticColor(token, mode);
    };
  }, [mode]);

  const getSemanticFg = useMemo(() => {
    return (token: SemanticColor): ColorValue => {
      return getSemanticForeground(token, mode);
    };
  }, [mode]);

  return {
    mode,
    colors,
    semantic: semanticColors,
    getColor,
    getSemantic,
    getSemanticFg,
    isDark: mode === 'dark',
    isLight: mode === 'light',
  };
}

// Hook for specific color categories
export function useBrandColors() {
  const { getColor } = useColors();

  return {
    primary: getColor('primary'),
    primaryForeground: getColor('primary-foreground'),
    secondary: getColor('secondary'),
    secondaryForeground: getColor('secondary-foreground'),
    accent: getColor('accent'),
    accentForeground: getColor('accent-foreground'),
    muted: getColor('muted'),
    mutedForeground: getColor('muted-foreground'),
  };
}

export function useStatusColors() {
  const { getColor } = useColors();

  return {
    fresh: getColor('fresh'),
    freshForeground: getColor('fresh-foreground'),
    new: getColor('new'),
    newForeground: getColor('new-foreground'),
    popular: getColor('popular'),
    popularForeground: getColor('popular-foreground'),
    sale: getColor('sale'),
    saleForeground: getColor('sale-foreground'),
  };
}

export function useStockColors() {
  const { getColor } = useColors();

  return {
    inStock: getColor('in-stock'),
    lowStock: getColor('low-stock'),
    outStock: getColor('out-stock'),
  };
}

export function useSemanticColors() {
  const { getSemantic, getSemanticFg } = useColors();

  return {
    success: getSemantic('success'),
    successForeground: getSemanticFg('success'),
    warning: getSemantic('warning'),
    warningForeground: getSemanticFg('warning'),
    error: getSemantic('error'),
    errorForeground: getSemanticFg('error'),
    info: getSemantic('info'),
    infoForeground: getSemanticFg('info'),
  };
}