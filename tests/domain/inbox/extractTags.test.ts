import { extractTags } from '@domain/inbox/use-cases/extractTags';

describe('extractTags', () => {
  describe('tag extraction', () => {
    it('should extract a single tag from text', () => {
      const result = extractTags({ text: 'Buy milk #compras' });

      expect(result.tagNames).toEqual(['compras']);
    });

    it('should extract multiple tags from text', () => {
      const result = extractTags({ text: 'Buy milk #compras #mercado #urgente' });

      expect(result.tagNames).toHaveLength(3);
      expect(result.tagNames).toContain('compras');
      expect(result.tagNames).toContain('mercado');
      expect(result.tagNames).toContain('urgente');
    });

    it('should return empty array when no tags present', () => {
      const result = extractTags({ text: 'Buy milk from store' });

      expect(result.tagNames).toEqual([]);
    });

    it('should handle empty text', () => {
      const result = extractTags({ text: '' });

      expect(result.tagNames).toEqual([]);
      expect(result.textWithoutTags).toBe('');
    });

    it('should handle text with only a tag', () => {
      const result = extractTags({ text: '#compras' });

      expect(result.tagNames).toEqual(['compras']);
      expect(result.textWithoutTags).toBe('');
    });
  });

  describe('tag normalization', () => {
    it('should normalize tags to lowercase', () => {
      const result = extractTags({ text: 'Note #COMPRAS #Mercado #urgENTE' });

      expect(result.tagNames).toEqual(['compras', 'mercado', 'urgente']);
    });

    it('should remove duplicate tags (case-insensitive)', () => {
      const result = extractTags({ text: '#compras #COMPRAS #Compras' });

      expect(result.tagNames).toEqual(['compras']);
    });

    it('should preserve order of first occurrence', () => {
      const result = extractTags({ text: '#primeiro #segundo #terceiro' });

      expect(result.tagNames).toEqual(['primeiro', 'segundo', 'terceiro']);
    });
  });

  describe('tag validation', () => {
    it('should accept tags with accented characters', () => {
      const result = extractTags({ text: '#café #açúcar #pão' });

      expect(result.tagNames).toContain('café');
      expect(result.tagNames).toContain('açúcar');
      expect(result.tagNames).toContain('pão');
    });

    it('should accept tags with numbers', () => {
      const result = extractTags({ text: '#lista2024 #projeto123' });

      expect(result.tagNames).toContain('lista2024');
      expect(result.tagNames).toContain('projeto123');
    });

    it('should accept tags with underscores', () => {
      const result = extractTags({ text: '#lista_compras #to_do' });

      expect(result.tagNames).toContain('lista_compras');
      expect(result.tagNames).toContain('to_do');
    });

    it('should ignore tags exceeding max length', () => {
      const longTag = 'a'.repeat(31);
      const result = extractTags({ text: `#${longTag} #valid` });

      expect(result.tagNames).toEqual(['valid']);
    });

    it('should accept tags at max length', () => {
      const maxTag = 'a'.repeat(30);
      const result = extractTags({ text: `#${maxTag}` });

      expect(result.tagNames).toEqual([maxTag]);
    });
  });

  describe('textWithoutTags', () => {
    it('should remove tags from text', () => {
      const result = extractTags({ text: 'Buy milk #compras from store' });

      expect(result.textWithoutTags).toBe('Buy milk from store');
    });

    it('should handle multiple spaces after removing tags', () => {
      const result = extractTags({ text: 'Item #tag1   #tag2 description' });

      expect(result.textWithoutTags).toBe('Item description');
    });

    it('should trim result', () => {
      const result = extractTags({ text: '#tag1 Buy milk #tag2' });

      expect(result.textWithoutTags).toBe('Buy milk');
    });

    it('should return empty string when text is only tags', () => {
      const result = extractTags({ text: '#tag1 #tag2 #tag3' });

      expect(result.textWithoutTags).toBe('');
    });
  });

  describe('edge cases', () => {
    it('should not extract incomplete hashtags', () => {
      const result = extractTags({ text: 'This is a # without tag' });

      expect(result.tagNames).toEqual([]);
    });

    it('should handle tags at start of text', () => {
      const result = extractTags({ text: '#urgente Buy milk' });

      expect(result.tagNames).toEqual(['urgente']);
      expect(result.textWithoutTags).toBe('Buy milk');
    });

    it('should handle tags at end of text', () => {
      const result = extractTags({ text: 'Buy milk #urgente' });

      expect(result.tagNames).toEqual(['urgente']);
      expect(result.textWithoutTags).toBe('Buy milk');
    });

    it('should handle tags in the middle of text', () => {
      const result = extractTags({ text: 'Buy #urgente milk' });

      expect(result.tagNames).toEqual(['urgente']);
      expect(result.textWithoutTags).toBe('Buy milk');
    });

    it('should handle multiple tags together', () => {
      const result = extractTags({ text: '#tag1#tag2#tag3' });

      expect(result.tagNames).toHaveLength(3);
    });
  });
});
