// =====================================
// components/calendar/WeeklyPieChart.js - FIXED VERSION
// =====================================
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, TouchableWithoutFeedback, ScrollView } from 'react-native';
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
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showPeriodPicker, setShowPeriodPicker] = useState(false); // ADDED MISSING STATE
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showWeekPicker, setShowWeekPicker] = useState(false);
  
  // State for navigation
  const [selectedWeek, setSelectedWeek] = useState({ start: weekStart, end: weekEnd });
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  // Update selected week when props change
  useEffect(() => {
    if (weekStart && weekEnd) {
      // Ensure dates are properly set to start/end of day
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
      // Update selected month based on the week's midpoint
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeek, chartPeriod]);

  // Additional useEffect to ensure we have valid dates
  useEffect(() => {
    if (!selectedWeek.start || !selectedWeek.end) {
      console.log('WeeklyPieChart - Missing week dates, using current week');
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
  
  // ADDED MISSING FUNCTION: Get weeks in a year
  const getWeeksInYear = (year) => {
    const weeks = [];
    const startDate = new Date(year, 0, 1); // January 1st
    
    // Find first Monday of the year
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
      
      // Include week if it starts in the target year
      if (weekStart.getFullYear() === year) {
        weeks.push({ start: weekStart, end: weekEnd });
      }
      
      // Move to next week
      current.setDate(current.getDate() + 7);
      
      // Break if we've gone past the year
      if (current.getFullYear() > year) break;
    }
    
    return weeks;
  };
  
  // ADDED MISSING FUNCTION: Get months in a year
  const getMonthsInYear = () => {
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return months.map((name, index) => ({ month: index, name }));
  };
  
  // ADDED MISSING FUNCTION: Handle period selection
  const handlePeriodSelect = (period) => {
    if (chartPeriod === 'weekly') {
      setSelectedWeek(period);
    } else if (chartPeriod === 'monthly') {
      setSelectedMonth(period.month);
    }
    setShowPeriodPicker(false);
    setSelectedSlice(null);
  };
  
  // Navigation functions - FIXED for cross-month navigation
  const navigatePeriod = (direction) => {
    setShowYearPicker(false);
    setShowMonthPicker(false);
    setShowWeekPicker(false);
    setShowPeriodPicker(false);
    
    if (chartPeriod === 'weekly') {
      // Simple week navigation - just add/subtract 7 days
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
        
        // Update month and year based on new week
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
        
        // Check if next week is not in future
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        if (newStart <= today) {
          setSelectedWeek({ start: newStart, end: newEnd });
          
          // Update month and year based on new week
          const midWeek = new Date(newStart);
          midWeek.setDate(midWeek.getDate() + 3);
          setSelectedMonth(midWeek.getMonth());
          setSelectedYear(midWeek.getFullYear());
        }
      }
    } else if (chartPeriod === 'monthly') {
      if (direction === 'prev') {
        if (selectedMonth === 0) {
          // Go to December of previous year
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
          // Go to January of next year
          const nextYear = selectedYear + 1;
          if (nextYear <= currentDate.getFullYear()) {
            setSelectedMonth(0);
            setSelectedYear(nextYear);
          }
        } else {
          const nextMonth = selectedMonth + 1;
          // Check if next month is not in future
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
  
  // Check if can navigate backward - FIXED for cross-month navigation
  const canNavigateBackward = () => {
    if (chartPeriod === 'weekly') {
      // Check if previous week exists (not going too far back)
      const prevWeekStart = new Date(selectedWeek.start);
      prevWeekStart.setDate(prevWeekStart.getDate() - 7);
      
      // Allow going back to 2020
      const minDate = new Date(2020, 0, 1);
      return prevWeekStart >= minDate;
    } else if (chartPeriod === 'monthly') {
      // Can go back if not at January 2020
      return !(selectedMonth === 0 && selectedYear === 2020);
    } else if (chartPeriod === 'yearly') {
      return selectedYear > 2020;
    }
    return false;
  };
  
  // Check if can navigate forward - FIXED for cross-month navigation
  const canNavigateForward = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (chartPeriod === 'weekly') {
      // Instead of just checking current month, check if next week exists in any future month
      const currentWeekEnd = new Date(selectedWeek.end);
      const nextWeekStart = new Date(currentWeekEnd);
      nextWeekStart.setDate(nextWeekStart.getDate() + 1);
      nextWeekStart.setHours(0, 0, 0, 0);
      
      // Can navigate forward if next week start is not in the future
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
  
  // Handle single item display
  const displayData = pieData.length === 1 
    ? [{ ...pieData[0], forceFullCircle: true }]
    : pieData;
  
  // Format date range based on period (always with years)
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
        const startYear = selectedWeek.start.getFullYear().toString().slice(-2);
        const endDay = selectedWeek.end.getDate();
        const endMonth = selectedWeek.end.getMonth();
        const endYear = selectedWeek.end.getFullYear().toString().slice(-2);
        
        // Always show years for clarity
        if (startMonth === endMonth && startYear === endYear) {
          // Same month and year: "18-24 Ağu 25"
          return `${startDay}-${endDay} ${monthsShort[startMonth]} ${startYear}`;
        } else if (startYear === endYear) {
          // Different months, same year: "28 Tem - 3 Ağu 25"
          return `${startDay} ${monthsShort[startMonth]} - ${endDay} ${monthsShort[endMonth]} ${endYear}`;
        } else {
          // Different years: "30 Ara 24 - 5 Oca 25"
          return `${startDay} ${monthsShort[startMonth]} ${startYear} - ${endDay} ${monthsShort[endMonth]} ${endYear}`;
        }
    }
  };
  
  // Get weeks in a specific month
  const getWeeksInMonth = (month, year) => {
    const weeks = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the first day of the month
    let current = new Date(firstDay);
    
    while (current <= lastDay) {
      // Find Monday of this week
      const weekStart = new Date(current);
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
      weekStart.setDate(diff);
      weekStart.setHours(0, 0, 0, 0);
      
      // Find Sunday of this week
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      // Include week if it has at least one day in the target month
      if ((weekStart.getMonth() === month && weekStart.getFullYear() === year) ||
          (weekEnd.getMonth() === month && weekEnd.getFullYear() === year) ||
          (weekStart.getMonth() < month && weekEnd.getMonth() > month)) {
        
        // Check if this week is not already added
        const exists = weeks.some(w => w.start.getTime() === weekStart.getTime());
        if (!exists) {
          weeks.push({ start: weekStart, end: weekEnd });
        }
      }
      
      // Move to next week
      current.setDate(current.getDate() + 7);
    }
    
    return weeks;
  };
  
  // Format week for dropdown display (with years when needed)
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
  
  // Handle week selection
  const handleWeekSelect = (week) => {
    setSelectedWeek(week);
    setShowWeekPicker(false);
    setShowPeriodPicker(false); // ADDED
    setSelectedSlice(null);
  };
  
  // Handle month selection
  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    
    if (chartPeriod === 'weekly') {
      // Find first week of the selected month
      const weeksInMonth = getWeeksInMonth(month, selectedYear);
      if (weeksInMonth.length > 0) {
        setSelectedWeek(weeksInMonth[0]);
      }
    }
    
    setShowMonthPicker(false);
    setShowPeriodPicker(false); // ADDED
    setSelectedSlice(null);
  };
  
  // Handle year selection
  const handleYearSelect = (year) => {
    setSelectedYear(year);
    
    if (chartPeriod === 'weekly') {
      // Jump to first week of January in the selected year
      const firstWeek = new Date(year, 0, 1);
      const dayOfWeek = firstWeek.getDay();
      const diff = firstWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      firstWeek.setDate(diff);
      firstWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(firstWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      setSelectedWeek({ start: firstWeek, end: endOfWeek });
      setSelectedMonth(0); // January
    } else if (chartPeriod === 'monthly') {
      // Check if current month is valid for the selected year
      const currentDate = new Date();
      if (year === currentDate.getFullYear() && selectedMonth > currentDate.getMonth()) {
        setSelectedMonth(currentDate.getMonth());
      }
    }
    
    setShowYearPicker(false);
    setShowPeriodPicker(false); // ADDED
    setSelectedSlice(null);
  };
  
  // Get all months
  const getAllMonths = () => {
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return months.map((name, index) => ({ month: index, name }));
  };
  
  // Handle year change for weekly/monthly views
  const handleYearChange = (year) => {
    if (chartPeriod === 'weekly') {
      // Update week to first week of selected year
      const firstWeek = new Date(year, 0, 1); // January 1st
      const dayOfWeek = firstWeek.getDay();
      const diff = firstWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      firstWeek.setDate(diff);
      firstWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(firstWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      setSelectedWeek({ start: firstWeek, end: endOfWeek });
    } else if (chartPeriod === 'monthly') {
      setSelectedYear(year);
      // If current month doesn't exist in the selected year (future month), reset to latest available
      const currentDate = new Date();
      if (year === currentDate.getFullYear() && selectedMonth > currentDate.getMonth()) {
        setSelectedMonth(currentDate.getMonth());
      }
    }
    setShowYearPicker(false);
    setShowPeriodPicker(false); // ADDED
    setSelectedSlice(null);
  };
  
  // Get available years (from first saving to current year)
  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    // Get earliest year from savings data
    let earliestYear = currentYear;
    Object.keys(dailySavings).forEach(dateStr => {
      if (!dateStr.includes('_removed')) {
        const year = parseInt(dateStr.split('-')[0]);
        if (year < earliestYear && year > 2000) { // Sanity check for valid years
          earliestYear = year;
        }
      }
    });
    
    // If no savings or all future dates, use a reasonable minimum
    if (earliestYear === currentYear || Object.keys(dailySavings).length === 0) {
      earliestYear = Math.max(2020, currentYear - 5); // Go back max 5 years or to 2020
    }
    
    // Create array from earliest year to current year
    for (let year = earliestYear; year <= currentYear; year++) {
      years.push(year);
    }
    
    return years.reverse(); // Show newest first
  };
  
  // Get chart title based on period
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
  
  // Calculate pie slices
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
  
  if (totalSavings === 0) {
    return (
      <View style={styles.weeklyChartContainer}>
        <View style={styles.weeklyChartHeader}>
          <View style={styles.chartHeaderTop}>
            <Text style={styles.weeklyChartTitle}>{getChartTitle()}</Text>
            <View style={styles.chartViewSelector}>
              <TouchableOpacity
                style={[styles.chartViewButton, chartPeriod === 'weekly' && styles.activeChartView]}
                onPress={() => {
                  setChartPeriod('weekly');
                  setShowYearPicker(false);
                  setShowPeriodPicker(false);
                }}
              >
                <Text style={[styles.chartViewText, chartPeriod === 'weekly' && styles.activeChartViewText]}>
                  H
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chartViewButton, chartPeriod === 'monthly' && styles.activeChartView]}
                onPress={() => {
                  setChartPeriod('monthly');
                  setShowYearPicker(false);
                  setShowPeriodPicker(false);
                }}
              >
                <Text style={[styles.chartViewText, chartPeriod === 'monthly' && styles.activeChartViewText]}>
                  A
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chartViewButton, chartPeriod === 'yearly' && styles.activeChartView]}
                onPress={() => {
                  setChartPeriod('yearly');
                  setShowYearPicker(false);
                  setShowPeriodPicker(false);
                }}
              >
                <Text style={[styles.chartViewText, chartPeriod === 'yearly' && styles.activeChartViewText]}>
                  Y
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Period Navigation */}
          <View style={styles.periodNavigator}>
            <TouchableOpacity
              style={[styles.navButton, !canNavigateBackward() && styles.navButtonDisabled]}
              onPress={() => canNavigateBackward() && navigatePeriod('prev')}
              disabled={!canNavigateBackward()}
            >
              <Icon name="chevron-back" size={20} color={canNavigateBackward() ? "#666" : "#ccc"} />
            </TouchableOpacity>
            
            <View style={styles.periodDisplay}>
              <Text style={styles.weeklyChartDate}>{formatDateRange()}</Text>
              {chartPeriod !== 'yearly' && (
                <TouchableOpacity 
                  style={styles.yearIndicator}
                  onPress={() => setShowYearPicker(true)}
                >
                  <Text style={styles.yearText}>
                    {chartPeriod === 'weekly' ? 
                      (selectedWeek.start.getFullYear() === selectedWeek.end.getFullYear() ? 
                        selectedWeek.start.getFullYear() : 
                        `${selectedWeek.start.getFullYear()}-${selectedWeek.end.getFullYear()}`) 
                      : selectedYear}
                  </Text>
                  <Icon name="chevron-down" size={16} color="#6b7280" />
                </TouchableOpacity>
              )}
            </View>
            
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
        
        {/* Year Picker Dropdown for Empty State */}
        {showYearPicker && chartPeriod !== 'yearly' && (
          <>
            <TouchableWithoutFeedback onPress={() => setShowYearPicker(false)}>
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
              }} />
            </TouchableWithoutFeedback>
            <ScrollView style={styles.yearPickerDropdown} showsVerticalScrollIndicator={false}>
              {getAvailableYears().map(year => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearOption,
                    ((chartPeriod === 'weekly' && year === selectedWeek.start.getFullYear()) ||
                     (chartPeriod === 'monthly' && year === selectedYear)) && styles.yearOptionSelected
                  ]}
                  onPress={() => handleYearChange(year)}
                >
                  <Text style={[
                    styles.yearOptionText,
                    ((chartPeriod === 'weekly' && year === selectedWeek.start.getFullYear()) ||
                     (chartPeriod === 'monthly' && year === selectedYear)) && styles.yearOptionTextSelected
                  ]}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
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
              onPress={() => {
                setChartPeriod('weekly');
                setShowYearPicker(false);
                setShowMonthPicker(false);
                setShowWeekPicker(false);
                setShowPeriodPicker(false);
              }}
            >
              <Text style={[styles.chartViewText, chartPeriod === 'weekly' && styles.activeChartViewText]}>
                H
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chartViewButton, chartPeriod === 'monthly' && styles.activeChartView]}
              onPress={() => {
                setChartPeriod('monthly');
                setShowYearPicker(false);
                setShowMonthPicker(false);
                setShowWeekPicker(false);
                setShowPeriodPicker(false);
              }}
            >
              <Text style={[styles.chartViewText, chartPeriod === 'monthly' && styles.activeChartViewText]}>
                A
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chartViewButton, chartPeriod === 'yearly' && styles.activeChartView]}
              onPress={() => {
                setChartPeriod('yearly');
                setShowYearPicker(false);
                setShowMonthPicker(false);
                setShowWeekPicker(false);
                setShowPeriodPicker(false);
              }}
            >
              <Text style={[styles.chartViewText, chartPeriod === 'yearly' && styles.activeChartViewText]}>
                Y
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Period Navigation */}
        <View style={styles.periodNavigator}>
          <TouchableOpacity
            style={[styles.navButton, !canNavigateBackward() && styles.navButtonDisabled]}
            onPress={() => canNavigateBackward() && navigatePeriod('prev')}
            disabled={!canNavigateBackward()}
          >
            <Icon name="chevron-back" size={20} color={canNavigateBackward() ? "#666" : "#ccc"} />
          </TouchableOpacity>
          
          <View style={styles.periodDisplay}>
            {chartPeriod !== 'yearly' ? (
              <>
                {/* Period Dropdown (weeks/months) */}
                <TouchableOpacity 
                  style={styles.periodDropdownButton}
                  onPress={() => {
                    setShowPeriodPicker(!showPeriodPicker);
                    setShowYearPicker(false);
                  }}
                >
                  <Text style={styles.periodDropdownText}>{formatDateRange()}</Text>
                  <Icon name="chevron-down" size={14} color="#374151" />
                </TouchableOpacity>
                
                {/* Year Dropdown */}
                <TouchableOpacity 
                  style={styles.yearButton}
                  onPress={() => {
                    setShowYearPicker(!showYearPicker);
                    setShowPeriodPicker(false);
                  }}
                >
                  <Text style={styles.yearButtonText}>
                    {chartPeriod === 'weekly' ? 
                      (selectedWeek.start.getFullYear() === selectedWeek.end.getFullYear() ? 
                        selectedWeek.start.getFullYear().toString().slice(-2) : 
                        `${selectedWeek.start.getFullYear().toString().slice(-2)}-${selectedWeek.end.getFullYear().toString().slice(-2)}`) 
                      : selectedYear.toString().slice(-2)}
                  </Text>
                  <Icon name="chevron-down" size={14} color="#6b7280" />
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.weeklyChartDate}>{formatDateRange()}</Text>
            )}
          </View>
          
          <TouchableOpacity
            style={[styles.navButton, !canNavigateForward() && styles.navButtonDisabled]}
            onPress={() => canNavigateForward() && navigatePeriod('next')}
            disabled={!canNavigateForward()}
          >
            <Icon name="chevron-forward" size={20} color={canNavigateForward() ? "#666" : "#ccc"} />
          </TouchableOpacity>
        </View>
        
        {/* Period Picker Dropdown - FIXED SCROLL WITHOUT FLATLIST */}
        {showPeriodPicker && chartPeriod !== 'yearly' && (
          <>
            <TouchableWithoutFeedback onPress={() => setShowPeriodPicker(false)}>
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 997,
              }} />
            </TouchableWithoutFeedback>
            <View style={[styles.periodPickerDropdown, { zIndex: 999 }]} pointerEvents="box-none">
              {/* Dropdown header */}
              <View style={styles.dropdownHeader} pointerEvents="none">
                <Text style={styles.dropdownTitle}>
                  {chartPeriod === 'weekly' ? `${selectedYear} Yılı Haftaları` : `${selectedYear} Yılı Ayları`}
                </Text>
                <View style={styles.dropdownIndicator}>
                  <View style={styles.dropdownIndicatorDot} />
                  <View style={styles.dropdownIndicatorDot} />
                  <View style={styles.dropdownIndicatorDot} />
                </View>
              </View>
              
              <ScrollView 
                style={styles.fixedDropdownScrollView}
                showsVerticalScrollIndicator={true}
                scrollIndicatorInsets={{ right: 4 }}
                contentContainerStyle={{ paddingVertical: 8 }}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                bounces={true}
                removeClippedSubviews={false}
                pointerEvents="auto"
              >
                {chartPeriod === 'weekly' ? (
                  getWeeksInYear(selectedWeek.start.getFullYear()).map((week, index) => {
                    const isSelected = week.start.getTime() === selectedWeek.start.getTime();
                    const isFuture = week.start > new Date();
                    
                    return (
                      <TouchableOpacity
                        key={`week-${week.start.getTime()}`}
                        style={[
                          styles.improvedPeriodOption,
                          isSelected && styles.improvedPeriodOptionSelected,
                          isFuture && styles.improvedPeriodOptionDisabled
                        ]}
                        onPress={() => !isFuture && handlePeriodSelect(week)}
                        disabled={isFuture}
                        activeOpacity={0.7}
                      >
                        <View style={styles.periodOptionContent}>
                          <Text style={[
                            styles.improvedPeriodOptionText,
                            isSelected && styles.improvedPeriodOptionTextSelected,
                            isFuture && styles.improvedPeriodOptionTextDisabled
                          ]}>
                            {formatWeekForDropdown(week)}
                          </Text>
                          {isSelected && (
                            <View style={styles.selectedIndicator}>
                              <View style={styles.selectedIndicatorDot} />
                            </View>
                          )}
                          {isFuture && (
                            <Text style={styles.futureLabel}>Gelecek</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  getMonthsInYear().map((month) => {
                    const isSelected = month.month === selectedMonth;
                    const currentDate = new Date();
                    const isFuture = selectedYear === currentDate.getFullYear() && 
                                    month.month > currentDate.getMonth();
                    
                    return (
                      <TouchableOpacity
                        key={`month-${month.month}`}
                        style={[
                          styles.improvedPeriodOption,
                          isSelected && styles.improvedPeriodOptionSelected,
                          isFuture && styles.improvedPeriodOptionDisabled
                        ]}
                        onPress={() => !isFuture && handlePeriodSelect(month)}
                        disabled={isFuture}
                        activeOpacity={0.7}
                      >
                        <View style={styles.periodOptionContent}>
                          <Text style={[
                            styles.improvedPeriodOptionText,
                            isSelected && styles.improvedPeriodOptionTextSelected,
                            isFuture && styles.improvedPeriodOptionTextDisabled
                          ]}>
                            {month.name}
                          </Text>
                          {isSelected && (
                            <View style={styles.selectedIndicator}>
                              <View style={styles.selectedIndicatorDot} />
                            </View>
                          )}
                          {isFuture && (
                            <Text style={styles.futureLabel}>Gelecek</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>
            </View>
          </>
        )}
        
        {/* Year Picker Dropdown - FIXED SCROLL WITHOUT FLATLIST */}
        {showYearPicker && chartPeriod !== 'yearly' && (
          <>
            <TouchableWithoutFeedback onPress={() => setShowYearPicker(false)}>
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 997,
              }} />
            </TouchableWithoutFeedback>
            <View style={[styles.improvedYearPickerDropdown, { zIndex: 999 }]} pointerEvents="box-none">
              <View style={styles.dropdownHeader} pointerEvents="none">
                <Text style={styles.dropdownTitle}>Yıl Seçin</Text>
                <View style={styles.dropdownIndicator}>
                  <View style={styles.dropdownIndicatorDot} />
                  <View style={styles.dropdownIndicatorDot} />
                  <View style={styles.dropdownIndicatorDot} />
                </View>
              </View>
              <ScrollView 
                style={styles.fixedDropdownScrollView}
                showsVerticalScrollIndicator={true}
                scrollIndicatorInsets={{ right: 4 }}
                contentContainerStyle={{ paddingVertical: 8 }}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                bounces={true}
                removeClippedSubviews={false}
                pointerEvents="auto"
              >
                {getAvailableYears().map(year => (
                  <TouchableOpacity
                    key={`year-${year}`}
                    style={[
                      styles.improvedYearOption,
                      ((chartPeriod === 'weekly' && year === selectedWeek.start.getFullYear()) ||
                       (chartPeriod === 'monthly' && year === selectedYear)) && styles.improvedYearOptionSelected
                    ]}
                    onPress={() => handleYearChange(year)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.periodOptionContent}>
                      <Text style={[
                        styles.improvedYearOptionText,
                        ((chartPeriod === 'weekly' && year === selectedWeek.start.getFullYear()) ||
                         (chartPeriod === 'monthly' && year === selectedYear)) && styles.improvedYearOptionTextSelected
                      ]}>
                        {year}
                      </Text>
                      {((chartPeriod === 'weekly' && year === selectedWeek.start.getFullYear()) ||
                        (chartPeriod === 'monthly' && year === selectedYear)) && (
                        <View style={styles.selectedIndicator}>
                          <View style={styles.selectedIndicatorDot} />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}
        
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
    </View>
  );
};

export default WeeklyPieChart;