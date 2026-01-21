/**
 * ListSuggestionDropdown Molecule Tests
 */

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ListSuggestionDropdown } from '@design-system/molecules/ListSuggestionDropdown/ListSuggestionDropdown';
import type { ListSuggestion } from '@design-system/molecules/ListSuggestionDropdown/ListSuggestionDropdown.types';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

const mockSuggestions: ListSuggestion[] = [
  { id: '1', name: 'Mercado', listType: 'shopping', sections: ['Laticínios', 'Padaria'] },
  { id: '2', name: 'Filmes para Ver', listType: 'movies' },
  { id: '3', name: 'Minhas Notas', listType: 'notes' },
];

describe('ListSuggestionDropdown Molecule', () => {
  it('should render nothing when not visible', () => {
    const { queryByText } = renderWithTheme(
      <ListSuggestionDropdown
        suggestions={mockSuggestions}
        visible={false}
        onSelectList={jest.fn()}
      />
    );
    expect(queryByText('Mercado')).toBeNull();
  });

  it('should render suggestions when visible', () => {
    const { getByText } = renderWithTheme(
      <ListSuggestionDropdown
        suggestions={mockSuggestions}
        visible={true}
        onSelectList={jest.fn()}
      />
    );
    expect(getByText('Mercado')).toBeTruthy();
    expect(getByText('Filmes para Ver')).toBeTruthy();
    expect(getByText('Minhas Notas')).toBeTruthy();
  });

  it('should display list type labels', () => {
    const { getByText } = renderWithTheme(
      <ListSuggestionDropdown
        suggestions={mockSuggestions}
        visible={true}
        onSelectList={jest.fn()}
      />
    );
    expect(getByText('Compras')).toBeTruthy();
  });

  it('should display sections when available', () => {
    const { getByText } = renderWithTheme(
      <ListSuggestionDropdown
        suggestions={mockSuggestions}
        visible={true}
        onSelectList={jest.fn()}
      />
    );
    expect(getByText('Seções: Laticínios, Padaria')).toBeTruthy();
  });

  it('should call onSelectList when a suggestion is pressed', () => {
    const onSelectList = jest.fn();
    const { getByText } = renderWithTheme(
      <ListSuggestionDropdown
        suggestions={mockSuggestions}
        visible={true}
        onSelectList={onSelectList}
      />
    );

    fireEvent.press(getByText('Mercado'));

    expect(onSelectList).toHaveBeenCalledWith(mockSuggestions[0]);
  });

  it('should show create option when no exact match', () => {
    const onCreateNew = jest.fn();
    const { getByText } = renderWithTheme(
      <ListSuggestionDropdown
        suggestions={mockSuggestions}
        visible={true}
        searchText="Nova Lista"
        showCreateOption={true}
        onSelectList={jest.fn()}
        onCreateNew={onCreateNew}
      />
    );

    expect(getByText('"Nova Lista"')).toBeTruthy();
  });

  it('should call onCreateNew when create option is pressed', () => {
    const onCreateNew = jest.fn();
    const { getByText } = renderWithTheme(
      <ListSuggestionDropdown
        suggestions={[]}
        visible={true}
        searchText="Nova Lista"
        showCreateOption={true}
        onSelectList={jest.fn()}
        onCreateNew={onCreateNew}
      />
    );

    fireEvent.press(getByText('"Nova Lista"'));

    expect(onCreateNew).toHaveBeenCalledWith('Nova Lista');
  });

  it('should not show create option when exact match exists', () => {
    const { queryByText } = renderWithTheme(
      <ListSuggestionDropdown
        suggestions={mockSuggestions}
        visible={true}
        searchText="Mercado"
        showCreateOption={true}
        onSelectList={jest.fn()}
        onCreateNew={jest.fn()}
      />
    );

    expect(queryByText('Criar')).toBeNull();
  });

  it('should show empty message when no suggestions and no create option', () => {
    const { getByText } = renderWithTheme(
      <ListSuggestionDropdown
        suggestions={[]}
        visible={true}
        showCreateOption={false}
        onSelectList={jest.fn()}
      />
    );

    expect(getByText('Nenhuma lista encontrada')).toBeTruthy();
  });

  it('should respect maxSuggestions limit', () => {
    const { getByText, queryByText } = renderWithTheme(
      <ListSuggestionDropdown
        suggestions={mockSuggestions}
        visible={true}
        maxSuggestions={2}
        onSelectList={jest.fn()}
      />
    );

    expect(getByText('Mercado')).toBeTruthy();
    expect(getByText('Filmes para Ver')).toBeTruthy();
    expect(queryByText('Minhas Notas')).toBeNull();
  });
});
