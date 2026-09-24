// All of the app's data. Everything is stored on the device; screens read
// plain arrays from here and call the actions to change data.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStore } from '../store/store';
import { createPersistence } from '../store/persistence';
import { SETTINGS_ID } from '../store/schema';
import { newId } from '../lib/id';
import { todayKey } from '../lib/dates';
import { pickTextFile, saveTextFile } from '../lib/files';
import { seedDefaults, seedSampleData } from '../domain/defaults';
import { buildLegacyImport, markLegacyHandled, readLegacyData } from '../domain/legacyImport';
import { cleanTransaction } from '../domain/transactions';
import { collectDue, scheduleNext } from '../domain/recurring';
import { backupFileName, createBackup, parseBackup } from '../domain/backup';

const DataContext = createContext(null);

const EMPTY_SNAPSHOT = {
  tables: { settings: {}, categories: {}, saving_templates: {}, goals: {}, recurring: {}, transactions: {} },
};
const noopSubscribe = () => () => {};
const emptySnapshot = () => EMPTY_SNAPSHOT;

const byName = (a, b) => a.name.localeCompare(b.name, 'tr');

// Creates the records of recurring rules whose date has arrived.
const applyDueRecurring = (store) => {
  const { transactions, updates } = collectDue(Object.values(store.getSnapshot().tables.recurring), todayKey());
  if (transactions.length) store.upsertMany('transactions', transactions);
  if (updates.length) store.upsertMany('recurring', updates);
};

export function DataProvider({ children }) {
  const [store, setStore] = useState(null);
  const [legacy, setLegacy] = useState(null);

  useEffect(() => {
    const instance = new LocalStore({
      persistence: createPersistence(AsyncStorage),
      newId,
      onError: (error) => console.warn('[storage]', error?.message || error),
    });
    let cancelled = false;
    instance.init().then(() => {
      if (cancelled) return;
      applyDueRecurring(instance);
      setStore(instance);
    });
    readLegacyData(AsyncStorage).then((data) => !cancelled && setLegacy(data));
    return () => {
      cancelled = true;
    };
  }, []);

  // Recurring records also fall due while the app sits in the background.
  useEffect(() => {
    if (!store) return undefined;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') applyDueRecurring(store);
    });
    return () => subscription.remove();
  }, [store]);

  const external = useMemo(
    () =>
      store
        ? { subscribe: (listener) => store.subscribe(listener), getSnapshot: () => store.getSnapshot() }
        : { subscribe: noopSubscribe, getSnapshot: emptySnapshot },
    [store],
  );
  const { tables } = useSyncExternalStore(external.subscribe, external.getSnapshot);

  const derived = useMemo(() => {
    const transactions = Object.values(tables.transactions).sort(
      (a, b) => (b.occurred_on < a.occurred_on ? -1 : b.occurred_on > a.occurred_on ? 1 : b.created_at < a.created_at ? -1 : 1),
    );
    const categories = Object.values(tables.categories).sort(
      (a, b) => a.kind.localeCompare(b.kind) || a.sort_order - b.sort_order || byName(a, b),
    );
    const templates = Object.values(tables.saving_templates).sort(byName);
    const goals = Object.values(tables.goals).sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
    const recurring = Object.values(tables.recurring).sort((a, b) => (a.next_on < b.next_on ? -1 : 1));
    const index = (rows) => Object.fromEntries(rows.map((row) => [row.id, row]));
    const settings = tables.settings[SETTINGS_ID] || null;
    return {
      transactions,
      categories,
      categoriesById: index(categories),
      templates,
      templatesById: index(templates),
      goals,
      goalsById: index(goals),
      recurring,
      // The web demo only holds sample data, so it leaves backups out.
      backupsEnabled: Platform.OS !== 'web',
      currency: settings?.currency || 'TRY',
      displayName: settings?.display_name || '',
      // The welcome screen is shown until the first start is set up.
      initialized: Boolean(settings),
    };
  }, [tables]);

  const actions = useMemo(() => {
    if (!store) return {};
    return {
      saveTransaction: (values) => store.upsert('transactions', cleanTransaction(values)),
      deleteTransaction: (id) => store.remove('transactions', id),
      saveTemplate: (values) => store.upsert('saving_templates', { ...values, name: values.name.trim() }),
      deleteTemplate: (id) => store.remove('saving_templates', id),
      saveGoal: (values) => store.upsert('goals', { ...values, name: values.name.trim() }),
      deleteGoal: (id) => store.remove('goals', id),
      saveCategory: (values) => store.upsert('categories', { ...values, name: values.name.trim() }),
      deleteCategory: (id) => store.remove('categories', id),
      // A new rule, or one whose day changed, starts at its next occurrence
      // (today included).
      saveRecurring: (values) => {
        const existing = values.id ? store.getSnapshot().tables.recurring[values.id] : null;
        const dayChanged = !existing || existing.day_of_month !== values.day_of_month;
        const row = store.upsert('recurring', {
          ...values,
          title: values.title.trim(),
          next_on: dayChanged ? scheduleNext(values.day_of_month, todayKey(), existing?.next_on) : existing.next_on,
        });
        applyDueRecurring(store);
        return row;
      },
      // Records already created by the rule stay.
      deleteRecurring: (id) => store.remove('recurring', id),
      updateSettings: (patch) => store.upsert('settings', patch),
      exportBackup: () => saveTextFile(backupFileName(), JSON.stringify(createBackup(store.getSnapshot().tables), null, 2)),
      // Returns the parsed backup (or null when cancelled); throws BackupError.
      readBackupFile: async () => {
        const text = await pickTextFile();
        return text == null ? null : parseBackup(text);
      },
      restoreBackup: async (backup) => {
        await store.replaceAll(backup.tables);
        applyDueRecurring(store);
      },
      // First start: default categories only, or a few months of sample data.
      startEmpty: () => seedDefaults(store),
      startWithSampleData: () => seedSampleData(store),
      // Deletes every record; the welcome screen appears again.
      resetAll: () => store.reset(),
    };
  }, [store]);

  const importLegacy = useCallback(async () => {
    const data = await readLegacyData(AsyncStorage);
    if (!data || !store) return { templates: 0, transactions: 0 };
    const { templates, transactions } = buildLegacyImport(data, newId);
    if (templates.length) store.upsertMany('saving_templates', templates);
    if (transactions.length) store.upsertMany('transactions', transactions);
    await store.flush();
    await markLegacyHandled(AsyncStorage);
    setLegacy(null);
    return { templates: templates.length, transactions: transactions.length };
  }, [store]);

  const dismissLegacy = useCallback(async () => {
    await markLegacyHandled(AsyncStorage);
    setLegacy(null);
  }, []);

  const value = useMemo(
    () => ({ ...derived, ...actions, ready: Boolean(store), legacy, importLegacy, dismissLegacy }),
    [derived, actions, store, legacy, importLegacy, dismissLegacy],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used inside DataProvider');
  return context;
};
