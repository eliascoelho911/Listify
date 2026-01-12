/**
 * SuggestionsPopUp Molecule Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { SuggestionsPopUp } from '@design-system/molecules/SuggestionsPopUp/SuggestionsPopUp';
import type { SuggestionItem } from '@design-system/molecules/SuggestionsPopUp/SuggestionsPopUp.types';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('SuggestionsPopUp Molecule', () => {
  const mockItems: SuggestionItem[] = [
    { id: '1', label: 'Item 1', description: 'Description 1' },
    { id: '2', label: 'Item 2', description: 'Description 2' },
    { id: '3', label: 'Item 3' },
  ];

  const defaultProps = {
    items: mockItems,
    onSelect: jest.fn(),
    visible: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render items when visible', () => {
    const { getByText } = renderWithTheme(<SuggestionsPopUp {...defaultProps} />);

    expect(getByText('Item 1')).toBeTruthy();
    expect(getByText('Item 2')).toBeTruthy();
    expect(getByText('Item 3')).toBeTruthy();
  });

  it('should not render when visible is false', () => {
    const { queryByText } = renderWithTheme(<SuggestionsPopUp {...defaultProps} visible={false} />);

    expect(queryByText('Item 1')).toBeNull();
  });

  it('should call onSelect when item is pressed', () => {
    const onSelect = jest.fn();
    const { getByText } = renderWithTheme(
      <SuggestionsPopUp {...defaultProps} onSelect={onSelect} />,
    );

    fireEvent.press(getByText('Item 1'));
    expect(onSelect).toHaveBeenCalledWith(mockItems[0]);
  });

  it('should render descriptions when provided', () => {
    const { getByText, queryByText } = renderWithTheme(<SuggestionsPopUp {...defaultProps} />);

    expect(getByText('Description 1')).toBeTruthy();
    expect(getByText('Description 2')).toBeTruthy();
    // Item 3 has no description
    expect(queryByText('Description 3')).toBeNull();
  });

  it('should show empty message when items is empty', () => {
    const { getByText } = renderWithTheme(
      <SuggestionsPopUp {...defaultProps} items={[]} emptyMessage="No suggestions found" />,
    );

    expect(getByText('No suggestions found')).toBeTruthy();
  });

  it('should show loading state', () => {
    const { queryByText } = renderWithTheme(<SuggestionsPopUp {...defaultProps} isLoading />);

    // When loading, items should not be shown
    expect(queryByText('Item 1')).toBeNull();
  });

  it('should limit items to maxItems', () => {
    const manyItems: SuggestionItem[] = [
      { id: '1', label: 'Item 1' },
      { id: '2', label: 'Item 2' },
      { id: '3', label: 'Item 3' },
      { id: '4', label: 'Item 4' },
      { id: '5', label: 'Item 5' },
      { id: '6', label: 'Item 6' },
    ];

    const { getByText, queryByText } = renderWithTheme(
      <SuggestionsPopUp {...defaultProps} items={manyItems} maxItems={3} />,
    );

    expect(getByText('Item 1')).toBeTruthy();
    expect(getByText('Item 2')).toBeTruthy();
    expect(getByText('Item 3')).toBeTruthy();
    expect(queryByText('Item 4')).toBeNull();
  });

  it('should use custom renderItem when provided', () => {
    // Note: Custom render items should use proper React Native Text components
    // This test verifies that the custom renderItem prop is called
    const customRenderItem = jest.fn((item: SuggestionItem) => <>{item.label}</>);

    renderWithTheme(<SuggestionsPopUp {...defaultProps} renderItem={customRenderItem} />);

    expect(customRenderItem).toHaveBeenCalledTimes(3);
    expect(customRenderItem).toHaveBeenCalledWith(mockItems[0]);
  });
});
