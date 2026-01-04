---

description: "Template de lista de tarefas para implementação de feature"
---

# Tarefas: [FEATURE NAME]

**Versão alvo**: [ex.: MVP, v1.0]  
**Input**: Documentos de design em `/specs/[###-feature-name]/`  
**Pré-requisitos**: plan.md (obrigatório), spec.md (obrigatório para user stories), research.md, data-model.md, contracts/

**Testes**: Testes MUST acompanhar novos requisitos de negócio/novos use cases. Em geral:
- testes de unidade para regras de domínio
- testes de integração para fluxo de dados (quando aplicável)

**Organização**: Tarefas são agrupadas por user story para permitir implementação e validação independentes.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: A qual user story a tarefa pertence (ex.: US1, US2, US3)
- Inclua paths exatos nos textos das tarefas

## Convenções de Paths

- **Single project**: `src/`, `tests/` na raiz do repositório
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` ou `android/src/`
- Os paths abaixo assumem single project — ajuste conforme a estrutura em plan.md

<!-- 
  ============================================================================
  IMPORTANTE: As tarefas abaixo são APENAS EXEMPLOS para ilustração.
  
  O comando /speckit.tasks MUST substituir isso por tarefas reais com base em:
  - user stories de spec.md (com prioridades P1, P2, P3...)
  - requisitos da feature em plan.md
  - entidades de data-model.md
  - endpoints em contracts/
  
  As tarefas MUST ser organizadas por user story para que cada story possa ser:
  - implementada de forma independente
  - testada de forma independente
  - entregue como um incremento de MVP
  
  NÃO mantenha estas tarefas de exemplo no tasks.md gerado.
  ============================================================================
-->

## Fase 1: Setup (Infra Compartilhada)

**Propósito**: Inicialização do projeto e estrutura básica

- [ ] T001 Criar estrutura do projeto conforme plan.md
- [ ] T002 Inicializar projeto em [language] com dependências de [framework]
- [ ] T003 [P] Configurar linting e formatação

---

## Fase 2: Fundacional (Pré-requisitos Bloqueantes)

**Propósito**: Infraestrutura base que MUST estar pronta antes de QUALQUER user story

**⚠️ CRÍTICO**: Nenhuma user story começa até esta fase estar concluída

Exemplos de tarefas fundacionais (ajuste conforme o projeto):

- [ ] T004 Configurar schema do banco e migrações
- [ ] T005 [P] Implementar autenticação/autorização (se aplicável)
- [ ] T006 [P] Configurar rotas e middleware (se aplicável)
- [ ] T007 Criar models/entities base que todas as stories usam
- [ ] T008 Configurar tratamento de erros e logging
- [ ] T009 Configurar gerenciamento de ambiente/config

**Checkpoint**: Base pronta — implementação de user stories pode começar (em paralelo, se possível)

---

## Fase 3: User Story 1 - [Título] (Priority: P1) 🎯 MVP

**Objetivo**: [Breve descrição do que esta story entrega]

**Teste Independente**: [Como verificar que funciona de forma isolada]

### Testes para User Story 1 (OBRIGATÓRIO quando houver requisitos de negócio / novos use cases) ⚠️

> **NOTA**: Quando possível, escreva estes testes antes e garanta que falham antes da implementação (TDD).

- [ ] T010 [P] [US1] Teste de contrato para [endpoint] em tests/contract/test_[name].py
- [ ] T011 [P] [US1] Teste de integração para [user journey] em tests/integration/test_[name].py

### Implementação para User Story 1

- [ ] T012 [P] [US1] Criar model [Entity1] em src/models/[entity1].py
- [ ] T013 [P] [US1] Criar model [Entity2] em src/models/[entity2].py
- [ ] T014 [US1] Implementar [Service] em src/services/[service].py (depende de T012, T013)
- [ ] T015 [US1] Implementar [endpoint/feature] em src/[location]/[file].py
- [ ] T016 [US1] Adicionar validação e tratamento de erros
- [ ] T017 [US1] Adicionar logging para operações da User Story 1

**Checkpoint**: Neste ponto, a User Story 1 deve estar funcional e testável de forma independente

---

## Fase 4: User Story 2 - [Título] (Priority: P2)

**Objetivo**: [Breve descrição do que esta story entrega]

**Teste Independente**: [Como verificar que funciona de forma isolada]

### Testes para User Story 2 (OBRIGATÓRIO quando houver requisitos de negócio / novos use cases) ⚠️

- [ ] T018 [P] [US2] Teste de contrato para [endpoint] em tests/contract/test_[name].py
- [ ] T019 [P] [US2] Teste de integração para [user journey] em tests/integration/test_[name].py

### Implementação para User Story 2

- [ ] T020 [P] [US2] Criar model [Entity] em src/models/[entity].py
- [ ] T021 [US2] Implementar [Service] em src/services/[service].py
- [ ] T022 [US2] Implementar [endpoint/feature] em src/[location]/[file].py
- [ ] T023 [US2] Integrar com componentes da User Story 1 (se necessário)

**Checkpoint**: Neste ponto, as User Stories 1 e 2 devem funcionar de forma independente

---

## Fase 5: User Story 3 - [Título] (Priority: P3)

**Objetivo**: [Breve descrição do que esta story entrega]

**Teste Independente**: [Como verificar que funciona de forma isolada]

### Testes para User Story 3 (OBRIGATÓRIO quando houver requisitos de negócio / novos use cases) ⚠️

- [ ] T024 [P] [US3] Teste de contrato para [endpoint] em tests/contract/test_[name].py
- [ ] T025 [P] [US3] Teste de integração para [user journey] em tests/integration/test_[name].py

### Implementação para User Story 3

- [ ] T026 [P] [US3] Criar model [Entity] em src/models/[entity].py
- [ ] T027 [US3] Implementar [Service] em src/services/[service].py
- [ ] T028 [US3] Implementar [endpoint/feature] em src/[location]/[file].py

**Checkpoint**: Todas as user stories devem estar funcionais de forma independente

---

[Adicione mais fases de user story conforme necessário, seguindo o mesmo padrão]

---

## Fase N: Polish & Cross-Cutting Concerns

**Propósito**: Melhorias que afetam múltiplas user stories

- [ ] TXXX [P] Atualizar documentação em docs/
- [ ] TXXX Limpeza de código e refatoração
- [ ] TXXX Otimização de performance cross-story
- [ ] TXXX [P] Testes de unidade adicionais (quando fizer sentido) em tests/unit/
- [ ] TXXX Hardening de segurança
- [ ] TXXX Rodar validação de quickstart.md

---

## Dependências & Ordem de Execução

### Dependências entre Fases

- **Setup (Fase 1)**: Sem dependências — pode iniciar imediatamente
- **Fundacional (Fase 2)**: Depende da conclusão do Setup — BLOQUEIA todas as user stories
- **User Stories (Fase 3+)**: Todas dependem da conclusão da fase Fundacional
  - User stories podem seguir em paralelo (se houver capacidade)
  - Ou sequencialmente por prioridade (P1 → P2 → P3)
- **Polish (Fase final)**: Depende das user stories desejadas estarem concluídas

### User Story Dependencies

- **User Story 1 (P1)**: Pode começar após a fase Fundacional — sem dependências em outras stories
- **User Story 2 (P2)**: Pode começar após a fase Fundacional — pode integrar com US1, mas deve ser testável isoladamente
- **User Story 3 (P3)**: Pode começar após a fase Fundacional — pode integrar com US1/US2, mas deve ser testável isoladamente

### Within Each User Story

- Quando possível, prefira TDD: testes antes e falhando antes da implementação
- Models antes de services
- Services antes de endpoints
- Implementação core antes de integração
- Conclua uma story antes de seguir para a próxima prioridade

### Parallel Opportunities

- Tarefas de Setup marcadas com [P] podem rodar em paralelo
- Tarefas Fundacionais marcadas com [P] podem rodar em paralelo (dentro da Fase 2)
- Após a fase Fundacional, as user stories podem rodar em paralelo (se houver capacidade)
- Testes de uma story marcados com [P] podem rodar em paralelo
- Models de uma story marcadas com [P] podem rodar em paralelo
- User stories diferentes podem ser feitas em paralelo por pessoas diferentes

---

## Exemplo de Paralelismo: User Story 1

```bash
# Rodar todos os testes da User Story 1 juntos (quando aplicável):
Tarefa: "Teste de contrato para [endpoint] em tests/contract/test_[name].py"
Tarefa: "Teste de integração para [user journey] em tests/integration/test_[name].py"

