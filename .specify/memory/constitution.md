<!--
Sync Impact Report
- Version change: 1.1.0 → 2.0.0
- Rationale: Reestruturação completa dos princípios com foco exclusivo em qualidade de código,
  arquitetura limpa, testes, UI consistente e performance. Mudança MAJOR por redefinição
  significativa de princípios existentes e remoção de princípios de produto específicos.
- Modified principles:
  - "VI. Clean Architecture e Separação Clara de Camadas" → "II. Clean Architecture e Separação Clara de Camadas" (expandido)
  - "VII. Testes para Regras de Negócio" → "III. Cobertura de Testes Obrigatória" (expandido com requisitos específicos)
  - "IX. Design System: Remix Inspirado no Shadcn" → "IV. Design System Consistente" (expandido com validação visual)
- Added principles:
  - "I. Qualidade de Código como Pré-requisito" (novo)
  - "V. Confiabilidade e Ausência de Bugs" (novo)
  - "VI. Performance Percebida" (novo)
- Removed principles (movidos para documentação de produto separada):
  - "Foco Inicial: Lista Única de Compras"
  - "Menos Atrito: Velocidade, Simplicidade e Clareza"
  - "Estado e Progresso Sempre Claros"
  - "Offline-First e Operações Instantâneas" (aspectos técnicos integrados em VI. Performance)
  - "Entregas Incrementais e Versionadas"
  - "Internacionalização desde o Início"
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ compatível (checagem de constituição genérica)
  - .specify/templates/spec-template.md ✅ compatível
  - .specify/templates/tasks-template.md ✅ compatível (testes obrigatórios já documentados)
  - .specify/templates/checklist-template.md ✅ compatível
- Follow-up TODOs: Nenhum
-->

# Listify Constitution

## Princípios Técnicos

### I. Qualidade de Código como Pré-requisito

- Todo código MUST passar por `npm run lint` com **zero warnings** antes de merge.
- TypeScript MUST ser usado em **strict mode**; erros de tipo MUST NOT ser ignorados ou suprimidos.
- Tipagem MUST ser explícita para parâmetros, retornos e variáveis; `any` implícito MUST NOT existir.
- Código MUST seguir convenções do projeto documentadas em `CLAUDE.md`:
  - Componentes: `ReactElement` como tipo de retorno
  - Estilos: `StyleProp<ViewStyle>` ou `StyleProp<TextStyle>`
  - Props: interfaces/types em arquivos `.types.ts`
- Código duplicado SHOULD ser extraído para utilitários ou hooks reutilizáveis.
- Comentários SHOULD existir apenas quando a lógica não for auto-explicativa; evitar comentários óbvios.
- Mensagens de exceção MUST ser em inglês.

**Racional**: qualidade de código é a fundação de um produto sustentável; bugs e dívida técnica crescem
exponencialmente quando a qualidade é negligenciada.

### II. Clean Architecture e Separação Clara de Camadas

- O projeto MUST seguir Clean Architecture com camadas bem definidas:
  - `domain/` — Regras de negócio puras (MUST NOT importar React/RN)
  - `data/` — Mappers entre camadas
  - `infra/` — Implementações de infraestrutura (SQLite, APIs externas)
  - `presentation/` — Componentes React, hooks, stores Zustand
  - `design-system/` — Tokens, tema e componentes de UI
- Lógica de negócio MUST residir em use cases no domínio; MUST NOT ficar em componentes de UI.
- Componentes de UI MUST NOT acessar diretamente infraestrutura (banco, APIs); MUST usar abstrações
  (repositories, services) via DI container.
- Fluxo de dependências MUST respeitar: `app → presentation → domain ← data → infra`
- Path aliases (`@domain/*`, `@presentation/*`, etc.) MUST ser usados; imports relativos profundos MUST NOT existir.

**Racional**: separação de responsabilidades facilita evolução, testes, manutenção e permite trocar
implementações sem afetar regras de negócio.

### III. Cobertura de Testes Obrigatória

- Novos requisitos de negócio e use cases MUST ter testes automatizados antes de merge.
- Regras de domínio MUST ser cobertas por testes de unidade em `tests/domain/`.
- Fluxos de dados e integrações SHOULD ser cobertos por testes de integração quando aplicável.
- Mappers em `data/` MUST ter testes em `tests/data/`.
- Hooks e componentes críticos SHOULD ter testes em `tests/presentation/`.
- Testes MUST rodar com `npm test` e passar sem erros.
- Testes SHOULD seguir padrão AAA (Arrange, Act, Assert) e ter nomes descritivos.
- Bug fixes SHOULD incluir teste de regressão que falha antes da correção e passa depois.

