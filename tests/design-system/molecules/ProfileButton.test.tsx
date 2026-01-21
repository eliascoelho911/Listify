/**
 * ProfileButton Molecule Tests
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { fireEvent, render } from '@testing-library/react-native';

import { ProfileButton } from '@design-system/molecules/ProfileButton/ProfileButton';
import { getInitials } from '@design-system/molecules/ProfileButton/ProfileButton.styles';
import { ThemeProvider } from '@design-system/theme';

const initialSafeAreaMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <SafeAreaProvider initialMetrics={initialSafeAreaMetrics}>
      <ThemeProvider initialMode="dark">{component}</ThemeProvider>
    </SafeAreaProvider>,
  );
};

describe('ProfileButton', () => {
  it('should render with initials from display name', () => {
    const { getByText } = renderWithTheme(<ProfileButton displayName="John Doe" />);

    expect(getByText('JD')).toBeTruthy();
  });

  it('should render single name initials', () => {
    const { getByText } = renderWithTheme(<ProfileButton displayName="Admin" />);

    expect(getByText('AD')).toBeTruthy();
  });

  it('should render question mark when no name provided', () => {
    const { getByText } = renderWithTheme(<ProfileButton />);

    expect(getByText('?')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ProfileButton displayName="John Doe" onPress={onPress} testID="profile-button" />,
    );

    fireEvent.press(getByTestId('profile-button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should have accessibility label', () => {
    const { getByLabelText } = renderWithTheme(
      <ProfileButton displayName="John Doe" accessibilityLabel="User profile" />,
    );

    expect(getByLabelText('User profile')).toBeTruthy();
  });

  it('should have default accessibility label', () => {
    const { getByLabelText } = renderWithTheme(<ProfileButton displayName="John Doe" />);

    expect(getByLabelText('Profile')).toBeTruthy();
  });
});

describe('getInitials', () => {
  it('should get two initials from full name', () => {
    expect(getInitials('John Doe')).toBe('JD');
    expect(getInitials('Jane Smith')).toBe('JS');
  });

  it('should get first two letters from single name', () => {
    expect(getInitials('Admin')).toBe('AD');
    expect(getInitials('User')).toBe('US');
  });

  it('should handle multiple spaces', () => {
    expect(getInitials('John  Doe')).toBe('JD');
    expect(getInitials('  Jane  Smith  ')).toBe('JS');
  });

  it('should handle three or more names', () => {
    expect(getInitials('John Michael Doe')).toBe('JM');
  });
});
