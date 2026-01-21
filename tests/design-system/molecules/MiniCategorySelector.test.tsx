/**
 * MiniCategorySelector Molecule Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { MiniCategorySelector } from '@design-system/molecules/MiniCategorySelector/MiniCategorySelector';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('MiniCategorySelector Molecule', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('should render all category options', () => {
    const { getByText } = renderWithTheme(<MiniCategorySelector onSelect={mockOnSelect} />);

    expect(getByText('Compras')).toBeTruthy();
    expect(getByText('Filmes')).toBeTruthy();
    expect(getByText('Livros')).toBeTruthy();
    expect(getByText('Games')).toBeTruthy();
  });

  it('should call onSelect when a category is pressed', () => {
    const { getByText } = renderWithTheme(<MiniCategorySelector onSelect={mockOnSelect} />);

    fireEvent.press(getByText('Filmes'));

    expect(mockOnSelect).toHaveBeenCalledWith('movies');
  });

  it('should call onSelect with correct type for each category', () => {
    const { getByText } = renderWithTheme(<MiniCategorySelector onSelect={mockOnSelect} />);

    fireEvent.press(getByText('Compras'));
    expect(mockOnSelect).toHaveBeenCalledWith('shopping');

    fireEvent.press(getByText('Livros'));
    expect(mockOnSelect).toHaveBeenCalledWith('books');

    fireEvent.press(getByText('Games'));
    expect(mockOnSelect).toHaveBeenCalledWith('games');
  });

  it('should highlight selected category', () => {
    const { getByLabelText } = renderWithTheme(
      <MiniCategorySelector selectedType="shopping" onSelect={mockOnSelect} />,
    );

    const selectedButton = getByLabelText('Compras, selecionado');
    expect(selectedButton).toBeTruthy();
  });

  it('should not show labels when showLabels is false', () => {
    const { queryByText } = renderWithTheme(
      <MiniCategorySelector onSelect={mockOnSelect} showLabels={false} />,
    );

    expect(queryByText('Compras')).toBeNull();
    expect(queryByText('Filmes')).toBeNull();
    expect(queryByText('Livros')).toBeNull();
    expect(queryByText('Games')).toBeNull();
  });

  it('should work with inferredType prop', () => {
    const { getByLabelText } = renderWithTheme(
      <MiniCategorySelector onSelect={mockOnSelect} inferredType="movies" />,
    );

    const inferredButton = getByLabelText('Filmes');
    expect(inferredButton).toBeTruthy();
  });

  it('should prioritize selectedType over inferredType visually', () => {
    const { getByLabelText } = renderWithTheme(
      <MiniCategorySelector selectedType="books" inferredType="movies" onSelect={mockOnSelect} />,
    );

    const selectedButton = getByLabelText('Livros, selecionado');
    expect(selectedButton).toBeTruthy();
  });
});
