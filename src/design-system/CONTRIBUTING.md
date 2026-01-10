# Contributing to Listify Design System

Obrigado por contribuir com o Design System do Listify! Este guia ajudará você a adicionar novos componentes seguindo nossos padrões.

## Antes de Começar

1. Leia o [README.md](./README.md) completo para entender a arquitetura
2. Familiarize-se com:
   - Atomic Design (atoms → molecules → organisms → templates → pages)
   - Design tokens (colors, spacing, typography, radius)
   - ESLint rules customizadas (no-hardcoded-values, atomic-design-imports, theme-provider-usage)
3. Configure seu ambiente:
   ```bash
   npm install
   npm run lint
   npm test
   ```

## Processo de Contribuição

### 1. Planeje o Componente

Antes de escrever código, responda:

**a) Qual nível da hierarquia Atomic Design?**
- **Atom**: Indivisível (Button, Input, Icon, Badge)
- **Molecule**: 2-3 atoms combinados (FormField = Label + Input)
- **Organism**: Múltiplos atoms/molecules (Navbar, ShoppingListCard)
- **Template**: Layout de página reutilizável
- **Page**: Template com conteúdo real

**b) Já existe um componente similar?**
- Verifique no Storybook antes de criar duplicata
- Considere expandir componente existente com props

**c) Quais atoms/molecules preciso?**
- Liste dependências
- Certifique-se que respeitam hierarquia (molecules não importam organisms!)

### 2. Crie a Estrutura de Arquivos

**Para um Atom chamado "Avatar"**:
```bash
src/design-system/atoms/Avatar/
├── Avatar.tsx              # Componente principal
├── Avatar.styles.ts        # Styles factory
├── Avatar.types.ts         # TypeScript interfaces
└── Avatar.stories.tsx      # Storybook stories
```

**Para uma Molecule chamada "UserProfile"**:
```bash
src/design-system/molecules/UserProfile/
├── UserProfile.tsx
├── UserProfile.styles.ts
├── UserProfile.types.ts
└── UserProfile.stories.tsx
```

### 3. Implemente o Componente

#### Avatar.types.ts
```typescript
/**
 * Avatar Atom Types
 */

import type { ViewProps } from 'react-native';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends Omit<ViewProps, 'style'> {
  /**
   * Avatar image source
   */
  source?: string;

  /**
   * Fallback initials
   */
  initials?: string;

  /**
   * Avatar size
   */
  size?: AvatarSize;
}
```

#### Avatar.styles.ts
```typescript
/**
 * Avatar Atom Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';
import type { AvatarSize } from './Avatar.types';

export const createAvatarStyles = (theme: Theme) => {
  const baseStyles = StyleSheet.create({
    avatar: {
      borderRadius: theme.radii.full, // ✅ Usa token
      overflow: 'hidden',
      backgroundColor: theme.colors.muted, // ✅ Usa token
      alignItems: 'center',
      justifyContent: 'center',
    },
    initials: {
      fontFamily: theme.typography.families.body, // ✅ Usa token
      fontWeight: theme.typography.weights.semibold, // ✅ Usa token
      color: theme.colors['muted-foreground'], // ✅ Usa token
    },
  });

  const sizeStyles: Record<AvatarSize, any> = {
    sm: {
      avatar: { width: 32, height: 32 },
      initials: { fontSize: theme.typography.sizes.sm },
    },
    md: {
      avatar: { width: 40, height: 40 },
      initials: { fontSize: theme.typography.sizes.base },
    },
    lg: {
      avatar: { width: 48, height: 48 },
      initials: { fontSize: theme.typography.sizes.lg },
    },
    xl: {
      avatar: { width: 64, height: 64 },
      initials: { fontSize: theme.typography.sizes.xl },
    },
  };

  return { baseStyles, sizeStyles };
};
```

**⚠️ IMPORTANTE: ZERO hard-coded values!**
```typescript
// ❌ ERRADO
backgroundColor: '#06b6d4'
padding: 16
borderRadius: 12

// ✅ CORRETO
backgroundColor: theme.colors.primary
padding: theme.spacing.lg
borderRadius: theme.radii.lg
```

