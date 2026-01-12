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
 * Resultado paginado de UserInputs.
 * Usado pelo use case GetUserInputs para scroll infinito.
 */
export type PaginatedUserInputs = {
  /** Lista de inputs da página atual */
  readonly items: UserInput[];

  /** Indica se há mais itens para carregar */
  readonly hasMore: boolean;

  /** Total de itens */
  readonly total: number;

  /** Offset usado na query */
  readonly offset: number;

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
