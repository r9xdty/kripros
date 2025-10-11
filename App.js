// =====================================
// App.js - PRODUCTION VERSION WITH LOCAL STORAGE
// =====================================
import React, { useState, useEffect, useRef } from 'react';
import { 
  SafeAreaView, 
  StatusBar, 
  ScrollView, 
  View, 
  ActivityIndicator,
  Text,
  Alert
} from 'react-native';
import TabBar from './components/common/TabBar';
import HamburgerMenu from './components/common/HamburgerMenu';
import MenuDrawer from './components/common/MenuDrawer';
import DashboardTab from './components/dashboard/DashboardTab';
import CalendarTab from './components/calendar/CalendarTab';
import HistoryTab from './components/history/HistoryTab';
import AddSavingModal from './components/modals/AddSavingModal';
import MySavingsModal from './components/modals/MySavingsModal';
import CalendarDayModal from './components/modals/CalendarDayModal';
import { styles } from './styles/common';
import { getTheme } from './utils/theme';
import { FREQUENCY_TYPES } from './utils/recommendationUtils';

// Import Storage Service
import {
  loadSavings,
  saveSavings,
  loadDailySavings,
  saveDailySavings,
  loadChartView,
  saveChartView,
  checkFirstLaunch,
  loadAppSettings,
  saveAppSettings
} from './utils/storage';

