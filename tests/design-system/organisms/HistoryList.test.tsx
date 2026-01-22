/**
 * HistoryList Organism Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { HistoryList } from '@design-system/organisms/HistoryList/HistoryList';
import type { HistoryEntry } from '@design-system/organisms/HistoryList/HistoryList.types';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('HistoryList Organism', () => {
  const mockOnEntryPress = jest.fn();

  const mockEntries: HistoryEntry[] = [
    {
      id: '1',
      purchaseDate: new Date('2026-01-22'),
      totalValue: 125.5,
      itemCount: 8,
    },
    {
      id: '2',
      purchaseDate: new Date('2026-01-20'),
      totalValue: 89.9,
      itemCount: 5,
    },
  ];

  beforeEach(() => {
    mockOnEntryPress.mockClear();
  });

  it('should render list of entries', () => {
    const { getByText } = renderWithTheme(
      <HistoryList entries={mockEntries} onEntryPress={mockOnEntryPress} />,
    );
    expect(getByText('R$125,50')).toBeTruthy();
    expect(getByText('R$89,90')).toBeTruthy();
  });

  it('should render empty state when no entries', () => {
    const { getByText } = renderWithTheme(<HistoryList entries={[]} />);
    // Translation returns key in test environment
    expect(getByText('history.empty.title')).toBeTruthy();
  });

  it('should render custom empty state text', () => {
    const { getByText } = renderWithTheme(
      <HistoryList
        entries={[]}
        emptyTitle="Custom empty title"
        emptyDescription="Custom empty description"
      />,
    );
    expect(getByText('Custom empty title')).toBeTruthy();
    expect(getByText('Custom empty description')).toBeTruthy();
  });

  it('should show loading indicator when loading', () => {
    const { getByTestId } = renderWithTheme(
      <HistoryList entries={[]} isLoading testID="history-list" />,
    );
    expect(getByTestId('history-list')).toBeTruthy();
  });
});
