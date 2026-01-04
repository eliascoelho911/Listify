# Especificação de Feature: Listify — Lista Única de Compras

**Feature Branch**: `001-grocery-list`  
**Criado em**: 2026-01-04  
**Status**: Draft  
**Versão alvo**: MVP (Fase 1)  
**Input**: App móvel “Listify” para reduzir atrito ao registrar e acompanhar uma lista única de compras, com entrada rápida (parsing de quantidade/unidade/nome/categoria), organização por categorias, marcação de comprado com preço opcional, resumo de progresso/gasto, histórico e notificação opcional por proximidade.

## Versão & Escopo *(obrigatório)*

**Inclui**:

- Lista única de compras ativa (uma “compra em andamento” por vez)
- Campo de entrada fixo no rodapé para adicionar itens rapidamente (linha única)
- Parsing inteligente da entrada: quantidade, unidade, nome do item e categoria (`@categoria`)
  - Defaults: quantidade `1`, unidade `unidade`, categoria `outros`
- Organização e visualização por categorias (pré-definidas + categorias customizadas)
- Marcar item como comprado com um toque
  - Se preço não estiver preenchido: oferecer registrar valor ao marcar como comprado
  - Suporte a preço unitário e/ou total (opcional) com cálculo automático do outro quando possível
- Itens comprados vão para o final da sua categoria (mantendo a separação por categorias)
- Editar e remover itens com gestos simples (ex.: swipe para deletar)
- Reordenação via drag-and-drop dentro de uma categoria e entre categorias
- Resumo no topo: total de itens, comprados, valor estimado vs valor gasto (quando houver preços)
- Busca e filtro por nome/categoria + opção de ocultar itens comprados
- Histórico de compras concluídas, com reuso rápido de listas passadas (incremental ou substituição)
- Mensagem de parabéns ao completar todos os itens + opção de concluir compra e iniciar uma nova
- Notificação opcional quando o usuário estiver próximo de um local associado à lista
- Tela de configurações para: moeda, notificações e preferências básicas (com linguagem simples, sem “over-config”)

**Fora de escopo (Backlog / Próximas versões)**:

- Múltiplas listas simultâneas (ex.: “mercado”, “farmácia”, “casa”) na mesma fase
- Outros tipos de lista (filmes/séries, games, livros etc.)
- Sincronização entre dispositivos, backup em nuvem, login/contas
- Compartilhamento colaborativo de lista (casal/grupo) e edição simultânea
- Sugestões “inteligentes” (ML), leitura por voz, scanner de código de barras

## Cenários do Usuário & Testes *(obrigatório)*

### User Story 1 — Capturar e concluir itens rapidamente (Priority: P1) 🎯 MVP

Como usuário em uma compra, quero adicionar itens em segundos e marcar como comprado com um toque para não esquecer nada e acompanhar o que falta.

**Por que esta prioridade**: é o núcleo do valor (menos atrito no fluxo “adicionar → comprar”).

**Teste Independente**: pode ser testado criando uma lista com itens adicionados via entrada rápida, organizados por categoria, e marcando itens como comprados (com reposicionamento).

**Cenários de Aceite**:

1. **Given** uma lista vazia, **When** eu adiciono `2 kg maçã @hortifruti`, **Then** o item é criado com quantidade `2`, unidade `kg`, nome `maçã`, categoria `hortifruti`.
2. **Given** uma lista vazia, **When** eu adiciono `leite`, **Then** o item é criado com quantidade `1`, unidade `unidade`, categoria `outros`.
3. **Given** uma lista com itens pendentes em uma categoria, **When** eu marco um item como comprado, **Then** o item muda para estado “comprado” e move para o final da seção da sua categoria.
4. **Given** que estou digitando no campo de entrada, **When** o app reconhece quantidade/unidade/categoria, **Then** o app dá feedback visual destacando os parâmetros reconhecidos sem bloquear a digitação.

---

### User Story 2 — Manter a lista organizada com gestos e drag-and-drop (Priority: P2)

Como usuário, quero editar, remover e reordenar itens facilmente para manter a lista organizada do meu jeito, sem menus complexos.

**Por que esta prioridade**: reduz retrabalho/ruído durante a compra e dá controle com poucos toques.

