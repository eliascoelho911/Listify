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
- Tela Notas com itens de listas categoria "Notas" e configuração de layout (agrupamento e ordenação)
- Tela Listas com listas ativas agrupadas por TIPO (categoria) com dropdown expansível
- Botão central Adicionar que abre modal/sheet com campo de entrada inteligente e opções de tipo
- Campo de entrada inteligente com parsing de texto (@lista, quantidade, valor)
- Sistema de listas com três categorias: Notas, Compras e Interesse
- Fluxo de criação, edição e exclusão de listas customizadas
- Seções customizadas dentro de cada lista para organização visual de itens
- Listas de Notas com suporte a markdown básico e drag and drop para reordenação
- Listas de Compras com quantidade, valor, total calculado, marcação de itens e drag and drop
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
- Histórico de compras e análise de gastos
- Integração com assistentes de voz (Alexa, Google Assistant)
- Autenticação de usuário e contas
- Recursos de IA para sugerir tipo de lista baseado no conteúdo do item

## Cenários do Usuário & Testes *(obrigatório)*

---

## Escopo 1: Inbox e Entrada Inteligente

### User Story 1.1 - Captura Rápida de Item (Priority: P1)

Maria está no ônibus e lembra que precisa comprar leite. Ela abre o Listify, digita "Leite @Mercado" e fecha o app. Em 5 segundos, o item já está na lista certa.

**Por que esta prioridade**: Este é o diferencial principal do Listify - a captura ultra-rápida. Sem isso, o app perde sua proposta de valor central.

**Teste Independente**: Pode ser testado criando um item com sintaxe especial (@) e verificando se o parsing cria o item na lista correta.

**Cenários de Aceite**:

1. **Given** o usuário está na tela Inbox, **When** digita "Leite @Mercado" e confirma, **Then** o item "Leite" é criado na lista "Mercado"
2. **Given** o usuário digita "@NovaLista", **When** a lista "NovaLista" não existe, **Then** o sistema sugere criar nova lista
3. **Given** o usuário digita "Leite 2L R$8,50 @Mercado" (lista de compras), **When** confirma a entrada, **Then** o sistema extrai quantidade (2L), valor (R$8,50) e título (Leite)
4. **Given** o usuário digita "Leite 2L R$8,50" sem lista de compras, **When** confirma a entrada, **Then** o sistema NÃO extrai valor (texto permanece como parte do título)
5. **Given** o usuário digita "Minha ideia importante" sem @lista, **When** confirma a entrada, **Then** o item é criado sem lista associada e aparece na Inbox

---

### User Story 1.2 - Navegação pelo Inbox (Priority: P1)

O usuário abre o app e vê todos os seus itens recentes no Inbox. Pode agrupar por data de criação, atualização ou lista, e ordenar de forma ascendente ou descendente.

**Por que esta prioridade**: O Inbox é a tela principal e ponto de entrada do app. Deve funcionar perfeitamente desde o início.

**Teste Independente**: Pode ser testado com diversos itens criados, alterando agrupamentos e ordenação, verificando se a lista se reorganiza corretamente.

**Cenários de Aceite**:

1. **Given** existem 50 itens no Inbox, **When** o usuário faz scroll até o final, **Then** mais itens são carregados automaticamente (scroll infinito)
2. **Given** o usuário seleciona agrupar por "Lista", **When** a lista atualiza, **Then** os itens são exibidos agrupados por suas listas com headers separadores (itens sem lista aparecem em grupo "Sem lista")
3. **Given** o usuário alterna ordenação para "Descendente", **When** está agrupando por data de criação, **Then** os itens mais recentes aparecem primeiro
4. **Given** o Inbox exibe itens de todas as categorias, **When** o usuário visualiza a lista, **Then** vê itens de Notas, Compras e Interesse misturados ordenados por data

---

### User Story 1.3 - Navegação pela BottomBar (Priority: P1)

O usuário navega entre as principais seções do app (Inbox, Buscar, Notas, Listas) através da barra inferior fixa, com botão central para adicionar itens rapidamente.

**Por que esta prioridade**: A navegação principal é essencial para a usabilidade básica do app.

**Teste Independente**: Pode ser testado tocando em cada aba da bottombar e verificando se a tela correta é exibida.

**Cenários de Aceite**:

