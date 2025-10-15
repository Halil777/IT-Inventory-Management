import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
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

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setDepartmentFilter('all');
    setRoleFilter('all');
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

  const availableRoles = useMemo(() => {
    const uniqueRoles = Array.from(
      new Set(
        employees
          .map((employee) => employee.role)
          .filter((role): role is string => Boolean(role))
          .map((role) => role.trim())
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b));
    return uniqueRoles;
  }, [employees]);

  const overview = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((employee) => employee.status?.toLowerCase() === 'active').length;
    const inactive = employees.filter((employee) => employee.status?.toLowerCase() === 'inactive').length;
    return { total, active, inactive };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const normalizedRole = roleFilter.toLowerCase();

    return employees
      .filter((employee) => {
        const matchesSearch =
          !normalizedSearch ||
          [
            employee.name,
            employee.email,
            employee.phone,
            employee.civilNumber,
            employee.role,
            employee.department?.name,
          ]
            .filter((value): value is string => Boolean(value))
            .some((value) => value.toLowerCase().includes(normalizedSearch));

        const matchesStatus =
          statusFilter === 'all' || (employee.status ?? '').toLowerCase() === statusFilter;

        const matchesDepartment =
          departmentFilter === 'all' || String(employee.department?.id ?? '') === departmentFilter;

        const matchesRole =
          normalizedRole === 'all' || (employee.role ?? '').toLowerCase() === normalizedRole;

        return matchesSearch && matchesStatus && matchesDepartment && matchesRole;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [departmentFilter, employees, roleFilter, searchQuery, statusFilter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
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
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('screens.employees.overview.title')}</Text>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.statPrimary]}>
              <Text style={styles.statValue}>{overview.total}</Text>
              <Text style={styles.statLabel}>{t('screens.employees.overview.total')}</Text>
            </View>
            <View style={[styles.statCard, styles.statSuccess]}>
              <Text style={styles.statValue}>{overview.active}</Text>
              <Text style={styles.statLabel}>{t('screens.employees.overview.active')}</Text>
            </View>
            <View style={[styles.statCard, styles.statWarning]}>
              <Text style={styles.statValue}>{overview.inactive}</Text>
              <Text style={styles.statLabel}>{t('screens.employees.overview.inactive')}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>{t('screens.employees.filters.title')}</Text>
          <TextInput
            placeholder={t('screens.employees.filters.search')}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />

          <View style={styles.filtersRow}>
            <View style={styles.filterColumn}>
              <Text style={styles.filterLabel}>{t('screens.employees.filters.status')}</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  style={styles.picker}
                  selectedValue={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
                >
                  <Picker.Item label={t('screens.employees.filters.anyStatus')} value="all" />
                  <Picker.Item label={t('screens.employees.statusOptions.active')} value="active" />
                  <Picker.Item label={t('screens.employees.statusOptions.inactive')} value="inactive" />
                </Picker>
              </View>
            </View>
            <View style={styles.filterColumn}>
              <Text style={styles.filterLabel}>{t('screens.employees.filters.department')}</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  style={styles.picker}
                  selectedValue={departmentFilter}
                  onValueChange={(value) => setDepartmentFilter(value as string)}
                >
                  <Picker.Item label={t('screens.employees.filters.anyDepartment')} value="all" />
                  {departments.map((department) => (
                    <Picker.Item key={department.id} label={department.name} value={String(department.id)} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {!!availableRoles.length && (
            <View style={styles.filterColumn}>
              <Text style={styles.filterLabel}>{t('screens.employees.filters.role')}</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  style={styles.picker}
                  selectedValue={roleFilter}
                  onValueChange={(value) => setRoleFilter(value as string)}
                >
                  <Picker.Item label={t('screens.employees.filters.anyRole')} value="all" />
                  {availableRoles.map((role) => (
                    <Picker.Item key={role} label={role} value={role} />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          <View style={styles.filterActions}>
            <Text style={styles.filterCount}>
              {t('screens.employees.filters.results', { count: filteredEmployees.length })}
            </Text>
            <TouchableOpacity style={styles.clearButton} onPress={resetFilters}>
              <Text style={styles.clearButtonText}>{t('screens.employees.filters.reset')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>{t('screens.employees.listTitle')}</Text>
          {loading ? (
            <ActivityIndicator style={styles.loading} />
          ) : filteredEmployees.length ? (
            filteredEmployees.map((employee) => {
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
        </View>
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
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
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d0d7de',
    padding: 12,
    marginBottom: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1f2937',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginHorizontal: -4,
  },
  statCard: {
    flexBasis: '32%',
    flexGrow: 1,
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 4,
    marginBottom: 12,
  },
  statPrimary: {
    backgroundColor: '#eef2ff',
  },
  statSuccess: {
    backgroundColor: '#ecfdf5',
  },
  statWarning: {
    backgroundColor: '#fef3c7',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    color: '#111827',
  },
  statLabel: {
    fontSize: 13,
    color: '#4b5563',
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 12,
  },
  filterColumn: {
    flexBasis: '50%',
    flexGrow: 1,
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    color: '#374151',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  filterCount: {
    fontSize: 14,
    color: '#4b5563',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  empty: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default EmployeesScreen;
