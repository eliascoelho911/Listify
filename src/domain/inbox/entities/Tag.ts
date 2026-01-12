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
