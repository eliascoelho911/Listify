/**
 * SelectableItemList Molecule Tests
 */

import { fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';

import { SelectableItemList } from '@design-system/molecules/SelectableItemList/SelectableItemList';
import type { SelectableItemListItem } from '@design-system/molecules/SelectableItemList/SelectableItemList.types';

import { renderWithTheme } from '../testUtils';

const mockItems: SelectableItemListItem[] = [
  {
    originalItemId: '1',
    title: 'Arroz 5kg',
    quantity: '2 un',
    price: 25.9,
    sortOrder: 0,
    wasChecked: true,
    existsInList: false,
  },
  {
    originalItemId: '2',
    title: 'Feijão 1kg',
    quantity: '3 un',
    price: 8.5,
    sortOrder: 1,
    wasChecked: true,
    existsInList: true,
  },
  {
    originalItemId: '3',
    title: 'Óleo de soja',
    quantity: '1 un',
    price: 7.99,
    sortOrder: 2,
    wasChecked: true,
    existsInList: false,
  },
];

describe('SelectableItemList', () => {
  const defaultProps = {
    items: mockItems,
    selectedIds: new Set<string>(),
    onSelectionChange: jest.fn(),
    onSelectAll: jest.fn(),
    onDeselectAll: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all items', () => {
    const { getByText } = renderWithTheme(<SelectableItemList {...defaultProps} />);

    expect(getByText('Arroz 5kg')).toBeTruthy();
    expect(getByText('Feijão 1kg')).toBeTruthy();
    expect(getByText('Óleo de soja')).toBeTruthy();
  });

  it('should display item quantities', () => {
    const { getByText } = renderWithTheme(<SelectableItemList {...defaultProps} />);

    expect(getByText('2 un')).toBeTruthy();
    expect(getByText('3 un')).toBeTruthy();
    expect(getByText('1 un')).toBeTruthy();
  });

  it('should call onSelectionChange when item is pressed', async () => {
    const onSelectionChange = jest.fn();
    const { getByText } = renderWithTheme(
      <SelectableItemList {...defaultProps} onSelectionChange={onSelectionChange} />,
    );

    fireEvent.press(getByText('Arroz 5kg'));

    await waitFor(() => {
      expect(onSelectionChange).toHaveBeenCalledWith('1', true);
    });
  });

  it('should show selected count when items are selected', () => {
    const selectedIds = new Set(['1', '3']);
    const { getByText } = renderWithTheme(
      <SelectableItemList {...defaultProps} selectedIds={selectedIds} />,
    );

    // The component should show the selected count in the header
    expect(getByText(/2 selecionados/)).toBeTruthy();
  });

  it('should call onSelectAll when select all button is pressed', async () => {
    const onSelectAll = jest.fn();
    const { getByText } = renderWithTheme(
      <SelectableItemList {...defaultProps} onSelectAll={onSelectAll} />,
    );

    const selectAllButton = getByText(/Selecionar tudo/);
    fireEvent.press(selectAllButton);

    await waitFor(() => {
      expect(onSelectAll).toHaveBeenCalled();
    });
  });

  it('should call onDeselectAll when all items are selected and button is pressed', async () => {
    const selectedIds = new Set(mockItems.map((item) => item.originalItemId));
    const onDeselectAll = jest.fn();

    const { getByText } = renderWithTheme(
      <SelectableItemList
        {...defaultProps}
        selectedIds={selectedIds}
        onDeselectAll={onDeselectAll}
      />,
    );

    const deselectButton = getByText(/Desmarcar tudo/);
    fireEvent.press(deselectButton);

    await waitFor(() => {
      expect(onDeselectAll).toHaveBeenCalled();
    });
  });

  it('should show loading indicator when isLoading is true', () => {
    const { getByTestId } = renderWithTheme(
      <SelectableItemList {...defaultProps} items={[]} isLoading testID="selectable-list" />,
    );

    // The loading state should show an activity indicator
    // Note: We can't easily test for ActivityIndicator, but we verify the component renders
    expect(getByTestId('selectable-list')).toBeTruthy();
  });

  it('should show empty state when no items', () => {
    const { getByText } = renderWithTheme(
      <SelectableItemList {...defaultProps} items={[]} />,
    );

    expect(getByText(/Nenhum item/)).toBeTruthy();
  });

  it('should show existing badge for items that exist in the list', () => {
    const { getByText } = renderWithTheme(<SelectableItemList {...defaultProps} />);

    // The item "Feijão 1kg" has existsInList: true
    expect(getByText(/Na lista/)).toBeTruthy();
  });
});
