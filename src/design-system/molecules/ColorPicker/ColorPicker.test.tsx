/**
 * ColorPicker Molecule Tests
 *
 * Note: This file uses hardcoded color values intentionally as test data.
 */
/* eslint-disable local-rules/no-hardcoded-values */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { ThemeProvider } from '../../theme';
import { ColorPicker } from './ColorPicker';
import type { ColorOption } from './ColorPicker.types';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider initialMode="dark">{ui}</ThemeProvider>);
};

const MOCK_COLORS: ColorOption[] = [
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#f43f5e', label: 'Rose' },
  { value: '#22c55e', label: 'Green' },
];

describe('ColorPicker', () => {
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
    expect(getByTestId('color-picker-22c55e')).toBeTruthy();
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

  it('marks selected color with correct accessibility state', () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ColorPicker
        colors={MOCK_COLORS}
        selectedColor="#f43f5e"
        onSelect={onSelect}
        testID="color-picker"
      />,
    );

    const selectedSwatch = getByTestId('color-picker-f43f5e');
    expect(selectedSwatch.props.accessibilityState.selected).toBe(true);

    const unselectedSwatch = getByTestId('color-picker-06b6d4');
    expect(unselectedSwatch.props.accessibilityState.selected).toBe(false);
  });

  it('renders container with radiogroup accessibility role', () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ColorPicker
        colors={MOCK_COLORS}
        selectedColor="#06b6d4"
        onSelect={onSelect}
        testID="color-picker"
      />,
    );

    const container = getByTestId('color-picker');
    expect(container.props.accessibilityRole).toBe('radiogroup');
  });

  it('handles undefined selectedColor', () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ColorPicker
        colors={MOCK_COLORS}
        selectedColor={undefined}
        onSelect={onSelect}
        testID="color-picker"
      />,
    );

    // All swatches should be unselected
    const swatch = getByTestId('color-picker-06b6d4');
    expect(swatch.props.accessibilityState.selected).toBe(false);
  });
});
