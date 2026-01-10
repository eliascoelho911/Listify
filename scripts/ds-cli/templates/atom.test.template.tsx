/**
 * {{NAME}} Atom Tests
 */

import { render } from '@testing-library/react-native';
import React from 'react';

import { {{NAME}} } from '@design-system/atoms/{{NAME}}/{{NAME}}';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('{{NAME}} Atom', () => {
  it('should render with children', () => {
    const { getByText } = renderWithTheme(<{{NAME}}>Test content</{{NAME}}>);
    expect(getByText('Test content')).toBeTruthy();
  });
});
