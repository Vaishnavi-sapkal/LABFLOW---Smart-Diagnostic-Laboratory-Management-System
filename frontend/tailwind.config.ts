import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', '../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: 'rgb(var(--color-brand-50) / <alpha-value>)', 500: 'rgb(var(--color-brand-500) / <alpha-value>)', 600: 'rgb(var(--color-brand-600) / <alpha-value>)', 700: 'rgb(var(--color-brand-700) / <alpha-value>)' },
        accent: { DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)', light: 'rgb(var(--color-accent-light) / <alpha-value>)' },
        surface: { DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)', muted: 'rgb(var(--color-surface-muted) / <alpha-value>)' },
        ink: { DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)', muted: 'rgb(var(--color-ink-muted) / <alpha-value>)', subtle: 'rgb(var(--color-ink-subtle) / <alpha-value>)' },
        border: 'rgb(var(--color-border) / <alpha-value>)',
        success: { DEFAULT: 'rgb(var(--color-success) / <alpha-value>)', light: 'rgb(var(--color-success-light) / <alpha-value>)' },
        warning: { DEFAULT: 'rgb(var(--color-warning) / <alpha-value>)', light: 'rgb(var(--color-warning-light) / <alpha-value>)' },
        danger: { DEFAULT: 'rgb(var(--color-danger) / <alpha-value>)', light: 'rgb(var(--color-danger-light) / <alpha-value>)' },
      },
      borderRadius: { ui: 'var(--radius-ui)', card: 'var(--radius-card)' },
      boxShadow: { card: 'var(--shadow-card)', floating: 'var(--shadow-floating)' },
    },
  },
  plugins: [],
} satisfies Config;
