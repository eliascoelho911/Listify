<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Modified principles: placeholders removidos e substituídos por princípios do Listify
- Added principles: Internacionalização (pt-BR + en) desde o início
- Added sections: Diretrizes de Documentação e Linguagem; Workflow de Desenvolvimento e Qualidade
- Removed sections: N/A
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ atualizado
  - .specify/templates/spec-template.md ✅ atualizado
  - .specify/templates/tasks-template.md ✅ atualizado
  - .specify/templates/checklist-template.md ✅ atualizado
  - .specify/templates/agent-file-template.md ✅ atualizado
  - .codex/prompts/speckit.tasks.md ✅ atualizado
- Follow-up TODOs: Nenhum
-->

# Listify Constitution

## Core Principles

### I. Foco Inicial: Lista Única de Compras (Fase 1)

- O escopo inicial do produto MUST focar em uma lista única de mercado/compras.
- Outros tipos de lista (filmes/séries, games, livros etc.) MUST ficar fora do escopo inicial e ir para Backlog.
- Qualquer desvio desse foco MUST ser justificado em versão futura (ex.: v2) e planejado como entrega incremental.

**Racional**: reduzir risco e atrito, garantindo utilidade imediata com uma base reaproveitável.

### II. Menos Atrito: Velocidade, Simplicidade e Clareza

- O fluxo principal (adicionar item) MUST ser executável em poucos segundos e com o mínimo de campos obrigatórios.
- Em caso de dúvida entre “mais opções” e “menos atrito”, o produto MUST escolher “menos atrito”.
- Fluxos críticos (adicionar, marcar, filtrar) MUST permanecer minimalistas e diretos.

**Racional**: o valor do Listify depende de captura rápida e manutenção leve no dia a dia.

### III. Estado e Progresso Sempre Claros

- Cada item MUST ter estado inequívoco (ex.: pendente vs comprado).
- O topo da lista SHOULD exibir resumo de progresso (pendentes vs concluídos).
- Para compras, o topo da lista SHOULD exibir visão de gasto total quando houver preços informados.

**Racional**: clareza de estado reduz retrabalho e dá feedback imediato de progresso.

### IV. Offline-First e Operações Instantâneas

- As operações principais (adicionar item, marcar como concluído, editar) MUST funcionar offline-first.
- As operações principais MUST ser instantâneas do ponto de vista do usuário (sem travar UI).
- Se existir sincronização, ela MUST ocorrer sem bloquear a UI e com tolerância a falhas.

**Racional**: listas são usadas em contextos com conectividade instável; confiabilidade é parte do produto.

### V. Entregas Incrementais e Versionadas

- O produto MUST evoluir em versões claramente definidas (MVP → v1 → v1.x → v2…).
- Toda spec/plano/tasks MUST indicar a qual versão pertence (ex.: MVP, v1.0, v1.1).
- Cada versão MUST explicitar objetivos, funcionalidades incluídas e o que está fora de escopo.
- Itens não essenciais MUST ir para Backlog / Próximas Versões e MUST NOT bloquear o MVP.

**Racional**: lançamentos pequenos e frequentes aceleram aprendizado e reduzem complexidade.

### VI. Playful Leve, Sem Competir com a Função

- O tom “playful leve” MUST ser aplicado apenas em: empty states, micro-animações de feedback,
  ícones/ilustrações sutis e pequenas mensagens de incentivo.
- Elementos playful MUST NOT competir com velocidade e clareza (sem mascotes permanentes, gamificação invasiva
  ou excesso de cores/textos “engraçadinhos”).

**Racional**: leveza melhora a experiência, mas não pode atrapalhar o objetivo principal.

### VII. Clean Architecture e Separação Clara de Camadas

- A base do produto MUST seguir Clean Architecture (UI, domínio e dados bem separados).
- Lógica de negócio MUST residir no domínio (ex.: use cases) e MUST NOT ficar em componentes de UI.
- O código MUST ser modular e testável desde o início.

**Racional**: separação de responsabilidades facilita evolução, testes e manutenção.

### VIII. Testes para Regras de Negócio (Obrigatório)

- Novos requisitos de negócio MUST vir acompanhados de testes automatizados.
- Regras de domínio SHOULD ser cobertas por testes de unidade.
- Fluxo de dados SHOULD ser coberto por testes de integração quando aplicável.

**Racional**: testes protegem as regras do produto e dão segurança para evoluir rápido.

### IX. Internacionalização desde o Início (pt-BR + en)

- O app MUST suportar **português (pt-BR)** e **inglês (en)** desde o MVP.
- Texto visível ao usuário (títulos, botões, labels, mensagens, empty states) MUST ser internacionalizável e MUST NOT ficar hard coded em componentes.
- Implementação MUST usar `i18next` + `react-i18next`, com detecção de locale via `expo-localization` e fallback seguro (ex.: `en`).
- Conteúdo do usuário (ex.: nomes de itens e categorias customizadas) MUST permanecer como dado (não traduzido automaticamente).
- Categorias/unidades pré-definidas SHOULD ter identificadores estáveis (ex.: `categoryCode`, `unitCode`) e exibir rótulos localizados via i18n (evitar persistir nomes localizados no banco).

**Racional**: o Listify precisa ser utilizável por usuários em pt-BR e en sem rework estrutural; i18n é uma decisão de arquitetura e de UX, não “polimento”.

## Diretrizes de Documentação e Linguagem

- Toda documentação (specs, planos técnicos, tasks e comentários) MUST ser escrita em português do Brasil.
- Nomes de classes, funções, endpoints, pacotes, componentes de UI e termos de bibliotecas MUST permanecer em inglês.
- O texto SHOULD evitar traduções estranhas de termos técnicos já comuns em inglês (ex.: “layout”, “endpoint”,
  “use case”).
- Copy do app (texto na UI) MUST ser escrito em **pt-BR e en** via i18n; evitar misturar idiomas na mesma tela.

## Workflow de Desenvolvimento e Qualidade

- O trabalho de produto e engenharia SHOULD seguir a cadência: spec → plan → tasks → implementação incremental.
- Cada feature MUST manter o escopo da versão-alvo explícito (inclui / fora de escopo / backlog).
- Implementações MUST respeitar as camadas (UI ↔ domínio ↔ dados) e evitar acoplamentos “curtos” por conveniência.
- A inclusão de novos use cases MUST incluir testes automatizados junto com a implementação.

## Governance

- Esta constituição tem precedência sobre templates e práticas locais; divergências MUST ser explicitadas e
  justificadas no artefato de design correspondente.
- Emendas MUST:
  - descrever o motivo e o impacto (produto e engenharia),
  - atualizar templates afetados para manter consistência,
  - atualizar a versão seguindo SemVer (MAJOR/MINOR/PATCH) conforme a mudança.
- Revisões de mudanças de produto/engenharia SHOULD validar aderência aos princípios antes de iniciar
  implementação.

**Version**: 1.1.0 | **Ratified**: 2026-01-04 | **Last Amended**: 2026-01-05
