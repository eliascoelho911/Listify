/**
 * GroupHeader Atom Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { GroupHeader } from '@design-system/atoms/GroupHeader/GroupHeader';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('GroupHeader Atom', () => {
  it('should render with label', () => {
    const { getByText } = renderWithTheme(<GroupHeader label="Today" />);
    expect(getByText('Today')).toBeTruthy();
  });

  it('should render with count', () => {
    const { getByText } = renderWithTheme(<GroupHeader label="Today" count={5} />);
    expect(getByText('Today')).toBeTruthy();
    expect(getByText('(5)')).toBeTruthy();
  });

  it('should render date variant', () => {
    const { getByText } = renderWithTheme(<GroupHeader label="Yesterday" variant="date" />);
    expect(getByText('Yesterday')).toBeTruthy();
  });

  it('should render list variant', () => {
    const { getByText } = renderWithTheme(<GroupHeader label="Shopping List" variant="list" />);
    expect(getByText('Shopping List')).toBeTruthy();
  });

  it('should render category variant', () => {
    const { getByText } = renderWithTheme(<GroupHeader label="Entertainment" variant="category" />);
    expect(getByText('Entertainment')).toBeTruthy();
  });

  it('should handle collapsible behavior', () => {
    const onToggle = jest.fn();
    const { getByRole } = renderWithTheme(
      <GroupHeader
        label="Collapsible Group"
        collapsible
        collapsed={false}
        onToggleCollapse={onToggle}
      />,
    );
    const button = getByRole('button');
    fireEvent.press(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('should have correct accessibility label when collapsed', () => {
    const { getByLabelText } = renderWithTheme(
      <GroupHeader label="Test Group" collapsible collapsed onToggleCollapse={() => {}} />,
    );
    expect(getByLabelText('Test Group group, collapsed')).toBeTruthy();
  });

  it('should have correct accessibility label when expanded', () => {
    const { getByLabelText } = renderWithTheme(
      <GroupHeader label="Test Group" collapsible collapsed={false} onToggleCollapse={() => {}} />,
    );
    expect(getByLabelText('Test Group group, expanded')).toBeTruthy();
  });
});
