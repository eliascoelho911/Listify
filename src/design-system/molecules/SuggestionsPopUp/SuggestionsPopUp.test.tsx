/**
 * SuggestionsPopUp Molecule Tests
 */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { ThemeProvider } from '../../theme';
import { SuggestionsPopUp } from './SuggestionsPopUp';
import type { SuggestionItem } from './SuggestionsPopUp.types';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('SuggestionsPopUp', () => {
  const sampleItems: SuggestionItem[] = [
    { id: '1', label: '#compras', description: '5 uses' },
    { id: '2', label: '#mercado', description: '3 uses' },
    { id: '3', label: '#urgente', description: '2 uses' },
  ];

  const defaultProps = {
    items: sampleItems,
    onSelect: jest.fn(),
    visible: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible', () => {
    renderWithTheme(<SuggestionsPopUp {...defaultProps} />);

    expect(screen.getByText('#compras')).toBeTruthy();
    expect(screen.getByText('#mercado')).toBeTruthy();
    expect(screen.getByText('#urgente')).toBeTruthy();
  });

  it('renders nothing when not visible', () => {
    renderWithTheme(<SuggestionsPopUp {...defaultProps} visible={false} />);

    expect(screen.queryByText('#compras')).toBeNull();
  });

  it('calls onSelect when an item is pressed', () => {
    const onSelect = jest.fn();
    renderWithTheme(<SuggestionsPopUp {...defaultProps} onSelect={onSelect} />);

    fireEvent.press(screen.getByText('#compras'));

    expect(onSelect).toHaveBeenCalledWith(sampleItems[0]);
  });

  it('shows empty message when items array is empty', () => {
    renderWithTheme(
      <SuggestionsPopUp {...defaultProps} items={[]} emptyMessage="No matching tags" />,
    );

    expect(screen.getByText('No matching tags')).toBeTruthy();
  });

  it('shows default empty message when not provided', () => {
    renderWithTheme(<SuggestionsPopUp {...defaultProps} items={[]} />);

    expect(screen.getByText('No suggestions')).toBeTruthy();
  });

  it('shows loading indicator when isLoading is true', () => {
    renderWithTheme(<SuggestionsPopUp {...defaultProps} isLoading />);

    expect(screen.queryByText('#compras')).toBeNull();
  });

  it('respects maxItems prop', () => {
    const manyItems: SuggestionItem[] = [
      { id: '1', label: 'Item 1' },
      { id: '2', label: 'Item 2' },
      { id: '3', label: 'Item 3' },
      { id: '4', label: 'Item 4' },
      { id: '5', label: 'Item 5' },
      { id: '6', label: 'Item 6' },
    ];

    renderWithTheme(<SuggestionsPopUp {...defaultProps} items={manyItems} maxItems={3} />);

    expect(screen.getByText('Item 1')).toBeTruthy();
    expect(screen.getByText('Item 2')).toBeTruthy();
    expect(screen.getByText('Item 3')).toBeTruthy();
    expect(screen.queryByText('Item 4')).toBeNull();
  });

  it('displays description when provided', () => {
    renderWithTheme(<SuggestionsPopUp {...defaultProps} />);

    expect(screen.getByText('5 uses')).toBeTruthy();
  });
});
