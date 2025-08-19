// =====================================
// src/components/dashboard/Chart.js
// =====================================
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/dashboard';

const Chart = ({ chartData, chartView, setChartView }) => {
  const maxValue = Math.max(...chartData.data);
  
  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>
          {chartView === 'weekly' ? 'Haftalık' : chartView === 'monthly' ? 'Aylık' : 'Yıllık'} Tasarruf
        </Text>
        <View style={styles.chartViewSelector}>
          <TouchableOpacity
            style={[styles.chartViewButton, chartView === 'weekly' && styles.activeChartView]}
            onPress={() => setChartView('weekly')}
          >
            <Text style={[styles.chartViewText, chartView === 'weekly' && styles.activeChartViewText]}>
              H
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chartViewButton, chartView === 'monthly' && styles.activeChartView]}
            onPress={() => setChartView('monthly')}
          >
            <Text style={[styles.chartViewText, chartView === 'monthly' && styles.activeChartViewText]}>
              A
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chartViewButton, chartView === 'yearly' && styles.activeChartView]}
            onPress={() => setChartView('yearly')}
          >
            <Text style={[styles.chartViewText, chartView === 'yearly' && styles.activeChartViewText]}>
              Y
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.simpleChart}>
        <View style={styles.chartBars}>
          {chartData.data.map((value, index) => {
            const barHeight = maxValue > 0 ? (value / maxValue) * 120 : 0;
            
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