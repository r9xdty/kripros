// Amount parsing and formatting. Formatting is done by hand (Turkish style:
// 1.234,56) instead of Intl so the output is identical on every engine.

export const CURRENCIES = {
  TRY: { symbol: '₺', label: 'Türk Lirası' },
  USD: { symbol: '$', label: 'ABD Doları' },
  EUR: { symbol: '€', label: 'Euro' },
  GBP: { symbol: '£', label: 'İngiliz Sterlini' },
};

export const MAX_AMOUNT = 9_999_999_999.99;

// Accepts what people actually type: "45", "45,5", "1.250", "1.250,75",
// "1,250.75", "₺ 99". Returns NaN when the text is not a usable amount.
export const parseAmount = (input) => {
  if (typeof input === 'number') return Number.isFinite(input) ? Math.round(input * 100) / 100 : NaN;
  if (typeof input !== 'string') return NaN;
  let text = input.replace(/[\s₺$€£]/g, '');
  if (!/^\d[\d.,]*$/.test(text)) return NaN;

  const lastDot = text.lastIndexOf('.');
  const lastComma = text.lastIndexOf(',');
  if (lastDot !== -1 && lastComma !== -1) {
    // Both present: whichever comes last is the decimal separator.
    const decimal = lastDot > lastComma ? '.' : ',';
    const thousands = decimal === '.' ? ',' : '.';
    text = text.split(thousands).join('').replace(decimal, '.');
  } else if (lastComma !== -1) {
    const parts = text.split(',');
    if (parts.length > 2) return NaN;
    text = parts.join('.');
  } else if (lastDot !== -1) {
    const parts = text.split('.');
    // "1.500" or "12.345.678" are thousands; "12.5" is a decimal.
    const thousandsStyle = parts.length > 2 || parts[parts.length - 1].length === 3;
    if (thousandsStyle) {
      if (parts.slice(1).some((p) => p.length !== 3)) return NaN;
      text = parts.join('');
    }
  }

  if (!/^\d+(\.\d+)?$/.test(text)) return NaN;
  const value = Math.round(parseFloat(text) * 100) / 100;
  return value > MAX_AMOUNT ? NaN : value;
};

const groupThousands = (digits) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const formatNumber = (amount, { decimals = 2 } = {}) => {
  const value = Number(amount) || 0;
  const fixed = Math.abs(value).toFixed(decimals);
  const [whole, fraction] = fixed.split('.');
  const body = fraction ? `${groupThousands(whole)},${fraction}` : groupThousands(whole);
  return value < 0 && Number(fixed) !== 0 ? `-${body}` : body;
};

export const currencySymbol = (currency) => CURRENCIES[currency]?.symbol ?? currency ?? '₺';

// formatMoney(1234.5) → "1.234,50 ₺"; { sign: true } adds + for positives;
// { whole: true } hides kuruş when there are none.
export const formatMoney = (amount, currency = 'TRY', { sign = false, whole = false } = {}) => {
  const value = Number(amount) || 0;
  const decimals = whole && Number.isInteger(Math.round(value * 100) / 100) ? 0 : 2;
  const prefix = sign && value > 0 ? '+' : '';
  return `${prefix}${formatNumber(value, { decimals })} ${currencySymbol(currency)}`;
};

// Short form for tight spaces such as chart axes and calendar cells.
export const formatCompact = (amount) => {
  const value = Math.abs(Number(amount) || 0);
  const sign = amount < 0 ? '-' : '';
  if (value >= 1_000_000) return `${sign}${formatNumber(value / 1_000_000, { decimals: 1 }).replace(/,0$/, '')}Mn`;
  if (value >= 1_000) return `${sign}${formatNumber(value / 1_000, { decimals: 1 }).replace(/,0$/, '')}B`;
  return `${sign}${formatNumber(value, { decimals: 0 })}`;
};

// Value shown in an amount field when editing an existing record.
export const amountToInput = (amount) => {
  if (amount == null || amount === '') return '';
  const value = Number(amount);
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace('.', ',');
};