#### Avatar.tsx
```typescript
/**
 * Avatar Atom Component
 */

import React, { type ReactElement } from 'react';
import { Image, Text, View } from 'react-native';

import { useTheme } from '../../theme';
import { createAvatarStyles } from './Avatar.styles';
import type { AvatarProps } from './Avatar.types';

export function Avatar({
  source,
  initials,
  size = 'md',
  ...viewProps
}: AvatarProps): ReactElement {
  const { theme } = useTheme(); // ✅ SEMPRE use useTheme()
  const styles = createAvatarStyles(theme);

  const avatarStyle = [styles.baseStyles.avatar, styles.sizeStyles[size].avatar];
  const initialsStyle = [styles.baseStyles.initials, styles.sizeStyles[size].initials];

  return (
    <View style={avatarStyle} {...viewProps}>
      {source ? (
        <Image source={{ uri: source }} style={{ width: '100%', height: '100%' }} />
      ) : (
        <Text style={initialsStyle}>{initials}</Text>
      )}
    </View>
  );
}
```

#### Avatar.stories.tsx
```typescript
/**
 * Avatar Atom Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { ThemeProvider } from '../../theme';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20, gap: 16 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  args: {
    source: 'https://i.pravatar.cc/150?img=1',
    size: 'md',
  },
};

export const WithInitials: Story = {
  args: {
    initials: 'JD',
    size: 'md',
  },
};

export const Sizes: Story = {
  render: () => (
    <>
      <Avatar initials="SM" size="sm" />
      <Avatar initials="MD" size="md" />
      <Avatar initials="LG" size="lg" />
      <Avatar initials="XL" size="xl" />
    </>
  ),
};
```

### 4. Adicione ao Barrel Export

**Atoms**: `src/design-system/atoms/index.ts`
```typescript
// Avatar
export { Avatar } from './Avatar/Avatar';
export type { AvatarProps, AvatarSize } from './Avatar/Avatar.types';
```

**Molecules**: `src/design-system/molecules/index.ts`
```typescript
// UserProfile
export { UserProfile } from './UserProfile/UserProfile';
export type { UserProfileProps } from './UserProfile/UserProfile.types';
```

### 5. Crie Testes

`tests/design-system/atoms/Avatar.test.tsx`:
```typescript
/**
 * Avatar Atom Tests
 */

import { render } from '@testing-library/react-native';
import React from 'react';

import { Avatar } from '@design-system/atoms/Avatar/Avatar';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Avatar Atom', () => {
  it('should render with initials', () => {
    const { getByText } = renderWithTheme(<Avatar initials="JD" />);
    expect(getByText('JD')).toBeTruthy();
  });

  it('should render with image source', () => {
    const { getByRole } = renderWithTheme(
      <Avatar source="https://example.com/avatar.jpg" />,
    );
    // Validar que Image foi renderizada
  });

  it('should apply correct size styles', () => {
    const { getByText } = renderWithTheme(<Avatar initials="SM" size="sm" />);
    expect(getByText('SM')).toBeTruthy();
  });
});
```

### 6. Execute Validações

```bash
# ESLint deve passar com ZERO warnings
npm run lint

# Testes devem passar
npm test

# Visualize no Storybook
npm run storybook
```

### 7. Envie Pull Request

**Título do PR**:
```
feat(ds): add Avatar atom component
```

**Descrição do PR**:
```markdown
## Resumo
Adiciona componente Avatar atom com suporte a imagem e initials fallback.

## Implementação
- [x] Avatar.tsx com 4 tamanhos (sm, md, lg, xl)
- [x] Avatar.styles.ts usando tokens (radii.full, colors.muted)
- [x] Avatar.types.ts com AvatarProps e AvatarSize
- [x] Avatar.stories.tsx com 3 stories (image, initials, sizes)
- [x] Avatar.test.tsx com 3 testes
- [x] Barrel export atualizado

## Checklist
- [x] Zero hard-coded values (ESLint passa)
- [x] useTheme() usado corretamente
- [x] Storybook stories criadas
- [x] Testes escritos e passando
- [x] TypeScript sem erros
- [x] README.md atualizado (se necessário)

## Screenshots
[Screenshot do Storybook mostrando Avatar em diferentes tamanhos]
```

