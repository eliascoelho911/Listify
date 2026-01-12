# Especificação de Feature: Inbox Screen

**Feature Branch**: `003-inbox-screen`
**Criado em**: 2026-01-11
**Status**: Draft
**Versão alvo**: MVP
**Input**: Descrição do usuário: "Criar tela de Inbox para gerenciar User Inputs com toolbar, busca, carrossel de listas fixadas, lista de inputs com scroll infinito e bottombar inteligente para entrada de dados"

## Versão & Escopo *(obrigatório)*

**Inclui**:

- Tela principal do Inbox como ponto de entrada do aplicativo
- Toolbar com sidebar de navegação e logo do Listify
- Barra de busca visual (sem funcionalidade de busca nesta versão)
- Seção de listas fixadas com empty state
- Lista vertical de User Inputs com scroll infinito e agrupamento por data
- Bottombar inteligente para entrada de novos inputs com sugestões de tags
- Edição de User Inputs existentes (texto e tags)
- Exclusão de User Inputs com confirmação
- Domínio completo de Inbox (entidades, repositório, use cases)
- Feedback visual para ações do usuário (criação, edição, exclusão, loading states)

**Fora de escopo (Backlog / Próximas versões)**:

- Funcionalidade real de busca (apenas visual nesta versão)
- Entrada por voz (apenas texto nesta versão)
- Integração com Shopping List existente
- Funcionalidade de listas fixadas (apenas empty state)
- Sidebar com rotas funcionais (apenas visual com placeholder)
- Sincronização com backend/cloud

## Cenários do Usuário & Testes *(obrigatório)*

### User Story 1 - Registrar novo input de texto (Priority: P1)

Como usuário do Listify, quero registrar rapidamente uma nota ou pensamento através da bottombar, para que eu possa capturar informações sem fricção e revisá-las depois.

**Por que esta prioridade**: Esta é a funcionalidade core do Inbox. Sem a capacidade de criar inputs, a tela não tem utilidade. É o MVP mínimo viável.

**Teste Independente**: Pode ser testado abrindo o app, digitando texto na bottombar e confirmando o envio. Entrega valor imediato ao permitir captura de informações.

**Cenários de Aceite**:

1. **Given** o usuário está na tela do Inbox, **When** digita texto na bottombar e pressiona o botão de enviar, **Then** o input é criado e aparece na parte inferior da lista (mais recente embaixo) com timestamp atual
2. **Given** o usuário está digitando na bottombar, **When** o texto contém `#tag`, **Then** uma sugestão de tag aparece acima da bottombar
3. **Given** o usuário digitou texto com `#tag`, **When** confirma o envio, **Then** o input é criado com a tag associada
4. **Given** a bottombar está vazia, **When** o usuário tenta enviar, **Then** o botão de enviar permanece desabilitado
5. **Given** o input está sendo criado, **When** a operação está em progresso, **Then** um indicador de loading é exibido na bottombar

---

### User Story 2 - Visualizar histórico de inputs (Priority: P2)

Como usuário do Listify, quero ver todos os meus inputs organizados cronologicamente com separadores de data, para que eu possa navegar facilmente pelo meu histórico de anotações.

**Por que esta prioridade**: Após criar inputs, o usuário precisa visualizá-los. Sem visualização, não há como verificar o que foi registrado.

**Teste Independente**: Pode ser testado criando múltiplos inputs em dias diferentes e verificando se aparecem agrupados corretamente por data.

**Cenários de Aceite**:

1. **Given** existem inputs de múltiplos dias, **When** o usuário visualiza a lista, **Then** inputs são agrupados por data com badges separadores
2. **Given** existem muitos inputs, **When** o usuário rola a lista, **Then** mais inputs são carregados automaticamente (scroll infinito)
3. **Given** não existem inputs, **When** o usuário visualiza a lista, **Then** um empty state apropriado é exibido
4. **Given** inputs existem, **When** o usuário visualiza cada input, **Then** o texto, tags e horário são visíveis
5. **Given** a lista está carregando mais itens, **When** o scroll atinge o fim, **Then** um indicador de loading aparece no rodapé

---

### User Story 3 - Editar e excluir inputs (Priority: P3)

Como usuário do Listify, quero poder editar ou excluir inputs existentes, para que eu possa corrigir erros e manter meu inbox organizado.

**Por que esta prioridade**: Completa o CRUD básico. Após criar e visualizar, o usuário precisa poder corrigir ou remover informações incorretas.

**Teste Independente**: Pode ser testado criando um input, editando seu texto/tags, e verificando que as alterações persistem. Também testável excluindo um input e confirmando que desaparece da lista.

**Cenários de Aceite**:

