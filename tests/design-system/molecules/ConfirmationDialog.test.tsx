/**
 * ConfirmationDialog Molecule Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { ConfirmationDialog } from '@design-system/molecules/ConfirmationDialog/ConfirmationDialog';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ConfirmationDialog', () => {
  const defaultProps = {
    visible: true,
    title: 'Delete Item',
    description: 'Are you sure?',
    confirmButton: { label: 'Delete', destructive: true },
    cancelButton: { label: 'Cancel' },
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title and description', () => {
    const { getByText } = renderWithTheme(<ConfirmationDialog {...defaultProps} />);

    expect(getByText('Delete Item')).toBeTruthy();
    expect(getByText('Are you sure?')).toBeTruthy();
  });

  it('should render confirm and cancel buttons', () => {
    const { getByText } = renderWithTheme(<ConfirmationDialog {...defaultProps} />);

    expect(getByText('Delete')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('should call onConfirm when confirm button is pressed', () => {
    const { getByText } = renderWithTheme(<ConfirmationDialog {...defaultProps} />);

    fireEvent.press(getByText('Delete'));

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is pressed', () => {
    const { getByText } = renderWithTheme(<ConfirmationDialog {...defaultProps} />);

    fireEvent.press(getByText('Cancel'));

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should not render description when not provided', () => {
    const { queryByText } = renderWithTheme(
      <ConfirmationDialog {...defaultProps} description={undefined} />,
    );

    expect(queryByText('Are you sure?')).toBeNull();
  });

  it('should not render cancel button when not provided', () => {
    const { queryByText } = renderWithTheme(
      <ConfirmationDialog {...defaultProps} cancelButton={undefined} />,
    );

    expect(queryByText('Cancel')).toBeNull();
  });

  it('should show loading indicator when isLoading is true', () => {
    const { queryByText, getByTestId } = renderWithTheme(
      <ConfirmationDialog {...defaultProps} isLoading={true} testID="dialog" />,
    );

    expect(queryByText('Delete')).toBeNull();
    expect(getByTestId('dialog-confirm')).toBeTruthy();
  });

  it('should disable cancel button when isLoading is true', () => {
    const { getByTestId } = renderWithTheme(
      <ConfirmationDialog {...defaultProps} isLoading={true} testID="dialog" />,
    );

    // The cancel button should be disabled during loading
    const cancelButton = getByTestId('dialog-cancel');
    expect(cancelButton.props.accessibilityState?.disabled).toBe(true);
  });

  it('should not call onConfirm when confirm button is disabled', () => {
    const { getByText } = renderWithTheme(
      <ConfirmationDialog
        {...defaultProps}
        confirmButton={{ ...defaultProps.confirmButton, disabled: true }}
      />,
    );

    fireEvent.press(getByText('Delete'));

    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });
});
