# Listify Design System

Design System completo do Listify seguindo princípios do **Atomic Design** e convenções do **Shadcn**.

## 🚀 Quick Reference (TL;DR)

### Criar Novo Componente

```bash
# Use o CLI (SEMPRE)
npm run ds generate atom MyButton
npm run ds generate molecule MyForm
npm run ds generate organism MyNavbar
```

### Regras Absolutas

1. ✅ SEMPRE usar tokens via `useTheme()` hook
2. ❌ NUNCA hard-code valores (colors, spacing, fonts)
3. ✅ SEMPRE respeitar hierarquia Atomic Design nos imports
4. ✅ SEMPRE validar: `npm run lint && npm test`

### Estrutura de Componente

```typescript
// Component.tsx
import { useTheme } from '../../theme';
import { createComponentStyles } from './Component.styles';

export function Component(props: ComponentProps): ReactElement {
  const { theme } = useTheme(); // ✅ Hook obrigatório
  const styles = createComponentStyles(theme);
  return <View style={styles.container}>{props.children}</View>;
}

// Component.styles.ts
export const createComponentStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,    // ✅ Token
      padding: theme.spacing.md,             // ✅ Token
      borderRadius: theme.radii.lg,          // ✅ Token
      // backgroundColor: '#ffffff',         // ❌ NUNCA
    },
  });
};
```

### Hierarquia de Imports

| Nível     | ✅ Pode importar                       | ❌ NÃO pode          |
| --------- | -------------------------------------- | -------------------- |
| Atoms     | tokens, theme, utils                   | molecules, organisms |
| Molecules | atoms, tokens, theme, utils            | molecules, organisms |
| Organisms | atoms, molecules, tokens, theme, utils | templates, pages     |

### Validação Pré-Commit

```bash
npm run lint      # ESLint (zero warnings)
npm test         # Jest tests
npm run storybook # Validação visual
```

### Exemplos de Referência

- Button: `src/design-system/atoms/Button/`
- FormField: `src/design-system/molecules/FormField/`
- Navbar: `src/design-system/organisms/Navbar/`

---

## Arquitetura Atomic Design

O Design System é organizado em cinco níveis hierárquicos:

```
tokens/       → Valores primitivos (cores, espaçamento, tipografia)
theme/        → Sistema de temas (dark/light) e contexto
atoms/        → Componentes básicos indivisíveis
molecules/    → Combinações simples de atoms
organisms/    → Combinações complexas de molecules + atoms
templates/    → Layouts de página sem conteúdo específico
pages/        → Instâncias de templates com conteúdo real
utils/        → Funções auxiliares
```

### 1. Tokens

**O que são**: Valores primitivos que formam o vocabulário visual do Design System.

**Localização**: `src/design-system/tokens/`

**Exemplos**:

- `colors.ts` - Paleta de cores (cyan theme + gray "chumbo")
- `typography.ts` - Famílias de fontes (Fira Sans/Code), tamanhos, pesos
- `spacing.ts` - Escala de espaçamento compacto (4, 8, 12, 16, 24...)
- `radii.ts` - Border radius largo (8, 12, 16, 24)
- `shadows.ts` - Elevações
- `animations.ts` - Durações e easings

**Import rules**: Tokens podem ser importados em qualquer nível.

### 2. Theme

**O que é**: Sistema de temas que combina tokens e fornece contexto global via React Context.

**Localização**: `src/design-system/theme/`

**Componentes**:

- `ThemeProvider.tsx` - Provider com dark/light themes, AsyncStorage persistence
- `useTheme.ts` - Hook para acessar theme atual
- `theme.ts` - Definição de Theme interface e temas concretos

**Temas disponíveis**:

- Dark (padrão) - Gray 950 background + cyan primary
- Light - Gray 50 background + cyan primary

**Import rules**: Theme provider e hook podem ser importados em qualquer nível.

### 3. Atoms

**O que são**: Componentes básicos indivisíveis que não podem ser decompostos em partes menores.

