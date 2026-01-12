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
  readonly maxLength: number;

  constructor(maxLength: number) {
    super(`Input text exceeds maximum length of ${maxLength} characters`);
    this.name = 'TextTooLongError';
    this.maxLength = maxLength;
  }
}

/**
 * Erro: UserInput não encontrado.
 */
export class UserInputNotFoundError extends InboxDomainError {
  readonly inputId: string;

  constructor(id: string) {
    super(`UserInput not found: ${id}`);
    this.name = 'UserInputNotFoundError';
    this.inputId = id;
  }
}

/**
 * Erro: Nome de tag inválido.
 */
export class InvalidTagNameError extends InboxDomainError {
  readonly tagName: string;
  readonly reason: string;

  constructor(name: string, reason: string) {
    super(`Invalid tag name "${name}": ${reason}`);
    this.name = 'InvalidTagNameError';
    this.tagName = name;
    this.reason = reason;
  }
}
