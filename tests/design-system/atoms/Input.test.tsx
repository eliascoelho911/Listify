/**
 * Input Atom Tests
 */

import React from 'react';

import { Input } from '@design-system/atoms/Input/Input';

import { renderWithTheme } from '../testUtils';

describe('Input Atom', () => {
  it('should render with placeholder', () => {
    const { getByPlaceholderText } = renderWithTheme(<Input placeholder="Enter text" />);
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render with value', () => {
    const { getByDisplayValue } = renderWithTheme(<Input value="Test value" />);
    expect(getByDisplayValue('Test value')).toBeTruthy();
  });

  it('should show error message when in error state', () => {
    const { getByText } = renderWithTheme(<Input state="error" errorMessage="Error message" />);
    expect(getByText('Error message')).toBeTruthy();
  });

  it('should show helper text', () => {
    const { getByText } = renderWithTheme(<Input helperText="Helper text" />);
    expect(getByText('Helper text')).toBeTruthy();
  });

  it('should prioritize error message over helper text', () => {
    const { getByText, queryByText } = renderWithTheme(
      <Input state="error" errorMessage="Error" helperText="Helper" />,
    );
    expect(getByText('Error')).toBeTruthy();
    expect(queryByText('Helper')).toBeNull();
  });

  it('should be disabled when editable is false', () => {
    const { getByDisplayValue } = renderWithTheme(<Input value="Disabled" editable={false} />);
    const input = getByDisplayValue('Disabled');
    expect(input.props.editable).toBe(false);
  });
});
