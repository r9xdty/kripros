// =====================================
// components/dashboard/DashboardTab.js - SAVINGS ONLY VERSION
// =====================================
import React from 'react';
import StatsHeader from './StatsHeader';
import Chart from './Chart';
import ActionButtons from './ActionButtons';
import CalendarGrid from '../calendar/CalendarGrid';
import { MONTH_NAMES } from '../../constants';
import { calculateTotalSavings, getChartData } from '../../utils/savingsUtils';
import { getDaysInMonth } from '../../utils/dateUtils';

const DashboardTab = ({
  savings,
  dailySavings,
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
  
  // Calculate totals - only for savings
  const totalSavings = calculateTotalSavings(dailySavings);
  
  // Get chart data for savings only
  const chartData = getChartData(chartView, dailySavings);
  const periodTotal = chartData.data.reduce((sum, value) => sum + value, 0);
  const monthDays = getDaysInMonth(currentMonth, currentYear);

  return (
    <>
      {/* Stats Header - Savings Only */}
      <StatsHeader
        totalSavings={totalSavings}
        periodTotal={periodTotal}
        chartView={chartView}
      />
      
      {/* Chart - Savings Only */}
      <Chart
        chartData={chartData}
        chartView={chartView}
        setChartView={setChartView}
        appMode="savings"
      />
      
      {/* Action Buttons - Savings Only */}
      <ActionButtons
        onAddPress={setShowAddModal}
        onListPress={() => setShowSavingsModal(true)}
        appMode="savings"
      />
      
      {/* Calendar Grid - Savings Only */}
      <CalendarGrid
        title={`${MONTH_NAMES[currentMonth]} ${currentYear}`}
        days={monthDays}
        dailySavings={dailySavings}
        dailySpending={{}} // Empty object, no spending
        appMode="savings"
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