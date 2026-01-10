export type FontWeightKey = 'regular' | 'medium' | 'semibold' | 'bold';

export type Typography = {
  families: {
    heading: string;
    body: string;
    mono: string;
  };
  weights: Record<FontWeightKey, '400' | '500' | '600' | '700'>;
  sizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    display: number;
  };
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
  };
};

export const typography: Typography = {
  families: {
    heading: 'System',
    body: 'System',
    mono: 'Menlo',
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    display: 30,
  },
  lineHeights: {
    tight: 1.15,
    normal: 1.3,
    relaxed: 1.45,
  },
};
