/**
 * AlertDialog Molecule Tests
 *
 * Diálogo de confirmação.
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { AlertDialog } from '@design-system/molecules/AlertDialog/AlertDialog';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('AlertDialog Molecule', () => {
  const defaultProps = {
    visible: true,
    title: 'Test Title',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title', () => {
    const { getByText } = renderWithTheme(<AlertDialog {...defaultProps} />);

    expect(getByText('Test Title')).toBeTruthy();
  });

  it('should render description when provided', () => {
    const { getByText } = renderWithTheme(
      <AlertDialog {...defaultProps} description="Test description" />,
    );

    expect(getByText('Test description')).toBeTruthy();
  });

  it('should call onConfirm when confirm button is pressed', () => {
    const onConfirm = jest.fn();
    const { getByText } = renderWithTheme(<AlertDialog {...defaultProps} onConfirm={onConfirm} />);

    fireEvent.press(getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is pressed', () => {
    const onCancel = jest.fn();
    const { getByText } = renderWithTheme(<AlertDialog {...defaultProps} onCancel={onCancel} />);

    fireEvent.press(getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('should render custom button labels', () => {
    const { getByText } = renderWithTheme(
      <AlertDialog {...defaultProps} confirmLabel="Delete" cancelLabel="Keep" />,
    );

    expect(getByText('Delete')).toBeTruthy();
    expect(getByText('Keep')).toBeTruthy();
  });

  it('should disable buttons when loading', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    const { getByText } = renderWithTheme(
      <AlertDialog {...defaultProps} isLoading onConfirm={onConfirm} onCancel={onCancel} />,
    );

    fireEvent.press(getByText('Cancel'));
    expect(onCancel).not.toHaveBeenCalled();
  });
});
