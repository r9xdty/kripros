import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SheetLayout from '../components/SheetLayout';
import { Button, Card, Chip, EmptyState, Field, IconButton, IconCircle, Segmented } from '../components/ui';
import { useData } from '../state/DataContext';
import { useToast } from '../components/Toast';
import { KINDS } from '../domain/constants';
import { scheduleNext } from '../domain/recurring';
import { MAX_AMOUNT, amountToInput, formatMoney, parseAmount } from '../lib/money';
import { formatRelativeDay, todayKey } from '../lib/dates';
import { confirm } from '../lib/dialogs';
import { colors, font, radius, spacing } from '../theme';

const QUICK_DAYS = [1, 5, 10, 15, 20, 25];
const PLACEHOLDERS = { spending: 'Örn: Kira, internet faturası', income: 'Örn: Maaş' };

const emptyForm = (kind = 'spending') => ({ id: null, kind, title: '', amount: '', categoryId: null, day: new Date().getDate() });

export const describeDay = (day) => `Her ayın ${day}. günü`;

export default function RecurringSheet() {
  const data = useData();
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const today = todayKey();
  const categories = useMemo(() => data.categories.filter((c) => c.kind === form.kind), [data.categories, form.kind]);
  const color = KINDS[form.kind].color;

  const update = (patch) => {
    setForm((f) => ({ ...f, ...patch }));
    setError(null);
  };
  const stepDay = (delta) => update({ day: ((form.day - 1 + delta + 31) % 31) + 1 });

  // An edited rule keeps its date unless its day changes.
  const existing = form.id ? data.recurring.find((r) => r.id === form.id) : null;
  const nextOn = existing && existing.day_of_month === form.day ? existing.next_on : scheduleNext(form.day, today, existing?.next_on);

  const save = () => {
    const amount = parseAmount(form.amount);
    if (!form.title.trim()) return setError('Bir açıklama yaz.');
    if (!(amount > 0) || amount > MAX_AMOUNT) return setError('Geçerli bir tutar gir.');
    data.saveRecurring({
      ...(form.id ? { id: form.id } : {}),
      kind: form.kind,
      title: form.title,
      amount,
      category_id: form.categoryId && data.categoriesById[form.categoryId]?.kind === form.kind ? form.categoryId : null,
      day_of_month: form.day,
    });
    toast(
      nextOn === today
        ? `${form.title.trim()} bugün için eklendi`
        : form.id
          ? 'Düzenli işlem güncellendi'
          : 'Düzenli işlem eklendi',
    );
    setForm(emptyForm(form.kind));
    return undefined;
  };

  const edit = (rule) => {
    setForm({ id: rule.id, kind: rule.kind, title: rule.title, amount: amountToInput(rule.amount), categoryId: rule.category_id, day: rule.day_of_month });
    setError(null);
  };

  const remove = async (rule) => {
    const ok = await confirm({
      title: 'Düzenli işlemi sil',
      message: `"${rule.title}" artık eklenmeyecek. Daha önce eklenen kayıtlar geçmişte kalır.`,
      confirmText: 'Sil',
      destructive: true,
    });
    if (!ok) return;
    data.deleteRecurring(rule.id);
    if (form.id === rule.id) setForm(emptyForm(form.kind));
  };

  return (
    <SheetLayout title="Düzenli işlemler">
      <Text style={styles.intro}>
        Maaş, kira, abonelik gibi her ay tekrarlanan gelir ve harcamaları bir kez tanımla; günü geldiğinde kayıt kendiliğinden
        eklenir.
      </Text>

      <Card style={{ marginBottom: spacing.xl }}>
        <Text style={[font.heading, { marginBottom: spacing.md }]}>{form.id ? 'Düzenli işlemi düzenle' : 'Yeni düzenli işlem'}</Text>
        <Segmented
          value={form.kind}
          onChange={(kind) => update({ kind, categoryId: null })}
          options={['spending', 'income'].map((value) => ({ value, label: KINDS[value].label, color: KINDS[value].color }))}
          style={{ marginBottom: spacing.lg }}
        />
        <Field label="Açıklama" value={form.title} onChangeText={(title) => update({ title })} placeholder={PLACEHOLDERS[form.kind]} maxLength={80} />
        <Field
          label="Tutar"
          value={form.amount}
          onChangeText={(amount) => update({ amount })}
          placeholder="Örn: 15.000"
          keyboardType="decimal-pad"
          maxLength={16}
        />

        {categories.length ? (
          <>
            <Text style={styles.label}>Kategori (isteğe bağlı)</Text>
            <View style={[styles.chips, { marginBottom: spacing.lg }]}>
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  icon={category.icon}
                  color={category.color}
                  selected={form.categoryId === category.id}
                  onPress={() => update({ categoryId: form.categoryId === category.id ? null : category.id })}
                />
              ))}
            </View>
          </>
        ) : null}

        <Text style={styles.label}>Ayın kaçında?</Text>
        <View style={styles.dayRow}>
          <IconButton icon="remove" label="Bir gün önce" onPress={() => stepDay(-1)} style={styles.stepper} />
          <View style={styles.dayValue}>
            <Text style={[styles.dayNumber, { color }]}>{form.day}</Text>
            <Text style={font.small}>{describeDay(form.day)}</Text>
          </View>
          <IconButton icon="add" label="Bir gün sonra" onPress={() => stepDay(1)} style={styles.stepper} />
        </View>
        <View style={[styles.chips, { marginTop: spacing.sm }]}>
          {QUICK_DAYS.map((day) => (
            <Chip key={day} label={String(day)} color={color} selected={form.day === day} onPress={() => update({ day })} style={styles.dayChip} />
          ))}
        </View>
        <Text style={[font.small, styles.preview]}>
          {nextOn === today ? 'İlk kayıt bugün eklenecek.' : `${form.id ? 'Sonraki' : 'İlk'} kayıt: ${formatRelativeDay(nextOn)}`}
          {form.day > 28 ? ' Kısa aylarda ayın son günü kullanılır.' : ''}
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.formActions}>
          {form.id ? <Button title="Vazgeç" variant="secondary" onPress={() => setForm(emptyForm(form.kind))} style={{ flex: 1 }} /> : null}
          <Button title={form.id ? 'Güncelle' : 'Ekle'} icon="checkmark" onPress={save} style={{ flex: 1 }} color={color} />
        </View>
      </Card>

      {data.recurring.length ? (
        <Card>
          {data.recurring.map((rule) => {
            const category = rule.category_id ? data.categoriesById[rule.category_id] : null;
            const kind = KINDS[rule.kind];
            return (
              <View key={rule.id} style={styles.row}>
                <IconCircle icon={category?.icon || 'repeat'} color={category?.color || kind.color} size={36} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.name} numberOfLines={1}>
                    {rule.title}
                  </Text>
                  <Text style={font.small} numberOfLines={1}>
                    <Text style={{ color: kind.color, fontWeight: '700' }}>
                      {kind.sign}
                      {formatMoney(rule.amount, data.currency, { whole: true })}
                    </Text>
                    {` · ${describeDay(rule.day_of_month)}`}
                  </Text>
                  <Text style={font.small}>Sonraki: {formatRelativeDay(rule.next_on)}</Text>
                </View>
                <IconButton icon="create-outline" color={colors.textMuted} label="Düzenle" onPress={() => edit(rule)} />
                <IconButton icon="trash-outline" color={colors.danger} label="Sil" onPress={() => remove(rule)} />
              </View>
            );
          })}
        </Card>
      ) : (
        <EmptyState icon="repeat" title="Henüz düzenli işlem yok" message="Yukarıdan maaşını ya da kiranı ekleyerek başlayabilirsin." />
      )}
    </SheetLayout>
  );
}

const styles = StyleSheet.create({
  intro: { ...font.small, fontSize: 14, lineHeight: 20, marginBottom: spacing.lg },
  label: { ...font.label, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  stepper: { backgroundColor: colors.divider, padding: 10 },
  dayValue: { flex: 1, alignItems: 'center' },
  dayNumber: { fontSize: 28, fontWeight: '800' },
  dayChip: { minWidth: 44, justifyContent: 'center' },
  preview: { marginTop: spacing.md, lineHeight: 18 },
  error: { color: colors.danger, marginTop: spacing.md },
  formActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  name: { fontSize: 15, fontWeight: '600', color: colors.text },
});
