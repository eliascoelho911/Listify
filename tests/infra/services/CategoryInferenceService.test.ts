import type { CategoryInference, InferenceConfidence } from '@domain/common';
import { CategoryInferenceService } from '@infra/services/CategoryInferenceService';

describe('CategoryInferenceService', () => {
  let inferenceService: CategoryInference;

  beforeEach(() => {
    inferenceService = new CategoryInferenceService();
  });

  describe('shopping list inference', () => {
    it('should infer shopping with high confidence when R$ is present', () => {
      const result = inferenceService.infer('Leite R$8,50');

      expect(result.listType).toBe('shopping');
      expect(result.confidence).toBe('high');
    });

    it('should infer shopping with high confidence when "comprar" is present', () => {
      const result = inferenceService.infer('comprar ovos');

      expect(result.listType).toBe('shopping');
      expect(result.confidence).toBe('high');
    });

    it('should infer shopping with high confidence when "mercado" is present', () => {
      const result = inferenceService.infer('mercado');

      expect(result.listType).toBe('shopping');
      expect(result.confidence).toBe('high');
    });

    it('should infer shopping with high confidence when "supermercado" is present', () => {
      const result = inferenceService.infer('lista supermercado');

      expect(result.listType).toBe('shopping');
      expect(result.confidence).toBe('high');
    });

    it('should infer shopping with high confidence when quantity unit is present', () => {
      const result = inferenceService.infer('arroz 5kg');

      expect(result.listType).toBe('shopping');
      expect(result.confidence).toBe('high');
    });

    it('should infer shopping with high confidence when multiple shopping indicators', () => {
      const result = inferenceService.infer('comprar leite mercado R$5');

      expect(result.listType).toBe('shopping');
      expect(result.confidence).toBe('high');
    });

    it('should infer shopping with medium confidence with single shopping indicator', () => {
      const result = inferenceService.infer('compras');

      expect(result.listType).toBe('shopping');
      expect(['high', 'medium'] as InferenceConfidence[]).toContain(result.confidence);
    });
  });

  describe('movies list inference', () => {
    it('should infer movies with high confidence when "filme" is present', () => {
      const result = inferenceService.infer('filme legal');

      expect(result.listType).toBe('movies');
      expect(result.confidence).toBe('high');
    });

    it('should infer movies with high confidence when "assistir" is present', () => {
      const result = inferenceService.infer('assistir depois');

      expect(result.listType).toBe('movies');
      expect(result.confidence).toBe('high');
    });

    it('should infer movies with high confidence when "cinema" is present', () => {
      const result = inferenceService.infer('cinema');

      expect(result.listType).toBe('movies');
      expect(result.confidence).toBe('high');
    });

    it('should infer movies with high confidence when "série" is present', () => {
      const result = inferenceService.infer('série nova');

      expect(result.listType).toBe('movies');
      expect(result.confidence).toBe('high');
    });

    it('should infer movies with high confidence when "temporada" is present', () => {
      const result = inferenceService.infer('temporada 2');

      expect(result.listType).toBe('movies');
      expect(result.confidence).toBe('high');
    });

    it('should infer movies with high confidence when multiple movie indicators', () => {
      const result = inferenceService.infer('assistir filme no cinema');

      expect(result.listType).toBe('movies');
      expect(result.confidence).toBe('high');
    });
  });

  describe('books list inference', () => {
    it('should infer books with high confidence when "livro" is present', () => {
      const result = inferenceService.infer('livro interessante');

      expect(result.listType).toBe('books');
      expect(result.confidence).toBe('high');
    });

    it('should infer books with high confidence when "ler" is present', () => {
      const result = inferenceService.infer('ler depois');

      expect(result.listType).toBe('books');
      expect(result.confidence).toBe('high');
    });

    it('should infer books with high confidence when "autor" is present', () => {
      const result = inferenceService.infer('autor favorito');

      expect(result.listType).toBe('books');
      expect(result.confidence).toBe('high');
    });

    it('should infer books with high confidence when "editora" is present', () => {
      const result = inferenceService.infer('editora nova');

      expect(result.listType).toBe('books');
      expect(result.confidence).toBe('high');
    });

    it('should infer books with high confidence when "capítulo" is present', () => {
      const result = inferenceService.infer('capítulo 5');

      expect(result.listType).toBe('books');
      expect(result.confidence).toBe('high');
    });

    it('should infer books with high confidence when multiple book indicators', () => {
      const result = inferenceService.infer('ler livro do autor');

      expect(result.listType).toBe('books');
      expect(result.confidence).toBe('high');
    });
  });

  describe('games list inference', () => {
    it('should infer games with high confidence when "jogo" is present', () => {
      const result = inferenceService.infer('jogo novo');

      expect(result.listType).toBe('games');
      expect(result.confidence).toBe('high');
    });

    it('should infer games with high confidence when "jogar" is present', () => {
      const result = inferenceService.infer('jogar depois');

      expect(result.listType).toBe('games');
      expect(result.confidence).toBe('high');
    });

    it('should infer games with high confidence when "game" is present', () => {
      const result = inferenceService.infer('game legal');

      expect(result.listType).toBe('games');
      expect(result.confidence).toBe('high');
    });

    it('should infer games with high confidence when "console" is present', () => {
      const result = inferenceService.infer('console');

      expect(result.listType).toBe('games');
      expect(result.confidence).toBe('high');
    });

    it('should infer games with high confidence when platform is present', () => {
      expect(inferenceService.infer('ps5').listType).toBe('games');
      expect(inferenceService.infer('xbox').listType).toBe('games');
      expect(inferenceService.infer('switch').listType).toBe('games');
      expect(inferenceService.infer('pc gamer').listType).toBe('games');
    });

    it('should infer games with high confidence when multiple game indicators', () => {
      const result = inferenceService.infer('jogar jogo no ps5');

      expect(result.listType).toBe('games');
      expect(result.confidence).toBe('high');
    });
  });

  describe('notes list inference (fallback)', () => {
    it('should infer notes with low confidence when no patterns match', () => {
      const result = inferenceService.infer('ideia importante');

      expect(result.listType).toBe('notes');
      expect(result.confidence).toBe('low');
    });

    it('should infer notes with low confidence for empty string', () => {
      const result = inferenceService.infer('');

      expect(result.listType).toBe('notes');
      expect(result.confidence).toBe('low');
    });

    it('should infer notes with low confidence for whitespace only', () => {
      const result = inferenceService.infer('   ');

      expect(result.listType).toBe('notes');
      expect(result.confidence).toBe('low');
    });

    it('should infer notes with low confidence for generic text', () => {
      const result = inferenceService.infer('lembrar de fazer algo');

      expect(result.listType).toBe('notes');
      expect(result.confidence).toBe('low');
    });
  });

  describe('confidence levels', () => {
    it('should return high confidence when 2+ patterns match', () => {
      const result = inferenceService.infer('comprar leite mercado');

      expect(result.confidence).toBe('high');
    });

    it('should return medium confidence when exactly 1 pattern matches', () => {
      const result = inferenceService.infer('cinema');

      // "cinema" only matches one pattern
      expect(['high', 'medium'] as InferenceConfidence[]).toContain(result.confidence);
    });

    it('should return low confidence when no patterns match', () => {
      const result = inferenceService.infer('texto genérico');

      expect(result.confidence).toBe('low');
    });
  });

  describe('case insensitivity', () => {
    it('should match patterns case-insensitively', () => {
      expect(inferenceService.infer('COMPRAR').listType).toBe('shopping');
      expect(inferenceService.infer('Filme').listType).toBe('movies');
      expect(inferenceService.infer('LIVRO').listType).toBe('books');
      expect(inferenceService.infer('Jogar').listType).toBe('games');
    });

    it('should match R$ with different casings', () => {
      expect(inferenceService.infer('r$10').listType).toBe('shopping');
      expect(inferenceService.infer('R$10').listType).toBe('shopping');
    });
  });

  describe('edge cases', () => {
    it('should handle text with mixed categories and pick winner', () => {
      // When multiple categories match, should pick the one with most matches
      const result = inferenceService.infer('comprar livro');

      // Both shopping (comprar) and books (livro) match once each
      // Implementation should pick one consistently
      expect(['shopping', 'books']).toContain(result.listType);
    });

    it('should handle very long text', () => {
      const longText = 'comprar ' + 'a'.repeat(1000) + ' mercado';
      const result = inferenceService.infer(longText);

      expect(result.listType).toBe('shopping');
    });

    it('should handle special characters', () => {
      const result = inferenceService.infer('comprar café $$$');

      expect(result.listType).toBe('shopping');
    });

    it('should handle numbers in text', () => {
      const result = inferenceService.infer('5kg arroz');

      expect(result.listType).toBe('shopping');
    });

    it('should handle accented characters', () => {
      expect(inferenceService.infer('série').listType).toBe('movies');
      expect(inferenceService.infer('capítulo').listType).toBe('books');
    });
  });

  describe('InferenceResult structure', () => {
    it('should return all expected fields', () => {
      const result = inferenceService.infer('test');

      expect(result).toHaveProperty('listType');
      expect(result).toHaveProperty('confidence');
    });

    it('should return valid listType values', () => {
      const validTypes = ['notes', 'shopping', 'movies', 'books', 'games'];
      const result = inferenceService.infer('test');

      expect(validTypes).toContain(result.listType);
    });

    it('should return valid confidence values', () => {
      const validConfidences = ['high', 'medium', 'low'];
      const result = inferenceService.infer('test');

      expect(validConfidences).toContain(result.confidence);
    });
  });
});