# Implementar todos os models da User Story 1 em paralelo:
Tarefa: "Criar model [Entity1] em src/models/[entity1].py"
Tarefa: "Criar model [Entity2] em src/models/[entity2].py"
```

---

## Estratégia de Implementação

### MVP Primeiro (Apenas User Story 1)

1. Concluir Fase 1: Setup
2. Concluir Fase 2: Fundacional (CRÍTICO — bloqueia todas as stories)
3. Concluir Fase 3: User Story 1
4. **PARAR E VALIDAR**: testar User Story 1 de forma independente
5. Deploy/demo se estiver pronto

### Entrega Incremental

1. Concluir Setup + Fundacional → base pronta
2. Adicionar User Story 1 → testar isolado → deploy/demo (MVP!)
3. Adicionar User Story 2 → testar isolado → deploy/demo
4. Adicionar User Story 3 → testar isolado → deploy/demo
5. Cada story adiciona valor sem quebrar as anteriores

### Parallel Team Strategy

Com múltiplas pessoas:

1. Time conclui Setup + Fundacional junto
2. Após a fase Fundacional:
   - Pessoa A: User Story 1
   - Pessoa B: User Story 2
   - Pessoa C: User Story 3
3. Stories evoluem e integram com validação independente

---

## Notas

- [P] = tarefas em arquivos diferentes, sem dependências
- [Story] = label que mapeia a tarefa para uma user story (rastreabilidade)
- Cada user story deve ser completável e testável de forma independente
- Quando possível, prefira TDD: verifique testes falhando antes da implementação
- Faça commit após cada tarefa ou grupo lógico
- Pare em checkpoints para validar a story de forma independente
- Evite: tarefas vagas, conflitos no mesmo arquivo, dependências cruzadas que quebrem independência
