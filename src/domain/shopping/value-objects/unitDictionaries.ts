import en from '../locales/units.en.json';
import pt from '../locales/units.pt.json';
import type { UnitCode } from './Unit';

export type UnitDictionary = Record<string, UnitCode>;
export type UnitDictionaries = Record<string, UnitDictionary>;

export const defaultUnitDictionaries: UnitDictionaries = {
  pt,
  'pt-br': pt,
  en,
  'en-us': en,
  default: pt,
};
