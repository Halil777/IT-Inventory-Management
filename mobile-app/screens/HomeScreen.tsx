
import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTranslation } from '../context/LanguageContext';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>{t('screens.legacyHome.title')}</Text>
        <Text style={styles.subheading}>{t('screens.legacyHome.subtitle')}</Text>

        <View style={styles.buttonGroup}>
          <View style={styles.buttonWrapper}>
            <Button
              title={t('screens.legacyHome.buttons.devices')}
              onPress={() => navigation.navigate('Devices')}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title={t('screens.legacyHome.buttons.employees')}
              onPress={() => navigation.navigate('Employees')}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title={t('screens.legacyHome.buttons.departments')}
              onPress={() => navigation.navigate('Departments')}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title={t('screens.legacyHome.buttons.credentials')}
              onPress={() => navigation.navigate('Credentials')}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
  },
  buttonGroup: {
    width: '100%',
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: 12,
  },
});

export default HomeScreen;