**Localização**: `src/design-system/atoms/`

**Exemplos**:

- `Button` - Botão com 5 variants Shadcn (default, destructive, outline, ghost, link)
- `Input` - Campo de texto com states (default, focus, error, disabled)
- `Label` - Rótulo com required indicator
- `Badge` - Tag com 4 variants e pill shape (XL radius)
- `Icon` - Wrapper para Lucide icons
- `Card` - 6 componentes compostos (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)

**Import rules**:

- ✅ Atoms podem importar: `tokens`, `theme`, `utils`
- ❌ Atoms NÃO podem importar: `molecules`, `organisms`, `templates`, `pages`

**Quando criar um Atom**:

- Componente é indivisível (não pode ser quebrado em partes menores)
- Não depende de outros componentes além de primitivos do RN
- Representa um elemento UI básico (botão, input, ícone, etc)

### 4. Molecules

**O que são**: Combinações simples de atoms que formam componentes funcionais.

**Localização**: `src/design-system/molecules/`

**Exemplos** (a serem implementados):

- `FormField` - Label + Input com error message
- `SearchBar` - Input + Icon de busca

**Import rules**:

- ✅ Molecules podem importar: `atoms`, `tokens`, `theme`, `utils`
- ❌ Molecules NÃO podem importar: `organisms`, `templates`, `pages`
- ❌ Molecules NÃO podem importar outras `molecules` (para evitar dependências circulares)

**Quando criar uma Molecule**:

- Componente combina 2-3 atoms de forma simples
- Tem propósito funcional específico (ex: campo de formulário)
- Ainda é relativamente genérico e reutilizável

### 5. Organisms

**O que são**: Combinações complexas de molecules e atoms que formam seções completas de UI.

**Localização**: `src/design-system/organisms/`

**Exemplos** (a serem implementados):

- `Navbar` - Barra de navegação com logo, links, actions
- `ShoppingListCard` - Card completo de lista de compras
- `FilterPanel` - Painel com múltiplos filtros

**Import rules**:

- ✅ Organisms podem importar: `atoms`, `molecules`, `tokens`, `theme`, `utils`
- ❌ Organisms NÃO podem importar: `templates`, `pages`
- ⚠️ Organisms podem importar outros `organisms` com cautela (evitar dependências circulares)

**Quando criar um Organism**:

- Componente combina múltiplos molecules/atoms
- Representa seção distinta de interface (navbar, card complexo, form completo)
- Pode ter lógica de estado complexa

### 6. Templates

**O que são**: Layouts de página sem conteúdo específico, apenas estrutura.

**Localização**: `src/design-system/templates/`

**Exemplos**:

- `AuthTemplate` - Layout para páginas de autenticação
- `DashboardTemplate` - Layout com sidebar + content area

**Import rules**:

- ✅ Templates podem importar: `atoms`, `molecules`, `organisms`, `tokens`, `theme`, `utils`
- ❌ Templates NÃO podem importar: `pages`

**Quando criar um Template**:

- Define estrutura de layout reutilizável
- Sem conteúdo específico (apenas placeholders)
- Múltiplas páginas compartilham o mesmo layout

### 7. Pages

**O que são**: Instâncias de templates com conteúdo real e dados específicos.

**Localização**: `src/design-system/pages/`

**Import rules**:

- ✅ Pages podem importar qualquer coisa

**Nota**: No Listify, pages residem em `src/app/` (Expo Router), não neste Design System.

## Regras Importantes

### 1. Zero Hard-Coded Values

❌ **NUNCA** faça isso:

```typescript
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#06b6d4', // Hard-coded!
    padding: 16, // Hard-coded!
    borderRadius: 8, // Hard-coded!
  },
});
```

✅ **SEMPRE** use tokens via theme:

```typescript
const styles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.lg,
      borderRadius: theme.radii.lg,
    },
  });
```

**Enforcement**: ESLint custom rule `local-rules/no-hardcoded-values` detecta violações.

### 2. Use useTheme() Hook

