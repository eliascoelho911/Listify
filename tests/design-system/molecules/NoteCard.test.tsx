/**
 * NoteCard Molecule Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import type { NoteItem } from '@domain/item/entities/item.entity';
import { NoteCard } from '@design-system/molecules/NoteCard/NoteCard';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

const createMockNote = (overrides: Partial<NoteItem> = {}): NoteItem => ({
  id: 'note-1',
  type: 'note',
  title: 'Test Note',
  description: 'This is a test description',
  sortOrder: 0,
  createdAt: new Date('2026-01-15T10:00:00.000Z'),
  updatedAt: new Date('2026-01-15T10:00:00.000Z'),
  ...overrides,
});

describe('NoteCard Molecule', () => {
  it('should render with note title', () => {
    const note = createMockNote({ title: 'My Note Title' });
    const { getByText } = renderWithTheme(<NoteCard note={note} />);
    expect(getByText('My Note Title')).toBeTruthy();
  });

  it('should render note description preview', () => {
    const note = createMockNote({ description: 'This is a preview of the note content' });
    const { getByText } = renderWithTheme(<NoteCard note={note} />);
    expect(getByText('This is a preview of the note content')).toBeTruthy();
  });

  it('should not show description when undefined', () => {
    const note = createMockNote({ description: undefined });
    const { queryByText } = renderWithTheme(<NoteCard note={note} />);
    expect(queryByText('This is a test description')).toBeNull();
  });

  it('should show character count when description exists', () => {
    const note = createMockNote({ description: '12345' });
    const { getByText } = renderWithTheme(<NoteCard note={note} />);
    expect(getByText('5 caracteres')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const note = createMockNote();
    const { getByRole } = renderWithTheme(<NoteCard note={note} onPress={onPress} />);

    fireEvent.press(getByRole('button'));

    expect(onPress).toHaveBeenCalledWith(note);
  });

  it('should call onLongPress when long pressed', () => {
    const onLongPress = jest.fn();
    const note = createMockNote();
    const { getByRole } = renderWithTheme(<NoteCard note={note} onLongPress={onLongPress} />);

    fireEvent(getByRole('button'), 'longPress');

    expect(onLongPress).toHaveBeenCalledWith(note);
  });

  it('should strip markdown from description preview', () => {
    const note = createMockNote({
      description: 'This is **bold** and _italic_ text',
    });
    const { getByText } = renderWithTheme(<NoteCard note={note} />);
    // Markdown symbols should be stripped
    expect(getByText('This is bold and italic text')).toBeTruthy();
  });

  it('should have correct accessibility label', () => {
    const note = createMockNote({ title: 'Accessible Note' });
    const { getByLabelText } = renderWithTheme(<NoteCard note={note} />);
    expect(getByLabelText('Note: Accessible Note')).toBeTruthy();
  });
});
