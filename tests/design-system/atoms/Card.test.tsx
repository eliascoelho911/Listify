/**
 * Card Atom Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { Text } from '@design-system/atoms';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@design-system/atoms/Card/Card';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Card Atoms', () => {
  describe('Card', () => {
    it('should render with children', () => {
      const { getByText } = renderWithTheme(
        <Card>
          <Text>Card Content</Text>
        </Card>,
      );
      expect(getByText('Card Content')).toBeTruthy();
    });
  });

  describe('CardHeader', () => {
    it('should render with children', () => {
      const { getByText } = renderWithTheme(
        <Card>
          <CardHeader>
            <Text>Header Content</Text>
          </CardHeader>
        </Card>,
      );
      expect(getByText('Header Content')).toBeTruthy();
    });
  });

  describe('CardTitle', () => {
    it('should render title text', () => {
      const { getByText } = renderWithTheme(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
        </Card>,
      );
      expect(getByText('Card Title')).toBeTruthy();
    });
  });

  describe('CardDescription', () => {
    it('should render description text', () => {
      const { getByText } = renderWithTheme(
        <Card>
          <CardHeader>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
        </Card>,
      );
      expect(getByText('Card Description')).toBeTruthy();
    });
  });

  describe('CardContent', () => {
    it('should render with children', () => {
      const { getByText } = renderWithTheme(
        <Card>
          <CardContent>
            <Text>Content Area</Text>
          </CardContent>
        </Card>,
      );
      expect(getByText('Content Area')).toBeTruthy();
    });
  });

  describe('CardFooter', () => {
    it('should render with children', () => {
      const { getByText } = renderWithTheme(
        <Card>
          <CardFooter>
            <Text>Footer Content</Text>
          </CardFooter>
        </Card>,
      );
      expect(getByText('Footer Content')).toBeTruthy();
    });
  });

  describe('Full Composition', () => {
    it('should render complete card with all sections', () => {
      const { getByText } = renderWithTheme(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>
            <Text>Content</Text>
          </CardContent>
          <CardFooter>
            <Text>Footer</Text>
          </CardFooter>
        </Card>,
      );

      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Description')).toBeTruthy();
      expect(getByText('Content')).toBeTruthy();
      expect(getByText('Footer')).toBeTruthy();
    });
  });
});
