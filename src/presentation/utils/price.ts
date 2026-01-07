import { Money } from '@domain/shopping/value-objects/Money';

export function parsePriceInput(value: string, currencyCode: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  return Money.fromMajor(trimmed, currencyCode).toMinor();
}

export function formatPriceInput(minor: number | undefined, currencyCode: string): string {
  if (minor === undefined) {
    return '';
  }

  const money = Money.fromMinor(minor, currencyCode);
  return money.toMajorNumber().toFixed(money.getFractionDigits());
}

export function formatMoney(minor: number, currencyCode: string, locale: string): string {
  return Money.fromMinor(minor, currencyCode).format(locale);
}
