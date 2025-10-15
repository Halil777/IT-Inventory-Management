import React, { useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { availableLocales, Locale, useTranslation } from '../context/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale, t } = useTranslation();

  const options = useMemo(
    () =>
      availableLocales.map(({ code, labelKey }) => ({
        code,
        label: t(labelKey),
      })),
    [t],
  );

  const handleChange = (value: string) => {
    if (value !== locale) {
      setLocale(value as Locale);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('components.languageSwitcher.label')}</Text>
      <Picker
        selectedValue={locale}
        onValueChange={handleChange}
        style={styles.picker}
        mode={Platform.OS === 'ios' ? 'dialog' : 'dropdown'}
        dropdownIconColor="#1e3a8a"
        accessibilityLabel={t('components.languageSwitcher.accessibilityLabel')}>
        {options.map(({ code, label }) => (
          <Picker.Item key={code} label={label} value={code} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e3a8a',
    marginRight: 8,
  },
  picker: {
    width: 140,
    color: '#1f2937',
  },
});
