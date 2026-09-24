import { DEFAULT_CATEGORIES, seedDefaults, seedSampleData } from '../defaults';
import { LocalStore } from '../../store/store';
import { createMemoryStorage, createPersistence } from '../../store/persistence';
import { newId } from '../../lib/uuid';
import { toDateKey } from '../../lib/dates';

const makeStore = () => new LocalStore({ persistence: createPersistence(createMemoryStorage()), newId });

test('an empty start has the default categories and settings', () => {
  const store = makeStore();
  seedDefaults(store);
  const { tables } = store.getSnapshot();
  expect(Object.keys(tables.categories)).toHaveLength(DEFAULT_CATEGORIES.length);
  expect(Object.keys(tables.settings)).toHaveLength(1);
  expect(Object.keys(tables.transactions)).toHaveLength(0);
});

test('sample data only references records that exist and has no future dates', () => {
  const store = makeStore();
  const now = new Date(2026, 8, 24);
  seedSampleData(store, now);
  const { tables } = store.getSnapshot();
  const transactions = Object.values(tables.transactions);
  expect(transactions.length).toBeGreaterThan(100);
  for (const tx of transactions) {
    if (tx.category_id) expect(tables.categories[tx.category_id]).toBeDefined();
    if (tx.template_id) expect(tables.saving_templates[tx.template_id]).toBeDefined();
    if (tx.goal_id) expect(tables.goals[tx.goal_id]).toBeDefined();
    expect(tx.occurred_on <= toDateKey(now)).toBe(true);
    expect(tx.amount).toBeGreaterThan(0);
  }
  expect(Object.keys(tables.settings)).toHaveLength(1);
});

test('generated ids do not collide', () => {
  const ids = new Set(Array.from({ length: 20000 }, () => newId()));
  expect(ids.size).toBe(20000);
});