❌ **NUNCA** importe theme diretamente:

```typescript
import { darkTheme } from '@design-system/theme/theme';
// ❌ Ignora preferência do usuário!
```

✅ **SEMPRE** use o hook:

```typescript
import { useTheme } from '@design-system/theme';

function MyComponent() {
  const { theme } = useTheme(); // ✅ Respeita tema atual
  const styles = createStyles(theme);
}
```

**Enforcement**: ESLint custom rule `local-rules/theme-provider-usage` detecta violações.

### 3. Respeite Hierarquia Atomic Design

❌ **NUNCA** quebre a hierarquia:

```typescript
// Em um Atom
import { SearchBar } from '../molecules/SearchBar'; // ❌ Atom não pode importar Molecule!

// Em uma Molecule
import { Navbar } from '../organisms/Navbar'; // ❌ Molecule não pode importar Organism!
```

✅ **SEMPRE** respeite a ordem:

```typescript
// Em uma Molecule
import { Button, Input } from '../atoms'; // ✅ Molecule pode importar Atoms

// Em um Organism
import { FormField } from '../molecules'; // ✅ Organism pode importar Molecules
import { Button } from '../atoms'; // ✅ Organism pode importar Atoms
```

**Enforcement**: ESLint custom rule `local-rules/atomic-design-imports` detecta violações.

## Design Tokens Específicos

### Paleta de Cores

#### Por que Cyan Theme?

Escolhemos o cyan (`#06b6d4`) como cor primária por:

- **Modernidade**: Cyan é vibrante e contemporâneo, transmitindo inovação
- **Contraste**: Excelente contraste em dark e light themes (WCAG AA+)
- **Psicologia**: Transmite confiança, clareza e eficiência (ideal para app de produtividade)
- **Diferenciação**: Destaca-se de apps similares que usam azul tradicional ou verde

**Cyan Theme**: Cor primária vibrante

- Base: `#06b6d4` (cyan-500)
- Variações: cyan-50 até cyan-950

#### Por que Gray "Chumbo"?

Escolhemos gray "chumbo" com undertones azulados por:

