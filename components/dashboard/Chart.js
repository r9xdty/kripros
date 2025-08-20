// =====================================
// components/dashboard/Chart.js - WITH NEW TITLES
// =====================================
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/dashboard';

const Chart = ({ chartData, chartView, setChartView }) => {
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
            const barHeight = maxValue > 0 ? (value / maxValue) * 100 : 0; // Max 100px to prevent overlap
            
            return (
              <View key={index} style={styles.chartBarContainer}>
                <View style={[styles.chartBar, { height: barHeight }]} />
                <Text style={styles.chartLabel}>{chartData.labels[index]}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default Chart;