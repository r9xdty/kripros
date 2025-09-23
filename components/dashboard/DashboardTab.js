// =====================================
// src/components/dashboard/DashboardTab.js - SIMPLIFIED SPENDING MODE
// =====================================
import React from 'react';
import { View, Text } from 'react-native';
import StatsHeader from './StatsHeader';
import Chart from './Chart';
import ActionButtons from './ActionButtons';
import CalendarGrid from '../calendar/CalendarGrid';
import Icon from '../common/Icon';
import { MONTH_NAMES } from '../../constants';
import { calculateTotalSavings, getChartData } from '../../utils/savingsUtils';
import { getTotalSpending, getSpendingChartData } from '../../utils/spendingUtils';
import { getDaysInMonth } from '../../utils/dateUtils';
import { styles } from '../../styles/dashboard';

const DashboardTab = ({
  savings,
  dailySavings,
  dailySpending,
  appMode,
  theme,
  chartView,
  setChartView,
  setShowAddModal,
  setShowSavingsModal,
  setSelectedDate,
  setShowCalendarModal
}) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Calculate totals
  const totalSavings = calculateTotalSavings(dailySavings);
  const totalSpending = getTotalSpending(dailySpending);
  
  // Get chart data based on mode
  const chartData = appMode === 'savings' 
    ? getChartData(chartView, dailySavings)
    : getSpendingChartData(dailySpending, chartView);
    
  const periodTotal = chartData.data.reduce((sum, value) => sum + value, 0);
  const monthDays = getDaysInMonth(currentMonth, currentYear);

  return (
    <>
      {/* Stats Header - Show for both modes but simplified for spending */}
      <StatsHeader
        totalSavings={totalSavings}
        periodTotal={periodTotal}
        chartView={chartView}
        totalSpending={totalSpending}
        appMode={appMode}
        theme={theme}
      />
      
      {/* Chart - Show for both modes */}
      <Chart
        chartData={chartData}
        chartView={chartView}
        setChartView={setChartView}
        appMode={appMode}
      />
      
      {/* Action Buttons - ONLY FOR SAVINGS MODE */}
      {appMode === 'savings' && (
        <ActionButtons
          onAddPress={setShowAddModal}
          onListPress={() => setShowSavingsModal(true)}
          appMode={appMode}
        />
      )}
      
      {/* Instructions for Spending Mode */}
      {appMode === 'spending' && (
        <View style={styles.spendingInstructions}>
          <Icon name="information-circle" size={20} color="#ef4444" />
          <Text style={styles.spendingInstructionsText}>
            Harcama eklemek için takvimden bir gün seçin
          </Text>
        </View>
      )}
      
      {/* Calendar Grid - Main interaction for spending mode */}
      <CalendarGrid
        title={`${MONTH_NAMES[currentMonth]} ${currentYear}`}
        days={monthDays}
        dailySavings={dailySavings}
        dailySpending={dailySpending}
        appMode={appMode}
        onDayPress={(day) => {
          setSelectedDate(day);
          setShowCalendarModal(true);
        }}
        showNavigation={false}
      />
    </>
  );
};

export default DashboardTab;