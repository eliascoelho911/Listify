export class Quantity {
  private constructor(readonly value: number) {}

  static default(): Quantity {
    return new Quantity(1);
  }

  static parse(input: number | string | undefined | null): Quantity {
    if (input === undefined || input === null || input === '') {
      return Quantity.default();
    }

    if (typeof input === 'number') {
      return Quantity.fromNumber(input);
    }

    const trimmed = input.trim();
    if (!trimmed) {
      return Quantity.default();
    }

    const asFraction = Quantity.tryParseFraction(trimmed);
    if (asFraction !== null) {
      return Quantity.fromNumber(asFraction);
    }

    const normalized = trimmed.replace(',', '.');
    const numericValue = Number(normalized);
    if (Number.isNaN(numericValue) || !Number.isFinite(numericValue)) {
      throw new Error(`Quantidade inválida: "${input}"`);
    }

    return Quantity.fromNumber(numericValue);
  }

  private static tryParseFraction(input: string): number | null {
    if (!input.includes('/')) {
      return null;
    }

    const [numeratorRaw, denominatorRaw] = input.split('/').map((part) => part.trim());
    if (!numeratorRaw || !denominatorRaw) {
      return null;
    }

    const numerator = Number(numeratorRaw.replace(',', '.'));
    const denominator = Number(denominatorRaw.replace(',', '.'));
    if (
      Number.isNaN(numerator) ||
      Number.isNaN(denominator) ||
      !Number.isFinite(numerator) ||
      !Number.isFinite(denominator) ||
      denominator === 0
    ) {
      return null;
    }

    return numerator / denominator;
  }

  private static fromNumber(value: number): Quantity {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(`Quantidade inválida: "${value}"`);
    }

    const normalized = Math.round(value * 1000) / 1000;
    return new Quantity(normalized);
  }

  toNumber(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
