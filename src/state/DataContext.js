// All of the signed-in user's data, backed by the offline-first sync engine.
// Screens read plain arrays from here and call the actions to change data;
// syncing with Supabase happens in the background whenever there is a
// connection.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as Crypto from 'expo-crypto';
import { SyncEngine } from '../sync/engine';
import { createPersistence } from '../sync/persistence';
import { createSupabaseRemote } from '../sync/supabaseRemote';
import { createMemoryRemote } from '../sync/memoryRemote';
import { supabase } from '../lib/supabase';
import { DEMO_MODE } from '../config';
import { seedDemoData } from '../domain/demoData';
import { buildLegacyImport, markLegacyHandled, readLegacyData } from '../domain/legacyImport';
import { cleanTransaction } from '../domain/transactions';

const PERIODIC_SYNC_MS = 2 * 60 * 1000;
const CHANGE_SYNC_DELAY_MS = 800;

const DataContext = createContext(null);

const EMPTY_SNAPSHOT = {
  tables: { profiles: {}, categories: {}, saving_templates: {}, goals: {}, transactions: {}, subscriptions: {} },
  pending: 0,
  failed: 0,
  status: { state: 'idle', lastError: null },
  lastSyncedAt: null,
};
const noopSubscribe = () => () => {};
const emptySnapshot = () => EMPTY_SNAPSHOT;

const alive = (rows) => Object.values(rows).filter((row) => !row.deleted_at);

const byName = (a, b) => a.name.localeCompare(b.name, 'tr');

