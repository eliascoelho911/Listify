# Design Visual: Inbox Screen

**Feature**: 003-inbox-screen
**Data**: 2026-01-11
**Design System**: Listify DS (Shadcn Remix)

## Filosofia de Design

**Shadcn-inspired**: Minimalista, funcional, sem decorações desnecessárias.

- Interface limpa com foco no conteúdo
- Hierarquia visual através de tipografia e espaçamento
- Feedback sutil para interações
- Dark theme como padrão

---

## Tokens do Design System

### Cores (Dark Theme)

| Token | Valor | Uso |
|-------|-------|-----|
| `background` | gray.950 | Fundo da tela |
| `card` | gray.900 | Cards, popovers |
| `primary` | cyan.500 | Ações principais |
| `foreground` | gray.50 | Texto principal |
| `mutedForeground` | gray.400 | Texto secundário |
| `border` | gray.800 | Bordas, separadores |
| `input` | gray.800 | Background de inputs |
| `destructive` | red.500 | Ações destrutivas |

### Tipografia

| Uso | Font | Size | Weight |
|-----|------|------|--------|
| Logo | Fira Sans | xl (24px) | bold (700) |
| Card title | Fira Sans | base (16px) | regular (400) |
| Card meta | Fira Sans | xs (12px) | regular (400) |
| Badge | Fira Sans | xs (12px) | medium (500) |
| Input | Fira Sans | base (16px) | regular (400) |
| Section title | Fira Sans | sm (14px) | medium (500) |

### Espaçamento

| Token | Valor | Uso |
|-------|-------|-----|
| xs | 4px | Gap interno |
| sm | 8px | Gap entre badges |
| md | 12px | Padding interno |
| lg | 16px | Padding de cards |
| xl | 24px | Margens da tela |

### Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| sm | 8px | Badges, chips |
| md | 12px | Cards, inputs |
| lg | 16px | Sections |
| full | 9999px | Date badges |

---

## Layout da Tela

```
┌──────────────────────────────────────────────────────────┐
│  [Menu]              Listify                             │  Navbar
├──────────────────────────────────────────────────────────┤
│  [Search icon]  Buscar...                                │  SearchBar
├──────────────────────────────────────────────────────────┤
│  Suas principais listas                                  │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   │  Empty State
│  │          Nenhuma lista fixada                    │   │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │
├──────────────────────────────────────────────────────────┤
│                      [ Ontem ]                           │  DateBadge
│  ┌────────────────────────────────────────────────────┐  │
│  │  Comprar leite                                     │  │  UserInputCard
│  │  [#compras]                              14:32     │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Ligar para dentista                               │  │
│  │  [#pessoal] [#saúde]                     15:47     │  │
│  └────────────────────────────────────────────────────┘  │
│                      [ Hoje ]                            │  DateBadge
│  ┌────────────────────────────────────────────────────┐  │
│  │  Revisar código do PR                              │  │
│  │  [#trabalho]                             09:15     │  │
│  └────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────┤
│  [#compras] [#pessoal] [#trabalho]                       │  TagSuggestions
├──────────────────────────────────────────────────────────┤
│  [Input: Digite algo...]                        [Send]   │  InputBar
└──────────────────────────────────────────────────────────┘
```

---

## Componentes

### 1. InboxNavbar

Estende o Navbar existente com Logo centralizado.

```
┌──────────────────────────────────────────────────────────┐
│  [≡]                 Listify                             │
└──────────────────────────────────────────────────────────┘
```

| Propriedade | Valor |
|-------------|-------|
| Height | 56px |
| Background | `colors.navbar` |
| Left | IconButton (Menu), variant ghost |
| Center | Logo component |
| Border bottom | 1px `colors.border` |

**Logo**:
- Text: "Listify"
- Font: Fira Sans Bold, 24px
- Color: `colors.primary`

---

### 2. SearchBar

Usa componente SearchBar existente do DS.

```
┌──────────────────────────────────────────────────────────┐
│  [🔍]  Buscar...                                         │
└──────────────────────────────────────────────────────────┘
```

| Propriedade | Valor |
|-------------|-------|
| Margin | xl (24px) horizontal, md (12px) vertical |
| State | Visual only (disabled ou não funcional) |
| Placeholder | "Buscar..." |

---

### 3. Pinned Lists Section

#### Header

```
Suas principais listas
```

- Font: Fira Sans Medium, 14px
- Color: `colors.foreground`
- Margin: xl horizontal, md bottom

#### Empty State

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                                                         │
│              Nenhuma lista fixada                       │
│                                                         │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

| Propriedade | Valor |
|-------------|-------|
| Border | 1px dashed `colors.border` |
| Border radius | lg (16px) |
| Padding | xl (24px) |
| Min height | 64px |
| Text | Fira Sans, 14px, `colors.mutedForeground` |
| Align | center |

---

### 4. DateBadge

Separador de data centralizado (sticky header no FlashList).

```
                    [ Ontem ]
```

| Propriedade | Valor |
|-------------|-------|
| Background | `colors.muted` |
| Border radius | full (pill) |
| Padding | xs vertical, md horizontal |
| Text | Fira Sans Medium, 12px, `colors.mutedForeground` |
| Margin | md vertical |
| Position | Sticky top durante scroll |