**Teste Independente**: pode ser testado criando itens e realizando: editar nome/quantidade/categoria, deletar via gesto e reordenar dentro/entre categorias.

**Cenários de Aceite**:

1. **Given** um item existente, **When** eu edito seus campos e salvo, **Then** o item reflete os novos valores na lista e mantém seu estado (pendente/comprado).
2. **Given** um item existente, **When** eu deslizo para deletar e confirmo, **Then** o item é removido da lista.
3. **Given** dois itens na mesma categoria, **When** eu faço drag-and-drop para reordenar, **Then** a ordem visual (e persistida) da categoria é atualizada.
4. **Given** um item em “mercearia”, **When** eu arrasto o item para “laticínios”, **Then** a categoria do item é atualizada e ele aparece na nova seção.

---

### User Story 3 — Acompanhar gasto e estimativas com o mínimo de esforço (Priority: P2)

Como usuário, quero registrar preços opcionalmente e ver um resumo de estimado vs gasto para manter controle do valor da compra sem precisar planilhar.

**Por que esta prioridade**: agrega valor imediato (clareza de custo) sem adicionar atrito obrigatório.

**Teste Independente**: pode ser testado adicionando itens, registrando preço ao marcar como comprado e validando cálculos no resumo.

**Cenários de Aceite**:

1. **Given** um item pendente sem preço, **When** eu marco como comprado, **Then** o app me oferece (opcionalmente) registrar um preço (total e/ou unitário).
2. **Given** um item com quantidade `3` e preço unitário preenchido, **When** eu salvo o preço, **Then** o app calcula o preço total do item.
3. **Given** itens com preços (estimados e/ou gastos), **When** eu visualizo o topo da lista, **Then** vejo total de itens, comprados, valor estimado e valor já gasto, atualizados.

---

### User Story 4 — Buscar, filtrar e reduzir ruído visual (Priority: P3)

Como usuário, quero buscar e filtrar itens e ocultar comprados para focar no que falta e navegar na lista rapidamente.

**Por que esta prioridade**: mantém a experiência “limpa” conforme a lista cresce.

**Teste Independente**: pode ser testado criando itens com diferentes nomes/categorias e usando busca/filtros + ocultar comprados.

**Cenários de Aceite**:

1. **Given** uma lista com itens em várias categorias, **When** eu busco por um termo, **Then** a lista mostra apenas itens cujo nome corresponde ao termo.
2. **Given** itens comprados e pendentes, **When** eu ativo “ocultar comprados”, **Then** itens comprados não aparecem, e o resumo permanece correto.
3. **Given** um filtro por categoria, **When** eu seleciono “hortifruti”, **Then** vejo apenas itens dessa categoria (pendentes e/ou comprados, conforme configuração de ocultar).

---

### User Story 5 — Reutilizar listas anteriores rapidamente (Priority: P3)

Como usuário, quero acessar um histórico de compras e reutilizar uma lista passada para economizar tempo em compras recorrentes.

**Por que esta prioridade**: melhora retenção e reduz atrito em rotinas semanais.

**Teste Independente**: pode ser testado concluindo uma compra, abrindo o histórico, e reutilizando uma lista (substituindo ou mesclando).

**Cenários de Aceite**:

1. **Given** uma compra concluída, **When** eu abro o histórico, **Then** vejo a data, quantidade de itens e valor total gasto daquela compra.
2. **Given** uma lista atual com itens, **When** eu escolho “reutilizar” uma compra passada em modo “incremental”, **Then** itens do histórico são adicionados sem apagar os existentes.
3. **Given** uma lista atual, **When** eu escolho “reutilizar” em modo “substituir”, **Then** o app substitui a lista atual pelo conteúdo do histórico, pedindo confirmação antes.

---

### User Story 6 — Concluir uma compra e iniciar a próxima (Priority: P3)

Como usuário, quero saber quando terminei tudo e iniciar uma nova compra com poucos toques.

**Por que esta prioridade**: fecha o loop, mantém o hábito e evita que o usuário “se perca” em listas antigas.

**Teste Independente**: pode ser testado marcando todos os itens como comprados e verificando a experiência de conclusão e reinício.

**Cenários de Aceite**:

