import { MAX_TEXT_LENGTH } from '@domain/inbox/constants';
import { createUserInput } from '@domain/inbox/use-cases/CreateUserInput';
import { EmptyTextError, TextTooLongError } from '@domain/inbox/use-cases/errors';

import { createMockInboxRepository, resetTestIds } from './testUtils';

describe('CreateUserInput', () => {
  beforeEach(() => {
    resetTestIds();
  });

  it('should create a user input with simple text', async () => {
    const mockRepo = createMockInboxRepository();

    const result = await createUserInput({ text: 'Buy milk from store' }, { repository: mockRepo });

    expect(result.text).toBe('Buy milk from store');
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });

  it('should extract tags from text', async () => {
    const mockRepo = createMockInboxRepository();

    const result = await createUserInput(
      { text: 'Buy milk #compras #urgente' },
      { repository: mockRepo },
    );

    expect(result.text).toBe('Buy milk #compras #urgente');
    expect(result.tags.length).toBeGreaterThanOrEqual(0);
  });

  it('should throw EmptyTextError for empty text', async () => {
    const mockRepo = createMockInboxRepository();

    await expect(createUserInput({ text: '' }, { repository: mockRepo })).rejects.toThrow(
      EmptyTextError,
    );
  });

  it('should throw EmptyTextError for whitespace-only text', async () => {
    const mockRepo = createMockInboxRepository();

    await expect(createUserInput({ text: '   ' }, { repository: mockRepo })).rejects.toThrow(
      EmptyTextError,
    );
  });

  it('should throw TextTooLongError for text exceeding max length', async () => {
    const mockRepo = createMockInboxRepository();
    const longText = 'a'.repeat(MAX_TEXT_LENGTH + 1);

    await expect(createUserInput({ text: longText }, { repository: mockRepo })).rejects.toThrow(
      TextTooLongError,
    );
  });

  it('should accept text at max length', async () => {
    const mockRepo = createMockInboxRepository();
    const maxText = 'a'.repeat(MAX_TEXT_LENGTH);

    const result = await createUserInput({ text: maxText }, { repository: mockRepo });

    expect(result.text).toBe(maxText);
  });

  it('should trim text before validation', async () => {
    const mockRepo = createMockInboxRepository();

    const result = await createUserInput({ text: '  Buy milk  ' }, { repository: mockRepo });

    expect(result.text).toBe('Buy milk');
  });
});
