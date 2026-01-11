/**
 * Label Atom Tests
 */

import React from 'react';

import { Label } from '@design-system/atoms/Label/Label';
import { renderWithTheme } from '../testUtils';

describe('Label Atom', () => {
  it('should render with children text', () => {
    const { getByText } = renderWithTheme(<Label>Test Label</Label>);
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('should show required asterisk when required is true', () => {
    const { getByText } = renderWithTheme(<Label required>Required</Label>);
    expect(getByText(/Required/)).toBeTruthy();
    expect(getByText(/\*/)).toBeTruthy();
  });

  it('should not show asterisk when required is false', () => {
    const { getByText, queryByText } = renderWithTheme(<Label>Not Required</Label>);
    expect(getByText('Not Required')).toBeTruthy();
    expect(queryByText(/\*/)).toBeNull();
  });

  it('should apply disabled styling when disabled is true', () => {
    const { getByText } = renderWithTheme(<Label disabled>Disabled</Label>);
    const label = getByText('Disabled');
    expect(label).toBeTruthy();

    // Flatten style array to handle nested arrays
    const flattenStyles = (styles: unknown[]): unknown[] => {
      return styles.reduce<unknown[]>((acc, style) => {
        if (Array.isArray(style)) {
          return [...acc, ...flattenStyles(style)];
        }
        return [...acc, style];
      }, []);
    };

    const flattenedStyles = flattenStyles(label.props.style);
    expect(flattenedStyles).toEqual(
      expect.arrayContaining([expect.objectContaining({ opacity: 0.5 })]),
    );
  });

  it('should handle both required and disabled states', () => {
    const { getByText } = renderWithTheme(
      <Label required disabled>
        Required & Disabled
      </Label>,
    );
    expect(getByText(/Required & Disabled/)).toBeTruthy();
    expect(getByText(/\*/)).toBeTruthy();
  });
});