1. **Given** o usuário está no Inbox, **When** toca na aba "Buscar" na bottombar, **Then** navega para a tela de busca com campo auto-focado
2. **Given** o usuário está na tela de Buscar, **When** toca na aba "Notas" na bottombar, **Then** navega para a tela de notas com layout configurável
3. **Given** o usuário está na tela de Notas, **When** toca na aba "Listas" na bottombar, **Then** navega para a tela de listas agrupadas por tipo
4. **Given** o usuário está na tela de Listas, **When** toca na aba "Inbox" na bottombar, **Then** retorna para o Inbox
5. **Given** o usuário está em qualquer tela, **When** observa a bottombar, **Then** a aba atual está destacada visualmente
6. **Given** o usuário navega entre abas, **When** retorna a uma aba visitada anteriormente, **Then** o estado da tela é preservado (posição do scroll, filtros aplicados)
7. **Given** o usuário está em qualquer tela, **When** toca no botão central "Adicionar", **Then** abre modal/sheet com campo de entrada inteligente e opções de tipo de item

---

### User Story 1.4 - Tela de Busca (Priority: P1)

Pedro lembra que anotou uma ideia há meses, mas não lembra onde. Ele toca na aba "Buscar" na bottombar, vê seu histórico de buscas recentes, digita no campo auto-focado, aplica filtros visíveis e encontra a nota em segundos.

**Por que esta prioridade**: Busca agora é uma aba principal da navegação, essencial para recuperação rápida de informações.

**Teste Independente**: Pode ser testado navegando para a aba Buscar, verificando auto-foco, histórico e filtros visíveis, executando busca com filtros.

**Cenários de Aceite**:

1. **Given** o usuário toca na aba "Buscar" na bottombar, **When** a tela abre, **Then** o campo de busca está auto-focado e teclado visível
2. **Given** a tela de busca está aberta, **When** o usuário visualiza a tela, **Then** vê filtros visíveis (tipo, período, lista) e histórico de buscas recentes
3. **Given** existem buscas anteriores, **When** o usuário toca em uma busca do histórico, **Then** a busca é executada automaticamente com os mesmos termos
4. **Given** existem 100 itens no app, **When** o usuário busca por "compras", **Then** apenas itens contendo "compras" no título ou descrição são exibidos
5. **Given** o usuário aplica filtro "última semana", **When** a busca executa, **Then** apenas itens criados nos últimos 7 dias aparecem
6. **Given** o usuário seleciona filtro por lista "Mercado", **When** a busca executa, **Then** apenas itens dessa lista são exibidos
7. **Given** o usuário combina múltiplos filtros (tipo + período + lista), **When** a busca executa, **Then** apenas itens que atendem TODOS os critérios aparecem
8. **Given** resultados são exibidos, **When** o usuário toca em um resultado, **Then** navega para a tela de detalhes do item

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
4. **Given** o usuário adiciona "Pão R$5,00" na lista de compras, **When** confirma, **Then** o item mostra badge com valor extraído

---

## Escopo 3: Listas de Notas

### User Story 3.1 - Criar e Organizar Notas (Priority: P2)

O usuário quer criar notas para suas ideias e organizá-las em uma ordem específica que faça sentido para seu fluxo de trabalho.

**Por que esta prioridade**: Notas são um caso de uso frequente, mas menos crítico que compras no MVP.

**Teste Independente**: Pode ser testado criando uma lista de notas, adicionando itens, reordenando via drag and drop.

**Cenários de Aceite**:

1. **Given** o usuário está em uma lista de notas, **When** adiciona "Ideia para projeto", **Then** o item é criado com título
2. **Given** o usuário está em uma lista de notas com 5 itens, **When** arrasta um item para nova posição, **Then** o item é reordenado e a nova ordem é persistida
3. **Given** o usuário abre uma nota, **When** adiciona descrição com markdown "**Importante**: fazer até sexta", **Then** "Importante" aparece em negrito

---

### User Story 3.2 - Tela de Detalhes da Nota (Priority: P2)

O usuário quer visualizar uma nota completa com todas as suas informações e poder editar qualquer campo diretamente.

**Por que esta prioridade**: A visualização e edição de notas é fundamental para o uso completo do recurso de notas.

**Teste Independente**: Pode ser testado abrindo uma nota existente, visualizando todos os campos, editando e verificando persistência.

