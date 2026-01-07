import { Money } from '@domain/shopping/value-objects/Money';

describe('Money', () => {
  it('creates from major amounts with dot or comma and converts to minor units', () => {
    expect(Money.fromMajor('12.34', 'BRL').toMinor()).toBe(1234);
    expect(Money.fromMajor('12,34', 'BRL').toMinor()).toBe(1234);
    expect(Money.fromMajor(10.5, 'USD').toMinor()).toBe(1050);
  });

  it('formats using locale and currency fraction digits', () => {
    const formatted = Money.fromMinor(1234, 'BRL').format('pt-BR');
    expect(formatted.replace(/\s/g, '')).toBe('R$12,34');
  });

  it('adds two money values of the same currency', () => {
    const sum = Money.fromMinor(500, 'BRL').add(Money.fromMinor(125, 'BRL'));
    expect(sum.toMinor()).toBe(625);
  });

  it('throws when adding money with different currencies', () => {
    expect(() => Money.fromMinor(100, 'USD').add(Money.fromMinor(100, 'BRL'))).toThrow();
  });

  it('throws when minor value is not an integer', () => {
    expect(() => Money.fromMinor(10.5, 'BRL')).toThrow();
  });

  it('throws on invalid amount strings', () => {
    expect(() => Money.fromMajor('invalid', 'BRL')).toThrow();
  });
});
