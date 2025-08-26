// =====================================
// utils/spendingUtils.js - SPENDING TRACKING UTILITIES
// =====================================
import { formatDate } from './dateUtils';

// Calculate total spending from all recorded spending
export const getTotalSpending = (dailySpending) => {
  if (!dailySpending || typeof dailySpending !== 'object') return 0;
  
  let total = 0;
  Object.keys(dailySpending).forEach(dateStr => {
    if (!dateStr.includes('_removed')) {
      const daySpending = dailySpending[dateStr];
      if (Array.isArray(daySpending)) {
        total += daySpending.reduce((sum, spending) => sum + spending.amount, 0);
      }
    }
  });
  
  return total;
};

// Calculate spending total for a specific day
export const getDaySpendingTotal = (date, dailySpending) => {
  if (!dailySpending || !date) return 0;
  
  const dateStr = formatDate(date);
  const daySpending = dailySpending[dateStr];
  
  if (!Array.isArray(daySpending)) return 0;
  
  return daySpending.reduce((sum, spending) => sum + spending.amount, 0);
};

// Get spending for a specific period (last N days)
export const getPeriodSpending = (dailySpending, days = 7) => {
  if (!dailySpending || typeof dailySpending !== 'object') return 0;
  
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);
  
  let total = 0;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateStr = formatDate(currentDate);
    const daySpending = dailySpending[dateStr];
    
    if (Array.isArray(daySpending)) {
      total += daySpending.reduce((sum, spending) => sum + spending.amount, 0);
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return total;
};

// Get spending history for display
export const getSpendingHistory = (dailySpending) => {
  if (!dailySpending || typeof dailySpending !== 'object') return [];
  
  const history = [];
  
  Object.keys(dailySpending)
    .filter(dateStr => !dateStr.includes('_removed'))
    .sort((a, b) => new Date(b) - new Date(a))
    .forEach(dateStr => {
      const daySpending = dailySpending[dateStr];
      if (Array.isArray(daySpending) && daySpending.length > 0) {
        daySpending.forEach(spending => {
          history.push({
            ...spending,
            date: dateStr,
            dateObj: new Date(dateStr)
          });
        });
      }
    });
  
  // Sort by date (newest first) and then by addedAt time
  return history.sort((a, b) => {
    const dateCompare = new Date(b.date) - new Date(a.date);
    if (dateCompare !== 0) return dateCompare;
    return new Date(b.addedAt) - new Date(a.addedAt);
  });
};

// Get chart data for spending trends
export const getSpendingChartData = (dailySpending, viewType = 'weekly') => {
  if (!dailySpending || typeof dailySpending !== 'object') {
    return { labels: [], data: [] };
  }
  
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  let labels = [];
  let data = [];
  
  if (viewType === 'weekly') {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dateStr = formatDate(date);
      const daySpending = dailySpending[dateStr];
      const total = Array.isArray(daySpending) 
        ? daySpending.reduce((sum, spending) => sum + spending.amount, 0)
        : 0;
      
      labels.push(date.toLocaleDateString('tr-TR', { weekday: 'short' }));
      data.push(total);
    }
  } else if (viewType === 'monthly') {
    // Last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dateStr = formatDate(date);
      const daySpending = dailySpending[dateStr];
      const total = Array.isArray(daySpending)
        ? daySpending.reduce((sum, spending) => sum + spending.amount, 0)
        : 0;
      
      labels.push(date.getDate().toString());
      data.push(total);
    }
  } else if (viewType === 'yearly') {
    // Last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i, 1);
      date.setHours(0, 0, 0, 0);
      
      const monthStart = new Date(date);
      const monthEnd = new Date(date);
      monthEnd.setMonth(monthEnd.getMonth() + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);
      
      let monthTotal = 0;
      const currentDate = new Date(monthStart);
      
      while (currentDate <= monthEnd) {
        const dateStr = formatDate(currentDate);
        const daySpending = dailySpending[dateStr];
        
        if (Array.isArray(daySpending)) {
          monthTotal += daySpending.reduce((sum, spending) => sum + spending.amount, 0);
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      labels.push(date.toLocaleDateString('tr-TR', { month: 'short' }));
      data.push(monthTotal);
    }
  }
  
  return { labels, data };
};

// Common spending categories for quick selection
export const getSpendingCategories = () => [
  { name: 'Market Alışverişi', icon: 'storefront', color: '#ef4444' },
  { name: 'Yakıt', icon: 'car', color: '#f97316' },
  { name: 'Yemek', icon: 'restaurant', color: '#eab308' },
  { name: 'Ulaşım', icon: 'train', color: '#22c55e' },
  { name: 'Fatura', icon: 'receipt', color: '#06b6d4' },
  { name: 'Giyim', icon: 'shirt', color: '#8b5cf6' },
  { name: 'Sağlık', icon: 'medical', color: '#ec4899' },
  { name: 'Eğlence', icon: 'game-controller', color: '#14b8a6' },
  { name: 'Kitap/Dergi', icon: 'book', color: '#f59e0b' },
  { name: 'Teknoloji', icon: 'laptop', color: '#3b82f6' },
  { name: 'Ev Gereçleri', icon: 'home', color: '#10b981' },
  { name: 'Diğer', icon: 'ellipsis-horizontal', color: '#6b7280' }
];

// Validate spending entry
export const validateSpending = (spending) => {
  const errors = [];
  
  if (!spending.name || spending.name.trim().length === 0) {
    errors.push('Harcama adı boş olamaz');
  }
  
  if (!spending.amount || spending.amount <= 0) {
    errors.push('Harcama tutarı 0\'dan büyük olmalı');
  }
  
  if (spending.amount && spending.amount > 999999) {
    errors.push('Harcama tutarı çok büyük');
  }
  
  if (!spending.category) {
    errors.push('Kategori seçiniz');
  }
  
  return errors;
};

// Format spending amount for display
export const formatSpendingAmount = (amount) => {
  if (typeof amount !== 'number') return '0.00';
  return amount.toFixed(2);
};