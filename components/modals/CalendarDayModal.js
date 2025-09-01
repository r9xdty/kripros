// =====================================
// components/modals/CalendarDayModal.js - FIXED FOR BOTH MODES
// =====================================
import React, { useState, useEffect } from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  BackHandler
} from 'react-native';
import Icon from '../common/Icon';
import { formatDate } from '../../utils/dateUtils';
import { getDayTotal } from '../../utils/savingsUtils';
import { getRecommendedSavings, FREQUENCY_LABELS } from '../../utils/recommendationUtils';
import { styles } from '../../styles/modals';

const CalendarDayModal = ({
  visible,
  onClose,
  selectedDate,
  savings,
  dailySavings,
  setDailySavings,
  appMode = 'savings',  // Add default value
  theme,
  dailySpending,        // Add for spending mode
  setDailySpending      // Add for spending mode
}) => {
  const [recommendations, setRecommendations] = useState([]);
  
  // Determine which data to use based on mode
  const currentDailyData = appMode === 'savings' ? dailySavings : (dailySpending || {});
  const setCurrentDailyData = appMode === 'savings' ? setDailySavings : (setDailySpending || setDailySavings);
  const itemLabel = appMode === 'savings' ? 'tasarruf' : 'harcama';
  const itemLabelCapital = appMode === 'savings' ? 'Tasarruf' : 'Harcama';
  
  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [visible, onClose]);
  
  useEffect(() => {
    if (selectedDate && visible && appMode === 'savings') {
      // Only get recommendations for savings mode
      const recs = getRecommendedSavings(savings || [], currentDailyData || {}, selectedDate);
      setRecommendations(recs);
    } else {
      setRecommendations([]);
    }
  }, [selectedDate, visible, savings, currentDailyData, appMode]);
  
  const handleAddToDate = (item) => {
    const dateStr = formatDate(selectedDate);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    if (selectedDate > todayEnd) {
      Alert.alert('Hata', `Gelecek tarihe ${itemLabel} ekleyemezsiniz!`);
      return;
    }
    
    const newDailyData = { ...currentDailyData };
    if (!newDailyData[dateStr]) {
      newDailyData[dateStr] = [];
    }
    
    const newItem = {
      ...item,
      addedAt: new Date().toISOString(),
      uniqueId: Date.now() + Math.random(),
      action: 'added'
    };
    
    newDailyData[dateStr].push(newItem);
    setCurrentDailyData(newDailyData);
    
    // Show quick success message
    Alert.alert(
      '✓ Eklendi', 
      `${item.name} başarıyla eklendi!`,
      [{ text: 'Tamam', style: 'default' }],
      { cancelable: true }
    );
  };

  const handleRemoveFromDate = (dateStr, uniqueId) => {
    Alert.alert(
      'Kaldır',
      `Bu ${itemLabel}u kaldırmak istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Kaldır', 
          style: 'destructive',
          onPress: () => {
            const newDailyData = { ...currentDailyData };
            if (newDailyData[dateStr]) {
              const removedItem = newDailyData[dateStr].find(s => s.uniqueId === uniqueId);
              
              newDailyData[dateStr] = newDailyData[dateStr].filter(s => s.uniqueId !== uniqueId);
              if (newDailyData[dateStr].length === 0) {
                delete newDailyData[dateStr];
              }
              
              if (removedItem) {
                const removalRecord = {
                  ...removedItem,
                  action: 'removed',
                  removedAt: new Date().toISOString(),
                  uniqueId: Date.now() + Math.random()
                };
                
                if (!newDailyData[dateStr + '_removed']) {
                  newDailyData[dateStr + '_removed'] = [];
                }
                newDailyData[dateStr + '_removed'].push(removalRecord);
              }
            }
            setCurrentDailyData(newDailyData);
          }
        }
      ]
    );
  };

  if (!selectedDate) return null;

  const dateStr = formatDate(selectedDate);
  const dayItems = currentDailyData[dateStr] || [];
  const dayTotal = getDayTotal(selectedDate, currentDailyData);
  
  // For spending mode, we don't have predefined items like savings
  // So we skip the recommendations section
  const recommendedIds = recommendations.map(r => r.id);
  const regularItems = appMode === 'savings' 
    ? (savings || []).filter(s => !recommendedIds.includes(s.id))
    : [];

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
          style={{ flex: 1 }}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {selectedDate?.toLocaleDateString('tr-TR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </Text>
            <View style={{ width: 40 }} />
          </View>
          
          <ScrollView 
            style={styles.modalContent} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Total for the day */}
            <View style={styles.dayTotalContainer}>
              <Text style={styles.dayTotalLabel}>Bu günkü {itemLabel}</Text>
              <Text style={[
                styles.dayTotalAmount,
                { color: appMode === 'savings' ? '#10b981' : '#ef4444' }
              ]}>
                {dayTotal.toFixed(2)} ₺
              </Text>
            </View>
            
            {/* Already added items */}
            {dayItems.length > 0 && (
              <View style={styles.daySavingsContainer}>
                <Text style={styles.daySavingsTitle}>
                  Bu gün eklenen {itemLabel}lar:
                </Text>
                <ScrollView style={{ maxHeight: 200 }}>
                  {dayItems.map((item, index) => (
                    <View key={item.uniqueId || index} style={styles.daySavingItem}>
                      <View style={styles.daySavingInfo}>
                        <Text style={styles.daySavingName}>{item.name}</Text>
                        <Text style={[
                          styles.daySavingAmount,
                          { color: appMode === 'savings' ? '#10b981' : '#ef4444' }
                        ]}>
                          {item.amount} ₺
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveFromDate(dateStr, item.uniqueId)}
                      >
                        <Icon name="trash" size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
            
            {/* Recommendations - Only for savings mode */}
            {appMode === 'savings' && recommendations.length > 0 && (
              <View style={styles.recommendationsContainer}>
                <Text style={styles.recommendationsTitle}>Önerilen {itemLabel}lar:</Text>
                {recommendations.map(rec => (
                  <TouchableOpacity
                    key={rec.id}
                    style={[styles.recommendationItem, rec.addedToday && styles.recommendationItemAdded]}
                    onPress={() => !rec.addedToday && handleAddToDate(rec)}
                    disabled={rec.addedToday}
                  >
                    <View style={styles.recommendationInfo}>
                      <Text style={[
                        styles.recommendationName,
                        rec.addedToday && styles.recommendationNameAdded
                      ]}>
                        {rec.name}
                      </Text>
                      <Text style={styles.recommendationFrequency}>
                        {FREQUENCY_LABELS[rec.frequency]} • {rec.reason}
                      </Text>
                    </View>
                    <View style={styles.recommendationRight}>
                      <Text style={[
                        styles.recommendationAmount,
                        rec.addedToday && styles.recommendationAmountAdded
                      ]}>
                        {rec.amount} ₺
                      </Text>
                      {rec.addedToday ? (
                        <Icon name="checkmark" size={20} color="#10b981" />
                      ) : (
                        <TouchableOpacity
                          style={styles.addRecommendationButton}
                          onPress={() => handleAddToDate(rec)}
                        >
                          <Icon name="add" size={20} color="#fff" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {/* Regular items - Only for savings mode */}
            {appMode === 'savings' && regularItems.length > 0 && (
              <View style={styles.allSavingsContainer}>
                <Text style={styles.allSavingsTitle}>Tüm {itemLabel}lar:</Text>
                {regularItems.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.savingOption}
                    onPress={() => handleAddToDate(item)}
                  >
                    <View style={styles.savingOptionInfo}>
                      <Text style={styles.savingOptionName}>{item.name}</Text>
                      <Text style={styles.savingOptionFrequency}>
                        {FREQUENCY_LABELS[item.frequency]}
                      </Text>
                    </View>
                    <Text style={styles.savingOptionAmount}>{item.amount} ₺</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {/* Empty state for spending mode */}
            {appMode === 'spending' && dayItems.length === 0 && (
              <View style={styles.emptyStateContainer}>
                <Icon name="card" size={48} color="#d1d5db" />
                <Text style={styles.emptyStateText}>
                  Bu gün için henüz harcama eklenmemiş
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Ana sayfadan harcama ekleyebilirsiniz
                </Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default CalendarDayModal;