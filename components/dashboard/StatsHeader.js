// =====================================
// components/dashboard/StatsHeader.js - SAVINGS ONLY VERSION
// =====================================
import React from 'react';
import { View, Text } from 'react-native';
import Icon from '../common/Icon';
import { styles } from '../../styles/dashboard';

const StatsHeader = ({ 
  totalSavings = 0, 
  periodTotal = 0, 
  chartView = 'weekly'
}) => {
  const getPeriodLabel = () => {
    switch(chartView) {
      case 'weekly': return 'Son 7 Gün';
      case 'monthly': return 'Son 30 Gün';
      case 'yearly': return 'Son 12 Ay';
      default: return 'Dönem';
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
          <Text style={styles.statLabel}>{getPeriodLabel()}</Text>
          <Text style={[styles.statValue, { color: '#3b82f6' }]}>
            {periodTotal.toFixed(2)} ₺
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StatsHeader;