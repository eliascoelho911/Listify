# Design System Contracts

Este diretório contém os **contratos públicos** (interfaces TypeScript) do Design System. Estes arquivos definem as APIs públicas que todos os consumidores do DS devem usar.

## Arquivos

### `tokens.contract.ts`
Define as interfaces para todos os tokens de design:
- Cores (Shadcn + topbar customizados, gray/cyan palettes)
- Tipografia (Fira Sans/Code)
- Spacing (compacto)
- Radii (large)
- Animations
- Shadows

**Consumidores**: Todos os componentes do DS e app

### `theme.contract.ts`
Define as interfaces para o sistema de temas:
- `Theme` (dark/light)
- `ThemeProvider` component
- `useTheme()` hook
- Theme persistence utilities

**Consumidores**: Root app (ThemeProvider), todos os componentes que precisam acessar theme

### `components.contract.ts`
Define as interfaces para todos os componentes atoms:
- Button (variants, sizes)
- Input (states, error handling)
- Label (required, disabled)
- Badge (variants)
- Icon (Lucide wrapper)
- Card (composite: CardHeader, CardContent, etc)

**Consumidores**: Molecules, Organisms, Templates, Pages

## Propósito

Estes contracts servem para:

1. **Documentação**: API pública clara e autodocumentada
2. **Type Safety**: TypeScript garante uso correto
3. **Contrato**: Mudanças breaking devem ser explícitas
4. **Code Generation**: CLI usa estes contracts como templates
5. **Validation**: ESLint rules podem validar uso correto

## Convenções

- Todos os exports são **públicos** e **estáveis**
- Mudanças breaking requerem major version bump
- JSDoc completo em todos os exports
- Exemplos de uso em todos os componentes principais
- Interfaces nomeadas com sufixo `Props` (ex: `ButtonProps`)
- Types auxiliares sem sufixo (ex: `ButtonVariant`)

## Uso

```typescript
// Import contracts para type checking
import type { ButtonProps, ButtonVariant } from '@design-system/atoms';

// Import componente real
import { Button } from '@design-system/atoms';

// TypeScript garante props corretas
const MyButton: React.FC = () => {
  return (
    <Button variant="default" size="md" onPress={handlePress}>
      Click me
    </Button>
  );
};
```

## Nota Importante

Estes são **contratos de especificação**, não implementações. Durante o planejamento (`/speckit.plan`), estes arquivos servem como blueprint. A implementação real será criada em `src/design-system/` durante as tasks (`/speckit.tasks`).
