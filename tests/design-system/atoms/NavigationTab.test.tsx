/**
 * NavigationTab Atom Tests
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { fireEvent, render } from '@testing-library/react-native';
import { Inbox } from 'lucide-react-native';

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

describe('NavigationTab', () => {
  it('should render with icon and label', () => {
    const { getByText } = renderWithTheme(<NavigationTab icon={Inbox} label="Inbox" />);

    expect(getByText('Inbox')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderWithTheme(
      <NavigationTab icon={Inbox} label="Inbox" onPress={onPress} testID="navigation-tab" />,
    );

    fireEvent.press(getByTestId('navigation-tab'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should indicate active state via accessibility', () => {
    const { getByRole } = renderWithTheme(<NavigationTab icon={Inbox} label="Inbox" isActive />);

    const tab = getByRole('tab');
    expect(tab.props.accessibilityState.selected).toBe(true);
  });

  it('should indicate inactive state via accessibility', () => {
    const { getByRole } = renderWithTheme(
      <NavigationTab icon={Inbox} label="Inbox" isActive={false} />,
    );

    const tab = getByRole('tab');
    expect(tab.props.accessibilityState.selected).toBe(false);
  });

  it('should have accessibility label', () => {
    const { getByLabelText } = renderWithTheme(<NavigationTab icon={Inbox} label="Inbox" />);

    expect(getByLabelText('Inbox')).toBeTruthy();
  });
});
