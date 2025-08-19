// =====================================
// src/components/modals/AddSavingModal.js
// =====================================
import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Icon from '../common/Icon';
import { styles } from '../../styles/modals';

const AddSavingModal = ({ visible, onClose, savings, setSavings }) => {
  const [newSaving, setNewSaving] = useState({ name: '', amount: '' });
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
      createdAt: new Date().toISOString()
    };
    
    setSavings([...savings, saving]);
    setNewSaving({ name: '', amount: '' });
    setErrorMessage('');
    onClose();
  };

  const handleClose = () => {
    setNewSaving({ name: '', amount: '' });
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
        
        <View style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tasarruf Adı</Text>
            <TextInput
              style={styles.textInput}
              value={newSaving.name}
              onChangeText={(text) => setNewSaving({ ...newSaving, name: text })}
              placeholder="Örn: Cips almadım"
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tutar (₺)</Text>
            <TextInput
              style={styles.textInput}
              value={newSaving.amount}
              onChangeText={(text) => setNewSaving({ ...newSaving, amount: text })}
              placeholder="250"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>
          
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}
          
          <TouchableOpacity style={styles.saveButton} onPress={handleAddSaving}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AddSavingModal;