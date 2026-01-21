/**
 * CategoryDropdown Organism Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import type { List } from '@domain/list';
import { CategoryDropdown } from '@design-system/organisms/CategoryDropdown/CategoryDropdown';
import { ThemeProvider } from '@design-system/theme';

const mockLists: List[] = [
  {
    id: '1',
    name: 'Mercado',
    description: 'Lista de compras semanal',
    listType: 'shopping',
    isPrefabricated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Feira',
    listType: 'shopping',
    isPrefabricated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockItemCounts: Record<string, number> = {
  '1': 12,
  '2': 5,
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('CategoryDropdown Organism', () => {
  it('should render category label', () => {
    const { getByText } = renderWithTheme(
      <CategoryDropdown category="shopping" lists={mockLists} expanded />,
    );
    expect(getByText('Compras')).toBeTruthy();
  });

  it('should render list count badge', () => {
    const { getByText } = renderWithTheme(
      <CategoryDropdown category="shopping" lists={mockLists} expanded />,
    );
    expect(getByText('2')).toBeTruthy();
  });

  it('should render list cards when expanded', () => {
    const { getByText } = renderWithTheme(
      <CategoryDropdown
        category="shopping"
        lists={mockLists}
        itemCounts={mockItemCounts}
        expanded
      />,
    );
    expect(getByText('Mercado')).toBeTruthy();
    expect(getByText('Feira')).toBeTruthy();
  });

  it('should not render list cards when collapsed', () => {
    const { queryByText } = renderWithTheme(
      <CategoryDropdown category="shopping" lists={mockLists} expanded={false} />,
    );
    expect(queryByText('Mercado')).toBeNull();
    expect(queryByText('Feira')).toBeNull();
  });

  it('should call onToggleExpand when header is pressed', () => {
    const onToggleExpand = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <CategoryDropdown
        category="shopping"
        lists={mockLists}
        expanded
        onToggleExpand={onToggleExpand}
      />,
    );
    fireEvent.press(getByLabelText(/Categoria Compras/));
    expect(onToggleExpand).toHaveBeenCalled();
  });

  it('should render empty message when no lists', () => {
    const { getByText } = renderWithTheme(
      <CategoryDropdown category="movies" lists={[]} expanded />,
    );
    expect(getByText('Nenhuma lista')).toBeTruthy();
  });

  it('should call onListPress when a list card is pressed', () => {
    const onListPress = jest.fn();
    const { getByText } = renderWithTheme(
      <CategoryDropdown category="shopping" lists={mockLists} expanded onListPress={onListPress} />,
    );
    fireEvent.press(getByText('Mercado'));
    expect(onListPress).toHaveBeenCalledWith(mockLists[0]);
  });
});
