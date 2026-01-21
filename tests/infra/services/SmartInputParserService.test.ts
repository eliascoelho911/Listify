import type { Highlight, ParseContext, ParsedInput, SmartInputParser } from '@domain/common';
import { SmartInputParserService } from '@infra/services/SmartInputParserService';

describe('SmartInputParserService', () => {
  let parser: SmartInputParser;

  beforeEach(() => {
    parser = new SmartInputParserService();
  });

  describe('list reference (@lista)', () => {
    it('should extract list name after @', () => {
      const result = parser.parse('Leite @Mercado');

      expect(result.listName).toBe('Mercado');
      expect(result.title).toBe('Leite');
    });

    it('should handle @ at the beginning', () => {
      const result = parser.parse('@Mercado Leite');

      expect(result.listName).toBe('Mercado');
      expect(result.title).toBe('Leite');
    });

    it('should stop at space after list name', () => {
      const result = parser.parse('Comprar @Mercado algo mais');

      expect(result.listName).toBe('Mercado');
      expect(result.title).toBe('Comprar algo mais');
    });

    it('should handle list reference at end of string', () => {
      const result = parser.parse('Item @Lista');

      expect(result.listName).toBe('Lista');
      expect(result.title).toBe('Item');
    });

    it('should use first @ reference when multiple present', () => {
      const result = parser.parse('Comprar @Mercado e @Padaria');

      expect(result.listName).toBe('Mercado');
      expect(result.title).toBe('Comprar e @Padaria');
    });

    it('should return null listName when no @ present', () => {
      const result = parser.parse('Simples texto');

      expect(result.listName).toBeNull();
      expect(result.title).toBe('Simples texto');
    });

    it('should handle @ at start without title', () => {
      const result = parser.parse('@Mercado');

      expect(result.listName).toBe('Mercado');
      expect(result.title).toBe('');
    });

    it('should preserve accented characters in list name', () => {
      const result = parser.parse('Item @Farmácia');

      expect(result.listName).toBe('Farmácia');
      expect(result.title).toBe('Item');
    });
  });

  describe('section reference (@lista:seção or :seção)', () => {
    it('should extract list and section with : separator', () => {
      const result = parser.parse('Pão @Mercado:Padaria');

      expect(result.listName).toBe('Mercado');
      expect(result.sectionName).toBe('Padaria');
      expect(result.title).toBe('Pão');
    });

    it('should extract section only with : prefix', () => {
      const result = parser.parse('Urgente :Hoje', { currentListName: 'Tarefas' });

      expect(result.listName).toBeNull();
      expect(result.sectionName).toBe('Hoje');
      expect(result.title).toBe('Urgente');
    });

    it('should handle : without section name', () => {
      const result = parser.parse('@Mercado:');

      expect(result.listName).toBe('Mercado');
      expect(result.sectionName).toBeNull();
    });

    it('should stop section name at space', () => {
      const result = parser.parse('@Lista:Seção algo mais');

      expect(result.listName).toBe('Lista');
      expect(result.sectionName).toBe('Seção');
      expect(result.title).toBe('algo mais');
    });

    it('should handle standalone : at beginning', () => {
      const result = parser.parse(':Urgente Comprar leite');

      expect(result.listName).toBeNull();
      expect(result.sectionName).toBe('Urgente');
      expect(result.title).toBe('Comprar leite');
    });

    it('should preserve accented characters in section name', () => {
      const result = parser.parse('@Lista:Laticínios item');

      expect(result.sectionName).toBe('Laticínios');
    });
  });

  describe('price extraction (R$X,XX)', () => {
    it('should extract price when isShoppingList is true', () => {
      const result = parser.parse('Leite R$8,50', { isShoppingList: true });

      expect(result.price).toBe(8.5);
      expect(result.title).toBe('Leite');
    });

    it('should NOT extract price when isShoppingList is false', () => {
      const result = parser.parse('Ingresso R$50', { isShoppingList: false });

      expect(result.price).toBeNull();
      expect(result.title).toBe('Ingresso R$50');
    });

    it('should NOT extract price when isShoppingList is undefined', () => {
      const result = parser.parse('Algo R$10');

      expect(result.price).toBeNull();
      expect(result.title).toBe('Algo R$10');
    });

    it('should handle R$ with space before number', () => {
      const result = parser.parse('Item R$ 10', { isShoppingList: true });

      expect(result.price).toBe(10);
    });

    it('should handle R$ without decimal', () => {
      const result = parser.parse('Item R$10', { isShoppingList: true });

      expect(result.price).toBe(10);
    });

    it('should handle R$ with comma decimal', () => {
      const result = parser.parse('Item R$10,99', { isShoppingList: true });

      expect(result.price).toBe(10.99);
    });

    it('should handle R$ with dot decimal', () => {
      const result = parser.parse('Item R$10.99', { isShoppingList: true });

      expect(result.price).toBe(10.99);
    });

    it('should handle single decimal digit', () => {
      const result = parser.parse('Item R$5,5', { isShoppingList: true });

      expect(result.price).toBe(5.5);
    });

    it('should handle large prices', () => {
      const result = parser.parse('Item R$1234,56', { isShoppingList: true });

      expect(result.price).toBe(1234.56);
    });

    it('should use first price when multiple present', () => {
      const result = parser.parse('R$10 item R$20', { isShoppingList: true });

      expect(result.price).toBe(10);
    });
  });

  describe('quantity extraction (Xunidade)', () => {
    it('should extract quantity with kg', () => {
      const result = parser.parse('Arroz 5kg');

      expect(result.quantity).toBe('5kg');
      expect(result.title).toBe('Arroz');
    });

    it('should extract quantity with g', () => {
      const result = parser.parse('Queijo 500g');

      expect(result.quantity).toBe('500g');
    });

    it('should extract quantity with L (case insensitive)', () => {
      const result = parser.parse('Leite 2L');

      expect(result.quantity).toBe('2L');
    });

    it('should extract quantity with l lowercase', () => {
      const result = parser.parse('Água 1l');

      expect(result.quantity).toBe('1l');
    });

    it('should extract quantity with ml', () => {
      const result = parser.parse('Água 500ml');

      expect(result.quantity).toBe('500ml');
    });

    it('should extract quantity with un', () => {
      const result = parser.parse('Ovos 12un');

      expect(result.quantity).toBe('12un');
    });

    it('should extract quantity with pc', () => {
      const result = parser.parse('Pão 6pc');

      expect(result.quantity).toBe('6pc');
    });

    it('should extract quantity with pç', () => {
      const result = parser.parse('Banana 3pç');

      expect(result.quantity).toBe('3pç');
    });

    it('should extract quantity with dz', () => {
      const result = parser.parse('Ovos 1dz');

      expect(result.quantity).toBe('1dz');
    });

    it('should extract quantity with cx', () => {
      const result = parser.parse('Leite 2cx');

      expect(result.quantity).toBe('2cx');
    });

    it('should handle decimal quantity with comma', () => {
      const result = parser.parse('Carne 1,5kg');

      expect(result.quantity).toBe('1,5kg');
    });

    it('should handle decimal quantity with dot', () => {
      const result = parser.parse('Carne 1.5kg');

      expect(result.quantity).toBe('1.5kg');
    });

    it('should handle space between number and unit', () => {
      const result = parser.parse('Item 2 kg');

      expect(result.quantity).toBe('2 kg');
    });

    it('should return null when no quantity pattern', () => {
      const result = parser.parse('Item sem quantidade');

      expect(result.quantity).toBeNull();
    });
  });

  describe('title extraction', () => {
    it('should return full text as title when no special patterns', () => {
      const result = parser.parse('Minha ideia importante');

      expect(result.title).toBe('Minha ideia importante');
    });

    it('should trim extra spaces from title', () => {
      const result = parser.parse('   Item   @Lista   ');

      expect(result.title).toBe('Item');
    });

    it('should handle empty string', () => {
      const result = parser.parse('');

      expect(result.title).toBe('');
      expect(result.listName).toBeNull();
      expect(result.sectionName).toBeNull();
      expect(result.quantity).toBeNull();
      expect(result.price).toBeNull();
    });

    it('should handle whitespace only', () => {
      const result = parser.parse('   ');

      expect(result.title).toBe('');
    });

    it('should preserve accented characters', () => {
      const result = parser.parse('Café especial');

      expect(result.title).toBe('Café especial');
    });

    it('should preserve emojis', () => {
      const result = parser.parse('🎉 Festa @Eventos');

      expect(result.title).toBe('🎉 Festa');
    });
  });

  describe('rawText', () => {
    it('should always contain original unmodified text', () => {
      const input = 'Leite 2L R$8,50 @Mercado:Laticínios';
      const result = parser.parse(input, { isShoppingList: true });

      expect(result.rawText).toBe(input);
    });

    it('should preserve whitespace in rawText', () => {
      const input = '   spaced   text   ';
      const result = parser.parse(input);

      expect(result.rawText).toBe(input);
    });
  });

  describe('highlights', () => {
    it('should generate highlight for list reference', () => {
      const result = parser.parse('Item @Mercado');

      expect(result.highlights).toHaveLength(1);
      expect(result.highlights[0]).toEqual({
        type: 'list',
        start: 5,
        end: 13,
        value: '@Mercado',
      });
    });

    it('should generate highlight for list with section', () => {
      const result = parser.parse('@Lista:Seção item');

      const listHighlight = result.highlights.find((h) => h.type === 'list');
      expect(listHighlight?.value).toBe('@Lista:Seção');
    });

    it('should generate highlight for standalone section', () => {
      const result = parser.parse(':Seção item');

      expect(result.highlights).toHaveLength(1);
      expect(result.highlights[0]).toEqual({
        type: 'section',
        start: 0,
        end: 6,
        value: ':Seção',
      });
    });

    it('should generate highlight for price when shopping', () => {
      const result = parser.parse('Item R$10,50', { isShoppingList: true });

      expect(result.highlights).toHaveLength(1);
      expect(result.highlights[0]).toEqual({
        type: 'price',
        start: 5,
        end: 12,
        value: 'R$10,50',
      });
    });

    it('should NOT generate price highlight when not shopping', () => {
      const result = parser.parse('Item R$10,50', { isShoppingList: false });

      const priceHighlight = result.highlights.find((h) => h.type === 'price');
      expect(priceHighlight).toBeUndefined();
    });

    it('should generate highlight for quantity', () => {
      const result = parser.parse('Leite 2L');

      expect(result.highlights).toHaveLength(1);
      expect(result.highlights[0]).toEqual({
        type: 'quantity',
        start: 6,
        end: 8,
        value: '2L',
      });
    });

    it('should generate multiple highlights', () => {
      const result = parser.parse('Leite 2L R$8,50 @Mercado', { isShoppingList: true });

      expect(result.highlights).toHaveLength(3);

      const listHighlight = result.highlights.find((h) => h.type === 'list');
      expect(listHighlight?.value).toBe('@Mercado');

      const priceHighlight = result.highlights.find((h) => h.type === 'price');
      expect(priceHighlight?.value).toBe('R$8,50');

      const quantityHighlight = result.highlights.find((h) => h.type === 'quantity');
      expect(quantityHighlight?.value).toBe('2L');
    });

    it('should order highlights by start position', () => {
      const result = parser.parse('Leite 2L R$8,50 @Mercado', { isShoppingList: true });

      for (let i = 1; i < result.highlights.length; i++) {
        expect(result.highlights[i].start).toBeGreaterThan(result.highlights[i - 1].start);
      }
    });

    it('should return empty highlights array when nothing to highlight', () => {
      const result = parser.parse('Simple text');

      expect(result.highlights).toEqual([]);
    });
  });

  describe('complex cases', () => {
    it('should parse complete shopping item', () => {
      const result = parser.parse('Leite Integral 2L R$8,50 @Mercado:Laticínios', {
        isShoppingList: true,
      });

      expect(result.title).toBe('Leite Integral');
      expect(result.listName).toBe('Mercado');
      expect(result.sectionName).toBe('Laticínios');
      expect(result.quantity).toBe('2L');
      expect(result.price).toBe(8.5);
      expect(result.highlights).toHaveLength(3);
    });

    it('should handle item without any special patterns', () => {
      const result = parser.parse('Minha ideia importante');

      expect(result.title).toBe('Minha ideia importante');
      expect(result.listName).toBeNull();
      expect(result.sectionName).toBeNull();
      expect(result.price).toBeNull();
      expect(result.quantity).toBeNull();
      expect(result.highlights).toHaveLength(0);
    });

    it('should handle only list reference', () => {
      const result = parser.parse('@Mercado');

      expect(result.title).toBe('');
      expect(result.listName).toBe('Mercado');
    });

    it('should handle multiple tokens in order', () => {
      const result = parser.parse('@Lista Item 500g R$5', { isShoppingList: true });

      expect(result.listName).toBe('Lista');
      expect(result.title).toBe('Item');
      expect(result.quantity).toBe('500g');
      expect(result.price).toBe(5);
    });

    it('should handle section with current list context', () => {
      const result = parser.parse('Item :Frios', { currentListName: 'Mercado' });

      expect(result.listName).toBeNull();
      expect(result.sectionName).toBe('Frios');
      expect(result.title).toBe('Item');
    });

    it('should handle price and quantity together', () => {
      const result = parser.parse('Arroz 5kg R$25,90', { isShoppingList: true });

      expect(result.title).toBe('Arroz');
      expect(result.quantity).toBe('5kg');
      expect(result.price).toBe(25.9);
    });
  });

  describe('edge cases', () => {
    it('should handle @ in email-like text without space', () => {
      // Note: This tests current behavior - @ without space before stops name capture
      const result = parser.parse('email@test.com');

      expect(result.listName).toBe('test.com');
    });

    it('should handle colon in middle of word', () => {
      const result = parser.parse('Time: 10:30');

      expect(result.sectionName).toBeNull(); // : must be preceded by space or @list
    });

    it('should handle R$ without number', () => {
      const result = parser.parse('Item R$', { isShoppingList: true });

      expect(result.price).toBeNull();
    });

    it('should handle just number without unit', () => {
      const result = parser.parse('Comprar 5 items');

      expect(result.quantity).toBeNull(); // needs unit
    });

    it('should handle very long input', () => {
      const longTitle = 'A'.repeat(1000);
      const result = parser.parse(`${longTitle} @Lista`);

      expect(result.listName).toBe('Lista');
      expect(result.title).toBe(longTitle);
    });
  });

  describe('ParsedInput structure', () => {
    it('should return all expected fields', () => {
      const result = parser.parse('Test');

      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('listName');
      expect(result).toHaveProperty('sectionName');
      expect(result).toHaveProperty('quantity');
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('rawText');
      expect(result).toHaveProperty('highlights');
    });

    it('should have correct types for all fields', () => {
      const result = parser.parse('Item 2kg R$10 @Lista:Seção', { isShoppingList: true });

      expect(typeof result.title).toBe('string');
      expect(typeof result.listName).toBe('string');
      expect(typeof result.sectionName).toBe('string');
      expect(typeof result.quantity).toBe('string');
      expect(typeof result.price).toBe('number');
      expect(typeof result.rawText).toBe('string');
      expect(Array.isArray(result.highlights)).toBe(true);
    });
  });
});
