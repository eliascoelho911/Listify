/**
 * ItemCard Molecule Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import type { NoteItem, ShoppingItem } from '@domain/item/entities/item.entity';
import { ItemCard } from '@design-system/molecules/ItemCard/ItemCard';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

const mockNoteItem: NoteItem = {
  id: '1',
  type: 'note',
  title: 'Test Note',
  description: 'Test description',
  sortOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockShoppingItem: ShoppingItem = {
  id: '2',
  type: 'shopping',
  title: 'Milk',
  quantity: '2L',
  price: 8.99,
  isChecked: false,
  sortOrder: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockShoppingItemChecked: ShoppingItem = {
  ...mockShoppingItem,
  id: '3',
  title: 'Bread',
  isChecked: true,
};

describe('ItemCard Molecule', () => {
  it('should render note item with title', () => {
    const { getByText } = renderWithTheme(<ItemCard item={mockNoteItem} />);
    expect(getByText('Test Note')).toBeTruthy();
  });

  it('should render shopping item with title', () => {
    const { getByText } = renderWithTheme(<ItemCard item={mockShoppingItem} />);
    expect(getByText('Milk')).toBeTruthy();
  });

  it('should render shopping item with price', () => {
    const { getByText } = renderWithTheme(<ItemCard item={mockShoppingItem} />);
    expect(getByText('R$ 8,99')).toBeTruthy();
  });

  it('should render shopping item with quantity', () => {
    const { getAllByText } = renderWithTheme(<ItemCard item={mockShoppingItem} />);
    expect(getAllByText('2L').length).toBeGreaterThan(0);
  });

  it('should render list badge when listName is provided', () => {
    const { getByText } = renderWithTheme(<ItemCard item={mockNoteItem} listName="My Notes" />);
    expect(getByText('My Notes')).toBeTruthy();
  });

  it('should not render list badge when showListBadge is false', () => {
    const { queryByText } = renderWithTheme(
      <ItemCard item={mockNoteItem} listName="My Notes" showListBadge={false} />,
    );
    expect(queryByText('My Notes')).toBeNull();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<ItemCard item={mockNoteItem} onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledWith(mockNoteItem);
  });

  it('should call onLongPress when long pressed', () => {
    const onLongPress = jest.fn();
    const { getByRole } = renderWithTheme(
      <ItemCard item={mockNoteItem} onLongPress={onLongPress} />,
    );
    fireEvent(getByRole('button'), 'longPress');
    expect(onLongPress).toHaveBeenCalledWith(mockNoteItem);
  });

  it('should have correct accessibility label', () => {
    const { getByLabelText } = renderWithTheme(<ItemCard item={mockNoteItem} />);
    expect(getByLabelText('Test Note, note item')).toBeTruthy();
  });

  it('should render checked shopping item with strikethrough style', () => {
    const { getByText } = renderWithTheme(<ItemCard item={mockShoppingItemChecked} />);
    expect(getByText('Bread')).toBeTruthy();
  });
});
