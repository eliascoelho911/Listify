# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start Expo dev server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm run web` | Run on web |
| `npm run lint` | Run ESLint (zero warnings policy) |
| `npm test` | Run Jest tests |

**Pre-commit**: `npm test && npm run lint`

## Architecture

Listify is a React Native shopping list app using **Clean Architecture**:

```
src/
├── app/          # Bootstrap, DI container, i18n setup
├── domain/       # Pure business logic (no React/RN imports enforced by ESLint)
│   └── shopping/ # Entities, value-objects, ports, use-cases
├── data/         # Mappers (SQLite row → domain entity)
├── infra/        # SQLite implementation, external services
├── presentation/ # React components, screens, Zustand stores, hooks
└── design-system/# Theme tokens (colors, spacing, typography), DS components
```

**Dependency flow**: `app` → `presentation` → `domain` ← `data` → `infra`

**File-based routing**: `app/` directory uses Expo Router

## Key Patterns

- **State**: Zustand with optimistic updates and rollback on error
- **DI**: Container in `src/app/di/container.ts` with async bootstrap
- **Repository**: `ShoppingRepository` interface in domain, SQLite impl in infra
- **Path aliases**: `@domain/*`, `@presentation/*`, `@infra/*`, `@data/*`, `@app/*`, `@design-system/*`
- **Reactive Clean Architecture**: Pattern for features with reactive data - see [`docs/REACTIVE_CLEAN_ARCHITECTURE.md`](./docs/REACTIVE_CLEAN_ARCHITECTURE.md)

## Coding Guidelines

### TypeScript - Strongly Typed Development (MANDATORY)
**ALWAYS develop with strong typing. Avoid any implicit types or loose typing patterns.**

- Use explicit types for ALL function parameters, return types, and variables
  - ❌ WRONG: `function getData(data) { ... }`
  - ✅ RIGHT: `function getData(data: ShoppingItem[]): Promise<void> { ... }`
- Use `ReactElement` for component return types (not `JSX.Element`)
- Use `StyleProp<TextStyle>` or `StyleProp<ViewStyle>` for React Native style props (never use arrays directly as `TextStyle`)
- Never use implicit `any` type - always use explicit types or generics
- Define proper types for all component props (use interfaces/types in `.types.ts` files)
- Use generics where appropriate: `Array<T>`, `Optional<T>`, etc.
- Strict mode enabled - TypeScript errors MUST be resolved, never ignored
- Avoid `unknown` unless necessary; prefer specific types

### Internationalization (Required)
- All UI text must use `t()` or `<Trans />` from react-i18next
- Supported: pt-BR, en (fallback: `en`)
- User data (item names, custom categories) is NOT translated
- Use `FALLBACK_LOCALE` constant from `src/domain/shopping/constants.ts`
- Format currency/numbers/dates with `Intl.*Format` + active locale

### Design System (src/design-system/)

**CRITICAL**: Follow Atomic Design methodology with strict hierarchy and token-based styling.

**Design Philosophy**: O Design System do Listify é um **remix inspirado no Shadcn UI** - usamos a filosofia e estrutura de tokens do Shadcn como base, mas com customizações significativas para atender a identidade visual e requisitos mobile-first do Listify. Não é uma implementação completa do Shadcn, mas sim uma adaptação com componentes e tokens próprios.

**Principais diferenças em relação ao Shadcn**:
- Tipografia customizada (Fira Sans/Code vs system fonts)
- Espaçamento compacto (25-33% menor para otimização mobile)
- Border radius large (50-100% maior para identidade playful)
- Dark theme como padrão (não segue system preference)
- Componentes adaptados para React Native (não são ports diretos do Shadcn Web)

#### Component Creation Workflow

**ALWAYS use CLI to create components** (NEVER create manually):
```bash
npm run ds generate atom ComponentName      # For atoms
npm run ds generate molecule ComponentName  # For molecules
npm run ds generate organism ComponentName  # For organisms
```

