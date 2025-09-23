// =====================================
// components/modals/AddSpendingModal.js - SIMPLIFIED VERSION
// =====================================
import React, { useState, useEffect } from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  BackHandler
} from 'react-native';
import Icon from '../common/Icon';
import { formatDate } from '../../utils/dateUtils';
import { styles } from '../../styles/modals';

const AddSpendingModal = ({
  visible,
  onClose,
  selectedDate = new Date(),
  dailySpending,
  setDailySpending
}) => {
  const [spendingName, setSpendingName] = useState('');
  const [spendingAmount, setSpendingAmount] = useState('');

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        handleClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [visible]);

  const resetForm = () => {
    setSpendingName('');
    setSpendingAmount('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    // Validation
    if (!spendingName.trim()) {
      Alert.alert('Hata', 'Lütfen harcama adını girin!');
      return;
    }

    if (!spendingAmount.trim()) {
      Alert.alert('Hata', 'Lütfen tutarı girin!');
      return;
    }

    const amount = parseFloat(spendingAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir tutar girin!');
      return;
    }

    // Check if selected date is in the future
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selectedDate > today) {
      Alert.alert('Hata', 'Gelecek tarihe harcama ekleyemezsiniz!');
      return;
    }

    // Add spending to daily spending
    const dateStr = formatDate(selectedDate);
    const newDailySpending = { ...dailySpending };
    
    if (!newDailySpending[dateStr]) {
      newDailySpending[dateStr] = [];
    }

    const newSpending = {
      name: spendingName.trim(),
      amount: amount,
      id: Date.now() + Math.random(),
      uniqueId: Date.now() + Math.random(),
      addedAt: new Date().toISOString(),
      action: 'added',
      type: 'spending'
    };

    newDailySpending[dateStr].push(newSpending);
    setDailySpending(newDailySpending);

    Alert.alert(
      'Başarılı',
      'Harcama başarıyla eklendi!',
      [{ text: 'Tamam', onPress: handleClose }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContent}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Harcama Ekle</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView 
            style={styles.modalContent}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Date Display */}
            <View style={[styles.dateDisplayCard, { backgroundColor: '#fef2f2' }]}>
              <Icon name="calendar" size={20} color="#ef4444" />
              <Text style={[styles.dateDisplayText, { color: '#dc2626' }]}>
                {selectedDate.toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </Text>
            </View>

            {/* Spending Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ne için harcama yaptınız?</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Örn: Market alışverişi"
                placeholderTextColor="#9ca3af"
                value={spendingName}
                onChangeText={setSpendingName}
                maxLength={50}
              />
            </View>

            {/* Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tutar (₺)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0"
                placeholderTextColor="#9ca3af"
                value={spendingAmount}
                onChangeText={setSpendingAmount}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            {/* Quick Amount Buttons */}
            <View style={styles.quickAmountContainer}>
              <Text style={styles.quickAmountLabel}>Hızlı Tutarlar:</Text>
              <View style={styles.quickAmountButtons}>
                {[50, 100, 200, 500].map(amount => (
                  <TouchableOpacity
                    key={amount}
                    style={[styles.quickAmountButton, { borderColor: '#ef4444' }]}
                    onPress={() => setSpendingAmount(amount.toString())}
                  >
                    <Text style={[styles.quickAmountButtonText, { color: '#ef4444' }]}>
                      {amount}₺
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: '#ef4444' }]} 
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Harcama Ekle</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default AddSpendingModal;