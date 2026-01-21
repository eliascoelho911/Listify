/**
 * Bottombar Organism Tests
 *
 * Note: The Bottombar component requires BottomTabBarProps from @react-navigation/bottom-tabs.
 * These tests verify the NavigationTab and FAB components which are the building blocks.
 * Integration tests for the full Bottombar should be done in the app/ layer.
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { fireEvent, render } from '@testing-library/react-native';
import { Inbox } from 'lucide-react-native';

import { FAB } from '@design-system/atoms/FAB/FAB';
import { NavigationTab } from '@design-system/atoms/NavigationTab/NavigationTab';
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

describe('Bottombar building blocks', () => {
  describe('NavigationTab', () => {
    it('should render tab with label', () => {
      const { getByText } = renderWithTheme(<NavigationTab icon={Inbox} label="Inbox" />);

      expect(getByText('Inbox')).toBeTruthy();
    });

    it('should handle press events', () => {
      const onPress = jest.fn();
      const { getByTestId } = renderWithTheme(
        <NavigationTab icon={Inbox} label="Inbox" onPress={onPress} testID="tab" />,
      );

      fireEvent.press(getByTestId('tab'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('FAB', () => {
    it('should handle press events', () => {
      const onPress = jest.fn();
      const { getByTestId } = renderWithTheme(<FAB icon={Inbox} onPress={onPress} testID="fab" />);

      fireEvent.press(getByTestId('fab'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });
});
