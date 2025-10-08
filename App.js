// =====================================
// App.js - SAVINGS ONLY VERSION
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
  // State - Savings only
  const [savings, setSavings] = useState([]);
  const [dailySavings, setDailySavings] = useState({});
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

  // Get theme - always savings theme
  const theme = getTheme('savings');

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
                  dailySpending={{}} // Empty, no spending
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
                dailySpending={{}} // Empty, no spending
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
        setAppMode={() => {}} // No mode switching anymore
      />

      {/* Modals - Savings Only */}
      <AddSavingModal
        visible={showAddSavingModal}
        onClose={() => setShowAddSavingModal(false)}
        savings={savings}
        setSavings={setSavings}
        appMode="savings"
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
        appMode="savings"
        theme={theme}
      />

      <CalendarDayModal
        visible={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        selectedDate={selectedDate}
        savings={savings}
        dailySavings={dailySavings}
        setDailySavings={setDailySavings}
        dailySpending={{}} // Empty, no spending
        setDailySpending={() => {}} // No-op function
        appMode="savings"
        theme={theme}
        onAddSpending={() => {}} // No-op function
      />
    </SafeAreaView>
  );
};

export default App;