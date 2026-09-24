import { cleanTransaction, validateTransaction } from '../transactions';
import { addDaysToKey, todayKey } from '../../lib/dates';

const base = { kind: 'spending', amount: 10, occurred_on: todayKey() };

describe('validateTransaction', () => {
  test('accepts a normal record', () => {
    expect(validateTransaction(base)).toBeNull();
  });

  test.each([
    [{ kind: 'gift' }, 'İşlem türü seçin.'],
    [{ amount: NaN }, 'Geçerli bir tutar girin.'],
    [{ amount: 0 }, 'Geçerli bir tutar girin.'],
    [{ amount: 1e11 }, 'Tutar çok büyük.'],
    [{ occurred_on: '' }, 'Tarih seçin.'],
    [{ occurred_on: addDaysToKey(todayKey(), 1) }, 'Gelecek bir tarihe kayıt eklenemez.'],
    [{ title: 'x'.repeat(81) }, 'Açıklama en fazla 80 karakter olabilir.'],
  ])('rejects %j', (patch, message) => {
    expect(validateTransaction({ ...base, ...patch })).toBe(message);
  });
});

describe('cleanTransaction', () => {
  test('keeps only the links that fit the kind', () => {
    const links = { category_id: 'c', template_id: 't', goal_id: 'g' };
    expect(cleanTransaction({ ...base, ...links })).toMatchObject({ category_id: 'c', template_id: null, goal_id: null });
    expect(cleanTransaction({ ...base, kind: 'saving', ...links })).toMatchObject({ category_id: null, template_id: 't', goal_id: 'g' });
  });

  test('trims text and rounds the amount', () => {
    expect(cleanTransaction({ ...base, amount: 10.005, title: '  Market ', note: '   ' })).toMatchObject({
      amount: 10.01,
      title: 'Market',
      note: null,
    });
  });
});