**Valores de texto**:
- "Hoje" para data atual
- "Ontem" para dia anterior
- "DD mmm" para outras datas (ex: "08 jan")

---

### 5. UserInputCard

Card de item com texto, tags e horário.

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Comprar leite e pão para o café                        │
│                                                          │
│  [#compras]  [#mercado]                        14:32     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

| Propriedade | Valor |
|-------------|-------|
| Background | `colors.card` |
| Border radius | md (12px) |
| Padding | lg (16px) |
| Margin | xl horizontal, sm bottom |

**Conteúdo**:

| Elemento | Estilo |
|----------|--------|
| Text | Fira Sans, 16px, `colors.foreground` |
| Tags container | flex row, wrap, gap sm |
| Tag badge | variant secondary |
| Timestamp | Fira Sans, 12px, `colors.mutedForeground`, align right |

**Interação**:
- Long press: Abre InputOptionsMenu
- Press: Nenhuma ação (futuro: expandir)

---

### 6. UserInputCard - Estados

#### Loading (durante criação)

```
┌──────────────────────────────────────────────────────────┐
│  Comprar leite...                              [spinner] │
└──────────────────────────────────────────────────────────┘
```

- Opacity: 0.6
- Spinner: ActivityIndicator, `colors.primary`

#### Edit Mode

```
┌──────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────┐  │
│  │ Comprar leite e pão para o café█                   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  [#compras ×]  [#mercado ×]                              │
│                                                          │
│                      [Cancelar]  [Salvar]                │
└──────────────────────────────────────────────────────────┘
```

| Elemento | Estilo |
|----------|--------|
| Border | 2px `colors.ring` |
| TextInput | Fira Sans, 16px, `colors.foreground` |
| Tag removível | Badge com X icon |
| Cancelar | Button variant ghost |
| Salvar | Button variant default |

---

### 7. InputOptionsMenu

Menu contextual ao fazer long press em um card.

```
┌─────────────────────┐
│                     │
│  Editar             │
│                     │
├─────────────────────┤
│                     │
│  Excluir            │  ← destructive
│                     │
└─────────────────────┘
```

| Propriedade | Valor |
|-------------|-------|
| Background | `colors.popover` |
| Border | 1px `colors.border` |
| Border radius | md (12px) |
| Min width | 160px |
| Shadow | sm |

**Items**:

| Item | Estilo |
|------|--------|
| Padding | lg horizontal, md vertical |
| Font | Fira Sans, 14px |
| Editar | `colors.foreground` |
| Excluir | `colors.destructive` |

**Comportamento**:
- Aparece próximo ao card pressionado
- Overlay escuro fecha ao tocar fora

---

### 8. DeleteConfirmDialog

AlertDialog seguindo padrão Shadcn.

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Excluir item?                                           │
│                                                          │
│  Esta ação não pode ser desfeita.                        │
│                                                          │
│                           [Cancelar]  [Excluir]          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

| Propriedade | Valor |
|-------------|-------|
| Background | `colors.card` |
| Border radius | lg (16px) |
| Padding | xl (24px) |
| Max width | 400px |

**Conteúdo**:

| Elemento | Estilo |
|----------|--------|
| Title | Fira Sans Semibold, 18px, `colors.foreground` |
| Description | Fira Sans, 14px, `colors.mutedForeground` |
| Footer | flex row, justify end, gap sm |
| Cancelar | Button variant outline |
| Excluir | Button variant destructive |

---

### 9. TagSuggestions

Popup de sugestões ao digitar `#`.

```
┌──────────────────────────────────────────────────────────┐
│  [#compras]  [#pessoal]  [#trabalho]  [#ideias]          │
└──────────────────────────────────────────────────────────┘
```

| Propriedade | Valor |
|-------------|-------|
| Position | Fixed, acima da InputBar |
| Background | `colors.popover` |
| Border top | 1px `colors.border` |
| Padding | md (12px) |
| Layout | Horizontal scroll |

**Tag chips**:

| Propriedade | Valor |
|-------------|-------|
| Background | `colors.secondary` |
| Border radius | sm (8px) |
| Padding | xs vertical, sm horizontal |
| Font | Fira Sans Medium, 14px |
| Color | `colors.foreground` |
| Gap | sm (8px) |

**Comportamento**:
- Aparece quando texto contém `#` + letras
- Filtra tags existentes por prefixo
- Ordena por usage count (mais usadas primeiro)
- Tocar em tag insere no input
- Desaparece ao selecionar ou remover `#`

---

### 10. InboxInputBar

Bottombar fixa para entrada de novos inputs.

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ┌──────────────────────────────────────────┐  ┌─────┐   │
│  │ Digite algo...                           │  │  ➤  │   │
│  └──────────────────────────────────────────┘  └─────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

| Propriedade | Valor |
|-------------|-------|
| Position | Fixed bottom |
| Background | `colors.card` |
| Border top | 1px `colors.border` |
| Padding | lg horizontal, md vertical |
| Safe area | Bottom inset |

**TextInput**:

| Propriedade | Valor |
|-------------|-------|
| Flex | 1 |
| Background | `colors.input` |
| Border radius | md (12px) |
| Padding | md vertical, lg horizontal |
| Placeholder | "Digite algo..." |
| Placeholder color | `colors.mutedForeground` |
| Font | Fira Sans, 16px, `colors.foreground` |

**Send Button**:

| Propriedade | Valor |
|-------------|-------|
| Component | IconButton |
| Icon | Send (lucide) |
| Variant | default (quando habilitado) |
| Size | md |
| Margin left | sm |

**Estados**:

| Estado | Comportamento |
|--------|---------------|
| Empty | Send button disabled, opacity 0.5 |
| Typing | Send button enabled |
| Sending | Spinner no lugar do ícone |

---

### 11. Empty State (Lista Vazia)

Quando não há inputs.

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                                                          │
│                                                          │
│              Nenhum item ainda                           │
│                                                          │
│         Comece digitando algo abaixo                     │
│                                                          │
│                                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

| Elemento | Estilo |
|----------|--------|
| Container | Flex 1, center |
| Title | Fira Sans Medium, 16px, `colors.foreground` |
| Subtitle | Fira Sans, 14px, `colors.mutedForeground` |
| Gap | sm |

---

### 12. Sidebar (Drawer)

Navegação lateral usando Expo Router Drawer.

```
┌───────────────────────┬──────────────────────────────────┐
│                       │                                  │
│  Listify              │                                  │
│                       │                                  │
│  ───────────────────  │                                  │
│                       │                                  │
│  Inbox           ◀──  │         (conteúdo principal)     │
│                       │                                  │
│  Listas               │                                  │
│                       │                                  │
│  Configurações        │                                  │
│                       │                                  │
│                       │                                  │
│                       │                                  │
│  ───────────────────  │                                  │
│                       │                                  │
│  v1.0.0               │                                  │
│                       │                                  │
└───────────────────────┴──────────────────────────────────┘
```

| Propriedade | Valor |
|-------------|-------|
| Width | 80% |
| Background | `colors.background` |

**Header**:

| Elemento | Estilo |
|----------|--------|
| Logo | Same as Navbar |
| Padding | xl |
| Border bottom | 1px `colors.border` |

**Menu Items**:

| Propriedade | Valor |
|-------------|-------|
| Padding | xl horizontal, lg vertical |
| Font | Fira Sans, 16px |
| Color | `colors.foreground` |
| Active | Background `colors.accent`, icon `colors.primary` |

**Footer**:

| Elemento | Estilo |
|----------|--------|
| Version | Fira Sans, 12px, `colors.mutedForeground` |
| Padding | xl |

---

## Animações

| Elemento | Animação | Duração |
|----------|----------|---------|
| Navbar | Slide down + fade | 300ms |
| Card appear | Fade in | 150ms |
| TagSuggestions | Slide up + fade | 150ms |
| Options menu | Scale + fade | 150ms |
| Drawer | Slide right | 250ms |
| Delete card | Fade out | 200ms |
| Button press | Scale 0.95 | 100ms |

---

## Acessibilidade

| Elemento | accessibilityLabel |
|----------|---------------------|
| Menu button | "Abrir menu" |
| Search bar | "Buscar" |
| Send button | "Enviar" |
| Edit option | "Editar" |
| Delete option | "Excluir" |
| Tag | "Tag {nome}" |
| Date badge | "Data: {data}" |
| Input card | "{texto}, {n} tags, {horário}" |

---

## Componentes a Criar

### Design System

| Componente | Tipo | Descrição |
|------------|------|-----------|
| Logo | Atom | Texto "Listify" estilizado |

### Feature (presentation/components/inbox/)

| Componente | Descrição |
|------------|-----------|
| InboxInputBar | Bottombar com input e send |
| UserInputCard | Card de item |
| DateBadge | Separador de data |
| TagSuggestions | Popup de sugestões |
| PinnedListsCarousel | Empty state de listas |
| InputOptionsMenu | Menu editar/excluir |
| DeleteConfirmDialog | Confirmação de exclusão |

### Navigation

| Componente | Descrição |
|------------|-----------|
| CustomDrawerContent | Conteúdo do drawer |

---

## i18n Keys

```json
{
  "inbox": {
    "title": "Inbox",
    "search": {
      "placeholder": "Buscar..."
    },
    "input": {
      "placeholder": "Digite algo..."
    },
    "pinnedLists": {
      "title": "Suas principais listas",
      "empty": "Nenhuma lista fixada"
    },
    "list": {
      "empty": {
        "title": "Nenhum item ainda",
        "subtitle": "Comece digitando algo abaixo"
      }
    },
    "actions": {
      "edit": "Editar",
      "delete": "Excluir",
      "cancel": "Cancelar",
      "save": "Salvar"
    },
    "dialog": {
      "deleteTitle": "Excluir item?",
      "deleteDescription": "Esta ação não pode ser desfeita."
    },
    "dates": {
      "today": "Hoje",
      "yesterday": "Ontem"
    }
  }
}
```
