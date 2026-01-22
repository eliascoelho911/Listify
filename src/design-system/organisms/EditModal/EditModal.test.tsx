/**
 * EditModal Organism Tests
 */

import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import type { ShoppingItem } from '@domain/item';

import { renderWithTheme } from '../../../../tests/design-system/testUtils';
import { EditModal } from './EditModal';
import { shoppingItemToEditableString } from './EditModal.types';

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockShoppingItem: ShoppingItem = {
  id: 'item-1',
  listId: 'list-1',
  sectionId: undefined,
  title: 'Leite',
  type: 'shopping',
  quantity: '2L',
  price: 8.99,
  isChecked: false,
  sortOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('EditModal', () => {
  const defaultProps = {
    visible: true,
    item: mockShoppingItem,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('shoppingItemToEditableString', () => {
    it('should convert shopping item with all fields to editable string', () => {
      const result = shoppingItemToEditableString(mockShoppingItem);
      expect(result).toBe('Leite 2L R$8,99');
    });

    it('should handle item without quantity', () => {
      const item: ShoppingItem = {
        ...mockShoppingItem,
        quantity: undefined,
      };
      const result = shoppingItemToEditableString(item);
      expect(result).toBe('Leite R$8,99');
    });

    it('should handle item without price', () => {
      const item: ShoppingItem = {
        ...mockShoppingItem,
        price: undefined,
      };
      const result = shoppingItemToEditableString(item);
      expect(result).toBe('Leite 2L');
    });

    it('should handle item with only title', () => {
      const item: ShoppingItem = {
        ...mockShoppingItem,
        quantity: undefined,
        price: undefined,
      };
      const result = shoppingItemToEditableString(item);
      expect(result).toBe('Leite');
    });

    it('should handle price of 0', () => {
      const item: ShoppingItem = {
        ...mockShoppingItem,
        price: 0,
      };
      const result = shoppingItemToEditableString(item);
      expect(result).toBe('Leite 2L');
    });
  });

  describe('rendering', () => {
    it('should render nothing when not visible', () => {
      renderWithTheme(<EditModal {...defaultProps} visible={false} />);
      expect(screen.queryByTestId('edit-modal-input')).toBeNull();
    });

    it('should render modal when visible', () => {
      renderWithTheme(<EditModal {...defaultProps} />);
      expect(screen.getByTestId('edit-modal-input')).toBeTruthy();
    });

    it('should pre-fill input with item data', () => {
      renderWithTheme(<EditModal {...defaultProps} />);
      const input = screen.getByTestId('edit-modal-input');
      expect(input.props.value).toBe('Leite 2L R$8,99');
    });

    it('should render delete button when onDelete is provided', () => {
      renderWithTheme(<EditModal {...defaultProps} />);
      expect(screen.getByTestId('edit-modal-delete')).toBeTruthy();
    });

    it('should not render delete button when onDelete is not provided', () => {
      renderWithTheme(<EditModal {...defaultProps} onDelete={undefined} />);
      expect(screen.queryByTestId('edit-modal-delete')).toBeNull();
    });
  });

  describe('interactions', () => {
    it('should call onClose when overlay is pressed', () => {
      const onClose = jest.fn();
      renderWithTheme(<EditModal {...defaultProps} onClose={onClose} />);

      // The overlay should call onClose - we need to find it by structure
      // Since the modal uses nested Pressables, we test via the close button
      const closeButton = screen.getByLabelText('Fechar');
      fireEvent.press(closeButton);
      expect(onClose).toHaveBeenCalled();
    });

    it('should call onSubmit with parsed data when submit is pressed', async () => {
      const onSubmit = jest.fn();
      renderWithTheme(<EditModal {...defaultProps} onSubmit={onSubmit} />);

      const submitButton = screen.getByTestId('edit-modal-submit');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });

      const submitCall = onSubmit.mock.calls[0][0];
      expect(submitCall.updates.title).toBe('Leite');
      expect(submitCall.updates.quantity).toBe('2L');
      expect(submitCall.updates.price).toBe(8.99);
    });

    it('should call onDelete when delete button is pressed', () => {
      const onDelete = jest.fn();
      renderWithTheme(<EditModal {...defaultProps} onDelete={onDelete} />);

      const deleteButton = screen.getByTestId('edit-modal-delete');
      fireEvent.press(deleteButton);

      expect(onDelete).toHaveBeenCalledWith(mockShoppingItem);
    });

    it('should update parsed values when input changes', () => {
      const onSubmit = jest.fn();
      renderWithTheme(<EditModal {...defaultProps} onSubmit={onSubmit} />);

      const input = screen.getByTestId('edit-modal-input');
      fireEvent.changeText(input, 'Pão 500g R$5,50');

      const submitButton = screen.getByTestId('edit-modal-submit');
      fireEvent.press(submitButton);

      const submitCall = onSubmit.mock.calls[0][0];
      expect(submitCall.updates.title).toBe('Pão');
      expect(submitCall.updates.quantity).toBe('500g');
      expect(submitCall.updates.price).toBe(5.5);
    });
  });

  describe('validation', () => {
    it('should disable submit button when title is empty', () => {
      renderWithTheme(<EditModal {...defaultProps} />);

      const input = screen.getByTestId('edit-modal-input');
      fireEvent.changeText(input, '');

      const submitButton = screen.getByTestId('edit-modal-submit');
      expect(submitButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('should not call onSubmit when title is empty', () => {
      const onSubmit = jest.fn();
      renderWithTheme(<EditModal {...defaultProps} onSubmit={onSubmit} />);

      const input = screen.getByTestId('edit-modal-input');
      fireEvent.changeText(input, '   ');

      const submitButton = screen.getByTestId('edit-modal-submit');
      fireEvent.press(submitButton);

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});
