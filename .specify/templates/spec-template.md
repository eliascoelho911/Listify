# Especificação de Feature: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`  
**Criado em**: [DATE]  
**Status**: Draft  
**Versão alvo**: [ex.: MVP, v1.0]  
**Input**: Descrição do usuário: "$ARGUMENTS"

## Versão & Escopo *(obrigatório)*

**Inclui**:

- [Liste o que faz parte da entrega desta versão]

**Fora de escopo (Backlog / Próximas versões)**:

- [Liste explicitamente o que NÃO será feito agora]

## Cenários do Usuário & Testes *(obrigatório)*

<!--
  IMPORTANTE: User stories devem ser PRIORIZADAS como jornadas do usuário ordenadas por importância.
  Cada user story/jornada deve ser INDEPENDENTEMENTE TESTÁVEL — ou seja, ao implementar apenas UMA,
  ainda deve existir um MVP viável que entregue valor.
  
  Atribua prioridades (P1, P2, P3...) para cada story, onde P1 é a mais crítica.
  Pense em cada story como um slice que pode ser:
  - desenvolvido de forma independente
  - testado de forma independente
  - entregue de forma independente
  - demonstrado de forma independente
-->

### User Story 1 - [Título breve] (Priority: P1)

[Descreva esta jornada do usuário em linguagem simples]

**Por que esta prioridade**: [Explique o valor e por que esta story tem esse nível]

**Teste Independente**: [Como testar de forma independente — ex.: "Pode ser testado ao [ação] e entrega [valor]"]

**Cenários de Aceite**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Título breve] (Priority: P2)

[Descreva esta jornada do usuário em linguagem simples]

**Por que esta prioridade**: [Explique o valor e por que esta story tem esse nível]

**Teste Independente**: [Como testar de forma independente]

**Cenários de Aceite**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Título breve] (Priority: P3)

[Descreva esta jornada do usuário em linguagem simples]

**Por que esta prioridade**: [Explique o valor e por que esta story tem esse nível]

**Teste Independente**: [Como testar de forma independente]

**Cenários de Aceite**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: O conteúdo desta seção é placeholder.
  Preencha com edge cases reais do contexto.
-->

- O que acontece quando [condição de fronteira]?
- Como o sistema lida com [cenário de erro]?

## Requisitos *(obrigatório)*

<!--
  ACTION REQUIRED: O conteúdo desta seção é placeholder.
  Preencha com requisitos funcionais reais e testáveis.
-->

### Requisitos Funcionais

- **FR-001**: Sistema MUST [capacidade específica, ex.: "permitir criar conta"]
- **FR-002**: Sistema MUST [capacidade específica, ex.: "validar emails"]  
- **FR-003**: Usuários MUST conseguir [interação chave, ex.: "resetar senha"]
- **FR-004**: Sistema MUST [requisito de dados, ex.: "persistir preferências"]
- **FR-005**: Sistema MUST [comportamento, ex.: "logar eventos de segurança"]

*Exemplo de requisito com incerteza:*

- **FR-006**: Sistema MUST autenticar usuários via [NEEDS CLARIFICATION: método não especificado — email/senha, SSO, OAuth?]
- **FR-007**: Sistema MUST reter dados do usuário por [NEEDS CLARIFICATION: período não especificado]

### Entidades-chave *(inclua se a feature envolve dados)*

- **[Entity 1]**: [O que representa, principais atributos sem implementação]
- **[Entity 2]**: [O que representa, relacionamento com outras entidades]

## Critérios de Sucesso *(obrigatório)*

<!--
  ACTION REQUIRED: Defina critérios de sucesso mensuráveis.
  Eles devem ser agnósticos de tecnologia e verificáveis.
-->

### Resultados Mensuráveis

- **SC-001**: [Métrica mensurável, ex.: "Usuários concluem criação de conta em <2 min"]
- **SC-002**: [Métrica mensurável, ex.: "Usuários veem resposta instantânea em 95% dos casos"]
- **SC-003**: [Satisfação do usuário, ex.: "90% completam a tarefa principal na 1ª tentativa"]
- **SC-004**: [Métrica de negócio, ex.: "Reduzir tickets sobre [X] em 50%"]