1. **Given** todos os itens estão comprados, **When** eu volto para a lista, **Then** o app exibe uma mensagem de parabéns e oferece concluir a compra.
2. **Given** eu escolho concluir a compra, **When** confirmo, **Then** a compra é salva no histórico e uma nova lista vazia é iniciada.
3. **Given** um atalho no menu principal, **When** eu seleciono “reiniciar/concluir lista”, **Then** consigo iniciar uma nova compra com confirmação para evitar perda acidental.

---

### User Story 7 — Receber lembrete por proximidade (opcional) (Priority: P3)

Como usuário, quero receber uma notificação opcional quando estiver próximo de um local associado à lista para lembrar de comprar o que falta.

**Por que esta prioridade**: reduz “esquecimento” em rotinas (passar perto do mercado).

**Teste Independente**: pode ser testado associando um local à lista, simulando proximidade e validando que a notificação respeita opt-in e não “spam”.

**Cenários de Aceite**:

1. **Given** uma lista com itens pendentes, **When** eu associo um local e habilito a notificação, **Then** o app solicita permissões necessárias e confirma que o lembrete está ativo.
2. **Given** o lembrete está ativo, **When** eu entro em proximidade do local associado, **Then** recebo uma notificação com chamada clara para abrir a lista.
3. **Given** não há itens pendentes (tudo comprado), **When** eu entro em proximidade do local, **Then** nenhuma notificação é enviada.

---

### User Story 8 — Ajustar preferências (moeda, notificações e comportamento) (Priority: P3)

Como usuário, quero configurar a moeda e preferências simples (notificações e comportamento da lista) para adaptar o app ao meu contexto sem aumentar o atrito do fluxo principal.

**Por que esta prioridade**: melhora adequação por região e dá controle sem criar telas/fluxos obrigatórios.

**Teste Independente**: pode ser testado abrindo configurações, alterando moeda/preferências e verificando que a UI reflete as escolhas (sem conversão de valores).

**Cenários de Aceite**:

1. **Given** que estou na tela de configurações, **When** eu altero a moeda, **Then** o app aplica a formatação em itens/resumo/histórico e deixa explícito que não converte valores existentes.
2. **Given** que notificações por proximidade estão desativadas, **When** eu ativo a opção nas configurações, **Then** o app solicita as permissões necessárias e confirma o estado (ativo/inativo) de forma clara.
3. **Given** que a permissão de localização foi negada, **When** eu tento ativar notificações por proximidade, **Then** o app mantém a funcionalidade principal intacta e orienta como habilitar no sistema.
4. **Given** que “ocultar comprados” está configurado como padrão, **When** eu abro a lista, **Then** a lista respeita essa preferência sem exigir passos extras.

### Edge Cases

- Parsing:
  - Entrada sem nome útil (ex.: `2 kg @hortifruti`) → item não deve ser criado; app deve informar erro de forma leve.
  - Unidade/quantidade em formatos comuns (ex.: `2,5 kg`, `1/2 kg`) → deve ser aceito quando possível ou normalizado.
  - Categoria informada inexistente (ex.: `@feira`) → deve criar como categoria customizada (decisão: criar customizada).
  - Múltiplas categorias na mesma linha (ex.: `leite @laticínios @promo`) → o app deve escolher a última `@categoria` válida e ignorar o restante.
  - Itens duplicados (ex.: adicionar “leite” 3 vezes) → deve permitir; o app pode sugerir consolidar, mas não deve bloquear.
- Estado e ordenação:
  - Marcar/desmarcar comprado rapidamente em sequência → estado final deve ser consistente e a ordem deve se manter previsível.
  - Reordenar itens quando “ocultar comprados” está ligado → o app não deve “pular” itens ou perder a ordem.
- Preço:
  - Preço total informado com quantidade fracionária (ex.: `0,5 kg`) → cálculos devem respeitar frações.
  - Marcar como comprado e cancelar o registro de preço → item deve permanecer comprado e preço pode ficar vazio.
  - Editar quantidade após preço unitário/total definido → app deve recalcular valores e indicar mudança ao usuário.
- Histórico:
  - Reuso “substituir” com lista atual não vazia → exigir confirmação explícita.
  - Reuso incremental com itens repetidos → permitir duplicados ou oferecer mesclar por nome (decisão: permitir duplicados; mesclar fica para backlog).
