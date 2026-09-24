import * as Crypto from 'expo-crypto';

const hex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

// Record ids are generated on the device so they can be created offline.
// crypto.randomUUID only exists in secure browser contexts, so build a v4
// UUID from random bytes when it is missing.
export const newId = () => {
  try {
    return Crypto.randomUUID();
  } catch {
    const b = Crypto.getRandomBytes(16);
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const h = hex(b);
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  }
};
