// =====================================
// components/calendar/WeeklyPieChart.js - WITHOUT SVG (Using Views)
// =====================================
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { getWeeklyPieData } from '../../utils/savingsUtils';
import { styles } from '../../styles/calendar';

const { width } = Dimensions.get('window');

const WeeklyPieChart = ({ dailySavings, weekStart, weekEnd }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  
  const pieData = getWeeklyPieData(dailySavings, weekStart, weekEnd);
  const totalSavings = pieData.reduce((sum, item) => sum + item.amount, 0);
  
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
  
  // Calculate percentages and angles
  let currentAngle = 0;
  const segments = pieData.map((item) => {
    const percentage = totalSavings > 0 ? (item.amount / totalSavings) : 0;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle: currentAngle,
      angle
    };
  });
  
  const handleLongPress = (item) => {
    setSelectedItem(item);
  };
  
  const handlePressOut = () => {
    setSelectedItem(null);
  };
  
  if (totalSavings === 0) {
    return (
      <View style={styles.weeklyChartContainer}>
        <View style={styles.weeklyChartHeader}>
          <Text style={styles.weeklyChartTitle}>Haftalık Özet</Text>
          <Text style={styles.weeklyChartDate}>{formatDateRange()}</Text>
        </View>
        <View style={styles.emptyChartContainer}>
          <Text style={styles.emptyChartText}>Bu hafta henüz tasarruf yok</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.weeklyChartContainer}>
      <View style={styles.weeklyChartHeader}>
        <Text style={styles.weeklyChartTitle}>Haftalık Özet</Text>
        <Text style={styles.weeklyChartDate}>{formatDateRange()}</Text>
      </View>
      
      {/* Pie Chart using Views */}
      <View style={styles.pieChartWrapper}>
        <View style={styles.pieChart}>
          {segments.map((segment, index) => {
            // Create pie slices using Views with rotation
            const rotation = segment.startAngle;
            const isLargeSlice = segment.angle > 180;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.pieSlice,
                  {
                    transform: [{ rotate: `${rotation}deg` }],
                    zIndex: segments.length - index,
                  }
                ]}
                onLongPress={() => handleLongPress(segment)}
                onPressOut={handlePressOut}
                activeOpacity={1}
                delayLongPress={200}
              >
                <View
                  style={[
                    styles.pieSliceInner,
                    {
                      backgroundColor: segment.color,
                      transform: [
                        { rotate: `${-rotation}deg` },
                        { rotate: `${segment.angle / 2}deg` }
                      ],
                    }
                  ]}
                >
                  {segment.angle > 30 && (
                    <Text style={styles.slicePercentage}>
                      {(segment.percentage * 100).toFixed(0)}%
                    </Text>
                  )}
                </View>
                {isLargeSlice && (
                  <View
                    style={[
                      styles.pieSliceOverflow,
                      { backgroundColor: segment.color }
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
          
          {/* Center circle for donut effect */}
          <View style={styles.pieCenter}>
            <Text style={styles.pieCenterLabel}>Toplam</Text>
            <Text style={styles.pieCenterAmount}>{totalSavings.toFixed(0)}₺</Text>
          </View>
        </View>
        
        {/* Tooltip */}
        {selectedItem && (
          <View style={styles.pieTooltip}>
            <Text style={styles.pieTooltipName}>{selectedItem.name}</Text>
            <Text style={styles.pieTooltipAmount}>{selectedItem.amount.toFixed(0)}₺</Text>
          </View>
        )}
      </View>
      
      {/* Legend */}
      <View style={styles.legendContainer}>
        {segments.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.legendItem}
            onLongPress={() => setSelectedItem(item)}
            onPressOut={() => setSelectedItem(null)}
            delayLongPress={200}
          >
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.legendAmount}>
              {item.amount.toFixed(0)}₺
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Top Items Summary */}
      <View style={styles.topItemsContainer}>
        <Text style={styles.topItemsTitle}>En Çok Tasarruf:</Text>
        {segments.slice(0, 3).map((item, index) => (
          <View key={index} style={styles.topItem}>
            <View style={styles.topItemRank}>
              <Text style={styles.topItemRankText}>{index + 1}</Text>
            </View>
            <Text style={styles.topItemName}>{item.name}</Text>
            <Text style={styles.topItemAmount}>
              {item.count}x = {item.amount.toFixed(0)}₺
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default WeeklyPieChart;