- **Sofisticação**: Cinza com toque azulado é mais elegante que cinza neutro
- **Coerência**: Harmoniza perfeitamente com cyan primary
- **Legibilidade**: Base `#6c757d` oferece contraste ideal para textos
- **Dark Theme**: Gray-950 (#16191d) é mais confortável que preto puro para leitura prolongada

**Gray "Chumbo"**: Base neutra com undertones azulados

- Base: `#6c757d` (gray-600)
- Variações: gray-50 (#f8f9fa) até gray-950 (#16191d)

**Tokens Shadcn completos**:

- background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring

#### Tokens Customizados para Topbar

Criamos tokens específicos para a barra de navegação (topbar) para máxima flexibilidade:

**Por que tokens topbar separados?**

- Permite estilização independente da navbar sem afetar resto do app
- Facilita temas customizados (ex: topbar sempre dark, mesmo em light theme)
- Melhora separação visual entre navegação e conteúdo

**Tokens disponíveis**:

- `topbar` - Background da navbar
- `topbar-foreground` - Texto e ícones
- `topbar-primary` - Botão primário ativo
- `topbar-accent` - Highlights e badges
- `topbar-border` - Bordas e separadores
- `topbar-ring` - Focus rings

**Exemplo de uso**:

```typescript
const styles = (theme: Theme) =>
  StyleSheet.create({
    navbar: {
      backgroundColor: theme.colors.topbar,
      borderBottomColor: theme.colors['topbar-border'],
    },
    title: {
      color: theme.colors['topbar-foreground'],
    },
  });
```

### Tipografia

#### Por que Fira Sans e Fira Code?

Escolhemos as fontes Fira por:

- **Legibilidade**: Otimizadas para telas digitais com excelente clareza
- **Modernidade**: Design contemporâneo e profissional
- **Versatilidade**: Múltiplos pesos disponíveis (Regular, Medium, SemiBold, Bold)
- **Open Source**: Gratuitas e sem restrições de licença
- **Coerência**: Fira Code complementa perfeitamente Fira Sans para código/monospace
- **Brand Identity**: Menos comum que system fonts, cria identidade única

**Fira Sans**: Font família principal para body text

- Pesos: Regular (400), Medium (500), SemiBold (600), Bold (700)
- Uso: Textos gerais, labels, botões, títulos

**Fira Code**: Font monospace para código

- Pesos: Regular (400), Medium (500)
- Uso: Code snippets, valores numéricos, IDs

**Tamanhos**:

- xs: 12, sm: 14, base: 16, md: 18, lg: 20, xl: 24, 2xl: 30, 3xl: 36, 4xl: 48

### Espaçamento (Compact Scale)

#### Por que Spacing Compacto?

Escolhemos valores **menores** que padrão Shadcn por:

- **Densidade**: Mais informação visível sem scroll excessivo
- **Mobile-first**: Otimizado para telas pequenas
- **Eficiência**: Menos atrito ao escanear conteúdo
- **Modernidade**: Alinhado com tendências de interfaces densas (ex: Notion, Linear)

**Escala compacta**:

- xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, 3xl: 48, 4xl: 64

**Comparação com Shadcn**:

- Shadcn: `sm: 8, md: 16, lg: 24`
- Listify: `sm: 8, md: 12, lg: 16` (25-33% menor)

### Border Radius (Large Scale)

#### Por que Large Radius?

Escolhemos valores **maiores** que padrão Shadcn por:

- **Friendly**: Cantos arredondados transmitem acessibilidade e conforto
- **Moderno**: Visual contemporâneo e menos rígido
- **Destaque**: Componentes se destacam com bordas mais suaves
- **Brand**: Consistente com identidade visual playful e moderna

**Escala large**:

- sm: 8, md: 12, lg: 16, xl: 24, full: 9999

**Comparação com Shadcn**:

- Shadcn: `md: 6, lg: 8`
- Listify: `md: 12, lg: 16` (50-100% maior)

## Importando do Design System

### Forma recomendada (via barrel export)

```typescript
// ✅ Importar do index principal
import { Button, Input, Card, useTheme, colors } from '@design-system';

function MyScreen() {
  const { theme } = useTheme();

  return (
    <Card>
      <Input placeholder="Enter text" />
      <Button>Submit</Button>
    </Card>
  );
}
```

### Importações diretas (quando necessário)

```typescript
// ✅ Import direto de componente específico
import { Button } from '@design-system/atoms/Button/Button';
import type { ButtonProps } from '@design-system/atoms/Button/Button.types';
```

## Criando Novos Componentes

### Estrutura de arquivos padrão

Para cada componente, crie:

```
ComponentName/
├── ComponentName.tsx        # Componente principal
├── ComponentName.styles.ts  # Styles factory (theme → StyleSheet)
├── ComponentName.types.ts   # TypeScript interfaces
└── ComponentName.stories.tsx # Storybook stories
```

### Template de Atom

```typescript
// Button.types.ts
import type { TouchableOpacityProps } from 'react-native';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
}

// Button.styles.ts
import { StyleSheet } from 'react-native';
import type { Theme } from '@design-system/theme/theme';

export const createButtonStyles = (theme: Theme) => {
  return StyleSheet.create({
    button: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.radii.lg,
    },
    text: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.base,
      color: theme.colors['primary-foreground'],
    },
  });
};

// Button.tsx
import React, { type ReactElement } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@design-system/theme';
import { createButtonStyles } from './Button.styles';
import type { ButtonProps } from './Button.types';

export function Button({ children, ...props }: ButtonProps): ReactElement {
  const { theme } = useTheme();
  const styles = createButtonStyles(theme);

  return (
    <TouchableOpacity style={styles.button} {...props}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@design-system/theme';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
```

### Testes

Todos os componentes devem ter testes em `tests/design-system/`:

```typescript
// tests/design-system/atoms/Button.test.tsx
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@design-system/theme';
import { Button } from '@design-system/atoms/Button/Button';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Button Atom', () => {
  it('should render with text', () => {
    const { getByText } = renderWithTheme(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeTruthy();
  });
});
```

## Coexistência com Design System Legado

O Design System legado foi renomeado para `@legacy-design-system/*` e coexiste com o novo DS durante o período de transição.

### Quando Usar Cada Design System

**Use `@design-system` (Novo DS) quando:**

- ✅ Criar novos componentes ou features
- ✅ Refatorar componentes existentes
- ✅ Implementar telas novas
- ✅ Componente precisa de dark/light theme
- ✅ Precisa de Fira fonts, large radius, compact spacing

**Use `@legacy-design-system` (DS Legado) quando:**

- ⚠️ Manutenção de componentes existentes (temporariamente)
- ⚠️ Correção de bugs urgentes sem tempo para migração
- ⚠️ Componente será removido em breve

### Exemplos de Importação

```typescript
// ✅ CORRETO: Novo componente usando novo DS
import { Button, Card, FormField } from '@design-system';
import { useTheme } from '@design-system';

function NewFeatureScreen() {
  const { theme } = useTheme();
  return (
    <Card>
      <FormField label="Email" required />
      <Button>Submit</Button>
    </Card>
  );
}

// ✅ CORRETO: Componente existente usando DS legado
import { Button as LegacyButton } from '@legacy-design-system';

function ExistingScreen() {
  return <LegacyButton>Click</LegacyButton>;
}

// ✅ CORRETO: Transição gradual - mistura temporária
import { Button } from '@design-system';
import { OldComponent } from '@legacy-design-system';

function TransitionScreen() {
  return (
    <>
      <OldComponent /> {/* Legado - será migrado depois */}
      <Button>New Button</Button> {/* Novo DS */}
    </>
  );
}

// ❌ ERRADO: Misturar styles de ambos DS no mesmo componente
import { Button } from '@design-system';
import { colors as legacyColors } from '@legacy-design-system/tokens';

function BadComponent() {
  return (
    <Button style={{ backgroundColor: legacyColors.primary }}> {/* ❌ Não misture! */}
      Bad Practice
    </Button>
  );
}
```

### Estratégia de Migração

**Fase 1 - Coexistência (Atual)**:

1. Novo DS está pronto e documentado
2. DS Legado permanece intacto em `@legacy-design-system/*`
3. Novos componentes usam `@design-system`
4. Componentes existentes continuam com `@legacy-design-system`

**Fase 2 - Migração Gradual**:

1. Identificar componentes críticos para migração
2. Migrar componente por componente
3. Atualizar testes após migração
4. Validar visualmente no Storybook

**Fase 3 - Deprecação**:

1. Quando todos componentes migraram, deprecar `@legacy-design-system`
2. Adicionar warnings em imports legados
3. Remover após período de grace

### Checklist de Migração de Componente

Quando migrar um componente do DS legado para o novo:

- [ ] Substituir imports de `@legacy-design-system` por `@design-system`
- [ ] Substituir hard-coded values por tokens (via `useTheme()`)
- [ ] Aplicar Fira fonts nos textos
- [ ] Usar large radius (lg: 16, xl: 24)
- [ ] Usar compact spacing (xs: 4, sm: 8, md: 12)
- [ ] Testar dark e light themes
- [ ] Atualizar testes do componente
- [ ] Validar acessibilidade (touch targets, contraste)
- [ ] Documentar no Storybook
- [ ] Executar ESLint (zero warnings)

## Dark Theme como Padrão

O Listify usa **dark theme como padrão** por escolha de design:

**Por que Dark como padrão?**

- **Conforto Visual**: Reduz fadiga ocular em uso prolongado
- **Economia de Bateria**: Displays OLED consomem menos energia com pixels escuros
- **Modernidade**: Dark mode é tendência em apps de produtividade (Notion, Slack, VS Code)
- **Foco**: Background escuro ajuda conteúdo a se destacar
- **Preferência do Público**: Maioria dos usuários prefere dark mode para apps de lista/tarefas

**Como funciona**:

- App inicia sempre em dark theme
- Usuário pode alternar para light theme manualmente
- Preferência é salva no AsyncStorage
- **Não** detecta system preference automaticamente (decisão de UX para consistência)

**Theme Switching**:

```typescript
import { useTheme } from '@design-system';

function Settings() {
  const { mode, toggleTheme } = useTheme();

  return (
    <Button onPress={toggleTheme}>
      {mode === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
    </Button>
  );
}
```

## Acessibilidade

O Design System segue diretrizes WCAG 2.1 Level AA para garantir acessibilidade:

### Contraste de Cores (WCAG AA)

**Todos os pares de cores foram validados**:

- Text normal: Mínimo 4.5:1
- Text large (18pt+): Mínimo 3:1
- Componentes UI: Mínimo 3:1

**Exemplos validados**:

- Dark theme: gray-50 (#f8f9fa) em gray-950 (#16191d) = 17.8:1 ✓
- Light theme: gray-900 em gray-50 = 16.1:1 ✓
- Cyan primary: Contraste adequado em ambos temas ✓
- Destructive red: Validado para erros e avisos ✓

### Touch Targets (Mobile)

**Todos os componentes interativos têm mínimo 44x44 pts**:

- Buttons: Mínimo 44pt de altura
- Icons clicáveis: Padding aumentado para 44x44 área
- Form inputs: Altura mínima 44pt
- Cards touchable: Área completa clicável

**Implementação**:

```typescript
// Button atom já inclui touch target adequado
const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    paddingVertical: theme.spacing.md, // 12pt
    paddingHorizontal: theme.spacing.lg, // 16pt
  },
});
```

### Reduced Motion

**Suporte para prefers-reduced-motion**:

- Sistema detecta preferência do usuário
- Animações são desabilitadas automaticamente quando ativo
- Transições tornam-se instantâneas
- Hook `useReducedMotion()` disponível para componentes customizados

**Exemplo**:

```typescript
import { useReducedMotion } from '@design-system/utils/animations';

function AnimatedComponent() {
  const reducedMotion = useReducedMotion();

  const animationDuration = reducedMotion ? 0 : 300;

  // Animação respeita preferência
}
```

### Navegação por Teclado

**Componentes suportam navegação via teclado**:

- Tab order lógico em formulários
- Enter/Space ativa buttons
- Escape fecha modals
- Focus indicators visíveis (ring tokens)

### Screen Readers

**Todos os componentes têm labels apropriados**:

- `accessibilityLabel` em componentes interativos
- `accessibilityHint` para ações não-óbvias
- `accessibilityRole` correto (button, link, header, etc)
- Estados comunicados (disabled, selected, checked)

**Exemplo de Button acessível**:

```typescript
<Button
  onPress={handleSave}
  accessibilityLabel="Save shopping list"
  accessibilityHint="Saves your current list and returns to home"
  accessibilityRole="button"
>
  Save
</Button>
```

## Recursos

- **Storybook**: Documentação visual de todos os componentes
- **ESLint Rules**: Enforcement automático de regras do DS
- **TypeScript**: Type-safety completo em todos os componentes
- **Tests**: Cobertura de testes para atoms, molecules e organisms
- **Acessibilidade**: WCAG 2.1 Level AA compliance
- **Dark/Light Themes**: Suporte completo com switching manual

## Comandos Úteis

```bash
# Visualizar componentes no Storybook
npm run storybook

# Executar linter (deve passar com zero warnings)
npm run lint

# Executar testes
npm test

# Gerar novo componente (CLI - será implementado na Fase 12)
npm run generate:atom Button
npm run generate:molecule FormField
npm run generate:organism Navbar
```

## Referências

- [Atomic Design - Brad Frost](https://atomicdesign.bradfrost.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [React Native StyleSheet](https://reactnative.dev/docs/stylesheet)
