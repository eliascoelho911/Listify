/**
 * ThemeSelector Molecule Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { ThemeSelector } from '@design-system/molecules/ThemeSelector/ThemeSelector';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider initialMode="dark">{component}</ThemeProvider>);
};

describe('ThemeSelector Molecule', () => {
  it('renders all three theme options', () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ThemeSelector selectedTheme="dark" onSelect={onSelect} testID="theme-selector" />,
    );

    expect(getByTestId('theme-selector-light')).toBeTruthy();
    expect(getByTestId('theme-selector-dark')).toBeTruthy();
    expect(getByTestId('theme-selector-auto')).toBeTruthy();
  });

  it('calls onSelect when an option is pressed', () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ThemeSelector selectedTheme="dark" onSelect={onSelect} testID="theme-selector" />,
    );

    fireEvent.press(getByTestId('theme-selector-light'));

    expect(onSelect).toHaveBeenCalledWith('light');
  });

  it('marks selected option with correct accessibility state', () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ThemeSelector selectedTheme="auto" onSelect={onSelect} testID="theme-selector" />,
    );

    const autoOption = getByTestId('theme-selector-auto');
    expect(autoOption.props.accessibilityState.selected).toBe(true);

    const darkOption = getByTestId('theme-selector-dark');
    expect(darkOption.props.accessibilityState.selected).toBe(false);
  });
});
