# Quickstart: Listify Core

**Branch**: `004-listify-core` | **Data**: 2026-01-20 | **Plan**: [plan.md](./plan.md)

Guia rápido para começar a desenvolver no Listify Core.

---

## 1. Pré-requisitos

- Node.js 20+ (LTS)
- npm 10+
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (para emulador Android) ou Xcode (para iOS)
- Git

---

## 2. Setup do Ambiente

```bash
# Clone e navegue para o diretório
cd /home/elias/workspace/Listify/.worktrees/004-listify-core

# Instale dependências
npm install

# Verifique se está tudo ok
npm run lint
npm test
```

---

## 3. Executar o App

```bash
# Modo desenvolvimento (recomendado)
npm start

# Android
npm run android

# iOS (requer macOS)
npm run ios

# Web (para debug rápido)
npm run web
```

---

## 4. Storybook (Design System)

```bash
# Iniciar Storybook para visualizar componentes
npm run storybook

# Gerar index de stories (se adicionar novos componentes)
npm run storybook:generate
```

---

## 5. Estrutura de Pastas

```text
src/
├── app/                  # Bootstrap, DI, i18n
├── domain/               # ✅ Pronto - Entidades e ports
├── data/                 # 🆕 Implementar - Mappers
├── infra/                # 🆕 Implementar - Repositories, Services
├── presentation/         # 🆕 Implementar - Screens, Stores, Hooks
└── design-system/        # 🔄 Parcial - Tokens, Atoms, Molecules, Organisms

app/                      # Expo Router (file-based routing)
tests/                    # Testes unitários e de integração
```

---

## 6. Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia Expo dev server |
| `npm run android` | Executa no Android |
| `npm run ios` | Executa no iOS |
| `npm run web` | Executa no navegador |
| `npm run lint` | Verifica ESLint (zero warnings) |
| `npm test` | Executa testes Jest |
| `npm test -- --watch` | Testes em modo watch |
| `npm run storybook` | Inicia Storybook |
| `npm run ds generate atom Button` | Gera componente atom |
| `npm run ds generate molecule Card` | Gera componente molecule |

---

## 7. Fluxo de Desenvolvimento

### 7.1 Domain Layer (TDD Obrigatório)

```bash
# 1. Escreva o teste PRIMEIRO
# tests/domain/list/list.entity.test.ts

# 2. Execute para ver falhar (RED)
npm test -- list

# 3. Implemente para passar (GREEN)
# src/domain/list/entities/list.entity.ts

# 4. Refatore mantendo testes passando (REFACTOR)
```

### 7.2 Data Layer (Mappers - TDD Obrigatório)

```bash
# 1. Escreva o teste
# tests/data/mappers/list.mapper.test.ts

# 2. Implemente o mapper
# src/data/mappers/list.mapper.ts
```

### 7.3 Infrastructure Layer (Repositories)

```bash
# 1. Defina o schema Drizzle
# src/infra/drizzle/schema.ts

# 2. Gere migrations
npx drizzle-kit generate

# 3. Implemente o repository
# src/infra/repositories/DrizzleListRepository.ts
```

### 7.4 Presentation Layer (Stores e Screens)

```bash
# 1. Crie o store Zustand
# src/presentation/stores/useListStore.ts

# 2. Crie a screen
# src/presentation/screens/ListsScreen.tsx

# 3. Configure a rota
# app/(tabs)/lists.tsx
```

### 7.5 Design System (Componentes)

```bash
# SEMPRE use a CLI para criar componentes
npm run ds generate atom Button
npm run ds generate molecule SearchBar
npm run ds generate organism Navbar

# Visualize no Storybook
npm run storybook
```

---

## 8. Convenções de Código

### Imports

```typescript
// ✅ Use path aliases
import { List } from '@domain/list';
import { useTheme } from '@design-system/theme';

// ❌ Evite imports relativos profundos
import { List } from '../../../domain/list/entities/list.entity';
```

### Componentes

```typescript
// ✅ Use ReactElement como tipo de retorno
function MyComponent(): ReactElement {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return <View style={styles.container} />;
}

// ✅ Defina props em arquivo .types.ts
// MyComponent.types.ts
export interface MyComponentProps {
  title: string;
  onPress?: () => void;
}
```

### Stores

```typescript
// ✅ Padrão de optimistic update com rollback
const backup = get().items;
set({ items: [...backup, newItem] }); // Optimistic

try {
  const created = await repository.create(input);
  set({ items: get().items.map(i => i.id === newItem.id ? created : i) });
} catch {
  set({ items: backup }); // Rollback
}
```

---

## 9. Checklist Pre-Commit

```bash
# Execute antes de cada commit
npm test && npm run lint

# Se tudo passar, faça o commit
git add .
git commit -m "feat: descrição"
```

---

## 10. Debugging

### React Native Debugger

```bash
# Pressione 'j' no terminal do Expo para abrir debugger
# Ou use Flipper para debugging avançado
```

### SQLite Database

```bash
# Use Drizzle Studio para inspecionar o banco
# Disponível automaticamente em desenvolvimento
```

### Logs

```typescript
// Use console.debug para logs de debug
console.debug('[MyComponent] state:', state);

// Logs aparecem no terminal do Expo
```

---

## 11. Links Úteis

| Recurso | Link |
|---------|------|
| Spec | [spec.md](./spec.md) |
| Plan | [plan.md](./plan.md) |
| Research | [research.md](./research.md) |
| Data Model | [data-model.md](./data-model.md) |
| Smart Input Contract | [contracts/smart-input-parser.contract.md](./contracts/smart-input-parser.contract.md) |
| CLAUDE.md | [/CLAUDE.md](../../CLAUDE.md) |
| Constitution | [/.specify/memory/constitution.md](../../.specify/memory/constitution.md) |
| Design System README | [/src/design-system/README.md](../../src/design-system/README.md) |

---

## 12. Próximos Passos

1. **Implementar Drizzle Schema** (`src/infra/drizzle/schema.ts`)
2. **Implementar Mappers** (`src/data/mappers/*.ts`)
3. **Implementar Repositories** (`src/infra/repositories/*.ts`)
4. **Configurar DI Container** (`src/app/di/container.ts`)
5. **Implementar Stores** (`src/presentation/stores/*.ts`)
6. **Implementar Screens** (`src/presentation/screens/*.tsx`)
7. **Configurar Expo Router** (`app/(tabs)/*.tsx`)

Consulte [tasks.md](./tasks.md) (gerado por `/speckit.tasks`) para a lista completa de tarefas ordenadas por dependência.
