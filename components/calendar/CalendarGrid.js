// =====================================
// src/components/calendar/CalendarGrid.js
// =====================================
import React from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import Icon from '../common/Icon';
import { DAY_NAMES } from '../../constants';
import { getDayTotal } from '../../utils/savingsUtils';
import { styles } from '../../styles/calendar';

const CalendarGrid = ({ 
  title, 
  days, 
  dailySavings, 
  onDayPress, 
  showNavigation = true,
  currentMonth 
}) => {
  const today = new Date();

  const handleDayPress = (day) => {
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    if (day > todayEnd) {
      Alert.alert('Hata', 'Gelecek tarihe tasarruf ekleyemezsiniz!');
      return;
    }
    
    onDayPress(day);
  };

  const renderCalendarDay = (day, index) => {
    if (!day) {
      return <View key={`empty-${index}`} style={styles.calendarDayWrapper} />;
    }

    const dayTotal = getDayTotal(day, dailySavings);
    const isToday = day.toDateString() === today.toDateString();
    const isFutureDate = day > today;
    const isCurrentMonth = currentMonth === undefined || day.getMonth() === currentMonth;

    return (
      <TouchableOpacity
        key={`day-${day.getTime()}`}
        style={styles.calendarDayWrapper}
        onPress={() => handleDayPress(day)}
        disabled={isFutureDate}
      >
        <View style={[
          styles.calendarDayInner,
          isFutureDate && styles.futureDateDisabled,
          isToday && styles.todayCalendarDay,
          dayTotal > 0 && !isFutureDate && styles.savingCalendarDay,
          !isCurrentMonth && styles.otherMonthDay
        ]}>
          <Text style={[
            styles.calendarDayText,
            isFutureDate && styles.futureDateText,
            isToday && styles.todayText,
            dayTotal > 0 && !isFutureDate && styles.savingDayText,
            !isCurrentMonth && styles.otherMonthText
          ]}>
            {day.getDate()}
          </Text>
          {dayTotal > 0 && !isFutureDate && (
            <Text style={styles.calendarDayAmount}>{dayTotal.toFixed(0)}₺</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.calendarContainer}>
      {title && (
        <View style={styles.calendarHeader}>
          <Icon name="calendar" size={20} color="#8b5cf6" />
          <Text style={styles.calendarTitle}>{title}</Text>
        </View>
      )}
      
      <View style={styles.calendar}>
        {/* Week header */}
        <View style={styles.calendarWeekHeader}>
          {DAY_NAMES.map((dayName, index) => (
            <View key={`header-${dayName}`} style={styles.calendarHeaderCell}>
              <Text style={styles.calendarWeekDay}>{dayName}</Text>
            </View>
          ))}
        </View>
        
        {/* Calendar grid */}
        <View style={styles.calendarGrid}>
          {days.map((day, index) => renderCalendarDay(day, index))}
        </View>
      </View>
    </View>
  );
};

export default CalendarGrid;