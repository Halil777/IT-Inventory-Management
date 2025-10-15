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
import SearchFilterBar from '../components/SearchFilterBar';
import { useTranslation } from '../context/LanguageContext';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const { t } = useTranslation();

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
      const message = err instanceof Error && err.message
        ? err.message
        : t('screens.printers.errors.load');
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadPrinters();
  }, [loadPrinters]);

  const resetForm = useCallback(() => {
    setForm(() => ({ ...emptyForm }));
    setSelectedId(null);
    setError(null);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setDepartmentFilter('all');
    setAssignmentFilter('all');
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
      setError(t('screens.printers.errors.required'));
      return null;
    }

    const parseNullableId = (value: string, type: 'department' | 'employee'): number | null => {
      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }

      const parsed = Number(trimmed);
      if (Number.isNaN(parsed)) {
        if (type === 'department') {
          throw new Error(t('screens.printers.errors.invalidDepartmentId'));
        }

        if (type === 'employee') {
          throw new Error(t('screens.printers.errors.invalidEmployeeId'));
        }

        throw new Error(t('screens.printers.errors.invalidInput'));
      }

      return parsed;
    };

    try {
      return {
        name: trimmedName,
        model: trimmedModel,
        description: form.description.trim() ? form.description.trim() : null,
        departmentId: parseNullableId(form.departmentId, 'department'),
        userId: parseNullableId(form.userId, 'employee'),
      };
    } catch (validationError) {
      const message =
        validationError instanceof Error && validationError.message
          ? validationError.message
          : t('screens.printers.errors.invalidInput');
      setError(message);
      return null;
    }
  }, [form.departmentId, form.description, form.model, form.name, form.userId, t]);

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
      const message = err instanceof Error && err.message
        ? err.message
        : t('screens.printers.errors.save');
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }, [buildPayload, resetForm, selectedId, t]);

  const handleDelete = useCallback(async () => {
    if (!selectedId) {
      setError(t('screens.printers.errors.selectForDelete'));
      return;
    }

    setSubmitting(true);
    try {
      await deletePrinter(selectedId);
      setPrinters((prev) => prev.filter((printer) => printer.id !== selectedId));
      resetForm();
    } catch (err) {
      const message = err instanceof Error && err.message
        ? err.message
        : t('screens.printers.errors.delete');
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }, [resetForm, selectedId, t]);

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
    () => {
      const options = departments
        .map((department) => ({ label: department.name, value: String(department.id) }))
        .sort((a, b) => a.label.localeCompare(b.label));

      return [
        { label: t('screens.printers.filters.options.all'), value: 'all' },
        { label: t('screens.printers.filters.options.unassigned'), value: 'unassigned' },
        ...options,
      ];
    },
    [departments, t],
  );

  const assignmentOptions = useMemo(
    () => [
      { label: t('screens.printers.filters.options.all'), value: 'all' },
      { label: t('screens.printers.filters.options.assigned'), value: 'assigned' },
      { label: t('screens.printers.filters.options.unassigned'), value: 'unassigned' },
    ],
    [t],
  );

  const filteredPrinters = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return printers.filter((printer) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          printer.name,
          printer.model,
          printer.description,
          printer.department?.name,
          printer.user?.name,
        ]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLowerCase().includes(normalizedQuery));

      const matchesDepartment =
        departmentFilter === 'all' ||
        (departmentFilter === 'unassigned' && !printer.department) ||
        (printer.department?.id && String(printer.department.id) === departmentFilter);

      const matchesAssignment =
        assignmentFilter === 'all' ||
        (assignmentFilter === 'assigned' && !!printer.user) ||
        (assignmentFilter === 'unassigned' && !printer.user);

      return matchesQuery && matchesDepartment && matchesAssignment;
    });
  }, [assignmentFilter, departmentFilter, printers, searchQuery]);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(searchQuery.trim()) || departmentFilter !== 'all' || assignmentFilter !== 'all',
    [assignmentFilter, departmentFilter, searchQuery],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>
          {selectedId ? t('screens.printers.editTitle') : t('screens.printers.addTitle')}
        </Text>


        {error && <Text style={styles.error}>{error}</Text>}

        <SearchFilterBar
          searchPlaceholder={t('screens.printers.filters.searchPlaceholder')}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          filterGroups={[
            {
              key: 'department',
              label: t('screens.printers.filters.departmentLabel'),
              options: departmentOptions,
              selectedValue: departmentFilter,
              onChange: setDepartmentFilter,
            },
            {
              key: 'assignment',
              label: t('screens.printers.filters.assignmentLabel'),
              options: assignmentOptions,
              selectedValue: assignmentFilter,
              onChange: setAssignmentFilter,
            },
          ]}
          onReset={resetFilters}
          resetLabel={t('screens.printers.filters.reset')}
          disabled={loading}
          canReset={hasActiveFilters}
        />

        <TextInput
          placeholder={t('screens.printers.placeholders.name')}
          style={styles.input}
          value={form.name}
          onChangeText={(text) => handleChange('name', text)}
        />
        <TextInput
          placeholder={t('screens.printers.placeholders.model')}
          style={styles.input}
          value={form.model}
          onChangeText={(text) => handleChange('model', text)}
        />
        <TextInput
          placeholder={t('screens.printers.placeholders.description')}
          style={[styles.input, styles.multiline]}
          value={form.description}
          onChangeText={(text) => handleChange('description', text)}
          multiline
        />

 

        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button
              title={selectedId ? t('screens.printers.buttons.update') : t('screens.printers.buttons.create')}
              onPress={handleSubmit}
              disabled={submitting}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title={t('screens.printers.buttons.reset')} onPress={resetForm} disabled={submitting} />
          </View>
        </View>

        {selectedId && (
          <View style={styles.deleteButton}>
            <Button
              color="#c1121f"
              title={t('screens.printers.buttons.delete')}
              onPress={handleDelete}
              disabled={submitting}
            />
          </View>
        )}

        <Text style={[styles.heading, styles.listHeading]}>{t('screens.printers.listTitle')}</Text>
        {loading ? (
          <ActivityIndicator style={styles.loading} />
        ) : filteredPrinters.length ? (
          filteredPrinters.map((printer) => {
            const details: string[] = [
              t('screens.printers.details.department', {
                department: printer.department?.name ?? t('screens.printers.unassigned'),
              }),
              t('screens.printers.details.assignedTo', {
                user: printer.user?.name ?? t('screens.printers.unassigned'),
              }),
            ];


            if (printer.description) {
              details.push(
                t('screens.printers.details.description', { description: printer.description }),
              );
            }

            return (
              <ListItem
                key={printer.id}
                title={printer.name}
                subtitle={t('screens.printers.details.model', { model: printer.model })}
                details={details}
                onPress={submitting ? undefined : () => handleSelect(printer)}
                selected={printer.id === selectedId}
              />
            );
          })
        ) : (
          <Text style={styles.empty}>
            {printers.length
              ? t('screens.printers.filters.noResults')
              : t('screens.printers.empty')}
          </Text>
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

export default PrintersScreen;

