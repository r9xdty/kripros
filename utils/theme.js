// =====================================
// utils/theme.js - APP THEME SYSTEM
// =====================================
export const getTheme = (mode) => {
  const themes = {
    savings: {
      primary: '#10b981',      // Green
      secondary: '#3b82f6',    // Blue  
      accent: '#059669',       // Dark green
      background: '#f0fdf4',   // Light green background
      text: '#166534',         // Green text
      icon: '#10b981',
      gradient: ['#10b981', '#059669'],
    },
    spending: {
      primary: '#ef4444',      // Red
      secondary: '#8b5cf6',    // Purple
      accent: '#dc2626',       // Dark red
      background: '#fef2f2',   // Light red background
      text: '#dc2626',         // Red text
      icon: '#ef4444',
      gradient: ['#ef4444', '#dc2626'],
    }
  };
  
  return themes[mode] || themes.savings;
};

export const getModeConfig = (mode) => {
  const configs = {
    savings: {
      title: 'Tasarruf Takipçim',
      dataKey: 'dailySavings',
      icon: 'wallet',
      addButtonText: 'Tasarruf Ekle',
      listButtonText: 'Tasarruflarım',
      totalLabel: 'Toplam Tasarruf',
      emptyMessage: 'Henüz tasarruf yok',
    },
    spending: {
      title: 'Harcama Takipçim', 
      dataKey: 'dailySpending',
      icon: 'card',
      addButtonText: 'Harcama Ekle',
      listButtonText: 'Harcamalarım',
      totalLabel: 'Toplam Harcama',
      emptyMessage: 'Henüz harcama yok',
    }
  };
  
  return configs[mode] || configs.savings;
};