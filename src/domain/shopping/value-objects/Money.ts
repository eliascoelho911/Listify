import { FALLBACK_LOCALE } from '../constants';

export class Money {
  private constructor(
    private readonly minorValue: number,
    readonly currencyCode: string,
    private readonly fractionDigits: number,
  ) {}

  static fromMinor(minorValue: number, currencyCode: string): Money {
    if (!Number.isInteger(minorValue)) {
      throw new Error('Money minor units must be an integer.');
    }
    const normalizedCurrency = Money.normalizeCurrency(currencyCode);
    return new Money(
      minorValue,
      normalizedCurrency,
      Money.resolveFractionDigits(normalizedCurrency),
    );
  }

  static fromMajor(amount: number | string, currencyCode: string): Money {
    const normalizedCurrency = Money.normalizeCurrency(currencyCode);
    const fractionDigits = Money.resolveFractionDigits(normalizedCurrency);
    const numericAmount = Money.parseAmount(amount);
    const minorValue = Math.round(numericAmount * 10 ** fractionDigits);
    return new Money(minorValue, normalizedCurrency, fractionDigits);
  }

  static zero(currencyCode: string): Money {
    return Money.fromMinor(0, currencyCode);
  }

  add(other: Money): Money {
    if (other.currencyCode !== this.currencyCode) {
      throw new Error('Cannot add money values with different currencies.');
    }
    return Money.fromMinor(this.minorValue + other.minorValue, this.currencyCode);
  }

  toMinor(): number {
    return this.minorValue;
  }

  toMajorNumber(): number {
    return this.minorValue / 10 ** this.fractionDigits;
  }

  getFractionDigits(): number {
    return this.fractionDigits;
  }

  format(locale?: string): string {
    const targetLocale = (locale ?? FALLBACK_LOCALE).toString();
    return new Intl.NumberFormat(targetLocale, {
      style: 'currency',
      currency: this.currencyCode,
      minimumFractionDigits: this.fractionDigits,
      maximumFractionDigits: this.fractionDigits,
    }).format(this.toMajorNumber());
  }

  private static parseAmount(amount: number | string): number {
    if (typeof amount === 'number') {
      if (!Number.isFinite(amount)) {
        throw new Error('Money amount must be a finite number.');
      }
      return amount;
    }

    const normalized = amount.trim().replace(',', '.');
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed)) {
      throw new Error(`Invalid money amount: "${amount}"`);
    }
    return parsed;
  }

  private static normalizeCurrency(currencyCode: string): string {
    const normalized = currencyCode.trim();
    if (!normalized) {
      throw new Error('Currency code cannot be empty.');
    }
    return normalized.toUpperCase();
  }

  private static resolveFractionDigits(currencyCode: string): number {
    const formatter = new Intl.NumberFormat(FALLBACK_LOCALE, {
      style: 'currency',
      currency: currencyCode,
    });
    const { maximumFractionDigits, minimumFractionDigits } = formatter.resolvedOptions();
    const resolvedMax = Number.isFinite(maximumFractionDigits) ? maximumFractionDigits : 0;
    const resolvedMin = Number.isFinite(minimumFractionDigits) ? minimumFractionDigits : 0;
    const digits = Math.max(resolvedMax ?? 0, resolvedMin ?? 0);
    return Number.isFinite(digits) ? (digits as number) : 2;
  }
}
