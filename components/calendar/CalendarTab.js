// =====================================
// components/calendar/CalendarTab.js - FIXED WITH SPENDING SUPPORT
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
  dailySpending, // Add this prop
  appMode = 'savings', // Add this prop
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
      contentContainerStyle={{ paddingBottom: 120 }}
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
          dailySpending={dailySpending}
          appMode={appMode}
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
          showNavigation={false}
          currentMonth={calendarView.month}
        />
      </View>

      {/* Weekly Pie Chart - BELOW CALENDAR */}
      {selectedWeek && (
        <View style={styles.weeklyChartContainer}>
          <Text style={styles.weeklyChartTitle}>Haftalık Tasarruf Dağılımı</Text>
          <WeeklyPieChart
            dailySavings={dailySavings}
            weekStart={selectedWeek.start}
            weekEnd={selectedWeek.end}
            currentMonth={calendarView.month}
            currentYear={calendarView.year}
          />
        </View>
      )}

      {/* Month/Year Picker Modal */}
      <Modal
        visible={showDatePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDatePicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDatePicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tarih Seç</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              {/* Year Selection */}
              <View style={styles.sectionTitle}>
                <Text style={styles.sectionTitleText}>Yıl</Text>
              </View>
              <View style={styles.yearGrid}>
                {years.map(year => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.yearGridItem,
                      calendarView.year === year && styles.yearGridItemSelected
                    ]}
                    onPress={() => handleMonthYearSelect(calendarView.month, year)}
                  >
                    <Text style={[
                      styles.yearGridText,
                      calendarView.year === year && styles.yearGridTextSelected
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Month Selection */}
              <View style={styles.sectionTitle}>
                <Text style={styles.sectionTitleText}>Ay</Text>
              </View>
              {MONTH_NAMES.map((month, index) => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.modalOption,
                    calendarView.month === index && styles.modalOptionSelected
                  ]}
                  onPress={() => handleMonthYearSelect(index, calendarView.year)}
                >
                  <Text style={[
                    styles.modalOptionText,
                    calendarView.month === index && styles.modalOptionTextSelected
                  ]}>
                    {month}
                  </Text>
                  {calendarView.month === index && (
                    <Icon name="checkmark" size={20} color="#3b82f6" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

export default CalendarTab;