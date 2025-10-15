import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  availableLocales,
  detectInitialLocale,
  Locale,
  translate,
} from '../localization/i18n';

type Translator = (key: string, params?: Record<string, unknown>) => string;

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translator;
};

const LanguageContext = createContext<LanguageContextValue>({
  locale: detectInitialLocale(),
  setLocale: () => undefined,
  t: (key) => key,
});

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => detectInitialLocale());

  const handleSetLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale: handleSetLocale,
      t: (key, params) => translate(locale, key, params),
    }),
    [handleSetLocale, locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useTranslation = () => useContext(LanguageContext);

export { availableLocales };
