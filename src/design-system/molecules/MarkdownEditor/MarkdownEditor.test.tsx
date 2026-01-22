/**
 * MarkdownEditor Molecule Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

import { ThemeProvider } from '../../theme';
import { MarkdownEditor } from './MarkdownEditor';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider initialMode="dark">{component}</ThemeProvider>);
};

describe('MarkdownEditor', () => {
  it('should render with placeholder', () => {
    renderWithTheme(
      <MarkdownEditor
        value=""
        onChangeText={jest.fn()}
        placeholder="Start writing..."
      />,
    );
    expect(screen.getByPlaceholderText('Start writing...')).toBeTruthy();
  });

  it('should render with initial value', () => {
    renderWithTheme(
      <MarkdownEditor value="Hello world" onChangeText={jest.fn()} />,
    );
    expect(screen.getByDisplayValue('Hello world')).toBeTruthy();
  });

  it('should call onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    renderWithTheme(
      <MarkdownEditor value="" onChangeText={onChangeText} />,
    );

    fireEvent.changeText(screen.getByPlaceholderText('Start writing...'), 'New text');
    expect(onChangeText).toHaveBeenCalledWith('New text');
  });

  it('should show toolbar by default', () => {
    renderWithTheme(
      <MarkdownEditor value="" onChangeText={jest.fn()} />,
    );

    // Toolbar buttons should be visible
    expect(screen.getByLabelText('Format bold')).toBeTruthy();
    expect(screen.getByLabelText('Format italic')).toBeTruthy();
  });

  it('should hide toolbar when showToolbar is false', () => {
    renderWithTheme(
      <MarkdownEditor
        value=""
        onChangeText={jest.fn()}
        showToolbar={false}
      />,
    );

    // Toolbar buttons should not be visible
    expect(screen.queryByLabelText('Format bold')).toBeNull();
  });

  it('should be disabled when editable is false', () => {
    renderWithTheme(
      <MarkdownEditor
        value="Content"
        onChangeText={jest.fn()}
        editable={false}
      />,
    );

    const input = screen.getByDisplayValue('Content');
    expect(input.props.editable).toBe(false);
  });

  it('should call onBlur when editor loses focus', () => {
    const onBlur = jest.fn();
    renderWithTheme(
      <MarkdownEditor value="" onChangeText={jest.fn()} onBlur={onBlur} />,
    );

    fireEvent(screen.getByPlaceholderText('Start writing...'), 'blur');
    expect(onBlur).toHaveBeenCalled();
  });

  it('should call onFocus when editor gains focus', () => {
    const onFocus = jest.fn();
    renderWithTheme(
      <MarkdownEditor value="" onChangeText={jest.fn()} onFocus={onFocus} />,
    );

    fireEvent(screen.getByPlaceholderText('Start writing...'), 'focus');
    expect(onFocus).toHaveBeenCalled();
  });

  it('should apply custom style', () => {
    const { toJSON } = renderWithTheme(
      <MarkdownEditor
        value=""
        onChangeText={jest.fn()}
        style={{ marginTop: 20 }}
      />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('should apply minHeight to input', () => {
    const { toJSON } = renderWithTheme(
      <MarkdownEditor
        value=""
        onChangeText={jest.fn()}
        minHeight={300}
      />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('should hide toolbar when editable is false', () => {
    renderWithTheme(
      <MarkdownEditor
        value="Content"
        onChangeText={jest.fn()}
        editable={false}
        showToolbar={true}
      />,
    );

    // Toolbar should not show when not editable
    expect(screen.queryByLabelText('Format bold')).toBeNull();
  });
});
