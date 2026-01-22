/**
 * HistoryCard Molecule Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { HistoryCard } from '@design-system/molecules/HistoryCard/HistoryCard';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('HistoryCard Molecule', () => {
  const mockOnPress = jest.fn();
  const testDate = new Date('2026-01-22');

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('should render with date, total and item count', () => {
    const { getByText } = renderWithTheme(
      <HistoryCard
        purchaseDate={testDate}
        totalValue={125.5}
        itemCount={8}
        onPress={mockOnPress}
      />,
    );
    expect(getByText('R$125,50')).toBeTruthy();
    // Translation returns key in test environment
    expect(getByText('history.itemCount.plural')).toBeTruthy();
  });

  it('should render singular item text for single item', () => {
    const { getByText } = renderWithTheme(
      <HistoryCard
        purchaseDate={testDate}
        totalValue={15.99}
        itemCount={1}
        onPress={mockOnPress}
      />,
    );
    // Translation returns key in test environment
    expect(getByText('history.itemCount.singular')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const { getByRole } = renderWithTheme(
      <HistoryCard
        purchaseDate={testDate}
        totalValue={125.5}
        itemCount={8}
        onPress={mockOnPress}
      />,
    );
    fireEvent.press(getByRole('button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should render without crashing when no onPress is provided', () => {
    const { getByText } = renderWithTheme(
      <HistoryCard purchaseDate={testDate} totalValue={125.5} itemCount={8} />,
    );
    expect(getByText('R$125,50')).toBeTruthy();
  });
});