**Cenários de Aceite**:

1. **Given** o usuário toca em uma nota na lista, **When** a tela de detalhes abre, **Then** exibe título, descrição formatada e lista de origem (se houver)
2. **Given** o usuário está na tela de detalhes, **When** toca no título, **Then** pode editar inline e salvar
3. **Given** o usuário está na tela de detalhes, **When** toca na descrição, **Then** abre editor com suporte a markdown
4. **Given** o usuário edita a descrição com "**Negrito** e _itálico_", **When** salva e visualiza, **Then** a formatação é renderizada corretamente
5. **Given** o usuário altera a lista associada do item, **When** salva, **Then** o item aparece na nova lista e some da anterior

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

## Escopo 6: Seções dentro de Listas

### User Story 6.1 - Gerenciamento de Seções (Priority: P2)

O usuário quer organizar os itens dentro de uma lista em seções customizadas para melhor visualização e agrupamento.

**Por que esta prioridade**: Seções são fundamentais para organização dentro de listas, especialmente para listas longas.

**Teste Independente**: Pode ser testado criando seções em uma lista, movendo itens entre seções, renomeando e excluindo seções.

**Cenários de Aceite**:

1. **Given** o usuário está em uma lista, **When** toca no botão "Nova Seção", **Then** uma nova seção é criada com nome editável
2. **Given** uma seção existe na lista, **When** o usuário arrasta um item para dentro da seção, **Then** o item é movido para a seção
3. **Given** uma seção existe com itens, **When** o usuário renomeia a seção, **Then** o nome é atualizado e os itens permanecem
4. **Given** uma seção existe com itens, **When** o usuário exclui a seção, **Then** os itens são movidos para fora da seção (ficam na lista sem seção)
5. **Given** uma lista tem múltiplas seções, **When** o usuário arrasta uma seção, **Then** a ordem das seções é alterada e persistida

---

## Escopo 7: Navegação e Configurações

### User Story 7.1 - Tela Notas na Bottom Bar (Priority: P1)

O usuário quer visualizar todos os seus itens de notas em uma tela dedicada com opções de agrupamento e ordenação configuráveis.

**Por que esta prioridade**: Tela Notas é uma aba principal da navegação, essencial para acesso rápido aos itens de notas.

**Teste Independente**: Pode ser testado navegando para a aba Notas, verificando exibição de itens, alterando agrupamento e ordenação.

**Cenários de Aceite**:

1. **Given** o usuário toca na aba "Notas" na bottombar, **When** a tela abre, **Then** exibe apenas itens de listas da categoria "Notas"
2. **Given** a tela Notas está aberta, **When** o usuário toca no controle de agrupamento, **Then** pode escolher agrupar por: lista, data de criação ou data de atualização
3. **Given** a tela Notas está aberta, **When** o usuário toca no controle de ordenação, **Then** pode escolher ordem ascendente ou descendente
4. **Given** o usuário configura agrupamento e ordenação, **When** navega para outra aba e retorna, **Then** as configurações são preservadas
5. **Given** a tela Notas está aberta, **When** o usuário toca em um item, **Then** navega para a tela de detalhes da nota

---

### User Story 7.2 - Tela Listas na Bottom Bar (Priority: P1)

O usuário quer visualizar todas as suas listas organizadas por tipo (categoria) com dropdowns expansíveis.

**Por que esta prioridade**: Tela Listas é uma aba principal da navegação, essencial para gerenciamento de listas.

**Teste Independente**: Pode ser testado navegando para a aba Listas, verificando agrupamento por tipo, expandindo/colapsando dropdowns.

**Cenários de Aceite**:

1. **Given** o usuário toca na aba "Listas" na bottombar, **When** a tela abre, **Then** exibe listas agrupadas por tipo: Notas, Compras e Interesse
2. **Given** a tela Listas está aberta, **When** o usuário visualiza um grupo, **Then** vê dropdown expansível com nome do tipo e contagem de listas
3. **Given** um dropdown está colapsado, **When** o usuário toca nele, **Then** expande e mostra as listas daquele tipo
4. **Given** um dropdown está expandido, **When** o usuário toca nele, **Then** colapsa e oculta as listas
5. **Given** a tela Listas está aberta, **When** o usuário toca em uma lista específica, **Then** navega para a tela de conteúdo da lista
6. **Given** a tela Listas está aberta, **When** o usuário toca no botão "Nova Lista", **Then** abre formulário de criação de lista

