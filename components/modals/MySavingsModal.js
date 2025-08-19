// =====================================
// components/modals/MySavingsModal.js - UPDATED WITH FREQUENCY
// =====================================
import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView
} from 'react-native';
import Icon from '../common/Icon';
import { FREQUENCY_TYPES, FREQUENCY_LABELS } from '../../utils/recommendationUtils';
import { styles } from '../../styles/modals';

const MySavingsModal = ({
  visible,
  onClose,
  savings,
  setSavings,
  dailySavings,
  setDailySavings,
  editingId,
  setEditingId,
  editingItem,
  setEditingItem
}) => {
  
  const handleEditSaving = (id) => {
    const saving = savings.find(s => s.id === id);
    setEditingId(id);
    setEditingItem({ 
      name: saving.name, 
      amount: saving.amount.toString(),
      frequency: saving.frequency || FREQUENCY_TYPES.DAILY
    });
  };

  const handleSaveEdit = () => {
    if (!editingItem.name.trim() || !editingItem.amount.trim()) {
      return;
    }
    
    const amount = parseFloat(editingItem.amount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }
    
    setSavings(savings.map(s => 
      s.id === editingId 
        ? { 
            ...s, 
            name: editingItem.name.trim(), 
            amount: amount,
            frequency: editingItem.frequency 
          }
        : s
    ));
    setEditingId(null);
    setEditingItem({ name: '', amount: '', frequency: FREQUENCY_TYPES.DAILY });
  };

  const handleDeleteSaving = (id) => {
    Alert.alert(
      'Tasarrufu Sil',
      'Bu tasarrufu silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: () => {
          setSavings(savings.filter(s => s.id !== id));
          const updatedDailySavings = { ...dailySavings };
          Object.keys(updatedDailySavings).forEach(date => {
            if (!date.includes('_removed')) {
              updatedDailySavings[date] = updatedDailySavings[date].filter(s => s.id !== id);
              if (updatedDailySavings[date].length === 0) {
                delete updatedDailySavings[date];
              }
            }
          });
          setDailySavings(updatedDailySavings);
        }}
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={onClose}
          >
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Tasarruflarım</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView style={styles.modalContent}>
          {savings.length === 0 ? (
            <View style={styles.emptySavings}>
              <Icon name="wallet" size={48} color="#d1d5db" />
              <Text style={styles.emptySavingsText}>Henüz tasarruf eklenmemiş</Text>
            </View>
          ) : (
            savings.map((item) => (
              <View key={item.id.toString()} style={styles.savingItem}>
                {editingId === item.id ? (
                  <View style={styles.editingContainer}>
                    <TextInput
                      style={styles.editInput}
                      value={editingItem.name}
                      onChangeText={(text) => setEditingItem({ ...editingItem, name: text })}
                      placeholder="Tasarruf adı"
                    />
                    <TextInput
                      style={styles.editInput}
                      value={editingItem.amount}
                      onChangeText={(text) => setEditingItem({ ...editingItem, amount: text })}
                      placeholder="Tutar"
                      keyboardType="numeric"
                    />
                    <View style={styles.frequencyContainer}>
                      {Object.entries(FREQUENCY_TYPES).map(([key, value]) => (
                        <TouchableOpacity
                          key={value}
                          style={[
                            styles.frequencyButton,
                            editingItem.frequency === value && styles.frequencyButtonActive
                          ]}
                          onPress={() => setEditingItem({ ...editingItem, frequency: value })}
                        >
                          <Text style={[
                            styles.frequencyButtonText,
                            editingItem.frequency === value && styles.frequencyButtonTextActive
                          ]}>
                            {FREQUENCY_LABELS[value]}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={styles.editActions}>
                      <TouchableOpacity
                        style={styles.saveEditButton}
                        onPress={handleSaveEdit}
                      >
                        <Icon name="checkmark" size={16} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelEditButton}
                        onPress={() => setEditingId(null)}
                      >
                        <Icon name="close" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.savingItemContent}>
                    <View style={styles.savingItemLeft}>
                      <Text style={styles.savingItemName}>{item.name}</Text>
                      <Text style={styles.savingItemAmount}>{item.amount} ₺</Text>
                      {item.frequency && (
                        <Text style={styles.savingItemFrequency}>
                          {FREQUENCY_LABELS[item.frequency]}
                        </Text>
                      )}
                    </View>
                    <View style={styles.savingItemActions}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditSaving(item.id)}
                      >
                        <Icon name="pencil" size={16} color="#3b82f6" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteSaving(item.id)}
                      >
                        <Icon name="trash" size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default MySavingsModal;