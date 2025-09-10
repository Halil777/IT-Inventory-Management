import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  getEmployees,
  getDevices,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDepartments,
} from '../api';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  civilNumber?: string;
  role?: string;
  status: string;
  department?: { id: number; name: string } | null;
}

export default function EmployeesScreen(): JSX.Element {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [civilNumber, setCivilNumber] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('active');
  const [departmentId, setDepartmentId] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [withDevices, setWithDevices] = useState(0);
  const [deviceCount, setDeviceCount] = useState(0);

  const departmentSuggestions =
    departmentName && !departmentId
      ? departments.filter((d) =>
          d.name.toLowerCase().includes(departmentName.toLowerCase()),
        )
      : [];

  const loadStats = (): void => {
    getDevices()
      .then((devs) => {
        setDeviceCount(devs.length);
        const assignedIds = new Set(
          devs.filter((d: any) => d.user).map((d: any) => d.user.id),
        );
        setWithDevices(assignedIds.size);
      })
      .catch((err) => console.error('Failed to load stats', err));
  };

  const load = (): void => {
    setLoading(true);
    getEmployees()
      .then((data) => setEmployees(data || []))
      .catch((err) => console.error('Failed to load employees', err))
      .finally(() => setLoading(false));
    getDepartments()
      .then((list) => setDepartments(list || []))
      .catch((err) => console.error('Failed to load departments', err));
    loadStats();
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = (): void => {
    setEditing(null);
    setName('');
    setEmail('');
    setPhone('');
    setCivilNumber('');
    setRole('');
    setStatus('active');
    setDepartmentId('');
    setDepartmentName('');
    setModalVisible(true);
  };

  const openEdit = (emp: Employee): void => {
    setEditing(emp);
    setName(emp.name);
    setEmail(emp.email);
    setPhone(emp.phone || '');
    setCivilNumber(emp.civilNumber || '');
    setRole(emp.role || '');
    setStatus(emp.status);
    setDepartmentId(emp.department?.id ? String(emp.department.id) : '');
    setDepartmentName(emp.department?.name || '');
    setModalVisible(true);
  };

  const save = async (): Promise<void> => {
    try {
      if (!name || !email) {
        throw new Error('Missing fields');
      }
      const data = {
        name,
        email,
        phone: phone || undefined,
        civilNumber: civilNumber || undefined,
        role: role || undefined,
        status,
        departmentId: departmentId ? +departmentId : undefined,
      };
      if (editing) {
        await updateEmployee(editing.id, data);
      } else {
        await createEmployee(data);
      }
      setModalVisible(false);
      load();
    } catch (err) {
      console.error('Failed to save employee', err);
    }
  };

  const remove = (emp: Employee): void => {
    Alert.alert('Delete Employee', `Delete ${emp.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEmployee(emp.id);
            load();
          } catch (err) {
            console.error('Failed to delete employee', err);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Employees</Text>
        <TouchableOpacity style={styles.addButton} onPress={openNew}>
          <Feather name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.statsContainer}>
          {[
            {
              label: 'Total Employees',
              value: employees.length,
              icon: 'users',
              color: '#2563eb',
            },
            {
              label: 'With Devices',
              value: withDevices,
              icon: 'user-check',
              color: '#16a34a',
            },
            {
              label: 'Without Devices',
              value: employees.length - withDevices,
              icon: 'user-x',
              color: '#dc2626',
            },
            {
              label: 'Total Devices',
              value: deviceCount,
              icon: 'monitor',
              color: '#9333ea',
            },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Feather name={stat.icon as any} size={20} color={stat.color} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
        {loading ? (
          <Text style={styles.loading}>Loading...</Text>
        ) : (
          employees.map((emp) => (
            <View key={emp.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.empName}>{emp.name}</Text>
                <Text style={styles.empEmail}>{emp.email}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => openEdit(emp)}
                >
                  <Feather name="edit-2" size={16} color="#2563eb" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => remove(emp)}
                >
                  <Feather name="trash" size={16} color="#dc2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editing ? 'Edit Employee' : 'New Employee'}
            </Text>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            <TextInput
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
            />
            <TextInput
              placeholder="Civil Number"
              value={civilNumber}
              onChangeText={setCivilNumber}
              style={styles.input}
            />
            <TextInput
              placeholder="Department"
              value={departmentName}
              onChangeText={(text) => {
                setDepartmentName(text);
                setDepartmentId('');
              }}
              style={styles.input}
            />
            {departmentSuggestions.length > 0 && (
              <View style={styles.suggestions}>
                {departmentSuggestions.map((d) => (
                  <TouchableOpacity
                    key={d.id}
                    onPress={() => {
                      setDepartmentId(String(d.id));
                      setDepartmentName(d.name);
                    }}
                  >
                    <Text style={styles.suggestionItem}>{d.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TextInput
              placeholder="Role"
              value={role}
              onChangeText={setRole}
              style={styles.input}
            />
            <TextInput
              placeholder="Status"
              value={status}
              onChangeText={setStatus}
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={save}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#232323',
  },
  addButton: {
    backgroundColor: '#2563eb',
    padding: 8,
    borderRadius: 4,
  },
  loading: {
    textAlign: 'center',
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#232323',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  empName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#232323',
  },
  empEmail: {
    fontSize: 12,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#232323',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  suggestions: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    maxHeight: 120,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  suggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  modalButtonPrimary: {
    backgroundColor: '#2563eb',
  },
  modalButtonText: {
    color: '#232323',
  },
  modalButtonTextPrimary: {
    color: '#fff',
    fontWeight: '600',
  },
});
