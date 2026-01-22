/**
 * PriceBadge Atom Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { PriceBadge } from '@design-system/atoms/PriceBadge/PriceBadge';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('PriceBadge', () => {
  it('renders formatted price correctly', () => {
    const { getByText } = renderWithTheme(<PriceBadge price={8.5} />);

    expect(getByText('R$ 8,50')).toBeTruthy();
  });

  it('formats large prices correctly', () => {
    const { getByText } = renderWithTheme(<PriceBadge price={1234.99} />);

    expect(getByText('R$ 1.234,99')).toBeTruthy();
  });

  it('formats prices with two decimal places', () => {
    const { getByText } = renderWithTheme(<PriceBadge price={10} />);

    expect(getByText('R$ 10,00')).toBeTruthy();
  });

  it('handles zero price', () => {
    const { getByText } = renderWithTheme(<PriceBadge price={0} />);

    expect(getByText('R$ 0,00')).toBeTruthy();
  });

  it('renders with testID', () => {
    const { getByTestId } = renderWithTheme(<PriceBadge price={5.99} testID="price-badge" />);

    expect(getByTestId('price-badge')).toBeTruthy();
  });

  it('has correct accessibility label', () => {
    const { getByLabelText } = renderWithTheme(<PriceBadge price={15.5} />);

    expect(getByLabelText('R$ 15,50')).toBeTruthy();
  });
});
