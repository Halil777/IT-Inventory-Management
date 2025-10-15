import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type FilterOption = {
  label: string;
  value: string;
};

type FilterGroup = {
  key: string;
  label: string;
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
};

interface SearchFilterBarProps {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterGroups: FilterGroup[];
  onReset?: () => void;
  resetLabel?: string;
  disabled?: boolean;
  canReset?: boolean;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filterGroups,
  onReset,
  resetLabel,
  disabled,
  canReset = true,
}) => (
  <View style={styles.container}>
    <TextInput
      placeholder={searchPlaceholder}
      style={styles.searchInput}
      value={searchValue}
      onChangeText={onSearchChange}
      editable={!disabled}
      autoCorrect={false}
      autoCapitalize="none"
    />
    {filterGroups.map((group, index) => (
      <View key={group.key} style={styles.group}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupLabel}>{group.label}</Text>
          {index === 0 && onReset && resetLabel ? (
            <Pressable
              onPress={onReset}
              disabled={disabled || !canReset}
              accessibilityRole="button"
              accessibilityLabel={resetLabel}
            >
              <Text
                style={[
                  styles.reset,
                  (disabled || !canReset) && styles.resetDisabled,
                ]}
              >
                {resetLabel}
              </Text>
            </Pressable>
          ) : null}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.optionsRow}
        >
          {group.options.map((option) => {
            const isSelected = option.value === group.selectedValue;
            return (
              <Pressable
                key={`${group.key}-${option.value}`}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => group.onChange(option.value)}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected, disabled }}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d7de',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  group: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2933',
  },
  reset: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
  },
  resetDisabled: {
    color: '#94a3b8',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  optionSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#1d4ed8',
  },
  optionText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#fff',
  },
});

export default SearchFilterBar;
