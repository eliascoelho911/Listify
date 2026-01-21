/**
 * FAB (Floating Action Button) Atom Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Plus } from 'lucide-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FAB } from '@design-system/atoms/FAB/FAB';
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

describe('FAB', () => {
  it('should render with icon', () => {
    const { getByRole } = renderWithTheme(<FAB icon={Plus} accessibilityLabel="Add" />);

    expect(getByRole('button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderWithTheme(
      <FAB icon={Plus} onPress={onPress} testID="fab-button" />,
    );

    fireEvent.press(getByTestId('fab-button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should have accessibility label', () => {
    const { getByLabelText } = renderWithTheme(
      <FAB icon={Plus} accessibilityLabel="Add new item" />,
    );

    expect(getByLabelText('Add new item')).toBeTruthy();
  });

  it('should render with medium size', () => {
    const { getByRole } = renderWithTheme(<FAB icon={Plus} size="md" accessibilityLabel="Add" />);

    expect(getByRole('button')).toBeTruthy();
  });

  it('should render with large size by default', () => {
    const { getByRole } = renderWithTheme(<FAB icon={Plus} accessibilityLabel="Add" />);

    expect(getByRole('button')).toBeTruthy();
  });
});
