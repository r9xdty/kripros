// Recurring income and spending ("Kira, her ayın 5'i"). A rule keeps the
// date of its next occurrence; whenever that date has arrived, a record is
// created and the rule moves on to the same day of the following month.
import { addDaysToKey, daysInMonth, fromDateKey, toDateKey } from '../lib/dates';

// Catching up after a long break never creates more than this many records
// per rule.
const MAX_CATCH_UP = 24;

// The rule's day in a given month; the 31st becomes the 30th, 29th or 28th
// in shorter months.
export const occurrenceIn = (year, month, dayOfMonth) =>
  toDateKey(new Date(year, month, Math.min(dayOfMonth, daysInMonth(year, month))));

// First occurrence on or after `fromKey`.
export const firstOccurrence = (dayOfMonth, fromKey) => {
  const from = fromDateKey(fromKey);
  const thisMonth = occurrenceIn(from.getFullYear(), from.getMonth(), dayOfMonth);
  if (thisMonth >= fromKey) return thisMonth;
  return occurrenceIn(from.getFullYear(), from.getMonth() + 1, dayOfMonth);
};

// Next date for a new rule, or for one whose day changed. A changed rule
// stays in the month it was waiting for, so no month is recorded twice.
export const scheduleNext = (dayOfMonth, today, previousNextOn = null) => {
  const waitingMonth = previousNextOn ? `${previousNextOn.slice(0, 7)}-01` : today;
  return firstOccurrence(dayOfMonth, waitingMonth > today ? waitingMonth : today);
};

// Occurrence in the month after `key`, computed from the rule's day so a
// clamped date (28 Feb) returns to the 31st in March.
export const followingOccurrence = (key, dayOfMonth) => {
  const d = fromDateKey(key);
  return occurrenceIn(d.getFullYear(), d.getMonth() + 1, dayOfMonth);
};

// Records that are due by `today`, and each rule's new next date.
export const collectDue = (rules, today) => {
  const transactions = [];
  const updates = [];
  for (const rule of rules) {
    let next = rule.next_on;
    let count = 0;
    while (next && next <= today && count < MAX_CATCH_UP) {
      transactions.push({
        kind: rule.kind,
        amount: rule.amount,
        title: rule.title,
        category_id: rule.category_id || null,
        occurred_on: next,
        recurring_id: rule.id,
      });
      next = followingOccurrence(next, rule.day_of_month);
      count++;
    }
    // After a very long break, skip ahead instead of back-filling forever.
    while (next && next <= today) next = followingOccurrence(next, rule.day_of_month);
    if (next !== rule.next_on) updates.push({ id: rule.id, next_on: next });
  }
  return { transactions, updates };
};

// Rules due within `days` days from `today`, soonest first.
export const upcoming = (rules, today, days = 30) => {
  const limit = addDaysToKey(today, days);
  return rules
    .filter((rule) => rule.next_on && rule.next_on <= limit)
    .sort((a, b) => (a.next_on < b.next_on ? -1 : a.next_on > b.next_on ? 1 : 0));
};
