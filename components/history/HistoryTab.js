// =====================================
// src/components/history/HistoryTab.js - FIXED VERSION
// =====================================
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import Icon from '../common/Icon';
import HistoryItem from './HistoryItem';
import { getSavingsHistory } from '../../utils/savingsUtils';
import { getSpendingHistory } from '../../utils/spendingUtils';
import { styles } from '../../styles/history';

const HistoryTab = ({ dailySavings, dailySpending, appMode, theme }) => {
  // Use appropriate history based on app mode
  const history = appMode === 'savings' 
    ? getSavingsHistory(dailySavings || {})
    : getSpendingHistory(dailySpending || {});
  
  const title = appMode === 'savings' ? 'Tasarruf Geçmişi' : 'Harcama Geçmişi';
  const emptyText = appMode === 'savings' 
    ? 'Henüz tasarruf geçmişi bulunmuyor'
    : 'Henüz harcama geçmişi bulunmuyor';
  const emptySubtext = appMode === 'savings'
    ? 'Tasarruf eklemeye başlayın!'
    : 'Harcama eklemeye başlayın!';
  const iconColor = appMode === 'savings' ? '#8b5cf6' : '#ef4444';

  if (history.length === 0) {
    return (
      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Icon name="time" size={20} color={iconColor} />
          <Text style={styles.historyTitle}>{title}</Text>
        </View>
        <View style={styles.emptyHistory}>
          <Icon name="time" size={48} color="#d1d5db" />
          <Text style={styles.emptyHistoryText}>{emptyText}</Text>
          <Text style={styles.emptyHistorySubtext}>{emptySubtext}</Text>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      ListHeaderComponent={() => (
        <View style={styles.historyHeader}>
          <Icon name="time" size={20} color={iconColor} />
          <Text style={styles.historyTitle}>{title}</Text>
        </View>
      )}
      data={history}
      keyExtractor={(item, index) => `${item.date}-${item.uniqueId || item.id || index}`}
      renderItem={({ item }) => <HistoryItem item={item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
      style={{ backgroundColor: '#f8f9ff' }}
    />
  );
};

export default HistoryTab;