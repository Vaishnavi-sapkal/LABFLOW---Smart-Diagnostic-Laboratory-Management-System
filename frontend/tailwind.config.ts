import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', '../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: 'rgb(var(--color-brand-50) / <alpha-value>)', 500: 'rgb(var(--color-brand-500) / <alpha-value>)', 600: 'rgb(var(--color-brand-600) / <alpha-value>)', 700: 'rgb(var(--color-brand-700) / <alpha-value>)' },
        surface: { DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)', muted: 'rgb(var(--color-surface-muted) / <alpha-value>)' },
        ink: { DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)', muted: 'rgb(var(--color-ink-muted) / <alpha-value>)' },
      },
      borderRadius: { ui: 'var(--radius-ui)', card: 'var(--radius-card)' },
      boxShadow: { card: 'var(--shadow-card)', floating: 'var(--shadow-floating)' },
    },
  },
  plugins: [],
} satisfies Config;