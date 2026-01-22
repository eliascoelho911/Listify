/**
 * ColorPicker Molecule Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { ColorPicker } from '@design-system/molecules/ColorPicker/ColorPicker';
import type { ColorOption } from '@design-system/molecules/ColorPicker/ColorPicker.types';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider initialMode="dark">{component}</ThemeProvider>);
};

const MOCK_COLORS: ColorOption[] = [
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#f43f5e', label: 'Rose' },
];

describe('ColorPicker Molecule', () => {
  it('renders all color options', () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ColorPicker
        colors={MOCK_COLORS}
        selectedColor="#06b6d4"
        onSelect={onSelect}
        testID="color-picker"
      />,
    );

    expect(getByTestId('color-picker-06b6d4')).toBeTruthy();
    expect(getByTestId('color-picker-8b5cf6')).toBeTruthy();
    expect(getByTestId('color-picker-f43f5e')).toBeTruthy();
  });

  it('calls onSelect when a color is pressed', () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ColorPicker
        colors={MOCK_COLORS}
        selectedColor="#06b6d4"
        onSelect={onSelect}
        testID="color-picker"
      />,
    );

    fireEvent.press(getByTestId('color-picker-8b5cf6'));

    expect(onSelect).toHaveBeenCalledWith('#8b5cf6');
  });
});
