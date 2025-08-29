// =====================================
// src/components/dashboard/DashboardTab.js - FIXED VERSION
// =====================================
import React from 'react';
import { View } from 'react-native';
import StatsHeader from './StatsHeader';
import Chart from './Chart';
import ActionButtons from './ActionButtons';
import CalendarGrid from '../calendar/CalendarGrid';
import { MONTH_NAMES } from '../../constants';
import { calculateTotalSavings, getChartData } from '../../utils/savingsUtils';
import { getTotalSpending } from '../../utils/spendingUtils'; // Add this import
import { getDaysInMonth } from '../../utils/dateUtils';

const DashboardTab = ({
  savings,
  dailySavings,
  dailySpending,  // Add this prop
  appMode,        // Add this prop
  theme,          // Add this prop
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
  const totalSpending = getTotalSpending(dailySpending); // Calculate totalSpending
  
  const chartData = getChartData(chartView, dailySavings);
  const periodTotal = chartData.data.reduce((sum, value) => sum + value, 0);
  const monthDays = getDaysInMonth(currentMonth, currentYear);

  return (
    <>
      <StatsHeader
        totalSavings={totalSavings}
        periodTotal={periodTotal}
        chartView={chartView}
        totalSpending={totalSpending} // Now this is defined
        appMode={appMode}             // Now this is defined
        theme={theme}                  // Now this is defined
      />
      
      <Chart
        chartData={chartData}
        chartView={chartView}
        setChartView={setChartView}
      />
      
      <ActionButtons
        onAddPress={() => setShowAddModal(true)}
        onListPress={() => setShowSavingsModal(true)}
      />
      
      <CalendarGrid
        title={`${MONTH_NAMES[currentMonth]} ${currentYear}`}
        days={monthDays}
        dailySavings={dailySavings}
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