1. **Given** um input existe na lista, **When** o usuário toca e segura (long press) no input, **Then** um menu de opções aparece com "Editar" e "Excluir"
2. **Given** o menu de opções está aberto, **When** o usuário seleciona "Editar", **Then** o input entra em modo de edição com texto e tags editáveis
3. **Given** o input está em modo de edição, **When** o usuário modifica o texto e confirma, **Then** as alterações são salvas e exibidas
4. **Given** o input está em modo de edição, **When** o usuário cancela, **Then** as alterações são descartadas
5. **Given** o menu de opções está aberto, **When** o usuário seleciona "Excluir", **Then** um diálogo de confirmação aparece
6. **Given** o diálogo de confirmação está aberto, **When** o usuário confirma a exclusão, **Then** o input é removido permanentemente da lista
7. **Given** o diálogo de confirmação está aberto, **When** o usuário cancela, **Then** o input permanece na lista

---

### User Story 4 - Navegar pela interface do Inbox (Priority: P4)

Como usuário do Listify, quero ter acesso visual à estrutura de navegação e busca, para que eu possa entender a organização do app mesmo que algumas funcionalidades ainda não estejam implementadas.

**Por que esta prioridade**: Estabelece a estrutura visual completa da tela, preparando para futuras iterações sem precisar refazer o layout.

**Teste Independente**: Pode ser testado verificando que todos os elementos visuais (toolbar, sidebar, busca, carrossel) estão presentes e respondem a interações básicas.

**Cenários de Aceite**:

1. **Given** o usuário está no Inbox, **When** toca no ícone da sidebar (menu), **Then** a sidebar abre mostrando opções de navegação
2. **Given** a sidebar está aberta, **When** o usuário toca fora dela ou no botão fechar, **Then** a sidebar fecha
3. **Given** o usuário está no Inbox, **When** visualiza a toolbar, **Then** vê o logo "Listify" estilizado
4. **Given** o usuário está no Inbox, **When** toca na barra de busca, **Then** nada acontece (feedback visual de "em breve" opcional)
5. **Given** o usuário está no Inbox, **When** visualiza a seção de listas fixadas, **Then** vê um empty state indicando que não há listas fixadas

---

### User Story 5 - Usar tags para organizar inputs (Priority: P5)

Como usuário do Listify, quero usar hashtags para categorizar meus inputs enquanto digito, para que eu possa organizar informações por contexto sem passos extras.

**Por que esta prioridade**: Tags adicionam organização aos inputs, mas o sistema funciona sem elas. É um enhancement da P1.

**Teste Independente**: Pode ser testado digitando `#compras` na bottombar e verificando que a tag é reconhecida e sugerida.

**Cenários de Aceite**:

1. **Given** o usuário digita `#`, **When** continua digitando letras, **Then** sugestões de tags existentes aparecem em tempo real
2. **Given** existem tags salvas, **When** o usuário digita `#com`, **Then** tags como `#compras` aparecem como sugestão
3. **Given** uma sugestão de tag aparece, **When** o usuário toca na sugestão, **Then** a tag é inserida no texto
4. **Given** o usuário digita uma nova tag que não existe, **When** confirma o input, **Then** a nova tag é criada automaticamente
5. **Given** um input tem múltiplas tags, **When** é exibido na lista, **Then** todas as tags são visíveis como badges

---

### Edge Cases

- O que acontece quando o usuário digita apenas espaços em branco? O input não deve ser criado; botão permanece desabilitado.
- O que acontece quando o usuário digita apenas `#` sem texto de tag? A tag incompleta é ignorada, apenas o texto é salvo.
- Como o sistema lida com tags duplicadas no mesmo input? Tags duplicadas são removidas automaticamente, mantendo apenas uma ocorrência.
- O que acontece quando a lista tem centenas de inputs? Scroll infinito carrega em lotes de 20 itens; performance é mantida com lista virtualizada.
- O que acontece se a persistência falha ao criar input? Mensagem de erro é exibida; usuário pode tentar novamente; texto não é perdido da bottombar.
- Como o sistema lida com tags muito longas? Tags são limitadas a 30 caracteres; excesso é truncado.
- O que acontece quando não há conexão? Sistema funciona offline com persistência local; inputs são salvos normalmente.
- O que acontece se o usuário edita um input para ficar vazio? Não é permitido; botão de salvar permanece desabilitado.
- O que acontece se a exclusão falha? Mensagem de erro é exibida; input permanece na lista; usuário pode tentar novamente.
- O que acontece se a edição falha? Mensagem de erro é exibida; alterações não são salvas; usuário pode tentar novamente ou cancelar.

## Requisitos *(obrigatório)*

### Requisitos Funcionais

