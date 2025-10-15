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
import { useTranslation } from '../context/LanguageContext';
import { Department } from '../interfaces/Department';
import { Employee } from '../interfaces/Employee';
import { getDepartments } from '../services/departments';
import {
  createEmployee,
  deleteEmployee,
  EmployeeInput,
  getEmployees,
  updateEmployee,
} from '../services/employees';

interface EmployeeFormState {
  name: string;
  email: string;
  status: string;
  phone: string;
  civilNumber: string;
  departmentId: number | null;
  role: string;
}

const emptyForm: EmployeeFormState = {
  name: '',
  email: '',
  status: 'active',
  phone: '',
  civilNumber: '',
  departmentId: null,
  role: '',
};

const EmployeesScreen: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<EmployeeFormState>(emptyForm);
  const { t } = useTranslation();

  const translateStatus = useCallback(
    (status?: string | null) => {
      if (!status) {
        return t('common.general.notAvailable');
      }

      const normalized = status.toLowerCase();
      const key = `common.status.${normalized}`;
      const translated = t(key);
      return translated !== key ? translated : status;
    },
    [t],
  );

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const [employeeData, departmentData] = await Promise.all([
        getEmployees(),
        getDepartments(),
      ]);
      setEmployees(employeeData);
      setDepartments(departmentData);
      setError(null);
    } catch (err) {
      const message = err instanceof Error && err.message
        ? err.message
        : t('screens.employees.errors.load');
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadEmployees();
  }, [loadEmployees]);

  const resetForm = useCallback(() => {
    setForm(() => ({ ...emptyForm }));
    setSelectedId(null);
    setError(null);
  }, []);

  const handleChange = useCallback(<K extends keyof EmployeeFormState>(
    key: K,
    value: EmployeeFormState[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const payload = useMemo<EmployeeInput | null>(() => {
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedStatus = form.status.trim();

    if (!trimmedName || !trimmedEmail || !trimmedStatus) {
      return null;
    }

    return {
      name: trimmedName,
      email: trimmedEmail,
      status: trimmedStatus,
      phone: form.phone.trim() || undefined,
      civilNumber: form.civilNumber.trim() || undefined,
      role: form.role.trim() || undefined,
      departmentId: form.departmentId ?? undefined,
    };
  }, [form.civilNumber, form.departmentId, form.email, form.name, form.phone, form.role, form.status]);

  const handleSubmit = useCallback(async () => {
    if (!payload) {
      setError(t('screens.employees.errors.required'));
      return;
    }

    setSubmitting(true);
    try {
      if (selectedId) {
        const updated = await updateEmployee(selectedId, payload);
        setEmployees((prev) =>
          prev.map((employee) => (employee.id === updated.id ? updated : employee)),
        );
      } else {
        const created = await createEmployee(payload);
        setEmployees((prev) => [...prev, created]);
      }
      setError(null);
      resetForm();
    } catch (err) {
      const message = err instanceof Error && err.message
        ? err.message
        : t('screens.employees.errors.save');
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }, [payload, resetForm, selectedId, t]);

  const handleDelete = useCallback(async () => {
    if (!selectedId) {
      setError(t('screens.employees.errors.selectForDelete'));
      return;
    }

    setSubmitting(true);
    try {
      await deleteEmployee(selectedId);
      setEmployees((prev) => prev.filter((employee) => employee.id !== selectedId));
      setError(null);
      resetForm();
    } catch (err) {
      const message = err instanceof Error && err.message
        ? err.message
        : t('screens.employees.errors.delete');
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }, [resetForm, selectedId, t]);

  const handleSelect = useCallback((employee: Employee) => {
    setSelectedId(employee.id);
    setForm({
      name: employee.name ?? '',
      email: employee.email ?? '',
      status: employee.status ?? 'active',
      phone: employee.phone ?? '',
      civilNumber: employee.civilNumber ?? '',
      departmentId: employee.department?.id ?? null,
      role: employee.role ?? '',
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>
          {selectedId ? t('screens.employees.editTitle') : t('screens.employees.addTitle')}
        </Text>
        <Text style={styles.helper}>{t('screens.employees.helper')}</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          placeholder={t('screens.employees.placeholders.name')}
          style={styles.input}
          value={form.name}
          onChangeText={(text) => handleChange('name', text)}
        />
        <TextInput
          placeholder={t('screens.employees.placeholders.email')}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(text) => handleChange('email', text)}
        />
        <Text style={styles.label}>{t('screens.employees.labels.status')}</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            style={styles.picker}
            selectedValue={form.status}
            onValueChange={(value) => handleChange('status', value)}
          >
            <Picker.Item label={t('screens.employees.statusOptions.active')} value="active" />
            <Picker.Item label={t('screens.employees.statusOptions.inactive')} value="inactive" />
          </Picker>
        </View>
        <TextInput
          placeholder={t('screens.employees.placeholders.phone')}
          style={styles.input}
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(text) => handleChange('phone', text)}
        />
        <TextInput
          placeholder={t('screens.employees.placeholders.civilNumber')}
          style={styles.input}
          value={form.civilNumber}
          onChangeText={(text) => handleChange('civilNumber', text)}
        />
        <Text style={styles.label}>{t('screens.employees.labels.department')}</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            style={styles.picker}
            selectedValue={form.departmentId ?? 'none'}
            onValueChange={(value) => {
              if (value === 'none') {
                handleChange('departmentId', null);
              } else {
                handleChange('departmentId', Number(value));
              }
            }}
          >
            <Picker.Item label={t('screens.employees.departmentOptions.unassigned')} value="none" />
            {departments.map((department) => (
              <Picker.Item key={department.id} label={department.name} value={department.id} />
            ))}
          </Picker>
        </View>
        <TextInput
          placeholder={t('screens.employees.placeholders.role')}
          style={styles.input}
          value={form.role}
          onChangeText={(text) => handleChange('role', text)}
        />

        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button
              title={selectedId ? t('screens.employees.buttons.update') : t('screens.employees.buttons.create')}
              onPress={handleSubmit}
              disabled={submitting}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title={t('screens.employees.buttons.reset')} onPress={resetForm} disabled={submitting} />
          </View>
        </View>

        {selectedId && (
          <View style={styles.deleteButton}>
            <Button
              color="#c1121f"
              title={t('screens.employees.buttons.delete')}
              onPress={handleDelete}
              disabled={submitting}
            />
          </View>
        )}

        <Text style={[styles.heading, styles.listHeading]}>{t('screens.employees.listTitle')}</Text>
        {loading ? (
          <ActivityIndicator style={styles.loading} />
        ) : employees.length ? (
          employees.map((employee) => {
            const subtitle = employee.email
              ? t('screens.employees.details.email', { email: employee.email })
              : undefined;
            const details = [
              employee.department?.name
                ? t('screens.employees.details.department', { department: employee.department.name })
                : null,
              employee.status
                ? t('screens.employees.details.status', { status: translateStatus(employee.status) })
                : null,
              employee.phone ? t('screens.employees.details.phone', { phone: employee.phone }) : null,
              employee.role ? t('screens.employees.details.role', { role: employee.role }) : null,
              employee.civilNumber
                ? t('screens.employees.details.civilNumber', { civilNumber: employee.civilNumber })
                : null,
            ].filter(Boolean) as string[];

            return (
              <ListItem
                key={employee.id}
                title={employee.name}
                subtitle={subtitle}
                details={details}
                onPress={submitting ? undefined : () => handleSelect(employee)}
                selected={employee.id === selectedId}
              />
            );
          })
        ) : (
          <Text style={styles.empty}>{t('screens.employees.empty')}</Text>
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
    marginBottom: 8,
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d7de',
    marginBottom: 12,
  },
  picker: {
    height: 48,
    width: '100%',
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

export default EmployeesScreen;
