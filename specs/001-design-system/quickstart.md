# Quickstart: Design System Listify

Guia rápido para começar a usar o novo Design System baseado em Atomic Design.

---

## 📦 Instalação

O Design System já está incluído no projeto. Não é necessário instalar pacotes adicionais.

### Dependências (já instaladas)

- `lucide-react-native` - Ícones
- `@storybook/react-native` - Documentação visual
- `detox` + `detox-screenshot` - Testes visuais
- `expo-font` - Carregamento de Fira Sans/Code

---

## 🚀 Setup Inicial

### 1. Wrap app com ThemeProvider

```tsx
// app/_layout.tsx
import { ThemeProvider } from '@design-system/theme';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}
```

### 2. Aguardar carregamento de fonts

O ThemeProvider já aguarda Fira Sans/Code carregarem antes de renderizar children. Splash screen persiste automaticamente.

---

## 🎨 Usando Tokens

### Import tokens

```tsx
import { tokens } from '@design-system/tokens';
```

### Cores

```tsx
import { useTheme } from '@design-system/theme';

function MyComponent() {
  const { theme } = useTheme();

  return (
    <View style={{
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
    }}>
      <Text style={{ color: theme.colors.foreground }}>
        Hello
      </Text>
    </View>
  );
}
```

### Tipografia

```tsx
<Text style={{
  fontFamily: tokens.typography.families.body,  // Fira Sans
  fontSize: tokens.typography.sizes.base,       // 16px
  fontWeight: String(tokens.typography.weights.medium), // '500'
  lineHeight: tokens.typography.sizes.base * tokens.typography.lineHeights.normal,
}}>
  Fira Sans text
</Text>
```

### Spacing

```tsx
<View style={{
  padding: tokens.spacing.md,      // 12px (compacto)
  marginBottom: tokens.spacing.lg, // 16px
}}>
  {children}
</View>
```

### Radius

```tsx
<View style={{
  borderRadius: tokens.radii.lg, // 16px (padrão large)
}}>
  {children}
</View>
```

---

## 🧩 Usando Componentes Atoms

### Button

```tsx
import { Button } from '@design-system/atoms';

<Button
  variant="default"  // 'default' | 'destructive' | 'outline' | 'ghost' | 'link'
  size="md"         // 'sm' | 'md' | 'lg' | 'icon'
  onPress={handlePress}
>
  Click me
</Button>

// Com loading
<Button loading onPress={handleSave}>
  Save
</Button>

// Disabled
<Button disabled onPress={handleDelete}>
  Delete
</Button>
```

### Input

```tsx
import { Input } from '@design-system/atoms';

<Input
  placeholder="Enter text"
  value={value}
  onChangeText={setValue}
/>

// Com erro
<Input
  state="error"
  error="Required field"
  value={value}
  onChangeText={setValue}
/>
```

### Label + Input

```tsx
import { Label, Input } from '@design-system/atoms';

<Label required>Email</Label>
<Input
  placeholder="email@example.com"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
/>
```

### Badge

```tsx
import { Badge } from '@design-system/atoms';

<Badge variant="default">New</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Draft</Badge>
```

### Icon (Lucide)

```tsx
import { Icon } from '@design-system/atoms';
import { ShoppingCart, Check, X } from 'lucide-react-native';

<Icon icon={ShoppingCart} size={24} />
<Icon icon={Check} size={20} color={theme.colors.primary} />
```

### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@design-system/atoms';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <Text>Card content</Text>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Cancel</Button>
    <Button>Confirm</Button>
  </CardFooter>
</Card>
```

---

## 🌓 Theme Switching

### Acessar theme atual

```tsx
import { useTheme } from '@design-system/theme';

