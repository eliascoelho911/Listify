import type { Colors, Radii, Shadows, Spacing, Typography } from '../tokens';
import { colors, radii, shadows, spacing, typography } from '../tokens';

export type Theme = {
  colors: Colors;
  spacing: Spacing;
  radii: Radii;
  shadows: Shadows;
  typography: Typography;
};

export const theme: Theme = {
  colors,
  spacing,
  radii,
  shadows,
  typography,
};
