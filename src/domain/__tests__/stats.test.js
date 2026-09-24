import {
  buildSeries,
  categoryBreakdown,
  dailyTotals,
  goalProgress,
  monthTotals,
  savingBreakdown,
  savingStreak,
  savingsRate,
  totalsInRange,
} from '../stats';

const now = new Date(2026, 8, 24, 12, 0); // Thursday 24 September 2026

const t = (kind, amount, occurred_on, extra = {}) => ({ id: `${kind}-${occurred_on}-${amount}`, kind, amount, occurred_on, ...extra });

const transactions = [
  t('income', 30000, '2026-09-01', { category_id: 'salary' }),
  t('spending', 0.1, '2026-09-02', { category_id: 'market' }),
  t('spending', 0.2, '2026-09-02', { category_id: 'market' }),
  t('spending', 1200, '2026-09-20', { category_id: 'rent' }),
  t('spending', 50, '2026-09-24'),
  t('saving', 45, '2026-09-23', { template_id: 'coffee' }),
  t('saving', 45, '2026-09-24', { template_id: 'coffee' }),
  t('saving', 5000, '2026-09-10', { goal_id: 'trip', title: 'Tatil' }),
  t('spending', 999, '2026-08-31'),
  t('income', 1000, '2025-09-24'),
];

describe('totals', () => {
  test('month totals ignore other months and avoid float errors', () => {
    const totals = monthTotals(transactions, 2026, 8);
    expect(totals).toEqual({ income: 30000, spending: 1250.3, saving: 5090, balance: 28749.7, count: 8 });
    expect(savingsRate(totals)).toBeCloseTo(5090 / 30000);
    expect(savingsRate({ income: 0, saving: 10 })).toBeNull();
  });

  test('range totals are inclusive', () => {
    expect(totalsInRange(transactions, '2026-09-24', '2026-09-24')).toMatchObject({ spending: 50, saving: 45, count: 2 });
  });

  test('daily totals per date', () => {
    const daily = dailyTotals(transactions);
    expect(daily['2026-09-02']).toMatchObject({ spending: 0.3, count: 2 });
    expect(daily['2026-09-24']).toMatchObject({ spending: 50, saving: 45, balance: -50 });
  });
});

describe('buildSeries', () => {
  test('week: last seven days ending today', () => {
    const series = buildSeries(transactions, 'week', now);
    expect(series).toHaveLength(7);
    expect(series[6]).toMatchObject({ label: 'Bugün', from: '2026-09-24', spending: 50, saving: 45 });
    expect(series[0]).toMatchObject({ label: 'Cum', from: '2026-09-18' });
    expect(series[5]).toMatchObject({ saving: 45 });
  });

  test('month: five Monday-based weeks', () => {
    const series = buildSeries(transactions, 'month', now);
    expect(series).toHaveLength(5);
    expect(series[4]).toMatchObject({ from: '2026-09-21', to: '2026-09-27', spending: 50, saving: 90 });
    expect(series[3]).toMatchObject({ from: '2026-09-14', spending: 1200 });
    const summed = series.reduce((s, b) => s + b.income, 0);
    expect(summed).toBe(30000);
  });

  test('year: twelve months ending with the current one', () => {
    const series = buildSeries(transactions, 'year', now);
    expect(series).toHaveLength(12);
    expect(series[11]).toMatchObject({ label: 'Eyl', from: '2026-09-01', to: '2026-09-30', income: 30000 });
    expect(series[10]).toMatchObject({ label: 'Ağu', spending: 999 });
    expect(series[0]).toMatchObject({ label: 'Eki', from: '2025-10-01' });
  });
});

describe('breakdowns', () => {
  const categories = {
    market: { id: 'market', name: 'Market', color: '#ef4444', icon: 'cart' },
    rent: { id: 'rent', name: 'Kira', color: '#8b5cf6', icon: 'home' },
  };

  test('spending grouped by category, largest first, with uncategorised', () => {
    const slices = categoryBreakdown(transactions, categories, { kind: 'spending', from: '2026-09-01', to: '2026-09-30' });
    expect(slices.map((s) => [s.name, s.amount, s.count])).toEqual([
      ['Kira', 1200, 1],
      ['Kategorisiz', 50, 1],
      ['Market', 0.3, 2],
    ]);
    expect(slices.reduce((s, x) => s + x.share, 0)).toBeCloseTo(1);
  });

  test('savings grouped by template, goal or title', () => {
    const slices = savingBreakdown(transactions, {
      from: '2026-09-01',
      to: '2026-09-30',
      templatesById: { coffee: { id: 'coffee', name: 'Kahve almadım' } },
      goalsById: { trip: { id: 'trip', name: 'Tatil', color: '#0ea5e9', icon: 'airplane' } },
    });
    expect(slices.map((s) => [s.name, s.amount])).toEqual([
      ['Tatil', 5000],
      ['Kahve almadım', 90],
    ]);
    expect(slices[0].color).toBe('#0ea5e9');
  });
});

describe('goals', () => {
  test('progress includes the starting amount and contributions', () => {
    const goal = { id: 'trip', target_amount: 20000, initial_amount: 1000, target_date: '2026-12-24' };
    const p = goalProgress(goal, transactions, now);
    expect(p).toMatchObject({ saved: 6000, remaining: 14000, reached: false, contributions: 1, daysLeft: 91 });
    expect(p.ratio).toBeCloseTo(0.3);
    expect(p.monthlyNeeded).toBeCloseTo(14000 / 4, 2);
  });

  test('reached goals are capped at 100% and need nothing more', () => {
    const p = goalProgress({ id: 'trip', target_amount: 3000, initial_amount: 0 }, transactions, now);
    expect(p).toMatchObject({ ratio: 1, reached: true, remaining: 0, monthlyNeeded: null });
  });
});

describe('savingStreak', () => {
  test('counts consecutive saving days up to today', () => {
    expect(savingStreak(transactions, now)).toBe(2);
    expect(savingStreak(transactions, new Date(2026, 8, 25))).toBe(2); // today not logged yet
    expect(savingStreak(transactions, new Date(2026, 8, 27))).toBe(0);
  });
});
