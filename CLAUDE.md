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

## Coding Guidelines

### TypeScript
- Use `ReactElement` for component return types (not `JSX.Element`)
- Strict mode enabled

### Internationalization (Required)
- All UI text must use `t()` or `<Trans />` from react-i18next
- Supported: pt-BR, en (fallback: `en`)
- User data (item names, custom categories) is NOT translated
- Use `FALLBACK_LOCALE` constant from `src/domain/shopping/constants.ts`
- Format currency/numbers/dates with `Intl.*Format` + active locale

### Design System
- No hardcoded colors, spacing, or typography - use tokens from `src/design-system/tokens/`
- Style: Playful, Modern, Friendly - light theme with vibrant pastels

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
