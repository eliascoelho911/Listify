/**
 * ScreenTitle Atom Tests
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { render } from '@testing-library/react-native';

import { ScreenTitle } from '@design-system/atoms/ScreenTitle/ScreenTitle';
import { ThemeProvider } from '@design-system/theme';

const initialSafeAreaMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <SafeAreaProvider initialMetrics={initialSafeAreaMetrics}>
      <ThemeProvider initialMode="dark">{component}</ThemeProvider>
    </SafeAreaProvider>,
  );
};

describe('ScreenTitle', () => {
  it('should render title', () => {
    const { getByText } = renderWithTheme(<ScreenTitle title="Inbox" />);

    expect(getByText('Inbox')).toBeTruthy();
  });

  it('should render subtitle when provided', () => {
    const { getByText } = renderWithTheme(<ScreenTitle title="Inbox" subtitle="12 items" />);

    expect(getByText('Inbox')).toBeTruthy();
    expect(getByText('12 items')).toBeTruthy();
  });

  it('should not render subtitle when not provided', () => {
    const { queryByText, getByText } = renderWithTheme(<ScreenTitle title="Inbox" />);

    expect(getByText('Inbox')).toBeTruthy();
    expect(queryByText('12 items')).toBeNull();
  });

  it('should have testID when provided', () => {
    const { getByTestId } = renderWithTheme(<ScreenTitle title="Inbox" testID="screen-title" />);

    expect(getByTestId('screen-title')).toBeTruthy();
  });
});
