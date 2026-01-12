/**
 * InputBar Molecule Tests
 */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Plus } from 'lucide-react-native';

import { ThemeProvider } from '../../theme';
import { InputBar } from './InputBar';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('InputBar', () => {
  const defaultProps = {
    value: '',
    onChangeText: jest.fn(),
    onSubmit: jest.fn(),
    placeholder: 'Type something...',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderWithTheme(<InputBar {...defaultProps} />);

    expect(screen.getByPlaceholderText('Type something...')).toBeTruthy();
  });

  it('displays the input value', () => {
    renderWithTheme(<InputBar {...defaultProps} value="Hello world" />);

    expect(screen.getByDisplayValue('Hello world')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    renderWithTheme(<InputBar {...defaultProps} onChangeText={onChangeText} />);

    const input = screen.getByPlaceholderText('Type something...');
    fireEvent.changeText(input, 'New text');

    expect(onChangeText).toHaveBeenCalledWith('New text');
  });

  it('calls onSubmit when submit button is pressed with non-empty value', () => {
    const onSubmit = jest.fn();
    renderWithTheme(<InputBar {...defaultProps} value="Test" onSubmit={onSubmit} />);

    const submitButton = screen.getByLabelText('Submit');
    fireEvent.press(submitButton);

    expect(onSubmit).toHaveBeenCalled();
  });

  it('disables submit button when value is empty', () => {
    const onSubmit = jest.fn();
    renderWithTheme(<InputBar {...defaultProps} value="" onSubmit={onSubmit} />);

    const submitButton = screen.getByLabelText('Submit');
    fireEvent.press(submitButton);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('disables submit button when value is only whitespace', () => {
    const onSubmit = jest.fn();
    renderWithTheme(<InputBar {...defaultProps} value="   " onSubmit={onSubmit} />);

    const submitButton = screen.getByLabelText('Submit');
    fireEvent.press(submitButton);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('disables input and submit when disabled prop is true', () => {
    const onSubmit = jest.fn();
    renderWithTheme(<InputBar {...defaultProps} value="Test" disabled onSubmit={onSubmit} />);

    const submitButton = screen.getByLabelText('Submit');
    fireEvent.press(submitButton);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('disables input and submit when isSubmitting is true', () => {
    const onSubmit = jest.fn();
    renderWithTheme(<InputBar {...defaultProps} value="Test" isSubmitting onSubmit={onSubmit} />);

    const submitButton = screen.getByLabelText('Submit');
    fireEvent.press(submitButton);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('uses custom submit icon when provided', () => {
    renderWithTheme(
      <InputBar {...defaultProps} submitIcon={Plus} submitAccessibilityLabel="Add" />,
    );

    expect(screen.getByLabelText('Add')).toBeTruthy();
  });

  it('uses custom accessibility label for submit button', () => {
    renderWithTheme(<InputBar {...defaultProps} submitAccessibilityLabel="Send message" />);

    expect(screen.getByLabelText('Send message')).toBeTruthy();
  });
});
