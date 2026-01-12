/**
 * GetUserInputsGrouped Use Case Tests
 */

import type { UserInput } from '@domain/inbox/entities';
import { GetUserInputsGrouped } from '@domain/inbox/use-cases/GetUserInputsGrouped';

import { createMockUserInput } from './testUtils';

describe('GetUserInputsGrouped', () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  it('should group inputs by date', () => {
    const inputs: UserInput[] = [
      createMockUserInput({ id: '1', text: 'Today 1', createdAt: today }),
      createMockUserInput({ id: '2', text: 'Today 2', createdAt: today }),
      createMockUserInput({ id: '3', text: 'Yesterday', createdAt: yesterday }),
      createMockUserInput({ id: '4', text: 'Two days ago', createdAt: twoDaysAgo }),
    ];

    const result = GetUserInputsGrouped(inputs);

    expect(result).toHaveLength(3);
    expect(result[0].inputs).toHaveLength(2);
    expect(result[1].inputs).toHaveLength(1);
    expect(result[2].inputs).toHaveLength(1);
  });

  it('should use "today" variant for today\'s inputs', () => {
    const inputs: UserInput[] = [createMockUserInput({ id: '1', text: 'Today', createdAt: today })];

    const result = GetUserInputsGrouped(inputs);

    expect(result[0].variant).toBe('today');
  });

  it('should use "yesterday" variant for yesterday\'s inputs', () => {
    const inputs: UserInput[] = [
      createMockUserInput({ id: '1', text: 'Yesterday', createdAt: yesterday }),
    ];

    const result = GetUserInputsGrouped(inputs);

    expect(result[0].variant).toBe('yesterday');
  });

  it('should use "default" variant for older inputs', () => {
    const inputs: UserInput[] = [
      createMockUserInput({ id: '1', text: 'Old', createdAt: lastWeek }),
    ];

    const result = GetUserInputsGrouped(inputs);

    expect(result[0].variant).toBe('default');
  });

  it('should return empty array for empty input', () => {
    const result = GetUserInputsGrouped([]);

    expect(result).toHaveLength(0);
  });

  it('should order groups by most recent first', () => {
    const inputs: UserInput[] = [
      createMockUserInput({ id: '1', text: 'Yesterday', createdAt: yesterday }),
      createMockUserInput({ id: '2', text: 'Today', createdAt: today }),
      createMockUserInput({ id: '3', text: 'Last week', createdAt: lastWeek }),
    ];

    const result = GetUserInputsGrouped(inputs);

    expect(result[0].variant).toBe('today');
    expect(result[1].variant).toBe('yesterday');
    expect(result[2].variant).toBe('default');
  });

  it('should generate proper labels for dates', () => {
    const inputs: UserInput[] = [
      createMockUserInput({ id: '1', text: 'Today', createdAt: today }),
      createMockUserInput({ id: '2', text: 'Yesterday', createdAt: yesterday }),
      createMockUserInput({ id: '3', text: 'Last week', createdAt: lastWeek }),
    ];

    const result = GetUserInputsGrouped(inputs);

    // Today and Yesterday should have localized labels
    expect(result[0].label).toBeDefined();
    expect(result[1].label).toBeDefined();
    // Older dates should have formatted date string
    expect(result[2].label).toBeDefined();
  });
});
