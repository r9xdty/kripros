// =====================================
// App.js - SAFE VERSION TO FIX ERRORS
// =====================================
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, ScrollView, View } from 'react-native';
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

const App = () => {
  const [savings, setSavings] = useState([]);
  const [dailySavings, setDailySavings] = useState({});
  const [dailySpending, setDailySpending] = useState({});
  const [appMode, setAppMode] = useState('savings');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
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

  // Get theme based on current mode
  const theme = getTheme(appMode);
  
  // Get current data based on mode
  const currentData = appMode === 'savings' ? dailySavings : dailySpending;
  const setCurrentData = appMode === 'savings' ? setDailySavings : setDailySpending;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
      
      {/* Hamburger Menu Button */}
      <HamburgerMenu 
        isOpen={menuOpen} 
        onPress={() => setMenuOpen(!menuOpen)} 
      />
      
      {/* Menu Drawer with Overlay */}
      <MenuDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        appMode={appMode}
        setAppMode={setAppMode}
      />
      
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
      
      {/* Main Content with padding for menu button */}
      <View style={styles.mainContent}>
        {activeTab !== 'history' ? (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'dashboard' && (
            <DashboardTab
              appMode={appMode}
              theme={theme}
              savings={savings}
              dailySavings={dailySavings}
              dailySpending={dailySpending}
              currentData={currentData}
              chartView={chartView}
              setChartView={setChartView}
              setShowAddModal={setShowAddModal}
              setShowSavingsModal={setShowSavingsModal}
              setSelectedDate={setSelectedDate}
              setShowCalendarModal={setShowCalendarModal}
            />
          )}
          
          {activeTab === 'calendar' && (
            <CalendarTab
              appMode={appMode}
              theme={theme}
              dailySavings={dailySavings}
              dailySpending={dailySpending}
              currentData={currentData}
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
              appMode={appMode}
              theme={theme}
              dailySavings={dailySavings}
              dailySpending={dailySpending}
              currentData={currentData}
            />
          </View>
        )}
      </View>

      <AddSavingModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        savings={savings}
        setSavings={setSavings}
        appMode={appMode}
        theme={theme}
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
        appMode={appMode}
        theme={theme}
      />

      <CalendarDayModal
        visible={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        selectedDate={selectedDate}
        savings={savings}
        currentData={currentData}
        setCurrentData={setCurrentData}
        appMode={appMode}
        theme={theme}
      />
    </SafeAreaView>
  );
};

export default App;