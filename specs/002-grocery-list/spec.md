# Especificação de Feature: Listify — Lista Única de Compras

**Feature Branch**: `001-grocery-list`  
**Criado em**: 2026-01-04  
**Status**: Draft  
**Versão alvo**: MVP (Fase 1)  
**Input**: App móvel “Listify” para reduzir atrito ao registrar e acompanhar uma lista única de compras, com entrada rápida (parsing de quantidade/unidade/nome/categoria), organização por categorias, marcação de comprado com preço opcional, resumo de progresso/gasto, histórico e notificação opcional por proximidade.

## Versão & Escopo *(obrigatório)*

**Inclui**:

- Lista única de compras ativa (uma “compra em andamento” por vez)
- App disponível em **pt-BR** e **en** (internacionalização desde o MVP; sem strings hard coded)
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

## Clarifications

### Session 2026-01-04

- Q: Como representar `quantity` e `unit` internamente? → A (proposta): `quantity` decimal (até 3 casas) + `unit` string normalizada (lista + fallback raw).
- Q: Como representar preços (`unitPrice`/`totalPrice`) internamente? → A (proposta): armazenar em “minor units” (ex.: centavos) na moeda da lista; permitir editar unitário ou total.
- Q: Em falha de persistência local, qual comportamento? → A (proposta): UI otimista + rollback + toast/erro não-bloqueante; não perder a entrada (texto) do usuário.
- Q: Qual a diferença entre “reiniciar” vs “concluir” lista? → A (proposta): `reiniciar` limpa a lista ativa sem registrar histórico; `concluir` salva snapshot no histórico e inicia uma nova lista vazia.
- Q: Notificação por localização: quantos locais, raio e cooldown? → A (proposta): 1 local por lista; raio padrão 300m; notificar ao entrar; cooldown de 6h (por local/lista).

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

## Fluxos de UX prioritários (detalhado)

### 1) Adicionar item por texto livre (com parsing)

- Campo fixo no rodapé (linha única) com ação de confirmar via teclado (ex.: “Enter/Done”) e/ou botão de “+”.
- Parsing acontece no “submit” (não a cada tecla), mas o app SHOULD mostrar um preview leve do que foi entendido enquanto digita (sem travar).
- Gramática alvo (MVP):
  - `"<quantidade> <unidade> <nome...> @<categoria>"`
  - `@<categoria>` pode aparecer em qualquer posição; apenas a última ocorrência é considerada.
  - Se `<quantidade>` ou `<unidade>` não existirem, usar defaults.
- Normalização (MVP):
  - Quantidade aceita formatos: `2`, `2,5`, `2.5`, `1/2`; internamente normaliza para decimal com `.`.
  - Unidades aceitam sinônimos (ex.: `un`, `unid`, `unidade`) e normalizam para o “código canônico” definido no modelo de dados.
- Erros:
  - Se não houver “nome” após remover quantidade/unidade/@categoria, não criar item; manter texto no input e mostrar feedback curto.

### 2) Editar item existente

- Toque no item abre edição inline (preferível) ou sheet/modal (aceitável) com campos: `name`, `quantity`, `unit`, `category`, `unitPrice`, `totalPrice`.
- Editar MUST preservar o estado `pending/purchased`.
- Ao editar `quantity` quando houver preço:
  - Se houver `unitPrice`, recalcular `totalPrice`.
  - Se houver apenas `totalPrice`, recalcular `unitPrice` quando matematicamente possível.
  - Se o usuário editar manualmente ambos, o app MUST respeitar o último campo editado como “fonte” para recálculo.

### 3) Marcar item como comprado e desfazer (undo)

- Um toque alterna `pending ↔ purchased`.
- Ao marcar como comprado:
  - mover para o final do grupo “comprados” dentro da sua categoria;
  - registrar `purchasedAt=now`.
  - se `askPriceOnPurchase` estiver ativo e o item não tiver preço, oferecer registrar preço (com opção clara de “pular”).
- Undo:
  - após marcar/desmarcar, exibir affordance de desfazer por curto período (ex.: snackbar).
  - desfazer restaura estado anterior e posição relativa (dentro do possível).

### 4) Filtrar/esconder itens comprados

- “Ocultar comprados”:
  - esconde itens `purchased` da lista (sem apagar);
  - mantém resumo correto (inclui comprados nos totais);
  - não deve quebrar drag-and-drop (reordenar afeta apenas visíveis; comprados mantêm ordenação interna).

