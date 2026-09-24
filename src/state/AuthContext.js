// Sign-in state. Only Google sign-in is offered (Apple will be added later).
//
// The session is stored on the device, so the app opens without a network
// connection. When the access token has expired while offline, Supabase
// cannot refresh it; the last known user is then used until the device is
// back online and the token can be refreshed.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { isAuthRetryableFetchError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { DEMO_MODE } from '../config';

const LAST_USER_KEY = 'kripros:lastUser';
const DEMO_USER = { id: '00000000-0000-4000-8000-00000000de30', email: 'demo@kripros.app', name: 'Demo Kullanıcı', avatarUrl: null };

const AuthContext = createContext(null);

const userFromSession = (session) => {
  const { id, email, user_metadata: meta = {} } = session.user;
  return {
    id,
    email: email || '',
    name: meta.full_name || meta.name || (email ? email.split('@')[0] : ''),
    avatarUrl: meta.avatar_url || meta.picture || null,
  };
};

const friendlyError = (error) => {
  const message = String(error?.message || error || '');
  if (isAuthRetryableFetchError(error) || /network|fetch|internet/i.test(message)) {
    return 'İnternet bağlantısı yok. Giriş yapmak için bağlantı gerekiyor.';
  }
  if (/provider is not enabled|Unsupported provider/i.test(message)) {
    return 'Google ile giriş Supabase projesinde henüz açılmamış (Authentication → Providers → Google).';
  }
  if (/redirect/i.test(message)) {
    return 'Yönlendirme adresi Supabase\'de izinli değil (Authentication → URL Configuration).';
  }
  return message || 'Giriş yapılamadı. Lütfen tekrar deneyin.';
};

export function AuthProvider({ children }) {
  const [state, setState] = useState(() =>
    DEMO_MODE ? { status: 'signedIn', user: DEMO_USER } : { status: supabase ? 'loading' : 'unconfigured', user: null },
  );
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(null);
  const handledCodes = useRef(new Set());

  const setSignedIn = useCallback((user) => {
    setState({ status: 'signedIn', user });
    AsyncStorage.setItem(LAST_USER_KEY, JSON.stringify(user)).catch(() => {});
  }, []);

  const setSignedOut = useCallback(() => {
    setState({ status: 'signedOut', user: null });
    AsyncStorage.removeItem(LAST_USER_KEY).catch(() => {});
  }, []);

  // Finishes the OAuth round trip: the browser comes back to the app with
  // ?code=… which is exchanged for a session (PKCE).
  const completeSignIn = useCallback(async (url) => {
    const { queryParams = {} } = Linking.parse(url);
    if (queryParams.error_description || queryParams.error) {
      throw new Error(String(queryParams.error_description || queryParams.error));
    }
    const code = queryParams.code;
    if (!code || handledCodes.current.has(code)) return;
    handledCodes.current.add(code);
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(String(code));
    if (exchangeError) throw exchangeError;
  }, []);

  useEffect(() => {
    if (DEMO_MODE || !supabase) return undefined;
    let active = true;

    (async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!active) return;
      if (data.session) {
        setSignedIn(userFromSession(data.session));
        return;
      }
      if (sessionError && isAuthRetryableFetchError(sessionError)) {
        const cached = await AsyncStorage.getItem(LAST_USER_KEY).catch(() => null);
        if (cached && active) {
          setState({ status: 'signedIn', user: JSON.parse(cached) });
          return;
        }
      }
      if (active) setState((current) => (current.status === 'loading' ? { status: 'signedOut', user: null } : current));
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') setSignedOut();
      else if (session) setSignedIn(userFromSession(session));
    });

    // Android may deliver the OAuth redirect as a regular deep link.
    const linkSubscription = Linking.addEventListener('url', ({ url }) => {
      if (url.includes('auth-callback')) completeSignIn(url).catch((e) => setError(friendlyError(e)));
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
      linkSubscription.remove();
    };
  }, [completeSignIn, setSignedIn, setSignedOut]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return;
    setError(null);
    setSigningIn(true);
    try {
      const queryParams = { prompt: 'select_account' };
      if (Platform.OS === 'web') {
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin, queryParams },
        });
        if (oauthError) throw oauthError;
        return; // the page navigates to Google
      }
      const redirectTo = Linking.createURL('auth-callback');
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true, queryParams },
      });
      if (oauthError) throw oauthError;
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type === 'success') await completeSignIn(result.url);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSigningIn(false);
    }
  }, [completeSignIn]);

  // Works offline: only the session on this device is removed.
  const signOut = useCallback(async () => {
    if (DEMO_MODE) return;
    await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
    setSignedOut();
  }, [setSignedOut]);

  // Needs a connection. Deletes the account and all of its data on the
  // server; the caller then clears the device and signs out.
  const deleteAccount = useCallback(async () => {
    if (DEMO_MODE) return;
    const { error: rpcError } = await supabase.rpc('delete_account');
    if (rpcError) throw new Error(friendlyError(rpcError));
  }, []);

  const value = useMemo(
    () => ({ ...state, signingIn, error, clearError: () => setError(null), signInWithGoogle, signOut, deleteAccount }),
    [state, signingIn, error, signInWithGoogle, signOut, deleteAccount],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
