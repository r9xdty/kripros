// Donut chart with a tappable legend. Small slices beyond the first five are
// merged into "Diğer" so the chart stays readable.
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { formatMoney } from '../../lib/money';
import { colors, spacing } from '../../theme';

const MAX_SLICES = 6;

export const groupSlices = (slices) => {
  if (slices.length <= MAX_SLICES) return slices;
  const head = slices.slice(0, MAX_SLICES - 1);
  const rest = slices.slice(MAX_SLICES - 1);
  const amount = Math.round(rest.reduce((sum, s) => sum + s.amount * 100, 0)) / 100;
  const share = rest.reduce((sum, s) => sum + s.share, 0);
  return [...head, { key: 'others', name: `Diğer (${rest.length})`, color: '#94a3b8', amount, share, count: 0 }];
};

const percent = (share) => {
  const value = share * 100;
  if (value > 0 && value < 1) return '<1%';
  return `%${Math.round(value)}`;
};

export default function DonutChart({ slices, currency, size = 168, thickness = 24, centerLabel = 'Toplam' }) {
  const [selectedKey, setSelectedKey] = useState(null);
  const grouped = useMemo(() => groupSlices(slices), [slices]);
  const total = grouped.reduce((sum, s) => sum + s.amount, 0);
  const selected = grouped.find((s) => s.key === selectedKey) || null;

  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  const gap = grouped.length > 1 ? 2 : 0;
  let offset = 0;

  return (
    <View style={styles.wrapper}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.divider} strokeWidth={thickness} fill="none" />
          {grouped.map((slice) => {
            const length = Math.max(0, slice.share * circumference - gap);
            const dash = `${length} ${circumference - length}`;
            // Circles start drawing at 3 o'clock; shift by a quarter so the
            // first slice starts at 12 o'clock.
            const dashOffset = circumference / 4 - offset;
            offset += slice.share * circumference;
            const dimmed = selected && selected.key !== slice.key;
            return (
              <Circle
                key={slice.key}
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={slice.color}
                strokeWidth={selected?.key === slice.key ? thickness + 4 : thickness}
                strokeDasharray={dash}
                strokeDashoffset={dashOffset}
                fill="none"
                opacity={dimmed ? 0.3 : 1}
              />
            );
          })}
        </Svg>
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          <Text style={styles.centerLabel} numberOfLines={1}>
            {selected ? selected.name : centerLabel}
          </Text>
          <Text style={styles.centerValue} numberOfLines={1} adjustsFontSizeToFit>
            {formatMoney(selected ? selected.amount : total, currency, { whole: true })}
          </Text>
          {selected ? <Text style={styles.centerShare}>{percent(selected.share)}</Text> : null}
        </View>
      </View>

      <View style={styles.legend}>
        {grouped.map((slice) => (
          <Pressable
            key={slice.key}
            onPress={() => setSelectedKey(selectedKey === slice.key ? null : slice.key)}
            style={[styles.legendRow, selectedKey === slice.key && styles.legendRowActive]}
            accessibilityRole="button"
          >
            <View style={[styles.dot, { backgroundColor: slice.color }]} />
            <Text style={styles.legendName} numberOfLines={1}>
              {slice.name}
            </Text>
            <Text style={styles.legendShare}>{percent(slice.share)}</Text>
            <Text style={styles.legendAmount}>{formatMoney(slice.amount, currency, { whole: true })}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  center: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34, pointerEvents: 'none' },
  centerLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  centerValue: { fontSize: 17, fontWeight: '800', color: colors.text, marginTop: 2 },
  centerShare: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  legend: { alignSelf: 'stretch', marginTop: spacing.lg },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
  },
  legendRowActive: { backgroundColor: colors.divider },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendName: { flex: 1, fontSize: 14, color: colors.text },
  legendShare: { fontSize: 13, color: colors.textMuted, width: 44, textAlign: 'right' },
  legendAmount: { fontSize: 14, fontWeight: '700', color: colors.text, minWidth: 90, textAlign: 'right' },
});
