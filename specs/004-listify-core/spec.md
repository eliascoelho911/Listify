# Especificação de Feature: Listify Core

**Feature Branch**: `004-listify-core`
**Criado em**: 2026-01-16
**Status**: Draft
**Versão alvo**: MVP
**Input**: Desenvolver o Listify, um aplicativo mobile de gerenciamento de notas e listas que ajuda os usuários a organizar suas ideias e interesses de forma eficiente e intuitiva.

## Visão Geral do Produto

### O Problema

Pessoas comuns lidam diariamente com múltiplos tipos de informações que precisam ser capturadas e organizadas rapidamente: listas de compras no caminho do supermercado, filmes recomendados por amigos, livros que querem ler, ideias que surgem no meio do dia. Aplicativos existentes ou são muito complexos (exigindo múltiplos passos para criar um simples item) ou são muito simples (não oferecendo organização adequada para diferentes tipos de conteúdo).

### A Solução

O Listify resolve isso com uma abordagem de **captura unificada e inteligente**: um único campo de texto que entende o contexto do que o usuário está digitando e automaticamente categoriza, organiza e enriquece a informação. O usuário não precisa navegar por menus ou preencher formulários - ele simplesmente digita o que precisa lembrar, e o Listify faz o resto.

### Público-Alvo

- **Usuários casuais** que precisam de um lugar confiável para guardar listas de compras e lembretes do dia-a-dia
- **Entusiastas de mídia** que mantêm listas de filmes para assistir, livros para ler e games para jogar
- **Pessoas organizadas** que gostam de categorizar informações em listas e seções e encontrar tudo rapidamente

### Proposta de Valor Única

1. **Entrada Inteligente em Linha Única**: O diferencial principal do Listify é permitir que o usuário digite tudo em uma única linha de texto. Ao escrever "Comprar leite 2L R$8,50 @Supermercado", o sistema automaticamente extrai o título, quantidade, valor e lista de destino.

2. **Listas Especializadas com Contexto Rico**: Diferente de apps genéricos de notas, o Listify entende que uma lista de compras precisa de quantidades e valores (com total calculado), enquanto uma lista de filmes se beneficia de sinopses e avaliações vindas de fontes externas.

3. **Organização Flexível com Seções**: Cada lista pode ter seções customizadas criadas pelo usuário, permitindo agrupar itens visualmente dentro de uma mesma lista (ex: "Urgente", "Pode esperar", "Ideias futuras").

## Versão & Escopo *(obrigatório)*

**Inclui**:

- Tela Inbox com listagem de todos os itens recentes de todas as categorias (scroll infinito paginado)
- Tela Buscar com campo auto-focado, filtros visíveis e histórico de buscas recentes
- Tela Notas com itens da lista de Notas única (pré-fabricada) e configuração de layout (agrupamento por seção/data e ordenação)
- Tela Listas com listas ativas agrupadas por TIPO (categoria) com dropdown expansível
- Botão central Adicionar que abre modal/sheet com campo de entrada inteligente
- Campo de entrada inteligente com parsing de texto (@lista, quantidade, valor), inline highlighting, preview compacto e busca inline para interesse
- Inferência de categoria com IA ao criar nova lista (baseado no conteúdo do item)
- Sistema de listas com três categorias: Notas, Compras e Interesse
- Fluxo de criação, edição e exclusão de listas customizadas
- Seções customizadas dentro de cada lista para organização visual de itens
- Lista de Notas única (pré-fabricada) com suporte a markdown básico e drag and drop para reordenação
- Listas de Compras com quantidade, valor, total calculado, marcação de itens, drag and drop, conclusão de compra e histórico
- Listas de Interesse (Filmes, Livros, Games) com integração a provedores externos (TMDb, Google Books, IGDB)
- Tela de detalhes de notas com visualização e edição
- Configurações de tema (claro, escuro, automático) e cores principais acessíveis via ícone de Perfil na Navbar
- Bottombar fixa com navegação entre Inbox, Buscar, Notas, Listas e botão central Adicionar

**Fora de escopo (Backlog / Próximas versões)**:

- Sincronização em nuvem e múltiplos dispositivos
- Compartilhamento de listas entre usuários
- Notificações e lembretes programados
- Modo offline avançado com sincronização posterior
- Reconhecimento de voz para entrada de itens
- Widgets para home screen
- Exportação de listas (PDF, CSV)
- Análise de gastos e relatórios financeiros (histórico básico de compras está incluído no MVP)
- Integração com assistentes de voz (Alexa, Google Assistant)
- Autenticação de usuário e contas
- Recursos avançados de IA além da inferência de categoria (sugestões proativas, auto-complete inteligente)

## Cenários do Usuário & Testes *(obrigatório)*

> **Nota sobre Priorização**: As histórias estão organizadas para maximizar reuso de código e componentes. Histórias P0 estabelecem a fundação (navegação, estruturas base), P1 implementa funcionalidades core sobre essa fundação, P2 adiciona recursos importantes mas não críticos, e P3 são melhorias e personalizações.

---

## Escopo 1: Fundação e Navegação

### User Story 1.1 - Navegação Principal via BottomBar (Priority: P0)

O usuário navega entre as principais seções do app (Inbox, Buscar, Notas, Listas) através da barra inferior fixa, com botão central para adicionar itens rapidamente.

**Por que esta prioridade**: A navegação principal é a fundação de toda a UX do app. Todos os outros recursos dependem desta estrutura para serem acessíveis.

**Componentes Reutilizáveis**: BottomBar (atom), NavigationTab (atom), FAB central (atom)

**Teste Independente**: Pode ser testado tocando em cada aba da bottombar e verificando se a tela correta é exibida.

**Cenários de Aceite**:

1. **Given** o usuário está no Inbox, **When** toca na aba "Buscar" na bottombar, **Then** navega para a tela de busca com campo auto-focado
2. **Given** o usuário está na tela de Buscar, **When** toca na aba "Notas" na bottombar, **Then** navega para a tela de notas
3. **Given** o usuário está na tela de Notas, **When** toca na aba "Listas" na bottombar, **Then** navega para a tela de listas agrupadas por tipo
4. **Given** o usuário está na tela de Listas, **When** toca na aba "Inbox" na bottombar, **Then** retorna para o Inbox
5. **Given** o usuário está em qualquer tela, **When** observa a bottombar, **Then** a aba atual está destacada visualmente
6. **Given** o usuário navega entre abas, **When** retorna a uma aba visitada anteriormente, **Then** o estado da tela é preservado (posição do scroll, filtros aplicados)
7. **Given** o usuário está em qualquer tela, **When** toca no botão central "Adicionar", **Then** abre modal/sheet com campo de entrada inteligente

---

### User Story 1.2 - Navbar e Acesso a Configurações (Priority: P0)

O usuário acessa configurações e informações de perfil através do ícone na navbar superior, presente em todas as telas principais.

**Por que esta prioridade**: A navbar é um componente de fundação presente em todas as telas, necessário para navegação secundária.

**Componentes Reutilizáveis**: Navbar (organism), ProfileButton (molecule), ScreenTitle (atom)

**Teste Independente**: Pode ser testado tocando no ícone de perfil e verificando navegação para configurações.

**Cenários de Aceite**:

1. **Given** o usuário está em qualquer tela com navbar visível, **When** toca no ícone de perfil (esquerda da navbar), **Then** navega para a tela de configurações
2. **Given** o usuário está na tela de configurações, **When** observa o topo da tela, **Then** vê informações do perfil (foto, nome, email)
3. **Given** o usuário está na tela de configurações, **When** toca no botão voltar, **Then** retorna para a tela anterior

---

## Escopo 2: Entrada Inteligente (Core)

### User Story 2.1 - Campo de Entrada Inteligente (Priority: P0)