- Notificação por proximidade:
  - Permissão negada → app deve funcionar sem notificação e oferecer reativação nas configurações do app.
  - Evitar spam: ao entrar/sair repetidamente do raio, limitar a frequência de notificação (ex.: cooldown).
- Configurações:
  - Trocar moeda com itens já precificados → app deve deixar claro que não há conversão automática.
  - Alternar configuração de notificação sem permissões concedidas → app deve orientar como habilitar no sistema e manter o toggle coerente.

## Requisitos *(obrigatório)*

### Requisitos Funcionais

- **FR-001**: O app MUST permitir criar itens por uma entrada de texto em linha única, em um campo fixo no rodapé e sempre visível na tela principal da lista.
- **FR-002**: Ao adicionar um item, o app MUST tentar extrair (parsing): `quantity`, `unit`, `name` e `category`.
- **FR-003**: Se a quantidade não for fornecida, o app MUST atribuir quantidade padrão `1`.
- **FR-004**: Se a unidade não for fornecida, o app MUST atribuir unidade padrão `unidade`.
- **FR-005**: Se a categoria não for fornecida, o app MUST atribuir categoria padrão `outros`.
- **FR-006**: A categoria MUST ser detectável por token `@categoria` em qualquer posição na linha, ignorando maiúsculas/minúsculas.
- **FR-007**: O app MUST oferecer categorias pré-definidas, no mínimo: `hortifruti`, `mercearia`, `açougue`, `laticínios`, `padaria`, `bebidas`, `limpeza`, `higiene`, `congelados`, `pet`, `outros`.
- **FR-008**: O app MUST permitir criar categorias customizadas pelo usuário e usá-las na organização e nos filtros.
- **FR-009**: Itens MUST ser agrupados por categoria na tela principal.
- **FR-010**: O app MUST permitir marcar e desmarcar item como “comprado” com um toque.
- **FR-011**: Ao marcar como comprado, o item MUST mover para o final da seção da sua categoria, sem trocar de categoria.
- **FR-012**: O app MUST permitir que o usuário informe preço ao marcar um item como comprado quando o item não tiver preço preenchido (ação opcional, com possibilidade de pular).
- **FR-013**: O app MUST suportar registrar `unitPrice` e/ou `totalPrice` por item (opcionais).
- **FR-014**: Se `quantity` e `unitPrice` estiverem presentes, o app MUST calcular `totalPrice`.
- **FR-015**: Se `quantity` e `totalPrice` estiverem presentes, o app MUST calcular `unitPrice` (quando matematicamente possível).
- **FR-016**: O app MUST permitir editar um item (nome, quantidade, unidade, categoria, preços) após sua criação.
- **FR-017**: O app MUST permitir remover um item com gesto simples (ex.: swipe para deletar) e confirmar quando houver risco alto de perda (ex.: deleção em massa fica fora de escopo).
- **FR-018**: O app MUST permitir reordenar itens manualmente via drag-and-drop dentro de uma categoria.
- **FR-019**: O app MUST permitir mover um item entre categorias via drag-and-drop, atualizando a categoria do item.
- **FR-020**: O app MUST persistir a lista atual e o histórico localmente para uso offline.
- **FR-021**: O app MUST exibir no topo um resumo com: total de itens, itens comprados e itens pendentes.
- **FR-022**: Quando houver ao menos um item com preço preenchido, o app MUST exibir no topo: total estimado (itens pendentes com preço) e total gasto (itens comprados com preço).
- **FR-023**: O app MUST oferecer busca por nome do item na tela principal.
- **FR-024**: O app MUST oferecer filtro por categoria (incluindo categorias customizadas).
- **FR-025**: O app MUST permitir ocultar/mostrar itens comprados sem apagar dados.
- **FR-026**: Quando todos os itens estiverem comprados, o app MUST exibir uma mensagem de conclusão e oferecer ação para concluir a compra.
- **FR-027**: Ao concluir a compra, o app MUST salvar um registro no histórico contendo: data/hora, quantidade de itens e total gasto (se houver preços).
- **FR-028**: O histórico MUST ser acessível por atalho na tela da lista atual.
- **FR-029**: O app MUST permitir reutilizar uma compra passada de duas formas: (a) incremental (mesclar/adicionar) e (b) substituir a lista atual, com confirmação.
- **FR-030**: O app MUST permitir associar um local (ex.: um supermercado) à lista atual e habilitar/desabilitar lembrete por proximidade.
- **FR-031**: Se o lembrete por proximidade estiver habilitado e houver itens pendentes, o app MUST emitir uma notificação ao entrar em proximidade do local associado.
- **FR-032**: O app MUST garantir que lembretes por proximidade sejam opcionais (opt-in) e que a experiência principal funcione sem permissões de localização.
- **FR-033**: O app MUST ter uma tela de configurações acessível a partir do menu principal.
- **FR-034**: O app MUST permitir configurar a moeda usada para exibição/entrada de preços (padrão: BRL).
- **FR-035**: Ao alterar a moeda, o app MUST deixar explícito que não realiza conversão automática de valores já registrados.
- **FR-036**: O app MUST persistir a moeda selecionada e aplicar a formatação de preço em todo o app (itens, resumo, histórico).
- **FR-037**: O app MUST permitir habilitar/desabilitar notificações por proximidade nas configurações, mantendo a feature opcional.
- **FR-038**: Nas configurações, o app MUST mostrar o estado de permissão de localização e orientar o usuário a habilitar no sistema quando necessário.
- **FR-039**: O app SHOULD permitir configurar preferências simples de comportamento da lista, no mínimo:
  - ocultar itens comprados (padrão on/off)
  - solicitar preço ao marcar item como comprado (padrão on/off)

