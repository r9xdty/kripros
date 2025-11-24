// =====================================
// components/calendar/CalendarTab.js - MODERN VERSION
// =====================================
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from '../common/Icon';
import MonthlyPieChart from './MonthlyPieChart';
import CalendarGrid from './CalendarGrid';
import { MONTH_NAMES } from '../../constants';
import { getDaysInMonth } from '../../utils/dateUtils';
import { styles } from '../../styles/calendar';

const CalendarTab = ({
  dailySavings,
  dailySpending,
  appMode = 'savings',
  calendarView,
  setCalendarView,
  setSelectedDate,
  setShowCalendarModal
}) => {
  const today = new Date();
  const calendarDays = getDaysInMonth(calendarView.month, calendarView.year);

  const handleMonthChange = (direction) => {
    const newMonth = calendarView.month + direction;
    if (newMonth < 0) {
      setCalendarView({ month: 11, year: calendarView.year - 1 });
    } else if (newMonth > 11) {
      setCalendarView({ month: 0, year: calendarView.year + 1 });
    } else {
      setCalendarView({ ...calendarView, month: newMonth });
    }
  };

  const goToToday = () => {
    setCalendarView({
      month: today.getMonth(),
      year: today.getFullYear()
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Month Navigation */}
      <View style={styles.monthNavigation}>
        <TouchableOpacity
          style={styles.monthNavButton}
          onPress={() => handleMonthChange(-1)}
        >
          <Icon name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={goToToday}>
          <Text style={styles.monthNavText}>
            {MONTH_NAMES[calendarView.month]} {calendarView.year}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.monthNavButton}
          onPress={() => handleMonthChange(1)}
        >
          <Icon name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Calendar Grid */}
      <CalendarGrid
        title={`${MONTH_NAMES[calendarView.month]} ${calendarView.year}`}
        days={calendarDays}
        dailySavings={dailySavings}
        dailySpending={dailySpending}
        appMode={appMode}
        onDayPress={(day) => {
          setSelectedDate(day);
          setShowCalendarModal(true);
        }}
        showNavigation={false}
        currentMonth={calendarView.month}
      />

      {/* Monthly Pie Chart */}
      <View style={styles.pieChartCard}>
        <MonthlyPieChart
          dailySavings={dailySavings}
          month={calendarView.month}
          year={calendarView.year}
        />
      </View>

      {/* List View */}
      <ListView
        dailySavings={dailySavings}
        dailySpending={dailySpending}
        appMode={appMode}
        onDayPress={(date) => {
          setSelectedDate(date);
          setShowCalendarModal(true);
        }}
        month={calendarView.month}
        year={calendarView.year}
      />

      {/* Quick Stats */}
      <QuickStats
        dailySavings={dailySavings}
        dailySpending={dailySpending}
        appMode={appMode}
        calendarView={calendarView}
      />
    </ScrollView>
  );
};

// List View Component
const ListView = ({ dailySavings, dailySpending, appMode, onDayPress, month, year }) => {
  const data = appMode === 'savings' ? dailySavings : dailySpending;

  // Filter dates for the selected month and year
  const sortedDates = Object.keys(data)
    .filter(dateStr => {
      const date = new Date(dateStr);
      return date.getMonth() === month && date.getFullYear() === year;
    })
    .sort((a, b) => new Date(b) - new Date(a));

  if (sortedDates.length === 0) {
    return (
      <View style={[styles.listViewContainer, { alignItems: 'center', padding: 20 }]}>
        <Text style={{ color: '#999' }}>Bu ay için kayıt bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.listViewContainer}>
      {sortedDates.map(dateStr => {
        const date = new Date(dateStr);
        const items = data[dateStr];
        const total = items.reduce((sum, item) => sum + item.amount, 0);

        return (
          <TouchableOpacity
            key={dateStr}
            style={styles.listItem}
            onPress={() => onDayPress(date)}
          >
            <View style={styles.listItemLeft}>
              <Text style={styles.listItemDate}>
                {date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
              </Text>
              <Text style={styles.listItemCount}>{items.length} kayıt</Text>
            </View>
            <Text style={[
              styles.listItemTotal,
              { color: appMode === 'savings' ? '#10b981' : '#ef4444' }
            ]}>
              {appMode === 'savings' ? '+' : '-'}{total.toFixed(2)} ₺
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// Quick Stats Component
const QuickStats = ({ dailySavings, dailySpending, appMode, calendarView }) => {
  const calculateMonthTotal = (data, month, year) => {
    return Object.entries(data).reduce((total, [dateStr, items]) => {
      const date = new Date(dateStr);
      if (date.getMonth() === month && date.getFullYear() === year) {
        return total + items.reduce((sum, item) => sum + item.amount, 0);
      }
      return total;
    }, 0);
  };

  const monthSavings = calculateMonthTotal(dailySavings, calendarView.month, calendarView.year);
  const monthSpending = calculateMonthTotal(dailySpending, calendarView.month, calendarView.year);

  return (
    <View style={styles.quickStatsContainer}>
      <Text style={styles.quickStatsTitle}>
        {MONTH_NAMES[calendarView.month]} Özeti
      </Text>
      <View style={styles.quickStatsGrid}>
        <View style={[styles.quickStatCard, { backgroundColor: '#f0fdf4' }]}>
          <Icon name="trending-up" size={24} color="#10b981" />
          <Text style={styles.quickStatLabel}>Tasarruf</Text>
          <Text style={[styles.quickStatValue, { color: '#10b981' }]}>
            +{monthSavings.toFixed(2)} ₺
          </Text>
        </View>
        <View style={[styles.quickStatCard, { backgroundColor: '#fef2f2' }]}>
          <Icon name="trending-down" size={24} color="#ef4444" />
          <Text style={styles.quickStatLabel}>Harcama</Text>
          <Text style={[styles.quickStatValue, { color: '#ef4444' }]}>
            -{monthSpending.toFixed(2)} ₺
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CalendarTab;
