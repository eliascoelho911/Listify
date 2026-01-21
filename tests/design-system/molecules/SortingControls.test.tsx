/**
 * SortingControls Molecule Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { SortingControls } from '@design-system/molecules/SortingControls/SortingControls';
import type { SortOption } from '@design-system/molecules/SortingControls/SortingControls.types';
import { ThemeProvider } from '@design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

const mockOptions: SortOption[] = [
  { value: 'createdAt', label: 'Data' },
  { value: 'title', label: 'Nome' },
];

describe('SortingControls Molecule', () => {
  it('should render with label', () => {
    const { getByText } = renderWithTheme(
      <SortingControls
        options={mockOptions}
        selectedValue="createdAt"
        sortDirection="desc"
        onSortChange={() => {}}
        onDirectionToggle={() => {}}
      />,
    );
    expect(getByText('Ordenar por')).toBeTruthy();
  });

  it('should render custom label', () => {
    const { getByText } = renderWithTheme(
      <SortingControls
        options={mockOptions}
        selectedValue="createdAt"
        sortDirection="desc"
        label="Agrupar por"
        onSortChange={() => {}}
        onDirectionToggle={() => {}}
      />,
    );
    expect(getByText('Agrupar por')).toBeTruthy();
  });

  it('should render all options', () => {
    const { getByText } = renderWithTheme(
      <SortingControls
        options={mockOptions}
        selectedValue="createdAt"
        sortDirection="desc"
        onSortChange={() => {}}
        onDirectionToggle={() => {}}
      />,
    );
    expect(getByText('Data')).toBeTruthy();
    expect(getByText('Nome')).toBeTruthy();
  });

  it('should call onSortChange when option is pressed', () => {
    const onSortChange = jest.fn();
    const { getByText } = renderWithTheme(
      <SortingControls
        options={mockOptions}
        selectedValue="createdAt"
        sortDirection="desc"
        onSortChange={onSortChange}
        onDirectionToggle={() => {}}
      />,
    );
    fireEvent.press(getByText('Nome'));
    expect(onSortChange).toHaveBeenCalledWith('title');
  });

  it('should not call onSortChange when same option is pressed', () => {
    const onSortChange = jest.fn();
    const { getByText } = renderWithTheme(
      <SortingControls
        options={mockOptions}
        selectedValue="createdAt"
        sortDirection="desc"
        onSortChange={onSortChange}
        onDirectionToggle={() => {}}
      />,
    );
    fireEvent.press(getByText('Data'));
    expect(onSortChange).not.toHaveBeenCalled();
  });

  it('should call onDirectionToggle when direction button is pressed', () => {
    const onDirectionToggle = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <SortingControls
        options={mockOptions}
        selectedValue="createdAt"
        sortDirection="desc"
        onSortChange={() => {}}
        onDirectionToggle={onDirectionToggle}
      />,
    );
    fireEvent.press(getByLabelText(/Sort direction/));
    expect(onDirectionToggle).toHaveBeenCalledTimes(1);
  });

  it('should not call callbacks when disabled', () => {
    const onSortChange = jest.fn();
    const onDirectionToggle = jest.fn();
    const { getByText, getByLabelText } = renderWithTheme(
      <SortingControls
        options={mockOptions}
        selectedValue="createdAt"
        sortDirection="desc"
        disabled
        onSortChange={onSortChange}
        onDirectionToggle={onDirectionToggle}
      />,
    );
    fireEvent.press(getByText('Nome'));
    fireEvent.press(getByLabelText(/Sort direction/));
    expect(onSortChange).not.toHaveBeenCalled();
    expect(onDirectionToggle).not.toHaveBeenCalled();
  });
});
