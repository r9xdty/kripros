import React from 'react';
import { act, create } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthRetryableFetchError } from '@supabase/supabase-js';
import { AuthProvider, useAuth } from '../AuthContext';
import { supabase } from '../../lib/supabase';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-linking', () => ({ addEventListener: () => ({ remove: () => {} }), parse: () => ({}), createURL: () => '' }));
jest.mock('expo-web-browser', () => ({}));
jest.mock('../../config', () => ({ DEMO_MODE: false }));
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      storageKey: 'sb-test-auth-token',
      getSession: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: () => {} } } })),
    },
  },
}));

const USER = { id: 'u1', email: 'a@b.c', name: 'Ayşe', avatarUrl: null };
const offline = () => new AuthRetryableFetchError('Failed to fetch', 0);

let auth;
function Probe() {
  auth = useAuth();
  return null;
}

const render = async () => {
  await act(async () => {
    create(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
  });
};

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

test('offline start shows the last user without waiting for the token refresh', async () => {
  await AsyncStorage.setItem('kripros:lastUser', JSON.stringify(USER));
  let finishRefresh;
  supabase.auth.getSession.mockReturnValue(new Promise((resolve) => (finishRefresh = resolve)));

  await render();
  expect(auth.status).toBe('signedIn');
  expect(auth.user.id).toBe('u1');

  // The refresh finally fails because we are still offline: stay signed in.
  await act(async () => finishRefresh({ data: { session: null }, error: offline() }));
  expect(auth.status).toBe('signedIn');
});

test('without a stored session the login screen is shown', async () => {
  await AsyncStorage.setItem('kripros:lastUser', JSON.stringify(USER));
  supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
  await render();
  expect(auth.status).toBe('signedOut');
  expect(await AsyncStorage.getItem('kripros:lastUser')).toBeNull();
});

test('signing out offline still removes the stored session', async () => {
  await AsyncStorage.setItem('kripros:lastUser', JSON.stringify(USER));
  await AsyncStorage.multiSet([
    ['sb-test-auth-token', '{"access_token":"x"}'],
    ['sb-test-auth-token-user', '{}'],
  ]);
  supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: offline() });
  // What auth-js does offline with an expired token: returns an error and
  // leaves the session in storage.
  supabase.auth.signOut.mockResolvedValue({ error: offline() });

  await render();
  await act(async () => {
    await auth.signOut();
  });

  expect(auth.status).toBe('signedOut');
  expect(await AsyncStorage.getItem('sb-test-auth-token')).toBeNull();
  expect(await AsyncStorage.getItem('sb-test-auth-token-user')).toBeNull();
  expect(await AsyncStorage.getItem('kripros:lastUser')).toBeNull();
});

test('a token refresh that lands after signing out does not sign the user back in', async () => {
  supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
  supabase.auth.signOut.mockResolvedValue({ error: null });
  await render();
  const listener = supabase.auth.onAuthStateChange.mock.calls[0][0];

  await act(async () => {
    await auth.signOut();
  });
  await AsyncStorage.setItem('sb-test-auth-token', '{"access_token":"late"}');
  await act(async () => {
    listener('TOKEN_REFRESHED', { user: { id: 'u1', email: 'a@b.c', user_metadata: {} } });
  });

  expect(auth.status).toBe('signedOut');
  await act(async () => {});
  expect(await AsyncStorage.getItem('sb-test-auth-token')).toBeNull();
});
