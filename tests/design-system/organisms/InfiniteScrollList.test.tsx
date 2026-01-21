/**
 * InfiniteScrollList Organism Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { Text } from '@design-system/atoms/Text/Text';
import { InfiniteScrollList } from '@design-system/organisms/InfiniteScrollList/InfiniteScrollList';
import type { InfiniteScrollGroup } from '@design-system/organisms/InfiniteScrollList/InfiniteScrollList.types';
import { ThemeProvider } from '@design-system/theme';

interface SimpleItem {
  id: string;
  title: string;
}

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

const mockGroups: InfiniteScrollGroup<SimpleItem>[] = [
  {
    key: 'today',
    title: 'Today',
    items: [
      { id: '1', title: 'Item 1' },
      { id: '2', title: 'Item 2' },
    ],
  },
  {
    key: 'yesterday',
    title: 'Yesterday',
    items: [{ id: '3', title: 'Item 3' }],
  },
];

const renderItem = (item: SimpleItem) => <Text>{item.title}</Text>;
const keyExtractor = (item: SimpleItem) => item.id;

describe('InfiniteScrollList Organism', () => {
  it('should render items', () => {
    const { getByText } = renderWithTheme(
      <InfiniteScrollList
        groups={mockGroups}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />,
    );
    expect(getByText('Item 1')).toBeTruthy();
    expect(getByText('Item 2')).toBeTruthy();
    expect(getByText('Item 3')).toBeTruthy();
  });

  it('should render group headers', () => {
    const { getByText } = renderWithTheme(
      <InfiniteScrollList
        groups={mockGroups}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />,
    );
    expect(getByText('Today')).toBeTruthy();
    expect(getByText('Yesterday')).toBeTruthy();
  });

  it('should render group item counts', () => {
    const { getByText } = renderWithTheme(
      <InfiniteScrollList
        groups={mockGroups}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />,
    );
    expect(getByText('(2)')).toBeTruthy();
    expect(getByText('(1)')).toBeTruthy();
  });

  it('should render empty content when groups are empty', () => {
    const { getByText } = renderWithTheme(
      <InfiniteScrollList
        groups={[]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        emptyContent={<Text>No items</Text>}
      />,
    );
    expect(getByText('No items')).toBeTruthy();
  });

  it('should render custom group header', () => {
    const { getByText } = renderWithTheme(
      <InfiniteScrollList
        groups={mockGroups}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        renderGroupHeader={(group) => <Text>Custom: {group.title}</Text>}
      />,
    );
    expect(getByText('Custom: Today')).toBeTruthy();
    expect(getByText('Custom: Yesterday')).toBeTruthy();
  });
});
