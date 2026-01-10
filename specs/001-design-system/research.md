# Research: Design System Completo com Atomic Design

**Feature**: 001-design-system
**Data**: 2026-01-09
**Fase**: Phase 0 - Research & Discovery

## Questões a Resolver

Identificadas no Contexto Técnico:
1. Lucide React Native - verificar pacote correto para React Native
2. Storybook React Native - verificar versão e setup para Expo
3. Ferramenta de screenshot testing - escolher entre Playwright vs Chromatic vs Detox
4. Tamanho de bundle - limite aceitável com Fira fonts + Lucide icons

## 1. Lucide Icons para React Native

### Decisão
Usar **`lucide-react-native`** (pacote oficial)

### Pacote
```bash
npm install lucide-react-native
```

### Dependências Peer
- `react-native-svg` (já instalado via Expo)

### Rationale
- Lucide tem pacote oficial para React Native: `lucide-react-native`
- Baseado em SVG via `react-native-svg` (já disponível no Expo)
- API consistente com Lucide React (facilita documentação)
- Tree-shakeable (apenas ícones usados são incluídos no bundle)
- Suporta customização de size, color, strokeWidth
- Mantido ativamente pela equipe Lucide

### Alternativas Consideradas
- **react-native-vector-icons**: Rejeitada - usa fonts ao invés de SVG, menos flexível para customização
- **expo-icons**: Rejeitada - não tem todos os ícones Lucide, design diferente
- **react-native-heroicons**: Rejeitada - biblioteca diferente (Heroicons vs Lucide)

### Exemplo de Uso
```tsx
import { ShoppingCart, Check, X } from 'lucide-react-native';

<ShoppingCart size={24} color={theme.colors.primary} strokeWidth={2} />
```

---

## 2. Storybook para React Native com Expo

### Decisão
Usar **Storybook React Native v7** com adaptador para Expo

### Pacote
```bash
npx storybook@latest init --type react_native
```

### Versão Recomendada
- `@storybook/react-native` ^7.6.x (latest stable)

### Setup para Expo
- Usar `@storybook/react-native` com Metro bundler (já usado pelo Expo)
- Configurar em modo "dev UI in-app" (Storybook roda dentro do app, não web separado)
- Para web preview (opcional): usar `@storybook/react-native-web` addon

### Rationale
- Storybook v7 tem suporte oficial para React Native
- Integra bem com Expo e Metro bundler
- Suporta Controls addon (interatividade de props)
- Suporta theme switching via toolbar customizado
- Hot reload funciona nativamente com Expo
- Docs addon disponível para documentação inline

### Configuração Necessária
```
.storybook/
├── main.ts              # Config principal (stories path, addons)
├── preview.tsx          # Global decorators (ThemeProvider wrapper)
└── Storybook.tsx        # Entry point para renderizar Storybook UI
```

### Alternativas Consideradas
- **Docusaurus + MDX**: Rejeitada - não mostra componentes nativos rodando, apenas web
- **React Native UI Kitten**: Rejeitada - não é ferramenta de documentação, é biblioteca de componentes
- **Sem ferramenta (apenas README.md)**: Rejeitada - não oferece visualização interativa

### Trade-offs
- ⚠️ Storybook adiciona ~10-15MB ao bundle de dev (não afeta production)
- ✅ Vale a pena: desenvolvedores podem testar componentes isoladamente
- ✅ Facilita design review e validação visual

---

## 3. Ferramenta de Screenshot Testing

### Decisão
Usar **Detox + Detox Screenshot** para testes visuais nativos

### Pacote
```bash
npm install --save-dev detox detox-screenshot
```

### Rationale
- **Detox** é E2E testing framework para React Native (suporta iOS/Android nativos)
- **Detox Screenshot** adiciona capacidade de capturar screenshots durante testes
- Roda em simuladores/emuladores reais (não apenas web)
- Integra com Jest (já usado no projeto)
- Suporta dark/light mode switching
- Pode ser executado em CI (GitHub Actions)

### Workflow
1. Escrever testes Detox navegando para Storybook stories
2. Capturar screenshots de cada story em dark/light mode
3. Comparar com baselines usando ferramentas de diff (ex: `jest-image-snapshot`)
4. Falha se diff > threshold configurado

### Alternativas Consideradas

| Ferramenta | Pros | Cons | Decisão |
|------------|------|------|---------|
| **Playwright** | Excelente para web, rápido | ❌ Não suporta React Native nativo | ❌ Rejeitada |
| **Chromatic** | Visual regression automático | ❌ Pago, ❌ Focado em web | ❌ Rejeitada |
| **Detox** | ✅ Suporte nativo RN, ✅ Gratuito | Setup inicial complexo | ✅ **Escolhida** |
| **Appium** | Cross-platform | Mais lento que Detox | ❌ Rejeitada |

### Trade-offs
- ⚠️ Setup inicial trabalhoso (configurar simuladores, permissions)
- ⚠️ Testes mais lentos que web (simulador boot time)
- ✅ Única solução que testa native rendering real
- ✅ Detecta bugs visuais específicos de plataforma (iOS vs Android)

### Configuração Necessária
```json
// .detoxrc.js
{
  "testRunner": {
    "args": {
      "$0": "jest",
      "config": "tests/visual/jest.config.js"
    }
  },
  "apps": {
    "ios": {
      "type": "ios.app",
      "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/Listify.app"
    },
    "android": {
      "type": "android.apk",
      "binaryPath": "android/app/build/outputs/apk/debug/app-debug.apk"
    }
  }
}
```

---

## 4. Tamanho de Bundle - Fira Fonts + Lucide Icons

