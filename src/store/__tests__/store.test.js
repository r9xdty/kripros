import { LocalStore } from '../store';
import { bucketOf, createMemoryStorage, createPersistence } from '../persistence';

const setup = (storage = createMemoryStorage()) => {
  let n = 0;
  const store = new LocalStore({
    persistence: createPersistence(storage),
    newId: () => `id-${++n}`,
    now: () => new Date('2026-09-24T10:00:00.000Z'),
  });
  return { store, storage };
};

const tx = (overrides = {}) => ({ kind: 'spending', amount: 50, occurred_on: '2026-09-24', ...overrides });

describe('LocalStore', () => {
  test('new records get ids, timestamps and defaults', () => {
    const { store } = setup();
    const row = store.upsert('transactions', tx());
    expect(row).toMatchObject({ id: 'id-1', created_at: '2026-09-24T10:00:00.000Z', title: '', note: null, category_id: null });
    expect(store.getSnapshot().tables.transactions['id-1']).toBe(row);
  });

  test('updates merge into the existing record', () => {
    const { store } = setup();
    const row = store.upsert('transactions', tx({ title: 'Market' }));
    const updated = store.upsert('transactions', { id: row.id, amount: 75 });
    expect(updated).toMatchObject({ title: 'Market', amount: 75, created_at: row.created_at });
  });

  test('settings is a single record', () => {
    const { store } = setup();
    store.upsert('settings', { currency: 'EUR' });
    store.upsert('settings', { display_name: 'Ayşe' });
    const rows = Object.values(store.getSnapshot().tables.settings);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ currency: 'EUR', display_name: 'Ayşe' });
  });

  test('data survives an app restart', async () => {
    const storage = createMemoryStorage();
    const first = setup(storage).store;
    first.upsert('goals', { name: 'Tatil', target_amount: 20000 });
    first.upsertMany('transactions', [tx({ amount: 1 }), tx({ amount: 2 }), tx({ amount: 3 })]);
    const removed = first.upsert('transactions', tx({ amount: 4 }));
    first.remove('transactions', removed.id);
    await first.flush();

    const second = setup(storage).store;
    await second.init();
    const { tables } = second.getSnapshot();
    expect(Object.values(tables.goals)[0].name).toBe('Tatil');
    expect(Object.values(tables.transactions).map((t) => t.amount).sort()).toEqual([1, 2, 3]);
  });

  test('changes made in the same moment are written in one storage call', async () => {
    const { store, storage } = setup();
    const spy = jest.spyOn(storage, 'multiSet');
    store.upsert('goals', { name: 'Tatil', target_amount: 1 });
    store.upsert('transactions', tx());
    await store.flush();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('only the changed bucket of a large table is rewritten', async () => {
    const { store, storage } = setup();
    store.upsertMany('transactions', Array.from({ length: 100 }, (_, i) => tx({ amount: i + 1 })));
    await store.flush();
    const spy = jest.spyOn(storage, 'multiSet');
    store.upsert('transactions', { id: 'id-7', amount: 999 });
    await store.flush();
    const keys = spy.mock.calls[0][0].map(([key]) => key);
    expect(keys).toEqual([`kripros:v2:table:transactions:${bucketOf('transactions', 'id-7')}`]);
  });

  test('reset removes everything from memory and storage', async () => {
    const { store, storage } = setup();
    store.upsert('transactions', tx());
    store.upsert('settings', { display_name: 'Ayşe' });
    await store.flush();
    await store.reset();
    expect(store.isEmpty()).toBe(true);
    expect([...storage.map.keys()]).toHaveLength(0);
  });

  test('listeners hear about every change', () => {
    const { store } = setup();
    const listener = jest.fn();
    store.subscribe(listener);
    const row = store.upsert('transactions', tx());
    store.remove('transactions', row.id);
    store.remove('transactions', 'missing');
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
