import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ListItem from '../components/ListItem';
import { useTranslation } from '../context/LanguageContext';
import { Department } from '../interfaces/Department';
import {
  createDepartment,
  deleteDepartment,
  DepartmentInput,
  getDepartments,
  updateDepartment,
} from '../services/departments';

interface DepartmentFormState {
  name: string;
  head: string;
  description: string;
}

const emptyForm: DepartmentFormState = {
  name: '',
  head: '',
  description: '',
};

const DepartmentsScreen: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<DepartmentFormState>(emptyForm);
  const { t } = useTranslation();

  const loadDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDepartments();
      setDepartments(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error && err.message
        ? err.message
        : t('screens.departments.errors.load');
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadDepartments();
  }, [loadDepartments]);

  const resetForm = useCallback(() => {
    setForm(() => ({ ...emptyForm }));
    setSelectedId(null);
    setError(null);
  }, []);

  const handleChange = useCallback(<K extends keyof DepartmentFormState>(
    key: K,
    value: DepartmentFormState[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const payload = useMemo<DepartmentInput | null>(() => {
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      return null;
    }

    return {
      name: trimmedName,
      head: form.head.trim() || undefined,
      description: form.description.trim() || undefined,
    };
  }, [form.description, form.head, form.name]);

  const handleSubmit = useCallback(async () => {
    if (!payload) {
      setError(t('screens.departments.errors.required'));
      return;
    }

    setSubmitting(true);
    try {
      if (selectedId) {
        const updated = await updateDepartment(selectedId, payload);
        setDepartments((prev) =>
          prev.map((department) => (department.id === updated.id ? updated : department)),
        );
      } else {
        const created = await createDepartment(payload);
        setDepartments((prev) => [...prev, created]);
      }
      setError(null);
      resetForm();
    } catch (err) {
      const message = err instanceof Error && err.message
        ? err.message
        : t('screens.departments.errors.save');
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }, [payload, resetForm, selectedId, t]);

  const handleDelete = useCallback(async () => {
    if (!selectedId) {
      setError(t('screens.departments.errors.selectForDelete'));
      return;
    }

    setSubmitting(true);
    try {
      await deleteDepartment(selectedId);
      setDepartments((prev) => prev.filter((department) => department.id !== selectedId));
      setError(null);
      resetForm();
    } catch (err) {
      const message = err instanceof Error && err.message
        ? err.message
        : t('screens.departments.errors.delete');
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }, [resetForm, selectedId, t]);

  const handleSelect = useCallback((department: Department) => {
    setSelectedId(department.id);
    setForm({
      name: department.name ?? '',
      head: department.head ?? '',
      description: department.description ?? '',
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>
          {selectedId ? t('screens.departments.editTitle') : t('screens.departments.addTitle')}
        </Text>
        <Text style={styles.helper}>{t('screens.departments.helper')}</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          placeholder={t('screens.departments.placeholders.name')}
          style={styles.input}
          value={form.name}
          onChangeText={(text) => handleChange('name', text)}
        />
        <TextInput
          placeholder={t('screens.departments.placeholders.head')}
          style={styles.input}
          value={form.head}
          onChangeText={(text) => handleChange('head', text)}
        />
        <TextInput
          placeholder={t('screens.departments.placeholders.description')}
          style={[styles.input, styles.multiline]}
          value={form.description}
          multiline
          onChangeText={(text) => handleChange('description', text)}
        />

        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button
              title={selectedId ? t('screens.departments.buttons.update') : t('screens.departments.buttons.create')}
              onPress={handleSubmit}
              disabled={submitting}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title={t('screens.departments.buttons.reset')} onPress={resetForm} disabled={submitting} />
          </View>
        </View>

        {selectedId && (
          <View style={styles.deleteButton}>
            <Button
              color="#c1121f"
              title={t('screens.departments.buttons.delete')}
              onPress={handleDelete}
              disabled={submitting}
            />
          </View>
        )}

        <Text style={[styles.heading, styles.listHeading]}>{t('screens.departments.listTitle')}</Text>
        {loading ? (
          <ActivityIndicator style={styles.loading} />
        ) : departments.length ? (
          departments.map((department) => {
            const headText = t('screens.departments.head', {
              head: department.head ?? t('common.general.notAvailable'),
            });
            const subtitle = department.description
              ? t('screens.departments.subtitleWithDescription', {
                  head: headText,
                  description: department.description,
                })
              : headText;

            return (
              <ListItem
                key={department.id}
                title={department.name}
                subtitle={subtitle}
                onPress={submitting ? undefined : () => handleSelect(department)}
                selected={department.id === selectedId}
              />
            );
          })
        ) : (
          <Text style={styles.empty}>{t('screens.departments.empty')}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  content: {
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  helper: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  error: {
    backgroundColor: '#fdecea',
    color: '#b71c1c',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d7de',
    padding: 12,
    marginBottom: 12,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  deleteButton: {
    marginBottom: 16,
  },
  listHeading: {
    marginTop: 8,
  },
  loading: {
    marginVertical: 24,
  },
  empty: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default DepartmentsScreen;
