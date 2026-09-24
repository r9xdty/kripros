import { SyncEngine, toMillis } from '../engine';
import { createMemoryStorage, createPersistence } from '../persistence';
import { createMemoryRemote as createFakeServer } from '../memoryRemote';

const USER = 'user-1';

const setup = ({ storage = createMemoryStorage(), server = createFakeServer(), clock, ...options } = {}) => {
  let n = 0;
  const time = clock || { ms: Date.parse('2026-09-24T10:00:00.000Z') };
  const engine = new SyncEngine({
    userId: USER,
    remote: server,
    persistence: createPersistence(storage, USER),
    now: () => new Date(time.ms),
    newId: () => `id-${++n}`,
    ...options,
  });
  return { engine, server, storage, time };
};

const tx = (overrides = {}) => ({
  kind: 'spending',
  amount: 50,
  title: 'Market',
  occurred_on: '2026-09-24',
  ...overrides,
});

const rowsOf = (engine, table) => Object.values(engine.getSnapshot().tables[table]);

describe('SyncEngine', () => {
  test('changes made offline are kept and pushed once back online', async () => {
    const { engine, server } = setup();
    server.offline = true;

    const row = engine.upsert('transactions', tx());
    expect(engine.getSnapshot().pending).toBe(1);

    const offline = await engine.sync();
    expect(offline.ok).toBe(false);
    expect(engine.getSnapshot().status.state).toBe('offline');
    expect(rowsOf(engine, 'transactions')).toHaveLength(1);

    server.offline = false;
    const online = await engine.sync();
    expect(online.ok).toBe(true);
    expect(engine.getSnapshot().pending).toBe(0);
    expect(server.db.transactions[row.id]).toMatchObject({ amount: 50, user_id: USER });
    expect(engine.getSnapshot().tables.transactions[row.id].server_updated_at).toBeDefined();
  });

  test('pushes complete rows so the server never fills in missing columns', async () => {
    const { engine, server } = setup();
    const pushed = [];
    server.beforeUpsert = async (table, rows) => pushed.push(...rows);
    engine.upsert('transactions', tx());
    await engine.sync();
    expect(pushed[0]).toEqual(
      expect.objectContaining({ note: null, deleted_at: null, category_id: null, goal_id: null, template_id: null }),
    );
    expect(pushed[0]).not.toHaveProperty('server_updated_at');
  });

  test('local data and the outbox survive an app restart', async () => {
    const storage = createMemoryStorage();
    const server = createFakeServer();
    server.offline = true;
    const first = setup({ storage, server });
    first.engine.upsert('transactions', tx({ amount: 12.5 }));
    first.engine.upsert('goals', { name: 'Tatil', target_amount: 20000 });
    await first.engine.flush();

    const second = setup({ storage, server });
    await second.engine.init();
    expect(rowsOf(second.engine, 'transactions')[0].amount).toBe(12.5);
    expect(rowsOf(second.engine, 'goals')[0].name).toBe('Tatil');
    expect(second.engine.getSnapshot().pending).toBe(2);

    server.offline = false;
    await second.engine.sync();
    expect(Object.keys(server.db.transactions)).toHaveLength(1);
    expect(Object.keys(server.db.goals)).toHaveLength(1);
  });

  test('pulls rows created on another device and does not re-apply them', async () => {
    const { engine, server } = setup();
    server.write('transactions', {
      id: 'remote-1',
      user_id: USER,
      ...tx({ amount: '99.90' }),
      created_at: '2026-09-24T09:00:00.000Z',
      updated_at: '2026-09-24T09:00:00.000Z',
      deleted_at: null,
    });

    await engine.sync();
    const pulled = engine.getSnapshot().tables.transactions['remote-1'];
    expect(pulled.amount).toBe(99.9); // numeric strings are normalised
    const pullsAfterFirst = server.calls.pull;

    const listener = jest.fn();
    engine.subscribe(listener);
    await engine.sync();
    expect(server.calls.pull).toBeGreaterThan(pullsAfterFirst);
    expect(engine.getSnapshot().tables.transactions['remote-1']).toBe(pulled);
  });

  test('a newer edit from another device wins over an older local edit', async () => {
    const { engine, server, time } = setup();
    const row = engine.upsert('transactions', tx({ amount: 10 }));
    await engine.sync();

    // Phone B edits later than phone A.
    time.ms += 1000;
    engine.upsert('transactions', { id: row.id, amount: 20 });
    server.write('transactions', { ...server.db.transactions[row.id], amount: 30, updated_at: new Date(time.ms + 5000).toISOString() });

    await engine.sync();
    expect(engine.getSnapshot().tables.transactions[row.id].amount).toBe(30);
    expect(server.db.transactions[row.id].amount).toBe(30);
    expect(engine.getSnapshot().pending).toBe(0);
  });

  test('a newer local edit overwrites the server copy', async () => {
    const { engine, server, time } = setup();
    const row = engine.upsert('transactions', tx({ amount: 10 }));
    await engine.sync();

    server.write('transactions', { ...server.db.transactions[row.id], amount: 30, updated_at: new Date(time.ms + 1000).toISOString() });
    time.ms += 5000;
    engine.upsert('transactions', { id: row.id, amount: 20 });

    await engine.sync();
    expect(server.db.transactions[row.id].amount).toBe(20);
    expect(engine.getSnapshot().tables.transactions[row.id].amount).toBe(20);
  });

  test('a pending local edit is not overwritten by a pull', async () => {
    const { engine, server, time } = setup();
    const row = engine.upsert('transactions', tx({ amount: 10 }));
    await engine.sync();

    server.offline = true;
    time.ms += 5000;
    engine.upsert('transactions', { id: row.id, amount: 77 });
    // Pull succeeds while push is impossible: simulate by pulling directly.
    server.offline = false;
    server.write('transactions', { ...server.db.transactions[row.id], amount: 5, updated_at: new Date(time.ms - 1000).toISOString() });
    await engine.pull();
    expect(engine.getSnapshot().tables.transactions[row.id].amount).toBe(77);

    await engine.sync();
    expect(server.db.transactions[row.id].amount).toBe(77);
  });

  test('an edit made while a push is in flight is not lost', async () => {
    const { engine, server, time } = setup();
    const row = engine.upsert('transactions', tx({ amount: 10 }));

    let release;
    server.beforeUpsert = () => new Promise((resolve) => (release = resolve));
    const syncing = engine.sync();
    await new Promise((r) => setTimeout(r, 0));

    time.ms += 10;
    engine.upsert('transactions', { id: row.id, amount: 11 });
    server.beforeUpsert = null;
    release();
    await syncing;

    // The rerun triggered by the edit pushes the newer amount.
    await engine.sync();
    expect(engine.getSnapshot().tables.transactions[row.id].amount).toBe(11);
    expect(server.db.transactions[row.id].amount).toBe(11);
    expect(engine.getSnapshot().pending).toBe(0);
  });

  test('deletions reach the server and other devices', async () => {
    const { engine, server } = setup();
    const row = engine.upsert('transactions', tx());
    await engine.sync();

    engine.remove('transactions', row.id);
    await engine.sync();
    expect(server.db.transactions[row.id].deleted_at).toBeTruthy();
    expect(engine.getSnapshot().tables.transactions[row.id]).toBeUndefined();

    // Deleted on another device
    const other = engine.upsert('transactions', tx({ amount: 1 }));
    await engine.sync();
    server.write('transactions', {
      ...server.db.transactions[other.id],
      deleted_at: '2026-09-24T11:00:00.000Z',
      updated_at: '2026-09-24T11:00:00.000Z',
    });
    await engine.sync();
    expect(engine.getSnapshot().tables.transactions[other.id]).toBeUndefined();
  });

  test('a fresh device does not download tombstones', async () => {
    const { engine, server } = setup();
    server.write('transactions', { id: 'gone', user_id: USER, ...tx(), updated_at: '2026-09-24T09:00:00.000Z', deleted_at: '2026-09-24T09:00:00.000Z' });
    server.write('transactions', { id: 'kept', user_id: USER, ...tx(), updated_at: '2026-09-24T09:00:00.000Z', deleted_at: null });
    await engine.sync();
    expect(Object.keys(engine.getSnapshot().tables.transactions)).toEqual(['kept']);
  });

  test('pulls large tables page by page', async () => {
    const { engine, server } = setup({ pageSize: 10 });
    for (let i = 0; i < 25; i++) {
      server.write('transactions', { id: `r${String(i).padStart(2, '0')}`, user_id: USER, ...tx({ amount: i + 1 }), updated_at: '2026-09-24T09:00:00.000Z', deleted_at: null });
    }
    await engine.sync();
    expect(Object.keys(engine.getSnapshot().tables.transactions)).toHaveLength(25);
  });

  test('rows edited on another device while paging are not skipped', async () => {
    const { engine, server } = setup({ pageSize: 10 });
    for (let i = 0; i < 25; i++) {
      server.write('transactions', { id: `r${String(i).padStart(2, '0')}`, user_id: USER, ...tx({ amount: i + 1 }), updated_at: '2026-09-24T09:00:00.000Z', deleted_at: null });
    }
    const pull = server.pull;
    let edited = false;
    server.pull = async (...args) => {
      const rows = await pull(...args);
      if (!edited && args[0] === 'transactions') {
        edited = true;
        // Moves r03 to the end of the ordering between page 1 and page 2.
        server.write('transactions', { ...server.db.transactions.r03, amount: 999, updated_at: '2026-09-24T09:30:00.000Z' });
      }
      return rows;
    };
    await engine.sync();
    const local = engine.getSnapshot().tables.transactions;
    expect(Object.keys(local)).toHaveLength(25);
    expect(local.r03.amount).toBe(999);
  });

  test('a row and its outbox entry are written to storage together', async () => {
    const storage = createMemoryStorage();
    const spy = jest.spyOn(storage, 'multiSet');
    const { engine } = setup({ storage });
    engine.upsert('transactions', tx());
    await engine.flush();
    const writes = spy.mock.calls.map((call) => call[0].map(([key]) => key));
    expect(writes.some((keys) => keys.some((k) => k.includes(':table:transactions:')) && keys.some((k) => k.endsWith(':outbox')))).toBe(true);
  });

  test('queue entries without a row are dropped instead of staying pending forever', async () => {
    const storage = createMemoryStorage();
    await storage.setItem(`kripros:v1:${USER}:outbox`, JSON.stringify({ 'transactions:ghost': { table: 'transactions', id: 'ghost', attempts: 0 } }));
    const { engine } = setup({ storage });
    await engine.init();
    expect(engine.getSnapshot().pending).toBe(1);
    await engine.sync();
    expect(engine.getSnapshot().pending).toBe(0);
  });

  test('an interrupted first download resumes and still learns about deletions', async () => {
    const { engine, server } = setup({ pageSize: 10 });
    for (let i = 0; i < 25; i++) {
      server.write('transactions', { id: `r${String(i).padStart(2, '0')}`, user_id: USER, ...tx({ amount: i + 1 }), updated_at: '2026-09-24T09:00:00.000Z', deleted_at: null });
    }
    const pull = server.pull;
    let calls = 0;
    server.pull = async (table, options) => {
      if (table === 'transactions' && ++calls === 2) throw new (jest.requireActual('../engine').SyncError)('network', 'dropped');
      return pull(table, options);
    };
    expect((await engine.sync()).ok).toBe(false);
    expect(Object.keys(engine.getSnapshot().tables.transactions)).toHaveLength(10);
    expect(engine.getSnapshot().lastSyncedAt).toBeNull();

    // Another device deletes a row we already downloaded.
    server.write('transactions', { ...server.db.transactions.r02, deleted_at: '2026-09-24T12:00:00.000Z', updated_at: '2026-09-24T12:00:00.000Z' });
    server.pull = pull;
    expect((await engine.sync()).ok).toBe(true);
    const local = engine.getSnapshot().tables.transactions;
    expect(local.r02).toBeUndefined();
    expect(Object.keys(local)).toHaveLength(24);
  });

  test('upsertMany applies a batch with one queue update', () => {
    const { engine } = setup();
    const rows = engine.upsertMany('transactions', [tx({ amount: 1 }), tx({ amount: 2 }), tx({ amount: 3 })]);
    expect(rows).toHaveLength(3);
    expect(new Set(rows.map((r) => r.id)).size).toBe(3);
    expect(engine.getSnapshot().pending).toBe(3);
  });

  test('parents are pushed before children created offline', async () => {
    const { engine, server } = setup();
    server.offline = true;
    const goal = engine.upsert('goals', { name: 'Araba', target_amount: 500000 });
    const category = engine.upsert('categories', { kind: 'spending', name: 'Kahve' });
    engine.upsert('transactions', tx({ kind: 'saving', goal_id: goal.id }));
    engine.upsert('transactions', tx({ category_id: category.id }));
    server.offline = false;

    const result = await engine.sync();
    expect(result.ok).toBe(true);
    expect(engine.getSnapshot().pending).toBe(0);
    expect(Object.keys(server.db.transactions)).toHaveLength(2);
  });

  test('a row the server rejects does not block the others', async () => {
    const { engine, server } = setup({ maxAttempts: 2 });
    server.reject = (table, row) => (row.amount < 0 ? 'amount must be positive' : null);
    engine.upsert('transactions', tx({ amount: 5 }));
    const bad = engine.upsert('transactions', tx({ amount: -1 }));
    engine.upsert('transactions', tx({ amount: 7 }));

    await engine.sync();
    expect(Object.keys(server.db.transactions)).toHaveLength(2);
    expect(engine.getSnapshot().pending).toBe(1);

    await engine.sync();
    expect(engine.getSnapshot().pending).toBe(0);
    expect(engine.getSnapshot().failed).toBe(1);

    // Fixing the row re-queues it.
    engine.upsert('transactions', { id: bad.id, amount: 3 });
    expect(engine.getSnapshot().failed).toBe(0);
    await engine.sync();
    expect(server.db.transactions[bad.id].amount).toBe(3);
  });

  test('retryFailed gives rejected rows another chance', async () => {
    const { engine, server } = setup({ maxAttempts: 1 });
    let rejecting = true;
    server.reject = () => (rejecting ? 'temporarily invalid' : null);
    engine.upsert('transactions', tx());
    await engine.sync();
    expect(engine.getSnapshot().failed).toBe(1);

    rejecting = false;
    engine.retryFailed();
    await engine.sync();
    expect(engine.getSnapshot().failed).toBe(0);
    expect(Object.keys(server.db.transactions)).toHaveLength(1);
  });

  test('auth failures stop the sync without touching the outbox', async () => {
    const { engine, server } = setup();
    const { SyncError } = jest.requireActual('../engine');
    server.upsert = async () => {
      throw new SyncError('auth', 'JWT expired');
    };
    engine.upsert('transactions', tx());
    const result = await engine.sync();
    expect(result.ok).toBe(false);
    expect(engine.getSnapshot().status.state).toBe('error');
    expect(engine.getSnapshot().pending).toBe(1);
  });

  test('concurrent sync calls share one run', async () => {
    const { engine, server } = setup();
    engine.upsert('transactions', tx());
    const [a, b] = await Promise.all([engine.sync(), engine.sync()]);
    expect(a).toBe(b);
    expect(server.calls.upsert).toBe(1);
  });

  test('timestamps keep increasing even within the same millisecond', () => {
    const { engine } = setup();
    const row = engine.upsert('transactions', tx());
    const again = engine.upsert('transactions', { id: row.id, amount: 2 });
    expect(toMillis(again.updated_at)).toBeGreaterThan(toMillis(row.updated_at));
  });

  test('the profile row always uses the user id and cannot be deleted by accident', async () => {
    const { engine, server } = setup();
    const profile = engine.upsert('profiles', { currency: 'EUR' });
    expect(profile.id).toBe(USER);
    expect(profile).not.toHaveProperty('user_id');
    await engine.sync();
    expect(server.db.profiles[USER].currency).toBe('EUR');
  });

  test('read-only tables are pulled but never written', async () => {
    const { engine, server } = setup();
    server.write('subscriptions', { id: USER, plan: 'premium', updated_at: '2026-09-24T09:00:00.000Z' });
    await engine.sync();
    expect(engine.getSnapshot().tables.subscriptions[USER].plan).toBe('premium');
    expect(() => engine.upsert('subscriptions', { plan: 'free' })).toThrow();
  });

  test('a destroyed engine stops quietly mid-sync', async () => {
    const { engine, server } = setup();
    engine.upsert('transactions', tx());
    let release;
    server.beforeUpsert = () => new Promise((resolve) => (release = resolve));
    const listener = jest.fn();
    engine.subscribe(listener);
    const syncing = engine.sync();
    await new Promise((r) => setTimeout(r, 0));
    engine.destroy();
    listener.mockClear();
    release();
    const result = await syncing;
    expect(result.aborted).toBe(true);
    expect(listener).not.toHaveBeenCalled();
  });

  test('parses Supabase microsecond timestamps', () => {
    expect(toMillis('2026-09-24T10:00:00.123456+00:00')).toBe(Date.parse('2026-09-24T10:00:00.123Z'));
    expect(toMillis(null)).toBe(0);
  });
});