### Requisitos de UX, Acessibilidade e Qualidade

- **NFR-001**: O app MUST permitir concluir a ação “adicionar item” com o mínimo de passos (digitar + confirmar), sem exigir abrir telas de configuração.
- **NFR-002**: Feedbacks visuais e animações MUST ser curtas e não bloquear interações.
- **NFR-003**: O app MUST manter contraste adequado e respeitar configurações do sistema relacionadas a redução de movimento quando disponíveis.
- **NFR-004**: As operações principais (adicionar, marcar como comprado, editar, reordenar, deletar) MUST funcionar offline e parecer instantâneas.
- **NFR-005**: O app SHOULD reduzir risco de toque acidental em ações destrutivas (ex.: undo breve após deleção, quando viável).

### Entidades-chave *(inclua se a feature envolve dados)*

- **ShoppingList**: lista ativa atual; metadados como `createdAt`, `completedAt?`, `associatedLocations?`.
- **ShoppingItem**: item da lista; `name`, `quantity`, `unit`, `categoryId`, `status` (pending/purchased), `position`, `createdAt`, `updatedAt`, `unitPrice?`, `totalPrice?`, `purchasedAt?`.
- **Category**: categoria de mercado; `id`, `name`, `isPredefined`, `sortOrder`.
- **PurchaseHistoryEntry**: compra concluída; `completedAt`, `itemCount`, `totalSpent?`, snapshot de itens/categorias relevantes para reuso.
- **LocationAssociation**: vínculo opcional entre lista e local; `label`, `geoRadius`, `lastNotifiedAt?`, `isEnabled`.

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **SC-001**: Usuários conseguem adicionar um item à lista em ≤ 3 segundos (mediana) a partir de “app aberto”.
- **SC-002**: ≥ 90% dos itens adicionados são criados sem exigir abertura de telas adicionais (categoria/preço continuam opcionais).
- **SC-003**: Em um teste guiado com 10 itens de exemplo, ≥ 80% das entradas têm parsing correto de quantidade/unidade/categoria quando informadas (com defaults corretos quando ausentes).
- **SC-004**: Usuários conseguem marcar 10 itens como comprados em ≤ 20 segundos (mediana), com feedback claro e sem confusão de estado.
- **SC-005**: Usuários conseguem encontrar um item usando busca/filtro em ≤ 5 segundos (mediana) em listas com 50 itens.
- **SC-006**: Em uso offline, usuários conseguem adicionar/marcar/reordenar itens sem perda de dados percebida em ≥ 99% dos casos de teste.

## Suposições *(para reduzir ambiguidade)*

- Moeda exibida/registrada: Real (BRL), com suporte a valores decimais.
- Se a moeda for alterada nas configurações, isso afeta formatação/símbolo e não converte valores existentes.
- A lista ativa é única, mas compras anteriores ficam no histórico e podem ser reutilizadas.
- Notificações por proximidade são opt-in e só devem disparar quando houver itens pendentes.
