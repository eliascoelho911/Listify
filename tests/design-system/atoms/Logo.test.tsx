/**
 * Logo Atom Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { Logo } from '@design-system/atoms/Logo/Logo';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Logo Atom', () => {
  it('should render with default size (md)', () => {
    const { getByText } = renderWithTheme(<Logo />);
    expect(getByText('Listify')).toBeTruthy();
  });

  it('should render with small size', () => {
    const { getByText } = renderWithTheme(<Logo size="sm" />);
    expect(getByText('Listify')).toBeTruthy();
  });

  it('should render with medium size', () => {
    const { getByText } = renderWithTheme(<Logo size="md" />);
    expect(getByText('Listify')).toBeTruthy();
  });

  it('should render with large size', () => {
    const { getByText } = renderWithTheme(<Logo size="lg" />);
    expect(getByText('Listify')).toBeTruthy();
  });

  it('should pass through additional ViewProps', () => {
    const { getByTestId } = renderWithTheme(<Logo testID="logo-test" />);
    expect(getByTestId('logo-test')).toBeTruthy();
  });
});