**Bottombar & Input**:
- **FR-001**: Sistema MUST exibir uma bottombar fixa na parte inferior da tela com campo de entrada de texto
- **FR-002**: Sistema MUST detectar padrão `#palavra` no texto e interpretar como intenção de tag
- **FR-003**: Sistema MUST exibir sugestões de tags existentes quando usuário digita `#` seguido de letras
- **FR-004**: Sistema MUST permitir selecionar sugestão de tag tocando nela
- **FR-005**: Sistema MUST desabilitar botão de envio quando campo está vazio ou contém apenas espaços
- **FR-006**: Sistema MUST exibir indicador de loading durante criação de input
- **FR-007**: Sistema MUST limpar campo de texto após criação bem-sucedida de input
- **FR-008**: Sistema MUST manter texto no campo se criação falhar

**Lista de Inputs**:
- **FR-009**: Sistema MUST exibir inputs em ordem cronológica crescente (mais recente embaixo, estilo chat)
- **FR-010**: Sistema MUST agrupar inputs por data com badge separador mostrando a data
- **FR-011**: Sistema MUST implementar scroll infinito carregando mais itens ao atingir o fim da lista
- **FR-012**: Sistema MUST exibir para cada input: texto, tags (como badges), e horário de criação
- **FR-013**: Sistema MUST exibir empty state quando não há inputs
- **FR-014**: Sistema MUST exibir indicador de loading no rodapé durante carregamento de mais itens

**Edição & Exclusão**:
- **FR-015**: Sistema MUST exibir menu de opções (Editar/Excluir) ao usuário fazer long press em um input
- **FR-016**: Sistema MUST permitir editar texto e tags de um input existente
- **FR-017**: Sistema MUST preservar data/hora original de criação ao editar um input
- **FR-018**: Sistema MUST exibir diálogo de confirmação antes de excluir um input
- **FR-019**: Sistema MUST remover input permanentemente após confirmação de exclusão
- **FR-020**: Sistema MUST permitir cancelar edição descartando alterações
- **FR-021**: Sistema MUST exibir indicador de loading durante operações de edição/exclusão

**Toolbar & Navegação**:
- **FR-022**: Sistema MUST exibir toolbar com ícone de menu à esquerda e logo "Listify" centralizado
- **FR-023**: Sistema MUST abrir sidebar ao tocar no ícone de menu
- **FR-024**: Sistema MUST permitir fechar sidebar tocando fora dela ou em botão de fechar
- **FR-025**: Sidebar MUST exibir opções de navegação (mesmo que não funcionais nesta versão)

**Busca & Listas Fixadas**:
- **FR-026**: Sistema MUST exibir barra de busca visual abaixo da toolbar
- **FR-027**: Sistema MUST exibir seção "Suas principais listas" com carrossel horizontal
- **FR-028**: Sistema MUST exibir empty state na seção de listas fixadas indicando ausência de listas

**Tags**:
- **FR-029**: Sistema MUST criar nova tag automaticamente quando usuário usa tag inexistente
- **FR-030**: Sistema MUST limitar tags a 30 caracteres
- **FR-031**: Sistema MUST remover tags duplicadas em um mesmo input

**Persistência**:
- **FR-032**: Sistema MUST persistir inputs localmente no dispositivo
- **FR-033**: Sistema MUST persistir tags criadas para sugestões futuras
- **FR-034**: Sistema MUST funcionar completamente offline

### Entidades-chave

- **UserInput**: Representa uma entrada do usuário no inbox. Atributos: identificador único, texto original, data/hora de criação, lista de tags associadas.

- **Tag**: Representa uma categoria/etiqueta para organização. Atributos: identificador único, nome (texto após #), contador de uso (para ordenar sugestões por relevância).

- **InputTag**: Relacionamento entre UserInput e Tag. Permite um input ter múltiplas tags e uma tag estar em múltiplos inputs.

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **SC-001**: Usuários conseguem criar um novo input em menos de 5 segundos (desde abrir app até input salvo)
- **SC-002**: Lista de inputs carrega com feedback visual em menos de 1 segundo
- **SC-003**: Sugestões de tags aparecem em tempo real enquanto usuário digita (latência imperceptível)
- **SC-004**: 100% dos inputs criados são persistidos e recuperados corretamente após reiniciar o app
- **SC-005**: Scroll infinito mantém experiência fluida com listas de 500+ itens
- **SC-006**: Interface responde a todas as interações com feedback visual imediato
- **SC-007**: Sistema funciona completamente offline sem erros ou perda de dados

## Premissas

- O design system existente (Navbar, SearchBar, Badge, etc.) será utilizado e estendido conforme necessário
- A persistência será feita com SQLite seguindo o padrão já estabelecido no projeto (ver infra/)
- O domínio Inbox será completamente independente do domínio Shopping existente
- Tags são case-insensitive (ex: `#Compras` e `#compras` são a mesma tag)
- O formato de data nos badges seguirá o padrão de localização do dispositivo
- A bottombar deve permanecer visível mesmo quando o teclado está aberto
