/**
 * ShoppingItemCard Molecule Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import type { ShoppingItem } from '@domain/item/entities/item.entity';
import { ShoppingItemCard } from '@design-system/molecules/ShoppingItemCard/ShoppingItemCard';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

const mockItem: ShoppingItem = {
  id: '1',
  listId: 'list-1',
  title: 'Leite Integral',
  type: 'shopping',
  quantity: '2L',
  price: 8.5,
  isChecked: false,
  sortOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ShoppingItemCard', () => {
  it('renders item title', () => {
    const { getByText } = renderWithTheme(<ShoppingItemCard item={mockItem} />);

    expect(getByText('Leite Integral')).toBeTruthy();
  });

  it('renders quantity when present', () => {
    const { getByText } = renderWithTheme(<ShoppingItemCard item={mockItem} />);

    expect(getByText('2L')).toBeTruthy();
  });

  it('renders price when present', () => {
    const { getByText } = renderWithTheme(<ShoppingItemCard item={mockItem} />);

    expect(getByText('R$ 8,50')).toBeTruthy();
  });

  it('does not render price when not present', () => {
    const itemWithoutPrice = { ...mockItem, price: undefined };
    const { queryByText } = renderWithTheme(<ShoppingItemCard item={itemWithoutPrice} />);

    expect(queryByText(/R\$/)).toBeNull();
  });

  it('calls onToggle when checkbox is pressed', () => {
    const onToggle = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ShoppingItemCard item={mockItem} onToggle={onToggle} testID="card" />,
    );

    const checkbox = getByTestId('card-checkbox');
    fireEvent.press(checkbox);

    expect(onToggle).toHaveBeenCalledWith(mockItem, true);
  });

  it('calls onToggle with false when checked item is toggled', () => {
    const onToggle = jest.fn();
    const checkedItem = { ...mockItem, isChecked: true };
    const { getByTestId } = renderWithTheme(
      <ShoppingItemCard item={checkedItem} onToggle={onToggle} testID="card" />,
    );

    const checkbox = getByTestId('card-checkbox');
    fireEvent.press(checkbox);

    expect(onToggle).toHaveBeenCalledWith(checkedItem, false);
  });

  it('calls onPress when card is pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ShoppingItemCard item={mockItem} onPress={onPress} testID="card" />,
    );

    fireEvent.press(getByTestId('card'));

    expect(onPress).toHaveBeenCalledWith(mockItem);
  });

  it('calls onLongPress when card is long pressed', () => {
    const onLongPress = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ShoppingItemCard item={mockItem} onLongPress={onLongPress} testID="card" />,
    );

    fireEvent(getByTestId('card'), 'longPress');

    expect(onLongPress).toHaveBeenCalledWith(mockItem);
  });

  it('renders with testID', () => {
    const { getByTestId } = renderWithTheme(
      <ShoppingItemCard item={mockItem} testID="shopping-card" />,
    );

    expect(getByTestId('shopping-card')).toBeTruthy();
  });
});
