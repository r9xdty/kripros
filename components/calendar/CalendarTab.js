// =====================================
// components/calendar/CalendarTab.js - FIXED WITH PROPER SCROLLING
// =====================================
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Icon from '../common/Icon';
import CalendarGrid from './CalendarGrid';
import WeeklyPieChart from './WeeklyPieChart';
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const calendarDays = getDaysInMonth(calendarView.month, calendarView.year);

  useEffect(() => {
    // Calculate current week
    const today = new Date();
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    setSelectedWeek({ start: startOfWeek, end: endOfWeek });
  }, []);

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

  const handleMonthYearSelect = (month, year) => {
    setCalendarView({ month, year });
    setShowDatePicker(false);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <ScrollView 
      style={styles.calendarTabContainer} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }} // Extra padding for scroll content
    >
      {/* Calendar - ON TOP */}
      <View style={styles.calendarContainer}>
        <View style={styles.extendedCalendarHeader}>
          <TouchableOpacity
            style={styles.calendarNavButton}
            onPress={handlePrevMonth}
          >
            <Icon name="chevron-back" size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.monthYearButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.extendedCalendarTitle}>
              {MONTH_NAMES[calendarView.month]} {calendarView.year}
            </Text>
            <Text style={styles.tapToChangeText}>Değiştirmek için dokunun</Text>
          </TouchableOpacity>
          
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
            
            // Update selected week based on clicked day
            const startOfWeek = new Date(day);
            const dayOfWeek = startOfWeek.getDay();
            const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            startOfWeek.setDate(diff);
            startOfWeek.setHours(0, 0, 0, 0);
            
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);
            
            setSelectedWeek({ start: startOfWeek, end: endOfWeek });
          }}
          currentMonth={calendarView.month}
        />
      </View>
      
      {/* Weekly Pie Chart - BELOW CALENDAR */}
      {selectedWeek && (
        <WeeklyPieChart
          dailySavings={dailySavings}
          weekStart={selectedWeek.start}
          weekEnd={selectedWeek.end}
          currentMonth={calendarView.month}
          currentYear={calendarView.year}
        />
      )}

      {/* Month/Year Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <TouchableOpacity 
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setShowDatePicker(false)}
        >
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>Tarih Seçin</Text>
            
            <ScrollView style={styles.monthsContainer} showsVerticalScrollIndicator={false}>
              {MONTH_NAMES.map((month, index) => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.monthOption,
                    calendarView.month === index && styles.selectedMonthOption
                  ]}
                  onPress={() => handleMonthYearSelect(index, calendarView.year)}
                >
                  <Text style={[
                    styles.monthOptionText,
                    calendarView.month === index && styles.selectedMonthOptionText
                  ]}>
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.yearSelectorContainer}>
              <Text style={styles.yearSelectorTitle}>Yıl:</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.yearsContainer}
              >
                {years.map(year => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.yearOption,
                      calendarView.year === year && styles.selectedYearOption
                    ]}
                    onPress={() => handleMonthYearSelect(calendarView.month, year)}
                  >
                    <Text style={[
                      styles.yearOptionText,
                      calendarView.year === year && styles.selectedYearOptionText
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <TouchableOpacity
              style={styles.pickerCloseButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.pickerCloseButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

export default CalendarTab;