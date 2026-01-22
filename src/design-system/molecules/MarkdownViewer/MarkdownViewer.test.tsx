/**
 * MarkdownViewer Molecule Tests
 */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { ThemeProvider } from '../../theme';
import { MarkdownViewer } from './MarkdownViewer';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider initialMode="dark">{component}</ThemeProvider>);
};

describe('MarkdownViewer', () => {
  it('should render plain text', () => {
    renderWithTheme(<MarkdownViewer content="Hello world" />);
    expect(screen.getByText('Hello world')).toBeTruthy();
  });

  it('should render bold text', () => {
    renderWithTheme(<MarkdownViewer content="This is **bold** text" />);
    expect(screen.getByText(/bold/)).toBeTruthy();
  });

  it('should render italic text', () => {
    renderWithTheme(<MarkdownViewer content="This is *italic* text" />);
    expect(screen.getByText(/italic/)).toBeTruthy();
  });

  it('should render headers', () => {
    renderWithTheme(<MarkdownViewer content="# Header 1" />);
    expect(screen.getByText('Header 1')).toBeTruthy();
  });

  it('should render unordered lists', () => {
    renderWithTheme(<MarkdownViewer content="- Item 1\n- Item 2" />);
    expect(screen.getByText(/Item 1/)).toBeTruthy();
    expect(screen.getByText(/Item 2/)).toBeTruthy();
  });

  it('should render ordered lists', () => {
    renderWithTheme(<MarkdownViewer content="1. First\n2. Second" />);
    expect(screen.getByText(/First/)).toBeTruthy();
    expect(screen.getByText(/Second/)).toBeTruthy();
  });

  it('should render links', () => {
    renderWithTheme(<MarkdownViewer content="Visit [Google](https://google.com)" />);
    expect(screen.getByText('Google')).toBeTruthy();
  });

  it('should call onLinkPress when link is pressed', () => {
    const onLinkPress = jest.fn();
    renderWithTheme(
      <MarkdownViewer content="Visit [Google](https://google.com)" onLinkPress={onLinkPress} />,
    );

    fireEvent.press(screen.getByText('Google'));
    expect(onLinkPress).toHaveBeenCalledWith('https://google.com');
  });

  it('should render code blocks', () => {
    renderWithTheme(<MarkdownViewer content="```\ncode here\n```" />);
    expect(screen.getByText('code here')).toBeTruthy();
  });

  it('should render inline code', () => {
    renderWithTheme(<MarkdownViewer content="Use `npm install` to install" />);
    expect(screen.getByText(/npm install/)).toBeTruthy();
  });

  it('should render blockquotes', () => {
    renderWithTheme(<MarkdownViewer content="> This is a quote" />);
    expect(screen.getByText(/This is a quote/)).toBeTruthy();
  });

  it('should render horizontal rules', () => {
    renderWithTheme(<MarkdownViewer content="Above\n---\nBelow" />);
    expect(screen.getByText('Above')).toBeTruthy();
    expect(screen.getByText('Below')).toBeTruthy();
  });

  it('should handle empty content', () => {
    const { toJSON } = renderWithTheme(<MarkdownViewer content="" />);
    expect(toJSON()).toBeTruthy();
  });

  it('should handle strikethrough text', () => {
    renderWithTheme(<MarkdownViewer content="This is ~~deleted~~ text" />);
    expect(screen.getByText(/deleted/)).toBeTruthy();
  });

  it('should apply custom style', () => {
    const { toJSON } = renderWithTheme(<MarkdownViewer content="Test" style={{ marginTop: 20 }} />);
    expect(toJSON()).toBeTruthy();
  });
});
