import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ListItemProps {
  title: string;
  subtitle?: string;
  details?: string[];
  onPress?: () => void;
  selected?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  details,
  onPress,
  selected = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.container, selected && styles.selected]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {details?.map((detail, index) => (
        <Text key={`${detail}-${index}`} style={styles.detail}>
          {detail}
        </Text>
      ))}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f1f1f',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  detail: {
    fontSize: 14,
    color: '#4a4a4a',
    marginTop: 4,
  },
  selected: {
    borderColor: '#1677ff',
    backgroundColor: '#f0f7ff',
    shadowOpacity: Platform.select({ ios: 0.1, android: 0.12 }),
  },
});

export default ListItem;