O campo de entrada inteligente é o componente central do Listify. Permite ao usuário adicionar itens usando sintaxe natural com parsing automático de lista, quantidade e valor.

**Por que esta prioridade**: Este é o diferencial principal do Listify - a captura ultra-rápida. Sem isso, o app perde sua proposta de valor central. É usado em TODAS as telas para adicionar itens.

**Componentes Reutilizáveis**: SmartInput (organism), InlineHighlight (molecule), ParsePreview (molecule), ListSuggestionDropdown (molecule)

**Teste Independente**: Pode ser testado digitando diferentes formatos de texto e verificando o parsing correto.

**Cenários de Aceite**:

1. **Given** o campo está vazio, **When** o usuário digita "@", **Then** o sistema exibe dropdown com todas as listas disponíveis filtradas em tempo real
2. **Given** o usuário digita "Leite @Mercado", **When** confirma a entrada, **Then** o item "Leite" é criado na lista "Mercado"
3. **Given** o usuário digita "Leite 2L R$8,50 @Mercado" (lista de compras), **When** confirma a entrada, **Then** o sistema extrai quantidade (2L), valor (R$8,50) e título (Leite)
4. **Given** o usuário digita "Leite 2L R$8,50" sem lista de compras, **When** confirma a entrada, **Then** o sistema NÃO extrai valor (texto permanece como parte do título)
5. **Given** o usuário está digitando, **When** texto contém @lista ou R$valor, **Then** esses elementos são destacados com cores diferentes (inline highlighting)
6. **Given** o usuário digitou texto com elementos parseáveis, **When** visualiza abaixo do campo, **Then** vê preview compacto com chips/badges dos elementos extraídos

---

### User Story 2.2 - Criação de Lista Inline com Inferência (Priority: P1)

Quando o usuário referencia uma lista que não existe (@NovaLista), o sistema oferece criar automaticamente, inferindo a categoria baseado no contexto.

**Por que esta prioridade**: Permite fluxo de criação sem interromper a captura. Depende do campo de entrada inteligente (2.1).

**Componentes Reutilizáveis**: CategoryInferenceService, MiniCategorySelector (molecule)

**Teste Independente**: Pode ser testado digitando @NomeNovo e verificando o fluxo de criação.

**Cenários de Aceite**:

1. **Given** o usuário digita "@NovaLista", **When** a lista "NovaLista" não existe, **Then** o sistema sugere criar nova lista
2. **Given** o usuário confirma criar nova lista, **When** o conteúdo contém R$, **Then** a lista é inferida como categoria "Compras"
3. **Given** o usuário confirma criar nova lista, **When** o conteúdo parece título de mídia (filme/livro/game), **Then** a lista é inferida como categoria "Interesse"
4. **Given** o usuário confirma criar nova lista, **When** a inferência tem baixa confiança, **Then** exibe mini-seletor de categoria (Notas/Compras/Interesse)
5. **Given** o usuário seleciona categoria "Interesse", **When** confirma, **Then** exibe opções de subtipo (Filmes/Livros/Games)

---

### User Story 2.3 - Captura Rápida de Item (Priority: P1)

Maria está no ônibus e lembra que precisa comprar leite. Ela abre o Listify, digita "Leite @Mercado" e fecha o app. Em 5 segundos, o item já está na lista certa.

**Por que esta prioridade**: Demonstra o valor do campo inteligente em cenário real. Depende de 2.1 e navegação básica.

**Componentes Reutilizáveis**: Todos os componentes de SmartInput já criados

**Teste Independente**: Pode ser testado medindo tempo desde abertura até item criado.

**Cenários de Aceite**:

1. **Given** o usuário abre o app, **When** toca no botão Adicionar e digita "Leite @Mercado", **Then** o item é criado em menos de 10 segundos
2. **Given** o usuário digita "Minha ideia importante" sem @lista, **When** confirma a entrada, **Then** o item é criado sem lista associada e aparece na Inbox
3. **Given** o modal de entrada está aberto, **When** o usuário cria um item, **Then** o modal permanece aberto para criação contínua
4. **Given** o usuário criou múltiplos itens, **When** toca fora do modal ou no X, **Then** o modal fecha

---

## Escopo 3: Telas Principais

### User Story 3.1 - Inbox como Hub Central (Priority: P1)

O usuário abre o app e vê todos os seus itens recentes no Inbox. Pode agrupar por data de criação, atualização ou lista, e ordenar de forma ascendente ou descendente.

**Por que esta prioridade**: O Inbox é a tela principal e ponto de entrada do app. Utiliza componentes de navegação criados em P0.

**Componentes Reutilizáveis**: ItemCard (molecule), GroupHeader (atom), InfiniteScrollList (organism), SortingControls (molecule)

**Teste Independente**: Pode ser testado com diversos itens criados, alterando agrupamentos e ordenação, verificando se a lista se reorganiza corretamente.

**Cenários de Aceite**:

1. **Given** existem 50 itens no Inbox, **When** o usuário faz scroll até o final, **Then** mais itens são carregados automaticamente (scroll infinito)
2. **Given** o usuário seleciona agrupar por "Lista", **When** a lista atualiza, **Then** os itens são exibidos agrupados por suas listas com headers separadores (itens sem lista aparecem em grupo "Sem lista")
3. **Given** o usuário alterna ordenação para "Descendente", **When** está agrupando por data de criação, **Then** os itens mais recentes aparecem primeiro
4. **Given** o Inbox exibe itens de todas as categorias, **When** o usuário visualiza a lista, **Then** vê itens de Notas, Compras e Interesse misturados ordenados por data

---

### User Story 3.2 - Tela Listas com Agrupamento por Categoria (Priority: P1)

O usuário quer visualizar todas as suas listas organizadas por tipo (categoria) com dropdowns expansíveis para fácil navegação.

**Por que esta prioridade**: Tela Listas é uma aba principal da navegação, essencial para gerenciamento de listas. Utiliza padrões de UI já estabelecidos.

**Componentes Reutilizáveis**: CategoryDropdown (organism), ListCard (molecule), EmptyState (molecule)

**Teste Independente**: Pode ser testado navegando para a aba Listas, verificando agrupamento por tipo, expandindo/colapsando dropdowns.

**Cenários de Aceite**:

1. **Given** o usuário toca na aba "Listas" na bottombar, **When** a tela abre, **Then** exibe listas agrupadas por tipo: Notas, Compras e Interesse
2. **Given** a tela Listas está aberta, **When** o usuário visualiza um grupo, **Then** vê dropdown expansível com nome do tipo e contagem de listas
3. **Given** um dropdown está colapsado, **When** o usuário toca nele, **Then** expande e mostra as listas daquele tipo
4. **Given** um dropdown está expandido, **When** o usuário toca nele, **Then** colapsa e oculta as listas
5. **Given** a tela Listas está aberta, **When** o usuário toca em uma lista específica, **Then** navega para a tela de conteúdo da lista
6. **Given** a tela Listas está aberta, **When** o usuário toca no botão "Nova Lista", **Then** abre formulário de criação de lista

---

### User Story 3.3 - Tela Notas com Layout Configurável (Priority: P1)

O usuário quer visualizar os itens da lista de Notas única em uma tela dedicada com opções de ordenação e agrupamento configuráveis.

**Por que esta prioridade**: Tela Notas é uma aba principal da navegação, essencial para acesso rápido aos itens de notas. Reutiliza ItemCard e SortingControls.

**Componentes Reutilizáveis**: NoteCard (molecule, variante do ItemCard), SortingControls (reutilizado), GroupHeader (reutilizado)

**Teste Independente**: Pode ser testado navegando para a aba Notas, verificando exibição de itens, alterando agrupamento e ordenação.

**Cenários de Aceite**:

