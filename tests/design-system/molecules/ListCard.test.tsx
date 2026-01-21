/**
 * ListCard Molecule Tests
 */

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import type { List } from '@domain/list';
import { ListCard } from '@design-system/molecules/ListCard/ListCard';
import { ThemeProvider } from '@design-system/theme';

const mockList: List = {
  id: '1',
  name: 'Mercado',
  description: 'Lista de compras semanal',
  listType: 'shopping',
  isPrefabricated: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrefabList: List = {
  id: '2',
  name: 'Notas',
  listType: 'notes',
  isPrefabricated: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ListCard Molecule', () => {
  it('should render list name', () => {
    const { getByText } = renderWithTheme(<ListCard list={mockList} />);
    expect(getByText('Mercado')).toBeTruthy();
  });

  it('should render list description when provided', () => {
    const { getByText } = renderWithTheme(<ListCard list={mockList} />);
    expect(getByText('Lista de compras semanal')).toBeTruthy();
  });

  it('should render item count when provided', () => {
    const { getByText } = renderWithTheme(<ListCard list={mockList} itemCount={5} />);
    expect(getByText('5 itens')).toBeTruthy();
  });

  it('should render "Vazia" for zero item count', () => {
    const { getByText } = renderWithTheme(<ListCard list={mockList} itemCount={0} />);
    expect(getByText('Vazia')).toBeTruthy();
  });

  it('should render "1 item" for single item', () => {
    const { getByText } = renderWithTheme(<ListCard list={mockList} itemCount={1} />);
    expect(getByText('1 item')).toBeTruthy();
  });

  it('should render system badge for prefabricated lists', () => {
    const { getByText } = renderWithTheme(<ListCard list={mockPrefabList} />);
    expect(getByText('Sistema')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<ListCard list={mockList} onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledWith(mockList);
  });

  it('should call onLongPress when long pressed', () => {
    const onLongPress = jest.fn();
    const { getByRole } = renderWithTheme(<ListCard list={mockList} onLongPress={onLongPress} />);
    fireEvent(getByRole('button'), 'longPress');
    expect(onLongPress).toHaveBeenCalledWith(mockList);
  });
});
