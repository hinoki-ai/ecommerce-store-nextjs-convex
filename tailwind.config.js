/** @type {import('tailwindcss').Config} */
const { colorTokens } = require('./src/lib/colors');

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Import color tokens from the centralized system
        ...(() => {
          const tailwindColors = {};

          // Add light mode colors
          Object.entries(colorTokens.light).forEach(([key, value]) => {
            tailwindColors[key] = value;
          });

          // Add semantic colors for light mode
          tailwindColors.success = colorTokens.light.success || 'oklch(0.65 0.15 145)';
          tailwindColors.warning = colorTokens.light.warning || 'oklch(0.6 0.25 60)';
          tailwindColors.error = colorTokens.light.destructive || 'oklch(0.577 0.245 27.325)';
          tailwindColors.info = 'oklch(0.65 0.1 240)';

          return tailwindColors;
        })(),
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        '2xs': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.05)',
        'xs': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.05)',
        'sm': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.1), 0 1px 2px -1px rgb(from var(--shadow-color) r g b / 0.1)',
        'md': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.1), 0 2px 4px -1px rgb(from var(--shadow-color) r g b / 0.1)',
        'lg': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.1), 0 4px 6px -1px rgb(from var(--shadow-color) r g b / 0.1)',
        'xl': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.1), 0 8px 10px -1px rgb(from var(--shadow-color) r g b / 0.1)',
        '2xl': '0 1px 3px 0px rgb(from var(--shadow-color) r g b / 0.1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Use standard spacing scale to avoid CSS function issues
      margin: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      padding: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [
    // Add custom plugin for dynamic color support
    function({ addUtilities, theme, addBase, addComponents }) {
      // Add CSS custom properties for dynamic theming
      addBase({
        ':root': {
          '--shadow-color': theme('colors.shadow-color', 'oklch(0 0 0)'),
        },
        '.dark': {
          '--shadow-color': theme('colors.shadow-color', 'oklch(0 0 0 / 0.3)'),
        },
      });

      // Add utility classes for color tokens
      const colorUtilities = {};

      Object.entries(colorTokens.light).forEach(([key, value]) => {
        colorUtilities[`.bg-${key}`] = { backgroundColor: value };
        colorUtilities[`.text-${key}`] = { color: value };
        colorUtilities[`.border-${key}`] = { borderColor: value };
      });

      addUtilities(colorUtilities, { variants: ['responsive', 'hover', 'focus'] });
    },
  ],
  // Enable all core plugins including group utilities
  corePlugins: {
    preflight: true,
  },
}