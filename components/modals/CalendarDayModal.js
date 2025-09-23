// =====================================
// components/modals/CalendarDayModal.js - MULTIPLE ADD SUPPORT
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
import { getDaySpendingTotal } from '../../utils/spendingUtils';
import { getRecommendedSavings, FREQUENCY_LABELS } from '../../utils/recommendationUtils';
import { styles } from '../../styles/modals';

const CalendarDayModal = ({
  visible,
  onClose,
  selectedDate,
  savings,
  dailySavings,
  setDailySavings,
  appMode = 'savings',
  theme,
  dailySpending,
  setDailySpending,
  onAddSpending
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [addedToday, setAddedToday] = useState(new Set()); // Track what was added in this session
  
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
  
  // Reset added items when modal opens/closes
  useEffect(() => {
    if (!visible) {
      setAddedToday(new Set());
    }
  }, [visible]);
  
  useEffect(() => {
    if (selectedDate && visible && appMode === 'savings') {
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
    
    // Create unique instance with timestamp
    const addedItem = {
      ...item,
      uniqueId: Date.now() + Math.random(), // Ensure unique ID
      action: 'added',
      addedAt: new Date().toISOString()
    };
    
    newDailyData[dateStr].push(addedItem);
    setCurrentDailyData(newDailyData);
    
    // Track this addition for visual feedback
    setAddedToday(prev => new Set([...prev, item.id]));
    
    // Show success feedback
    Alert.alert(
      'Başarılı',
      `${item.name} bu güne eklendi!`,
      [{ text: 'Tamam' }],
      { cancelable: true }
    );
  };
  
  const handleRemoveFromDate = (uniqueId) => {
    Alert.alert(
      'Sil',
      'Bu kaydı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            const dateStr = formatDate(selectedDate);
            const newDailyData = { ...currentDailyData };
            
            if (newDailyData[dateStr]) {
              newDailyData[dateStr] = newDailyData[dateStr].filter(item => item.uniqueId !== uniqueId);
              if (newDailyData[dateStr].length === 0) {
                delete newDailyData[dateStr];
              }
              setCurrentDailyData(newDailyData);
            }
          }
        }
      ]
    );
  };

  const handleAddSpendingPress = () => {
    if (onAddSpending) {
      onClose();
      setTimeout(() => {
        onAddSpending(selectedDate);
      }, 300);
    }
  };
  
  if (!selectedDate) return null;
  
  const dateStr = formatDate(selectedDate);
  const dayItems = currentDailyData[dateStr] || [];
  const dayTotal = appMode === 'savings' 
    ? getDayTotal(selectedDate, currentDailyData)
    : getDaySpendingTotal(selectedDate, currentDailyData);
  
  // Don't filter out already added items - allow multiple additions
  const regularItems = savings || [];

  const iconColor = appMode === 'savings' ? '#10b981' : '#ef4444';
  const totalColor = appMode === 'savings' ? '#10b981' : '#ef4444';

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
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {selectedDate.toLocaleDateString('tr-TR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                weekday: 'long'
              })}
            </Text>
            <View style={{ width: 40 }} />
          </View>
          
          {/* Day Total Card */}
          <View style={[styles.dayTotalCard, { 
            backgroundColor: appMode === 'savings' ? '#f0fdf4' : '#fef2f2',
            borderColor: appMode === 'savings' ? '#86efac' : '#fca5a5',
          }]}>
            <Icon name={appMode === 'savings' ? 'wallet' : 'card'} size={24} color={iconColor} />
            <View style={styles.dayTotalInfo}>
              <Text style={styles.dayTotalLabel}>
                Günlük {itemLabelCapital} Toplamı
              </Text>
              <Text style={[styles.dayTotalAmount, { color: totalColor }]}>
                {appMode === 'savings' ? '+' : '-'}{dayTotal.toFixed(2)} ₺
              </Text>
            </View>
          </View>
          
          <ScrollView 
            style={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* ADD SPENDING BUTTON FOR SPENDING MODE */}
            {appMode === 'spending' && (
              <TouchableOpacity 
                style={styles.addSpendingButton}
                onPress={handleAddSpendingPress}
              >
                <Icon name="add-circle" size={24} color="#fff" />
                <Text style={styles.addSpendingButtonText}>Harcama Ekle</Text>
              </TouchableOpacity>
            )}
            
            {/* Day's Items */}
            {dayItems.length > 0 && (
              <View style={styles.daySavingsContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Bugünün {itemLabel}ları</Text>
                  <Text style={styles.sectionCount}>{dayItems.length} kayıt</Text>
                </View>
                {dayItems.map((item, index) => (
                  <View key={item.uniqueId || `${item.id}-${index}`} style={styles.daySavingCard}>
                    <View style={styles.daySavingInfo}>
                      <Text style={styles.daySavingName}>{item.name}</Text>
                      <View style={styles.daySavingMeta}>
                        <Text style={[styles.daySavingAmount, { color: totalColor }]}>
                          {appMode === 'savings' ? '+' : '-'}{item.amount} ₺
                        </Text>
                        {item.addedAt && (
                          <Text style={styles.daySavingTime}>
                            {new Date(item.addedAt).toLocaleTimeString('tr-TR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </Text>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveFromDate(item.uniqueId)}
                    >
                      <Icon name="trash" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            
            {/* Recommendations - Only for savings mode */}
            {appMode === 'savings' && recommendations.length > 0 && (
              <View style={styles.recommendationsContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Önerilen Tasarruflar</Text>
                  <Icon name="sparkles" size={16} color="#fbbf24" />
                </View>
                {recommendations.map(rec => (
                  <TouchableOpacity
                    key={rec.id}
                    style={[styles.recommendationCard, addedToday.has(rec.id) && styles.addedCard]}
                    onPress={() => handleAddToDate(rec)}
                  >
                    <View style={styles.recommendationInfo}>
                      <Text style={styles.recommendationName}>{rec.name}</Text>
                      <View style={styles.frequencyBadge}>
                        <Text style={styles.frequencyBadgeText}>
                          {FREQUENCY_LABELS[rec.frequency]}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.recommendationRight}>
                      <Text style={styles.recommendationAmount}>+{rec.amount} ₺</Text>
                      {addedToday.has(rec.id) ? (
                        <Icon name="checkmark-circle" size={20} color="#10b981" />
                      ) : (
                        <View style={styles.addButton}>
                          <Icon name="add" size={18} color="#10b981" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {/* All Savings - Only for savings mode */}
            {appMode === 'savings' && regularItems.length > 0 && (
              <View style={styles.allSavingsContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Tüm Tasarruflar</Text>
                  <Text style={styles.sectionCount}>{regularItems.length} öğe</Text>
                </View>
                {regularItems.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.savingCard, addedToday.has(item.id) && styles.addedCard]}
                    onPress={() => handleAddToDate(item)}
                  >
                    <View style={styles.savingOptionInfo}>
                      <Text style={styles.savingOptionName}>{item.name}</Text>
                      <Text style={styles.savingOptionFrequency}>
                        {FREQUENCY_LABELS[item.frequency]}
                      </Text>
                    </View>
                    <View style={styles.savingOptionRight}>
                      <Text style={styles.savingOptionAmount}>+{item.amount} ₺</Text>
                      {addedToday.has(item.id) ? (
                        <Icon name="checkmark-done" size={16} color="#10b981" />
                      ) : (
                        <Icon name="add-circle-outline" size={20} color="#10b981" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {/* Empty state */}
            {dayItems.length === 0 && appMode === 'savings' && regularItems.length === 0 && (
              <View style={styles.emptyStateContainer}>
                <View style={styles.emptyStateIcon}>
                  <Icon name="wallet-outline" size={48} color="#d1d5db" />
                </View>
                <Text style={styles.emptyStateText}>
                  Henüz tasarruf tanımlanmamış
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Ana sayfadan tasarruf ekleyebilirsiniz
                </Text>
              </View>
            )}

            {dayItems.length === 0 && appMode === 'spending' && (
              <View style={styles.emptyStateContainer}>
                <View style={styles.emptyStateIcon}>
                  <Icon name="card-outline" size={48} color="#d1d5db" />
                </View>
                <Text style={styles.emptyStateText}>
                  Bu güne henüz harcama eklenmemiş
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Yukarıdaki butona tıklayarak başlayın
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