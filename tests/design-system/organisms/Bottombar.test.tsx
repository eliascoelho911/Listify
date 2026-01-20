/* eslint-disable local-rules/no-raw-text-import */
/**
 * Bottombar Organism Tests
 */

import { default as React } from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

import { Bottombar } from '@design-system/organisms/Bottombar/Bottombar';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Bottombar Organism', () => {
  it('should render with children', () => {
    const { getByText } = renderWithTheme(
      <Bottombar>
        <Text>Test content</Text>
      </Bottombar>,
    );
    expect(getByText('Test content')).toBeTruthy();
  });
});
