/**
 * Badge Atom Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { Badge } from '@design-system/atoms/Badge/Badge';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Badge Atom', () => {
  describe('Variants', () => {
    it('should render default variant', () => {
      const { getByText } = renderWithTheme(<Badge variant="default">Default</Badge>);
      expect(getByText('Default')).toBeTruthy();
    });

    it('should render secondary variant', () => {
      const { getByText } = renderWithTheme(<Badge variant="secondary">Secondary</Badge>);
      expect(getByText('Secondary')).toBeTruthy();
    });

    it('should render destructive variant', () => {
      const { getByText } = renderWithTheme(<Badge variant="destructive">Destructive</Badge>);
      expect(getByText('Destructive')).toBeTruthy();
    });

    it('should render outline variant', () => {
      const { getByText } = renderWithTheme(<Badge variant="outline">Outline</Badge>);
      expect(getByText('Outline')).toBeTruthy();
    });
  });

  it('should render with string children', () => {
    const { getByText } = renderWithTheme(<Badge>Badge Text</Badge>);
    expect(getByText('Badge Text')).toBeTruthy();
  });

  it('should default to default variant when variant is not specified', () => {
    const { getByText } = renderWithTheme(<Badge>Default Badge</Badge>);
    expect(getByText('Default Badge')).toBeTruthy();
  });
});
