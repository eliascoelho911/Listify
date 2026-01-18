/**
 * Bottombar Organism Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Clock, Home, ShoppingBag, User } from 'lucide-react-native';

import { Bottombar } from '@design-system/organisms/Bottombar/Bottombar';
import type { BottombarItem } from '@design-system/organisms/Bottombar/Bottombar.types';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

const mockItems: BottombarItem[] = [
  {
    id: 'home',
    icon: Home,
    label: 'Home',
    onPress: jest.fn(),
  },
  {
    id: 'shopping',
    icon: ShoppingBag,
    label: 'Shopping Lists',
    onPress: jest.fn(),
  },
  {
    id: 'history',
    icon: Clock,
    label: 'History',
    onPress: jest.fn(),
  },
  {
    id: 'profile',
    icon: User,
    label: 'Profile',
    onPress: jest.fn(),
  },
];

describe('Bottombar Organism', () => {
  it('should render all navigation items', () => {
    const { getByLabelText } = renderWithTheme(<Bottombar items={mockItems} />);

    expect(getByLabelText('Home')).toBeTruthy();
    expect(getByLabelText('Shopping Lists')).toBeTruthy();
    expect(getByLabelText('History')).toBeTruthy();
    expect(getByLabelText('Profile')).toBeTruthy();
  });

  it('should call onPress when item is pressed', () => {
    const { getByLabelText } = renderWithTheme(<Bottombar items={mockItems} />);

    fireEvent.press(getByLabelText('Shopping Lists'));

    expect(mockItems[1].onPress).toHaveBeenCalledTimes(1);
  });

  it('should render with first item active by default', () => {
    const { getByLabelText } = renderWithTheme(<Bottombar items={mockItems} />);

    const homeButton = getByLabelText('Home');
    expect(homeButton).toBeTruthy();
  });

  it('should render with custom active index', () => {
    const { getByLabelText } = renderWithTheme(<Bottombar items={mockItems} activeIndex={2} />);

    const historyButton = getByLabelText('History');
    expect(historyButton).toBeTruthy();
  });

  it('should have correct accessibility properties', () => {
    const { getByLabelText } = renderWithTheme(<Bottombar items={mockItems} activeIndex={1} />);

    const shoppingButton = getByLabelText('Shopping Lists');
    expect(shoppingButton.props.accessibilityRole).toBe('button');
    expect(shoppingButton.props.accessibilityState).toEqual({ selected: true });
  });
});
