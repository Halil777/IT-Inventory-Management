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

  const loadDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDepartments();
      setDepartments(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load departments.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

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
      setError('Department name is required.');
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
      const message = err instanceof Error ? err.message : 'Unable to save department.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }, [payload, resetForm, selectedId]);

  const handleDelete = useCallback(async () => {
    if (!selectedId) {
      setError('Select a department to delete.');
      return;
    }

    setSubmitting(true);
    try {
      await deleteDepartment(selectedId);
      setDepartments((prev) => prev.filter((department) => department.id !== selectedId));
      setError(null);
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to delete department.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }, [resetForm, selectedId]);

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
        <Text style={styles.heading}>{selectedId ? 'Edit Department' : 'Add Department'}</Text>
        <Text style={styles.helper}>
          Tap a department to edit it. Use the form below to create, update, or delete entries.
        </Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          placeholder="Department name"
          style={styles.input}
          value={form.name}
          onChangeText={(text) => handleChange('name', text)}
        />
        <TextInput
          placeholder="Head (optional)"
          style={styles.input}
          value={form.head}
          onChangeText={(text) => handleChange('head', text)}
        />
        <TextInput
          placeholder="Description (optional)"
          style={[styles.input, styles.multiline]}
          value={form.description}
          multiline
          onChangeText={(text) => handleChange('description', text)}
        />

        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button
              title={selectedId ? 'Update' : 'Create'}
              onPress={handleSubmit}
              disabled={submitting}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Reset" onPress={resetForm} disabled={submitting} />
          </View>
        </View>

        {selectedId && (
          <View style={styles.deleteButton}>
            <Button color="#c1121f" title="Delete" onPress={handleDelete} disabled={submitting} />
          </View>
        )}

        <Text style={[styles.heading, styles.listHeading]}>Departments</Text>
        {loading ? (
          <ActivityIndicator style={styles.loading} />
        ) : departments.length ? (
          departments.map((department) => {
            const descriptionDetails = department.description
              ? ` • ${department.description}`
              : '';

            return (
              <ListItem
                key={department.id}
                title={department.name}
                subtitle={`Head: ${department.head ?? 'N/A'}${descriptionDetails}`}
                onPress={submitting ? undefined : () => handleSelect(department)}
                selected={department.id === selectedId}
              />
            );
          })
        ) : (
          <Text style={styles.empty}>No departments available.</Text>
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
