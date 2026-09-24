// Aggregations behind the dashboard, calendar and goals. Sums are kept in
// kuruş (integer cents) so floating point never produces 0.30000000000000004.
import { PALETTE } from './constants';
import {
  MONTH_SHORT,
  WEEKDAY_SHORT,
  addDays,
  addMonths,
  daysBetween,
  daysInMonth,
  formatDayShort,
  monthKey,
  startOfWeek,
  toDateKey,
  weekdayIndex,
} from '../lib/dates';

const toCents = (amount) => Math.round(Number(amount) * 100);
const fromCents = (cents) => cents / 100;

const emptyCents = () => ({ income: 0, spending: 0, saving: 0, count: 0 });

const finish = (c) => ({
  income: fromCents(c.income),
  spending: fromCents(c.spending),
  saving: fromCents(c.saving),
  balance: fromCents(c.income - c.spending),
  count: c.count,
});

export const totalsInRange = (transactions, fromKey, toKey) => {
  const c = emptyCents();
  for (const tx of transactions) {
    if (fromKey && tx.occurred_on < fromKey) continue;
    if (toKey && tx.occurred_on > toKey) continue;
    c[tx.kind] += toCents(tx.amount);
    c.count++;
  }
  return finish(c);
};

export const monthRange = (year, month) => {
  const prefix = monthKey(year, month);
  return [`${prefix}-01`, `${prefix}-${String(daysInMonth(year, month)).padStart(2, '0')}`];
};

export const monthTotals = (transactions, year, month) => totalsInRange(transactions, ...monthRange(year, month));

// Share of income that was put aside, or null when there was no income.
export const savingsRate = (totals) => (totals.income > 0 ? totals.saving / totals.income : null);

// { 'YYYY-MM-DD': { income, spending, saving, balance, count } }
export const dailyTotals = (transactions) => {
  const byDay = {};
  for (const tx of transactions) {
    const c = (byDay[tx.occurred_on] = byDay[tx.occurred_on] || emptyCents());
    c[tx.kind] += toCents(tx.amount);
    c.count++;
  }
  const out = {};
  for (const [key, c] of Object.entries(byDay)) out[key] = finish(c);
  return out;
};

export const CHART_RANGES = {
  week: 'Son 7 gün',
  month: 'Son 5 hafta',
  year: 'Son 12 ay',
};

// Buckets for the grouped bar chart, oldest first.
export const buildSeries = (transactions, range, now = new Date()) => {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let buckets;

  if (range === 'year') {
    buckets = [];
    for (let i = 11; i >= 0; i--) {
      const start = addMonths(today, -i);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      buckets.push({ label: MONTH_SHORT[start.getMonth()], from: toDateKey(start), to: toDateKey(end) });
    }
  } else if (range === 'month') {
    buckets = [];
    const thisWeek = startOfWeek(today);
    for (let i = 4; i >= 0; i--) {
      const start = addDays(thisWeek, -7 * i);
      const from = toDateKey(start);
      buckets.push({ label: formatDayShort(from), from, to: toDateKey(addDays(start, 6)) });
    }
  } else {
    buckets = [];
    for (let i = 6; i >= 0; i--) {
      const day = addDays(today, -i);
      const key = toDateKey(day);
      buckets.push({ label: i === 0 ? 'Bugün' : WEEKDAY_SHORT[weekdayIndex(day)], from: key, to: key });
    }
  }

  const sums = buckets.map(() => emptyCents());
  const first = buckets[0].from;
  const last = buckets[buckets.length - 1].to;
  for (const tx of transactions) {
    if (tx.occurred_on < first || tx.occurred_on > last) continue;
    // Few buckets, so a linear scan is plenty fast.
    const index = buckets.findIndex((b) => tx.occurred_on >= b.from && tx.occurred_on <= b.to);
    if (index !== -1) sums[index][tx.kind] += toCents(tx.amount);
  }
  return buckets.map((b, i) => ({ ...b, ...finish(sums[i]) }));
};

const colorFor = (seed) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length];
};

const toSlices = (groups, totalCents) =>
  [...groups.values()]
    .map((g) => ({ ...g, amount: fromCents(g.cents), share: totalCents ? g.cents / totalCents : 0 }))
    .sort((a, b) => b.amount - a.amount)
    .map(({ cents, ...slice }) => slice);

// Donut slices for income or spending, grouped by category.
export const categoryBreakdown = (transactions, categoriesById, { kind, from, to }) => {
  const groups = new Map();
  let total = 0;
  for (const tx of transactions) {
    if (tx.kind !== kind || (from && tx.occurred_on < from) || (to && tx.occurred_on > to)) continue;
    const category = tx.category_id ? categoriesById[tx.category_id] : null;
    const key = category ? category.id : 'none';
    const group = groups.get(key) || {
      key,
      name: category ? category.name : 'Kategorisiz',
      color: category ? category.color : '#94a3b8',
      icon: category ? category.icon : 'help-circle',
      cents: 0,
      count: 0,
    };
    group.cents += toCents(tx.amount);
    group.count++;
    groups.set(key, group);
    total += toCents(tx.amount);
  }
  return toSlices(groups, total);
};

// Donut slices for savings, grouped by saving template, goal or title.
export const savingBreakdown = (transactions, { from, to, templatesById = {}, goalsById = {} }) => {
  const groups = new Map();
  let total = 0;
  for (const tx of transactions) {
    if (tx.kind !== 'saving' || (from && tx.occurred_on < from) || (to && tx.occurred_on > to)) continue;
    const template = tx.template_id ? templatesById[tx.template_id] : null;
    const goal = tx.goal_id ? goalsById[tx.goal_id] : null;
    const name = template?.name || tx.title || goal?.name || 'Birikim';
    const group = groups.get(name) || {
      key: name,
      name,
      color: goal?.color || colorFor(name),
      icon: goal ? goal.icon : 'leaf',
      cents: 0,
      count: 0,
    };
    group.cents += toCents(tx.amount);
    group.count++;
    groups.set(name, group);
    total += toCents(tx.amount);
  }
  return toSlices(groups, total);
};

export const goalProgress = (goal, transactions, now = new Date()) => {
  let cents = toCents(goal.initial_amount || 0);
  let contributions = 0;
  for (const tx of transactions) {
    if (tx.kind === 'saving' && tx.goal_id === goal.id) {
      cents += toCents(tx.amount);
      contributions++;
    }
  }
  const saved = fromCents(cents);
  const target = Number(goal.target_amount);
  const remaining = Math.max(0, fromCents(toCents(target) - cents));
  const result = {
    saved,
    target,
    remaining,
    ratio: target > 0 ? Math.min(1, saved / target) : 0,
    reached: saved >= target,
    contributions,
    daysLeft: null,
    monthlyNeeded: null,
  };
  if (goal.target_date) {
    const daysLeft = daysBetween(toDateKey(now), goal.target_date);
    result.daysLeft = daysLeft;
    if (!result.reached && daysLeft >= 0) {
      const monthsLeft = Math.max(1, Math.ceil(daysLeft / 30));
      result.monthlyNeeded = Math.ceil((remaining / monthsLeft) * 100) / 100;
    }
  }
  return result;
};

// Consecutive days, ending today (or yesterday), with at least one saving.
export const savingStreak = (transactions, now = new Date()) => {
  const days = new Set();
  for (const tx of transactions) if (tx.kind === 'saving') days.add(tx.occurred_on);
  let day = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!days.has(toDateKey(day))) day = addDays(day, -1);
  let streak = 0;
  while (days.has(toDateKey(day))) {
    streak++;
    day = addDays(day, -1);
  }
  return streak;
};
