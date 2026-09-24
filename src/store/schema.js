// Record types kept on the device. `settings` holds a single row.

export const TABLES = {
  settings: { buckets: 1 },
  categories: { buckets: 1 },
  saving_templates: { buckets: 1 },
  goals: { buckets: 1 },
  recurring: { buckets: 1 },
  // Split across several storage keys so no single value grows past the
  // ~2 MB per-item limit of AsyncStorage on Android.
  transactions: { buckets: 16 },
};

export const TABLE_NAMES = Object.keys(TABLES);

export const SETTINGS_ID = 'settings';

// Values for fields a new record does not set.
const DEFAULTS = {
  settings: { display_name: '', currency: 'TRY' },
  categories: { icon: 'ellipsis-horizontal', color: '#6b7280', sort_order: 0, monthly_budget: null },
  saving_templates: { frequency: 'daily' },
  goals: { initial_amount: 0, target_date: null, icon: 'flag', color: '#10b981' },
  recurring: { title: '', category_id: null },
  transactions: { title: '', note: null, category_id: null, template_id: null, goal_id: null, recurring_id: null },
};

export const withDefaults = (table, row) => ({ ...DEFAULTS[table], ...row });