1. **Given** o usuário toca na aba "Notas" na bottombar, **When** a tela abre, **Then** exibe itens da lista de Notas única (pré-fabricada)
2. **Given** a tela Notas está aberta, **When** o usuário toca no controle de agrupamento, **Then** pode escolher agrupar por: seção, data de criação ou data de atualização
3. **Given** a tela Notas está aberta, **When** o usuário toca no controle de ordenação, **Then** pode escolher ordem ascendente ou descendente
4. **Given** o usuário configura agrupamento e ordenação, **When** navega para outra aba e retorna, **Then** as configurações são preservadas
5. **Given** a tela Notas está aberta, **When** o usuário toca em um item, **Then** navega para a tela de detalhes da nota
6. **Given** o agrupamento é "por seção", **When** existem itens sem seção, **Then** aparecem em grupo "Sem seção" no topo, acima das seções definidas

---

### User Story 3.4 - Tela de Busca Avançada (Priority: P1)

Pedro lembra que anotou uma ideia há meses, mas não lembra onde. Ele toca na aba "Buscar", vê seu histórico de buscas recentes, digita no campo auto-focado, aplica filtros e encontra a nota em segundos.

**Por que esta prioridade**: Busca é uma aba principal, essencial para recuperação rápida de informações em bases grandes.

**Componentes Reutilizáveis**: SearchInput (molecule), FilterChip (atom), SearchHistory (molecule), SearchResultCard (molecule)

**Teste Independente**: Pode ser testado navegando para a aba Buscar, verificando auto-foco, histórico e filtros, executando busca com diferentes critérios.

**Cenários de Aceite**:

1. **Given** o usuário toca na aba "Buscar" na bottombar, **When** a tela abre, **Then** o campo de busca está auto-focado e teclado visível
2. **Given** a tela de busca está aberta com campo vazio, **When** o usuário visualiza a tela, **Then** vê histórico de buscas recentes (até 10) e atalhos para 3-5 listas mais acessadas
3. **Given** filtros estão colapsados por padrão, **When** o usuário toca para expandir, **Then** vê filtros de tipo, período e lista
4. **Given** existem buscas anteriores, **When** o usuário toca em uma busca do histórico, **Then** a busca é executada automaticamente com os mesmos termos
5. **Given** existem 100 itens no app, **When** o usuário busca por "compras", **Then** apenas itens contendo "compras" no título ou descrição são exibidos em tempo real
6. **Given** o usuário aplica filtro "última semana", **When** a busca executa, **Then** apenas itens criados nos últimos 7 dias aparecem
7. **Given** o usuário combina múltiplos filtros (tipo + período + lista), **When** a busca executa, **Then** apenas itens que atendem TODOS os critérios aparecem
8. **Given** resultados são exibidos, **When** o usuário visualiza, **Then** o termo buscado está destacado (highlight) no título e descrição
9. **Given** resultados são exibidos, **When** o usuário toca em um resultado, **Then** navega para a tela de detalhes do item
10. **Given** o usuário quer limpar histórico, **When** toca no X de uma busca ou "Limpar histórico", **Then** busca é removida individualmente ou todas de uma vez

---

## Escopo 4: Gerenciamento de Listas

### User Story 4.1 - Criar Lista Customizada (Priority: P1)

O usuário quer criar uma nova lista para organizar um tipo específico de conteúdo, escolhendo a categoria apropriada.

**Por que esta prioridade**: Criar listas é fundamental para a organização do app e necessário antes de poder adicionar itens a listas específicas.

**Componentes Reutilizáveis**: ListForm (organism), CategorySelector (molecule), SubtypeSelector (molecule)

**Teste Independente**: Pode ser testado acessando a tela de listas, criando uma nova lista com nome e categoria, verificando se aparece na listagem.

**Cenários de Aceite**:

1. **Given** o usuário está na tela de Listas, **When** toca no botão "Nova Lista", **Then** abre formulário para criação de lista
2. **Given** o formulário de nova lista está aberto, **When** o usuário digita nome "Compras do Mês" e seleciona categoria "Compras", **Then** a lista é criada com as configurações corretas
3. **Given** o usuário cria lista de categoria "Interesse", **When** seleciona o subtipo "Filmes", **Then** a lista é criada com comportamento de lista de filmes
4. **Given** o usuário tenta criar lista com nome já existente, **When** confirma, **Then** o sistema exibe mensagem de erro e não cria duplicata
5. **Given** a lista foi criada, **When** o usuário volta para tela de Listas, **Then** a nova lista aparece na listagem ordenada alfabeticamente

---

### User Story 4.2 - Editar e Excluir Lista (Priority: P2)

O usuário quer renomear uma lista existente ou excluí-la quando não for mais necessária.

**Por que esta prioridade**: Gerenciamento completo de listas é importante, mas pode vir após a criação básica funcionar.

**Componentes Reutilizáveis**: ContextMenu (molecule), ConfirmationDialog (molecule), ListForm (reutilizado)

**Teste Independente**: Pode ser testado editando nome de uma lista, excluindo outra, verificando se itens são tratados corretamente.

**Cenários de Aceite**:

1. **Given** o usuário está na tela de Listas, **When** mantém pressionada uma lista, **Then** exibe opções de "Editar" e "Excluir"
2. **Given** o usuário seleciona "Editar" em uma lista, **When** altera o nome para "Novo Nome", **Then** a lista é renomeada e mantém seus itens
3. **Given** o usuário seleciona "Excluir" em uma lista com itens, **When** confirma a exclusão, **Then** o sistema pergunta o que fazer com os itens
4. **Given** o usuário escolhe "Mover para Inbox" ao excluir lista, **When** confirma, **Then** os itens ficam sem lista (visíveis no Inbox) e a lista original é excluída
5. **Given** o usuário escolhe "Excluir tudo" ao excluir lista, **When** confirma, **Then** a lista e todos seus itens são excluídos permanentemente
6. **Given** a lista é a de Notas (pré-fabricada), **When** o usuário tenta editar ou excluir, **Then** o sistema não permite (nome fixo "Notas")

---

## Escopo 5: Seções dentro de Listas

### User Story 5.1 - Criar e Gerenciar Seções (Priority: P2)

O usuário quer organizar os itens dentro de uma lista em seções customizadas para melhor visualização e agrupamento visual.

**Por que esta prioridade**: Seções melhoram significativamente a organização, mas listas funcionam sem elas. Dependem de listas funcionando.

**Componentes Reutilizáveis**: SectionHeader (molecule), SectionAddButton (atom), DraggableList (organism)

**Teste Independente**: Pode ser testado criando seções em uma lista, movendo itens entre seções, renomeando e excluindo seções.

**Cenários de Aceite**:

1. **Given** o usuário está em uma lista, **When** toca no botão "Nova Seção", **Then** uma nova seção é criada com nome editável
2. **Given** uma seção existe na lista, **When** o usuário arrasta um item para dentro da seção, **Then** o item é movido para a seção
3. **Given** uma seção existe com itens, **When** o usuário renomeia a seção, **Then** o nome é atualizado e os itens permanecem
4. **Given** uma seção existe com itens, **When** o usuário exclui a seção, **Then** os itens são movidos para fora da seção (ficam na lista sem seção)
5. **Given** uma lista tem múltiplas seções, **When** o usuário arrasta uma seção, **Then** a ordem das seções é alterada e persistida
6. **Given** uma seção existe, **When** o usuário visualiza a seção, **Then** vê botão "Adicionar nessa seção" que abre modal com @Lista:Seção preenchido
7. **Given** itens existem sem seção na lista, **When** o usuário visualiza a lista, **Then** itens "soltos" aparecem no TOPO, antes das seções

---

## Escopo 6: Listas de Compras

### User Story 6.1 - Marcar Itens e Ver Total (Priority: P1)

