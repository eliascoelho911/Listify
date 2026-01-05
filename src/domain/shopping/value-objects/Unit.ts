import { defaultUnitDictionaries, type UnitDictionaries } from './unitDictionaries';

export type UnitCode = 'un' | 'kg' | 'g' | 'l' | 'ml' | string;

export class Unit {
  private constructor(readonly value: UnitCode) {}

  static default(): Unit {
    return new Unit('un');
  }

  static parse(
    input: string | undefined | null,
    options: { locale?: string; dictionaries?: UnitDictionaries } = {},
  ): Unit {
    if (!input) {
      return Unit.default();
    }

    const normalized = input.trim().toLowerCase();
    if (!normalized) {
      return Unit.default();
    }

    const canonical = Unit.lookup(normalized, options);
    if (canonical) {
      return new Unit(canonical);
    }

    return new Unit(normalized);
  }

  private static lookup(
    key: string,
    options: { locale?: string; dictionaries?: UnitDictionaries },
  ): UnitCode | undefined {
    const dictionaries = options.dictionaries ?? defaultUnitDictionaries;
    const locale = Unit.normalizeLocale(options.locale);
    const localeBase = locale.split('-')[0];

    return (
      dictionaries[locale]?.[key] ?? dictionaries[localeBase]?.[key] ?? dictionaries.default?.[key]
    );
  }

  private static normalizeLocale(locale?: string): string {
    return (locale ?? 'pt').toLowerCase();
  }

  toString(): string {
    return this.value;
  }
}
