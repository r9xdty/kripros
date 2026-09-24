// Backups are plain JSON files holding every record. Since the data only
// lives on the device, this is how it moves to a new phone or survives a
// reinstall.
import { SETTINGS_ID, TABLE_NAMES, withDefaults } from '../store/schema';
import { toDateKey } from '../lib/dates';

export const BACKUP_FORMAT = 'kripros-backup';
export const BACKUP_VERSION = 1;

export class BackupError extends Error {}

export const createBackup = (tables, now = new Date()) => ({
  format: BACKUP_FORMAT,
  version: BACKUP_VERSION,
  exported_at: now.toISOString(),
  data: Object.fromEntries(TABLE_NAMES.map((table) => [table, Object.values(tables[table] || {})])),
});

export const backupFileName = (now = new Date()) => `kripros-yedek-${toDateKey(now)}.json`;

const KINDS = ['income', 'spending', 'saving'];
const isAmount = (value) => Number(value) > 0;
const isDateKey = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

// Checks a backup file and returns its records keyed by id, plus counts for
// the confirmation message. Throws BackupError with a Turkish message.
export const parseBackup = (text) => {
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new BackupError('Dosya okunamadı; geçerli bir yedek dosyası değil.');
  }
  if (!json || json.format !== BACKUP_FORMAT || typeof json.data !== 'object' || !json.data) {
    throw new BackupError('Bu bir Kripros yedek dosyası değil.');
  }
  if (typeof json.version !== 'number' || json.version > BACKUP_VERSION) {
    throw new BackupError('Bu yedek uygulamanın daha yeni bir sürümüyle alınmış.');
  }

  const tables = {};
  for (const table of TABLE_NAMES) {
    const rows = json.data[table] ?? [];
    if (!Array.isArray(rows)) throw new BackupError('Yedek dosyası bozuk.');
    tables[table] = {};
    for (const row of rows) {
      if (!row || typeof row !== 'object' || typeof row.id !== 'string' || !row.id) {
        throw new BackupError('Yedek dosyasında bozuk bir kayıt var.');
      }
      tables[table][row.id] = withDefaults(table, row);
    }
  }

  const invalid = () => new BackupError('Yedek dosyasında geçersiz bir kayıt var.');
  for (const tx of Object.values(tables.transactions)) {
    if (!KINDS.includes(tx.kind) || !isAmount(tx.amount) || !isDateKey(tx.occurred_on)) throw invalid();
    tx.amount = Number(tx.amount);
  }
  for (const rule of Object.values(tables.recurring)) {
    const day = Number(rule.day_of_month);
    const valid = ['income', 'spending'].includes(rule.kind) && isAmount(rule.amount) && isDateKey(rule.next_on);
    if (!valid || !Number.isInteger(day) || day < 1 || day > 31) throw invalid();
    Object.assign(rule, { amount: Number(rule.amount), day_of_month: day });
  }
  for (const category of Object.values(tables.categories)) {
    category.monthly_budget = isAmount(category.monthly_budget) ? Number(category.monthly_budget) : null;
  }

  // A backup always restores into a set-up app.
  if (!tables.settings[SETTINGS_ID]) {
    tables.settings[SETTINGS_ID] = withDefaults('settings', { id: SETTINGS_ID });
  }

  return {
    tables,
    exportedAt: typeof json.exported_at === 'string' ? json.exported_at : null,
    counts: {
      transactions: Object.keys(tables.transactions).length,
      goals: Object.keys(tables.goals).length,
      categories: Object.keys(tables.categories).length,
    },
  };
};
