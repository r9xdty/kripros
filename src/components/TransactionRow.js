import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IconCircle } from './ui';
import { KINDS } from '../domain/constants';
import { formatMoney } from '../lib/money';
import { formatRelativeDay } from '../lib/dates';
import { colors, spacing } from '../theme';

// Describes a transaction for lists: which icon/colour to show and the
// secondary line (category, habit or goal).
export const describeTransaction = (tx, lookups) => {
  const info = describeBase(tx, lookups);
  return tx.recurring_id ? { ...info, subtitle: `${info.subtitle} · Düzenli` } : info;
};

const describeBase = (tx, { categoriesById = {}, templatesById = {}, goalsById = {} }) => {
  const kind = KINDS[tx.kind];
  if (tx.kind === 'saving') {
    const goal = tx.goal_id ? goalsById[tx.goal_id] : null;
    const template = tx.template_id ? templatesById[tx.template_id] : null;
    return {
      title: tx.title || template?.name || goal?.name || kind.label,
      subtitle: goal ? `Hedef: ${goal.name}` : template ? 'Birikim alışkanlığı' : kind.label,
      icon: goal?.icon || 'leaf',
      color: goal?.color || kind.color,
    };
  }
  const category = tx.category_id ? categoriesById[tx.category_id] : null;
  const title = tx.title || category?.name || kind.label;
  return {
    title,
    subtitle: category ? (category.name === title ? kind.label : category.name) : `${kind.label} · Kategorisiz`,
    icon: category?.icon || kind.icon,
    color: category?.color || kind.color,
  };
};

export default function TransactionRow({ tx, lookups, currency, onPress, showDate = false }) {
  const info = describeTransaction(tx, lookups);
  const kind = KINDS[tx.kind];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
      accessibilityRole="button"
      accessibilityLabel={`${info.title}, ${kind.label}, ${formatMoney(tx.amount, currency)}`}
    >
      <IconCircle icon={info.icon} color={info.color} size={40} />
      <View style={styles.middle}>
        <Text style={styles.title} numberOfLines={1}>
          {info.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {showDate ? `${formatRelativeDay(tx.occurred_on)} · ${info.subtitle}` : info.subtitle}
        </Text>
      </View>
      <Text style={[styles.amount, { color: tx.kind === 'spending' ? colors.spending : kind.color }]}>
        {kind.sign}
        {formatMoney(tx.amount, currency)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm + 2, gap: spacing.md },
  middle: { flex: 1, minWidth: 0 },
  title: { fontSize: 15, fontWeight: '600', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  amount: { fontSize: 15, fontWeight: '700' },
});
