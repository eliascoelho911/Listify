export type UnitCode = 'un' | 'kg' | 'g' | 'l' | 'ml' | string;

const UNIT_SYNONYMS: Record<string, UnitCode> = {
  un: 'un',
  und: 'un',
  unidade: 'un',
  unidades: 'un',
  unid: 'un',
  unids: 'un',
  kg: 'kg',
  kgs: 'kg',
  kilo: 'kg',
  quilo: 'kg',
  quilos: 'kg',
  kilogram: 'kg',
  grama: 'g',
  gramas: 'g',
  g: 'g',
  gs: 'g',
  l: 'l',
  lt: 'l',
  litro: 'l',
  litros: 'l',
  ml: 'ml',
  mls: 'ml',
  mililitro: 'ml',
  mililitros: 'ml',
};

export class Unit {
  private constructor(readonly value: UnitCode) {}

  static default(): Unit {
    return new Unit('un');
  }

  static parse(input: string | undefined | null): Unit {
    if (!input) {
      return Unit.default();
    }

    const normalized = input.trim().toLowerCase();
    if (!normalized) {
      return Unit.default();
    }

    const canonical = UNIT_SYNONYMS[normalized];
    if (canonical) {
      return new Unit(canonical);
    }

    return new Unit(normalized);
  }

  toString(): string {
    return this.value;
  }
}
