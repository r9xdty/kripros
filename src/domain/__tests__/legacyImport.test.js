import { buildLegacyImport, markLegacyHandled, readLegacyData } from '../legacyImport';
import { createMemoryStorage } from '../../sync/persistence';

const legacySavings = [
  { id: 1727000000000, name: 'Kahve almadım', amount: 45, frequency: 'daily', createdAt: '2025-09-20T08:00:00.000Z' },
  { id: 1727000000001, name: 'Taksi yerine metro', amount: '150', frequency: 'weekly' },
  { id: 1727000000002, name: '', amount: 10 },
];

const legacyDaily = {
  '2025-09-21': [
    { id: 1727000000000, name: 'Kahve almadım', amount: 45, uniqueId: 1.5, addedAt: '2025-09-21T07:30:00.000Z' },
    { id: 1727000000001, name: 'Taksi yerine metro', amount: 150 },
  ],
  '2025-09-21_removed': [{ id: 1727000000000, name: 'Kahve almadım', amount: 45 }],
  '2025-09-22': [{ id: 999, name: 'Silinmiş şablon', amount: 20 }],
  'bozuk': [{ amount: 5 }],
};

describe('legacy import', () => {
  test('finds old on-device data once', async () => {
    const storage = createMemoryStorage();
    expect(await readLegacyData(storage)).toBeNull();

    await storage.setItem('@kripros_savings', JSON.stringify(legacySavings));
    await storage.setItem('@kripros_daily_savings', JSON.stringify(legacyDaily));
    const legacy = await readLegacyData(storage);
    expect(legacy.entryCount).toBe(4);

    await markLegacyHandled(storage);
    expect(await readLegacyData(storage)).toBeNull();
  });

  test('maps templates and entries onto the new tables', () => {
    let n = 0;
    const { templates, transactions } = buildLegacyImport(
      { savings: legacySavings, daily: legacyDaily },
      () => `new-${++n}`,
      new Date(2026, 8, 24),
    );

    expect(templates).toEqual([
      { id: 'new-1', name: 'Kahve almadım', amount: 45, frequency: 'daily' },
      { id: 'new-2', name: 'Taksi yerine metro', amount: 150, frequency: 'weekly' },
    ]);
    expect(transactions).toHaveLength(3);
    expect(transactions[0]).toMatchObject({
      kind: 'saving',
      amount: 45,
      occurred_on: '2025-09-21',
      template_id: 'new-1',
      created_at: '2025-09-21T07:30:00.000Z',
    });
    expect(transactions[1]).toMatchObject({ template_id: 'new-2', amount: 150 });
    // Entry whose template was deleted keeps its name but no template link.
    expect(transactions[2]).toMatchObject({ title: 'Silinmiş şablon', template_id: null });
  });
});
