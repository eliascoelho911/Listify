# Research: Inbox Screen

**Feature**: 003-inbox-screen
**Data**: 2026-01-11
**Status**: Completo

## Decisões Técnicas

### 1. Lista Virtualizada para Scroll Infinito

**Decisão**: Usar `@shopify/flash-list` em vez de `FlatList` padrão do React Native.

**Racional**:
- FlashList oferece performance superior para listas longas (500+ itens)
- Suporte nativo a sticky headers (necessário para DateBadge)
- API compatível com FlatList (migração simples)
- Já amplamente adotado no ecossistema React Native
- Melhor recycling de células que FlatList

**Alternativas consideradas**:
- `FlatList`: Descartado por performance inferior com muitos itens
- `SectionList`: Descartado por API mais complexa e sem ganho de performance
- `RecyclerListView`: Descartado por API menos intuitiva que FlashList

**Instalação**:
```bash
npx expo install @shopify/flash-list
```

---

### 2. Navegação com Drawer (Sidebar)

**Decisão**: Usar `expo-router/drawer` com `@react-navigation/drawer`.

**Racional**:
- Integração nativa com Expo Router (file-based routing)
- Drawer gestures são mais naturais no mobile
- Suporte a customização completa do conteúdo
- Padrão já estabelecido no ecossistema React Navigation
- Animações suaves via react-native-reanimated

**Alternativas consideradas**:
- Bottom tabs: Descartado - não adequado para navegação principal do Inbox
- Stack navigation: Descartado - sidebar é melhor UX para acesso rápido
- Custom drawer: Descartado - reinventar a roda sem benefício

**Instalação**:
```bash
npx expo install @react-navigation/drawer react-native-reanimated
```

**Configuração necessária**:
- Adicionar plugin reanimated no babel.config.js (já configurado)
- Criar grupo `(drawer)` no app/ para rotas com drawer

---

### 3. Extração de Tags do Texto

**Decisão**: Usar regex simples para detectar padrão `#palavra` no texto.

