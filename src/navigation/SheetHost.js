import React, { useCallback, useMemo, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SheetContext } from './sheets';
import WebFrame from '../components/WebFrame';
import TransactionSheet from '../sheets/TransactionSheet';
import DaySheet from '../sheets/DaySheet';
import GoalSheet from '../sheets/GoalSheet';
import TemplatesSheet from '../sheets/TemplatesSheet';
import CategoriesSheet from '../sheets/CategoriesSheet';
import SettingsSheet from '../sheets/SettingsSheet';
import RecurringSheet from '../sheets/RecurringSheet';

const SHEETS = {
  transaction: TransactionSheet,
  day: DaySheet,
  goal: GoalSheet,
  templates: TemplatesSheet,
  categories: CategoriesSheet,
  recurring: RecurringSheet,
  settings: SettingsSheet,
};

let nextKey = 1;

export default function SheetHost({ children }) {
  const [stack, setStack] = useState([]);

  const push = useCallback((type, params = {}) => setStack((s) => [...s, { type, params, key: nextKey++ }]), []);
  const pop = useCallback(() => setStack((s) => s.slice(0, -1)), []);
  const closeAll = useCallback(() => setStack([]), []);

  const value = useMemo(() => ({ push, pop, closeAll, depth: stack.length }), [push, pop, closeAll, stack.length]);
  const top = stack[stack.length - 1];

  return (
    <SheetContext.Provider value={value}>
      {children}
      <Modal visible={Boolean(top)} animationType="slide" onRequestClose={pop} statusBarTranslucent navigationBarTranslucent>
        <SafeAreaProvider>
          <WebFrame>
            {/* Lower sheets stay mounted (hidden) so their form state survives. */}
            {stack.map((entry, index) => {
              const Sheet = SHEETS[entry.type];
              return (
                <View key={entry.key} style={[styles.layer, index !== stack.length - 1 && styles.hidden]}>
                  <Sheet {...entry.params} />
                </View>
              );
            })}
          </WebFrame>
        </SafeAreaProvider>
      </Modal>
    </SheetContext.Provider>
  );
}

const styles = StyleSheet.create({
  layer: { flex: 1 },
  hidden: { display: 'none' },
});
