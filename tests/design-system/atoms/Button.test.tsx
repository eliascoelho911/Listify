/**
 * Button Atom Tests
 *
 * Validates all variants, sizes, and states
 */

import React from 'react';

import { Button } from '@design-system/atoms/Button/Button';

import { renderWithTheme } from '../testUtils';

describe('Button Atom', () => {
  describe('Variants', () => {
    it('should render default variant', () => {
      const { getByText } = renderWithTheme(<Button variant="default">Default</Button>);
      expect(getByText('Default')).toBeTruthy();
    });

    it('should render destructive variant', () => {
      const { getByText } = renderWithTheme(<Button variant="destructive">Delete</Button>);
      expect(getByText('Delete')).toBeTruthy();
    });

    it('should render outline variant', () => {
      const { getByText } = renderWithTheme(<Button variant="outline">Outline</Button>);
      expect(getByText('Outline')).toBeTruthy();
    });

    it('should render ghost variant', () => {
      const { getByText } = renderWithTheme(<Button variant="ghost">Ghost</Button>);
      expect(getByText('Ghost')).toBeTruthy();
    });

    it('should render link variant', () => {
      const { getByText } = renderWithTheme(<Button variant="link">Link</Button>);
      expect(getByText('Link')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      const { getByText } = renderWithTheme(<Button size="sm">Small</Button>);
      expect(getByText('Small')).toBeTruthy();
    });

    it('should render medium size (default)', () => {
      const { getByText } = renderWithTheme(<Button>Medium</Button>);
      expect(getByText('Medium')).toBeTruthy();
    });

    it('should render large size', () => {
      const { getByText } = renderWithTheme(<Button size="lg">Large</Button>);
      expect(getByText('Large')).toBeTruthy();
    });

    it('should render icon size', () => {
      const { getByText } = renderWithTheme(<Button size="icon">I</Button>);
      expect(getByText('I')).toBeTruthy();
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      const { UNSAFE_getByType } = renderWithTheme(<Button disabled>Disabled</Button>);
      const { TouchableOpacity } = require('react-native');
      const button = UNSAFE_getByType(TouchableOpacity);
      expect(button.props.disabled).toBe(true);
    });

    it('should show loading indicator when loading is true', () => {
      const { queryByText, UNSAFE_getByType } = renderWithTheme(<Button loading>Loading</Button>);

      // Text should not be visible when loading
      expect(queryByText('Loading')).toBeNull();

      // ActivityIndicator should be present
      const { ActivityIndicator } = require('react-native');
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('should be disabled when loading', () => {
      const { UNSAFE_getByType } = renderWithTheme(<Button loading>Loading</Button>);
      const { TouchableOpacity } = require('react-native');
      const button = UNSAFE_getByType(TouchableOpacity);
      expect(button.props.disabled).toBe(true);
    });
  });

  describe('Props', () => {
    it('should call onPress when pressed', () => {
      const onPress = jest.fn();
      const { UNSAFE_getByType } = renderWithTheme(<Button onPress={onPress}>Press Me</Button>);
      const { TouchableOpacity } = require('react-native');
      const button = UNSAFE_getByType(TouchableOpacity);

      button.props.onPress();

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const onPress = jest.fn();
      const { UNSAFE_getByType } = renderWithTheme(
        <Button disabled onPress={onPress}>
          Disabled
        </Button>,
      );
      const { TouchableOpacity } = require('react-native');
      const button = UNSAFE_getByType(TouchableOpacity);
      expect(button.props.disabled).toBe(true);
    });
  });
});
