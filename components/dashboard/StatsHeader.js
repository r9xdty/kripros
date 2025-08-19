// =====================================
// src/components/dashboard/StatsHeader.js
// =====================================
import React from 'react';
import { View, Text } from 'react-native';
import Icon from '../common/Icon';
import { styles } from '../../styles/dashboard';

const StatsHeader = ({ totalSavings, periodTotal, chartView }) => {
  const getPeriodLabel = () => {
    switch(chartView) {
      case 'weekly': return 'Haftalık';
      case 'monthly': return 'Aylık';
      case 'yearly': return 'Yıllık';
      default: return 'Haftalık';
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerTitle}>
        <Text style={styles.title}>Tasarruf Takipçim</Text>
        <Icon name="wallet" size={24} color="#10b981" />
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Toplam Tasarruf</Text>
          <Text style={styles.statValue}>{totalSavings.toFixed(2)} ₺</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>{getPeriodLabel()} Tasarruf</Text>
          <Text style={[styles.statValue, { color: '#3b82f6' }]}>
            {periodTotal.toFixed(2)} ₺
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StatsHeader;