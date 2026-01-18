/**
 * Bottombar Atom Tests
 */

import { render } from '@testing-library/react-native';
import React from 'react';

import { Bottombar } from '@design-system/organisms/Bottombar/Bottombar';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Bottombar Atom', () => {
  it('should render with children', () => {
    const { getByText } = renderWithTheme(<Bottombar>Test content</Bottombar>);
    expect(getByText('Test content')).toBeTruthy();
  });
});
