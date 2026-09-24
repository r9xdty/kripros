// Hermes has no Web Crypto. Supabase's PKCE sign-in needs secure random
// values and SHA-256; without them it silently falls back to Math.random and
// an unhashed code challenge. Provide both from expo-crypto.
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';

if (Platform.OS !== 'web') {
  const target = globalThis.crypto || {};
  if (typeof target.getRandomValues !== 'function') {
    target.getRandomValues = (array) => Crypto.getRandomValues(array);
  }
  if (!target.subtle) {
    target.subtle = {
      digest: (algorithm, data) => {
        const name = typeof algorithm === 'string' ? algorithm : algorithm?.name;
        if (name !== 'SHA-256') return Promise.reject(new Error(`Unsupported digest ${name}`));
        return Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, data);
      },
    };
  }
  if (!globalThis.crypto) globalThis.crypto = target;
}
