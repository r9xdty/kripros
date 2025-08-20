// =====================================
// utils/savingsUtils.js - REVERTED WEEKLY CHART + NEW TITLES
// =====================================
import { formatDate } from './dateUtils';

// Turkish day names for chart
const CHART_DAY_NAMES = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export const getDayTotal = (date, dailySavings) => {
  const dateStr = formatDate(date);
  const daySavings = dailySavings[dateStr] || [];
  return daySavings.reduce((sum, saving) => sum + saving.amount, 0);
};

// REVERTED to original - Shows last 7 days ending with today
export const getWeeklyData = (dailySavings) => {
  const data = [];
  const labels = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const dayTotal = getDayTotal(date, dailySavings);
    
    data.push(dayTotal);
    
    // Use the day of week to get the correct Turkish day name
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    labels.push(CHART_DAY_NAMES[dayOfWeek]);
  }
  
  return { labels, data };
};

export const getMonthlyData = (dailySavings) => {
  const data = [];
  const labels = [];
  
  for (let i = 0; i < 4; i++) {
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);
    endDate.setDate(endDate.getDate() - (i * 7));
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);
    
    let weekTotal = 0;
    for (let j = 0; j < 7; j++) {
      const date = new Date(startDate);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + j);
      weekTotal += getDayTotal(date, dailySavings);
    }
    
    data.unshift(weekTotal);
    labels.unshift(`Hafta ${4 - i}`);
  }
  
  return { labels, data };
};

export const getYearlyData = (dailySavings) => {
  const data = [];
  const labels = [];
  
  const MONTH_NAMES_SHORT = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setMonth(date.getMonth() - i);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    let monthTotal = 0;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      dayDate.setHours(0, 0, 0, 0);
      monthTotal += getDayTotal(dayDate, dailySavings);
    }
    
    data.unshift(monthTotal);
    labels.unshift(MONTH_NAMES_SHORT[month]);
  }
  
  return { labels, data };
};

export const getChartData = (chartView, dailySavings) => {
  switch (chartView) {
    case 'weekly':
      return getWeeklyData(dailySavings);
    case 'monthly':
      return getMonthlyData(dailySavings);
    case 'yearly':
      return getYearlyData(dailySavings);
    default:
      return getWeeklyData(dailySavings);
  }
};

export const calculateTotalSavings = (dailySavings) => {
  return Object.entries(dailySavings)
    .filter(([dateKey]) => !dateKey.includes('_removed'))
    .flatMap(([, savingsArray]) => savingsArray)
    .reduce((sum, saving) => sum + saving.amount, 0);
};

export const getSavingsHistory = (dailySavings) => {
  const history = [];
  
  Object.entries(dailySavings).forEach(([dateKey, savingsArray]) => {
    if (!dateKey.includes('_removed')) {
      savingsArray.forEach(saving => {
        const eventDate = new Date(dateKey);
        history.push({
          ...saving,
          date: dateKey,
          dateObj: eventDate,
          displayDate: eventDate.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          displayTime: saving.addedAt ? new Date(saving.addedAt).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Istanbul'
          }) : '--:--',
          action: saving.action || 'added'
        });
      });
    }
  });
  
  Object.entries(dailySavings).forEach(([dateKey, removalsArray]) => {
    if (dateKey.includes('_removed')) {
      const originalDateKey = dateKey.replace('_removed', '');
      removalsArray.forEach(removal => {
        const eventDate = new Date(originalDateKey);
        history.push({
          ...removal,
          date: originalDateKey,
          dateObj: eventDate,
          displayDate: eventDate.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          displayTime: removal.removedAt ? new Date(removal.removedAt).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Istanbul'
          }) : '--:--',
          action: 'removed'
        });
      });
    }
  });
  
  return history.sort((a, b) => {
    const dateA = a.action === 'removed' ? new Date(a.removedAt) : new Date(a.addedAt);
    const dateB = b.action === 'removed' ? new Date(b.removedAt) : new Date(b.addedAt);
    return dateB - dateA;
  });
};