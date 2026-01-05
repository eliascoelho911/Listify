# Plano Técnico: Listify (React Native + Expo)

**Branch**: `001-grocery-list` | **Data**: 2026-01-04 | **Versão alvo**: `v1.0 (MVP)` | **Spec**: `specs/001-grocery-list/spec.md`  
**Objetivo**: Planejar a implementação do Listify como um app mobile (offline-first) com Expo + TypeScript, Expo Router (file-based routing) e Clean Architecture, mantendo o MVP simples e abrindo caminho para evoluções (v1.1, v2.0).

## 1) Contexto e objetivo do plano

O Listify resolve um problema simples com alto valor: capturar e acompanhar uma lista única de compras com o menor atrito possível, sem depender de internet.

Este plano organiza:

- **MVP (v1.0)**: fluxo principal “adicionar → acompanhar → marcar como comprado”, com persistência local.
- **v1.1**: melhorias de produtividade e polimento (ex.: drag-and-drop, histórico, configurações completas).
- **v2.0**: expansão para outros tipos de lista e/ou sincronização (fora do MVP).

## 2) Stack técnica detalhada (decisões e justificativas)

| Decisão | Escolha | Por quê (resumo) | Alternativas consideradas |
|---|---|---|---|
| Runtime | React Native + Expo (managed) | reduz atrito de setup, build e deploy; bom suporte cross-plataform | RN bare |
| Navegação | Expo Router | file-based routing, integração boa com Expo e deep linking | React Navigation “manual” |
| Linguagem | TypeScript (strict) | tipagem forte em todas as camadas e testes de domínio mais fáceis | JS |
| i18n | `i18next` + `react-i18next` + `expo-localization` | app bilíngue (pt-BR/en) desde o MVP; evita strings hard coded | “strings soltas”, libs ad-hoc |
| State (UI) | Zustand | simples, baixo boilerplate, encaixa bem com “view model/store” | Context+hooks, Jotai |
| Persistência | `expo-sqlite` (SQL direto + migrações simples) | estrutura, consultas e evolução/migrações mais seguras que key-value | AsyncStorage puro |
| Qualidade | ESLint + Prettier | consistência e redução de bugs; CI futuro mais previsível | só ESLint |
| Catálogo UI | Storybook React Native | desenvolver e validar componentes isoladamente | “screens sandbox” manual |
| (futuro) Data fetching | TanStack Query (v2.0+) | útil se houver sync/API; não necessário no MVP offline | fetch manual, SWR |

## 3) Contexto técnico (v1.0)

**Linguagem/Versão**: TypeScript (`strict`)  
**Dependências Principais**: Expo SDK + React Native + Expo Router  
**Storage**: `expo-sqlite` (offline-first; SQLite como fonte de verdade)  
**Testes**: Jest (com foco em testes puros de TypeScript para domínio)  
**Plataforma-alvo**: iOS e Android  
**Tipo de Projeto**: mobile (single app)  
**Metas de Performance**: “instantâneo percebido”; 60fps; listas responsivas  
**Restrições**: offline-first; operações atômicas; não travar a UI; recuperação em falha de leitura  
**Escala/Escopo**: 1 lista ativa + itens/categorias + resumo; demais fluxos por versão

## 4) Checagem da Constituição (gate)

- [x] Documentação em pt-BR; nomes de código em inglês
- [x] Versões definidas (v1.0/v1.1/v2.0) + fora de escopo explícito
- [x] Fluxo crítico minimalista (“adicionar/marcar/filtrar” com pouco atrito)
- [x] Offline-first e UX instantânea (sem travar UI)
- [x] Estados claros e resumo de progresso no topo
- [x] Clean Architecture (UI sem lógica de negócio; domínio testável)
- [x] Testes planejados para regras de negócio (unidade no domínio)
- [x] i18n planejado desde o MVP (pt-BR + en; sem strings hard coded)

## 5) Roadmap e delimitação de versões

### v1.0 (MVP) — “Lista única de compras”

> Nota de escopo: a spec descreve o produto completo com prioridades (P1/P2/P3). Este plano assume **release v1.0 = P1 + base offline-first**; itens P2/P3 entram como **v1.1+** para manter o MVP executável e alinhado à constituição (entregas incrementais).

**Inclui (prioridade P1 + base offline-first):**