## Diretrizes de Código

### Use TypeScript Strict
```typescript
// ✅ CORRETO
export function Button({ children, variant = 'default' }: ButtonProps): ReactElement {
  // Tipos explícitos
}

// ❌ ERRADO
export function Button({ children, variant }) { // Sem tipos!
  // ...
}
```

### Componentes são ReactElement
```typescript
// ✅ CORRETO
import { type ReactElement } from 'react';

export function Button(): ReactElement {
  return <TouchableOpacity>...</TouchableOpacity>;
}

// ❌ ERRADO
export function Button(): JSX.Element { // Use ReactElement!
  return <TouchableOpacity>...</TouchableOpacity>;
}
```

### Evite `any`
```typescript
// ❌ ERRADO
const styles: any = {};

// ✅ CORRETO
const styles: StyleProp<ViewStyle> = {};
```

### Props com Omit<>
```typescript
// ✅ CORRETO: Remove 'style' do ViewProps para evitar conflito
export interface CardProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode;
}
```

## Hierarquia Atomic Design - Regras

### Atoms
- ✅ Podem importar: `tokens`, `theme`, `utils`
- ❌ NÃO podem importar: `molecules`, `organisms`, `templates`, `pages`

### Molecules
- ✅ Podem importar: `atoms`, `tokens`, `theme`, `utils`
- ❌ NÃO podem importar: `organisms`, `templates`, `pages`, outras `molecules`

### Organisms
- ✅ Podem importar: `atoms`, `molecules`, `tokens`, `theme`, `utils`
- ❌ NÃO podem importar: `templates`, `pages`

**ESLint detecta violações automaticamente!**

## Acessibilidade - Checklist

Todo componente interativo deve ter:

- [ ] `accessibilityLabel` descritivo
- [ ] `accessibilityRole` correto (button, link, header, etc)
- [ ] `accessibilityHint` se ação não for óbvia
- [ ] Touch target mínimo de 44x44 pts
- [ ] Contraste WCAG AA (mínimo 4.5:1 para texto)
- [ ] Suporte a teclado (se aplicável)
- [ ] Estado disabled comunicado

**Exemplo**:
```typescript
<TouchableOpacity
  accessibilityLabel="Delete item"
  accessibilityHint="Removes this item from your shopping list"
  accessibilityRole="button"
  style={{ minHeight: 44, minWidth: 44 }} // Touch target
>
  <Icon icon={Trash} />
</TouchableOpacity>
```

## Perguntas Frequentes

### Como saber se devo criar um Atom ou Molecule?

**Crie um Atom se**:
- Componente é indivisível
- Não depende de outros componentes do DS
- Exemplo: Button, Input, Icon, Badge

**Crie uma Molecule se**:
- Componente combina 2-3 atoms
- Tem propósito funcional específico
- Exemplo: FormField (Label + Input), SearchBar (Input + Icon)

### Posso usar hard-coded values para casos especiais?

**Não.** ESLint vai bloquear. Se precisar de valor específico:
1. Adicione ao tokens (`src/design-system/tokens/`)
2. Use o token via `theme`

### Como adicionar um novo token?

1. Adicione em `src/design-system/tokens/[category].ts`
2. Exporte no barrel `src/design-system/tokens/index.ts`
3. Inclua no `Theme` interface em `src/design-system/theme/theme.ts`
4. Adicione aos `darkTheme` e `lightTheme`

### Preciso adicionar testes?

**Sim.** Todos os componentes precisam de testes básicos validando:
- Renderização sem erros
- Props funcionam corretamente
- Estados diferentes (disabled, loading, etc)

### Meu componente precisa de Storybook?

**Sim.** Stories documentam:
- Todas as variants do componente
- Diferentes estados
- Casos de uso comuns

## Recursos

- [README.md](./README.md) - Documentação completa do DS
- [Atomic Design](https://atomicdesign.bradfrost.com/) - Metodologia
- [Shadcn UI](https://ui.shadcn.com/) - Referência de tokens
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Acessibilidade

## Suporte

Dúvidas? Abra uma issue ou pergunte no canal do time!
