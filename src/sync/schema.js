// Tables the app keeps in sync with Supabase. Column lists must match
// supabase/migrations/0001_init.sql; only these columns are sent on push.
// `server_updated_at` is always set by the server and is never pushed.

export const TABLES = {
  profiles: {
    push: true,
    buckets: 1,
    columns: ['id', 'display_name', 'avatar_url', 'currency', 'created_at', 'updated_at'],
  },
  categories: {
    push: true,
    buckets: 1,
    columns: [
      'id', 'user_id', 'kind', 'name', 'icon', 'color', 'sort_order', 'is_default',
      'created_at', 'updated_at', 'deleted_at',
    ],
  },
  saving_templates: {
    push: true,
    buckets: 1,
    columns: ['id', 'user_id', 'name', 'amount', 'frequency', 'created_at', 'updated_at', 'deleted_at'],
    numeric: ['amount'],
  },
  goals: {
    push: true,
    buckets: 1,
    columns: [
      'id', 'user_id', 'name', 'target_amount', 'initial_amount', 'target_date', 'icon', 'color',
      'created_at', 'updated_at', 'deleted_at',
    ],
    numeric: ['target_amount', 'initial_amount'],
  },
  transactions: {
    push: true,
    // Split across several storage keys so no single value grows past the
    // ~2 MB per-item limit of AsyncStorage on Android.
    buckets: 16,
    columns: [
      'id', 'user_id', 'kind', 'amount', 'title', 'note', 'occurred_on',
      'category_id', 'template_id', 'goal_id', 'created_at', 'updated_at', 'deleted_at',
    ],
    numeric: ['amount'],
  },
  subscriptions: {
    // Written only by a trusted backend after a store purchase is verified.
    push: false,
    buckets: 1,
    columns: ['id', 'plan', 'provider', 'product_id', 'expires_at', 'created_at', 'updated_at'],
  },
};

// Values used for columns a new local row does not set. Rows are always
// pushed with every column present: PostgREST fills missing keys in a bulk
// upsert with NULL/defaults, which could silently overwrite server data.
const DEFAULTS = {
  profiles: { display_name: null, avatar_url: null, currency: 'TRY' },
  categories: { icon: 'ellipsis-horizontal', color: '#6b7280', sort_order: 0, is_default: false, deleted_at: null },
  saving_templates: { frequency: 'daily', deleted_at: null },
  goals: { initial_amount: 0, target_date: null, icon: 'flag', color: '#10b981', deleted_at: null },
  transactions: { title: '', note: null, category_id: null, template_id: null, goal_id: null, deleted_at: null },
  subscriptions: {},
};

export const TABLE_NAMES = Object.keys(TABLES);

// Parents first so foreign keys exist before the rows that reference them.
export const PUSH_ORDER = ['profiles', 'categories', 'saving_templates', 'goals', 'transactions'];

export const hasSoftDelete = (table) => TABLES[table].columns.includes('deleted_at');

// The exact payload sent to the server for a local row.
export const toPushPayload = (table, row) => {
  const defaults = DEFAULTS[table];
  const out = {};
  for (const column of TABLES[table].columns) {
    if (row[column] !== undefined) out[column] = row[column];
    else if (column in defaults) out[column] = defaults[column];
  }
  return out;
};

export const withDefaults = (table, row) => ({ ...DEFAULTS[table], ...row });

// PostgREST returns numeric columns as JSON numbers, but be defensive in case
// a proxy or future version sends strings.
export const normalizeRow = (table, row) => {
  const numeric = TABLES[table].numeric;
  if (!numeric) return row;
  const out = { ...row };
  for (const column of numeric) {
    if (out[column] != null) out[column] = Number(out[column]);
  }
  return out;
};