---

### User Story 7.3 - Acesso às Configurações via Perfil (Priority: P2)

O usuário quer acessar as configurações do app através do ícone de perfil na navbar.

**Por que esta prioridade**: Acesso rápido às configurações é importante para personalização do app.

**Teste Independente**: Pode ser testado tocando no ícone de perfil na navbar e verificando se a tela de configurações é exibida.

**Cenários de Aceite**:

1. **Given** o usuário está em qualquer tela com navbar visível, **When** toca no ícone de perfil (esquerda da navbar), **Then** navega para a tela de configurações
2. **Given** o usuário está na tela de configurações, **When** observa o topo da tela, **Then** vê informações do perfil (foto, nome, email)
3. **Given** o usuário está na tela de configurações, **When** toca no botão voltar, **Then** retorna para a tela anterior

---

### User Story 7.4 - Configuração de Tema (Priority: P3)

O usuário prefere usar o app no modo escuro e quer personalizar a cor de destaque.

**Por que esta prioridade**: Personalização visual é desejável mas não essencial para a funcionalidade core.

**Teste Independente**: Pode ser testado alterando tema, verificando mudança visual imediata, alterando cor principal, verificando aplicação.

**Cenários de Aceite**:

1. **Given** o usuário acessa Configurações, **When** seleciona "Tema Escuro", **Then** todo o app muda para o esquema de cores escuro imediatamente
2. **Given** o usuário seleciona "Tema Automático", **When** o sistema operacional está em modo escuro, **Then** o app segue o modo do sistema
3. **Given** o usuário seleciona uma cor principal diferente, **When** aplica, **Then** elementos de destaque (botões, links, ícones ativos) mudam para a nova cor

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

## Requisitos *(obrigatório)*

### Requisitos Funcionais

#### Entrada Inteligente
- **FR-001**: Sistema MUST parsear texto de entrada e extrair: título, lista destino (@), quantidade e valor monetário (somente para listas de compras)
- **FR-002**: Sistema MUST exibir dropdown de sugestões ao digitar "@" com listas existentes filtradas
- **FR-003**: Sistema MUST permitir criar nova lista inline quando o texto após "@" não corresponde a nenhuma lista existente
- **FR-004**: Sistema MUST reconhecer padrões de valor monetário (R$X, X,XX, X.XX) e extrair para campo de valor SOMENTE quando lista destino é do tipo compras
- **FR-005**: Itens sem lista especificada MUST permanecer na Inbox sem lista associada

#### Listas e Organização
- **FR-006**: Sistema MUST suportar três categorias de listas: Notas, Compras e Interesse
- **FR-007**: Sistema MUST permitir criar, renomear e excluir listas
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

#### Listas de Compras
- **FR-017**: Itens de lista de compras MUST ter campos: título, quantidade, valor
- **FR-018**: Sistema MUST calcular e exibir soma total dos valores de itens marcados em barra inferior
- **FR-019**: Sistema MUST atualizar total em tempo real quando item é marcado/desmarcado
- **FR-020**: Sistema MUST exibir badges visuais para quantidade e valor extraídos automaticamente

#### Listas de Notas
- **FR-021**: Itens de lista de notas MUST ter campos: título, descrição
- **FR-022**: Sistema MUST suportar markdown básico (negrito, itálico, listas) na descrição
- **FR-023**: Sistema MUST permitir reordenação de itens via drag and drop

#### Listas de Interesse
- **FR-024**: Listas de Filmes MUST integrar com TMDb para busca e enriquecimento de dados
- **FR-025**: Listas de Livros MUST integrar com Google Books para busca e enriquecimento de dados
- **FR-026**: Listas de Games MUST integrar com IGDB para busca e enriquecimento de dados
- **FR-027**: Sistema MUST permitir marcar itens de interesse como "consumido" (visto/lido/jogado)
- **FR-028**: Sistema MUST preencher automaticamente: título, descrição/sinopse, capa/poster, avaliação, e metadados específicos (elenco/autor/desenvolvedor)

