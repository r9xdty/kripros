// =====================================
// components/calendar/WeeklyPieChart.js - WITH TIME PERIOD SELECTOR
// =====================================
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, G, Circle, Text as SvgText, Line, Rect } from 'react-native-svg';
import { getWeeklyPieData, getMonthlyPieData, getYearlyPieData } from '../../utils/savingsUtils';
import { styles } from '../../styles/calendar';

const { width } = Dimensions.get('window');
const CHART_SIZE = width - 60;
const CENTER_X = CHART_SIZE / 2;
const CENTER_Y = CHART_SIZE / 2;
const RADIUS = (CHART_SIZE / 2) - 60;
const INNER_RADIUS = RADIUS * 0.6;

const WeeklyPieChart = ({ dailySavings, weekStart, weekEnd, currentMonth, currentYear }) => {
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('weekly'); // 'weekly', 'monthly', 'yearly'
  
  // Get data based on selected period
  const getPieData = () => {
    switch(chartPeriod) {
      case 'monthly':
        return getMonthlyPieData(dailySavings, currentMonth, currentYear);
      case 'yearly':
        return getYearlyPieData(dailySavings, currentYear);
      case 'weekly':
      default:
        return getWeeklyPieData(dailySavings, weekStart, weekEnd);
    }
  };
  
  const pieData = getPieData();
  const totalSavings = pieData.reduce((sum, item) => sum + item.amount, 0);
  
  // Handle single item display
  const displayData = pieData.length === 1 
    ? [{ ...pieData[0], forceFullCircle: true }]
    : pieData;
  
  // Format date range based on period
  const formatDateRange = () => {
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    
    switch(chartPeriod) {
      case 'monthly':
        return `${months[currentMonth]} ${currentYear}`;
      case 'yearly':
        return `${currentYear} Yılı`;
      case 'weekly':
      default:
        const startDay = weekStart.getDate();
        const startMonth = weekStart.toLocaleDateString('tr-TR', { month: 'short' });
        const endDay = weekEnd.getDate();
        const endMonth = weekEnd.toLocaleDateString('tr-TR', { month: 'short' });
        
        if (startMonth === endMonth) {
          return `${startDay} - ${endDay} ${startMonth}`;
        }
        return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
    }
  };
  
  // Get chart title based on period
  const getChartTitle = () => {
    switch(chartPeriod) {
      case 'monthly':
        return 'Aylık Özet';
      case 'yearly':
        return 'Yıllık Özet';
      case 'weekly':
      default:
        return 'Haftalık Özet';
    }
  };
  
  // Calculate pie slices
  const createPieSlices = () => {
    if (totalSavings === 0) return [];
    
    let currentAngle = -90;
    
    return displayData.map((item, index) => {
      const percentage = item.forceFullCircle ? 1 : item.amount / totalSavings;
      const angle = item.forceFullCircle ? 359.9 : percentage * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;
      
      const isSelected = selectedSlice && selectedSlice.name === item.name;
      const scale = isSelected ? 1.03 : 1;
      
      const midAngle = (startAngle + endAngle) / 2;
      const midAngleRad = (midAngle * Math.PI) / 180;
      const offsetX = isSelected ? 6 * Math.cos(midAngleRad) : 0;
      const offsetY = isSelected ? 6 * Math.sin(midAngleRad) : 0;
      
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
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
      
      const labelAngle = (startAngle + endAngle) / 2;
      const labelAngleRad = (labelAngle * Math.PI) / 180;
      const labelRadius = (scaledRadius + scaledInnerRadius) / 2;
      const labelX = CENTER_X + offsetX + labelRadius * Math.cos(labelAngleRad);
      const labelY = CENTER_Y + offsetY + labelRadius * Math.sin(labelAngleRad);
      
      const idealRadius = RADIUS + 35;
      const rawX = CENTER_X + idealRadius * Math.cos(midAngleRad);
      const rawY = CENTER_Y + idealRadius * Math.sin(midAngleRad);
      
      const labelBoxWidth = 90;
      const labelBoxHeight = 40;
      const padding = 8;
      
      const minX = labelBoxWidth/2 + padding;
      const maxX = CHART_SIZE - labelBoxWidth/2 - padding;
      const minY = labelBoxHeight/2 + padding;
      const maxY = CHART_SIZE - labelBoxHeight/2 - padding;
      
      const externalLabelX = Math.max(minX, Math.min(rawX, maxX));
      const externalLabelY = Math.max(minY, Math.min(rawY, maxY));
      
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
        showLabel: angle > 20 && !isSelected,
        index,
        isSelected,
        offsetX,
        offsetY
      };
    });
  };
  
  const slices = createPieSlices();
  
  const handleSlicePress = (item) => {
    if (selectedSlice && selectedSlice.name === item.name) {
      setSelectedSlice(null);
    } else {
      setSelectedSlice(item);
    }
  };
  
  const handleChartPress = (event) => {
    try {
      const { locationX, locationY } = event.nativeEvent;
      
      const x = locationX - CENTER_X;
      const y = locationY - CENTER_Y;
      
      let angle = Math.atan2(y, x) * 180 / Math.PI;
      angle = angle + 90;
      if (angle < 0) angle += 360;
      
      const distance = Math.sqrt(x * x + y * y);
      
      const innerBound = INNER_RADIUS * 0.9;
      const outerBound = RADIUS * 1.1;
      
      if (distance < innerBound || distance > outerBound) {
        setSelectedSlice(null);
        return;
      }
      
      let currentAngle = 0;
      for (const item of displayData) {
        const slicePercentage = item.forceFullCircle ? 1 : item.amount / totalSavings;
        const sliceAngle = item.forceFullCircle ? 359.9 : slicePercentage * 360;
        
        if (angle >= currentAngle - 1 && angle <= currentAngle + sliceAngle + 1) {
          handleSlicePress(item);
          return;
        }
        currentAngle += sliceAngle;
      }
      
      setSelectedSlice(null);
    } catch (error) {
      console.log('Touch detection error:', error);
    }
  };
  
  if (totalSavings === 0) {
    return (
      <View style={styles.weeklyChartContainer}>
        <View style={styles.weeklyChartHeader}>
          <View style={styles.chartHeaderTop}>
            <Text style={styles.weeklyChartTitle}>{getChartTitle()}</Text>
            <View style={styles.chartViewSelector}>
              <TouchableOpacity
                style={[styles.chartViewButton, chartPeriod === 'weekly' && styles.activeChartView]}
                onPress={() => setChartPeriod('weekly')}
              >
                <Text style={[styles.chartViewText, chartPeriod === 'weekly' && styles.activeChartViewText]}>
                  H
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chartViewButton, chartPeriod === 'monthly' && styles.activeChartView]}
                onPress={() => setChartPeriod('monthly')}
              >
                <Text style={[styles.chartViewText, chartPeriod === 'monthly' && styles.activeChartViewText]}>
                  A
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chartViewButton, chartPeriod === 'yearly' && styles.activeChartView]}
                onPress={() => setChartPeriod('yearly')}
              >
                <Text style={[styles.chartViewText, chartPeriod === 'yearly' && styles.activeChartViewText]}>
                  Y
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.weeklyChartDate}>{formatDateRange()}</Text>
        </View>
        <View style={styles.emptyChartContainer}>
          <Text style={styles.emptyChartText}>
            {chartPeriod === 'yearly' ? 'Bu yıl' : chartPeriod === 'monthly' ? 'Bu ay' : 'Bu hafta'} henüz tasarruf yok
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.weeklyChartContainer}>
      <View style={styles.weeklyChartHeader}>
        <View style={styles.chartHeaderTop}>
          <Text style={styles.weeklyChartTitle}>{getChartTitle()}</Text>
          <View style={styles.chartViewSelector}>
            <TouchableOpacity
              style={[styles.chartViewButton, chartPeriod === 'weekly' && styles.activeChartView]}
              onPress={() => setChartPeriod('weekly')}
            >
              <Text style={[styles.chartViewText, chartPeriod === 'weekly' && styles.activeChartViewText]}>
                H
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chartViewButton, chartPeriod === 'monthly' && styles.activeChartView]}
              onPress={() => setChartPeriod('monthly')}
            >
              <Text style={[styles.chartViewText, chartPeriod === 'monthly' && styles.activeChartViewText]}>
                A
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chartViewButton, chartPeriod === 'yearly' && styles.activeChartView]}
              onPress={() => setChartPeriod('yearly')}
            >
              <Text style={[styles.chartViewText, chartPeriod === 'yearly' && styles.activeChartViewText]}>
                Y
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.weeklyChartDate}>{formatDateRange()}</Text>
        <Text style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
          Detaylar için butona dokunun
        </Text>
      </View>
      
      {/* Pie Chart */}
      <View style={styles.pieChartWrapper}>
        <TouchableWithoutFeedback onPress={handleChartPress}>
          <Svg width={CHART_SIZE} height={CHART_SIZE}>
            <G>
              {slices.map((slice) => (
                <G key={slice.index}>
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
                  />
                  {slice.isSelected && (
                    <>
                      <Line
                        x1={slice.arrowStartX}
                        y1={slice.arrowStartY}
                        x2={slice.externalLabelX}
                        y2={slice.externalLabelY}
                        stroke={slice.color}
                        strokeWidth="2"
                        strokeDasharray="5,3"
                      />
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
            {slices.map((slice) => (
              slice.isSelected && (
                <G key={`external-label-${slice.index}`}>
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
        </TouchableWithoutFeedback>
        
        <View style={styles.pieChartCenter} pointerEvents="none">
          <Text style={styles.pieCenterLabel}>Toplam</Text>
          <Text style={styles.pieCenterAmount}>{totalSavings.toFixed(0)}₺</Text>
        </View>
      </View>
      
      {/* Selection Buttons */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 15, justifyContent: 'center' }}>
        {pieData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 6,
              margin: 4,
              borderRadius: 15,
              backgroundColor: selectedSlice && selectedSlice.name === item.name ? item.color : '#f3f4f6',
              borderWidth: 1,
              borderColor: item.color,
            }}
            onPress={() => handleSlicePress(item)}
          >
            <View style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: item.color,
              marginRight: 6,
            }} />
            <Text style={{
              fontSize: 12,
              color: selectedSlice && selectedSlice.name === item.name ? '#fff' : '#374151',
              fontWeight: selectedSlice && selectedSlice.name === item.name ? 'bold' : 'normal',
            }}>
              {item.name}: {item.amount.toFixed(0)}₺
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Top 3 Items */}
      {pieData.length > 0 && (
        <View style={styles.topItemsContainer}>
          <Text style={styles.topItemsTitle}>En Çok Tasarruf:</Text>
          {pieData.slice(0, 3).map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.topItem}
              onPress={() => handleSlicePress(item)}
            >
              <View style={[styles.topItemRank, { 
                backgroundColor: item.color,
                borderWidth: selectedSlice && selectedSlice.name === item.name ? 2 : 0,
                borderColor: '#fff'
              }]}>
                <Text style={styles.topItemRankText}>{index + 1}</Text>
              </View>
              <Text style={[
                styles.topItemName,
                selectedSlice && selectedSlice.name === item.name && { fontWeight: 'bold' }
              ]}>{item.name}</Text>
              <Text style={[
                styles.topItemAmount,
                selectedSlice && selectedSlice.name === item.name && { fontWeight: 'bold' }
              ]}>
                {item.amount.toFixed(0)}₺
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default WeeklyPieChart;