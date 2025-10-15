import { MaterialIcons } from '@expo/vector-icons';
import React, { ComponentProps, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

export interface StatCardProps {
  label: string;
  value: number;
  icon: MaterialIconName;
  accentColor: string;
  accentBackground: string;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  accentColor,
  accentBackground,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const formattedValue = useMemo(() => value.toLocaleString(), [value]);

  const backgroundColor = colorScheme === 'dark' ? '#1f2937' : '#ffffff';

  return (
    <Pressable
      accessibilityHint={`Navigate to ${label}`}
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor,
          borderColor: accentColor,
          transform: pressed ? [{ scale: 0.98 }] : undefined,
          shadowOpacity: colorScheme === 'dark' ? 0.35 : 0.1,
        },
      ]}>
      <ThemedView lightColor="transparent" darkColor="transparent">
        <View style={[styles.iconContainer, { backgroundColor: accentBackground }]}> 
          <MaterialIcons name={icon} size={28} color={accentColor} />
        </View>
        <ThemedText
          lightColor={colorScheme === 'dark' ? '#ffffff' : undefined}
          darkColor="#f8fafc"
          style={styles.value}>
          {formattedValue}
        </ThemedText>
        <ThemedText
          type="defaultSemiBold"
          lightColor={colorScheme === 'dark' ? '#e2e8f0' : '#334155'}
          darkColor="#cbd5f5"
          style={styles.label}>
          {label}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    width: '48%',
    marginBottom: 18,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 6,
  },
  iconContainer: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    width: 48,
    marginBottom: 18,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  label: {
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});

