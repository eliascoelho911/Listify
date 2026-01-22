/**
 * TotalBar Molecule Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { TotalBar } from '@design-system/molecules/TotalBar/TotalBar';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('TotalBar', () => {
  it('renders formatted total correctly', () => {
    const { getByText } = renderWithTheme(
      <TotalBar total={85.47} checkedCount={3} totalCount={8} />,
    );

    expect(getByText('R$ 85,47')).toBeTruthy();
  });

  it('renders progress text correctly', () => {
    const { getByText } = renderWithTheme(<TotalBar total={0} checkedCount={3} totalCount={8} />);

    expect(getByText('3/8 items')).toBeTruthy();
  });

  it('renders total label', () => {
    const { getByText } = renderWithTheme(<TotalBar total={0} checkedCount={0} totalCount={5} />);

    expect(getByText('Total')).toBeTruthy();
  });

  it('renders warning text when items have no price', () => {
    const { getByTestId } = renderWithTheme(
      <TotalBar
        total={50}
        checkedCount={2}
        totalCount={6}
        itemsWithoutPrice={3}
        testID="total-bar"
      />,
    );

    expect(getByTestId('total-bar-warning')).toBeTruthy();
  });

  it('does not render warning when all items have prices', () => {
    const { queryByTestId } = renderWithTheme(
      <TotalBar
        total={100}
        checkedCount={5}
        totalCount={5}
        itemsWithoutPrice={0}
        testID="total-bar"
      />,
    );

    expect(queryByTestId('total-bar-warning')).toBeNull();
  });

  it('renders with testID', () => {
    const { getByTestId } = renderWithTheme(
      <TotalBar total={0} checkedCount={0} totalCount={0} testID="total-bar" />,
    );

    expect(getByTestId('total-bar')).toBeTruthy();
  });

  it('formats large totals correctly', () => {
    const { getByText } = renderWithTheme(
      <TotalBar total={1234.56} checkedCount={10} totalCount={15} />,
    );

    expect(getByText('R$ 1.234,56')).toBeTruthy();
  });
});
