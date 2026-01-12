import type { PaginatedUserInputs, Tag, UserInput } from '../entities';

/**
 * Parâmetros para criar um novo UserInput.
 */
export type CreateUserInputParams = {
  /** Texto do input (pode conter #tags) */
  text: string;
};

/**
 * Parâmetros para atualizar um UserInput existente.
 */
export type UpdateUserInputParams = {
  /** ID do input a atualizar */
  id: string;

  /** Novo texto (opcional) */
  text?: string;

  /** Novas tags (opcional) - substitui tags existentes */
  tagNames?: string[];
};

/**
 * Parâmetros para listar UserInputs com paginação.
 */
export type GetUserInputsParams = {
  /** Número da página (0-indexed) */
  page: number;

  /** Itens por página (default: 20) */
  limit?: number;
};

/**
 * Parâmetros para buscar tags por prefixo.
 */
export type SearchTagsParams = {
  /** Prefixo para busca (sem #) */
  query: string;

  /** Máximo de resultados (default: 10) */
  limit?: number;
};

/**
 * Contrato do repositório Inbox.
 *
 * Responsabilidades:
 * - CRUD de UserInputs
 * - Gerenciamento de Tags (criação automática, busca)
 * - Paginação de resultados
 * - Transações para operações complexas
 */
export interface InboxRepository {
  /**
   * Cria um novo UserInput.
   *
   * Extrai tags do texto (#tag), cria tags novas se necessário,
   * e incrementa usageCount das tags existentes.
   *
   * @param params - Texto do input
   * @returns UserInput criado com tags associadas
   */
  createUserInput(params: CreateUserInputParams): Promise<UserInput>;

  /**
   * Atualiza um UserInput existente.
   *
   * Se o texto mudar, recalcula as tags automaticamente.
   * Preserva createdAt, atualiza updatedAt.
   *
   * @param params - ID e campos a atualizar
   * @returns UserInput atualizado
   * @throws UserInputNotFoundError se ID não existir
   */
  updateUserInput(params: UpdateUserInputParams): Promise<UserInput>;

  /**
   * Deleta um UserInput.
   *
   * Remove o input e suas relações (CASCADE).
   * Decrementa usageCount das tags associadas.
   *
   * @param id - ID do input a deletar
   * @throws UserInputNotFoundError se ID não existir
   */
  deleteUserInput(id: string): Promise<void>;

  /**
   * Busca um UserInput por ID.
   *
   * @param id - ID do input
   * @returns UserInput ou null se não encontrado
   */
  getUserInputById(id: string): Promise<UserInput | null>;

  /**
   * Lista UserInputs com paginação.
   *
   * Retorna em ordem cronológica crescente (mais antigo primeiro).
   * Inclui tags associadas em cada input.
   *
   * @param params - Parâmetros de paginação
   * @returns Página de resultados com hasMore flag
   */
  getUserInputs(params: GetUserInputsParams): Promise<PaginatedUserInputs>;

  /**
   * Busca tags por prefixo (autocomplete).
   *
   * Retorna ordenado por usageCount DESC (mais usadas primeiro).
   *
   * @param params - Prefixo e limite de resultados
   * @returns Lista de tags que começam com o prefixo
   */
  searchTags(params: SearchTagsParams): Promise<Tag[]>;

  /**
   * Retorna todas as tags do sistema.
   *
   * Útil para debug ou exportação.
   * Ordenado por usageCount DESC.
   *
   * @returns Lista de todas as tags
   */
  getAllTags(): Promise<Tag[]>;

  /**
   * Executa operações em uma transação.
   *
   * Garante atomicidade: se qualquer operação falhar,
   * todas são revertidas.
   *
   * @param fn - Função a executar na transação
   * @returns Resultado da função
   */
  transaction<T>(fn: (repo: InboxRepository) => Promise<T>): Promise<T>;
}
