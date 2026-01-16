# Listify - Especificação de Requisitos

Listify é um aplicativo de gerenciamento de notas e listas que visa ajudar os usuários a organizar suas tarefas, ideias e interesses de forma eficiente e intuitiva. A seguir estão os requisitos funcionais detalhados para o desenvolvimento do aplicativo.

## Requisitos Funcionais (MVP)

### [x] 1. Inbox (Aba na Tela Principal) (Por ordem de prioridade)
**Pontos de entrada:**
1. Tela principal ao abrir o aplicativo (Inbox).
2. Navegação via Sidebar (Menu lateral).

**Funcionalidades:**
1. Navbar superior com:
    - Card de perfil do usuário (foto e nome). 
        - O clique na foto/nome leva abre a sidebar (menu lateral).
    - Ícone de busca.
        - O clique no ícone leva à tela de busca global.
2. Exibição de todos os itens recentes em uma lista vertical abaixo do carrossel de listas.
    - Atalho para configuração de layout:
        - Notas agrupadas por: data de criação, data de atualização, categoria(tag) ou lista. (defaut: data de criação)
        - Ordenação: ascendente ou descendente. (default: descendente)
    - Scroll vertical, "infinito" e páginado.
    - Visualização resumida de cada item com:
        - Título (máx. 2 linhas, com reticências se ultrapassar).
        - Tags associadas (máx. 3 tags visíveis, com reticências se ultrapassar).
        - Lista associada.
        - Data de atualização.
3. Bottombar fixa com:
    **Abas de navegação**
        - Ícone "Inbox" (tela principal).
        - Ícone "Listas" que leva à tela de gerenciamento de listas.
        - Ícone "Notas" que leva à tela de todas as notas.
    **Ação rápida**
        - Botão flutuante de "Adicionar" no centro da bottombar. Clique sobe a modal para registro de item.
        
### [x] 2. Sidebar
**Pontos de entrada:**
1. Ícone de menu no canto superior esquerdo da Navbar da tela principal (Inbox).

**Funcionalidades:**
Sessão Perfil
1. Card de perfil do usuário com foto, nome e email.
2. Botão "Ver perfil" que leva à tela de perfil do usuário.

Sessão Navegação
1. Botão "Inbox" seleciona a aba Inbox na tela principal.
2. Botão "Listas" seleciona a aba Listas na tela principal.
3. Botão "Minhas Tags" que leva à tela de gerenciamento de tags.
4. Botão "Minhas Notas" que leva à tela de todas as notas.

Sessão Configurações e Ajuda
1. Botão "Configurações" que leva à tela de configurações do aplicativo.
2. Botão "Ajuda" que leva à seção de ajuda e FAQ.

### [x] 3. Registro de item (Modal)
**Pontos de entrada**
1. Botão flutuante de "Adicionar" na bottombar da tela principal (Inbox) quando a aba "Inbox" estiver selecionada.

**Funcionalidades**
1. Campo de texto para o título do item. Esse campo é inteligente e possibilita o preenchimento dos outros campos automaticamente.
    - Ao digitar "#" seguido com qualquer letra, surge o dropdown de tags.
    Exemplo: Digitar "Comprar leite e pão #compras" preenche o título como "Comprar leite e pão" e adiciona a tag "compras".
    - Ao digitar "@" seguido com qualquer letra, surge o dropdown de listas.
    Exemplo: Digitar "Comprar leite e pão @Supermercado" preenche o título como "Comprar leite e pão" e associa a nota à lista "Supermercado".
3. Opção para adicionar tags à nota (abre Dropdown de tags).
4. Opção para associar a nota a uma lista (abre Dropdown de listas).
    - Dependendo da lista selecionada, o modal se adapta para permitir o registro de itens específicos (ex: itens de lista de compras, itens de lista de interesse).
3. Botão para salvar o item na lista correspondente e adicionar outro item ou salvar e abrir a tela de detalhes do item.

