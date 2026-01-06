import en from '../locales/units.en.json';
import pt from '../locales/units.pt-BR.json';
import type { UnitCode } from './Unit';

export type UnitDictionary = Record<string, UnitCode>;
export type UnitDictionaries = Record<string, UnitDictionary>;

export const defaultUnitDictionaries: UnitDictionaries = {
  pt,
  'pt-BR': pt,
  en,
  'en-us': en,
  default: pt,
};
