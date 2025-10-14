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
import { Picker } from '@react-native-picker/picker';
import ListItem from '../components/ListItem';
import { Printer } from '../interfaces/Printer';
import { Department } from '../interfaces/Department';
import { Employee } from '../interfaces/Employee';
import { getDepartments } from '../services/departments';
import { getEmployees } from '../services/employees';
import {
  createPrinter,
  deletePrinter,
  getPrinters,
  PrinterInput,
  updatePrinter,
} from '../services/printers';

interface PrinterFormState {
  name: string;
  model: string;
  description: string;
  departmentId: string;
  userId: string;
}

const emptyForm: PrinterFormState = {
  name: '',
  model: '',
  description: '',
  departmentId: '',
  userId: '',
};

const PrintersScreen: React.FC = () => {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<PrinterFormState>(emptyForm);

  const loadPrinters = useCallback(async () => {
    setLoading(true);
    try {
      const [printerData, departmentData, employeeData] = await Promise.all([
        getPrinters(),
        getDepartments(),
        getEmployees(),
      ]);
      setPrinters(printerData);
      setDepartments(departmentData);
      setEmployees(employeeData);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load printers.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPrinters();
  }, [loadPrinters]);

  const resetForm = useCallback(() => {
    setForm(() => ({ ...emptyForm }));
    setSelectedId(null);
    setError(null);
  }, []);

  const handleChange = useCallback(<K extends keyof PrinterFormState>(
    key: K,
    value: PrinterFormState[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const buildPayload = useCallback((): PrinterInput | null => {
    const trimmedName = form.name.trim();
    const trimmedModel = form.model.trim();

    if (!trimmedName || !trimmedModel) {
      setError('Printer name and model are required.');
      return null;
    }

    const parseNullableId = (value: string, label: string): number | null => {
      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }

      const parsed = Number(trimmed);
      if (Number.isNaN(parsed)) {
        throw new Error(`${label} must be a number.`);
      }

      return parsed;
    };

    try {
      return {
        name: trimmedName,
        model: trimmedModel,
        description: form.description.trim() ? form.description.trim() : null,
        departmentId: parseNullableId(form.departmentId, 'Department ID'),
        userId: parseNullableId(form.userId, 'Employee ID'),
      };
    } catch (validationError) {
      const message =
        validationError instanceof Error ? validationError.message : 'Invalid form input.';
      setError(message);
      return null;
    }
  }, [form.departmentId, form.description, form.model, form.name, form.userId]);

  const handleSubmit = useCallback(async () => {
    setError(null);
    const payload = buildPayload();
    if (!payload) {
      return;
    }

    setSubmitting(true);
    try {
      if (selectedId) {
        const updated = await updatePrinter(selectedId, payload);
        setPrinters((prev) => prev.map((printer) => (printer.id === updated.id ? updated : printer)));
      } else {
        const created = await createPrinter(payload);
        setPrinters((prev) => [...prev, created]);
      }
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to save printer.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }, [buildPayload, resetForm, selectedId]);

  const handleDelete = useCallback(async () => {
    if (!selectedId) {
      setError('Select a printer to delete.');
      return;
    }

    setSubmitting(true);
    try {
      await deletePrinter(selectedId);
      setPrinters((prev) => prev.filter((printer) => printer.id !== selectedId));
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to delete printer.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }, [resetForm, selectedId]);

  const handleSelect = useCallback((printer: Printer) => {
    setSelectedId(printer.id);
    setError(null);
    setForm({
      name: printer.name ?? '',
      model: printer.model ?? '',
      description: printer.description ?? '',
      departmentId: printer.department?.id ? String(printer.department.id) : '',
      userId: printer.user?.id ? String(printer.user.id) : '',
    });
  }, []);

  const departmentOptions = useMemo(
    () =>
      departments.map((department) => ({
        label: department.name,
        value: String(department.id),
      })),
    [departments],
  );

  const employeeOptions = useMemo(
    () =>
      employees.map((employee) => ({
        label: employee.name,
        value: String(employee.id),
      })),
    [employees],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>{selectedId ? 'Edit Printer' : 'Add Printer'}</Text>
        <Text style={styles.helper}>Tap a printer to edit or remove it.</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          placeholder="Printer name"
          style={styles.input}
          value={form.name}
          onChangeText={(text) => handleChange('name', text)}
        />
        <TextInput
          placeholder="Model"
          style={styles.input}
          value={form.model}
          onChangeText={(text) => handleChange('model', text)}
        />
        <TextInput
          placeholder="Description (optional)"
          style={[styles.input, styles.multiline]}
          value={form.description}
          onChangeText={(text) => handleChange('description', text)}
          multiline
        />
        <View style={styles.selectGroup}>
          <Text style={styles.label}>Department</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={form.departmentId}
              onValueChange={(value) => handleChange('departmentId', value as string)}
            >
              <Picker.Item label="Unassigned" value="" />
              {departmentOptions.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.selectGroup}>
          <Text style={styles.label}>Assigned Employee</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={form.userId}
              onValueChange={(value) => handleChange('userId', value as string)}
            >
              <Picker.Item label="Unassigned" value="" />
              {employeeOptions.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        </View>

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

        <Text style={[styles.heading, styles.listHeading]}>Printers</Text>
        {loading ? (
          <ActivityIndicator style={styles.loading} />
        ) : printers.length ? (
          printers.map((printer) => {
            const details: string[] = [
              `Department: ${printer.department?.name ?? 'Unassigned'}`,
              `Assigned To: ${printer.user?.name ?? 'Unassigned'}`,
            ];

            if (printer.updatedAt) {
              const updatedDate = new Date(printer.updatedAt);
              if (!Number.isNaN(updatedDate.getTime())) {
                details.push(`Last Updated: ${updatedDate.toLocaleString()}`);
              }
            }

            if (printer.description) {
              details.push(`Description: ${printer.description}`);
            }

            return (
              <ListItem
                key={printer.id}
                title={printer.name}
                subtitle={`Model: ${printer.model}`}
                details={details}
                onPress={submitting ? undefined : () => handleSelect(printer)}
                selected={printer.id === selectedId}
              />
            );
          })
        ) : (
          <Text style={styles.empty}>No printers available.</Text>
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
  selectGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d7de',
  },
  picker: {
    height: 44,
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

export default PrintersScreen;

