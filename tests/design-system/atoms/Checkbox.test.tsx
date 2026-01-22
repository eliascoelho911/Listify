/**
 * Checkbox Atom Tests
 */

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { Checkbox } from '@design-system/atoms/Checkbox/Checkbox';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Checkbox', () => {
  it('renders unchecked state correctly', () => {
    const { getByRole } = renderWithTheme(<Checkbox checked={false} />);

    const checkbox = getByRole('checkbox');
    expect(checkbox.props.accessibilityState.checked).toBe(false);
  });

  it('renders checked state correctly', () => {
    const { getByRole } = renderWithTheme(<Checkbox checked />);

    const checkbox = getByRole('checkbox');
    expect(checkbox.props.accessibilityState.checked).toBe(true);
  });

  it('calls onToggle when pressed', () => {
    const onToggle = jest.fn();
    const { getByRole } = renderWithTheme(<Checkbox checked={false} onToggle={onToggle} />);

    const checkbox = getByRole('checkbox');
    fireEvent.press(checkbox);

    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('calls onToggle with false when checked is true', () => {
    const onToggle = jest.fn();
    const { getByRole } = renderWithTheme(<Checkbox checked onToggle={onToggle} />);

    const checkbox = getByRole('checkbox');
    fireEvent.press(checkbox);

    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('does not call onToggle when disabled', () => {
    const onToggle = jest.fn();
    const { getByRole } = renderWithTheme(
      <Checkbox checked={false} onToggle={onToggle} disabled />,
    );

    const checkbox = getByRole('checkbox');
    fireEvent.press(checkbox);

    expect(onToggle).not.toHaveBeenCalled();
  });

  it('has correct accessibility state when disabled', () => {
    const { getByRole } = renderWithTheme(<Checkbox checked={false} disabled />);

    const checkbox = getByRole('checkbox');
    expect(checkbox.props.accessibilityState.disabled).toBe(true);
  });

  it('has correct accessibility label when unchecked', () => {
    const { getByLabelText } = renderWithTheme(<Checkbox checked={false} />);

    expect(getByLabelText('Unchecked')).toBeTruthy();
  });

  it('has correct accessibility label when checked', () => {
    const { getByLabelText } = renderWithTheme(<Checkbox checked />);

    expect(getByLabelText('Checked')).toBeTruthy();
  });

  it('renders with testID', () => {
    const { getByTestId } = renderWithTheme(<Checkbox checked={false} testID="my-checkbox" />);

    expect(getByTestId('my-checkbox')).toBeTruthy();
  });
});
