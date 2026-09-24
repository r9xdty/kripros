import { budgetAlert, budgetStatus } from '../budgets';
import { spendingComparison } from '../stats';

const categories = [
  { id: 'market', kind: 'spending', name: 'Market', monthly_budget: 5000 },
  { id: 'food', kind: 'spending', name: 'Yeme-İçme', monthly_budget: 2000 },
  { id: 'fun', kind: 'spending', name: 'Eğlence', monthly_budget: null },
  { id: 'salary', kind: 'income', name: 'Maaş', monthly_budget: 1000 },
];

const spend = (category_id, amount, occurred_on) => ({ kind: 'spending', category_id, amount, occurred_on });

describe('budgetStatus', () => {
  const transactions = [
    spend('market', 1000.1, '2026-09-02'),
    spend('market', 3000.2, '2026-09-20'),
    spend('food', 2100, '2026-09-10'),
    spend('food', 500, '2026-08-31'),
    spend('fun', 999, '2026-09-10'),
  ];

  test('only spending categories with a budget, fullest first', () => {
    const status = budgetStatus(categories, transactions, 2026, 8);
    expect(status.map((s) => [s.category.id, s.spent, s.state])).toEqual([
      ['food', 2100, 'over'],
      ['market', 4000.3, 'warn'],
    ]);
    expect(status[1].remaining).toBe(999.7);
    expect(status[0].remaining).toBe(0);
  });

  test('no budgets, no entries', () => {
    expect(budgetStatus(categories.map((c) => ({ ...c, monthly_budget: null })), transactions, 2026, 8)).toEqual([]);
  });
});

describe('budgetAlert', () => {
  const entry = (ratio) => ({ category: { name: 'Market' }, ratio });

  test('warns when crossing 80% and 100%', () => {
    expect(budgetAlert(entry(0.5), entry(0.85))).toBe('Market bütçesinin %85’i kullanıldı');
    expect(budgetAlert(entry(0.85), entry(0.9))).toBeNull();
    expect(budgetAlert(entry(0.9), entry(1.05))).toBe('Market bütçesini aştın');
    expect(budgetAlert(null, entry(0.3))).toBeNull();
    expect(budgetAlert(entry(0.3), undefined)).toBeNull();
  });

  test('reminds on every new spending once the budget is exceeded', () => {
    expect(budgetAlert(entry(1.1), entry(1.2))).toBe('Market bütçesinin üzerindesin');
    // Edits that do not add spending stay quiet.
    expect(budgetAlert(entry(1.2), entry(1.2))).toBeNull();
    expect(budgetAlert(entry(1.2), entry(1.1))).toBeNull();
  });
});

describe('spendingComparison', () => {
  test('compares this month so far with the same days of last month', () => {
    const transactions = [
      spend(null, 300, '2026-09-03'),
      spend(null, 200, '2026-09-24'),
      spend(null, 400, '2026-08-10'),
      spend(null, 9999, '2026-08-25'), // after the 24th: not compared
    ];
    const result = spendingComparison(transactions, new Date(2026, 8, 24));
    expect(result).toEqual({ current: 500, previous: 400, change: 0.25 });
  });

  test('handles a shorter previous month and no history', () => {
    const transactions = [spend(null, 100, '2026-02-28'), spend(null, 50, '2026-03-31')];
    expect(spendingComparison(transactions, new Date(2026, 2, 31))).toEqual({ current: 50, previous: 100, change: -0.5 });
    expect(spendingComparison([], new Date(2026, 2, 31)).change).toBeNull();
  });
});