João abre sua lista "Supermercado" e vê todos os itens organizados. Conforme pega os itens, marca cada um como comprado e vê o total atualizado em tempo real na barra inferior.

**Por que esta prioridade**: Listas de compras são o caso de uso mais frequente. A marcação e total são funcionalidades core.

**Componentes Reutilizáveis**: ShoppingItemCard (molecule), TotalBar (molecule), Checkbox (atom), PriceBadge (atom)

**Teste Independente**: Pode ser testado criando uma lista de compras, adicionando itens com valores, marcando itens e verificando o total.

**Cenários de Aceite**:

1. **Given** o usuário está em uma lista de compras com itens, **When** marca um item como comprado, **Then** o item exibe indicação visual de marcado e o total na barra inferior é atualizado
2. **Given** uma lista de compras com 3 itens (R$10, R$20, R$30), **When** o usuário marca todos, **Then** a barra mostra total de R$60,00
3. **Given** existem itens marcados sem valor definido, **When** o usuário visualiza o total, **Then** a barra exibe indicador "(X itens sem valor)"
4. **Given** o usuário adiciona "Pão R$5,00" na lista de compras, **When** confirma, **Then** o item mostra badge com valor extraído
5. **Given** o total é atualizado, **When** o usuário marca/desmarca item, **Then** a atualização ocorre em menos de 100ms (tempo real)

---

### User Story 6.2 - Reordenar Itens de Compras (Priority: P1)

O usuário quer reorganizar a ordem dos itens na lista de compras para refletir a ordem de navegação no supermercado.

**Por que esta prioridade**: Reordenação é essencial para usabilidade prática da lista de compras.

**Componentes Reutilizáveis**: DraggableList (reutilizado), DragHandle (atom)

**Teste Independente**: Pode ser testado arrastando itens e verificando se a nova ordem persiste.

**Cenários de Aceite**:

1. **Given** o usuário está em uma lista de compras, **When** arrasta um item para cima ou baixo, **Then** o item é reordenado visualmente
2. **Given** o usuário reordenou itens, **When** fecha e reabre a lista, **Then** a nova ordem está persistida
3. **Given** a lista tem seções, **When** o usuário arrasta item entre seções, **Then** o item é movido para a nova seção

---

### User Story 6.3 - Editar Item de Compras (Priority: P2)

O usuário percebe que errou o valor ou quantidade de um item já adicionado e quer corrigir rapidamente.

**Por que esta prioridade**: Edição é importante para correções, mas criação correta tem prioridade maior.

**Componentes Reutilizáveis**: EditModal (organism), SmartInput (reutilizado)

**Teste Independente**: Pode ser testado tocando em um item existente, editando via modal e verificando persistência.

**Cenários de Aceite**:

1. **Given** o usuário toca em um item da lista de compras, **When** o modal de edição abre, **Then** exibe campo de entrada inteligente pré-preenchido com dados atuais (ex: "Leite 2L R$8,50")
2. **Given** o modal está aberto, **When** o usuário altera "Leite 2L R$8,50" para "Leite 1L R$4,50", **Then** o parsing atualiza quantidade e valor
3. **Given** o usuário salvou edição, **When** visualiza a lista, **Then** o item mostra os novos valores
4. **Given** o modal está aberto, **When** o usuário toca em "Excluir", **Then** o item é removido da lista após confirmação

---

### User Story 6.4 - Concluir Compra e Histórico (Priority: P2)

Após terminar as compras, o usuário quer salvar um registro da compra realizada e resetar a lista para reutilização futura.

**Por que esta prioridade**: Histórico agrega muito valor, mas a lista funciona sem ele. Depende de marcação funcionando.

**Componentes Reutilizáveis**: CompleteButton (molecule), HistoryList (organism), HistoryCard (molecule)

**Teste Independente**: Pode ser testado marcando itens, concluindo compra e verificando histórico.

**Cenários de Aceite**:

1. **Given** a lista tem pelo menos um item marcado, **When** o usuário visualiza a tela, **Then** vê botão "Concluir compra"
2. **Given** o usuário toca em "Concluir compra", **When** confirma, **Then** sistema cria registro no histórico com snapshot (itens, quantidades, valores, total, data)
3. **Given** a compra foi concluída, **When** o usuário visualiza a lista, **Then** todas as marcações foram resetadas (lista pronta para próxima compra)
4. **Given** o usuário toca em "Ver histórico", **When** a tela abre, **Then** exibe lista de compras concluídas daquela lista específica, ordenadas por data (mais recente primeiro)

---

### User Story 6.5 - Reutilizar Itens do Histórico (Priority: P2)

O usuário quer readicionar itens de uma compra anterior à lista atual sem precisar digitar tudo novamente.

**Por que esta prioridade**: Reutilização melhora muito a UX de longo prazo, mas depende de histórico funcionando.

**Componentes Reutilizáveis**: HistoryDetailScreen (organism), SelectableItemList (molecule), AddAllButton (atom)

**Teste Independente**: Pode ser testado acessando histórico, selecionando itens e verificando adição à lista.

**Cenários de Aceite**:

1. **Given** o usuário está no detalhe de um histórico, **When** toca em "Comprar tudo novamente", **Then** todos os itens são adicionados à lista
2. **Given** um item do histórico já existe na lista atual, **When** usuário adiciona novamente, **Then** sistema soma quantidade em vez de duplicar
3. **Given** o usuário está no detalhe de um histórico, **When** seleciona itens individuais, **Then** pode adicionar apenas os selecionados
4. **Given** itens do histórico são exibidos, **When** um item já existe na lista atual, **Then** exibe indicação visual diferenciada

---

## Escopo 7: Listas de Notas

### User Story 7.1 - Criar e Organizar Notas (Priority: P2)

O usuário quer criar notas para suas ideias e organizá-las em uma ordem específica que faça sentido para seu fluxo de trabalho.

**Por que esta prioridade**: Notas são um caso de uso frequente e reutilizam muitos componentes já criados para compras.

**Componentes Reutilizáveis**: NoteCard (molecule), DraggableList (reutilizado), SmartInput (reutilizado)

**Teste Independente**: Pode ser testado na lista de Notas (única), adicionando itens e reordenando via drag and drop.

**Cenários de Aceite**:

1. **Given** o usuário está na lista de Notas (única), **When** adiciona "Ideia para projeto", **Then** o item é criado com título
2. **Given** a lista de Notas tem 5 itens, **When** arrasta um item para nova posição, **Then** o item é reordenado e a nova ordem é persistida
3. **Given** o usuário cria nota sem digitar título, **When** adiciona apenas descrição, **Then** sistema gera título automaticamente via IA (fallback: timestamp ou "Sem título")
4. **Given** IA está indisponível, **When** nota é criada sem título, **Then** exibe timestamp de criação ou "Sem título"

---

### User Story 7.2 - Tela de Detalhes da Nota (Priority: P2)

O usuário quer visualizar uma nota completa com todas as suas informações e poder editar qualquer campo diretamente.

**Por que esta prioridade**: A visualização e edição de notas é fundamental para o uso completo do recurso de notas.

**Componentes Reutilizáveis**: NoteDetailScreen (organism), MarkdownViewer (molecule), MarkdownEditor (molecule), InlineEdit (atom)

**Teste Independente**: Pode ser testado abrindo uma nota existente, visualizando todos os campos, editando e verificando persistência.

**Cenários de Aceite**:

1. **Given** o usuário toca em uma nota na lista, **When** a tela de detalhes abre, **Then** exibe título, descrição formatada em modo VISUALIZAÇÃO (markdown renderizado) e lista de origem (se houver)
2. **Given** o usuário está na tela de detalhes, **When** toca no título, **Then** pode editar inline e salvar
3. **Given** o usuário está na tela de detalhes em modo visualização, **When** toca na descrição, **Then** entra em modo edição com suporte a markdown
4. **Given** o usuário edita a descrição com "**Negrito** e _itálico_", **When** salva e visualiza, **Then** a formatação é renderizada corretamente
5. **Given** o usuário usa markdown avançado (headers h1-h3, listas, links), **When** salva e visualiza, **Then** todos os elementos são renderizados corretamente
6. **Given** o usuário altera a lista associada do item, **When** salva, **Then** o item aparece na nova lista e some da anterior

---

## Escopo 8: Listas de Interesse (Filmes, Livros, Games)

### User Story 8.1 - Adicionar Filme com Enriquecimento Automático (Priority: P2)

Um amigo recomenda um filme para Ana. Ela abre o Listify, vai na lista "Filmes para Ver", digita o título e o sistema exibe resultados do TMDb em tempo real. Ela seleciona e o filme é adicionado com todos os dados.

**Por que esta prioridade**: Listas de interesse diferenciam o Listify. Reutilizam SmartInput com busca inline já implementada.

**Componentes Reutilizáveis**: MediaSearchDropdown (molecule), MediaCard (molecule), MediaDetailScreen (organism), TMDbService

**Teste Independente**: Pode ser testado buscando um filme conhecido, verificando se dados são preenchidos automaticamente, e marcando como visto.

**Cenários de Aceite**:

1. **Given** o usuário está em uma lista de Filmes, **When** digita "Matrix" no campo de entrada, **Then** dropdown inline exibe resultados do TMDb com poster, título, ano e sinopse
2. **Given** resultados estão no dropdown, **When** o usuário seleciona um filme, **Then** o item é criado com dados enriquecidos (sinopse, elenco, avaliação, capa)
3. **Given** um filme existe na lista, **When** o usuário toca para marcar como visto, **Then** o status muda e exibe indicação visual diferenciada
4. **Given** o provedor externo está indisponível, **When** o usuário busca um filme, **Then** o sistema mostra mensagem apropriada e permite adicionar manualmente
5. **Given** o usuário não encontra o filme desejado, **When** escolhe criar manualmente, **Then** pode adicionar título sem dados enriquecidos

---

### User Story 8.2 - Adicionar Livro com Busca Integrada (Priority: P3)

O usuário quer adicionar um livro à sua lista de leitura buscando pelo título e obtendo informações automáticas do Google Books.

**Por que esta prioridade**: Similar a filmes, reutiliza toda a infraestrutura de busca inline. Menor frequência de uso.

**Componentes Reutilizáveis**: MediaSearchDropdown (reutilizado), BookCard (variante), GoogleBooksService

**Teste Independente**: Pode ser testado buscando um livro conhecido, selecionando da lista, verificando dados preenchidos.

**Cenários de Aceite**:

1. **Given** o usuário está em uma lista de Livros, **When** digita "O Senhor dos Anéis", **Then** dropdown inline exibe resultados com capa, título, autor e descrição
2. **Given** o usuário seleciona um livro da busca, **When** confirma, **Then** o item é criado com autor, editora, sinopse e capa
3. **Given** o usuário marca um livro como "lido", **When** visualiza a lista, **Then** o livro aparece com indicação visual de status completo

---

### User Story 8.3 - Adicionar Game com Busca Integrada (Priority: P3)

O usuário quer adicionar um jogo à sua lista de games buscando pelo título e obtendo informações automáticas do IGDB.

**Por que esta prioridade**: Games são o terceiro subtipo de interesse. Reutiliza toda a infraestrutura já criada para filmes e livros.

**Componentes Reutilizáveis**: MediaSearchDropdown (reutilizado), GameCard (variante), IGDBService

**Teste Independente**: Pode ser testado buscando um game conhecido, selecionando da lista, verificando dados preenchidos.

**Cenários de Aceite**:

1. **Given** o usuário está em uma lista de Games, **When** digita "The Witcher 3", **Then** dropdown inline exibe resultados com capa, título, desenvolvedor e descrição
2. **Given** o usuário seleciona um game da busca, **When** confirma, **Then** o item é criado com desenvolvedor, plataformas, sinopse e capa
3. **Given** o usuário marca um game como "jogado", **When** visualiza a lista, **Then** o game aparece com indicação visual de status completo

---

## Escopo 9: Configurações e Personalização

### User Story 9.1 - Configuração de Tema (Priority: P3)

O usuário prefere usar o app no modo escuro e quer personalizar a cor de destaque.

**Por que esta prioridade**: Personalização visual é desejável mas não essencial para a funcionalidade core. Pode vir por último.

**Componentes Reutilizáveis**: ThemeSelector (molecule), ColorPicker (molecule), SettingsScreen (organism)

**Teste Independente**: Pode ser testado alterando tema, verificando mudança visual imediata, alterando cor principal, verificando aplicação.

**Cenários de Aceite**:

1. **Given** o usuário acessa Configurações, **When** seleciona "Tema Escuro", **Then** todo o app muda para o esquema de cores escuro imediatamente
2. **Given** o usuário seleciona "Tema Automático", **When** o sistema operacional está em modo escuro, **Then** o app segue o modo do sistema
3. **Given** o usuário seleciona uma cor principal diferente, **When** aplica, **Then** elementos de destaque (botões, links, ícones ativos) mudam para a nova cor
4. **Given** o usuário configurou tema personalizado, **When** fecha e reabre o app, **Then** as configurações estão persistidas

---

## Escopo 10: Exclusão de Itens

### User Story 10.1 - Excluir Itens de Qualquer Lista (Priority: P2)

O usuário quer remover itens que não são mais necessários de qualquer tipo de lista.

**Por que esta prioridade**: Exclusão é importante para manutenção das listas, mas criação e visualização têm prioridade maior.

**Componentes Reutilizáveis**: ContextMenu (reutilizado), ConfirmationDialog (reutilizado), SwipeToDelete (molecule)

**Teste Independente**: Pode ser testado excluindo itens de diferentes tipos de lista (compras, notas, interesse).

**Cenários de Aceite**:

1. **Given** o usuário está em qualquer lista com itens, **When** mantém pressionado um item, **Then** exibe opção "Excluir" no menu de contexto
2. **Given** o usuário desliza um item para a esquerda (swipe), **When** completa o gesto, **Then** exibe botão de exclusão
3. **Given** o usuário confirma exclusão de um item, **When** a ação completa, **Then** o item é removido permanentemente da lista
4. **Given** o modal de edição está aberto (listas de compras), **When** o usuário toca em "Excluir", **Then** o item é removido após confirmação

---

### Edge Cases

- O que acontece quando o usuário digita apenas "@" sem texto adicional?
  - Sistema mostra dropdown com todas as listas disponíveis
- Como o sistema lida com valores monetários em diferentes formatos (R$10, 10,00, 10.00)?
  - Sistema reconhece formatos comuns e normaliza para o padrão da localidade do dispositivo (apenas em listas de compras)
- O que acontece quando o provedor externo (TMDb, Google Books, IGDB) está offline?
  - Sistema mostra mensagem de erro amigável e permite entrada manual
- Como o sistema lida com listas vazias?
  - Exibe estado vazio com ilustração e call-to-action para adicionar primeiro item
- O que acontece quando o usuário tenta criar lista com nome duplicado?
  - Sistema sugere a lista existente em vez de criar duplicata
- Como o sistema lida com itens sem lista associada?
  - Itens sem lista associada permanecem na Inbox sem lista
- O que acontece quando a busca não retorna resultados?
  - Exibe mensagem "Nenhum resultado encontrado" com sugestões de ajuste nos filtros
- O que acontece quando o usuário exclui uma seção com itens?
  - Os itens são movidos para fora da seção (ficam na lista sem seção associada)
