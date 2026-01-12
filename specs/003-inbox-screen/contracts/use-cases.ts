/**
 * Contratos dos Use Cases do domínio Inbox
 *
 * Define inputs, outputs e assinaturas dos use cases.
 * A implementação fica em src/domain/inbox/use-cases/.
 */

import type { DateGroup, PaginatedUserInputs, Tag, UserInput } from './entities';
import type { InboxRepository } from './InboxRepository';

// =============================================================================
// SHARED TYPES
// =============================================================================

/**
 * Dependências comuns para todos os use cases.
 */
export type InboxUseCaseDeps = {
  repository: InboxRepository;
};

// =============================================================================
// CREATE USER INPUT
// =============================================================================

/**
 * Input para criar um novo UserInput.
 */
export type CreateUserInputInput = {
  /** Texto do input (pode conter #tags) */
  text: string;
};

/**
 * Output de criar UserInput.
 */
export type CreateUserInputOutput = UserInput;

/**
 * Cria um novo UserInput no sistema.
 *
 * Responsabilidades:
 * 1. Validar texto (não vazio, max 5000 chars)
 * 2. Extrair tags do texto (#tag)
 * 3. Normalizar tags (lowercase, sem duplicatas)
 * 4. Criar/atualizar tags no banco
 * 5. Persistir UserInput com relações
 *
 * @param input - Texto do input
 * @param deps - Repositório
 * @returns UserInput criado
 * @throws EmptyTextError se texto vazio/whitespace
 * @throws TextTooLongError se > 5000 chars
 */
export type CreateUserInputFn = (
  input: CreateUserInputInput,
  deps: InboxUseCaseDeps,
) => Promise<CreateUserInputOutput>;

// =============================================================================
// UPDATE USER INPUT
// =============================================================================

/**
 * Input para atualizar um UserInput.
 */
export type UpdateUserInputInput = {
  /** ID do input a atualizar */
  id: string;

  /** Novo texto (opcional) */
  text?: string;
};

/**
 * Output de atualizar UserInput.
 */
export type UpdateUserInputOutput = UserInput;

/**
 * Atualiza um UserInput existente.
 *
 * Responsabilidades:
 * 1. Validar que input existe
 * 2. Validar novo texto (se fornecido)
 * 3. Recalcular tags (se texto mudou)
 * 4. Atualizar usageCount das tags
 * 5. Preservar createdAt, atualizar updatedAt
 *
 * @param input - ID e campos a atualizar
 * @param deps - Repositório
 * @returns UserInput atualizado
 * @throws UserInputNotFoundError se não encontrado
 * @throws EmptyTextError se texto vazio
 */
export type UpdateUserInputFn = (
  input: UpdateUserInputInput,
  deps: InboxUseCaseDeps,
) => Promise<UpdateUserInputOutput>;

// =============================================================================
// DELETE USER INPUT
// =============================================================================

/**
 * Input para deletar um UserInput.
 */
export type DeleteUserInputInput = {
  /** ID do input a deletar */
  id: string;
};

/**
 * Deleta um UserInput do sistema.
 *
 * Responsabilidades:
 * 1. Validar que input existe
 * 2. Decrementar usageCount das tags
 * 3. Remover relações (CASCADE)
 * 4. Remover input
 *
 * @param input - ID do input
 * @param deps - Repositório
 * @throws UserInputNotFoundError se não encontrado
 */
export type DeleteUserInputFn = (
  input: DeleteUserInputInput,
  deps: InboxUseCaseDeps,
) => Promise<void>;

// =============================================================================
// GET USER INPUTS
// =============================================================================

/**
 * Input para listar UserInputs.
 */
export type GetUserInputsInput = {
  /** Número da página (0-indexed) */
  page: number;

  /** Itens por página */
  limit?: number;
};

/**
 * Output de listar UserInputs.
 */
export type GetUserInputsOutput = PaginatedUserInputs;

/**
 * Lista UserInputs com paginação.
 *
 * Responsabilidades:
 * 1. Buscar inputs ordenados por createdAt ASC
 * 2. Aplicar paginação (OFFSET/LIMIT)
 * 3. Carregar tags de cada input
 * 4. Calcular hasMore flag
 *
 * @param input - Parâmetros de paginação
 * @param deps - Repositório
 * @returns Página de resultados
 */
