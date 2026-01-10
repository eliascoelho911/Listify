import type { ShadowStyleIOS } from 'react-native';

import { colors } from './colors';

export type ShadowToken = ShadowStyleIOS & {
  elevation?: number;
};

export type Shadows = {
  soft: ShadowToken;
  card: ShadowToken;
  overlay: ShadowToken;
};

export const shadows: Shadows = {
  soft: {
    shadowColor: colors.neutral[900],
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  card: {
    shadowColor: colors.neutral[900],
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  overlay: {
    shadowColor: colors.neutral[900],
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
};
