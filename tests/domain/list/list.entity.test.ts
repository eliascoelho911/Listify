import type { CreateListInput, List, ListType, UpdateListInput } from '@domain/list';

describe('List Entity', () => {
  describe('List type structure', () => {
    it('should have correct shape for NotesList', () => {
      const notesList: List = {
        id: 'uuid-1',
        name: 'Notas',
        description: 'Lista de notas pré-fabricada',
        listType: 'notes',
        isPrefabricated: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(notesList.id).toBe('uuid-1');
      expect(notesList.name).toBe('Notas');
      expect(notesList.listType).toBe('notes');
      expect(notesList.isPrefabricated).toBe(true);
    });

    it('should have correct shape for ShoppingList', () => {
      const shoppingList: List = {
        id: 'uuid-2',
        name: 'Mercado',
        listType: 'shopping',
        isPrefabricated: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(shoppingList.listType).toBe('shopping');
      expect(shoppingList.isPrefabricated).toBe(false);
    });

    it('should have correct shape for MoviesList', () => {
      const moviesList: List = {
        id: 'uuid-3',
        name: 'Filmes para Ver',
        listType: 'movies',
        isPrefabricated: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(moviesList.listType).toBe('movies');
    });

    it('should have correct shape for BooksList', () => {
      const booksList: List = {
        id: 'uuid-4',
        name: 'Livros para Ler',
        listType: 'books',
        isPrefabricated: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(booksList.listType).toBe('books');
    });

    it('should have correct shape for GamesList', () => {
      const gamesList: List = {
        id: 'uuid-5',
        name: 'Games para Jogar',
        listType: 'games',
        isPrefabricated: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(gamesList.listType).toBe('games');
    });
  });

  describe('ListType discriminated union', () => {
    it('should contain all valid list types', () => {
      const validTypes: ListType[] = ['notes', 'shopping', 'movies', 'books', 'games'];

      validTypes.forEach((type) => {
        expect(['notes', 'shopping', 'movies', 'books', 'games']).toContain(type);
      });
    });

    it('should narrow type correctly when checking listType', () => {
      const list: List = {
        id: '1',
        name: 'Test',
        listType: 'shopping',
        isPrefabricated: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (list.listType === 'shopping') {
        // TypeScript should narrow to ShoppingList
        expect(list.listType).toBe('shopping');
      }
    });
  });

  describe('CreateListInput type', () => {
    it('should exclude id, createdAt, and updatedAt', () => {
      const input: CreateListInput = {
        name: 'Nova Lista',
        listType: 'shopping',
        isPrefabricated: false,
      };

      expect(input.name).toBe('Nova Lista');
      expect(input.listType).toBe('shopping');
      // @ts-expect-error id should not exist on CreateListInput
      expect(input.id).toBeUndefined();
    });

    it('should allow optional description', () => {
      const inputWithDescription: CreateListInput = {
        name: 'Lista com Descrição',
        description: 'Uma descrição opcional',
        listType: 'notes',
        isPrefabricated: true,
      };

      expect(inputWithDescription.description).toBe('Uma descrição opcional');

      const inputWithoutDescription: CreateListInput = {
        name: 'Lista sem Descrição',
        listType: 'shopping',
        isPrefabricated: false,
      };

      expect(inputWithoutDescription.description).toBeUndefined();
    });
  });

  describe('UpdateListInput type', () => {
    it('should make all fields optional except id and createdAt', () => {
      const fullUpdate: UpdateListInput = {
        name: 'Nome Atualizado',
        description: 'Nova descrição',
        updatedAt: new Date(),
      };

      expect(fullUpdate.name).toBe('Nome Atualizado');

      const partialUpdate: UpdateListInput = {
        name: 'Apenas Nome',
      };

      expect(partialUpdate.name).toBe('Apenas Nome');
      expect(partialUpdate.description).toBeUndefined();
    });
  });

  describe('Entity traits composition', () => {
    it('should have Entity trait (id)', () => {
      const list: List = {
        id: 'entity-id',
        name: 'Test',
        listType: 'notes',
        isPrefabricated: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(typeof list.id).toBe('string');
    });

    it('should have Timestamped trait (createdAt, updatedAt)', () => {
      const now = new Date();
      const list: List = {
        id: '1',
        name: 'Test',
        listType: 'notes',
        isPrefabricated: false,
        createdAt: now,
        updatedAt: now,
      };

      expect(list.createdAt).toBeInstanceOf(Date);
      expect(list.updatedAt).toBeInstanceOf(Date);
    });
  });
});