export type GetUserInputsFn = (
  input: GetUserInputsInput,
  deps: InboxUseCaseDeps,
) => Promise<GetUserInputsOutput>;

// =============================================================================
// GET USER INPUTS GROUPED BY DATE
// =============================================================================

/**
 * Input para listar UserInputs agrupados por data.
 */
export type GetUserInputsGroupedInput = {
  /** Número da página (0-indexed) */
  page: number;

  /** Itens por página */
  limit?: number;

  /** Locale para formatação de datas */
  locale?: string;
};

/**
 * Output de listar UserInputs agrupados.
 */
export type GetUserInputsGroupedOutput = {
  /** Grupos de inputs por data */
  groups: DateGroup[];

  /** Indica se há mais itens */
  hasMore: boolean;
};

/**
 * Lista UserInputs agrupados por data.
 *
 * Responsabilidades:
 * 1. Buscar inputs (mesmo que GetUserInputs)
 * 2. Agrupar por data (início do dia)
 * 3. Formatar labels ("Hoje", "Ontem", "DD mmm")
 *
 * @param input - Parâmetros de paginação e locale
 * @param deps - Repositório
 * @returns Grupos de inputs por data
 */
export type GetUserInputsGroupedFn = (
  input: GetUserInputsGroupedInput,
  deps: InboxUseCaseDeps,
) => Promise<GetUserInputsGroupedOutput>;

// =============================================================================
// SEARCH TAGS
// =============================================================================

/**
 * Input para buscar tags.
 */
export type SearchTagsInput = {
  /** Prefixo de busca (sem #) */
  query: string;

  /** Máximo de resultados */
  limit?: number;
};

/**
 * Output de buscar tags.
 */
export type SearchTagsOutput = Tag[];

/**
 * Busca tags por prefixo (autocomplete).
 *
 * Responsabilidades:
 * 1. Normalizar query (lowercase)
 * 2. Buscar tags que começam com o prefixo
 * 3. Ordenar por usageCount DESC
 *
 * @param input - Query de busca
 * @param deps - Repositório
 * @returns Lista de tags ordenadas por uso
 */
export type SearchTagsFn = (
  input: SearchTagsInput,
  deps: InboxUseCaseDeps,
) => Promise<SearchTagsOutput>;

// =============================================================================
// EXTRACT TAGS FROM TEXT
// =============================================================================

/**
 * Input para extrair tags do texto.
 */
export type ExtractTagsInput = {
  /** Texto contendo #tags */
  text: string;
};

/**
 * Output de extrair tags.
 */
export type ExtractTagsOutput = {
  /** Nomes das tags extraídas (normalizados) */
  tagNames: string[];

  /** Texto sem as tags (para preview, opcional) */
  textWithoutTags?: string;
};

/**
 * Extrai tags de um texto (pure function, sem IO).
 *
 * Responsabilidades:
 * 1. Detectar padrão #palavra no texto
 * 2. Normalizar (lowercase, remover duplicatas)
 * 3. Validar (max 30 chars, caracteres permitidos)
 *
 * @param input - Texto com possíveis tags
 * @returns Tags extraídas
 */
export type ExtractTagsFn = (input: ExtractTagsInput) => ExtractTagsOutput;

// =============================================================================
// ERRORS
// =============================================================================

/**
 * Erro base do domínio Inbox.
 */
export class InboxDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InboxDomainError';
  }
}

/**
 * Erro: Texto do input está vazio.
 */
export class EmptyTextError extends InboxDomainError {
  constructor() {
    super('Input text cannot be empty');
    this.name = 'EmptyTextError';
  }
}

/**
 * Erro: Texto do input excede limite.
 */
export class TextTooLongError extends InboxDomainError {
  constructor(maxLength: number) {
    super(`Input text exceeds maximum length of ${maxLength} characters`);
    this.name = 'TextTooLongError';
  }
}

/**
 * Erro: UserInput não encontrado.
 */
export class UserInputNotFoundError extends InboxDomainError {
  constructor(id: string) {
    super(`UserInput not found: ${id}`);
    this.name = 'UserInputNotFoundError';
  }
}

/**
 * Erro: Nome de tag inválido.
 */
export class InvalidTagNameError extends InboxDomainError {
  constructor(name: string, reason: string) {
    super(`Invalid tag name "${name}": ${reason}`);
    this.name = 'InvalidTagNameError';
  }
}
