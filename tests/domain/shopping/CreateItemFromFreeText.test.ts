import {
  createItemFromFreeText,
  EmptyItemNameError,
} from '@domain/shopping/use-cases/CreateItemFromFreeText';

describe('CreateItemFromFreeText', () => {
  it('applies defaults when quantity, unit and category are omitted', () => {
    const result = createItemFromFreeText('leite');

    expect(result.name).toBe('leite');
    expect(result.quantity.toNumber()).toBe(1);
    expect(result.unit).toBe('un');
    expect(result.category).toBe('outros');
  });

  it('parses quantity, unit and category from the input', () => {
    const result = createItemFromFreeText('2 kg maçã @hortifruti');

    expect(result.name).toBe('maçã');
    expect(result.quantity.toNumber()).toBe(2);
    expect(result.unit).toBe('kg');
    expect(result.category).toBe('hortifruti');
  });

  it('supports fractional quantities', () => {
    const result = createItemFromFreeText('1/2 l leite');

    expect(result.quantity.toNumber()).toBeCloseTo(0.5);
    expect(result.unit).toBe('l');
    expect(result.name).toBe('leite');
  });

  it('supports comma as decimal separator', () => {
    const result = createItemFromFreeText('2,5 kg arroz');

    expect(result.quantity.toNumber()).toBeCloseTo(2.5);
    expect(result.unit).toBe('kg');
    expect(result.name).toBe('arroz');
  });

  it('uses the last @categoria found in the text', () => {
    const result = createItemFromFreeText('leite @laticinios @promo');

    expect(result.category).toBe('promo');
    expect(result.name).toBe('leite');
  });

  it('throws when there is no item name left after parsing', () => {
    expect(() => createItemFromFreeText('2 kg @hortifruti')).toThrow(EmptyItemNameError);
  });

  it('parses quantity and unit when they are attached without spaces', () => {
    const result = createItemFromFreeText('2l água');

    expect(result.quantity.toNumber()).toBe(2);
    expect(result.unit).toBe('l');
    expect(result.name).toBe('água');
  });

  it('parses fractional quantity and unit when they are attached', () => {
    const result = createItemFromFreeText('1/2kg arroz integral');

    expect(result.quantity.toNumber()).toBeCloseTo(0.5);
    expect(result.unit).toBe('kg');
    expect(result.name).toBe('arroz integral');
  });
});
