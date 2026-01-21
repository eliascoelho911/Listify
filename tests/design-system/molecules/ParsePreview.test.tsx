/**
 * ParsePreview Molecule Tests
 */

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ParsePreview } from '@design-system/molecules/ParsePreview/ParsePreview';
import type { ParsedElement } from '@design-system/molecules/ParsePreview/ParsePreview.types';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ParsePreview Molecule', () => {
  it('should render empty when no elements', () => {
    const { toJSON } = renderWithTheme(<ParsePreview elements={[]} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render list element chip', () => {
    const elements: ParsedElement[] = [{ type: 'list', value: '@Mercado' }];
    const { getByText } = renderWithTheme(<ParsePreview elements={elements} />);
    expect(getByText('@Mercado')).toBeTruthy();
  });

  it('should render section element chip', () => {
    const elements: ParsedElement[] = [{ type: 'section', value: ':Urgente' }];
    const { getByText } = renderWithTheme(<ParsePreview elements={elements} />);
    expect(getByText(':Urgente')).toBeTruthy();
  });

  it('should render price element chip', () => {
    const elements: ParsedElement[] = [{ type: 'price', value: 'R$10,50' }];
    const { getByText } = renderWithTheme(<ParsePreview elements={elements} />);
    expect(getByText('R$10,50')).toBeTruthy();
  });

  it('should render quantity element chip', () => {
    const elements: ParsedElement[] = [{ type: 'quantity', value: '5kg' }];
    const { getByText } = renderWithTheme(<ParsePreview elements={elements} />);
    expect(getByText('5kg')).toBeTruthy();
  });

  it('should render multiple elements', () => {
    const elements: ParsedElement[] = [
      { type: 'list', value: '@Mercado' },
      { type: 'quantity', value: '2L' },
      { type: 'price', value: 'R$8,50' },
    ];
    const { getByText } = renderWithTheme(<ParsePreview elements={elements} />);
    expect(getByText('@Mercado')).toBeTruthy();
    expect(getByText('2L')).toBeTruthy();
    expect(getByText('R$8,50')).toBeTruthy();
  });

  it('should render labels when showLabels is true', () => {
    const elements: ParsedElement[] = [{ type: 'list', value: '@Mercado' }];
    const { getByText } = renderWithTheme(<ParsePreview elements={elements} showLabels />);
    expect(getByText('Lista:')).toBeTruthy();
    expect(getByText('@Mercado')).toBeTruthy();
  });

  it('should use custom label when provided', () => {
    const elements: ParsedElement[] = [{ type: 'list', value: '@Mercado', label: 'Destino' }];
    const { getByText } = renderWithTheme(<ParsePreview elements={elements} showLabels />);
    expect(getByText('Destino:')).toBeTruthy();
  });

  it('should call onElementPress when chip is pressed', () => {
    const onPress = jest.fn();
    const elements: ParsedElement[] = [{ type: 'list', value: '@Mercado' }];
    const { getByText } = renderWithTheme(
      <ParsePreview elements={elements} onElementPress={onPress} />
    );

    fireEvent.press(getByText('@Mercado'));

    expect(onPress).toHaveBeenCalledWith(elements[0]);
  });

  it('should not throw when onElementPress is undefined', () => {
    const elements: ParsedElement[] = [{ type: 'list', value: '@Mercado' }];
    const { getByText } = renderWithTheme(<ParsePreview elements={elements} />);
    expect(getByText('@Mercado')).toBeTruthy();
  });
});
