import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ListItem from '../components/ListItem';
import { useTranslation } from '../context/LanguageContext';
import { Credential } from '../interfaces/Credential';
import {
  createCredential,
  CredentialInput,
  deleteCredential,
  getCredentials,
  updateCredential,
} from '../services/credentials';

interface CredentialFormState {
  fullName: string;
  login: string;
  password: string;
}

const emptyForm: CredentialFormState = {
  fullName: '',
  login: '',
  password: '',
};

const CredentialsScreen: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<CredentialFormState>(emptyForm);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { t } = useTranslation();

  const loadCredentials = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCredentials();
      setCredentials(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error && err.message
        ? err.message
        : t('screens.credentials.errors.load');
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadCredentials();
  }, [loadCredentials]);

  const resetForm = useCallback(() => {
    setForm(() => ({ ...emptyForm }));
    setSelectedId(null);
    setError(null);
    setShowPassword(false);
  }, []);

  const handleChange = useCallback(<K extends keyof CredentialFormState>(
    key: K,
    value: CredentialFormState[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const payload = useMemo<CredentialInput | null>(() => {
    const trimmedName = form.fullName.trim();
    const trimmedLogin = form.login.trim();
    const trimmedPassword = form.password.trim();

    if (!trimmedName || !trimmedLogin || (!selectedId && !trimmedPassword)) {
      return null;
    }

    return {
      fullName: trimmedName,
      login: trimmedLogin,
      password: trimmedPassword || form.password,
    };
  }, [form.fullName, form.login, form.password, selectedId]);

  const handleSubmit = useCallback(async () => {
    if (!payload) {
      setError(t('screens.credentials.errors.required'));
      return;
    }

    setSubmitting(true);
    try {
      if (selectedId) {
        const updatePayload = {
          ...payload,
          password: payload.password || undefined,
        };
        const updated = await updateCredential(selectedId, updatePayload);
        setCredentials((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await createCredential(payload);
        setCredentials((prev) => [...prev, created]);
      }
      setError(null);
      resetForm();
    } catch (err) {
      const message = err instanceof Error && err.message
        ? err.message
        : t('screens.credentials.errors.save');
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }, [payload, resetForm, selectedId, t]);

  const handleDelete = useCallback(async () => {
    if (!selectedId) {
      setError(t('screens.credentials.errors.selectForDelete'));
      return;
    }

    setSubmitting(true);
    try {
      await deleteCredential(selectedId);
      setCredentials((prev) => prev.filter((item) => item.id !== selectedId));
      setError(null);
      resetForm();
    } catch (err) {
      const message = err instanceof Error && err.message
        ? err.message
        : t('screens.credentials.errors.delete');
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }, [resetForm, selectedId, t]);

  const handleSelect = useCallback((credential: Credential) => {
    setSelectedId(credential.id);
    setForm({
      fullName: credential.fullName ?? '',
      login: credential.login ?? '',
      password: '',
    });
    setShowPassword(false);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>
          {selectedId ? t('screens.credentials.editTitle') : t('screens.credentials.addTitle')}
        </Text>
        <Text style={styles.helper}>{t('screens.credentials.helper')}</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          placeholder={t('screens.credentials.placeholders.fullName')}
          style={styles.input}
          value={form.fullName}
          onChangeText={(text) => handleChange('fullName', text)}
        />
        <TextInput
          placeholder={t('screens.credentials.placeholders.login')}
          style={styles.input}
          autoCapitalize="none"
          value={form.login}
          onChangeText={(text) => handleChange('login', text)}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder={
              selectedId
                ? t('screens.credentials.placeholders.passwordUpdate')
                : t('screens.credentials.placeholders.password')
            }
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={form.password}
            onChangeText={(text) => handleChange('password', text)}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.togglePasswordButton}
          >
            <Text style={styles.togglePasswordText}>
              {showPassword
                ? t('screens.credentials.togglePassword.hide')
                : t('screens.credentials.togglePassword.show')}
            </Text>
          </Pressable>
        </View>

        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button
              title={selectedId ? t('screens.credentials.buttons.update') : t('screens.credentials.buttons.create')}
              onPress={handleSubmit}
              disabled={submitting}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title={t('screens.credentials.buttons.reset')} onPress={resetForm} disabled={submitting} />
          </View>
        </View>

        {selectedId && (
          <View style={styles.deleteButton}>
            <Button
              color="#c1121f"
              title={t('screens.credentials.buttons.delete')}
              onPress={handleDelete}
              disabled={submitting}
            />
          </View>
        )}

        <Text style={[styles.heading, styles.listHeading]}>{t('screens.credentials.listTitle')}</Text>
        {loading ? (
          <ActivityIndicator style={styles.loading} />
        ) : credentials.length ? (
          credentials.map((credential) => (
            <ListItem
              key={credential.id}
              title={credential.fullName}
              details={[
                t('screens.credentials.details.login', { login: credential.login }),
                t('screens.credentials.details.password', { password: credential.password }),
              ]}
              onPress={submitting ? undefined : () => handleSelect(credential)}
              selected={credential.id === selectedId}
            />
          ))
        ) : (
          <Text style={styles.empty}>{t('screens.credentials.empty')}</Text>
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
  passwordContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d7de',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  togglePasswordButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  togglePasswordText: {
    color: '#0a66c2',
    fontWeight: '600',
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

export default CredentialsScreen;
