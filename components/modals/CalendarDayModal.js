// =====================================
// components/modals/CalendarDayModal.js - ALL FIXES
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
  setDailySavings
}) => {
  const [recommendations, setRecommendations] = useState([]);
  
  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        onClose();
        return true; // Prevent default back behavior
      }
      return false;
    });

    return () => backHandler.remove();
  }, [visible, onClose]);
  
  useEffect(() => {
    if (selectedDate && visible) {
      // Get recommendations
      const recs = getRecommendedSavings(savings, dailySavings, selectedDate);
      setRecommendations(recs);
    }
  }, [selectedDate, visible, savings, dailySavings]);
  
  const handleAddToDate = (saving) => {
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
    
    const newSaving = {
      ...saving,
      addedAt: new Date().toISOString(),
      uniqueId: Date.now() + Math.random(),
      action: 'added'
    };
    
    newDailySavings[dateStr].push(newSaving);
    setDailySavings(newDailySavings);
    
    // Show quick success message
    Alert.alert(
      '✓ Eklendi', 
      `${saving.name} başarıyla eklendi!`,
      [{ text: 'Tamam', style: 'default' }],
      { cancelable: true }
    );
  };

  const handleRemoveFromDate = (dateStr, uniqueId) => {
    Alert.alert(
      'Kaldır',
      'Bu tasarrufu kaldırmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Kaldır', 
          style: 'destructive',
          onPress: () => {
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
          }
        }
      ]
    );
  };

  if (!selectedDate) return null;

  const dateStr = formatDate(selectedDate);
  const daySavings = dailySavings[dateStr] || [];
  const dayTotal = getDayTotal(selectedDate, dailySavings);
  
  // Separate recommended and regular savings
  const recommendedIds = recommendations.map(r => r.id);
  const regularSavings = savings.filter(s => !recommendedIds.includes(s.id));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose} // Android back button
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
            contentContainerStyle={{ paddingBottom: 100 }} // Extra padding for bottom
          >
            {/* Total for the day */}
            <View style={styles.dayTotalContainer}>
              <Text style={styles.dayTotalLabel}>Bu günkü tasarruf</Text>
              <Text style={styles.dayTotalAmount}>
                {dayTotal.toFixed(2)} ₺
              </Text>
            </View>
            
            {/* Already added savings */}
            {daySavings.length > 0 && (
              <View style={styles.daySavingsContainer}>
                <Text style={styles.daySavingsTitle}>Bu gün eklenen tasarruflar:</Text>
                <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                  {daySavings.map((item) => (
                    <View key={item.uniqueId?.toString()} style={styles.daySavingItem}>
                      <View style={styles.daySavingItemLeft}>
                        <Text style={styles.daySavingItemName}>{item.name}</Text>
                        <Text style={styles.daySavingItemAmount}>{item.amount} ₺</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.removeDaySavingButton}
                        onPress={() => handleRemoveFromDate(dateStr, item.uniqueId)}
                      >
                        <Text style={styles.removeButtonText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
            
            {/* Recommended Savings */}
            {recommendations.length > 0 && (
              <View style={styles.recommendedSection}>
                <View style={styles.recommendedHeader}>
                  <Text style={styles.recommendedTitle}>🎯 Önerilen Tasarruflar</Text>
                  <Text style={styles.recommendedSubtitle}>Alışkanlıklarınıza göre</Text>
                </View>
                {recommendations.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.recommendedItem}
                    onPress={() => handleAddToDate(item)}
                  >
                    <View style={styles.recommendedItemLeft}>
                      <Text style={styles.recommendedItemName}>{item.name}</Text>
                      <View style={styles.recommendedItemDetails}>
                        <Text style={styles.recommendedItemAmount}>
                          {item.amount} ₺
                        </Text>
                        {item.frequency && (
                          <View style={styles.frequencyBadge}>
                            <Text style={styles.frequencyBadgeText}>
                              {FREQUENCY_LABELS[item.frequency]}
                            </Text>
                          </View>
                        )}
                      </View>
                      {item.reason && (
                        <Text style={styles.recommendedReason}>{item.reason}</Text>
                      )}
                    </View>
                    <View style={styles.recommendedItemRight}>
                      <View style={styles.scoreIndicator}>
                        <Text style={styles.scoreText}>%{Math.round(item.score)}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {/* Regular Savings - CAN ADD MULTIPLE TIMES */}
            <View style={styles.addSavingSection}>
              <Text style={styles.addSavingSectionTitle}>
                {recommendations.length > 0 ? 'Diğer Tasarruflar:' : 'Tasarruf Ekle:'}
              </Text>
              {savings.length === 0 ? (
                <View style={styles.noSavingsContainer}>
                  <Text style={styles.noSavingsText}>
                    Önce "Tasarruf Ekle" butonundan tasarruf türleri oluşturun
                  </Text>
                </View>
              ) : (
                regularSavings.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.addSavingOption}
                    onPress={() => handleAddToDate(item)}
                  >
                    <View style={styles.savingOptionLeft}>
                      <Text style={styles.addSavingOptionName}>{item.name}</Text>
                      {item.frequency && (
                        <Text style={styles.savingOptionFrequency}>
                          {FREQUENCY_LABELS[item.frequency]}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.addSavingOptionAmount}>
                      {item.amount} ₺
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default CalendarDayModal;