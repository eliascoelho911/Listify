/**
 * SwipeToDelete Molecule Tests
 */

import React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';

import { Text } from '../../atoms';
import { ThemeProvider } from '../../theme';
import { SwipeToDelete } from './SwipeToDelete';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider initialMode="dark">{component}</ThemeProvider>);
};

describe('SwipeToDelete', () => {
  it('should render children correctly', () => {
    const { getByText } = renderWithTheme(
      <SwipeToDelete onDelete={jest.fn()}>
        <View>
          <Text>Test Content</Text>
        </View>
      </SwipeToDelete>,
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should render with testID', () => {
    const { getByTestId } = renderWithTheme(
      <SwipeToDelete onDelete={jest.fn()} testID="swipe-delete">
        <View>
          <Text>Test Content</Text>
        </View>
      </SwipeToDelete>,
    );

    expect(getByTestId('swipe-delete')).toBeTruthy();
  });

  it('should render delete label', () => {
    const { getByText } = renderWithTheme(
      <SwipeToDelete onDelete={jest.fn()} deleteLabel="Remove">
        <View>
          <Text>Test Content</Text>
        </View>
      </SwipeToDelete>,
    );

    expect(getByText('Remove')).toBeTruthy();
  });

  it('should use default delete label when not provided', () => {
    const { getByText } = renderWithTheme(
      <SwipeToDelete onDelete={jest.fn()}>
        <View>
          <Text>Test Content</Text>
        </View>
      </SwipeToDelete>,
    );

    expect(getByText('Delete')).toBeTruthy();
  });
});
