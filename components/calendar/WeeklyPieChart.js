// =====================================
// components/calendar/WeeklyPieChart.js - CLEAN VERSION WITH NO YEAR INDICATOR
// =====================================
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, TouchableWithoutFeedback, ScrollView, Modal } from 'react-native';
import Svg, { Path, G, Circle, Text as SvgText, Line, Rect } from 'react-native-svg';
import Icon from '../common/Icon';
import { getWeeklyPieData, getMonthlyPieData, getYearlyPieData } from '../../utils/savingsUtils';
import { styles } from '../../styles/calendar';

const { width } = Dimensions.get('window');
const CHART_SIZE = width - 60;
const CENTER_X = CHART_SIZE / 2;
const CENTER_Y = CHART_SIZE / 2;
const RADIUS = (CHART_SIZE / 2) - 60;
const INNER_RADIUS = RADIUS * 0.6;

const WeeklyPieChart = ({ dailySavings, weekStart, weekEnd, currentMonth, currentYear }) => {
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('weekly'); // 'weekly', 'monthly', 'yearly'
  const [showDatePicker, setShowDatePicker] = useState(false); // ONLY modal state
  
  // State for navigation
  const [selectedWeek, setSelectedWeek] = useState({ start: weekStart, end: weekEnd });
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  // Update selected week when props change
  useEffect(() => {
    if (weekStart && weekEnd) {
      const normalizedStart = new Date(weekStart);
      normalizedStart.setHours(0, 0, 0, 0);
      
      const normalizedEnd = new Date(weekEnd);
      normalizedEnd.setHours(23, 59, 59, 999);
      
      setSelectedWeek({ start: normalizedStart, end: normalizedEnd });
    }
  }, [weekStart, weekEnd]);
  
  // Update selected month when week changes
  useEffect(() => {
    if (chartPeriod === 'weekly' && selectedWeek && selectedWeek.start) {
      const midWeek = new Date(selectedWeek.start);
      midWeek.setDate(midWeek.getDate() + 3);
      const weekMonth = midWeek.getMonth();
      const weekYear = midWeek.getFullYear();
      
      if (weekMonth !== selectedMonth) {
        setSelectedMonth(weekMonth);
      }
      if (weekYear !== selectedYear) {
        setSelectedYear(weekYear);
      }
    }
  }, [selectedWeek, chartPeriod]);

  // Fallback for missing dates
  useEffect(() => {
    if (!selectedWeek.start || !selectedWeek.end) {
      const today = new Date();
      const currentDay = today.getDay();
      const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
      
      const mondayStart = new Date(today);
      mondayStart.setDate(today.getDate() + mondayOffset);
      mondayStart.setHours(0, 0, 0, 0);
      
      const sundayEnd = new Date(mondayStart);
      sundayEnd.setDate(mondayStart.getDate() + 6);
      sundayEnd.setHours(23, 59, 59, 999);
      
      setSelectedWeek({ start: mondayStart, end: sundayEnd });
    }
  }, [selectedWeek]);
  
  // Navigation functions
  const navigatePeriod = (direction) => {
    if (chartPeriod === 'weekly') {
      const currentStart = new Date(selectedWeek.start);
      const currentEnd = new Date(selectedWeek.end);
      
      if (direction === 'prev') {
        const newStart = new Date(currentStart);
        newStart.setDate(newStart.getDate() - 7);
        newStart.setHours(0, 0, 0, 0);
        
        const newEnd = new Date(currentEnd);
        newEnd.setDate(newEnd.getDate() - 7);
        newEnd.setHours(23, 59, 59, 999);
        
        setSelectedWeek({ start: newStart, end: newEnd });
        
        const midWeek = new Date(newStart);
        midWeek.setDate(midWeek.getDate() + 3);
        setSelectedMonth(midWeek.getMonth());
        setSelectedYear(midWeek.getFullYear());
      } else if (direction === 'next') {
        const newStart = new Date(currentStart);
        newStart.setDate(newStart.getDate() + 7);
        newStart.setHours(0, 0, 0, 0);
        
        const newEnd = new Date(currentEnd);
        newEnd.setDate(newEnd.getDate() + 7);
        newEnd.setHours(23, 59, 59, 999);
        
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        if (newStart <= today) {
          setSelectedWeek({ start: newStart, end: newEnd });
          
          const midWeek = new Date(newStart);
          midWeek.setDate(midWeek.getDate() + 3);
          setSelectedMonth(midWeek.getMonth());
          setSelectedYear(midWeek.getFullYear());
        }
      }
    } else if (chartPeriod === 'monthly') {
      if (direction === 'prev') {
        if (selectedMonth === 0) {
          if (selectedYear > 2020) {
            setSelectedMonth(11);
            setSelectedYear(selectedYear - 1);
          }
        } else {
          setSelectedMonth(selectedMonth - 1);
        }
      } else {
        const currentDate = new Date();
        const isCurrentYear = selectedYear === currentDate.getFullYear();
        
        if (selectedMonth === 11) {
          const nextYear = selectedYear + 1;
          if (nextYear <= currentDate.getFullYear()) {
            setSelectedMonth(0);
            setSelectedYear(nextYear);
          }
        } else {
          const nextMonth = selectedMonth + 1;
          if (!isCurrentYear || nextMonth <= currentDate.getMonth()) {
            setSelectedMonth(nextMonth);
          }
        }
      }
    } else if (chartPeriod === 'yearly') {
      const newYear = selectedYear + (direction === 'prev' ? -1 : 1);
      const currentYear = new Date().getFullYear();
      
      if (newYear >= 2020 && newYear <= currentYear) {
        setSelectedYear(newYear);
      }
    }
    
    setSelectedSlice(null);
  };
  
  // Check navigation capabilities
  const canNavigateBackward = () => {
    if (chartPeriod === 'weekly') {
      const prevWeekStart = new Date(selectedWeek.start);
      prevWeekStart.setDate(prevWeekStart.getDate() - 7);
      const minDate = new Date(2020, 0, 1);
      return prevWeekStart >= minDate;
    } else if (chartPeriod === 'monthly') {
      return !(selectedMonth === 0 && selectedYear === 2020);
    } else if (chartPeriod === 'yearly') {
      return selectedYear > 2020;
    }
    return false;
  };
  
  const canNavigateForward = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (chartPeriod === 'weekly') {
      const currentWeekEnd = new Date(selectedWeek.end);
      const nextWeekStart = new Date(currentWeekEnd);
      nextWeekStart.setDate(nextWeekStart.getDate() + 1);
      nextWeekStart.setHours(0, 0, 0, 0);
      
      return nextWeekStart <= today;
    } else if (chartPeriod === 'monthly') {
      const currentDate = new Date();
      const isCurrentYear = selectedYear === currentDate.getFullYear();
      
      if (selectedMonth === 11) return false;
      
      if (isCurrentYear) {
        return selectedMonth < currentDate.getMonth();
      }
      
      return true;
    } else if (chartPeriod === 'yearly') {
      return selectedYear < new Date().getFullYear();
    }
    return false;
  };
  
  // Get data based on selected period
  const getPieData = () => {
    switch(chartPeriod) {
      case 'monthly':
        return getMonthlyPieData(dailySavings, selectedMonth, selectedYear);
      case 'yearly':
        return getYearlyPieData(dailySavings, selectedYear);
      case 'weekly':
      default:
        return getWeeklyPieData(dailySavings, selectedWeek.start, selectedWeek.end);
    }
  };
  
  const pieData = getPieData();
  const totalSavings = pieData.reduce((sum, item) => sum + item.amount, 0);
  
  const displayData = pieData.length === 1 
    ? [{ ...pieData[0], forceFullCircle: true }]
    : pieData;
  
  // CLEAN Format date range - no year indicator
  const formatDateRange = () => {
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const monthsShort = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 
                         'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    
    switch(chartPeriod) {
      case 'monthly':
        return months[selectedMonth];
      case 'yearly':
        return `${selectedYear} Yılı`;
      case 'weekly':
      default:
        const startDay = selectedWeek.start.getDate();
        const startMonth = selectedWeek.start.getMonth();
        const endDay = selectedWeek.end.getDate();
        const endMonth = selectedWeek.end.getMonth();
        
        if (startMonth === endMonth) {
          return `${startDay}-${endDay} ${monthsShort[startMonth]}`;
        } else {
          return `${startDay} ${monthsShort[startMonth]} - ${endDay} ${monthsShort[endMonth]}`;
        }
    }
  };
  
  // Get chart title
  const getChartTitle = () => {
    switch(chartPeriod) {
      case 'monthly':
        return 'Aylık Özet';
      case 'yearly':
        return 'Yıllık Özet';
      case 'weekly':
      default:
        return 'Haftalık Özet';
    }
  };
  
  // Modal functions
  const openDatePicker = () => setShowDatePicker(true);
  const closeDatePicker = () => setShowDatePicker(false);
  
  // Helper functions for modal
  const getWeeksInYear = (year) => {
    const weeks = [];
    const startDate = new Date(year, 0, 1);
    
    let current = new Date(startDate);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    current.setDate(diff);
    current.setHours(0, 0, 0, 0);
    
    while (current.getFullYear() <= year) {
      const weekStart = new Date(current);
      const weekEnd = new Date(current);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      if (weekStart.getFullYear() === year) {
        weeks.push({ start: weekStart, end: weekEnd });
      }
      
      current.setDate(current.getDate() + 7);
      if (current.getFullYear() > year) break;
    }
    
    return weeks;
  };
  
  const getMonthsInYear = () => {
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return months.map((name, index) => ({ month: index, name }));
  };
  
  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    let earliestYear = currentYear;
    Object.keys(dailySavings).forEach(dateStr => {
      if (!dateStr.includes('_removed')) {
        const year = parseInt(dateStr.split('-')[0]);
        if (year < earliestYear && year > 2000) {
          earliestYear = year;
        }
      }
    });
    
    if (earliestYear === currentYear || Object.keys(dailySavings).length === 0) {
      earliestYear = Math.max(2020, currentYear - 5);
    }
    
    for (let year = earliestYear; year <= currentYear; year++) {
      years.push(year);
    }
    
    return years.reverse();
  };
  
  const formatWeekForDropdown = (week) => {
    const monthsShort = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 
                         'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    
    const startDay = week.start.getDate();
    const startMonth = week.start.getMonth();
    const startYear = week.start.getFullYear().toString().slice(-2);
    const endDay = week.end.getDate();
    const endMonth = week.end.getMonth();
    const endYear = week.end.getFullYear().toString().slice(-2);
    
    if (startMonth === endMonth && startYear === endYear) {
      return `${startDay}-${endDay} ${monthsShort[startMonth]}`;
    } else if (startYear === endYear) {
      return `${startDay} ${monthsShort[startMonth]} - ${endDay} ${monthsShort[endMonth]}`;
    } else {
      return `${startDay} ${monthsShort[startMonth]} ${startYear} - ${endDay} ${monthsShort[endMonth]} ${endYear}`;
    }
  };
  
  const handleDateSelection = (type, value) => {
    if (type === 'week') {
      setSelectedWeek(value);
      const midWeek = new Date(value.start);
      midWeek.setDate(midWeek.getDate() + 3);
      setSelectedMonth(midWeek.getMonth());
      setSelectedYear(midWeek.getFullYear());
    } else if (type === 'month') {
      setSelectedMonth(value);
    } else if (type === 'year') {
      setSelectedYear(value);
      if (chartPeriod === 'weekly') {
        const firstWeek = new Date(value, 0, 1);
        const dayOfWeek = firstWeek.getDay();
        const diff = firstWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        firstWeek.setDate(diff);
        firstWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(firstWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        setSelectedWeek({ start: firstWeek, end: endOfWeek });
        setSelectedMonth(0);
      } else if (chartPeriod === 'monthly') {
        const currentDate = new Date();
        if (value === currentDate.getFullYear() && selectedMonth > currentDate.getMonth()) {
          setSelectedMonth(currentDate.getMonth());
        }
      }
    }
    
    setSelectedSlice(null);
    closeDatePicker();
  };
  
  // Pie chart creation
  const createPieSlices = () => {
    if (totalSavings === 0) return [];
    
    let currentAngle = -90;
    
    return displayData.map((item, index) => {
      const percentage = item.forceFullCircle ? 1 : item.amount / totalSavings;
      const angle = item.forceFullCircle ? 359.9 : percentage * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;
      
      const isSelected = selectedSlice && selectedSlice.name === item.name;
      const scale = isSelected ? 1.03 : 1;
      
      const midAngle = (startAngle + endAngle) / 2;
      const midAngleRad = (midAngle * Math.PI) / 180;
      const offsetX = isSelected ? 6 * Math.cos(midAngleRad) : 0;
      const offsetY = isSelected ? 6 * Math.sin(midAngleRad) : 0;
      
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
      const scaledRadius = RADIUS * scale;
      const scaledInnerRadius = INNER_RADIUS * scale;
      
      const x1 = CENTER_X + offsetX + scaledRadius * Math.cos(startAngleRad);
      const y1 = CENTER_Y + offsetY + scaledRadius * Math.sin(startAngleRad);
      const x2 = CENTER_X + offsetX + scaledRadius * Math.cos(endAngleRad);
      const y2 = CENTER_Y + offsetY + scaledRadius * Math.sin(endAngleRad);
      
      const x3 = CENTER_X + offsetX + scaledInnerRadius * Math.cos(startAngleRad);
      const y3 = CENTER_Y + offsetY + scaledInnerRadius * Math.sin(startAngleRad);
      const x4 = CENTER_X + offsetX + scaledInnerRadius * Math.cos(endAngleRad);
      const y4 = CENTER_Y + offsetY + scaledInnerRadius * Math.sin(endAngleRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const pathData = [
        `M ${x3} ${y3}`,
        `L ${x1} ${y1}`,
        `A ${scaledRadius} ${scaledRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${x4} ${y4}`,
        `A ${scaledInnerRadius} ${scaledInnerRadius} 0 ${largeArcFlag} 0 ${x3} ${y3}`,
        'Z'
      ].join(' ');
      
      const labelAngle = (startAngle + endAngle) / 2;
      const labelAngleRad = (labelAngle * Math.PI) / 180;
      const labelRadius = (scaledRadius + scaledInnerRadius) / 2;
      const labelX = CENTER_X + offsetX + labelRadius * Math.cos(labelAngleRad);
      const labelY = CENTER_Y + offsetY + labelRadius * Math.sin(labelAngleRad);
      
      const idealRadius = RADIUS + 35;
      const rawX = CENTER_X + idealRadius * Math.cos(midAngleRad);
      const rawY = CENTER_Y + idealRadius * Math.sin(midAngleRad);
      
      const labelBoxWidth = 90;
      const labelBoxHeight = 40;
      const padding = 8;
      
      const minX = labelBoxWidth/2 + padding;
      const maxX = CHART_SIZE - labelBoxWidth/2 - padding;
      const minY = labelBoxHeight/2 + padding;
      const maxY = CHART_SIZE - labelBoxHeight/2 - padding;
      
      const externalLabelX = Math.max(minX, Math.min(rawX, maxX));
      const externalLabelY = Math.max(minY, Math.min(rawY, maxY));
      
      const arrowStartRadius = RADIUS + (isSelected ? 8 : 0);
      const arrowStartX = CENTER_X + arrowStartRadius * Math.cos(midAngleRad);
      const arrowStartY = CENTER_Y + arrowStartRadius * Math.sin(midAngleRad);
      
      return {
        pathData,
        color: item.color,
        percentage,
        item,
        labelX,
        labelY,
        externalLabelX,
        externalLabelY,
        arrowStartX,
        arrowStartY,
        midAngleRad,
        showLabel: angle > 20 && !isSelected,
        index,
        isSelected,
        offsetX,
        offsetY
      };
    });
  };
  
  const slices = createPieSlices();
  
  const handleSlicePress = (item) => {
    if (selectedSlice && selectedSlice.name === item.name) {
      setSelectedSlice(null);
    } else {
      setSelectedSlice(item);
    }
  };
  
  const handleChartPress = (event) => {
    try {
      const { locationX, locationY } = event.nativeEvent;
      
      const x = locationX - CENTER_X;
      const y = locationY - CENTER_Y;
      
      let angle = Math.atan2(y, x) * 180 / Math.PI;
      angle = angle + 90;
      if (angle < 0) angle += 360;
      
      const distance = Math.sqrt(x * x + y * y);
      
      const innerBound = INNER_RADIUS * 0.9;
      const outerBound = RADIUS * 1.1;
      
      if (distance < innerBound || distance > outerBound) {
        setSelectedSlice(null);
        return;
      }
      
      let currentAngle = 0;
      for (const item of displayData) {
        const slicePercentage = item.forceFullCircle ? 1 : item.amount / totalSavings;
        const sliceAngle = item.forceFullCircle ? 359.9 : slicePercentage * 360;
        
        if (angle >= currentAngle - 1 && angle <= currentAngle + sliceAngle + 1) {
          handleSlicePress(item);
          return;
        }
        currentAngle += sliceAngle;
      }
      
      setSelectedSlice(null);
    } catch (error) {
      console.log('Touch detection error:', error);
    }
  };
  
  // Empty state
  if (totalSavings === 0) {
    return (
      <View style={styles.weeklyChartContainer}>
        <View style={styles.weeklyChartHeader}>
          <View style={styles.chartHeaderTop}>
            <Text style={styles.weeklyChartTitle}>{getChartTitle()}</Text>
            <View style={styles.chartViewSelector}>
              <TouchableOpacity
                style={[styles.chartViewButton, chartPeriod === 'weekly' && styles.activeChartView]}
                onPress={() => setChartPeriod('weekly')}
              >
                <Text style={[styles.chartViewText, chartPeriod === 'weekly' && styles.activeChartViewText]}>
                  H
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chartViewButton, chartPeriod === 'monthly' && styles.activeChartView]}
                onPress={() => setChartPeriod('monthly')}
              >
                <Text style={[styles.chartViewText, chartPeriod === 'monthly' && styles.activeChartViewText]}>
                  A
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chartViewButton, chartPeriod === 'yearly' && styles.activeChartView]}
                onPress={() => setChartPeriod('yearly')}
              >
                <Text style={[styles.chartViewText, chartPeriod === 'yearly' && styles.activeChartViewText]}>
                  Y
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.periodNavigator}>
            <TouchableOpacity
              style={[styles.navButton, !canNavigateBackward() && styles.navButtonDisabled]}
              onPress={() => canNavigateBackward() && navigatePeriod('prev')}
              disabled={!canNavigateBackward()}
            >
              <Icon name="chevron-back" size={20} color={canNavigateBackward() ? "#666" : "#ccc"} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dateSelector} onPress={openDatePicker}>
              <Text style={styles.weeklyChartDate}>{formatDateRange()}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.navButton, !canNavigateForward() && styles.navButtonDisabled]}
              onPress={() => canNavigateForward() && navigatePeriod('next')}
              disabled={!canNavigateForward()}
            >
              <Icon name="chevron-forward" size={20} color={canNavigateForward() ? "#666" : "#ccc"} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.emptyChartContainer}>
          <Text style={styles.emptyChartText}>
            {chartPeriod === 'yearly' ? 'Bu yıl' : chartPeriod === 'monthly' ? 'Bu ay' : 'Bu hafta'} henüz tasarruf yok
          </Text>
        </View>
        
        {/* DATE PICKER MODAL */}
        <Modal
          visible={showDatePicker}
          animationType="slide"
          transparent={true}
          onRequestClose={closeDatePicker}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.datePickerModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {chartPeriod === 'yearly' ? 'Yıl Seçin' : chartPeriod === 'monthly' ? 'Ay ve Yıl Seçin' : 'Hafta ve Yıl Seçin'}
                </Text>
                <TouchableOpacity onPress={closeDatePicker} style={styles.modalCloseButton}>
                  <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              {chartPeriod === 'yearly' ? (
                <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                  <View style={styles.sectionTitle}>
                    <Text style={styles.sectionTitleText}>Yıl</Text>
                  </View>
                  {getAvailableYears().map(year => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.modalOption,
                        year === selectedYear && styles.modalOptionSelected
                      ]}
                      onPress={() => handleDateSelection('year', year)}
                    >
                      <Text style={[
                        styles.modalOptionText,
                        year === selectedYear && styles.modalOptionTextSelected
                      ]}>
                        {year}
                      </Text>
                      {year === selectedYear && (
                        <View style={styles.selectedCheck}>
                          <Icon name="checkmark" size={20} color="#3b82f6" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : chartPeriod === 'monthly' ? (
                <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                  <View style={styles.sectionTitle}>
                    <Text style={styles.sectionTitleText}>Yıl</Text>
                  </View>
                  <View style={styles.yearGrid}>
                    {getAvailableYears().map(year => (
                      <TouchableOpacity
                        key={year}
                        style={[
                          styles.yearGridItem,
                          year === selectedYear && styles.yearGridItemSelected
                        ]}
                        onPress={() => handleDateSelection('year', year)}
                      >
                        <Text style={[
                          styles.yearGridText,
                          year === selectedYear && styles.yearGridTextSelected
                        ]}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  <View style={styles.sectionTitle}>
                    <Text style={styles.sectionTitleText}>{selectedYear} Yılı Ayları</Text>
                  </View>
                  {getMonthsInYear().map((month) => {
                    const isSelected = month.month === selectedMonth;
                    const currentDate = new Date();
                    const isFuture = selectedYear === currentDate.getFullYear() && 
                                    month.month > currentDate.getMonth();
                    
                    return (
                      <TouchableOpacity
                        key={month.month}
                        style={[
                          styles.modalOption,
                          isSelected && styles.modalOptionSelected,
                          isFuture && styles.modalOptionDisabled
                        ]}
                        onPress={() => !isFuture && handleDateSelection('month', month.month)}
                        disabled={isFuture}
                      >
                        <Text style={[
                          styles.modalOptionText,
                          isSelected && styles.modalOptionTextSelected,
                          isFuture && styles.modalOptionTextDisabled
                        ]}>
                          {month.name}
                        </Text>
                        {isSelected && (
                          <View style={styles.selectedCheck}>
                            <Icon name="checkmark" size={20} color="#3b82f6" />
                          </View>
                        )}
                        {isFuture && (
                          <Text style={styles.futureLabel}>Gelecek</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              ) : (
                <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                  <View style={styles.sectionTitle}>
                    <Text style={styles.sectionTitleText}>Yıl</Text>
                  </View>
                  <View style={styles.yearGrid}>
                    {getAvailableYears().map(year => (
                      <TouchableOpacity
                        key={year}
                        style={[
                          styles.yearGridItem,
                          year === selectedWeek.start.getFullYear() && styles.yearGridItemSelected
                        ]}
                        onPress={() => handleDateSelection('year', year)}
                      >
                        <Text style={[
                          styles.yearGridText,
                          year === selectedWeek.start.getFullYear() && styles.yearGridTextSelected
                        ]}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  <View style={styles.sectionTitle}>
                    <Text style={styles.sectionTitleText}>{selectedWeek.start.getFullYear()} Yılı Haftaları</Text>
                  </View>
                  {getWeeksInYear(selectedWeek.start.getFullYear()).map((week, index) => {
                    const isSelected = week.start.getTime() === selectedWeek.start.getTime();
                    const isFuture = week.start > new Date();
                    
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.modalOption,
                          isSelected && styles.modalOptionSelected,
                          isFuture && styles.modalOptionDisabled
                        ]}
                        onPress={() => !isFuture && handleDateSelection('week', week)}
                        disabled={isFuture}
                      >
                        <Text style={[
                          styles.modalOptionText,
                          isSelected && styles.modalOptionTextSelected,
                          isFuture && styles.modalOptionTextDisabled
                        ]}>
                          {formatWeekForDropdown(week)}
                        </Text>
                        {isSelected && (
                          <View style={styles.selectedCheck}>
                            <Icon name="checkmark" size={20} color="#3b82f6" />
                          </View>
                        )}
                        {isFuture && (
                          <Text style={styles.futureLabel}>Gelecek</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  
  return (
    <View style={styles.weeklyChartContainer}>
      <View style={styles.weeklyChartHeader}>
        <View style={styles.chartHeaderTop}>
          <Text style={styles.weeklyChartTitle}>{getChartTitle()}</Text>
          <View style={styles.chartViewSelector}>
            <TouchableOpacity
              style={[styles.chartViewButton, chartPeriod === 'weekly' && styles.activeChartView]}
              onPress={() => setChartPeriod('weekly')}
            >
              <Text style={[styles.chartViewText, chartPeriod === 'weekly' && styles.activeChartViewText]}>
                H
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chartViewButton, chartPeriod === 'monthly' && styles.activeChartView]}
              onPress={() => setChartPeriod('monthly')}
            >
              <Text style={[styles.chartViewText, chartPeriod === 'monthly' && styles.activeChartViewText]}>
                A
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chartViewButton, chartPeriod === 'yearly' && styles.activeChartView]}
              onPress={() => setChartPeriod('yearly')}
            >
              <Text style={[styles.chartViewText, chartPeriod === 'yearly' && styles.activeChartViewText]}>
                Y
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.periodNavigator}>
          <TouchableOpacity
            style={[styles.navButton, !canNavigateBackward() && styles.navButtonDisabled]}
            onPress={() => canNavigateBackward() && navigatePeriod('prev')}
            disabled={!canNavigateBackward()}
          >
            <Icon name="chevron-back" size={20} color={canNavigateBackward() ? "#666" : "#ccc"} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.dateSelector} onPress={openDatePicker}>
            <Text style={styles.weeklyChartDate}>{formatDateRange()}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navButton, !canNavigateForward() && styles.navButtonDisabled]}
            onPress={() => canNavigateForward() && navigatePeriod('next')}
            disabled={!canNavigateForward()}
          >
            <Icon name="chevron-forward" size={20} color={canNavigateForward() ? "#666" : "#ccc"} />
          </TouchableOpacity>
        </View>
        
        <Text style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, textAlign: 'center' }}>
          Detaylar için butona dokunun
        </Text>
      </View>
      
      {/* Pie Chart */}
      <View style={styles.pieChartWrapper}>
        <TouchableWithoutFeedback onPress={handleChartPress}>
          <Svg width={CHART_SIZE} height={CHART_SIZE}>
            <G>
              {slices.map((slice) => (
                <G key={slice.index}>
                  {slice.isSelected && (
                    <Path
                      d={slice.pathData}
                      fill={slice.color}
                      opacity="0.3"
                      transform={`translate(2, 2)`}
                    />
                  )}
                  <Path
                    d={slice.pathData}
                    fill={slice.color}
                    stroke="#fff"
                    strokeWidth={slice.isSelected ? "3" : "2"}
                    opacity={slice.isSelected ? 1 : 0.9}
                  />
                  {slice.isSelected && (
                    <>
                      <Line
                        x1={slice.arrowStartX}
                        y1={slice.arrowStartY}
                        x2={slice.externalLabelX}
                        y2={slice.externalLabelY}
                        stroke={slice.color}
                        strokeWidth="2"
                        strokeDasharray="5,3"
                      />
                      <Circle
                        cx={slice.externalLabelX}
                        cy={slice.externalLabelY}
                        r="3"
                        fill={slice.color}
                      />
                    </>
                  )}
                </G>
              ))}
            </G>
            {slices.map((slice) => (
              slice.showLabel && (
                <SvgText
                  key={`label-${slice.index}`}
                  x={slice.labelX}
                  y={slice.labelY}
                  fill="#fff"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {(slice.percentage * 100).toFixed(0)}%
                </SvgText>
              )
            ))}
            {slices.map((slice) => (
              slice.isSelected && (
                <G key={`external-label-${slice.index}`}>
                  <Rect
                    x={slice.externalLabelX - 45}
                    y={slice.externalLabelY - 20}
                    width="90"
                    height="40"
                    rx="8"
                    fill="white"
                    fillOpacity="0.95"
                    stroke={slice.color}
                    strokeWidth="2"
                  />
                  <SvgText
                    x={slice.externalLabelX}
                    y={slice.externalLabelY - 3}
                    fill={slice.color}
                    fontSize="13"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {slice.item.name}
                  </SvgText>
                  <SvgText
                    x={slice.externalLabelX}
                    y={slice.externalLabelY + 14}
                    fill={slice.color}
                    fontSize="15"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {slice.item.amount.toFixed(0)}₺
                  </SvgText>
                </G>
              )
            ))}
          </Svg>
        </TouchableWithoutFeedback>
        
        <View style={styles.pieChartCenter} pointerEvents="none">
          <Text style={styles.pieCenterLabel}>Toplam</Text>
          <Text style={styles.pieCenterAmount}>{totalSavings.toFixed(0)}₺</Text>
        </View>
      </View>
      
      {/* Selection Buttons */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 15, justifyContent: 'center' }}>
        {pieData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 6,
              margin: 4,
              borderRadius: 15,
              backgroundColor: selectedSlice && selectedSlice.name === item.name ? item.color : '#f3f4f6',
              borderWidth: 1,
              borderColor: item.color,
            }}
            onPress={() => handleSlicePress(item)}
          >
            <View style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: item.color,
              marginRight: 6,
            }} />
            <Text style={{
              fontSize: 12,
              color: selectedSlice && selectedSlice.name === item.name ? '#fff' : '#374151',
              fontWeight: selectedSlice && selectedSlice.name === item.name ? 'bold' : 'normal',
            }}>
              {item.name}: {item.amount.toFixed(0)}₺
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Top 3 Items */}
      {pieData.length > 0 && (
        <View style={styles.topItemsContainer}>
          <Text style={styles.topItemsTitle}>En Çok Tasarruf:</Text>
          {pieData.slice(0, 3).map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.topItem}
              onPress={() => handleSlicePress(item)}
            >
              <View style={[styles.topItemRank, { 
                backgroundColor: item.color,
                borderWidth: selectedSlice && selectedSlice.name === item.name ? 2 : 0,
                borderColor: '#fff'
              }]}>
                <Text style={styles.topItemRankText}>{index + 1}</Text>
              </View>
              <Text style={[
                styles.topItemName,
                selectedSlice && selectedSlice.name === item.name && { fontWeight: 'bold' }
              ]}>{item.name}</Text>
              <Text style={[
                styles.topItemAmount,
                selectedSlice && selectedSlice.name === item.name && { fontWeight: 'bold' }
              ]}>
                {item.amount.toFixed(0)}₺
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {/* DATE PICKER MODAL */}
      <Modal
        visible={showDatePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={closeDatePicker}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {chartPeriod === 'yearly' ? 'Yıl Seçin' : chartPeriod === 'monthly' ? 'Ay ve Yıl Seçin' : 'Hafta ve Yıl Seçin'}
              </Text>
              <TouchableOpacity onPress={closeDatePicker} style={styles.modalCloseButton}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {chartPeriod === 'yearly' ? (
              <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionTitleText}>Yıl</Text>
                </View>
                {getAvailableYears().map(year => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.modalOption,
                      year === selectedYear && styles.modalOptionSelected
                    ]}
                    onPress={() => handleDateSelection('year', year)}
                  >
                    <Text style={[
                      styles.modalOptionText,
                      year === selectedYear && styles.modalOptionTextSelected
                    ]}>
                      {year}
                    </Text>
                    {year === selectedYear && (
                      <View style={styles.selectedCheck}>
                        <Icon name="checkmark" size={20} color="#3b82f6" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : chartPeriod === 'monthly' ? (
              <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionTitleText}>Yıl</Text>
                </View>
                <View style={styles.yearGrid}>
                  {getAvailableYears().map(year => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.yearGridItem,
                        year === selectedYear && styles.yearGridItemSelected
                      ]}
                      onPress={() => handleDateSelection('year', year)}
                    >
                      <Text style={[
                        styles.yearGridText,
                        year === selectedYear && styles.yearGridTextSelected
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionTitleText}>{selectedYear} Yılı Ayları</Text>
                </View>
                {getMonthsInYear().map((month) => {
                  const isSelected = month.month === selectedMonth;
                  const currentDate = new Date();
                  const isFuture = selectedYear === currentDate.getFullYear() && 
                                  month.month > currentDate.getMonth();
                  
                  return (
                    <TouchableOpacity
                      key={month.month}
                      style={[
                        styles.modalOption,
                        isSelected && styles.modalOptionSelected,
                        isFuture && styles.modalOptionDisabled
                      ]}
                      onPress={() => !isFuture && handleDateSelection('month', month.month)}
                      disabled={isFuture}
                    >
                      <Text style={[
                        styles.modalOptionText,
                        isSelected && styles.modalOptionTextSelected,
                        isFuture && styles.modalOptionTextDisabled
                      ]}>
                        {month.name}
                      </Text>
                      {isSelected && (
                        <View style={styles.selectedCheck}>
                          <Icon name="checkmark" size={20} color="#3b82f6" />
                        </View>
                      )}
                      {isFuture && (
                        <Text style={styles.futureLabel}>Gelecek</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : (
              <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionTitleText}>Yıl</Text>
                </View>
                <View style={styles.yearGrid}>
                  {getAvailableYears().map(year => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.yearGridItem,
                        year === selectedWeek.start.getFullYear() && styles.yearGridItemSelected
                      ]}
                      onPress={() => handleDateSelection('year', year)}
                    >
                      <Text style={[
                        styles.yearGridText,
                        year === selectedWeek.start.getFullYear() && styles.yearGridTextSelected
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionTitleText}>{selectedWeek.start.getFullYear()} Yılı Haftaları</Text>
                </View>
                {getWeeksInYear(selectedWeek.start.getFullYear()).map((week, index) => {
                  const isSelected = week.start.getTime() === selectedWeek.start.getTime();
                  const isFuture = week.start > new Date();
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.modalOption,
                        isSelected && styles.modalOptionSelected,
                        isFuture && styles.modalOptionDisabled
                      ]}
                      onPress={() => !isFuture && handleDateSelection('week', week)}
                      disabled={isFuture}
                    >
                      <Text style={[
                        styles.modalOptionText,
                        isSelected && styles.modalOptionTextSelected,
                        isFuture && styles.modalOptionTextDisabled
                      ]}>
                        {formatWeekForDropdown(week)}
                      </Text>
                      {isSelected && (
                        <View style={styles.selectedCheck}>
                          <Icon name="checkmark" size={20} color="#3b82f6" />
                        </View>
                      )}
                      {isFuture && (
                        <Text style={styles.futureLabel}>Gelecek</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WeeklyPieChart;