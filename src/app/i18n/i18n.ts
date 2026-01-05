import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import i18n, { type Resource } from 'i18next';

import enCommon from './locales/en/common.json';
import ptBrCommon from './locales/pt-BR/common.json';

const fallbackLng = 'en';
const supportedLngs = ['en', 'pt-BR'] as const;

type SupportedLng = (typeof supportedLngs)[number];
let initializationPromise: Promise<void> | null = null;

const resources: Resource = {
  en: { common: enCommon },
  'pt-BR': { common: ptBrCommon },
};

function normalizeLocale(tag?: string): SupportedLng | null {
  if (!tag) {
    return null;
  }

  const normalized = tag.trim();
  if (!normalized) {
    return null;
  }

  const exactMatch = supportedLngs.find((lng) => lng.toLowerCase() === normalized.toLowerCase());
  if (exactMatch) {
    return exactMatch;
  }

  const base = normalized.split('-')[0];
  const baseMatch = supportedLngs.find(
    (lng) => lng === base || lng.toLowerCase().startsWith(`${base.toLowerCase()}-`),
  );

  return baseMatch ?? null;
}

function detectLocale(): SupportedLng {
  const localeTag = Localization.getLocales?.()[0]?.languageTag;
  return normalizeLocale(localeTag) ?? fallbackLng;
}

export async function initializeI18n(): Promise<void> {
  if (i18n.isInitialized) {
    return;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: detectLocale(),
      fallbackLng,
      supportedLngs,
      defaultNS: 'common',
      interpolation: { escapeValue: false },
      returnEmptyString: false,
      react: { useSuspense: false },
      compatibilityJSON: 'v4',
    })
    .then(() => undefined)
    .finally(() => {
      initializationPromise = null;
    });

  return initializationPromise;
}

export { i18n };
export type { SupportedLng };