### 5) Notificações baseadas em localização

- Associação de local é opt-in; sem permissões, o app funciona normalmente.
- Um local associado à lista contém: `label`, `latitude`, `longitude`, `radiusMeters`.
- Disparo: notificar ao entrar no raio (`enter`), apenas se existirem itens pendentes.
- Anti-spam: respeitar cooldown por local/lista usando `lastNotifiedAt`.

### 6) Histórico de listas anteriores

- Ao concluir, criar registro de histórico com snapshot dos itens (campos relevantes para reuso).
- Reuso:
  - Incremental: adiciona itens do snapshot na lista ativa sem apagar o que já existe (duplicados permitidos).
  - Substituir: apaga a lista ativa e recria a partir do snapshot (exigir confirmação explícita).

### 7) Reiniciar vs concluir lista

- `Reiniciar`:
  - limpa a lista ativa (itens e ordenação) sem criar registro no histórico.
  - exige confirmação se houver itens (pendentes ou comprados).
- `Concluir`:
  - permitido apenas quando “faz sentido”: recomendado quando todos os itens estão comprados; mas o app MAY permitir concluir mesmo com pendentes (desde que deixe claro).
  - cria snapshot no histórico e inicia uma nova lista vazia.

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

- **FR-040**: O app MUST normalizar `quantity` para um número decimal (interno) com no máximo 3 casas decimais, aceitando entrada com vírgula (`2,5`) e fração (`1/2`).
- **FR-041**: O app MUST normalizar `unit` para um valor canônico (ex.: `un`, `kg`, `g`, `l`, `ml`) quando possível, preservando o valor original quando não reconhecido.
- **FR-042**: O app MUST armazenar valores monetários em “minor units” (ex.: centavos) na moeda configurada, evitando arredondamento inconsistente.
- **FR-043**: Em falha ao persistir uma operação (criar/editar/marcar/reordenar), o app MUST informar erro de forma não bloqueante e MUST manter o usuário capaz de tentar novamente sem redigitar (quando aplicável).
- **FR-044**: Se ocorrer falha ao ler a persistência local ao abrir o app (ex.: dados corrompidos), o app MUST exibir um estado de recuperação com opção de “tentar novamente” e “resetar dados locais” (com confirmação).
- **FR-045**: O app MUST diferenciar explicitamente `reiniciar` vs `concluir` conforme definido em “Fluxos de UX prioritários”.
- **FR-046**: Notificação por proximidade MUST respeitar: 1 local associado por lista (MVP), raio padrão 300m e cooldown mínimo de 6h por local/lista.

### Requisitos de UX, Acessibilidade e Qualidade

- **NFR-001**: O app MUST permitir concluir a ação “adicionar item” com o mínimo de passos (digitar + confirmar), sem exigir abrir telas de configuração.
- **NFR-002**: Feedbacks visuais e animações MUST ser curtas e não bloquear interações.
- **NFR-003**: O app MUST manter contraste adequado e respeitar configurações do sistema relacionadas a redução de movimento quando disponíveis.
- **NFR-004**: As operações principais (adicionar, marcar como comprado, editar, reordenar, deletar) MUST funcionar offline e parecer instantâneas.
- **NFR-005**: O app SHOULD reduzir risco de toque acidental em ações destrutivas (ex.: undo breve após deleção, quando viável).
- **NFR-006**: O app MUST suportar **pt-BR** e **en**, usando i18n (sem texto hard coded); fallback seguro (ex.: `en`) quando o locale do dispositivo não for suportado.

### Internacionalização (i18n) — pt-BR + en

- **Libs**: usar `i18next` + `react-i18next` para tradução e `expo-localization` para detectar o idioma do dispositivo.
- **Regra**: todo texto na UI MUST vir de `t(...)` (ou `Trans`), evitando concatenação manual de strings.
- **Dados do usuário**: nomes de itens e categorias customizadas são dados e MUST NOT ser traduzidos automaticamente.
- **Pré-definidos**: unidades e categorias pré-definidas SHOULD usar identificadores canônicos (ex.: `unitCode`, `categoryCode`) e exibir labels via i18n, evitando persistir nomes localizados no banco.
- **Formatação**: valores (moeda/número/data) SHOULD usar `Intl.*Format` com o locale ativo + `currencyCode` da lista (sem hardcode de separadores/símbolos).

