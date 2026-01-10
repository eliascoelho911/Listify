/**
 * Label Atom Tests
 */

import { render } from '@testing-library/react-native';
import React from 'react';

import { Label } from '@design-system/atoms/Label/Label';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Label Atom', () => {
  it('should render with children text', () => {
    const { root } = renderWithTheme(<Label>Test Label</Label>);
    expect(root).toBeTruthy();
  });

  it('should show required asterisk when required is true', () => {
    const { getByText } = renderWithTheme(<Label required>Required</Label>);
    expect(getByText('Required')).toBeTruthy();
    expect(getByText('*')).toBeTruthy();
  });

  it('should not show asterisk when required is false', () => {
    const { getByText, queryByText } = renderWithTheme(<Label>Not Required</Label>);
    expect(getByText('Not Required')).toBeTruthy();
    expect(queryByText('*')).toBeNull();
  });

  it('should apply disabled styling when disabled is true', () => {
    const { getByText } = renderWithTheme(<Label disabled>Disabled</Label>);
    const label = getByText('Disabled');
    expect(label).toBeTruthy();
    expect(label.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ opacity: 0.5 })]),
    );
  });

  it('should handle both required and disabled states', () => {
    const { getByText } = renderWithTheme(
      <Label required disabled>
        Required & Disabled
      </Label>,
    );
    expect(getByText('Required & Disabled')).toBeTruthy();
    expect(getByText('*')).toBeTruthy();
  });
});