- O que acontece ao concluir compra em lista sem itens marcados?
  - Botão "Concluir compra" só aparece quando há pelo menos um item marcado
- O que acontece ao tentar adicionar item do histórico que já existe na lista?
  - Sistema soma a quantidade em vez de duplicar o item
- O que acontece quando nota é criada sem título e sem descrição?
  - Sistema usa timestamp de criação como título
- O que acontece quando IA está indisponível para gerar título de nota?
  - Sistema usa timestamp de criação ou "Sem título" como fallback
- O que acontece quando usuário tenta editar ou excluir a lista de Notas pré-fabricada?
  - Sistema não permite - lista de Notas tem nome fixo e não pode ser excluída

## Requisitos *(obrigatório)*

### Requisitos Funcionais

#### Entrada Inteligente
- **FR-001**: Sistema MUST parsear texto de entrada e extrair: título, lista destino (@), quantidade e valor monetário (somente para listas de compras)
- **FR-002**: Sistema MUST exibir dropdown de sugestões ao digitar "@" com listas existentes filtradas
- **FR-003**: Sistema MUST permitir criar nova lista inline quando o texto após "@" não corresponde a nenhuma lista existente
- **FR-003a**: Ao criar lista inline, sistema MUST usar IA para inferir categoria baseado no conteúdo (R$=Compras, título de mídia=Interesse, texto genérico=Notas)
- **FR-003b**: Quando inferência tem baixa confiança, sistema MUST exibir mini-seletor de categoria (Notas/Compras/Interesse) antes de criar
- **FR-004**: Sistema MUST reconhecer padrões de valor monetário (R$X, X,XX, X.XX) e extrair para campo de valor SOMENTE quando lista destino é do tipo compras
- **FR-005**: Itens sem lista especificada MUST permanecer na Inbox sem lista associada (tipo = nota simples)
- **FR-005a**: Campo de entrada MUST exibir inline highlighting em tempo real (texto colorido: @lista, R$valor, quantidade)
- **FR-005b**: Campo de entrada MUST exibir preview compacto abaixo do campo com chips/badges dos elementos extraídos

#### Listas e Organização
- **FR-006**: Sistema MUST suportar três categorias: Notas (lista única pré-fabricada), Compras (múltiplas listas customizáveis) e Interesse (múltiplas listas customizáveis)
- **FR-006a**: Lista de Notas é pré-fabricada, única e com nome fixo "Notas" - usuário NÃO pode criar, renomear ou excluir esta lista nem criar listas de notas adicionais
- **FR-007**: Sistema MUST permitir criar, renomear e excluir listas de Compras e Interesse (não Notas)
- **FR-008**: Listas de Interesse MUST suportar três subtipos: Filmes, Livros e Games
- **FR-009**: Sistema MUST persistir ordem customizada de itens em listas de compras e notas via drag and drop
- **FR-010**: Ao excluir lista, sistema MUST oferecer opção de mover itens para Inbox ou excluir junto

#### Seções
- **FR-011**: Sistema MUST permitir criar seções customizadas dentro de qualquer lista
- **FR-012**: Sistema MUST permitir renomear e excluir seções
- **FR-013**: Sistema MUST permitir arrastar itens entre seções dentro da mesma lista
- **FR-014**: Sistema MUST permitir reordenar seções via drag and drop
- **FR-015**: Ao excluir seção, sistema MUST mover itens para fora da seção (permanecem na lista)
- **FR-016**: Itens sem seção MUST aparecer no topo da lista, antes das seções definidas
- **FR-016a**: Cada seção MUST exibir botão "Adicionar nessa seção" que abre modal de entrada com `@Lista:Seção` já preenchido

#### Listas de Compras
- **FR-017**: Itens de lista de compras MUST ter campos: título, quantidade, valor
- **FR-018**: Sistema MUST calcular e exibir soma total dos valores de itens marcados em barra inferior
- **FR-019**: Sistema MUST atualizar total em tempo real quando item é marcado/desmarcado
- **FR-019a**: Barra de total MUST exibir indicador "(X itens sem valor)" quando existirem itens marcados sem valor definido
- **FR-020**: Sistema MUST exibir badges visuais para quantidade e valor extraídos automaticamente
- **FR-020a**: Sistema MUST exibir botão "Concluir compra" em listas de compras com pelo menos um item marcado
- **FR-020b**: Ao concluir compra, sistema MUST criar registro no histórico com snapshot da lista (itens, quantidades, valores, total, data)
- **FR-020c**: Ao concluir compra, sistema MUST resetar marcações de todos os itens (lista volta ao estado "não comprado")
- **FR-020d**: Lista original MUST permanecer ativa após conclusão para reutilização em próximas compras
- **FR-020e**: Sistema MUST exibir botão "Ver histórico" em cada lista de compras
- **FR-020f**: Tela de histórico MUST exibir lista de compras concluídas daquela lista específica, ordenadas por data (mais recente primeiro)
- **FR-020g**: Tela de detalhes do histórico MUST exibir botão "Comprar tudo novamente" que adiciona todos os itens à lista
- **FR-020h**: Ao adicionar item que já existe na lista, sistema MUST somar quantidade em vez de duplicar
- **FR-020i**: Tela de detalhes do histórico MUST permitir selecionar itens individuais para adicionar à lista
- **FR-020j**: Sistema MUST indicar visualmente quais itens do histórico já existem na lista atual
- **FR-020k**: Ao tocar em item existente, sistema MUST abrir modal inteligente de edição (sheet sobre a lista)
- **FR-020l**: Modal de edição MUST pré-preencher campo com dados atuais do item em formato de entrada inteligente (ex: "Leite 2L R$8,50")
- **FR-020m**: Modal de edição MUST aplicar mesmo parsing de quantidade/valor ao salvar alterações

#### Listas de Notas
- **FR-021**: Itens de lista de notas MUST ter campos: título, descrição
- **FR-022**: Sistema MUST suportar markdown na descrição: negrito, itálico, listas (bulleted/numbered), headers (h1-h3) e links clicáveis
- **FR-023**: Sistema MUST permitir reordenação de itens via drag and drop
- **FR-023a**: Sistema MUST permitir criar nota sem título explícito
- **FR-023b**: Quando nota não tem título, sistema SHOULD gerar título automaticamente via IA baseado no conteúdo da descrição
- **FR-023c**: Fallback quando IA indisponível ou descrição vazia: exibir timestamp de criação ou "Sem título"

#### Listas de Interesse
- **FR-024**: Listas de Filmes MUST integrar com TMDb para busca e enriquecimento de dados
- **FR-025**: Listas de Livros MUST integrar com Google Books para busca e enriquecimento de dados
- **FR-026**: Listas de Games MUST integrar com IGDB para busca e enriquecimento de dados
- **FR-027**: Sistema MUST permitir marcar itens de interesse como "consumido" (visto/lido/jogado)
- **FR-028**: Sistema MUST preencher automaticamente: título, descrição/sinopse, capa/poster, avaliação, e metadados específicos (elenco/autor/desenvolvedor)
- **FR-028a**: Ao detectar lista de interesse no campo de entrada, sistema MUST exibir dropdown inline com resultados do provedor externo enquanto usuário digita
- **FR-028b**: Sistema MUST permitir criação manual (sem seleção do provedor) para casos onde item não é encontrado

