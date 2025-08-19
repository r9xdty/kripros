// =====================================
// src/components/dashboard/DashboardTab.js
// =====================================
import React from 'react';
import { View } from 'react-native';
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
  const totalSavings = calculateTotalSavings(dailySavings);
  const chartData = getChartData(chartView, dailySavings);
  const periodTotal = chartData.data.reduce((sum, value) => sum + value, 0);
  const monthDays = getDaysInMonth(currentMonth, currentYear);

  // Debug log
  React.useEffect(() => {
    console.log("Dashboard Calendar Debug:");
    console.log("Current month:", currentMonth, "(", MONTH_NAMES[currentMonth], ")");
    console.log("Current year:", currentYear);
    console.log("Month days array length:", monthDays.length);
    console.log("First 7 positions:", monthDays.slice(0, 7).map(d => d ? d.getDate() : 'empty'));
  }, [currentMonth, currentYear]);

  return (
    <>
      <StatsHeader
        totalSavings={totalSavings}
        periodTotal={periodTotal}
        chartView={chartView}
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