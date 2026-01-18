/**
 * Fab Atom Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Plus } from 'lucide-react-native';

import { Fab } from '@design-system/atoms/Fab/Fab';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Fab Atom', () => {
  it('should render with default medium size', () => {
    const { getByRole } = renderWithTheme(
      <Fab icon={Plus} onPress={() => {}} accessibilityLabel="Add item" />,
    );

    expect(getByRole('button')).toBeTruthy();
  });

  it('should render with small size', () => {
    const { getByRole } = renderWithTheme(
      <Fab icon={Plus} size="small" onPress={() => {}} accessibilityLabel="Add item" />,
    );

    expect(getByRole('button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByRole } = renderWithTheme(
      <Fab icon={Plus} onPress={onPressMock} accessibilityLabel="Add item" />,
    );

    fireEvent.press(getByRole('button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByRole } = renderWithTheme(
      <Fab icon={Plus} onPress={onPressMock} accessibilityLabel="Add item" disabled />,
    );

    fireEvent.press(getByRole('button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should have correct accessibility attributes', () => {
    const { getByRole, getByLabelText } = renderWithTheme(
      <Fab icon={Plus} onPress={() => {}} accessibilityLabel="Add new item" />,
    );

    const button = getByRole('button');
    expect(button).toBeTruthy();
    expect(getByLabelText('Add new item')).toBeTruthy();
  });

  it('should have disabled state in accessibility', () => {
    const { getByRole } = renderWithTheme(
      <Fab icon={Plus} onPress={() => {}} accessibilityLabel="Add item" disabled />,
    );

    const button = getByRole('button');
    expect(button).toHaveProp('accessibilityState', { disabled: true });
  });

  it('should render with testID when provided', () => {
    const { getByTestId } = renderWithTheme(
      <Fab icon={Plus} onPress={() => {}} accessibilityLabel="Add item" testID="fab-test" />,
    );

    expect(getByTestId('fab-test')).toBeTruthy();
  });
});
