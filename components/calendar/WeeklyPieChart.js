// =====================================
// components/calendar/WeeklyPieChart.js - FIXED WITH INTERACTIVE PIE
// =====================================
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path, G, Circle, Text as SvgText } from 'react-native-svg';
import { getWeeklyPieData } from '../../utils/savingsUtils';
import { styles } from '../../styles/calendar';

const { width } = Dimensions.get('window');
const CHART_SIZE = width - 100;
const CENTER_X = CHART_SIZE / 2;
const CENTER_Y = CHART_SIZE / 2;
const RADIUS = (CHART_SIZE / 2) - 20;
const INNER_RADIUS = RADIUS * 0.6;

const WeeklyPieChart = ({ dailySavings, weekStart, weekEnd }) => {
  const [selectedSlice, setSelectedSlice] = useState(null);
  
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
  
  // Calculate pie slices
  const createPieSlices = () => {
    if (totalSavings === 0) return [];
    
    let currentAngle = -90; // Start from top
    
    return pieData.map((item, index) => {
      const percentage = item.amount / totalSavings;
      const angle = percentage * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;
      
      // Convert to radians
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
      // Calculate coordinates
      const x1 = CENTER_X + RADIUS * Math.cos(startAngleRad);
      const y1 = CENTER_Y + RADIUS * Math.sin(startAngleRad);
      const x2 = CENTER_X + RADIUS * Math.cos(endAngleRad);
      const y2 = CENTER_Y + RADIUS * Math.sin(endAngleRad);
      
      const x3 = CENTER_X + INNER_RADIUS * Math.cos(startAngleRad);
      const y3 = CENTER_Y + INNER_RADIUS * Math.sin(startAngleRad);
      const x4 = CENTER_X + INNER_RADIUS * Math.cos(endAngleRad);
      const y4 = CENTER_Y + INNER_RADIUS * Math.sin(endAngleRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const pathData = [
        `M ${x3} ${y3}`,
        `L ${x1} ${y1}`,
        `A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${x4} ${y4}`,
        `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArcFlag} 0 ${x3} ${y3}`,
        'Z'
      ].join(' ');
      
      // Calculate label position
      const labelAngle = (startAngle + endAngle) / 2;
      const labelAngleRad = (labelAngle * Math.PI) / 180;
      const labelRadius = (RADIUS + INNER_RADIUS) / 2;
      const labelX = CENTER_X + labelRadius * Math.cos(labelAngleRad);
      const labelY = CENTER_Y + labelRadius * Math.sin(labelAngleRad);
      
      return {
        pathData,
        color: item.color,
        percentage,
        item,
        labelX,
        labelY,
        showLabel: angle > 20, // Only show label if slice is big enough
        index
      };
    });
  };
  
  const slices = createPieSlices();
  
  const handleSliceLongPress = (item) => {
    setSelectedSlice(item);
  };
  
  const handleSlicePressOut = () => {
    setSelectedSlice(null);
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
      
      {/* Pie Chart */}
      <View style={styles.pieChartWrapper}>
        <Svg width={CHART_SIZE} height={CHART_SIZE}>
          <G>
            {slices.map((slice) => (
              <Path
                key={slice.index}
                d={slice.pathData}
                fill={slice.color}
                stroke="#fff"
                strokeWidth="2"
                onLongPress={() => handleSliceLongPress(slice.item)}
                onPressOut={handleSlicePressOut}
                delayLongPress={100}
              />
            ))}
          </G>
          {slices.map((slice) => (
            slice.showLabel && (
              <SvgText
                key={`label-${slice.index}`}
                x={slice.labelX}
                y={slice.labelY}
                fill="#fff"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                pointerEvents="none"
              >
                {(slice.percentage * 100).toFixed(0)}%
              </SvgText>
            )
          ))}
        </Svg>
        
        {/* Center text */}
        <View style={styles.pieChartCenter} pointerEvents="none">
          <Text style={styles.pieCenterLabel}>Toplam</Text>
          <Text style={styles.pieCenterAmount}>{totalSavings.toFixed(0)}₺</Text>
        </View>
        
        {/* Interactive Tooltip */}
        {selectedSlice && (
          <View style={styles.pieTooltip} pointerEvents="none">
            <Text style={styles.pieTooltipName}>{selectedSlice.name}</Text>
            <Text style={styles.pieTooltipAmount}>{selectedSlice.amount.toFixed(0)}₺</Text>
          </View>
        )}
      </View>
      
      {/* Legend */}
      <View style={styles.legendContainer}>
        {pieData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.legendItem}
            onLongPress={() => handleSliceLongPress(item)}
            onPressOut={handleSlicePressOut}
            delayLongPress={100}
          >
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.legendAmount}>
              {item.amount.toFixed(0)}₺
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Top 3 Items - SHOWN ONLY ONCE */}
      {pieData.length > 0 && (
        <View style={styles.topItemsContainer}>
          <Text style={styles.topItemsTitle}>En Çok Tasarruf:</Text>
          {pieData.slice(0, 3).map((item, index) => (
            <View key={index} style={styles.topItem}>
              <View style={[styles.topItemRank, { backgroundColor: item.color }]}>
                <Text style={styles.topItemRankText}>{index + 1}</Text>
              </View>
              <Text style={styles.topItemName}>{item.name}</Text>
              <Text style={styles.topItemAmount}>
                {item.amount.toFixed(0)}₺
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default WeeklyPieChart;