const App = () => {
  // Core State
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [savings, setSavings] = useState([]);
  const [dailySavings, setDailySavings] = useState({});
  const [appSettings, setAppSettings] = useState({
    notifications: true,
    currency: 'TRY',
    language: 'tr',
    theme: 'light'
  });
  
  // UI State
  const appMode = 'savings'; // Fixed to savings only
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAddSavingModal, setShowAddSavingModal] = useState(false);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState({ 
    name: '', 
    amount: '', 
    frequency: FREQUENCY_TYPES.DAILY 
  });
  const [chartView, setChartView] = useState('weekly');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [calendarView, setCalendarView] = useState({ 
    month: new Date().getMonth(), 
    year: new Date().getFullYear() 
  });

  // Auto-save refs to prevent excessive saves
  const savingsRef = useRef(savings);
  const dailySavingsRef = useRef(dailySavings);
  const chartViewRef = useRef(chartView);
  const saveTimeoutRef = useRef(null);

  // Get theme
  const theme = getTheme('savings');

  // =====================================
  // INITIAL LOAD
  // =====================================
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Check if first launch
      const firstLaunch = await checkFirstLaunch();
      setIsFirstLaunch(firstLaunch);
      
      // Load all data
      const [loadedSavings, loadedDailySavings, loadedChartView, loadedSettings] = await Promise.all([
        loadSavings(),
        loadDailySavings(),
        loadChartView(),
        loadAppSettings()
      ]);
      
      setSavings(loadedSavings);
      setDailySavings(loadedDailySavings);
      setChartView(loadedChartView);
      setAppSettings(loadedSettings);
      
      // Update refs
      savingsRef.current = loadedSavings;
      dailySavingsRef.current = loadedDailySavings;
      chartViewRef.current = loadedChartView;
      
      // Show welcome message if first launch
      if (firstLaunch) {
        setTimeout(() => {
          Alert.alert(
            'Hoş Geldiniz! 👋',
            'Kripros ile tasarruflarınızı takip etmeye başlayın. Tüm verileriniz güvenli bir şekilde cihazınızda saklanacak.',
            [{ text: 'Başlayalım', style: 'default' }]
          );
        }, 500);
      }
      
    } catch (error) {
      console.error('App initialization error:', error);
      Alert.alert(
        'Yükleme Hatası',
        'Veriler yüklenirken bir hata oluştu. Uygulama yine de çalışmaya devam edecek.',
        [{ text: 'Tamam' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================
  // AUTO-SAVE HANDLERS
  // =====================================
  
  // Auto-save savings
  useEffect(() => {
    if (!isLoading && JSON.stringify(savings) !== JSON.stringify(savingsRef.current)) {
      savingsRef.current = savings;
      
      // Debounce save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        saveSavings(savings).then(success => {
          if (!success) {
            console.warn('Failed to save savings');
          }
        });
      }, 500);
    }
  }, [savings, isLoading]);

  // Auto-save daily savings
  useEffect(() => {
    if (!isLoading && JSON.stringify(dailySavings) !== JSON.stringify(dailySavingsRef.current)) {
      dailySavingsRef.current = dailySavings;
      
      // Debounce save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        saveDailySavings(dailySavings).then(success => {
          if (!success) {
            console.warn('Failed to save daily savings');
          }
        });
      }, 500);
    }
  }, [dailySavings, isLoading]);

  // Auto-save chart view preference
  useEffect(() => {
    if (!isLoading && chartView !== chartViewRef.current) {
      chartViewRef.current = chartView;
      saveChartView(chartView);
    }
  }, [chartView, isLoading]);

  // Auto-save app settings
  useEffect(() => {
    if (!isLoading) {
      saveAppSettings(appSettings);
    }
  }, [appSettings, isLoading]);

  // =====================================
  // LOADING SCREEN
  // =====================================
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={{ marginTop: 16, fontSize: 16, color: '#6b7280' }}>
            Veriler yükleniyor...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // =====================================
  // MAIN RENDER
  // =====================================
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
      
      {/* Main Content */}
      <View style={{ flex: 1 }}>
        {/* Tab Bar at bottom */}
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
        
        {/* Content with padding */}
        <View style={styles.mainContent}>
          {activeTab !== 'history' ? (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {activeTab === 'dashboard' && (
                <DashboardTab
                  savings={savings}
                  dailySavings={dailySavings}
                  theme={theme}
                  chartView={chartView}
                  setChartView={setChartView}
                  setShowAddModal={() => setShowAddSavingModal(true)}
                  setShowSavingsModal={setShowSavingsModal}
                  setSelectedDate={setSelectedDate}
                  setShowCalendarModal={setShowCalendarModal}
                />
              )}
              
              {activeTab === 'calendar' && (
                <CalendarTab
                  dailySavings={dailySavings}
                  dailySpending={{}}
                  appMode="savings"
                  theme={theme}
                  calendarView={calendarView}
                  setCalendarView={setCalendarView}
                  setSelectedDate={setSelectedDate}
                  setShowCalendarModal={setShowCalendarModal}
                />
              )}
            </ScrollView>
          ) : (
            <View style={styles.content}>
              <HistoryTab 
                appMode="savings"
                theme={theme}
                dailySavings={dailySavings}
                dailySpending={{}}
                currentData={dailySavings}
              />
            </View>
          )}
        </View>
      </View>

      {/* Menu Components */}
      <HamburgerMenu 
        isOpen={menuOpen} 
        onPress={() => setMenuOpen(!menuOpen)} 
      />
      
      <MenuDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        appMode="savings"
        setAppMode={() => {}}
        appSettings={appSettings}
        setAppSettings={setAppSettings}
        onClearData={async () => {
          Alert.alert(
            'Verileri Temizle',
            'Tüm tasarruf verileriniz silinecek. Bu işlem geri alınamaz!',
            [
              { text: 'İptal', style: 'cancel' },
              { 
                text: 'Sil', 
                style: 'destructive',
                onPress: async () => {
                  setSavings([]);
                  setDailySavings({});
                  Alert.alert('Başarılı', 'Tüm veriler temizlendi.');
                }
              }
            ]
          );
        }}
      />

      {/* Modals - Savings Only */}
      <AddSavingModal
        visible={showAddSavingModal}
        onClose={() => setShowAddSavingModal(false)}
        savings={savings}
        setSavings={setSavings}
      />

      <MySavingsModal
        visible={showSavingsModal}
        onClose={() => setShowSavingsModal(false)}
        savings={savings}
        setSavings={setSavings}
        dailySavings={dailySavings}
        setDailySavings={setDailySavings}
        editingId={editingId}
        setEditingId={setEditingId}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
      />

      <CalendarDayModal
        visible={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        selectedDate={selectedDate}
        savings={savings}
        dailySavings={dailySavings}
        setDailySavings={setDailySavings}
        dailySpending={{}}
        setDailySpending={() => {}}
        appMode="savings"
        theme={theme}
        onAddSpending={() => {}}
      />
    </SafeAreaView>
  );
};

export default App;