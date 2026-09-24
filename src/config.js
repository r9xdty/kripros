// Values come from .env (see .env.example). Expo inlines EXPO_PUBLIC_*
// variables at build time, so they must be read with direct property access.
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Development only: skips Google sign-in and runs fully offline with demo
// data, so screens can be tried without a Supabase project. Ignored in
// production builds.
export const DEMO_MODE = __DEV__ && process.env.EXPO_PUBLIC_DEMO_MODE === '1';
