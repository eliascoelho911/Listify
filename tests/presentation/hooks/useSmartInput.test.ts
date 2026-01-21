/**
 * useSmartInput Hook Tests
 */

import { act, renderHook } from '@testing-library/react-native';

import type { ParsedInput, SmartInputParser } from '@domain/common';
import type { ListType } from '@domain/list';
import { useSmartInput } from '@presentation/hooks/useSmartInput';

// Mock parser implementation
const createMockParser = (): SmartInputParser => ({
  parse: jest.fn((text: string): ParsedInput => {
    // Simple mock implementation
    const listMatch = /@(\w+)/.exec(text);
    const listName = listMatch ? listMatch[1] : null;

    // Extract title (text without @mention)
    const title = text.replace(/@\w+\s*/, '').trim();

    return {
      title,
      listName,
      sectionName: null,
      quantity: null,
      price: null,
      rawText: text,
      highlights: listName
        ? [
            {
              type: 'list',
              start: text.indexOf('@'),
              end: text.indexOf('@') + listName.length + 1,
              value: `@${listName}`,
            },
          ]
        : [],
    };
  }),
});

const mockAvailableLists: { id: string; name: string; listType: ListType }[] = [
  { id: '1', name: 'Mercado', listType: 'shopping' },
  { id: '2', name: 'Mercado Central', listType: 'shopping' },
  { id: '3', name: 'Filmes para Ver', listType: 'movies' },
  { id: '4', name: 'Minhas Notas', listType: 'notes' },
];

