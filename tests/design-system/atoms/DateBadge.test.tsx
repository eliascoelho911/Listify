/**
 * DateBadge Atom Tests
 *
 * Badge de data para separadores em listas (sticky headers).
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { DateBadge } from '@design-system/atoms/DateBadge/DateBadge';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('DateBadge Atom', () => {
  it('should render with label', () => {
    const { getByText } = renderWithTheme(<DateBadge label="Hoje" />);
    expect(getByText('Hoje')).toBeTruthy();
  });

  it('should render with today variant', () => {
    const { getByText } = renderWithTheme(<DateBadge label="Hoje" variant="today" />);
    expect(getByText('Hoje')).toBeTruthy();
  });

  it('should render with yesterday variant', () => {
    const { getByText } = renderWithTheme(<DateBadge label="Ontem" variant="yesterday" />);
    expect(getByText('Ontem')).toBeTruthy();
  });

  it('should render with default variant', () => {
    const { getByText } = renderWithTheme(<DateBadge label="12 Jan 2025" variant="default" />);
    expect(getByText('12 Jan 2025')).toBeTruthy();
  });

  it('should use default variant when not specified', () => {
    const { getByText } = renderWithTheme(<DateBadge label="Segunda-feira" />);
    expect(getByText('Segunda-feira')).toBeTruthy();
  });
});