CLI generates 5 files automatically:
- `Component.tsx` - Main component (uses `useTheme()` hook)
- `Component.styles.ts` - Style factory with theme tokens
- `Component.types.ts` - TypeScript interfaces
- `Component.stories.tsx` - Storybook documentation
- `Component.test.tsx` - Jest tests

#### Mandatory Rules (Enforced by ESLint)

1. **Zero Hard-Coded Values** (ESLint: `no-hardcoded-values`)
   - ❌ NEVER: `backgroundColor: '#06b6d4'`, `padding: 16`, `fontSize: 14`
   - ✅ ALWAYS: `backgroundColor: theme.colors.primary`, `padding: theme.spacing.lg`, `fontSize: theme.typography.sizes.sm`

2. **Use `useTheme()` Hook** (ESLint: `theme-provider-usage`)
   - ❌ NEVER import theme directly: `import { darkTheme } from '@design-system/theme/theme'`
   - ✅ ALWAYS use hook: `const { theme } = useTheme()`

3. **Respect Atomic Design Hierarchy** (ESLint: `atomic-design-imports`)
   - **Atoms** → can import: tokens, theme, utils | ❌ CANNOT: molecules, organisms
   - **Molecules** → can import: atoms, tokens, theme, utils | ❌ CANNOT: other molecules, organisms
   - **Organisms** → can import: atoms, molecules, tokens, theme, utils | ❌ CANNOT: templates, pages

#### Component Structure Template

```typescript
// Component.tsx
import { useTheme } from '../../theme';
import { createComponentStyles } from './Component.styles';
import type { ComponentProps } from './Component.types';

export function Component(props: ComponentProps): ReactElement {
  const { theme } = useTheme(); // ✅ Required hook
  const styles = createComponentStyles(theme);
  return <View style={styles.container}>{props.children}</View>;
}

// Component.styles.ts
export const createComponentStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,     // ✅ Token
      padding: theme.spacing.md,              // ✅ Token
      borderRadius: theme.radii.lg,           // ✅ Token
      fontFamily: theme.typography.families.body, // ✅ Token
    },
  });
};
```

#### Available Tokens

- **Colors**: `theme.colors.{primary, secondary, background, foreground, card, muted, accent, destructive, border, input, ring, topbar, ...}`
- **Spacing**: `theme.spacing.{xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, ...}`
- **Typography**: `theme.typography.{families.body: 'Fira Sans', families.mono: 'Fira Code', sizes.base: 16, weights.semibold: 600, ...}`
- **Radii**: `theme.radii.{sm: 8, md: 12, lg: 16, xl: 24, full: 9999}`

#### Pre-Commit Validation (MANDATORY)

```bash
npm run lint      # ESLint - MUST pass with zero warnings
npm test         # Jest tests - MUST pass
npm run storybook # Visual validation - dark & light themes
```

#### Storybook

View and develop components in isolation:
```bash
npm run storybook              # Start Storybook
npm run storybook:generate     # Regenerate stories index
```

Storybook config: `.rnstorybook/` (React Native specific, not `.storybook/`)

#### Documentation

- Full workflow: `src/design-system/README.md` (has Quick Reference at top)
- Contributing guide: `src/design-system/CONTRIBUTING.md`
- Specialized agent: `.claude/agents/design-system-developer.md` (use proactively!)
- Quick start: `specs/001-design-system/quickstart.md`

**Design philosophy**: Playful, Modern, Friendly - Fira Sans typography, Cyan theme, Gray base, Large radius, Compact spacing

### Exceptions
- Exception messages must be in English

### Debugging
- Add debug logs with `console.debug` for future issue tracking

## Testing

Tests located in `tests/` following same structure as `src/`:
- `tests/domain/` - Business logic tests
- `tests/data/` - Mapper tests
- `tests/presentation/` - Hook/component tests

Run single test: `npm test -- <pattern>`
