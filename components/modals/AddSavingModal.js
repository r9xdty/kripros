// =====================================
// components/modals/AddSavingModal.js - UPDATED
// =====================================
import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Icon from '../common/Icon';
import { FREQUENCY_TYPES, FREQUENCY_LABELS } from '../../utils/recommendationUtils';
import { styles } from '../../styles/modals';

const AddSavingModal = ({ visible, onClose, savings, setSavings }) => {
  const [newSaving, setNewSaving] = useState({ 
    name: '', 
    amount: '',
    frequency: FREQUENCY_TYPES.DAILY 
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddSaving = () => {
    setErrorMessage('');
    
    if (!newSaving.name.trim()) {
      setErrorMessage('Lütfen tasarruf adını girin!');
      return;
    }
    
    if (!newSaving.amount.trim()) {
      setErrorMessage('Lütfen tutarı girin!');
      return;
    }
    
    const amount = parseFloat(newSaving.amount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage('Lütfen geçerli bir tutar girin!');
      return;
    }
    
    const saving = {
      id: Date.now(),
      name: newSaving.name.trim(),
      amount: amount,
      frequency: newSaving.frequency,
      createdAt: new Date().toISOString()
    };
    
    setSavings([...savings, saving]);
    setNewSaving({ name: '', amount: '', frequency: FREQUENCY_TYPES.DAILY });
    setErrorMessage('');
    onClose();
  };

  const handleClose = () => {
    setNewSaving({ name: '', amount: '', frequency: FREQUENCY_TYPES.DAILY });
    setErrorMessage('');
    onClose();
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
            onPress={handleClose}
          >
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Tasarruf Ekle</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tasarruf Adı</Text>
            <TextInput
              style={styles.textInput}
              value={newSaving.name}
              onChangeText={(text) => setNewSaving({ ...newSaving, name: text })}
              placeholder="Örn: Kahve almadım"
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tutar (₺)</Text>
            <TextInput
              style={styles.textInput}
              value={newSaving.amount}
              onChangeText={(text) => setNewSaving({ ...newSaving, amount: text })}
              placeholder="45"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ne Sıklıkla Alıyorsunuz?</Text>
            <View style={styles.frequencyContainer}>
              {Object.entries(FREQUENCY_TYPES).map(([key, value]) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.frequencyButton,
                    newSaving.frequency === value && styles.frequencyButtonActive
                  ]}
                  onPress={() => setNewSaving({ ...newSaving, frequency: value })}
                >
                  <Text style={[
                    styles.frequencyButtonText,
                    newSaving.frequency === value && styles.frequencyButtonTextActive
                  ]}>
                    {FREQUENCY_LABELS[value]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}
          
          <TouchableOpacity style={styles.saveButton} onPress={handleAddSaving}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default AddSavingModal;