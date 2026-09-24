// Dates are stored as local calendar days ("YYYY-MM-DD"). Never pass such a
// key to `new Date(key)`: that parses it as UTC midnight and can shift the
// day. Use fromDateKey instead.

export const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];
export const MONTH_SHORT = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
// Monday-first, as used in Turkey.
export const WEEKDAY_SHORT = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
export const WEEKDAY_LONG = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

const pad = (n) => String(n).padStart(2, '0');

export const toDateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const fromDateKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const todayKey = (now = new Date()) => toDateKey(now);

export const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

export const addDaysToKey = (key, days) => toDateKey(addDays(fromDateKey(key), days));

export const addMonths = (date, months) => new Date(date.getFullYear(), date.getMonth() + months, 1);

// 0 = Monday … 6 = Sunday
export const weekdayIndex = (date) => (date.getDay() + 6) % 7;

export const startOfWeek = (date) => addDays(date, -weekdayIndex(date));

export const monthKey = (year, month) => `${year}-${pad(month + 1)}`;

export const isKeyInMonth = (key, year, month) => key.startsWith(monthKey(year, month));

export const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

// Calendar grid for a month: leading nulls so the 1st lands on its weekday.
export const monthGrid = (year, month) => {
  const first = new Date(year, month, 1);
  const cells = Array(weekdayIndex(first)).fill(null);
  for (let day = 1; day <= daysInMonth(year, month); day++) cells.push(new Date(year, month, day));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};

export const daysBetween = (fromKey, toKey) =>
  Math.round((fromDateKey(toKey) - fromDateKey(fromKey)) / 86_400_000);

export const formatDayLong = (key) => {
  const d = fromDateKey(key);
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}, ${WEEKDAY_LONG[weekdayIndex(d)]}`;
};

export const formatDayShort = (key) => {
  const d = fromDateKey(key);
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;
};

export const formatMonth = (year, month) => `${MONTH_NAMES[month]} ${year}`;

// "Bugün", "Dün", "Yarın" or "12 Eylül 2026"
export const formatRelativeDay = (key, now = new Date()) => {
  const today = toDateKey(now);
  if (key === today) return 'Bugün';
  if (key === addDaysToKey(today, -1)) return 'Dün';
  if (key === addDaysToKey(today, 1)) return 'Yarın';
  const d = fromDateKey(key);
  const sameYear = d.getFullYear() === now.getFullYear();
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}${sameYear ? '' : ` ${d.getFullYear()}`}`;
};

// "2026-12-24" ↔ "24.12.2026" for typed date inputs.
export const toDisplayDate = (key) => (key ? key.split('-').reverse().join('.') : '');

// Returns a date key, or null when the text is not a real calendar date.
export const parseDisplayDate = (text) => {
  const match = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.exec(String(text).trim());
  if (!match) return null;
  const [, d, m, y] = match.map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return toDateKey(date);
};
