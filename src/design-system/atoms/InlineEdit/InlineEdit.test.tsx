/**
 * InlineEdit Atom Tests
 */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { ThemeProvider } from '../../theme';
import { InlineEdit } from './InlineEdit';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider initialMode="dark">{component}</ThemeProvider>);
};

describe('InlineEdit', () => {
  it('should render with value in display mode', () => {
    renderWithTheme(<InlineEdit value="Test Value" onChangeText={jest.fn()} />);
    expect(screen.getByText('Test Value')).toBeTruthy();
  });

  it('should render placeholder when value is empty', () => {
    renderWithTheme(<InlineEdit value="" onChangeText={jest.fn()} placeholder="Enter text" />);
    expect(screen.getByText('Enter text')).toBeTruthy();
  });

  it('should enter edit mode on press', () => {
    renderWithTheme(<InlineEdit value="Test" onChangeText={jest.fn()} />);

    fireEvent.press(screen.getByText('Test'));
    // In edit mode, an input should be visible
    expect(screen.getByDisplayValue('Test')).toBeTruthy();
  });

  it('should call onChangeText when editing', () => {
    const onChangeText = jest.fn();
    renderWithTheme(<InlineEdit value="Test" onChangeText={onChangeText} isEditing />);

    fireEvent.changeText(screen.getByDisplayValue('Test'), 'New Text');
    expect(onChangeText).toHaveBeenCalledWith('New Text');
  });

  it('should exit edit mode and call onSubmit on blur', () => {
    const onSubmit = jest.fn();
    renderWithTheme(
      <InlineEdit value="Test" onChangeText={jest.fn()} onSubmit={onSubmit} isEditing />,
    );

    fireEvent(screen.getByDisplayValue('Test'), 'blur');
    expect(onSubmit).toHaveBeenCalledWith('Test');
  });

  it('should not enter edit mode when disabled', () => {
    renderWithTheme(<InlineEdit value="Disabled" onChangeText={jest.fn()} disabled />);

    fireEvent.press(screen.getByText('Disabled'));
    // Should still show text, not input
    expect(screen.getByText('Disabled')).toBeTruthy();
    expect(screen.queryByDisplayValue('Disabled')).toBeNull();
  });

  it('should call onEditingChange when editing state changes', () => {
    const onEditingChange = jest.fn();
    renderWithTheme(
      <InlineEdit value="Test" onChangeText={jest.fn()} onEditingChange={onEditingChange} />,
    );

    fireEvent.press(screen.getByText('Test'));
    expect(onEditingChange).toHaveBeenCalledWith(true);
  });

  it('should apply title variant styles', () => {
    const { toJSON } = renderWithTheme(
      <InlineEdit value="Title" onChangeText={jest.fn()} variant="title" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('should apply subtitle variant styles', () => {
    const { toJSON } = renderWithTheme(
      <InlineEdit value="Subtitle" onChangeText={jest.fn()} variant="subtitle" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('should respect maxLength', () => {
    renderWithTheme(<InlineEdit value="Test" onChangeText={jest.fn()} maxLength={10} isEditing />);

    const input = screen.getByDisplayValue('Test');
    expect(input.props.maxLength).toBe(10);
  });

  it('should handle multiline mode', () => {
    renderWithTheme(
      <InlineEdit value="Line 1\nLine 2" onChangeText={jest.fn()} multiline isEditing />,
    );

    const input = screen.getByDisplayValue('Line 1\nLine 2');
    expect(input.props.multiline).toBe(true);
  });

  it('should show edit icon when not disabled', () => {
    renderWithTheme(<InlineEdit value="Text" onChangeText={jest.fn()} />);
    // Edit icon should be present (pencil icon)
    expect(screen.getByLabelText(/Edit/)).toBeTruthy();
  });

  it('should apply custom style', () => {
    const { toJSON } = renderWithTheme(
      <InlineEdit value="Test" onChangeText={jest.fn()} style={{ marginTop: 20 }} />,
    );
    expect(toJSON()).toBeTruthy();
  });
});
