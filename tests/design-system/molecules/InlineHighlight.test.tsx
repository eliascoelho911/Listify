/**
 * InlineHighlight Molecule Tests
 */

import { render } from '@testing-library/react-native';
import React from 'react';

import { InlineHighlight } from '@design-system/molecules/InlineHighlight/InlineHighlight';
import type { HighlightSegment } from '@design-system/molecules/InlineHighlight/InlineHighlight.types';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('InlineHighlight Molecule', () => {
  it('should render plain text without highlights', () => {
    const { getByText } = renderWithTheme(
      <InlineHighlight text="Simple text" highlights={[]} />
    );
    expect(getByText('Simple text')).toBeTruthy();
  });

  it('should render text with list highlight', () => {
    const highlights: HighlightSegment[] = [
      { type: 'list', start: 5, end: 13, value: '@Mercado' },
    ];
    const { getByText } = renderWithTheme(
      <InlineHighlight text="Item @Mercado" highlights={highlights} />
    );
    expect(getByText('Item ')).toBeTruthy();
    expect(getByText('@Mercado')).toBeTruthy();
  });

  it('should render text with multiple highlights', () => {
    const highlights: HighlightSegment[] = [
      { type: 'quantity', start: 6, end: 8, value: '2L' },
      { type: 'price', start: 9, end: 16, value: 'R$8,50' },
      { type: 'list', start: 17, end: 25, value: '@Mercado' },
    ];
    const { getByText } = renderWithTheme(
      <InlineHighlight text="Leite 2L R$8,50 @Mercado" highlights={highlights} />
    );
    expect(getByText('Leite ')).toBeTruthy();
    expect(getByText('2L')).toBeTruthy();
    expect(getByText(' ')).toBeTruthy();
    expect(getByText('R$8,50')).toBeTruthy();
    expect(getByText('@Mercado')).toBeTruthy();
  });

  it('should render text with section highlight', () => {
    const highlights: HighlightSegment[] = [
      { type: 'section', start: 5, end: 13, value: ':Urgente' },
    ];
    const { getByText } = renderWithTheme(
      <InlineHighlight text="Item :Urgente" highlights={highlights} />
    );
    expect(getByText(':Urgente')).toBeTruthy();
  });

  it('should handle empty text', () => {
    const { toJSON } = renderWithTheme(<InlineHighlight text="" highlights={[]} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should handle selectable prop', () => {
    const { toJSON } = renderWithTheme(
      <InlineHighlight text="Selectable text" highlights={[]} selectable />
    );
    expect(toJSON()).toBeTruthy();
  });
});
