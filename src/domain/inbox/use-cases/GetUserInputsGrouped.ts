/**
 * GetUserInputsGrouped Use Case
 *
 * Groups user inputs by date for display with DateBadge separators.
 */

import type { DateBadgeVariant, DateGroup } from '../entities/types';
import type { UserInput } from '../entities/UserInput';

/**
 * Checks if two dates are the same day.
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Gets the start of the day for a given date.
 */
function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Determines the variant for a date group.
 */
function getDateVariant(date: Date, today: Date, yesterday: Date): DateBadgeVariant {
  if (isSameDay(date, today)) {
    return 'today';
  }
  if (isSameDay(date, yesterday)) {
    return 'yesterday';
  }
  return 'default';
}

/**
 * Formats a date for display.
 * Returns "Hoje", "Ontem", or formatted date string.
 */
function formatDateLabel(date: Date, variant: DateBadgeVariant, locale: string = 'pt-BR'): string {
  if (variant === 'today') {
    return locale === 'pt-BR' ? 'Hoje' : 'Today';
  }
  if (variant === 'yesterday') {
    return locale === 'pt-BR' ? 'Ontem' : 'Yesterday';
  }

  // Format as "12 jan" or "12 Jan"
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Groups inputs by date for display with DateBadge separators.
 *
 * @param inputs - Array of user inputs to group
 * @param locale - Locale for date formatting (default: pt-BR)
 * @returns Array of date groups, ordered by most recent first
 */
export function GetUserInputsGrouped(inputs: UserInput[], locale: string = 'pt-BR'): DateGroup[] {
  if (!inputs || inputs.length === 0) {
    return [];
  }

  const today = startOfDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Group inputs by date
  const groupsMap = new Map<string, { date: Date; inputs: UserInput[] }>();

  for (const input of inputs) {
    const dateKey = startOfDay(input.createdAt).toISOString();

    if (!groupsMap.has(dateKey)) {
      groupsMap.set(dateKey, {
        date: startOfDay(input.createdAt),
        inputs: [],
      });
    }

    groupsMap.get(dateKey)!.inputs.push(input);
  }

  // Convert to DateGroup array and sort by date (most recent first)
  const groups: DateGroup[] = Array.from(groupsMap.values())
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ date, inputs: groupInputs }) => {
      const variant = getDateVariant(date, today, yesterday);
      return {
        date,
        label: formatDateLabel(date, variant, locale),
        variant,
        inputs: groupInputs,
      };
    });

  return groups;
}
