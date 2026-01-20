import type { CreateSectionInput, Section, UpdateSectionInput } from '@domain/section';

describe('Section Entity', () => {
  describe('Section type structure', () => {
    it('should have correct shape', () => {
      const section: Section = {
        id: 'uuid-1',
        listId: 'list-uuid',
        name: 'Padaria',
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(section.id).toBe('uuid-1');
      expect(section.listId).toBe('list-uuid');
      expect(section.name).toBe('Padaria');
      expect(section.sortOrder).toBe(0);
    });

    it('should require listId (sections are always bound to a list)', () => {
      const section: Section = {
        id: '1',
        listId: 'required-list-id',
        name: 'Section Name',
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(section.listId).toBeDefined();
      expect(typeof section.listId).toBe('string');
    });
  });

  describe('CreateSectionInput type', () => {
    it('should exclude id, createdAt, and updatedAt', () => {
      const input: CreateSectionInput = {
        listId: 'list-1',
        name: 'Nova Seção',
        sortOrder: 0,
      };

      expect(input.listId).toBe('list-1');
      expect(input.name).toBe('Nova Seção');
      expect(input.sortOrder).toBe(0);
    });

    it('should require listId', () => {
      const input: CreateSectionInput = {
        listId: 'mandatory-list-id',
        name: 'Section',
        sortOrder: 1,
      };

      expect(input.listId).toBeDefined();
    });
  });

  describe('UpdateSectionInput type', () => {
    it('should make name and sortOrder optional', () => {
      const fullUpdate: UpdateSectionInput = {
        name: 'Nome Atualizado',
        sortOrder: 5,
        updatedAt: new Date(),
      };

      expect(fullUpdate.name).toBe('Nome Atualizado');
      expect(fullUpdate.sortOrder).toBe(5);

      const partialUpdate: UpdateSectionInput = {
        name: 'Apenas Nome',
      };

      expect(partialUpdate.name).toBe('Apenas Nome');
      expect(partialUpdate.sortOrder).toBeUndefined();
    });

    it('should not allow updating listId', () => {
      const update: UpdateSectionInput = {
        name: 'Updated Name',
      };

      // @ts-expect-error listId should not be updatable
      expect(update.listId).toBeUndefined();
    });
  });

  describe('Entity traits composition', () => {
    it('should have Entity trait (id)', () => {
      const section: Section = {
        id: 'entity-id',
        listId: 'list-1',
        name: 'Test',
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(typeof section.id).toBe('string');
    });

    it('should have Timestamped trait (createdAt, updatedAt)', () => {
      const now = new Date();
      const section: Section = {
        id: '1',
        listId: 'list-1',
        name: 'Test',
        sortOrder: 0,
        createdAt: now,
        updatedAt: now,
      };

      expect(section.createdAt).toBeInstanceOf(Date);
      expect(section.updatedAt).toBeInstanceOf(Date);
    });

    it('should have Sortable trait (sortOrder)', () => {
      const section: Section = {
        id: '1',
        listId: 'list-1',
        name: 'Test',
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(section.sortOrder).toBe(3);
    });
  });
});
