import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from '../context/LanguageContext';
import { Cartridge } from '../interfaces/Cartridge';
import {
  getCartridges,
  createCartridge,
  updateCartridge,
  deleteCartridge,
  issueCartridge,
} from '../services/cartridges';
import {
  getCartridgeHistory,
  getCartridgeStatistics,
} from '../services/cartridgeHistory';
import {
  CartridgeHistoryEntry,
  CartridgeStatistic,
} from '../interfaces/CartridgeHistory';

type HistoryTab = 'received' | 'issued' | 'statistics';

const historyTabs: { key: HistoryTab; labelKey: string }[] = [
  { key: 'received', labelKey: 'screens.cartridges.historyTabs.received' },
  { key: 'issued', labelKey: 'screens.cartridges.historyTabs.issued' },
  { key: 'statistics', labelKey: 'screens.cartridges.historyTabs.statistics' },
];

const extractErrorMessage = (err: any, fallback: string) => {
  const message = err?.response?.data?.message || err?.message || fallback;
  return Array.isArray(message) ? message.join('\n') : message;
};

const CartridgesScreen = () => {
  const [cartridges, setCartridges] = useState<Cartridge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [issueModalVisible, setIssueModalVisible] = useState(false);
  const [editingCartridge, setEditingCartridge] = useState<Cartridge | null>(null);
  const [selectedCartridge, setSelectedCartridge] = useState<Cartridge | null>(null);
  const [formModel, setFormModel] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formQuantity, setFormQuantity] = useState('1');
  const [issueQuantity, setIssueQuantity] = useState('1');
  const [issueNote, setIssueNote] = useState('');
  const [historyTab, setHistoryTab] = useState<HistoryTab>('received');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyEntries, setHistoryEntries] = useState<CartridgeHistoryEntry[]>([]);
  const [statistics, setStatistics] = useState<CartridgeStatistic[]>([]);
  const { t } = useTranslation();

  const loadCartridges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCartridges();
      setCartridges(data);
    } catch (err: any) {
      setError(extractErrorMessage(err, t('screens.cartridges.alerts.unableToLoad')));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadHistory = useCallback(async (tab: HistoryTab) => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      if (tab === 'statistics') {
        const data = await getCartridgeStatistics();
        setStatistics(data);
      } else {
        const data = await getCartridgeHistory(tab);
        setHistoryEntries(data);
      }
    } catch (err: any) {
      setHistoryError(extractErrorMessage(err, t('screens.cartridges.alerts.unableToLoadHistory')));
    } finally {
      setHistoryLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadCartridges();
  }, [loadCartridges]);

  useEffect(() => {
    loadHistory(historyTab);
  }, [historyTab, loadHistory]);

  const openAddModal = () => {
    setEditingCartridge(null);
    setFormModel('');
    setFormDescription('');
    setFormQuantity('1');
    setFormModalVisible(true);
  };

  const openEditModal = (cartridge: Cartridge) => {
    setEditingCartridge(cartridge);
    setFormModel(cartridge.model);
    setFormDescription(cartridge.description || '');
    setFormQuantity('1');
    setFormModalVisible(true);
  };

  const submitForm = async () => {
    if (!formModel.trim()) {
      Alert.alert(t('common.validation'), t('screens.cartridges.alerts.modelRequired'));
      return;
    }

    if (!editingCartridge) {
      const quantityNumber = Number(formQuantity);
      if (!quantityNumber || quantityNumber <= 0) {
        Alert.alert(t('common.validation'), t('screens.cartridges.alerts.quantityPositive'));
        return;
      }
      try {
        await createCartridge({
          model: formModel.trim(),
          description: formDescription.trim() || undefined,
          quantity: quantityNumber,
        });
        setFormModalVisible(false);
        loadCartridges();
        if (historyTab === 'received') {
          loadHistory('received');
        }
      } catch (err: any) {
        Alert.alert(
          t('common.error'),
          extractErrorMessage(err, t('screens.cartridges.alerts.unableToSave')),
        );
      }
    } else {
      try {
        await updateCartridge(editingCartridge.id, {
          model: formModel.trim(),
          description: formDescription.trim() || undefined,
        });
        setFormModalVisible(false);
        setEditingCartridge(null);
        loadCartridges();
      } catch (err: any) {
        Alert.alert(
          t('common.error'),
          extractErrorMessage(err, t('screens.cartridges.alerts.unableToUpdate')),
        );
      }
    }
  };

  const confirmDelete = (cartridge: Cartridge) => {
    Alert.alert(
      t('screens.cartridges.alerts.deleteTitle'),
      t('screens.cartridges.alerts.deleteMessage'),
      [
        { text: t('screens.cartridges.buttons.cancel'), style: 'cancel' },
        {
          text: t('screens.cartridges.buttons.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCartridge(cartridge.id);
              loadCartridges();
            } catch (err: any) {
              Alert.alert(
                t('common.error'),
                extractErrorMessage(err, t('screens.cartridges.alerts.unableToDelete')),
              );
            }
          },
        },
      ],
    );
  };

  const openIssueModal = (cartridge: Cartridge) => {
    setSelectedCartridge(cartridge);
    setIssueQuantity('1');
    setIssueNote('');
    setIssueModalVisible(true);
  };

  const submitIssue = async () => {
    const quantityNumber = Number(issueQuantity);
    if (!quantityNumber || quantityNumber <= 0) {
      Alert.alert(t('common.validation'), t('screens.cartridges.alerts.quantityPositive'));
      return;
    }
    if (!issueNote.trim()) {
      Alert.alert(t('common.validation'), t('screens.cartridges.alerts.noteRequired'));
      return;
    }

    if (!selectedCartridge) return;

    try {
      await issueCartridge({
        cartridgeId: selectedCartridge.id,
        quantity: quantityNumber,
        note: issueNote.trim(),
      });
      setIssueModalVisible(false);
      setSelectedCartridge(null);
      loadCartridges();
      loadHistory(historyTab);
    } catch (err: any) {
      Alert.alert(
        t('common.error'),
        extractErrorMessage(err, t('screens.cartridges.alerts.unableToIssue')),
      );
    }
  };

  const renderCartridge = ({ item }: { item: Cartridge }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.model}</Text>
        <Text style={styles.cardStock}>{t('screens.cartridges.cardStock', { count: item.stock })}</Text>
      </View>
      {item.description ? <Text style={styles.cardDescription}>{item.description}</Text> : null}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => openEditModal(item)}>
          <Text style={styles.secondaryButtonText}>{t('screens.cartridges.buttons.edit')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => openIssueModal(item)}>
          <Text style={styles.secondaryButtonText}>{t('screens.cartridges.buttons.issue')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item)}>
          <Text style={styles.deleteButtonText}>{t('screens.cartridges.buttons.delete')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHistoryContent = () => {
    if (historyLoading) {
      return <ActivityIndicator style={styles.historyLoading} />;
    }

    if (historyError) {
      return <Text style={styles.errorText}>{historyError}</Text>;
    }

    if (historyTab === 'statistics') {
      if (!statistics.length) {
        return <Text style={styles.emptyText}>{t('screens.cartridges.history.noStatistics')}</Text>;
      }
      return (
        <View>
          {statistics.map((stat) => (
            <View key={stat.cartridgeId} style={styles.historyItem}>
              <Text style={styles.historyTitle}>{stat.model}</Text>
              <Text>{t('screens.cartridges.history.totalIssued', { count: stat.totalIssued })}</Text>
              <Text>{t('screens.cartridges.history.timesIssued', { count: stat.issueCount })}</Text>
            </View>
          ))}
        </View>
      );
    }

    if (!historyEntries.length) {
      return <Text style={styles.emptyText}>{t('screens.cartridges.history.noRecords')}</Text>;
    }

    return (
      <View>
        {historyEntries.map((entry) => (
          <View key={entry.id} style={styles.historyItem}>
            <Text style={styles.historyTitle}>
              {entry.cartridge?.model ?? t('screens.cartridges.history.unknownCartridge')}
            </Text>
            <Text>
              {t('screens.cartridges.history.quantity', {
                sign: t(`screens.cartridges.history.prefix.${historyTab}`),
                quantity: entry.quantity,
              })}
            </Text>
            {historyTab === 'issued' && entry.note ? (
              <Text>{t('screens.cartridges.history.reason', { reason: entry.note })}</Text>
            ) : null}
            <Text>{new Date(entry.createdAt).toLocaleString()}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>{t('screens.cartridges.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={loadCartridges}>
          <Text style={styles.primaryButtonText}>{t('common.actions.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('screens.cartridges.title')}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={openAddModal}>
          <Text style={styles.primaryButtonText}>{t('screens.cartridges.addButton')}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={cartridges}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCartridge}
        ListEmptyComponent={<Text style={styles.emptyText}>{t('screens.cartridges.empty')}</Text>}
        contentContainerStyle={cartridges.length ? undefined : styles.emptyList}
      />
      <View style={styles.historySection}>
        <Text style={styles.subtitle}>{t('screens.cartridges.historyTitle')}</Text>
        <View style={styles.tabRow}>
          {historyTabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, historyTab === tab.key && styles.activeTabButton]}
              onPress={() => setHistoryTab(tab.key)}
            >
              <Text
                style={[styles.tabButtonText, historyTab === tab.key && styles.activeTabButtonText]}
              >
                {t(tab.labelKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {renderHistoryContent()}
      </View>

      <Modal visible={formModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCartridge
                ? t('screens.cartridges.modals.form.titleEdit')
                : t('screens.cartridges.modals.form.titleAdd')}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('screens.cartridges.modals.form.modelPlaceholder')}
              value={formModel}
              onChangeText={setFormModel}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder={t('screens.cartridges.modals.form.descriptionPlaceholder')}
              value={formDescription}
              onChangeText={setFormDescription}
              multiline
            />
            {!editingCartridge && (
              <TextInput
                style={styles.input}
                placeholder={t('screens.cartridges.modals.form.quantityPlaceholder')}
                keyboardType="number-pad"
                value={formQuantity}
                onChangeText={setFormQuantity}
              />
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setFormModalVisible(false);
                  setEditingCartridge(null);
                }}
              >
                <Text style={styles.secondaryButtonText}>{t('screens.cartridges.buttons.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={submitForm}>
                <Text style={styles.primaryButtonText}>{t('screens.cartridges.buttons.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={issueModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedCartridge
                ? t('screens.cartridges.modals.issue.title', { model: selectedCartridge.model })
                : t('screens.cartridges.modals.issue.titleGeneric')}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('screens.cartridges.modals.issue.quantityPlaceholder')}
              keyboardType="number-pad"
              value={issueQuantity}
              onChangeText={setIssueQuantity}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder={t('screens.cartridges.modals.issue.notePlaceholder')}
              value={issueNote}
              onChangeText={setIssueNote}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setIssueModalVisible(false);
                  setSelectedCartridge(null);
                }}
              >
                <Text style={styles.secondaryButtonText}>{t('screens.cartridges.buttons.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={submitIssue}>
                <Text style={styles.primaryButtonText}>
                  {t('screens.cartridges.modals.issue.submit')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
  },
  errorText: {
    color: '#d00',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 8,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#1677ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardStock: {
    fontSize: 14,
    color: '#333',
  },
  cardDescription: {
    marginTop: 6,
    color: '#444',
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  secondaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1677ff',
  },
  secondaryButtonText: {
    color: '#1677ff',
    fontWeight: '500',
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ff4d4f',
  },
  deleteButtonText: {
    color: '#ff4d4f',
    fontWeight: '500',
  },
  historySection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1677ff',
    marginRight: 8,
  },
  activeTabButton: {
    backgroundColor: '#1677ff',
  },
  tabButtonText: {
    color: '#1677ff',
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: '#fff',
  },
  historyLoading: {
    marginTop: 12,
  },
  historyItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
  historyTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
});

export default CartridgesScreen;