#### Inbox e Navegação
- **FR-029**: Inbox MUST exibir todos os itens de todas as categorias em scroll infinito com paginação
- **FR-030**: Sistema MUST permitir agrupar itens por: data de criação, data de atualização ou lista
- **FR-031**: Sistema MUST permitir ordenar itens de forma ascendente ou descendente
- **FR-032**: Bottombar MUST permitir navegação entre Inbox, Buscar, Notas e Listas
- **FR-033**: Bottombar MUST destacar visualmente a aba ativa
- **FR-034**: Sistema MUST preservar estado da tela ao navegar entre abas
- **FR-035**: Bottombar MUST exibir botão central "Adicionar" que abre modal/sheet com entrada inteligente
- **FR-036**: Navbar MUST fornecer acesso a configurações via ícone de perfil (esquerda)

#### Busca
- **FR-037**: Tela Buscar MUST exibir campo auto-focado, filtros visíveis e histórico de buscas recentes
- **FR-038**: Sistema MUST buscar em título e descrição de todos os itens
- **FR-039**: Sistema MUST filtrar resultados por tipo (notas, listas ou ambos)
- **FR-040**: Sistema MUST filtrar resultados por período (última semana, mês, ano, todo o período)
- **FR-041**: Sistema MUST filtrar resultados por lista selecionada
- **FR-042**: Resultados MUST ser paginados e cada item clicável para navegação

#### Detalhes e Edição
- **FR-043**: Sistema MUST exibir tela de detalhes com título, descrição e lista associada (se houver)
- **FR-044**: Sistema MUST suportar edição inline de todos os campos
- **FR-045**: Sistema MUST permitir alterar lista associada de um item existente
- **FR-046**: Tela de detalhes de nota MUST renderizar markdown na visualização e suportar no editor

#### Configurações
- **FR-047**: Sistema MUST permitir selecionar tema: claro, escuro ou automático
- **FR-048**: Sistema MUST permitir personalizar cor principal de destaque
- **FR-049**: Sistema MUST exibir informações sobre o aplicativo, termos e política de privacidade
- **FR-050**: Tela de configurações MUST exibir perfil do usuário (foto, nome, email) no topo

#### Telas Notas e Listas
- **FR-051**: Tela Notas MUST exibir apenas itens de listas da categoria "Notas"
- **FR-052**: Tela Notas MUST permitir configurar agrupamento (group) e ordenação (sort) dos itens
- **FR-053**: Tela Listas MUST exibir listas ativas agrupadas por TIPO (categoria) com dropdown expansível

### Entidades-chave

- **Item**: Unidade básica de informação. Possui título, descrição opcional, data de criação, data de atualização, lista associada (opcional - itens sem lista ficam na Inbox), seção associada (opcional - itens podem ficar "soltos" na lista), ordem na lista/seção, e campos específicos por tipo (valor, quantidade para compras; status consumido para interesse; metadados de mídia para interesse)
- **Lista**: Agrupador de itens por contexto. Possui nome, categoria (notes, shopping, interest), subtipo para interest (movies, books, games), data de criação, ordem dos itens
- **Seção**: Agrupador visual de itens dentro de uma lista específica. Possui nome, ordem na lista, lista pai (obrigatória). Cada lista tem suas próprias seções independentes. Relaciona-se com uma lista (muitos-para-um) e com múltiplos itens (um-para-muitos)
- **Usuário**: Perfil do usuário local. Possui nome, email, foto. Configurações de tema e cor principal

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
- Q: Comportamento do botão central Adicionar? → A: Modal/sheet com campo de entrada inteligente + opções de tipo de item
- Q: Distinção entre telas Notas e Listas? → A: Notas = itens com layout configurável (group + sort); Listas = listas ativas agrupadas por TIPO com dropdown
- Q: Quais itens aparecem na tela Notas? → A: Apenas itens de listas da categoria "Notas"
- Q: Conteúdo da tela Inbox? → A: Todos os itens recentes (todas as categorias) com scroll infinito

## Premissas

- Usuário tem perfil local (sem autenticação cloud no MVP)
- Dados são armazenados localmente no dispositivo
- Provedores externos (TMDb, Google Books, IGDB) requerem conexão com internet
- Formato de moeda segue configuração de localidade do dispositivo
- App suporta português brasileiro (pt-BR) como idioma principal e inglês (en) como fallback
- Itens sem lista associada permanecem visíveis na Inbox
