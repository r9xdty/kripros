// Day picker without native dependencies: step through days or jump to
// today / yesterday. Future days are not allowed.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from './Icon';
import { addDaysToKey, formatDayLong, todayKey } from '../lib/dates';
import { colors, radius, spacing, font } from '../theme';

export default function DateField({ value, onChange, label = 'Tarih' }) {
  const today = todayKey();
  const yesterday = addDaysToKey(today, -1);
  const canGoForward = value < today;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Pressable onPress={() => onChange(addDaysToKey(value, -1))} style={styles.step} hitSlop={6} accessibilityLabel="Önceki gün">
          <Icon name="chevron-back" size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.value} numberOfLines={1}>
          {formatDayLong(value)}
        </Text>
        <Pressable
          onPress={() => canGoForward && onChange(addDaysToKey(value, 1))}
          style={[styles.step, !canGoForward && { opacity: 0.3 }]}
          disabled={!canGoForward}
          hitSlop={6}
          accessibilityLabel="Sonraki gün"
        >
          <Icon name="chevron-forward" size={20} color={colors.text} />
        </Pressable>
      </View>
      <View style={styles.quick}>
        {[
          [today, 'Bugün'],
          [yesterday, 'Dün'],
        ].map(([key, text]) => (
          <Pressable key={key} onPress={() => onChange(key)} style={[styles.quickChip, value === key && styles.quickChipActive]}>
            <Text style={[styles.quickText, value === key && styles.quickTextActive]}>{text}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  label: { ...font.label, marginBottom: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },
  step: { padding: spacing.md },
  value: { flex: 1, textAlign: 'center', fontSize: 15, fontWeight: '600', color: colors.text },
  quick: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.divider,
  },
  quickChipActive: { backgroundColor: colors.text },
  quickText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  quickTextActive: { color: '#fff' },
});