### [x] 3.1 Dropdown de tags
**Pontos de entrada**
1. Ao digitar "#" no campo de título da nota.
2. Ao clicar no ícone de tags na modal de registro de nota.

**Funcionalidades**
1. Exibir uma lista de tags existentes com opção de busca.
2. Permitir criar uma nova tag se a tag digitada não existir.
3. Permitir selecionar múltiplas tags para a nota.

### [x] 3.2 Dropdown de listas
**Pontos de entrada**
1. Ao digitar "@" no campo de título da nota.
2. Ao clicar no ícone de listas na modal de registro de nota.
**Funcionalidades**
1. Exibir uma lista de listas existentes com opção de busca.
2. Permitir criar uma nova lista se a lista digitada não existir.
3. Permitir selecionar uma lista para associar à nota.

### [x] 3.3 Registro de nota item de lista de shopping (Modal)
**Pontos de entrada**
1. No modal de registro de nota, ao selecionar uma lista do tipo "Shopping", o modal se adapta para permitir o registro de itens de lista de compras.

**Funcionalidades**
Exibe a "Barra de registro global de notas / listas" no topo do modal, com campos específicos para itens de lista de compras:
1. Campo de texto inteligente para adicionar todos os detalhes do item em uma única linha (nome, quantidade, categoria, valor).
    - Exemplo de entrada: "Leite 2L #laticínios R$8,50"
    - O campo deve interpretar a entrada e preencher os outros campos automaticamente.
    - Nome do item: "Leite"
    - Quantidade: "2L"
    - Categoria: "laticínios"
    - Valor: "R$8,50"
2. Abaixo do campo de texto inteligente deve exibir Badges com os detalhes extraídos (quantidade, categoria, valor) para confirmação e edição rápida.
    - Se o dado ainda não tiver sido extraído, o badge correspondente ainda deve ser exibido. 
    - Ao clicar no badge, abre um dialogo para editar o valor manualmente, e depois volta para o modal de registro de nota com o dado atualizado no campo inteligente.
3. Botão para salvar o item na lista de compras.

### [x] 3.4 Registro de nota item de lista de interesse (Modal)
**Pontos de entrada**
1. No modal de registro de nota, ao selecionar uma lista do tipo "Interest", o modal se adapta para permitir o registro de itens de lista de interesse (ex: filmes, livros, jogos).

**Funcionalidades** 
Exibe a "Barra de registro global de notas / listas" no topo do modal, com campos específicos para itens de lista de interesse:
1. Campo de texto para o nome do item.
2. Campo de texto para a categoria do item (ex: filme, série, livro, jogo) (já preenchido com base na lista selecionada).
3. Botão para buscar o item em provedores externos (ex: TMDb, Google Books, IGDB). Abre uma tela de busca integrada ao provedor externo. (Talvez usar a tela de busca global reutilizando o componente de lista de resultados).
4. Ao selecionar o item nos resultados da busca, preencher automaticamente o nome do item e exibir um resumo com informações relevantes (ex: sinopse, autor, avaliações, etc.) e adicionar automaticamente o item à lista de interesse.

### [x] 3.4.1. Integração das listas com provedores externos
**Filmes e séries**
- Integrar com APIs como The Movie Database (TMDb) para permitir que os usuários pesquisem e adicionem filmes e séries diretamente às suas listas.
- No detalhe do filme/série, exibir informações como sinopse, elenco, avaliações e trailers.

**Livros**
- Integrar com APIs como Google Books para permitir que os usuários pesquisem e adicionem livros diretamente às suas listas.
- No detalhe do livro, exibir informações como sinopse, autor, avaliações e capa do livro.

**Games**
- Integrar com APIs como IGDB para permitir que os usuários pesquisem e adicionem jogos diretamente às suas listas.
- No detalhe do jogo, exibir informações como sinopse, desenvolvedor, avaliações e trailers.

### [x] 3.5 Tela de edição / detalhes da Nota

