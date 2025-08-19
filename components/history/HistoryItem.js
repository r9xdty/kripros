// =====================================
// src/components/history/HistoryItem.js
// =====================================
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/history';

const HistoryItem = ({ item }) => {
  return (
    <View style={[
      styles.historyItem,
      item.action === 'removed' && styles.removedHistoryItem
    ]}>
      <View style={styles.historyItemHeader}>
        <Text style={[
          styles.historyItemName,
          item.action === 'removed' && styles.removedText
        ]}>
          {item.name}
        </Text>
        <View style={styles.historyItemRight}>
          {item.action === 'removed' && (
            <View style={styles.removedBadge}>
              <Text style={styles.removedBadgeText}>Kaldırıldı</Text>
            </View>
          )}
          <Text style={[
            styles.historyItemAmount,
            item.action === 'removed' ? styles.removedAmount : styles.addedAmount
          ]}>
            {item.action === 'removed' ? '-' : ''}{item.amount} ₺
          </Text>
        </View>
      </View>
      <View style={styles.historyItemFooter}>
        <Text style={styles.historyItemDate}>
          {item.displayDate} • {item.displayTime}
        </Text>
      </View>
    </View>
  );
};

export default HistoryItem;