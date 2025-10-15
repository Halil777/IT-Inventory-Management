import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { availableLocales, useTranslation } from '../context/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale, t } = useTranslation();

  const currentLocale = useMemo(
    () => availableLocales.find((entry) => entry.code === locale) ?? availableLocales[0],
    [locale],
  );

  const nextLocale = useMemo(() => {
    const currentIndex = availableLocales.findIndex((entry) => entry.code === locale);
    return availableLocales[(currentIndex + 1) % availableLocales.length];
  }, [locale]);

  const currentLabel = t(currentLocale.labelKey);
  const buttonLabel = t('components.languageSwitcher.buttonLabel', { language: currentLabel });

  return (
    <Pressable
      accessibilityHint={t('components.languageSwitcher.accessibilityHint')}
      accessibilityRole="button"
      onPress={() => setLocale(nextLocale.code)}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
      <Text style={styles.text}>{buttonLabel}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1e3a8a',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  text: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
});
