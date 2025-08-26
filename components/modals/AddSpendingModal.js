// =====================================
// components/modals/AddSpendingModal.js - ADD SPENDING MODAL
// =====================================
import React, { useState } from 'react';
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
  Platform
} from 'react-native';
import Icon from '../common/Icon';
import { formatDate } from '../../utils/dateUtils';
import { getSpendingCategories, validateSpending } from '../../utils/spendingUtils';
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customCategory, setCustomCategory] = useState('');
  const [notes, setNotes] = useState('');

  const categories = getSpendingCategories();

  const resetForm = () => {
    setSpendingName('');
    setSpendingAmount('');
    setSelectedCategory(null);
    setCustomCategory('');
    setNotes('');
  };

  const handleSave = () => {
    // Check if selected date is in the future
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selectedDate > today) {
      Alert.alert('Hata', 'Gelecek tarihe harcama ekleyemezsiniz!');
      return;
    }

    const spending = {
      name: spendingName.trim(),
      amount: parseFloat(spendingAmount) || 0,
      category: selectedCategory || customCategory.trim(),
      notes: notes.trim(),
    };

    // Validate spending
    const errors = validateSpending(spending);
    if (errors.length > 0) {
      Alert.alert('Hata', errors.join('\n'));
      return;
    }

    // Add spending to daily spending
    const dateStr = formatDate(selectedDate);
    const newDailySpending = { ...dailySpending };
    
    if (!newDailySpending[dateStr]) {
      newDailySpending[dateStr] = [];
    }

    const newSpending = {
      ...spending,
      id: Date.now() + Math.random(), // Unique ID
      addedAt: new Date().toISOString(),
      uniqueId: Date.now() + Math.random(),
      action: 'added',
      type: 'spending' // Mark as spending
    };

    newDailySpending[dateStr].push(newSpending);
    setDailySpending(newDailySpending);

    Alert.alert(
      'Başarılı',
      'Harcama başarıyla eklendi!',
      [{ text: 'Tamam', onPress: () => { resetForm(); onClose(); } }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContent}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Harcama Ekle</Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Date Display */}
            <View style={styles.dateDisplay}>
              <Icon name="calendar" size={20} color="#3b82f6" />
              <Text style={styles.dateDisplayText}>
                {selectedDate ? selectedDate.toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : 'Tarih seçilmedi'}
              </Text>
            </View>

            {/* Spending Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Harcama Adı *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Örn: Kulaklık alımı"
                value={spendingName}
                onChangeText={setSpendingName}
                maxLength={50}
              />
            </View>

            {/* Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tutar (₺) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0.00"
                value={spendingAmount}
                onChangeText={setSpendingAmount}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kategori *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
                contentContainerStyle={styles.categoryContainer}
              >
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.name && styles.selectedCategoryButton,
                      { borderColor: category.color }
                    ]}
                    onPress={() => {
                      setSelectedCategory(category.name);
                      setCustomCategory('');
                    }}
                  >
                    <Icon name={category.icon} size={20} color={category.color} />
                    <Text style={[
                      styles.categoryButtonText,
                      selectedCategory === category.name && styles.selectedCategoryButtonText
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Custom Category */}
              <View style={styles.customCategoryContainer}>
                <Text style={styles.customCategoryLabel}>Veya özel kategori:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Özel kategori adı"
                  value={customCategory}
                  onChangeText={(text) => {
                    setCustomCategory(text);
                    if (text.trim()) setSelectedCategory(null);
                  }}
                  maxLength={30}
                />
              </View>
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notlar (Opsiyonel)</Text>
              <TextInput
                style={[styles.textInput, styles.notesInput]}
                placeholder="Ek notlar..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>

            {/* Quick Amount Buttons */}
            <View style={styles.quickAmountContainer}>
              <Text style={styles.inputLabel}>Hızlı Tutarlar</Text>
              <View style={styles.quickAmountButtons}>
                {[50, 100, 200, 500].map(amount => (
                  <TouchableOpacity
                    key={amount}
                    style={styles.quickAmountButton}
                    onPress={() => setSpendingAmount(amount.toString())}
                  >
                    <Text style={styles.quickAmountButtonText}>{amount}₺</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default AddSpendingModal;