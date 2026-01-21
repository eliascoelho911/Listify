/**
 * ListForm Organism Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { ListForm } from '@design-system/organisms/ListForm/ListForm';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ListForm Organism', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render name input and category selector', () => {
    const { getByPlaceholderText, getByTestId } = renderWithTheme(
      <ListForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} testID="list-form" />,
    );

    expect(getByPlaceholderText('Digite o nome da lista...')).toBeTruthy();
    expect(getByTestId('list-form-category')).toBeTruthy();
  });

  it('should call onCancel when cancel button is pressed', () => {
    const { getByTestId } = renderWithTheme(
      <ListForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} testID="list-form" />,
    );

    fireEvent.press(getByTestId('list-form-cancel-button'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should show validation error when submitting empty name', () => {
    const { getByTestId, getByText } = renderWithTheme(
      <ListForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} testID="list-form" />,
    );

    fireEvent.press(getByTestId('list-form-submit-button'));

    expect(getByText('Nome é obrigatório')).toBeTruthy();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with form data when valid', () => {
    const { getByTestId, getByPlaceholderText } = renderWithTheme(
      <ListForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} testID="list-form" />,
    );

    const nameInput = getByPlaceholderText('Digite o nome da lista...');
    fireEvent.changeText(nameInput, 'My New List');

    fireEvent.press(getByTestId('list-form-submit-button'));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'My New List',
      listType: 'shopping',
    });
  });

  it('should pre-fill form with initial data in edit mode', () => {
    const { getByDisplayValue, getByText } = renderWithTheme(
      <ListForm
        initialData={{
          name: 'Existing List',
          listType: 'movies',
        }}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isEditing
      />,
    );

    expect(getByDisplayValue('Existing List')).toBeTruthy();
    expect(getByText('Salvar')).toBeTruthy();
  });

  it('should display error message when provided', () => {
    const { getByText } = renderWithTheme(
      <ListForm
        initialData={{ name: 'Test' }}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        error="Duplicate name error"
      />,
    );

    expect(getByText('Duplicate name error')).toBeTruthy();
  });

  it('should disable buttons when loading', () => {
    const { getByTestId } = renderWithTheme(
      <ListForm
        initialData={{ name: 'Test' }}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading
        testID="list-form"
      />,
    );

    fireEvent.press(getByTestId('list-form-cancel-button'));
    fireEvent.press(getByTestId('list-form-submit-button'));

    expect(mockOnCancel).not.toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
