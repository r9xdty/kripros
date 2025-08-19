// =====================================
// src/components/calendar/CalendarTab.js
// =====================================
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../common/Icon';
import CalendarGrid from './CalendarGrid';
import { MONTH_NAMES } from '../../constants';
import { getDaysInMonth } from '../../utils/dateUtils';
import { styles } from '../../styles/calendar';

const CalendarTab = ({
  dailySavings,
  calendarView,
  setCalendarView,
  setSelectedDate,
  setShowCalendarModal
}) => {
  const calendarDays = getDaysInMonth(calendarView.month, calendarView.year);

  const handlePrevMonth = () => {
    if (calendarView.month === 0) {
      setCalendarView({ month: 11, year: calendarView.year - 1 });
    } else {
      setCalendarView({ ...calendarView, month: calendarView.month - 1 });
    }
  };

  const handleNextMonth = () => {
    if (calendarView.month === 11) {
      setCalendarView({ month: 0, year: calendarView.year + 1 });
    } else {
      setCalendarView({ ...calendarView, month: calendarView.month + 1 });
    }
  };

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.extendedCalendarHeader}>
        <TouchableOpacity
          style={styles.calendarNavButton}
          onPress={handlePrevMonth}
        >
          <Icon name="chevron-back" size={24} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.extendedCalendarTitle}>
          {MONTH_NAMES[calendarView.month]} {calendarView.year}
        </Text>
        
        <TouchableOpacity
          style={styles.calendarNavButton}
          onPress={handleNextMonth}
        >
          <Icon name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      
      <CalendarGrid
        days={calendarDays}
        dailySavings={dailySavings}
        onDayPress={(day) => {
          setSelectedDate(day);
          setShowCalendarModal(true);
        }}
        currentMonth={calendarView.month}
      />
    </View>
  );
};

export default CalendarTab;
