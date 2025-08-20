// =====================================
// components/dashboard/Chart.js - WITH LONG PRESS TOOLTIP
// =====================================
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/dashboard';

const Chart = ({ chartData, chartView, setChartView }) => {
  const [selectedBar, setSelectedBar] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);
  const maxValue = Math.max(...chartData.data);
  
  // Get the appropriate title based on view
  const getChartTitle = () => {
    switch(chartView) {
      case 'weekly':
        return 'Son 7 Günlük Tasarruf';
      case 'monthly':
        return 'Son 30 Günlük Tasarruf';
      case 'yearly':
        return 'Son 12 Aylık Tasarruf';
      default:
        return 'Tasarruf Grafiği';
    }
  };
  
  const handleLongPress = (value, label, index, event) => {
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
    
    setTooltipData({
      label: periodText,
      value: value.toFixed(2),
      index: index
    });
  };
  
  const handlePressOut = () => {
    setSelectedBar(null);
    setTooltipData(null);
  };
  
  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>
          {getChartTitle()}
        </Text>
        <View style={styles.chartViewSelector}>
          <TouchableOpacity
            style={[styles.chartViewButton, chartView === 'weekly' && styles.activeChartView]}
            onPress={() => setChartView('weekly')}
          >
            <Text style={[styles.chartViewText, chartView === 'weekly' && styles.activeChartViewText]}>
              7G
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chartViewButton, chartView === 'monthly' && styles.activeChartView]}
            onPress={() => setChartView('monthly')}
          >
            <Text style={[styles.chartViewText, chartView === 'monthly' && styles.activeChartViewText]}>
              30G
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chartViewButton, chartView === 'yearly' && styles.activeChartView]}
            onPress={() => setChartView('yearly')}
          >
            <Text style={[styles.chartViewText, chartView === 'yearly' && styles.activeChartViewText]}>
              12A
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.simpleChart}>
        <View style={styles.chartBars}>
          {chartData.data.map((value, index) => {
            const barHeight = maxValue > 0 ? (value / maxValue) * 100 : 0;
            
            return (
              <TouchableOpacity
                key={index}
                style={styles.chartBarContainer}
                onLongPress={(e) => handleLongPress(value, chartData.labels[index], index, e)}
                onPressOut={handlePressOut}
                activeOpacity={1}
                delayLongPress={100}
              >
                <View style={[
                  styles.chartBar, 
                  { height: barHeight },
                  selectedBar === index && styles.selectedChartBar
                ]} />
                <Text style={styles.chartLabel}>{chartData.labels[index]}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Tooltip */}
        {tooltipData && (
          <View style={[styles.chartTooltip, { left: (tooltipData.index * (100 / chartData.data.length)) + '%' }]}>
            <View style={styles.chartTooltipArrow} />
            <Text style={styles.chartTooltipLabel}>{tooltipData.label}</Text>
            <Text style={styles.chartTooltipValue}>{tooltipData.value} ₺</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Chart;