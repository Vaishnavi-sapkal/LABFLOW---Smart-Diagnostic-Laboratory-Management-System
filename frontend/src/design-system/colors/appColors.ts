export const AppColors = {
  primary: '#0E7C86',
  primaryDark: '#0A5F67',
  primaryLight: '#E4F3F3',
  accent: '#2F80ED',
  accentLight: '#EAF2FE',
  background: '#F4F7F9',
  surface: '#FFFFFF',
  border: '#E2E8ED',
  textPrimary: '#12262F',
  textSecondary: '#5B7382',
  textMuted: '#94A6AF',
  success: '#1C9F6C',
  successLight: '#E5F7EF',
  warning: '#DB9B2A',
  warningLight: '#FCF3E1',
  danger: '#E5484D',
  dangerLight: '#FDEAEA',
  info: '#2F80ED',
  infoLight: '#EAF2FE',
} as const;

export type AppColor = keyof typeof AppColors;
