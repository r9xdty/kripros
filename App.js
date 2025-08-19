// =====================================
// project_kripros/App.js
// =====================================

// App.js - WITH DEBUG TEST
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, ScrollView, View } from 'react-native';
import TabBar from './components/common/TabBar';
import DashboardTab from './components/dashboard/DashboardTab';
import CalendarTab from './components/calendar/CalendarTab';
import HistoryTab from './components/history/HistoryTab';
import AddSavingModal from './components/modals/AddSavingModal';
import MySavingsModal from './components/modals/MySavingsModal';
import CalendarDayModal from './components/modals/CalendarDayModal';
import { styles } from './styles/common';

const App = () => {
  const [savings, setSavings] = useState([]);
  const [dailySavings, setDailySavings] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState({ name: '', amount: '' });
  const [chartView, setChartView] = useState('weekly');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [calendarView, setCalendarView] = useState({ 
    month: new Date().getMonth(), 
    year: new Date().getFullYear() 
  });
/*
  // ============ DEBUG TEST - REMOVE AFTER TESTING ============
  useEffect(() => {
    console.log("🔍 =========================");
    console.log("🔍 CALENDAR DEBUG TEST");
    console.log("🔍 =========================");
    
    // Test August 2025
    const august3 = new Date(2025, 7, 3); // August 3, 2025
    console.log("📅 August 3, 2025:");
    console.log("  JavaScript day:", august3.getDay(), "(0=Sun, 1=Mon, ..., 6=Sat)");
    console.log("  Day name (EN):", august3.toLocaleDateString('en-US', { weekday: 'long' }));
    console.log("  Day name (TR):", august3.toLocaleDateString('tr-TR', { weekday: 'long' }));
    
    // Test the conversion formula
    console.log("\n🔄 Monday-First Conversion Test:");
    const jsDay = august3.getDay(); // Should be 0 (Sunday)
    const mondayFirstPosition = (jsDay + 6) % 7; // Should be 6 (last column)
    console.log("  JS getDay():", jsDay);
    console.log("  After conversion:", mondayFirstPosition);
    console.log("  Expected: 6 (last column for Sunday)");
    console.log("  ✅ Correct?" , mondayFirstPosition === 6 ? "YES!" : "NO - BUG!");
    
    // Test getDaysInMonth
    console.log("\n📊 Calendar Grid Test for August 2025:");
    const getDaysInMonthTest = (month, year) => {
      const firstDay = new Date(year, month, 1);
      let startingDayOfWeek = firstDay.getDay();
      startingDayOfWeek = (startingDayOfWeek + 6) % 7;
      
      console.log("  First day:", firstDay.toDateString());
      console.log("  First day is:", firstDay.toLocaleDateString('en-US', { weekday: 'long' }));
      console.log("  Empty cells before:", startingDayOfWeek);
      
      const days = [];
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }
      
      return days;
    };
    
    const augustDays = getDaysInMonthTest(7, 2025);
    
    // Find August 3rd position
    const aug3Index = augustDays.findIndex(d => d && d.getDate() === 3);
    const column = aug3Index % 7;
    
    console.log("\n🎯 August 3rd Position:");
    console.log("  Array index:", aug3Index);
    console.log("  Column:", column);
    console.log("  Column names: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']");
    console.log("  Column", column, "=", ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][column]);
    console.log("  Should be: Paz (Sunday)");
    console.log("  ✅ Correct?", column === 6 ? "YES!" : "NO - BUG!");
    
    // Visual calendar
    console.log("\n📅 Visual August 2025:");
    console.log("  Mon Tue Wed Thu Fri Sat Sun");
    console.log("  Pzt Sal Çar Per Cum Cmt Paz");
    console.log("  --- --- --- --- --- --- ---");
    
    let week = [];
    for (let i = 0; i < augustDays.length; i++) {
      if (augustDays[i] === null) {
        week.push(' -- ');
      } else {
        week.push(' ' + String(augustDays[i].getDate()).padStart(2, '0') + ' ');
      }
      
      if ((i + 1) % 7 === 0) {
        console.log(" " + week.join(''));
        week = [];
      }
    }
    if (week.length > 0) {
      console.log(" " + week.join(''));
    }
    
    console.log("\n🔍 =========================");
    console.log("🔍 END DEBUG TEST");
    console.log("🔍 =========================");
  }, []); // Run once on app start
  // ============ END DEBUG TEST ============*/

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