- Lista única ativa (ShoppingList) com itens agrupados por categoria.
- Campo de entrada fixo no rodapé para adicionar por texto livre (com parsing no submit).
- Marcar/desmarcar como comprado com 1 toque (com micro-feedback e opção de undo).
- Edição por modal/sheet de `name`, `quantity`, `unit`, `category`, `unitPrice/totalPrice` (preço opcional).
- Resumo no topo (pendentes vs comprados; valores só quando calculáveis).
- Busca por nome e filtro “ocultar comprados” (se não complicar o drag/drop do futuro).
- Persistência local (SQLite) como fonte de verdade; recuperação em falha de leitura.
- Base de i18n (pt-BR + en) inicializada no app e aplicada às telas do MVP.

**Fora do MVP (vai para v1.1/v2.0):**

- Drag-and-drop (dentro e entre categorias).
- Histórico de compras concluídas e reuso de listas.
- Notificação por proximidade (geofence).
- Tela de configurações completa (moeda, preferências, permissões).
- Múltiplas listas simultâneas e outros tipos de lista (filmes/séries/games/livros).
- Sync, login, colaboração.

### v1.1 — “Produtividade e fechamento de loop”

- Drag-and-drop consistente com “ocultar comprados”.
- Histórico + reuso (incremental/substituir) com confirmação e UX “rápida”.
- Configurações (moeda, askPriceOnPurchase, hidePurchasedByDefault).
- Polimento de UX (empty states, haptics, acessibilidade, micro-animações).

### v2.0 — “Expansão e/ou sincronização”

- Outros tipos de lista com domínios separados (ex.: `domain/mediaList/*`).
- Sync entre dispositivos (ports no domínio já previstos em v1.x).
- Compartilhamento colaborativo e contas (se houver objetivo claro).

## 6) Arquitetura e estrutura de pastas (Clean Architecture)

### 6.0 Estrutura da documentação (esta feature)

```text
specs/001-grocery-list/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
└── quickstart.md
```

### 6.1 Princípios de dependência

- **Regra central**: dependências sempre **de fora para dentro**.
- `presentation → domain` (pode) / `domain → presentation` (não pode).
- `infra` implementa *ports* do `domain` e é injetado na borda (composition root).
- O `domain` não importa React, Expo, RN, nem libs de UI.

### 6.2 Estrutura proposta do repositório (v1.0)

```text
app/                               # Expo Router (file-based routing)
├── _layout.tsx                    # Providers + Stack
├── index.tsx                      # Home (/)
└── item/
   └── [id].tsx                    # Edição (modal ou screen)

src/
├── app/                           # Composition root (DI) + bootstrap
│  ├── di/
│  │  ├── container.ts             # buildDependencies()
│  │  └── types.ts                 # tokens/aliases de DI (sem lib externa)
│  ├── i18n/                       # inicialização e recursos de tradução
│  │  ├── i18n.ts                  # init i18next + react-i18next + expo-localization
│  │  └── locales/
│  │     ├── en/
│  │     └── pt-BR/
│  └── providers/
│     └── AppProviders.tsx         # Provider de DI + tema + store
├── presentation/
│  ├── screens/
│  │  ├── ShoppingListScreen.tsx
│  │  └── EditItemScreen.tsx
│  ├── components/                 # componentes “smart/dumb” da UI
│  ├── hooks/                      # hooks de UI (ex.: useShoppingListVM)
│  └── state/                      # Zustand stores (view models)
├── domain/
│  └── shopping/
│     ├── entities/
│     ├── value-objects/
│     ├── use-cases/
│     ├── ports/                   # interfaces (repositories/services)
│     └── errors/
├── data/
│  └── shopping/
│     ├── mappers/                 # DTO ↔ domain
│     └── repositories/            # implementações “data-level” (orquestra)
├── infra/
│  ├── storage/
│  │  └── sqlite/
│  │     ├── migrations/
│  │     ├── SqliteDatabase.ts      # open + migrate + transaction helpers
│  │     └── ShoppingSqliteRepo.ts  # implementação concreta do port
│  └── platform/                   # Expo adapters (haptics, permissions, etc.)
└── design-system/
   ├── tokens/                     # cores, tipografia, espaçamentos
   ├── theme/                      # ThemeProvider, light/dark (futuro)
   └── components/                 # Button, TextField, Chip, etc.

storybook/                         # config Storybook
tests/                             # testes puros (principalmente domain)
```

### 6.3 Responsabilidade por camada (resumo)

