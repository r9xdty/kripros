// =====================================
// components/modals/CalendarDayModal.js - FIXED VERSION
// =====================================
import React from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import Icon from '../common/Icon';
import { formatDate } from '../../utils/dateUtils';  // ✅ FIXED: formatDate is in dateUtils.js
import { getDayTotal } from '../../utils/savingsUtils';  // ✅ getDayTotal is in savingsUtils.js
import { styles } from '../../styles/modals';

const CalendarDayModal = ({
  visible,
  onClose,
  selectedDate,
  savings,
  dailySavings,
  setDailySavings
}) => {
  
  const handleAddToDate = (savingId) => {
    const saving = savings.find(s => s.id === savingId);
    const dateStr = formatDate(selectedDate);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    if (selectedDate > todayEnd) {
      Alert.alert('Hata', 'Gelecek tarihe tasarruf ekleyemezsiniz!');
      return;
    }
    
    const newDailySavings = { ...dailySavings };
    if (!newDailySavings[dateStr]) {
      newDailySavings[dateStr] = [];
    }
    
    newDailySavings[dateStr].push({
      ...saving,
      addedAt: new Date().toISOString(),
      uniqueId: Date.now() + Math.random(),
      action: 'added'
    });
    
    setDailySavings(newDailySavings);
    onClose();
  };

  const handleRemoveFromDate = (dateStr, uniqueId) => {
    const newDailySavings = { ...dailySavings };
    if (newDailySavings[dateStr]) {
      const removedSaving = newDailySavings[dateStr].find(s => s.uniqueId === uniqueId);
      
      newDailySavings[dateStr] = newDailySavings[dateStr].filter(s => s.uniqueId !== uniqueId);
      if (newDailySavings[dateStr].length === 0) {
        delete newDailySavings[dateStr];
      }
      
      if (removedSaving) {
        const removalRecord = {
          ...removedSaving,
          action: 'removed',
          removedAt: new Date().toISOString(),
          uniqueId: Date.now() + Math.random()
        };
        
        if (!newDailySavings[dateStr + '_removed']) {
          newDailySavings[dateStr + '_removed'] = [];
        }
        newDailySavings[dateStr + '_removed'].push(removalRecord);
      }
    }
    setDailySavings(newDailySavings);
  };

  if (!selectedDate) return null;

  const dateStr = formatDate(selectedDate);
  const daySavings = dailySavings[dateStr] || [];
  const dayTotal = getDayTotal(selectedDate, dailySavings);

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
          <Text style={styles.modalTitle}>
            {selectedDate?.toLocaleDateString('tr-TR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.modalContent}>
          <View style={styles.dayTotalContainer}>
            <Text style={styles.dayTotalLabel}>Bu günkü tasarruf</Text>
            <Text style={styles.dayTotalAmount}>
              {dayTotal.toFixed(2)} ₺
            </Text>
          </View>
          
          {daySavings.length > 0 && (
            <View style={styles.daySavingsContainer}>
              <Text style={styles.daySavingsTitle}>Bu gün eklenen tasarruflar:</Text>
              <FlatList
                data={daySavings}
                keyExtractor={(item, index) => item.uniqueId?.toString() || index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.daySavingItem}>
                    <View style={styles.daySavingItemLeft}>
                      <Text style={styles.daySavingItemName}>{item.name}</Text>
                      <Text style={styles.daySavingItemAmount}>{item.amount} ₺</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeDaySavingButton}
                      onPress={() => handleRemoveFromDate(dateStr, item.uniqueId)}
                    >
                      <Icon name="close" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                )}
                style={styles.daySavingsList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
          
          <View style={styles.addSavingSection}>
            <Text style={styles.addSavingSectionTitle}>Tasarruf Ekle:</Text>
            {savings.length === 0 ? (
              <View style={styles.noSavingsContainer}>
                <Text style={styles.noSavingsText}>
                  Önce "Tasarruf Ekle" butonundan tasarruf türleri oluşturun
                </Text>
              </View>
            ) : (
              <FlatList
                data={savings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.addSavingOption}
                    onPress={() => handleAddToDate(item.id)}
                  >
                    <Text style={styles.addSavingOptionName}>{item.name}</Text>
                    <Text style={styles.addSavingOptionAmount}>{item.amount} ₺</Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default CalendarDayModal;