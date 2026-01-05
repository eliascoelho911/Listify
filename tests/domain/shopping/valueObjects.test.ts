import { Quantity } from '@domain/shopping/value-objects/Quantity';
import { Unit } from '@domain/shopping/value-objects/Unit';
import { defaultUnitDictionaries } from '@domain/shopping/value-objects/unitDictionaries';

describe('Quantity', () => {
  it('uses default when input is empty', () => {
    expect(Quantity.parse(undefined).toNumber()).toBe(1);
    expect(Quantity.parse('').toNumber()).toBe(1);
  });

  it('parses decimal, comma and fraction', () => {
    expect(Quantity.parse('2.5').toNumber()).toBe(2.5);
    expect(Quantity.parse('2,5').toNumber()).toBe(2.5);
    expect(Quantity.parse('1/2').toNumber()).toBe(0.5);
  });

  it('rounds to 3 decimals', () => {
    expect(Quantity.parse('1.2349').toNumber()).toBe(1.235);
  });

  it('throws on zero, negative or invalid input', () => {
    expect(() => Quantity.parse('0')).toThrow();
    expect(() => Quantity.parse(-2)).toThrow();
    expect(() => Quantity.parse('abc')).toThrow();
  });
});

describe('Unit', () => {
  it('defaults to "un" when input is missing', () => {
    expect(Unit.parse(undefined).toString()).toBe('un');
  });

  it('resolves pt-BR synonyms', () => {
    expect(Unit.parse('quilo', { locale: 'pt-BR' }).toString()).toBe('kg');
    expect(Unit.parse('mls', { locale: 'pt-BR' }).toString()).toBe('ml');
  });

  it('resolves en synonyms', () => {
    expect(Unit.parse('liters', { locale: 'en-US' }).toString()).toBe('l');
    expect(Unit.parse('grams', { locale: 'en' }).toString()).toBe('g');
  });

  it('falls back to base locale and default dictionary', () => {
    expect(Unit.parse('litro', { locale: 'pt-PT' }).toString()).toBe('l');
    // locale not in map uses default (pt)
    expect(Unit.parse('unidade', { locale: 'es' }).toString()).toBe('un');
  });

  it('preserves unknown units as custom', () => {
    expect(Unit.parse('cx', { locale: 'pt-BR' }).toString()).toBe('cx');
  });

  it('accepts custom dictionaries', () => {
    const dictionaries = {
      ...defaultUnitDictionaries,
      es: { caja: 'un' },
    };
    expect(Unit.parse('caja', { locale: 'es', dictionaries }).toString()).toBe('un');
  });
});
