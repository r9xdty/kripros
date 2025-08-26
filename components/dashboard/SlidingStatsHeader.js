// =====================================
// components/dashboard/SlidingStatsHeader.js - FINAL VERSION WITH WORKING BUTTONS
// =====================================
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from '../common/Icon';
import { styles } from '../../styles/dashboard';

const { width } = Dimensions.get('window');

const SlidingStatsHeader = ({ 
  totalSavings, 
  periodTotal, 
  chartView, 
  totalSpending = 0, 
  periodSpending = 0,
  onAddSaving,    // Now properly used
  onAddSpending   // Now properly used
}) => {
  const [activeView, setActiveView] = useState(0); // 0 = savings, 1 = spending
  const scrollViewRef = useRef(null);

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
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const handleScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / width);
    if (index !== activeView) {
      setActiveView(index);
    }
  };

  return (
    <View style={styles.slidingHeaderContainer}>
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
        <View style={[styles.headerSlide, { width }]}>
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
        <View style={[styles.headerSlide, { width }]}>
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

      {/* Quick Action Buttons - NOW WITH WORKING onPress */}
      <View style={styles.quickActions}>
        {activeView === 0 ? (
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={onAddSaving}  // FIXED: Actually calls the handler
          >
            <Icon name="add-circle" size={16} color="#10b981" />
            <Text style={styles.quickActionText}>Tasarruf Ekle</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={onAddSpending}  // FIXED: Actually calls the handler
          >
            <Icon name="remove-circle" size={16} color="#ef4444" />
            <Text style={styles.quickActionText}>Harcama Ekle</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => handleSlide(activeView === 0 ? 1 : 0)}
        >
          <Icon name="swap-horizontal" size={16} color="#6b7280" />
          <Text style={styles.quickActionText}>
            {activeView === 0 ? 'Harcama' : 'Tasarruf'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SlidingStatsHeader;