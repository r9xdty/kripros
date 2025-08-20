// =====================================
// components/calendar/WeeklyBreakdown.js - NEW COMPONENT
// =====================================
import React from 'react';
import { View, Text } from 'react-native';
import { getWeeklyBreakdown } from '../../utils/savingsUtils';
import { styles } from '../../styles/calendar';

const WeeklyBreakdown = ({ dailySavings, weekStart, weekEnd }) => {
  const breakdown = getWeeklyBreakdown(dailySavings, weekStart, weekEnd);
  const totalSavings = breakdown.reduce((sum, item) => sum + item.amount, 0);
  
  // Find max for percentage calculation
  const maxAmount = Math.max(...breakdown.map(item => item.amount));
  
  // Format date range
  const formatDateRange = () => {
    const startDay = weekStart.getDate();
    const startMonth = weekStart.toLocaleDateString('tr-TR', { month: 'short' });
    const endDay = weekEnd.getDate();
    const endMonth = weekEnd.toLocaleDateString('tr-TR', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${startMonth}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  };
  
  // Get circle size based on percentage
  const getCircleSize = (amount) => {
    if (maxAmount === 0) return 40;
    const percentage = (amount / maxAmount);
    return 40 + (percentage * 30); // 40 to 70 size range
  };
  
  // Get color intensity based on amount
  const getCircleColor = (amount) => {
    if (amount === 0) return '#e5e7eb';
    if (amount < totalSavings * 0.3) return '#bbf7d0';
    if (amount < totalSavings * 0.6) return '#86efac';
    return '#10b981';
  };
  
  return (
    <View style={styles.weeklyBreakdownContainer}>
      <View style={styles.weeklyBreakdownHeader}>
        <Text style={styles.weeklyBreakdownTitle}>Haftalık Özet</Text>
        <Text style={styles.weeklyBreakdownDate}>{formatDateRange()}</Text>
      </View>
      
      <View style={styles.weeklyBreakdownChart}>
        {breakdown.map((item, index) => {
          const circleSize = getCircleSize(item.amount);
          const circleColor = getCircleColor(item.amount);
          
          return (
            <View key={index} style={styles.dayBreakdownContainer}>
              <View style={[
                styles.dayCircle,
                {
                  width: circleSize,
                  height: circleSize,
                  backgroundColor: circleColor,
                }
              ]}>
                <Text style={styles.dayCircleAmount}>
                  {item.amount > 0 ? `${item.amount.toFixed(0)}₺` : '0'}
                </Text>
              </View>
              <Text style={styles.dayLabel}>{item.dayName}</Text>
              {item.items.length > 0 && (
                <Text style={styles.dayItemCount}>{item.items.length} tasarruf</Text>
              )}
            </View>
          );
        })}
      </View>
      
      <View style={styles.weeklyBreakdownFooter}>
        <Text style={styles.weeklyTotal}>Haftalık Toplam:</Text>
        <Text style={styles.weeklyTotalAmount}>{totalSavings.toFixed(2)} ₺</Text>
      </View>
      
      {/* Top savings of the week */}
      {breakdown.some(day => day.items.length > 0) && (
        <View style={styles.topSavingsContainer}>
          <Text style={styles.topSavingsTitle}>En Çok Tasarruf Edilen:</Text>
          {breakdown
            .flatMap(day => day.items)
            .reduce((acc, item) => {
              const existing = acc.find(i => i.name === item.name);
              if (existing) {
                existing.count++;
                existing.total += item.amount;
              } else {
                acc.push({ name: item.name, count: 1, total: item.amount });
              }
              return acc;
            }, [])
            .sort((a, b) => b.total - a.total)
            .slice(0, 3)
            .map((item, index) => (
              <View key={index} style={styles.topSavingItem}>
                <Text style={styles.topSavingName}>
                  {index + 1}. {item.name}
                </Text>
                <Text style={styles.topSavingAmount}>
                  {item.count}x = {item.total.toFixed(0)}₺
                </Text>
              </View>
            ))}
        </View>
      )}
    </View>
  );
};

export default WeeklyBreakdown;