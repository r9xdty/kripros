import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { TAB_BAR_HEIGHT } from '../components/Screen';
import { useSheets } from './sheets';
import DashboardScreen from '../screens/DashboardScreen';
import CalendarScreen from '../screens/CalendarScreen';
import GoalsScreen from '../screens/GoalsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import { colors, shadow } from '../theme';

const TABS = [
  { key: 'dashboard', label: 'Özet', icon: 'home' },
  { key: 'calendar', label: 'Takvim', icon: 'calendar' },
  { key: 'add' },
  { key: 'goals', label: 'Hedefler', icon: 'flag' },
  { key: 'history', label: 'Geçmiş', icon: 'list' },
];

export default function MainShell() {
  const [tab, setTab] = useState('dashboard');
  const { push } = useSheets();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {tab === 'dashboard' && <DashboardScreen onNavigate={setTab} />}
        {tab === 'calendar' && <CalendarScreen />}
        {tab === 'goals' && <GoalsScreen />}
        {tab === 'history' && <HistoryScreen />}
      </View>

      <View style={[styles.tabBar, { paddingBottom: insets.bottom, height: TAB_BAR_HEIGHT + insets.bottom }]}>
        {TABS.map((item) => {
          if (item.key === 'add') {
            return (
              <View key="add" style={styles.tab}>
                <Pressable
                  onPress={() => push('transaction', { kind: 'spending' })}
                  style={({ pressed }) => [styles.addButton, pressed && { transform: [{ scale: 0.95 }] }]}
                  accessibilityRole="button"
                  accessibilityLabel="Yeni kayıt ekle"
                >
                  <Icon name="add" size={30} color="#fff" />
                </Pressable>
              </View>
            );
          }
          const active = tab === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => setTab(item.key)}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              <Icon name={active ? item.icon : `${item.icon}-outline`} size={22} color={active ? colors.primaryDark : colors.textFaint} />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadow,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  tabLabel: { fontSize: 11, fontWeight: '600', color: colors.textFaint },
  tabLabelActive: { color: colors.primaryDark },
  addButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    borderWidth: 4,
    borderColor: colors.background,
  },
});
