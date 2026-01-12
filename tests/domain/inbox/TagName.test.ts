import { MAX_TAG_LENGTH } from '@domain/inbox/constants';
import { createTagName, isValidTagName } from '@domain/inbox/value-objects/TagName';

describe('TagName', () => {
  describe('createTagName', () => {
    it('should create a valid tag name from simple string', () => {
      const result = createTagName('compras');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.tagName.value).toBe('compras');
      }
    });

    it('should normalize to lowercase', () => {
      const result = createTagName('COMPRAS');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.tagName.value).toBe('compras');
      }
    });

    it('should trim whitespace', () => {
      const result = createTagName('  compras  ');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.tagName.value).toBe('compras');
      }
    });

    it('should remove # prefix', () => {
      const result = createTagName('#compras');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.tagName.value).toBe('compras');
      }
    });

    it('should accept accented characters', () => {
      const result = createTagName('café');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.tagName.value).toBe('café');
      }
    });

    it('should accept numbers', () => {
      const result = createTagName('lista2024');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.tagName.value).toBe('lista2024');
      }
    });

    it('should accept underscores', () => {
      const result = createTagName('lista_compras');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.tagName.value).toBe('lista_compras');
      }
    });

    it('should return error for empty string', () => {
      const result = createTagName('');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('empty');
      }
    });

    it('should return error for whitespace-only string', () => {
      const result = createTagName('   ');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('empty');
      }
    });

    it('should return error for string exceeding max length', () => {
      const longName = 'a'.repeat(MAX_TAG_LENGTH + 1);
      const result = createTagName(longName);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('too_long');
        if (result.error.type === 'too_long') {
          expect(result.error.maxLength).toBe(MAX_TAG_LENGTH);
        }
      }
    });

    it('should accept string at max length', () => {
      const maxName = 'a'.repeat(MAX_TAG_LENGTH);
      const result = createTagName(maxName);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.tagName.value).toBe(maxName);
      }
    });

    it('should return error for string with invalid characters (spaces)', () => {
      const result = createTagName('lista compras');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('invalid_characters');
      }
    });

    it('should return error for string with special characters', () => {
      const result = createTagName('lista@compras');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('invalid_characters');
      }
    });

    it('should return error for string with hyphen', () => {
      const result = createTagName('lista-compras');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('invalid_characters');
      }
    });
  });

  describe('isValidTagName', () => {
    it('should return true for valid tag names', () => {
      expect(isValidTagName('compras')).toBe(true);
      expect(isValidTagName('LISTA')).toBe(true);
      expect(isValidTagName('#tag')).toBe(true);
      expect(isValidTagName('café')).toBe(true);
      expect(isValidTagName('lista_2024')).toBe(true);
    });

    it('should return false for invalid tag names', () => {
      expect(isValidTagName('')).toBe(false);
      expect(isValidTagName('   ')).toBe(false);
      expect(isValidTagName('lista compras')).toBe(false);
      expect(isValidTagName('a'.repeat(31))).toBe(false);
    });
  });
});
