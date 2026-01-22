/**
 * CompleteButton Molecule Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { CompleteButton } from '@design-system/molecules/CompleteButton/CompleteButton';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('CompleteButton Molecule', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('should render with total and item count', () => {
    const { getByText } = renderWithTheme(
      <CompleteButton onPress={mockOnPress} total={125.5} checkedCount={8} />,
    );
    expect(getByText('R$125,50')).toBeTruthy();
    // Translation returns key in test environment
    expect(getByText('shopping.itemCount.plural')).toBeTruthy();
  });

  it('should render singular item text for single item', () => {
    const { getByText } = renderWithTheme(
      <CompleteButton onPress={mockOnPress} total={15.99} checkedCount={1} />,
    );
    // Translation returns key in test environment
    expect(getByText('shopping.itemCount.singular')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const { getByRole } = renderWithTheme(
      <CompleteButton onPress={mockOnPress} total={125.5} checkedCount={8} />,
    );
    fireEvent.press(getByRole('button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const { getByRole } = renderWithTheme(
      <CompleteButton onPress={mockOnPress} total={125.5} checkedCount={8} disabled />,
    );
    fireEvent.press(getByRole('button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should be disabled when checkedCount is 0', () => {
    const { getByRole } = renderWithTheme(
      <CompleteButton onPress={mockOnPress} total={0} checkedCount={0} />,
    );
    fireEvent.press(getByRole('button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should render custom label when provided', () => {
    const { getByText } = renderWithTheme(
      <CompleteButton
        onPress={mockOnPress}
        total={125.5}
        checkedCount={8}
        label="Finalizar pedido"
      />,
    );
    expect(getByText('Finalizar pedido')).toBeTruthy();
  });
});
