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
- **Pessoas organizadas** que gostam de categorizar informações com tags e encontrar tudo rapidamente

### Proposta de Valor Única

1. **Entrada Inteligente em Linha Única**: O diferencial principal do Listify é permitir que o usuário digite tudo em uma única linha de texto. Ao escrever "Comprar leite 2L R$8,50 #laticínios @Supermercado", o sistema automaticamente extrai o título, quantidade, valor, tag e lista de destino.

2. **Listas Especializadas com Contexto Rico**: Diferente de apps genéricos de notas, o Listify entende que uma lista de compras precisa de quantidades e valores (com total calculado), enquanto uma lista de filmes se beneficia de sinopses e avaliações vindas de fontes externas.

3. **Organização Flexível**: O sistema de tags permite categorização transversal (uma nota pode ter múltiplas tags), enquanto listas agrupam itens por contexto de uso.

## Versão & Escopo *(obrigatório)*

**Inclui**:

- Tela Inbox com listagem de todos os itens recentes (scroll infinito paginado)
- Campo de entrada inteligente com parsing de texto (#tag, @lista, quantidade, valor)
- Sistema de listas com três categorias: Notas, Compras e Interesse
- Fluxo de criação, edição e exclusão de listas customizadas
- Sistema de tags para categorização transversal
- Listas de Notas com suporte a markdown básico e drag and drop para reordenação
- Listas de Compras com quantidade, valor, total calculado, marcação de itens e drag and drop
- Listas de Interesse (Filmes, Livros, Games) com integração a provedores externos (TMDb, Google Books, IGDB)
- Busca global com filtros por tipo, período e tags
- Sidebar com navegação e perfil do usuário
- Tela de detalhes de notas com visualização e edição
- Configurações de tema (claro, escuro, automático) e cores principais
- Bottombar fixa com navegação entre Inbox, Listas e Notas

**Fora de escopo (Backlog / Próximas versões)**:

- Sincronização em nuvem e múltiplos dispositivos
- Compartilhamento de listas entre usuários
- Notificações e lembretes programados
- Modo offline avançado com sincronização posterior
- Reconhecimento de voz para entrada de itens
- Widgets para home screen
- Exportação de listas (PDF, CSV)
- Histórico de compras e análise de gastos
- Integração com assistentes de voz (Alexa, Google Assistant)
- Autenticação de usuário e contas
- Recursos de IA para sugerir tipo de lista baseado no conteúdo do item

## Cenários do Usuário & Testes *(obrigatório)*

---

## Escopo 1: Inbox e Entrada Inteligente

### User Story 1.1 - Captura Rápida de Item (Priority: P1)

Maria está no ônibus e lembra que precisa comprar leite. Ela abre o Listify, digita "Leite @Mercado #mercearia" e fecha o app. Em 5 segundos, o item já está na lista certa com a tag certa.

**Por que esta prioridade**: Este é o diferencial principal do Listify - a captura ultra-rápida. Sem isso, o app perde sua proposta de valor central.

**Teste Independente**: Pode ser testado criando um item com sintaxe especial (#, @) e verificando se o parsing cria o item na lista correta com as tags corretas.

**Cenários de Aceite**:

1. **Given** o usuário está na tela Inbox, **When** digita "Leite @Mercado #mercearia" e confirma, **Then** o item "Leite" é criado na lista "Mercado" com a tag "mercearia"
2. **Given** o usuário digita "@NovaLista", **When** a lista "NovaLista" não existe, **Then** o sistema sugere criar nova lista
3. **Given** o usuário digita "#novatag", **When** a tag "novatag" não existe, **Then** o sistema sugere criar nova tag
4. **Given** o usuário digita "Leite 2L R$8,50", **When** confirma a entrada, **Then** o sistema extrai quantidade (2L), valor (R$8,50) e título (Leite)
5. **Given** o usuário está digitando "#", **When** continua digitando caracteres, **Then** o sistema mostra dropdown com tags existentes que correspondem ao filtro
6. **Given** o usuário digita "Minha ideia importante" sem @lista, **When** confirma a entrada, **Then** o item é criado automaticamente na lista de notas padrão

---

### User Story 1.2 - Navegação pelo Inbox (Priority: P1)

O usuário abre o app e vê todos os seus itens recentes no Inbox. Pode agrupar por data de criação, atualização, tag ou lista, e ordenar de forma ascendente ou descendente.

**Por que esta prioridade**: O Inbox é a tela principal e ponto de entrada do app. Deve funcionar perfeitamente desde o início.

**Teste Independente**: Pode ser testado com diversos itens criados, alterando agrupamentos e ordenação, verificando se a lista se reorganiza corretamente.

**Cenários de Aceite**:

1. **Given** existem 50 itens no Inbox, **When** o usuário faz scroll até o final, **Then** mais itens são carregados automaticamente (scroll infinito)
2. **Given** o usuário seleciona agrupar por "Tag", **When** a lista atualiza, **Then** os itens são exibidos agrupados por suas tags com headers separadores
3. **Given** o usuário alterna ordenação para "Descendente", **When** está agrupando por data de criação, **Then** os itens mais recentes aparecem primeiro
4. **Given** o Inbox está carregado, **When** o usuário toca no ícone de busca na navbar, **Then** navega para a tela de busca global

---

### User Story 1.3 - Navegação pela BottomBar (Priority: P1)

O usuário navega entre as principais seções do app (Inbox, Notas, Listas) através da barra inferior fixa.

**Por que esta prioridade**: A navegação principal é essencial para a usabilidade básica do app.

**Teste Independente**: Pode ser testado tocando em cada aba da bottombar e verificando se a tela correta é exibida.

**Cenários de Aceite**:

1. **Given** o usuário está no Inbox, **When** toca na aba "Notas" na bottombar, **Then** navega para a tela de listagem de notas
2. **Given** o usuário está na tela de Notas, **When** toca na aba "Listas" na bottombar, **Then** navega para a tela de listagem de listas
3. **Given** o usuário está na tela de Listas, **When** toca na aba "Inbox" na bottombar, **Then** retorna para o Inbox
4. **Given** o usuário está em qualquer tela, **When** observa a bottombar, **Then** a aba atual está destacada visualmente
5. **Given** o usuário navega entre abas, **When** retorna a uma aba visitada anteriormente, **Then** o estado da tela é preservado (posição do scroll, filtros aplicados)

---

### User Story 1.4 - Busca Global com Filtros (Priority: P2)

Pedro lembra que anotou uma ideia há meses, mas não lembra onde. Ele usa a busca global, filtra por tags e período, e encontra a nota em segundos.

**Por que esta prioridade**: Busca é essencial para recuperar informações, mas o app pode ser usado sem ela inicialmente.

**Teste Independente**: Pode ser testado criando itens diversos, usando busca com diferentes filtros, verificando resultados corretos.

**Cenários de Aceite**:

1. **Given** existem 100 itens no app, **When** o usuário busca por "compras", **Then** apenas itens contendo "compras" no título ou descrição são exibidos
2. **Given** o usuário aplica filtro "última semana", **When** a busca executa, **Then** apenas itens criados nos últimos 7 dias aparecem
3. **Given** o usuário seleciona filtro por tag "#trabalho", **When** a busca executa, **Then** apenas itens com essa tag são exibidos
4. **Given** o usuário combina múltiplos filtros (tipo + período + tag), **When** a busca executa, **Then** apenas itens que atendem TODOS os critérios aparecem
5. **Given** resultados são exibidos, **When** o usuário toca em um resultado, **Then** navega para a tela de detalhes do item

---

## Escopo 2: Listas de Compras

### User Story 2.1 - Lista de Compras no Supermercado (Priority: P1)

João abre sua lista "Supermercado" e vê todos os itens organizados. Conforme pega os itens, marca cada um como comprado e vê o total atualizado em tempo real na barra inferior.

**Por que esta prioridade**: Listas de compras são o caso de uso mais frequente e demonstram o valor imediato do app.

**Teste Independente**: Pode ser testado criando uma lista de compras, adicionando itens com valores, marcando itens e verificando o total.

**Cenários de Aceite**:

1. **Given** o usuário está em uma lista de compras com itens, **When** marca um item como comprado, **Then** o item exibe indicação visual de marcado e o total na barra inferior é atualizado
2. **Given** uma lista de compras com 3 itens (R$10, R$20, R$30), **When** o usuário marca todos, **Then** a barra mostra total de R$60,00
3. **Given** o usuário está em uma lista de compras, **When** arrasta um item para cima ou baixo, **Then** o item é reordenado e a nova ordem é persistida
4. **Given** o usuário adiciona "Pão R$5,00 #padaria", **When** confirma, **Then** o item mostra badges com valor e tag extraídos

---

## Escopo 3: Listas de Notas

### User Story 3.1 - Criar e Organizar Notas (Priority: P2)

O usuário quer criar notas para suas ideias e organizá-las em uma ordem específica que faça sentido para seu fluxo de trabalho.

**Por que esta prioridade**: Notas são um caso de uso frequente, mas menos crítico que compras no MVP.

**Teste Independente**: Pode ser testado criando uma lista de notas, adicionando itens, reordenando via drag and drop.

**Cenários de Aceite**:

1. **Given** o usuário está em uma lista de notas, **When** adiciona "Ideia para projeto #trabalho", **Then** o item é criado com título e tag
2. **Given** o usuário está em uma lista de notas com 5 itens, **When** arrasta um item para nova posição, **Then** o item é reordenado e a nova ordem é persistida
3. **Given** o usuário abre uma nota, **When** adiciona descrição com markdown "**Importante**: fazer até sexta", **Then** "Importante" aparece em negrito

---

### User Story 3.2 - Tela de Detalhes da Nota (Priority: P2)

O usuário quer visualizar uma nota completa com todas as suas informações e poder editar qualquer campo diretamente.

**Por que esta prioridade**: A visualização e edição de notas é fundamental para o uso completo do recurso de notas.

**Teste Independente**: Pode ser testado abrindo uma nota existente, visualizando todos os campos, editando e verificando persistência.

**Cenários de Aceite**:

1. **Given** o usuário toca em uma nota na lista, **When** a tela de detalhes abre, **Then** exibe título, descrição formatada, tags associadas e lista de origem
2. **Given** o usuário está na tela de detalhes, **When** toca no título, **Then** pode editar inline e salvar
3. **Given** o usuário está na tela de detalhes, **When** toca na descrição, **Then** abre editor com suporte a markdown
4. **Given** o usuário edita a descrição com "**Negrito** e _itálico_", **When** salva e visualiza, **Then** a formatação é renderizada corretamente
5. **Given** o usuário está na tela de detalhes, **When** toca no botão de adicionar tag, **Then** exibe dropdown com tags existentes e opção de criar nova
6. **Given** o usuário remove uma tag da nota, **When** salva, **Then** a tag é desassociada do item
7. **Given** o usuário altera a lista associada da nota, **When** salva, **Then** a nota aparece na nova lista e some da anterior

---

## Escopo 4: Listas de Interesse (Filmes, Livros, Games)

### User Story 4.1 - Adicionar Filme com Enriquecimento Automático (Priority: P2)

Um amigo recomenda um filme para Ana. Ela abre o Listify, vai na lista "Filmes para Ver", busca o título e o sistema automaticamente puxa a sinopse, elenco e avaliação do TMDb. Quando ela assistir, marca como "visto" com um toque.

**Por que esta prioridade**: Listas de interesse diferenciam o Listify de apps genéricos, mas dependem de infraestrutura básica funcionando.

**Teste Independente**: Pode ser testado buscando um filme conhecido, verificando se dados são preenchidos automaticamente, e marcando como visto.

**Cenários de Aceite**:

1. **Given** o usuário está em uma lista de Filmes, **When** busca "Matrix", **Then** o sistema exibe resultados do provedor externo com poster, título, ano e sinopse
2. **Given** o usuário seleciona um filme da busca, **When** confirma adição, **Then** o item é criado com dados enriquecidos (sinopse, elenco, avaliação, capa)
3. **Given** um filme existe na lista, **When** o usuário toca para marcar como visto, **Then** o status muda e exibe indicação visual diferenciada
4. **Given** o provedor externo está indisponível, **When** o usuário busca um filme, **Then** o sistema mostra mensagem apropriada e permite adicionar manualmente

---

### User Story 4.2 - Adicionar Livro com Busca Integrada (Priority: P3)

O usuário quer adicionar um livro à sua lista de leitura buscando pelo título e obtendo informações automáticas do Google Books.

**Por que esta prioridade**: Similar a filmes, mas com menor frequência de uso baseado no público-alvo.

**Teste Independente**: Pode ser testado buscando um livro conhecido, selecionando da lista, verificando dados preenchidos.

**Cenários de Aceite**:

1. **Given** o usuário está em uma lista de Livros, **When** busca "O Senhor dos Anéis", **Then** exibe resultados com capa, título, autor e descrição
2. **Given** o usuário seleciona um livro da busca, **When** confirma, **Then** o item é criado com autor, editora, sinopse e capa
3. **Given** o usuário marca um livro como "lido", **When** visualiza a lista, **Then** o livro aparece com indicação visual de status completo

---

### User Story 4.3 - Adicionar Game com Busca Integrada (Priority: P3)

O usuário quer adicionar um jogo à sua lista de games buscando pelo título e obtendo informações automáticas do IGDB.

**Por que esta prioridade**: Games são o terceiro subtipo de interesse, com frequência similar a livros.

**Teste Independente**: Pode ser testado buscando um game conhecido, selecionando da lista, verificando dados preenchidos.

**Cenários de Aceite**:

1. **Given** o usuário está em uma lista de Games, **When** busca "The Witcher 3", **Then** exibe resultados com capa, título, desenvolvedor e descrição
2. **Given** o usuário seleciona um game da busca, **When** confirma, **Then** o item é criado com desenvolvedor, plataformas, sinopse e capa
3. **Given** o usuário marca um game como "jogado", **When** visualiza a lista, **Then** o game aparece com indicação visual de status completo

---

## Escopo 5: Gerenciamento de Listas

### User Story 5.1 - Criar Lista Customizada (Priority: P1)

O usuário quer criar uma nova lista para organizar um tipo específico de conteúdo, escolhendo a categoria apropriada.

**Por que esta prioridade**: Criar listas é fundamental para a organização do app e necessário antes de poder adicionar itens a listas específicas.

**Teste Independente**: Pode ser testado acessando a tela de listas, criando uma nova lista com nome e categoria, verificando se aparece na listagem.

**Cenários de Aceite**:

1. **Given** o usuário está na tela de Listas, **When** toca no botão "Nova Lista", **Then** abre formulário para criação de lista
2. **Given** o formulário de nova lista está aberto, **When** o usuário digita nome "Compras do Mês" e seleciona categoria "Compras", **Then** a lista é criada com as configurações corretas
3. **Given** o usuário cria lista de categoria "Interesse", **When** seleciona o subtipo "Filmes", **Then** a lista é criada com comportamento de lista de filmes
4. **Given** o usuário tenta criar lista com nome já existente, **When** confirma, **Then** o sistema exibe mensagem de erro e não cria duplicata
5. **Given** a lista foi criada, **When** o usuário volta para tela de Listas, **Then** a nova lista aparece na listagem ordenada alfabeticamente

---

### User Story 5.2 - Editar e Excluir Lista (Priority: P2)

O usuário quer renomear uma lista existente ou excluí-la quando não for mais necessária.

**Por que esta prioridade**: Gerenciamento de listas é importante, mas pode vir após a criação básica.

**Teste Independente**: Pode ser testado editando nome de uma lista, excluindo outra, verificando se itens são tratados corretamente.

**Cenários de Aceite**:

1. **Given** o usuário está na tela de Listas, **When** mantém pressionada uma lista, **Then** exibe opções de "Editar" e "Excluir"
2. **Given** o usuário seleciona "Editar" em uma lista, **When** altera o nome para "Novo Nome", **Then** a lista é renomeada e mantém seus itens
3. **Given** o usuário seleciona "Excluir" em uma lista com itens, **When** confirma a exclusão, **Then** o sistema pergunta o que fazer com os itens
4. **Given** o usuário escolhe "Mover para Notas" ao excluir lista, **When** confirma, **Then** os itens são movidos para lista de notas padrão e a lista original é excluída
5. **Given** o usuário escolhe "Excluir tudo" ao excluir lista, **When** confirma, **Then** a lista e todos seus itens são excluídos permanentemente

---

## Escopo 6: Tags e Organização

### User Story 6.1 - Gerenciamento de Tags (Priority: P2)

O usuário quer organizar suas tags, renomeando algumas e excluindo outras não utilizadas.

**Por que esta prioridade**: Tags são fundamentais para organização, mas o gerenciamento avançado pode vir após a funcionalidade básica.

**Teste Independente**: Pode ser testado acessando tela de tags, renomeando uma tag, excluindo outra, verificando se itens associados são atualizados.

**Cenários de Aceite**:

1. **Given** o usuário acessa "Minhas Tags" via sidebar, **When** a tela carrega, **Then** lista todas as tags com contagem de itens associados
2. **Given** uma tag "comida" existe com 5 itens, **When** o usuário renomeia para "alimentação", **Then** todos os 5 itens passam a ter a tag "alimentação"
3. **Given** o usuário tenta excluir uma tag com itens associados, **When** confirma exclusão, **Then** a tag é removida dos itens (itens permanecem, só perdem a tag)

---

## Escopo 7: Navegação e Configurações

### User Story 7.1 - Navegação pela Sidebar (Priority: P3)

O usuário quer acessar rapidamente diferentes seções do app através do menu lateral.

**Por que esta prioridade**: A sidebar é conveniência, mas a navegação principal via bottombar já atende as necessidades básicas.

**Teste Independente**: Pode ser testado abrindo sidebar, navegando para cada seção, verificando se a tela correta é exibida.

**Cenários de Aceite**:

1. **Given** o usuário toca no ícone de menu na navbar, **When** a sidebar abre, **Then** exibe perfil do usuário (foto, nome, email) no topo
2. **Given** a sidebar está aberta, **When** o usuário toca em "Minhas Listas", **Then** navega para a tela de listas
3. **Given** a sidebar está aberta, **When** o usuário toca em "Configurações", **Then** navega para a tela de configurações
4. **Given** o usuário desliza para a esquerda na sidebar, **When** completa o gesto, **Then** a sidebar fecha

---

### User Story 7.2 - Configuração de Tema (Priority: P3)

O usuário prefere usar o app no modo escuro e quer personalizar a cor de destaque.

**Por que esta prioridade**: Personalização visual é desejável mas não essencial para a funcionalidade core.

**Teste Independente**: Pode ser testado alterando tema, verificando mudança visual imediata, alterando cor principal, verificando aplicação.

**Cenários de Aceite**:

1. **Given** o usuário acessa Configurações, **When** seleciona "Tema Escuro", **Then** todo o app muda para o esquema de cores escuro imediatamente
2. **Given** o usuário seleciona "Tema Automático", **When** o sistema operacional está em modo escuro, **Then** o app segue o modo do sistema
3. **Given** o usuário seleciona uma cor principal diferente, **When** aplica, **Then** elementos de destaque (botões, links, ícones ativos) mudam para a nova cor

---

### Edge Cases

- O que acontece quando o usuário digita apenas "#" ou "@" sem texto adicional?
  - Sistema mostra dropdown com todas as tags/listas disponíveis
- Como o sistema lida com valores monetários em diferentes formatos (R$10, 10,00, 10.00)?
  - Sistema reconhece formatos comuns e normaliza para o padrão da localidade do dispositivo
- O que acontece quando o provedor externo (TMDb, Google Books, IGDB) está offline?
  - Sistema mostra mensagem de erro amigável e permite entrada manual
- Como o sistema lida com listas vazias?
  - Exibe estado vazio com ilustração e call-to-action para adicionar primeiro item
- O que acontece quando o usuário tenta criar tag/lista com nome duplicado?
  - Sistema sugere a tag/lista existente em vez de criar duplicata
- Como o sistema lida com itens sem lista associada?
  - Itens sem lista associada são automaticamente adicionados à lista de notas padrão
- O que acontece quando a busca não retorna resultados?
  - Exibe mensagem "Nenhum resultado encontrado" com sugestões de ajuste nos filtros

## Requisitos *(obrigatório)*

### Requisitos Funcionais

#### Entrada Inteligente
- **FR-001**: Sistema MUST parsear texto de entrada e extrair: título, tags (#), lista destino (@), quantidade e valor monetário
- **FR-002**: Sistema MUST exibir dropdown de sugestões ao digitar "#" com tags existentes filtradas
- **FR-003**: Sistema MUST exibir dropdown de sugestões ao digitar "@" com listas existentes filtradas
- **FR-004**: Sistema MUST permitir criar nova tag inline quando o texto após "#" não corresponde a nenhuma tag existente
- **FR-005**: Sistema MUST permitir criar nova lista inline quando o texto após "@" não corresponde a nenhuma lista existente
- **FR-006**: Sistema MUST reconhecer padrões de valor monetário (R$X, X,XX, X.XX) e extrair para campo de valor
- **FR-007**: Sistema MUST associar itens sem lista especificada automaticamente à lista de notas padrão

#### Listas e Organização
- **FR-008**: Sistema MUST suportar três categorias de listas: Notas, Compras e Interesse
- **FR-009**: Sistema MUST permitir criar, renomear e excluir listas
- **FR-010**: Listas de Interesse MUST suportar três subtipos: Filmes, Livros e Games
- **FR-011**: Sistema MUST permitir associar múltiplas tags a um único item
- **FR-012**: Sistema MUST persistir ordem customizada de itens em listas de compras e notas via drag and drop
- **FR-013**: Ao excluir lista, sistema MUST oferecer opção de mover itens para notas ou excluir junto

#### Listas de Compras
- **FR-014**: Itens de lista de compras MUST ter campos: título, quantidade, valor, tags
- **FR-015**: Sistema MUST calcular e exibir soma total dos valores de itens marcados em barra inferior
- **FR-016**: Sistema MUST atualizar total em tempo real quando item é marcado/desmarcado
- **FR-017**: Sistema MUST exibir badges visuais para quantidade e valor extraídos automaticamente

#### Listas de Notas
- **FR-018**: Itens de lista de notas MUST ter campos: título, descrição, tags
- **FR-019**: Sistema MUST suportar markdown básico (negrito, itálico, listas) na descrição
- **FR-020**: Sistema MUST permitir reordenação de itens via drag and drop
- **FR-021**: Sistema MUST manter uma lista de notas padrão que não pode ser excluída

#### Listas de Interesse
- **FR-022**: Listas de Filmes MUST integrar com TMDb para busca e enriquecimento de dados
- **FR-023**: Listas de Livros MUST integrar com Google Books para busca e enriquecimento de dados
- **FR-024**: Listas de Games MUST integrar com IGDB para busca e enriquecimento de dados
- **FR-025**: Sistema MUST permitir marcar itens de interesse como "consumido" (visto/lido/jogado)
- **FR-026**: Sistema MUST preencher automaticamente: título, descrição/sinopse, capa/poster, avaliação, e metadados específicos (elenco/autor/desenvolvedor)

#### Inbox e Navegação
- **FR-027**: Inbox MUST exibir todos os itens em scroll infinito com paginação
- **FR-028**: Sistema MUST permitir agrupar itens por: data de criação, data de atualização, tag ou lista
- **FR-029**: Sistema MUST permitir ordenar itens de forma ascendente ou descendente
- **FR-030**: Bottombar MUST permitir navegação entre Inbox, Listas e Notas
- **FR-031**: Bottombar MUST destacar visualmente a aba ativa
- **FR-032**: Sistema MUST preservar estado da tela ao navegar entre abas
- **FR-033**: Navbar MUST fornecer acesso a perfil, busca global e sidebar

#### Busca
- **FR-034**: Sistema MUST buscar em título e descrição de todos os itens
- **FR-035**: Sistema MUST filtrar resultados por tipo (notas, listas ou ambos)
- **FR-036**: Sistema MUST filtrar resultados por período (última semana, mês, ano, todo o período)
- **FR-037**: Sistema MUST filtrar resultados por tags selecionadas
- **FR-038**: Resultados MUST ser paginados e cada item clicável para navegação

#### Tags
- **FR-039**: Sistema MUST permitir criar, renomear e excluir tags
- **FR-040**: Sistema MUST exibir contagem de itens associados a cada tag
- **FR-041**: Ao renomear tag, sistema MUST atualizar todos os itens associados
- **FR-042**: Ao excluir tag, sistema MUST remover a associação dos itens (itens permanecem)

#### Detalhes e Edição
- **FR-043**: Sistema MUST exibir tela de detalhes com título, descrição, tags e lista associada
- **FR-044**: Sistema MUST suportar edição inline de todos os campos
- **FR-045**: Sistema MUST permitir alterar lista associada de um item existente
- **FR-046**: Tela de detalhes de nota MUST renderizar markdown na visualização e suportar no editor

#### Configurações
- **FR-047**: Sistema MUST permitir selecionar tema: claro, escuro ou automático
- **FR-048**: Sistema MUST permitir personalizar cor principal de destaque
- **FR-049**: Sistema MUST exibir informações sobre o aplicativo, termos e política de privacidade

#### Sidebar
- **FR-050**: Sidebar MUST exibir perfil do usuário (foto, nome, email)
- **FR-051**: Sidebar MUST fornecer navegação para: Inbox, Listas, Minhas Tags, Minhas Notas
- **FR-052**: Sidebar MUST fornecer acesso a Configurações e Ajuda

### Entidades-chave

- **Item**: Unidade básica de informação. Possui título, descrição opcional, data de criação, data de atualização, lista associada (obrigatória - padrão: lista de notas), tags (múltiplas), ordem na lista, e campos específicos por tipo (valor, quantidade para compras; status consumido para interesse; metadados de mídia para interesse)
- **Lista**: Agrupador de itens por contexto. Possui nome, categoria (notes, shopping, interest), subtipo para interest (movies, books, games), data de criação, ordem dos itens, flag de lista padrão (para notas)
- **Tag**: Etiqueta para categorização transversal. Possui nome e cor opcional. Relaciona-se com múltiplos itens (muitos-para-muitos)
- **Usuário**: Perfil do usuário local. Possui nome, email, foto. Configurações de tema e cor principal

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **SC-001**: Usuários conseguem adicionar um item com lista e tag em menos de 10 segundos usando a entrada inteligente
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

## Premissas

- Usuário tem perfil local (sem autenticação cloud no MVP)
- Dados são armazenados localmente no dispositivo
- Provedores externos (TMDb, Google Books, IGDB) requerem conexão com internet
- Formato de moeda segue configuração de localidade do dispositivo
- App suporta português brasileiro (pt-BR) como idioma principal e inglês (en) como fallback
- Existe uma lista de notas padrão criada automaticamente que não pode ser excluída
