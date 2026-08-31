import { AppBorders } from '../borders/appBorders';
import { AppColors } from '../colors/appColors';
import { AppDurations } from '../durations/appDurations';
import { AppRadius } from '../radius/appRadius';
import { AppShadows } from '../shadows/appShadows';
import { AppSizes } from '../sizes/appSizes';
import { AppSpacing } from '../spacing/appSpacing';
import { AppTypography } from '../typography/appTypography';

export const AppTheme = {
  colors: AppColors,
  spacing: AppSpacing,
  radius: AppRadius,
  borders: AppBorders,
  typography: AppTypography,
  sizes: AppSizes,
  shadows: AppShadows,
  durations: AppDurations,
} as const;