- `domain/*`: regras de negócio, entidades, validações, use cases, ports.
- `data/*`: mapeamento e coordenação entre domínio e infra (sem Expo/RN).
- `infra/*`: detalhes de platform/storage (Expo/RN/SQLite).
- `presentation/*`: telas, view models/stores, componentes e orquestração de UI.
- `design-system/*`: tokens e componentes reutilizáveis (inclui “playful leve”).
- `app/` (routes): arquivos finos; só conectam rota ↔ screen.

## 7) Modelo de domínio e casos de uso (v1.0)

> O modelo detalhado (campos) segue a spec em `specs/001-grocery-list/spec.md` e está espelhado em `specs/001-grocery-list/data-model.md`.

### 7.1 Entidades (núcleo)

- `ShoppingList`: lista ativa, moeda e preferências básicas.
- `ShoppingItem`: item com `quantity`, `unit`, `categoryId`, `status`, `position`, preços opcionais.
- `Category`: nome (único case-insensitive), `isPredefined`, `sortOrder`.

### 7.2 Value Objects (mínimo)

- `Quantity` (até 3 casas; aceita vírgula e fração na entrada).
- `Unit` (normalizada por dicionário de sinônimos).
- `Money`/`MoneyMinor` (inteiro em minor units + `currencyCode` no contexto da lista).

### 7.3 Use cases (v1.0)

| Ação na UI | Use case (domain) | Observações |
|---|---|---|
| Adicionar item por texto | `CreateItemFromFreeText` | parsing no submit; valida “nome não vazio” |
| Alternar comprado | `ToggleItemPurchased` | registra `purchasedAt`; move posição dentro do grupo |
| Editar item | `UpdateItem` | recalcula `unitPrice/totalPrice` quando aplicável |
| Remover item | `DeleteItem` | idealmente com undo em `presentation` |
| Listar/obter estado atual | `GetActiveListState` | retorna view-model friendly (ou DTO) |
| Alterar preferências locais | `UpdatePreferences` | ex.: `hidePurchasedByDefault`, `askPriceOnPurchase` |
| Buscar/filtrar | `SearchItems` (opcional) | pode ser feito na UI se não violar domínio |

### 7.4 Ports (interfaces no domínio)

- `ShoppingRepository`
  - `getActiveList(): Promise<ShoppingList>`
  - `getItems(listId): Promise<ShoppingItem[]>`
  - `upsertItem(item): Promise<void>`
  - `deleteItem(id): Promise<void>`
  - `upsertCategory(category): Promise<void>`
  - `transaction(fn): Promise<T>`
- `Clock` (para `purchasedAt`, `createdAt`, etc.)
- (futuro) `SyncService`, `NotificationScheduler`, `LocationService` (v2.0)

## 8) Persistência e offline-first (v1.0)

### 8.1 Por que SQLite no MVP (vs AsyncStorage)

- **AsyncStorage** (key-value): mais rápido de começar, mas cresce mal com consultas, ordenação e migrações.
- **SQLite**: ligeiramente mais setup, mas dá:
  - consultas eficientes (filtros/busca),
  - integridade (constraints),
  - migrações previsíveis (v1.1/v2.0).

Decisão: **SQLite** como fonte de verdade, com helper de migração simples.

### 8.2 Esquema inicial (proposta)

> Detalhes em `specs/001-grocery-list/data-model.md` (tabelas e índices).

- `lists` (1 ativa por vez no MVP).
- `categories` (predefinidas + customizadas).
- `items` (status, posição, preços em minor units).
- (v1.1) `history_entries` + `history_items` (ou snapshot JSON por entry).

### 8.2.1 Bootstrap e consistência

- **Seed inicial** na primeira execução (dentro de transação):
  - criar 1 `ShoppingList` ativa (com `currencyCode=BRL` default),
  - inserir categorias predefinidas + categoria `outros` (default).
- **Operações atômicas**: toda mutação relevante roda em `transaction()` para evitar estado parcial.
- **UI otimista**: `presentation` aplica a mudança imediatamente; em falha de persistência, faz rollback + feedback não bloqueante (e mantém texto do input quando aplicável).

### 8.3 Estratégia de migração

- Pasta `src/infra/storage/sqlite/migrations/` com arquivos `0001_init.sql`, `0002_*.sql`, …
- Controle via `PRAGMA user_version` + aplicação incremental dentro de transação.
- Regras:
  - migração sempre *forward-only*,
  - dados existentes devem ser preservados,
  - rollback manual só em desenvolvimento.

