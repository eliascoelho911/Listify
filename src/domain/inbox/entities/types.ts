import type { UserInput } from './UserInput';

/**
 * Representa a relação N:N entre UserInput e Tag.
 * Usado internamente pelo repository para persistência.
 */
export type InputTag = {
  /** FK para UserInput */
  readonly inputId: string;

  /** FK para Tag */
  readonly tagId: string;
};

/**
 * Cursor para paginação baseada em cursor.
 * Usa createdAt + id para garantir unicidade e estabilidade.
 */
export type PaginationCursor = {
  readonly createdAt: string;
  readonly id: string;
};

/**
 * Resultado paginado de UserInputs.
 * Usado pelo use case GetUserInputs para scroll infinito.
 */
export type PaginatedUserInputs = {
  /** Lista de inputs da página atual */
  readonly items: UserInput[];

  /** Indica se há mais itens para carregar */
  readonly hasMore: boolean;

  /** Cursor para a próxima página (null se não houver mais) */
  readonly nextCursor: PaginationCursor | null;

  /** Limite usado na query */
  readonly limit: number;
};

/**
 * Variante visual do DateBadge baseada no contexto temporal.
 */
export type DateBadgeVariant = 'today' | 'yesterday' | 'default';

/**
 * Agrupamento de inputs por data.
 * Usado na UI para exibir separadores de data (DateBadge).
 */
export type DateGroup = {
  /** Data do grupo (início do dia) */
  readonly date: Date;

  /** Label formatado ("Hoje", "Ontem", "08 jan") */
  readonly label: string;

  /** Variante visual para o DateBadge */
  readonly variant: DateBadgeVariant;

  /** Inputs pertencentes a este grupo */
  readonly inputs: UserInput[];
};
