import React, { useCallback, useMemo, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SheetContext } from './sheets';
import TransactionSheet from '../sheets/TransactionSheet';
import DaySheet from '../sheets/DaySheet';
import GoalSheet from '../sheets/GoalSheet';
import TemplatesSheet from '../sheets/TemplatesSheet';
import CategoriesSheet from '../sheets/CategoriesSheet';
import SettingsSheet from '../sheets/SettingsSheet';

const SHEETS = {
  transaction: TransactionSheet,
  day: DaySheet,
  goal: GoalSheet,
  templates: TemplatesSheet,
  categories: CategoriesSheet,
  settings: SettingsSheet,
};

let nextKey = 1;

export default function SheetHost({ children }) {
  const [stack, setStack] = useState([]);

  const push = useCallback((type, params = {}) => setStack((s) => [...s, { type, params, key: nextKey++ }]), []);
  const pop = useCallback(() => setStack((s) => s.slice(0, -1)), []);
  const replace = useCallback((type, params = {}) => setStack((s) => [...s.slice(0, -1), { type, params, key: nextKey++ }]), []);
  const closeAll = useCallback(() => setStack([]), []);

  const value = useMemo(() => ({ push, pop, replace, closeAll, depth: stack.length }), [push, pop, replace, closeAll, stack.length]);
  const top = stack[stack.length - 1];

  return (
    <SheetContext.Provider value={value}>
      {children}
      <Modal visible={Boolean(top)} animationType="slide" onRequestClose={pop} statusBarTranslucent navigationBarTranslucent>
        <SafeAreaProvider>
          {/* Lower sheets stay mounted (hidden) so their form state survives. */}
          {stack.map((entry, index) => {
            const Sheet = SHEETS[entry.type];
            return (
              <View key={entry.key} style={[styles.layer, index !== stack.length - 1 && styles.hidden]}>
                <Sheet {...entry.params} />
              </View>
            );
          })}
        </SafeAreaProvider>
      </Modal>
    </SheetContext.Provider>
  );
}

const styles = StyleSheet.create({
  layer: { flex: 1 },
  hidden: { display: 'none' },
});
