# Data Model: Design System

**Feature**: 001-design-system
**Data**: 2026-01-09
**Fase**: Phase 1 - Design

## Visão Geral

Este documento modela a estrutura de dados do Design System, incluindo tokens, themes, component variants e hierarquia Atomic Design. Não há persistência em banco de dados - tudo é definido em código TypeScript.

---

## 1. Design Tokens

### 1.1 Colors

```typescript
/**
 * Formato HSL seguindo padrão Shadcn
 * Exemplo: "220 14.3% 95.9%" (hue saturation lightness)
 */
type ColorValue = string;

/**
 * Tokens de cor Shadcn completos
 */
interface ShadcnColors {
  background: ColorValue;
  foreground: ColorValue;

  card: ColorValue;
  cardForeground: ColorValue;

  popover: ColorValue;
  popoverForeground: ColorValue;

  primary: ColorValue;
  primaryForeground: ColorValue;

  secondary: ColorValue;
  secondaryForeground: ColorValue;

  muted: ColorValue;
  mutedForeground: ColorValue;

  accent: ColorValue;
  accentForeground: ColorValue;

  destructive: ColorValue;
  destructiveForeground: ColorValue;

  border: ColorValue;
  input: ColorValue;
  ring: ColorValue;
}

/**
 * Tokens customizados para topbar
 */
interface TopbarColors {
  topbar: ColorValue;
  topbarForeground: ColorValue;

  topbarPrimary: ColorValue;
  topbarPrimaryForeground: ColorValue;

  topbarAccent: ColorValue;
  topbarAccentForeground: ColorValue;

  topbarBorder: ColorValue;
  topbarRing: ColorValue;
}

/**
 * Paleta completa de cores do Design System
 */
interface Colors extends ShadcnColors, TopbarColors {
  // Paleta base: Gray "chumbo"
  gray: {
    50: ColorValue;
    100: ColorValue;
    200: ColorValue;
    300: ColorValue;
    400: ColorValue;
    500: ColorValue;   // Base "chumbo"
    600: ColorValue;
    700: ColorValue;
    800: ColorValue;
    900: ColorValue;
  };

  // Tema: Cyan
  cyan: {
    50: ColorValue;
    100: ColorValue;
    200: ColorValue;
    300: ColorValue;
    400: ColorValue;
    500: ColorValue;   // Cyan principal
    600: ColorValue;
    700: ColorValue;
    800: ColorValue;
    900: ColorValue;
  };
}
```

