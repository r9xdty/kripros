// The first version of the app stored its data under the AsyncStorage keys
// below, in a different shape. It can be imported into the current format
// once.
import { parseAmount } from '../lib/money';
import { toDateKey } from '../lib/dates';

const LEGACY_KEYS = {
  savings: '@kripros_savings',
  daily: '@kripros_daily_savings',
};
const IMPORTED_FLAG = '@kripros_legacy_handled';

const readJson = async (storage, key, fallback) => {
  try {
    const raw = await storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

// Returns the legacy data, or null when there is nothing (left) to import.
export const readLegacyData = async (storage) => {
  if (await storage.getItem(IMPORTED_FLAG)) return null;
  const savings = await readJson(storage, LEGACY_KEYS.savings, []);
  const daily = await readJson(storage, LEGACY_KEYS.daily, {});
  const entryCount = Object.entries(daily)
    .filter(([key, list]) => !key.includes('_removed') && Array.isArray(list))
    .reduce((n, [, list]) => n + list.length, 0);
  if ((!Array.isArray(savings) || savings.length === 0) && entryCount === 0) return null;
  return { savings: Array.isArray(savings) ? savings : [], daily, entryCount };
};

export const markLegacyHandled = (storage) => storage.setItem(IMPORTED_FLAG, new Date().toISOString());

const FREQUENCIES = ['daily', 'weekly', 'monthly', 'yearly'];

const isDateKey = (key) => /^\d{4}-\d{2}-\d{2}$/.test(key);

// Converts legacy data into rows for saving_templates and transactions.
export const buildLegacyImport = (legacy, newId, now = new Date()) => {
  const templateIds = new Map();
  const templates = [];

  for (const item of legacy.savings) {
    const amount = parseAmount(item?.amount);
    const name = String(item?.name ?? '').trim().slice(0, 60);
    if (!name || !(amount > 0)) continue;
    const id = newId();
    templateIds.set(String(item.id), id);
    templates.push({
      id,
      name,
      amount,
      frequency: FREQUENCIES.includes(item.frequency) ? item.frequency : 'daily',
    });
  }

  const today = toDateKey(now);
  const transactions = [];
  for (const [dateKey, list] of Object.entries(legacy.daily)) {
    if (!isDateKey(dateKey) || !Array.isArray(list) || dateKey > today) continue;
    for (const entry of list) {
      const amount = parseAmount(entry?.amount);
      if (!(amount > 0)) continue;
      const createdAt = entry.addedAt && !Number.isNaN(Date.parse(entry.addedAt)) ? entry.addedAt : `${dateKey}T12:00:00.000Z`;
      transactions.push({
        id: newId(),
        kind: 'saving',
        amount,
        title: String(entry.name ?? '').trim().slice(0, 80),
        occurred_on: dateKey,
        template_id: templateIds.get(String(entry.id)) ?? null,
        created_at: createdAt,
      });
    }
  }

  return { templates, transactions };
};