**Racional**:
- Regex é suficiente para o caso de uso (#tag)
- Não há necessidade de NLP avançado
- Performance instantânea (< 1ms)
- Fácil de testar e manter

**Implementação**:
```typescript
const TAG_REGEX = /#([a-zA-ZÀ-ÿ0-9_]+)/g;

function extractTags(text: string): string[] {
  const matches = text.matchAll(TAG_REGEX);
  return [...new Set([...matches].map(m => m[1].toLowerCase()))];
}
```

**Regras de normalização**:
- Tags são case-insensitive (`#Compras` = `#compras`)
- Limite de 30 caracteres por tag
- Caracteres permitidos: letras (incluindo acentos), números, underscore
- Tags duplicadas são removidas

**Alternativas consideradas**:
- NLP library (compromise.js): Descartado - overkill para hashtags simples
- String split: Descartado - não lida bem com edge cases

---

### 4. Paginação de UserInputs

**Decisão**: Offset-based pagination com ordem cronológica crescente (mais recente embaixo).

**Racional**:
- Ordem crescente é mais natural para chat/inbox (novas mensagens embaixo)
- Offset-based é simples de implementar e suficiente para uso local
- SQLite OFFSET/LIMIT tem performance aceitável para volumes esperados
- Cursor-based seria over-engineering para dados locais

**Implementação**:
```sql
SELECT * FROM user_inputs
ORDER BY created_at ASC
LIMIT :limit OFFSET :offset
```

**Parâmetros**:
- `limit`: 20 itens por página (configurável)
- `offset`: calculado como `page * limit`

**Alternativas consideradas**:
- Cursor-based (keyset): Descartado - complexidade desnecessária para dados locais
- Fetch all: Descartado - ruim para listas grandes

---

### 5. Sugestões de Tags (Autocomplete)

**Decisão**: Busca por prefixo no SQLite com ordenação por usageCount.

**Racional**:
- SQLite LIKE é eficiente para prefixo com índice
- Ordenar por usageCount mostra tags mais usadas primeiro
- Limite de 5-10 sugestões é suficiente
- Não precisa de fuzzy search para MVP

**Implementação**:
```sql
SELECT * FROM tags
WHERE name LIKE :prefix || '%'
ORDER BY usage_count DESC
LIMIT 10
```

**Alternativas consideradas**:
- Fuzzy search (fuse.js): Descartado para MVP - prefixo é suficiente
- Full-text search: Descartado - overkill para tags simples
- In-memory filter: Descartado - SQLite é mais eficiente

---

### 6. AppDependenciesProvider

**Decisão**: Criar provider global para centralizar DI em vez de passar props manualmente.

**Racional**:
- Centraliza inicialização assíncrona (SQLite, migrations)
- Fornece loading state durante bootstrap
- Facilita testes com mock de dependências
- Padrão recomendado para DI com React Context
- Elimina prop drilling de repositories

**Fontes**:
- [Dependency Injection in React - Full Guide](https://codedrivendevelopment.com/posts/dependency-injection-in-react)
- [React Context for DI, not State Management](https://testdouble.com/insights/react-context-for-dependency-injection-not-state-management)

**Alternativas consideradas**:
- Prop drilling: Descartado - não escala com múltiplos repositories
- Global singleton: Descartado - dificulta testes
- Service locator: Descartado - menos type-safe que Context

---

### 7. Armazenamento de Tags (Relação N:N)

**Decisão**: Junction table `input_tags` com CASCADE delete.

**Racional**:
- Padrão SQL para relações many-to-many
- CASCADE delete mantém integridade automaticamente
- Índices em ambas FKs para queries eficientes
- UsageCount na tabela `tags` para ordenar sugestões

**Schema**:
```sql
CREATE TABLE input_tags (
  input_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (input_id, tag_id),
  FOREIGN KEY (input_id) REFERENCES user_inputs(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

**Alternativas consideradas**:
- JSON array na coluna tags: Descartado - dificulta queries e sugestões
- Denormalized tags string: Descartado - não permite contagem de uso

---

### 8. Optimistic Updates no InboxStore

**Decisão**: Seguir o mesmo padrão do ShoppingListStore com snapshot/rollback.

**Racional**:
- Padrão já validado no projeto (ShoppingListStore)
- Consistência de código entre stores
- UI instantânea sem loading para operações comuns
- Rollback automático em caso de erro

**Fluxo**:
1. Capturar snapshot do estado atual
2. Aplicar mudança otimista na UI
3. Executar operação no repository
4. Em caso de erro: restaurar snapshot + mostrar erro

**Alternativas consideradas**:
- Loading state bloqueante: Descartado - UX inferior
- Fire-and-forget: Descartado - sem feedback de erro
- React Query: Descartado - adiciona dependência desnecessária

---

### 9. Long Press Menu

**Decisão**: Usar componente Popover/Menu customizado posicionado próximo ao item.

**Racional**:
- Long press é padrão de interação para menus contextuais no mobile
- Popover próximo ao item é mais intuitivo que bottom sheet
- Simples de implementar com Pressable + onLongPress
- Overlay escuro para fechar ao tocar fora

**Componentes necessários**:
- `InputOptionsMenu`: Menu com opções Editar/Excluir
- `DeleteConfirmDialog`: AlertDialog de confirmação

**Alternativas consideradas**:
- Bottom sheet: Descartado - muito invasivo para 2 opções
- Swipe actions: Descartado - menos discoverable que long press
- Inline buttons: Descartado - polui visualmente a lista

---

### 10. Logo Component

**Decisão**: Criar átomo `Logo` simples com texto estilizado "Listify".

**Racional**:
- Consistência visual em toda aplicação (navbar, drawer)
- Reusável em diferentes contextos
- Segue atomic design (átomo primitivo)
- Fira Sans Bold + cyan primary = identidade visual

**Especificação**:
- Font: Fira Sans Bold
- Size: 24px (xl)
- Color: theme.colors.primary (cyan-500)
- Sem ícone adicional (texto puro)

**Alternativas consideradas**:
- SVG logo: Descartado para MVP - texto é suficiente
- Logo com ícone: Descartado - complexidade desnecessária

---

## Dependências a Adicionar

```json
{
  "dependencies": {
    "@shopify/flash-list": "^1.6.0",
    "@react-navigation/drawer": "^7.0.0"
  }
}
```

**Nota**: `react-native-reanimated` já está no projeto.

## Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Performance FlashList com muitos itens | Baixa | Médio | Testar com 1000+ itens |
| Drawer conflita com gestos existentes | Baixa | Baixo | Configurar edge width |
| Tags com caracteres especiais | Média | Baixo | Regex robusta + validação |
| Migration SQLite falha | Baixa | Alto | Testes de migration |

## Próximos Passos

1. ✅ Research completo
2. → Criar data-model.md com entidades detalhadas
3. → Criar contracts/ com interfaces TypeScript
4. → Criar quickstart.md para desenvolvimento
5. → Executar /speckit.tasks para gerar tarefas