**Regras de Validação**:
- Todos os ColorValue MUST estar no formato HSL: "H S% L%"
- Paleta gray MUST usar tonalidades de gray "chumbo" (baixa saturação, tons cinza-azulados escuros)
- Paleta cyan MUST ser baseada em cyan (#00BCD4 como referência)
- Contraste MUST atingir WCAG AA mínimo entre foreground/background

---

### 1.2 Typography

```typescript
/**
 * Famílias de fonte
 */
interface FontFamilies {
  body: 'Fira Sans';      // Sans-serif para textos
  mono: 'Fira Code';      // Monospace para código
}

/**
 * Pesos de fonte
 */
type FontWeight = 400 | 500 | 600 | 700;

interface FontWeights {
  regular: 400;
  medium: 500;
  semibold: 600;
  bold: 700;
}

/**
 * Tamanhos de fonte (em pixels)
 */
interface FontSizes {
  xs: number;    // 12px
  sm: number;    // 14px
  base: number;  // 16px
  lg: number;    // 18px
  xl: number;    // 20px
  '2xl': number; // 24px
  '3xl': number; // 30px
  '4xl': number; // 36px
}

/**
 * Line heights
 */
interface LineHeights {
  tight: number;   // 1.2
  normal: number;  // 1.5
  relaxed: number; // 1.75
}

/**
 * Tokens de tipografia completos
 */
interface Typography {
  families: FontFamilies;
  weights: FontWeights;
  sizes: FontSizes;
  lineHeights: LineHeights;
}
```

**Regras de Validação**:
- families.body MUST ser "Fira Sans"
- families.mono MUST ser "Fira Code"
- Fontes MUST ser carregadas via expo-font antes de usar
- Todos os sizes MUST ser múltiplos de 2 (design system harmony)

---

### 1.3 Spacing (Compacto)

```typescript
/**
 * Escala de espaçamento compacta
 * Valores menores que Shadcn padrão para UI mais densa
 */
interface Spacing {
  xs: number;   // 4px  (Shadcn: 8px)
  sm: number;   // 8px  (Shadcn: 16px)
  md: number;   // 12px (Shadcn: 24px)
  lg: number;   // 16px (Shadcn: 32px)
  xl: number;   // 24px (Shadcn: 48px)
  xxl: number;  // 32px (Shadcn: 64px)
}
```

**Regras de Validação**:
- Todos os valores MUST ser múltiplos de 4 (8pt grid)
- Valores MUST ser menores que Shadcn padrão (spacing compacto)
- Touch targets MUST manter mínimo 44x44px mesmo com spacing compacto (acessibilidade)

---

### 1.4 Radii (Large)

```typescript
/**
 * Border radius - Large scale
 */
interface Radii {
  none: number;   // 0px
  sm: number;     // 8px  (small exceptions)
  md: number;     // 12px (medium)
  lg: number;     // 16px (large - padrão)
  xl: number;     // 24px (extra large)
  full: number;   // 9999px (circular)
}
```

**Regras de Validação**:
- Padrão MUST ser lg (16px)
- Componentes pequenos (badges, pills) SHOULD usar xl ou full
- Containers grandes (cards, modals) SHOULD usar lg
- sm RESERVED para casos excepcionais (não padrão)

---

### 1.5 Animations

```typescript
/**
 * Durações de animação (milliseconds)
 */
interface AnimationDurations {
  fast: number;     // 150ms - micro-interactions
  normal: number;   // 300ms - standard transitions
  slow: number;     // 500ms - complex animations
}

/**
 * Easing curves
 */
interface AnimationEasings {
  easeIn: string;      // 'cubic-bezier(0.4, 0, 1, 1)'
  easeOut: string;     // 'cubic-bezier(0, 0, 0.2, 1)'
  easeInOut: string;   // 'cubic-bezier(0.4, 0, 0.2, 1)'
  spring: string;      // 'cubic-bezier(0.34, 1.56, 0.64, 1)' - bounce effect
}

/**
 * Tokens de animação completos
 */
interface Animations {
  durations: AnimationDurations;
  easings: AnimationEasings;
}
```

**Regras de Validação**:
- Animações MUST respeitar reduced motion preference (acessibilidade)
- Durações MUST manter 60fps (usar Reanimated, não Animated API)
- Easing curves MUST ser consistentes em todo o DS

---

### 1.6 Shadows (Elevation)

```typescript
/**
 * Elevation levels (sombras)
 */
interface Shadows {
  none: ShadowStyle;
  sm: ShadowStyle;    // Elevation 1
  md: ShadowStyle;    // Elevation 2
  lg: ShadowStyle;    // Elevation 3
  xl: ShadowStyle;    // Elevation 4
}

/**
 * React Native shadow style
 */
interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android
}
```

---

## 2. Theme

### 2.1 Theme Structure

```typescript
/**
 * Theme mode
 */
type ThemeMode = 'light' | 'dark';

/**
 * Theme completo
 */
interface Theme {
  mode: ThemeMode;
  colors: Colors;          // Valores específicos do theme
  typography: Typography;  // Compartilhado entre themes
  spacing: Spacing;        // Compartilhado entre themes
  radii: Radii;           // Compartilhado entre themes
  animations: Animations;  // Compartilhado entre themes
  shadows: Shadows;        // Valores específicos do theme
}
```

### 2.2 Theme Values

```typescript
/**
 * Dark Theme (padrão)
 */
const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: gray[900],      // Background escuro
    foreground: gray[50],       // Texto claro
    primary: cyan[500],         // Cyan principal
    primaryForeground: gray[900],
    // ... outros tokens usando gray escuro + cyan
  },
  // typography, spacing, radii, animations são compartilhados
};

/**
 * Light Theme
 */
const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: gray[50],       // Background claro
    foreground: gray[900],      // Texto escuro
    primary: cyan[600],         // Cyan mais escuro (contraste)
    primaryForeground: gray[50],
    // ... outros tokens usando gray claro + cyan
  },
  // typography, spacing, radii, animations são compartilhados
};
```

**Regras de Validação**:
- Dark theme MUST ser padrão inicial
- Paleta MUST manter cyan/gray em ambos themes
- Contraste MUST atingir WCAG AA em ambos themes
- Theme switching MUST ser instantâneo (sem reload)

---

## 3. Theme Provider State

```typescript
/**
 * Estado do theme provider
 */
interface ThemeProviderState {
  theme: Theme;                           // Theme atual
  mode: ThemeMode;                        // Mode atual
  setMode: (mode: ThemeMode) => void;     // Switch theme
  toggleMode: () => void;                 // Toggle dark/light
}

/**
 * Persistência de preferência
 */
interface ThemePreference {
  mode: ThemeMode;
  lastUpdated: number; // timestamp
}
```

**Storage**:
- AsyncStorage key: `@listify:theme-preference`
- Default: `{ mode: 'dark', lastUpdated: Date.now() }`

**Regras de Validação**:
- Theme preference MUST ser carregada antes de render
- Se não houver preferência salva, usar 'dark' (padrão)
- setMode() MUST persistir em AsyncStorage
- Detecção de system preference (Appearance.getColorScheme()) é ignorada - dark é sempre padrão inicial

---

## 4. Component Variants

### 4.1 Button Atom

```typescript
/**
 * Button variants (visual styles)
 */
type ButtonVariant =
  | 'default'      // Filled com primary color
  | 'destructive'  // Filled com destructive color
  | 'outline'      // Border com background transparente
  | 'ghost'        // Apenas text, sem border/background
  | 'link';        // Text underlined, comportamento de link

/**
 * Button sizes
 */
type ButtonSize =
  | 'sm'    // Small - height 32px
  | 'md'    // Medium - height 40px (padrão)
  | 'lg'    // Large - height 48px
  | 'icon'; // Square - 40x40px para icon-only

/**
 * Button props
 */
interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  children: React.ReactNode;
}
```

**Regras de Validação**:
- variant default: 'default'
- size default: 'md'
- disabled MUST reduzir opacity a 0.5 e desabilitar onPress
- loading MUST mostrar spinner e desabilitar onPress
- Todos os variants MUST usar tokens (zero hard-coded colors)

---

### 4.2 Input Atom

```typescript
/**
 * Input states
 */
type InputState =
  | 'default'
  | 'focus'
  | 'error'
  | 'disabled';

/**
 * Input props
 */
interface InputProps extends TextInputProps {
  state?: InputState;
  error?: string;
  label?: string;
  required?: boolean;
}
```

---

### 4.3 Badge Atom

```typescript
/**
 * Badge variants
 */
type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline';

/**
 * Badge props
 */
interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}
```

---

### 4.4 Icon Atom

```typescript
/**
 * Icon sizes
 */
type IconSize = number; // 16, 20, 24, 32, 40

/**
 * Icon props (wrapper para Lucide)
 */
interface IconProps {
  name: keyof typeof LucideIcons;
  size?: IconSize;
  color?: ColorValue;
  strokeWidth?: number;
}
```

---

## 5. Atomic Design Hierarchy

### 5.1 Component Types

```typescript
/**
 * Atomic Design levels
 */
type AtomicLevel =
  | 'atom'      // Indivisible (Button, Input, Icon)
  | 'molecule'  // Composition of atoms (FormField = Label + Input)
  | 'organism'  // Complex composition (Navbar, ShoppingListCard)
  | 'template'  // Layout structure (no data)
  | 'page';     // Template + data

/**
 * Component metadata
 */
interface ComponentMetadata {
  level: AtomicLevel;
  name: string;
  description: string;
  dependencies: string[]; // Component names this depends on
}
```

### 5.2 Import Rules

```typescript
/**
 * Regras de import por nível (enforçadas por ESLint)
 */
const IMPORT_RULES = {
  atom: ['@design-system/tokens'],
  molecule: ['@design-system/tokens', '@design-system/atoms'],
  organism: ['@design-system/tokens', '@design-system/atoms', '@design-system/molecules'],
  template: ['@design-system/tokens', '@design-system/atoms', '@design-system/molecules', '@design-system/organisms'],
  page: ['@design-system/tokens', '@design-system/atoms', '@design-system/molecules', '@design-system/organisms', '@design-system/templates'],
};
```

**Regras de Validação**:
- Atoms CANNOT import other atoms
- Molecules CANNOT import other molecules or organisms
- Organisms CANNOT import templates or pages
- Templates CANNOT import pages
- Todas as regras MUST ser enforçadas por ESLint customizado

---

## 6. Storybook Story Structure

```typescript
/**
 * Story metadata
 */
interface StoryMetadata {
  title: string;                    // 'Atoms/Button' ou 'Molecules/FormField'
  component: React.ComponentType;
  tags: string[];                   // ['autodocs']
}

/**
 * Story args (controles)
 */
interface StoryArgs {
  [key: string]: any;
}

/**
 * Story template
 */
type StoryTemplate<T> = (args: T) => React.ReactElement;
```

---

## Diagrama de Relacionamentos

```
Tokens (colors, typography, spacing, radii, animations)
  ↓ usado por
Theme (dark/light)
  ↓ provido por
ThemeProvider
  ↓ consumido por
Atoms (Button, Input, Label, Badge, Icon)
  ↓ compostos em
Molecules (FormField, SearchBar)
  ↓ compostos em
Organisms (Navbar, ShoppingListCard)
  ↓ compostos em
Templates (layout structures)
  ↓ + data =
Pages (screens do app)
```

---

## Regras de Negócio Globais

1. **Zero Hard-coded Values**: Todos os componentes MUST usar apenas tokens
2. **Theme Consistency**: Paleta cyan/gray MUST ser mantida em dark e light themes
3. **Atomic Hierarchy**: Import rules MUST ser respeitadas (enforçado por ESLint)
4. **Accessibility**: Contraste WCAG AA, touch targets 44x44px, reduced motion support
5. **Performance**: Animações 60fps (Reanimated), theme switching instantâneo
6. **Offline-First**: Theme preference persistida localmente (AsyncStorage)
7. **Typography**: Fira Sans/Code MUST ser carregadas via expo-font
8. **Icons**: Lucide MUST ser tree-shakeable (apenas ícones usados)
9. **Large Radius**: Default border radius MUST ser lg (16px)
10. **Compact Spacing**: Spacing values MUST ser menores que Shadcn padrão
