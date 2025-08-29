// =====================================
// components/dashboard/StatsHeader.js - FULLY FIXED VERSION
// =====================================
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from '../common/Icon';
import { styles } from '../../styles/dashboard';
import { getModeConfig } from '../../utils/theme';

const { width } = Dimensions.get('window');

const StatsHeader = ({ 
  totalSavings = 0, 
  periodTotal = 0, 
  chartView = 'weekly',
  totalSpending = 0,
  appMode = 'savings',
  theme 
}) => {
  const [activeView, setActiveView] = useState(0);
  const scrollViewRef = useRef(null);
  const config = getModeConfig(appMode);
  const currentTotal = appMode === 'savings' ? totalSavings : totalSpending;

  const getPeriodLabel = () => {
    switch(chartView) {
      case 'weekly': return 'Son 7 Gün';
      case 'monthly': return 'Son 30 Gün';
      case 'yearly': return 'Son 12 Ay';
      default: return 'Dönem';
    }
  };

  const netSavings = totalSavings - totalSpending;

  const handleSlide = (index) => {
    setActiveView(index);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * (width - 32),
        animated: true,
      });
    }
  };

  const handleScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const slideWidth = width - 32;
    const index = Math.round(scrollX / slideWidth);
    if (index !== activeView) {
      setActiveView(index);
    }
  };

  return (
    <View style={styles.header}>
      {/* Tab Indicators */}
      <View style={styles.tabIndicators}>
        <TouchableOpacity 
          style={[styles.tabIndicator, activeView === 0 && styles.activeTabIndicator]}
          onPress={() => handleSlide(0)}
        >
          <View style={[styles.tabIndicatorDot, activeView === 0 && styles.activeTabIndicatorDot]} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabIndicator, activeView === 1 && styles.activeTabIndicator]}
          onPress={() => handleSlide(1)}
        >
          <View style={[styles.tabIndicatorDot, activeView === 1 && styles.activeTabIndicatorDot]} />
        </TouchableOpacity>
      </View>

      {/* Sliding Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.slidingContent}
      >
        {/* SAVINGS VIEW */}
        <View style={[styles.headerSlide, { width: width - 32 }]}>
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

        {/* SPENDING VIEW */}
        <View style={[styles.headerSlide, { width: width - 32 }]}>
          <View style={styles.headerTitle}>
            <Text style={styles.title}>Harcama Takibi</Text>
            <Icon name="card" size={24} color="#ef4444" />
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Toplam Harcama</Text>
              <Text style={[styles.statValue, { color: '#ef4444' }]}>
                {totalSpending.toFixed(2)} ₺
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Net Tasarruf</Text>
              <Text style={[
                styles.statValue, 
                { color: netSavings >= 0 ? '#10b981' : '#ef4444' }
              ]}>
                {netSavings >= 0 ? '+' : ''}{netSavings.toFixed(2)} ₺
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default StatsHeader;