export function DataProvider({ user, children }) {
  const [engine, setEngine] = useState(null);
  const [online, setOnline] = useState(true);
  const [legacy, setLegacy] = useState(null);
  const syncTimer = useRef(null);
  const onlineRef = useRef(true);

  const store = useMemo(
    () =>
      engine
        ? { subscribe: (listener) => engine.subscribe(listener), getSnapshot: () => engine.getSnapshot() }
        : { subscribe: noopSubscribe, getSnapshot: emptySnapshot },
    [engine],
  );
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot);

  // One engine per signed-in user.
  useEffect(() => {
    const instance = new SyncEngine({
      userId: user.id,
      remote: DEMO_MODE ? createMemoryRemote() : createSupabaseRemote(supabase),
      persistence: createPersistence(AsyncStorage, user.id),
      newId: () => Crypto.randomUUID(),
      onError: (error) => console.warn('[sync]', error?.message || error),
    });
    let cancelled = false;
    instance.init().then(() => {
      if (cancelled) return;
      if (DEMO_MODE && !instance.hasLocalData()) seedDemoData(instance);
      setEngine(instance);
      if (onlineRef.current) instance.sync();
    });
    readLegacyData(AsyncStorage).then((data) => !cancelled && setLegacy(data));
    return () => {
      cancelled = true;
      clearTimeout(syncTimer.current);
      instance.destroy();
      setEngine(null);
    };
  }, [user.id]);

  // Sync when the connection comes back, when the app returns to the
  // foreground and periodically while it is open.
  useEffect(() => {
    if (!engine) return undefined;
    const unsubscribeNet = NetInfo.addEventListener((state) => {
      const isOnline = Boolean(state.isConnected) && state.isInternetReachable !== false;
      const cameOnline = isOnline && !onlineRef.current;
      onlineRef.current = isOnline;
      setOnline(isOnline);
      if (cameOnline) engine.sync();
    });
    const appState = AppState.addEventListener('change', (next) => {
      if (next === 'active' && onlineRef.current) engine.sync();
    });
    const interval = setInterval(() => {
      if (onlineRef.current && AppState.currentState === 'active') engine.sync();
    }, PERIODIC_SYNC_MS);
    return () => {
      unsubscribeNet();
      appState.remove();
      clearInterval(interval);
    };
  }, [engine]);

  const scheduleSync = useCallback(() => {
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      if (onlineRef.current) engine?.sync();
    }, CHANGE_SYNC_DELAY_MS);
  }, [engine]);

  const { tables } = snapshot;

  const derived = useMemo(() => {
    const transactions = alive(tables.transactions).sort(
      (a, b) => (b.occurred_on < a.occurred_on ? -1 : b.occurred_on > a.occurred_on ? 1 : b.created_at < a.created_at ? -1 : 1),
    );
    const categories = alive(tables.categories).sort(
      (a, b) => a.kind.localeCompare(b.kind) || a.sort_order - b.sort_order || byName(a, b),
    );
    const templates = alive(tables.saving_templates).sort(byName);
    const goals = alive(tables.goals).sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
    const index = (rows) => Object.fromEntries(rows.map((row) => [row.id, row]));
    const profile = tables.profiles[user.id] || null;
    const subscription = tables.subscriptions[user.id] || null;
    const premium =
      subscription?.plan === 'premium' && (!subscription.expires_at || Date.parse(subscription.expires_at) > Date.now());
    return {
      transactions,
      categories,
      categoriesById: index(categories),
      templates,
      templatesById: index(templates),
      goals,
      goalsById: index(goals),
      profile,
      currency: profile?.currency || 'TRY',
      displayName: profile?.display_name || user.name,
      plan: premium ? 'premium' : 'free',
    };
  }, [tables, user.id, user.name]);

  const actions = useMemo(() => {
    const save = (table, values) => {
      const row = engine.upsert(table, values);
      scheduleSync();
      return row;
    };
    const remove = (table, id) => {
      engine.remove(table, id);
      scheduleSync();
    };
    return {
      saveTransaction: (values) => save('transactions', cleanTransaction(values)),
      deleteTransaction: (id) => remove('transactions', id),
      saveTemplate: (values) => save('saving_templates', { ...values, name: values.name.trim() }),
      deleteTemplate: (id) => remove('saving_templates', id),
      saveGoal: (values) => save('goals', { ...values, name: values.name.trim() }),
      deleteGoal: (id) => remove('goals', id),
      saveCategory: (values) => save('categories', { ...values, name: values.name.trim() }),
      deleteCategory: (id) => remove('categories', id),
      updateProfile: (patch) => save('profiles', patch),
      syncNow: () => engine?.sync(),
      // Read straight from the engine: callers need the value right after a sync.
      unsyncedCount: () => {
        const current = engine?.getSnapshot();
        return current ? current.pending + current.failed : 0;
      },
      retryFailed: () => {
        engine.retryFailed();
        scheduleSync();
      },
    };
  }, [engine, scheduleSync]);

  const importLegacy = useCallback(async () => {
    const data = await readLegacyData(AsyncStorage);
    if (!data || !engine) return { templates: 0, transactions: 0 };
    const { templates, transactions } = buildLegacyImport(data, () => Crypto.randomUUID());
    for (const template of templates) engine.upsert('saving_templates', template);
    for (const transaction of transactions) engine.upsert('transactions', transaction);
    await engine.flush();
    await markLegacyHandled(AsyncStorage);
    setLegacy(null);
    scheduleSync();
    return { templates: templates.length, transactions: transactions.length };
  }, [engine, scheduleSync]);

  const dismissLegacy = useCallback(async () => {
    await markLegacyHandled(AsyncStorage);
    setLegacy(null);
  }, []);

  // Removes this user's offline copy from the device (used on sign out).
  const clearLocalData = useCallback(async () => {
    if (!engine) return;
    const persistence = createPersistence(AsyncStorage, user.id);
    engine.destroy();
    await engine.flush();
    await persistence.clear();
  }, [engine, user.id]);

  const value = useMemo(
    () => ({
      ...derived,
      ...actions,
      ready: Boolean(engine),
      // A fresh device has nothing to show until the first download finishes.
      initialSyncDone: Boolean(snapshot.lastSyncedAt) || (engine ? engine.hasLocalData() : false),
      sync: {
        state: snapshot.status.state,
        lastError: snapshot.status.lastError,
        pending: snapshot.pending,
        failed: snapshot.failed,
        lastSyncedAt: snapshot.lastSyncedAt,
        online,
      },
      legacy,
      importLegacy,
      dismissLegacy,
      clearLocalData,
    }),
    [derived, actions, engine, snapshot, online, legacy, importLegacy, dismissLegacy, clearLocalData],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used inside DataProvider');
  return context;
};
