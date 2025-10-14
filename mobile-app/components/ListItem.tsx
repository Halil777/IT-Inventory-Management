
import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ListItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  selected?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({ title, subtitle, onPress, selected = false }) => {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.container, selected && styles.selected]}
    >
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  selected: {
    backgroundColor: '#e6f4ff',
    borderColor: '#4da3ff',
  },
});

export default ListItem;
