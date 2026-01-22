/**
 * SectionAddButton Atom Tests
 */

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { SectionAddButton } from '@design-system/atoms/SectionAddButton/SectionAddButton';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('SectionAddButton Atom', () => {
  it('should render with default label', () => {
    const { getByText } = renderWithTheme(<SectionAddButton />);
    // Uses translation key when i18n is not loaded
    expect(getByText('sections.addSection')).toBeTruthy();
  });

  it('should render with custom label', () => {
    const { getByText } = renderWithTheme(<SectionAddButton label="New Section" />);
    expect(getByText('New Section')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<SectionAddButton onPress={onPress} />);

    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<SectionAddButton onPress={onPress} disabled />);

    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should have correct accessibility state when disabled', () => {
    const { getByRole } = renderWithTheme(<SectionAddButton disabled />);

    expect(getByRole('button').props.accessibilityState).toEqual({ disabled: true });
  });

  it('should have correct accessibility label', () => {
    const { getByLabelText } = renderWithTheme(<SectionAddButton label="Add Category" />);

    expect(getByLabelText('Add Category')).toBeTruthy();
  });
});
