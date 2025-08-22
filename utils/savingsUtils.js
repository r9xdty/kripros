// =====================================
// utils/savingsUtils.js - ADDED PIE CHART DATA FUNCTION
// =====================================
import { formatDate } from './dateUtils';

// Turkish day names for chart
const CHART_DAY_NAMES = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

// Color generator with seeded random for consistency
const generateColor = (seed) => {
  const colors = [
    '#10b981', // emerald
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#f59e0b', // amber
    '#ef4444', // red
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
    '#6366f1', // indigo
    '#14b8a6', // teal
    '#a855f7', // purple
  ];
  
  // Use string hash to get consistent color for same item
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Generate darker shade for larger amounts
const adjustColorBrightness = (color, amount, maxAmount) => {
  const percentage = amount / maxAmount;
  // Larger amounts get darker colors (more saturation)
  if (percentage > 0.5) {
    // Darken the color slightly for large amounts
    return color.replace(/[0-9a-f]{2}$/i, (match) => {
      const num = parseInt(match, 16);
      const darker = Math.floor(num * 0.8);
      return darker.toString(16).padStart(2, '0');
    });
  }
  return color;
};

export const getDayTotal = (date, dailySavings) => {
  const dateStr = formatDate(date);
  const daySavings = dailySavings[dateStr] || [];
  return daySavings.reduce((sum, saving) => sum + saving.amount, 0);
};

// New function for pie chart data
export const getWeeklyPieData = (dailySavings, weekStart, weekEnd) => {
  const savingsMap = new Map();
  
  // Collect all savings for the week
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + i);
    currentDate.setHours(0, 0, 0, 0);
    
    const dateStr = formatDate(currentDate);
    const daySavings = dailySavings[dateStr] || [];
    
    // Group by saving name
    daySavings.forEach(saving => {
      const key = saving.name;
      if (savingsMap.has(key)) {
        savingsMap.get(key).amount += saving.amount;
        savingsMap.get(key).count += 1;
      } else {
        savingsMap.set(key, {
          name: saving.name,
          amount: saving.amount,
          count: 1
        });
      }
    });
  }
  
  // Convert to array and sort by amount (largest first)
  const pieData = Array.from(savingsMap.values()).sort((a, b) => b.amount - a.amount);
  
  // Find max amount for color adjustment
  const maxAmount = pieData.length > 0 ? pieData[0].amount : 0;
  
  // Assign colors
  return pieData.map(item => ({
    ...item,
    color: adjustColorBrightness(generateColor(item.name), item.amount, maxAmount)
  }));
};

// Rest of the functions remain the same...
export const getWeeklyData = (dailySavings) => {
  const data = [];
  const labels = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const dayTotal = getDayTotal(date, dailySavings);
    
    data.push(dayTotal);
    const dayOfWeek = date.getDay();
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