**Racional**: testes protegem as regras do produto, documentam comportamento esperado e dão segurança
para evoluir rápido sem introduzir regressões.

### IV. Design System Consistente

- O Design System MUST seguir **Atomic Design** (atoms → molecules → organisms).
- Componentes MUST ser criados via CLI (`npm run ds generate <level> <name>`); criação manual MUST NOT ocorrer.
- Valores hard-coded (cores hex, números de spacing, fontSize) MUST NOT existir em componentes;
  MUST usar tokens via `useTheme()`.
- Hierarquia de imports Atomic Design MUST ser respeitada (ESLint `atomic-design-imports`):
  - Atoms: podem importar tokens, theme, utils; MUST NOT importar molecules ou organisms
  - Molecules: podem importar atoms, tokens, theme, utils; MUST NOT importar outras molecules ou organisms
  - Organisms: podem importar atoms, molecules, tokens, theme, utils; MUST NOT importar templates ou pages
- Componentes MUST ter 5 arquivos: `.tsx`, `.styles.ts`, `.types.ts`, `.stories.tsx`, `.test.tsx`.
- Novos componentes MUST ser documentados no Storybook e validados em dark/light themes.
- Antes de criar componente, verificar se existe equivalente no Design System; duplicação MUST NOT ocorrer.

**Racional**: consistência visual e de código acelera desenvolvimento, reduz bugs de UI e garante
experiência coesa para o usuário.

### V. Confiabilidade e Ausência de Bugs

- Código que entra em produção MUST passar por todos os checks: lint, testes, type-check.
- Erros de runtime MUST ser tratados com feedback claro ao usuário; app MUST NOT crashar silenciosamente.
- Operações assíncronas MUST ter estados de loading, erro e sucesso visíveis na UI.
- Operações críticas (salvar, deletar) MUST ter confirmação ou ser reversíveis (undo).
- Dados do usuário MUST ser persistidos de forma confiável; perda de dados MUST NOT ocorrer.
- Edge cases (lista vazia, input inválido, offline) MUST ser tratados e testados.
- Bugs reportados MUST incluir teste de regressão junto com a correção.

**Racional**: confiabilidade é a base da confiança do usuário; bugs degradam a experiência e corroem
a percepção de qualidade do produto.

### VI. Performance Percebida

- Operações principais MUST ser instantâneas do ponto de vista do usuário (≤100ms de feedback visual).
- UI MUST NOT travar durante operações de banco ou rede; operações pesadas MUST rodar em background.
- Listas com muitos itens MUST usar virtualização (FlatList) para manter 60fps.
- Updates de estado MUST usar padrão otimista com rollback em caso de erro.
- Operações principais MUST funcionar **offline-first**; sincronização (quando existir) MUST NOT
  bloquear a UI e MUST tolerar falhas de rede.
- Métricas de performance SHOULD ser monitoradas; regressões SHOULD ser detectadas em code review.

**Racional**: performance percebida é parte da experiência do usuário; lentidão é percebida como bug
e reduz a satisfação com o produto.

## Diretrizes de Documentação e Linguagem

- Toda documentação (specs, planos técnicos, tasks e comentários) MUST ser escrita em português do Brasil.
- Nomes de classes, funções, endpoints, pacotes, componentes de UI e termos de bibliotecas MUST permanecer em inglês.
- O texto SHOULD evitar traduções estranhas de termos técnicos já comuns em inglês (ex.: "layout", "endpoint",
  "use case").
- Copy do app (texto na UI) MUST ser escrito em **pt-BR e en** via i18n; evitar misturar idiomas na mesma tela.

## Workflow de Desenvolvimento e Qualidade

- O trabalho de produto e engenharia SHOULD seguir a cadência: spec → plan → tasks → implementação incremental.
- Cada feature MUST manter o escopo da versão-alvo explícito (inclui / fora de escopo / backlog).
- Implementações MUST respeitar as camadas (UI ↔ domínio ↔ dados) e evitar acoplamentos "curtos".
- A inclusão de novos use cases MUST incluir testes automatizados junto com a implementação.
- Pre-commit check (`npm test && npm run lint`) MUST passar antes de qualquer merge.

## Governance

- Esta constituição tem precedência sobre templates e práticas locais; divergências MUST ser explicitadas e
  justificadas no artefato de design correspondente.
- Emendas MUST:
  - descrever o motivo e o impacto (produto e engenharia),
  - atualizar templates afetados para manter consistência,
  - atualizar a versão seguindo SemVer (MAJOR/MINOR/PATCH) conforme a mudança.
- Revisões de mudanças de produto/engenharia SHOULD validar aderência aos princípios antes de iniciar
  implementação.

**Version**: 2.0.0 | **Ratified**: 2026-01-04 | **Last Amended**: 2026-01-16
