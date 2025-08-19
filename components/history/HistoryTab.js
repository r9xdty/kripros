// =====================================
// src/components/history/HistoryTab.js
// =====================================
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import Icon from '../common/Icon';
import HistoryItem from './HistoryItem';
import { getSavingsHistory } from '../../utils/savingsUtils';
import { styles } from '../../styles/history';

const HistoryTab = ({ dailySavings }) => {
  const savingsHistory = getSavingsHistory(dailySavings);

  if (savingsHistory.length === 0) {
    return (
      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Icon name="time" size={20} color="#8b5cf6" />
          <Text style={styles.historyTitle}>Tasarruf Geçmişi</Text>
        </View>
        <View style={styles.emptyHistory}>
          <Icon name="time" size={48} color="#d1d5db" />
          <Text style={styles.emptyHistoryText}>Henüz tasarruf geçmişi bulunmuyor</Text>
          <Text style={styles.emptyHistorySubtext}>Tasarruf eklemeye başlayın!</Text>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      ListHeaderComponent={() => (
        <View style={styles.historyHeader}>
          <Icon name="time" size={20} color="#8b5cf6" />
          <Text style={styles.historyTitle}>Tasarruf Geçmişi</Text>
        </View>
      )}
      data={savingsHistory}
      keyExtractor={(item, index) => `${item.date}-${item.uniqueId || index}`}
      renderItem={({ item }) => <HistoryItem item={item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
      style={{ backgroundColor: '#f8f9ff' }}
    />
  );
};

export default HistoryTab;