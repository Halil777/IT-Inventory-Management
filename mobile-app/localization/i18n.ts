import en from './translations/en';
import ru from './translations/ru';
import tr from './translations/tr';
import tk from './translations/tk';
import zh from './translations/zh';
import { TranslationDictionary } from './translations/types';

type TranslationValue = string | TranslationDictionary;

const translations = {
  en,
  ru,
  tr,
  tk,
  zh,
} as const;

export type Locale = keyof typeof translations;

const fallbackLocale: Locale = 'en';

const getValue = (dictionary: TranslationDictionary, key: string): string | undefined => {
  const segments = key.split('.');
  let current: TranslationValue | undefined = dictionary;

  for (const segment of segments) {
    if (typeof current === 'object' && current !== null && segment in current) {
      current = current[segment] as TranslationValue;
    } else {
      current = undefined;
      break;
    }
  }

  return typeof current === 'string' ? current : undefined;
};

export const translate = (
  locale: Locale,
  key: string,
  params?: Record<string, unknown>,
): string => {
  const dictionary = translations[locale] ?? translations[fallbackLocale];

  let template = getValue(dictionary, key);
  if (template === undefined) {
    template = getValue(translations[fallbackLocale], key);
  }

  if (template === undefined) {
    return key;
  }

  if (!params) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (_, token: string) => {
    const replacement = params[token];
    return replacement !== undefined ? String(replacement) : `{{${token}}}`;
  });
};

export const getSupportedLocale = (value?: string): Locale => {
  if (!value) {
    return fallbackLocale;
  }

  const normalized = value.toLowerCase().split('-')[0];
  return (Object.keys(translations) as Locale[]).includes(normalized as Locale)
    ? (normalized as Locale)
    : fallbackLocale;
};

export const detectInitialLocale = (): Locale => {
  try {
    const resolved = Intl.DateTimeFormat().resolvedOptions().locale;
    return getSupportedLocale(resolved);
  } catch {
    return fallbackLocale;
  }
};

export const availableLocales: Array<{ code: Locale; labelKey: string }> = [
  { code: 'en', labelKey: 'common.language.english' },
  { code: 'ru', labelKey: 'common.language.russian' },
  { code: 'tr', labelKey: 'common.language.turkish' },
  { code: 'tk', labelKey: 'common.language.turkmen' },
  { code: 'zh', labelKey: 'common.language.chinese' },
];
