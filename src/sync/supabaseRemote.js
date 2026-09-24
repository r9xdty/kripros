// Talks to Supabase (PostgREST) on behalf of the sync engine and turns its
// errors into SyncError kinds the engine understands.
import { SyncError } from './engine';

const isSqlState = (code) => typeof code === 'string' && /^[0-9A-Z]{5}$/.test(code) && !code.startsWith('PGRST');

export const classifyError = (error, status) => {
  const message = error?.message || 'Bilinmeyen hata';
  if (!status) return new SyncError('network', message, error);
  if (status === 401) return new SyncError('auth', message, error);
  if (status >= 500 || status === 408 || status === 429) return new SyncError('server', message, error);
  // Postgres rejected the row itself (check / foreign key / RLS violation).
  if (isSqlState(error?.code)) return new SyncError('rejected', message, error);
  // Anything else (e.g. PGRST205: table missing because the migration was
  // not run) is a setup problem, not a problem with one row.
  return new SyncError('server', message, error);
};

export const createSupabaseRemote = (supabase) => ({
  async upsert(table, rows) {
    const { data, error, status } = await supabase
      .from(table)
      .upsert(rows, { onConflict: 'id' })
      .select();
    if (error) throw classifyError(error, status);
    return data || [];
  },

  async pull(table, { since, excludeDeleted, offset, limit }) {
    let query = supabase
      .from(table)
      .select('*')
      .order('server_updated_at', { ascending: true })
      .order('id', { ascending: true })
      .range(offset, offset + limit - 1);
    if (since) query = query.gte('server_updated_at', since);
    if (excludeDeleted) query = query.is('deleted_at', null);
    const { data, error, status } = await query;
    if (error) throw classifyError(error, status);
    return data || [];
  },
});
