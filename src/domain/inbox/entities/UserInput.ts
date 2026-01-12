import type { Tag } from './Tag';

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
