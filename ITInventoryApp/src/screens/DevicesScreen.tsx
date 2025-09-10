import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';
import {
  getDevices,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceTypes,
  getEmployees,
  getDepartments,
} from '../api';

interface Device {
  id: number;
  type: { id: number; name: string };
  user?: { id: number; name: string } | null;
  department?: { id: number; name: string } | null;
  status: string;
  serialNumber?: string;
  model?: string;
}

export default function DevicesScreen(): JSX.Element {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [typeId, setTypeId] = useState('');
  const [userId, setUserId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [status, setStatus] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [model, setModel] = useState('');
  const [editing, setEditing] = useState<Device | null>(null);
  const [deviceTypes, setDeviceTypes] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const load = (): void => {
    setLoading(true);
    getDevices()
      .then((data) => setDevices(data || []))
      .catch((err) => console.error('Failed to load devices', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    getDeviceTypes()
      .then((list) => {
        setDeviceTypes(list || []);
        if (list && list.length > 0) {
          setTypeId((prev) => prev || String(list[0].id));
        }
      })
      .catch((err) => console.error('Failed to load device types', err));
    getDepartments().then(setDepartments).catch((err) => console.error('Failed to load departments', err));
    getEmployees()
      .then((list) => setAllEmployees(list || []))
      .catch((err) => console.error('Failed to load employees', err));
  }, []);

  useEffect(() => {
    if (departmentId) {
      const filtered = allEmployees.filter((u) => u.department?.id === Number(departmentId));
      setEmployees(filtered);
      if (!filtered.some((u) => String(u.id) === userId)) {
        setUserId('');
      }
    } else {
      setEmployees([]);
      setUserId('');
    }
  }, [departmentId, allEmployees]);

  const openNew = (): void => {
    setEditing(null);
    setTypeId(deviceTypes.length > 0 ? String(deviceTypes[0].id) : '');
    setUserId('');
    setDepartmentId('');
    setStatus('new');
    setSerialNumber('');
    setModel('');
    setModalVisible(true);
  };

  const openEdit = (dev: Device): void => {
    setEditing(dev);
    setTypeId(dev.type.id ? String(dev.type.id) : '');
    setUserId(dev.user?.id ? String(dev.user.id) : '');
    setDepartmentId(dev.department?.id ? String(dev.department.id) : '');
    setStatus(dev.status);
    setSerialNumber(dev.serialNumber || '');
    setModel(dev.model || '');
    setModalVisible(true);
  };

  const save = async (): Promise<void> => {
    try {
      if (!typeId || !status) {
        throw new Error('Missing fields');
      }
      const data = {
        typeId: +typeId,
        userId: userId ? +userId : undefined,
        departmentId: departmentId ? +departmentId : undefined,
        status,
        serialNumber: serialNumber || undefined,
        model: model || undefined,
      };
      if (editing) {
        await updateDevice(editing.id, data);
      } else {
        await createDevice(data);
      }
      setModalVisible(false);
      load();
    } catch (err) {
      console.error('Failed to save device', err);
    }
  };

  const remove = (dev: Device): void => {
    Alert.alert('Delete Device', `Delete device ${dev.id}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDevice(dev.id);
            load();
          } catch (err) {
            console.error('Failed to delete device', err);
          }
        },
      },
    ]);
  };

    const filteredDevices = devices.filter((dev) => {
      const q = search.toLowerCase();
      return (
        dev.model?.toLowerCase().includes(q) ||
        dev.type.name.toLowerCase().includes(q) ||
        (dev.user?.name || '').toLowerCase().includes(q) ||
        (dev.department?.name || '').toLowerCase().includes(q)
      );
    });

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Devices</Text>
          <TouchableOpacity style={styles.addButton} onPress={openNew}>
            <Feather name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by device, type, user, department"
          value={search}
          onChangeText={setSearch}
        />
        <ScrollView>
          {loading && <Text style={styles.loading}>Loading...</Text>}
          {!loading &&
            filteredDevices.map((dev) => (
              <View key={dev.id} style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deviceType}>{dev.type.name}</Text>
                {dev.model && <Text style={styles.deviceModel}>{dev.model}</Text>}
                {dev.serialNumber && (
                  <Text style={styles.deviceSerial}>{dev.serialNumber}</Text>
                )}
                {dev.department && (
                  <Text style={styles.deviceMeta}>Dept: {dev.department.name}</Text>
                )}
                {dev.user && (
                  <Text style={styles.deviceMeta}>User: {dev.user.name}</Text>
                )}
                <Text style={styles.deviceStatus}>{dev.status}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => openEdit(dev)}
                >
                  <Feather name="edit-2" size={16} color="#2563eb" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => remove(dev)}
                >
                  <Feather name="trash-2" size={16} color="#dc2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editing ? 'Edit Device' : 'New Device'}
            </Text>
            <Picker selectedValue={typeId} onValueChange={setTypeId} style={styles.input}>
              {deviceTypes.map((t) => (
                <Picker.Item key={t.id} label={t.name} value={String(t.id)} />
              ))}
            </Picker>
            <Picker selectedValue={departmentId} onValueChange={(v) => setDepartmentId(String(v))} style={styles.input}>
              <Picker.Item label="Unassigned" value="" />
              {departments.map((d) => (
                <Picker.Item key={d.id} label={d.name} value={String(d.id)} />
              ))}
            </Picker>
            <Picker
              enabled={!!departmentId}
              selectedValue={userId}
              onValueChange={(v) => setUserId(String(v))}
              style={styles.input}
            >
              <Picker.Item label="Unassigned" value="" />
              {employees.map((u) => (
                <Picker.Item key={u.id} label={u.name} value={String(u.id)} />
              ))}
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Serial Number"
              value={serialNumber}
              onChangeText={setSerialNumber}
            />
            <TextInput
              style={styles.input}
              placeholder="Model"
              value={model}
              onChangeText={setModel}
            />
            <Picker selectedValue={status} onValueChange={setStatus} style={styles.input}>
              <Picker.Item label="New" value="new" />
              <Picker.Item label="In Use" value="in-use" />
              <Picker.Item label="Active" value="active" />
              <Picker.Item label="Under Repair" value="under-repair" />
              <Picker.Item label="Decommissioned" value="decommissioned" />
            </Picker>
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
                <Text
                  style={[styles.modalButtonText, styles.modalButtonTextPrimary]}
                >
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  deviceType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#232323',
  },
  deviceModel: {
    fontSize: 14,
    color: '#232323',
  },
  deviceSerial: {
    fontSize: 12,
    color: '#232323',
  },
  deviceMeta: {
    fontSize: 12,
    color: '#6b7280',
  },
  deviceStatus: {
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
});
