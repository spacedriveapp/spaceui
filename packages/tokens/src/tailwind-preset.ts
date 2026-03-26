import type { Config } from 'tailwindcss';
import { colors } from './colors';

// Convert color object to Tailwind format
const flattenColors = (obj: Record<string, unknown>, prefix = ''): Record<string, string> => {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${key}` : key;
    if (typeof value === 'string') {
      result[newKey] = value;
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenColors(value as Record<string, unknown>, newKey));
    }
  }
  
  return result;
};

export const spaceUiPreset: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: colors.accent,
        ink: colors.ink,
        app: colors.app,
        sidebar: colors.sidebar,
        menu: colors.menu,
        status: colors.status,
      },
      borderRadius: {
        'window': '10px',
        'lg': '8px',
        'md': '6px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
};

export { colors };