### Offline-first e persistência local (comportamento em falhas)

- Sem internet, o app MUST continuar suportando: adicionar/editar/remover, marcar/desmarcar comprado (com undo), reordenar, busca/filtros, ocultar comprados, histórico e concluir/reiniciar.
- A persistência local é a fonte de verdade (MVP sem sync).
- Operações MUST ser atômicas (ou totalmente aplicadas, ou revertidas).
- Se uma escrita falhar (ex.: falta de espaço), o app MUST:
  - avisar com feedback não-bloqueante;
  - manter o usuário no controle (poder tentar novamente);
  - evitar perda de input (ex.: manter texto no campo de adicionar quando falha ao criar item).
- Se uma leitura falhar ao iniciar, o app MUST entrar em modo de recuperação (FR-044) e, ao “resetar dados locais”, recriar estado inicial consistente (lista vazia + categorias pré-definidas).

### Resumo (métricas) e regras de cálculo

- Contadores:
  - `totalItems` = todos os itens (pendentes + comprados)
  - `purchasedItems` = itens com `status=purchased`
  - `pendingItems` = itens com `status=pending`
- Valores:
  - `totalSpent` = soma (itens comprados com preço) usando `totalPrice` quando presente, senão `quantity * unitPrice` quando possível.
  - `totalEstimatedPending` = soma (itens pendentes com preço) usando mesma regra.
  - `totalPlanned` (opcional) = `totalSpent + totalEstimatedPending`.
- Indisponibilidade:
  - Se não houver preços suficientes para calcular, o app MUST esconder o bloco de valores ou indicar “—” (sem inventar número).

#### Modelo de dados (detalhado) — MVP

**Convenções gerais**

- IDs: UUID string.
- Datas: ISO-8601 em UTC (ou `Date` equivalente na plataforma), sempre serializáveis.
- Moeda: armazenada na `ShoppingList` como `currencyCode` (ex.: `BRL`) e aplicada a todos os itens/valores da lista e seus snapshots.

**Tipos de valor**

- `Quantity`: decimal com até 3 casas (interno); entrada aceita vírgula e fração.
- `Unit`: string canônica (mínimo: `un`, `kg`, `g`, `l`, `ml`). Sinônimos mapeiam para o canônico.
- `MoneyMinor`: inteiro em minor units (ex.: centavos); exibição depende de `currencyCode`.

**ShoppingList**

- `id: UUID`
- `createdAt: datetime`
- `updatedAt: datetime`
- `currencyCode: string` (default `BRL`)
- `isCompleted: boolean`
- `completedAt?: datetime`
- `hidePurchasedByDefault: boolean` (preferência)
- `askPriceOnPurchase: boolean` (preferência)
- `location?: LocationAssociation` (MVP: 0 ou 1)

**ShoppingItem**

- `id: UUID`
- `listId: UUID`
- `name: string` (trim; MUST NOT ser vazio)
- `quantity: Quantity` (default `1`)
- `unit: Unit` (default `un`)
- `categoryId: UUID`
- `status: "pending" | "purchased"`
- `position: number` (ordenação manual dentro do grupo da categoria)
- `createdAt: datetime`
- `updatedAt: datetime`
- `purchasedAt?: datetime`
- `unitPriceMinor?: MoneyMinor`
- `totalPriceMinor?: MoneyMinor`

**Category**

- `id: UUID`
- `name: string` (case-insensitive unique dentro do app)
- `isPredefined: boolean`
- `sortOrder: number`

**PurchaseHistoryEntry**

- `id: UUID`
- `completedAt: datetime`
- `currencyCode: string`
- `itemCount: number`
- `totalSpentMinor?: MoneyMinor`
- `snapshot: { categories: CategorySnapshot[], items: ItemSnapshot[] }`

**ItemSnapshot** (para reuso)

- `name: string`
- `quantity: Quantity`
- `unit: Unit`
- `categoryName: string` (para remapear/criar categoria na restauração)
- `unitPriceMinor?: MoneyMinor`
- `totalPriceMinor?: MoneyMinor`

**LocationAssociation**

- `label: string`
- `latitude: number`
- `longitude: number`
- `radiusMeters: number` (default 300)
- `isEnabled: boolean`
- `lastNotifiedAt?: datetime`

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
