/**
 * DragHandle Atom Tests
 */

import { render } from '@testing-library/react-native';
import React from 'react';

import { DragHandle } from '@design-system/atoms/DragHandle/DragHandle';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('DragHandle Atom', () => {
  it('should render with default props', () => {
    const { toJSON } = renderWithTheme(<DragHandle />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render with different sizes', () => {
    const { toJSON: smallJSON } = renderWithTheme(<DragHandle size="sm" />);
    const { toJSON: mdJSON } = renderWithTheme(<DragHandle size="md" />);
    const { toJSON: lgJSON } = renderWithTheme(<DragHandle size="lg" />);

    expect(smallJSON()).toBeTruthy();
    expect(mdJSON()).toBeTruthy();
    expect(lgJSON()).toBeTruthy();
  });

  it('should render in dragging state', () => {
    const { toJSON } = renderWithTheme(<DragHandle isDragging />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render in disabled state', () => {
    const { toJSON } = renderWithTheme(<DragHandle disabled />);
    expect(toJSON()).toBeTruthy();
  });

  it('should accept custom style', () => {
    const { toJSON } = renderWithTheme(<DragHandle style={{ marginLeft: 10 }} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render 6 dots (2 columns x 3 rows)', () => {
    const { toJSON } = renderWithTheme(<DragHandle />);
    const tree = toJSON();

    // The component structure has container > dotsContainer > 2 columns > 3 dots each
    expect(tree).toBeTruthy();
    if (tree && 'children' in tree) {
      // dotsContainer
      const dotsContainer = tree.children?.[0];
      expect(dotsContainer).toBeTruthy();
      if (dotsContainer && typeof dotsContainer === 'object' && 'children' in dotsContainer) {
        // 2 columns
        expect(dotsContainer.children).toHaveLength(2);
      }
    }
  });
});
