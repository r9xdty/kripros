// =====================================
// components/calendar/CalendarTab.js - MODERN VERSION
// =====================================
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from '../common/Icon';
import CalendarGrid from './CalendarGrid';
import WeeklyPieChart from './WeeklyPieChart';
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
  const [viewType, setViewType] = useState('month'); // 'month', 'week', 'list'
  const [selectedWeek, setSelectedWeek] = useState(null);
  
  const today = new Date();
  const calendarDays = getDaysInMonth(calendarView.month, calendarView.year);

  useEffect(() => {
    // Calculate current week
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    setSelectedWeek({ start: startOfWeek, end: endOfWeek });
  }, []);

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
      {/* View Type Selector */}
      <View style={styles.calendarViewControls}>
        <TouchableOpacity
          style={[styles.viewButton, viewType === 'month' && styles.activeViewButton]}
          onPress={() => setViewType('month')}
        >
          <Text style={[styles.viewButtonText, viewType === 'month' && styles.activeViewButtonText]}>
            Aylık
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, viewType === 'week' && styles.activeViewButton]}
          onPress={() => setViewType('week')}
        >
          <Text style={[styles.viewButtonText, viewType === 'week' && styles.activeViewButtonText]}>
            Haftalık
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, viewType === 'list' && styles.activeViewButton]}
          onPress={() => setViewType('list')}
        >
          <Text style={[styles.viewButtonText, viewType === 'list' && styles.activeViewButtonText]}>
            Liste
          </Text>
        </TouchableOpacity>
      </View>

      {/* Month Navigation */}
      {viewType === 'month' && (
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
      )}

      {/* Calendar Views */}
      {viewType === 'month' && (
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
      )}

      {viewType === 'week' && selectedWeek && (
        <View style={styles.weeklyContainer}>
          <View style={styles.weeklyHeader}>
            <Text style={styles.weeklyTitle}>Haftalık Görünüm</Text>
            <Text style={styles.weeklyDates}>
              {selectedWeek.start.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
              {' - '}
              {selectedWeek.end.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
            </Text>
          </View>
          
          <View style={styles.pieChartCard}>
            <WeeklyPieChart
              dailySavings={dailySavings}
              dailySpending={dailySpending}
              appMode={appMode}
              selectedWeek={selectedWeek}
            />
          </View>
        </View>
      )}

      {viewType === 'list' && (
        <ListView
          dailySavings={dailySavings}
          dailySpending={dailySpending}
          appMode={appMode}
          onDayPress={(date) => {
            setSelectedDate(date);
            setShowCalendarModal(true);
          }}
        />
      )}

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
const ListView = ({ dailySavings, dailySpending, appMode, onDayPress }) => {
  const data = appMode === 'savings' ? dailySavings : dailySpending;
  const sortedDates = Object.keys(data).sort((a, b) => new Date(b) - new Date(a));
  
  return (
    <View style={styles.listViewContainer}>
      {sortedDates.slice(0, 10).map(dateStr => {
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