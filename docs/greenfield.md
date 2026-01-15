# /speckit.constitution 
Crie princípios focados na qualidade de código, arquitetura limpa, padrões de teste, UI consistente com Design System bem definido, confiável, livre de bugs e com requisitos de performance.
- PT-BR para docs.

---

# /speckit.specify
> O comando /speckit.specify deve ser usado para descrever o que você deseja construir. Concentre-se no "o quê" e no "porquê" , não na pilha de tecnologias.
Construa uma aplicação mobile chamada "Listify" que ajuda os usuários a gerenciar suas mais diversas listas, como listas de compras, lista de filmes/séries para assistir, livros para ler e notas. 

> TAREFAS DO RASCUNHO DA ESPECIFICAÇÃO:
- [ ] 1. Definir requisitos funcionais e não funcionais.
- [ ] 2. Desenhar o wireframe de todas as telas principais.
- [ ] 3. Definir entidades e seus atributos.
- [ ] 4. Definir pontos de entrada e interações do usuário.

## Requisitos Funcionais

### 1. Inbox e Interface de Chat (Tela Principal) (Por ordem de prioridade)
- Interface de chat para permitir interação rápida do usuário, com um campo de texto fixo na parte inferior da tela e as mensagens sendo exibidas acima, orientadas de baixo para cima.
- 
**Dúvidas:**
- Como os itens devem ser exibidos? Quais informações devem ser mostradas? Como serão agrupados? Será permitido alterar o agrupamento? Barra de pesquisa?
- O campo de texto deve ser inteligente, 
    - Ao clicar, abrir sugestões: adicionar item na lista, criar nota

### 2. Sidebar
- A sidebar deve permitir navegação entre diferentes listas, acesso às configurações do aplicativo e visual

### 3. Registro de nota

### 4. Criação de listas
- Cada lista deve permitir adicionar, editar e remover itens.
- Cada lista deve permitir marcar itens como concluídos ou pendentes.
- Cada lista deve permitir organizar itens por categorias(tags), prioridades ou datas.

### 5. Tela de detalhes da lista
Pontos de entrada:

### 6. Tela de detalhes da nota


### 5. Login e Autenticação

#### (TRANSFORMAR EM LISTA PADRÃO) Notas


#### Itens

#### IA 

---

## Definição de Domínio

### [ ] 0. Common Domain

```typescript
interface CreateUseCase<T, U> {
    create(item: U): Promise<T>;
}
interface ReadUseCase<T> {
    getById(id: string): Promise<T | null>;
    getAll(): Promise<T[]>;
}
interface UpdateUseCase<T, U> {
    update(id: string, updates: U): Promise<T | null>;
}
interface DeleteUseCase {
    delete(id: string): Promise<boolean>;
}

// Filtro e estrutura de busca
type FilterCriteria = {
    query?: string;
    tags?: string[];
    listIds?: string[];
    createdDateRange?: { from: Date; to: Date };
    updatedDateRange?: { from: Date; to: Date };
    isCompleted?: boolean;
}

type FilterResult<T> = {
    items: T[];
    totalCount: number;
}

interface FilterUseCase<T> {
    filter(criteria: FilterCriteria): Promise<T[]>;
}

// Agrupamento de itens
type ListGroupKeys = 'tag' | 'type' | 'category';
type NoteGroupKeys = 'tag' | 'createdDate' | 'updatedDate' | 'isCompleted';

type GroupCriteria = ListGroupKeys | NoteGroupKeys;

type GroupResult<T> = {
    [key in GroupCriteria]: T[];
}

interface GroupUseCase<T> {
    groupBy(criteria: GroupCriteria): Promise<GroupResult<T>>;
}
```

### [x] 1. Listas
**Entidade no banco de dados:**
    - Nome (string)
    - Descrição (string, opcional)
    - Tipo de lista (enum: compras, filmes/séries, livros, personalizada)
    - ID das notas associadas (1:várias)
    - Data de criação (timestamp)
    - Data de modificação (timestamp)

```typescript
// types
type ListType = {
    listType: 'shopping' | 'movies' | 'books' | 'games' | 'custom';
    category: 'interest' | 'shopping';
}

type List = ListType & {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

// use cases
interface ListUseCases {
    getAllLists(): Promise<List[]>;
    getListById(id: string): Promise<List | null>;
    createList(list: Omit<List, 'id' | 'createdAt' | 'updatedAt'>): Promise<List>;
    updateList(id: string, updates: Partial<Omit<List, 'id' | 'createdAt'>>): Promise<List | null>;
    deleteList(id: string): Promise<boolean>;
    getListsByCriteria(listId: string, criteria: FilterCriteria): Promise<List[]>;
    getGroupedListsByCriteria
}
```

### [ ] 2. Notas
**Entidade no banco de dados:**
    - Nome (string)
    - Descrição (string, opcional)
    - ID das tags associadas (1:várias)
    - ID da lista vinculada (1:1)
    - Data de criação (timestamp)
    - Data de conclusão (timestamp, opcional)
    - Status de verificação (boolean, apenas para notas verificáveis, nulo para notas não verificáveis)
    - ID da nota pai (para subtarefas, apenas para notas verificáveis, nulo para notas não verificáveis)

```typescript
// types
type UncheckableNote = {
    id: string;
    listId?: string;
    title: string;
    description?: string;
    isCheckable: false;
    createdAt: Date;
    updatedAt: Date;
}

type CheckableNote = UncheckableNote & {
    isCheckable: true;
    isCompleted: boolean;
    completedAt?: Date;
    parentNoteId?: string;
}

type Note = UncheckableNote | CheckableNote;

// use cases
interface NoteUseCases: SearchUseCase<Note> {
    getAllNotes(): Promise<Note[]>;
    getNotesByTagId(tagId: string): Promise<Note[]>;
    getNotesByListId(listId: string): Promise<Note[]>;
    getNoteById(id: string): Promise<Note | null>;
    createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note>;
    updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Promise<Note | null>;
}
```

### [ ] 3. Tags
**Entidade no banco de dados:**
    - Nome (string)
    - Cor (string, opcional)
    - ID das notas associadas (1:várias)
    - Data de criação (timestamp)

**Classe: Tag:**
    - Permite categorizar e organizar notas.
    - Pode ser associada a múltiplas notas.
    - Suporta personalização visual através de cores.

#### Configurações e Personalização

**Pontos de entrada:**
1. 

**Interações:**
1. 

---


# /speckit.plan
> TAREFAS DO RASCUNHO DA ESPECIFICAÇÃO:
- [ ] 1. Gerar PlantUML com base na especificação definida.
- [ ] 2. Escrever o CLAUDE.md com base na especificação definida e com regras para arquitetura e código limpo.


- Internacionalização (i18n) para suportar múltiplos idiomas.
- Suporte offline para permitir que os usuários acessem e modifiquem suas listas sem conexão com a internet.


# Rascunho

## Escopo técnico

- [ ] Como utilizar o Drizzle?
- [ ] Como utilizar o Zustand?
- [ ] Arquitetura Limpa no Listify
    - [ ] Evitar lógica de negócio na UI. A UI deve ser o mais "burra" possível, apenas exibindo os dados recebidos da VM e repassando eventos de interação para a VM.

### Guardrails de Desenvolvimento

- [ ] Evitar import de usecases e repositories na screen ou no componente. A VM deve ser a única responsável por lidar com casos de uso e repositórios e repassar os dados para a UI.
