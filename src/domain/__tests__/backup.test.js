import { BackupError, backupFileName, createBackup, parseBackup } from '../backup';
import { seedSampleData } from '../defaults';
import { LocalStore } from '../../store/store';
import { createPersistence } from '../../store/persistence';
import { createMemoryStorage } from '../../store/__tests__/memoryStorage';
import { newId } from '../../lib/id';

const makeStore = (storage = createMemoryStorage()) => new LocalStore({ persistence: createPersistence(storage), newId });

describe('backups', () => {
  test('a backup restores exactly the same records', async () => {
    const source = makeStore();
    seedSampleData(source, new Date(2026, 8, 24));
    const text = JSON.stringify(createBackup(source.getSnapshot().tables, new Date('2026-09-24T12:00:00Z')));

    const parsed = parseBackup(text);
    expect(parsed.exportedAt).toBe('2026-09-24T12:00:00.000Z');
    expect(parsed.counts.transactions).toBe(Object.keys(source.getSnapshot().tables.transactions).length);

    const storage = createMemoryStorage();
    const target = makeStore(storage);
    target.upsert('transactions', { kind: 'spending', amount: 1, occurred_on: '2026-01-01' });
    await target.replaceAll(parsed.tables);
    expect(target.getSnapshot().tables).toEqual(source.getSnapshot().tables);

    // …and the restored data is what the next app start loads.
    const reloaded = makeStore(storage);
    await reloaded.init();
    expect(reloaded.getSnapshot().tables).toEqual(source.getSnapshot().tables);
  });

  test('old backups get defaults for newer fields and always have settings', () => {
    const parsed = parseBackup(
      JSON.stringify({
        format: 'kripros-backup',
        version: 1,
        data: { transactions: [{ id: 't1', kind: 'spending', amount: '12.5', occurred_on: '2026-09-01' }] },
      }),
    );
    expect(parsed.tables.transactions.t1).toMatchObject({ amount: 12.5, recurring_id: null, category_id: null });
    expect(parsed.tables.settings.settings).toMatchObject({ currency: 'TRY' });
    expect(parsed.tables.recurring).toEqual({});
  });

  test.each([
    ['not json', 'Dosya okunamadı; geçerli bir yedek dosyası değil.'],
    [JSON.stringify({ hello: 'world' }), 'Bu bir Kripros yedek dosyası değil.'],
    [JSON.stringify({ format: 'kripros-backup', version: 99, data: {} }), 'Bu yedek uygulamanın daha yeni bir sürümüyle alınmış.'],
    [JSON.stringify({ format: 'kripros-backup', version: 1, data: { goals: {} } }), 'Yedek dosyası bozuk.'],
    [JSON.stringify({ format: 'kripros-backup', version: 1, data: { goals: [{ name: 'x' }] } }), 'Yedek dosyasında bozuk bir kayıt var.'],
    [
      JSON.stringify({ format: 'kripros-backup', version: 1, data: { transactions: [{ id: 'a', kind: 'gift', amount: 1, occurred_on: '2026-01-01' }] } }),
      'Yedek dosyasında geçersiz bir kayıt var.',
    ],
    [
      JSON.stringify({
        format: 'kripros-backup',
        version: 1,
        data: { recurring: [{ id: 'r', kind: 'spending', amount: 100, day_of_month: 32, next_on: '2026-10-01' }] },
      }),
      'Yedek dosyasında geçersiz bir kayıt var.',
    ],
  ])('rejects invalid files (%#)', (text, message) => {
    expect(() => parseBackup(text)).toThrow(BackupError);
    expect(() => parseBackup(text)).toThrow(message);
  });

  test('file names carry the date', () => {
    expect(backupFileName(new Date(2026, 8, 24))).toBe('kripros-yedek-2026-09-24.json');
  });
});
