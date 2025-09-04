// =====================================
// src/components/dashboard/DashboardTab.js - COMPLETE FIXED VERSION
// =====================================
import React from 'react';
import { View } from 'react-native';
import StatsHeader from './StatsHeader';
import Chart from './Chart';
import ActionButtons from './ActionButtons';
import CalendarGrid from '../calendar/CalendarGrid';
import { MONTH_NAMES } from '../../constants';
import { calculateTotalSavings, getChartData } from '../../utils/savingsUtils';
import { getTotalSpending, getSpendingChartData } from '../../utils/spendingUtils';
import { getDaysInMonth } from '../../utils/dateUtils';

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
      <StatsHeader
        totalSavings={totalSavings}
        periodTotal={periodTotal}
        chartView={chartView}
        totalSpending={totalSpending}
        appMode={appMode}
        theme={theme}
      />
      
      <Chart
        chartData={chartData}
        chartView={chartView}
        setChartView={setChartView}
        appMode={appMode}
      />
      
      <ActionButtons
        onAddPress={() => setShowAddModal(true)}
        onListPress={() => setShowSavingsModal(true)}
        appMode={appMode}
      />
      
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