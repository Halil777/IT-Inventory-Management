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
  getDevices,
  createDevice,
  updateDevice,
  deleteDevice,
} from '../api';

interface Device {
  id: number;
  type: { id: number; name: string };
  user?: { id: number; name: string } | null;
  department?: { id: number; name: string } | null;
  status: string;
}

export default function DevicesScreen(): JSX.Element {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [typeId, setTypeId] = useState('');
  const [userId, setUserId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [status, setStatus] = useState('');
  const [editing, setEditing] = useState<Device | null>(null);

  const load = (): void => {
    setLoading(true);
    getDevices()
      .then((data) => setDevices(data || []))
      .catch((err) => console.error('Failed to load devices', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = (): void => {
    setEditing(null);
    setTypeId('');
    setUserId('');
    setDepartmentId('');
    setStatus('');
    setModalVisible(true);
  };

  const openEdit = (dev: Device): void => {
    setEditing(dev);
    setTypeId(dev.type.id ? String(dev.type.id) : '');
    setUserId(dev.user?.id ? String(dev.user.id) : '');
    setDepartmentId(dev.department?.id ? String(dev.department.id) : '');
    setStatus(dev.status);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Devices</Text>
        <TouchableOpacity style={styles.addButton} onPress={openNew}>
          <Feather name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {loading && <Text style={styles.loading}>Loading...</Text>}
        {!loading &&
          devices.map((dev) => (
            <View key={dev.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.deviceType}>{dev.type.name}</Text>
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
            <TextInput
              placeholder="Type ID"
              value={typeId}
              onChangeText={setTypeId}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="User ID"
              value={userId}
              onChangeText={setUserId}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Department ID"
              value={departmentId}
              onChangeText={setDepartmentId}
              keyboardType="numeric"
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
});
