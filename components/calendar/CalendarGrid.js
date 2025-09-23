// =====================================
// src/components/calendar/CalendarGrid.js - MODERN DESIGN
// =====================================
import React from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import Icon from '../common/Icon';
import { DAY_NAMES } from '../../constants';
import { getDayTotal } from '../../utils/savingsUtils';
import { getDaySpendingTotal } from '../../utils/spendingUtils';
import { styles } from '../../styles/calendar';

const CalendarGrid = ({ 
  title, 
  days, 
  dailySavings, 
  dailySpending,
  appMode = 'savings',
  onDayPress, 
  showNavigation = true,
  currentMonth 
}) => {
  const today = new Date();
  const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const handleDayPress = (day) => {
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    if (day > todayEnd) {
      const itemType = appMode === 'savings' ? 'tasarruf' : 'harcama';
      Alert.alert('Uyarı', `Gelecek tarihe ${itemType} ekleyemezsiniz!`);
      return;
    }
    
    onDayPress(day);
  };

  const renderCalendarDay = (day, index) => {
    if (!day) {
      return <View key={`empty-${index}`} style={styles.calendarDayWrapper} />;
    }

    const savingsTotal = getDayTotal(day, dailySavings || {});
    const spendingTotal = getDaySpendingTotal(day, dailySpending || {});
    const hasData = savingsTotal > 0 || spendingTotal > 0;
    
    const isToday = day.toDateString() === today.toDateString();
    const isFutureDate = day > today;
    const isCurrentMonth = currentMonth === undefined || day.getMonth() === currentMonth;
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;

    return (
      <TouchableOpacity
        key={`day-${day.getTime()}`}
        style={styles.calendarDayWrapper}
        onPress={() => handleDayPress(day)}
        disabled={isFutureDate}
        activeOpacity={0.7}
      >
        <View style={[
          styles.calendarDayInner,
          isFutureDate && styles.futureDateDisabled,
          isToday && styles.todayCalendarDay,
          hasData && !isFutureDate && styles.hasDataDay,
          !isCurrentMonth && styles.otherMonthDay,
          isWeekend && !isFutureDate && styles.weekendDay
        ]}>
          {/* Today Indicator */}
          {isToday && (
            <View style={styles.todayIndicator}>
              <View style={styles.todayDot} />
            </View>
          )}
          
          <Text style={[
            styles.calendarDayText,
            isFutureDate && styles.futureDateText,
            isToday && styles.todayText,
            hasData && !isFutureDate && styles.hasDataText,
            !isCurrentMonth && styles.otherMonthText,
            isWeekend && styles.weekendText
          ]}>
            {day.getDate()}
          </Text>
          
          {/* Data Indicators */}
          {!isFutureDate && hasData && (
            <View style={styles.dataIndicators}>
              {savingsTotal > 0 && (
                <View style={styles.savingIndicator}>
                  <Text style={styles.savingIndicatorText}>
                    +{savingsTotal >= 1000 ? `${(savingsTotal/1000).toFixed(1)}k` : savingsTotal.toFixed(0)}
                  </Text>
                </View>
              )}
              {spendingTotal > 0 && (
                <View style={styles.spendingIndicator}>
                  <Text style={styles.spendingIndicatorText}>
                    -{spendingTotal >= 1000 ? `${(spendingTotal/1000).toFixed(1)}k` : spendingTotal.toFixed(0)}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Activity Dots */}
          {!isFutureDate && hasData && (
            <View style={styles.activityDots}>
              {savingsTotal > 0 && <View style={styles.savingDot} />}
              {spendingTotal > 0 && <View style={styles.spendingDot} />}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.calendarContainer}>
      {/* Calendar Header with Title */}
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarTitle}>{title}</Text>
        {showNavigation && (
          <View style={styles.navigationButtons}>
            <TouchableOpacity style={styles.navButton}>
              <Icon name="chevron-back" size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <Icon name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Week Days Header */}
      <View style={styles.weekDaysHeader}>
        {weekDays.map((day, index) => (
          <View key={day} style={styles.weekDayWrapper}>
            <Text style={[
              styles.weekDayText,
              (index === 5 || index === 6) && styles.weekendDayText
            ]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar Days Grid */}
      <View style={styles.calendarGrid}>
        {days.map((day, index) => renderCalendarDay(day, index))}
      </View>

      {/* Legend */}
      <View style={styles.calendarLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
          <Text style={styles.legendText}>Tasarruf</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
          <Text style={styles.legendText}>Harcama</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
          <Text style={styles.legendText}>Bugün</Text>
        </View>
      </View>
    </View>
  );
};

export default CalendarGrid;