### Análise de Impacto

#### Fira Sans/Code Fonts
- **Fira Sans** (Regular, Medium, SemiBold, Bold): ~200KB total
- **Fira Code** (Regular, Medium): ~150KB total
- **Total Fonts**: ~350KB compactado

#### Lucide Icons
- **Tree-shakeable**: Apenas ícones usados são incluídos
- **Estimativa**: ~30 ícones únicos no app = ~15KB
- **SVG rendering**: Zero custo adicional (usa react-native-svg já instalado)

#### Impacto Total Estimado
- **Fontes**: +350KB
- **Ícones**: +15KB
- **Storybook (dev only)**: +10-15MB (não afeta production)
- **Design System code**: +50KB (tokens + componentes)

### Decisão
**Aceitável** - Total de ~415KB adicionais em production é razoável

### Rationale
- Fontes customizadas são essenciais para brand identity
- 350KB de fonts é padrão da indústria (Google Fonts carrega similar)
- Lucide tree-shaking mantém custo de ícones baixo
- Total <500KB não impacta significativamente load time em redes modernas
- Expo pode comprimir assets com gzip (reduz 30-40%)

### Alternativas Consideradas
- **System fonts**: Rejeitada - não atende especificação (Fira Sans/Code obrigatórias)
- **Subset fonts**: Considerada - reduz a 200KB mas complexifica build. Deixar para otimização futura se necessário.
- **Icon fonts ao invés de SVG**: Rejeitada - menos flexível, não suporta multicolor

### Limites Aceitáveis
- ✅ <500KB: Ótimo
- ⚠️ 500KB-1MB: Aceitável (situação atual: ~415KB)
- ❌ >1MB: Requer otimização (subset fonts, lazy load)

### Monitoramento
- Usar `react-native-bundle-visualizer` para trackear tamanho real em builds
- Alerta se bundle crescer >1MB devido a DS

---

## 5. ESLint Rules Customizadas (Atomic Design Enforcement)

### Decisão
Criar regras ESLint customizadas para enforçar hierarquia Atomic Design

### Regras Necessárias

#### 1. No Hard-coded Values
```js
// Detectar valores hard-coded ao invés de tokens
// Erro: <View style={{ padding: 16 }} />
// Correto: <View style={{ padding: theme.spacing.md }} />
```

#### 2. Atomic Design Import Restrictions
```js
// Molecules não podem importar outros molecules ou organisms
// atoms/ pode importar apenas tokens/
// molecules/ pode importar apenas tokens/ e atoms/
// organisms/ pode importar tokens/, atoms/, molecules/
```

#### 3. Theme Provider Required
```js
// Todos os componentes devem usar useTheme() ao invés de importar theme diretamente
```

### Implementação
- Usar `eslint-plugin-local-rules` para rules customizadas
- Adicionar em `.eslintrc.js` com severity "error"
- Criar arquivo `eslint-rules/atomic-design.js` com lógica de validação

### Rationale
- Enforcement automático previne violações de arquitetura
- Fail fast: Erros detectados em dev time, não em code review
- Escala melhor que code review manual

### Alternativas Consideradas
- **Architecture tests (jest)**: Rejeitada - roda apenas em CI, não em dev time
- **Pre-commit hooks**: Considerada como complemento, mas ESLint é primeira linha de defesa
- **Manual code review**: Rejeitada - não escala, inconsistente

---

## 6. Expo Fonts Loading Strategy

### Decisão
Usar **`expo-font`** com async loading e splash screen persistence

### Implementação
```tsx
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Prevenir auto-hide de splash screen
SplashScreen.preventAutoHideAsync();

// Carregar fonts
await Font.loadAsync({
  'FiraSans-Regular': require('./assets/fonts/FiraSans-Regular.ttf'),
  'FiraSans-Medium': require('./assets/fonts/FiraSans-Medium.ttf'),
  'FiraSans-SemiBold': require('./assets/fonts/FiraSans-SemiBold.ttf'),
  'FiraSans-Bold': require('./assets/fonts/FiraSans-Bold.ttf'),
  'FiraCode-Regular': require('./assets/fonts/FiraCode-Regular.ttf'),
  'FiraCode-Medium': require('./assets/fonts/FiraCode-Medium.ttf'),
});

// Hide splash screen quando fonts carregadas
await SplashScreen.hideAsync();
```

### Rationale
- Expo Fonts é solução padrão e otimizada para Expo
- Splash screen persiste até fonts carregadas (evita FOUT - Flash of Unstyled Text)
- Async loading não bloqueia JS thread
- Fonts são cacheadas após primeiro load

### Alternativas Consideradas
- **Google Fonts CDN**: Rejeitada - requer conectividade, viola offline-first
- **react-native-vector-fonts**: Rejeitada - não suporta custom fonts como Fira
- **Expo Google Fonts**: Rejeitada - não tem Fira Sans/Code

---

## Resumo de Decisões

| Questão | Decisão | Impacto |
|---------|---------|---------|
| **Ícones** | lucide-react-native | +15KB, tree-shakeable |
| **Storybook** | @storybook/react-native v7 | +10MB dev, 0KB prod |
| **Screenshot Tests** | Detox + Detox Screenshot | Setup complexo, testes nativos reais |
| **Bundle Size** | Aceitar ~415KB (fonts + icons) | Dentro do limite aceitável |
| **ESLint** | Rules customizadas Atomic Design | Enforcement automático |
| **Font Loading** | expo-font com splash screen | FOUT prevention, offline-first |

Todas as decisões estão alinhadas com os princípios da constituição (offline-first, performance, Clean Architecture).
