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
  getCredentials,
  createCredential,
  updateCredential,
  deleteCredential,
} from '../api';

interface Credential {
  id: number;
  fullName: string;
  login: string;
  password: string;
}

export default function CredentialsScreen(): JSX.Element {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [editing, setEditing] = useState<Credential | null>(null);

  const load = (): void => {
    setLoading(true);
    getCredentials()
      .then((data) => setCredentials(data || []))
      .catch((err) => console.error('Failed to load credentials', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = (): void => {
    setEditing(null);
    setFullName('');
    setLogin('');
    setPassword('');
    setModalVisible(true);
  };

  const openEdit = (cred: Credential): void => {
    setEditing(cred);
    setFullName(cred.fullName);
    setLogin(cred.login);
    setPassword(cred.password);
    setModalVisible(true);
  };

  const save = async (): Promise<void> => {
    try {
      if (!fullName || !login || !password) {
        throw new Error('Missing fields');
      }
      const data = { fullName, login, password };
      if (editing) {
        await updateCredential(editing.id, data);
      } else {
        await createCredential(data);
      }
      setModalVisible(false);
      load();
    } catch (err) {
      console.error('Failed to save credential', err);
    }
  };

  const remove = (cred: Credential): void => {
    Alert.alert('Delete Credential', `Delete ${cred.login}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCredential(cred.id);
            load();
          } catch (err) {
            console.error('Failed to delete credential', err);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Credentials</Text>
        <TouchableOpacity style={styles.addButton} onPress={openNew}>
          <Feather name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {loading && <Text style={styles.loading}>Loading...</Text>}
        {!loading &&
          credentials.map((cred) => (
            <View key={cred.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.credName}>{cred.fullName}</Text>
                <Text style={styles.credLogin}>{cred.login}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => openEdit(cred)}
                >
                  <Feather name="edit-2" size={16} color="#2563eb" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => remove(cred)}
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
              {editing ? 'Edit Credential' : 'New Credential'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="Login"
              value={login}
              onChangeText={setLogin}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  credName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#232323',
  },
  credLogin: {
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
