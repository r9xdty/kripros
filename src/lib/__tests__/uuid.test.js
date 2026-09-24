import * as Crypto from 'expo-crypto';
import { newId } from '../uuid';

jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn(),
  getRandomBytes: jest.fn((n) => Uint8Array.from({ length: n }, (_, i) => (i * 37 + 11) % 256)),
}));

const V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

test('uses randomUUID when available', () => {
  Crypto.randomUUID.mockReturnValueOnce('0b6f7c1e-2f4a-4b8e-9c3d-5e6f7a8b9c0d');
  expect(newId()).toBe('0b6f7c1e-2f4a-4b8e-9c3d-5e6f7a8b9c0d');
});

test('falls back to a v4 UUID built from random bytes', () => {
  Crypto.randomUUID.mockImplementationOnce(() => {
    throw new TypeError('crypto.randomUUID is not a function');
  });
  expect(newId()).toMatch(V4);
});
