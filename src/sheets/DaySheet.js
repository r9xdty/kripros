import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SheetLayout from '../components/SheetLayout';
import TransactionRow from '../components/TransactionRow';
import { Button, Card, Chip, EmptyState, SectionHeader } from '../components/ui';
import { useData } from '../state/DataContext';
import { useSheets } from '../navigation/sheets';
import { KINDS, KIND_ORDER } from '../domain/constants';
import { totalsInRange } from '../domain/stats';
import { recommendTemplates } from '../domain/recommendations';
import { formatDayLong } from '../lib/dates';
import { formatMoney } from '../lib/money';
import { colors, spacing } from '../theme';

export default function DaySheet({ date }) {
  const data = useData();
  const { push } = useSheets();
  const items = useMemo(() => data.transactions.filter((tx) => tx.occurred_on === date), [data.transactions, date]);
  const totals = useMemo(() => totalsInRange(items), [items]);
  const suggestions = useMemo(
    () => recommendTemplates(data.templates, data.transactions, date, { limit: 4 }),
    [data.templates, data.transactions, date],
  );

  const quickAdd = (template) =>
    data.saveTransaction({
      kind: 'saving',
      amount: template.amount,
      title: template.name,
      template_id: template.id,
      occurred_on: date,
    });

  return (
    <SheetLayout title={formatDayLong(date)}>
      <View style={styles.totals}>
        {KIND_ORDER.map((kind) => (
          <View key={kind} style={[styles.total, { backgroundColor: KINDS[kind].soft }]}>
            <Text style={styles.totalLabel}>{KINDS[kind].label}</Text>
            <Text style={[styles.totalValue, { color: KINDS[kind].color }]} numberOfLines={1} adjustsFontSizeToFit>
              {formatMoney(totals[kind], data.currency, { whole: true })}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        {KIND_ORDER.map((kind) => (
          <Button
            key={kind}
            title={KINDS[kind].label}
            icon="add"
            compact
            color={KINDS[kind].color}
            style={styles.action}
            onPress={() => push('transaction', { kind, date })}
          />
        ))}
      </View>

      {suggestions.length ? (
        <Card style={styles.card}>
          <SectionHeader title="Hızlı birikim ekle" />
          <View style={styles.chips}>
            {suggestions.map(({ template }) => (
              <Chip
                key={template.id}
                icon="add-circle"
                color={colors.saving}
                label={`${template.name} · ${formatMoney(template.amount, data.currency, { whole: true })}`}
                onPress={() => quickAdd(template)}
              />
            ))}
          </View>
        </Card>
      ) : null}

      <Card style={styles.card}>
        <SectionHeader title="Bu günün kayıtları" />
        {items.length ? (
          items.map((tx) => (
            <TransactionRow
              key={tx.id}
              tx={tx}
              lookups={data}
              currency={data.currency}
              onPress={() => push('transaction', { transaction: tx })}
            />
          ))
        ) : (
          <EmptyState icon="calendar-clear" title="Bu güne ait kayıt yok" message="Yukarıdaki düğmelerle harcama, gelir ya da birikim ekleyebilirsin." />
        )}
      </Card>
    </SheetLayout>
  );
}

const styles = StyleSheet.create({
  totals: { flexDirection: 'row', gap: spacing.sm },
  total: { flex: 1, borderRadius: 12, padding: spacing.md },
  totalLabel: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  totalValue: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  action: { flex: 1 },
  card: { marginTop: spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
