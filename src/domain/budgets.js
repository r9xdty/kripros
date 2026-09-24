// Monthly spending limits per category.
import { monthRange } from './stats';

const toCents = (amount) => Math.round(Number(amount) * 100);

export const WARN_RATIO = 0.8;

export const budgetState = (ratio) => (ratio >= 1 ? 'over' : ratio >= WARN_RATIO ? 'warn' : 'ok');

// One entry per spending category that has a budget, fullest first.
export const budgetStatus = (categories, transactions, year, month) => {
  const budgeted = categories.filter((c) => c.kind === 'spending' && c.monthly_budget > 0);
  if (budgeted.length === 0) return [];
  const [from, to] = monthRange(year, month);
  const spentCents = {};
  for (const tx of transactions) {
    if (tx.kind !== 'spending' || !tx.category_id || tx.occurred_on < from || tx.occurred_on > to) continue;
    spentCents[tx.category_id] = (spentCents[tx.category_id] || 0) + toCents(tx.amount);
  }
  return budgeted
    .map((category) => {
      const spent = (spentCents[category.id] || 0) / 100;
      const budget = Number(category.monthly_budget);
      const ratio = spent / budget;
      return {
        category,
        spent,
        budget,
        remaining: Math.max(0, Math.round((budget - spent) * 100) / 100),
        ratio,
        state: budgetState(ratio),
      };
    })
    .sort((a, b) => b.ratio - a.ratio);
};

// Message to show when a spending pushes a budget past 80% or 100%, or adds
// to a budget that is already exceeded; null otherwise.
export const budgetAlert = (before, after) => {
  if (!after) return null;
  const name = after.category.name;
  const was = before?.ratio ?? 0;
  if (after.ratio >= 1) {
    if (was < 1) return `${name} bütçesini aştın`;
    return after.ratio > was ? `${name} bütçesinin üzerindesin` : null;
  }
  if (after.ratio >= WARN_RATIO && was < WARN_RATIO) return `${name} bütçesinin %${Math.round(after.ratio * 100)}’i kullanıldı`;
  return null;
};
