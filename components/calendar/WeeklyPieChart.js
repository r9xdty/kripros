// =====================================
// components/calendar/WeeklyPieChart.js - FIXED WITH INTERACTIVE PIE
// =====================================
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path, G, Circle, Text as SvgText, Line, Rect } from 'react-native-svg';
import { getWeeklyPieData } from '../../utils/savingsUtils';
import { styles } from '../../styles/calendar';

const { width } = Dimensions.get('window');
const CHART_SIZE = width - 60; // Increased size for external labels
const CENTER_X = CHART_SIZE / 2;
const CENTER_Y = CHART_SIZE / 2;
const RADIUS = (CHART_SIZE / 2) - 60; // More space for labels
const INNER_RADIUS = RADIUS * 0.6;

const WeeklyPieChart = ({ dailySavings, weekStart, weekEnd }) => {
  const [selectedSlice, setSelectedSlice] = useState(null);
  
  const pieData = getWeeklyPieData(dailySavings, weekStart, weekEnd);
  const totalSavings = pieData.reduce((sum, item) => sum + item.amount, 0);
  
  // Handle single item display - create a full circle for single items
  const displayData = pieData.length === 1 
    ? [{ ...pieData[0], forceFullCircle: true }]
    : pieData;
  
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
    
    return displayData.map((item, index) => {
      // For single item, create a full circle with a small gap
      const percentage = item.forceFullCircle ? 1 : item.amount / totalSavings;
      const angle = item.forceFullCircle ? 359.9 : percentage * 360; // Small gap for single item
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;
      
      // Check if this slice is selected for scaling
      const isSelected = selectedSlice && selectedSlice.name === item.name;
      const scale = isSelected ? 1.03 : 1; // Slightly smaller scale
      
      // Calculate offset for selected slice (pull it out)
      const midAngle = (startAngle + endAngle) / 2;
      const midAngleRad = (midAngle * Math.PI) / 180;
      const offsetX = isSelected ? 6 * Math.cos(midAngleRad) : 0;
      const offsetY = isSelected ? 6 * Math.sin(midAngleRad) : 0;
      
      // Convert to radians
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
      // Calculate coordinates with scale and offset
      const scaledRadius = RADIUS * scale;
      const scaledInnerRadius = INNER_RADIUS * scale;
      
      const x1 = CENTER_X + offsetX + scaledRadius * Math.cos(startAngleRad);
      const y1 = CENTER_Y + offsetY + scaledRadius * Math.sin(startAngleRad);
      const x2 = CENTER_X + offsetX + scaledRadius * Math.cos(endAngleRad);
      const y2 = CENTER_Y + offsetY + scaledRadius * Math.sin(endAngleRad);
      
      const x3 = CENTER_X + offsetX + scaledInnerRadius * Math.cos(startAngleRad);
      const y3 = CENTER_Y + offsetY + scaledInnerRadius * Math.sin(startAngleRad);
      const x4 = CENTER_X + offsetX + scaledInnerRadius * Math.cos(endAngleRad);
      const y4 = CENTER_Y + offsetY + scaledInnerRadius * Math.sin(endAngleRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const pathData = [
        `M ${x3} ${y3}`,
        `L ${x1} ${y1}`,
        `A ${scaledRadius} ${scaledRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${x4} ${y4}`,
        `A ${scaledInnerRadius} ${scaledInnerRadius} 0 ${largeArcFlag} 0 ${x3} ${y3}`,
        'Z'
      ].join(' ');
      
      // Calculate label position
      const labelAngle = (startAngle + endAngle) / 2;
      const labelAngleRad = (labelAngle * Math.PI) / 180;
      const labelRadius = (scaledRadius + scaledInnerRadius) / 2;
      const labelX = CENTER_X + offsetX + labelRadius * Math.cos(labelAngleRad);
      const labelY = CENTER_Y + offsetY + labelRadius * Math.sin(labelAngleRad);
      
      // Calculate external label position - keep within chart bounds
      const idealRadius = RADIUS + 35;
      const rawX = CENTER_X + idealRadius * Math.cos(midAngleRad);
      const rawY = CENTER_Y + idealRadius * Math.sin(midAngleRad);
      
      // Smart positioning to keep labels fully visible
      const labelBoxWidth = 90;
      const labelBoxHeight = 40;
      const padding = 8;
      
      // Calculate bounds
      const minX = labelBoxWidth/2 + padding;
      const maxX = CHART_SIZE - labelBoxWidth/2 - padding;
      const minY = labelBoxHeight/2 + padding;
      const maxY = CHART_SIZE - labelBoxHeight/2 - padding;
      
      // Constrain position
      const externalLabelX = Math.max(minX, Math.min(rawX, maxX));
      const externalLabelY = Math.max(minY, Math.min(rawY, maxY));
      
      // Arrow start position (at edge of selected slice)
      const arrowStartRadius = RADIUS + (isSelected ? 8 : 0);
      const arrowStartX = CENTER_X + arrowStartRadius * Math.cos(midAngleRad);
      const arrowStartY = CENTER_Y + arrowStartRadius * Math.sin(midAngleRad);
      
      return {
        pathData,
        color: item.color,
        percentage,
        item,
        labelX,
        labelY,
        externalLabelX,
        externalLabelY,
        arrowStartX,
        arrowStartY,
        midAngleRad,
        showLabel: angle > 20 && !isSelected, // Hide percentage when selected
        index,
        isSelected,
        offsetX,
        offsetY
      };
    });
  };
  
  const slices = createPieSlices();
  
  const handleSlicePress = (item) => {
    // Toggle selection
    if (selectedSlice && selectedSlice.name === item.name) {
      setSelectedSlice(null);
    } else {
      setSelectedSlice(item);
    }
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
              <G key={slice.index}>
                {/* Shadow/glow for selected slice */}
                {slice.isSelected && (
                  <Path
                    d={slice.pathData}
                    fill={slice.color}
                    opacity="0.3"
                    transform={`translate(2, 2)`}
                  />
                )}
                <Path
                  d={slice.pathData}
                  fill={slice.color}
                  stroke="#fff"
                  strokeWidth={slice.isSelected ? "3" : "2"}
                  opacity={slice.isSelected ? 1 : 0.9}
                  onPress={() => handleSlicePress(slice.item)}
                />
                {/* Arrow and external label for selected slice */}
                {slice.isSelected && (
                  <>
                    {/* Arrow line */}
                    <Line
                      x1={slice.arrowStartX}
                      y1={slice.arrowStartY}
                      x2={slice.externalLabelX}
                      y2={slice.externalLabelY}
                      stroke={slice.color}
                      strokeWidth="2"
                      strokeDasharray="5,3"
                    />
                    {/* Arrow dot at end */}
                    <Circle
                      cx={slice.externalLabelX}
                      cy={slice.externalLabelY}
                      r="3"
                      fill={slice.color}
                    />
                  </>
                )}
              </G>
            ))}
          </G>
          {/* Percentage labels - hide for selected slices */}
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
          {/* External labels for selected slices - Rendered last to be on top */}
          {slices.map((slice) => (
            slice.isSelected && (
              <G key={`external-label-${slice.index}`}>
                {/* Background for better readability */}
                <Rect
                  x={slice.externalLabelX - 45}
                  y={slice.externalLabelY - 20}
                  width="90"
                  height="40"
                  rx="8"
                  fill="white"
                  fillOpacity="0.95"
                  stroke={slice.color}
                  strokeWidth="2"
                />
                <SvgText
                  x={slice.externalLabelX}
                  y={slice.externalLabelY - 3}
                  fill={slice.color}
                  fontSize="13"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {slice.item.name}
                </SvgText>
                <SvgText
                  x={slice.externalLabelX}
                  y={slice.externalLabelY + 14}
                  fill={slice.color}
                  fontSize="15"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {slice.item.amount.toFixed(0)}₺
                </SvgText>
              </G>
            )
          ))}
        </Svg>
        
        {/* Center text */}
        <View style={styles.pieChartCenter} pointerEvents="none">
          <Text style={styles.pieCenterLabel}>Toplam</Text>
          <Text style={styles.pieCenterAmount}>{totalSavings.toFixed(0)}₺</Text>
        </View>
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