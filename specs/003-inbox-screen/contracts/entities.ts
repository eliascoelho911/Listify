/**
 * Entidades do domínio Inbox
 *
 * Estes tipos definem as estruturas de dados do domínio.
 * São usados em toda a aplicação: domain, data, presentation.
 */

// =============================================================================
// TAG
// =============================================================================

/**
 * Representa uma tag/etiqueta para categorização de inputs.
 *
 * Tags são extraídas do texto do usuário (padrão #tag) ou criadas manualmente.
 * São case-insensitive e únicas no sistema.
 */
export type Tag = {
  /** UUID único da tag */
  readonly id: string;

  /** Nome normalizado (lowercase, sem #) */
  readonly name: string;

  /** Contador de quantas vezes a tag foi usada */
  readonly usageCount: number;

  /** Data de criação da tag */
  readonly createdAt: Date;
};

// =============================================================================
// USER INPUT
// =============================================================================

/**
 * Representa uma entrada de texto do usuário no inbox.
 *
 * UserInputs são os itens principais do inbox, contendo texto livre
 * com suporte a tags para organização.
 */
export type UserInput = {
  /** UUID único do input */
  readonly id: string;

  /** Conteúdo de texto do input */
  readonly text: string;

  /** Data de criação (imutável após criação) */
  readonly createdAt: Date;

  /** Data da última atualização */
  readonly updatedAt: Date;

  /** Tags associadas ao input */
  readonly tags: Tag[];
};

// =============================================================================
// INPUT TAG (Junction)
// =============================================================================

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

// =============================================================================
// PAGINATED RESULT
// =============================================================================

/**
 * Resultado paginado de UserInputs.
 * Usado pelo use case GetUserInputs para scroll infinito.
 */
export type PaginatedUserInputs = {
  /** Lista de inputs da página atual */
  readonly inputs: UserInput[];

  /** Indica se há mais itens para carregar */
  readonly hasMore: boolean;

  /** Total de itens (opcional, para UI) */
  readonly total?: number;
};

// =============================================================================
// DATE GROUP
// =============================================================================

/**
 * Agrupamento de inputs por data.
 * Usado na UI para exibir separadores de data (DateBadge).
 */
export type DateGroup = {
  /** Data do grupo (início do dia) */
  readonly date: Date;

  /** Label formatado ("Hoje", "Ontem", "08 jan") */
  readonly label: string;

  /** Inputs pertencentes a este grupo */
  readonly inputs: UserInput[];
};
