// =====================================
// utils/storage.js - LOCAL STORAGE SERVICE
// =====================================
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
const STORAGE_KEYS = {
  SAVINGS: '@kripros_savings',
  DAILY_SAVINGS: '@kripros_daily_savings',
  APP_SETTINGS: '@kripros_settings',
  CHART_VIEW: '@kripros_chart_view',
  FIRST_LAUNCH: '@kripros_first_launch',
  BACKUP_DATE: '@kripros_last_backup'
};

// Error logging
const logError = (operation, error) => {
  console.error(`Storage Error [${operation}]:`, error);
};

// =====================================
// SAVINGS STORAGE
// =====================================

export const saveSavings = async (savings) => {
  try {
    const jsonValue = JSON.stringify(savings);
    await AsyncStorage.setItem(STORAGE_KEYS.SAVINGS, jsonValue);
    return true;
  } catch (error) {
    logError('saveSavings', error);
    return false;
  }
};

export const loadSavings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SAVINGS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    logError('loadSavings', error);
    return [];
  }
};

// =====================================
// DAILY SAVINGS STORAGE
// =====================================

export const saveDailySavings = async (dailySavings) => {
  try {
    const jsonValue = JSON.stringify(dailySavings);
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_SAVINGS, jsonValue);
    return true;
  } catch (error) {
    logError('saveDailySavings', error);
    return false;
  }
};

export const loadDailySavings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_SAVINGS);
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (error) {
    logError('loadDailySavings', error);
    return {};
  }
};

// =====================================
// CHART VIEW PREFERENCE
// =====================================

export const saveChartView = async (view) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CHART_VIEW, view);
    return true;
  } catch (error) {
    logError('saveChartView', error);
    return false;
  }
};

export const loadChartView = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.CHART_VIEW);
    return value || 'weekly';
  } catch (error) {
    logError('loadChartView', error);
    return 'weekly';
  }
};

// =====================================
// APP SETTINGS
// =====================================

export const saveAppSettings = async (settings) => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, jsonValue);
    return true;
  } catch (error) {
    logError('saveAppSettings', error);
    return false;
  }
};

export const loadAppSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    return jsonValue != null ? JSON.parse(jsonValue) : {
      notifications: true,
      currency: 'TRY',
      language: 'tr',
      theme: 'light'
    };
  } catch (error) {
    logError('loadAppSettings', error);
    return {
      notifications: true,
      currency: 'TRY',
      language: 'tr',
      theme: 'light'
    };
  }
};

// =====================================
// FIRST LAUNCH CHECK
// =====================================

export const checkFirstLaunch = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
    if (value === null) {
      // First time launching the app
      await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
      return true;
    }
    return false;
  } catch (error) {
    logError('checkFirstLaunch', error);
    return false;
  }
};

// =====================================
// DATA BACKUP & RESTORE
// =====================================

export const createBackup = async () => {
  try {
    const savings = await loadSavings();
    const dailySavings = await loadDailySavings();
    const settings = await loadAppSettings();
    const chartView = await loadChartView();
    
    const backup = {
      version: '1.0.0',
      date: new Date().toISOString(),
      data: {
        savings,
        dailySavings,
        settings,
        chartView
      }
    };
    
    // Store backup date
    await AsyncStorage.setItem(STORAGE_KEYS.BACKUP_DATE, backup.date);
    
    return backup;
  } catch (error) {
    logError('createBackup', error);
    return null;
  }
};

export const restoreBackup = async (backup) => {
  try {
    if (!backup || !backup.data) {
      throw new Error('Invalid backup data');
    }
    
    const { savings, dailySavings, settings, chartView } = backup.data;
    
    // Restore all data
    if (savings) await saveSavings(savings);
    if (dailySavings) await saveDailySavings(dailySavings);
    if (settings) await saveAppSettings(settings);
    if (chartView) await saveChartView(chartView);
    
    return true;
  } catch (error) {
    logError('restoreBackup', error);
    return false;
  }
};

// =====================================
// CLEAR DATA
// =====================================

export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.SAVINGS,
      STORAGE_KEYS.DAILY_SAVINGS,
      STORAGE_KEYS.APP_SETTINGS,
      STORAGE_KEYS.CHART_VIEW
    ]);
    return true;
  } catch (error) {
    logError('clearAllData', error);
    return false;
  }
};

export const clearSavingsData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.SAVINGS,
      STORAGE_KEYS.DAILY_SAVINGS
    ]);
    return true;
  } catch (error) {
    logError('clearSavingsData', error);
    return false;
  }
};

// =====================================
// STORAGE INFO
// =====================================

export const getStorageInfo = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const kriprosKeys = keys.filter(key => key.startsWith('@kripros'));
    
    let totalSize = 0;
    const info = {};
    
    for (const key of kriprosKeys) {
      const value = await AsyncStorage.getItem(key);
      const size = value ? value.length : 0;
      totalSize += size;
      info[key] = {
        size: size,
        sizeKB: (size / 1024).toFixed(2)
      };
    }
    
    return {
      totalKeys: kriprosKeys.length,
      totalSize: totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      details: info
    };
  } catch (error) {
    logError('getStorageInfo', error);
    return null;
  }
};

// =====================================
// MIGRATION UTILITIES
// =====================================

export const migrateData = async (oldVersion, newVersion) => {
  try {
    // Add migration logic here as the app evolves
    console.log(`Migrating data from ${oldVersion} to ${newVersion}`);
    
    // Example migration structure:
    // if (oldVersion < '1.1.0' && newVersion >= '1.1.0') {
    //   // Perform migration steps
    // }
    
    return true;
  } catch (error) {
    logError('migrateData', error);
    return false;
  }
};