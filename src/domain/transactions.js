import { MAX_AMOUNT } from '../lib/money';
import { todayKey } from '../lib/dates';

// Returns an error message in Turkish, or null when the transaction is valid.
export const validateTransaction = (values) => {
  if (!['income', 'spending', 'saving'].includes(values.kind)) return 'İşlem türü seçin.';
  if (!(values.amount > 0)) return 'Geçerli bir tutar girin.';
  if (values.amount > MAX_AMOUNT) return 'Tutar çok büyük.';
  if (!values.occurred_on) return 'Tarih seçin.';
  if (values.occurred_on > todayKey()) return 'Gelecek bir tarihe kayıt eklenemez.';
  if ((values.title || '').length > 80) return 'Açıklama en fazla 80 karakter olabilir.';
  if ((values.note || '').length > 500) return 'Not en fazla 500 karakter olabilir.';
  return null;
};

export const cleanTransaction = (values) => {
  const saving = values.kind === 'saving';
  return {
    ...values,
    amount: Math.round(Number(values.amount) * 100) / 100,
    title: (values.title || '').trim(),
    note: values.note?.trim() ? values.note.trim() : null,
    category_id: saving ? null : values.category_id || null,
    template_id: saving ? values.template_id || null : null,
    goal_id: saving ? values.goal_id || null : null,
  };
};