function MyComponent() {
  const { theme, mode, setMode, toggleMode } = useTheme();

  return (
    <>
      <Text>Current mode: {mode}</Text>
      <Button onPress={toggleMode}>
        Toggle Theme
      </Button>
      <Button onPress={() => setMode('dark')}>
        Force Dark
      </Button>
    </>
  );
}
```

### Theme persiste automaticamente

Preferência é salva em AsyncStorage e restaurada automaticamente.

---

## 🧪 Visualizando no Storybook

### Rodar Storybook

```bash
npm run storybook
```

Storybook abre in-app. Navegue pelas seções:

- **Atoms**: Button, Input, Label, Badge, Icon, Card
- **Molecules**: FormField, SearchBar
- **Organisms**: Navbar, ShoppingListCard

### Alternar theme no Storybook

Use toolbar no topo do Storybook para alternar entre dark/light.

---

## 📐 Criando Novos Componentes

### Atomic Design Hierarchy

```
atoms/       → Componentes indivisíveis (podem importar apenas tokens)
molecules/   → Composição de atoms (podem importar tokens + atoms)
organisms/   → Composição complexa (podem importar tokens + atoms + molecules)
templates/   → Layouts (compõem organisms/molecules/atoms sem dados)
pages/       → Templates + dados reais do app
```

### CLI para scaffolding

```bash
# Gerar novo atom
npm run ds generate atom MyButton

# Gerar novo molecule
npm run ds generate molecule MyFormField

# Gerar novo organism
npm run ds generate organism MyNavbar
```

Isso cria:
- `ComponentName.tsx`
- `ComponentName.styles.ts`
- `ComponentName.types.ts`
- `ComponentName.stories.tsx`
- `ComponentName.test.tsx`

---

## ⚠️ Regras Importantes

### 1. Zero Hard-coded Values

❌ **Errado**:
```tsx
<View style={{ padding: 16, borderRadius: 8 }}>
```

✅ **Correto**:
```tsx
<View style={{
  padding: tokens.spacing.md,
  borderRadius: tokens.radii.lg,
}}>
```

### 2. Respeitar Hierarquia Atomic Design

❌ **Errado** (molecule importando outro molecule):
```tsx
// src/design-system/molecules/MyForm.tsx
import { SearchBar } from '../molecules/SearchBar'; // ❌
```

✅ **Correto** (molecule importando apenas atoms):
```tsx
// src/design-system/molecules/MyForm.tsx
import { Input, Label } from '../atoms'; // ✅
```

### 3. Usar useTheme() para Cores

❌ **Errado**:
```tsx
import { darkTheme } from '@design-system/theme';
<View style={{ backgroundColor: darkTheme.colors.background }}>
```

✅ **Correto**:
```tsx
import { useTheme } from '@design-system/theme';
const { theme } = useTheme();
<View style={{ backgroundColor: theme.colors.background }}>
```

### 4. Fira Sans/Code Sempre

❌ **Errado**:
```tsx
<Text style={{ fontFamily: 'Arial' }}>
```

✅ **Correto**:
```tsx
<Text style={{ fontFamily: tokens.typography.families.body }}>
```

---

## 🔍 Debugging

### Verificar theme atual

```tsx
import { useTheme } from '@design-system/theme';

const { theme, mode } = useTheme();
console.log('Current mode:', mode);
console.log('Primary color:', theme.colors.primary);
```

### Verificar fonts carregadas

Fonts são carregadas automaticamente pelo ThemeProvider. Se houver problemas:

```tsx
import { useTheme } from '@design-system/theme';

const { isLoading } = useTheme();
if (isLoading) {
  return <SplashScreen />;
}
```

---

## 📚 Próximos Passos

1. **Explore o Storybook**: Veja todos os componentes disponíveis
2. **Leia a documentação completa**: `src/design-system/README.md`
3. **Migre componentes gradualmente**: Substitua estilos hard-coded por tokens
4. **Use ESLint**: Regras customizadas detectam violações automaticamente

---

## 🆘 Ajuda

- **Documentação completa**: `src/design-system/README.md`
- **Spec técnica**: `specs/001-design-system/spec.md`
- **Contracts**: `specs/001-design-system/contracts/`
- **Data Model**: `specs/001-design-system/data-model.md`

---

**Feito!** 🎉 Você está pronto para usar o novo Design System do Listify.