## 9) Fluxos de UI e navegação (Expo Router)

### 9.1 Rotas do MVP (v1.0)

- `/` (`app/index.tsx`): lista principal
  - summary header (topo),
  - lista agrupada por categoria,
  - input fixo no rodapé (“thumb-first”).
- `/item/[id]` (`app/item/[id].tsx`): edição detalhada
  - recomendado como modal/sheet (Stack com `presentation: "modal"`).

### 9.2 Organização dos arquivos (Expo Router)

- `app/_layout.tsx`: Stack + `AppProviders`.
- Rotas finas: não conter lógica de negócio; só conectam rota ↔ screen + params.

### 9.3 Thumb-first + playful leve (aplicação prática)

- Ações primárias próximas ao polegar: adicionar, alternar comprado, desfazer.
- Micro-animações curtas ao concluir (ex.: check + leve “bounce”) e haptics sutis.
- Empty states simpáticos (uma frase curta + call-to-action), sem poluir a tela.
- Respeitar redução de movimento quando disponível.

## 10) Design System + Storybook

### 10.1 Tokens (criar primeiro)

- Cores: neutros (fundo/texto/bordas) + primária + estados (success/warn/danger).
- Tipografia: `title`, `body`, `label`, `caption` (escala curta).
- Espaçamento: escala 4/8/12/16/24/32.
- Raios: `sm/md/lg` (cartões e chips).
- Sombras: leves e consistentes (evitar “peso” visual).

### 10.2 Componentes base (ordem sugerida)

1. `TextField` (input rápido + submit).
2. `Button` / `IconButton` (ações principais e secundárias).
3. `Chip` (categoria).
4. `ListItemCard` (pendente/comprado; swipe actions futuro).
5. `SummaryHeader` (contadores + valores quando houver).

### 10.3 Storybook (mínimo viável)

- Stories desde o início para: `Button`, `TextField`, `Chip`, `ListItemCard`, `SummaryHeader`.
- Variantes obrigatórias: estados (default/pressed/disabled), tamanhos e tema (light; dark futuro).

## 11) ESLint, Prettier e convenções

### 11.1 ESLint + Prettier

- Base: `eslint-config-universe` (Expo) + `@typescript-eslint/*`.
- Prettier integrado via `eslint-config-prettier` e `eslint-plugin-prettier` (opcional).

Regras/objetivos adicionais:

- Proibir `any` implícito e reforçar `strict`.
- Tipagem em fronteiras: `@typescript-eslint/explicit-module-boundary-types` (ao menos para exports públicos).
- Proibir imports “para dentro” do domínio:
  - `src/domain/**` não pode importar `react`, `expo-*`, `react-native`, nem `src/presentation/**`.
- Evitar lógica de negócio em componentes:
  - preferir `useShoppingListVM()` / store (Zustand) chamando use cases.
- Imports consistentes: `eslint-plugin-simple-import-sort` (ou alternativa equivalente).

### 11.2 Convenções

- Componentes: `PascalCase.tsx` (ex.: `ListItemCard.tsx`).
- Arquivos utilitários: `camelCase.ts` ou `kebab-case` quando fizer sentido (consistência por pasta).
- Rotas Expo Router: nomes em `kebab-case` e parâmetros em `[param]`.
- Imports: path aliases (`@domain/*`, `@infra/*`, …) para reduzir “../../”.

## 12) Estratégia de testes (sem testes de UI)

### 12.1 Prioridade (v1.0)

- `domain`: testes de unidade para regras de parsing, validação e transições de estado.
- `data`: testes de mapeadores e orquestração (sem depender de Expo).
- `infra/sqlite`: opcional no MVP (pode entrar em v1.1 como integração).

### 12.2 Lista mínima de testes de domínio

- `CreateItemFromFreeText`:
  - defaults (`quantity=1`, `unit=un`, `category=outros`),
  - frações e vírgula,
  - `@categoria` em posições variadas,
  - erro quando “nome” vazio.
- `ToggleItemPurchased`:
  - alternância, `purchasedAt`, preservação de ordem básica.
- `UpdateItem`:
  - recálculo `unitPrice/totalPrice` conforme regra da spec.

## 13) Próximos passos (depois deste plano)

- Criar `specs/001-grocery-list/tasks.md` com entregas por versão e por camada (domain/data/infra/presentation).
- Bootstrap do app Expo + estrutura de pastas + CI básico (lint/test) quando iniciar implementação.
