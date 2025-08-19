// =====================================
// components/modals/CalendarDayModal.js - UPDATED WITH RECOMMENDATIONS
// =====================================
import React from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView
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
  
  // Get recommendations
  const recommendations = getRecommendedSavings(savings, dailySavings, selectedDate);
  const nonRecommendedSavings = savings.filter(
    s => !recommendations.find(r => r.id === s.id)
  );

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
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.dayTotalContainer}>
            <Text style={styles.dayTotalLabel}>Bu günkü tasarruf</Text>
            <Text style={styles.dayTotalAmount}>
              {dayTotal.toFixed(2)} ₺
            </Text>
          </View>
          
          {daySavings.length > 0 && (
            <View style={styles.daySavingsContainer}>
              <Text style={styles.daySavingsTitle}>Bu gün eklenen tasarruflar:</Text>
              {daySavings.map((item, index) => (
                <View key={item.uniqueId?.toString() || index.toString()} style={styles.daySavingItem}>
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
              ))}
            </View>
          )}
          
          {/* Recommended Savings Section */}
          {recommendations.length > 0 && (
            <View style={styles.recommendedSection}>
              <View style={styles.recommendedHeader}>
                <Text style={styles.recommendedTitle}>🎯 Önerilen Tasarruflar</Text>
              </View>
              {recommendations.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.recommendedItem}
                  onPress={() => handleAddToDate(item.id)}
                >
                  <View style={styles.recommendedItemLeft}>
                    <Text style={styles.recommendedItemName}>{item.name}</Text>
                    <View style={styles.recommendedItemDetails}>
                      <Text style={styles.recommendedItemAmount}>{item.amount} ₺</Text>
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
          
          {/* Other Savings Section */}
          <View style={styles.addSavingSection}>
            <Text style={styles.addSavingSectionTitle}>
              {recommendations.length > 0 ? 'Diğer Tasarruflar:' : 'Tasarruf Ekle:'}
            </Text>
            {nonRecommendedSavings.length === 0 && recommendations.length === 0 ? (
              <View style={styles.noSavingsContainer}>
                <Text style={styles.noSavingsText}>
                  Önce "Tasarruf Ekle" butonundan tasarruf türleri oluşturun
                </Text>
              </View>
            ) : (
              nonRecommendedSavings.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.addSavingOption}
                  onPress={() => handleAddToDate(item.id)}
                >
                  <View style={styles.savingOptionLeft}>
                    <Text style={styles.addSavingOptionName}>{item.name}</Text>
                    {item.frequency && (
                      <Text style={styles.savingOptionFrequency}>
                        {FREQUENCY_LABELS[item.frequency]}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.addSavingOptionAmount}>{item.amount} ₺</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default CalendarDayModal;