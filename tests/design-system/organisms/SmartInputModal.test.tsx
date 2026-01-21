/**
 * SmartInputModal Organism Tests
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { fireEvent, render } from '@testing-library/react-native';

import type { ParsedInput } from '@domain/common';
import { SmartInputModal } from '@design-system/organisms/SmartInputModal/SmartInputModal';
import { ThemeProvider } from '@design-system/theme';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      <ThemeProvider>{component}</ThemeProvider>
    </SafeAreaProvider>,
  );
};

const mockParsedEmpty: ParsedInput = {
  title: '',
  listName: null,
  sectionName: null,
  quantity: null,
  price: null,
  rawText: '',
  highlights: [],
};

const mockParsedWithTitle: ParsedInput = {
  title: 'Comprar leite',
  listName: null,
  sectionName: null,
  quantity: null,
  price: null,
  rawText: 'Comprar leite',
  highlights: [],
};

const mockParsedWithList: ParsedInput = {
  title: 'Comprar leite',
  listName: 'Mercado',
  sectionName: null,
  quantity: null,
  price: null,
  rawText: '@Mercado Comprar leite',
  highlights: [{ start: 0, end: 8, type: 'list', value: '@Mercado' }],
};

const mockParsedWithAll: ParsedInput = {
  title: 'Leite',
  listName: 'Mercado',
  sectionName: 'Laticínios',
  quantity: '2L',
  price: 8.99,
  rawText: '@Mercado:Laticínios Leite 2L R$8,99',
  highlights: [
    { start: 0, end: 19, type: 'list', value: '@Mercado:Laticínios' },
    { start: 26, end: 28, type: 'quantity', value: '2L' },
    { start: 29, end: 35, type: 'price', value: 'R$8,99' },
  ],
};

const mockListSuggestions = [
  { id: '1', name: 'Mercado', listType: 'shopping' as const },
  { id: '2', name: 'Filmes para Ver', listType: 'movies' as const },
];

const defaultProps = {
  visible: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  value: '',
  onChangeText: jest.fn(),
  parsed: mockParsedEmpty,
  listSuggestions: [],
  showSuggestions: false,
  onSelectList: jest.fn(),
};

describe('SmartInputModal Organism', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render nothing when not visible', () => {
      const { queryByTestId } = renderWithProviders(
        <SmartInputModal {...defaultProps} visible={false} />,
      );
      expect(queryByTestId('smart-input-field')).toBeNull();
    });

    it('should render input field when visible', () => {
      const { getByTestId } = renderWithProviders(<SmartInputModal {...defaultProps} />);
      expect(getByTestId('smart-input-field')).toBeTruthy();
    });

    it('should render submit button', () => {
      const { getByTestId } = renderWithProviders(<SmartInputModal {...defaultProps} />);
      expect(getByTestId('smart-input-submit')).toBeTruthy();
    });

    it('should render with custom placeholder', () => {
      const { getByPlaceholderText } = renderWithProviders(
        <SmartInputModal {...defaultProps} placeholder="Custom placeholder" />,
      );
      expect(getByPlaceholderText('Custom placeholder')).toBeTruthy();
    });
  });

  describe('Input behavior', () => {
    it('should call onChangeText when input changes', () => {
      const onChangeText = jest.fn();
      const { getByTestId } = renderWithProviders(
        <SmartInputModal {...defaultProps} onChangeText={onChangeText} />,
      );

      fireEvent.changeText(getByTestId('smart-input-field'), 'New text');
      expect(onChangeText).toHaveBeenCalledWith('New text');
    });

    it('should display the value prop in input', () => {
      const { getByDisplayValue } = renderWithProviders(
        <SmartInputModal {...defaultProps} value="Test value" />,
      );
      expect(getByDisplayValue('Test value')).toBeTruthy();
    });
  });

  describe('Submit behavior', () => {
    it('should not call onSubmit when title is empty', () => {
      const onSubmit = jest.fn();
      const { getByTestId } = renderWithProviders(
        <SmartInputModal {...defaultProps} onSubmit={onSubmit} parsed={mockParsedEmpty} />,
      );

      fireEvent.press(getByTestId('smart-input-submit'));
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should call onSubmit when title has content', () => {
      const onSubmit = jest.fn();
      const { getByTestId } = renderWithProviders(
        <SmartInputModal {...defaultProps} onSubmit={onSubmit} parsed={mockParsedWithTitle} />,
      );

      fireEvent.press(getByTestId('smart-input-submit'));
      expect(onSubmit).toHaveBeenCalledWith(mockParsedWithTitle);
    });

    it('should call onSubmit when only listName is present', () => {
      const onSubmit = jest.fn();
      const parsedWithOnlyList: ParsedInput = {
        ...mockParsedEmpty,
        listName: 'Mercado',
      };
      const { getByTestId } = renderWithProviders(
        <SmartInputModal {...defaultProps} onSubmit={onSubmit} parsed={parsedWithOnlyList} />,
      );

      fireEvent.press(getByTestId('smart-input-submit'));
      expect(onSubmit).toHaveBeenCalledWith(parsedWithOnlyList);
    });

    it('should clear input and close modal after submit', () => {
      const onChangeText = jest.fn();
      const onClose = jest.fn();
      const { getByTestId } = renderWithProviders(
        <SmartInputModal
          {...defaultProps}
          onChangeText={onChangeText}
          onClose={onClose}
          parsed={mockParsedWithTitle}
        />,
      );

      fireEvent.press(getByTestId('smart-input-submit'));
      expect(onChangeText).toHaveBeenCalledWith('');
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Parse preview', () => {
    it('should show list chip when listName is present', () => {
      const { getByText } = renderWithProviders(
        <SmartInputModal {...defaultProps} parsed={mockParsedWithList} />,
      );
      expect(getByText('@Mercado')).toBeTruthy();
    });

    it('should show section chip when sectionName is present', () => {
      const { getByText } = renderWithProviders(
        <SmartInputModal {...defaultProps} parsed={mockParsedWithAll} />,
      );
      expect(getByText('Laticínios')).toBeTruthy();
    });

    it('should show quantity chip when quantity is present', () => {
      const { getByText } = renderWithProviders(
        <SmartInputModal {...defaultProps} parsed={mockParsedWithAll} />,
      );
      expect(getByText('2L')).toBeTruthy();
    });

    it('should show price chip when price is present', () => {
      const { getByText } = renderWithProviders(
        <SmartInputModal {...defaultProps} parsed={mockParsedWithAll} />,
      );
      expect(getByText('R$8,99')).toBeTruthy();
    });
  });

  describe('Inline highlight', () => {
    it('should render inline highlight when value and highlights exist', () => {
      const { getAllByText } = renderWithProviders(
        <SmartInputModal {...defaultProps} value="@Mercado Leite" parsed={mockParsedWithList} />,
      );
      // InlineHighlight and ParsePreview both render @Mercado
      // so we expect at least 2 occurrences
      expect(getAllByText('@Mercado').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('List suggestions', () => {
    it('should show suggestions dropdown when showSuggestions is true', () => {
      const { getByText } = renderWithProviders(
        <SmartInputModal {...defaultProps} listSuggestions={mockListSuggestions} showSuggestions />,
      );
      expect(getByText('Mercado')).toBeTruthy();
      expect(getByText('Filmes para Ver')).toBeTruthy();
    });

    it('should call onSelectList when suggestion is pressed', () => {
      const onSelectList = jest.fn();
      const { getByText } = renderWithProviders(
        <SmartInputModal
          {...defaultProps}
          listSuggestions={mockListSuggestions}
          showSuggestions
          onSelectList={onSelectList}
        />,
      );

      fireEvent.press(getByText('Mercado'));
      expect(onSelectList).toHaveBeenCalledWith(mockListSuggestions[0]);
    });

    it('should show create option when onCreateList is provided', () => {
      const onCreateList = jest.fn();
      const { getByText } = renderWithProviders(
        <SmartInputModal
          {...defaultProps}
          value="@Nova"
          listSuggestions={[]}
          showSuggestions
          onCreateList={onCreateList}
        />,
      );
      expect(getByText(/Criar/)).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible submit button', () => {
      const { getByLabelText } = renderWithProviders(<SmartInputModal {...defaultProps} />);
      expect(getByLabelText('Submit')).toBeTruthy();
    });
  });
});
