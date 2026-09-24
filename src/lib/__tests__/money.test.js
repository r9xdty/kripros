import { amountToInput, formatCompact, formatMoney, parseAmount } from '../money';

describe('parseAmount', () => {
  test.each([
    ['45', 45],
    ['45,5', 45.5],
    ['45,50', 45.5],
    ['45.5', 45.5],
    ['12.75', 12.75],
    ['1.500', 1500],
    ['12.345.678', 12345678],
    ['1.250,75', 1250.75],
    ['1,250.75', 1250.75],
    ['₺ 99', 99],
    ['0,999', 1],
    [' 7 ', 7],
    [45.678, 45.68],
  ])('%p → %p', (input, expected) => {
    expect(parseAmount(input)).toBe(expected);
  });

  test.each(['', 'abc', '-5', '1,2,3', '1.23.4', '1e5', '99999999999', null, undefined])('%p is rejected', (input) => {
    expect(parseAmount(input)).toBeNaN();
  });
});

describe('formatting', () => {
  test('formatMoney uses Turkish separators', () => {
    expect(formatMoney(1234.5)).toBe('1.234,50 ₺');
    expect(formatMoney(1234567.891, 'EUR')).toBe('1.234.567,89 €');
    expect(formatMoney(-12)).toBe('-12,00 ₺');
    expect(formatMoney(45, 'TRY', { sign: true })).toBe('+45,00 ₺');
    expect(formatMoney(45, 'TRY', { whole: true })).toBe('45 ₺');
    expect(formatMoney(45.5, 'TRY', { whole: true })).toBe('45,50 ₺');
    expect(formatMoney(0.1 + 0.2)).toBe('0,30 ₺');
  });

  test('formatCompact keeps chart labels short', () => {
    expect(formatCompact(950)).toBe('950');
    expect(formatCompact(1000)).toBe('1B');
    expect(formatCompact(1250)).toBe('1,3B');
    expect(formatCompact(2_500_000)).toBe('2,5Mn');
  });

  test('amountToInput round-trips through parseAmount', () => {
    for (const value of [45, 45.5, 1250.75, 0.01]) {
      expect(parseAmount(amountToInput(value))).toBe(value);
    }
    expect(amountToInput(null)).toBe('');
  });
});
