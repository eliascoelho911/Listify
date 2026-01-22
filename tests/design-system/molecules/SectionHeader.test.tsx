/**
 * SectionHeader Molecule Tests
 */

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { SectionHeader } from '@design-system/molecules/SectionHeader/SectionHeader';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('SectionHeader Molecule', () => {
  it('should render with name', () => {
    const { getByText } = renderWithTheme(<SectionHeader name="Fruits" />);
    expect(getByText('Fruits')).toBeTruthy();
  });

  it('should render with item count', () => {
    const { getByText } = renderWithTheme(<SectionHeader name="Fruits" itemCount={5} />);
    expect(getByText('Fruits')).toBeTruthy();
    expect(getByText('(5)')).toBeTruthy();
  });

  it('should call onToggleExpand when pressed', () => {
    const onToggleExpand = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <SectionHeader name="Fruits" onToggleExpand={onToggleExpand} />,
    );

    fireEvent.press(getByLabelText('Fruits section'));
    expect(onToggleExpand).toHaveBeenCalledTimes(1);
  });

  it('should call onLongPress when long pressed', () => {
    const onLongPress = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <SectionHeader name="Fruits" onLongPress={onLongPress} />,
    );

    fireEvent(getByLabelText('Fruits section'), 'longPress');
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('should show add button when showAddButton is true', () => {
    const onAddItem = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <SectionHeader name="Fruits" showAddButton onAddItem={onAddItem} />,
    );

    const addButton = getByLabelText('Add item to Fruits');
    expect(addButton).toBeTruthy();

    fireEvent.press(addButton);
    expect(onAddItem).toHaveBeenCalledTimes(1);
  });

  it('should have correct accessibility state for expanded', () => {
    const { getByLabelText } = renderWithTheme(<SectionHeader name="Fruits" expanded />);

    expect(getByLabelText('Fruits section').props.accessibilityState).toEqual({ expanded: true });
  });

  it('should have correct accessibility state for collapsed', () => {
    const { getByLabelText } = renderWithTheme(<SectionHeader name="Fruits" expanded={false} />);

    expect(getByLabelText('Fruits section').props.accessibilityState).toEqual({ expanded: false });
  });
});
