// =====================================
// App.js - UPDATED WITH FREQUENCY SUPPORT
// =====================================
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, ScrollView, View } from 'react-native';
import TabBar from './components/common/TabBar';
import DashboardTab from './components/dashboard/DashboardTab';
import CalendarTab from './components/calendar/CalendarTab';
import HistoryTab from './components/history/HistoryTab';
import AddSavingModal from './components/modals/AddSavingModal';
import MySavingsModal from './components/modals/MySavingsModal';
import CalendarDayModal from './components/modals/CalendarDayModal';
import { styles } from './styles/common';
import { FREQUENCY_TYPES } from './utils/recommendationUtils';

const App = () => {
  const [savings, setSavings] = useState([]);
  const [dailySavings, setDailySavings] = useState({});
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9ff" />
      
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab !== 'history' ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'dashboard' && (
            <DashboardTab
              savings={savings}
              dailySavings={dailySavings}
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
              dailySavings={dailySavings}
              calendarView={calendarView}
              setCalendarView={setCalendarView}
              setSelectedDate={setSelectedDate}
              setShowCalendarModal={setShowCalendarModal}
            />
          )}
        </ScrollView>
      ) : (
        <View style={styles.content}>
          <HistoryTab dailySavings={dailySavings} />
        </View>
      )}

      <AddSavingModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
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
      />
    </SafeAreaView>
  );
};

export default App;

// =====================================
// EXAMPLE USAGE AND HOW IT WORKS
// =====================================
/*
HOW THE RECOMMENDATION ALGORITHM WORKS:

1. FREQUENCY CATEGORIES:
   - Günlük (Daily): Items you buy every day (e.g., coffee, newspaper)
   - Haftalık (Weekly): Items you buy weekly (e.g., groceries, gas)
   - Aylık (Monthly): Monthly expenses (e.g., subscription services)
   - Yıllık (Yearly): Annual expenses (e.g., insurance, memberships)

2. RECOMMENDATION LOGIC:
   The algorithm analyzes:
   - How long since last added (daysSince)
   - Frequency setting of the saving
   - Actual usage patterns (how often user really adds it)
   - Whether it was already added today

3. SCORING SYSTEM (0-100):
   - Base score from frequency match (e.g., daily saving not added today = high score)
   - Bonus points for consistent usage patterns
   - Penalties for already added items (except daily)
   - Only shows items with >20% score

4. SMART FEATURES:
   - Shows top 3 recommendations with reasons
   - Displays match percentage
   - Learns from user behavior
   - Prevents duplicate additions (except daily items)

EXAMPLE SCENARIOS:

Scenario 1: Coffee Saving (Daily)
- User typically saves on coffee every day
- If not added today: Shows as top recommendation with ~95% score
- Reason: "Bugün eklenebilir" (Can be added today)

Scenario 2: Grocery Saving (Weekly)
- User saves on groceries weekly
- After 7+ days: Shows with high score
- Reason: "1 haftadır eklenmemiş" (Not added for 1 week)

Scenario 3: Netflix Saving (Monthly)
- User saves on Netflix monthly
- After 30+ days: Appears in recommendations
- Reason: "1 aydır eklenmemiş" (Not added for 1 month)

The algorithm gets smarter over time by tracking actual usage patterns!
*/