#### Inbox e Navegação
- **FR-029**: Inbox MUST exibir todos os itens de todas as categorias em scroll infinito com paginação
- **FR-030**: Sistema MUST permitir agrupar itens por: data de criação, data de atualização ou lista
- **FR-031**: Sistema MUST permitir ordenar itens de forma ascendente ou descendente
- **FR-032**: Bottombar MUST permitir navegação entre Inbox, Buscar, Notas e Listas
- **FR-033**: Bottombar MUST destacar visualmente a aba ativa
- **FR-034**: Sistema MUST preservar estado da tela ao navegar entre abas
- **FR-035**: Bottombar MUST exibir botão central "Adicionar" que abre modal/sheet com entrada inteligente e comportamento contextual: Inbox=neutro, Notas=pré-seleciona lista de Notas única, Lista específica=pré-seleciona lista atual. NÃO existe campo de entrada inline nas telas de lista
- **FR-035a**: Modal de entrada MUST permanecer aberto após criar item, permitindo criação contínua até usuário fechar manualmente
- **FR-035b**: Na tela de gerenciamento de listas, botão Adicionar MUST permitir criar listas e seções usando sintaxe `@Lista` (lista) e `:Seção` ou `@Lista:Seção` (seção). Dois-pontos é o separador de seção
- **FR-036**: Navbar MUST fornecer acesso a configurações via ícone de perfil (esquerda)

#### Busca
- **FR-037**: Tela Buscar MUST exibir campo auto-focado, filtros visíveis e histórico de buscas recentes
- **FR-037a**: Busca em itens locais MUST executar em tempo real a cada caractere digitado (filtro instantâneo)
- **FR-037b**: Busca em provedores externos (TMDb, Google Books, IGDB) MUST usar debounce de 300-500ms após parar de digitar
- **FR-037c**: Histórico MUST armazenar até 10 buscas recentes, exibidas em ordem cronológica reversa
- **FR-037d**: Sistema MUST permitir limpar buscas individualmente (swipe ou ícone X) ou todas de uma vez (botão "Limpar histórico")
- **FR-037e**: Estado inicial (campo vazio) MUST exibir: histórico de buscas recentes + atalhos para 3-5 listas mais acessadas pelo usuário
- **FR-037f**: Filtros MUST estar colapsados por padrão, expandindo ao toque do usuário
- **FR-038**: Sistema MUST buscar em título e descrição de todos os itens
- **FR-039**: Sistema MUST filtrar resultados por tipo (notas, listas ou ambos)
- **FR-040**: Sistema MUST filtrar resultados por período (última semana, mês, ano, todo o período)
- **FR-041**: Sistema MUST filtrar resultados por lista selecionada
- **FR-042**: Resultados MUST ser paginados e cada item clicável para navegação
- **FR-042a**: Resultados MUST ser ordenados por relevância (match em título tem peso maior que descrição), com data decrescente como critério secundário
- **FR-042b**: Resultados MUST destacar visualmente o termo buscado (highlight com cor/negrito) no título e descrição

#### Detalhes e Edição
- **FR-043**: Sistema MUST exibir tela de detalhes com título, descrição e lista associada (se houver)
- **FR-044**: Sistema MUST suportar edição inline de todos os campos
- **FR-045**: Sistema MUST permitir alterar lista associada de um item existente
- **FR-046**: Tela de detalhes de nota MUST abrir em modo visualização (markdown renderizado) por padrão, com toque explícito para entrar em modo edição

#### Configurações
- **FR-047**: Sistema MUST permitir selecionar tema: claro, escuro ou automático
- **FR-048**: Sistema MUST permitir personalizar cor principal de destaque
- **FR-049**: Sistema MUST exibir informações sobre o aplicativo, termos e política de privacidade
- **FR-050**: Tela de configurações MUST exibir perfil do usuário (foto, nome, email) no topo

#### Telas Notas e Listas
- **FR-051**: Tela Notas MUST exibir itens da lista de Notas única (pré-fabricada)
- **FR-052**: Tela Notas MUST permitir configurar agrupamento (por seção ou data) e ordenação (asc/desc) dos itens
- **FR-052a**: Quando agrupado por seção, itens sem seção MUST aparecer em grupo "Sem seção" no topo, acima das seções definidas
- **FR-053**: Tela Listas MUST exibir listas ativas agrupadas por TIPO (categoria) com dropdown expansível

### Entidades-chave

- **Item**: Unidade básica de informação. Possui título, descrição opcional, data de criação, data de atualização, lista associada (opcional - itens sem lista ficam na Inbox), seção associada (opcional - itens podem ficar "soltos" na lista), ordem na lista/seção, e campos específicos por tipo (valor, quantidade para compras; status consumido para interesse; metadados de mídia para interesse)
- **Lista**: Agrupador de itens por contexto. Possui nome, categoria (notes, shopping, interest), subtipo para interest (movies, books, games), data de criação, ordem dos itens. Nota: categoria "notes" possui apenas UMA lista pré-fabricada; categorias "shopping" e "interest" permitem múltiplas listas customizáveis
- **Seção**: Agrupador visual de itens dentro de uma lista específica. Possui nome, ordem na lista, lista pai (obrigatória). Cada lista tem suas próprias seções independentes. Relaciona-se com uma lista (muitos-para-um) e com múltiplos itens (um-para-muitos)
- **Usuário**: Perfil do usuário local. Possui nome, email, foto. Configurações de tema e cor principal
- **HistóricoCompra**: Registro de compra concluída. Possui lista de origem (referência), data da compra, snapshot dos itens (título, quantidade, valor, marcado), total da compra. Permite visualização e reutilização futura

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **SC-001**: Usuários conseguem adicionar um item com lista em menos de 10 segundos usando a entrada inteligente
- **SC-002**: 90% dos itens adicionados via entrada inteligente são parseados corretamente na primeira tentativa
- **SC-003**: Usuários conseguem marcar todos os itens de uma lista de compras com 10 itens em menos de 30 segundos
- **SC-004**: Busca global retorna resultados relevantes em menos de 2 segundos para bases com até 1000 itens
- **SC-005**: Integração com provedores externos (TMDb, Google Books, IGDB) preenche dados automaticamente em 95% das buscas bem-sucedidas
- **SC-006**: Usuários conseguem encontrar um item antigo usando busca com filtros em menos de 15 segundos
- **SC-007**: Scroll infinito carrega próxima página de forma imperceptível (sem loading visível) em conexões normais
- **SC-008**: 80% dos usuários conseguem completar a tarefa de "adicionar item à lista de compras" na primeira tentativa sem ajuda
- **SC-009**: Total da lista de compras atualiza em menos de 100ms após marcar/desmarcar item
- **SC-010**: App abre e exibe Inbox com itens em menos de 3 segundos após toque no ícone
- **SC-011**: Navegação entre abas da bottombar ocorre em menos de 300ms

## Clarifications

### Session 2026-01-18

- Q: Como as seções dentro de uma lista devem funcionar? → A: Seções são agrupadores visuais manuais - usuário cria e nomeia livremente, arrasta itens entre seções
- Q: Tags removidas do sistema? → A: Sim, conceito de tags removido. Organização via listas e seções
- Q: Itens sem lista vão para onde? → A: Permanecem na Inbox sem lista associada (não mais lista de notas padrão)
- Q: Quando extrair valor monetário? → A: Somente quando item é atribuído a lista de compras
- Q: Seções são específicas por lista ou globais? → A: Específicas por lista - cada lista tem suas próprias seções independentes
- Q: Itens podem existir fora de seções? → A: Sim, seções são opcionais. Itens "soltos" aparecem no TOPO da lista, antes das seções
- Q: Quais categorias suportam seções? → A: Todas - Notas, Compras e Interesse podem ter seções customizadas

### Session 2026-01-19

