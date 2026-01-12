/**
 * ContextMenu Molecule Tests
 *
 * Menu de opções contextual (long press).
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { ContextMenu } from '@design-system/molecules/ContextMenu/ContextMenu';
import type { ContextMenuItem } from '@design-system/molecules/ContextMenu/ContextMenu.types';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ContextMenu Molecule', () => {
  const mockItems: ContextMenuItem[] = [
    { id: 'edit', label: 'Edit' },
    { id: 'delete', label: 'Delete', destructive: true },
  ];

  const defaultProps = {
    items: mockItems,
    visible: true,
    onClose: jest.fn(),
    onSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render items when visible', () => {
    const { getByText } = renderWithTheme(<ContextMenu {...defaultProps} />);

    expect(getByText('Edit')).toBeTruthy();
    expect(getByText('Delete')).toBeTruthy();
  });

  it('should call onSelect when item is pressed', () => {
    const onSelect = jest.fn();
    const { getByText } = renderWithTheme(<ContextMenu {...defaultProps} onSelect={onSelect} />);

    fireEvent.press(getByText('Edit'));
    expect(onSelect).toHaveBeenCalledWith(mockItems[0]);
  });

  it('should call onClose after selecting an item', () => {
    const onClose = jest.fn();
    const { getByText } = renderWithTheme(<ContextMenu {...defaultProps} onClose={onClose} />);

    fireEvent.press(getByText('Edit'));
    expect(onClose).toHaveBeenCalled();
  });

  it('should render title when provided', () => {
    const { getByText } = renderWithTheme(<ContextMenu {...defaultProps} title="Actions" />);

    expect(getByText('Actions')).toBeTruthy();
  });

  it('should not call onSelect for disabled items', () => {
    const items: ContextMenuItem[] = [{ id: 'edit', label: 'Edit', disabled: true }];
    const onSelect = jest.fn();
    const { getByText } = renderWithTheme(
      <ContextMenu {...defaultProps} items={items} onSelect={onSelect} />,
    );

    fireEvent.press(getByText('Edit'));
    expect(onSelect).not.toHaveBeenCalled();
  });
});
