import { classifyError, createSupabaseRemote } from '../supabaseRemote';
import { bucketOf, createMemoryStorage, createPersistence } from '../persistence';

describe('classifyError', () => {
  test.each([
    [{ message: 'TypeError: Network request failed', code: '' }, 0, 'network'],
    [{ message: 'JWT expired', code: 'PGRST301' }, 401, 'auth'],
    [{ message: 'upstream', code: '' }, 503, 'server'],
    [{ message: 'check violation', code: '23514' }, 400, 'rejected'],
    [{ message: 'fk violation', code: '23503' }, 409, 'rejected'],
    [{ message: 'new row violates row-level security policy', code: '42501' }, 403, 'rejected'],
    [{ message: 'Could not find the table', code: 'PGRST205' }, 404, 'server'],
  ])('%j (%i) → %s', (error, status, kind) => {
    expect(classifyError(error, status).kind).toBe(kind);
  });
});

describe('createSupabaseRemote', () => {
  const fakeClient = (result) => {
    const calls = [];
    const builder = new Proxy(
      {},
      {
        get(_, prop) {
          if (prop === 'then') return (resolve) => resolve(result);
          return (...args) => {
            calls.push([prop, ...args]);
            return builder;
          };
        },
      },
    );
    return { client: { from: (table) => (calls.push(['from', table]), builder) }, calls };
  };

  test('pull builds an ordered, paged, incremental query', async () => {
    const { client, calls } = fakeClient({ data: [{ id: 'a' }], error: null, status: 200 });
    const rows = await createSupabaseRemote(client).pull('transactions', {
      since: '2026-09-24T10:00:00.000Z',
      excludeDeleted: true,
      offset: 1000,
      limit: 1000,
    });
    expect(rows).toEqual([{ id: 'a' }]);
    expect(calls).toEqual([
      ['from', 'transactions'],
      ['select', '*'],
      ['order', 'server_updated_at', { ascending: true }],
      ['order', 'id', { ascending: true }],
      ['range', 1000, 1999],
      ['gte', 'server_updated_at', '2026-09-24T10:00:00.000Z'],
      ['is', 'deleted_at', null],
    ]);
  });

  test('upsert returns canonical rows and throws classified errors', async () => {
    const ok = fakeClient({ data: [{ id: 'a', amount: 1 }], error: null, status: 201 });
    await expect(createSupabaseRemote(ok.client).upsert('goals', [{ id: 'a' }])).resolves.toEqual([{ id: 'a', amount: 1 }]);
    expect(ok.calls[1]).toEqual(['upsert', [{ id: 'a' }], { onConflict: 'id' }]);

    const offline = fakeClient({ data: null, error: { message: 'Network request failed', code: '' }, status: 0 });
    await expect(createSupabaseRemote(offline.client).upsert('goals', [])).rejects.toMatchObject({ kind: 'network' });
  });
});

describe('persistence', () => {
  test('only rewrites the buckets that changed', async () => {
    const storage = createMemoryStorage();
    const persistence = createPersistence(storage, 'u1');
    const rows = {};
    for (let i = 0; i < 100; i++) rows[`id-${i}`] = { id: `id-${i}` };
    await persistence.saveTable('transactions', rows);
    expect([...storage.map.keys()].filter((k) => k.includes(':transactions:'))).toHaveLength(16);

    const spy = jest.spyOn(storage, 'multiSet');
    await persistence.saveTable('transactions', rows, ['id-7']);
    const written = spy.mock.calls[0][0];
    expect(written).toHaveLength(1);
    expect(written[0][0]).toBe(`kripros:v1:u1:table:transactions:${bucketOf('transactions', 'id-7')}`);

    const loaded = await persistence.load();
    expect(Object.keys(loaded.tables.transactions)).toHaveLength(100);
  });

  test('users never share storage keys', async () => {
    const storage = createMemoryStorage();
    await createPersistence(storage, 'alice').saveTable('goals', { g: { id: 'g' } });
    const bob = await createPersistence(storage, 'bob').load();
    expect(bob.tables.goals).toEqual({});
  });
});
