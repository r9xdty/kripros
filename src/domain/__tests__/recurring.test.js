import { collectDue, firstOccurrence, followingOccurrence, occurrenceIn, scheduleNext, upcoming } from '../recurring';

describe('dates of a monthly rule', () => {
  test('the 31st is clamped to the end of shorter months', () => {
    expect(occurrenceIn(2026, 1, 31)).toBe('2026-02-28');
    expect(occurrenceIn(2028, 1, 31)).toBe('2028-02-29');
    expect(occurrenceIn(2026, 3, 31)).toBe('2026-04-30');
    expect(occurrenceIn(2026, 11, 31)).toBe('2026-12-31');
  });

  test('a clamped date returns to the original day the month after', () => {
    expect(followingOccurrence('2026-02-28', 31)).toBe('2026-03-31');
    expect(followingOccurrence('2026-12-15', 15)).toBe('2027-01-15');
  });

  test('the first occurrence is today or later', () => {
    expect(firstOccurrence(24, '2026-09-24')).toBe('2026-09-24');
    expect(firstOccurrence(30, '2026-09-24')).toBe('2026-09-30');
    expect(firstOccurrence(5, '2026-09-24')).toBe('2026-10-05');
    expect(firstOccurrence(31, '2026-02-10')).toBe('2026-02-28');
  });

  test('changing the day never records a month twice', () => {
    // New rule: starts today or later.
    expect(scheduleNext(24, '2026-09-24')).toBe('2026-09-24');
    // September was already recorded (the rule waits for 5 October).
    expect(scheduleNext(24, '2026-09-24', '2026-10-05')).toBe('2026-10-24');
    // September is still pending: a later day stays in September…
    expect(scheduleNext(26, '2026-09-24', '2026-09-30')).toBe('2026-09-26');
    // …an earlier one moves to October instead of back-dating.
    expect(scheduleNext(10, '2026-09-24', '2026-09-30')).toBe('2026-10-10');
  });
});

describe('collectDue', () => {
  const rent = { id: 'rent', kind: 'spending', amount: 15000, title: 'Kira', category_id: 'home', day_of_month: 5, next_on: '2026-09-05' };

  test('creates the records that are due and moves the rule on', () => {
    const { transactions, updates } = collectDue([rent], '2026-09-24');
    expect(transactions).toEqual([
      { kind: 'spending', amount: 15000, title: 'Kira', category_id: 'home', occurred_on: '2026-09-05', recurring_id: 'rent' },
    ]);
    expect(updates).toEqual([{ id: 'rent', next_on: '2026-10-05' }]);
  });

  test('catches up on months missed while the app was closed', () => {
    const { transactions, updates } = collectDue([rent], '2026-12-06');
    expect(transactions.map((t) => t.occurred_on)).toEqual(['2026-09-05', '2026-10-05', '2026-11-05', '2026-12-05']);
    expect(updates[0].next_on).toBe('2027-01-05');
  });

  test('a rule that is not due yet is left alone', () => {
    expect(collectDue([{ ...rent, next_on: '2026-10-05' }], '2026-09-24')).toEqual({ transactions: [], updates: [] });
  });

  test('after a very long break it stops back-filling but still moves on', () => {
    const { transactions, updates } = collectDue([{ ...rent, next_on: '2020-01-05' }], '2026-09-24');
    expect(transactions).toHaveLength(24);
    expect(updates[0].next_on).toBe('2026-10-05');
  });

  test('upcoming lists the rules due soon, soonest first', () => {
    const rules = [
      { id: 'a', next_on: '2026-10-20' },
      { id: 'b', next_on: '2026-09-30' },
      { id: 'c', next_on: '2026-12-01' },
    ];
    expect(upcoming(rules, '2026-09-24').map((r) => r.id)).toEqual(['b', 'a']);
  });
});