**Pontos de entrada**
1. Clicar em uma nota na tela principal (Inbox).
2. Clicar em uma nota na tela de detalhes da lista.
3. Clicar em uma nota nos resultados da busca global.
4. Ao salvar uma nova nota na modal de registro de nota, opção de "Salvar e abrir detalhes da nota".

**Funcionalidades**
1. Navbar superior com:
    - Botão de voltar para a tela anterior.
    - Ícone de editar.
        - O clique no ícone habilita a edição da nota direto na tela de detalhes, possibilitando alterar título, descrição, tags e lista associada de forma inline.
    - Ícone de mais opções (ex: excluir nota, compartilhar nota, etc.).
2. Exibição do titulo e descrição da nota, com suporte a múltiplas linhas e markdown básico (negrito, itálico, listas).
3. Exibição das tags associadas à nota.
4. Exibição da lista associada à nota, com link para abrir a tela de detalhes da lista.
5. Toolbar inferior com:
    - Botões para formatar o texto (negrito, itálico, listas).

**Componentes**
- Scafold reutilizável entre a Inbox, Detalhes da Nota e Detalhes da Lista, com a Bottombar fixa exibindo a Toolbar inferior.

### [x] 4. Tela de gerenciamento de listas (Aba na Tela Principal)
**Pontos de entrada:**
1. Navegação via Bottombar (Ícone "Listas").

**Funcionalidades:**
1. Navbar superior com:
    - Card de perfil do usuário (foto e nome). 
        - O clique na foto/nome leva abre a sidebar (menu lateral).
    - Ícone de busca.
        - O clique no ícone leva à tela de busca global.
2. Exibição de todas as listas em uma lista vertical.
    
### [x] 4.1 Tela de detalhes da lista de shopping
**Pontos de entrada:**
1. Clicar em uma lista do tipo "Shopping" na tela de gerenciamento de listas.
2. Clicar na lista associada à nota na tela de detalhes da nota.

**Funcionalidades:**
1. Navbar superior com:
    - Botão de voltar para a tela anterior.
2. Exibição do nome da lista.
3. Configurações de layout para exibição dos itens:
    - Agrupamento por categoria ou nenhum.
    - Ordenação: ascendente ou descendente.
4. Exibição dos itens da lista em uma lista vertical, com:
    - Drag and drop para reordenar os itens.
    - Nome do item.
    - Quantidade.
    - Categoria (se caso não estiver agrupado por categoria).
    - Checkbox para marcar o item como comprado.
    - Valor do item.
5. Clicar no item leva leva ao modal de edição do item. ITENS DA LISTA DE SHOPPING NÃO TEM TELA DE DETALHES, APENAS MODAL DE EDIÇÃO.
6. Barra inferior de total gasto na lista, exibindo o valor total dos itens marcados como comprados.
7. Botão flutuante de "Adicionar item" que abre o modal de registro de nota adaptado para itens de lista de compras.

### [x] 5. Busca global
**Pontos de entrada:**
1. Botão com ícone de Lupa na Navbar da tela principal (Inbox).
2. Botão com ícone de Lupa na tela de detalhes da lista.

**Funcionalidades:**
1. Abre uma tela cheia com a busca global.
2. Campo de texto para digitar o termo de busca.
3. Filtros para refinar a busca:
    - Tipo: Notas, Listas ou Ambos. (default: Dependendo do ponto de entrada)
    - Data: Última semana, Último mês, Último ano, Todo o período.
    - Tags: Selecionar uma ou mais tags.
4. Exibição dos resultados da busca em uma lista paginada.
5. Cada item nos resultados deve ser clicável, levando à tela de detalhes correspondente (nota ou lista).

### [x] 6. Configurações e Personalização
**Pontos de entrada:**
1. Navegação via Sidebar (Menu lateral).

**Funcionalidades:**
1. Opções para personalizar o tema do aplicativo (claro, escuro, automático) e cores principais.
2. Sessão de sobre o aplicativo com informações de versão e links para termos de serviço e política de privacidade.
