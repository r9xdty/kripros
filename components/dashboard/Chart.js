// =====================================
// components/dashboard/Chart.js - FIXED WITH MODE SUPPORT
// =====================================
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/dashboard';

const Chart = ({ chartData, chartView, setChartView, appMode = 'savings' }) => {
  const [selectedBar, setSelectedBar] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);
  const maxValue = Math.max(...chartData.data);
  const barCount = chartData.data.length;
  
  // Dynamic title based on mode
  const getChartTitle = () => {
    const itemType = appMode === 'savings' ? 'Tasarruf' : 'Harcama';
    switch(chartView) {
      case 'weekly':
        return `Son 7 Günlük ${itemType}`;
      case 'monthly':
        return `Son 30 Günlük ${itemType}`;
      case 'yearly':
        return `Son 12 Aylık ${itemType}`;
      default:
        return `${itemType} Grafiği`;
    }
  };
  
  // Dynamic bar color based on mode
  const barColor = appMode === 'savings' ? '#3b82f6' : '#ef4444';
  const selectedBarColor = appMode === 'savings' ? '#1d4ed8' : '#dc2626';
  
  const handleLongPress = (value, label, index) => {
    setSelectedBar(index);
    let periodText = '';
    switch(chartView) {
      case 'weekly':
        periodText = `${label}`;
        break;
      case 'monthly':
        periodText = label;
        break;
      case 'yearly':
        periodText = `${label}`;
        break;
    }
    
    // Calculate bar height for positioning tooltip
    const barHeight = maxValue > 0 ? (value / maxValue) * 100 : 0;
    setTooltipData({ 
      value: value.toFixed(2), 
      period: periodText,
      barHeight,
      index 
    });
    
    setTimeout(() => {
      setSelectedBar(null);
      setTooltipData(null);
    }, 2000);
  };
  
  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>{getChartTitle()}</Text>
        <View style={styles.chartViewSelector}>
          <TouchableOpacity
            style={[styles.chartViewButton, chartView === 'weekly' && styles.activeChartView]}
            onPress={() => setChartView('weekly')}
          >
            <Text style={[styles.chartViewText, chartView === 'weekly' && styles.activeChartViewText]}>
              Haftalık
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chartViewButton, chartView === 'monthly' && styles.activeChartView]}
            onPress={() => setChartView('monthly')}
          >
            <Text style={[styles.chartViewText, chartView === 'monthly' && styles.activeChartViewText]}>
              Aylık
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chartViewButton, chartView === 'yearly' && styles.activeChartView]}
            onPress={() => setChartView('yearly')}
          >
            <Text style={[styles.chartViewText, chartView === 'yearly' && styles.activeChartViewText]}>
              Yıllık
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.simpleChart}>
        {tooltipData && (
          <View style={[
            styles.chartTooltip,
            { 
              left: `${(tooltipData.index / barCount) * 100 + (100 / barCount / 2) - 30}%`,
              bottom: `${Math.min(tooltipData.barHeight + 10, 90)}%`
            }
          ]}>
            <Text style={styles.tooltipAmount}>{tooltipData.value} ₺</Text>
            <Text style={styles.tooltipPeriod}>{tooltipData.period}</Text>
          </View>
        )}
        
        <View style={styles.chartBars}>
          {chartData.data.map((value, index) => {
            const barHeight = maxValue > 0 ? (value / maxValue) * 100 : 0;
            return (
              <TouchableOpacity
                key={index}
                style={styles.chartBarContainer}
                onLongPress={() => handleLongPress(value, chartData.labels[index], index)}
                onPress={() => handleLongPress(value, chartData.labels[index], index)}
                activeOpacity={0.8}
              >
                <View 
                  style={[
                    styles.chartBar,
                    { 
                      height: `${barHeight}%`,
                      backgroundColor: barColor,
                      minHeight: value > 0 ? 4 : 2 
                    },
                    selectedBar === index && [
                      styles.selectedChartBar,
                      { backgroundColor: selectedBarColor }
                    ]
                  ]} 
                />
                <Text style={styles.chartLabel}>
                  {chartData.labels[index]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default Chart;