- Q: Comportamento da tela Buscar na Bottom Bar? → A: Campo auto-focado + filtros visíveis + histórico de buscas recentes
- Q: Comportamento do botão central Adicionar? → A: Modal/sheet com campo de entrada inteligente (sem opções de tipo - tipo é inferido pela lista destino)
- Q: Distinção entre telas Notas e Listas? → A: Notas = itens com layout configurável (group + sort); Listas = listas ativas agrupadas por TIPO com dropdown
- Q: Quais itens aparecem na tela Notas? → A: Apenas itens de listas da categoria "Notas"
- Q: Conteúdo da tela Inbox? → A: Todos os itens recentes (todas as categorias) com scroll infinito
- Q: Comportamento contextual do botão Adicionar por tela? → A: Inbox=neutro; Notas=pré-seleciona lista de Notas (única); Lista específica=pré-seleciona lista atual; Tela de gerenciamento de listas=adiciona listas (`@Lista`) e seções (`:Seção` ou `@Lista:Seção`)
- Q: Modal de entrada fecha após criar item? → A: Não, permanece aberto para criação contínua (usuário fecha manualmente)
- Q: Sintaxe para criar seção na lista atual? → A: Usar dois-pontos como separador - `:Seção` (lista atual implícita) ou `@Lista:Seção` (lista explícita). `@Nome` SEMPRE se refere a lista, nunca seção
- Q: Como usuário indica tipo de item (nota/compra/interesse)? → A: Inferido pela categoria da lista destino. Sem lista = nota simples na Inbox
- Q: Feedback visual durante digitação no campo inteligente? → A: Combinação de inline highlighting (texto colorido: @lista azul, R$valor verde) + preview compacto abaixo com chips/badges dos elementos extraídos
- Q: Fluxo de adição para listas de interesse (Filmes/Livros/Games)? → A: Busca inline - dropdown com resultados do provedor externo aparece enquanto digita. Usuário seleciona resultado ou cria manual. Revisão/edição posterior na tela de detalhes
- Q: Fluxo quando usuário digita @ListaInexistente? → A: Inferência inteligente com IA - sistema analisa conteúdo para inferir categoria (R$=Compras, nome de filme=Interesse, etc.). Se incerto, exibe mini-seletor de categoria
- Q: Quantas listas de Notas existem? → A: UMA ÚNICA lista de Notas pré-fabricada. Notas não permite criar listas customizadas (diferente de Compras e Interesse que são múltiplas)
- Q: O que significa "contexto notas" no botão Adicionar? → A: Pré-seleciona a lista de Notas única. Campo já vem com destino definido
- Q: Existem "opções de tipo" no modal do botão Adicionar? → A: NÃO. Modal contém apenas o campo de entrada inteligente. Tipo do item é inferido automaticamente pela categoria da lista destino
- Q: Existe campo de entrada inline dentro de uma lista específica? → A: NÃO. Usuário sempre usa o modal via botão central da bottombar (pré-seleciona lista atual). Porém, cada SEÇÃO tem botão "Adicionar nessa seção" que abre o modal com `@Lista:Seção` já preenchido
- Q: Quando a busca é acionada na tela Buscar? → A: Híbrido - busca local em tempo real (a cada caractere), busca em provedores externos com debounce 300-500ms
- Q: Quantas buscas o histórico armazena e como limpar? → A: 10 buscas recentes, limpar individualmente (swipe/X) ou todas de uma vez
- Q: Estado inicial da tela de busca (campo vazio)? → A: Histórico + atalhos para 3-5 listas mais acessadas, filtros colapsados por padrão
- Q: Ordenação dos resultados de busca? → A: Por relevância (título > descrição), secundário por data decrescente
- Q: Destacar termo buscado nos resultados? → A: Sim, highlight com cor/negrito no título e descrição
- Q: Fluxo de conclusão de lista de compras? → A: Botão "Concluir compra" reseta marcações dos itens e move lista para histórico (registro da compra realizada)
- Q: Como acessar histórico de compras? → A: Botão "Ver histórico" dentro de cada lista de compras, exibindo apenas histórico daquela lista específica
- Q: Como reutilizar itens do histórico? → A: Duas opções: (1) "Comprar tudo novamente" adiciona todos os itens, somando quantidade se já existirem na lista; (2) Seleção individual de itens com indicação visual de quais já existem
- Q: Como editar item de lista de compras? → A: Modal inteligente (sheet sobre a lista) com campo de entrada inteligente pré-preenchido, permitindo edição com mesmo parsing de quantidade/valor
- Q: Como calcular total com itens sem valor? → A: Total exibe soma dos itens com valor + indicador "(X itens sem valor)" para transparência
- Q: Comportamento padrão ao abrir nota na tela de detalhes? → A: Modo visualização primeiro (markdown renderizado), toque explícito para entrar em modo edição
- Q: Quais elementos markdown são suportados nas notas? → A: Básico (negrito, itálico, listas) + headers (h1-h3) + links clicáveis
- Q: Nota pode ser criada sem título? → A: Sim, título é opcional. Sistema usa IA para gerar título baseado no conteúdo da descrição (fallback: timestamp ou "Sem título")
- Q: Exibição de itens sem seção quando agrupado por seção? → A: Grupo "Sem seção" no topo, acima das seções definidas pelo usuário
- Q: Lista de Notas pré-fabricada pode ser renomeada? → A: Não, nome fixo "Notas" (não pode ser renomeada nem excluída)

### Reorganização de User Stories (2026-01-19)

As user stories foram reorganizadas para maximizar reuso de código e componentes:

**Princípios da nova organização:**

1. **Prioridade P0 (Fundação)**: Componentes de navegação e entrada inteligente que são usados em TODAS as outras funcionalidades
2. **Prioridade P1 (Core)**: Funcionalidades principais que dependem da fundação e são mais utilizadas pelos usuários
3. **Prioridade P2 (Importante)**: Funcionalidades que agregam valor significativo mas não são críticas para uso básico
4. **Prioridade P3 (Desejável)**: Personalizações e integrações secundárias

**Mudanças principais:**

- Criada User Story 2.1 (Campo de Entrada Inteligente) como P0 - é o componente mais reutilizado
- Separada navegação (1.1-1.2) como P0 - fundação para todas as telas
- Dividida história de Compras em 5 partes (6.1-6.5) para melhor granularidade
- Adicionadas histórias faltantes: Edição de item (6.3), Conclusão de compra (6.4), Histórico (6.5), Exclusão de itens (10.1)
- Cada história agora lista "Componentes Reutilizáveis" para facilitar planejamento técnico
- Renumerados escopos para refletir ordem de desenvolvimento recomendada

**Mapeamento antigo → novo:**

| Antigo | Novo | Descrição |
|--------|------|-----------|
| 1.3 BottomBar | 1.1 | Promovido para P0 (fundação) |
| 7.3 Perfil | 1.2 | Promovido para P0 (fundação) |
| 1.1 Captura Rápida | 2.3 | Depende do SmartInput (2.1) |
| 1.2 Inbox | 3.1 | Mantém P1, depende de navegação |
| 7.2 Tela Listas | 3.2 | Mantém P1 |
| 7.1 Tela Notas | 3.3 | Mantém P1 |
| 1.4 Busca | 3.4 | Mantém P1 |
| 5.1 Criar Lista | 4.1 | Mantém P1 |
| 5.2 Editar Lista | 4.2 | Mantém P2 |
| 6.1 Seções | 5.1 | Mantém P2 |
| 2.1 Compras | 6.1-6.5 | Dividida em 5 histórias |
| 3.1, 3.2 Notas | 7.1, 7.2 | Mantém P2 |
| 4.1-4.3 Interesse | 8.1-8.3 | Mantém P2-P3 |
| 7.4 Tema | 9.1 | Mantém P3 |
| (novo) | 10.1 | Exclusão de itens (P2) |

## Premissas

- Usuário tem perfil local (sem autenticação cloud no MVP)
- Dados são armazenados localmente no dispositivo
- Provedores externos (TMDb, Google Books, IGDB) requerem conexão com internet
- Formato de moeda segue configuração de localidade do dispositivo
- App suporta português brasileiro (pt-BR) como idioma principal e inglês (en) como fallback
- Itens sem lista associada permanecem visíveis na Inbox
