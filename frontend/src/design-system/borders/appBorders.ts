import { AppColors } from '../colors/appColors';

export const AppBorders = {
  default: `1px solid ${AppColors.border}`,
  strong: `1px solid ${AppColors.textMuted}`,
  focus: `2px solid ${AppColors.primary}`,
} as const;
