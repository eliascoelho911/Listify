/**
 * CategorySelector Molecule Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { CategorySelector } from '@design-system/molecules/CategorySelector/CategorySelector';
import type { SelectableListType } from '@design-system/molecules/CategorySelector/CategorySelector.types';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('CategorySelector Molecule', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all category options', () => {
    const { getByText } = renderWithTheme(
      <CategorySelector selectedType="shopping" onSelect={mockOnSelect} />,
    );

    expect(getByText('Compras')).toBeTruthy();
    expect(getByText('Filmes')).toBeTruthy();
    expect(getByText('Livros')).toBeTruthy();
    expect(getByText('Jogos')).toBeTruthy();
  });

  it('should call onSelect when an option is pressed', () => {
    const { getByText } = renderWithTheme(
      <CategorySelector selectedType="shopping" onSelect={mockOnSelect} />,
    );

    fireEvent.press(getByText('Filmes'));
    expect(mockOnSelect).toHaveBeenCalledWith('movies');
  });

  it('should highlight the selected option', () => {
    const { getByTestId } = renderWithTheme(
      <CategorySelector selectedType="movies" onSelect={mockOnSelect} testID="category-selector" />,
    );

    const moviesOption = getByTestId('category-selector-movies');
    expect(moviesOption.props.accessibilityState.selected).toBe(true);
  });

  it.each<SelectableListType>(['shopping', 'movies', 'books', 'games'])(
    'should properly handle %s category selection',
    (category) => {
      const { getByTestId } = renderWithTheme(
        <CategorySelector
          selectedType="shopping"
          onSelect={mockOnSelect}
          testID="category-selector"
        />,
      );

      fireEvent.press(getByTestId(`category-selector-${category}`));
      expect(mockOnSelect).toHaveBeenCalledWith(category);
    },
  );
});
