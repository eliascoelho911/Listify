export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

export type Colors = {
  brand: ColorScale;
  accent: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  danger: ColorScale;
  background: {
    canvas: string;
    muted: string;
    surface: string;
    raised: string;
    overlay: string;
  };
  content: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  border: {
    subtle: string;
    strong: string;
    muted: string;
  };
};

const brand: ColorScale = {
  50: '#e8f7f2',
  100: '#c9ecdf',
  200: '#9edbc5',
  300: '#71c7a7',
  400: '#44b38c',
  500: '#2b9c78',
  600: '#1d8465',
  700: '#166b54',
  800: '#125442',
  900: '#0c3b2f',
};

const accent: ColorScale = {
  50: '#eef2ff',
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#818cf8',
  500: '#6366f1',
  600: '#4f46e5',
  700: '#4338ca',
  800: '#3730a3',
  900: '#312e81',
};

const neutral: ColorScale = {
  50: '#f8fafc',
  100: '#eef2f6',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#9aa5b8',
  500: '#6b768e',
  600: '#4b556b',
  700: '#353e54',
  800: '#232b3c',
  900: '#161c2a',
};

const success: ColorScale = {
  50: '#ecfdf3',
  100: '#d1fadf',
  200: '#a6f4c5',
  300: '#72e1a4',
  400: '#42cc85',
  500: '#22b36d',
  600: '#19985b',
  700: '#167a4c',
  800: '#125e3b',
  900: '#0d452c',
};

const warning: ColorScale = {
  50: '#fffbeb',
  100: '#fef3c7',
  200: '#fde58a',
  300: '#f9d24d',
  400: '#f2b533',
  500: '#e3961a',
  600: '#c67512',
  700: '#9f5710',
  800: '#7d430f',
  900: '#65350d',
};

const danger: ColorScale = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fdcaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444',
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
};

export const colors: Colors = {
  brand,
  accent,
  neutral,
  success,
  warning,
  danger,
  background: {
    canvas: '#f5f7fb',
    muted: '#edf1f7',
    surface: '#ffffff',
    raised: '#fdfefe',
    overlay: 'rgba(22, 27, 40, 0.16)',
  },
  content: {
    primary: neutral[900],
    secondary: neutral[700],
    muted: neutral[500],
    inverse: '#ffffff',
  },
  border: {
    subtle: neutral[200],
    muted: neutral[300],
    strong: neutral[400],
  },
};
