import {
  addDaysToKey,
  daysBetween,
  formatDayLong,
  formatRelativeDay,
  fromDateKey,
  monthGrid,
  parseDisplayDate,
  toDateKey,
  toDisplayDate,
} from '../dates';

describe('dates', () => {
  test('date keys round-trip without timezone shifts', () => {
    for (const key of ['2026-01-01', '2026-03-29', '2026-10-25', '2024-02-29', '2026-12-31']) {
      expect(toDateKey(fromDateKey(key))).toBe(key);
    }
  });

  test('adding days crosses month and year boundaries', () => {
    expect(addDaysToKey('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDaysToKey('2026-03-01', -1)).toBe('2026-02-28');
    expect(daysBetween('2026-09-01', '2026-10-01')).toBe(30);
  });

  test('month grid starts on Monday', () => {
    // 1 September 2026 is a Tuesday
    const grid = monthGrid(2026, 8);
    expect(grid[0]).toBeNull();
    expect(toDateKey(grid[1])).toBe('2026-09-01');
    expect(grid.length % 7).toBe(0);
    expect(grid.filter(Boolean)).toHaveLength(30);
  });

  test('human readable labels are Turkish', () => {
    expect(formatDayLong('2026-09-24')).toBe('24 Eylül 2026, Perşembe');
    const now = new Date(2026, 8, 24, 15, 0);
    expect(formatRelativeDay('2026-09-24', now)).toBe('Bugün');
    expect(formatRelativeDay('2026-09-23', now)).toBe('Dün');
    expect(formatRelativeDay('2026-09-25', now)).toBe('Yarın');
    expect(formatRelativeDay('2026-09-01', now)).toBe('1 Eylül');
    expect(formatRelativeDay('2025-09-01', now)).toBe('1 Eylül 2025');
  });

  test('typed dates are validated', () => {
    expect(parseDisplayDate('24.12.2026')).toBe('2026-12-24');
    expect(parseDisplayDate('1/2/2027')).toBe('2027-02-01');
    expect(parseDisplayDate('31.02.2026')).toBeNull();
    expect(parseDisplayDate('2026-12-24')).toBeNull();
    expect(toDisplayDate('2026-12-24')).toBe('24.12.2026');
    expect(toDisplayDate(null)).toBe('');
  });
});
