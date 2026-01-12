/**
 * EmptyState Molecule Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Inbox } from 'lucide-react-native';

import { EmptyState } from '@design-system/molecules/EmptyState/EmptyState';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('EmptyState Molecule', () => {
  it('should render with title only', () => {
    const { getByText } = renderWithTheme(<EmptyState title="No items" />);
    expect(getByText('No items')).toBeTruthy();
  });

  it('should render with title and subtitle', () => {
    const { getByText } = renderWithTheme(
      <EmptyState title="No items" subtitle="Add your first item" />,
    );
    expect(getByText('No items')).toBeTruthy();
    expect(getByText('Add your first item')).toBeTruthy();
  });

  it('should render with icon', () => {
    const { getByText } = renderWithTheme(
      <EmptyState icon={Inbox} title="Empty inbox" subtitle="Start capturing" />,
    );
    expect(getByText('Empty inbox')).toBeTruthy();
    expect(getByText('Start capturing')).toBeTruthy();
  });

  it('should not render subtitle when not provided', () => {
    const { queryByText, getByText } = renderWithTheme(<EmptyState title="Title only" />);
    expect(getByText('Title only')).toBeTruthy();
    expect(queryByText('subtitle')).toBeNull();
  });

  it('should pass through additional ViewProps', () => {
    const { getByTestId } = renderWithTheme(<EmptyState title="Test" testID="empty-state-test" />);
    expect(getByTestId('empty-state-test')).toBeTruthy();
  });
});