describe('useSmartInput', () => {
  let mockParser: SmartInputParser;

  beforeEach(() => {
    mockParser = createMockParser();
    jest.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should initialize with empty value', () => {
      const { result } = renderHook(() => useSmartInput({ parser: mockParser }));

      expect(result.current.value).toBe('');
      expect(result.current.visible).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should initialize with provided initial value', () => {
      const { result } = renderHook(() =>
        useSmartInput({
          parser: mockParser,
          initialValue: 'Test item',
        }),
      );

      expect(result.current.value).toBe('Test item');
    });

    it('should return empty parsed result for empty value', () => {
      const { result } = renderHook(() => useSmartInput({ parser: mockParser }));

      expect(result.current.parsed.title).toBe('');
      expect(result.current.parsed.listName).toBeNull();
      expect(result.current.parsed.highlights).toHaveLength(0);
    });
  });

  describe('setValue', () => {
    it('should update value when setValue is called', () => {
      const { result } = renderHook(() => useSmartInput({ parser: mockParser }));

      act(() => {
        result.current.setValue('New value');
      });

      expect(result.current.value).toBe('New value');
    });

    it('should parse value when it changes', () => {
      const { result } = renderHook(() => useSmartInput({ parser: mockParser }));

      act(() => {
        result.current.setValue('@Mercado Leite');
      });

      expect(mockParser.parse).toHaveBeenCalledWith('@Mercado Leite', expect.any(Object));
      expect(result.current.parsed.listName).toBe('Mercado');
      expect(result.current.parsed.title).toBe('Leite');
    });
  });

  describe('Modal visibility', () => {
    it('should open modal when open is called', () => {
      const { result } = renderHook(() => useSmartInput({ parser: mockParser }));

      expect(result.current.visible).toBe(false);

      act(() => {
        result.current.open();
      });

      expect(result.current.visible).toBe(true);
    });

    it('should close modal and reset value when close is called', () => {
      const { result } = renderHook(() => useSmartInput({ parser: mockParser }));

      act(() => {
        result.current.open();
        result.current.setValue('Some text');
      });

      expect(result.current.visible).toBe(true);
      expect(result.current.value).toBe('Some text');

      act(() => {
        result.current.close();
      });

      expect(result.current.visible).toBe(false);
      expect(result.current.value).toBe('');
    });
  });

  describe('Submit', () => {
    it('should call onSubmit with parsed result', () => {
      const onSubmit = jest.fn();
      const { result } = renderHook(() => useSmartInput({ parser: mockParser, onSubmit }));

      act(() => {
        result.current.setValue('@Mercado Leite');
      });

      act(() => {
        result.current.submit();
      });

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          listName: 'Mercado',
          title: 'Leite',
        }),
      );
    });

    it('should not call onSubmit when title and listName are empty', () => {
      const onSubmit = jest.fn();
      const { result } = renderHook(() => useSmartInput({ parser: mockParser, onSubmit }));

      act(() => {
        result.current.submit();
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should reset value and close modal after submit', () => {
      const onSubmit = jest.fn();
      const { result } = renderHook(() => useSmartInput({ parser: mockParser, onSubmit }));

      act(() => {
        result.current.open();
        result.current.setValue('Test item');
      });

      act(() => {
        result.current.submit();
      });

      expect(result.current.value).toBe('');
      expect(result.current.visible).toBe(false);
    });
  });

  describe('List suggestions', () => {
    it('should not show suggestions when not typing @mention', () => {
      const { result } = renderHook(() =>
        useSmartInput({
          parser: mockParser,
          availableLists: mockAvailableLists,
        }),
      );

      act(() => {
        result.current.setValue('Some text');
      });

      expect(result.current.showSuggestions).toBe(false);
      expect(result.current.listSuggestions).toHaveLength(0);
    });

    it('should show suggestions when typing @', () => {
      const { result } = renderHook(() =>
        useSmartInput({
          parser: mockParser,
          availableLists: mockAvailableLists,
        }),
      );

      act(() => {
        result.current.setValue('@');
      });

      expect(result.current.showSuggestions).toBe(true);
    });

    it('should filter suggestions by typed text', () => {
      const { result } = renderHook(() =>
        useSmartInput({
          parser: mockParser,
          availableLists: mockAvailableLists,
        }),
      );

      act(() => {
        result.current.setValue('@Mer');
      });

      expect(result.current.showSuggestions).toBe(true);
      expect(result.current.listSuggestions).toHaveLength(2); // Mercado, Mercado Central
      expect(result.current.listSuggestions[0].name).toBe('Mercado');
      expect(result.current.listSuggestions[1].name).toBe('Mercado Central');
    });

    it('should return empty suggestions when no match', () => {
      const { result } = renderHook(() =>
        useSmartInput({
          parser: mockParser,
          availableLists: mockAvailableLists,
        }),
      );

      act(() => {
        result.current.setValue('@XYZ');
      });

      expect(result.current.showSuggestions).toBe(true);
      expect(result.current.listSuggestions).toHaveLength(0);
    });
  });

  describe('selectList', () => {
    it('should replace @mention with selected list name', () => {
      const { result } = renderHook(() =>
        useSmartInput({
          parser: mockParser,
          availableLists: mockAvailableLists,
        }),
      );

      act(() => {
        result.current.setValue('@Mer');
      });

      act(() => {
        result.current.selectList(result.current.listSuggestions[0]);
      });

      expect(result.current.value).toBe('@Mercado ');
    });

    it('should preserve text before @mention when selecting list', () => {
      const { result } = renderHook(() =>
        useSmartInput({
          parser: mockParser,
          availableLists: mockAvailableLists,
        }),
      );

      act(() => {
        result.current.setValue('Buy milk @Mer');
      });

      act(() => {
        result.current.selectList({ id: '1', name: 'Mercado', listType: 'shopping' });
      });

      expect(result.current.value).toBe('Buy milk @Mercado ');
    });
  });

  describe('createList', () => {
    it('should call onCreateList with list name', () => {
      const onCreateList = jest.fn();
      const { result } = renderHook(() =>
        useSmartInput({
          parser: mockParser,
          onCreateList,
        }),
      );

      act(() => {
        result.current.setValue('@NovaLista');
        result.current.createList('NovaLista');
      });

      expect(onCreateList).toHaveBeenCalledWith('NovaLista');
    });

    it('should update value with new list name after creation', () => {
      const onCreateList = jest.fn();
      const { result } = renderHook(() =>
        useSmartInput({
          parser: mockParser,
          onCreateList,
        }),
      );

      act(() => {
        result.current.setValue('@NovaLista');
        result.current.createList('NovaLista');
      });

      expect(result.current.value).toBe('@NovaLista ');
    });
  });

  describe('Parse context', () => {
    it('should pass currentListName to parser context', () => {
      const { result } = renderHook(() =>
        useSmartInput({
          parser: mockParser,
          currentListName: 'Mercado',
        }),
      );

      act(() => {
        result.current.setValue('Test');
      });

      expect(mockParser.parse).toHaveBeenCalledWith('Test', {
        currentListName: 'Mercado',
        isShoppingList: false,
      });
    });

    it('should pass isShoppingList to parser context', () => {
      const { result } = renderHook(() =>
        useSmartInput({
          parser: mockParser,
          isShoppingList: true,
        }),
      );

      act(() => {
        result.current.setValue('Leite R$5,99');
      });

      expect(mockParser.parse).toHaveBeenCalledWith('Leite R$5,99', {
        currentListName: undefined,
        isShoppingList: true,
      });
    });
  });
});
